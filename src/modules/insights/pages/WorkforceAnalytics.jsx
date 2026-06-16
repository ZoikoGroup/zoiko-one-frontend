import { useState } from "react";
import { useWorkforceAnalytics, useWorkforceTableData } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import FilterBar from "../components/FilterBar.jsx";
import DataTable from "../components/DataTable.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import { formatCurrency, formatPercent } from "../utils/helpers.js";
import { CHART_COLORS } from "../types/index.js";
import { Users, UserPlus, UserMinus, Clock, BarChart3, MapPin } from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area,
} from "recharts";

export default function WorkforceAnalytics() {
  const { data, loading } = useWorkforceAnalytics();
  const { data: tableData } = useWorkforceTableData();
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ department: "", location: "" });

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { summary, departmentDistribution, monthlyTrend, hiringTrend, leaveTrend, locations } = data;

  const statsCards = [
    { title: "Total Headcount", value: summary.totalHeadcount.toLocaleString(), change: 4.2, trend: "up", icon: Users, subtitle: `${summary.activeEmployees} active` },
    { title: "New Hires (YTD)", value: summary.newHiresThisYear, change: 8.5, trend: "up", icon: UserPlus, subtitle: `${summary.openPositions} open positions` },
    { title: "Departures (YTD)", value: summary.departuresThisYear, change: -3.2, trend: "down", icon: UserMinus, subtitle: `${summary.annualAttrition}% attrition` },
    { title: "Avg Utilization", value: formatPercent(78.4), change: 2.1, trend: "up", icon: Clock, subtitle: `${summary.avgTenure} yrs avg tenure` },
    { title: "Avg Salary", value: formatCurrency(summary.avgSalary), change: 3.5, trend: "up", icon: BarChart3, subtitle: "Across all departments" },
    { title: "Locations", value: summary.locationCount, change: 0, trend: "stable", icon: MapPin, subtitle: `Remote + ${summary.locationCount} offices` },
  ];

  const tableColumns = [
    { key: "department", label: "Department", render: (v) => <span className="font-medium">{v}</span> },
    { key: "headcount", label: "Headcount" },
    { key: "avgSalary", label: "Avg Salary", render: (v) => formatCurrency(v) },
    { key: "attrition", label: "Attrition %", render: (v) => <span className={parseFloat(v) > 12 ? "text-red-600" : "text-gray-700"}>{v}%</span> },
    { key: "utilization", label: "Utilization", render: (v) => `${v}%` },
    { key: "satisfaction", label: "Satisfaction" },
    { key: "openPositions", label: "Open Positions" },
    { key: "avgTenure", label: "Avg Tenure (yrs)", render: (v) => `${v}` },
  ];

  let filteredTable = [...(tableData || [])];
  if (search) filteredTable = filteredTable.filter(r => r.department.toLowerCase().includes(search.toLowerCase()));
  if (filters.department) filteredTable = filteredTable.filter(r => r.department === filters.department);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Workforce Analytics</h1>
        <p className="text-sm text-gray-500 mt-1">Comprehensive workforce metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {statsCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Headcount by Department</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={departmentDistribution} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} stroke="#9ca3af" width={100} />
              <Tooltip />
              <Bar dataKey="headcount" fill={CHART_COLORS.primary} barSize={16} radius={[0, 4, 4, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Hiring Pipeline</h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={hiringTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar dataKey="applications" fill={CHART_COLORS.info} name="Applications" stackId="a" />
              <Bar dataKey="interviews" fill={CHART_COLORS.warning} name="Interviews" stackId="a" />
              <Bar dataKey="offers" fill={CHART_COLORS.success} name="Offers" stackId="a" />
              <Bar dataKey="hires" fill={CHART_COLORS.primary} name="Hires" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Leave Distribution</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={leaveTrend}>
              <defs>
                <linearGradient id="sick" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0}/></linearGradient>
                <linearGradient id="vac" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Area type="monotone" dataKey="sick" stroke={CHART_COLORS.danger} fill="url(#sick)" name="Sick Leave" />
              <Area type="monotone" dataKey="vacation" stroke={CHART_COLORS.primary} fill="url(#vac)" name="Vacation" />
              <Area type="monotone" dataKey="personal" stroke={CHART_COLORS.warning} fill="url(#vac)" name="Personal" />
              <Area type="monotone" dataKey="other" stroke={CHART_COLORS.gray} fill="url(#vac)" name="Other" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Monthly Workforce Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="headcount" stroke={CHART_COLORS.primary} strokeWidth={2} name="Headcount" dot={false} />
              <Line type="monotone" dataKey="overtime" stroke={CHART_COLORS.warning} strokeWidth={2} name="Overtime Hours" dot={false} />
              <Line type="monotone" dataKey="absenteeism" stroke={CHART_COLORS.danger} strokeWidth={2} name="Absenteeism %" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Location Distribution</h3>
          <ResponsiveContainer width="100%" height={260}>
            <PieChart>
              <Pie data={locations} cx="50%" cy="50%" outerRadius={90} label={({ name, count }) => `${name}: ${count}`} dataKey="count">
                {locations.map((e, i) => (
                  <Cell key={e.name} fill={[CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.info, CHART_COLORS.secondary, CHART_COLORS.gray, "#f97316"][i % 8]} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Department Budget vs Openings</h3>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={departmentDistribution}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 10 }} stroke="#9ca3af" angle={-45} textAnchor="end" height={60} />
              <YAxis yAxisId="left" tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <YAxis yAxisId="right" orientation="right" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Bar yAxisId="left" dataKey="budget" fill={CHART_COLORS.primary} name="Budget" barSize={12} />
              <Bar yAxisId="right" dataKey="openPositions" fill={CHART_COLORS.warning} name="Open Positions" barSize={12} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-base font-semibold text-gray-900">Department Overview</h3>
        </div>
        <FilterBar
          search={search}
          onSearchChange={setSearch}
          filters={[
            { key: "department", placeholder: "All Departments", value: filters.department, options: departmentDistribution.map(d => ({ value: d.name, label: d.name })) },
          ]}
          onFilterChange={(key, value) => setFilters(prev => ({ ...prev, [key]: value }))}
        />
        <DataTable columns={tableColumns} data={filteredTable} />
      </div>
    </div>
  );
}
