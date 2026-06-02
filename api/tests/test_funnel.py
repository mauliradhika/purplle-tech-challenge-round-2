from api.models.schemas import StoreEvent
from api.services.funnel_service import compute_store_funnel


def make_event(event_id, visitor_id, event_type, zone_id=None):
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
            "queue_depth": None,
            "sku_zone": None,
            "session_seq": 1,
        },
    )


def test_funnel_counts_stages():
    events = [
        make_event("1", "VIS_1", "ENTRY"),
        make_event("2", "VIS_1", "ZONE_ENTER", "MAIN_FLOOR_A"),
        make_event("3", "VIS_2", "ZONE_ENTER", "MAIN_FLOOR_B"),
        make_event("4", "VIS_2", "BILLING_QUEUE_JOIN", "BILLING"),
    ]

    funnel = compute_store_funnel(events)
    stages = {item["stage"]: item["count"] for item in funnel["store_funnel"]}

    assert stages["ENTRY"] == 1
    assert stages["ZONE_VISIT"] == 2
    assert stages["BILLING_QUEUE"] == 1