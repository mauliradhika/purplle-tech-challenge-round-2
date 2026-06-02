from datetime import datetime, timezone
from uuid import uuid4


def build_event(
    store_id,
    camera_id,
    visitor_id,
    event_type,
    timestamp=None,
    zone_id=None,
    dwell_ms=0,
    is_staff=False,
    confidence=0.0,
    queue_depth=None,
    sku_zone=None,
    session_seq=1,
):
    return {
        "event_id": str(uuid4()),
        "store_id": store_id,
        "camera_id": camera_id,
        "visitor_id": visitor_id,
        "event_type": event_type,
        "timestamp": timestamp or datetime.now(timezone.utc).isoformat(),
        "zone_id": zone_id,
        "dwell_ms": dwell_ms,
        "is_staff": is_staff,
        "confidence": round(float(confidence), 4),
        "metadata": {
            "queue_depth": queue_depth,
            "sku_zone": sku_zone,
            "session_seq": session_seq,
        },
    }