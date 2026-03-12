import uuid
from typing import List
from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.database import get_session
from app.models import CartItem, Product, ProductSizeStock, User
from app.schemas import CartItemCreate, CartItemRead
from app.core import security
from app.core.config import settings
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt

router = APIRouter()
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="api/auth/login")


def get_current_user(
    token: str = Depends(oauth2_scheme), session: Session = Depends(get_session)
) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        email: str = payload.get("sub")
        if email is None:
            raise credentials_exception
    except JWTError:
        raise credentials_exception

    query = select(User).where(User.email == email)
    user = session.exec(query).first()
    if user is None:
        raise credentials_exception
    return user


@router.get("", response_model=List[CartItemRead])
def get_cart_items(
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    query = (
        select(CartItem)
        .where(CartItem.user_id == current_user.id)
        .options(selectinload(CartItem.product))
    )
    return session.exec(query).all()


@router.post("", response_model=CartItemRead)
def add_to_cart(
    item: CartItemCreate,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    # Check if product exists
    product = session.get(Product, item.product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Check size-specific stock
    size_stock = session.exec(
        select(ProductSizeStock).where(
            ProductSizeStock.product_id == item.product_id,
            ProductSizeStock.size == item.size,
        )
    ).first()

    if not size_stock:
        raise HTTPException(status_code=400, detail=f"Size '{item.size}' is not available for this product")
    if size_stock.stock <= 0:
        raise HTTPException(status_code=400, detail=f"Size '{item.size}' is out of stock")

    cart_item = CartItem(**item.model_dump(), user_id=current_user.id)

    session.add(cart_item)
    session.commit()
    session.refresh(cart_item)
    return cart_item


@router.delete("/{id}")
def remove_from_cart(
    id: uuid.UUID,
    current_user: User = Depends(get_current_user),
    session: Session = Depends(get_session),
):
    item = session.get(CartItem, id)
    if not item:
        raise HTTPException(status_code=404, detail="Item not found")
    if item.user_id != current_user.id:
        raise HTTPException(status_code=403, detail="Not authorized")

    session.delete(item)
    session.commit()
    return {"ok": True}
