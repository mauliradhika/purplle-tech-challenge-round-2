# Store Intelligence System — Technical Design

This document explains the system architecture, data flow, core modules, and engineering design behind the Store Intelligence platform built for the Purplle Tech Challenge 2026.

---

## 1. Design Goal

The goal of this project is not only to detect people in CCTV footage, but to build an end-to-end retail intelligence system.

The system converts:

```text
Raw CCTV footage + POS transactions
```

into:

```text
Structured events + business metrics + actionable recommendations
```

The design prioritizes:

- functional correctness
- reproducibility
- explainable decisions
- modular engineering
- business relevance
- ease of evaluation

---

## 2. High-Level Architecture

```text
                ┌──────────────────────┐
                │  CCTV Camera Feeds   │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Detection Pipeline   │
                │ YOLOv8 + Tracking    │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Retail Event Layer   │
                │ JSONL Event Stream   │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ Validation Layer     │
                └──────────┬───────────┘
                           │
                           ▼
                ┌──────────────────────┐
                │ FastAPI Backend      │
                │ Services + APIs      │
                └──────────┬───────────┘
                           │
             ┌─────────────┼──────────────┐
             ▼             ▼              ▼
       Metrics Engine   POS Engine   Recommendation Engine
             │             │              │
             └─────────────┼──────────────┘
                           ▼
                ┌──────────────────────┐
                │ Next.js Dashboard    │
                └──────────────────────┘
```

---

## 3. Repository Structure

```text
.
├── api
│   ├── endpoints
│   ├── services
│   ├── repositories
│   ├── models
│   └── core
│
├── client
│   ├── app
│   ├── components
│   ├── hooks
│   └── lib
│
├── pipeline
│   ├── detect.py
│   ├── tracker.py
│   ├── emit.py
│   └── validate_events.py
│
├── data
│   ├── CCTV resources
│   ├── POS CSV
│   └── camera config
│
├── tests
├── docs
├── DESIGN.md
├── CHOICES.md
└── docker-compose.yml
```

---

## 4. Computer Vision Pipeline

The CV pipeline converts CCTV footage into structured retail events.

### 4.1 Detection

The system uses **YOLOv8n** for person detection.

Reasons:

- lightweight
- fast enough for local execution
- strong baseline accuracy
- avoids unnecessary training complexity

### 4.2 Tracking

Detected persons are tracked across frames to reduce duplicate events.

Tracking enables:

- visitor continuity
- dwell calculation
- zone enter / exit transitions
- queue join detection

### 4.3 Camera-Aware Semantics

Each camera is assigned a semantic role.

| Camera | Role            | Used For                         |
| ------ | --------------- | -------------------------------- |
| CAM_1  | MAIN_FLOOR_A    | Main floor analytics             |
| CAM_2  | MAIN_FLOOR_B    | Product / browsing analytics     |
| CAM_3  | ENTRY_EXIT      | Entry and exit detection         |
| CAM_4  | STAFF_ONLY      | Excluded from customer analytics |
| CAM_5  | BILLING_COUNTER | Queue analytics                  |

This avoids assuming that every camera represents the same business context.

---

## 5. Event Model

The system uses an event-first architecture. Each CV signal is converted into a structured event.

Example event types:

```text
ENTRY
EXIT
ZONE_ENTER
ZONE_EXIT
ZONE_DWELL
BILLING_QUEUE_JOIN
```

### 5.1 Event Schema

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

### 5.2 Why Events?

Events make the system:

- auditable
- replayable
- debuggable
- deterministic
- easy to validate
- easy to extend

This also prevents API logic from depending directly on video processing.

---

## 6. Event Validation

Generated events are validated before ingestion.

Validation checks include:

- required fields
- valid event types
- valid store and camera IDs
- timestamp presence
- confidence range
- schema consistency

Invalid events are rejected before they reach analytics.

---

## 7. Backend Architecture

The backend follows a layered architecture:

```text
endpoints → services → repositories → database
```

### 7.1 Endpoints

Responsibilities:

- routing
- request handling
- response formatting

### 7.2 Services

Services contain business logic. Examples:

- metrics computation
- funnel logic
- heatmap generation
- anomaly detection
- sales aggregation
- recommendations

### 7.3 Repositories

Repositories isolate data access. This keeps service logic independent of storage implementation.

---

## 8. Core Analytics

### 8.1 Store Metrics

Computes:

- unique visitors
- total events
- busiest zone
- zone visit count
- average dwell
- session duration
- queue depth
- abandonment rate

### 8.2 Funnel Analytics

Tracks the customer journey:

```text
ENTRY → ZONE_VISIT → BILLING_QUEUE → PURCHASE
```

The funnel avoids double counting by using visitor/session-level aggregation.

### 8.3 Heatmap Analytics

Heatmaps are computed from zone visit count, dwell duration, and relative intensity.

Each zone receives:

- visit count
- average dwell
- intensity score
- data confidence

### 8.4 Anomaly Detection

Anomaly detection is rule-based and explainable. Examples:

- no traffic
- dead zones
- queue buildup
- high billing activity

The system favors explainability over opaque scoring.

---

## 9. POS Sales Intelligence

The POS dataset adds a business layer to the system.

The sales service computes:

- total revenue
- total orders
- total units
- average order value
- top brand
- top category
- peak sales hour

### 9.1 Staff Performance

Using salesperson fields from the POS data, the system computes:

- revenue per staff member
- orders handled
- units sold
- average order value

### 9.2 Category Performance

Using product category fields, the system computes:

- revenue by category
- units by category
- orders by category
- category average order value

---

## 10. Recommendation Engine

The recommendation engine combines CCTV metrics and POS insights to generate deterministic business recommendations.

Examples:

- billing queue is operating normally
- peak sales window identified
- top brand should be kept visible
- interior activity exists without entry crossings
- top category should be compared against heatmap engagement

The recommendations are rule-based intentionally, so that every output can be explained and audited.

---

## 11. Frontend Architecture

Built with Next.js, React, TailwindCSS, SWR, Recharts, and Lucide icons.

### 11.1 Data Fetching

The dashboard uses SWR for auto-refreshing analytics with a **5 second** refresh interval, giving a near real-time monitoring feel.

### 11.2 Dashboard Sections

- CCTV metrics
- queue intelligence
- funnel chart
- heatmap panel
- sales intelligence
- staff performance
- category performance
- business recommendations
- anomaly panel
- recent events table

---

## 12. Data Flow

**CCTV flow:**

```text
CCTV Video → YOLO Detection → Tracking → Camera-Specific Logic
   → Structured Events → Validation → Database Ingestion
   → Analytics Services → FastAPI APIs → Next.js Dashboard
```

**POS flow:**

```text
POS CSV → Sales Service → Revenue / Staff / Category Aggregation
   → Business Recommendations → Dashboard
```

---

## 13. Deployment Design

The system runs with Docker Compose.

Services:

- FastAPI backend
- PostgreSQL database

The Docker setup is optimized by:

- excluding raw videos from build context
- excluding local virtual environments
- installing only API dependencies inside the API image
- keeping CV dependencies separate from backend runtime dependencies

---

## 14. Testing Strategy

### Service-Level Tests

- metrics service
- funnel service
- heatmap service
- anomaly service
- sales service
- recommendation service

### API Tests

- health endpoint
- metrics endpoint
- funnel endpoint
- heatmap endpoint
- anomaly endpoint
- events endpoint
- sales endpoints
- recommendations endpoint

---

## 15. Scalability Considerations

The current system is designed for evaluation and local deployment, but the architecture supports scaling.

Possible production upgrades:

- Kafka / Redis Streams for event streaming
- dedicated inference workers
- GPU inference service
- WebSocket dashboard updates
- multi-store tenant model
- cross-camera ReID
- model-based staff/customer classification

---

## 16. Why This Design Fits the Challenge

The challenge values working systems, reasonable tradeoffs, edge case handling, business metrics, and clear reasoning.

This design directly addresses those goals by building:

```text
CCTV → Events → APIs → POS Intelligence → Dashboard → Recommendations
```

The system is intentionally practical, explainable, and evaluation-friendly.