import json
from datetime import datetime
from hashlib import sha256

from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
import redis

import settings

app = FastAPI()
db = redis.Redis(
    host=settings.REDIS_HOST, port=settings.REDIS_PORT, decode_responses=True
)


@app.get("/{room_name}/locations")
def location_list(room_name: str) -> set[str]:
    locations = db.smembers(f"{room_name}:locations")
    return locations


@app.post("/{room_name}/locations")
def location_create(room_name: str, location: str) -> str:
    db.sadd(f"{room_name}:locations", location)
    return location


@app.delete(
    "/{room_name}/locations/{location_name}",
    status_code=204,
    responses={404: {"description": "Location not found"}},
)
def location_delete(room_name: str, location: str) -> None:
    if db.srem(f"{room_name}:locations", location) == 0:
        raise HTTPException(status_code=404, detail="Location not found")


@app.post("/{room_name}/locations/{location_name}")
def add_record(room_name: str, location: str, plate: str) -> str:
    if not db.sismember(f"{room_name}:locations", location):
        return "Location not found"
    # Salt the plate number with the room name.
    # This way, data from different rooms will not be comparable, increasing privacy.
    plate_hash = sha256(
        f"{room_name}:{plate}".encode(),
    ).hexdigest()
    return plate_hash
