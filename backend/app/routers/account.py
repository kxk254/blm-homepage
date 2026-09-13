from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.orm import selectinload
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import SessionUser, get_current_user
from app.db.base import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.models.order_item import OrderItem
from app.schemas.auth import MeResponse
from app.schemas.common import CamelModel
from app.schemas.order import OrderOut

router = APIRouter(prefix="/api/account", tags=["account"])


class AccountResponse(CamelModel):
    customer: MeResponse
    orders: list[OrderOut]


@router.get("", response_model=AccountResponse)
async def get_account(
    user: SessionUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    customer = await db.get(Customer, user.id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="ログインが必要です")

    result = await db.execute(
        select(Order)
        .where(Order.customer_id == user.id)
        .options(selectinload(Order.items))
        .order_by(Order.created_at.desc())
    )
    orders = result.scalars().all()

    return AccountResponse(customer=MeResponse.model_validate(customer), orders=orders)
