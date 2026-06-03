'use client'

import { Activity } from 'lucide-react'

export default function LoadingScreen() {
  return (
    <main className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#0d0d0f]">
      {/* Ambient Glow */}

      <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-violet-600/10 blur-3xl" />

      <div className="absolute -bottom-40 -right-40 h-[400px] w-[400px] rounded-full bg-emerald-500/10 blur-3xl" />

      {/* Content */}

      <div className="relative z-10 flex flex-col items-center">
        <div className="mb-6 flex h-16 w-16 items-center justify-center rounded-2xl border border-violet-500/20 bg-violet-500/10">
          <Activity className="h-7 w-7 animate-pulse text-violet-300" />
        </div>

        <h1
          className="text-2xl font-extrabold text-white"
          style={{
            fontFamily: "'Syne', sans-serif",
          }}
        >
          Purplle Intelligence
        </h1>

        <p className="mt-2 text-sm text-zinc-500">
          Initializing live retail analytics...
        </p>

        {/* Loader */}

        <div className="mt-8 flex gap-2">
          <span className="h-2 w-2 animate-bounce rounded-full bg-violet-400" />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
            style={{ animationDelay: '0.15s' }}
          />
          <span
            className="h-2 w-2 animate-bounce rounded-full bg-violet-400"
            style={{ animationDelay: '0.3s' }}
          />
        </div>

        <p
          className="mt-5 text-[10px] uppercase tracking-[0.25em] text-zinc-600"
          style={{
            fontFamily: "'DM Mono', monospace",
          }}
        >
          Connecting to store systems
        </p>
      </div>
    </main>
  )
}