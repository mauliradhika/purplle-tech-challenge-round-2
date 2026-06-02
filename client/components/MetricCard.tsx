type MetricCardProps = {
  title: string;
  value: string | number;
  subtitle?: string;
  status?: "good" | "warning" | "danger" | "neutral";
  badge?: string;
};

const statusStyles = {
  good: {
    card: "border-emerald-200 bg-emerald-50/60",
    title: "text-emerald-700",
    value: "text-emerald-900",
    badge: "bg-emerald-100 text-emerald-700 border border-emerald-200",
    subtitle: "text-emerald-600/70",
  },
  warning: {
    card: "border-amber-300 bg-amber-50/60",
    title: "text-amber-700",
    value: "text-amber-900",
    badge: "bg-amber-100 text-amber-700 border border-amber-200",
    subtitle: "text-amber-600/70",
  },
  danger: {
    card: "border-red-300 bg-red-50/70",
    title: "text-red-700",
    value: "text-red-900",
    badge: "bg-red-100 text-red-700 border border-red-200",
    subtitle: "text-red-600/70",
  },
  neutral: {
    card: "border-slate-200 bg-white",
    title: "text-slate-500",
    value: "text-slate-900",
    badge: "bg-slate-100 text-slate-600 border border-slate-200",
    subtitle: "text-slate-400",
  },
};

export function MetricCard({
  title,
  value,
  subtitle,
  status = "neutral",
  badge,
}: MetricCardProps) {
  const s = statusStyles[status];

  return (
    <div
      className={`relative overflow-hidden rounded-2xl border p-5 shadow-sm transition-shadow duration-200 hover:shadow-md ${s.card}`}
    >

      <div className="flex items-start justify-between gap-2 pt-1">
        <p className={`text-xs font-semibold uppercase tracking-wide ${s.title}`}>
          {title}
        </p>
        {badge && (
          <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold ${s.badge}`}>
            {badge}
          </span>
        )}
      </div>

      <p className={`mt-3 text-3xl font-bold tracking-tight ${s.value}`}>
        {value ?? "—"}
      </p>

      {subtitle && (
        <p className={`mt-2 text-xs leading-relaxed ${s.subtitle}`}>
          {subtitle}
        </p>
      )}
    </div>
  );
}