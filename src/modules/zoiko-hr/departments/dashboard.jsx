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

export default function DepartmentsDashboard() {
  const [records, setRecords] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    setIsLoading(true);
    getDepartments()
      .then((res) => {
        if (mounted) {
          const data = res?.data?.data || res?.data || res || [];
          setRecords(Array.isArray(data) ? data : []);
        }
      })
      .catch((err) => console.error(err))
      .finally(() => {
        if (mounted) setIsLoading(false);
      });
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const totalDepts = records.length;
    const totalEmployees = records.reduce((sum, r) => sum + (Number(r.employee_count) || 0), 0);
    const totalBudget = records.reduce((sum, r) => sum + (Number(r.budget) || 0), 0);
    const inactiveDepts = records.filter(r => r.status === "inactive").length;

    return { totalDepts, totalEmployees, totalBudget, inactiveDepts };
  }, [records]);

  const cards = [
    { title: "Total Departments", value: stats.totalDepts, icon: Building2, color: "bg-blue-50 text-blue-600", trend: "+1 this month", trendType: "up" },
    { title: "Total Employees", value: stats.totalEmployees, icon: Users, color: "bg-green-50 text-green-600", trend: "+12 this week", trendType: "up" },
    { title: "Total Budget", value: `$${(stats.totalBudget / 1000000).toFixed(1)}M`, icon: CircleDollarSign, color: "bg-rose-50 text-rose-600", trend: "Within limit", trendType: "neutral" },
    { title: "Inactive Entities", value: stats.inactiveDepts, icon: UserX, color: "bg-amber-50 text-amber-600", trend: "No change", trendType: "neutral" },
  ];

  const recentDepartments = useMemo(() => {
    return [...records].slice(0, 5);
  }, [records]);

  return (
    <HRPage title="Departments Overview" subtitle="High-level structural insights and resource distributions">
      <SubNav />

      {/* Stats Grid Layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
        {cards.map((c, i) => {
          const Icon = c.icon;
          return (
            <div key={i} className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider">{c.title}</p>
                <h3 className="text-2xl font-bold text-gray-800">{isLoading ? "..." : c.value}</h3>
                <p className="text-xs flex items-center gap-1 font-medium text-gray-400">
                  {c.trendType === "up" && <TrendingUp size={12} className="text-green-500" />}
                  {c.trendType === "down" && <TrendingDown size={12} className="text-red-500" />}
                  {c.trendType === "neutral" && <Minus size={12} className="text-gray-400" />}
                  <span>{c.trend}</span>
                </p>
              </div>
              <div className={`p-3 rounded-xl ${c.color}`}><Icon size={22} /></div>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Rows Table View */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="p-5 border-b border-gray-50 flex items-center justify-between">
            <h4 className="font-bold text-gray-800 text-sm flex items-center gap-2">
              <BarChart3 size={16} className="text-rose-600" /> Recent Structural Changes
            </h4>
            <NavLink to="/zoiko-hr/departments/list" className="text-xs font-semibold text-rose-600 hover:text-rose-700 transition-colors">
              View All
            </NavLink>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-left">
              <thead>
                <tr className="bg-gray-50/70 border-b border-gray-100">
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Code</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Head</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employees</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {isLoading ? (
                  <tr><td colSpan={6} className="text-center py-6 text-sm text-gray-400">Loading data metrics...</td></tr>
                ) : recentDepartments.length === 0 ? (
                  <tr><td colSpan={6} className="text-center py-6 text-sm text-gray-400">No departments found.</td></tr>
                ) : (
                  recentDepartments.map((d, i) => (
                    <tr key={d.id ?? i} className="hover:bg-rose-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.name}</td>
                      <td className="px-4 py-3 text-sm font-mono text-xs font-semibold text-rose-600">{d.code}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{d.head || <span className="text-gray-300">-</span>}</td>
                      <td className="px-4 py-3 text-sm font-medium">{d.employee_count || 0}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">${(Number(d.budget) || 0).toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${d.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                          {d.status || "active"}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Resource Breakdown Card Layout */}
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 space-y-4">
          <h4 className="font-bold text-gray-800 text-sm">Resource Allocation</h4>
          <div className="space-y-3 pt-2">
            {isLoading ? (
              <p className="text-xs text-gray-400">Calculating ratios...</p>
            ) : records.length === 0 ? (
              <p className="text-xs text-gray-400">No data available.</p>
            ) : (
              records.slice(0, 4).map((d, i) => {
                const totalBudgetSum = stats.totalBudget || 1;
                const percentage = Math.min(Math.round(((Number(d.budget) || 0) / totalBudgetSum) * 100), 100);
                const progressColors = ["bg-blue-500", "bg-rose-500", "bg-green-500", "bg-amber-500"];
                return (
                  <div key={i} className="space-y-1">
                    <div className="flex justify-between items-center text-xs">
                      <span className="font-medium text-gray-700">{d.name}</span>
                      <span className="font-semibold text-gray-500">{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                      <div className={`${progressColors[i % 4]} h-full rounded-full`} style={{ width: `${percentage}%` }}></div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </HRPage>
  );
}