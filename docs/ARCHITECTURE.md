# System Architecture

This document explains the high-level system architecture, data flow, and component interaction of the **Purplle Store Intelligence Platform**.

The system is designed to transform:

```text
Raw CCTV Footage + POS Transactions
```

into:

```text
Retail Intelligence + Business Insights + Actionable Recommendations
```

The architecture prioritizes deterministic outputs, explainable analytics, modular components, reproducibility, and business relevance.

---

## Table of Contents

1. [High-Level Architecture](#high-level-architecture)
2. [End-to-End Data Flow](#end-to-end-data-flow)
3. [Camera Roles](#camera-roles)
4. [Computer Vision Pipeline](#computer-vision-pipeline)
5. [Event Pipeline](#event-pipeline)
6. [Validation Layer](#validation-layer)
7. [Analytics Engine](#analytics-engine)
8. [Recommendation Engine](#recommendation-engine)
9. [Frontend Dashboard](#frontend-dashboard)
10. [Design Decisions](#design-decisions)
11. [Deployment Architecture](#deployment-architecture)
12. [Architecture Philosophy](#architecture-philosophy)

---

## High-Level Architecture

```text
                    ┌────────────────────┐
                    │ CCTV Feeds (5 Cam) │
                    └─────────┬──────────┘
                              │
                              ▼
                ┌──────────────────────────┐
                │ Computer Vision Pipeline │
                │ YOLOv8n + Tracking       │
                └──────────┬───────────────┘
                           │
                           ▼
                ┌──────────────────────────┐
                │ Structured Event Layer   │
                │ JSONL Retail Events      │
                └──────────┬───────────────┘
                           │
                           ▼
                ┌──────────────────────────┐
                │ Validation Layer         │
                └──────────┬───────────────┘
                           │
                           ▼
                ┌──────────────────────────┐
                │ PostgreSQL Storage       │
                └──────────┬───────────────┘
                           │
                           ▼
                ┌──────────────────────────┐
                │ FastAPI Analytics Engine │
                └──────────┬───────────────┘
                           │
          ┌────────────────┼────────────────┐
          ▼                ▼                ▼
  CCTV Analytics     POS Intelligence   Recommendations
          │                │                │
          └────────────────┼────────────────┘
                           ▼
                ┌──────────────────────────┐
                │ Next.js Dashboard        │
                └──────────────────────────┘
```

---

## End-to-End Data Flow

The system follows an event-driven architecture.

**CCTV flow:**

```text
CCTV Video → Person Detection → Tracking → Semantic Understanding
    → Retail Event Generation → Validation → Database Ingestion
    → Analytics APIs → Dashboard Visualizations
```

**POS flow:**

```text
POS Dataset → Sales Intelligence Engine → Revenue Analytics
    → Staff + Category Performance → Business Recommendations → Dashboard
```

---

## Camera Roles

Each camera is assigned a semantic role to improve analytics quality and avoid treating every camera identically.

| Camera | Purpose                            |
| ------ | ---------------------------------- |
| CAM_1  | Main Floor A activity tracking     |
| CAM_2  | Main Floor B activity tracking     |
| CAM_3  | Entry / Exit monitoring            |
| CAM_4  | Staff / backroom activity          |
| CAM_5  | Billing counter queue intelligence |

The dataset did not provide zone polygons, semantic metadata, or explicit camera descriptions. Instead of manually annotating every frame, the system infers business context using semantic camera roles:

```text
MAIN_FLOOR_A  /  MAIN_FLOOR_B  /  ENTRY_EXIT  /  STAFF_ONLY  /  BILLING_COUNTER
```

This results in simpler implementation, lower annotation overhead, better explainability, and stronger robustness.

---

## Computer Vision Pipeline

Each CCTV stream is processed independently using a lightweight computer vision pipeline.

### Detection

The system uses `YOLOv8n` for person detection — fast inference, lightweight execution, confidence filtering, and local machine compatibility. Confidence filtering reduces false positives, unstable detections, and noisy bounding boxes.

### Tracking

Detected persons are tracked across frames, enabling visitor continuity, dwell time computation, queue detection, movement understanding, and event sequencing. Without tracking, every frame would create duplicate visitors, producing poor analytics.

### Semantic Understanding

The system interprets detections using camera context — entry/exit detection, billing queue estimation, dwell time tracking, visitor sessions, and staff vs customer heuristics. The goal is:

```text
Detection → Retail Meaning
```

instead of:

```text
Detection → Raw Bounding Boxes
```

---

## Event Pipeline

The system generates normalized retail events in JSONL format.

**Supported event types:**

```text
ENTRY
EXIT
ZONE_ENTER
ZONE_EXIT
ZONE_DWELL
BILLING_QUEUE_JOIN
```

**Event lifecycle:**

```text
CCTV Frame → YOLO Detection → Tracking → Semantic Interpretation
    → Retail Event JSON → Validation → Database Ingestion
```

The event-first architecture provides determinism (same input produces same output), auditability (analytics traceable back to events), simpler business logic, and easier debugging.

### Example Event

```json
{
  "event_id": "uuid-v4",
  "store_id": "STORE_BLR_002",
  "camera_id": "CAM_5",
  "visitor_id": "CAM_5_VIS_12",
  "event_type": "BILLING_QUEUE_JOIN",
  "timestamp": "2026-05-30T05:10:14Z",
  "zone_id": "BILLING",
  "dwell_ms": 0,
  "is_staff": false,
  "confidence": 0.91,
  "metadata": {
    "queue_depth": 3,
    "sku_zone": "BILLING_COUNTER",
    "session_seq": 2
  }
}
```

---

## Validation Layer

Generated events are validated before ingestion. Validation covers required fields, valid event types, timestamp consistency, confidence range, schema correctness, and store and camera validity. Invalid events are rejected before analytics computation, preventing garbage input from producing garbage analytics.

---

## Analytics Engine

The FastAPI backend computes business intelligence using structured events.

### CCTV Intelligence

Computes store metrics, visitor analytics, queue intelligence, heatmap analytics, dwell metrics, visitor funnel, and anomaly detection — including current queue depth, abandonment estimation, busiest zone, and peak traffic hour.

### POS Intelligence

The provided transaction dataset is integrated into the analytics layer.

**Revenue Intelligence** — total revenue, total orders, total units sold, average order value, peak sales hour

**Staff Performance** — salesperson contribution, order count, revenue generated, units sold

**Category Performance** — category revenue, order contribution, category popularity, average order value

**Brand Intelligence** — top brand, top category

---

## Recommendation Engine

The recommendation engine combines CCTV analytics and POS intelligence to generate actionable business insights. Examples:

```text
Queue operating normally
Peak sales hour identified
Top category performance
Entry mismatch detected
Product placement opportunity
```

Recommendations are intentionally deterministic, explainable, and reproducible rather than opaque or random.

---

## Frontend Dashboard

Built with Next.js, React, TailwindCSS, SWR, and Recharts. The UI auto-refreshes every **5 seconds** for near real-time monitoring.

**Retail Analytics** — KPI monitoring, queue intelligence, funnel visualization, heatmap intensity, recent event timeline, anomaly detection

**Sales Intelligence** — revenue KPIs, staff performance, category performance, peak sales window

**Business Intelligence** — actionable recommendations, operational alerts, queue insights, revenue-based signals

---

## Design Decisions

### Why Synchronous Processing Instead of Kafka?

The challenge provided batch CCTV footage rather than real-time streaming cameras. A synchronous event pipeline was chosen to prioritize deterministic analytics, reproducibility, simpler debugging, and faster iteration. The architecture remains modular so Kafka, Redis Streams, or WebSocket pipelines can be added later without major refactoring.

### Why Role-Based Cameras?

Instead of requiring polygon-level manual annotation for every frame, semantic camera roles were used. This improves robustness, reduces manual labeling, improves explainability, and accelerates development.

---

## Deployment Architecture

The system is fully containerized using Docker Compose with three services — FastAPI backend, PostgreSQL database, and Next.js frontend dashboard.

**Reviewer flow:**

```text
docker compose up --build  →  localhost:3000  →  /docs  →  Inspect APIs + Dashboard
```

Benefits: reproducibility, zero manual dependency setup, environment consistency, and simplified evaluation.

---

## Architecture Philosophy

The system intentionally prioritizes:

```text
Working System  >  Perfect Research Prototype
```

The goal is to produce:

```text
CCTV → Events → Analytics → Business Intelligence
```

under real-world ambiguity while remaining modular, explainable, reproducible, and evaluation-friendly.