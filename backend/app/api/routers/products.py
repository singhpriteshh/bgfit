import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from app.database import get_session
from app.models import Product
from app.api.routers.deps import get_current_admin_user
from app.schemas import ProductCreate, ProductUpdate
from app.models import User

router = APIRouter()


@router.get("", response_model=List[Product])
def read_products(
    category: str = None,
    type: str = None,
    min_price: int = None,
    max_price: int = None,
    color: str = None,
    sort: str = None,
    session: Session = Depends(get_session),
):
    query = select(Product)
    if category and category.lower() != "all":
        # Case-insensitive matching
        query = query.where(Product.category.ilike(category))
    if type and type.lower() != "all":
        query = query.where(Product.type.ilike(type))
    
    # New filters
    if min_price is not None:
        query = query.where(Product.price >= min_price)
    if max_price is not None:
        query = query.where(Product.price <= max_price)
    if color and color.lower() != "all":
        query = query.where(Product.color.ilike(color))
        
    # Sorting
    if sort:
        if sort == "price_asc":
            query = query.order_by(Product.price.asc())
        elif sort == "price_desc":
            query = query.order_by(Product.price.desc())
        elif sort == "newest":
            query = query.order_by(Product.is_new_arrival.desc())
            
    return session.exec(query).all()


@router.get("/{product_id}", response_model=Product)
def read_product(product_id: uuid.UUID, session: Session = Depends(get_session)):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

# Admin Endpoints

@router.post("", response_model=Product)
def create_product(
    product_in: ProductCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin_user),
):
    product = Product.model_validate(product_in)
    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.put("/{product_id}", response_model=Product)
def update_product(
    product_id: uuid.UUID,
    product_update: ProductUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin_user),
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product_data = product_update.model_dump(exclude_unset=True)
    for key, value in product_data.items():
        setattr(product, key, value)

    session.add(product)
    session.commit()
    session.refresh(product)
    return product


@router.delete("/{product_id}")
def delete_product(
    product_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin_user),
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    session.delete(product)
    session.commit()
    return {"ok": True}
