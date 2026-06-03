'use client'

import { FunnelData } from '@/lib/types'

interface FunnelChartProps {
  data: FunnelData[]
}

const stageColors = [
  {
    bg: 'bg-[#1b1b28]',
    border: 'border-white/[0.06]',
    badge: 'bg-white/5 text-zinc-400',
  },
  {
    bg: 'bg-[#1b1b28]',
    border: 'border-emerald-500/15',
    badge: 'bg-emerald-500/10 text-emerald-400',
  },
  {
    bg: 'bg-[#1b1b28]',
    border: 'border-amber-500/15',
    badge: 'bg-amber-500/10 text-amber-400',
  },
  {
    bg: 'bg-[#1b1b28]',
    border: 'border-violet-500/15',
    badge: 'bg-violet-500/10 text-violet-300',
  },
]

export function FunnelChart({ data }: FunnelChartProps) {
  if (!data?.length) {
    return (
      <div className="flex h-[220px] items-center justify-center text-zinc-500">
        No funnel data available
      </div>
    )
  }

  const maxValue = data[0]?.count || 1

  return (
    <div className="grid grid-cols-4 gap-3">
      {data.slice(0, 4).map((stage, index) => {
        const conversion =
          index === 0
            ? null
            : Math.round(
                (stage.count / (data[index - 1]?.count || 1)) * 100
              )

        const theme =
          stageColors[index] || stageColors[0]

        return (
          <div
            key={stage.stage}
            className={`
              rounded-2xl
              border
              ${theme.border}
              ${theme.bg}
              p-5
              transition-all
              duration-300
              hover:border-white/15
            `}
          >
            <p
              className="
                text-[9px]
                uppercase
                tracking-[0.18em]
                text-zinc-500
              "
              style={{
                fontFamily: "'DM Mono', monospace",
              }}
            >
              {stage.stage}
            </p>

            <p
              className="
                mt-4
                text-[2.5rem]
                font-extrabold
                leading-none
                text-white
              "
              style={{
                fontFamily: "'Syne', sans-serif",
              }}
            >
              {stage.count}
            </p>

            <p className="mt-2 text-[11px] text-zinc-500">
              visitors
            </p>

            {conversion !== null && (
              <div
                className={`
                  mt-4
                  inline-flex
                  rounded-full
                  px-2.5
                  py-1
                  text-[10px]
                  font-semibold
                  uppercase
                  tracking-wider
                  ${theme.badge}
                `}
                style={{
                  fontFamily: "'DM Mono', monospace",
                }}
              >
                {conversion}% CVR
              </div>
            )}

            <div className="mt-5">
              <div className="h-1 overflow-hidden rounded-full bg-white/5">
                <div
                  className="h-full rounded-full bg-violet-500 transition-all duration-700"
                  style={{
                    width: `${(stage.count / maxValue) * 100}%`,
                  }}
                />
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}