import json
import math
from datetime import datetime
from typing import List

from fastapi import APIRouter
from pydantic import BaseModel

from db import db

router = APIRouter(
    prefix="/room/{room}/evaluation",
    tags=["evaluation"],
)


class HistogramEntry(BaseModel):
    min_duration: int
    max_duration: int
    number_of_items: int


class Analysis(BaseModel):
    from_location: str
    to_location: str
    mean: int
    histogram: List[HistogramEntry]


def get_index_from_percentile(percentile: float, sorted_list: list[any]) -> int:
    """
    Returns the index of the element in the sorted list that is closest to the given percentile.
    """
    assert sorted_list
    assert 0 <= percentile <= 1
    index = int(percentile * len(sorted_list))
    return min(index, len(sorted_list) - 1)


@router.get("/")
def get_evaluation(room: str) -> list[Analysis]:
    """
    Returns a histogram of the average time spent between each pair of locations.
    """
    plates = db.smembers(f"room:{room}:plates")
    durations_per_segment = {}
    for car_id, plate_hash in enumerate(plates):
        records_key = f"room:{room}:records:{plate_hash}"
        records = [json.loads(x) for x in db.lrange(records_key, 0, -1)]
        records.sort(key=lambda x: x["timestamp"])
        for i, record in enumerate(records):
            if i == 0:
                continue
            prev_record = records[i - 1]
            timestamp = datetime.fromisoformat(record["timestamp"])
            prev_timestamp = datetime.fromisoformat(prev_record["timestamp"])
            key = ":".join(sorted((prev_record["location"], record["location"])))
            if key not in durations_per_segment:
                durations_per_segment[key] = []
            durations_per_segment[key].append(round((timestamp - prev_timestamp).total_seconds()))

    # sort the durations for each segment
    for durations in durations_per_segment.values():
        durations.sort()

    n_buckets = 16

    percentile = 0.95

    # create a histogram
    return [
        Analysis(
            from_location=key.partition(":")[0],
            to_location=key.partition(":")[2],
            mean=sum(durations) / len(durations),
            histogram=[
                HistogramEntry(
                    min_duration=i,
                    max_duration=i + (step := math.ceil(durations[get_index_from_percentile(percentile, durations)] / n_buckets)),
                    number_of_items=sum((1 for x in durations if i <= x < i + step)),
                )
                for i in range(0, durations[get_index_from_percentile(percentile, durations)], math.ceil(durations[get_index_from_percentile(percentile, durations)] / n_buckets))
            ]
        )
        for key, durations in durations_per_segment.items()
    ]
