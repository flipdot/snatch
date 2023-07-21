import csv
import random
from datetime import datetime, timedelta

from freezegun import freeze_time
from tqdm import tqdm

from routers import records, locations
from routers.records import NewRecord


def main(room: str, location_list: list[str], n=500):
    for location in location_list:
        locations.create_location(room, location)

    plate = f"KS-FD{random.randint(1, 1000)}"
    for _ in tqdm(range(n)):
        random.shuffle(location_list)
        location_a, location_b = location_list[:2]
        timestamp_a = datetime(
            year=2020,
            month=1,
            day=1,
            hour=random.randint(0, 23),
            minute=random.randint(0, 59),
            second=random.randint(0, 59),
        )
        delta = random.normalvariate(60, 20)
        timestamp_b = timestamp_a + timedelta(seconds=delta)

        with freeze_time(timestamp_a):
            record = NewRecord(location=location_a, plate=plate)
            records.add_record(room, record)
        with freeze_time(timestamp_b):
            record = NewRecord(location=location_b, plate=plate)
            records.add_record(room, record)


if __name__ == "__main__":
    main("fd", [
        "Werkstatt",
        "Elektrotechnik"
    ])
