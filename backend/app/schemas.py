import uuid
from typing import Optional
from sqlmodel import SQLModel
from datetime import datetime


# Token Schemas
class Token(SQLModel):
    access_token: str
    token_type: str


class TokenData(SQLModel):
    email: Optional[str] = None


# User Schemas
class UserBase(SQLModel):
    email: str
    full_name: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    profile_image_url: Optional[str] = None


class UserCreate(UserBase):
    password: str


class UserRead(UserBase):
    id: uuid.UUID
    role: str


class UserUpdate(SQLModel):
    full_name: Optional[str] = None
    email: Optional[str] = None
    password: Optional[str] = None
    phone_number: Optional[str] = None
    address: Optional[str] = None
    city: Optional[str] = None
    state: Optional[str] = None
    zip_code: Optional[str] = None
    country: Optional[str] = None
    profile_image_url: Optional[str] = None


# Product Schema (if needed for API response validation, though DB model works too)
class ProductRead(SQLModel):
    id: uuid.UUID
    name: str
    price: int
    image_url: str
    category: str
    type: str
    is_new_arrival: bool
    color: str
    stock: int
    product_description: Optional[str] = None


# Cart Schemas
class CartItemBase(SQLModel):
    product_id: uuid.UUID
    quantity: int
    size: str
    color: str


class CartItemCreate(CartItemBase):
    pass


class CartItemRead(CartItemBase):
    id: uuid.UUID
    user_id: uuid.UUID
    product: Optional[ProductRead] = None


# Order Schemas
class OrderItemRead(SQLModel):
    id: uuid.UUID
    product_id: uuid.UUID
    quantity: int
    price: int
    size: str
    color: str
    product: Optional[ProductRead] = None


class OrderRead(SQLModel):
    id: uuid.UUID
    total_amount: int
    status: str
    created_at: str
    razorpay_order_id: Optional[str] = None

    # Address Snapshot
    shipping_full_name: str
    shipping_address_line1: str
    shipping_address_line2: Optional[str] = None
    shipping_city: str
    shipping_state: str
    shipping_zip_code: str
    shipping_country: str
    shipping_phone: str

    items: list[OrderItemRead]


# Admin Schemas
class ProductCreate(SQLModel):
    name: str
    price: int
    image_url: str
    back_image_url: Optional[str] = None
    category: str
    type: str
    is_new_arrival: bool = False
    color: str
    stock: int = 0
    product_description: Optional[str] = None


class ProductUpdate(SQLModel):
    name: Optional[str] = None
    price: Optional[int] = None
    image_url: Optional[str] = None
    back_image_url: Optional[str] = None
    category: Optional[str] = None
    type: Optional[str] = None
    is_new_arrival: Optional[bool] = None
    color: Optional[str] = None
    stock: Optional[int] = None
    product_description: Optional[str] = None


class OrderUpdateStatus(SQLModel):
    status: str
