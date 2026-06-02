from api.models.schemas import StoreEvent
from api.services.metrics_service import compute_current_queue_depth


def detect_store_anomalies(events: list[StoreEvent]):
    customer_events = [event for event in events if not event.is_staff]

    anomalies = []

    entries = [
        event for event in customer_events
        if event.event_type == "ENTRY"
    ]

    zone_events = [
        event for event in customer_events
        if event.event_type in {"ZONE_ENTER", "ZONE_DWELL"}
    ]

    billing_events = [
        event for event in customer_events
        if event.event_type == "BILLING_QUEUE_JOIN"
    ]

    current_queue_depth = compute_current_queue_depth(customer_events)

    if len(entries) == 0 and len(zone_events) == 0:
        anomalies.append(
            {
                "type": "NO_TRAFFIC",
                "severity": "INFO",
                "message": "No customer activity detected.",
                "suggested_action": "Verify store operating hours or camera feed health.",
            }
        )

    if len(entries) > 0 and len(zone_events) == 0:
        anomalies.append(
            {
                "type": "DEAD_ZONE",
                "severity": "WARN",
                "message": "Customers are entering but no zone engagement is detected.",
                "suggested_action": "Verify camera-zone mapping and main-floor camera coverage.",
            }
        )

    if current_queue_depth >= 4:
        anomalies.append(
            {
                "type": "BILLING_QUEUE_SPIKE",
                "severity": "CRITICAL",
                "message": f"Billing queue depth reached {current_queue_depth}.",
                "suggested_action": "Assign additional staff to the billing counter immediately.",
            }
        )

    elif current_queue_depth >= 2:
        anomalies.append(
            {
                "type": "BILLING_QUEUE_BUILDUP",
                "severity": "WARN",
                "message": f"Billing queue depth is currently {current_queue_depth}.",
                "suggested_action": "Monitor billing counter and keep backup staff ready.",
            }
        )

    if len(billing_events) >= 20:
        anomalies.append(
            {
                "type": "HIGH_BILLING_ACTIVITY",
                "severity": "INFO",
                "message": "High number of billing queue join events detected.",
                "suggested_action": "Review billing staffing levels during this time window.",
            }
        )

    return {
        "active_anomalies": anomalies,
        "count": len(anomalies),
    }