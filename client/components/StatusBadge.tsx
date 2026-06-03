export function StatusBadge({ status }: { status: string }) {
  const isOk = status === "ok" || status === "OK";
  return (
    <span className={`flex items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-semibold border ${
      isOk
        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/25"
        : "bg-rose-500/10 text-rose-400 border-rose-500/25"
    }`}>
      <span className={`h-1.5 w-1.5 rounded-full ${isOk ? "bg-emerald-400 animate-pulse" : "bg-rose-400"}`} />
      {isOk ? "API Online" : "API Offline"}
    </span>
  );
}