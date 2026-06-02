from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from api.bootstrap import bootstrap_events
from api.core.database import Base, engine
from api.endpoints.anomalies import router as anomalies_router
from api.endpoints.events import router as events_router
from api.endpoints.funnel import router as funnel_router
from api.endpoints.health import router as health_router
from api.endpoints.heatmap import router as heatmap_router
from api.endpoints.metrics import router as metrics_router
from api.endpoints.sales import router as sales_router
from api.endpoints.recommendations import router as recommendations_router


app = FastAPI(
    title="Purplle Store Intelligence API",
    description="""
AI-powered retail intelligence system for CCTV-based store analytics.

Features:
- Visitor tracking
- Zone analytics
- Funnel intelligence
- Heatmap analytics
- Anomaly detection
- Event ingestion pipeline
""",
    version="1.0.0",
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",
        "http://127.0.0.1:3000",
        "https://purplle-tech-challenge-round-2.vercel.app"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

Base.metadata.create_all(bind=engine)
bootstrap_events()

app.include_router(health_router)
app.include_router(events_router)
app.include_router(metrics_router)
app.include_router(funnel_router)
app.include_router(heatmap_router)
app.include_router(anomalies_router)
app.include_router(sales_router)
app.include_router(recommendations_router)