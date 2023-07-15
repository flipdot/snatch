import json
from datetime import datetime

from fastapi import APIRouter
from pydantic import BaseModel

from db import db

router = APIRouter(
    prefix="/room/{room}/evaluation",
    tags=["evaluation"],
)


class HistogramEntry(BaseModel):
    duration: int
    number_of_items: int


class Histogram(BaseModel):
    min: HistogramEntry
    p25: HistogramEntry
    p50: HistogramEntry
    p75: HistogramEntry
    p90: HistogramEntry
    p95: HistogramEntry
    p99: HistogramEntry
    max: HistogramEntry


class Analysis(BaseModel):
    from_location: str
    to_location: str
    mean: int
    histogram: Histogram


def get_percentile_from_field_name(field: Histogram.__fields__) -> float:
    """
    Returns a float between 0 and 1, based on the field name from the Histogram model.
    """
    assert len(field) == 3
    match field.split("p"):
        case ["min"]:
            return 0
        case ["max"]:
            return 1
        case [_, percentile_str]:
            percentile = int(percentile_str) / 100
            assert 0 < percentile < 1
            return percentile
        case _:
            raise AssertionError(f"Unexpected field {field}")


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
            durations_per_segment[key].append(
                (timestamp - prev_timestamp).total_seconds()
            )

    # sort the durations for each segment
    for durations in durations_per_segment.values():
        durations.sort()

    # create a histogram
    return [
        Analysis(
            from_location=key.partition(":")[0],
            to_location=key.partition(":")[2],
            mean=sum(durations) / len(durations),
            histogram=Histogram(
                **{
                    field: HistogramEntry(
                        duration=durations[
                            idx := get_index_from_percentile(
                                get_percentile_from_field_name(field), durations
                            )
                        ],
                        number_of_items=idx + 1,
                    )
                    for field in Histogram.__fields__
                }
            ),
        )
        for key, durations in durations_per_segment.items()
    ]
