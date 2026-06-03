'use client';
import { AlertTriangle } from "lucide-react";

function ErrorScreen() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-zinc-950 px-6">
      <div className="w-full max-w-sm text-center">
        <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-rose-500/10 border border-rose-500/20">
          <AlertTriangle className="h-5 w-5 text-rose-400" />
        </div>
        <h2 className="text-base font-semibold text-zinc-100">Unable to connect</h2>
        <p className="mt-1.5 text-sm text-zinc-500">
          The backend API is unreachable. Check your connection or server status.
        </p>
        <div className="mt-6 rounded-2xl border border-white/8 bg-zinc-900 p-4 text-left">
          <p className="font-mono-dm text-[10px] font-medium text-zinc-600 uppercase tracking-wider mb-3">Details</p>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span className="text-zinc-500">API</span>
              <span className="flex items-center gap-1.5 font-medium text-rose-400">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-400 inline-block" />
                Unreachable
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-zinc-500">Store ID</span>
              <span className="font-mono-dm text-xs font-medium text-zinc-300">STORE_BLR_002</span>
            </div>
          </div>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="mt-4 w-full rounded-xl border border-white/8 bg-zinc-800 px-4 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-700 active:scale-95"
        >
          Retry
        </button>
      </div>
    </main>
  );
}
export default ErrorScreen;