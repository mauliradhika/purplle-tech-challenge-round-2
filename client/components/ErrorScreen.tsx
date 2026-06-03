'use client'

import { AlertTriangle, RefreshCcw } from 'lucide-react'

export default function ErrorScreen() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0d0f]">
      {/* Ambient Glow */}

      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-rose-500/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-40 h-[450px] w-[450px] rounded-full bg-amber-500/10 blur-3xl" />

      <div className="relative z-10 max-w-md text-center">
        {/* Icon */}

        <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-rose-500/20 bg-rose-500/10">
          <AlertTriangle className="h-7 w-7 text-rose-400" />
        </div>

        {/* Heading */}

        <h1
          className="text-2xl font-extrabold text-white"
          style={{
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Unable To Load Dashboard
        </h1>

        <p className="mt-3 text-sm leading-relaxed text-zinc-500">
          We couldn't retrieve the latest store analytics.
          The API may be unavailable or there may be a network issue.
        </p>

        {/* Card */}

        <div className="mt-8 rounded-2xl border border-white/[0.06] bg-[#18181b] p-5 text-left">
          <div className="flex items-center gap-3">
            <RefreshCcw className="h-4 w-4 text-amber-400" />

            <span
              className="text-[11px] uppercase tracking-[0.18em] text-zinc-500"
              style={{
                fontFamily: "'DM Mono', monospace",
              }}
            >
              Suggested Action
            </span>
          </div>

          <p className="mt-3 text-sm text-zinc-400">
            Verify backend services are running and
            refresh the application.
          </p>
        </div>

        {/* Reload */}

        <button
          onClick={() => window.location.reload()}
          className="
            mt-6
            inline-flex
            items-center
            gap-2
            rounded-xl
            border
            border-violet-500/20
            bg-violet-500/10
            px-5
            py-3
            text-sm
            font-semibold
            text-violet-300
            transition-all
            hover:bg-violet-500/15
          "
        >
          <RefreshCcw className="h-4 w-4" />
          Reload Dashboard
        </button>

        <p
          className="mt-5 text-[10px] uppercase tracking-[0.25em] text-zinc-700"
          style={{
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Retail Intelligence Platform
        </p>
      </div>
    </main>
  )
}