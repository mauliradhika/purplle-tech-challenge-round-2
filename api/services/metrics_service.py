from collections import defaultdict
from datetime import datetime

from api.models.schemas import StoreEvent


def parse_ts(value: str):
    return datetime.fromisoformat(value.replace("Z", "+00:00"))


def compute_current_queue_depth(events: list[StoreEvent]) -> int:
    queue_join_events = [
        event
        for event in events
        if event.event_type == "BILLING_QUEUE_JOIN"
    ]

    if not queue_join_events:
        return 0

    latest_queue_event = max(
        queue_join_events,
        key=lambda event: parse_ts(event.timestamp),
    )

    return latest_queue_event.metadata.queue_depth or 0


def compute_abandonment_rate(events: list[StoreEvent]) -> float:
    billing_join_visitors = {
        event.visitor_id
        for event in events
        if event.event_type == "BILLING_QUEUE_JOIN"
    }

    billing_exit_visitors = {
        event.visitor_id
        for event in events
        if event.event_type == "ZONE_EXIT"
        and event.zone_id == "BILLING"
    }

    if not billing_join_visitors:
        return 0.0

    abandoned = billing_join_visitors.intersection(billing_exit_visitors)

    return round((len(abandoned) / len(billing_join_visitors)) * 100, 2)


def compute_store_metrics(events: list[StoreEvent]):
    customer_events = [event for event in events if not event.is_staff]

    unique_visitors = {
        event.visitor_id
        for event in customer_events
        if event.event_type == "ENTRY"
    }

    zone_dwell: dict[str, list[int]] = defaultdict(list)

    for event in customer_events:
        if event.event_type == "ZONE_DWELL" and event.zone_id:
            zone_dwell[event.zone_id].append(event.dwell_ms)

    avg_dwell_per_zone = {
        zone_id: round(sum(values) / len(values), 2)
        for zone_id, values in zone_dwell.items()
        if values
    }

    zone_visits = defaultdict(set)

    for event in customer_events:
        if event.event_type == "ZONE_ENTER" and event.zone_id:
            zone_visits[event.zone_id].add(event.visitor_id)

    zone_visit_count = {
        zone: len(visitors)
        for zone, visitors in zone_visits.items()
    }

    busiest_zone = None
    busiest_zone_count = 0

    for zone, count in zone_visit_count.items():
        if count > busiest_zone_count:
            busiest_zone = zone
            busiest_zone_count = count

    hourly_traffic = defaultdict(int)

    for event in customer_events:
        if event.event_type != "ENTRY":
            continue

        dt = parse_ts(event.timestamp)
        hour = dt.strftime("%H:00")
        hourly_traffic[hour] += 1

    peak_traffic_hour = None

    if hourly_traffic:
        peak_traffic_hour = max(hourly_traffic, key=hourly_traffic.get)

    visitor_times = defaultdict(list)

    for event in customer_events:
        dt = parse_ts(event.timestamp)
        visitor_times[event.visitor_id].append(dt)

    session_durations = []

    for timestamps in visitor_times.values():
        timestamps.sort()

        if len(timestamps) > 1:
            duration_ms = (
                timestamps[-1] - timestamps[0]
            ).total_seconds() * 1000

            session_durations.append(duration_ms)

    avg_session_duration_ms = (
        round(sum(session_durations) / len(session_durations), 2)
        if session_durations
        else 0
    )

    current_queue_depth = compute_current_queue_depth(customer_events)
    abandonment_rate = compute_abandonment_rate(customer_events)

    return {
        "unique_visitors": len(unique_visitors),
        "total_events": len(customer_events),

        "busiest_zone": busiest_zone,
        "zone_visit_count": zone_visit_count,

        "peak_traffic_hour": peak_traffic_hour,

        "avg_dwell_per_zone": avg_dwell_per_zone,
        "avg_session_duration_ms": avg_session_duration_ms,

        "active_visitors": len(unique_visitors),

        "conversion_rate": 0.0,
        "current_queue_depth": current_queue_depth,
        "abandonment_rate": abandonment_rate,
    }