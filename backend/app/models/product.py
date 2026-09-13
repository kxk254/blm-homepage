from datetime import datetime

from sqlalchemy import CheckConstraint, DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.dialects.postgresql import ARRAY
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base

MIN_PRODUCT_IMAGES = 1
MAX_PRODUCT_IMAGES = 8


class Product(Base):
    __tablename__ = "products"
    __table_args__ = (
        CheckConstraint(
            f"array_length(image_srcs, 1) BETWEEN {MIN_PRODUCT_IMAGES} AND {MAX_PRODUCT_IMAGES}",
            name="products_image_srcs_length_check",
        ),
    )

    # 「No. 001」のような品番表示・Stripeの行アイテム検索にそのまま使うため文字列IDのまま
    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    product_type: Mapped[str] = mapped_column(String(100), nullable=False)
    product_color: Mapped[str] = mapped_column(String(100), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    product_description: Mapped[str] = mapped_column(Text, nullable=False)
    # 商品詳細ページ用の長文説明（一覧カードのキャッチコピーとは別枠）
    detail_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    # 商品詳細ページの補足情報。すべて任意項目(空文字なら非表示にする)
    story: Mapped[str] = mapped_column(Text, nullable=False, default="")
    size_info: Mapped[str] = mapped_column(Text, nullable=False, default="")
    material_info: Mapped[str] = mapped_column(Text, nullable=False, default="")
    care_info: Mapped[str] = mapped_column(Text, nullable=False, default="")
    # イヤリング等ペア商品で「片方を無くした場合」の対応。商品ごとに違う場合があるための欄
    # (一般的な方針は/careページに別途記載している)
    lost_item_note: Mapped[str] = mapped_column(Text, nullable=False, default="")
    product_price: Mapped[int] = mapped_column(Integer, nullable=False)
    # NASに保存された画像を指す相対パスの配列（1〜8枚、1枚目が一覧・カート・SNS共有等で
    # 使われるカバー画像）。nginxがそのまま静的配信する
    image_srcs: Mapped[list[str]] = mapped_column(ARRAY(Text), nullable=False)
    # 手作り・一点物在庫の点数管理。0になったら購入不可（欠品）として扱う
    stock_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    # 未設定(null)は「テーマなし」として扱う。テーマ削除時は自動でnullに戻す
    theme_id: Mapped[int | None] = mapped_column(
        ForeignKey("themes.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )

    @property
    def image_src(self) -> str:
        """一覧・カート・チェックアウト・SNS共有等、1枚だけ使いたい箇所向けの
        カバー画像(先頭の画像)。DB列ではなくPythonプロパティ。"""
        return self.image_srcs[0]
