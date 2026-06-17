import { useState, useEffect } from "react";
import { getRecruitmentInsights } from "../../service/insightsService";
import StatsCard from "../../components/insights/StatsCard";
import { CHART_COLORS } from "../../components/insights/chartColors";
import { Users, UserPlus, Briefcase, Calendar, FileCheck2, Clock } from "lucide-react";
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

export default function RecruitmentInsights() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  useEffect(() => { getRecruitmentInsights().then(setData).catch(() => {}).finally(() => setLoading(false)); }, []);

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, pipeline, monthlyTrend, byDepartment } = data;

  const stats = [
    { title: "Open Positions", value: summary.openPositions, change: 5, trend: "up", icon: Briefcase, subtitle: `${summary.newRequisitions} new this month` },
    { title: "Total Applicants", value: summary.totalApplicants.toLocaleString(), change: 15, trend: "up", icon: Users, subtitle: "All time" },
    { title: "Interviews", value: summary.interviewsScheduled, change: 8, trend: "up", icon: Calendar, subtitle: "Scheduled" },
    { title: "Offers Extended", value: summary.offersExtended, change: 3, trend: "up", icon: FileCheck2, subtitle: `${summary.offersAccepted} accepted` },
    { title: "Acceptance Rate", value: `${summary.acceptanceRate}%`, change: 2, trend: "up", icon: UserPlus, subtitle: "Offer acceptance" },
    { title: "Avg Time to Hire", value: `${summary.avgTimeToHire} days`, change: -3, trend: "down", icon: Clock, subtitle: "Faster than last quarter" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Recruitment Insights</h1>
        <p className="text-sm text-gray-500 mt-1">Recruitment funnel metrics, pipeline and department analysis</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Recruitment Pipeline</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={pipeline}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="stage" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Bar dataKey="count" fill={CHART_COLORS.primary} barSize={32} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="applicantsGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/></linearGradient>
                <linearGradient id="hiresGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.success} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.success} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="applicants" stroke={CHART_COLORS.primary} fill="url(#applicantsGrad)" strokeWidth={2} name="Applicants" />
              <Area type="monotone" dataKey="hires" stroke={CHART_COLORS.success} fill="url(#hiresGrad)" strokeWidth={2} name="Hires" />
            </AreaChart>
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
                <th className="text-left py-3 px-4 font-medium text-gray-600">Open Positions</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Applicants</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Interviews</th>
                <th className="text-left py-3 px-4 font-medium text-gray-600">Avg Days to Hire</th>
              </tr>
            </thead>
            <tbody>
              {byDepartment.map((dept, i) => (
                <tr key={dept.name} className={i < byDepartment.length - 1 ? "border-b border-gray-100" : ""}>
                  <td className="py-3 px-4 font-medium">{dept.name}</td>
                  <td className="py-3 px-4">{dept.open}</td>
                  <td className="py-3 px-4">{dept.applicants}</td>
                  <td className="py-3 px-4">{dept.interviews}</td>
                  <td className="py-3 px-4">{dept.avgDays}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
