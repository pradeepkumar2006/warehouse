from typing import List, Optional, Any, Dict
from pydantic import BaseModel

class RootCauseItem(BaseModel):
    feature: str
    value: str

class AlertResponse(BaseModel):
    id: str
    severity: str
    title: str
    location: str
    eta: str
    confidence: int
    status: str
    assignedTo: str
    createdTime: str
    expectedDelay: str
    affectedZones: List[str]
    rootCauses: List[Dict[str, Any]]

    class Config:
        from_attributes = True

class AlertActionResponse(BaseModel):
    success: bool
    id: str
    status: Optional[str] = None
