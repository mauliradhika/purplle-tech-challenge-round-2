import csv
from collections import defaultdict
from functools import lru_cache
from pathlib import Path


ROOT_DIR = Path(__file__).resolve().parents[2]
SALES_CSV_PATH = ROOT_DIR / "data" / "Brigade_Bangalore.csv"
STORE_ID_MAPPING = {
    "STORE_BLR_002": "ST1008",
    "ST1008": "ST1008",
}

def safe_float(value):
    try:
        if value is None or value == "":
            return 0.0
        return float(value)
    except (TypeError, ValueError):
        return 0.0


def safe_int(value):
    try:
        if value is None or value == "":
            return 0
        return int(float(value))
    except (TypeError, ValueError):
        return 0


@lru_cache(maxsize=1)
def load_sales_rows():
    if not SALES_CSV_PATH.exists():
        return []

    rows = []

    with open(SALES_CSV_PATH, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)

        for row in reader:
            rows.append(row)

    return rows


def get_sales_rows_for_store(store_id: str):
    mapped_store_id = STORE_ID_MAPPING.get(
        store_id,
        store_id,
    )

    rows = load_sales_rows()

    return [
        row
        for row in rows
        if row.get("store_id") == mapped_store_id
    ]


def compute_sales_summary(store_id: str):
    rows = get_sales_rows_for_store(store_id)

    if not rows:
        return {
            "store_id": store_id,
            "total_revenue": 0,
            "total_orders": 0,
            "total_units": 0,
            "avg_order_value": 0,
            "top_brand": None,
            "top_category": None,
            "peak_sales_hour": None,
        }

    order_ids = set()
    total_revenue = 0.0
    total_units = 0

    revenue_by_brand = defaultdict(float)
    revenue_by_category = defaultdict(float)
    orders_by_hour = defaultdict(set)

    for row in rows:
        order_id = row.get("order_id")
        order_time = row.get("order_time", "")
        brand_name = (row.get("brand_name") or "UNKNOWN").strip()
        category = (row.get("dep_name") or "UNKNOWN").strip()

        revenue = safe_float(row.get("total_amount"))
        qty = safe_int(row.get("qty"))

        if order_id:
            order_ids.add(order_id)

            if len(order_time) >= 2:
                hour = order_time[:2]
                orders_by_hour[hour].add(order_id)

        total_revenue += revenue
        total_units += qty

        revenue_by_brand[brand_name] += revenue
        revenue_by_category[category] += revenue

    total_orders = len(order_ids)

    top_brand = (
        max(revenue_by_brand, key=revenue_by_brand.get)
        if revenue_by_brand
        else None
    )

    top_category = (
        max(revenue_by_category, key=revenue_by_category.get)
        if revenue_by_category
        else None
    )

    peak_sales_hour = (
        max(orders_by_hour, key=lambda hour: len(orders_by_hour[hour]))
        if orders_by_hour
        else None
    )

    return {
        "store_id": store_id,
        "total_revenue": round(total_revenue, 2),
        "total_orders": total_orders,
        "total_units": total_units,
        "avg_order_value": round(total_revenue / total_orders, 2)
        if total_orders
        else 0,
        "top_brand": top_brand,
        "top_category": top_category,
        "peak_sales_hour": f"{peak_sales_hour}:00" if peak_sales_hour else None,
    }


def compute_staff_performance(store_id: str):
    rows = get_sales_rows_for_store(store_id)

    staff = defaultdict(
        lambda: {
            "employee_code": None,
            "salesperson_name": None,
            "orders": set(),
            "revenue": 0.0,
            "units": 0,
        }
    )

    for row in rows:
        employee_code = (row.get("employee_code") or "UNKNOWN").strip()
        salesperson_name = (row.get("salesperson_name") or "UNKNOWN").strip()
        if employee_code == "UNKNOWN" or salesperson_name == "UNKNOWN":
            continue

        order_id = row.get("order_id")

        revenue = safe_float(row.get("total_amount"))
        qty = safe_int(row.get("qty"))

        staff_record = staff[employee_code]
        staff_record["employee_code"] = employee_code
        staff_record["salesperson_name"] = salesperson_name

        if order_id:
            staff_record["orders"].add(order_id)

        staff_record["revenue"] += revenue
        staff_record["units"] += qty

    result = []

    for record in staff.values():
        order_count = len(record["orders"])

        result.append(
            {
                "employee_code": record["employee_code"],
                "salesperson_name": record["salesperson_name"],
                "orders": order_count,
                "revenue": round(record["revenue"], 2),
                "units": record["units"],
                "avg_order_value": round(record["revenue"] / order_count, 2)
                if order_count
                else 0,
            }
        )

    result.sort(key=lambda item: item["revenue"], reverse=True)

    return {
        "store_id": store_id,
        "staff": result,
    }


def compute_category_performance(store_id: str):
    rows = get_sales_rows_for_store(store_id)

    categories = defaultdict(
        lambda: {
            "category": None,
            "orders": set(),
            "revenue": 0.0,
            "units": 0,
        }
    )

    for row in rows:
        category = (row.get("dep_name") or "UNKNOWN").strip()

        if category == "UNKNOWN":
            continue

        order_id = row.get("order_id")
        revenue = safe_float(row.get("total_amount"))
        qty = safe_int(row.get("qty"))

        record = categories[category]
        record["category"] = category

        if order_id:
            record["orders"].add(order_id)

        record["revenue"] += revenue
        record["units"] += qty

    result = []

    for record in categories.values():
        order_count = len(record["orders"])

        result.append(
            {
                "category": record["category"],
                "orders": order_count,
                "revenue": round(record["revenue"], 2),
                "units": record["units"],
                "avg_order_value": round(record["revenue"] / order_count, 2)
                if order_count
                else 0,
            }
        )

    result.sort(key=lambda item: item["revenue"], reverse=True)

    return {
        "store_id": store_id,
        "categories": result,
    }