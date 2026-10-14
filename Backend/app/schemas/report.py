from typing import Optional
from pydantic import BaseModel

class ReportResponse(BaseModel):
    id: str
    name: str
    type: str
    date: str
    format: str
    createdBy: str
    status: str
    size: str

    class Config:
        from_attributes = True

class ReportGenerateRequest(BaseModel):
    type: str = "Daily Summary"
    dateRange: str = "Last 7 Days"
    format: str = "PDF"
    includeCharts: bool = True
    customReportName: Optional[str] = None
    createdBy: Optional[str] = "Sarah Lin (Admin)"

class ReportGenerateResponse(BaseModel):
    success: bool
    reportId: str
    status: str
