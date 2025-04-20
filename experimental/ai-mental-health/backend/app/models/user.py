from sqlalchemy import Boolean, Column, Integer, String, Date, DateTime
from sqlalchemy.orm import relationship
from sqlalchemy.sql import func
from app.db.base import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True)
    username = Column(String, unique=True, index=True)
    hashed_password = Column(String)
    date_of_birth = Column(Date)
    is_active = Column(Boolean, default=True)
    is_minor = Column(Boolean, default=False)
    has_parental_consent = Column(Boolean, default=False)
    preferred_language = Column(String, default="en")
    full_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    # Relationships
    mood_entries = relationship("MoodEntry", back_populates="user")
    contacts = relationship("SupportContact", back_populates="user") 