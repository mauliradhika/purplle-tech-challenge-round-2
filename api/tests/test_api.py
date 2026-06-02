from fastapi.testclient import TestClient

from api.main import app


client = TestClient(app)


def test_health_endpoint():
    response = client.get("/health")

    assert response.status_code == 200

    data = response.json()

    assert data["status"] == "ok"
    assert "last_event_timestamp_by_store" in data


def test_metrics_endpoint():
    response = client.get("/stores/STORE_BLR_002/metrics")

    assert response.status_code == 200

    data = response.json()

    assert "unique_visitors" in data
    assert "total_events" in data
    assert "busiest_zone" in data
    assert "current_queue_depth" in data
    assert "abandonment_rate" in data


def test_funnel_endpoint():
    response = client.get("/stores/STORE_BLR_002/funnel")

    assert response.status_code == 200

    data = response.json()

    assert "store_funnel" in data
    assert "session_count" in data
    assert isinstance(data["store_funnel"], list)


def test_heatmap_endpoint():
    response = client.get("/stores/STORE_BLR_002/heatmap")

    assert response.status_code == 200

    data = response.json()

    assert "zones" in data
    assert "total_zones" in data
    assert isinstance(data["zones"], list)


def test_anomalies_endpoint():
    response = client.get("/stores/STORE_BLR_002/anomalies")

    assert response.status_code == 200

    data = response.json()

    assert "active_anomalies" in data
    assert "count" in data
    assert isinstance(data["active_anomalies"], list)


def test_events_endpoint():
    response = client.get("/stores/STORE_BLR_002/events")

    assert response.status_code == 200

    data = response.json()

    assert "store_id" in data
    assert "count" in data
    assert "events" in data
    assert isinstance(data["events"], list)


def test_sales_summary_endpoint():
    response = client.get("/stores/STORE_BLR_002/sales/summary")

    assert response.status_code == 200

    data = response.json()

    assert "total_revenue" in data
    assert "total_orders" in data
    assert "avg_order_value" in data
    assert data["total_revenue"] >= 0


def test_staff_performance_endpoint():
    response = client.get("/stores/STORE_BLR_002/sales/staff-performance")

    assert response.status_code == 200

    data = response.json()

    assert "staff" in data
    assert isinstance(data["staff"], list)


def test_category_performance_endpoint():
    response = client.get("/stores/STORE_BLR_002/sales/category-performance")

    assert response.status_code == 200

    data = response.json()

    assert "categories" in data
    assert isinstance(data["categories"], list)


def test_business_recommendations_endpoint():
    response = client.get("/stores/STORE_BLR_002/business/recommendations")

    assert response.status_code == 200

    data = response.json()

    assert "recommendations" in data
    assert "count" in data
    assert isinstance(data["recommendations"], list)