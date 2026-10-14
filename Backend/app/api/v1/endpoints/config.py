from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.warehouse import SystemThreshold, Aisle
from app.models.audit import AuditLog
from app.schemas.warehouse import WarehouseConfigResponse, WarehouseConfigUpdate
from datetime import datetime

router = APIRouter()

@router.get("/config")
def get_warehouse_config(db: Session = Depends(get_db)):
    threshold = db.query(SystemThreshold).first()
    if not threshold:
        threshold = SystemThreshold(moderate=40, high=70, critical=85)
        db.add(threshold)
        db.commit()
        db.refresh(threshold)
        
    aisles = db.query(Aisle).all()
    
    return {
        "thresholds": {
            "moderate": threshold.moderate,
            "high": threshold.high,
            "critical": threshold.critical
        },
        "aisles": [
            {
                "id": a.id,
                "name": a.name,
                "zone": a.zone,
                "capacity": a.capacity,
                "status": a.status,
                "x": a.x,
                "y": a.y
            } for a in aisles
        ]
    }

@router.put("/config")
def update_warehouse_config(payload: dict, db: Session = Depends(get_db)):
    threshold = db.query(SystemThreshold).first()
    if not threshold:
        threshold = SystemThreshold()
        db.add(threshold)
        
    if "thresholds" in payload and payload["thresholds"]:
        t = payload["thresholds"]
        if "moderate" in t: threshold.moderate = int(t["moderate"])
        if "high" in t: threshold.high = int(t["high"])
        if "critical" in t: threshold.critical = int(t["critical"])
        
    if "aisles" in payload and isinstance(payload["aisles"], list):
        for item in payload["aisles"]:
            a = db.query(Aisle).filter(Aisle.id == item.get("id")).first()
            if a:
                if "name" in item: a.name = item["name"]
                if "capacity" in item: a.capacity = int(item["capacity"])
                if "status" in item: a.status = item["status"]
                if "x" in item: a.x = float(item["x"])
                if "y" in item: a.y = float(item["y"])
                
    db.commit()
    
    # Record audit log
    log = AuditLog(
        id=f"LOG-{int(datetime.utcnow().timestamp())}",
        user="admin",
        action="Updated warehouse layout and tripwire thresholds",
        module="Warehouse Config",
        time=datetime.utcnow().strftime("%H:%M"),
        ip="127.0.0.1"
    )
    db.add(log)
    db.commit()
    
    return {"success": True, "timestamp": int(datetime.utcnow().timestamp())}
