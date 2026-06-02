# Demo Walkthrough

This document provides a guided walkthrough of the **Purplle Store Intelligence Platform** and explains how the system transforms:

```text
Raw CCTV Footage + POS Transactions
```

into:

```text
Retail Intelligence + Business Insights
```

The objective is to help reviewers quickly evaluate system functionality, business relevance, API correctness, dashboard quality, and engineering decisions.

---

## Table of Contents

1. [Running the System](#1-running-the-system)
2. [Problem Statement](#2-problem-statement)
3. [Multi-Camera Store Setup](#3-multi-camera-store-setup)
4. [Computer Vision Pipeline](#4-computer-vision-pipeline)
5. [Staff Filtering](#5-staff-filtering)
6. [Event Pipeline](#6-event-pipeline)
7. [Dashboard Demonstration](#7-dashboard-demonstration)
8. [API Demonstration](#8-api-demonstration)
9. [Production Readiness](#9-production-readiness)
10. [Future Improvements](#10-future-improvements)
11. [Suggested Reviewer Flow](#11-suggested-reviewer-flow)

---

## 1. Running the System

```bash
docker compose up --build
```

This launches the FastAPI backend, PostgreSQL database, and Next.js frontend dashboard.

| Service              | URL                          |
| -------------------- | ---------------------------- |
| Frontend Dashboard   | http://localhost:3000        |
| Backend API          | http://127.0.0.1:8000        |
| Swagger Docs         | http://127.0.0.1:8000/docs   |

> Note: During a cold Docker build, the frontend container may take ~20–40 seconds to fully start due to Next.js production compilation.

---

## 2. Problem Statement

Retail stores generate massive CCTV footage but lack meaningful operational intelligence. The goal of this system is to convert raw CCTV footage into structured retail intelligence — visitor tracking, zone analytics, dwell time, queue intelligence, visitor funnel, anomaly detection, sales intelligence, and actionable business recommendations.

> Instead of simply detecting people, the system focuses on converting store activity into measurable business outcomes.

---

## 3. Multi-Camera Store Setup

The provided dataset contains **5 synchronized CCTV feeds**, each assigned a semantic role.

| Camera | Purpose                            |
| ------ | ---------------------------------- |
| CAM_1  | Main Floor A activity tracking     |
| CAM_2  | Main Floor B product interaction   |
| CAM_3  | Entry / Exit monitoring            |
| CAM_4  | Staff / backroom activity          |
| CAM_5  | Billing counter queue intelligence |

The challenge dataset did not provide zone annotations, polygon layouts, or semantic metadata. Instead of manually labeling zones, camera-level business semantics were introduced:

```text
ENTRY_EXIT  /  BILLING_COUNTER  /  STAFF_ONLY  /  MAIN_FLOOR_A  /  MAIN_FLOOR_B
```

This improves explainability, robustness, development speed, and analytics simplicity.

---

## 4. Computer Vision Pipeline

The system processes CCTV footage using YOLOv8n, multi-object tracking, and camera-aware event logic.

The pipeline performs person detection, visitor tracking, dwell estimation, entry/exit understanding, billing queue detection, and staff filtering — converting movement into structured retail events:

```text
ENTRY  /  EXIT  /  ZONE_ENTER  /  ZONE_EXIT  /  ZONE_DWELL  /  BILLING_QUEUE_JOIN
```

These events become the foundation of all analytics.

---

## 5. Staff Filtering

The billing area includes both customers and staff movement. Without filtering, queue analytics become inaccurate. The system applies Queue ROI and staff filtering heuristics to reduce false queue signals, preventing employee movement from being interpreted as customer congestion.

---

## 6. Event Pipeline

Detected activity is converted into `events.jsonl` — validated, replayable, deterministic, and idempotently ingested before entering PostgreSQL.

```text
CCTV Frame → YOLO Detection → Tracking → Semantic Interpretation
    → Store Event JSON → Validation → Database Ingestion
```

This event-first architecture ensures reproducibility, auditability, easier debugging, and deterministic analytics.

---

## 7. Dashboard Demonstration

Open `http://localhost:3000` to see how CCTV activity becomes business intelligence.

### Retail Analytics

**Store KPIs** — visitor count, queue depth, abandonment estimate, dwell analytics, busiest zone

**Funnel Analytics** — models the customer journey as `ENTRY → ZONE_VISIT → BILLING_QUEUE → PURCHASE` to identify drop-off, conversion, and bottlenecks

**Heatmap Analytics** — shows busiest areas, engagement intensity, and dwell concentration to distinguish high traffic zones from low engagement zones

**Anomaly Detection** — detects unusual inactivity, queue buildup, dead zones, and suspicious patterns

### Sales Intelligence

**Revenue KPIs** — total revenue, total orders, average order value, peak sales hour

**Staff Performance** — salesperson contribution, revenue generated, orders handled, units sold

**Category Performance** — top-performing category, revenue contribution, category popularity, units sold

### Business Recommendations

The recommendation engine combines CCTV activity and POS signals to generate actionable recommendations — queue status, peak sales windows, top category performance, product placement opportunities, and entry mismatch warnings — demonstrating a direct path from store activity to business decisions.

---

## 8. API Demonstration

Open Swagger at `http://127.0.0.1:8000/docs` to validate all endpoints.

### Health

```http
GET /health
```

Verifies system health and backend availability.

### Store Metrics

```http
GET /stores/STORE_BLR_002/metrics
```

Returns busiest zone, dwell analytics, session duration, queue depth, and abandonment rate.

### Funnel

```http
GET /stores/STORE_BLR_002/funnel
```

Returns `ENTRY → ZONE_VISIT → BILLING_QUEUE → PURCHASE` with drop-off behavior.

### Heatmap

```http
GET /stores/STORE_BLR_002/heatmap
```

Returns zone-level activity intensity, dwell information, and engagement confidence.

### Anomalies

```http
GET /stores/STORE_BLR_002/anomalies
```

Returns queue congestion alerts, dead zones, and unusual activity signals.

### Sales Summary

```http
GET /stores/STORE_BLR_002/sales/summary
```

Returns revenue, orders, top category, top brand, and peak sales hour.

### Staff Performance

```http
GET /stores/STORE_BLR_002/sales/staff-performance
```

Returns salesperson contribution, orders, revenue, and units sold.

### Category Performance

```http
GET /stores/STORE_BLR_002/sales/category-performance
```

Returns category revenue, orders, and units sold.

### Recommendations

```http
GET /stores/STORE_BLR_002/business/recommendations
```

Returns explainable retail recommendations covering queue suggestions, sales insights, and merchandising signals.

---

## 9. Production Readiness

The system includes Docker deployment, PostgreSQL persistence, modular architecture, repository pattern, service layer separation, Swagger documentation, a test suite, and a frontend dashboard — launchable with a single command and no manual dependency setup.

---

## 10. Future Improvements

- Cross-camera ReID
- Real-time dashboard streaming via WebSockets
- Kafka event pipelines
- Staff/customer classifier
- Polygon-based store layouts
- Predictive analytics

---

## 11. Suggested Reviewer Flow

```text
docker compose up --build
        ↓
Open localhost:3000
        ↓
Inspect dashboard & sales intelligence
        ↓
Review recommendations
        ↓
Open /docs → Validate APIs
        ↓
Review DESIGN.md + CHOICES.md
```

This demonstrates the full pipeline — CCTV → Retail Events → Analytics → Business Intelligence — under real-world ambiguity.