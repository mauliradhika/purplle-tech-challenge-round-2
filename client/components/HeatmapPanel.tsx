import { HeatMapZone } from "@/lib/types";

function intensityColor(intensity: number) {
  if (intensity >= 75) return "bg-red-400";
  if (intensity >= 50) return "bg-amber-400";
  if (intensity >= 25) return "bg-emerald-400";
  return "bg-slate-300";
}

function intensityLabel(intensity: number) {
  if (intensity >= 75) return { text: "Very Busy", cls: "bg-red-50 text-red-600 border-red-100" };
  if (intensity >= 50) return { text: "Moderate", cls: "bg-amber-50 text-amber-600 border-amber-100" };
  if (intensity >= 25) return { text: "Light", cls: "bg-emerald-50 text-emerald-600 border-emerald-100" };
  return { text: "Quiet", cls: "bg-slate-50 text-slate-500 border-slate-100" };
}

export function HeatmapPanel({ zones }: { zones: HeatMapZone[] }) {
  const sorted = [...zones].sort((a, b) => b.intensity - a.intensity);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">Zone Activity Heatmap</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Which areas of the store are seeing the most traffic and dwell time
        </p>
      </div>

      <div className="space-y-3">
        {sorted.map((zone) => {
          const label = intensityLabel(zone.intensity);
          return (
            <div
              key={zone.zone_id}
              className="rounded-xl border border-slate-100 bg-slate-50 p-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-2.5">
                  <div
                    className={`h-2.5 w-2.5 shrink-0 rounded-full ${intensityColor(zone.intensity)}`}
                  />
                  <span className="text-sm font-medium text-slate-800">
                    {zone.zone_id}
                  </span>
                </div>
                <span
                  className={`rounded-full border px-2 py-0.5 text-xs font-medium ${label.cls}`}
                >
                  {label.text}
                </span>
              </div>

              <div className="mt-2.5 h-1.5 overflow-hidden rounded-full bg-slate-200">
                <div
                  className={`h-1.5 rounded-full transition-all duration-700 ${intensityColor(zone.intensity)}`}
                  style={{ width: `${zone.intensity}%` }}
                />
              </div>

              <div className="mt-2 flex items-center justify-between text-xs text-slate-400">
                <span>{zone.visit_count} visits</span>
                <span>{Math.round(zone.avg_dwell_ms / 1000)}s avg dwell</span>
                <span className="capitalize">{zone.data_confidence} confidence</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}