import { useState, useEffect } from "react";
import { getEngagementInsights } from "../../service/insightsService";
import { HeartHandshake, Users, ClipboardCheck, BarChart3, TrendingUp, MessageSquare } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

// ==========================================
// EMBEDDED DEPENDENCIES & HELPERS
// ==========================================
const CHART_COLORS = {
  primary: "#4f46e5",
  success: "#10b981",
  warning: "#f59e0b",
  danger: "#ef4444",
  info: "#06b6d4",
  secondary: "#6b7280"
};

const StatsCard = ({ title, value, icon: Icon, trend, change, subtitle }) => (
  <div className="bg-white p-5 rounded-xl border border-gray-200 shadow-sm flex items-start justify-between">
    <div>
      <p className="text-sm font-medium text-gray-500">{title}</p>
      <h3 className="text-2xl font-bold text-gray-900 mt-1">{value}</h3>
      <div className="flex items-center gap-1.5 mt-1">
        {change !== undefined && change !== 0 && (
          <span className={`text-xs font-medium ${trend === 'up' || trend === 'healthy' ? 'text-green-600' : 'text-red-600'}`}>
            {trend === 'up' || trend === 'healthy' ? '↑' : '↓'} {Math.abs(change)}%
          </span>
        )}
        {subtitle && <span className="text-xs text-gray-400">{subtitle}</span>}
      </div>
    </div>
    {Icon && (
      <div className="p-2 bg-gray-50 rounded-lg border border-gray-100 text-gray-400">
        <Icon size={20} />
      </div>
    )}
  </div>
);

const StatusBadge = ({ status }) => {
  const normalized = String(status).toLowerCase();
  const badgeStyles = {
    healthy: "bg-green-50 text-green-700 border-green-100",
    warning: "bg-yellow-50 text-yellow-700 border-yellow-100",
    critical: "bg-red-50 text-red-700 border-red-100",
  };
  return (
    <span className={`inline-block px-2 py-0.5 text-xs font-medium rounded-full border capitalize ${badgeStyles[normalized] || "bg-gray-50"}`}>
      {normalized}
    </span>
  );
};

export default function EngagementInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getEngagementInsights().then(setData).catch(() => {}).finally(() => setLoading(false));
  }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, scoreTrend, byDepartment, drivers } = data;

  const stats = [
    { title: "Overall Score", value: `${summary.overallScore}%`, change: 2, trend: "up", icon: HeartHandshake, subtitle: "Company-wide" },
    { title: "Participation", value: `${summary.participationRate}%`, change: 3, trend: "up", icon: Users, subtitle: "Survey rate" },
    { title: "Active Surveys", value: summary.activeSurveys, change: 0, trend: "stable", icon: ClipboardCheck, subtitle: "Live polls" },
    { title: "Net Promoter (eNPS)", value: summary.eNPS || "42", change: 5, trend: "up", icon: MessageSquare, subtitle: "Loyalty metric" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Engagement Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Culture assessment tracking and organizational satisfaction index</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat, i) => (
          <StatsCard key={i} {...stat} />
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Engagement Trend</h3>
          <ResponsiveContainer width="100%" height="260">
            <LineChart data={scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" stroke="#9ca3af" />
              <YAxis stroke="#9ca3af" domain={[60, 100]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke={CHART_COLORS.primary} strokeWidth={2} name="Score %" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Key Engagement Drivers</h3>
          <ResponsiveContainer width="100%" height="260">
            <BarChart data={drivers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" stroke="#9ca3af" width={100} tick={{ fontSize: 11 }} />
              <Tooltip />
              <Bar dataKey="score" fill={CHART_COLORS.info} radius={[0, 4, 4, 0]} name="Score" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">By Department</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead>
              <tr className="border-b border-gray-200 bg-gray-50 text-gray-600 font-medium">
                <th className="py-3 px-4">Department</th>
                <th className="py-3 px-4">Engagement Score</th>
                <th className="py-3 px-4">Participation</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody>
              {byDepartment.map((dept, i) => (
                <tr key={dept.name} className="border-b border-gray-100 hover:bg-gray-50 text-gray-700">
                  <td className="py-3 px-4 font-medium text-gray-900">{dept.name}</td>
                  <td className="py-3 px-4">{dept.score}%</td>
                  <td className="py-3 px-4">{dept.participation}%</td>
                  <td className="py-3 px-4">
                    <StatusBadge status={dept.score >= 75 ? "healthy" : dept.score >= 65 ? "warning" : "critical"} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}