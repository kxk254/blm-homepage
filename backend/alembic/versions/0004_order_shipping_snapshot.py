"""orders: 発送先スナップショット(氏名・電話番号・郵便番号・住所)カラム追加

Revision ID: 0004
Revises: 0003
Create Date: 2026-09-14

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0004"
down_revision: Union[str, None] = "0003"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column("orders", sa.Column("shipping_name", sa.String(200), nullable=True))
    op.add_column("orders", sa.Column("shipping_phone", sa.String(50), nullable=True))
    op.add_column("orders", sa.Column("shipping_postal_code", sa.String(20), nullable=True))
    op.add_column("orders", sa.Column("shipping_address", sa.Text(), nullable=True))


def downgrade() -> None:
    op.drop_column("orders", "shipping_address")
    op.drop_column("orders", "shipping_postal_code")
    op.drop_column("orders", "shipping_phone")
    op.drop_column("orders", "shipping_name")
