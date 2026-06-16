import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { FileText, Download, TrendingUp, Users, Building2, CircleDollarSign, Calendar } from "lucide-react";
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

export default function DepartmentReports() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDepartments()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const maxHeadcount = Math.max(...records.map((r) => r.employee_count || 0));
  const maxBudget = Math.max(...records.map((r) => r.budget || 0));
  const totalBudget = records.reduce((s, r) => s + (r.budget || 0), 0);
  const totalUtilized = records.reduce((s, r) => s + (r.budget || 0), 0);
  const totalEmployees = records.reduce((s, r) => s + (r.employee_count || 0), 0);
  const startEmployees = 210;
  const growth = ((totalEmployees - startEmployees) / startEmployees * 100).toFixed(1);

  const statCards = [
    { title: "Total Departments", value: records.length, icon: Building2, change: null, trend: null },
    { title: "Total Headcount", value: totalEmployees, icon: Users, change: Number(growth), trend: "up" },
    { title: "Total Budget", value: `$${(totalBudget / 1000000).toFixed(1)}M`, icon: CircleDollarSign, change: null, trend: null },
    { title: "Utilized Budget", value: `$${(totalUtilized / 1000000).toFixed(1)}M`, icon: TrendingUp, change: Math.round((totalUtilized / totalBudget) * 100), trend: "up" },
  ];

  if (loading) {
    return (
      <HRPage title="Department Reports" subtitle="Analytics and insights across all departments">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-rose-600"></div>
          <span className="ml-3 text-gray-500">Loading reports...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Department Reports" subtitle="Analytics and insights across all departments">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Analytics and insights across all departments</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" /> Export CSV
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {statCards.map((s) => <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">{s.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{s.value}</p>
              </div>
              {s.icon && <div className="p-2 bg-rose-50 rounded-lg"><s.icon className="w-5 h-5 text-rose-600" /></div>}
            </div>
          </div>)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Headcount Trend</h2>
            <div className="flex items-end gap-2 h-48">
              {[
                { month: "Jan", count: 210 },
                { month: "Feb", count: 218 },
                { month: "Mar", count: 225 },
                { month: "Apr", count: 230 },
                { month: "May", count: 240 },
                { month: "Jun", count: 248 },
                { month: "Jul", count: 255 },
                { month: "Aug", count: 260 },
                { month: "Sep", count: 268 },
                { month: "Oct", count: 275 },
                { month: "Nov", count: 282 },
                { month: "Dec", count: 294 },
              ].map((h) => {
                const pct = (h.count / maxHeadcount) * 100;
                return (
                  <div key={h.month} className="flex-1 flex flex-col items-center gap-1 h-full justify-end">
                    <span className="text-[10px] text-gray-500 font-medium">{h.count}</span>
                    <div className="w-full bg-rose-200 rounded-t" style={{ height: `${Math.max(pct, 3)}%` }} />
                    <span className="text-[10px] text-gray-400 -rotate-45 origin-right whitespace-nowrap">{h.month}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Growth</h2>
            <div className="space-y-4">
              {[
                { quarter: "Q1 2024", new_depts: 2, total: 12 },
                { quarter: "Q2 2024", new_depts: 1, total: 13 },
                { quarter: "Q3 2024", new_depts: 1, total: 14 },
                { quarter: "Q4 2024", new_depts: 0, total: 14 },
                { quarter: "Q1 2025", new_depts: 1, total: 15 },
                { quarter: "Q2 2025", new_depts: 0, total: 15 },
              ].map((g) => (
                <div key={g.quarter} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="p-1.5 bg-rose-50 rounded-lg">
                      <Calendar className="w-4 h-4 text-rose-600" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{g.quarter}</p>
                      <p className="text-xs text-gray-500">{g.total} total departments</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-sm font-semibold ${g.new_depts > 0 ? "text-green-600" : "text-gray-400"}`}>{g.new_depts > 0 ? `+${g.new_depts}` : g.new_depts === 0 ? "0" : g.new_depts}</span>
                    <p className="text-[10px] text-gray-400">new</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Budget by Department</h2>
            <span className="text-xs text-gray-400">{records.length} departments</span>
          </div>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Budget</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilized</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Remaining</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilization</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {records.map((r, i) => (
                  <tr key={r.id ?? i} className="hover:bg-rose-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.budget}</td>
                    <td className="px-4 py-3 text-sm font-medium">{r.budget}</td>
                    <td className={`px-4 py-3 text-sm font-medium ${r.budget - r.budget < 0 ? "text-red-600" : "text-green-600"}`}>{r.budget - r.budget}</td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="w-20 bg-gray-100 rounded-full h-2">
                          <div className={`h-2 rounded-full ${Math.round((r.budget / r.budget) * 100) > 90 ? "bg-red-500" : Math.round((r.budget / r.budget) * 100) > 75 ? "bg-orange-500" : "bg-green-500"}`} style={{ width: `${Math.round((r.budget / r.budget) * 100)}%` }} />
                        </div>
                        <span className="text-xs text-gray-500">{Math.round((r.budget / r.budget) * 100)}%</span>
                      </div>
                    </td>
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
