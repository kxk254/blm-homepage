"""管理者アカウントを作成する。

Supabase時代の `npm run admin:create -- <email> <password>` の置き換え。
backendディレクトリで実行する:
    python scripts/create_admin.py <email> <password>
"""

import asyncio
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent.parent))

from sqlalchemy import select

from app.core.security import hash_password
from app.db.base import async_session_factory
from app.models.customer import Customer


async def main() -> None:
    if len(sys.argv) != 3:
        print("使い方: python scripts/create_admin.py <email> <password>")
        sys.exit(1)

    email, password = sys.argv[1], sys.argv[2]

    async with async_session_factory() as db:
        existing = await db.scalar(select(Customer).where(Customer.email == email))
        if existing:
            existing.is_admin = True
            existing.password_hash = hash_password(password)
            await db.commit()
            print(f"既存アカウントを管理者に昇格しました: {email}")
            return

        customer = Customer(email=email, password_hash=hash_password(password), is_admin=True)
        db.add(customer)
        await db.commit()
        await db.refresh(customer)
        print(f"管理者アカウントを作成しました: {customer.email} (id: {customer.id})")


if __name__ == "__main__":
    asyncio.run(main())
