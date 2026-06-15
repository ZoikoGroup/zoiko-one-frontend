import { Building2, Users, CircleDollarSign, UserX, BarChart3, TrendingUp } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useDepartmentDashboard } from "../hooks/useDepartment";
import { formatCurrency } from "../utils/helpers";

export default function DepartmentsDashboard() {
  const { data, loading } = useDepartmentDashboard();

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { stats, recentDepartments, budgetOverview, departmentDistribution } = data;

  const statCards = [
    { title: "Total Departments", value: stats.total, icon: Building2, change: null, trend: null },
    { title: "Active", value: stats.active, icon: BarChart3, change: 8, trend: "up" },
    { title: "Total Employees", value: stats.totalEmployees, icon: Users, change: 12, trend: "up" },
    { title: "Total Budget", value: formatCurrency(stats.totalBudget), icon: CircleDollarSign, change: 5, trend: "up" },
    { title: "Without Heads", value: stats.withoutHeads, icon: UserX, change: -1, trend: "down" },
  ];

  const deptColumns = [
    { key: "name", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "code", label: "Code", render: (v) => <span className="font-mono text-xs text-rose-600 font-semibold">{v}</span> },
    { key: "head", label: "Head", render: (v) => v || <span className="text-gray-300">-</span> },
    { key: "employee_count", label: "Employees", render: (v) => <span className="font-medium">{v}</span> },
    { key: "budget", label: "Budget", render: (v) => formatCurrency(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const topDepts = [...recentDepartments].sort((a, b) => b.employee_count - a.employee_count);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Departments Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of all departments and organizational metrics</p>
      </div>

      <div className="bg-gradient-to-r from-rose-600 to-rose-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-rose-100 text-sm font-medium">Organizational Overview</p>
            <p className="text-4xl font-bold mt-1">{stats.active}/{stats.total}</p>
            <p className="text-rose-100 mt-1">departments active</p>
          </div>
          <div className="text-right">
            <p className="text-rose-100 text-sm">Average Employees/Dept</p>
            <p className="text-3xl font-bold">{stats.avgEmployees}</p>
            <p className="text-rose-100 text-sm mt-1">{stats.totalEmployees} total employees</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Allocated</span>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(budgetOverview.allocated)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-rose-500 h-3 rounded-full" style={{ width: `${(budgetOverview.utilized / budgetOverview.allocated) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Utilized</span>
              <span className="text-sm font-medium text-gray-900">{formatCurrency(budgetOverview.utilized)}</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-3">
              <div className="bg-rose-300 h-3 rounded-full" style={{ width: `${(budgetOverview.utilized / budgetOverview.allocated) * 100}%` }} />
            </div>
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <span className="text-sm font-semibold text-gray-700">Remaining</span>
              <span className="text-sm font-semibold text-green-600">{formatCurrency(budgetOverview.remaining)}</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Distribution</h2>
          <div className="space-y-3">
            {departmentDistribution.map((d) => {
              const maxEmployees = Math.max(...departmentDistribution.map((x) => x.employees));
              const pct = (d.employees / maxEmployees) * 100;
              return (
                <div key={d.dept}>
                  <div className="flex items-center justify-between text-sm mb-1">
                    <span className="text-gray-700 font-medium">{d.dept}</span>
                    <span className="text-gray-500">{d.employees} employees</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-2">
                    <div className="bg-rose-500 h-2 rounded-full" style={{ width: `${pct}%` }} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Top Departments by Headcount</h2>
          <span className="text-xs text-rose-600 font-medium flex items-center gap-1"><TrendingUp className="w-3 h-3" /> Top 5</span>
        </div>
        <DataTable columns={deptColumns} data={topDepts.slice(0, 5)} />
      </div>
    </div>
  );
}
