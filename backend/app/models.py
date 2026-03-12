import uuid
from typing import Optional
from sqlmodel import Field, SQLModel, Relationship
from sqlalchemy import Column, text, func
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime


class User(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            nullable=False,
        ),
    )
    email: str = Field(index=True, unique=True)
    hashed_password: str
    full_name: str
    phone_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    profile_image_url: Optional[str] = None
    role: str = Field(default="user")

    additional_addresses: list["Address"] = Relationship(back_populates="user")


class Address(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            nullable=False,
        ),
    )
    user_id: uuid.UUID = Field(foreign_key="user.id")
    full_name: str
    address_line1: str
    address_line2: Optional[str] = None
    city: str
    state: str
    zip_code: str
    country: str = "India"
    phone_number: str
    is_default: bool = False

    user: Optional[User] = Relationship(back_populates="additional_addresses")


class Product(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            nullable=False,
        ),
    )
    name: str
    price: int  # Storing as int (cents/paise) or just raw value as per C#
    image_url: str
    back_image_url: Optional[str] = None
    category: str  # Men, Women, Unisex
    type: str  # Tee, Hoodie, etc.
    is_new_arrival: bool = False
    color: str
    product_description: Optional[str] = Field(default=None)

    size_stocks: list["ProductSizeStock"] = Relationship(back_populates="product", cascade_delete=True)


class ProductSizeStock(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            nullable=False,
        ),
    )
    product_id: uuid.UUID = Field(foreign_key="product.id")
    size: str  # e.g. "XS", "S", "M", "L", "XL", "XXL", "XXXL"
    stock: int = Field(default=0)

    product: Optional[Product] = Relationship(back_populates="size_stocks")


class CartItem(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            nullable=False,
        ),
    )
    user_id: uuid.UUID = Field(foreign_key="user.id")
    product_id: uuid.UUID = Field(foreign_key="product.id")
    quantity: int
    size: str
    color: str

    product: Optional[Product] = Relationship()


class Order(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            nullable=False,
        ),
    )
    user_id: uuid.UUID = Field(foreign_key="user.id")
    total_amount: int
    currency: str = "INR"
    status: str = "pending"  # pending, paid, failed, shipped, delivered
    razorpay_order_id: Optional[str] = None
    razorpay_payment_id: Optional[str] = None

    # Snapshot of address
    shipping_full_name: str
    shipping_address_line1: str
    shipping_address_line2: Optional[str] = None
    shipping_city: str
    shipping_state: str
    shipping_zip_code: str
    shipping_country: str
    shipping_phone: str

    created_at: str = Field(default_factory=lambda: datetime.utcnow().isoformat())

    items: list["OrderItem"] = Relationship(back_populates="order")


class OrderItem(SQLModel, table=True):
    id: Optional[uuid.UUID] = Field(
        default=None,
        sa_column=Column(
            UUID(as_uuid=True),
            primary_key=True,
            server_default=text("uuid_generate_v4()"),
            nullable=False,
        ),
    )
    order_id: uuid.UUID = Field(foreign_key="order.id")
    product_id: uuid.UUID = Field(foreign_key="product.id")
    quantity: int
    price: int  # Price at time of purchase
    size: str
    color: str

    order: Optional[Order] = Relationship(back_populates="items")
    product: Optional[Product] = Relationship()


class SiteSettings(SQLModel, table=True):
    id: int = Field(default=1, primary_key=True)
    price_range_min: int = 0
    price_range_max: int = 50000
    price_range_step: int = 1000
    sorting_options: str = (
        '[{"label": "Newest Arrivals", "value": "newest"}, '
        '{"label": "Price: Low to High", "value": "price_asc"}, '
        '{"label": "Price: High to Low", "value": "price_desc"}]'
    )  # Storing JSON as string for simplicity in SQLite/Postgres compatibility without extra types
