from datetime import datetime
from uuid import UUID

from app.schemas.common import CamelModel


class AdminCustomerOut(CamelModel):
    id: UUID
    email: str
    full_name: str | None
    phone: str | None
    postal_code: str | None
    address: str | None
    created_at: datetime
    order_count: int = 0
