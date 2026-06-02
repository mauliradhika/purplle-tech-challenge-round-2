'use client';

import { AlertTriangle } from "lucide-react"

function ErrorScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-red-50 border border-red-100">
          <AlertTriangle className="h-5 w-5 text-red-500" />
        </div>
        <h2 className="text-base font-semibold text-slate-900">Unable to connect</h2>
        <p className="mt-1.5 text-sm text-slate-500">
          The backend API is unreachable. Check your connection or server status.
        </p>

        <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm">
          <p className="text-xs font-medium text-slate-400 uppercase tracking-wider mb-3">Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-slate-500">API</span>
              <span className="flex items-center gap-1.5 font-medium text-red-500">
                <span className="h-1.5 w-1.5 rounded-full bg-red-400 inline-block" />
                Unreachable
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Store ID</span>
              <span className="font-medium text-slate-700">STORE_BLR_002</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => window.location.reload()}
          className="mt-4 w-full rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 active:scale-95"
        >
          Retry
        </button>
      </div>
    </main>
  )
}

export default ErrorScreen