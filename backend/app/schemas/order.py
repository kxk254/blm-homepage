from datetime import datetime
from uuid import UUID

from pydantic import BaseModel

from app.schemas.common import CamelModel


class OrderItemOut(CamelModel):
    id: UUID
    order_id: UUID
    product_id: str | None
    product_name: str
    unit_price: int
    quantity: int


class OrderOut(CamelModel):
    id: UUID
    customer_id: UUID | None
    stripe_checkout_session_id: str
    stripe_payment_intent_id: str | None
    customer_email: str | None
    total_amount: int
    status: str
    created_at: datetime
    items: list[OrderItemOut] = []


class UpdateOrderStatusRequest(BaseModel):
    status: str
