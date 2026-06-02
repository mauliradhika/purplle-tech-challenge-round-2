from fastapi import APIRouter

from api.repositories.event_repository import get_store_events
from api.services.heatmap_service import compute_store_heatmap

router = APIRouter(tags=["Heatmap"])


@router.get("/stores/{store_id}/heatmap")
def get_store_heatmap(store_id: str):
    events = get_store_events(store_id)
    return compute_store_heatmap(events)