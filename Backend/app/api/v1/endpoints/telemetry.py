import asyncio
import json
import random
from typing import List
from fastapi import APIRouter, WebSocket, WebSocketDisconnect, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db, SessionLocal
from app.models.agv import AGV
from app.models.alert import BottleneckAlert

router = APIRouter()

class ConnectionManager:
    def __init__(self):
        self.active_connections: List[WebSocket] = []

    async def connect(self, websocket: WebSocket):
        await websocket.accept()
        self.active_connections.append(websocket)

    def disconnect(self, websocket: WebSocket):
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)

    async def broadcast(self, message: dict):
        for connection in self.active_connections:
            try:
                await connection.send_json(message)
            except Exception:
                pass

manager = ConnectionManager()

@router.get("/telemetry/live")
def get_live_telemetry_stats(db: Session = Depends(get_db)):
    total_agvs = db.query(AGV).count()
    active_agvs = db.query(AGV).filter(AGV.status != "Idle").count()
    active_alerts = db.query(BottleneckAlert).filter(BottleneckAlert.status != "Resolved").count()
    
    return {
        "activeAgvs": active_agvs,
        "totalAgvs": total_agvs,
        "avgQueueLength": 14,
        "activeAlertsCount": active_alerts,
        "kafkaPipelineStatus": "Connected",
        "fps": 60
    }

@router.websocket("/ws/telemetry")
async def websocket_telemetry_endpoint(websocket: WebSocket):
    await manager.connect(websocket)
    try:
        while True:
            # Generate simulated real-time movement tick for AGVs
            db = SessionLocal()
            try:
                agvs = db.query(AGV).all()
                agv_list = []
                for agv in agvs:
                    # Micro-movement for realistic dynamic twin
                    dx = (random.random() - 0.5) * 0.4
                    dy = (random.random() - 0.5) * 0.4
                    agv.current_x = max(5.0, min(95.0, agv.current_x + dx))
                    agv.current_y = max(5.0, min(95.0, agv.current_y + dy))
                    agv_list.append({
                        "id": agv.id,
                        "name": agv.name,
                        "battery": agv.battery,
                        "status": agv.status,
                        "zone": agv.current_zone,
                        "x": round(agv.current_x, 2),
                        "y": round(agv.current_y, 2),
                        "velocity": agv.velocity_mps,
                        "payloadKg": agv.payload_kg,
                        "queueDelaySec": agv.queue_delay_sec
                    })
                db.commit()
                
                payload = {
                    "timestamp": asyncio.get_event_loop().time(),
                    "activeAgvs": len([a for a in agv_list if a["status"] != "Idle"]),
                    "totalAgvs": len(agv_list),
                    "pipelineStatus": "Connected",
                    "agvs": agv_list,
                    "aisleBCongestion": 87 + random.randint(-2, 2)
                }
                await websocket.send_json(payload)
            finally:
                db.close()
                
            await asyncio.sleep(1.0)
    except WebSocketDisconnect:
        manager.disconnect(websocket)
    except Exception:
        manager.disconnect(websocket)
