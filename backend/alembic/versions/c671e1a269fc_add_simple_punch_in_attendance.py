"""add simple punch in attendance

Revision ID: c671e1a269fc
Revises: 68bb025987d1
Create Date: 2026-08-23
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = "c671e1a269fc"
down_revision: Union[str, Sequence[str], None] = "68bb025987d1"

branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    op.add_column(
        "attendances",
        sa.Column(
            "punch_in_time",
            sa.DateTime(),
            nullable=True,
        ),
    )


def downgrade() -> None:
    op.drop_column(
        "attendances",
        "punch_in_time",
    )