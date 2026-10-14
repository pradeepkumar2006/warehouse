import uvicorn
import sys
from pathlib import Path

# Add project root to sys.path
sys.path.insert(0, str(Path(__file__).resolve().parent))

if __name__ == "__main__":
    print("==================================================")
    print(" TwinFlow AI Digital Twin - Warehouse Backend")
    print(" API Base URL : http://localhost:8000/api/v1")
    print(" Interactive Docs: http://localhost:8000/docs")
    print(" WebSocket URL: ws://localhost:8000/ws/telemetry")
    print("==================================================")
    uvicorn.run("app.main:app", host="127.0.0.1", port=8000, reload=True)
