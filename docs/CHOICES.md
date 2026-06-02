# Engineering Decisions & Tradeoffs

This document explains the key engineering choices made during development, why those decisions were taken, and what tradeoffs were accepted.

The challenge emphasizes:

> working systems, reasonable assumptions, and engineering judgment over theoretical completeness.

---

## Table of Contents

1. [Why an Event-Driven Architecture?](#1-why-an-event-driven-architecture)
2. [Why YOLOv8n?](#2-why-yolov8n)
3. [Why Camera-Aware Semantics?](#3-why-camera-aware-semantics)
4. [Why No Cross-Camera ReID?](#4-why-no-cross-camera-reid)
5. [Why Rule Based Recommendations Instead of LLMs?](#5-why-rule-based-recommendations-instead-of-llms)
6. [Why Lightweight Staff Filtering?](#6-why-lightweight-staff-filtering)
7. [Why FastAPI?](#7-why-fastapi)
8. [Why NextJs For the Dashboard?](#8-why-nextjs-for-the-dashboard)
9. [Why Docker Compose?](#9-why-docker-compose)
10. [Why Extensive Testing?](#10-why-extensive-testing)
11. [Why POS Integration?](#11-why-pos-integration)
12. [Biggest Constraint](#12-biggest-constraint)
12. [Final Engineering Philosophy](#13-final-engineering-philosophy)

---

## 1. Why an Event-Driven Architecture?

Instead of computing analytics directly from video frames, the system first converts computer vision outputs into structured retail events.

```text
Video → Detection → Tracking → Events → Analytics
```

Retail analytics become significantly easier when based on structured events rather than raw detections. Instead of repeatedly processing bounding boxes across frames, the system generates reusable business events:

```text
ENTRY
EXIT
ZONE_ENTER
ZONE_EXIT
BILLING_QUEUE_JOIN
```

This separates computer vision from business intelligence.

**Benefits:**

- **Deterministic** — the same events always produce the same analytics, improving reproducibility, debugging, and explainability
- **Easier validation** — reviewers can inspect generated events directly rather than verifying model internals
- **Easier extensibility** — new analytics like basket analysis, staff productivity, or purchase prediction can reuse the same event stream without touching computer vision

**Tradeoff accepted:** An additional processing layer is introduced. However, modularity and explainability were prioritized over minimal implementation complexity.

---

## 2. Why YOLOv8n?

The system uses `YOLOv8n` instead of larger models.

**Alternatives considered:**

- `YOLOv8m / YOLOv8l` — potentially higher accuracy but slower inference and heavier resource usage
- Custom detector — better store-specific performance but outside challenge scope with no labeled dataset available

**Why YOLOv8n:** The challenge prioritizes working systems over maximum model performance. YOLOv8n provides fast inference, lightweight deployment, reliable person detection, and easy reproducibility — enabling an end-to-end system to be built within constraints.

**Tradeoff accepted:** Some detection accuracy is sacrificed compared to larger models. Speed, simplicity, and reproducibility were prioritized.

---

## 3. Why Camera-Aware Semantics?

Each camera was assigned a semantic business role:

| Camera | Role            |
| ------ | --------------- |
| CAM_3  | Entry / Exit    |
| CAM_5  | Billing Counter |
| CAM_4  | Staff Area      |

The provided dataset did not include zone annotations, semantic camera metadata, or store polygons. Without semantics, all cameras would be treated equally — a billing camera would contribute to entry count, and a staff room camera would contaminate customer heatmaps.

Automatic semantic discovery would require large training data, manual labeling, and additional modeling complexity — exceeding challenge scope.

**Tradeoff accepted:** Camera semantics were manually inferred from footage behavior. Domain-aware assumptions were considered preferable to noisy analytics.

---

## 4. Why No Cross-Camera ReID?

Visitor tracking is camera-local. The system does not perform cross-camera identity persistence.

Cross-camera ReID is difficult due to lighting changes, angle variation, clothing similarity, and occlusion. A robust ReID system requires appearance embeddings, trained matching models, and heavy experimentation.

A partially working ReID system could introduce incorrect visitor counts, double counting, and identity confusion. The challenge evaluates engineering judgment, not research novelty.

**Tradeoff accepted:** Some cross-camera continuity is lost. Analytics remain stable and explainable.

---

## 5. Why Rule-Based Recommendations Instead of LLMs?

Business recommendations are deterministic and rule-based.

LLM-based recommendations would introduce non-determinism, hallucinations, and reproducibility issues — two identical store conditions might produce different recommendations, making evaluation difficult.

Rule-based recommendations are:

- **Explainable** — e.g. `queue depth > threshold → suggest opening billing counter`
- **Deterministic** — same inputs always produce same outputs
- **Easy to debug** — every recommendation has traceable logic

**Tradeoff accepted:** Recommendations are less flexible than generative systems. Predictability was prioritized over novelty.

---

## 6. Why Lightweight Staff Filtering?

Staff members are filtered using heuristics rather than a dedicated employee classification model. No labeled staff dataset was provided, so a trained classifier would require annotations, training time, and evaluation overhead.

Instead, the system uses camera semantics, movement patterns, and context to reduce staff contamination.

**Tradeoff accepted:** Filtering is approximate. Reduced contamination is preferable to no filtering.

---

## 7. Why FastAPI?

**Alternatives considered:**

- Flask — simpler but weaker API tooling and schema support
- Django — batteries included but unnecessarily heavy for this use case

FastAPI provides fast development, automatic Swagger docs, strong typing, and production-oriented APIs — aligning well with rapid iteration and structured API requirements.

---

## 8. Why Next.js for the Dashboard?

The dashboard required component reuse, clean UI structure, dynamic fetching, and responsive rendering. SWR enabled automatic refresh every 5 seconds, creating a near real-time monitoring feel.

**Tradeoff accepted:** Frontend complexity increased. Presentation quality significantly improved evaluator experience.

---

## 9. Why Docker Compose?

The challenge explicitly evaluates ease of execution. A reviewer should be able to run the system without manual dependency setup, reducing environment issues, dependency mismatches, and setup friction.

**Tradeoff accepted:** Docker builds can be slower initially. Reproducibility outweighed setup cost.

---

## 10. Why Extensive Testing?

Tests were written for services, APIs, and analytics logic. The challenge values stability, correctness, and production readiness. Testing ensures metrics consistency, funnel correctness, recommendation stability, and endpoint reliability.

**Tradeoff accepted:** Testing required additional development time. System confidence and reliability improved substantially.

---

## 11. Why POS Integration?

A CCTV-only system provides behavioral signals but not business outcomes. POS data enables activity-to-revenue correlation:

```text
High dwell + Low sales = Potential merchandising issue
```

This made the system significantly more business relevant, aligning strongly with challenge goals.

---

## 12. Biggest Constraint

The biggest challenge was ambiguity. The dataset intentionally lacked exact camera semantics, zone definitions, annotations, staff labels, and entry polygons. Therefore the system prioritizes reasonable assumptions over perfect completeness.

---

## 13. Final Engineering Philosophy

This project intentionally prioritizes:

```text
working system  >  perfect research model
```

The goal was to build practical, deterministic, explainable, business-focused retail intelligence under real-world ambiguity — transforming CCTV and POS data into actionable business intelligence while remaining reproducible, modular, and evaluation-friendly.