from fastapi import APIRouter
from app.api.v1.endpoints import (
    auth,
    config,
    alerts,
    reports,
    predictions,
    simulation,
    analytics,
    telemetry
)

api_router = APIRouter()

# Auth & User Management
api_router.include_router(auth.router, prefix="/auth", tags=["Authentication"])
api_router.include_router(auth.router, tags=["Users"])

# Warehouse Layout & Config
api_router.include_router(config.router, tags=["Configuration"])

# Telemetry
api_router.include_router(telemetry.router, tags=["Telemetry"])

# AI Predictions
api_router.include_router(predictions.router, tags=["Predictions"])

# Bottleneck Alerts
api_router.include_router(alerts.router, tags=["Alerts"])

# What-If Simulation
api_router.include_router(simulation.router, tags=["Simulation"])

# Analytics & Audits
api_router.include_router(analytics.router, tags=["Analytics & Audit"])

# Reports & Downloads
api_router.include_router(reports.router, tags=["Reports"])
