export type Event = {
    camera_id: string,
    confidence: number,
    dwell_ms: number,
    event_id: string,
    event_type: string,
    is_staff: boolean,
    metadata: {
        queue_depth: number | null,
        session_seq: number,
        sku_zone: string
    },
    store_id: string, 
    timestamp: string,
    visitor_id: string,
    zone_id: string
}

export type EventData = {
    count: number,
    store_id: string,
    events: Event[]
}

export type FunnelData = {
    count: number,
    dropoff_request: number,
    stage: string
}

export type Funnel = {
    session_count: number,
    store_funnel: FunnelData[]
}

export type HeatMapZone = {
    avg_dwell_ms: number,
    data_confidence: string,
    intensity: number,
    visit_count: number,
    zone_id: string
}

export type HeatMap = {
    count: number,
    zones: HeatMapZone[]
}

export type Anomaly = {
    severity: string,
    suggested_action: string
    type: string,
    message: string
}

export type Anomalies = {
    count: number,
    active_anomalies: Anomaly[]
}

export type Health = {
    status: string,
    last_event_timestamp_by_store: Record<string, string>
}

export type Metrics = {
    abandonment_rate: number,
    active_visitors: number,
    avg_dwell_per_zone: Record<string, number>,
    avg_session_duration_ms: number,
    busiest_zone: string,
    conversion_rate: number,
    current_queue_depth: number,
    peak_traffic_hour: number | null,
    total_events: number,
    unique_visitors: number,
    zone_visit_count: Record<string, number>
}

export type SalesSummary = {
    avg_order_value: number,
    peak_sales_hour: string,
    store_id: string,
    top_brand: string,
    top_category: string,
    total_orders: number,
    total_revenue: number,
    total_units: number
}

export type Staff = {
    avg_order_value: number,
    employee_code: string,
    orders: number,
    revenue: number,
    salesperson_name: string,
    units: number
}

export type StaffPerformance = {
    store_id: string,
    staff: Staff[]
}

export type Category = {
    avg_order_value: number,
    category: string,
    orders: number,
    revenue: number,
    units: number
}

export type CategoryPerformance = {
    store_id: string,
    categories: Category[]
}

export type Recommendation = {
    title: string,
    message: string,
    severity: string,
    action: string,
}

export type RecommendationProvided = {
    store_id: string,
    recommendations: Recommendation[]
}