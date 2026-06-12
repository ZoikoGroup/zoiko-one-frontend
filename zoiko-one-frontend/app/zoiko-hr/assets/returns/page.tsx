"use client";

import { useEffect, useState } from "react";
import { Search, Undo2 } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchReturnRecords, type AssetReturnRecord } from "../../../lib/workforce-api";

export default function AssetReturnsPage() {
  const [returns, setReturns] = useState<AssetReturnRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    setLoading(true);
    fetchReturnRecords({
      search: search || undefined,
      skip: page * pageSize,
      take: pageSize,
    })
      .then((res) => { setReturns(res.data); setTotal(res.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, page]);

  const conditionColors: Record<string, string> = {
    Excellent: "text-emerald-400 bg-emerald-500/10",
    Good: "text-blue-400 bg-blue-500/10",
    Fair: "text-amber-400 bg-amber-500/10",
    Damaged: "text-rose-400 bg-rose-500/10",
  };

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Returns"
        description="Track assets that have been returned by employees."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search by asset, employee or condition..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
          />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Return Records <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Asset</th>
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Returned Date</th>
                  <th className="px-5 py-3 font-semibold">Condition</th>
                  <th className="px-5 py-3 font-semibold">Remarks</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {returns.length > 0 ? (
                  returns.map((record) => (
                    <tr key={record.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="border-t border-slate-800 px-5 py-4 font-medium text-white">{record.asset}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{record.employee}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{new Date(record.returnedDate).toLocaleDateString()}</td>
                      <td className="border-t border-slate-800 px-5 py-4">
                        <span className={`rounded-full px-3 py-1 text-xs font-medium ${conditionColors[record.condition] ?? "text-slate-400 bg-slate-800"}`}>
                          {record.condition}
                        </span>
                      </td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-400 max-w-[200px] truncate">{record.remarks}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-400" colSpan={5}>
                      No return records found.
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
