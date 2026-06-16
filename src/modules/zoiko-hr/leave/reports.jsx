import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { FileText, Download, TrendingUp, Calendar, CheckCircle, XCircle } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getLeave } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/leave" },
  { label: "My Leave", href: "/zoiko-hr/leave/my-leave" },
  { label: "Requests", href: "/zoiko-hr/leave/requests" },
  { label: "Calendar", href: "/zoiko-hr/leave/calendar" },
  { label: "Leave Types", href: "/zoiko-hr/leave/leave-types" },
  { label: "Reports", href: "/zoiko-hr/leave/reports" },
  { label: "Settings", href: "/zoiko-hr/leave/settings" },
];

const typeColors = {
  annual: "bg-blue-500", sick: "bg-pink-500", casual: "bg-orange-500", earned: "bg-teal-500",
  maternity: "bg-purple-500", paternity: "bg-indigo-500", unpaid: "bg-gray-500", study: "bg-cyan-500", emergency: "bg-red-500",
};

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/leave"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, change, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && <div className="p-2 bg-teal-50 rounded-lg"><Icon className="w-5 h-5 text-teal-600" /></div>}
      </div>
    </div>
  );
}

export default function LeaveReports() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getLeave()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const reportData = useMemo(() => {
    const total = records.length;
    const approved = records.filter((r) => r.status === "approved").length;
    const rejected = records.filter((r) => r.status === "rejected").length;
    const pending = records.filter((r) => r.status === "pending").length;
    const totalDays = records.reduce((s, r) => s + (r.days || 0), 0);
    const approvalRate = total > 0 ? Math.round((approved / total) * 100) : 0;
    const avgDays = total > 0 ? (totalDays / total).toFixed(1) : "0";

    const deptMap = {};
    records.forEach((r) => {
      const dept = r.department || "Unknown";
      if (!deptMap[dept]) deptMap[dept] = { requests: 0, approved: 0, rejected: 0, pending: 0 };
      deptMap[dept].requests++;
      if (r.status === "approved") deptMap[dept].approved++;
      else if (r.status === "rejected") deptMap[dept].rejected++;
      else if (r.status === "pending") deptMap[dept].pending++;
    });
    const departmentBreakdown = Object.entries(deptMap).map(([dept, d]) => ({ dept, ...d }));

    const typeMap = {};
    records.forEach((r) => {
      const t = r.leave_type || "other";
      if (!typeMap[t]) typeMap[t] = 0;
      typeMap[t]++;
    });
    const typeDistribution = Object.entries(typeMap).map(([type, count]) => ({ type, count }));

    const monthlyMap = {};
    records.forEach((r) => {
      const month = r.start_date ? new Date(r.start_date).toLocaleString("en-US", { month: "short" }) : "N/A";
      if (!monthlyMap[month]) monthlyMap[month] = { requests: 0, approved: 0 };
      monthlyMap[month].requests++;
      if (r.status === "approved") monthlyMap[month].approved++;
    });
    const monthlyTrend = Object.entries(monthlyMap).map(([month, d]) => ({ month, ...d }));

    return { totalRequests: total, approvalRate, avgDays, rejected, departmentBreakdown, typeDistribution, monthlyTrend };
  }, [records]);

  const statCards = [
    { title: "Total Requests", value: reportData.totalRequests, icon: Calendar },
    { title: "Approval Rate", value: `${reportData.approvalRate}%`, icon: CheckCircle },
    { title: "Avg Days/Request", value: reportData.avgDays, icon: TrendingUp },
    { title: "Rejected", value: reportData.rejected, icon: XCircle },
  ];

  const maxMonthly = Math.max(...reportData.monthlyTrend.map((m) => m.requests), 1);
  const maxTypeCount = Math.max(...reportData.typeDistribution.map((t) => t.count), 1);

  if (loading) {
    return (
      <HRPage title="Leave Reports" subtitle="Analytics and insights on leave utilization">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-500">Loading reports...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Leave Reports" subtitle="Analytics and insights on leave utilization">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Reports</h1>
            <p className="text-sm text-gray-500 mt-1">Analytics and insights on leave utilization</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
            <Download className="w-4 h-4" /> Export Report
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h2>
            <div className="overflow-x-auto rounded-lg border border-gray-200">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requests</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Approved</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Rejected</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Pending</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {reportData.departmentBreakdown.map((d, i) => (
                    <tr key={d.dept + i} className="hover:bg-teal-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.dept}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{d.requests}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{d.approved}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{d.rejected}</td>
                      <td className="px-4 py-3 text-sm text-amber-600 font-medium">{d.pending}</td>
                    </tr>
                  ))}
                  {reportData.departmentBreakdown.length === 0 && (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-400 text-sm">No data available</td></tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h2>
            <div className="flex items-end gap-2 h-40">
              {reportData.monthlyTrend.map((m) => (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div className="w-full bg-green-400 rounded-t" style={{ height: `${(m.approved / maxMonthly) * 100}%`, minHeight: m.approved > 0 ? "4px" : "0" }} />
                    <div className="w-full bg-amber-400 rounded-t" style={{ height: `${((m.requests - m.approved) / maxMonthly) * 100}%`, minHeight: m.requests - m.approved > 0 ? "4px" : "0" }} />
                  </div>
                  <span className="text-xs text-gray-500">{m.month}</span>
                </div>
              ))}
            </div>
            <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Approved</span>
              <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-amber-400" /> Pending/Rejected</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Type Distribution</h2>
          <div className="space-y-3">
            {reportData.typeDistribution.map((t) => {
              const pct = (t.count / maxTypeCount) * 100;
              return (
                <div key={t.type} className="flex items-center gap-3">
                  <span className="text-sm text-gray-600 capitalize w-24">{t.type}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-5">
                    <div className={`h-5 rounded-full ${typeColors[t.type] || "bg-gray-400"} flex items-center justify-end px-2`}
                      style={{ width: `${Math.max(pct, 4)}%` }}>
                      <span className="text-[10px] text-white font-medium">{t.count}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </HRPage>
  );
}
