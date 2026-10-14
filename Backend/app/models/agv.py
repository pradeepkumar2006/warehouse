from datetime import datetime
from sqlalchemy import Column, String, Integer, Float, DateTime
from app.core.database import Base

class AGV(Base):
    __tablename__ = "agvs"

    id = Column(String(50), primary_key=True, index=True)  # e.g. 'AGV-01'
    name = Column(String(50), nullable=False)
    battery = Column(Integer, default=100)
    status = Column(String(50), default="Idle")  # 'Navigating', 'Docked', 'Queued', 'Charging', 'Idle'
    current_zone = Column(String(50), default="Zone 1 (Inbound)")
    current_x = Column(Float, default=10.0)
    current_y = Column(Float, default=20.0)
    target_node = Column(String(50), default="Aisle B")
    payload_kg = Column(Float, default=0.0)
    velocity_mps = Column(Float, default=1.2)
    queue_delay_sec = Column(Integer, default=0)
    last_ping = Column(DateTime, default=datetime.utcnow)
