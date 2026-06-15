import { useState, useEffect } from "react";
import { Clock, Users, UserCheck, UserX, AlertTriangle, Luggage, Home, Building2 } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useAttendanceDashboard } from "../hooks/useAttendance";

export default function AttendanceDashboard() {
  const { data, loading } = useAttendanceDashboard();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { stats, todaySummary, weeklyTrend, departmentStats } = data;

  const statCards = [
    { title: "Present Today", value: stats.present, icon: UserCheck, change: 5, trend: "up" },
    { title: "Absent", value: stats.absent, icon: UserX, change: -2, trend: "down" },
    { title: "Late Arrivals", value: stats.late, icon: AlertTriangle, change: 1, trend: "up" },
    { title: "On Leave", value: stats.onLeave, icon: Luggage, change: 0, trend: "flat" },
    { title: "Work From Home", value: stats.wfh, icon: Home, change: 3, trend: "up" },
    { title: "Total Employees", value: stats.totalEmployees, icon: Users, change: null, trend: null },
  ];

  const deptColumns = [
    { key: "dept", label: "Department", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "present", label: "Present", render: (v) => <span className="text-green-600 font-medium">{v}</span> },
    { key: "absent", label: "Absent", render: (v) => <span className="text-red-600 font-medium">{v}</span> },
    { key: "late", label: "Late", render: (v) => <span className="text-orange-600 font-medium">{v}</span> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Attendance Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Live attendance overview and statistics</p>
      </div>

      <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-indigo-100 text-sm font-medium">Current Time</p>
            <p className="text-4xl font-bold font-mono mt-1">{currentTime.toLocaleTimeString()}</p>
            <p className="text-indigo-100 mt-1">{currentTime.toLocaleDateString("en-US", { weekday: "long", year: "numeric", month: "long", day: "numeric" })}</p>
          </div>
          <div className="text-right">
            <p className="text-indigo-100 text-sm">Today's Check-ins</p>
            <p className="text-3xl font-bold">{todaySummary.checkIns}</p>
            <p className="text-indigo-100 text-sm mt-1">{todaySummary.onTime} on time · {todaySummary.late} late</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weekly Trend</h2>
          <div className="flex items-end gap-3 h-40">
            {weeklyTrend.map((d) => {
              const maxVal = Math.max(...weeklyTrend.map((x) => x.present + x.absent));
              const total = d.present + d.absent;
              const pct = (total / maxVal) * 100;
              return (
                <div key={d.day} className="flex-1 flex flex-col items-center gap-2">
                  <div className="flex gap-0.5 w-full h-full items-end">
                    <div className="flex-1 bg-green-400 rounded-t" style={{ height: `${(d.present / total) * Math.max(pct, 4)}%` }} />
                    <div className="flex-1 bg-red-400 rounded-t" style={{ height: `${(d.absent / total) * Math.max(pct, 4)}%` }} />
                  </div>
                  <span className="text-xs text-gray-500">{d.day}</span>
                </div>
              );
            })}
          </div>
          <div className="flex items-center gap-4 mt-3 text-xs text-gray-500">
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-green-400" /> Present</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-full bg-red-400" /> Absent</span>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Today's Breakdown</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">On Time</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(todaySummary.onTime / todaySummary.checkIns) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{todaySummary.onTime}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Late</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(todaySummary.late / todaySummary.checkIns) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{todaySummary.late}</span>
              </div>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">Absent</span>
              <div className="flex items-center gap-2">
                <div className="w-32 bg-gray-100 rounded-full h-2">
                  <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(todaySummary.absent / stats.totalEmployees) * 100}%` }} />
                </div>
                <span className="text-sm font-medium text-gray-900">{todaySummary.absent}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Department Statistics</h2>
          <span className="text-xs text-indigo-600 font-medium">View all</span>
        </div>
        <DataTable columns={deptColumns} data={departmentStats} />
      </div>
    </div>
  );
}
