from datetime import datetime
from sqlalchemy import Column, String, DateTime
from app.core.database import Base

class Report(Base):
    __tablename__ = "reports"

    id = Column(String(50), primary_key=True, index=True)  # e.g. 'REP-001'
    name = Column(String(255), nullable=False)
    type = Column(String(100), nullable=False)  # 'Weekly Congestion', 'Model Performance', etc.
    date = Column(String(50), nullable=False)
    format = Column(String(20), default="PDF")  # 'PDF' or 'CSV'
    created_by = Column(String(100), default="System")
    status = Column(String(50), default="Ready")  # 'Ready', 'Generating', 'Failed'
    size = Column(String(50), default="1.5 MB")
    file_path = Column(String(255), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
