"""products: ストーリー・サイズ・素材・お手入れ・紛失時対応の各カラム追加

Revision ID: 0005
Revises: 0004
Create Date: 2026-09-14

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op

revision: str = "0005"
down_revision: Union[str, None] = "0004"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

_COLUMNS = ("story", "size_info", "material_info", "care_info", "lost_item_note")


def upgrade() -> None:
    for column in _COLUMNS:
        op.add_column(
            "products",
            sa.Column(column, sa.Text(), nullable=False, server_default=""),
        )
    # server_defaultは新規行の初期値のためだけに使い、モデル側はアプリコードで
    # 明示的に""を渡す運用にするので、以後の挙動には影響しないよう外しておく
    for column in _COLUMNS:
        op.alter_column("products", column, server_default=None)


def downgrade() -> None:
    for column in _COLUMNS:
        op.drop_column("products", column)
