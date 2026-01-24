"""add_role_in_user_table

Revision ID: 5400fcb7b5d6
Revises: 0a06bb5ccf77
Create Date: 2026-01-24 13:18:14.726398
"""

from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa

# revision identifiers, used by Alembic.
revision: str = "5400fcb7b5d6"
down_revision: Union[str, Sequence[str], None] = "0a06bb5ccf77"
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 1) Add role safely (works even if existing rows already in table)
    op.add_column(
        "user",
        sa.Column("role", sa.String(length=50), nullable=False, server_default="user"),
    )

    # 2) Seed admin user (only if not already present)
    from passlib.context import CryptContext

    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    hashed_password = pwd_context.hash("secret")

    op.execute(
        sa.text(
            """
            INSERT INTO "user" (
                email,
                hashed_password,
                full_name,
                phone_number,
                address,
                city,
                state,
                zip_code,
                country,
                profile_image_url,
                role
            )
            SELECT
                :email,
                :hashed_password,
                :full_name,
                :phone_number,
                :address,
                :city,
                :state,
                :zip_code,
                :country,
                :profile_image_url,
                :role
            WHERE NOT EXISTS (
                SELECT 1 FROM "user" WHERE email = :email
            )
            """
        ).bindparams(
            email="admin@bgfit.in",
            hashed_password=hashed_password,
            full_name="Admin",
            phone_number="0000000000",
            address="",
            city="",
            state="",
            zip_code="",
            country="",
            profile_image_url="",
            role="admin",
        )
    )

    # 3) Remove server default after backfill (recommended)
    op.alter_column("user", "role", server_default=None)


def downgrade() -> None:
    # Remove seeded admin (optional, but keeps downgrade clean)
    op.execute(
        sa.text('DELETE FROM "user" WHERE email = :email').bindparams(
            email="admin@bgfit.in"
        )
    )

    # Drop role column
    op.drop_column("user", "role")
