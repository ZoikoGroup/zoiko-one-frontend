import { Calendar, Clock, CheckCircle, XCircle, CalendarDays, TrendingUp, Users, Briefcase, Home } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useLeaveDashboard } from "../hooks/useLeave";
import { formatDate, daysBetween } from "../utils/helpers";

export default function LeaveDashboard() {
  const { data, loading } = useLeaveDashboard();

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { stats, balances, upcomingLeave, teamOverview } = data;
  const approvalRate = stats.total > 0 ? Math.round((stats.approved / stats.total) * 100) : 0;

  const statCards = [
    { title: "Total Requests", value: stats.total, icon: Calendar, change: 12, trend: "up" },
    { title: "Pending", value: stats.pending, icon: Clock, change: -5, trend: "down" },
    { title: "Approved", value: stats.approved, icon: CheckCircle, change: 8, trend: "up" },
    { title: "Rejected", value: stats.rejected, icon: XCircle, change: 2, trend: "up" },
    { title: "Total Days", value: stats.totalDays, icon: CalendarDays, change: null, trend: null },
    { title: "Approval Rate", value: `${approvalRate}%`, icon: TrendingUp, change: 3, trend: "up" },
  ];

  const upcomingColumns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "type", label: "Type", render: (v) => <span className="capitalize">{v}</span> },
    { key: "start", label: "Start", render: (v) => formatDate(v) },
    { key: "end", label: "End", render: (v) => formatDate(v) },
    { key: "days", label: "Days" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const typeIcons = {
    annual: Calendar, sick: Clock, casual: CalendarDays, earned: TrendingUp,
    maternity: Users, paternity: Users, unpaid: Briefcase, study: Clock, emergency: XCircle,
  };

  const typeColors = {
    annual: "bg-blue-500", sick: "bg-pink-500", casual: "bg-orange-500", earned: "bg-teal-500",
    maternity: "bg-purple-500", paternity: "bg-indigo-500", unpaid: "bg-gray-500", study: "bg-cyan-500", emergency: "bg-red-500",
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Leave Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Leave overview, balances, and team availability</p>
      </div>

      <div className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-teal-100 text-sm font-medium">Team Overview</p>
            <p className="text-4xl font-bold font-mono mt-1">{teamOverview.working}/{teamOverview.total}</p>
            <p className="text-teal-100 mt-1">employees currently working</p>
          </div>
          <div className="text-right space-y-1">
            <p className="text-teal-100 text-sm flex items-center gap-1 justify-end"><Users className="w-3 h-3" /> {teamOverview.onLeave} on leave</p>
            <p className="text-teal-100 text-sm flex items-center gap-1 justify-end"><Home className="w-3 h-3" /> {teamOverview.wfh} WFH</p>
            <p className="text-teal-100 text-sm flex items-center gap-1 justify-end"><Clock className="w-3 h-3" /> {teamOverview.pending} pending requests</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Balances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {balances.map((b) => {
            const Icon = typeIcons[b.type] || Calendar;
            const pct = b.total > 0 ? Math.round((b.used / b.total) * 100) : 0;
            return (
              <div key={b.type} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className={`p-1.5 rounded ${typeColors[b.type]} bg-opacity-20`}>
                      <Icon className={`w-4 h-4 ${typeColors[b.type].replace("bg-", "text-")}`} />
                    </div>
                    <span className="text-sm font-medium text-gray-900 capitalize">{b.type}</span>
                  </div>
                  <span className="text-xs text-gray-400">{b.used}/{b.total} used</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${typeColors[b.type]} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{b.remaining} days remaining</p>
              </div>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Upcoming Leave</h2>
          <DataTable columns={upcomingColumns} data={upcomingLeave} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Team Availability</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Working</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(teamOverview.working / teamOverview.total) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{teamOverview.working}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On Leave</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="bg-blue-500 h-2 rounded-full" style={{ width: `${(teamOverview.onLeave / teamOverview.total) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{teamOverview.onLeave}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">WFH</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="bg-purple-500 h-2 rounded-full" style={{ width: `${(teamOverview.wfh / teamOverview.total) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{teamOverview.wfh}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Pending Requests</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="bg-amber-500 h-2 rounded-full" style={{ width: `${(teamOverview.pending / teamOverview.total) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{teamOverview.pending}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
