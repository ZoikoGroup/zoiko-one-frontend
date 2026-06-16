import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Clock, Users, UserCheck, UserX, AlertTriangle, Luggage, Home, TrendingUp, Minus, TrendingDown } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getAttendance } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/attendance" },
  { label: "Daily Records", href: "/zoiko-hr/attendance/daily" },
  { label: "My Attendance", href: "/zoiko-hr/attendance/my-attendance" },
  { label: "Corrections", href: "/zoiko-hr/attendance/corrections" },
  { label: "Schedule", href: "/zoiko-hr/attendance/schedule" },
  { label: "Reports", href: "/zoiko-hr/attendance/reports" },
  { label: "Settings", href: "/zoiko-hr/attendance/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/attendance"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
        {Icon && <div className="p-2 bg-indigo-50 rounded-lg"><Icon className="w-5 h-5 text-indigo-600" /></div>}
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

export default function AttendanceDashboard() {
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
        const data = await getAttendance();
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
    const present = records.filter((r) => r.status === "present").length;
    const absent = records.filter((r) => r.status === "absent").length;
    const late = records.filter((r) => r.status === "late").length;
    const onLeave = records.filter((r) => r.status === "on_leave").length;
    const wfh = records.filter((r) => r.status === "wfh" || r.status === "remote").length;
    return { present, absent, late, onLeave, wfh, totalEmployees: total || 50 };
  }, [records]);

  const todaySummary = { checkIns: stats.present, onTime: Math.round(stats.present * 0.8), late: stats.late, absent: stats.absent };

  const weeklyTrend = [
    { day: "Mon", present: 42, absent: 8 },
    { day: "Tue", present: 45, absent: 5 },
    { day: "Wed", present: 40, absent: 10 },
    { day: "Thu", present: 43, absent: 7 },
    { day: "Fri", present: 38, absent: 12 },
  ];

  const departmentStats = useMemo(() => {
    const depts = {};
    records.forEach((r) => {
      const dept = r.department || "Unknown";
      if (!depts[dept]) depts[dept] = { present: 0, absent: 0, late: 0 };
      if (r.status === "present") depts[dept].present++;
      else if (r.status === "absent") depts[dept].absent++;
      else if (r.status === "late") depts[dept].late++;
    });
    return Object.entries(depts).map(([dept, data]) => ({ dept, ...data }));
  }, [records]);

  const statCards = [
    { title: "Present Today", value: stats.present, icon: UserCheck, change: 5, trend: "up" },
    { title: "Absent", value: stats.absent, icon: UserX, change: -2, trend: "down" },
    { title: "Late Arrivals", value: stats.late, icon: AlertTriangle, change: 1, trend: "up" },
    { title: "On Leave", value: stats.onLeave, icon: Luggage, change: 0, trend: "flat" },
    { title: "Work From Home", value: stats.wfh, icon: Home, change: 3, trend: "up" },
    { title: "Total Employees", value: stats.totalEmployees, icon: Users, change: null, trend: null },
  ];

  if (loading) {
    return (
      <HRPage title="Attendance Dashboard" subtitle="Live attendance overview and statistics">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading dashboard...</span>
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="Attendance Dashboard" subtitle="Live attendance overview and statistics">
        <SubNav />
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">Error: {error}</div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Attendance Dashboard" subtitle="Live attendance overview and statistics">
      <SubNav />
      <div className="space-y-6">
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
          {statCards.map((s) => <StatCard key={s.title} {...s} />)}
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
                    <div className="bg-green-500 h-2 rounded-full" style={{ width: `${(todaySummary.onTime / Math.max(todaySummary.checkIns, 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{todaySummary.onTime}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Late</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div className="bg-orange-500 h-2 rounded-full" style={{ width: `${(todaySummary.late / Math.max(todaySummary.checkIns, 1)) * 100}%` }} />
                  </div>
                  <span className="text-sm font-medium text-gray-900">{todaySummary.late}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Absent</span>
                <div className="flex items-center gap-2">
                  <div className="w-32 bg-gray-100 rounded-full h-2">
                    <div className="bg-red-500 h-2 rounded-full" style={{ width: `${(todaySummary.absent / Math.max(stats.totalEmployees, 1)) * 100}%` }} />
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
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Present</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Absent</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Late</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {departmentStats.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-4 py-8 text-center text-gray-400 text-sm">No department data available</td>
                  </tr>
                ) : (
                  departmentStats.map((d, i) => (
                    <tr key={d.dept + i} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{d.dept}</td>
                      <td className="px-4 py-3 text-sm text-green-600 font-medium">{d.present}</td>
                      <td className="px-4 py-3 text-sm text-red-600 font-medium">{d.absent}</td>
                      <td className="px-4 py-3 text-sm text-orange-600 font-medium">{d.late}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
