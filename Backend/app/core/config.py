import os
from pathlib import Path
from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    PROJECT_NAME: str = "TwinFlow AI Digital Twin Warehouse Backend"
    API_V1_STR: str = "/api/v1"
    
    # Base directory
    BASE_DIR: Path = Path(__file__).resolve().parent.parent.parent
    
    # Database
    DATABASE_URL: str = f"sqlite:///{BASE_DIR / 'twinflow.db'}"
    
    # JWT Authentication
    SECRET_KEY: str = "twinflow_secret_key_production_grade_random_2026_super_secure"
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60 * 24  # 24 hours
    
    # Reports Storage
    STORAGE_DIR: Path = BASE_DIR / "storage"
    REPORTS_DIR: Path = BASE_DIR / "storage" / "reports"
    
    # CORS
    BACKEND_CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "*"
    ]

    class Config:
        case_sensitive = True

settings = Settings()

# Ensure storage directories exist
os.makedirs(settings.REPORTS_DIR, exist_ok=True)
