"""orders: 返金記録用カラム追加 / customers: 変更履歴テーブル+トリガー追加

Revision ID: 0003
Revises: 0002
Create Date: 2026-09-14

"""
from typing import Sequence, Union

import sqlalchemy as sa
from alembic import op
from sqlalchemy.dialects import postgresql

revision: str = "0003"
down_revision: Union[str, None] = "0002"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None

# 顧客都合の問い合わせ対応で「いつ・いくら・なぜ返金したか」を追えるようにする
_REFUND_COLUMNS = ("refunded_at", "refund_amount", "refund_reason")

# 住所・氏名・電話番号・メールアドレスの変更履歴を、アプリの実装漏れに関係なく
# 確実に残すため、DBトリガーでcustomersテーブルの更新を監視する
_TRACKED_FIELDS = ("email", "full_name", "phone", "postal_code", "address")

_TRIGGER_FUNCTION_SQL = f"""
create or replace function public.log_customer_field_changes()
returns trigger
language plpgsql
as $$
begin
  {" ".join(
      f'''
  if new.{field} is distinct from old.{field} then
    insert into customer_field_history (customer_id, field_name, old_value, new_value)
    values (old.id, '{field}', old.{field}::text, new.{field}::text);
  end if;
      '''
      for field in _TRACKED_FIELDS
  )}
  return new;
end;
$$;
"""


def upgrade() -> None:
    for column in _REFUND_COLUMNS:
        if column == "refunded_at":
            op.add_column("orders", sa.Column(column, sa.DateTime(timezone=True), nullable=True))
        elif column == "refund_amount":
            op.add_column("orders", sa.Column(column, sa.Integer(), nullable=True))
        else:
            op.add_column("orders", sa.Column(column, sa.Text(), nullable=True))

    op.create_table(
        "customer_field_history",
        sa.Column(
            "id",
            postgresql.UUID(as_uuid=True),
            primary_key=True,
            server_default=sa.text("gen_random_uuid()"),
        ),
        sa.Column(
            "customer_id",
            postgresql.UUID(as_uuid=True),
            sa.ForeignKey("customers.id", ondelete="CASCADE"),
            nullable=False,
        ),
        sa.Column("field_name", sa.String(30), nullable=False),
        sa.Column("old_value", sa.Text(), nullable=True),
        sa.Column("new_value", sa.Text(), nullable=True),
        sa.Column(
            "changed_at",
            sa.DateTime(timezone=True),
            nullable=False,
            server_default=sa.text("now()"),
        ),
    )
    op.create_index(
        "ix_customer_field_history_customer_id",
        "customer_field_history",
        ["customer_id"],
    )

    op.execute(_TRIGGER_FUNCTION_SQL)
    op.execute("drop trigger if exists on_customer_field_change on customers")
    op.execute(
        """
        create trigger on_customer_field_change
          after update on customers
          for each row execute function public.log_customer_field_changes()
        """
    )


def downgrade() -> None:
    op.execute("drop trigger if exists on_customer_field_change on customers")
    op.execute("drop function if exists public.log_customer_field_changes()")
    op.drop_index("ix_customer_field_history_customer_id", table_name="customer_field_history")
    op.drop_table("customer_field_history")
    for column in _REFUND_COLUMNS:
        op.drop_column("orders", column)
