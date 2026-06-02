from api.core.database import SessionLocal
from api.models.db_models import EventDB
from api.models.schemas import StoreEvent


def event_to_db(event: StoreEvent) -> EventDB:
    return EventDB(
        event_id=event.event_id,
        store_id=event.store_id,
        camera_id=event.camera_id,
        visitor_id=event.visitor_id,
        event_type=event.event_type,
        timestamp=event.timestamp,
        zone_id=event.zone_id,
        dwell_ms=event.dwell_ms,
        is_staff=event.is_staff,
        confidence=event.confidence,
        queue_depth=event.metadata.queue_depth,
        sku_zone=event.metadata.sku_zone,
        session_seq=event.metadata.session_seq,
    )


def db_to_event(row: EventDB) -> StoreEvent:
    return StoreEvent(
        event_id=row.event_id,
        store_id=row.store_id,
        camera_id=row.camera_id,
        visitor_id=row.visitor_id,
        event_type=row.event_type,
        timestamp=row.timestamp,
        zone_id=row.zone_id,
        dwell_ms=row.dwell_ms,
        is_staff=row.is_staff,
        confidence=row.confidence,
        metadata={
            "queue_depth": row.queue_depth,
            "sku_zone": row.sku_zone,
            "session_seq": row.session_seq,
        },
    )


def save_event(event: StoreEvent) -> bool:
    db = SessionLocal()

    try:
        existing = db.query(EventDB).filter(EventDB.event_id == event.event_id).first()

        if existing:
            return False

        db.add(event_to_db(event))
        db.commit()

        return True

    finally:
        db.close()


def get_all_events() -> list[StoreEvent]:
    db = SessionLocal()

    try:
        rows = db.query(EventDB).all()
        return [db_to_event(row) for row in rows]

    finally:
        db.close()


def get_store_events(store_id: str) -> list[StoreEvent]:
    db = SessionLocal()

    try:
        rows = db.query(EventDB).filter(EventDB.store_id == store_id).all()
        return [db_to_event(row) for row in rows]

    finally:
        db.close()


def get_last_event_timestamp_by_store() -> dict[str, str]:
    db = SessionLocal()

    try:
        rows = db.query(EventDB).all()
        result: dict[str, str] = {}

        for row in rows:
            current = result.get(row.store_id)

            if current is None or row.timestamp > current:
                result[row.store_id] = row.timestamp

        return result

    finally:
        db.close()