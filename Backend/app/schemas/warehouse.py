from typing import List, Optional
from pydantic import BaseModel

class ThresholdsSchema(BaseModel):
    moderate: int = 40
    high: int = 70
    critical: int = 85

class AisleSchema(BaseModel):
    id: str
    name: str
    zone: str
    capacity: int
    status: str
    x: float
    y: float
    current_occupancy: Optional[int] = None

    class Config:
        from_attributes = True

class WarehouseConfigResponse(BaseModel):
    thresholds: ThresholdsSchema
    aisles: List[AisleSchema]

class WarehouseConfigUpdate(BaseModel):
    thresholds: Optional[ThresholdsSchema] = None
    aisles: Optional[List[AisleSchema]] = None

class LiveTelemetryStats(BaseModel):
    activeAgvs: int
    totalAgvs: int
    avgQueueLength: int
    activeAlertsCount: int
    kafkaPipelineStatus: str
    fps: int
