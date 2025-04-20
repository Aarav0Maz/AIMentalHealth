from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # AI Service Configuration
    OLLAMA_BASE_URL: str = "http://localhost:11434"
    MODEL_NAME: str = "llama2"
    MAX_TOKENS: int = 1000
    TEMPERATURE: float = 0.7

    # Security
    SECRET_KEY: str = "your-secret-key-here"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30

    # Database
    DATABASE_URL: str = "sqlite:///./app.db"

    class Config:
        env_file = ".env"
        case_sensitive = True

settings = Settings() 