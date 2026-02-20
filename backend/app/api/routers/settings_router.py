from fastapi import APIRouter, Depends, HTTPException
from sqlmodel import Session, select
from app.database import get_session
from app.models import SiteSettings, User
from app.api.routers.cart import get_current_user
import json

router = APIRouter()


def get_current_admin_user(current_user: User = Depends(get_current_user)):
    if current_user.role != "admin":
        raise HTTPException(status_code=403, detail="Not authorized")
    return current_user


@router.get("/settings")
def get_settings(session: Session = Depends(get_session)):
    settings = session.exec(select(SiteSettings).where(SiteSettings.id == 1)).first()
    if not settings:
        # Create default if not exists
        settings = SiteSettings()
        session.add(settings)
        session.commit()
        session.refresh(settings)
    return settings


@router.put("/settings")
def update_settings(
    settings_update: SiteSettings,
    session: Session = Depends(get_session),
    current_user: User = Depends(get_current_admin_user),
):
    settings = session.exec(select(SiteSettings).where(SiteSettings.id == 1)).first()
    if not settings:
        settings = SiteSettings()
        session.add(settings)

    settings.price_range_min = settings_update.price_range_min
    settings.price_range_max = settings_update.price_range_max
    settings.price_range_step = settings_update.price_range_step

    session.add(settings)
    session.commit()
    session.refresh(settings)
    return settings
