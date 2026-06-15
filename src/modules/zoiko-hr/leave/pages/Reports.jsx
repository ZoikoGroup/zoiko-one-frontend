import { useState } from "react";
import { FileText, Download, TrendingUp, Calendar, CheckCircle, XCircle } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import { useLeaveReports } from "../hooks/useLeave";

const typeColors = {
  annual: "bg-blue-500", sick: "bg-pink-500", casual: "bg-orange-500", earned: "bg-teal-500",
  maternity: "bg-purple-500", paternity: "bg-indigo-500", unpaid: "bg-gray-500", study: "bg-cyan-500", emergency: "bg-red-500",
};

export default function LeaveReports() {
  const { data, loading } = useLeaveReports();
  const [search, setSearch] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading reports...</div>;

  const { total_requests, approval_rate, avg_days, department_breakdown, monthly_trend, type_distribution } = data;

  const statCards = [
    { title: "Total Requests", value: total_requests, icon: Calendar, change: null, trend: null },
    { title: "Approval Rate", value: `${approval_rate}%`, icon: CheckCircle, change: null, trend: null },
    { title: "Avg Days/Request", value: avg_days, icon: TrendingUp, change: null, trend: null },
    { title: "Rejected", value: department_breakdown.reduce((s, d) => s + d.rejected, 0), icon: XCircle, change: null, trend: null },
  ];

  const deptColumns = [
    { key: "dept", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "requests", label: "Requests" },
    { key: "approved", label: "Approved", render: (v) => <span className="text-green-600 font-medium">{v}</span> },
    { key: "rejected", label: "Rejected", render: (v) => <span className="text-red-600 font-medium">{v}</span> },
    { key: "pending", label: "Pending", render: (v) => <span className="text-amber-600 font-medium">{v}</span> },
  ];

  const maxMonthlyRequests = Math.max(...monthly_trend.map((m) => m.requests), 1);

  const maxTypeCount = Math.max(...type_distribution.map((t) => t.count), 1);

  return (
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
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Department Breakdown</h2>
          <DataTable columns={deptColumns} data={department_breakdown} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Trend</h2>
          <div className="flex items-end gap-2 h-40">
            {monthly_trend.map((m) => {
              const pct = (m.requests / maxMonthlyRequests) * 100;
              return (
                <div key={m.month} className="flex-1 flex flex-col items-center gap-1">
                  <div className="w-full flex flex-col items-center justify-end h-full">
                    <div className="w-full bg-green-400 rounded-t" style={{ height: `${(m.approved / maxMonthlyRequests) * 100}%`, minHeight: m.approved > 0 ? "4px" : "0" }} />
                    <div className="w-full bg-amber-400 rounded-t" style={{ height: `${((m.requests - m.approved) / maxMonthlyRequests) * 100}%`, minHeight: m.requests - m.approved > 0 ? "4px" : "0" }} />
                  </div>
                  <span className="text-xs text-gray-500">{m.month}</span>
                </div>
              );
            })}
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
          {type_distribution.map((t) => {
            const pct = (t.count / maxTypeCount) * 100;
            return (
              <div key={t.type} className="flex items-center gap-3">
                <span className="text-sm text-gray-600 capitalize w-24">{t.type}</span>
                <div className="flex-1 bg-gray-100 rounded-full h-5">
                  <div
                    className={`h-5 rounded-full ${typeColors[t.type] || "bg-gray-400"} flex items-center justify-end px-2`}
                    style={{ width: `${Math.max(pct, 4)}%` }}
                  >
                    <span className="text-[10px] text-white font-medium">{t.count}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
