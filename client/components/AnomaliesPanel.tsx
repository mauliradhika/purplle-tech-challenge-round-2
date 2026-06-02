import { AlertTriangle, CheckCircle2, Info } from "lucide-react";
import { Anomaly } from "@/lib/types";

function severityStyle(severity: string) {
  if (severity === "CRITICAL")
    return {
      card: "border-red-100 bg-red-50",
      badge: "bg-red-100 text-red-700",
      icon: <AlertTriangle className="h-4 w-4 text-red-500" />,
      dot: "bg-red-400",
    };
  if (severity === "WARN")
    return {
      card: "border-amber-100 bg-amber-50",
      badge: "bg-amber-100 text-amber-700",
      icon: <AlertTriangle className="h-4 w-4 text-amber-500" />,
      dot: "bg-amber-400",
    };
  return {
    card: "border-blue-100 bg-blue-50",
    badge: "bg-blue-100 text-blue-700",
    icon: <Info className="h-4 w-4 text-blue-500" />,
    dot: "bg-blue-400",
  };
}

export function AnomaliesPanel({ anomalies }: { anomalies: Anomaly[] }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Operational Alerts
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            Anomalies detected from live CCTV event analysis
          </p>
        </div>
        {anomalies.length > 0 && (
          <span className="shrink-0 rounded-full bg-red-100 px-2.5 py-1 text-xs font-semibold text-red-600">
            {anomalies.length} active
          </span>
        )}
      </div>

      {anomalies.length === 0 ? (
        <div className="flex items-start gap-3 rounded-xl border border-emerald-100 bg-emerald-50 p-4">
          <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
          <div>
            <p className="font-semibold text-emerald-800">All systems normal</p>
            <p className="mt-0.5 text-xs text-emerald-600">
              No unusual activity detected in the current footage window.
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {anomalies.map((item, index) => {
            const s = severityStyle(item.severity);
            return (
              <div
                key={index}
                className={`rounded-xl border p-4 ${s.card}`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-2.5">
                    <div className="mt-0.5 shrink-0">{s.icon}</div>
                    <div>
                      <p className="text-sm font-semibold text-slate-900">
                        {item.type}
                      </p>
                      <p className="mt-0.5 text-xs text-slate-600">
                        {item.message}
                      </p>
                    </div>
                  </div>
                  <span
                    className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-semibold ${s.badge}`}
                  >
                    {item.severity}
                  </span>
                </div>
                {item.suggested_action && (
                  <p className="mt-2.5 border-t border-black/5 pt-2 text-xs font-medium text-slate-500">
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