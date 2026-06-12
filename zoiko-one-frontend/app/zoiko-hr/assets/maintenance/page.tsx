"use client";

import { useEffect, useState } from "react";
import { Search, Wrench } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchMaintenanceRecords, type AssetMaintenanceRecord } from "../../../lib/workforce-api";

const STATUS_OPTIONS = ["ALL", "PENDING", "IN_PROGRESS", "COMPLETED"] as const;

export default function AssetMaintenancePage() {
  const [records, setRecords] = useState<AssetMaintenanceRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    setLoading(true);
    fetchMaintenanceRecords({
      search: search || undefined,
      status: statusFilter || undefined,
      skip: page * pageSize,
      take: pageSize,
    })
      .then((res) => { setRecords(res.data); setTotal(res.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Maintenance"
        description="Track maintenance requests, repairs, and vendor assignments."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by asset, issue or vendor..."
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
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt === "ALL" ? "" : opt}>{opt === "ALL" ? "All Status" : opt.replace(/_/g, " ")}</option>
          ))}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Maintenance Records <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Asset</th>
                  <th className="px-5 py-3 font-semibold">Issue Reported</th>
                  <th className="px-5 py-3 font-semibold">Assigned Vendor</th>
                  <th className="px-5 py-3 font-semibold">Cost</th>
                  <th className="px-5 py-3 font-semibold">Reported Date</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {records.length > 0 ? (
                  records.map((record) => (
                    <tr key={record.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="border-t border-slate-800 px-5 py-4 font-medium text-white">{record.asset}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{record.issueReported}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{record.assignedVendor}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">${record.cost.toFixed(2)}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{new Date(record.reportedDate).toLocaleDateString()}</td>
                      <td className="border-t border-slate-800 px-5 py-4">
                        <StatusBadge status={record.status} />
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-400" colSpan={6}>
                      No maintenance records found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {total > pageSize && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
              <p className="text-sm text-slate-400">
                Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, total)} of {total}
              </p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setPage((p) => Math.max(0, p - 1))}
                  disabled={page === 0}
                  className="rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                >
                  Previous
                </button>
                <button
                  type="button"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={(page + 1) * pageSize >= total}
                  className="rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </SuperAdminShell>
  );
}
