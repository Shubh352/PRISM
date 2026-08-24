"""make attendance record id required

Revision ID: b90d8006e8d1
Revises: fe33d2da9c0f
Create Date: 2026-08-25 00:53:41.360744

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "b90d8006e8d1"
down_revision: Union[str, Sequence[str], None] = "fe33d2da9c0f"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    with op.batch_alter_table("attendances") as batch_op:
        batch_op.alter_column(
            "record_id",
            existing_type=sa.String(length=100),
            nullable=False,
        )


def downgrade() -> None:
    with op.batch_alter_table("attendances") as batch_op:
        batch_op.alter_column(
            "record_id",
            existing_type=sa.String(length=100),
            nullable=True,
        )
