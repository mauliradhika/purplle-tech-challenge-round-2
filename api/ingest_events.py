import json
from pathlib import Path

import requests

API_URL = "http://127.0.0.1:8000/events/ingest"

ROOT_DIR = Path(__file__).resolve().parent.parent
EVENTS_PATH = ROOT_DIR / "output" / "events.jsonl"


def load_events():
    events = []

    with open(EVENTS_PATH, "r") as file:
        for line in file:
            line = line.strip()

            if not line:
                continue

            events.append(json.loads(line))

    return events


def main():
    events = load_events()

    print(f"Loaded {len(events)} events")

    response = requests.post(API_URL, json=events)

    print("Status:", response.status_code)
    print(response.json())


if __name__ == "__main__":
    main()