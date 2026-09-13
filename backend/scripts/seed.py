"""動作確認用の商品データを投入する。Next.js版の `npm run db:seed` の置き換え。

backendディレクトリで実行する: python scripts/seed.py
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from app.db.base import async_session_factory
from app.models.product import Product

SEED_PRODUCTS = [
    dict(
        id="001",
        product_type="イヤリング",
        product_color="シルバー",
        product_name="ムーンシリーズイヤリング",
        product_description=(
            "クレッセント型のスタイリッシュなイヤリング。"
            "スワロスキーやパールのキラキラ感が華やかなデザインです。"
        ),
        detail_description=(
            "（仮テキスト）三日月のフォルムに、ひとつぶひとつぶ丁寧に選んだビーズを配した"
            "一点物のイヤリングです。"
        ),
        product_price=4400,
        image_src="/media/0921-2.PNG",
        stock_quantity=5,
    ),
    dict(
        id="002",
        product_type="イヤリング",
        product_color="トパーズ",
        product_name="ストーンシリーズ",
        product_description=(
            "バロックストーンを使用したストーンフラワーシリーズのイヤリング。"
            "透明感のあるキラキラが華やかなイヤリングです。"
        ),
        detail_description=(
            "（仮テキスト）透明感のあるバロックストーンを一粒ずつ手作業で組み上げた、"
            "フラワーシリーズのイヤリングです。"
        ),
        product_price=3300,
        image_src="/media/0921-5.png",
        stock_quantity=5,
    ),
    dict(
        id="003",
        product_type="イヤリング",
        product_color="グレー",
        product_name="フラワーシリーズ",
        product_description=(
            "モザイクパールを使用したストーンフラワーシリーズのイヤリング。"
            "上品でお洋服にも合わせやすいイヤリングです。"
        ),
        detail_description=(
            "（仮テキスト）小さなモザイクパールを花びらのように配した、上品な印象のイヤリングです。"
        ),
        product_price=3300,
        image_src="/media/0921-14.png",
        stock_quantity=5,
    ),
]


async def main() -> None:
    async with async_session_factory() as db:
        for data in SEED_PRODUCTS:
            product = await db.get(Product, data["id"])
            if product:
                for key, value in data.items():
                    setattr(product, key, value)
            else:
                db.add(Product(**data))
        await db.commit()
    print(f"{len(SEED_PRODUCTS)}件の商品をシードしました")


if __name__ == "__main__":
    asyncio.run(main())
