import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { FileText, Download, TrendingUp, Users, Building2, CircleDollarSign } from "lucide-react";
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

  const summaries = useMemo(() => {
    const totalAllocated = records.reduce((sum, r) => sum + (Number(r.budget) || 0), 0);
    const totalSpent = records.reduce((sum, r) => sum + (Number(r.spent_budget) || 0), 0);
    const totalEmployees = records.reduce((sum, r) => sum + (Number(r.employee_count) || 0), 0);
    return { totalAllocated, totalSpent, totalEmployees };
  }, [records]);

  return (
    <HRPage title="Reports" subtitle="Analyze fiscal statements and headcounts">
      <SubNav />

      {/* Overview Sheets Blocks */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-6">
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-blue-50 rounded-lg text-blue-600"><CircleDollarSign size={20} /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Envelope Budget</p>
            <h3 className="text-xl font-bold text-gray-800">${summaries.totalAllocated.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-emerald-50 rounded-lg text-emerald-600"><TrendingUp size={20} /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Spent Utilization</p>
            <h3 className="text-xl font-bold text-gray-800">${summaries.totalSpent.toLocaleString()}</h3>
          </div>
        </div>
        <div className="bg-white p-5 rounded-xl border border-gray-100 shadow-sm flex items-center gap-4">
          <div className="p-3 bg-rose-50 rounded-lg text-rose-600"><Users size={20} /></div>
          <div>
            <p className="text-xs text-gray-400 font-medium">Total Headcount Staff</p>
            <h3 className="text-xl font-bold text-gray-800">{summaries.totalEmployees}</h3>
          </div>
        </div>
      </div>

      {/* Main Report Table Container */}
      <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-5 border-b border-gray-100 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 bg-gray-50/40">
          <div className="flex items-center gap-2">
            <FileText size={18} className="text-rose-600" />
            <div>
              <h3 className="text-sm font-bold text-gray-800">Budget Execution Breakdown</h3>
              <p className="text-xs text-gray-400">Department metrics alignment report matrix</p>
            </div>
          </div>
          <button className="flex items-center gap-2 text-xs font-semibold text-gray-600 bg-white border border-gray-200 px-3 py-2 rounded-lg hover:bg-gray-50 shadow-sm transition-colors">
            <Download size={14} /> Export CSV Matrix
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-gray-50 border-b border-gray-100">
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Department Title</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Allocated Limit</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Spent Funds</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Variance Balance</th>
                <th className="px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wider">Utilization Scale</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {isLoading ? (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-gray-400">Loading sheets matrix metrics...</td></tr>
              ) : records.length === 0 ? (
                <tr><td colSpan={5} className="text-center py-8 text-sm text-gray-400">No organizational data logs found.</td></tr>
              ) : (
                records.map((r, i) => {
                  const allocated = Number(r.budget) || 0;
                  const spent = Number(r.spent_budget) || 0;
                  const variance = allocated - spent;
                  const ratio = allocated > 0 ? Math.min(Math.round((spent / allocated) * 100), 100) : 0;

                  return (
                    <tr key={r.id ?? i} className="hover:bg-rose-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.name}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">${allocated.toLocaleString()}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">${spent.toLocaleString()}</td>
                      <td className={`px-4 py-3 text-sm font-semibold ${variance < 0 ? "text-red-600" : "text-green-600"}`}>
                        ${variance.toLocaleString()}
                      </td>
                      <td className="px-4 py-3 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-20 bg-gray-100 rounded-full h-2 overflow-hidden">
                            <div 
                              className={`h-full rounded-full ${ratio > 90 ? "bg-red-500" : ratio > 75 ? "bg-orange-500" : "bg-green-500"}`} 
                              style={{ width: `${ratio}%` }}
                            ></div>
                          </div>
                          <span className="text-xs font-bold text-gray-500">{ratio}%</span>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}