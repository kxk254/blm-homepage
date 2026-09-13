from datetime import datetime
from uuid import UUID

from app.schemas.common import CamelModel


class AdminAccountOut(CamelModel):
    id: UUID
    email: str
    created_at: datetime
