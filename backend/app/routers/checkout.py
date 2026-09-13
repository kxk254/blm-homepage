import json
from typing import Any

import stripe
from fastapi import APIRouter, Depends
from fastapi.responses import JSONResponse
from pydantic import BaseModel
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.core.security import SessionUser, get_optional_user
from app.db.base import get_db
from app.models.customer import Customer
from app.models.product import Product

router = APIRouter(prefix="/api/checkout", tags=["checkout"])

stripe.api_key = settings.stripe_secret_key


class CheckoutItem(BaseModel):
    id: str
    quantity: int


class CheckoutRequest(BaseModel):
    items: list[CheckoutItem]


@router.post("")
async def create_checkout_session(
    body: CheckoutRequest,
    user: SessionUser | None = Depends(get_optional_user),
    db: AsyncSession = Depends(get_db),
):
    # ゲスト購入は許可しない（注文を必ず会員アカウントに紐づけるため）
    if user is None:
        return JSONResponse(
            status_code=401,
            content={"error": "ご購入にはログインが必要です", "requiresLogin": True},
        )
    customer = await db.get(Customer, user.id)
    if not customer:
        return JSONResponse(
            status_code=401,
            content={"error": "ご購入にはログインが必要です", "requiresLogin": True},
        )

    if not body.items:
        return JSONResponse(status_code=400, content={"error": "カートが空です"})

    line_items: list[dict[str, Any]] = []
    # Webhook側で追加のStripe API呼び出しをせずに済むよう、購入内容そのものを
    # セッションのmetadataに載せる。Stripeのmetadata値は1項目500文字までのため
    # キー名を短くしている（大量点数のカートは想定していない）
    purchased_items: list[dict[str, Any]] = []

    for requested in body.items:
        product = await db.get(Product, requested.id)
        if not product:
            return JSONResponse(
                status_code=400, content={"error": f"不明な商品IDです: {requested.id}"}
            )

        safe_quantity = min(max(int(requested.quantity) or 1, 1), 10)
        if product.stock_quantity < safe_quantity:
            return JSONResponse(
                status_code=400,
                content={"error": f"在庫が不足しています: {product.product_name}"},
            )

        image_url = (
            product.image_src
            if product.image_src.startswith("http")
            else f"{settings.site_url}{product.image_src}"
        )
        line_items.append(
            {
                "quantity": safe_quantity,
                "price_data": {
                    "currency": "jpy",
                    "unit_amount": product.product_price,
                    "product_data": {
                        "name": product.product_name,
                        "description": f"{product.product_type}（{product.product_color}）",
                        "images": [image_url],
                    },
                },
            }
        )
        purchased_items.append(
            {
                "id": product.id,
                "n": product.product_name,
                "p": product.product_price,
                "q": safe_quantity,
            }
        )

    try:
        session = stripe.checkout.Session.create(
            mode="payment",
            line_items=line_items,
            shipping_address_collection={"allowed_countries": ["JP"]},
            phone_number_collection={"enabled": True},
            customer_email=customer.email,
            metadata={
                "customerId": str(customer.id),
                "items": json.dumps(purchased_items, ensure_ascii=False),
            },
            # TODO: 実際の送料ポリシーに合わせて金額を調整してください（現在は仮で全国一律300円）
            shipping_options=[
                {
                    "shipping_rate_data": {
                        "type": "fixed_amount",
                        "fixed_amount": {"amount": 300, "currency": "jpy"},
                        "display_name": "全国一律送料",
                        "delivery_estimate": {
                            "minimum": {"unit": "business_day", "value": 3},
                            "maximum": {"unit": "business_day", "value": 7},
                        },
                    }
                }
            ],
            locale="ja",
            success_url=f"{settings.site_url}/checkout/success?session_id={{CHECKOUT_SESSION_ID}}",
            cancel_url=f"{settings.site_url}/cart",
        )
    except stripe.StripeError as err:
        return JSONResponse(status_code=500, content={"error": "決済セッションの作成に失敗しました"})

    if not session.url:
        return JSONResponse(status_code=500, content={"error": "決済セッションの作成に失敗しました"})

    return {"url": session.url}


@router.get("/session/{session_id}")
async def get_checkout_session(session_id: str):
    """決済完了ページで、確認メール送信先を表示するためだけに使う軽量エンドポイント。"""
    try:
        session = stripe.checkout.Session.retrieve(session_id)
    except stripe.StripeError:
        return {"customerEmail": None}
    customer_details = session.get("customer_details") or {}
    return {"customerEmail": customer_details.get("email")}
