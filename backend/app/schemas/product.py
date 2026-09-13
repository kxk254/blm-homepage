from datetime import datetime

from pydantic import BaseModel, Field

from app.schemas.common import CamelModel


class ProductOut(CamelModel):
    id: str
    product_type: str
    product_color: str
    product_name: str
    product_description: str
    detail_description: str
    product_price: int
    image_src: str
    stock_quantity: int
    theme_id: int | None
    created_at: datetime


class ProductStatusRequest(BaseModel):
    ids: list[str] = Field(default_factory=list)


class ProductStatusItem(CamelModel):
    id: str
    product_price: int
    stock_quantity: int


class UpdateProductDetailsRequest(BaseModel):
    product_name: str
    product_type: str
    product_color: str
    product_description: str
    detail_description: str = ""
    product_price: int = Field(ge=0)
    stock_quantity: int = Field(ge=0)
    theme_id: int | None = None


class UpdateProductImageRequest(BaseModel):
    image_src: str


class AdminProductListItem(CamelModel):
    id: str
    product_name: str
    product_price: int
    stock_quantity: int
    image_src: str
    theme_name: str | None
