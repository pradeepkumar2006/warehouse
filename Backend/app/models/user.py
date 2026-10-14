from datetime import datetime
from sqlalchemy import Column, String, DateTime, Boolean
from app.core.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(String(50), primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    name = Column(String(100), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(String(20), default="user")  # 'admin' or 'user'
    status = Column(String(20), default="Active")  # 'Active' or 'Disabled'
    access_level = Column(String(255), default="Standard Operations Access")
    last_login = Column(String(50), default="Never")
    created_at = Column(DateTime, default=datetime.utcnow)
