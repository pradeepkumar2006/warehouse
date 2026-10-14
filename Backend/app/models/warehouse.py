from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime
from app.core.database import Base

class SystemThreshold(Base):
    __tablename__ = "system_thresholds"

    id = Column(Integer, primary_key=True, autoincrement=True)
    moderate = Column(Integer, default=40)
    high = Column(Integer, default=70)
    critical = Column(Integer, default=85)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class Aisle(Base):
    __tablename__ = "aisles"

    id = Column(String(50), primary_key=True, index=True)  # e.g. 'AISLE-A'
    name = Column(String(100), nullable=False)
    zone = Column(String(100), nullable=False)
    capacity = Column(Integer, default=50)
    current_occupancy = Column(Integer, default=20)
    status = Column(String(20), default="Active")
    x = Column(Float, default=0.0)
    y = Column(Float, default=0.0)
