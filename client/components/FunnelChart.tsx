"use client";

import { FunnelData } from "@/lib/types";
import {
  Bar, BarChart, CartesianGrid, Cell,
  ResponsiveContainer, Tooltip, XAxis, YAxis, TooltipProps
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const stageLabels: Record<string, string> = {
  ENTRY: "Entered",
  ZONE_VISIT: "Browsed",
  BILLING_QUEUE: "Checkout",
  EXIT: "Exited",
};

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  payload?: Array<{ value: ValueType }>;
  label?: string;
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-white/10 bg-zinc-800 px-4 py-3">
        <p className="text-[11px] font-medium uppercase tracking-widest text-zinc-400">
          {stageLabels[label as string] || label}
        </p>
        <p className="mt-1 font-display text-xl font-bold text-zinc-100">
          {payload[0].value as number}
          <span className="ml-1.5 text-sm font-normal text-zinc-500">visitors</span>
        </p>
      </div>
    );
  }
  return null;
};

export function FunnelChart({ data }: { data: FunnelData[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div>
      {/* Drop-off indicators */}
      <div className="mb-6 flex items-end gap-1">
        {data.map((item, i) => {
          const pct = Math.round((item.count / maxCount) * 100);
          const drop = i > 0 ? data[i - 1].count - item.count : 0;
          const dropPct =
            i > 0 && data[i - 1].count > 0
              ? Math.round((drop / data[i - 1].count) * 100)
              : null;
          return (
            <div key={item.stage} className="flex items-center gap-1">
              <div className="flex flex-col items-center gap-1.5">
                <div
                  className="w-16 rounded-lg bg-violet-500/20 border border-violet-500/30 flex items-end justify-center"
                  style={{ height: 44, opacity: 0.4 + (pct / 100) * 0.6 }}
                />
                <p className="font-display text-sm font-bold text-zinc-100 tabular-nums">
                  {item.count}
                </p>
                <p className="text-[10px] text-zinc-500 text-center leading-tight">
                  {stageLabels[item.stage] || item.stage}
                </p>
              </div>
              {i < data.length - 1 && (
                <div className="flex flex-col items-center gap-0.5 pb-8 mx-1">
                  <span className="text-zinc-700 text-xs">→</span>
                  {dropPct !== null && dropPct > 0 && (
                    <span className="text-[10px] font-semibold text-rose-400">
                      -{dropPct}%
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-44">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="35%">
            <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
            <XAxis
              dataKey="stage"
              tickFormatter={(v) => stageLabels[v] || v}
              tick={{ fontSize: 11, fill: "#52525b" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#52525b" }}
              axisLine={false}
              tickLine={false}
              width={28}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "rgba(255,255,255,0.03)" }} />
            <Bar dataKey="count" radius={[4, 4, 0, 0]}>
              {data.map((_, index) => {
                const opacity = 0.35 + ((data.length - index) / data.length) * 0.65;
                return (
                  <Cell key={`cell-${index}`} fill={`rgba(139,92,246,${opacity})`} />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}