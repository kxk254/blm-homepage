import uuid
from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.base import Base
from app.models.order_item import OrderItem


# Stripeのcheckout.session.completed Webhookから作成される注文record。
# customer_idはゲスト購入も許容するためnull可
class Order(Base):
    __tablename__ = "orders"

    id: Mapped[uuid.UUID] = mapped_column(
        UUID(as_uuid=True), primary_key=True, server_default=func.gen_random_uuid()
    )
    customer_id: Mapped[uuid.UUID | None] = mapped_column(
        UUID(as_uuid=True), ForeignKey("customers.id", ondelete="SET NULL"), nullable=True
    )
    stripe_checkout_session_id: Mapped[str] = mapped_column(
        String(255), nullable=False, unique=True
    )
    stripe_payment_intent_id: Mapped[str | None] = mapped_column(String(255), nullable=True)
    customer_email: Mapped[str | None] = mapped_column(String(255), nullable=True)
    # 発送先のスナップショット。Stripe Checkoutが決済時に集めたものをそのまま保存する。
    # customerテーブルの現在値ではなく「注文当時どこ宛だったか」を必ず残すため
    shipping_name: Mapped[str | None] = mapped_column(String(200), nullable=True)
    shipping_phone: Mapped[str | None] = mapped_column(String(50), nullable=True)
    shipping_postal_code: Mapped[str | None] = mapped_column(String(20), nullable=True)
    shipping_address: Mapped[str | None] = mapped_column(Text, nullable=True)
    total_amount: Mapped[int] = mapped_column(Integer, nullable=False)
    status: Mapped[str] = mapped_column(String(30), nullable=False, default="paid")
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
    # 返品・返金の記録(問い合わせ対応用)。全額/一部を問わずまとめて1件だけ持つ
    # 簡易な記録で、詳細な決済上の返金処理自体はStripe側が正とする
    refunded_at: Mapped[datetime | None] = mapped_column(DateTime(timezone=True), nullable=True)
    refund_amount: Mapped[int | None] = mapped_column(Integer, nullable=True)
    refund_reason: Mapped[str | None] = mapped_column(Text, nullable=True)

    items: Mapped[list[OrderItem]] = relationship(
        "OrderItem", order_by=OrderItem.id, lazy="noload"
    )
