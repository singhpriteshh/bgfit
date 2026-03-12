"""Add productsizestock table and drop product.stock column

Revision ID: a1b2c3d4e5f6
Revises: 2035b3c87051
Create Date: 2026-03-12 22:35:00.000000

"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects.postgresql import UUID


# revision identifiers, used by Alembic.
revision: str = "a1b2c3d4e5f6"
down_revision: Union[str, Sequence[str], None] = "2035b3c87051"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create the productsizestock table
    op.create_table(
        "productsizestock",
        sa.Column(
            "id",
            UUID(as_uuid=True),
            server_default=sa.text("uuid_generate_v4()"),
            nullable=False,
        ),
        sa.Column("product_id", UUID(as_uuid=True), nullable=False),
        sa.Column("size", sa.String(), nullable=False),
        sa.Column("stock", sa.Integer(), nullable=False, server_default="0"),
        sa.ForeignKeyConstraint(["product_id"], ["product.id"], ondelete="CASCADE"),
        sa.PrimaryKeyConstraint("id"),
    )

    # Drop the old stock column from product table
    op.drop_column("product", "stock")


def downgrade() -> None:
    # Re-add stock column to product
    op.add_column(
        "product",
        sa.Column("stock", sa.Integer(), server_default="0", nullable=False),
    )

    # Drop the productsizestock table
    op.drop_table("productsizestock")
