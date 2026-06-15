import { Clock, CheckCircle2, XCircle, Coffee, AlertTriangle } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAttendance } from "../hooks/useEss";

export default function EssAttendance() {
  const { data, loading } = useAttendance();

  if (loading) return <div className="p-6 text-gray-400">Loading attendance data...</div>;
  if (!data) return <div className="p-6 text-gray-400">No attendance data available</div>;

  const weeklyColumns = [
    { key: "date", label: "Date", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "checkIn", label: "Check In", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "checkOut", label: "Check Out", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "hoursWorked", label: "Hours", render: (v) => <span className="font-semibold">{v}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const monthlyColumns = [
    { key: "date", label: "Date", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "checkIn", label: "Check In" },
    { key: "checkOut", label: "Check Out" },
    { key: "hoursWorked", label: "Hours", render: (v) => <span className="font-semibold">{v}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const statCards = data.monthlyStats ? [
    { title: "Present", value: data.monthlyStats.present, icon: CheckCircle2, change: null, trend: null },
    { title: "Late", value: data.monthlyStats.late, icon: AlertTriangle, change: null, trend: null },
    { title: "Absent", value: data.monthlyStats.absent, icon: XCircle, change: null, trend: null },
    { title: "On Leave", value: data.monthlyStats.onLeave, icon: Coffee, change: null, trend: null },
    { title: "Avg Hours", value: data.monthlyStats.avgHoursWorked, icon: Clock, change: null, trend: null },
  ] : [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance</h1>
        <p className="text-sm text-gray-500 mt-1">Track your time and attendance records</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Record</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-3 bg-blue-50 rounded-lg">
              <span className="text-sm text-gray-600">Status</span>
              <StatusBadge status={data.today.status} />
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Check In</span>
              <span className="text-sm font-bold text-gray-900">{data.today.checkIn}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Check Out</span>
              <span className="text-sm font-bold text-gray-900">{data.today.checkOut}</span>
            </div>
            <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <span className="text-sm text-gray-600">Hours Worked</span>
              <span className="text-sm font-bold text-blue-600">{data.today.hoursWorked}</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-2">
          {statCards.length > 0 && (
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {statCards.map((s) => (
                <div key={s.title} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
                  <p className="text-xs text-gray-500">{s.title}</p>
                  <p className="text-xl font-bold text-gray-900 mt-1">{s.value}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">This Week</h2>
        <DataTable columns={weeklyColumns} data={data.weekly} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Monthly Attendance</h2>
        <DataTable columns={monthlyColumns} data={data.monthly} />
      </div>
    </div>
  );
}
