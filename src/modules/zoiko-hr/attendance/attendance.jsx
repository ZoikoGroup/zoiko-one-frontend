import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getAttendance,
  createAttendance,
  getMyAttendance,
} from "../../../service/hrService";

const statusConfig = {
  present: {
    icon: "✓",
    color: "text-green-600",
    bg: "bg-green-100",
    border: "border-green-200",
  },
  late: {
    icon: "⏰",
    color: "text-orange-600",
    bg: "bg-orange-100",
    border: "border-orange-200",
  },
  absent: {
    icon: "✗",
    color: "text-red-600",
    bg: "bg-red-100",
    border: "border-red-200",
  },
  remote: {
    icon: "💻",
    color: "text-blue-600",
    bg: "bg-blue-100",
    border: "border-blue-200",
  },
  offduty: {
    icon: "😴",
    color: "text-gray-600",
    bg: "bg-gray-100",
    border: "border-gray-200",
  },
};

export default function ZoikoHRAttendance() {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [myAttendance, setMyAttendance] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [showCorrectionModal, setShowCorrectionModal] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);
  const [correctionForm, setCorrectionForm] = useState({
    employee_id: "",
    work_date: "",
    clock_in: "",
    clock_out: "",
    status: "present",
    notes: "",
  });
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const fetchAttendanceRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAttendance();
      setAttendanceRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load attendance records");
      setAttendanceRecords([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyAttendance = async () => {
    try {
      const data = await getMyAttendance();
      setMyAttendance(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load my attendance:", err);
    }
  };

  useEffect(() => {
    fetchAttendanceRecords();
    fetchMyAttendance();
  }, []);

  const stats = useMemo(() => {
    const total = attendanceRecords.length;
    const present = attendanceRecords.filter((r) => r.status === "present").length;
    const absent = attendanceRecords.filter((r) => r.status === "absent").length;
    const late = attendanceRecords.filter((r) => r.status === "late").length;
    const remote = attendanceRecords.filter((r) => r.status === "remote").length;
    const averageHours = attendanceRecords.reduce((sum, r) => {
      if (r.clock_in && r.clock_out) {
        const inTime = new Date(r.clock_in);
        const outTime = new Date(r.clock_out);
        const diffHours = (outTime - inTime) / (1000 * 60 * 60);
        return sum + diffHours;
      }
      return sum;
    }, 0) / total || 0;

    return {
      total,
      present,
      absent,
      late,
      remote,
      averageHours: averageHours.toFixed(1),
    };
  }, [attendanceRecords]);

  const filteredRecords = useMemo(() => {
    let result = attendanceRecords;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.employee_id?.toString().includes(q) ||
          r.status?.toLowerCase().includes(q)
      );
    }
    if (dateFilter) {
      result = result.filter((r) => r.work_date === dateFilter);
    }
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (employeeFilter) {
      result = result.filter((r) => r.employee_id === parseInt(employeeFilter));
    }
    return result;
  }, [attendanceRecords, search, dateFilter, statusFilter, employeeFilter]);

  const handleClockIn = async () => {
    const now = new Date();
    const payload = {
      employee_id: 1, // Current user ID - should come from auth context
      clock_in: now.toISOString(),
      work_date: now.toISOString().split("T")[0],
      status: "present",
      notes: "",
    };

    setSubmitting(true);
    try {
      await createAttendance(payload);
      await fetchAttendanceRecords();
      await fetchMyAttendance();
    } catch (err) {
      setError(err.message || "Failed to clock in");
    } finally {
      setSubmitting(false);
    }
  };

  const handleClockOut = async () => {
    const now = new Date();
    const todayRecord = attendanceRecords.find(
      (r) => r.employee_id === 1 && r.work_date === now.toISOString().split("T")[0]
    );

    if (!todayRecord) return;

    const payload = {
      clock_out: now.toISOString(),
      status: todayRecord.clock_out ? "present" : "present",
      notes: todayRecord.notes || "",
    };

    setSubmitting(true);
    try {
      await createAttendance(payload);
      await fetchAttendanceRecords();
      await fetchMyAttendance();
    } catch (err) {
      setError(err.message || "Failed to clock out");
    } finally {
      setSubmitting(false);
    }
  };

  const openCorrectionModal = (record) => {
    setEditingRecord(record);
    setCorrectionForm({
      employee_id: record.employee_id?.toString() || "",
      work_date: record.work_date || "",
      clock_in: record.clock_in ? new Date(record.clock_in).toISOString().slice(0, 16) : "",
      clock_out: record.clock_out ? new Date(record.clock_out).toISOString().slice(0, 16) : "",
      status: record.status || "present",
      notes: record.notes || "",
    });
    setShowCorrectionModal(true);
  };

  const handleCorrection = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        employee_id: parseInt(correctionForm.employee_id),
        work_date: correctionForm.work_date,
        clock_in: correctionForm.clock_in || null,
        clock_out: correctionForm.clock_out || null,
        status: correctionForm.status,
        notes: correctionForm.notes || null,
      };

      await createAttendance(payload);
      setShowCorrectionModal(false);
      setEditingRecord(null);
      await fetchAttendanceRecords();
    } catch (err) {
      setError(err.message || "Failed to correct attendance");
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusBadge = (status) => {
    const config = statusConfig[status] || statusConfig.present;

    return (
      <div
        className={`inline-flex items-center gap-1 px-3 py-1 rounded-full ${config.bg} ${config.border} border`}
      >
        <span className="text-sm">{config.icon}</span>
        <span className={`text-sm font-medium ${config.color} capitalize`}>{status}</span>
      </div>
    );
  };

  const getTodayStatus = () => {
    const today = currentTime.toISOString().split("T")[0];
    const todayRecord = myAttendance.find((r) => r.work_date === today);

    if (!todayRecord) {
      return {
        clockedIn: false,
        clockedOut: false,
        status: "not_clocked",
        record: null,
      };
    }

    return {
      clockedIn: !!todayRecord.clock_in,
      clockedOut: !!todayRecord.clock_out,
      status: todayRecord.status,
      record: todayRecord,
    };
  };

  const todayStatus = getTodayStatus();

  if (loading && attendanceRecords.length === 0) {
    return (
      <HRPage title="Attendance Tracking" subtitle="Track your daily attendance and work hours">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading attendance...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Attendance Tracking" subtitle="Track your daily attendance and work hours">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="space-y-6">
        {/* Clock Widget */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 rounded-xl shadow-lg p-8 text-white">
          <div className="flex flex-col items-center gap-6">
            <div className="text-center">
              <h2 className="text-lg font-medium text-blue-100">Current Time</h2>
              <div className="font-mono text-5xl font-bold mt-2">
                {currentTime.toLocaleTimeString()}
              </div>
              <div className="mt-2 text-blue-100">{currentTime.toLocaleDateString()}</div>
            </div>

            {todayStatus.record && (
              <div className="bg-white/20 rounded-lg p-4 w-full max-w-md">
                <div className="grid grid-cols-2 gap-4 text-center">
                  <div>
                    <p className="text-sm text-blue-100">Check-In</p>
                    <p className="font-bold text-xl">
                      {todayStatus.record.clock_in
                        ? new Date(todayStatus.record.clock_in).toLocaleTimeString()
                        : "--"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-blue-100">Check-Out</p>
                    <p className="font-bold text-xl">
                      {todayStatus.record.clock_out
                        ? new Date(todayStatus.record.clock_out).toLocaleTimeString()
                        : "--"}
                    </p>
                  </div>
                </div>

                {todayStatus.record.clock_in && todayStatus.record.clock_out && (
                  <div className="mt-4 text-center">
                    <p className="text-sm text-blue-100">Total Hours</p>
                    <p className="font-bold text-xl">
                      {(() => {
                        const inTime = new Date(todayStatus.record.clock_in);
                        const outTime = new Date(todayStatus.record.clock_out);
                        const diffHours = ((outTime - inTime) / (1000 * 60 * 60)).toFixed(1);
                        return `${diffHours} hrs`;
                      })()}
                    </p>
                  </div>
                )}
              </div>
            )}

            <div className="flex gap-4">
              <button
                onClick={handleClockIn}
                disabled={todayStatus.clockedIn || submitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  todayStatus.clockedIn
                    ? "bg-white/20 cursor-not-allowed"
                    : "bg-white text-blue-700 hover:bg-gray-100"
                }`}
              >
                ⏱️ Clock In
              </button>

              <button
                onClick={handleClockOut}
                disabled={!todayStatus.clockedIn || todayStatus.clockedOut || submitting}
                className={`flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition ${
                  !todayStatus.clockedIn || todayStatus.clockedOut
                    ? "bg-white/20 cursor-not-allowed"
                    : "bg-white text-blue-700 hover:bg-gray-100"
                }`}
              >
                🚪 Clock Out
              </button>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Total Records</p>
            <p className="text-2xl font-bold text-gray-800">{stats.total}</p>
          </div>
          <div className="bg-white rounded-xl border border-green-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Present</p>
            <p className="text-2xl font-bold text-green-600">{stats.present}</p>
          </div>
          <div className="bg-white rounded-xl border border-red-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Absent</p>
            <p className="text-2xl font-bold text-red-600">{stats.absent}</p>
          </div>
          <div className="bg-white rounded-xl border border-orange-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Late</p>
            <p className="text-2xl font-bold text-orange-600">{stats.late}</p>
          </div>
          <div className="bg-white rounded-xl border border-blue-200 p-4 shadow-sm">
            <p className="text-sm text-gray-500">Remote</p>
            <p className="text-2xl font-bold text-blue-600">{stats.remote}</p>
          </div>
        </div>

        {/* Attendance Table */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">Attendance Records</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Employee ID</th>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Check-In</th>
                  <th className="px-6 py-3 text-left">Check-Out</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredRecords.map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-mono font-medium text-sm">#{record.employee_id}</td>
                    <td className="px-6 py-4 text-sm">{record.work_date}</td>
                    <td className="px-6 py-4 text-sm">
                      {record.clock_in ? new Date(record.clock_in).toLocaleTimeString() : "--"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {record.clock_out ? new Date(record.clock_out).toLocaleTimeString() : "--"}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => openCorrectionModal(record)}
                        className="text-blue-600 hover:text-blue-800 text-sm font-medium"
                      >
                        Correct
                      </button>
                    </td>
                  </tr>
                ))}

                {filteredRecords.length === 0 && !loading && (
                  <tr>
                    <td colSpan={6} className="px-6 py-8 text-center text-gray-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* My Attendance */}
        <div className="bg-white rounded-xl shadow overflow-hidden">
          <div className="px-6 py-4 border-b bg-gray-50">
            <h2 className="text-lg font-semibold">My Recent Attendance</h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-6 py-3 text-left">Date</th>
                  <th className="px-6 py-3 text-left">Check-In</th>
                  <th className="px-6 py-3 text-left">Check-Out</th>
                  <th className="px-6 py-3 text-left">Status</th>
                  <th className="px-6 py-3 text-left">Hours</th>
                </tr>
              </thead>

              <tbody>
                {myAttendance.slice(0, 10).map((record) => (
                  <tr key={record.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 text-sm">{record.work_date}</td>
                    <td className="px-6 py-4 text-sm">
                      {record.clock_in ? new Date(record.clock_in).toLocaleTimeString() : "--"}
                    </td>
                    <td className="px-6 py-4 text-sm">
                      {record.clock_out ? new Date(record.clock_out).toLocaleTimeString() : "--"}
                    </td>
                    <td className="px-6 py-4">{getStatusBadge(record.status)}</td>
                    <td className="px-6 py-4 text-sm">
                      {record.clock_in && record.clock_out
                        ? (() => {
                            const inTime = new Date(record.clock_in);
                            const outTime = new Date(record.clock_out);
                            const diffHours = ((outTime - inTime) / (1000 * 60 * 60)).toFixed(1);
                            return `${diffHours} hrs`;
                          })()
                        : "--"}
                    </td>
                  </tr>
                ))}

                {myAttendance.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                      No attendance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {showCorrectionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Correct Attendance</h2>
              <button
                onClick={() => { setShowCorrectionModal(false); setEditingRecord(null); }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none"
              >
                &times;
              </button>
            </div>
            <form onSubmit={handleCorrection} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                <input
                  type="number"
                  value={correctionForm.employee_id}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, employee_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input
                  type="date"
                  value={correctionForm.work_date}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, work_date: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-In</label>
                  <input
                    type="datetime-local"
                    value={correctionForm.clock_in}
                    onChange={(e) => setCorrectionForm({ ...correctionForm, clock_in: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Check-Out</label>
                  <input
                    type="datetime-local"
                    value={correctionForm.clock_out}
                    onChange={(e) => setCorrectionForm({ ...correctionForm, clock_out: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={correctionForm.status}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="present">Present</option>
                  <option value="late">Late</option>
                  <option value="absent">Absent</option>
                  <option value="remote">Remote</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={correctionForm.notes}
                  onChange={(e) => setCorrectionForm({ ...correctionForm, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => { setShowCorrectionModal(false); setEditingRecord(null); }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                >
                  {submitting ? "Saving..." : "Save Correction"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
