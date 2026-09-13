import json
import logging

import stripe
from fastapi import APIRouter, Header, HTTPException, Request, status
from sqlalchemy import select, text
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.db.base import async_session_factory
from app.email.order_confirmation import OrderConfirmationItem, send_order_confirmation_email
from app.models.order import Order
from app.models.order_item import OrderItem

router = APIRouter(prefix="/api/webhooks", tags=["webhooks"])
logger = logging.getLogger(__name__)


@router.post("/stripe")
async def stripe_webhook(request: Request, stripe_signature: str | None = Header(default=None)):
    if not stripe_signature:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Missing signature")

    # 署名検証には生のリクエストボディが必須（JSON.parse済みのものは使えない）
    raw_body = await request.body()
    try:
        event = stripe.Webhook.construct_event(
            raw_body, stripe_signature, settings.stripe_webhook_secret
        )
    except (stripe.SignatureVerificationError, ValueError):
        logger.exception("Stripe webhook signature verification failed")
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signature")

    if event["type"] != "checkout.session.completed":
        return {"received": True}

    session = event["data"]["object"]

    async with async_session_factory() as db:
        # 冪等性の担保: Stripeはwebhookを再送することがあるため、
        # 同じセッションを二重に処理して在庫を余分に減らさないようにする
        existing = await db.scalar(
            select(Order.id).where(Order.stripe_checkout_session_id == session["id"])
        )
        if existing:
            return {"received": True, "alreadyProcessed": True}

        try:
            items = json.loads(session.get("metadata", {}).get("items") or "[]")
        except json.JSONDecodeError:
            logger.exception("Failed to parse checkout session items metadata: %s", session["id"])
            items = []

        customer_id_raw = session.get("metadata", {}).get("customerId")
        customer_id = customer_id_raw if customer_id_raw else None
        payment_intent = session.get("payment_intent")
        payment_intent_id = (
            payment_intent if isinstance(payment_intent, str) else (payment_intent or {}).get("id")
        )

        order = Order(
            customer_id=customer_id,
            stripe_checkout_session_id=session["id"],
            stripe_payment_intent_id=payment_intent_id,
            customer_email=(session.get("customer_details") or {}).get("email"),
            total_amount=session.get("amount_total") or 0,
            status="paid",
        )
        db.add(order)
        await db.flush()  # order.idを確定させる（まだcommitはしない）

        if items:
            for item in items:
                db.add(
                    OrderItem(
                        order_id=order.id,
                        product_id=item["id"],
                        product_name=item["n"],
                        unit_price=item["p"],
                        quantity=item["q"],
                    )
                )
                # 在庫は0未満にならないようクランプする（決済は既に完了しているため、
                # 万一の競合で不足していても失敗させず、0で止める）
                await db.execute(
                    text(
                        "UPDATE products SET stock_quantity = GREATEST(stock_quantity - :qty, 0) "
                        "WHERE id = :product_id"
                    ),
                    {"qty": item["q"], "product_id": item["id"]},
                )

        await db.commit()
        await db.refresh(order)

        if order.customer_email:
            # メール送信の失敗で注文処理そのものを失敗扱いにしない
            # （200を返さないとStripeが再送し、この分岐に到達しないまま
            # メールが永久に送れなくなる）
            try:
                await send_order_confirmation_email(
                    to_email=order.customer_email,
                    order_id=str(order.id),
                    items=[
                        OrderConfirmationItem(name=i["n"], unit_price=i["p"], quantity=i["q"])
                        for i in items
                    ],
                    total_amount=order.total_amount,
                    order_date=order.created_at,
                )
            except Exception:
                logger.exception("Failed to send order confirmation email for order %s", order.id)

    return {"received": True}
