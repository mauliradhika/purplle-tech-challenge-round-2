import { Anomalies, CategoryPerformance, EventData, Funnel, Health, HeatMap, Metrics, RecommendationProvided, SalesSummary, StaffPerformance } from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://127.0.0.1:8000";

const STORE_ID = "STORE_BLR_002";

async function fetchJson<T>(path: string): Promise<T> {
  const res = await fetch(`${API_BASE_URL}${path}`, {
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Failed to fetch ${path}`);
  }

  return res.json();
}

export async function getHealth() {
  return fetchJson<Health>("/health");
}

export async function getMetrics() {
  return fetchJson<Metrics>(`/stores/${STORE_ID}/metrics`);
}

export async function getFunnel() {
  return fetchJson<Funnel>(`/stores/${STORE_ID}/funnel`);
}

export async function getHeatmap() {
  return fetchJson<HeatMap>(`/stores/${STORE_ID}/heatmap`);
}

export async function getAnomalies() {
  return fetchJson<Anomalies>(`/stores/${STORE_ID}/anomalies`);
}

export async function getEvents() {
  return fetchJson<EventData>(`/stores/${STORE_ID}/events`);
}

export async function getSalesSummary() {
  return fetchJson<SalesSummary>(
    `/stores/${STORE_ID}/sales/summary`
  );
}

export async function getStaffPerformance() {
  return fetchJson<StaffPerformance>(
    `/stores/${STORE_ID}/sales/staff-performance`
  );
}

export async function getCategoryPerformance() {
  return fetchJson<CategoryPerformance>(
    `/stores/${STORE_ID}/sales/category-performance`
  );
}

export async function getRecommendations() {
  return fetchJson<RecommendationProvided>(
    `/stores/${STORE_ID}/business/recommendations`
  );
}