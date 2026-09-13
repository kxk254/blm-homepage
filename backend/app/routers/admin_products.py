from datetime import datetime
from zoneinfo import ZoneInfo

from fastapi import APIRouter, Depends, File, Form, HTTPException, UploadFile, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.media_storage import next_sequence_number, product_media_dir, safe_extension
from app.core.product_categories import PRODUCT_CATEGORIES, PRODUCT_CATEGORY_CODES
from app.core.security import SessionUser, get_current_admin
from app.db.base import get_db
from app.models.product import MAX_PRODUCT_IMAGES, Product
from app.models.theme import Theme
from app.schemas.product import (
    AdminProductListItem,
    ProductCategoryOut,
    ProductOut,
    UpdateProductDetailsRequest,
    UpdateProductImageRequest,
)

router = APIRouter(prefix="/api/admin/products", tags=["admin-products"])

# 商品を実際に運用している店舗の所在地(日本)を基準に年月を決める。
# サーバーのタイムゾーン設定に依存させないため明示的にJSTを使う
JST = ZoneInfo("Asia/Tokyo")


async def _generate_product_id(db: AsyncSession, category_code: str) -> str:
    """「YYMM-カテゴリ-連番」形式の商品番号を自動採番する(例: 2609-E-001)。
    連番はカテゴリごと・月が変わるとまた001から始まる。"""
    now = datetime.now(JST)
    prefix = f"{now.year % 100:02d}{now.month:02d}-{category_code}"

    result = await db.execute(select(Product.id).where(Product.id.like(f"{prefix}-%")))
    max_seq = 0
    for (product_id,) in result.all():
        try:
            seq = int(product_id.rsplit("-", 1)[1])
        except (IndexError, ValueError):
            continue
        max_seq = max(max_seq, seq)

    return f"{prefix}-{max_seq + 1:03d}"


@router.get("/categories", response_model=list[ProductCategoryOut])
async def list_product_categories(_admin: SessionUser = Depends(get_current_admin)):
    # 静的なパス"/categories"は"/{product_id}"より先に登録する必要がある
    # (そうしないと"categories"という商品IDとして解釈されてしまう)
    return [ProductCategoryOut(code=code, label=label) for code, label in PRODUCT_CATEGORIES]


@router.post("", response_model=ProductOut, status_code=status.HTTP_201_CREATED)
async def create_product(
    category_code: str = Form(...),
    product_name: str = Form(...),
    product_type: str = Form(...),
    product_color: str = Form(...),
    product_description: str = Form(...),
    detail_description: str = Form(""),
    story: str = Form(""),
    size_info: str = Form(""),
    material_info: str = Form(""),
    care_info: str = Form(""),
    lost_item_note: str = Form(""),
    product_price: int = Form(...),
    stock_quantity: int = Form(0),
    theme_id: int | None = Form(None),
    files: list[UploadFile] = File(...),
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    # 商品番号は「YYMM-カテゴリ-連番」で自動採番するため、ユーザーが手入力する項目ではない
    if category_code not in PRODUCT_CATEGORY_CODES:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="カテゴリを選択してください")
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="画像を1枚以上選択してください")
    if len(files) > MAX_PRODUCT_IMAGES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"画像は最大{MAX_PRODUCT_IMAGES}枚までです",
        )

    product_id = await _generate_product_id(db, category_code)
    directory = product_media_dir(product_id)
    next_seq = next_sequence_number(directory, product_id)

    image_srcs: list[str] = []
    for file in files:
        if not file.filename:
            continue
        contents = await file.read()
        if not contents:
            continue
        safe_name = f"{product_id}_{next_seq}{safe_extension(file.filename)}"
        next_seq += 1
        (directory / safe_name).write_bytes(contents)
        image_srcs.append(f"/media/{product_id}/{safe_name}")

    if not image_srcs:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="画像を1枚以上選択してください")

    product = Product(
        id=product_id,
        product_name=product_name,
        product_type=product_type,
        product_color=product_color,
        product_description=product_description,
        detail_description=detail_description,
        story=story,
        size_info=size_info,
        material_info=material_info,
        care_info=care_info,
        lost_item_note=lost_item_note,
        product_price=product_price,
        stock_quantity=stock_quantity,
        theme_id=theme_id,
        image_srcs=image_srcs,
    )
    db.add(product)
    await db.commit()
    await db.refresh(product)
    return product


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
    product.story = body.story
    product.size_info = body.size_info
    product.material_info = body.material_info
    product.care_info = body.care_info
    product.lost_item_note = body.lost_item_note
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
    product.image_srcs = body.image_srcs
    await db.commit()
    await db.refresh(product)
    return product
