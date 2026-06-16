import { useExecutiveDashboard } from "../hooks/useInsights.js";
import StatsCard from "../components/StatsCard.jsx";
import StatusBadge from "../components/StatusBadge.jsx";
import DataTable from "../components/DataTable.jsx";
import { formatCurrency, formatPercent } from "../utils/helpers.js";
import { CHART_COLORS } from "../types/index.js";
import {
  DollarSign, Users, Briefcase, TrendingUp, PieChart, Activity,
  ShieldCheck, TrendingDown,
} from "lucide-react";
import {
  LineChart, Line, BarChart, Bar, PieChart as RPieChart, Pie, Cell,
  AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend,
} from "recharts";

export default function InsightsDashboard() {
  const { data, loading } = useExecutiveDashboard();

  if (loading || !data) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const { kpis, revenueTrend, costTrend, workforceGrowth, performanceOverview, departmentRevenue } = data;

  const kpiCards = [
    { title: "Total Revenue", value: formatCurrency(kpis.totalRevenue), change: kpis.growthRate, trend: "up", icon: DollarSign, subtitle: "Last 12 months" },
    { title: "Employees", value: kpis.employeeCount.toLocaleString(), change: 4.2, trend: "up", icon: Users, subtitle: "Active headcount" },
    { title: "Active Projects", value: kpis.activeProjects, change: 8.3, trend: "up", icon: Briefcase, subtitle: "In progress" },
    { title: "Profit Margin", value: formatPercent(kpis.profitMargin), change: 1.2, trend: "up", icon: TrendingUp, subtitle: "YTD" },
    { title: "Compliance Score", value: `${kpis.complianceScore}%`, change: 3.5, trend: "up", icon: ShieldCheck, subtitle: "+5 pts vs last year" },
    { title: "Payroll Cost", value: formatCurrency(kpis.totalPayrollCost), change: 2.8, trend: "up", icon: Activity, subtitle: "38.3% of revenue" },
    { title: "Vendor Spend", value: formatCurrency(kpis.vendorSpend), change: 1.5, trend: "up", icon: PieChart, subtitle: "Year to date" },
    { title: "Growth Rate", value: formatPercent(kpis.growthRate), change: 0.3, trend: "up", icon: TrendingDown, subtitle: "YoY" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Executive Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Real-time business performance overview</p>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-500 bg-white px-4 py-2 rounded-lg border border-gray-200">
          <div className="w-2 h-2 rounded-full bg-emerald-500" />
          Last updated: Today 07:45 AM
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiCards.map((kpi) => (
          <StatsCard key={kpi.title} {...kpi} />
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue vs Cost Trend</h3>
          <ResponsiveContainer width="100%" height={280}>
            <AreaChart data={revenueTrend}>
              <defs>
                <linearGradient id="revGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.primary} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.primary} stopOpacity={0}/></linearGradient>
                <linearGradient id="costGrad" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor={CHART_COLORS.danger} stopOpacity={0.2}/><stop offset="95%" stopColor={CHART_COLORS.danger} stopOpacity={0}/></linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e6).toFixed(1)}M`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Area type="monotone" dataKey="revenue" stroke={CHART_COLORS.primary} fill="url(#revGrad)" strokeWidth={2} name="Revenue" />
              <Area type="monotone" dataKey="cost" stroke={CHART_COLORS.danger} fill="url(#costGrad)" strokeWidth={2} name="Cost" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Revenue by Department</h3>
          <ResponsiveContainer width="100%" height={280}>
            <RPieChart>
              <Pie data={departmentRevenue} cx="50%" cy="50%" innerRadius={70} outerRadius={100} paddingAngle={3} dataKey="value">
                {departmentRevenue.map((e, i) => (
                  <Cell key={e.name} fill={[CHART_COLORS.primary, CHART_COLORS.success, CHART_COLORS.warning, CHART_COLORS.danger, CHART_COLORS.info, CHART_COLORS.gray][i % 6]} />
                ))}
              </Pie>
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
            </RPieChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Cost Breakdown</h3>
          <ResponsiveContainer width="100%" height={280}>
            <BarChart data={costTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" tickFormatter={(v) => `$${(v / 1e3).toFixed(0)}K`} />
              <Tooltip formatter={(v) => formatCurrency(v)} />
              <Legend />
              <Bar dataKey="payroll" fill={CHART_COLORS.primary} name="Payroll" stackId="a" />
              <Bar dataKey="operations" fill={CHART_COLORS.warning} name="Operations" stackId="a" />
              <Bar dataKey="infrastructure" fill={CHART_COLORS.info} name="Infrastructure" stackId="a" />
              <Bar dataKey="marketing" fill={CHART_COLORS.success} name="Marketing" stackId="a" />
              <Bar dataKey="other" fill={CHART_COLORS.gray} name="Other" stackId="a" />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-base font-semibold text-gray-900 mb-4">Workforce Growth</h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={workforceGrowth}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <YAxis tick={{ fontSize: 12 }} stroke="#9ca3af" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="headcount" stroke={CHART_COLORS.primary} strokeWidth={2} name="Headcount" dot={false} />
              <Line type="monotone" dataKey="hires" stroke={CHART_COLORS.success} strokeWidth={2} name="Hires" dot={false} />
              <Line type="monotone" dataKey="departures" stroke={CHART_COLORS.danger} strokeWidth={2} name="Departures" dot={false} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h3 className="text-base font-semibold text-gray-900 mb-4">Performance vs Target</h3>
        <ResponsiveContainer width="100%" height={200}>
          <BarChart data={performanceOverview} layout="vertical">
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis type="number" tick={{ fontSize: 12 }} stroke="#9ca3af" domain={[0, 100]} />
            <YAxis type="category" dataKey="metric" tick={{ fontSize: 12 }} stroke="#9ca3af" width={140} />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill={CHART_COLORS.primary} name="Actual" barSize={16} />
            <Bar dataKey="target" fill={CHART_COLORS.warning} name="Target" barSize={16} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
