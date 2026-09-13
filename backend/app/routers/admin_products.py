from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import SessionUser, get_current_admin
from app.db.base import get_db
from app.models.product import Product
from app.models.theme import Theme
from app.schemas.product import (
    AdminProductListItem,
    ProductOut,
    UpdateProductDetailsRequest,
    UpdateProductImageRequest,
)

router = APIRouter(prefix="/api/admin/products", tags=["admin-products"])


@router.get("", response_model=list[AdminProductListItem])
async def list_products_for_admin(
    _admin: SessionUser = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Product, Theme.name)
        .outerjoin(Theme, Product.theme_id == Theme.id)
        .order_by(Product.id)
    )
    return [
        AdminProductListItem(
            id=product.id,
            product_name=product.product_name,
            product_price=product.product_price,
            stock_quantity=product.stock_quantity,
            image_src=product.image_src,
            theme_name=theme_name,
        )
        for product, theme_name in result.all()
    ]


@router.get("/{product_id}", response_model=ProductOut)
async def get_product_for_admin(
    product_id: str,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品が見つかりません")
    return product


@router.put("/{product_id}", response_model=ProductOut)
async def update_product_details(
    product_id: str,
    body: UpdateProductDetailsRequest,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品が見つかりません")

    product.product_name = body.product_name
    product.product_type = body.product_type
    product.product_color = body.product_color
    product.product_description = body.product_description
    product.detail_description = body.detail_description
    product.product_price = body.product_price
    product.stock_quantity = body.stock_quantity
    product.theme_id = body.theme_id
    await db.commit()
    await db.refresh(product)
    return product


@router.put("/{product_id}/image", response_model=ProductOut)
async def update_product_image(
    product_id: str,
    body: UpdateProductImageRequest,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品が見つかりません")
    product.image_src = body.image_src
    await db.commit()
    await db.refresh(product)
    return product
