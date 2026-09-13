from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import SessionUser, get_current_admin, hash_password
from app.db.base import get_db
from app.models.customer import Customer
from app.schemas.admin_account import AdminAccountOut
from app.schemas.auth import SignupRequest

router = APIRouter(prefix="/api/admin/admins", tags=["admin-admins"])


@router.get("", response_model=list[AdminAccountOut])
async def list_admins(
    _admin: SessionUser = Depends(get_current_admin), db: AsyncSession = Depends(get_db)
):
    result = await db.execute(
        select(Customer).where(Customer.is_admin.is_(True)).order_by(Customer.created_at)
    )
    return result.scalars().all()


@router.post("", response_model=AdminAccountOut, status_code=status.HTTP_201_CREATED)
async def create_admin_account(
    body: SignupRequest,
    _admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    existing = await db.scalar(select(Customer).where(Customer.email == body.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="このメールアドレスは既に登録されています")

    admin = Customer(email=body.email, password_hash=hash_password(body.password), is_admin=True)
    db.add(admin)
    await db.commit()
    await db.refresh(admin)
    return admin


@router.delete("/{admin_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_admin_account(
    admin_id: UUID,
    current_admin: SessionUser = Depends(get_current_admin),
    db: AsyncSession = Depends(get_db),
):
    if admin_id == current_admin.id:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST, detail="自分自身のアカウントは削除できません"
        )

    target = await db.get(Customer, admin_id)
    if not target or not target.is_admin:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="管理者が見つかりません")

    # 管理者が0人になって誰もログインできなくなる事態を必ず防ぐ
    admin_count = await db.scalar(select(func.count()).where(Customer.is_admin.is_(True)))
    if admin_count is not None and admin_count <= 1:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="管理者は最低1人必要です")

    await db.delete(target)
    await db.commit()
