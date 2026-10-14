from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1.router import api_router
from app.api.v1.endpoints.telemetry import websocket_telemetry_endpoint
from app.db.seed import init_db

@asynccontextmanager
async def lifespan(app: FastAPI):
    # Initialize DB tables & seed realistic data on startup
    init_db()
    print(f"[OK] {settings.PROJECT_NAME} initialized successfully.")
    yield

app = FastAPI(
    title=settings.PROJECT_NAME,
    openapi_url=f"{settings.API_V1_STR}/openapi.json",
    lifespan=lifespan
)

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include API v1 Router
app.include_router(api_router, prefix=settings.API_V1_STR)

# Register root-level WebSocket to match Frontend VITE_WS_URL ('ws://localhost:8000/ws/telemetry')
app.add_api_websocket_route("/ws/telemetry", websocket_telemetry_endpoint)

@app.get("/")
def root():
    return {
        "status": "Online",
        "system": settings.PROJECT_NAME,
        "apiDocs": "/docs",
        "version": "1.0.0"
    }

@app.get("/health")
def health():
    return {"status": "Healthy", "database": "Connected", "pipeline": "Active"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("app.main:app", host="0.0.0.0", port=8000, reload=True)
