'use client'

interface EventItem {
  timestamp: string
  camera_id: string
  event_type: string
  zone?: string
  is_staff?: boolean
  confidence?: number
}

interface EventsTableProps {
  events: EventItem[]
}

function eventTheme(type: string) {
  const t = type?.toUpperCase()

  if (t.includes('ENTRY'))
    return 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'

  if (t.includes('EXIT'))
    return 'bg-white/5 text-zinc-400 border border-white/10'

  if (t.includes('ZONE_ENTER'))
    return 'bg-violet-500/10 text-violet-300 border border-violet-500/20'

  if (t.includes('ZONE_EXIT'))
    return 'bg-violet-500/5 text-violet-400 border border-violet-500/10'

  if (t.includes('DWELL'))
    return 'bg-blue-500/10 text-blue-400 border border-blue-500/20'

  if (t.includes('BILLING'))
    return 'bg-amber-500/10 text-amber-400 border border-amber-500/20'

  return 'bg-white/5 text-zinc-400 border border-white/10'
}

function formatTime(timestamp: string) {
  try {
    return new Date(timestamp).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: false,
    })
  } catch {
    return '--:--:--'
  }
}

function formatEvent(type: string) {
  return type
    ?.replace(/_/g, ' ')
    ?.toLowerCase()
    ?.replace(/\b\w/g, l => l.toUpperCase())
}

export function EventsTable({
  events,
}: EventsTableProps) {
  return (
    <div className="overflow-hidden rounded-[20px] border border-white/[0.06] bg-[#18181b]">
      {/* HEADER */}

      <div className="border-b border-white/[0.06] px-7 py-5">
        <p className="text-sm font-semibold text-zinc-100">
          Recent Events
        </p>

        <p className="mt-1 text-xs text-zinc-500">
          Latest retail intelligence events captured from CCTV feeds
        </p>
      </div>

      {/* TABLE */}

      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-white/[0.06]">
              <th className="px-5 py-3 text-left text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Time
              </th>

              <th className="px-5 py-3 text-left text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Camera
              </th>

              <th className="px-5 py-3 text-left text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Event
              </th>

              <th className="px-5 py-3 text-left text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Zone
              </th>

              <th className="px-5 py-3 text-left text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Staff
              </th>

              <th className="px-5 py-3 text-left text-[9px] uppercase tracking-[0.18em] text-zinc-600">
                Confidence
              </th>
            </tr>
          </thead>

          <tbody>
            {events.slice(0, 10).map((event, index) => (
              <tr
                key={index}
                className="
                  border-b border-white/[0.03]
                  transition-colors
                  hover:bg-white/[0.02]
                "
              >
                <td
                  className="px-5 py-3 text-[11px] text-zinc-500"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {formatTime(event.timestamp)}
                </td>

                <td
                  className="px-5 py-3 text-[11px] font-semibold text-zinc-300"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {event.camera_id}
                </td>

                <td className="px-5 py-3">
                  <span
                    className={`
                      inline-flex
                      rounded-full
                      px-2.5
                      py-1
                      text-[9px]
                      font-semibold
                      uppercase
                      tracking-wider
                      ${eventTheme(event.event_type)}
                    `}
                    style={{
                      fontFamily:
                        "'DM Mono', monospace",
                    }}
                  >
                    {formatEvent(event.event_type)}
                  </span>
                </td>

                <td className="px-5 py-3 text-xs text-zinc-500">
                  {event.zone || '—'}
                </td>

                <td
                  className={`px-5 py-3 text-xs font-semibold ${
                    event.is_staff
                      ? 'text-amber-400'
                      : 'text-zinc-400'
                  }`}
                >
                  {event.is_staff
                    ? 'Staff'
                    : 'Customer'}
                </td>

                <td
                  className="px-5 py-3 text-[11px] text-zinc-500"
                  style={{
                    fontFamily: "'DM Mono', monospace",
                  }}
                >
                  {event.confidence
                    ? `${Math.round(
                        event.confidence * 100
                      )}%`
                    : '--'}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}