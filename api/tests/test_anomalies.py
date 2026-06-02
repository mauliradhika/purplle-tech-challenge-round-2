from api.models.schemas import StoreEvent
from api.services.anomaly_service import detect_store_anomalies


def make_event(event_id, visitor_id, event_type, zone_id=None, queue_depth=None):
    return StoreEvent(
        event_id=event_id,
        store_id="STORE_BLR_002",
        camera_id="CAM_TEST",
        visitor_id=visitor_id,
        event_type=event_type,
        timestamp="2026-05-30T10:00:00+00:00",
        zone_id=zone_id,
        dwell_ms=0,
        is_staff=False,
        confidence=0.9,
        metadata={
            "queue_depth": queue_depth,
            "sku_zone": None,
            "session_seq": 1,
        },
    )


def test_no_traffic_only_when_no_activity():
    anomalies = detect_store_anomalies([])

    anomaly_types = {item["type"] for item in anomalies["active_anomalies"]}

    assert "NO_TRAFFIC" in anomaly_types


def test_no_no_traffic_when_zone_activity_exists():
    events = [
        make_event("1", "VIS_1", "ZONE_ENTER", "MAIN_FLOOR_A"),
    ]

    anomalies = detect_store_anomalies(events)
    anomaly_types = {item["type"] for item in anomalies["active_anomalies"]}

    assert "NO_TRAFFIC" not in anomaly_types


def test_queue_buildup_anomaly():
    events = [
        make_event("1", "VIS_1", "BILLING_QUEUE_JOIN", "BILLING", queue_depth=3),
    ]

    anomalies = detect_store_anomalies(events)
    anomaly_types = {item["type"] for item in anomalies["active_anomalies"]}

    assert "BILLING_QUEUE_BUILDUP" in anomaly_types