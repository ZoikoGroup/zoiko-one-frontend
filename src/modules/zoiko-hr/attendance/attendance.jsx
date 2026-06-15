import { useState, useEffect } from "react";
import {
  Clock,
  LogIn,
  LogOut,
  CheckCircle,
  AlertCircle,
  XCircle,
} from "lucide-react";

const statusConfig = {
  Present: {
    icon: CheckCircle,
    color: "text-green-600",
    bg: "bg-green-100",
  },
  Late: {
    icon: AlertCircle,
    color: "text-orange-600",
    bg: "bg-orange-100",
  },
  Absent: {
    icon: XCircle,
    color: "text-red-600",
    bg: "bg-red-100",
  },
};

export default function ZoikoHRAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [clockedIn, setClockedIn] = useState(false);
  const [todayEntry, setTodayEntry] = useState(null);

  const [attendance] = useState([
    {
      id: 1,
      date: "2026-06-01",
      checkInTime: "09:00 AM",
      checkOutTime: "06:00 PM",
      totalHours: "9.0",
      status: "Present",
    },
    {
      id: 2,
      date: "2026-06-02",
      checkInTime: "09:25 AM",
      checkOutTime: "06:10 PM",
      totalHours: "8.75",
      status: "Late",
    },
    {
      id: 3,
      date: "2026-06-03",
      checkInTime: "--",
      checkOutTime: "--",
      totalHours: "--",
      status: "Absent",
    },
  ]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleClockIn = () => {
    const now = new Date();

    setTodayEntry({
      checkInTime: now.toLocaleTimeString(),
      date: now.toISOString().split("T")[0],
    });

    setClockedIn(true);
  };

  const handleClockOut = () => {
    const now = new Date();

    setTodayEntry((prev) => ({
      ...prev,
      checkOutTime: now.toLocaleTimeString(),
      totalHours: "8.00",
    }));

    setClockedIn(false);
  };

  const getStatusBadge = (status) => {
    const Config = statusConfig[status];
    const Icon = Config.icon;

    return (
      <div
        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${Config.bg}`}
      >
        <Icon size={16} className={Config.color} />
        <span className={`text-sm font-medium ${Config.color}`}>
          {status}
        </span>
      </div>
    );
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold text-gray-900">
          Attendance Tracking
        </h1>
        <p className="text-gray-600 mt-1">
          Track your daily attendance and work hours
        </p>
      </div>

      {/* Clock Widget */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
        <div className="flex flex-col items-center gap-6">
          <Clock size={48} />

          <div className="text-center">
            <h2 className="text-lg font-medium text-blue-100">
              Current Time
            </h2>

            <div className="font-mono text-6xl font-bold mt-2">
              {currentTime.toLocaleTimeString()}
            </div>

            <div className="mt-2 text-blue-100">
              {currentTime.toLocaleDateString()}
            </div>
          </div>

          {todayEntry && (
            <div className="bg-white/20 rounded-lg p-4 w-full max-w-md">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div>
                  <p className="text-sm text-blue-100">Check-In</p>
                  <p className="font-bold text-xl">
                    {todayEntry.checkInTime || "--"}
                  </p>
                </div>

                <div>
                  <p className="text-sm text-blue-100">Check-Out</p>
                  <p className="font-bold text-xl">
                    {todayEntry.checkOutTime || "--"}
                  </p>
                </div>
              </div>

              {todayEntry.totalHours && (
                <div className="mt-4 text-center">
                  <p className="text-sm text-blue-100">Total Hours</p>
                  <p className="font-bold text-xl">
                    {todayEntry.totalHours} hrs
                  </p>
                </div>
              )}
            </div>
          )}

          <div className="flex gap-4">
            <button
              onClick={handleClockIn}
              disabled={clockedIn}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                clockedIn
                  ? "bg-white/20 cursor-not-allowed"
                  : "bg-white text-blue-700 hover:bg-gray-100"
              }`}
            >
              <LogIn size={18} />
              Clock In
            </button>

            <button
              onClick={handleClockOut}
              disabled={!clockedIn}
              className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                !clockedIn
                  ? "bg-white/20 cursor-not-allowed"
                  : "bg-white text-blue-700 hover:bg-gray-100"
              }`}
            >
              <LogOut size={18} />
              Clock Out
            </button>
          </div>
        </div>
      </div>

      {/* Attendance Table */}
      <div className="bg-white rounded-xl shadow overflow-hidden">
        <div className="px-6 py-4 border-b bg-gray-50">
          <h2 className="text-lg font-semibold">
            Current Month Attendance Log
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left">Date</th>
                <th className="px-6 py-3 text-left">Check-In Time</th>
                <th className="px-6 py-3 text-left">Check-Out Time</th>
                <th className="px-6 py-3 text-left">Total Hours Worked</th>
                <th className="px-6 py-3 text-left">Status</th>
              </tr>
            </thead>

            <tbody>
              {attendance.map((entry) => (
                <tr
                  key={entry.id}
                  className="border-b hover:bg-gray-50"
                >
                  <td className="px-6 py-4">{entry.date}</td>

                  <td className="px-6 py-4">
                    {entry.checkInTime}
                  </td>

                  <td className="px-6 py-4">
                    {entry.checkOutTime}
                  </td>

                  <td className="px-6 py-4">
                    {entry.totalHours}
                  </td>

                  <td className="px-6 py-4">
                    {getStatusBadge(entry.status)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="px-6 py-3 bg-gray-50 text-sm text-gray-600">
          Total Records: {attendance.length}
        </div>
      </div>
    </div>
  );
}