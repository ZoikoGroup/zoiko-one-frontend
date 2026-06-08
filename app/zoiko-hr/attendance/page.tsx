"use client";

import { useEffect, useState } from "react";
import { Users, UserCheck, UserX, Clock, Calendar, Percent, LogIn, LogOut } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import {
  fetchAttendanceDashboard,
  fetchAttendances,
  checkInEmployee,
  checkOutEmployee,
  type AttendanceDashboardStats,
  type AttendanceRecord,
} from "../../lib/workforce-api";

interface StatCard {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  gradient: string;
}

const STAT_CARDS: StatCard[] = [
  { label: "Total Employees", value: 0, icon: <Users className="h-6 w-6" />, gradient: "from-blue-600/40 to-blue-900/20" },
  { label: "Present Today", value: 0, icon: <UserCheck className="h-6 w-6" />, gradient: "from-emerald-600/40 to-emerald-900/20" },
  { label: "Absent Today", value: 0, icon: <UserX className="h-6 w-6" />, gradient: "from-rose-600/40 to-rose-900/20" },
  { label: "On Leave", value: 0, icon: <Calendar className="h-6 w-6" />, gradient: "from-violet-600/40 to-violet-900/20" },
  { label: "Late Arrivals", value: 0, icon: <Clock className="h-6 w-6" />, gradient: "from-amber-600/40 to-amber-900/20" },
  { label: "Attendance %", value: "0%", icon: <Percent className="h-6 w-6" />, gradient: "from-indigo-600/40 to-indigo-900/20" },
];

function todayStr() {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

export default function AttendanceDashboardPage() {
  const [stats, setStats] = useState<AttendanceDashboardStats | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [employeeId, setEmployeeId] = useState("");
  const [actionLoading, setActionLoading] = useState(false);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [dashRes, attRes] = await Promise.all([
        fetchAttendanceDashboard(),
        fetchAttendances({ startDate: todayStr(), endDate: todayStr(), take: 20, orderBy: "checkIn", orderDir: "desc" }),
      ]);
      setStats(dashRes.data);
      setRecords(attRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attendance data.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadData(); }, []);

  const handleCheckIn = async () => {
    if (!employeeId.trim()) { showToast("error", "Please enter an employee ID."); return; }
    setActionLoading(true);
    try {
      await checkInEmployee(employeeId.trim());
      showToast("success", `Employee ${employeeId.trim()} checked in successfully.`);
      setEmployeeId("");
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Check-in failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const handleCheckOut = async () => {
    if (!employeeId.trim()) { showToast("error", "Please enter an employee ID."); return; }
    setActionLoading(true);
    try {
      await checkOutEmployee(employeeId.trim());
      showToast("success", `Employee ${employeeId.trim()} checked out successfully.`);
      setEmployeeId("");
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Check-out failed.");
    } finally {
      setActionLoading(false);
    }
  };

  const statCards: StatCard[] = STAT_CARDS.map((card) => {
    if (!stats) return card;
    const values: Record<string, string | number> = {
      "Total Employees": stats.totalEmployees,
      "Present Today": stats.present,
      "Absent Today": stats.absent,
      "On Leave": stats.onLeave,
      "Late Arrivals": stats.lateArrivals,
      "Attendance %": `${stats.attendancePct}%`,
    };
    return { ...card, value: values[card.label] ?? card.value };
  });

  return (
    <SuperAdminShell>
      <PageHeader
        title="Attendance Management"
        description="Monitor daily attendance, track check-ins/check-outs, and view attendance analytics."
      />

      {toast && (
        <div
          className={`mb-4 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
            toast.type === "success"
              ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20"
              : "bg-rose-500/15 text-rose-300 border border-rose-500/20"
          }`}
        >
          {toast.message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/10 px-5 py-3 text-sm text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-400">Loading attendance dashboard...</span>
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
            {statCards.map((card) => (
              <div
                key={card.label}
                className={`relative overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] bg-gradient-to-br ${card.gradient} p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]`}
              >
                <div className="flex items-center justify-between">
                  <p className="text-xs uppercase tracking-wider text-slate-400">{card.label}</p>
                  <span className="text-slate-500">{card.icon}</span>
                </div>
                <p className="mt-3 text-3xl font-bold text-white">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <h2 className="mb-4 text-lg font-semibold text-white">Quick Actions</h2>
            <div className="flex flex-wrap items-end gap-4">
              <div className="flex-1 min-w-[200px]">
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Employee ID</label>
                <input
                  type="text"
                  placeholder="Enter employee ID..."
                  value={employeeId}
                  onChange={(e) => setEmployeeId(e.target.value)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
                />
              </div>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleCheckIn}
                className="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50"
              >
                <LogIn className="h-4 w-4" /> Check In
              </button>
              <button
                type="button"
                disabled={actionLoading}
                onClick={handleCheckOut}
                className="inline-flex items-center gap-2 rounded-3xl bg-amber-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-50"
              >
                <LogOut className="h-4 w-4" /> Check Out
              </button>
            </div>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">
                Today&apos;s Attendance{" "}
                <span className="ml-2 text-sm font-normal text-slate-400">({records.length})</span>
              </h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[700px] border-collapse text-left text-sm">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Employee</th>
                    <th className="px-5 py-3 font-semibold">Check In</th>
                    <th className="px-5 py-3 font-semibold">Check Out</th>
                    <th className="px-5 py-3 font-semibold">Working Hours</th>
                    <th className="px-5 py-3 font-semibold">Status</th>
                    <th className="px-5 py-3 font-semibold">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {records.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="px-5 py-12 text-center text-slate-400">
                        No attendance records for today.
                      </td>
                    </tr>
                  ) : (
                    records.map((rec) => (
                      <tr key={rec.id} className="transition duration-200 hover:bg-slate-900/80">
                        <td className="border-t border-slate-800 px-5 py-4">
                          <div className="text-white">
                            {rec.employee
                              ? `${rec.employee.firstName} ${rec.employee.lastName}`
                              : rec.employeeId}
                          </div>
                          {rec.employee && (
                            <div className="mt-0.5 text-xs text-slate-500">{rec.employee.employeeId}</div>
                          )}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                          {rec.checkIn ? new Date(rec.checkIn).toLocaleTimeString() : "—"}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                          {rec.checkOut ? new Date(rec.checkOut).toLocaleTimeString() : "—"}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                          {rec.workingHours != null ? `${rec.workingHours.toFixed(1)}h` : "—"}
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4">
                          <StatusBadge status={rec.status} />
                        </td>
                        <td className="border-t border-slate-800 px-5 py-4 text-slate-400">
                          {rec.remarks || "—"}
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}
    </SuperAdminShell>
  );
}
