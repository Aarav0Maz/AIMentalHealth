from sqlalchemy.orm import Session
from app.db.base import Base, engine
from app.models.user import User

def init_db() -> None:
    Base.metadata.create_all(bind=engine)

if __name__ == "__main__":
    init_db()
    print("Database initialized successfully!") 