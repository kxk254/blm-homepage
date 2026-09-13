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
    # 商品詳細ページの補足情報。すべて空文字の場合がある(未入力なら非表示にする)
    story: str
    size_info: str
    material_info: str
    care_info: str
    lost_item_note: str
    product_price: int
    # カバー画像(1枚目)。一覧・カート等、1枚だけでよい箇所向け
    image_src: str
    # 商品詳細ページのギャラリー表示用。1〜8枚、順番が表示順
    image_srcs: list[str]
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
    story: str = ""
    size_info: str = ""
    material_info: str = ""
    care_info: str = ""
    lost_item_note: str = ""
    product_price: int = Field(ge=0)
    stock_quantity: int = Field(ge=0)
    theme_id: int | None = None


class UpdateProductImageRequest(BaseModel):
    # 1枚目が一覧・カート・SNS共有等で使われるカバー画像になる
    image_srcs: list[str] = Field(min_length=1, max_length=8)


class AdminProductListItem(CamelModel):
    id: str
    product_name: str
    product_price: int
    stock_quantity: int
    image_src: str
    theme_name: str | None


class ProductCategoryOut(CamelModel):
    code: str
    label: str
