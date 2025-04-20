from sqlalchemy import Column, Integer, String, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from datetime import datetime
from app.db.base import Base

class MoodEntry(Base):
    __tablename__ = "mood_entries"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    mood = Column(String)
    timestamp = Column(DateTime, default=datetime.utcnow)
    notes = Column(String, nullable=True)

    user = relationship("User", back_populates="mood_entries") 