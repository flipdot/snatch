import json
from datetime import datetime
from hashlib import sha256

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from db import db

router = APIRouter(
    prefix="/{room_name}/records",
    tags=["records"],
)


class NewRecord(BaseModel):
    location: str
    plate: str


@router.post(
    "/",
    responses={404: {"description": "Location not found"}},
)
def add_record(room_name: str, record: NewRecord) -> str:
    if not db.sismember(f"room:{room_name}:locations", record.location):
        raise HTTPException(status_code=404, detail="Location not found")
    timestamp = datetime.now().isoformat()
    sanitized_plate = record.plate.replace(" ", "").upper()
    # Salt the plate number with the room name.
    # This way, data from different rooms will not be comparable, increasing privacy.
    plate_hash = sha256(
        f"{room_name}:{sanitized_plate}".encode(),
    ).hexdigest()
    plates_key = f"room:{room_name}:plates"
    records_key = f"room:{room_name}:records:{plate_hash}"

    db.sadd(plates_key, plate_hash)
    db.lpush(
        records_key,
        json.dumps(
            {
                "location": record.location,
                "timestamp": timestamp,
            }
        ),
    )
    # Automatically delete records after 3 days.
    db.expire(records_key, 60 * 60 * 24 * 3)
    db.expire(plates_key, 60 * 60 * 24 * 3)
    return timestamp
