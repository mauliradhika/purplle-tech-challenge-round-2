import { HeatMapZone } from "@/lib/types";

function intensityBar(intensity: number) {
  if (intensity >= 75) return "bg-rose-500";
  if (intensity >= 50) return "bg-amber-500";
  if (intensity >= 25) return "bg-emerald-500";
  return "bg-zinc-600";
}

function intensityDot(intensity: number) {
  if (intensity >= 75) return "bg-rose-400";
  if (intensity >= 50) return "bg-amber-400";
  if (intensity >= 25) return "bg-emerald-400";
  return "bg-zinc-500";
}

function intensityLabel(intensity: number) {
  if (intensity >= 75) return { text: "Very Busy", cls: "bg-rose-500/10 text-rose-400 border-rose-500/20" };
  if (intensity >= 50) return { text: "Moderate", cls: "bg-amber-500/10 text-amber-400 border-amber-500/20" };
  if (intensity >= 25) return { text: "Light", cls: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20" };
  return { text: "Quiet", cls: "bg-zinc-800 text-zinc-500 border-white/8" };
}

export function HeatmapPanel({ zones }: { zones: HeatMapZone[] }) {
  const sorted = [...zones].sort((a, b) => b.intensity - a.intensity);

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/8">
          <svg className="h-4 w-4 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
        </div>
        <div>
          <p className="text-sm font-semibold text-zinc-100">Zone Activity Heatmap</p>
          <p className="text-xs text-zinc-500 mt-0.5">Traffic and dwell time by area</p>
        </div>
      </div>

      <div className="space-y-3">
        {sorted.map((zone) => {
          const label = intensityLabel(zone.intensity);
          return (
            <div key={zone.zone_id} className="rounded-xl border border-white/6 bg-white/3 p-4">
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-2.5">
                  <div className={`h-2 w-2 shrink-0 rounded-full ${intensityDot(zone.intensity)}`} />
                  <span className="text-sm font-medium text-zinc-200">{zone.zone_id}</span>
                </div>
                <span className={`rounded-full border px-2.5 py-0.5 text-[10px] font-semibold tracking-wide ${label.cls}`}>
                  {label.text}
                </span>
              </div>

              <div className="h-1 overflow-hidden rounded-full bg-white/6 mb-3">
                <div
                  className={`h-1 rounded-full transition-all duration-700 ${intensityBar(zone.intensity)}`}
                  style={{ width: `${zone.intensity}%` }}
                />
              </div>

              <div className="flex items-center justify-between">
                <span className="font-mono-dm text-[11px] text-zinc-600">{zone.visit_count} visits</span>
                <span className="font-mono-dm text-[11px] text-zinc-600">{Math.round(zone.avg_dwell_ms / 1000)}s avg dwell</span>
                <span className="font-mono-dm text-[11px] text-zinc-600 capitalize">{zone.data_confidence} confidence</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}