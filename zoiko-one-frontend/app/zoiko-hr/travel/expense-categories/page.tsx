"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchExpenseCategories,
  type ExpenseCategory,
} from "../../../lib/workforce-api";

export default function ExpenseCategoriesPage() {
  const [categories, setCategories] = useState<ExpenseCategory[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchExpenseCategories({
        search: search || undefined,
        status: statusFilter || undefined,
        skip: page * pageSize, take: pageSize,
      });
      setCategories(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load expense categories.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, statusFilter, page]);

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Expense Categories"
        description="Manage expense categories and their budgets."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by name or description..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[140px]">
          <option value="">All Status</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Expense Categories <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Category Name</th>
                  <th className="px-5 py-3 font-semibold">Description</th>
                  <th className="px-5 py-3 font-semibold">Budget</th>
                  <th className="px-5 py-3 font-semibold">Spent</th>
                  <th className="px-5 py-3 font-semibold">Remaining</th>
                  <th className="px-5 py-3 font-semibold">Utilization</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {categories.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">No expense categories found.</td>
                  </tr>
                ) : (
                  categories.map((c) => {
                    const remaining = c.budget - c.spent;
                    const utilization = c.budget > 0 ? Math.round((c.spent / c.budget) * 100) : 0;
                    return (
                      <tr key={c.id} className="transition duration-200 hover:bg-slate-900/80">
                        <td className="px-5 py-4">
                          <p className="text-white font-medium">{c.name}</p>
                        </td>
                        <td className="px-5 py-4 text-slate-400 max-w-[200px] truncate">{c.description}</td>
                        <td className="px-5 py-4 text-slate-300 font-medium">{formatCurrency(c.budget)}</td>
                        <td className="px-5 py-4 text-slate-300">{formatCurrency(c.spent)}</td>
                        <td className="px-5 py-4">
                          <span className={remaining < 0 ? "text-rose-400 font-medium" : "text-emerald-400 font-medium"}>
                            {formatCurrency(remaining)}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-2">
                            <div className="h-2 w-20 overflow-hidden rounded-full bg-slate-800">
                              <div className={`h-full rounded-full ${utilization > 90 ? "bg-rose-500" : utilization > 70 ? "bg-amber-500" : "bg-emerald-500"}`}
                                style={{ width: `${Math.min(utilization, 100)}%` }} />
                            </div>
                            <span className="text-xs text-slate-400">{utilization}%</span>
                          </div>
                        </td>
                        <td className="px-5 py-4"><StatusBadge status={c.status} /></td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
              <p className="text-xs text-slate-500">Showing {start}&ndash;{end} of {total}</p>
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
