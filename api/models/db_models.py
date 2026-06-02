from sqlalchemy import Boolean, Column, Float, Integer, String

from api.core.database import Base


class EventDB(Base):
    __tablename__ = "events"

    event_id = Column(String, primary_key=True, index=True)

    store_id = Column(String, index=True)
    camera_id = Column(String)
    visitor_id = Column(String, index=True)

    event_type = Column(String, index=True)
    timestamp = Column(String)

    zone_id = Column(String, nullable=True)
    dwell_ms = Column(Integer, default=0)

    is_staff = Column(Boolean, default=False)
    confidence = Column(Float)

    queue_depth = Column(Integer, nullable=True)
    sku_zone = Column(String, nullable=True)
    session_seq = Column(Integer, default=1)