"use client";

import { useState, useEffect, useCallback } from "react";
import { UserCheck, UserX, Clock, Home, Calendar, Sun, Check, X } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { createAttendance, fetchAttendances, type AttendanceRecord } from "../../../lib/workforce-api";

const STATUS_OPTIONS = [
  { value: "PRESENT", label: "Present", icon: UserCheck, color: "border-emerald-500/40 bg-emerald-500/10 text-emerald-300 hover:bg-emerald-500/20" },
  { value: "ABSENT", label: "Absent", icon: UserX, color: "border-rose-500/40 bg-rose-500/10 text-rose-300 hover:bg-rose-500/20" },
  { value: "HALF_DAY", label: "Half Day", icon: Sun, color: "border-yellow-500/40 bg-yellow-500/10 text-yellow-300 hover:bg-yellow-500/20" },
  { value: "WORK_FROM_HOME", label: "Work From Home", icon: Home, color: "border-sky-500/40 bg-sky-500/10 text-sky-300 hover:bg-sky-500/20" },
  { value: "ON_LEAVE", label: "On Leave", icon: Calendar, color: "border-purple-500/40 bg-purple-500/10 text-purple-300 hover:bg-purple-500/20" },
  { value: "HOLIDAY", label: "Holiday", icon: Clock, color: "border-orange-500/40 bg-orange-500/10 text-orange-300 hover:bg-orange-500/20" },
];

function formatDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function getCurrentTime(): string {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export default function AttendanceEntryPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [date, setDate] = useState(formatDate(new Date()));
  const [status, setStatus] = useState("PRESENT");
  const [checkIn, setCheckIn] = useState(getCurrentTime());
  const [checkOut, setCheckOut] = useState("");
  const [remarks, setRemarks] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [recentEntries, setRecentEntries] = useState<AttendanceRecord[]>([]);
  const [loadingEntries, setLoadingEntries] = useState(false);

  const today = formatDate(new Date());

  const loadRecentEntries = useCallback(async () => {
    setLoadingEntries(true);
    try {
      const res = await fetchAttendances({ startDate: today, endDate: today, take: 10, orderBy: "createdAt", orderDir: "desc" });
      setRecentEntries(res.data ?? []);
    } catch {
      setRecentEntries([]);
    } finally {
      setLoadingEntries(false);
    }
  }, [today]);

  useEffect(() => {
    loadRecentEntries();
  }, [loadRecentEntries]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!employeeId.trim()) {
      showToast("error", "Please enter an employee ID or name.");
      return;
    }
    setSubmitting(true);
    try {
      await createAttendance({
        employeeId: employeeId.trim(),
        date,
        checkIn: checkIn || undefined,
        checkOut: checkOut || undefined,
        status,
        remarks: remarks || undefined,
      });
      showToast("success", "Attendance record created successfully.");
      setEmployeeId("");
      setCheckIn(getCurrentTime());
      setCheckOut("");
      setRemarks("");
      setStatus("PRESENT");
      await loadRecentEntries();
    } catch (err: any) {
      showToast("error", err?.message ?? "Failed to create attendance record.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SuperAdminShell>
      <PageHeader
        title="Attendance Entry"
        description="Mark employee attendance for the day."
      />

      {toast && (
        <div
          className={`mb-6 flex items-center gap-3 rounded-[28px] border px-5 py-4 text-sm font-medium shadow-[0_24px_80px_rgba(0,0,0,0.35)] ${
            toast.type === "success"
              ? "border-emerald-500/30 bg-emerald-500/10 text-emerald-200"
              : "border-rose-500/30 bg-rose-500/10 text-rose-200"
          }`}
        >
          {toast.type === "success" ? <Check className="h-5 w-5 shrink-0" /> : <X className="h-5 w-5 shrink-0" />}
          {toast.message}
        </div>
      )}

      <div className="grid gap-6 xl:grid-cols-[1.4fr_1fr]">
        {/* ── Form ── */}
        <form
          onSubmit={handleSubmit}
          className="rounded-[28px] border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]"
        >
          <div className="mb-6 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <UserCheck className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">New Attendance Record</h2>
              <p className="text-xs text-slate-400">Fill in the details below</p>
            </div>
          </div>

          <div className="space-y-5">
            {/* Employee ID */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Employee ID / Name
              </label>
              <input
                type="text"
                value={employeeId}
                onChange={(e) => setEmployeeId(e.target.value)}
                placeholder="Type employee ID or name..."
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Date */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Date
              </label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Status Cards */}
            <div>
              <label className="mb-2.5 block text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Status
              </label>
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
                {STATUS_OPTIONS.map((opt) => {
                  const selected = status === opt.value;
                  const Icon = opt.icon;
                  return (
                    <button
                      key={opt.value}
                      type="button"
                      onClick={() => setStatus(opt.value)}
                      className={`flex items-center gap-2.5 rounded-2xl border px-4 py-3 text-sm font-medium outline-none transition-all ${
                        selected
                          ? opt.color + " ring-2 ring-offset-2 ring-offset-slate-950"
                          : "border-slate-700 bg-slate-900/30 text-slate-400 hover:border-slate-600 hover:text-slate-300"
                      }`}
                    >
                      <Icon className="h-4 w-4 shrink-0" />
                      {opt.label}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Check In / Check Out */}
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                  Check In <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="time"
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                  Check Out <span className="text-slate-500">(optional)</span>
                </label>
                <input
                  type="time"
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
                />
              </div>
            </div>

            {/* Remarks */}
            <div>
              <label className="mb-1.5 block text-xs font-medium uppercase tracking-[0.12em] text-slate-400">
                Remarks <span className="text-slate-500">(optional)</span>
              </label>
              <textarea
                rows={3}
                value={remarks}
                onChange={(e) => setRemarks(e.target.value)}
                placeholder="Any additional notes..."
                className="w-full resize-none rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2.5 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500/50 focus:ring-2 focus:ring-indigo-500/20"
              />
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={submitting}
              className="flex w-full items-center justify-center gap-2 rounded-2xl bg-indigo-600 px-5 py-3 text-sm font-semibold text-white outline-none transition hover:bg-indigo-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? (
                <>
                  <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                  </svg>
                  Saving…
                </>
              ) : (
                <>
                  <Check className="h-4 w-4" />
                  Save Attendance
                </>
              )}
            </button>
          </div>
        </form>

        {/* ── Recent Entries ── */}
        <div className="rounded-[28px] border border-slate-800 bg-slate-950 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-500/10">
              <Calendar className="h-5 w-5 text-indigo-400" />
            </div>
            <div>
              <h2 className="text-lg font-semibold text-white">Today&apos;s Entries</h2>
              <p className="text-xs text-slate-400">Recently recorded attendance</p>
            </div>
          </div>

          {loadingEntries ? (
            <div className="flex items-center justify-center py-12">
              <svg className="h-6 w-6 animate-spin text-indigo-400" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
              </svg>
            </div>
          ) : recentEntries.length === 0 ? (
            <p className="py-12 text-center text-sm text-slate-500">No entries recorded today.</p>
          ) : (
            <div className="space-y-3">
              {recentEntries.map((entry) => (
                <div
                  key={entry.id}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-900/30 px-4 py-3"
                >
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-white">
                      {entry.employee
                        ? `${entry.employee.firstName} ${entry.employee.lastName}`
                        : entry.employeeId}
                    </p>
                    <p className="text-xs text-slate-400">
                      {entry.checkIn ? `In: ${entry.checkIn.slice(0, 5)}` : "—"}
                      {entry.checkOut ? ` / Out: ${entry.checkOut.slice(0, 5)}` : ""}
                    </p>
                  </div>
                  <StatusBadge status={entry.status} />
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SuperAdminShell>
  );
}
