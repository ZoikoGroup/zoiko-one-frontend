import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Building2, Users, CircleDollarSign, UserX, BarChart3, TrendingUp, Minus, TrendingDown } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getDepartments } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/departments" },
  { label: "Department List", href: "/zoiko-hr/departments/list" },
  { label: "Department Structure", href: "/zoiko-hr/departments/structure" },
  { label: "Reports", href: "/zoiko-hr/departments/reports" },
  { label: "Settings", href: "/zoiko-hr/departments/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/departments"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-rose-600 border-b-2 border-rose-600 bg-rose-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, change, trend }) {
  const TrendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingDown : Minus;
  const trendColor = trend === "up" ? "text-green-600" : trend === "down" ? "text-red-600" : "text-gray-400";
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && <div className="p-2 bg-rose-50 rounded-lg"><Icon className="w-5 h-5 text-rose-600" /></div>}
      </div>
      {change != null && (
        <div className="flex items-center gap-1 mt-3">
          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
          <span className={`text-sm font-medium ${trendColor}`}>{change > 0 ? "+" : ""}{change}%</span>
          <span className="text-sm text-gray-400">vs last month</span>
        </div>
      )}
    </div>
  );
}

export default function DepartmentsDashboard() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getDepartments();
        if (mounted) setRecords(Array.isArray(data) ? data : []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load dashboard");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((r) => r.status === "active").length;
    const totalEmployees = records.reduce((sum, r) => sum + (r.employee_count || 0), 0);
    const totalBudget = records.reduce((sum, r) => sum + (r.budget || 0), 0);
    const withoutHeads = records.filter((r) => !r.head).length;
    const avgEmployees = Math.round(totalEmployees / total);
    return { total, active, totalEmployees, totalBudget, withoutHeads, avgEmployees };
  }, [records]);

  const recentDepartments = useMemo(() => {
    return [...records].sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5).map((d) => ({
      id: d.id, name: d.name, code: d.code, head: d.head, employee_count: d.employee_count, budget: d.budget, status: d.status,
    }));
  }, [records]);

  const allocated = 20000000;
  const utilized = 15450000;

  const departmentDistribution = useMemo(() => {
    return records.slice(0, 8).map((d) => ({ dept: d.name, employees: d.employee_count, budget: d.budget }));
  }, [records]);

  const statCards = [
    { title: "Total Departments", value: stats.total, icon: Building2, change: null, trend: null },
    { title: "Active", value: stats.active, icon: BarChart3, change: 8, trend: "up" },
    { title: "Total Employees", value: stats.totalEmployees, icon: Users, change: 12, trend: "up" },
    { title: "Total Budget", value: `$${(stats.totalBudget / 1000000).toFixed(1)}M`, icon: CircleDollarSign, change: 5, trend: "up" },
    { title: "Without Heads", value: stats.withoutHeads, icon: UserX, change: -1, trend: "down" },
  ];

  if (loading) {
    return (
      <HRPage title="Departments Dashboard" subtitle="Overview of all departments and organizational metrics">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          <span className="ml-3 text-gray-500">Loading dashboard...</span>
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="Departments Dashboard" subtitle="Overview of all departments and organizational metrics">
        <SubNav />
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">Error: {error}</div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Departments Dashboard" subtitle="Overview of all departments and organizational metrics">
      <SubNav />
      <div className="space-y-6">
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
          {statCards.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Overview</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Allocated</span>
                <span className="text-sm font-medium text-gray-900">${allocated.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-rose-500 h-3 rounded-full" style={{ width: `${(utilized / allocated) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Utilized</span>
                <span className="text-sm font-medium text-gray-900">${utilized.toLocaleString()}</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-rose-300 h-3 rounded-full" style={{ width: `${(utilized / allocated) * 100}%` }} />
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <span className="text-sm font-semibold text-gray-700">Remaining</span>
                <span className="text-sm font-semibold text-green-600">${(allocated - utilized).toLocaleString()}</span>
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
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Head</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentDepartments.map((d, i) => (
                  <tr key={d.id ?? i} className="hover:bg-rose-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.name}</td>
                    <td className="px-4 py-3 text-sm font-mono text-xs font-semibold text-rose-600">{d.code}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{d.head || <span className="text-gray-300">-</span>}</td>
                    <td className="px-4 py-3 text-sm font-medium">{d.employee_count}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">${d.budget?.toLocaleString() || "0"}</td>
                    <td className="px-4 py-3 text-sm"><span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${d.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{d.status}</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
