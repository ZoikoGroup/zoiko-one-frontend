import { CalendarDays, ClipboardList, UserCheck, Clock, FileText, ArrowRight } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useEssDashboard } from "../hooks/useEss";
import { formatDate } from "../utils/helpers";

export default function EssDashboard() {
  const { data, loading } = useEssDashboard();

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;
  if (!data) return <div className="p-6 text-gray-400">No data available</div>;

  const statCards = [
    { title: "Leave Balance", value: `${data.totalLeaveBalance} days`, icon: CalendarDays, change: 0, trend: "neutral" },
    { title: "Pending Requests", value: data.pendingRequests, icon: ClipboardList, change: 2, trend: "up" },
    { title: "Pending Approvals", value: data.pendingApprovals, icon: UserCheck, change: -1, trend: "down" },
    { title: "Today's Attendance", value: data.attendanceToday.status, icon: Clock, change: null, trend: null },
    { title: "Upcoming Events", value: data.upcomingEvents.length, icon: FileText, change: null, trend: null },
  ];

  const requestColumns = [
    { key: "type", label: "Type", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "description", label: "Description", render: (v) => <span className="text-gray-500 truncate max-w-[200px] block">{v}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "date", label: "Date", render: (v) => <span className="text-gray-400 text-xs">{formatDate(v)}</span> },
  ];

  const eventColumns = [
    { key: "title", label: "Event", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "time", label: "Time", render: (v) => <span className="text-gray-500">{v}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">ESS Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of your employee self-service portal</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Leave Balance Summary</h2>
            <span className="text-xs text-blue-600 font-medium">View all</span>
          </div>
          <div className="space-y-3">
            {Object.entries(data.summary).map(([key, val]) => (
              <div key={key} className="flex items-center justify-between py-2">
                <span className="text-sm capitalize text-gray-700 font-medium">{key}</span>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div
                      className="bg-blue-500 h-2 rounded-full"
                      style={{ width: `${(val.used / val.total) * 100}%` }}
                    />
                  </div>
                  <span className="text-xs text-gray-500 w-16 text-right">{val.remaining}/{val.total}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Today's Attendance</h2>
            <StatusBadge status={data.attendanceToday.status} />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Check In</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{data.attendanceToday.checkIn}</p>
            </div>
            <div className="bg-blue-50 rounded-lg p-3">
              <p className="text-xs text-gray-500">Check Out</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{data.attendanceToday.checkOut}</p>
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-3">Hours worked: <span className="font-medium text-gray-900">{data.attendanceToday.hoursWorked}</span></p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Recent Requests</h2>
            <span className="text-xs text-blue-600 font-medium">View all</span>
          </div>
          <DataTable columns={requestColumns} data={data.recentRequests.slice(0, 4)} />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Upcoming Events</h2>
            <span className="text-xs text-blue-600 font-medium">View all</span>
          </div>
          <DataTable columns={eventColumns} data={data.upcomingEvents} />
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Quick Links</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {data.quickLinks.map((link) => (
            <div key={link.label} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-blue-50 cursor-pointer transition-colors">
              <span className="text-sm font-medium text-gray-700">{link.label}</span>
              <ArrowRight className="w-4 h-4 text-blue-500" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
