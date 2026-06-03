'use client'

import {
  AlertTriangle,
  Activity,
  Clock,
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

type Severity = 'SUCCESS' | 'WARN' | 'CRITICAL' | string

function recStyles(severity: Severity) {
  if (severity === 'SUCCESS') return {
    card: 'border-emerald-500/20 bg-emerald-500/5',
    badge: 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
    action: 'text-emerald-400',
    title: 'text-zinc-100',
    divider: 'border-emerald-500/10',
  }
  if (severity === 'WARN') return {
    card: 'border-amber-500/20 bg-amber-500/5',
    badge: 'bg-amber-500/10 text-amber-400 border border-amber-500/20',
    action: 'text-amber-400',
    title: 'text-zinc-100',
    divider: 'border-amber-500/10',
  }
  if (severity === 'CRITICAL') return {
    card: 'border-rose-500/20 bg-rose-500/5',
    badge: 'bg-rose-500/10 text-rose-400 border border-rose-500/20',
    action: 'text-rose-400',
    title: 'text-zinc-100',
    divider: 'border-rose-500/10',
  }
  return {
    card: 'border-violet-500/20 bg-violet-500/5',
    badge: 'bg-violet-500/10 text-violet-300 border border-violet-500/20',
    action: 'text-violet-300',
    title: 'text-zinc-100',
    divider: 'border-violet-500/10',
  }
}

function Label({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-5">
      <p className="font-mono-dm text-[10px] font-semibold uppercase tracking-[0.18em] text-zinc-600 shrink-0">
        {children}
      </p>
      <div className="flex-1 h-px bg-white/5" />
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
    isError || !health || !metrics || !funnel || !heatmap ||
    !anomalies || !events || !salesSummary || !staffPerformance ||
    !categoryPerformance || !recommendations
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
    <main
      className="min-h-screen bg-zinc-950 text-zinc-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500&family=DM+Mono:wght@400;500&family=Syne:wght@600;700;800&display=swap');
        .font-display { font-family: 'Syne', sans-serif; }
        .font-mono-dm { font-family: 'DM Mono', monospace; }
        .card { border-radius: 16px; border: 1px solid rgba(255,255,255,0.07); background: #18181b; }
      `}</style>

      {/* ── Header ── */}
      <header className="sticky top-0 z-20 border-b border-white/6 bg-zinc-950/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-screen-xl items-center justify-between px-8 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-violet-600">
              <Activity className="h-4 w-4 text-white" />
            </div>
            <div>
              <p className="font-mono-dm text-[10px] text-zinc-600 tracking-wider uppercase">
                Purplle Intelligence Platform
              </p>
              <p className="font-display text-sm font-semibold text-zinc-100 leading-tight tracking-tight">
                STORE_BLR_002 · Bangalore Flagship
              </p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RefreshCountdown />
            <StatusBadge status={health.status} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-screen-xl px-8 py-10 space-y-14">

        {/* ── Page Title ── */}
        <div>
          <h1 className="font-display text-3xl font-bold text-zinc-100 tracking-tight">
            Executive Summary
          </h1>
          <p className="mt-2 text-sm text-zinc-500">
            Real-time store performance and operational health
          </p>
        </div>

        {/* ════════════════════════════════
            HERO KPIs — full-width 4-col
        ════════════════════════════════ */}
        <section>
          <Label>Live KPIs</Label>
          <div className="grid grid-cols-4 gap-3">

            {/* Most Active Zone — accent card */}
            <div className="card relative overflow-hidden px-7 py-7 border-violet-500/25 bg-violet-500/8 col-span-1">
              <div className="absolute inset-0 bg-gradient-to-br from-violet-600/8 to-transparent pointer-events-none rounded-2xl" />
              <p className="font-mono-dm text-[10px] uppercase tracking-[0.16em] text-violet-400 mb-4">
                Most Active Zone
              </p>
              <p className="font-display text-3xl font-bold text-violet-200 leading-none break-all">
                {metrics.busiest_zone || 'N/A'}
              </p>
              <p className="mt-2 text-xs text-zinc-500">Highest visitor activity</p>
              <div className="mt-5 inline-flex items-center gap-2 rounded-full border border-violet-500/25 bg-violet-500/10 px-3 py-1.5">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="font-mono-dm text-[10px] font-semibold text-violet-300 tracking-widest">LIVE</span>
              </div>
            </div>

            {/* Total Events */}
            <div className="card px-7 py-7">
              <p className="font-mono-dm text-[10px] uppercase tracking-[0.16em] text-zinc-600 mb-4">
                Total Events
              </p>
              <p className="font-display text-4xl font-bold text-zinc-100 leading-none tabular-nums">
                {metrics.total_events.toLocaleString()}
              </p>
              <p className="mt-2 text-xs text-zinc-500">Validated CCTV events</p>
            </div>

            {/* Unique Visitors */}
            <div className="card px-7 py-7">
              <p className="font-mono-dm text-[10px] uppercase tracking-[0.16em] text-zinc-600 mb-4">
                Unique Visitors
              </p>
              <p className="font-display text-4xl font-bold text-zinc-100 leading-none tabular-nums">
                {metrics.unique_visitors}
              </p>
              <p className="mt-2 text-xs text-zinc-500">Confirmed entry crossings</p>
              <div className="mt-5">
                <span className={`font-mono-dm inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold border ${
                  metrics.unique_visitors > 10
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : metrics.unique_visitors > 0
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {metrics.unique_visitors > 10 ? 'HEALTHY' : metrics.unique_visitors > 0 ? 'LOW TRAFFIC' : 'NO TRAFFIC'}
                </span>
              </div>
            </div>

            {/* Billing Queue */}
            <div className={`card px-7 py-7 ${
              metrics.current_queue_depth <= 2 ? 'border-emerald-500/20'
              : metrics.current_queue_depth <= 5 ? 'border-amber-500/20'
              : 'border-rose-500/20'
            }`}>
              <p className="font-mono-dm text-[10px] uppercase tracking-[0.16em] text-zinc-600 mb-4">
                Billing Queue
              </p>
              <p className={`font-display text-4xl font-bold leading-none tabular-nums ${
                metrics.current_queue_depth <= 2 ? 'text-emerald-300'
                : metrics.current_queue_depth <= 5 ? 'text-amber-300'
                : 'text-rose-300'
              }`}>
                {metrics.current_queue_depth}
                <span className="ml-2 text-sm font-normal text-zinc-500">in queue</span>
              </p>
              <p className="mt-2 text-xs text-zinc-500">
                {metrics.current_queue_depth <= 2 ? 'Checkout flowing normally.'
                : metrics.current_queue_depth <= 5 ? 'Queue building — keep an eye on it.'
                : 'Congestion detected. Open another counter.'}
              </p>
              <div className="mt-5">
                <span className={`font-mono-dm inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold border ${
                  metrics.current_queue_depth <= 2
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : metrics.current_queue_depth <= 5
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {metrics.current_queue_depth <= 2 ? 'CLEAR' : metrics.current_queue_depth <= 5 ? 'BUILDING UP' : 'CONGESTED'}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════
            SALES INTELLIGENCE
        ════════════════════════════════ */}
        <section>
          <Label>Sales Intelligence</Label>
          <div className="card overflow-hidden">

            {/* 4 metric tiles */}
            <div className="grid grid-cols-4 divide-x divide-white/6">
              {[
                {
                  icon: <TrendingUp className="h-4 w-4 text-emerald-400" />,
                  label: 'Total Revenue',
                  value: formatRevenue(salesSummary.total_revenue),
                  sub: '+12.4% vs yesterday',
                  valueClass: 'text-emerald-300',
                  bg: 'bg-emerald-500/4',
                },
                {
                  icon: <ShoppingBag className="h-4 w-4 text-zinc-500" />,
                  label: 'Total Orders',
                  value: String(salesSummary.total_orders),
                  sub: 'orders processed',
                  valueClass: 'text-zinc-100',
                  bg: '',
                },
                {
                  icon: <IndianRupee className="h-4 w-4 text-zinc-500" />,
                  label: 'Avg Order Value',
                  value: formatRevenue(salesSummary.avg_order_value),
                  sub: `₹${salesSummary.avg_order_value} per order`,
                  valueClass: 'text-zinc-100',
                  bg: '',
                },
                {
                  icon: <Clock className="h-4 w-4 text-zinc-500" />,
                  label: 'Peak Sales Hour',
                  value: salesSummary.peak_sales_hour,
                  sub: 'highest transaction volume',
                  valueClass: 'text-zinc-100',
                  bg: '',
                },
              ].map((item) => (
                <div key={item.label} className={`px-7 py-7 ${item.bg}`}>
                  <div className="flex items-center gap-2 mb-4">
                    {item.icon}
                    <span className="font-mono-dm text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                      {item.label}
                    </span>
                  </div>
                  <p className={`font-display text-3xl font-bold tabular-nums leading-none ${item.valueClass}`}>
                    {item.value}
                  </p>
                  <p className="mt-2 text-xs text-zinc-600">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Top brand / category */}
            <div className="grid grid-cols-2 divide-x divide-white/6 border-t border-white/6">
              <div className="flex items-center justify-between px-7 py-5">
                <div>
                  <p className="font-mono-dm text-[10px] uppercase tracking-[0.14em] text-zinc-600 mb-1.5">
                    Top Brand
                  </p>
                  <p className="text-sm font-semibold text-zinc-100">{salesSummary.top_brand}</p>
                </div>
                <span className="font-mono-dm text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/5 text-zinc-500 border border-white/8">
                  #1
                </span>
              </div>
              <div className="flex items-center justify-between px-7 py-5">
                <div>
                  <p className="font-mono-dm text-[10px] uppercase tracking-[0.14em] text-zinc-600 mb-1.5">
                    Top Category
                  </p>
                  <p className="text-sm font-semibold text-zinc-100">{salesSummary.top_category}</p>
                </div>
                <span className="font-mono-dm text-[11px] font-semibold px-2.5 py-1 rounded-md bg-white/5 text-zinc-500 border border-white/8">
                  #1
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════
            SESSION METRICS — 3-col
        ════════════════════════════════ */}
        <section>
          <Label>Session Metrics</Label>
          <div className="grid grid-cols-3 gap-3">

            <div className="card px-7 py-7">
              <p className="font-mono-dm text-[10px] uppercase tracking-[0.16em] text-zinc-600 mb-4">
                Avg Time in Store
              </p>
              <p className="font-display text-4xl font-bold text-zinc-100 leading-none tabular-nums">
                {formatMs(metrics.avg_session_duration_ms)}
              </p>
              <p className="mt-2 text-xs text-zinc-500">How long customers stay on average</p>
              <div className="mt-5">
                <span className={`font-mono-dm inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold border ${
                  metrics.avg_session_duration_ms > 90000
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : metrics.avg_session_duration_ms > 30000
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {metrics.avg_session_duration_ms > 90000 ? 'HIGH ENGAGEMENT' : metrics.avg_session_duration_ms > 30000 ? 'AVERAGE' : 'LOW ENGAGEMENT'}
                </span>
              </div>
            </div>

            <div className="card px-7 py-7">
              <p className="font-mono-dm text-[10px] uppercase tracking-[0.16em] text-zinc-600 mb-4">
                Peak Footfall Hour
              </p>
              <p className="font-display text-4xl font-bold text-zinc-100 leading-none">
                {metrics.peak_traffic_hour || 'N/A'}
              </p>
              <p className="mt-2 text-xs text-zinc-500">Hour with most visitors walking in</p>
            </div>

            <div className={`card px-7 py-7 ${
              metrics.abandonment_rate <= 10 ? 'border-emerald-500/20'
              : metrics.abandonment_rate <= 30 ? 'border-amber-500/20'
              : 'border-rose-500/20'
            }`}>
              <p className="font-mono-dm text-[10px] uppercase tracking-[0.16em] text-zinc-600 mb-4">
                Cart Abandonment
              </p>
              <p className={`font-display text-4xl font-bold leading-none tabular-nums ${
                metrics.abandonment_rate <= 10 ? 'text-emerald-300'
                : metrics.abandonment_rate <= 30 ? 'text-amber-300'
                : 'text-rose-300'
              }`}>
                {metrics.abandonment_rate}%
              </p>
              <p className="mt-2 text-xs text-zinc-500">Visitors who left before billing</p>
              <div className="mt-5">
                <span className={`font-mono-dm inline-block rounded-full px-2.5 py-1 text-[10px] font-semibold border ${
                  metrics.abandonment_rate <= 10
                    ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                    : metrics.abandonment_rate <= 30
                      ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                      : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                }`}>
                  {metrics.abandonment_rate <= 10 ? 'VERY LOW' : metrics.abandonment_rate <= 30 ? 'MONITOR' : 'HIGH RISK'}
                </span>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════
            FUNNEL + CHECKOUT — 3+1
        ════════════════════════════════ */}
        <section>
          <Label>Conversion & Checkout</Label>
          <div className="grid grid-cols-4 gap-3">

            <div className="card col-span-3 px-7 py-7">
              <div className="flex items-center gap-3 mb-7">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/8">
                  <BarChart3 className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Store Funnel</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Visitor journey from entry to purchase</p>
                </div>
              </div>
              <FunnelChart data={funnelData} />
            </div>

            <div className="flex flex-col gap-3">
              {/* Queue */}
              <div className={`card flex-1 px-6 py-6 ${
                metrics.current_queue_depth <= 2 ? 'border-emerald-500/20'
                : metrics.current_queue_depth <= 5 ? 'border-amber-500/20'
                : 'border-rose-500/20'
              }`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5">
                    <Users className="h-3.5 w-3.5 text-zinc-600" />
                    <span className="font-mono-dm text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                      Current Queue
                    </span>
                  </div>
                  <span className={`font-mono-dm text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    metrics.current_queue_depth <= 2
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : metrics.current_queue_depth <= 5
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {metrics.current_queue_depth <= 2 ? 'CLEAR' : metrics.current_queue_depth <= 5 ? 'WATCH' : 'ACT'}
                  </span>
                </div>
                <p className={`font-display text-5xl font-bold leading-none tabular-nums ${
                  metrics.current_queue_depth <= 2 ? 'text-emerald-300'
                  : metrics.current_queue_depth <= 5 ? 'text-amber-300'
                  : 'text-rose-300'
                }`}>
                  {metrics.current_queue_depth}
                </p>
                <p className="mt-1.5 text-xs text-zinc-600">people waiting</p>
                <p className={`mt-4 text-xs leading-relaxed ${
                  metrics.current_queue_depth <= 2 ? 'text-emerald-500'
                  : metrics.current_queue_depth <= 5 ? 'text-amber-500'
                  : 'text-rose-500'
                }`}>
                  {metrics.current_queue_depth <= 2 ? 'Checkout is flowing normally.'
                  : metrics.current_queue_depth <= 5 ? 'Queue building — monitor closely.'
                  : 'Congestion detected. Open another counter.'}
                </p>
              </div>

              {/* Abandonment */}
              <div className={`card flex-1 px-6 py-6 ${
                metrics.abandonment_rate <= 10 ? 'border-emerald-500/20'
                : metrics.abandonment_rate <= 30 ? 'border-amber-500/20'
                : 'border-rose-500/20'
              }`}>
                <div className="flex items-center justify-between mb-5">
                  <div className="flex items-center gap-1.5">
                    <AlertTriangle className="h-3.5 w-3.5 text-zinc-600" />
                    <span className="font-mono-dm text-[10px] uppercase tracking-[0.14em] text-zinc-600">
                      Abandonment
                    </span>
                  </div>
                  <span className={`font-mono-dm text-[10px] font-semibold px-2 py-0.5 rounded-full border ${
                    metrics.abandonment_rate <= 10
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20'
                      : metrics.abandonment_rate <= 30
                        ? 'bg-amber-500/10 text-amber-400 border-amber-500/20'
                        : 'bg-rose-500/10 text-rose-400 border-rose-500/20'
                  }`}>
                    {metrics.abandonment_rate <= 10 ? 'HEALTHY' : metrics.abandonment_rate <= 30 ? 'MONITOR' : 'CRITICAL'}
                  </span>
                </div>
                <p className={`font-display text-5xl font-bold leading-none tabular-nums ${
                  metrics.abandonment_rate <= 10 ? 'text-emerald-300'
                  : metrics.abandonment_rate <= 30 ? 'text-amber-300'
                  : 'text-rose-300'
                }`}>
                  {metrics.abandonment_rate}%
                </p>
                <p className="mt-1.5 text-xs text-zinc-600">cart abandonment rate</p>
                <p className={`mt-4 text-xs leading-relaxed ${
                  metrics.abandonment_rate <= 10 ? 'text-emerald-500'
                  : metrics.abandonment_rate <= 30 ? 'text-amber-500'
                  : 'text-rose-500'
                }`}>
                  {metrics.abandonment_rate <= 10 ? 'Very few leaving without purchase.'
                  : metrics.abandonment_rate <= 30 ? 'Some drop-off at checkout. Monitor.'
                  : 'High drop-off. Review checkout flow.'}
                </p>
                <p className="mt-3 text-[10px] text-zinc-700">
                  From billing-zone exits & POS data.
                </p>
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════
            STAFF + CATEGORY — 2-col
        ════════════════════════════════ */}
        <section>
          <Label>Staff & Categories</Label>
          <div className="grid grid-cols-2 gap-3">

            <div className="card px-7 py-7">
              <div className="flex items-center gap-3 mb-7">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/8">
                  <Trophy className="h-4 w-4 text-amber-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Staff Leaderboard</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Top 3 performers by revenue generated</p>
                </div>
              </div>
              <div className="space-y-2.5">
                {topStaff.map((staff: Staff, index: number) => (
                  <div
                    key={staff.employee_code}
                    className="flex items-center gap-4 rounded-xl bg-white/3 border border-white/6 px-5 py-4 hover:bg-white/5 transition-colors"
                  >
                    <span className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-lg font-display text-[11px] font-bold ${
                      index === 0 ? 'bg-amber-500/15 text-amber-300 border border-amber-500/20'
                      : index === 1 ? 'bg-white/6 text-zinc-400 border border-white/8'
                      : 'bg-orange-500/10 text-orange-400 border border-orange-500/20'
                    }`}>
                      {index + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-100 truncate">
                        {staff.salesperson_name}
                      </p>
                      <p className="font-mono-dm text-[11px] text-zinc-600 mt-0.5">
                        {staff.employee_code} · {staff.orders} orders · {staff.units} units
                      </p>
                    </div>
                    <p className="shrink-0 font-display text-base font-bold text-zinc-100 tabular-nums">
                      {formatRevenue(staff.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card px-7 py-7">
              <div className="flex items-center gap-3 mb-7">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/8">
                  <BarChart3 className="h-4 w-4 text-violet-400" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Category Performance</p>
                  <p className="text-xs text-zinc-500 mt-0.5">Revenue share by product category</p>
                </div>
              </div>
              <div className="space-y-7">
                {topCategories.map((category: Category, index: number) => {
                  const pct = Math.round((category.revenue / maxCategoryRevenue) * 100)
                  const opacities = [1, 0.7, 0.5, 0.35]
                  return (
                    <div key={category.category}>
                      <div className="flex items-center justify-between mb-2.5">
                        <span className="text-sm font-medium text-zinc-300">{category.category}</span>
                        <span className="font-display text-sm font-bold text-zinc-100 tabular-nums">
                          {formatRevenue(category.revenue)}
                        </span>
                      </div>
                      <div className="h-1.5 overflow-hidden rounded-full bg-white/6">
                        <div
                          className="h-1.5 rounded-full bg-violet-500 transition-all duration-700"
                          style={{ width: `${pct}%`, opacity: opacities[index] }}
                        />
                      </div>
                      <p className="font-mono-dm mt-2 text-[11px] text-zinc-600">
                        {category.orders} orders · {category.units} units
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════
            RECOMMENDATIONS — 2-col grid
        ════════════════════════════════ */}
        <section>
          <Label>Business Recommendations</Label>
          <div className="grid grid-cols-2 gap-3">
            {recommendations.recommendations.map((rec: Recommendation, index: number) => {
              const s = recStyles(rec.severity)
              return (
                <div key={index} className={`rounded-2xl border px-6 py-6 ${s.card}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-semibold text-zinc-100 leading-snug">
                      {rec.title}
                    </p>
                    <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold font-mono-dm tracking-wide ${s.badge}`}>
                      {rec.severity}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed mb-5">
                    {rec.message}
                  </p>
                  <div className={`border-t pt-4 ${s.divider}`}>
                    <p className={`text-[11px] font-semibold font-mono-dm ${s.action}`}>
                      → {rec.action}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </section>

        {/* ════════════════════════════════
            HEATMAP + ANOMALIES — 2-col
        ════════════════════════════════ */}
        <section>
          <Label>Zone Activity & Anomalies</Label>
          <div className="grid grid-cols-2 gap-3">
            <div className="card px-7 py-7">
              <HeatmapPanel zones={heatmap.zones} />
            </div>
            <div className="card px-7 py-7">
              <AnomaliesPanel anomalies={anomalies.active_anomalies} />
            </div>
          </div>
        </section>

        {/* ════════════════════════════════
            SYSTEM — 3-col
        ════════════════════════════════ */}
        <section>
          <Label>System</Label>
          <div className="grid grid-cols-3 gap-3">

            <div className="card px-6 py-6">
              <div className="flex items-center gap-2.5 mb-6">
                <Activity className="h-4 w-4 text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-300">Camera Roles</p>
              </div>
              <div className="space-y-1.5">
                {[
                  ['CAM_1', 'Main Floor A'],
                  ['CAM_2', 'Main Floor B'],
                  ['CAM_3', 'Entry / Exit'],
                  ['CAM_4', 'Staff Area'],
                  ['CAM_5', 'Billing Counter'],
                ].map(([cam, role]) => (
                  <div key={cam} className="flex items-center justify-between rounded-lg bg-white/3 px-4 py-2.5">
                    <span className="font-mono-dm text-[11px] text-zinc-600">{cam}</span>
                    <span className="text-xs font-medium text-zinc-400">{role}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card px-6 py-6">
              <div className="flex items-center gap-2.5 mb-6">
                <Wifi className="h-4 w-4 text-zinc-600" />
                <p className="text-sm font-semibold text-zinc-300">System Status</p>
              </div>
              <div className="space-y-1.5">
                {[
                  { key: 'API', val: health.status, cls: 'text-emerald-400' },
                  { key: 'Total Events', val: String(metrics.total_events), cls: 'text-zinc-200' },
                  { key: 'Anomalies', val: anomalies.count > 0 ? String(anomalies.count) : 'None', cls: anomalies.count > 0 ? 'text-amber-400' : 'text-emerald-400' },
                  { key: 'Recommendations', val: String(recommendations.recommendations.length), cls: 'text-zinc-200' },
                ].map((item) => (
                  <div key={item.key} className="flex items-center justify-between rounded-lg bg-white/3 px-4 py-2.5">
                    <span className="text-xs text-zinc-600">{item.key}</span>
                    <span className={`font-mono-dm text-xs font-semibold ${item.cls}`}>{item.val}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card px-6 py-6">
              <div className="flex items-center gap-2.5 mb-6">
                <Clock className="h-4 w-4 text-zinc-600" />
                <div>
                  <p className="text-sm font-semibold text-zinc-300">Last Event</p>
                  <p className="text-xs text-zinc-600 mt-0.5">Most recent activity recorded</p>
                </div>
              </div>
              <p className="font-mono-dm break-all rounded-lg bg-white/3 border border-white/6 px-4 py-3 text-[11px] leading-relaxed text-zinc-500">
                {health.last_event_timestamp_by_store?.STORE_BLR_002 || 'N/A'}
              </p>
            </div>

          </div>
        </section>

        {/* ════════════════════════════════
            EVENT LOG
        ════════════════════════════════ */}
        <section>
          <Label>Event Log</Label>
          <EventsTable events={events.events || []} />
        </section>

      </div>
    </main>
  )
}