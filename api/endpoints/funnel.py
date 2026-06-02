from fastapi import APIRouter

from api.repositories.event_repository import get_store_events
from api.services.funnel_service import compute_store_funnel

router = APIRouter(tags=["Funnel"])


@router.get("/stores/{store_id}/funnel")
def get_store_funnel(store_id: str):
    events = get_store_events(store_id)
    return compute_store_funnel(events)