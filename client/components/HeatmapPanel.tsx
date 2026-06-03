'use client'

interface Zone {
  zone_name: string
  visitor_count: number
  avg_dwell_time_seconds: number
  activity_score: number
}

interface HeatmapPanelProps {
  zones: Zone[]
}

function getActivityLabel(score: number) {
  if (score >= 80)
    return {
      label: 'Very Busy',
      pill:
        'bg-rose-500/10 text-rose-400 border border-rose-500/20',
      bar: 'bg-rose-500',
      dot: 'bg-rose-500',
    }

  if (score >= 50)
    return {
      label: 'Moderate',
      pill:
        'bg-amber-500/10 text-amber-400 border border-amber-500/20',
      bar: 'bg-amber-500',
      dot: 'bg-amber-500',
    }

  if (score >= 25)
    return {
      label: 'Light',
      pill:
        'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20',
      bar: 'bg-emerald-500',
      dot: 'bg-emerald-500',
    }

  return {
    label: 'Quiet',
    pill:
      'bg-white/5 text-zinc-400 border border-white/10',
    bar: 'bg-zinc-600',
    dot: 'bg-zinc-600',
  }
}

export function HeatmapPanel({
  zones,
}: HeatmapPanelProps) {
  const sortedZones = [...zones].sort(
    (a, b) => b.activity_score - a.activity_score
  )

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-violet-500/20 bg-violet-500/10">
          <svg
            viewBox="0 0 24 24"
            className="h-4 w-4 text-violet-300"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <rect x="3" y="3" width="7" height="7" />
            <rect x="14" y="3" width="7" height="7" />
            <rect x="3" y="14" width="7" height="7" />
            <rect x="14" y="14" width="7" height="7" />
          </svg>
        </div>

        <div>
          <p className="text-sm font-semibold text-zinc-100">
            Zone Activity Heatmap
          </p>

          <p className="mt-0.5 text-[12px] text-zinc-500">
            Traffic and dwell time by area
          </p>
        </div>
      </div>

      <div className="space-y-3">
        {sortedZones.map((zone) => {
          const state = getActivityLabel(
            zone.activity_score
          )

          return (
            <div
              key={zone.zone_name}
              className="
                rounded-xl
                border
                border-white/[0.06]
                bg-[#18181b]
                p-4
              "
            >
              <div className="mb-3 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-2 w-2 rounded-full ${state.dot}`}
                  />

                  <span className="text-sm font-medium text-zinc-200">
                    {zone.zone_name}
                  </span>
                </div>

                <span
                  className={`
                    rounded-full
                    px-2.5
                    py-1
                    text-[10px]
                    uppercase
                    tracking-wider
                    ${state.pill}
                  `}
                  style={{
                    fontFamily:
                      "'DM Mono', monospace",
                  }}
                >
                  {state.label}
                </span>
              </div>

              <div className="mb-3 h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className={`h-full rounded-full ${state.bar}`}
                  style={{
                    width: `${Math.min(
                      zone.activity_score,
                      100
                    )}%`,
                  }}
                />
              </div>

              <div
                className="
                  flex
                  items-center
                  justify-between
                  text-[10px]
                  text-zinc-500
                "
                style={{
                  fontFamily:
                    "'DM Mono', monospace",
                }}
              >
                <span>
                  {zone.visitor_count} visits
                </span>

                <span>
                  {zone.avg_dwell_time_seconds}s dwell
                </span>

                <span>
                  Score {zone.activity_score}
                </span>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}