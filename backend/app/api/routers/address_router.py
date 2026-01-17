from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from typing import List
import uuid

from app.database import get_session
from app.models import User, Address
from app.api.cart import get_current_user
from app.schemas import UserRead

router = APIRouter()


@router.get("/addresses", response_model=List[Address])
def get_addresses(
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    """
    Get all addresses for the current user.
    Returns the primary address (from User profile) converted to Address format
    PLUS any additional addresses.
    """
    addresses = []

    # Add Primary Address from User Profile if it exists
    if current_user.address:
        primary_addr = Address(
            id=uuid.UUID(
                int=0
            ),  # Dummy ID for UI handling, or we can leave it None/Generate one on fly if needed for React keys
            user_id=current_user.id,
            full_name=current_user.full_name,
            address_line1=current_user.address,
            city=current_user.city or "",
            state=current_user.state or "",
            zip_code=current_user.zip_code or "",
            country=current_user.country or "India",
            phone_number=current_user.phone_number or "",
            is_default=True,  # Treat primary as default implicitly unless logic changes
        )
        # We assign a static ID for the primary so frontend can identify it,
        # BUT this might conflict if we try to 'delete' it via this ID.
        # For now, let's just send it.
        # better approach: The frontend should know "Primary" is special.
        addresses.append(primary_addr)

    # Add Additional Addresses
    statement = select(Address).where(Address.user_id == current_user.id)
    additional_addresses = session.exec(statement).all()
    addresses.extend(additional_addresses)

    return addresses


@router.post("/addresses", response_model=Address)
def create_address(
    address: Address,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    address.user_id = current_user.id
    session.add(address)
    session.commit()
    session.refresh(address)
    return address


@router.delete("/addresses/{address_id}")
def delete_address(
    address_id: uuid.UUID,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_user),
):
    address = session.get(Address, address_id)
    if not address:
        raise HTTPException(status_code=404, detail="Address not found")
    if address.user_id != current_user.id:
        raise HTTPException(
            status_code=403, detail="Not authorized to delete this address"
        )

    session.delete(address)
    session.commit()
    return {"ok": True}
