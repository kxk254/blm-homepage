from fastapi import APIRouter, Depends
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.db.base import get_db
from app.models.theme import Theme
from app.schemas.theme import ThemeOut

router = APIRouter(prefix="/api/themes", tags=["themes"])


@router.get("", response_model=list[ThemeOut])
async def list_themes(db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Theme).order_by(Theme.display_order))
    return result.scalars().all()
