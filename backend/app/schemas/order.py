from datetime import datetime
from uuid import UUID

from pydantic import BaseModel, Field

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
    shipping_name: str | None
    shipping_phone: str | None
    shipping_postal_code: str | None
    shipping_address: str | None
    total_amount: int
    status: str
    created_at: datetime
    refunded_at: datetime | None
    refund_amount: int | None
    refund_reason: str | None
    items: list[OrderItemOut] = []


class UpdateOrderStatusRequest(BaseModel):
    status: str


class RefundOrderRequest(BaseModel):
    # 全額返金ならStripe側の合計金額をそのまま渡す想定。一部返金にも対応できるよう
    # 金額は都度指定してもらう(自動計算はしない)
    refund_amount: int = Field(ge=0)
    refund_reason: str = Field(min_length=1)
