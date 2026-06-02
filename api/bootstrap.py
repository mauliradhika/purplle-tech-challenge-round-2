import json
from pathlib import Path

from api.models.schemas import StoreEvent
from api.repositories.event_repository import save_event

ROOT_DIR = Path(__file__).resolve().parent.parent
EVENTS_PATH = ROOT_DIR / "output" / "events.jsonl"


def bootstrap_events():
    if not EVENTS_PATH.exists():
        print("No events.jsonl found")
        return

    accepted = 0
    duplicates = 0

    with open(EVENTS_PATH, "r") as file:
        for line in file:
            line = line.strip()

            if not line:
                continue

            try:
                payload = json.loads(line)
                event = StoreEvent(**payload)

                saved = save_event(event)

                if saved:
                    accepted += 1
                else:
                    duplicates += 1

            except Exception as exc:
                print("Bootstrap error:", exc)

    print(
        f"Bootstrapped events → accepted={accepted}, duplicates={duplicates}"
    )