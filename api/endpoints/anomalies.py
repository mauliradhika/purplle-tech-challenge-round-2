from fastapi import APIRouter

from api.repositories.event_repository import get_store_events
from api.services.anomaly_service import detect_store_anomalies

router = APIRouter(tags=["Anomalies"])


@router.get("/stores/{store_id}/anomalies")
def get_store_anomalies(store_id: str):
    events = get_store_events(store_id)
    return detect_store_anomalies(events)