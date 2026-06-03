'use client'

import React from 'react'

interface MetricCardProps {
  title: string
  value: string | number
  subtitle?: string
  status?: string
  icon?: React.ReactNode
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'purple'
}

const cardVariants = {
  default:
    'bg-[#12121c] border-white/[0.06]',
  success:
    'bg-emerald-500/[0.04] border-emerald-500/20',
  warning:
    'bg-amber-500/[0.04] border-amber-500/20',
  danger:
    'bg-rose-500/[0.04] border-rose-500/20',
  purple:
    'bg-violet-500/[0.06] border-violet-500/20',
}

const badgeVariants = {
  default:
    'bg-white/5 text-zinc-400 border-white/10',
  success:
    'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
  warning:
    'bg-amber-500/10 text-amber-400 border-amber-500/20',
  danger:
    'bg-rose-500/10 text-rose-400 border-rose-500/20',
  purple:
    'bg-violet-500/10 text-violet-300 border-violet-500/20',
}

export default function MetricCard({
  title,
  value,
  subtitle,
  status,
  icon,
  variant = 'default',
}: MetricCardProps) {
  return (
    <div
      className={`
        relative overflow-hidden rounded-[22px]
        border p-6
        transition-all duration-300
        hover:border-white/15 hover:-translate-y-[2px]
        ${cardVariants[variant]}
      `}
    >
      {variant === 'purple' && (
        <div className="absolute -right-12 -top-12 h-40 w-40 rounded-full bg-violet-500/15 blur-3xl" />
      )}

      <div className="relative z-10">
        <div className="mb-5 flex items-center gap-2">
          {icon}

          <span
            className="text-[10px] uppercase tracking-[0.18em] text-zinc-500"
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {title}
          </span>
        </div>

        <h2
          className="text-[2.3rem] font-extrabold leading-none tracking-tight text-white"
          style={{ fontFamily: "'Syne', sans-serif" }}
        >
          {value}
        </h2>

        {subtitle && (
          <p className="mt-2 text-[12px] text-zinc-500">
            {subtitle}
          </p>
        )}

        {status && (
          <div
            className={`
              mt-5 inline-flex items-center rounded-full border px-3 py-1
              text-[10px] font-semibold uppercase tracking-wider
              ${badgeVariants[variant]}
            `}
            style={{ fontFamily: "'DM Mono', monospace" }}
          >
            {status}
          </div>
        )}
      </div>
    </div>
  )
}