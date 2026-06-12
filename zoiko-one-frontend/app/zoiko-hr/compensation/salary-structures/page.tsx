"use client";

import { useEffect, useState } from "react";
import { Search } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchSalaryStructures, type SalaryStructure } from "../../../lib/workforce-api";

const STATUS_OPTIONS = ["ALL", "ACTIVE", "INACTIVE", "DRAFT"];

export default function SalaryStructuresPage() {
  const [structures, setStructures] = useState<SalaryStructure[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    setLoading(true);
    fetchSalaryStructures({ search: search || undefined, status: statusFilter || undefined, skip: page * pageSize, take: pageSize })
      .then((res) => { setStructures(res.data); setTotal(res.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  const formatCurrency = (val: number) =>
    new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0 }).format(val);

  return (
    <SuperAdminShell>
      <PageHeader title="Salary Structures" description="Define and manage salary structures and pay ranges." />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by name..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
          {STATUS_OPTIONS.map((opt) => (
            <option key={opt} value={opt === "ALL" ? "" : opt}>{opt === "ALL" ? "All Status" : opt}</option>
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
            <h2 className="text-lg font-semibold text-white">Salary Structures <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Min Salary</th>
                  <th className="px-5 py-3 font-semibold">Max Salary</th>
                  <th className="px-5 py-3 font-semibold">Employees</th>
                  <th className="px-5 py-3 font-semibold">Currency</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {structures.length > 0 ? (
                  structures.map((s) => (
                    <tr key={s.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="border-t border-slate-800 px-5 py-4 font-medium text-white">{s.name}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{formatCurrency(s.minSalary)}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{formatCurrency(s.maxSalary)}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{s.employeeCount}</td>
                      <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{s.currency}</td>
                      <td className="border-t border-slate-800 px-5 py-4"><StatusBadge status={s.status} /></td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td className="px-5 py-8 text-center text-slate-400" colSpan={6}>No salary structures found.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {total > pageSize && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
              <p className="text-sm text-slate-400">Showing {page * pageSize + 1} to {Math.min((page + 1) * pageSize, total)} of {total}</p>
              <div className="flex gap-2">
                <button type="button" onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0}
                  className="rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 disabled:opacity-50">Previous</button>
                <button type="button" onClick={() => setPage((p) => p + 1)} disabled={(page + 1) * pageSize >= total}
                  className="rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 disabled:opacity-50">Next</button>
              </div>
            </div>
          )}
        </section>
      )}
    </SuperAdminShell>
  );
}
