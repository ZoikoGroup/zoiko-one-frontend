"use client";

import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

interface GrowthPoint {
  label: string;
  value: number;
}

interface GrowthLineChartProps {
  title: string;
  data: GrowthPoint[];
  dataKey: "value";
  stroke: string;
  valuePrefix?: string;
  subtitle?: string;
}

export default function GrowthLineChart({ title, subtitle, data, dataKey, stroke, valuePrefix = "" }: GrowthLineChartProps) {
  return (
    <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
      <div className="mb-4 flex items-center justify-between gap-4">
        <div>
          <h2 className="text-lg font-semibold text-white">{title}</h2>
          {subtitle ? <p className="mt-1 text-sm text-slate-400">{subtitle}</p> : null}
        </div>
      </div>
      <div className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="4 4" stroke="#1f2937" />
            <XAxis dataKey="label" tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
            <YAxis tickLine={false} axisLine={false} tick={{ fill: "#94a3b8" }} />
            <Tooltip
              cursor={{ stroke: "#4f46e5", strokeWidth: 2 }}
              contentStyle={{ backgroundColor: "#0b1220", borderColor: "#1f2937", color: "#fff" }}
              labelStyle={{ color: "#94a3b8" }}
              formatter={(value) => [`${valuePrefix}${value}`, title]}
            />
            <Line type="monotone" dataKey={dataKey} stroke={stroke} strokeWidth={3} dot={{ r: 4, fill: stroke }} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </section>
  );
}
