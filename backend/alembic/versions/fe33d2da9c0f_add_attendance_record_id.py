"""add attendance record id

Revision ID: fe33d2da9c0f
Revises: e2da03310bec
Create Date: 2026-08-25 00:39:37.164250

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "fe33d2da9c0f"
down_revision: Union[str, Sequence[str], None] = "e2da03310bec"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "attendances",
        sa.Column(
            "record_id",
            sa.String(length=100),
            nullable=False,
        ),
    )

    op.create_index(
        op.f("ix_attendances_record_id"),
        "attendances",
        ["record_id"],
        unique=True,
    )


def downgrade() -> None:
    op.drop_index(
        op.f("ix_attendances_record_id"),
        table_name="attendances",
    )

    op.drop_column(
        "attendances",
        "record_id",
    )
