from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class ScenarioRunRequest(BaseModel):
    agvCount: Optional[int] = 18
    orderVolumeChange: Optional[int] = 0
    closedAisles: Optional[List[str]] = []

class ScenarioState(BaseModel):
    risk: int
    queue: int
    leadTime: str
    delay: Any

class ScenarioRunResponse(BaseModel):
    success: bool
    before: ScenarioState
    after: ScenarioState
    impact: str

class SavedScenarioResponse(BaseModel):
    id: str
    name: str
    agvs: int
    volume: str
    closed: str
    expectedRisk: int
    date: str

    class Config:
        from_attributes = True
