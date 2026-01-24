from fastapi import APIRouter, Depends, HTTPException
import razorpay
import os
from app.core import security
from app.models import User
from app.api.routers.cart import get_current_user

router = APIRouter()


@router.post("/create-order")
def create_order(
    amount: int, currency: str = "INR", current_user: User = Depends(get_current_user)
):
    try:
        key_id = os.getenv("RAZORPAY_KEY_ID")
        key_secret = os.getenv("RAZORPAY_KEY_SECRET")

        if not key_id or not key_secret:
            raise ValueError("Razorpay keys are missing in environment variables")

        client = razorpay.Client(auth=(key_id, key_secret))
        data = {"amount": amount, "currency": currency, "payment_capture": "1"}
        order = client.order.create(data=data)
        serialized_order = {
            "id": order["id"],
            "entity": order["entity"],
            "amount": order["amount"],
            "currency": order["currency"],
            "status": order["status"],
            "key_id": key_id,  # Send Key ID to frontend for Checkout script
        }
        return serialized_order
    except Exception as e:
        import traceback

        traceback.print_exc()
        raise HTTPException(status_code=400, detail=str(e))
