"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", revenue: 40 },
  { month: "Feb", revenue: 55 },
  { month: "Mar", revenue: 48 },
  { month: "Apr", revenue: 70 },
  { month: "May", revenue: 90 },
  { month: "Jun", revenue: 120 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-xl shadow p-5 mt-8">
      <h2 className="text-xl font-bold mb-4">
        Revenue Trend
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line
            type="monotone"
            dataKey="revenue"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}