"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Clock, CheckCircle2, AlertTriangle } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchESSAttendance,
  type EmployeeAttendance,
} from "../../../lib/workforce-api";

export default function MyAttendancePage() {
  const [records, setRecords] = useState<EmployeeAttendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchESSAttendance();
      let filtered = res.data;
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter((r) => r.date.includes(s) || r.status.toLowerCase().includes(s));
      }
      const total = filtered.length;
      return { data: filtered.slice(page * pageSize, (page + 1) * pageSize), total };
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load attendance.");
      return { data: [], total: 0 };
    } finally { setLoading(false); }
  };

  const [displayData, setDisplayData] = useState<EmployeeAttendance[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    setLoading(true); setError("");
    fetchESSAttendance()
      .then((res) => {
        let filtered = res.data;
        if (search) {
          const s = search.toLowerCase();
          filtered = filtered.filter((r) => r.date.includes(s) || r.status.toLowerCase().includes(s));
        }
        setTotal(filtered.length);
        setDisplayData(filtered.slice(page * pageSize, (page + 1) * pageSize));
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load attendance."))
      .finally(() => setLoading(false));
  }, [search, page]);

  const presentCount = displayData.filter((r) => r.status === "PRESENT").length;
  const lateCount = displayData.filter((r) => r.status === "LATE").length;
  const absentCount = displayData.filter((r) => r.status === "ABSENT" || r.status === "ON_LEAVE" || r.status === "HALF_DAY").length;

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="My Attendance"
        description="View your daily attendance records and history."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] flex items-center gap-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-400" />
            <div>
              <p className="text-2xl font-bold text-white">{presentCount}</p>
              <p className="text-xs text-slate-400">Present</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] flex items-center gap-3">
            <AlertTriangle className="h-8 w-8 text-amber-400" />
            <div>
              <p className="text-2xl font-bold text-white">{lateCount}</p>
              <p className="text-xs text-slate-400">Late</p>
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-4 shadow-[0_20px_80px_rgba(0,0,0,0.35)] flex items-center gap-3">
            <Clock className="h-8 w-8 text-slate-400" />
            <div>
              <p className="text-2xl font-bold text-white">{absentCount}</p>
              <p className="text-xs text-slate-400">Absent / Leave</p>
            </div>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by date or status..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Attendance Records <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Check In</th>
                  <th className="px-5 py-3 font-semibold">Check Out</th>
                  <th className="px-5 py-3 font-semibold">Working Hours</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {displayData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No attendance records found.</td>
                  </tr>
                ) : (
                  displayData.map((r) => (
                    <tr key={r.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4 text-slate-300">{r.date}</td>
                      <td className="px-5 py-4 text-slate-400">{r.checkIn}</td>
                      <td className="px-5 py-4 text-slate-400">{r.checkOut}</td>
                      <td className="px-5 py-4 text-slate-400">{r.workingHours}</td>
                      <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{r.remarks ?? "—"}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
              <p className="text-xs text-slate-500">Showing {start}–{end} of {total}</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-slate-400">Page {page + 1} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </SuperAdminShell>
  );
}
