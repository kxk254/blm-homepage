import logging

from fastapi import APIRouter, Depends, HTTPException, Response, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.security import (
    clear_session_cookie,
    create_reset_token,
    create_session_token,
    decode_reset_token,
    get_current_user,
    hash_password,
    set_session_cookie,
    verify_password,
    SessionUser,
)
from app.db.base import get_db
from app.email.auth_email import send_password_reset_email
from app.models.customer import Customer
from app.core.config import settings
from app.schemas.auth import (
    LoginRequest,
    MeResponse,
    RequestPasswordResetRequest,
    SignupRequest,
    UpdatePasswordRequest,
    UpdateProfileRequest,
)

router = APIRouter(prefix="/api/auth", tags=["auth"])
logger = logging.getLogger(__name__)


@router.post("/signup", response_model=MeResponse, status_code=status.HTTP_201_CREATED)
async def signup(body: SignupRequest, response: Response, db: AsyncSession = Depends(get_db)):
    existing = await db.scalar(select(Customer).where(Customer.email == body.email))
    if existing:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="このメールアドレスは既に登録されています")

    # Supabase Auth時代は「メール確認必須」設定にも対応していたが、
    # 運用を単純にするため確認メールなしで即ログイン扱いにする
    customer = Customer(email=body.email, password_hash=hash_password(body.password))
    db.add(customer)
    await db.commit()
    await db.refresh(customer)

    token = create_session_token(customer.id, customer.is_admin)
    set_session_cookie(response, token)
    return customer


@router.post("/login", response_model=MeResponse)
async def login(body: LoginRequest, response: Response, db: AsyncSession = Depends(get_db)):
    customer = await db.scalar(select(Customer).where(Customer.email == body.email))
    if not customer or not verify_password(body.password, customer.password_hash):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="メールアドレスまたはパスワードが正しくありません"
        )

    token = create_session_token(customer.id, customer.is_admin)
    set_session_cookie(response, token)
    return customer


@router.post("/logout")
async def logout(response: Response):
    clear_session_cookie(response)
    return {"ok": True}


@router.get("/me", response_model=MeResponse)
async def me(
    user: SessionUser = Depends(get_current_user), db: AsyncSession = Depends(get_db)
):
    customer = await db.get(Customer, user.id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="ログインが必要です")
    return customer


@router.patch("/profile", response_model=MeResponse)
async def update_profile(
    body: UpdateProfileRequest,
    user: SessionUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    customer = await db.get(Customer, user.id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="ログインが必要です")

    customer.full_name = body.full_name or None
    customer.phone = body.phone or None
    customer.postal_code = body.postal_code or None
    customer.address = body.address or None
    await db.commit()
    await db.refresh(customer)
    return customer


@router.post("/request-password-reset")
async def request_password_reset(body: RequestPasswordResetRequest, db: AsyncSession = Depends(get_db)):
    customer = await db.scalar(select(Customer).where(Customer.email == body.email))
    if customer:
        token = create_reset_token(customer.id)
        reset_url = f"{settings.site_url}/auth/confirm?token={token}&next=/account/reset-password"
        try:
            await send_password_reset_email(customer.email, reset_url)
        except Exception:
            logger.exception("Failed to send password reset email to %s", customer.email)
    # 登録済みメールかどうかを外部に推測されないよう、見つからなくても同じ成功メッセージを返す
    return {"message": "パスワード再設定用のメールを送信しました。メール内のリンクからお進みください。"}


@router.get("/confirm")
async def confirm_reset_token(token: str, response: Response, db: AsyncSession = Depends(get_db)):
    """パスワード再設定メールのリンクからのアクセス。トークンを検証し、
    パスワードを更新できるよう一時的にログイン状態にする（通常セッションと同じCookieを発行）。
    """
    customer_id = decode_reset_token(token)
    customer = await db.get(Customer, customer_id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="リンクが無効です")

    session_token = create_session_token(customer.id, customer.is_admin)
    set_session_cookie(response, session_token)
    return {"ok": True}


@router.post("/update-password")
async def update_password(
    body: UpdatePasswordRequest,
    user: SessionUser = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    customer = await db.get(Customer, user.id)
    if not customer:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="セッションの有効期限が切れています")
    customer.password_hash = hash_password(body.password)
    await db.commit()
    return {"ok": True}
