from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.core.database import get_db
from app.models.simulation import SimulationScenario
from app.schemas.simulation import ScenarioRunRequest

router = APIRouter()

@router.post("/simulation/run")
def run_simulation(payload: ScenarioRunRequest):
    agv_delta = (payload.agvCount or 18) - 18
    volume_delta = (payload.orderVolumeChange or 0) / 100
    closed_count = len(payload.closedAisles or [])

    simulated_risk = min(
        99,
        max(15, round(87 - agv_delta * 1.8 + volume_delta * 28 + closed_count * 14))
    )
    delay = max(1.2, round(6.4 - agv_delta * 0.2 + volume_delta * 2.5 + closed_count * 1.1, 1))
    simulated_queue = max(5, round(22 - agv_delta * 0.8 + volume_delta * 8 + closed_count * 5))

    return {
        "success": True,
        "before": {
            "risk": 87,
            "queue": 22,
            "leadTime": "14.2 min",
            "delay": 6.4
        },
        "after": {
            "risk": simulated_risk,
            "queue": simulated_queue,
            "leadTime": f"{round(14.2 * (simulated_risk / 87), 1)} min",
            "delay": delay
        },
        "impact": f"Net Congestion Reduction: -{87 - simulated_risk}%" if simulated_risk < 87 else "Congestion Surge Expected"
    }

@router.get("/simulation/scenarios")
def get_saved_scenarios(db: Session = Depends(get_db)):
    scenarios = db.query(SimulationScenario).all()
    result = []
    for s in scenarios:
        result.append({
            "id": s.id,
            "name": s.name,
            "agvs": s.agvs,
            "volume": s.volume,
            "closed": s.closed,
            "expectedRisk": s.expected_risk,
            "date": s.date
        })
    return result
