from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from datetime import datetime
from app.db.base import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.schemas.user import UserResponse
from pydantic import BaseModel

router = APIRouter()

class MoodEntry(BaseModel):
    mood: str
    timestamp: datetime = datetime.utcnow()

class SupportContact(BaseModel):
    name: str
    type: str
    phone: str = None
    email: str = None

@router.get("/me", response_model=UserResponse)
async def read_user_me(current_user: User = Depends(get_current_user)):
    return current_user

@router.post("/mood")
async def record_mood(
    mood_data: MoodEntry,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Implement mood tracking in database
    return {"status": "success", "message": "Mood recorded"}

@router.get("/contacts")
async def get_contacts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Implement contact retrieval from database
    # For now, return mock data
    mock_contacts = [
        {"id": 1, "name": "Family Doctor", "type": "professional"},
        {"id": 2, "name": "School Counselor", "type": "school"},
        {"id": 3, "name": "Emergency Contact", "type": "family"}
    ]
    return mock_contacts

@router.post("/contacts")
async def add_contact(
    contact: SupportContact,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Implement contact addition to database
    return {"status": "success", "message": "Contact added"}

@router.get("/resources")
async def get_resources(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    # TODO: Implement resource retrieval from database
    # Return mock data for now
    resources = [
        {
            "id": 1,
            "title": "Crisis Helpline",
            "description": "24/7 support line",
            "contact": "1-800-XXX-XXXX"
        },
        {
            "id": 2,
            "title": "Local Mental Health Clinic",
            "description": "Professional counseling services",
            "address": "123 Health St, Ontario"
        }
    ]
    return resources 