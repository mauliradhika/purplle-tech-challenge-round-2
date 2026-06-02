'use client'

import useSWR from 'swr'

import {
  getAnomalies,
  getCategoryPerformance,
  getEvents,
  getFunnel,
  getHealth,
  getHeatmap,
  getMetrics,
  getRecommendations,
  getSalesSummary,
  getStaffPerformance,
} from '@/lib/api'

export function useDashboardData() {
  const refreshInterval = 5000

  const health = useSWR('health', getHealth, {
    refreshInterval,
  })

  const metrics = useSWR('metrics', getMetrics, {
    refreshInterval,
  })

  const funnel = useSWR('funnel', getFunnel, {
    refreshInterval,
  })

  const heatmap = useSWR('heatmap', getHeatmap, {
    refreshInterval,
  })

  const anomalies = useSWR('anomalies', getAnomalies, { refreshInterval })

  const events = useSWR('events', getEvents, {
    refreshInterval,
  })

  const salesSummary = useSWR('sales-summary', getSalesSummary, {
    refreshInterval,
  })

  const staffPerformance = useSWR('staff-performance', getStaffPerformance, {
    refreshInterval,
  })

  const categoryPerformance = useSWR(
    'category-performance',
    getCategoryPerformance,
    { refreshInterval },
  )

  const recommendations = useSWR('recommendations', getRecommendations, {
    refreshInterval,
  })

  return {
    health: health.data,
    metrics: metrics.data,
    funnel: funnel.data,
    heatmap: heatmap.data,
    anomalies: anomalies.data,
    events: events.data,
    salesSummary: salesSummary.data,
    staffPerformance: staffPerformance.data,
    categoryPerformance: categoryPerformance.data,
    recommendations: recommendations.data,
    isLoading:
      health.isLoading ||
      metrics.isLoading ||
      funnel.isLoading ||
      heatmap.isLoading ||
      anomalies.isLoading ||
      events.isLoading ||
      salesSummary.isLoading ||
      staffPerformance.isLoading ||
      categoryPerformance.isLoading ||
      recommendations.isLoading,
    isError:
      health.error ||
      metrics.error ||
      funnel.error ||
      heatmap.error ||
      anomalies.error ||
      events.error ||
      salesSummary.error ||
      staffPerformance.error ||
      categoryPerformance.error ||
      recommendations.error,
    lastUpdated: new Date().toLocaleTimeString(),
  }
}
