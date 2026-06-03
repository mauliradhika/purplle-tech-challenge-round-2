import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Anomaly } from "@/lib/types";

function severityStyle(severity: string) {
  if (severity === "CRITICAL") return {
    card: "border-rose-500/20 bg-rose-500/5",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
    icon: <AlertTriangle className="h-4 w-4 text-rose-400" />,
    title: "text-rose-200",
    action: "text-rose-400/70 border-rose-500/10",
  };
  if (severity === "WARN") return {
    card: "border-amber-500/20 bg-amber-500/5",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: <AlertTriangle className="h-4 w-4 text-amber-400" />,
    title: "text-amber-200",
    action: "text-amber-400/70 border-amber-500/10",
  };
  return {
    card: "border-violet-500/20 bg-violet-500/5",
    badge: "bg-violet-500/10 text-violet-300 border-violet-500/20",
    icon: <Info className="h-4 w-4 text-violet-400" />,
    title: "text-violet-200",
    action: "text-violet-400/70 border-violet-500/10",
  };
}

export function AnomaliesPanel({ anomalies }: { anomalies: Anomaly[] }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/5 border border-white/8">
            <AlertTriangle className="h-4 w-4 text-zinc-400" />
          </div>
          <div>
            <p className="text-sm font-semibold text-zinc-100">Operational Alerts</p>
            <p className="text-xs text-zinc-500 mt-0.5">Live CCTV anomaly detection</p>
          </div>
        </div>
        {anomalies.length > 0 && (
          <span className="font-mono-dm rounded-full bg-rose-500/10 border border-rose-500/20 px-2.5 py-1 text-[10px] font-semibold text-rose-400">
            {anomalies.length} ACTIVE
          </span>
        )}
      </div>

      {anomalies.length === 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
          <div>
            <p className="text-sm font-semibold text-emerald-300">All systems normal</p>
            <p className="mt-0.5 text-xs text-emerald-500/70">
              No unusual activity detected in the current footage window.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-2.5">
          {anomalies.map((item, index) => {
            const s = severityStyle(item.severity);
            return (
              <div key={index} className={`rounded-xl border p-4 ${s.card}`}>
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{s.icon}</div>
                    <div>
                      <p className={`text-sm font-semibold ${s.title}`}>{item.type}</p>
                      <p className="mt-0.5 text-xs text-zinc-400 leading-relaxed">{item.message}</p>
                    </div>
                  </div>
                  <span className={`shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold font-mono-dm ${s.badge}`}>
                    {item.severity}
                  </span>
                </div>
                {item.suggested_action && (
                  <p className={`mt-3 border-t pt-2.5 text-xs font-medium ${s.action}`}>
                    → {item.suggested_action}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}