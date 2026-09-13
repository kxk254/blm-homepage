from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import SessionUser, get_current_admin
from app.db.base import get_db
from app.models.customer import Customer
from app.models.order import Order
from app.schemas.customer import AdminCustomerOut

router = APIRouter(prefix="/api/admin/customers", tags=["admin-customers"])


@router.get("", response_model=list[AdminCustomerOut])
async def list_customers(
    _admin: SessionUser = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    order_counts_subq = (
        select(Order.customer_id, func.count().label("order_count"))
        .where(Order.customer_id.is_not(None))
        .group_by(Order.customer_id)
        .subquery()
    )

    result = await db.execute(
        select(Customer, func.coalesce(order_counts_subq.c.order_count, 0))
        .outerjoin(order_counts_subq, Customer.id == order_counts_subq.c.customer_id)
        .order_by(Customer.created_at.desc())
    )

    return [
        AdminCustomerOut(
            id=customer.id,
            email=customer.email,
            full_name=customer.full_name,
            phone=customer.phone,
            postal_code=customer.postal_code,
            address=customer.address,
            created_at=customer.created_at,
            order_count=order_count,
        )
        for customer, order_count in result.all()
    ]
