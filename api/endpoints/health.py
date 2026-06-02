from fastapi import APIRouter

from api.repositories.event_repository import get_last_event_timestamp_by_store

router = APIRouter(tags=["Health"])


@router.get("/health")
def health():
    return {
        "status": "ok",
        "last_event_timestamp_by_store": get_last_event_timestamp_by_store(),
    }