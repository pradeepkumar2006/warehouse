from typing import List, Dict, Any
from pydantic import BaseModel

class ChartPredictedVsActual(BaseModel):
    predicted: List[float]
    actual: List[float]

class ChartData(BaseModel):
    congestionTrend: List[float]
    predictedVsActual: ChartPredictedVsActual

class AnalyticsMetricsResponse(BaseModel):
    predictionAccuracy: float
    avgLeadTimeMin: float
    bottlenecksPrevented: int
    avgAlertResponseTimeMin: float
    chartData: ChartData

class AuditLogItem(BaseModel):
    id: str
    user: str
    action: str
    module: str
    time: str
    ip: str

    class Config:
        from_attributes = True

class AuditLogCreate(BaseModel):
    action: str
    module: str
    user: str = "admin"
    time: str = ""
    ip: str = "127.0.0.1"
