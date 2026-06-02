from api.models.schemas import StoreEvent
from api.services.metrics_service import compute_store_metrics


def make_event(
    event_id,
    visitor_id,
    event_type,
    timestamp,
    zone_id=None,
    dwell_ms=0,
    queue_depth=None,
    is_staff=False,
):
    return StoreEvent(
        event_id=event_id,
        store_id="STORE_BLR_002",
        camera_id="CAM_TEST",
        visitor_id=visitor_id,
        event_type=event_type,
        timestamp=timestamp,
        zone_id=zone_id,
        dwell_ms=dwell_ms,
        is_staff=is_staff,
        confidence=0.9,
        metadata={
            "queue_depth": queue_depth,
            "sku_zone": None,
            "session_seq": 1,
        },
    )


def test_compute_store_metrics_excludes_staff():
    events = [
        make_event("1", "VIS_1", "ENTRY", "2026-05-30T10:00:00+00:00"),
        make_event("2", "VIS_STAFF", "ENTRY", "2026-05-30T10:01:00+00:00", is_staff=True),
    ]

    metrics = compute_store_metrics(events)

    assert metrics["unique_visitors"] == 1
    assert metrics["total_events"] == 1


def test_compute_store_metrics_detects_busiest_zone():
    events = [
        make_event("1", "VIS_1", "ZONE_ENTER", "2026-05-30T10:00:00+00:00", zone_id="MAIN_FLOOR_A"),
        make_event("2", "VIS_2", "ZONE_ENTER", "2026-05-30T10:01:00+00:00", zone_id="MAIN_FLOOR_B"),
        make_event("3", "VIS_3", "ZONE_ENTER", "2026-05-30T10:02:00+00:00", zone_id="MAIN_FLOOR_B"),
    ]

    metrics = compute_store_metrics(events)

    assert metrics["busiest_zone"] == "MAIN_FLOOR_B"
    assert metrics["zone_visit_count"]["MAIN_FLOOR_B"] == 2


def test_compute_store_metrics_queue_depth_from_latest_queue_event():
    events = [
        make_event("1", "VIS_1", "BILLING_QUEUE_JOIN", "2026-05-30T10:00:00+00:00", zone_id="BILLING", queue_depth=2),
        make_event("2", "VIS_2", "BILLING_QUEUE_JOIN", "2026-05-30T10:03:00+00:00", zone_id="BILLING", queue_depth=4),
    ]

    metrics = compute_store_metrics(events)

    assert metrics["current_queue_depth"] == 4