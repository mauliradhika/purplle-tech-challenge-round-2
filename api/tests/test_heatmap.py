from api.models.schemas import StoreEvent
from api.services.heatmap_service import compute_store_heatmap


def make_event(event_id, visitor_id, event_type, zone_id, dwell_ms=0):
    return StoreEvent(
        event_id=event_id,
        store_id="STORE_BLR_002",
        camera_id="CAM_TEST",
        visitor_id=visitor_id,
        event_type=event_type,
        timestamp="2026-05-30T10:00:00+00:00",
        zone_id=zone_id,
        dwell_ms=dwell_ms,
        is_staff=False,
        confidence=0.9,
        metadata={
            "queue_depth": None,
            "sku_zone": None,
            "session_seq": 1,
        },
    )


def test_heatmap_generates_zone_intensity():
    events = [
        make_event("1", "VIS_1", "ZONE_ENTER", "MAIN_FLOOR_A"),
        make_event("2", "VIS_2", "ZONE_ENTER", "MAIN_FLOOR_A"),
        make_event("3", "VIS_3", "ZONE_ENTER", "MAIN_FLOOR_B"),
        make_event("4", "VIS_1", "ZONE_DWELL", "MAIN_FLOOR_A", dwell_ms=30000),
    ]

    heatmap = compute_store_heatmap(events)

    assert heatmap["total_zones"] == 2

    zones = {zone["zone_id"]: zone for zone in heatmap["zones"]}

    assert zones["MAIN_FLOOR_A"]["visit_count"] == 2
    assert zones["MAIN_FLOOR_A"]["intensity"] == 100.0