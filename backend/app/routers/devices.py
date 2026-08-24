from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.dependencies import get_db, require_role
from app.enums.auth_role import AuthRole

from app.models.device import Device
from datetime import datetime
from app.schemas.device import (
    DeviceCreate,
    DeviceUpdate,
    DeviceResponse,
    DeviceHeartbeat,
)

router = APIRouter()


@router.post(
    "/devices",
    response_model=DeviceResponse,
)
def create_device(
    device: DeviceCreate,
    db: Session = Depends(get_db),
    current_account=Depends(require_role(AuthRole.ADMIN)),
):

    existing_device = (
        db.query(Device).filter(Device.device_code == device.device_code).first()
    )

    if existing_device:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device code already exists",
        )

    db_device = Device(
        device_name=device.device_name,
        device_code=device.device_code,
        department_id=device.department_id,
        location=device.location,
        firmware_version=device.firmware_version,
    )

    db.add(db_device)
    db.commit()
    db.refresh(db_device)

    return db_device


@router.post("/devices/heartbeat")
def device_heartbeat(
    heartbeat: DeviceHeartbeat,
    db: Session = Depends(get_db),
):
    device = (
        db.query(Device)
        .filter(
            Device.device_code == heartbeat.device_code,
            Device.is_active == True,
        )
        .first()
    )

    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found or inactive",
        )

    device.last_seen = datetime.utcnow()

    if heartbeat.firmware_version is not None:
        device.firmware_version = heartbeat.firmware_version

    db.commit()

    return {
        "success": True,
        "message": "Heartbeat received",
        "device_code": device.device_code,
        "last_seen": device.last_seen,
    }


@router.get(
    "/devices",
    response_model=list[DeviceResponse],
)
def get_devices(
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(
            AuthRole.ADMIN,
            AuthRole.HOD,
        )
    ),
):

    return db.query(Device).all()


@router.get(
    "/devices/{device_id}",
    response_model=DeviceResponse,
)
def get_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_account=Depends(
        require_role(
            AuthRole.ADMIN,
            AuthRole.HOD,
        )
    ),
):

    device = db.query(Device).filter(Device.id == device_id).first()

    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found",
        )

    return device


@router.put(
    "/devices/{device_id}",
    response_model=DeviceResponse,
)
def update_device(
    device_id: int,
    updated_device: DeviceUpdate,
    db: Session = Depends(get_db),
    current_account=Depends(require_role(AuthRole.ADMIN)),
):

    device = db.query(Device).filter(Device.id == device_id).first()

    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found",
        )

    existing_device = (
        db.query(Device)
        .filter(
            Device.device_code == updated_device.device_code,
            Device.id != device_id,
        )
        .first()
    )

    if existing_device:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Device code already exists",
        )

    device.device_name = updated_device.device_name
    device.device_code = updated_device.device_code
    device.department_id = updated_device.department_id
    device.location = updated_device.location
    device.firmware_version = updated_device.firmware_version
    device.is_active = updated_device.is_active

    db.commit()
    db.refresh(device)

    return device


@router.delete(
    "/devices/{device_id}",
)
def delete_device(
    device_id: int,
    db: Session = Depends(get_db),
    current_account=Depends(require_role(AuthRole.ADMIN)),
):

    device = db.query(Device).filter(Device.id == device_id).first()

    if device is None:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Device not found",
        )

    db.delete(device)
    db.commit()

    return {"message": "Device deleted successfully"}
