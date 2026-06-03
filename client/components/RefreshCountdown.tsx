'use client'

import { useEffect, useState } from 'react'
import { Clock3 } from 'lucide-react'

const REFRESH_INTERVAL = 5

export function RefreshCountdown() {
  const [seconds, setSeconds] = useState(
    REFRESH_INTERVAL
  )

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev =>
        prev <= 1 ? REFRESH_INTERVAL : prev - 1
      )
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  return (
    <div className="flex items-center gap-2">
      <Clock3 className="h-3.5 w-3.5 text-zinc-500" />

      <span
        className="
          text-[11px]
          text-zinc-500
        "
        style={{
          fontFamily: "'DM Mono', monospace",
        }}
      >
        Auto-refresh {seconds}s
      </span>
    </div>
  )
}