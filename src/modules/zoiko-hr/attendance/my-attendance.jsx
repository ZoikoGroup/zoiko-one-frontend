import { useState, useEffect } from "react";
import { Clock, LogIn, LogOut, UserCheck, UserX, AlertTriangle, Luggage, Home, Calendar } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getMyAttendance, clockIn, clockOut } from "../../../service/hrService";



const STATUS_COLORS = {
  present: "bg-green-100 text-green-800",
  absent: "bg-red-100 text-red-800",
  late: "bg-orange-100 text-orange-800",
  on_leave: "bg-blue-100 text-blue-800",
  remote: "bg-purple-100 text-purple-800",
  half_day: "bg-yellow-100 text-yellow-800",
  not_clocked: "bg-gray-100 text-gray-800",
};



function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
      {status.replace(/_/g, " ")}
    </span>
  );
}

function StatsCard({ title, value, icon: Icon }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-indigo-50 flex items-center justify-center">
          <Icon size={20} className="text-indigo-600" />
        </div>
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function formatTime(timeStr) {
  if (!timeStr) return "-";
  return new Date(timeStr).toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" });
}

export default function MyAttendance() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [clocking, setClocking] = useState(false);
  const [message, setMessage] = useState(null);

  const fetchRecords = async () => {
    try {
      const data = await getMyAttendance();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load records");
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
      await clockIn({ clock_in: new Date().toISOString() });
      setMessage({ type: "success", text: "Clocked in successfully" });
      await fetchRecords();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to clock in" });
    } finally {
      setClocking(false);
    }
  };

  const handleClockOut = async () => {
    setClocking(true);
    setMessage(null);
    try {
      const todayRecord = records.find((r) => {
        const todayStr = new Date().toISOString().split("T")[0];
        return (r.work_date || r.date || "").startsWith(todayStr) && r.clock_in && !r.clock_out;
      });
      if (todayRecord) {
        await clockOut(todayRecord.id, { clock_out: new Date().toISOString() });
      }
      setMessage({ type: "success", text: "Clocked out successfully" });
      await fetchRecords();
    } catch (err) {
      setMessage({ type: "error", text: err.message || "Failed to clock out" });
    } finally {
      setClocking(false);
    }
  };

  const todayRecord = records.find((r) => {
    const todayStr = new Date().toISOString().split("T")[0];
    return (r.work_date || r.date || "").startsWith(todayStr);
  }) || {};

  const summary = { present: 0, absent: 0, late: 0, remote: 0 };
  records.forEach((r) => {
    if (r.status === "present") summary.present++;
    else if (r.status === "absent") summary.absent++;
    else if (r.status === "late") summary.late++;
    else if (r.status === "remote" || r.status === "wfh") summary.remote++;
  });

  const totalDays = records.length || 1;
  const attendanceRate = Math.round(((summary.present + summary.remote) / totalDays) * 100);

  const summaryCards = [
    { title: "Present", value: summary.present, icon: UserCheck },
    { title: "Absent", value: summary.absent, icon: UserX },
    { title: "Late", value: summary.late, icon: AlertTriangle },
    { title: "Remote/WFH", value: summary.remote, icon: Home },
    { title: "Attendance Rate", value: attendanceRate + "%", icon: Calendar },
  ];

  const recentRecords = records.slice(-10).reverse();

  if (loading) {
    return (
      <HRPage title="My Attendance" subtitle="Your personal attendance records and clock in/out">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-500">Loading attendance...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="My Attendance" subtitle="Your personal attendance records and clock in/out">
            <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{typeof error === 'object' ? JSON.stringify(error) : String(error)}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        {message && (
           <div className={`px-4 py-3 rounded-lg text-sm ${message.type === 'error' ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700'}`}>
            {typeof message.text === 'object' ? JSON.stringify(message.text) : String(message.text)}
          </div>
        )}

        <div className="bg-gradient-to-r from-indigo-600 to-indigo-700 rounded-xl shadow-lg p-6 text-white">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <Clock className="w-10 h-10 mx-auto mb-2 text-indigo-200" />
              <p className="text-4xl font-bold font-mono">{todayRecord.clock_in ? formatTime(todayRecord.clock_in) : "--"}</p>
              <p className="text-sm text-indigo-200 mt-1">
                {todayRecord.clock_in ? (todayRecord.clock_out ? "Clocked Out" : "Currently Clocked In") : "Not Clocked In"}
              </p>
            </div>
            <div className="bg-white/20 rounded-lg p-4 w-full max-w-md">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-xs text-indigo-100">Date</p>
                  <p className="font-semibold">{new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>
                </div>
                <div>
                  <p className="text-xs text-indigo-100">Status</p>
                  <StatusBadge status={todayRecord.status || "not_clocked"} />
                </div>
                {todayRecord.clock_in && (
                  <>
                    <div>
                      <p className="text-xs text-indigo-100">Check In</p>
                      <p className="font-semibold">{formatTime(todayRecord.clock_in)}</p>
                    </div>
                    <div>
                      <p className="text-xs text-indigo-100">Check Out</p>
                      <p className="font-semibold">{formatTime(todayRecord.clock_out)}</p>
                    </div>
                  </>
                )}
              </div>
            </div>
            <div className="flex gap-4">
              <button onClick={handleClockIn}
                disabled={todayRecord.clock_in || clocking}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-gray-400">
                <LogIn className="w-4 h-4" /> {clocking ? "Processing..." : "Clock In"}
              </button>
              <button onClick={handleClockOut}
                disabled={!todayRecord.clock_in || todayRecord.clock_out || clocking}
                className="flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition bg-orange-600 text-white hover:bg-orange-700 disabled:bg-gray-400">
                <LogOut className="w-4 h-4" /> {clocking ? "Processing..." : "Clock Out"}
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
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
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {recentRecords.map((r, i) => {
                  const hours = r.clock_in && r.clock_out
                    ? ((new Date(r.clock_out) - new Date(r.clock_in)) / 3600000).toFixed(1)
                    : "-";
                  return (
                    <tr key={r.id ?? i} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.work_date || r.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatTime(r.clock_in)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatTime(r.clock_out)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{hours}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                    </tr>
                  );
                })}
                {recentRecords.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-4 py-12 text-center text-gray-400 text-sm">No attendance records found</td>
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

