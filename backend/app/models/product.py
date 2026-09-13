from datetime import datetime

from sqlalchemy import DateTime, ForeignKey, Integer, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column

from app.db.base import Base


class Product(Base):
    __tablename__ = "products"

    # 「No. 001」のような品番表示・Stripeの行アイテム検索にそのまま使うため文字列IDのまま
    id: Mapped[str] = mapped_column(String(20), primary_key=True)
    product_type: Mapped[str] = mapped_column(String(100), nullable=False)
    product_color: Mapped[str] = mapped_column(String(100), nullable=False)
    product_name: Mapped[str] = mapped_column(String(200), nullable=False)
    product_description: Mapped[str] = mapped_column(Text, nullable=False)
    # 商品詳細ページ用の長文説明（一覧カードのキャッチコピーとは別枠）
    detail_description: Mapped[str] = mapped_column(Text, nullable=False, default="")
    product_price: Mapped[int] = mapped_column(Integer, nullable=False)
    # NASに保存された画像を指す相対パス（例: /media/xxxx.jpg）。nginxがそのまま静的配信する
    image_src: Mapped[str] = mapped_column(Text, nullable=False)
    # 手作り・一点物在庫の点数管理。0になったら購入不可（欠品）として扱う
    stock_quantity: Mapped[int] = mapped_column(Integer, nullable=False, default=0)
    # 未設定(null)は「テーマなし」として扱う。テーマ削除時は自動でnullに戻す
    theme_id: Mapped[int | None] = mapped_column(
        ForeignKey("themes.id", ondelete="SET NULL"), nullable=True
    )
    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True), nullable=False, server_default=func.now()
    )
