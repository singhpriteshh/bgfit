import uuid
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, Query
from sqlmodel import Session, select
from sqlalchemy.orm import selectinload
from app.database import get_session
from app.models import Product, ProductSizeStock
from app.api.routers.deps import get_current_admin_user
from app.schemas import ProductCreate, ProductUpdate, ProductRead
from app.models import User

router = APIRouter()


@router.get("", response_model=List[ProductRead])
def read_products(
    category: str = None,
    type: str = None,
    min_price: int = None,
    max_price: int = None,
    color: str = None,
    sort: str = None,
    session: Session = Depends(get_session),
):
    query = select(Product).options(selectinload(Product.size_stocks))
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


@router.get("/{product_id}", response_model=ProductRead)
def read_product(product_id: uuid.UUID, session: Session = Depends(get_session)):
    query = (
        select(Product)
        .where(Product.id == product_id)
        .options(selectinload(Product.size_stocks))
    )
    product = session.exec(query).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product


# Admin Endpoints


@router.post("", response_model=ProductRead)
def create_product(
    product_in: ProductCreate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin_user),
):
    # Extract size_stocks from the input
    size_stocks_data = product_in.size_stocks
    product_data = product_in.model_dump(exclude={"size_stocks"})

    product = Product(**product_data)
    session.add(product)
    session.flush()  # Get the product ID

    # Create size stock entries
    for ss in size_stocks_data:
        size_stock = ProductSizeStock(
            product_id=product.id,
            size=ss.size,
            stock=ss.stock,
        )
        session.add(size_stock)

    session.commit()
    session.refresh(product)

    # Re-query with eager loading
    query = (
        select(Product)
        .where(Product.id == product.id)
        .options(selectinload(Product.size_stocks))
    )
    return session.exec(query).first()


@router.put("/{product_id}", response_model=ProductRead)
def update_product(
    product_id: uuid.UUID,
    product_update: ProductUpdate,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin_user),
):
    product = session.get(Product, product_id)
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    product_data = product_update.model_dump(exclude_unset=True, exclude={"size_stocks"})
    for key, value in product_data.items():
        setattr(product, key, value)

    # Handle size_stocks update (delete-and-replace)
    if product_update.size_stocks is not None:
        # Delete existing size stocks
        existing_stocks = session.exec(
            select(ProductSizeStock).where(ProductSizeStock.product_id == product_id)
        ).all()
        for es in existing_stocks:
            session.delete(es)

        # Insert new size stocks
        for ss in product_update.size_stocks:
            size_stock = ProductSizeStock(
                product_id=product_id,
                size=ss.size,
                stock=ss.stock,
            )
            session.add(size_stock)

    session.add(product)
    session.commit()
    session.refresh(product)

    # Re-query with eager loading
    query = (
        select(Product)
        .where(Product.id == product.id)
        .options(selectinload(Product.size_stocks))
    )
    return session.exec(query).first()


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
