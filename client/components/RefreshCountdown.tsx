"use client";

import { useEffect, useState } from "react";

export function RefreshCountdown({ intervalMs = 5000 }: { intervalMs?: number }) {
  const [secondsLeft, setSecondsLeft] = useState(intervalMs / 1000);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setSecondsLeft(intervalMs / 1000);

    const countdown = setInterval(() => {
      setSecondsLeft((prev) => {
        if (prev <= 1) return intervalMs / 1000;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(countdown);
  }, [intervalMs]);

  const pct = ((intervalMs / 1000 - secondsLeft) / (intervalMs / 1000)) * 100;

  return (
    <div className="flex items-center gap-2">
      <div className="relative h-4 w-4">
        <svg className="h-4 w-4 -rotate-90" viewBox="0 0 16 16">
          <circle
            cx="8" cy="8" r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            className="text-slate-200"
          />
          <circle
            cx="8" cy="8" r="6"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray={`${2 * Math.PI * 6}`}
            strokeDashoffset={`${2 * Math.PI * 6 * (1 - pct / 100)}`}
            className="text-slate-400 transition-all duration-1000"
            strokeLinecap="round"
          />
        </svg>
      </div>
      <span className="text-xs text-slate-400">
        Next update in{" "}
        <span className="font-medium tabular-nums text-slate-600">
          {secondsLeft}s
        </span>
      </span>
    </div>
  );
}