from api.models.schemas import StoreEvent


def compute_store_heatmap(events: list[StoreEvent]):
    customer_events = [event for event in events if not event.is_staff]

    zone_stats: dict[str, dict] = {}

    for event in customer_events:
        if event.zone_id is None:
            continue

        zone_stats.setdefault(
            event.zone_id,
            {
                "visits": set(),
                "dwell_values": [],
            },
        )

        if event.event_type == "ZONE_ENTER":
            zone_stats[event.zone_id]["visits"].add(event.visitor_id)

        if event.event_type == "ZONE_DWELL":
            zone_stats[event.zone_id]["dwell_values"].append(event.dwell_ms)

    max_visits = max(
        [len(stats["visits"]) for stats in zone_stats.values()],
        default=1,
    )

    heatmap = []

    for zone_id, stats in zone_stats.items():
        visit_count = len(stats["visits"])
        dwell_values = stats["dwell_values"]

        avg_dwell_ms = (
            round(sum(dwell_values) / len(dwell_values), 2)
            if dwell_values
            else 0
        )

        heatmap.append(
            {
                "zone_id": zone_id,
                "visit_count": visit_count,
                "avg_dwell_ms": avg_dwell_ms,
                "intensity": round((visit_count / max_visits) * 100, 2),
                "data_confidence": "LOW" if visit_count < 20 else "HIGH",
            }
        )

    return {
        "zones": heatmap,
        "total_zones": len(heatmap),
    }