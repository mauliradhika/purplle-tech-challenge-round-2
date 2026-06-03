"use client";

import { FunnelData } from "@/lib/types";

const labels: Record<string, string> = {
  ENTRY: "Entered",
  ZONE_VISIT: "Browsed",
  BILLING_QUEUE: "Checkout",
  EXIT: "Exited",
};

export function FunnelChart({ data }: { data: FunnelData[] }) {
  const stages = data.slice(0, 4);

  return (
    <div className="grid grid-cols-4 gap-4">
      {stages.map((item, index) => {
        const prev = index > 0 ? stages[index - 1].count : item.count;

        const conversion =
          index > 0 && prev > 0
            ? Math.round((item.count / prev) * 100)
            : 100;

        return (
          <div
            key={item.stage}
            className="rounded-2xl border border-white/10 bg-white/[0.02] p-5"
          >
            <p className="text-[10px] uppercase tracking-[0.15em] text-zinc-600">
              {labels[item.stage] || item.stage}
            </p>

            <p className="mt-4 text-5xl font-black text-zinc-100">
              {item.count}
            </p>

            <p className="mt-2 text-xs text-zinc-500">
              visitors
            </p>

            {index > 0 && (
              <div className="mt-4">
                <span
                  className={`rounded-full px-2 py-1 text-[10px] font-semibold ${
                    conversion > 60
                      ? "bg-emerald-500/10 text-emerald-400"
                      : conversion > 30
                      ? "bg-amber-500/10 text-amber-400"
                      : "bg-rose-500/10 text-rose-400"
                  }`}
                >
                  {conversion}% conversion
                </span>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}