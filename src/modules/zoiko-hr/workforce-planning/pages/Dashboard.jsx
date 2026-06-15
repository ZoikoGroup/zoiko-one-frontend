import { Users, Briefcase, DollarSign, Target, TrendingUp, UserPlus } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useWorkforceDashboard, useWorkforcePlans } from "../hooks/useWorkforce";
import { formatCurrency } from "../utils/helpers";

export default function WorkforceDashboard() {
  const { data: dash, loading: dLoad } = useWorkforceDashboard();
  const { data: plans, loading: pLoad } = useWorkforcePlans();

  if (dLoad || pLoad) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { stats, departmentBreakdown, headcountTrend } = dash;

  const statCards = [
    { title: "Total Plans", value: stats.totalPlans, icon: Briefcase, change: 4, trend: "up" },
    { title: "Active Plans", value: stats.activePlans, icon: Target, change: 2, trend: "up" },
    { title: "Total Headcount", value: stats.totalHeadcount, icon: Users, change: 3, trend: "up" },
    { title: "Total Budget", value: formatCurrency(stats.totalBudget), icon: DollarSign, change: 5, trend: "up" },
    { title: "Utilization Rate", value: `${stats.utilizationRate}%`, icon: TrendingUp, change: -1, trend: "down" },
    { title: "Open Positions", value: stats.openPositions, icon: UserPlus, change: 6, trend: "up" },
  ];

  const departmentColumns = [
    { key: "dept", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "headcount", label: "Headcount" },
    { key: "budget", label: "Budget", render: (v) => formatCurrency(v) },
  ];

  const planColumns = [
    { key: "title", label: "Plan", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department" },
    { key: "year", label: "Year" },
    { key: "headcount", label: "Headcount", render: (v, r) => `${v}/${r.targetHeadcount}` },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const maxHC = Math.max(...headcountTrend.map((t) => Math.max(t.planned, t.actual)));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Workforce Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of workforce planning metrics and trends</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Headcount Trend</h2>
          <div className="flex items-end gap-3 h-48">
            {headcountTrend.map((m) => (
              <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                <span className="text-xs text-gray-500">{m.actual}</span>
                <div className="w-full flex flex-col gap-0.5 items-center">
                  <div className="w-full bg-teal-200 rounded-t" style={{ height: `${(m.actual / maxHC) * 100}%` }}>
                    <div className="w-full bg-teal-500 rounded-t h-full" />
                  </div>
                  <div className="w-full bg-blue-200 rounded-t" style={{ height: `${((m.planned - m.actual) / maxHC) * 100}%` }}>
                    <div className="w-full bg-blue-500 rounded-t h-full opacity-70" />
                  </div>
                </div>
                <span className="text-xs text-gray-500 mt-1">{m.month}</span>
              </div>
            ))}
          </div>
          <div className="flex justify-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-teal-500" /> Actual</span>
            <span className="flex items-center gap-1"><span className="w-3 h-3 rounded bg-blue-500" /> Planned</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h2>
          <DataTable columns={departmentColumns} data={departmentBreakdown} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Workforce Plans</h2>
          <span className="text-xs text-teal-600 font-medium">View all</span>
        </div>
        <DataTable columns={planColumns} data={plans.slice(0, 5)} />
      </div>
    </div>
  );
}
