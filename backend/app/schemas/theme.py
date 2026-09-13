from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import CamelModel


class ThemeOut(CamelModel):
    id: int
    name: str
    display_order: int
    created_at: datetime


class CreateThemeRequest(BaseModel):
    name: str
    display_order: int = 100


class UpdateThemeRequest(BaseModel):
    name: str
    display_order: int
