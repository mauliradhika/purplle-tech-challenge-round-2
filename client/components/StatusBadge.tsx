 export function StatusBadge({ status }: { status: string }) {
  const isOk = status === "ok";

  return (
    <span
      className={`flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
        isOk
          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
          : "bg-red-50 text-red-700 border border-red-200"
      }`}
    >
      <span
        className={`h-1.5 w-1.5 rounded-full ${isOk ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`}
      />
      {isOk ? "API Online" : "API Offline"}
    </span>
  );
}