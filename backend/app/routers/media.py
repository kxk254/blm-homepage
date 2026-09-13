from fastapi import APIRouter, Depends, HTTPException, UploadFile, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.media_storage import next_sequence_number, product_media_dir, safe_extension
from app.core.security import SessionUser, get_current_admin
from app.db.base import get_db
from app.models.product import Product
from app.schemas.media import MediaImageOut

# 商品ごとにサブフォルダを分けて保存する(/media/<product_id>/<filename>)。
# 全商品共通の1つのプールだと、商品数が増えるほど選択肢が多すぎて
# 目的の画像を探しにくくなるため
router = APIRouter(prefix="/api/admin/products/{product_id}/media", tags=["admin-media"])

_MAX_FILES_PER_UPLOAD = 8


async def _require_product(product_id: str, db: AsyncSession) -> Product:
    product = await db.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="商品が見つかりません")
    return product


@router.get("", response_model=list[MediaImageOut])
async def list_product_media(
    product_id: str,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await _require_product(product_id, db)
    directory = product_media_dir(product_id)
    files = sorted(
        (p for p in directory.iterdir() if p.is_file()),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    return [MediaImageOut(name=p.name, url=f"/media/{product_id}/{p.name}") for p in files]


@router.post("", response_model=list[MediaImageOut], status_code=status.HTTP_201_CREATED)
async def upload_product_media(
    product_id: str,
    files: list[UploadFile],
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    await _require_product(product_id, db)
    if not files:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ファイルを選択してください")
    if len(files) > _MAX_FILES_PER_UPLOAD:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"一度にアップロードできるのは{_MAX_FILES_PER_UPLOAD}枚までです",
        )

    directory = product_media_dir(product_id)
    next_seq = next_sequence_number(directory, product_id)
    uploaded: list[MediaImageOut] = []
    for file in files:
        if not file.filename:
            continue
        contents = await file.read()
        if not contents:
            continue
        # ファイル名は「商品番号_アップロード順」にする(元のファイル名は使わない)
        safe_name = f"{product_id}_{next_seq}{safe_extension(file.filename)}"
        next_seq += 1
        (directory / safe_name).write_bytes(contents)
        uploaded.append(MediaImageOut(name=safe_name, url=f"/media/{product_id}/{safe_name}"))

    if not uploaded:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ファイルを選択してください")

    return uploaded
