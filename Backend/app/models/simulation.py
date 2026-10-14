from datetime import datetime
from sqlalchemy import Column, String, Integer, DateTime
from app.core.database import Base

class SimulationScenario(Base):
    __tablename__ = "simulation_scenarios"

    id = Column(String(50), primary_key=True, index=True)  # e.g. 'SCEN-01'
    name = Column(String(255), nullable=False)
    agvs = Column(Integer, default=20)
    volume = Column(String(50), default="+20%")
    closed = Column(String(100), default="None")
    expected_risk = Column(Integer, default=70)
    date = Column(String(50), default="")
    created_at = Column(DateTime, default=datetime.utcnow)
