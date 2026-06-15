import { Clock, LogIn, LogOut, UserCheck, UserX, AlertTriangle, Luggage } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useMyAttendance } from "../hooks/useAttendance";
import { clockIn, clockOut } from "../services/attendanceService";
import { formatDate, formatTime, hoursWorked } from "../utils/helpers";
import { useState } from "react";

export default function MyAttendance() {
  const { data, loading } = useMyAttendance();
  const [clocking, setClocking] = useState(false);
  const [message, setMessage] = useState(null);

  if (loading) return <div className="p-6 text-gray-400">Loading attendance...</div>;

  const handleClockIn = async () => {
    setClocking(true);
    setMessage(null);
    const res = await clockIn();
    setMessage(res.message);
    setClocking(false);
  };

  const handleClockOut = async () => {
    setClocking(true);
    setMessage(null);
    const res = await clockOut();
    setMessage(res.message);
    setClocking(false);
  };

  const { today, summary, recentRecords } = data;

  const summaryCards = [
    { title: "Present", value: summary.present, icon: UserCheck, change: null, trend: null },
    { title: "Absent", value: summary.absent, icon: UserX, change: null, trend: null },
    { title: "Late", value: summary.late, icon: AlertTriangle, change: null, trend: null },
    { title: "WFH", value: summary.wfh, icon: Luggage, change: null, trend: null },
  ];

  const recordColumns = [
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "checkIn", label: "Check In", render: (v) => formatTime(v) },
    { key: "checkOut", label: "Check Out", render: (v) => formatTime(v) },
    { key: "hours", label: "Hours", render: (v) => <span className="font-mono">{v}h</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  return (
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
            <p className="text-3xl font-bold font-mono">{today.checkInTime ? formatTime(today.checkInTime) : "--"}</p>
            <p className="text-sm text-indigo-200 mt-1">
              {today.checkedIn ? (today.checkedOut ? "Clocked Out" : "Clocked In") : "Not Clocked In"}
            </p>
          </div>
          {today.checkedIn && today.checkInTime && (
            <div className="bg-white/20 rounded-lg p-4 w-full max-w-md text-center">
              <p className="text-sm text-indigo-100">Check In</p>
              <p className="font-bold">{formatTime(today.checkInTime)}</p>
              {today.checkOutTime && (
                <>
                  <p className="text-sm text-indigo-100 mt-2">Check Out</p>
                  <p className="font-bold">{formatTime(today.checkOutTime)}</p>
                </>
              )}
            </div>
          )}
          <div className="flex gap-4">
            <button
              onClick={handleClockIn}
              disabled={today.checkedIn || clocking}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                today.checkedIn ? "bg-white/20 cursor-not-allowed" : "bg-white text-indigo-700 hover:bg-gray-100"
              }`}
            >
              <LogIn className="w-4 h-4" /> {clocking ? "..." : "Clock In"}
            </button>
            <button
              onClick={handleClockOut}
              disabled={!today.checkedIn || today.checkedOut || clocking}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                !today.checkedIn || today.checkedOut ? "bg-white/20 cursor-not-allowed" : "bg-white text-indigo-700 hover:bg-gray-100"
              }`}
            >
              <LogOut className="w-4 h-4" /> {clocking ? "..." : "Clock Out"}
            </button>
          </div>
          <span className="text-xs text-indigo-200">Status: <StatusBadge status={today.status} /></span>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        {summaryCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Records</h2>
        <DataTable columns={recordColumns} data={recentRecords} />
      </div>
    </div>
  );
}
