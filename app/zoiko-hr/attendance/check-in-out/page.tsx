"use client";

import { useEffect, useState } from "react";
import { LogIn, LogOut, Clock, User, History, CheckCircle } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { checkInEmployee, checkOutEmployee, fetchAttendances, type AttendanceRecord } from "../../../lib/workforce-api";

function formatTime(date: Date) {
  return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
}

function formatHours(hours: number) {
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  return `${h}h ${m}m`;
}

function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + String(d.getMonth() + 1).padStart(2, "0") + "-" + String(d.getDate()).padStart(2, "0");
}

export default function CheckInOutPage() {
  const [inEmpId, setInEmpId] = useState("");
  const [outEmpId, setOutEmpId] = useState("");
  const [now, setNow] = useState(new Date());
  const [inLoading, setInLoading] = useState(false);
  const [outLoading, setOutLoading] = useState(false);
  const [inMsg, setInMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [outMsg, setOutMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [recordsLoading, setRecordsLoading] = useState(true);

  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const loadToday = () => {
    setRecordsLoading(true);
    fetchAttendances({ startDate: todayStr(), endDate: todayStr(), take: 50, orderBy: "createdAt", orderDir: "desc" })
      .then((res) => setRecords(res.data))
      .catch(() => {})
      .finally(() => setRecordsLoading(false));
  };

  useEffect(() => {
    loadToday();
  }, []);

  const handleCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inEmpId.trim()) return;
    setInLoading(true);
    setInMsg(null);
    try {
      const res = await checkInEmployee(inEmpId.trim());
      setInMsg({ ok: true, text: `Checked in at ${formatTime(new Date(res.data.checkIn ?? Date.now()))}` });
      setInEmpId("");
      loadToday();
    } catch (err) {
      setInMsg({ ok: false, text: err instanceof Error ? err.message : "Check-in failed." });
    } finally {
      setInLoading(false);
    }
  };

  const handleCheckOut = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!outEmpId.trim()) return;
    setOutLoading(true);
    setOutMsg(null);
    try {
      const res = await checkOutEmployee(outEmpId.trim());
      setOutMsg({ ok: true, text: `Checked out at ${formatTime(new Date(res.data.checkOut ?? Date.now()))}` });
      setOutEmpId("");
      loadToday();
    } catch (err) {
      setOutMsg({ ok: false, text: err instanceof Error ? err.message : "Check-out failed." });
    } finally {
      setOutLoading(false);
    }
  };

  return (
    <SuperAdminShell>
      <PageHeader title="Check In / Check Out" description="Record your daily attendance — check in when you arrive and check out when you leave." />

      <div className="mb-8 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Check In Card */}
        <form onSubmit={handleCheckIn} className="rounded-[28px] border border-slate-800 bg-[#0b1220]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-500/15">
              <LogIn className="h-6 w-6 text-emerald-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Check In</h2>
              <p className="flex items-center gap-1.5 text-sm text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(now)}
              </p>
            </div>
          </div>

          <div className="relative mb-4">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Employee ID"
              value={inEmpId}
              onChange={(e) => setInEmpId(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-emerald-500"
            />
          </div>

          <button
            type="submit"
            disabled={inLoading || !inEmpId.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-emerald-600 to-indigo-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-emerald-600/20 transition hover:from-emerald-500 hover:to-indigo-500 disabled:opacity-50"
          >
            {inLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Checking in...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogIn className="h-5 w-5" />
                Check In
              </span>
            )}
          </button>

          {inMsg && (
            <div className={`mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm ${inMsg.ok ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
              <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${inMsg.ok ? "text-emerald-400" : "text-rose-400"}`} />
              <span>{inMsg.text}</span>
            </div>
          )}
        </form>

        {/* Check Out Card */}
        <form onSubmit={handleCheckOut} className="rounded-[28px] border border-slate-800 bg-[#0b1220]/80 p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)] backdrop-blur-xl">
          <div className="mb-5 flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-amber-500/15">
              <LogOut className="h-6 w-6 text-amber-400" />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-white">Check Out</h2>
              <p className="flex items-center gap-1.5 text-sm text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                {formatTime(now)}
              </p>
            </div>
          </div>

          <div className="relative mb-4">
            <User className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Employee ID"
              value={outEmpId}
              onChange={(e) => setOutEmpId(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-amber-500"
            />
          </div>

          <button
            type="submit"
            disabled={outLoading || !outEmpId.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-3xl bg-gradient-to-r from-orange-500 to-amber-600 px-6 py-3.5 text-base font-semibold text-white shadow-lg shadow-orange-500/20 transition hover:from-orange-400 hover:to-amber-500 disabled:opacity-50"
          >
            {outLoading ? (
              <span className="flex items-center gap-2">
                <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
                </svg>
                Checking out...
              </span>
            ) : (
              <span className="flex items-center gap-2">
                <LogOut className="h-5 w-5" />
                Check Out
              </span>
            )}
          </button>

          {outMsg && (
            <div className={`mt-4 flex items-start gap-2 rounded-2xl px-4 py-3 text-sm ${outMsg.ok ? "bg-emerald-500/10 text-emerald-300" : "bg-rose-500/10 text-rose-300"}`}>
              <CheckCircle className={`mt-0.5 h-4 w-4 shrink-0 ${outMsg.ok ? "text-emerald-400" : "text-rose-400"}`} />
              <span>{outMsg.text}</span>
            </div>
          )}
        </form>
      </div>

      {/* Today's Activity */}
      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-center gap-2 border-b border-slate-800 px-6 py-4">
          <History className="h-5 w-5 text-slate-400" />
          <h2 className="text-lg font-semibold text-white">Today's Activity</h2>
          <span className="ml-auto text-sm text-slate-500">{records.length} record{records.length !== 1 ? "s" : ""}</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[700px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-6 py-3 font-semibold">Employee</th>
                <th className="px-6 py-3 font-semibold">Check In</th>
                <th className="px-6 py-3 font-semibold">Check Out</th>
                <th className="px-6 py-3 font-semibold">Working Hours</th>
                <th className="px-6 py-3 font-semibold">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {recordsLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    Loading activity...
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-slate-400">
                    No activity recorded today.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr key={r.id} className="transition duration-200 hover:bg-slate-900/80">
                    <td className="border-t border-slate-800 px-6 py-4">
                      <span className="text-white">
                        {r.employee?.firstName} {r.employee?.lastName}
                      </span>
                      <p className="mt-0.5 text-xs text-slate-500">{r.employee?.employeeId}</p>
                    </td>
                    <td className="border-t border-slate-800 px-6 py-4 text-slate-300">
                      {r.checkIn ? formatTime(new Date(r.checkIn)) : "—"}
                    </td>
                    <td className="border-t border-slate-800 px-6 py-4 text-slate-300">
                      {r.checkOut ? formatTime(new Date(r.checkOut)) : "—"}
                    </td>
                    <td className="border-t border-slate-800 px-6 py-4">
                      {r.workingHours != null ? (
                        <span className="font-mono text-slate-200">{formatHours(r.workingHours)}</span>
                      ) : (
                        <span className="text-slate-500">—</span>
                      )}
                    </td>
                    <td className="border-t border-slate-800 px-6 py-4">
                      <StatusBadge status={r.status} />
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </section>
    </SuperAdminShell>
  );
}
