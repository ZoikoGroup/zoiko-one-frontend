import { useState, useEffect } from "react";
import { getPerformanceInsights } from "../../service/insightsService";
import StatsCard from "../../components/insights/StatsCard";
import { CHART_COLORS } from "../../components/insights/chartColors";
import { Activity, CheckCircle, Clock, Target, TrendingUp, Award } from "lucide-react";
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function PerformanceInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getPerformanceInsights().then(setData).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, ratingDistribution, byDepartment, quarterlyTrend } = data;

  const stats = [
    { title: "Avg Rating", value: summary.avgRating.toFixed(1), change: 0.1, trend: "up", icon: Award, subtitle: "Company-wide" },
    { title: "Completed Reviews", value: summary.completedReviews, change: 12, trend: "up", icon: CheckCircle, subtitle: "This cycle" },
    { title: "Pending Reviews", value: summary.pendingReviews, change: -5, trend: "down", icon: Clock, subtitle: "Awaiting completion" },
    { title: "Goals On Track", value: `${summary.goalsOnTrack}%`, change: 3, trend: "up", icon: Target, subtitle: "Of all goals" },
    { title: "Exceeded Expectations", value: summary.exceededExpectations, change: 8, trend: "up", icon: TrendingUp, subtitle: "Top performers" },
    { title: "Active Reviews", value: summary.completedReviews + summary.pendingReviews, change: 7, trend: "up", icon: Activity, subtitle: "Total this cycle" },
  ];

  const PIE_COLORS = [CHART_COLORS.danger, CHART_COLORS.warning, CHART_COLORS.muted, CHART_COLORS.primary, CHART_COLORS.success];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Performance Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Performance review metrics, ratings and department analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Rating Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={ratingDistribution} dataKey="count" nameKey="rating" cx="50%" cy="50%" outerRadius={80} label={({ rating, count }) => `${rating} (${count})`}>
                {ratingDistribution.map((_, i) => <Cell key={i} fill={PIE_COLORS[i % PIE_COLORS.length]} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex justify-center gap-4 mt-2">
            <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.success }} /> 5</div>
            <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.primary }} /> 4</div>
            <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.muted }} /> 3</div>
            <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.warning }} /> 2</div>
            <div className="flex items-center gap-1 text-xs text-gray-500"><div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: CHART_COLORS.danger }} /> 1</div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Quarterly Trend</h3>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={quarterlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="quarter" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[3, 4.5]} />
              <Tooltip />
              <Line type="monotone" dataKey="avg" stroke={CHART_COLORS.primary} strokeWidth={2} name="Avg Rating" dot={{ r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">By Department</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={byDepartment} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 5]} />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" width={100} />
              <Tooltip />
              <Bar dataKey="avgRating" fill={CHART_COLORS.primary} barSize={16} radius={[0, 4, 4, 0]} name="Avg Rating" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Department Review Status</h3>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-200">
                <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Avg Rating</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Completed</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Pending</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Progress</th>
              </tr>
            </thead>
            <tbody>
              {byDepartment.map((dept, i) => (
                <tr key={dept.name} className={i < byDepartment.length - 1 ? "border-b border-gray-100" : ""}>
                  <td className="py-3 px-4 font-medium">{dept.name}</td>
                  <td className="py-3 px-4">{dept.avgRating.toFixed(1)}</td>
                  <td className="py-3 px-4">{dept.completed}</td>
                  <td className="py-3 px-4">{dept.pending}</td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <div className="w-24 bg-gray-200 rounded-full h-2">
                        <div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${(dept.completed / (dept.completed + dept.pending)) * 100}%` }} />
                      </div>
                      <span className="text-xs text-gray-500">{Math.round((dept.completed / (dept.completed + dept.pending)) * 100)}%</span>
                    </div>
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
