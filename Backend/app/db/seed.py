from datetime import datetime
from sqlalchemy.orm import Session
from app.core.database import SessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models import (
    User,
    SystemThreshold,
    Aisle,
    AGV,
    BottleneckAlert,
    Report,
    SimulationScenario,
    AuditLog
)

def seed_database(db: Session):
    # 1. Users
    if db.query(User).count() == 0:
        users = [
            User(
                id="USR-01",
                username="admin",
                name="Sarah Lin",
                email="admin@twinflow.ai",
                hashed_password=get_password_hash("admin123"),
                role="admin",
                status="Active",
                access_level="Full Administrative & Topology Access",
                last_login="Just now"
            ),
            User(
                id="USR-02",
                username="operator",
                name="Sam Haddad",
                email="operator@twinflow.ai",
                hashed_password=get_password_hash("operator123"),
                role="user",
                status="Active",
                access_level="Real-time Congestion Monitoring",
                last_login="15 mins ago"
            ),
            User(
                id="USR-03",
                username="david.chen",
                name="David Chen",
                email="d.chen@twinflow.ai",
                hashed_password=get_password_hash("david123"),
                role="admin",
                status="Active",
                access_level="Full Administrative & Topology Access",
                last_login="2 hours ago"
            ),
            User(
                id="USR-04",
                username="marcus.vance",
                name="Marcus Vance",
                email="m.vance@twinflow.ai",
                hashed_password=get_password_hash("marcus123"),
                role="user",
                status="Active",
                access_level="Floor Lead Operations",
                last_login="1 hour ago"
            ),
            User(
                id="USR-05",
                username="elena.rostova",
                name="Elena Rostova",
                email="e.rostova@twinflow.ai",
                hashed_password=get_password_hash("elena123"),
                role="user",
                status="Active",
                access_level="Sortation Line Lead",
                last_login="Yesterday"
            ),
            User(
                id="USR-06",
                username="ramesh.kumar",
                name="Ramesh Kumar",
                email="r.kumar@twinflow.ai",
                hashed_password=get_password_hash("ramesh123"),
                role="user",
                status="Active",
                access_level="Inbound Receiving Coordinator",
                last_login="3 days ago"
            ),
            User(
                id="USR-07",
                username="lucas.mayer",
                name="Lucas Mayer",
                email="l.mayer@twinflow.ai",
                hashed_password=get_password_hash("lucas123"),
                role="user",
                status="Active",
                access_level="Fleet Robotics Specialist",
                last_login="5 days ago"
            ),
            User(
                id="USR-08",
                username="maya.patel",
                name="Maya Patel",
                email="m.patel@twinflow.ai",
                hashed_password=get_password_hash("maya123"),
                role="user",
                status="Disabled",
                access_level="Standard Operations Access",
                last_login="2 weeks ago"
            ),
        ]
        db.add_all(users)
        db.commit()
        print("[OK] Seeded Users")

    # 2. System Thresholds
    if db.query(SystemThreshold).count() == 0:
        threshold = SystemThreshold(moderate=40, high=70, critical=85)
        db.add(threshold)
        db.commit()
        print("[OK] Seeded System Thresholds")

    # 3. Aisles
    if db.query(Aisle).count() == 0:
        aisles = [
            Aisle(id="AISLE-A", name="Aisle A (Inbound)", zone="Zone 1 (Inbound)", capacity=45, current_occupancy=28, status="Active", x=20.0, y=30.0),
            Aisle(id="AISLE-B", name="Aisle B (Hotspot Central)", zone="Zone 2 (Storage)", capacity=60, current_occupancy=53, status="Active", x=50.0, y=30.0),
            Aisle(id="AISLE-C", name="Aisle C (Buffer Storage)", zone="Zone 2 (Storage)", capacity=55, current_occupancy=32, status="Active", x=20.0, y=70.0),
            Aisle(id="AISLE-D", name="Aisle D (Sortation Feed)", zone="Zone 3 (Sortation)", capacity=40, current_occupancy=19, status="Active", x=50.0, y=70.0),
        ]
        db.add_all(aisles)
        db.commit()
        print("[OK] Seeded Aisles")

    # 4. Realistic 22 AGV Fleet
    if db.query(AGV).count() == 0:
        agvs = []
        statuses = ["Navigating", "Navigating", "Queued", "Navigating", "Docked", "Queued", "Navigating", "Navigating"]
        zones = ["Zone 1 (Inbound)", "Zone 2 (Storage)", "Zone 2 (Storage)", "Zone 3 (Sortation)"]
        
        for i in range(1, 23):
            agv_id = f"AGV-{i:02d}"
            status = statuses[i % len(statuses)]
            zone = zones[i % len(zones)]
            battery = 70 + (i * 3) % 29  # 70% to 98%
            velocity = 1.2 if status == "Navigating" else (0.0 if status in ["Docked", "Queued"] else 0.8)
            queue_delay = 120 + (i * 15) if status == "Queued" else 0
            payload = 180.5 + (i * 22.0)
            
            agvs.append(
                AGV(
                    id=agv_id,
                    name=f"RoboCarrier {agv_id}",
                    battery=battery,
                    status=status,
                    current_zone=zone,
                    current_x=15.0 + (i * 3.5) % 65.0,
                    current_y=20.0 + (i * 2.8) % 60.0,
                    target_node="Aisle B (Hotspot)" if i % 2 == 0 else "Sortation J-04",
                    payload_kg=round(payload, 1),
                    velocity_mps=velocity,
                    queue_delay_sec=queue_delay
                )
            )
        db.add_all(agvs)
        db.commit()
        print("[OK] Seeded 22 AGV Fleet")

    # 5. Bottleneck Alerts
    if db.query(BottleneckAlert).count() == 0:
        alerts = [
            BottleneckAlert(
                id="ALT-901",
                severity="Critical",
                title="Aisle B congestion expected",
                location="Aisle B (Racks B1-B8)",
                eta="in 12 min",
                confidence=89,
                status="New",
                assigned_to="Sam Haddad",
                created_time="10:32 AM",
                expected_delay="6.4 min delay",
                affected_zones=["Zone 2 (Storage)", "Zone 3 (Sortation)"],
                root_causes=[
                    {"feature": "Aisle B Occupancy", "value": "88% (Threshold > 70%)"},
                    {"feature": "Queue Length", "value": "22 AGVs in queue"},
                    {"feature": "Conveyor Load", "value": "92% motorized speed"}
                ]
            ),
            BottleneckAlert(
                id="ALT-902",
                severity="High",
                title="Sortation feed rate overload",
                location="Junction J-04 (Sortation Hub)",
                eta="in 24 min",
                confidence=76,
                status="Acknowledged",
                assigned_to="Marcus Vance",
                created_time="10:20 AM",
                expected_delay="4.1 min delay",
                affected_zones=["Zone 3 (Sortation)"],
                root_causes=[
                    {"feature": "Order Wave Surge", "value": "+35% inflow"},
                    {"feature": "Buffer Rack Fill", "value": "82%"}
                ]
            ),
            BottleneckAlert(
                id="ALT-903",
                severity="Medium",
                title="Dock 2 inbound queue buildup",
                location="Inbound Dock 2",
                eta="in 45 min",
                confidence=68,
                status="Resolved",
                assigned_to="Sarah Lin",
                created_time="09:45 AM",
                expected_delay="2.5 min delay",
                affected_zones=["Zone 1 (Inbound)"],
                root_causes=[
                    {"feature": "Pallet Delivery Surge", "value": "4 trucks staged"}
                ]
            )
        ]
        db.add_all(alerts)
        db.commit()
        print("[OK] Seeded Bottleneck Alerts")

    # 6. Reports Metadata
    if db.query(Report).count() == 0:
        reports = [
            Report(
                id="REP-001",
                name="Q3 Congestion Weekly Audit",
                type="Weekly Congestion",
                date="2026-10-06",
                format="PDF",
                created_by="Sarah Lin (Admin)",
                status="Ready",
                size="2.4 MB"
            ),
            Report(
                id="REP-002",
                name="DSTGT Model Accuracy Benchmark",
                type="Model Performance",
                date="2026-10-05",
                format="CSV",
                created_by="Sarah Lin (Admin)",
                status="Ready",
                size="840 KB"
            ),
            Report(
                id="REP-003",
                name="Shift Bottleneck & Alert Log",
                type="Alert History",
                date="2026-10-04",
                format="PDF",
                created_by="Sam Haddad (Lead)",
                status="Ready",
                size="3.1 MB"
            )
        ]
        db.add_all(reports)
        db.commit()
        print("[OK] Seeded Reports")

    # 7. Simulation Scenarios
    if db.query(SimulationScenario).count() == 0:
        scenarios = [
            SimulationScenario(
                id="SCEN-01",
                name="Peak Holiday Inflow (+40%)",
                agvs=24,
                volume="+40%",
                closed="None",
                expected_risk=72,
                date="2026-10-04"
            ),
            SimulationScenario(
                id="SCEN-02",
                name="Aisle B Maintenance Bypass",
                agvs=20,
                volume="0%",
                closed="Aisle B",
                expected_risk=65,
                date="2026-10-03"
            )
        ]
        db.add_all(scenarios)
        db.commit()
        print("[OK] Seeded Simulation Scenarios")

    # 8. Audit Logs
    if db.query(AuditLog).count() == 0:
        logs = [
            AuditLog(
                id="LOG-101",
                user="admin",
                action="Changed High threshold 70 to 75",
                module="Warehouse Config",
                time="10:42",
                ip="192.168.1.5"
            ),
            AuditLog(
                id="LOG-102",
                user="admin",
                action="Acknowledged Alert #ALT-904 in Aisle B",
                module="Bottleneck Alerts",
                time="10:15",
                ip="192.168.1.5"
            ),
            AuditLog(
                id="LOG-103",
                user="david.chen",
                action="Generated Weekly Congestion PDF report",
                module="Reports",
                time="09:48",
                ip="192.168.1.22"
            ),
            AuditLog(
                id="LOG-104",
                user="admin",
                action="Retrained DSTGT model to v1.02",
                module="Model Engine",
                time="09:12",
                ip="192.168.1.5"
            ),
            AuditLog(
                id="LOG-105",
                user="sam.haddad",
                action="Simulated reroute fix for 12 AGVs",
                module="What-If Sim",
                time="08:30",
                ip="192.168.1.18"
            )
        ]
        db.add_all(logs)
        db.commit()
        print("[OK] Seeded Audit Logs")

def init_db():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()
    try:
        seed_database(db)
    finally:
        db.close()

if __name__ == "__main__":
    init_db()
