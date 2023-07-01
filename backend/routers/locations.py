from fastapi import APIRouter, HTTPException

from db import db

router = APIRouter(
    prefix="/{room}/locations",
    tags=["locations"],
)


@router.get("/")
def list_locations(room: str) -> set[str]:
    locations = db.smembers(f"{room}:locations")
    return locations


@router.put("/{location}", status_code=201)
def create_location(room: str, location: str) -> str:
    if ":" in location:
        raise HTTPException(status_code=400, detail="Location cannot contain ':'")
    if db.sadd(f"room:{room}:locations", location) == 0:
        raise HTTPException(status_code=409, detail="Location already exists")
    return location


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
