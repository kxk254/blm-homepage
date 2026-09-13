from datetime import date as date_type
from datetime import datetime, time, timedelta, timezone
from uuid import UUID
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy import and_, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import selectinload

from app.core.security import SessionUser, get_current_admin
from app.db.base import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.order import OrderOut, RefundOrderRequest, UpdateOrderStatusRequest

router = APIRouter(prefix="/api/admin/orders", tags=["admin-orders"])

VALID_STATUSES = {"paid", "shipped", "cancelled", "refunded"}
JST = ZoneInfo("Asia/Tokyo")


@router.get("", response_model=list[OrderOut])
async def list_orders(
    customer_name: str | None = Query(default=None, description="お客様のお名前で部分一致検索"),
    product_id: str | None = Query(default=None, description="商品番号で部分一致検索"),
    date: date_type | None = Query(default=None, description="注文日(JST)で絞り込み"),
    stripe_id: str | None = Query(
        default=None, description="Stripeの決済セッションID/支払いIDで部分一致検索"
    ),
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    query = select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc())

    conditions = []
    if stripe_id:
        conditions.append(
            or_(
                Order.stripe_checkout_session_id.ilike(f"%{stripe_id}%"),
                Order.stripe_payment_intent_id.ilike(f"%{stripe_id}%"),
            )
        )
    if date:
        # 問い合わせ対応は基本JSTで話すため、その日のJST 00:00〜24:00をUTC範囲に変換する
        day_start = datetime.combine(date, time.min, tzinfo=JST)
        day_end = day_start + timedelta(days=1)
        conditions.append(and_(Order.created_at >= day_start, Order.created_at < day_end))
    if product_id:
        conditions.append(
            Order.id.in_(
                select(OrderItem.order_id).where(OrderItem.product_id.ilike(f"%{product_id}%"))
            )
        )
    if customer_name:
        conditions.append(
            Order.customer_id.in_(
                select(Customer.id).where(Customer.full_name.ilike(f"%{customer_name}%"))
            )
        )

    if conditions:
        query = query.where(and_(*conditions))

    result = await db.execute(query)
    return result.scalars().all()


@router.patch("/{order_id}", response_model=OrderOut)
async def update_order_status(
    order_id: UUID,
    body: UpdateOrderStatusRequest,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    if body.status not in VALID_STATUSES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不正なステータスです")

    order = await db.get(Order, order_id, options=[selectinload(Order.items)])
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="注文が見つかりません")
    order.status = body.status
    await db.commit()
    await db.refresh(order)
    return order


@router.post("/{order_id}/refund", response_model=OrderOut)
async def refund_order(
    order_id: UUID,
    body: RefundOrderRequest,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    """返品・返金の記録を残す(簡易な内部記録。実際の決済上の返金はStripe側で行う)。"""
    order = await db.get(Order, order_id, options=[selectinload(Order.items)])
    if not order:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="注文が見つかりません")

    order.refunded_at = datetime.now(timezone.utc)
    order.refund_amount = body.refund_amount
    order.refund_reason = body.refund_reason
    order.status = "refunded"
    await db.commit()
    await db.refresh(order)
    return order
