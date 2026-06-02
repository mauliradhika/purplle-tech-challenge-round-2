from fastapi import APIRouter

from api.repositories.event_repository import get_store_events
from api.services.metrics_service import compute_store_metrics

router = APIRouter(tags=["Metrics"])


@router.get("/stores/{store_id}/metrics")
def get_store_metrics(store_id: str):
    events = get_store_events(store_id)
    return compute_store_metrics(events)