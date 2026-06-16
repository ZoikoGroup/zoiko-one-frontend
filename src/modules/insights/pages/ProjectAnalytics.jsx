import { useState } from "react";
import { useProjectAnalytics } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatCurrency } from "../utils/helpers.js";
import { CHART_COLORS } from "../types/index.js";
import { Briefcase, CheckCircle, AlertTriangle, Clock, DollarSign, TrendingUp } from "lucide-react";
import {
  BarChart, Bar, PieChart, Pie, Cell, LineChart, Line,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function ProjectAnalytics() {
  const { data, loading } = useProjectAnalytics();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", category: "" });

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, projects, statusDistribution, budgetByCategory, timeline } = data;

  const stats = [
    { title: "Total Projects", value: summary.totalProjects, change: 8.2, trend: "up", icon: Briefcase, subtitle: `${summary.activeProjects} active` },
    { title: "Completed (YTD)", value: summary.completedThisYear, change: 14.3, trend: "up", icon: CheckCircle, subtitle: "This year" },
    { title: "At Risk", value: summary.atRisk, change: 2, trend: "up", icon: AlertTriangle, subtitle: "Needs attention" },
    { title: "Over Budget", value: summary.overBudget, change: -1, trend: "down", icon: DollarSign, subtitle: "Exceeding budget" },
    { title: "Total Budget", value: formatCurrency(summary.totalBudget), change: 5.5, trend: "up", icon: TrendingUp, subtitle: `${summary.avgCompletion}% avg completion` },
    { title: "Total Spent", value: formatCurrency(summary.totalSpent), change: 7.2, trend: "up", icon: Clock, subtitle: `${((summary.totalSpent / summary.totalBudget) * 100).toFixed(0)}% utilized` },
  ];

  const columns = [
    { key: "name", label: "Project", render: (v, r) => <div><span className="font-medium">{v}</span><div className="text-xs text-gray-400">{r.category}</div></div> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "budget", label: "Budget", render: (v) => formatCurrency(v) },
    { key: "spent", label: "Spent", render: (v) => formatCurrency(v) },
    { key: "progress", label: "Progress", render: (v) => <div className="flex items-center gap-2"><div className="w-24 bg-gray-100 rounded-full h-2"><div className="bg-indigo-600 h-2 rounded-full" style={{ width: `${v}%` }} /></div><span className="text-xs">{v}%</span></div> },
    { key: "teamSize", label: "Team" },
    { key: "deadline", label: "Deadline" },
    { key: "priority", label: "Priority", render: (v) => <span className={`capitalize text-xs font-medium px-2 py-0.5 rounded-full ${v === "critical" ? "bg-red-100 text-red-700" : v === "high" ? "bg-orange-100 text-orange-700" : "bg-gray-100 text-gray-700"}`}>{v}</span> },
  ];

  let filteredProjects = [...projects];
  if (search) filteredProjects = filteredProjects.filter(p => p.name.toLowerCase().includes(search.toLowerCase()) || p.manager.toLowerCase().includes(search.toLowerCase()));
  if (filters.status) filteredProjects = filteredProjects.filter(p => p.status === filters.status);
  if (filters.category) filteredProjects = filteredProjects.filter(p => p.category === filters.category);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Project Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Project portfolio performance and budget tracking</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Project Status Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <PieChart>
              <Pie data={statusDistribution} cx="50%" cy="50%" outerRadius={90} label={({ name, value }) => `${name}: ${value}`} dataKey="value">
                {statusDistribution.map((e, i) => (
                  <Cell key={e.name} fill={[CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger][i % 3]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Budget by Category</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={budgetByCategory}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="budget" fill={CHART_COLORS.primary} name="Budget" barSize={16} />
              <Bar dataKey="spent" fill={CHART_COLORS.warning} name="Spent" barSize={16} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Project Timeline</h3>
        <ResponsiveContainer width="100%" height={250}>
          <LineChart data={timeline}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="started" stroke={CHART_COLORS.primary} strokeWidth={2} name="Started" dot={{ r: 4 }} />
            <Line type="monotone" dataKey="completed" stroke={CHART_COLORS.success} strokeWidth={2} name="Completed" dot={{ r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">All Projects</h3>
        </div>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          filters={[
            { key: "status", placeholder: "All Statuses", value: filters.status, options: ["on_track", "at_risk", "over_budget", "completed"].map(s => ({ value: s, label: s.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()) })) },
            { key: "category", placeholder: "All Categories", value: filters.category, options: ["Internal", "Client", "R&D", "Maintenance", "Migration"].map(c => ({ value: c, label: c })) },
          ]}
          onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        />
        <DataTable columns={columns} data={filteredProjects} />
      </div>
    </div>
  );
}
