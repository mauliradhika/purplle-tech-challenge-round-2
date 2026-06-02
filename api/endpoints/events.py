from fastapi import APIRouter

from api.models.schemas import IngestResponse, StoreEvent
from api.repositories.event_repository import get_store_events, save_event

router = APIRouter(tags=["Events"])


@router.post("/events/ingest", response_model=IngestResponse)
def ingest_events(events: list[StoreEvent]):
    accepted = 0
    duplicates = 0
    rejected = 0
    errors = []

    for index, event in enumerate(events):
        try:
            is_saved = save_event(event)

            if is_saved:
                accepted += 1
            else:
                duplicates += 1

        except Exception as exc:
            rejected += 1
            errors.append(
                {
                    "index": index,
                    "event_id": getattr(event, "event_id", None),
                    "error": str(exc),
                }
            )

    return {
        "accepted": accepted,
        "duplicates": duplicates,
        "rejected": rejected,
        "errors": errors,
    }


@router.get("/stores/{store_id}/events")
def list_store_events(store_id: str):
    events = get_store_events(store_id)

    return {
        "store_id": store_id,
        "count": len(events),
        "events": events,
    }