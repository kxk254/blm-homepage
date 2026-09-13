import re
import time
from pathlib import Path

from fastapi import APIRouter, Depends, HTTPException, UploadFile, status

from app.core.config import settings
from app.core.security import SessionUser, get_current_admin
from app.schemas.media import MediaImageOut

router = APIRouter(prefix="/api/admin/media", tags=["admin-media"])

_UNSAFE_CHARS = re.compile(r"[^a-zA-Z0-9._-]")


def _media_root() -> Path:
    root = Path(settings.media_root)
    root.mkdir(parents=True, exist_ok=True)
    return root


@router.get("", response_model=list[MediaImageOut])
async def list_media(_admin: SessionUser = Depends(get_current_admin)):
    root = _media_root()
    files = sorted(
        (p for p in root.iterdir() if p.is_file()),
        key=lambda p: p.stat().st_mtime,
        reverse=True,
    )
    return [MediaImageOut(name=p.name, url=f"/media/{p.name}") for p in files]


@router.post("/upload", response_model=MediaImageOut, status_code=status.HTTP_201_CREATED)
async def upload_media(
    file: UploadFile, _admin: SessionUser = Depends(get_current_admin)
):
    if not file.filename:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ファイルを選択してください")

    # 元のファイル名の衝突・パス区切り文字混入を避けるため安全な名前に変換
    safe_name = f"{int(time.time() * 1000)}-{_UNSAFE_CHARS.sub('_', file.filename)}"
    destination = _media_root() / safe_name

    contents = await file.read()
    if not contents:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="ファイルを選択してください")
    destination.write_bytes(contents)

    return MediaImageOut(name=safe_name, url=f"/media/{safe_name}")
