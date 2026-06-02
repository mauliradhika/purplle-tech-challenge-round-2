from fastapi import APIRouter

from api.repositories.event_repository import get_store_events
from api.services.recommendation_service import (
    build_business_recommendations,
)


router = APIRouter(tags=["Recommendations"])


@router.get("/stores/{store_id}/business/recommendations")
def get_business_recommendations(store_id: str):
    events = get_store_events(store_id)
    return build_business_recommendations(
        store_id,
        events,
    )