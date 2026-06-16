import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Clock, LogIn, LogOut, UserCheck, UserX, AlertTriangle, Luggage } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getMyAttendance, createAttendance } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/attendance" },
  { label: "Daily Records", href: "/zoiko-hr/attendance/daily" },
  { label: "My Attendance", href: "/zoiko-hr/attendance/my-attendance" },
  { label: "Corrections", href: "/zoiko-hr/attendance/corrections" },
  { label: "Schedule", href: "/zoiko-hr/attendance/schedule" },
  { label: "Reports", href: "/zoiko-hr/attendance/reports" },
  { label: "Settings", href: "/zoiko-hr/attendance/settings" },
];

const STATUS_COLORS = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-orange-100 text-orange-800",
  on_leave: "bg-blue-100 text-blue-800",
  wfh: "bg-purple-100 text-purple-800",
  half_day: "bg-yellow-100 text-yellow-800",
  not_clocked: "bg-gray-100 text-gray-800",
};

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

function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function StatsCard({ title, value, icon: Icon, change, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && <div className="p-2 bg-indigo-50 rounded-lg"><Icon className="w-5 h-5 text-indigo-600" /></div>}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(timeStr) {
  if (!timeStr) return "-";
  const d = new Date(timeStr);
  return d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

const DEFAULT_SUMMARY = { present: 0, absent: 0, late: 0, wfh: 0 };

export default function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clocking, setClocking] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchRecords = async () => {
    try {
      const data = await getMyAttendance();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let mounted = true;
    getMyAttendance()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleClockIn = async () => {
    setClocking(true);
    setMessage(null);
    try {
      await createAttendance({ clock_in: new Date().toISOString(), status: "present" });
      setMessage("Clocked in successfully");
      await fetchRecords();
    } catch (err) {
      setMessage(err.message || "Failed to clock in");
    } finally {
      setClocking(false);
    }
  };

  const handleClockOut = async () => {
    setClocking(true);
    setMessage(null);
    try {
      await createAttendance({ clock_out: new Date().toISOString() });
      setMessage("Clocked out successfully");
      await fetchRecords();
    } catch (err) {
      setMessage(err.message || "Failed to clock out");
    } finally {
      setClocking(false);
    }
  };

  const today = records.find((r) => {
    const todayStr = new Date().toISOString().split("T")[0];
    return (r.work_date || r.date || "").startsWith(todayStr);
  }) || {};

  const summary = { present: 0, absent: 0, late: 0, wfh: 0 };
  records.forEach((r) => {
    if (r.status === "present" || r.status === "on_time") summary.present++;
    else if (r.status === "absent") summary.absent++;
    else if (r.status === "late") summary.late++;
    else if (r.status === "wfh" || r.status === "remote") summary.wfh++;
  });

  const summaryCards = [
    { title: "Present", value: summary.present, icon: UserCheck },
    { title: "Absent", value: summary.absent, icon: UserX },
    { title: "Late", value: summary.late, icon: AlertTriangle },
    { title: "WFH", value: summary.wfh, icon: Luggage },
  ];

  const recentRecords = records.slice(-10).reverse();

  if (loading) {
    return (
      <HRPage title="My Attendance" subtitle="Your personal attendance records">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading attendance...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="My Attendance" subtitle="Your personal attendance records">
      <SubNav />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Attendance</h1>
          <p className="text-sm text-gray-500 mt-1">Your personal attendance records</p>
        </div>

        {message && (
          <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">{message}</div>
        )}

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <Clock className="w-8 h-8 mx-auto mb-2 text-indigo-200" />
              <p className="text-3xl font-bold font-mono">{today.clock_in ? formatTime(today.clock_in) : "--"}</p>
              <p className="text-sm text-indigo-200 mt-1">
                {today.clock_in ? (today.clock_out ? "Clocked Out" : "Clocked In") : "Not Clocked In"}
              </p>
            </div>
            {today.clock_in && (
              <div className="bg-white/20 rounded-lg p-4 w-full max-w-md text-center">
                <p className="text-sm text-indigo-100">Check In</p>
                <p className="font-bold">{formatTime(today.clock_in)}</p>
                {today.clock_out && (
                  <>
                    <p className="text-sm text-indigo-100 mt-2">Check Out</p>
                    <p className="font-bold">{formatTime(today.clock_out)}</p>
                  </>
                )}
              </div>
            )}
            <div className="flex gap-4">
              <button onClick={handleClockIn}
                disabled={today.clock_in || clocking}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  today.clock_in ? "bg-white/20 cursor-not-allowed" : "bg-white text-indigo-700 hover:bg-gray-100"
                }`}>
                <LogIn className="w-4 h-4" /> {clocking ? "..." : "Clock In"}
              </button>
              <button onClick={handleClockOut}
                disabled={!today.clock_in || today.clock_out || clocking}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  !today.clock_in || today.clock_out ? "bg-white/20 cursor-not-allowed" : "bg-white text-indigo-700 hover:bg-gray-100"
                }`}>
                <LogOut className="w-4 h-4" /> {clocking ? "..." : "Clock Out"}
              </button>
            </div>
            <span className="text-xs text-indigo-200">Status: <StatusBadge status={today.status || "not_clocked"} /></span>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {summaryCards.map((s) => <StatsCard key={s.title} {...s} />)}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Records</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check In</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Check Out</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentRecords.map((r, i) => (
                  <tr key={r.id ?? i} className="hover:bg-indigo-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.work_date || r.date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatTime(r.clock_in)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatTime(r.clock_out)}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={4} className="px-4 py-12 text-center text-gray-400 text-sm">No records found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
