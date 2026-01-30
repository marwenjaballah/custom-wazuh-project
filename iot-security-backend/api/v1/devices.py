from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from pydantic import BaseModel, Field
from datetime import datetime
import uuid

router = APIRouter()

# Models
class DeviceBase(BaseModel):
    name: str = Field(..., description="Device name")
    device_type: str = Field(..., description="Device type (e.g., sensor, camera, gateway)")
    ip_address: Optional[str] = Field(None, description="IP address")
    mac_address: Optional[str] = Field(None, description="MAC address")
    manufacturer: Optional[str] = Field(None, description="Device manufacturer")
    firmware_version: Optional[str] = Field(None, description="Firmware version")

class Device(DeviceBase):
    id: str
    status: str = "online"
    last_seen: str
    registered_at: str
    risk_score: int = 0

# In-memory database (replace with real DB in production)
devices_db: List[Device] = [
    Device(
        id="dev-001",
        name="Temperature Sensor 1",
        device_type="sensor",
        ip_address="192.168.1.101",
        mac_address="00:1A:2B:3C:4D:5E",
        manufacturer="Example Corp",
        firmware_version="1.2.3",
        status="online",
        last_seen=datetime.now().isoformat(),
        registered_at=datetime.now().isoformat(),
        risk_score=25
    ),
    Device(
        id="dev-002",
        name="Security Camera 1",
        device_type="camera",
        ip_address="192.168.1.102",
        mac_address="00:1A:2B:3C:4D:5F",
        manufacturer="SecureCam",
        firmware_version="2.0.1",
        status="online",
        last_seen=datetime.now().isoformat(),
        registered_at=datetime.now().isoformat(),
        risk_score=75
    ),
    Device(
        id="dev-003",
        name="Smart Thermostat",
        device_type="thermostat",
        ip_address="192.168.1.103",
        mac_address="00:1A:2B:3C:4D:60",
        manufacturer="SmartHome Inc",
        firmware_version="3.1.0",
        status="online",
        last_seen=datetime.now().isoformat(),
        registered_at=datetime.now().isoformat(),
        risk_score=15
    )
]

@router.get("/", response_model=List[Device])
async def get_devices(
    status: Optional[str] = None,
    device_type: Optional[str] = None
):
    """
    Get all registered IoT devices with optional filters
    
    - **status**: Filter by device status (online, offline, warning)
    - **device_type**: Filter by device type
    """
    filtered_devices = devices_db
    
    if status:
        filtered_devices = [d for d in filtered_devices if d.status == status]
    
    if device_type:
        filtered_devices = [d for d in filtered_devices if d.device_type == device_type]
    
    return filtered_devices

@router.post("/", response_model=Device, status_code=status.HTTP_201_CREATED)
async def register_device(device: DeviceBase):
    """Register a new IoT device"""
    new_device = Device(
        id=f"dev-{str(uuid.uuid4())[:8]}",
        **device.model_dump(),
        status="online",
        last_seen=datetime.now().isoformat(),
        registered_at=datetime.now().isoformat()
    )
    devices_db.append(new_device)
    return new_device

@router.get("/{device_id}", response_model=Device)
async def get_device(device_id: str):
    """Get specific device by ID"""
    for device in devices_db:
        if device.id == device_id:
            return device
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Device with id '{device_id}' not found"
    )

@router.put("/{device_id}", response_model=Device)
async def update_device(device_id: str, device_update: DeviceBase):
    """Update device information"""
    for idx, device in enumerate(devices_db):
        if device.id == device_id:
            updated_device = Device(
                id=device.id,
                **device_update.model_dump(),
                status=device.status,
                last_seen=datetime.now().isoformat(),
                registered_at=device.registered_at,
                risk_score=device.risk_score
            )
            devices_db[idx] = updated_device
            return updated_device
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Device with id '{device_id}' not found"
    )

@router.delete("/{device_id}", status_code=status.HTTP_204_NO_CONTENT)
async def delete_device(device_id: str):
    """Delete a device"""
    for idx, device in enumerate(devices_db):
        if device.id == device_id:
            devices_db.pop(idx)
            return
    raise HTTPException(
        status_code=status.HTTP_404_NOT_FOUND,
        detail=f"Device with id '{device_id}' not found"
    )

@router.get("/stats/summary")
async def get_device_stats():
    """Get device statistics"""
    total_devices = len(devices_db)
    online_devices = len([d for d in devices_db if d.status == "online"])
    offline_devices = len([d for d in devices_db if d.status == "offline"])
    
    device_types = {}
    for device in devices_db:
        device_types[device.device_type] = device_types.get(device.device_type, 0) + 1
    
    avg_risk_score = sum(d.risk_score for d in devices_db) / total_devices if total_devices > 0 else 0
    
    high_risk_devices = len([d for d in devices_db if d.risk_score >= 70])
    medium_risk_devices = len([d for d in devices_db if 30 <= d.risk_score < 70])
    low_risk_devices = len([d for d in devices_db if d.risk_score < 30])
    
    return {
        "total_devices": total_devices,
        "online_devices": online_devices,
        "offline_devices": offline_devices,
        "device_types": device_types,
        "average_risk_score": round(avg_risk_score, 2),
        "risk_distribution": {
            "high": high_risk_devices,
            "medium": medium_risk_devices,
            "low": low_risk_devices
        }
    }
