from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from app.db.base import Base

class SupportContact(Base):
    __tablename__ = "support_contacts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String)
    type = Column(String)  # family, friend, professional, school
    phone = Column(String, nullable=True)
    email = Column(String, nullable=True)

    user = relationship("User", back_populates="contacts") 