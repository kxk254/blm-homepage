"""products: image_src(1件) -> image_srcs(配列, 1〜8件)

Revision ID: 0002
Revises: 0001
Create Date: 2026-09-14

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0002"
down_revision: Union[str, None] = "0001"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 一旦nullable=Trueで追加し、既存データを1件配列としてbackfillしてから
    # NOT NULL + 1〜8件のCHECK制約を付ける
    op.add_column(
        "products", sa.Column("image_srcs", postgresql.ARRAY(sa.Text()), nullable=True)
    )
    op.execute("UPDATE products SET image_srcs = ARRAY[image_src]")
    op.alter_column("products", "image_srcs", nullable=False)
    op.create_check_constraint(
        "products_image_srcs_length_check",
        "products",
        "array_length(image_srcs, 1) BETWEEN 1 AND 8",
    )
    op.drop_column("products", "image_src")


def downgrade() -> None:
    op.add_column("products", sa.Column("image_src", sa.Text(), nullable=True))
    op.execute("UPDATE products SET image_src = image_srcs[1]")
    op.alter_column("products", "image_src", nullable=False)
    op.drop_constraint("products_image_srcs_length_check", "products", type_="check")
    op.drop_column("products", "image_srcs")
