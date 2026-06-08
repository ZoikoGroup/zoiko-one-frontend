"use client";

import { useEffect, useState } from "react";
import { Search, Filter, ChevronLeft, ChevronRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchAttendances, type AttendanceRecord, type AttendanceListResponse } from "../../../lib/workforce-api";

const STATUS_OPTIONS = ["PRESENT", "ABSENT", "HALF_DAY", "WORK_FROM_HOME", "ON_LEAVE", "HOLIDAY"] as const;

const STATUS_COLORS: Record<string, string> = {
  PRESENT: "bg-emerald-500/10 text-emerald-300",
  ABSENT: "bg-rose-500/10 text-rose-300",
  HALF_DAY: "bg-amber-500/10 text-amber-300",
  WORK_FROM_HOME: "bg-sky-500/10 text-sky-300",
  ON_LEAVE: "bg-blue-500/10 text-blue-300",
  HOLIDAY: "bg-purple-500/10 text-purple-300",
};

function formatTime(dt: string | null): string {
  if (!dt) return "\u2014";
  return new Date(dt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
}

function formatHours(val: number | null): string {
  if (val === null || val === undefined) return "\u2014";
  return val.toFixed(2);
}

export default function AttendanceRecordsPage() {
  const [records, setRecords] = useState<AttendanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [page, setPage] = useState(0);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const pageSize = 25;

  useEffect(() => {
    setLoaded(false);
    setError("");
    fetchAttendances({
      search: search || undefined,
      status: statusFilter || undefined,
      startDate: startDate || undefined,
      endDate: endDate || undefined,
      skip: page * pageSize,
      take: pageSize,
      orderBy: "date",
      orderDir: "desc",
    })
      .then((res) => {
        setRecords(res.data);
        setTotal(res.total);
        setLoaded(true);
      })
      .catch((err) => {
        setError(err instanceof Error ? err.message : "Failed to load attendance records.");
        setLoaded(true);
      });
  }, [search, statusFilter, startDate, endDate, page]);

  const totalPages = Math.ceil(total / pageSize);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Attendance Records"
        description="View and manage employee attendance records."
      />

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by employee name or ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>{s.replace(/_/g, " ")}</option>
            ))}
          </select>
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-500 shrink-0" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => { setStartDate(e.target.value); setPage(0); }}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 [color-scheme:dark]"
            />
            <span className="text-slate-500 text-sm">to</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => { setEndDate(e.target.value); setPage(0); }}
              className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 [color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">
            All Records
            <span className="ml-2 text-sm font-normal text-slate-400">({total})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Employee Name</th>
                <th className="px-5 py-3 font-semibold">Date</th>
                <th className="px-5 py-3 font-semibold">Check In</th>
                <th className="px-5 py-3 font-semibold">Check Out</th>
                <th className="px-5 py-3 font-semibold">Working Hours</th>
                <th className="px-5 py-3 font-semibold">Overtime</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {!loaded ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    Loading attendance records...
                  </td>
                </tr>
              ) : error ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-rose-300">
                    {error}
                  </td>
                </tr>
              ) : records.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-5 py-12 text-center text-slate-400">
                    No attendance records found.
                  </td>
                </tr>
              ) : (
                records.map((r) => (
                  <tr
                    key={r.id}
                    className="transition duration-200 hover:bg-slate-900/80 cursor-pointer"
                    onClick={() => setExpandedId(expandedId === r.id ? null : r.id)}
                  >
                    <td className="border-t border-slate-800 px-5 py-4">
                      <span className="text-white">
                        {r.employee?.firstName} {r.employee?.lastName}
                      </span>
                      <p className="text-xs text-slate-500">{r.employee?.employeeId}</p>
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                      {new Date(r.date).toLocaleDateString()}
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                      {formatTime(r.checkIn)}
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                      {formatTime(r.checkOut)}
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                      {formatHours(r.workingHours)}
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                      {formatHours(r.overtimeHours)}
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4">
                      <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${STATUS_COLORS[r.status] ?? "bg-slate-700 text-slate-200"}`}>
                        {r.status}
                      </span>
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); setExpandedId(expandedId === r.id ? null : r.id); }}
                          className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white"
                        >
                          View
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
              {records.map((r) =>
                expandedId === r.id ? (
                  <tr key={`${r.id}-detail`} className="bg-slate-900/40">
                    <td colSpan={8} className="px-5 py-4">
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Remarks</p>
                          <p className="text-slate-300">{r.remarks || "\u2014"}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Created</p>
                          <p className="text-slate-300">{new Date(r.createdAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Last Updated</p>
                          <p className="text-slate-300">{new Date(r.updatedAt).toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-xs uppercase tracking-wider text-slate-500 mb-1">Employee ID</p>
                          <p className="text-slate-300">{r.employee?.employeeId || "\u2014"}</p>
                        </div>
                      </div>
                    </td>
                  </tr>
                ) : null
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
            <p className="text-sm text-slate-400">
              Showing {page * pageSize + 1}\u2013{Math.min((page + 1) * pageSize, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="inline-flex items-center gap-1 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" /> Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="inline-flex items-center gap-1 rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40"
              >
                Next <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </section>
    </SuperAdminShell>
  );
}
