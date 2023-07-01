from fastapi import APIRouter, HTTPException

from db import db
from settings import DEFAULT_DB_TTL

router = APIRouter(
    prefix="/room/{room}/locations",
    tags=["locations"],
)


@router.get("/")
def list_locations(room: str) -> list[str]:
    return sorted(db.smembers(f"room:{room}:locations"))


@router.put("/{location}", status_code=201)
def create_location(room: str, location: str) -> list[str]:
    if ":" in location:
        raise HTTPException(status_code=400, detail="Location cannot contain ':'")
    db.sadd(f"room:{room}:locations", location)
    db.expire(f"room:{room}:locations", DEFAULT_DB_TTL)
    return list_locations(room)


@router.delete(
    "/{location}",
    status_code=204,
    responses={404: {"description": "Location not found"}},
)
def delete_location(room: str, location: str) -> None:
    if ":" in location:
        raise HTTPException(status_code=400, detail="Location cannot contain ':'")
    if db.srem(f"room:{room}:locations", location) == 0:
        raise HTTPException(status_code=404, detail="Location not found")
