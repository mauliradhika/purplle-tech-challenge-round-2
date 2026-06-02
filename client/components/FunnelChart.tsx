"use client";

import { FunnelData } from "@/lib/types";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
  TooltipProps
} from "recharts";
import { NameType, ValueType } from "recharts/types/component/DefaultTooltipContent";

const stageLabels: Record<string, string> = {
  ENTRY: "Entered Store",
  ZONE_VISIT: "Browsed",
  BILLING_QUEUE: "Reached Checkout",
  EXIT: "Exited",
};

type CustomTooltipProps = TooltipProps<ValueType, NameType> & {
  payload?: Array<{ value: ValueType; name: NameType }>;
  label?: string
};

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
        <p className="text-xs font-medium text-slate-500">
          {stageLabels[label as string] || label}
        </p>
        <p className="mt-1 text-xl font-bold text-slate-900">
          {payload[0].value as number}
          <span className="ml-1 text-sm font-normal text-slate-500">visitors</span>
        </p>
      </div>
    );
  }
  return null;
};

export function FunnelChart({ data }: { data: FunnelData[] }) {
  const maxCount = Math.max(...data.map((d) => d.count), 1);

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="mb-1 flex items-start justify-between">
        <div>
          <h2 className="text-base font-semibold text-slate-900">
            Customer Journey Funnel
          </h2>
          <p className="mt-0.5 text-xs text-slate-500">
            How visitors move through the store from entry to checkout
          </p>
        </div>
      </div>

      {/* Drop-off indicators */}
      <div className="mb-4 mt-4 flex items-center gap-2 overflow-x-auto pb-1">
        {data.map((item, i) => {
          const pct = Math.round((item.count / maxCount) * 100);
          const drop =
            i > 0 ? data[i - 1].count - item.count : 0;
          const dropPct =
            i > 0 && data[i - 1].count > 0
              ? Math.round((drop / data[i - 1].count) * 100)
              : null;

          return (
            <div key={item.stage} className="flex items-center gap-2">
              <div className="shrink-0 text-center">
                <div
                  className="flex items-end justify-center rounded-lg bg-slate-900"
                  style={{ height: 40, width: 64, opacity: 0.3 + (pct / 100) * 0.7 }}
                >
                </div>
                <p className="mt-1.5 text-xs font-semibold text-slate-900">
                  {item.count}
                </p>
                <p className="text-[10px] text-slate-400">
                  {stageLabels[item.stage] || item.stage}
                </p>
              </div>
              {i < data.length - 1 && (
                <div className="flex shrink-0 flex-col items-center gap-0.5">
                  <span className="text-slate-300">→</span>
                  {dropPct !== null && dropPct > 0 && (
                    <span className="text-[10px] font-medium text-red-400">
                      -{dropPct}%
                    </span>
                  )}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="h-52">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%">
            <CartesianGrid
              strokeDasharray="3 3"
              stroke="#f1f5f9"
              vertical={false}
            />
            <XAxis
              dataKey="stage"
              tickFormatter={(v) => stageLabels[v] || v}
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 11, fill: "#94a3b8" }}
              axisLine={false}
              tickLine={false}
              width={30}
            />
            <Tooltip content={<CustomTooltip />} cursor={{ fill: "#f8fafc" }} />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => {
                const opacity = 0.35 + ((data.length - index) / data.length) * 0.65;
                return (
                  <Cell
                    key={`cell-${index}`}
                    fill={`rgba(15, 23, 42, ${opacity})`}
                  />
                );
              })}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}