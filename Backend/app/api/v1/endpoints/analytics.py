from fastapi import APIRouter, Depends, Query
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.audit import AuditLog
from app.schemas.analytics import AuditLogCreate
from datetime import datetime

router = APIRouter()

@router.get("/analytics/metrics")
def get_analytics_metrics(range: str = Query("7d"), zone: str = Query("All Zones")):
    return {
        "predictionAccuracy": 92.4,
        "avgLeadTimeMin": 14.0,
        "bottlenecksPrevented": 37,
        "avgAlertResponseTimeMin": 3.2,
        "chartData": {
            "congestionTrend": [70, 50, 85, 60, 40, 75, 30],
            "predictedVsActual": {
                "predicted": [75, 65, 40, 45, 50, 25, 20],
                "actual": [80, 68, 45, 42, 55, 30, 25],
            },
        },
    }

@router.get("/audit/logs")
def get_audit_logs(db: Session = Depends(get_db)):
    logs = db.query(AuditLog).order_by(AuditLog.created_at.desc()).limit(50).all()
    result = []
    for l in logs:
        result.append({
            "id": l.id,
            "user": l.user,
            "action": l.action,
            "module": l.module,
            "time": l.time or "10:00",
            "ip": l.ip
        })
    return result

@router.post("/audit/logs")
def create_audit_log(payload: AuditLogCreate, db: Session = Depends(get_db)):
    count = db.query(AuditLog).count() + 1
    log = AuditLog(
        id=f"LOG-{count:03d}",
        user=payload.user,
        action=payload.action,
        module=payload.module,
        time=payload.time or datetime.utcnow().strftime("%H:%M"),
        ip=payload.ip
    )
    db.add(log)
    db.commit()
    return {"success": True}
