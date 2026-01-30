from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from api.v1 import devices

app = FastAPI(
    title="IoT Security Service",
    description="Backend service for IoT Cybersecurity Management",
    version="1.0.0"
)

# CORS configuration for browser access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(devices.router, prefix="/api/v1/devices", tags=["devices"])

@app.get("/")
def root():
    return {
        "message": "IoT Security Service API",
        "version": "1.0.0",
        "docs": "/docs"
    }

@app.get("/health")
def health_check():
    return {"status": "healthy", "service": "iot-security-backend"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000, reload=True)
