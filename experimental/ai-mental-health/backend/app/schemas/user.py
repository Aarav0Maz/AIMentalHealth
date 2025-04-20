from datetime import date
from pydantic import BaseModel

class UserBase(BaseModel):
    email: str
    username: str
    preferred_language: str = "en"

class UserCreate(UserBase):
    password: str
    date_of_birth: date
    has_parental_consent: bool = False

class UserLogin(BaseModel):
    email: str
    password: str

class UserResponse(UserBase):
    id: int
    is_minor: bool
    has_parental_consent: bool

    class Config:
        orm_mode = True

class Token(BaseModel):
    access_token: str
    token_type: str