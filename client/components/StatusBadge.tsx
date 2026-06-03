'use client'

interface StatusBadgeProps {
  status?: string
}

export function StatusBadge({
  status = 'ONLINE',
}: StatusBadgeProps) {
  const isOnline =
    status?.toUpperCase() === 'ONLINE' ||
    status?.toUpperCase() === 'OK'

  return (
    <div
      className={`
        inline-flex
        items-center
        gap-2
        rounded-full
        border
        px-3
        py-1.5
        ${
          isOnline
            ? 'border-emerald-500/20 bg-emerald-500/10'
            : 'border-rose-500/20 bg-rose-500/10'
        }
      `}
    >
      <span
        className={`
          h-2
          w-2
          rounded-full
          ${
            isOnline
              ? 'bg-emerald-400 animate-pulse'
              : 'bg-rose-400'
          }
        `}
      />

      <span
        className={`
          text-[10px]
          font-semibold
          uppercase
          tracking-[0.12em]
          ${
            isOnline
              ? 'text-emerald-400'
              : 'text-rose-400'
          }
        `}
        style={{
          fontFamily: "'DM Mono', monospace",
        }}
      >
        {isOnline ? 'API Online' : 'API Offline'}
      </span>
    </div>
  )
}