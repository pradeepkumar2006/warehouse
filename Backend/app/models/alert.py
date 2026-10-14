from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime, JSON
from app.core.database import Base

class BottleneckAlert(Base):
    __tablename__ = "alerts"

    id = Column(String(50), primary_key=True, index=True)  # e.g. 'ALT-901'
    severity = Column(String(50), default="High")  # 'Critical', 'High', 'Medium', 'Low'
    title = Column(String(255), nullable=False)
    location = Column(String(100), nullable=False)
    eta = Column(String(50), default="in 10 min")
    confidence = Column(Integer, default=85)
    status = Column(String(50), default="New")  # 'New', 'Acknowledged', 'Resolved'
    assigned_to = Column(String(100), default="Unassigned")
    created_time = Column(String(50), default="")
    expected_delay = Column(String(50), default="5.0 min delay")
    affected_zones = Column(JSON, default=list)  # list of zone names
    root_causes = Column(JSON, default=list)  # list of {feature, value}
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)
