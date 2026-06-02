import { Event } from "@/lib/types";

const eventTypeColors: Record<string, string> = {
  ENTRY: "bg-emerald-50 text-emerald-700 border-emerald-100",
  EXIT: "bg-slate-100 text-slate-600 border-slate-200",
  ZONE_ENTER: "bg-blue-50 text-blue-700 border-blue-100",
  ZONE_EXIT: "bg-blue-50 text-blue-600 border-blue-100",
  ZONE_DWELL: "bg-violet-50 text-violet-700 border-violet-100",
  BILLING_QUEUE_JOIN: "bg-amber-50 text-amber-700 border-amber-100",
};

export function EventsTable({ events }: { events: Event[] }) {
  const recent = [...events].slice(-10).reverse();

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-5">
        <h2 className="text-base font-semibold text-slate-900">Recent Events</h2>
        <p className="mt-0.5 text-xs text-slate-500">
          Latest 10 retail intelligence events captured from CCTV feeds
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="border-b border-slate-100">
              {["Time", "Camera", "Event Type", "Zone", "Staff", "Confidence"].map(
                (h) => (
                  <th
                    key={h}
                    className="pb-2.5 text-xs font-medium uppercase tracking-wide text-slate-400"
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {recent.map((event) => (
              <tr
                key={event.event_id}
                className="transition-colors hover:bg-slate-50"
              >
                <td className="py-2.5 pr-4 font-mono text-xs text-slate-500">
                  {new Date(event.timestamp).toLocaleTimeString()}
                </td>
                <td className="py-2.5 pr-4 font-mono text-xs font-medium text-slate-700">
                  {event.camera_id}
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`rounded-full border px-2.5 py-1 text-xs font-semibold ${
                      eventTypeColors[event.event_type] ||
                      "bg-slate-50 text-slate-600 border-slate-200"
                    }`}
                  >
                    {event.event_type}
                  </span>
                </td>
                <td className="py-2.5 pr-4 text-xs text-slate-600">
                  {event.zone_id || (
                    <span className="text-slate-300">—</span>
                  )}
                </td>
                <td className="py-2.5 pr-4">
                  <span
                    className={`text-xs font-medium ${
                      event.is_staff ? "text-amber-600" : "text-slate-400"
                    }`}
                  >
                    {event.is_staff ? "Staff" : "Customer"}
                  </span>
                </td>
                <td className="py-2.5 text-xs text-slate-500">
                  {event.confidence != null
                    ? `${(event.confidence * 100).toFixed(0)}%`
                    : "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}