"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchESSLeaveRequests, fetchESSLeaveBalances,
  type EmployeeLeaveReq, type ESSLeaveBalance,
} from "../../../lib/workforce-api";

export default function MyLeavePage() {
  const [requests, setRequests] = useState<EmployeeLeaveReq[]>([]);
  const [balances, setBalances] = useState<ESSLeaveBalance[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const [reqRes, balRes] = await Promise.all([
        fetchESSLeaveRequests(),
        fetchESSLeaveBalances(),
      ]);
      let filtered = reqRes.data;
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter((r) => r.leaveType.toLowerCase().includes(s) || r.status.toLowerCase().includes(s));
      }
      setTotal(filtered.length);
      setRequests(filtered.slice(page * pageSize, (page + 1) * pageSize));
      setBalances(balRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load leave data.");
    } finally { setLoading(false); }
  };

  const [total, setTotal] = useState(0);

  useEffect(() => { loadData(); }, [search, page]);

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="My Leave"
        description="View your leave requests and balances."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 mb-6">
          {balances.map((b) => (
            <div key={b.type} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs uppercase tracking-wider text-slate-400">{b.type}</p>
              <div className="mt-3 flex items-baseline gap-2">
                <span className="text-3xl font-bold text-white">{b.remaining}</span>
                <span className="text-sm text-slate-500">/ {b.total}</span>
              </div>
              <div className="mt-3 h-2 rounded-full bg-slate-800">
                <div className="h-2 rounded-full bg-indigo-500 transition-all" style={{ width: `${(b.used / b.total) * 100}%` }} />
              </div>
              <p className="mt-2 text-xs text-slate-500">{b.used} used</p>
            </div>
          ))}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by leave type or status..." value={search}
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
            <h2 className="text-lg font-semibold text-white">Leave Requests <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Leave Type</th>
                  <th className="px-5 py-3 font-semibold">From</th>
                  <th className="px-5 py-3 font-semibold">To</th>
                  <th className="px-5 py-3 font-semibold">Days</th>
                  <th className="px-5 py-3 font-semibold">Reason</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {requests.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No leave requests found.</td>
                  </tr>
                ) : (
                  requests.map((r) => (
                    <tr key={r.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{r.leaveType}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{r.fromDate}</td>
                      <td className="px-5 py-4 text-slate-400">{r.toDate}</td>
                      <td className="px-5 py-4 text-slate-300">{r.days}</td>
                      <td className="px-5 py-4 text-slate-500 max-w-[200px] truncate">{r.reason ?? "—"}</td>
                      <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
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
