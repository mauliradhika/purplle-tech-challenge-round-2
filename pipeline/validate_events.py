import json
from pathlib import Path

REQUIRED_FIELDS = {
    "event_id",
    "store_id",
    "camera_id",
    "visitor_id",
    "event_type",
    "timestamp",
    "zone_id",
    "dwell_ms",
    "is_staff",
    "confidence",
    "metadata",
}

VALID_EVENT_TYPES = {
    "ENTRY",
    "EXIT",
    "ZONE_ENTER",
    "ZONE_EXIT",
    "ZONE_DWELL",
    "BILLING_QUEUE_JOIN",
    "BILLING_QUEUE_ABANDON",
    "REENTRY",
}

EVENTS_PATH = Path(__file__).resolve().parent.parent / "output" / "events.jsonl"


def main():
    event_ids = set()
    total = 0

    with open(EVENTS_PATH, "r") as f:
        for line_number, line in enumerate(f, start=1):
            total += 1
            event = json.loads(line)

            missing = REQUIRED_FIELDS - event.keys()
            if missing:
                raise ValueError(f"Line {line_number}: missing fields {missing}")

            if event["event_id"] in event_ids:
                raise ValueError(f"Line {line_number}: duplicate event_id")

            event_ids.add(event["event_id"])

            if event["event_type"] not in VALID_EVENT_TYPES:
                raise ValueError(
                    f"Line {line_number}: invalid event_type {event['event_type']}"
                )

            if not isinstance(event["metadata"], dict):
                raise ValueError(f"Line {line_number}: metadata must be object")

    print(f"Valid events: {total}")


if __name__ == "__main__":
    main()