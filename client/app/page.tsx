'use client'

import {
  AlertTriangle, Activity, Clock, Users, Wifi,
  IndianRupee, Trophy, BarChart3, TrendingUp, ShoppingBag,
} from 'lucide-react'

import { AnomaliesPanel }   from '@/components/AnomaliesPanel'
import { EventsTable }      from '@/components/EventsTable'
import { FunnelChart }      from '@/components/FunnelChart'
import { HeatmapPanel }     from '@/components/HeatmapPanel'
import { StatusBadge }      from '@/components/StatusBadge'
import { Category, FunnelData, Recommendation, Staff } from '@/lib/types'
import { useDashboardData } from '@/hooks/useDashboardData'
import LoadingScreen        from '@/components/LoadingScreen'
import ErrorScreen          from '@/components/ErrorScreen'
import { RefreshCountdown } from '@/components/RefreshCountdown'

/* ─── helpers ───────────────────────────────────────────────── */
function fmtMs(ms: number) {
  if (!ms) return '0s'
  const s = Math.round(ms / 1000)
  return s >= 60 ? `${Math.floor(s / 60)}m ${s % 60}s` : `${s}s`
}
function fmtRev(v: number) {
  if (v >= 100000) return `₹${(v / 100000).toFixed(1)}L`
  if (v >= 1000)   return `₹${(v / 1000).toFixed(1)}K`
  return `₹${v}`
}

type Sev = 'SUCCESS' | 'WARN' | 'CRITICAL' | string
function recTheme(s: Sev) {
  if (s === 'SUCCESS') return { wrap: 'border-l-emerald-500 bg-emerald-500/4  border-emerald-500/15', badge: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20', action: 'text-emerald-400' }
  if (s === 'WARN')    return { wrap: 'border-l-amber-500  bg-amber-500/4   border-amber-500/15',  badge: 'text-amber-400  bg-amber-500/10  border-amber-500/20',  action: 'text-amber-400'  }
  if (s === 'CRITICAL')return { wrap: 'border-l-rose-500   bg-rose-500/4    border-rose-500/15',   badge: 'text-rose-400   bg-rose-500/10   border-rose-500/20',   action: 'text-rose-400'   }
  return                      { wrap: 'border-l-violet-500 bg-violet-500/4  border-violet-500/15', badge: 'text-violet-300 bg-violet-500/10 border-violet-500/20', action: 'text-violet-300' }
}

/* ─── micro components ──────────────────────────────────────── */
function Rule({ label }: { label: string }) {
  return (
    <div className="flex items-center gap-3 mb-6">
      <span style={{ fontFamily: "'DM Mono', monospace" }}
        className="text-[10px] font-semibold uppercase tracking-[.18em] text-zinc-600 shrink-0">
        {label}
      </span>
      <div className="flex-1 h-px bg-white/5" />
    </div>
  )
}

function Pill({
  children, variant = 'neutral',
}: { children: React.ReactNode; variant?: 'good' | 'warn' | 'bad' | 'neutral' | 'accent' }) {
  const cls = {
    good:    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
    warn:    'bg-amber-500/10  text-amber-400  border-amber-500/20',
    bad:     'bg-rose-500/10   text-rose-400   border-rose-500/20',
    neutral: 'bg-white/5       text-zinc-400   border-white/10',
    accent:  'bg-violet-500/10 text-violet-300 border-violet-500/20',
  }[variant]
  return (
    <span style={{ fontFamily: "'DM Mono', monospace" }}
      className={`inline-flex items-center rounded-full border px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-wide ${cls}`}>
      {children}
    </span>
  )
}

/* ─── page ──────────────────────────────────────────────────── */
export default function Home() {
  const {
    health, metrics, funnel, heatmap, anomalies, events,
    salesSummary, staffPerformance, categoryPerformance,
    recommendations, isLoading, isError,
  } = useDashboardData()

  if (isLoading) return <LoadingScreen />
  if (isError || !health || !metrics || !funnel || !heatmap ||
      !anomalies || !events || !salesSummary || !staffPerformance ||
      !categoryPerformance || !recommendations)
    return <ErrorScreen />

  const funnelData = funnel.store_funnel.filter(
    (i: FunnelData) => !(i.stage === 'ENTRY' && i.count === 0))
  const topStaff      = staffPerformance.staff?.slice(0, 3) || []
  const topCats       = categoryPerformance.categories?.slice(0, 4) || []
  const maxCatRev     = topCats[0]?.revenue || 1
  const queueVariant  = metrics.current_queue_depth <= 2 ? 'good' : metrics.current_queue_depth <= 5 ? 'warn' : 'bad'
  const abanVariant   = metrics.abandonment_rate  <= 10 ? 'good' : metrics.abandonment_rate  <= 30 ? 'warn' : 'bad'
  const dwellVariant  = metrics.avg_session_duration_ms > 90000 ? 'good' : metrics.avg_session_duration_ms > 30000 ? 'warn' : 'bad'

  return (
    <main className="min-h-screen bg-[#0d0d0f] text-zinc-100"
      style={{ fontFamily: "'DM Sans', sans-serif" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500&family=DM+Mono:wght@400;500&family=Syne:wght@700;800&display=swap');
        .num  { font-family:'Syne',sans-serif; }
        .mono { font-family:'DM Mono',monospace; }
        .card { background:#18181b; border:1px solid rgba(255,255,255,.07); border-radius:16px; }
        .card-xs { background:#18181b; border:1px solid rgba(255,255,255,.07); border-radius:12px; }
        .divide-col > * + * { border-top:1px solid rgba(255,255,255,.06); }
        .divide-row { border-left:1px solid rgba(255,255,255,.06); }
      `}</style>

      {/* ══ HEADER ═══════════════════════════════════════════════ */}
      <header className="sticky top-0 z-30 border-b border-white/[.06] bg-[#0d0d0f]/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-[1280px] items-center justify-between px-8 py-3.5">
          <div className="flex items-center gap-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-violet-600">
              <Activity className="h-3.5 w-3.5 text-white" />
            </div>
            <div className="flex items-center gap-2.5">
              <span className="mono text-[11px] text-zinc-600">Purplle Intelligence</span>
              <span className="text-zinc-700">/</span>
              <span className="mono text-[11px] font-medium text-zinc-300">STORE_BLR_002 · Bangalore Flagship</span>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <RefreshCountdown />
            <StatusBadge status={health.status} />
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-[1280px] px-8 pb-16 pt-8 space-y-12">

        {/* ══ LIVE KPIs ═════════════════════════════════════════ */}
        <section>
          <Rule label="Live KPIs" />
          <div className="grid grid-cols-4 gap-3">

            {/* Hero — most active zone */}
            <div className="card relative overflow-hidden px-6 py-6 bg-violet-500/[.07] border-violet-500/20">
              <div className="absolute right-0 top-0 h-32 w-32 rounded-full bg-violet-600/10 blur-2xl pointer-events-none" />
              <p className="mono text-[10px] uppercase tracking-[.16em] text-violet-400 mb-5">Most Active Zone</p>
              <p className="num text-[2.2rem] font-extrabold leading-none text-violet-200 break-words">
                {metrics.busiest_zone || 'N/A'}
              </p>
              <p className="mt-2 text-[12px] text-zinc-500">Highest visitor activity</p>
              <div className="mt-5 flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span className="mono text-[10px] font-semibold text-zinc-500 tracking-widest uppercase">Live</span>
              </div>
            </div>

            {/* Total events */}
            <div className="card px-6 py-6">
              <p className="mono text-[10px] uppercase tracking-[.16em] text-zinc-600 mb-5">Total Events</p>
              <p className="num text-[2.2rem] font-extrabold leading-none text-zinc-100 tabular-nums">
                {metrics.total_events.toLocaleString()}
              </p>
              <p className="mt-2 text-[12px] text-zinc-500">Validated CCTV events</p>
            </div>

            {/* Unique visitors */}
            <div className="card px-6 py-6">
              <p className="mono text-[10px] uppercase tracking-[.16em] text-zinc-600 mb-5">Unique Visitors</p>
              <p className="num text-[2.2rem] font-extrabold leading-none text-zinc-100 tabular-nums">
                {metrics.unique_visitors}
              </p>
              <p className="mt-2 text-[12px] text-zinc-500">Confirmed entry crossings</p>
              <div className="mt-5">
                <Pill variant={metrics.unique_visitors > 10 ? 'good' : metrics.unique_visitors > 0 ? 'warn' : 'bad'}>
                  {metrics.unique_visitors > 10 ? 'Healthy' : metrics.unique_visitors > 0 ? 'Low Traffic' : 'No Traffic'}
                </Pill>
              </div>
            </div>

            {/* Billing queue */}
            <div className={`card px-6 py-6 ${
              queueVariant === 'good' ? 'border-emerald-500/20' :
              queueVariant === 'warn' ? 'border-amber-500/20'  : 'border-rose-500/20'}`}>
              <p className="mono text-[10px] uppercase tracking-[.16em] text-zinc-600 mb-5">Billing Queue</p>
              <div className="flex items-baseline gap-2">
                <p className={`num text-[2.2rem] font-extrabold leading-none tabular-nums ${
                  queueVariant === 'good' ? 'text-emerald-300' :
                  queueVariant === 'warn' ? 'text-amber-300'   : 'text-rose-300'}`}>
                  {metrics.current_queue_depth}
                </p>
                <span className="text-sm text-zinc-600">in queue</span>
              </div>
              <p className={`mt-2 text-[12px] ${
                queueVariant === 'good' ? 'text-emerald-600' :
                queueVariant === 'warn' ? 'text-amber-600'   : 'text-rose-600'}`}>
                {queueVariant === 'good' ? 'Checkout flowing normally.'
                : queueVariant === 'warn' ? 'Queue building — monitor.'
                : 'Congestion. Open another counter.'}
              </p>
              <div className="mt-5">
                <Pill variant={queueVariant}>
                  {queueVariant === 'good' ? 'Clear' : queueVariant === 'warn' ? 'Building Up' : 'Congested'}
                </Pill>
              </div>
            </div>

          </div>
        </section>

        {/* ══ SALES INTELLIGENCE ════════════════════════════════ */}
        <section>
          <Rule label="Sales Intelligence" />
          <div className="card overflow-hidden">

            {/* Four metric tiles */}
            <div className="grid grid-cols-4">
              {[
                { icon: <TrendingUp className="h-3.5 w-3.5" />, label: 'Total Revenue',
                  value: fmtRev(salesSummary.total_revenue), sub: '+12.4% vs yesterday',
                  accent: true, cls: 'text-emerald-300' },
                { icon: <ShoppingBag className="h-3.5 w-3.5" />, label: 'Total Orders',
                  value: String(salesSummary.total_orders), sub: 'orders processed',
                  accent: false, cls: 'text-zinc-100' },
                { icon: <IndianRupee className="h-3.5 w-3.5" />, label: 'Avg Order Value',
                  value: fmtRev(salesSummary.avg_order_value), sub: `₹${salesSummary.avg_order_value} per order`,
                  accent: false, cls: 'text-zinc-100' },
                { icon: <Clock className="h-3.5 w-3.5" />, label: 'Peak Sales Hour',
                  value: salesSummary.peak_sales_hour, sub: 'highest transaction volume',
                  accent: false, cls: 'text-zinc-100' },
              ].map((item, i) => (
                <div key={item.label}
                  className={`px-6 py-6 ${i > 0 ? 'divide-row' : ''} ${item.accent ? 'bg-emerald-500/[.04]' : ''}`}>
                  <div className="flex items-center gap-1.5 text-zinc-600 mb-4">
                    {item.icon}
                    <span className="mono text-[10px] uppercase tracking-[.14em]">{item.label}</span>
                  </div>
                  <p className={`num text-[1.9rem] font-extrabold leading-none tabular-nums ${item.cls}`}>
                    {item.value}
                  </p>
                  <p className="mt-2 text-[12px] text-zinc-600">{item.sub}</p>
                </div>
              ))}
            </div>

            {/* Top brand / category strip */}
            <div className="grid grid-cols-2 border-t border-white/[.06]">
              {[
                { label: 'Top Brand',    value: salesSummary.top_brand    },
                { label: 'Top Category', value: salesSummary.top_category },
              ].map((item, i) => (
                <div key={item.label}
                  className={`flex items-center justify-between px-6 py-4 ${i > 0 ? 'divide-row' : ''}`}>
                  <div>
                    <p className="mono text-[10px] uppercase tracking-[.14em] text-zinc-600 mb-1">{item.label}</p>
                    <p className="text-sm font-semibold text-zinc-100">{item.value}</p>
                  </div>
                  <span className="mono text-[11px] font-semibold text-zinc-600 bg-white/5 border border-white/8 px-2.5 py-1 rounded-md">#1</span>
                </div>
              ))}
            </div>

          </div>
        </section>

        {/* ══ SESSION METRICS ═══════════════════════════════════ */}
        <section>
          <Rule label="Session Metrics" />
          <div className="grid grid-cols-3 gap-3">

            <div className={`card px-6 py-6 ${dwellVariant === 'good' ? 'border-emerald-500/20' : dwellVariant === 'warn' ? 'border-amber-500/20' : 'border-rose-500/20'}`}>
              <p className="mono text-[10px] uppercase tracking-[.16em] text-zinc-600 mb-5">Avg Time in Store</p>
              <p className={`num text-[2rem] font-extrabold leading-none tabular-nums ${
                dwellVariant === 'good' ? 'text-emerald-300' : dwellVariant === 'warn' ? 'text-amber-300' : 'text-rose-300'}`}>
                {fmtMs(metrics.avg_session_duration_ms)}
              </p>
              <p className="mt-2 text-[12px] text-zinc-500">How long customers stay on average</p>
              <div className="mt-5">
                <Pill variant={dwellVariant}>
                  {dwellVariant === 'good' ? 'High Engagement' : dwellVariant === 'warn' ? 'Average' : 'Low Engagement'}
                </Pill>
              </div>
            </div>

            <div className="card px-6 py-6">
              <p className="mono text-[10px] uppercase tracking-[.16em] text-zinc-600 mb-5">Peak Footfall Hour</p>
              <p className="num text-[2rem] font-extrabold leading-none text-zinc-100">
                {metrics.peak_traffic_hour || 'N/A'}
              </p>
              <p className="mt-2 text-[12px] text-zinc-500">Most visitors walking in (CCTV)</p>
            </div>

            <div className={`card px-6 py-6 ${abanVariant === 'good' ? 'border-emerald-500/20' : abanVariant === 'warn' ? 'border-amber-500/20' : 'border-rose-500/20'}`}>
              <p className="mono text-[10px] uppercase tracking-[.16em] text-zinc-600 mb-5">Cart Abandonment</p>
              <p className={`num text-[2rem] font-extrabold leading-none tabular-nums ${
                abanVariant === 'good' ? 'text-emerald-300' : abanVariant === 'warn' ? 'text-amber-300' : 'text-rose-300'}`}>
                {metrics.abandonment_rate}%
              </p>
              <p className="mt-2 text-[12px] text-zinc-500">Visitors who left before billing</p>
              <div className="mt-5">
                <Pill variant={abanVariant}>
                  {abanVariant === 'good' ? 'Very Low' : abanVariant === 'warn' ? 'Monitor' : 'High Risk'}
                </Pill>
              </div>
            </div>

          </div>
        </section>

        {/* ══ CONVERSION & CHECKOUT ════════════════════════════ */}
        <section>
          <Rule label="Conversion & Checkout" />
          <div className="grid grid-cols-[1fr_300px] gap-3">

            {/* Funnel — clean, no nested white card */}
            <div className="card px-7 py-7">
              <div className="flex items-center gap-3 mb-8">
                <BarChart3 className="h-4 w-4 text-violet-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Store Funnel</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">Visitor journey from entry to purchase</p>
                </div>
              </div>
              <FunnelChart data={funnelData} />
            </div>

            {/* Queue + abandonment stacked */}
            <div className="flex flex-col gap-3">

              <div className={`card flex-1 px-5 py-5 ${
                queueVariant === 'good' ? 'border-emerald-500/20' :
                queueVariant === 'warn' ? 'border-amber-500/20'  : 'border-rose-500/20'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-zinc-600">
                    <Users className="h-3.5 w-3.5" />
                    <span className="mono text-[10px] uppercase tracking-[.14em]">Current Queue</span>
                  </div>
                  <Pill variant={queueVariant}>
                    {queueVariant === 'good' ? 'Clear' : queueVariant === 'warn' ? 'Watch' : 'Act Now'}
                  </Pill>
                </div>
                <p className={`num text-5xl font-extrabold leading-none tabular-nums ${
                  queueVariant === 'good' ? 'text-emerald-300' :
                  queueVariant === 'warn' ? 'text-amber-300'   : 'text-rose-300'}`}>
                  {metrics.current_queue_depth}
                </p>
                <p className="mt-1.5 mono text-[10px] text-zinc-700 uppercase tracking-wider">people waiting</p>
                <p className={`mt-4 text-[12px] leading-relaxed ${
                  queueVariant === 'good' ? 'text-emerald-600' :
                  queueVariant === 'warn' ? 'text-amber-600'   : 'text-rose-600'}`}>
                  {queueVariant === 'good' ? 'Checkout is flowing normally.'
                  : queueVariant === 'warn' ? 'Queue building — keep an eye on it.'
                  : 'Congestion detected. Open another counter.'}
                </p>
              </div>

              <div className={`card flex-1 px-5 py-5 ${
                abanVariant === 'good' ? 'border-emerald-500/20' :
                abanVariant === 'warn' ? 'border-amber-500/20'  : 'border-rose-500/20'}`}>
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-1.5 text-zinc-600">
                    <AlertTriangle className="h-3.5 w-3.5" />
                    <span className="mono text-[10px] uppercase tracking-[.14em]">Abandonment</span>
                  </div>
                  <Pill variant={abanVariant}>
                    {abanVariant === 'good' ? 'Healthy' : abanVariant === 'warn' ? 'Monitor' : 'Critical'}
                  </Pill>
                </div>
                <p className={`num text-5xl font-extrabold leading-none tabular-nums ${
                  abanVariant === 'good' ? 'text-emerald-300' :
                  abanVariant === 'warn' ? 'text-amber-300'   : 'text-rose-300'}`}>
                  {metrics.abandonment_rate}%
                </p>
                <p className="mt-1.5 mono text-[10px] text-zinc-700 uppercase tracking-wider">cart abandonment</p>
                <p className={`mt-4 text-[12px] leading-relaxed ${
                  abanVariant === 'good' ? 'text-emerald-600' :
                  abanVariant === 'warn' ? 'text-amber-600'   : 'text-rose-600'}`}>
                  {abanVariant === 'good' ? 'Very few leaving without purchase.'
                  : abanVariant === 'warn' ? 'Some drop-off at checkout. Worth monitoring.'
                  : 'High drop-off. Review checkout flow.'}
                </p>
                <p className="mt-3 mono text-[10px] text-zinc-700">From billing-zone exits & POS data.</p>
              </div>

            </div>
          </div>
        </section>

        {/* ══ STAFF & CATEGORIES ════════════════════════════════ */}
        <section>
          <Rule label="Staff & Categories" />
          <div className="grid grid-cols-2 gap-3">

            <div className="card px-6 py-6">
              <div className="flex items-center gap-3 mb-6">
                <Trophy className="h-4 w-4 text-amber-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Staff Leaderboard</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">Top 3 by revenue generated</p>
                </div>
              </div>
              <div className="space-y-2">
                {topStaff.map((s: Staff, i: number) => (
                  <div key={s.employee_code}
                    className="flex items-center gap-3 rounded-xl bg-white/[.025] border border-white/[.05] px-4 py-3.5 hover:bg-white/[.04] transition-colors">
                    <span className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-lg mono text-[11px] font-bold ${
                      i === 0 ? 'bg-amber-500/15  text-amber-300  border border-amber-500/20'
                    : i === 1 ? 'bg-white/[.07]   text-zinc-400   border border-white/10'
                    :           'bg-orange-500/10 text-orange-400 border border-orange-500/15'}`}>
                      {i + 1}
                    </span>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-zinc-100 truncate">{s.salesperson_name}</p>
                      <p className="mono text-[11px] text-zinc-600 mt-0.5">
                        {s.employee_code} · {s.orders} orders · {s.units} units
                      </p>
                    </div>
                    <p className="num text-sm font-bold text-zinc-100 tabular-nums shrink-0">
                      {fmtRev(s.revenue)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            <div className="card px-6 py-6">
              <div className="flex items-center gap-3 mb-6">
                <BarChart3 className="h-4 w-4 text-violet-400 shrink-0" />
                <div>
                  <p className="text-sm font-semibold text-zinc-100">Category Performance</p>
                  <p className="text-[12px] text-zinc-500 mt-0.5">Revenue share by product category</p>
                </div>
              </div>
              <div className="space-y-5">
                {topCats.map((cat: Category, i: number) => {
                  const pct = Math.round((cat.revenue / maxCatRev) * 100)
                  const op  = [1, .72, .5, .34][i]
                  return (
                    <div key={cat.category}>
                      <div className="flex items-baseline justify-between mb-2">
                        <span className="text-sm font-medium text-zinc-300">{cat.category}</span>
                        <span className="num text-sm font-bold text-zinc-100 tabular-nums">{fmtRev(cat.revenue)}</span>
                      </div>
                      <div className="h-1 overflow-hidden rounded-full bg-white/6">
                        <div className="h-1 rounded-full bg-violet-500 transition-all duration-700"
                          style={{ width: `${pct}%`, opacity: op }} />
                      </div>
                      <p className="mono mt-1.5 text-[11px] text-zinc-600">
                        {cat.orders} orders · {cat.units} units
                      </p>
                    </div>
                  )
                })}
              </div>
            </div>

          </div>
        </section>

        {/* ══ RECOMMENDATIONS ════════════════════════════════════ */}
        <section>
          <Rule label="Business Recommendations" />
          <div className="grid grid-cols-2 gap-3">
            {recommendations.recommendations.map((rec: Recommendation, i: number) => {
              const t = recTheme(rec.severity)
              return (
                <div key={i} className={`rounded-2xl border border-l-[3px] px-5 py-5 ${t.wrap}`}>
                  <div className="flex items-start justify-between gap-3 mb-3">
                    <p className="text-sm font-semibold text-zinc-100 leading-snug">{rec.title}</p>
                    <span className={`mono shrink-0 rounded-full border px-2.5 py-[3px] text-[10px] font-semibold uppercase tracking-wide ${t.badge}`}>
                      {rec.severity}
                    </span>
                  </div>
                  <p className="text-[12px] text-zinc-400 leading-relaxed mb-4">{rec.message}</p>
                  <p className={`mono text-[11px] font-semibold ${t.action}`}>→ {rec.action}</p>
                </div>
              )
            })}
          </div>
        </section>

        {/* ══ HEATMAP + ANOMALIES ════════════════════════════════ */}
        <section>
          <Rule label="Zone Activity & Anomalies" />
          <div className="grid grid-cols-2 gap-3">
            <div className="card px-6 py-6"><HeatmapPanel zones={heatmap.zones} /></div>
            <div className="card px-6 py-6"><AnomaliesPanel anomalies={anomalies.active_anomalies} /></div>
          </div>
        </section>

        {/* ══ SYSTEM ════════════════════════════════════════════ */}
        <section>
          <Rule label="System" />
          <div className="grid grid-cols-3 gap-3">

            <div className="card px-5 py-5">
              <div className="flex items-center gap-2 mb-5">
                <Activity className="h-3.5 w-3.5 text-zinc-600" />
                <p className="text-[12px] font-semibold text-zinc-400">Camera Roles</p>
              </div>
              <div className="space-y-1.5">
                {[['CAM_1','Main Floor A'],['CAM_2','Main Floor B'],['CAM_3','Entry / Exit'],['CAM_4','Staff Area'],['CAM_5','Billing Counter']].map(([c, r]) => (
                  <div key={c} className="flex justify-between items-center rounded-lg bg-white/[.025] px-3.5 py-2.5">
                    <span className="mono text-[11px] text-zinc-600">{c}</span>
                    <span className="text-[12px] font-medium text-zinc-300">{r}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card px-5 py-5">
              <div className="flex items-center gap-2 mb-5">
                <Wifi className="h-3.5 w-3.5 text-zinc-600" />
                <p className="text-[12px] font-semibold text-zinc-400">System Status</p>
              </div>
              <div className="space-y-1.5">
                {[
                  { k: 'API',             v: health.status,                        cls: 'text-emerald-400' },
                  { k: 'Total Events',    v: String(metrics.total_events),          cls: 'text-zinc-200'   },
                  { k: 'Anomalies',       v: anomalies.count > 0 ? String(anomalies.count) : 'None',
                                                                                    cls: anomalies.count > 0 ? 'text-amber-400' : 'text-emerald-400' },
                  { k: 'Recommendations', v: String(recommendations.recommendations.length), cls: 'text-zinc-200' },
                ].map(row => (
                  <div key={row.k} className="flex justify-between items-center rounded-lg bg-white/[.025] px-3.5 py-2.5">
                    <span className="text-[12px] text-zinc-600">{row.k}</span>
                    <span className={`mono text-[11px] font-semibold ${row.cls}`}>{row.v}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="card px-5 py-5">
              <div className="flex items-center gap-2 mb-5">
                <Clock className="h-3.5 w-3.5 text-zinc-600" />
                <div>
                  <p className="text-[12px] font-semibold text-zinc-400">Last Event</p>
                  <p className="mono text-[10px] text-zinc-700 mt-0.5">Most recent activity</p>
                </div>
              </div>
              <p className="mono break-all rounded-lg bg-white/[.025] border border-white/[.05] px-3.5 py-3 text-[11px] leading-relaxed text-zinc-500">
                {health.last_event_timestamp_by_store?.STORE_BLR_002 || 'N/A'}
              </p>
            </div>

          </div>
        </section>

        {/* ══ EVENT LOG ═════════════════════════════════════════ */}
        <section>
          <Rule label="Event Log" />
          <EventsTable events={events.events || []} />
        </section>

      </div>
    </main>
  )
}