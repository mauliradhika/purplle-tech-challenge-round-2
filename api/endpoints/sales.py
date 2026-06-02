from fastapi import APIRouter

from api.services.sales_service import (
    compute_sales_summary,
    compute_staff_performance,
    compute_category_performance,
)


router = APIRouter()


@router.get("/stores/{store_id}/sales/summary")
def get_sales_summary(store_id: str):
    return compute_sales_summary(store_id)


@router.get("/stores/{store_id}/sales/staff-performance")
def get_staff_performance(store_id: str):
    return compute_staff_performance(store_id)


@router.get("/stores/{store_id}/sales/category-performance")
def get_category_performance(store_id: str):
    return compute_category_performance(store_id)