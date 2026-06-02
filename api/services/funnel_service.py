from api.models.schemas import StoreEvent


def compute_store_funnel(events: list[StoreEvent]):
    customer_events = [event for event in events if not event.is_staff]

    sessions: dict[str, set[str]] = {}

    for event in customer_events:
        sessions.setdefault(event.visitor_id, set())

        if event.event_type == "ENTRY":
            sessions[event.visitor_id].add("entry")

        if event.event_type in {"ZONE_ENTER", "ZONE_DWELL"}:
            sessions[event.visitor_id].add("zone_visit")

        if event.event_type == "BILLING_QUEUE_JOIN":
            sessions[event.visitor_id].add("billing_queue")

    total_entry = sum(1 for stages in sessions.values() if "entry" in stages)
    zone_visit = sum(1 for stages in sessions.values() if "zone_visit" in stages)
    billing_queue = sum(1 for stages in sessions.values() if "billing_queue" in stages)

    purchase = 0

    def dropoff(previous: int, current: int) -> float:
        if previous == 0:
            return 0.0
        return round(((previous - current) / previous) * 100, 2)

    return {
        "store_funnel": [
            {
                "stage": "ENTRY",
                "count": total_entry,
                "dropoff_percent": 0.0,
            },
            {
                "stage": "ZONE_VISIT",
                "count": zone_visit,
                "dropoff_percent": dropoff(total_entry, zone_visit),
            },
            {
                "stage": "BILLING_QUEUE",
                "count": billing_queue,
                "dropoff_percent": dropoff(zone_visit, billing_queue),
            },
            {
                "stage": "PURCHASE",
                "count": purchase,
                "dropoff_percent": dropoff(billing_queue, purchase),
            },
        ],
        "session_count": len(sessions),
    }