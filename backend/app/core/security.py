from datetime import datetime, timedelta, timezone
from uuid import UUID

import jwt
from fastapi import Cookie, Depends, HTTPException, Response, status
from passlib.context import CryptContext

from app.core.config import settings

SESSION_COOKIE_NAME = "session"

_pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def hash_password(raw_password: str) -> str:
    return _pwd_context.hash(raw_password)


def verify_password(raw_password: str, password_hash: str) -> bool:
    return _pwd_context.verify(raw_password, password_hash)


def create_session_token(customer_id: UUID, is_admin: bool) -> str:
    """ログインしているcustomerを表すJWTを発行する。

    Supabase Authの`auth.users`は廃止し、customersテーブル1本にまとめたので
    ペイロードもcustomer.idとis_adminだけで完結する。
    purpose="session"を入れておき、パスワード再設定用トークン(purpose="reset")と
    区別できるようにする（reset用トークンがそのまま恒久セッションとして
    使い回されてしまうのを防ぐため）。
    """
    expire = datetime.now(timezone.utc) + timedelta(minutes=settings.jwt_expire_minutes)
    payload = {
        "sub": str(customer_id),
        "is_admin": is_admin,
        "purpose": "session",
        "exp": expire,
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


RESET_TOKEN_EXPIRE_MINUTES = 30


def create_reset_token(customer_id: UUID) -> str:
    """パスワード再設定メールのリンクに載せる短命トークン。"""
    expire = datetime.now(timezone.utc) + timedelta(minutes=RESET_TOKEN_EXPIRE_MINUTES)
    payload = {"sub": str(customer_id), "purpose": "reset", "exp": expire}
    return jwt.encode(payload, settings.jwt_secret, algorithm="HS256")


def decode_reset_token(token: str) -> UUID:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="リンクの有効期限が切れています")
    if payload.get("purpose") != "reset":
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="不正なリンクです")
    return UUID(payload["sub"])


def set_session_cookie(response: Response, token: str) -> None:
    response.set_cookie(
        key=SESSION_COOKIE_NAME,
        value=token,
        httponly=True,
        secure=settings.site_url.startswith("https://"),
        samesite="lax",
        max_age=settings.jwt_expire_minutes * 60,
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(key=SESSION_COOKIE_NAME, path="/")


class SessionUser:
    def __init__(self, customer_id: UUID, is_admin: bool):
        self.id = customer_id
        self.is_admin = is_admin


def decode_session_token(token: str) -> SessionUser:
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except jwt.PyJWTError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="セッションが無効です")
    if payload.get("purpose") != "session":
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="セッションが無効です")
    return SessionUser(customer_id=UUID(payload["sub"]), is_admin=bool(payload.get("is_admin")))


def get_optional_user(session: str | None = Cookie(default=None)) -> SessionUser | None:
    """未ログインならNoneを返す（ログイン必須ではないエンドポイント用）。"""
    if not session:
        return None
    try:
        return decode_session_token(session)
    except HTTPException:
        return None


def get_current_user(session: str | None = Cookie(default=None)) -> SessionUser:
    """ログイン必須のエンドポイント用。未ログイン/トークン不正なら401。"""
    if not session:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="ログインが必要です")
    return decode_session_token(session)


def get_current_admin(user: SessionUser = Depends(get_current_user)) -> SessionUser:
    """管理者専用エンドポイント用のDepends。ログイン済みかつis_adminを要求する。"""
    if not user.is_admin:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="管理者権限がありません")
    return user
