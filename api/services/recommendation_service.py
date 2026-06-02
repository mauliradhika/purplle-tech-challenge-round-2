from api.services.metrics_service import compute_store_metrics
from api.services.sales_service import (
    compute_category_performance,
    compute_sales_summary,
)


def build_business_recommendations(store_id: str, events):
    metrics = compute_store_metrics(events)
    sales_summary = compute_sales_summary(store_id)
    category_performance = compute_category_performance(store_id)

    recommendations = []

    if metrics["unique_visitors"] == 0 and metrics["total_events"] > 0:
        recommendations.append(
            {
                "severity": "INFO",
                "title": "Interior activity without entry crossings",
                "message": "Interior cameras detected customer activity, but no confirmed entry crossing was observed in the footage window.",
                "action": "Review entry camera placement or extend the evaluation window for more accurate entry conversion.",
            }
        )

    if sales_summary["total_orders"] > 0:
        recommendations.append(
            {
                "severity": "SUCCESS",
                "title": "Sales data connected successfully",
                "message": f"{sales_summary['total_orders']} orders generated ₹{sales_summary['total_revenue']} revenue.",
                "action": "Use sales and CCTV signals together to evaluate store performance.",
            }
        )

    if sales_summary["top_brand"]:
        recommendations.append(
            {
                "severity": "INFO",
                "title": "Top brand identified",
                "message": f"{sales_summary['top_brand']} is the highest revenue brand in the POS data.",
                "action": "Consider keeping this brand visible in high-traffic zones.",
            }
        )

    categories = category_performance.get("categories", [])

    if categories:
        top_category = categories[0]

        recommendations.append(
            {
                "severity": "INFO",
                "title": "Top category performance",
                "message": f"{top_category['category']} leads sales with ₹{top_category['revenue']} revenue.",
                "action": "Compare this with zone dwell and heatmap activity to validate product placement.",
            }
        )

    if metrics["current_queue_depth"] <= 2:
        recommendations.append(
            {
                "severity": "SUCCESS",
                "title": "Billing queue operating normally",
                "message": f"Current queue depth is {metrics['current_queue_depth']}.",
                "action": "No immediate billing counter intervention required.",
            }
        )
    elif metrics["current_queue_depth"] <= 5:
        recommendations.append(
            {
                "severity": "WARN",
                "title": "Billing queue building up",
                "message": f"Current queue depth is {metrics['current_queue_depth']}.",
                "action": "Keep backup staff ready near billing counter.",
            }
        )
    else:
        recommendations.append(
            {
                "severity": "CRITICAL",
                "title": "Billing congestion risk",
                "message": f"Current queue depth is {metrics['current_queue_depth']}.",
                "action": "Open an additional billing counter immediately.",
            }
        )

    if sales_summary["peak_sales_hour"]:
        recommendations.append(
            {
                "severity": "INFO",
                "title": "Peak sales window",
                "message": f"Peak sales activity occurred around {sales_summary['peak_sales_hour']}.",
                "action": "Schedule stronger floor and billing coverage during this hour.",
            }
        )

    return {
        "store_id": store_id,
        "recommendations": recommendations,
        "count": len(recommendations),
    }