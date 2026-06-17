import { useState, useEffect } from "react";
import { getEngagementInsights } from "../../service/insightsService";
import StatsCard from "../../components/insights/StatsCard";
import StatusBadge from "../../components/insights/StatusBadge";
import { CHART_COLORS } from "../../components/insights/chartColors";
import { HeartHandshake, Users, ClipboardCheck, BarChart3, TrendingUp, MessageSquare } from "lucide-react";
import { BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function EngagementInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getEngagementInsights().then(setData).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, scoreTrend, byDepartment, drivers } = data;

  const stats = [
    { title: "Overall Score", value: `${summary.overallScore}%`, change: 2, trend: "up", icon: HeartHandshake, subtitle: "Company-wide" },
    { title: "Participation", value: `${summary.participationRate}%`, change: 3, trend: "up", icon: Users, subtitle: "Survey participation" },
    { title: "Active Surveys", value: summary.activeSurveys, change: 1, trend: "up", icon: ClipboardCheck, subtitle: "In progress" },
    { title: "Response Rate", value: `${summary.responseRate}%`, change: 2, trend: "up", icon: BarChart3, subtitle: "Avg response rate" },
    { title: "NPS Score", value: summary.npsScore, change: 4, trend: "up", icon: TrendingUp, subtitle: "Net Promoter Score" },
    { title: "Engagement Drivers", value: drivers.length, change: 0, trend: "stable", icon: MessageSquare, subtitle: "Key drivers tracked" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Engagement Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Employee engagement scores, trends and driver analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Engagement Score Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={scoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[65, 85]} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke={CHART_COLORS.primary} strokeWidth={2} name="Engagement Score" dot={{ r: 4 }} strokeLinecap="round" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Engagement Drivers</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={drivers} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 100]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" width={120} />
              <Tooltip />
              <Legend />
              <Bar dataKey="score" fill={CHART_COLORS.primary} barSize={12} radius={[0, 4, 4, 0]} name="Your Score" />
              <Bar dataKey="benchmark" fill={CHART_COLORS.muted} barSize={12} radius={[0, 4, 4, 0]} name="Benchmark" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">By Department</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Engagement Score</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Participation</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
              </tr>
            </thead>
            <tbody>
              {byDepartment.map((dept, i) => (
                <tr key={dept.name} className={i < byDepartment.length - 1 ? "border-b border-gray-100" : ""}>
                  <td className="py-3 px-4 font-medium">{dept.name}</td>
                  <td className="py-3 px-4">{dept.score}%</td>
                  <td className="py-3 px-4">{dept.participation}%</td>
                  <td className="py-3 px-4"><StatusBadge status={dept.score >= 75 ? "healthy" : dept.score >= 65 ? "warning" : "critical"} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
