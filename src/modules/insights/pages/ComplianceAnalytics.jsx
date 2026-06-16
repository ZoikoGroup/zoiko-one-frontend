import { useState } from "react";
import { useComplianceAnalytics } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatDate } from "../utils/helpers.js";
import { CHART_COLORS } from "../types/index.js";
import { ShieldCheck, AlertTriangle, CheckCircle, Clock, FileText, Scale } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";

export default function ComplianceAnalytics() {
  const { data, loading } = useComplianceAnalytics();

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, frameworkScores, monthlyTrend, findingsBySeverity, findingsByDepartment, upcomingDeadlines } = data;

  const stats = [
    { title: "Overall Score", value: `${summary.overallScore}%`, change: 3.5, trend: "up", icon: ShieldCheck, subtitle: "Compliance health" },
    { title: "Passed Controls", value: summary.passedControls, change: 8, trend: "up", icon: CheckCircle, subtitle: `${summary.failedControls} failed` },
    { title: "Open Findings", value: summary.openFindings, change: -5, trend: "down", icon: AlertTriangle, subtitle: `${summary.overdueActions} overdue` },
    { title: "Pending Reviews", value: summary.pendingReviews, change: 2, trend: "up", icon: Clock, subtitle: "Awaiting review" },
    { title: "Frameworks", value: summary.frameworks, change: 0, trend: "stable", icon: Scale, subtitle: "Active certifications" },
    { title: "Next Assessment", value: formatDate(summary.nextAssessment), change: null, trend: "stable", icon: FileText, subtitle: `Last: ${formatDate(summary.lastAssessment)}` },
  ];

  const columns = [
    { key: "title", label: "Deadline", render: (v) => <span className="font-medium">{v}</span> },
    { key: "deadline", label: "Due Date", render: (v) => formatDate(v) },
    { key: "owner", label: "Owner" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const deptColumns = [
    { key: "name", label: "Department" },
    { key: "open", label: "Open", render: (v) => <span className={v > 2 ? "text-red-600 font-medium" : ""}>{v}</span> },
    { key: "closed", label: "Closed", render: (v) => <span className="text-emerald-600">{v}</span> },
    { key: "critical", label: "Critical", render: (v) => <span className={v > 0 ? "text-red-600 font-bold" : "text-gray-400"}>{v}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Compliance posture monitoring and audit readiness</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Framework Scores</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={frameworkScores} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" domain={[0, 100]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={100} />
              <Tooltip formatter={(v) => `${v}%`} />
              <Bar dataKey="score" fill={CHART_COLORS.primary} barSize={16} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Compliance Score Trend</h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={monthlyTrend}>
              <defs>
                <linearGradient id="scoreGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis domain={[60, 90]} tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip formatter={(v) => `${v}%`} />
              <Area type="monotone" dataKey="score" stroke={CHART_COLORS.primary} fill="url(#scoreGrad)" strokeWidth={2} name="Score" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Findings by Severity</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={findingsBySeverity} cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                {findingsBySeverity.map((e, i) => (
                  <Cell key={e.name} fill={[CHART_COLORS.danger, CHART_COLORS.warning, CHART_COLORS.info, CHART_COLORS.success][i % 4]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Findings by Department</h3>
          <DataTable columns={deptColumns} data={findingsByDepartment} />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Upcoming Compliance Deadlines</h3>
          <DataTable columns={columns} data={upcomingDeadlines} />
        </div>
      </div>
    </div>
  );
}
