'use client'

import { AlertTriangle } from 'lucide-react'

interface Anomaly {
  anomaly_type: string
  severity: string
  message: string
  recommendation?: string
}

interface AnomaliesPanelProps {
  anomalies: Anomaly[]
}

function getSeverityStyles(severity: string) {
  switch (severity?.toUpperCase()) {
    case 'CRITICAL':
      return {
        card: 'bg-rose-500/5 border-rose-500/20',
        title: 'text-rose-300',
        badge:
          'bg-rose-500/10 text-rose-400 border border-rose-500/20',
        footer:
          'text-rose-400 border-t border-rose-500/15',
      }

    case 'WARN':
    case 'WARNING':
      return {
        card: 'bg-amber-500/5 border-amber-500/20',
        title: 'text-amber-300',
        badge:
          'bg-amber-500/10 text-amber-400 border border-amber-500/20',
        footer:
          'text-amber-400 border-t border-amber-500/15',
      }

    default:
      return {
        card: 'bg-violet-500/5 border-violet-500/20',
        title: 'text-violet-300',
        badge:
          'bg-violet-500/10 text-violet-300 border border-violet-500/20',
        footer:
          'text-violet-300 border-t border-violet-500/15',
      }
  }
}

export function AnomaliesPanel({
  anomalies,
}: AnomaliesPanelProps) {
  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-rose-500/20 bg-rose-500/10">
            <AlertTriangle className="h-4 w-4 text-rose-400" />
          </div>

          <div>
            <p className="text-sm font-semibold text-zinc-100">
              Operational Alerts
            </p>

            <p className="mt-0.5 text-[12px] text-zinc-500">
              Live CCTV anomaly detection
            </p>
          </div>
        </div>

        <span
          className="
            rounded-full
            border
            border-rose-500/20
            bg-rose-500/10
            px-3
            py-1
            text-[10px]
            font-semibold
            uppercase
            tracking-wider
            text-rose-400
          "
          style={{
            fontFamily: "'DM Mono', monospace",
          }}
        >
          {anomalies.length} ACTIVE
        </span>
      </div>

      {anomalies.length === 0 ? (
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/5 p-5">
          <div className="flex gap-3">
            <div className="mt-0.5 h-2 w-2 rounded-full bg-emerald-400" />

            <div>
              <p className="text-sm font-semibold text-emerald-400">
                All Systems Clear
              </p>

              <p className="mt-1 text-xs text-emerald-500/80">
                No active anomalies detected across
                monitored zones.
              </p>
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {anomalies.map((anomaly, index) => {
            const styles = getSeverityStyles(
              anomaly.severity
            )

            return (
              <div
                key={index}
                className={`
                  rounded-xl
                  border
                  p-4
                  ${styles.card}
                `}
              >
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <p
                      className={`text-sm font-semibold ${styles.title}`}
                    >
                      {anomaly.anomaly_type}
                    </p>

                    <p className="mt-2 text-xs leading-relaxed text-zinc-400">
                      {anomaly.message}
                    </p>
                  </div>

                  <span
                    className={`
                      shrink-0
                      rounded-full
                      px-2.5
                      py-1
                      text-[10px]
                      font-semibold
                      uppercase
                      tracking-wider
                      ${styles.badge}
                    `}
                    style={{
                      fontFamily:
                        "'DM Mono', monospace",
                    }}
                  >
                    {anomaly.severity}
                  </span>
                </div>

                {anomaly.recommendation && (
                  <div
                    className={`
                      pt-3
                      text-[11px]
                      font-semibold
                      ${styles.footer}
                    `}
                    style={{
                      fontFamily:
                        "'DM Mono', monospace",
                    }}
                  >
                    → {anomaly.recommendation}
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}