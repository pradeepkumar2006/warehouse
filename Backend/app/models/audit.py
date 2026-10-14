from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(50), primary_key=True, index=True)  # e.g. 'LOG-101'
    user = Column(String(100), nullable=False)
    action = Column(String(255), nullable=False)
    module = Column(String(100), nullable=False)
    time = Column(String(50), default="")
    ip = Column(String(50), default="127.0.0.1")
    created_at = Column(DateTime, default=datetime.utcnow)
