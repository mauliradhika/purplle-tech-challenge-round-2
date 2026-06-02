from api.models.schemas import StoreEvent
from api.services.recommendation_service import build_business_recommendations


def make_event(
    event_id,
    visitor_id,
    event_type,
    zone_id=None,
    queue_depth=None,
    is_staff=False,
):
    return StoreEvent(
        event_id=event_id,
        store_id="STORE_BLR_002",
        camera_id="CAM_TEST",
        visitor_id=visitor_id,
        event_type=event_type,
        timestamp="2026-05-30T10:00:00+00:00",
        zone_id=zone_id,
        dwell_ms=0,
        is_staff=is_staff,
        confidence=0.9,
        metadata={
            "queue_depth": queue_depth,
            "sku_zone": None,
            "session_seq": 1,
        },
    )


def test_recommendations_include_sales_and_queue_context():
    events = [
        make_event("1", "VIS_1", "ZONE_ENTER", "MAIN_FLOOR_A"),
        make_event("2", "VIS_2", "BILLING_QUEUE_JOIN", "BILLING", queue_depth=1),
    ]

    result = build_business_recommendations("STORE_BLR_002", events)

    assert result["store_id"] == "STORE_BLR_002"
    assert result["count"] > 0
    assert len(result["recommendations"]) == result["count"]

    titles = {item["title"] for item in result["recommendations"]}

    assert "Sales data connected successfully" in titles
    assert "Billing queue operating normally" in titles


def test_recommendations_flag_interior_activity_without_entry():
    events = [
        make_event("1", "VIS_1", "ZONE_ENTER", "MAIN_FLOOR_A"),
    ]

    result = build_business_recommendations("STORE_BLR_002", events)

    titles = {item["title"] for item in result["recommendations"]}

    assert "Interior activity without entry crossings" in titles