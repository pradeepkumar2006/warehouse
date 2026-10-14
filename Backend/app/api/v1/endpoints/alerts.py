from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.alert import BottleneckAlert
from datetime import datetime

router = APIRouter()

@router.get("/alerts")
def get_alerts(db: Session = Depends(get_db)):
    alerts = db.query(BottleneckAlert).order_by(BottleneckAlert.created_at.desc()).all()
    result = []
    for a in alerts:
        result.append({
            "id": a.id,
            "severity": a.severity,
            "title": a.title,
            "location": a.location,
            "eta": a.eta,
            "confidence": a.confidence,
            "status": a.status,
            "assignedTo": a.assigned_to,
            "createdTime": a.created_time or "10:30 AM",
            "expectedDelay": a.expected_delay,
            "affectedZones": a.affected_zones or [],
            "rootCauses": a.root_causes or []
        })
    return result

@router.post("/alerts/{id}/acknowledge")
def acknowledge_alert(id: str, db: Session = Depends(get_db)):
    alert = db.query(BottleneckAlert).filter(BottleneckAlert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.status = "Acknowledged"
    db.commit()
    return {"success": True, "id": id, "status": "Acknowledged"}

@router.post("/alerts/{id}/resolve")
def resolve_alert(id: str, db: Session = Depends(get_db)):
    alert = db.query(BottleneckAlert).filter(BottleneckAlert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    alert.status = "Resolved"
    alert.resolved_at = datetime.utcnow()
    db.commit()
    return {"success": True, "id": id, "status": "Resolved"}

@router.delete("/alerts/{id}")
def delete_alert(id: str, db: Session = Depends(get_db)):
    alert = db.query(BottleneckAlert).filter(BottleneckAlert.id == id).first()
    if not alert:
        raise HTTPException(status_code=404, detail="Alert not found")
        
    db.delete(alert)
    db.commit()
    return {"success": True, "id": id}
