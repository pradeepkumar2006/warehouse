# TwinFlow AI Digital Twin - Backend Architecture

A real-time, AI-driven FastAPI backend for warehouse spatio-temporal congestion prediction, digital twin 3D synchronization, and executive intelligence reporting.

## Features
- **FastAPI Core**: Async REST APIs with auto-generated Swagger UI (`/docs`).
- **Database & Realistic Seeding**: SQLite (`twinflow.db`) with SQLAlchemy ORM, seeded with 8 users, 4 zones/aisles, 22 active AGV fleets, alerts, and audit logs.
- **Enterprise PDF & CSV Generator**: ReportLab-powered professional PDF report generation with KPI summary tables, bottleneck hotspot analysis, and DSTGT attention weights.
- **Real-Time WebSocket**: `ws://localhost:8000/ws/telemetry` streaming micro-movements of 22 AGVs, queue updates, and Aisle B congestion states.
- **What-If Simulation Engine**: Dynamic formula-based simulation predicting queue reductions, lead times, and risk shifts.
- **JWT Authentication & Role Control**: Multi-tenant authorization for System Admins and Floor Operators.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Start Backend Server
```bash
python run_server.py
```
Server will be available at:
- **Base API**: [http://localhost:8000/api/v1](http://localhost:8000/api/v1)
- **Interactive Swagger Docs**: [http://localhost:8000/docs](http://localhost:8000/docs)
- **Realtime WebSocket**: `ws://localhost:8000/ws/telemetry`

## Endpoints Overview
| Module | Method | Endpoint | Description |
|---|---|---|---|
| Auth | POST | `/api/v1/auth/login` | Authenticate user & return JWT token |
| Users | GET/POST/PUT/DELETE | `/api/v1/users` | Full staff and operator user management |
| Config | GET/PUT | `/api/v1/config` | Tripwire thresholds & warehouse aisle layout |
| Telemetry | GET | `/api/v1/telemetry/live` | Fleet counts & Kafka pipeline health |
| WebSocket | WS | `/ws/telemetry` | Real-time AGV position & density stream |
| Predictions | GET | `/api/v1/predictions/live` | DSTGT model 15-min horizon predictions |
| Alerts | GET/POST | `/api/v1/alerts` | Acknowledge & resolve bottleneck alerts |
| Simulation | POST | `/api/v1/simulation/run` | Execute what-if scenarios |
| Reports | GET/POST | `/api/v1/reports` | List and generate real PDF/CSV reports |
| Reports | GET | `/api/v1/reports/{id}/download` | Download actual PDF file to browser |
| Analytics | GET | `/api/v1/analytics/metrics` | Historical charts & accuracy trends |
| Audit | GET/POST | `/api/v1/audit/logs` | Central security audit trail |
