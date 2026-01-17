import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.database import get_session
from app.models import Product

router = APIRouter()


@router.get("", response_model=List[Product])
def read_products(
    category: str = None, type: str = None, session: Session = Depends(get_session)
):
    query = select(Product)
    if category and category.lower() != "all":
        # Case-insensitive matching
        query = query.where(Product.category.ilike(category))
    if type and type.lower() != "all":
        query = query.where(Product.type.ilike(type))
    return session.exec(query).all()


@router.get("/{product_id}", response_model=Product)
def read_product(product_id: uuid.UUID, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product
