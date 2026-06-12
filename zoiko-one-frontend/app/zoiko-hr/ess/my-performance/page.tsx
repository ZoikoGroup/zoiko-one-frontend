"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight, Star } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchESSReviews,
  type EmployeeReview,
} from "../../../lib/workforce-api";

export default function MyPerformancePage() {
  const [reviews, setReviews] = useState<EmployeeReview[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 10;

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchESSReviews();
      let filtered = res.data;
      if (search) {
        const s = search.toLowerCase();
        filtered = filtered.filter((r) => r.reviewPeriod.toLowerCase().includes(s) || r.reviewer.toLowerCase().includes(s));
      }
      setTotal(filtered.length);
      setReviews(filtered.slice(page * pageSize, (page + 1) * pageSize));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load performance data.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, page]);

  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.filter((r) => r.rating > 0).length).toFixed(1)
    : "0.0";

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="My Performance"
        description="View your performance reviews and ratings."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {!loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3 mb-6">
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs uppercase tracking-wider text-slate-400">Average Rating</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {avgRating}
              <span className="ml-2 text-lg text-slate-400">/ 5</span>
            </p>
            <div className="mt-2 flex items-center gap-1">
              {[1, 2, 3, 4, 5].map((s) => (
                <Star key={s} className={`h-4 w-4 ${parseFloat(avgRating) >= s ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
              ))}
            </div>
          </div>
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs uppercase tracking-wider text-slate-400">Completed Reviews</p>
            <p className="mt-2 text-3xl font-bold text-white">{reviews.filter((r) => r.status === "COMPLETED").length}</p>
            <p className="mt-1 text-xs text-slate-500">Reviews completed</p>
          </div>
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <p className="text-xs uppercase tracking-wider text-slate-400">Pending Reviews</p>
            <p className="mt-2 text-3xl font-bold text-white">{reviews.filter((r) => r.status === "PENDING").length}</p>
            <p className="mt-1 text-xs text-slate-500">Awaiting review</p>
          </div>
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by review period or reviewer..." value={search}
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
            <h2 className="text-lg font-semibold text-white">Performance Reviews <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[700px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Review Period</th>
                  <th className="px-5 py-3 font-semibold">Reviewer</th>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={4} className="px-5 py-8 text-center text-sm text-slate-500">No reviews found.</td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{r.reviewPeriod}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{r.reviewer}</td>
                      <td className="px-5 py-4">
                        {r.rating > 0 ? (
                          <div className="flex items-center gap-2">
                            <div className="flex items-center gap-0.5">
                              {[1, 2, 3, 4, 5].map((s) => (
                                <Star key={s} className={`h-3.5 w-3.5 ${r.rating >= s ? "text-amber-400 fill-amber-400" : "text-slate-600"}`} />
                              ))}
                            </div>
                            <span className="text-xs text-slate-400">{r.rating}</span>
                          </div>
                        ) : (
                          <span className="text-xs text-slate-500">—</span>
                        )}
                      </td>
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
