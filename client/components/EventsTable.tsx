import { Event } from "@/lib/types";

const eventTypeStyles: Record<string, string> = {
  ENTRY: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  EXIT: "bg-zinc-700/50 text-zinc-400 border-white/8",
  ZONE_ENTER: "bg-violet-500/10 text-violet-300 border-violet-500/20",
  ZONE_EXIT: "bg-violet-500/8 text-violet-400 border-violet-500/15",
  ZONE_DWELL: "bg-blue-500/10 text-blue-300 border-blue-500/20",
  BILLING_QUEUE_JOIN: "bg-amber-500/10 text-amber-400 border-amber-500/20",
};

export function EventsTable({ events }: { events: Event[] }) {
  const recent = [...events].slice(-10).reverse();

  return (
    <div className="rounded-2xl border border-white/8 bg-zinc-900 overflow-hidden">
      <div className="px-7 py-6 border-b border-white/6">
        <p className="text-sm font-semibold text-zinc-100">Recent Events</p>
        <p className="mt-0.5 text-xs text-zinc-500">
          Latest 10 retail intelligence events captured from CCTV feeds
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-white/6">
              {["Time", "Camera", "Event Type", "Zone", "Staff", "Confidence"].map((h) => (
                <th key={h} className="px-7 py-3 text-[10px] font-semibold uppercase tracking-[0.12em] text-zinc-600">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {recent.map((event, i) => (
              <tr
                key={event.event_id}
                className={`border-b border-white/4 transition-colors hover:bg-white/3 ${i % 2 === 0 ? '' : 'bg-white/1'}`}
              >
                <td className="px-7 py-3.5 font-mono-dm text-xs text-zinc-500 tabular-nums">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </td>
                <td className="px-7 py-3.5 font-mono-dm text-xs font-medium text-zinc-300">
                  {event.camera_id}
                </td>
                <td className="px-7 py-3.5">
                  <span className={`rounded-full border px-2.5 py-1 text-[11px] font-semibold ${
                    eventTypeStyles[event.event_type] || "bg-zinc-800 text-zinc-400 border-white/8"
                  }`}>
                    {event.event_type}
                  </span>
                </td>
                <td className="px-7 py-3.5 text-xs text-zinc-400">
                  {event.zone_id || <span className="text-zinc-700">—</span>}
                </td>
                <td className="px-7 py-3.5">
                  <span className={`text-xs font-medium ${event.is_staff ? "text-amber-400" : "text-zinc-600"}`}>
                    {event.is_staff ? "Staff" : "Customer"}
                  </span>
                </td>
                <td className="px-7 py-3.5 font-mono-dm text-xs text-zinc-500 tabular-nums">
                  {event.confidence != null ? `${(event.confidence * 100).toFixed(0)}%` : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}