from fastapi import APIRouter, UploadFile, File, HTTPException, Depends
from app.api.routers.deps import get_current_user
from app.models import User
import cloudinary
import cloudinary.uploader

router = APIRouter()

import os

# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_SECRET_KEY"),
)


@router.post("/upload")
async def upload_image(
    file: UploadFile = File(...), current_user: User = Depends(get_current_user)
):
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")

    try:
        # Upload to Cloudinary
        result = cloudinary.uploader.upload(file.file, folder="bgfit_products")
        return {"url": result.get("secure_url")}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Image upload failed: {str(e)}")
