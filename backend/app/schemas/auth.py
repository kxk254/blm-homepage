from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

from app.schemas.common import CamelModel


class SignupRequest(BaseModel):
    email: EmailStr
    password: str = Field(min_length=8)


class LoginRequest(BaseModel):
    email: EmailStr
    password: str


class RequestPasswordResetRequest(BaseModel):
    email: EmailStr


class UpdatePasswordRequest(BaseModel):
    password: str = Field(min_length=8)


class UpdateProfileRequest(BaseModel):
    full_name: str | None = None
    phone: str | None = None
    postal_code: str | None = None
    address: str | None = None


class MeResponse(CamelModel):
    id: UUID
    email: str
    is_admin: bool
    full_name: str | None
    phone: str | None
    postal_code: str | None
    address: str | None
