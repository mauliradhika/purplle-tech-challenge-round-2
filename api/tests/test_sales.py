from api.services.sales_service import (
    compute_category_performance,
    compute_sales_summary,
    compute_staff_performance,
)


def test_sales_summary_for_mapped_store():
    summary = compute_sales_summary("STORE_BLR_002")

    assert summary["store_id"] == "STORE_BLR_002"
    assert summary["total_revenue"] > 0
    assert summary["total_orders"] > 0
    assert summary["avg_order_value"] > 0
    assert summary["top_brand"] is not None
    assert summary["top_category"] is not None
    assert summary["peak_sales_hour"] is not None


def test_sales_summary_for_unknown_store_returns_zeroes():
    summary = compute_sales_summary("UNKNOWN_STORE")

    assert summary["store_id"] == "UNKNOWN_STORE"
    assert summary["total_revenue"] == 0
    assert summary["total_orders"] == 0
    assert summary["total_units"] == 0
    assert summary["avg_order_value"] == 0
    assert summary["top_brand"] is None
    assert summary["top_category"] is None
    assert summary["peak_sales_hour"] is None


def test_staff_performance_excludes_unknown_staff():
    result = compute_staff_performance("STORE_BLR_002")

    assert result["store_id"] == "STORE_BLR_002"
    assert len(result["staff"]) > 0

    for staff in result["staff"]:
        assert staff["employee_code"] != "UNKNOWN"
        assert staff["salesperson_name"] != "UNKNOWN"

    top_staff = result["staff"][0]

    assert top_staff["revenue"] > 0
    assert top_staff["orders"] > 0
    assert top_staff["avg_order_value"] > 0


def test_category_performance_returns_sorted_categories():
    result = compute_category_performance("STORE_BLR_002")

    assert result["store_id"] == "STORE_BLR_002"
    assert len(result["categories"]) > 0

    revenues = [category["revenue"] for category in result["categories"]]

    assert revenues == sorted(revenues, reverse=True)

    top_category = result["categories"][0]

    assert top_category["category"] is not None
    assert top_category["revenue"] > 0
    assert top_category["orders"] > 0