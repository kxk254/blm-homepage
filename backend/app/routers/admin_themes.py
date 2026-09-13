from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import SessionUser, get_current_admin
from app.db.base import get_db
from app.models.theme import Theme
from app.schemas.theme import CreateThemeRequest, ThemeOut, UpdateThemeRequest

router = APIRouter(prefix="/api/admin/themes", tags=["admin-themes"])


@router.post("", response_model=ThemeOut, status_code=status.HTTP_201_CREATED)
async def create_theme(
    body: CreateThemeRequest,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    theme = Theme(name=body.name, display_order=body.display_order)
    db.add(theme)
    await db.commit()
    await db.refresh(theme)
    return theme


@router.put("/{theme_id}", response_model=ThemeOut)
async def update_theme(
    theme_id: int,
    body: UpdateThemeRequest,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    theme = await db.get(Theme, theme_id)
    if not theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="テーマが見つかりません")
    theme.name = body.name
    theme.display_order = body.display_order
    await db.commit()
    await db.refresh(theme)
    return theme


@router.delete("/{theme_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_theme(
    theme_id: int,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    theme = await db.get(Theme, theme_id)
    if not theme:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="テーマが見つかりません")
    # 紐づく商品はtheme_idがnullになる（Productモデルのondelete="SET NULL"）
    await db.delete(theme)
    await db.commit()
