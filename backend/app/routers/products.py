from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import get_db
from app.models.product import Product
from app.schemas.product import ProductOut, ProductStatusItem, ProductStatusRequest

router = APIRouter(prefix="/api/products", tags=["products"])


@router.get("", response_model=list[ProductOut])
async def list_products(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Product).order_by(Product.id))
    return result.scalars().all()


# カートページが表示中に在庫・価格・商品の存在を再確認するための軽量エンドポイント。
# 決済時の在庫チェックは/api/checkout側で別途行うため、ここはあくまでUI表示用。
# パスがGET /api/products/{id}と衝突しないよう、動的パスより前に定義する。
@router.post("/status")
async def products_status(body: ProductStatusRequest, db: AsyncSession = Depends(get_db)):
    if not body.ids:
        return {"items": []}
    result = await db.execute(select(Product).where(Product.id.in_(body.ids)))
    # by_alias=Trueを明示（jsonable_encoderのデフォルト挙動に依存せず、
    # productPriceのようなcamelCaseキーで確実に返すため）
    items = [
        ProductStatusItem.model_validate(p).model_dump(by_alias=True)
        for p in result.scalars().all()
    ]
    return {"items": items}


@router.get("/{product_id}", response_model=ProductOut)
async def get_product(product_id: str, db: AsyncSession = Depends(get_db)):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品が見つかりません")
    return product
