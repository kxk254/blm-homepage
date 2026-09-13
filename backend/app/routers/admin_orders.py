from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import SessionUser, get_current_admin
from app.db.base import get_db
from app.models.order import Order
from app.schemas.order import OrderOut, UpdateOrderStatusRequest

router = APIRouter(prefix="/api/admin/orders", tags=["admin-orders"])

VALID_STATUSES = {"paid", "shipped", "cancelled", "refunded"}


@router.get("", response_model=list[OrderOut])
async def list_orders(
    _admin: SessionUser = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Order).options(selectinload(Order.items)).order_by(Order.created_at.desc())
    )
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
