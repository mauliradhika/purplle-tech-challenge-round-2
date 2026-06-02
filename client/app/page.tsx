'use client'

import {
  AlertTriangle,
  Activity,
  Clock,
  Flame,
  Users,
  Wifi,
  IndianRupee,
  Trophy,
  Lightbulb,
  BarChart3,
  TrendingUp,
  ShoppingBag,
} from 'lucide-react'

import { AnomaliesPanel } from '@/components/AnomaliesPanel'
import { EventsTable } from '@/components/EventsTable'
import { FunnelChart } from '@/components/FunnelChart'
import { HeatmapPanel } from '@/components/HeatmapPanel'
import { MetricCard } from '@/components/MetricCard'
import { StatusBadge } from '@/components/StatusBadge'
import { Category, FunnelData, Recommendation, Staff } from '@/lib/types'
import { useDashboardData } from '@/hooks/useDashboardData'
import LoadingScreen from '@/components/LoadingScreen'
import ErrorScreen from '@/components/ErrorScreen'
import { RefreshCountdown } from '@/components/RefreshCountdown'

function formatMs(ms: number) {
  if (!ms) return '0s'
  return `${Math.round(ms / 1000)}s`
}

function formatRevenue(val: number) {
  if (val >= 100000) return `₹${(val / 100000).toFixed(1)}L`
  if (val >= 1000) return `₹${(val / 1000).toFixed(1)}K`
  return `₹${val}`
}

function recommendationTone(severity: string) {
  if (severity === 'SUCCESS')
    return 'border-l-emerald-400 bg-emerald-50 text-emerald-800'
  if (severity === 'WARN')
    return 'border-l-amber-400 bg-amber-50 text-amber-800'
  if (severity === 'CRITICAL') return 'border-l-red-400 bg-red-50 text-red-800'
  return 'border-l-blue-400 bg-blue-50 text-blue-800'
}

function recommendationBadge(severity: string) {
  if (severity === 'SUCCESS') return 'bg-emerald-100 text-emerald-700'
  if (severity === 'WARN') return 'bg-amber-100 text-amber-700'
  if (severity === 'CRITICAL') return 'bg-red-100 text-red-700'
  return 'bg-blue-100 text-blue-700'
}

function SectionHeader({
  icon,
  title,
  subtitle,
}: {
  icon: React.ReactNode
  title: string
  subtitle?: string
}) {
  return (
    <div className="mb-5 flex items-start gap-3">
      <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-slate-100">
        {icon}
      </div>
      <div>
        <h2 className="text-base font-semibold text-slate-900">{title}</h2>
        {subtitle && (
          <p className="mt-0.5 text-xs text-slate-500">{subtitle}</p>
        )}
      </div>
    </div>
  )
}

export default function Home() {
  const {
    health,
    metrics,
    funnel,
    heatmap,
    anomalies,
    events,
    salesSummary,
    staffPerformance,
    categoryPerformance,
    recommendations,
    isLoading,
    isError,
    lastUpdated,
  } = useDashboardData()

  if (isLoading) return <LoadingScreen />

  if (
    isError ||
    !health ||
    !metrics ||
    !funnel ||
    !heatmap ||
    !anomalies ||
    !events ||
    !salesSummary ||
    !staffPerformance ||
    !categoryPerformance ||
    !recommendations
  ) {
    return <ErrorScreen />
  }

  const funnelData = funnel.store_funnel.filter(
    (item: FunnelData) => !(item.stage === 'ENTRY' && item.count === 0),
  )

  const topStaff = staffPerformance.staff?.slice(0, 3) || []
  const topCategories = categoryPerformance.categories?.slice(0, 4) || []
  const maxCategoryRevenue = topCategories[0]?.revenue || 1

  return (
    <main className="min-h-screen bg-slate-50 text-slate-900">
      {/* Header */}
      <header className="sticky top-0 z-10 border-b border-slate-200 bg-white/80 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-3">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-slate-900">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="text-xs text-slate-400">
                Purplle Tech Challenge 2026
              </p>
              <p className="text-sm font-semibold text-slate-900 leading-tight">
                Store Intelligence · STORE_BLR_002
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="hidden md:block">
              <RefreshCountdown intervalMs={5000} />
            </div>
            <StatusBadge status={health.status} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl space-y-6 px-6 py-6">
        {/* Hero KPIs */}
        <section>
          <div className="mb-3 flex items-center justify-between">
            <h1 className="text-xl font-bold text-slate-900">Store Overview</h1>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
              Live
            </span>
          </div>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <MetricCard
              title="Total Events"
              value={metrics.total_events}
              subtitle="Validated CCTV events captured"
              status="neutral"
            />
            <MetricCard
              title="Unique Visitors"
              value={metrics.unique_visitors}
              subtitle="Confirmed entry crossings"
              status={
                metrics.unique_visitors > 10
                  ? 'good'
                  : metrics.unique_visitors > 0
                    ? 'warning'
                    : 'danger'
              }
              badge={
                metrics.unique_visitors > 10
                  ? 'Healthy'
                  : metrics.unique_visitors > 0
                    ? 'Low Traffic'
                    : 'No Traffic'
              }
            />
            <MetricCard
              title="Busiest Zone"
              value={metrics.busiest_zone || 'N/A'}
              subtitle="Highest footfall area"
              status="good"
              badge="Most Active"
            />
            <MetricCard
              title="Billing Queue"
              value={metrics.current_queue_depth}
              subtitle="People waiting at checkout"
              status={
                metrics.current_queue_depth <= 2
                  ? 'good'
                  : metrics.current_queue_depth <= 5
                    ? 'warning'
                    : 'danger'
              }
              badge={
                metrics.current_queue_depth <= 2
                  ? 'Clear'
                  : metrics.current_queue_depth <= 5
                    ? 'Building Up'
                    : 'Congested'
              }
            />
          </div>
        </section>

        {/* Session metrics */}
        <section className="grid gap-3 md:grid-cols-3">
          <MetricCard
            title="Avg Time in Store"
            value={formatMs(metrics.avg_session_duration_ms)}
            subtitle="How long customers stay on average"
            status={
              metrics.avg_session_duration_ms > 90000
                ? 'good'
                : metrics.avg_session_duration_ms > 30000
                  ? 'warning'
                  : 'danger'
            }
            badge={
              metrics.avg_session_duration_ms > 90000
                ? 'High Engagement'
                : metrics.avg_session_duration_ms > 30000
                  ? 'Average'
                  : 'Low Engagement'
            }
          />
          <MetricCard
            title="Peak Footfall Hour"
            value={metrics.peak_traffic_hour || 'N/A'}
            subtitle="Hour with most visitors walking in (from CCTV)"
            status={metrics.peak_traffic_hour ? 'good' : 'neutral'}
          />
          <MetricCard
            title="Cart Abandonment"
            value={`${metrics.abandonment_rate}%`}
            subtitle="Visitors who left before billing"
            status={
              metrics.abandonment_rate <= 10
                ? 'good'
                : metrics.abandonment_rate <= 30
                  ? 'warning'
                  : 'danger'
            }
            badge={
              metrics.abandonment_rate <= 10
                ? 'Very Low'
                : metrics.abandonment_rate <= 30
                  ? 'Monitor'
                  : 'High Risk'
            }
          />
        </section>

        {/* Sales Intelligence */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<IndianRupee className="h-4 w-4 text-emerald-600" />}
            title="Sales Intelligence"
            subtitle="Revenue and order insights from POS transactions"
          />

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                label: 'Total Revenue',
                value: formatRevenue(salesSummary.total_revenue),
                raw: `₹${salesSummary.total_revenue.toLocaleString()}`,
                color: 'bg-emerald-50 border-emerald-100',
                text: 'text-emerald-700',
                icon: <TrendingUp className="h-4 w-4 text-emerald-600" />,
              },
              {
                label: 'Total Orders',
                value: salesSummary.total_orders,
                raw: 'orders processed',
                color: 'bg-blue-50 border-blue-100',
                text: 'text-blue-700',
                icon: <ShoppingBag className="h-4 w-4 text-blue-600" />,
              },
              {
                label: 'Avg Order Value',
                value: formatRevenue(salesSummary.avg_order_value),
                raw: `₹${salesSummary.avg_order_value} per order`,
                color: 'bg-violet-50 border-violet-100',
                text: 'text-violet-700',
                icon: <IndianRupee className="h-4 w-4 text-violet-600" />,
              },
              {
                label: 'Peak Sales Hour',
                value: salesSummary.peak_sales_hour,
                raw: 'highest transaction volume',
                color: 'bg-amber-50 border-amber-100',
                text: 'text-amber-700',
                icon: <Clock className="h-4 w-4 text-amber-600" />,
              },
            ].map((item) => (
              <div
                key={item.label}
                className={`rounded-xl border p-4 ${item.color}`}
              >
                <div
                  className={`flex items-center gap-1.5 text-xs font-medium ${item.text}`}
                >
                  {item.icon}
                  {item.label}
                </div>
                <p className="mt-2 text-2xl font-bold text-slate-900">
                  {item.value}
                </p>
                <p className="mt-1 text-xs text-slate-500">{item.raw}</p>
              </div>
            ))}
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2">
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Top Brand</p>
                <p className="mt-0.5 font-semibold text-slate-900">
                  {salesSummary.top_brand}
                </p>
              </div>
              <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                #1
              </span>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-slate-50 px-4 py-3">
              <div>
                <p className="text-xs text-slate-500">Top Category</p>
                <p className="mt-0.5 font-semibold text-slate-900">
                  {salesSummary.top_category}
                </p>
              </div>
              <span className="rounded-full bg-slate-200 px-2.5 py-1 text-xs font-medium text-slate-600">
                #1
              </span>
            </div>
          </div>
        </section>

        {/* Funnel + Queue */}
        <section className="grid gap-6 lg:grid-cols-5">
          <div className="lg:col-span-3">
            <FunnelChart data={funnelData} />
          </div>

          <div className="lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={<Flame className="h-4 w-4 text-orange-500" />}
              title="Queue & Checkout Health"
              subtitle="Real-time billing area status"
            />

            <div className="space-y-3">
              {/* Queue depth */}
              <div
                className={`rounded-xl p-4 ${
                  metrics.current_queue_depth <= 2
                    ? 'bg-emerald-50 border border-emerald-100'
                    : metrics.current_queue_depth <= 5
                      ? 'bg-amber-50 border border-amber-100'
                      : 'bg-red-50 border border-red-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium ${
                      metrics.current_queue_depth <= 2
                        ? 'text-emerald-700'
                        : metrics.current_queue_depth <= 5
                          ? 'text-amber-700'
                          : 'text-red-700'
                    }`}
                  >
                    <Users className="h-3.5 w-3.5" />
                    Current Queue
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      metrics.current_queue_depth <= 2
                        ? 'bg-emerald-100 text-emerald-700'
                        : metrics.current_queue_depth <= 5
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {metrics.current_queue_depth <= 2
                      ? 'All Clear'
                      : metrics.current_queue_depth <= 5
                        ? 'Watch'
                        : 'Act Now'}
                  </span>
                </div>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {metrics.current_queue_depth}
                  <span className="ml-1 text-sm font-normal text-slate-500">
                    people
                  </span>
                </p>
                <p
                  className={`mt-1 text-xs ${
                    metrics.current_queue_depth <= 2
                      ? 'text-emerald-600'
                      : metrics.current_queue_depth <= 5
                        ? 'text-amber-600'
                        : 'text-red-600'
                  }`}
                >
                  {metrics.current_queue_depth <= 2
                    ? 'Checkout is flowing normally.'
                    : metrics.current_queue_depth <= 5
                      ? 'Queue is building — keep an eye on it.'
                      : 'Congestion detected. Open another counter.'}
                </p>
              </div>

              {/* Abandonment */}
              <div
                className={`rounded-xl p-4 ${
                  metrics.abandonment_rate <= 10
                    ? 'bg-emerald-50 border border-emerald-100'
                    : metrics.abandonment_rate <= 30
                      ? 'bg-amber-50 border border-amber-100'
                      : 'bg-red-50 border border-red-100'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div
                    className={`flex items-center gap-1.5 text-xs font-medium ${
                      metrics.abandonment_rate <= 10
                        ? 'text-emerald-700'
                        : metrics.abandonment_rate <= 30
                          ? 'text-amber-700'
                          : 'text-red-700'
                    }`}
                  >
                    <AlertTriangle className="h-3.5 w-3.5" />
                    Abandonment Rate
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs font-semibold ${
                      metrics.abandonment_rate <= 10
                        ? 'bg-emerald-100 text-emerald-700'
                        : metrics.abandonment_rate <= 30
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-red-100 text-red-700'
                    }`}
                  >
                    {metrics.abandonment_rate <= 10
                      ? 'Healthy'
                      : metrics.abandonment_rate <= 30
                        ? 'Monitor'
                        : 'Critical'}
                  </span>
                </div>
                <p className="mt-2 text-3xl font-bold text-slate-900">
                  {metrics.abandonment_rate}%
                </p>
                <p
                  className={`mt-1 text-xs ${
                    metrics.abandonment_rate <= 10
                      ? 'text-emerald-600'
                      : metrics.abandonment_rate <= 30
                        ? 'text-amber-600'
                        : 'text-red-600'
                  }`}
                >
                  {metrics.abandonment_rate <= 10
                    ? 'Very few visitors leaving without purchase.'
                    : metrics.abandonment_rate <= 30
                      ? 'Some drop-off at checkout. Worth monitoring.'
                      : 'High drop-off detected. Review checkout flow.'}
                </p>
                <p className="mt-2 text-[10px] text-slate-400">
                  Estimated from billing-zone exits & POS data.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Staff + Category */}
        <section className="grid gap-6 lg:grid-cols-2">
          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={<Trophy className="h-4 w-4 text-amber-500" />}
              title="Staff Leaderboard"
              subtitle="Top 3 performers by revenue generated"
            />
            <div className="space-y-2">
              {topStaff.map((staff: Staff, index: number) => (
                <div
                  key={staff.employee_code}
                  className="flex items-center gap-4 rounded-xl bg-slate-50 px-4 py-3"
                >
                  <span
                    className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-xs font-bold ${
                      index === 0
                        ? 'bg-amber-100 text-amber-700'
                        : index === 1
                          ? 'bg-slate-200 text-slate-600'
                          : 'bg-orange-100 text-orange-700'
                    }`}
                  >
                    {index + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="truncate font-medium text-slate-900 text-sm">
                      {staff.salesperson_name}
                    </p>
                    <p className="text-xs text-slate-500">
                      {staff.employee_code} · {staff.orders} orders ·{' '}
                      {staff.units} units
                    </p>
                  </div>
                  <p className="shrink-0 font-bold text-slate-900">
                    {formatRevenue(staff.revenue)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <SectionHeader
              icon={<BarChart3 className="h-4 w-4 text-blue-500" />}
              title="Category Performance"
              subtitle="Revenue share by product category"
            />
            <div className="space-y-4">
              {topCategories.map((category: Category, index: number) => {
                const pct = Math.round(
                  (category.revenue / maxCategoryRevenue) * 100,
                )
                return (
                  <div key={category.category}>
                    <div className="mb-1.5 flex items-center justify-between">
                      <span className="text-sm font-medium text-slate-800">
                        {category.category}
                      </span>
                      <span className="text-sm font-semibold text-slate-900">
                        {formatRevenue(category.revenue)}
                      </span>
                    </div>
                    <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                      <div
                        className={`h-2 rounded-full transition-all duration-500 ${
                          index === 0
                            ? 'bg-slate-900'
                            : index === 1
                              ? 'bg-slate-700'
                              : index === 2
                                ? 'bg-slate-500'
                                : 'bg-slate-300'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1 text-xs text-slate-400">
                      {category.orders} orders · {category.units} units
                    </p>
                  </div>
                )
              })}
            </div>
          </div>
        </section>

        {/* Business Recommendations */}
        <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <SectionHeader
            icon={<Lightbulb className="h-4 w-4 text-violet-500" />}
            title="Business Recommendations"
            subtitle="Actionable insights generated from CCTV + POS signals"
          />
          <div className="grid gap-3 lg:grid-cols-2">
            {recommendations.recommendations.map(
              (rec: Recommendation, index: number) => (
                <div
                  key={index}
                  className={`rounded-xl border-l-4 p-4 ${recommendationTone(rec.severity)}`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-semibold text-sm">{rec.title}</p>
                    <span
                      className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${recommendationBadge(rec.severity)}`}
                    >
                      {rec.severity}
                    </span>
                  </div>
                  <p className="mt-1.5 text-sm opacity-80">{rec.message}</p>
                  <p className="mt-2 text-xs font-semibold opacity-90">
                    → {rec.action}
                  </p>
                </div>
              ),
            )}
          </div>
        </section>

        {/* Heatmap + Anomalies */}
        <section className="grid gap-6 lg:grid-cols-2">
          <HeatmapPanel zones={heatmap.zones} />
          <AnomaliesPanel anomalies={anomalies.active_anomalies} />
        </section>

        {/* System info */}
        <section className="grid gap-4 lg:grid-cols-3">
          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              icon={<Activity className="h-4 w-4 text-slate-500" />}
              title="Camera Roles"
            />
            <div className="space-y-2 text-sm">
              {[
                ['CAM_1', 'Main Floor A'],
                ['CAM_2', 'Main Floor B'],
                ['CAM_3', 'Entry / Exit'],
                ['CAM_4', 'Staff Area'],
                ['CAM_5', 'Billing Counter'],
              ].map(([camera, role]) => (
                <div
                  key={camera}
                  className="flex justify-between rounded-lg bg-slate-50 px-3 py-2"
                >
                  <span className="font-mono text-xs text-slate-500">
                    {camera}
                  </span>
                  <span className="text-xs font-medium text-slate-700">
                    {role}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              icon={<Wifi className="h-4 w-4 text-slate-500" />}
              title="System Status"
            />
            <div className="space-y-2 text-sm">
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">API</span>
                <span className="text-xs font-semibold text-emerald-600">
                  {health.status}
                </span>
              </div>
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Total Events</span>
                <span className="text-xs font-semibold text-slate-800">
                  {metrics.total_events}
                </span>
              </div>
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Anomalies</span>
                <span
                  className={`text-xs font-semibold ${
                    anomalies.count > 0 ? 'text-amber-600' : 'text-emerald-600'
                  }`}
                >
                  {anomalies.count > 0 ? anomalies.count : 'None'}
                </span>
              </div>
              <div className="flex justify-between rounded-lg bg-slate-50 px-3 py-2">
                <span className="text-xs text-slate-500">Recommendations</span>
                <span className="text-xs font-semibold text-slate-800">
                  {recommendations.recommendations.length}
                </span>
              </div>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <SectionHeader
              icon={<Clock className="h-4 w-4 text-slate-500" />}
              title="Last Event"
              subtitle="Most recent activity recorded"
            />
            <p className="break-words rounded-lg bg-slate-50 px-3 py-2.5 text-xs font-mono text-slate-600">
              {health.last_event_timestamp_by_store?.STORE_BLR_002 || 'N/A'}
            </p>
          </div>
        </section>

        <EventsTable events={events.events || []} />

        <footer className="pb-6 pt-2 text-center text-xs text-slate-400">
          Purplle Tech Challenge 2026 · Multi-Camera Retail Intelligence
          Platform
        </footer>
      </div>
    </main>
  )
}
