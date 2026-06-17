import { useState, useEffect } from "react";
import { getAttendanceInsights } from "../../service/insightsService";
import StatsCard from "../../components/insights/StatsCard";
import { formatPercent } from "../../components/insights/helpers";
import { CHART_COLORS } from "../../components/insights/chartColors";
import { Users, Clock, AlertTriangle, CheckCircle, XCircle, Calendar } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function AttendanceInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getAttendanceInsights().then(setData).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, monthlyTrend, byDepartment } = data;

  const stats = [
    { title: "Total Employees", value: summary.totalEmployees.toLocaleString(), change: 0, trend: "stable", icon: Users, subtitle: "Tracked" },
    { title: "Avg Attendance", value: formatPercent(summary.avgAttendance / 100), change: 0.3, trend: "up", icon: CheckCircle, subtitle: "This month" },
    { title: "Late Arrivals", value: summary.lateArrivals, change: -5, trend: "down", icon: Clock, subtitle: "This month" },
    { title: "Absent Today", value: summary.absentToday, change: 8, trend: "up", icon: XCircle, subtitle: "Today" },
    { title: "Early Departures", value: summary.earlyDepartures, change: -3, trend: "down", icon: AlertTriangle, subtitle: "This month" },
    { title: "Avg Hours/Day", value: summary.avgHoursPerDay, change: 0.1, trend: "up", icon: Calendar, subtitle: "Company-wide" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Attendance metrics, trends and department analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Attendance Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[94, 98]} />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="attendance" stroke={CHART_COLORS.primary} strokeWidth={2} name="Attendance %" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="late" stroke={CHART_COLORS.warning} strokeWidth={2} name="Late Arrivals" dot={{ r: 4 }} />
              <Line type="monotone" dataKey="absent" stroke={CHART_COLORS.danger} strokeWidth={2} name="Absent" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Attendance by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={byDepartment} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[90, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" width={100} />
              <Tooltip />
              <Bar dataKey="attendance" fill={CHART_COLORS.primary} barSize={16} radius={[0, 4, 4, 0]} name="Attendance %" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Department Details</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Attendance %</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Late Arrivals</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Absent</th>
              </tr>
            </thead>
            <tbody>
              {byDepartment.map((dept, i) => (
                <tr key={dept.name} className={i < byDepartment.length - 1 ? "border-b border-gray-100" : ""}>
                  <td className="py-3 px-4 font-medium">{dept.name}</td>
                  <td className="py-3 px-4">{dept.attendance}%</td>
                  <td className="py-3 px-4">{dept.late}</td>
                  <td className="py-3 px-4">{dept.absent}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
