"use client";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

const data = [
  { month: "Jan", users: 30000 },
  { month: "Feb", users: 35000 },
  { month: "Mar", users: 40000 },
  { month: "Apr", users: 45000 },
  { month: "May", users: 50000 },
  { month: "Jun", users: 52842 },
];

export default function UserGrowthChart() {
  return (
    <div className="bg-white p-6 rounded-xl shadow mt-6">
      <h2 className="text-xl font-semibold mb-4">
        User Growth
      </h2>

      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />

          <XAxis dataKey="month" />

          <YAxis />

          <Tooltip />

          <Line
            type="monotone"
            dataKey="users"
            stroke="#10b981"
            strokeWidth={3}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}