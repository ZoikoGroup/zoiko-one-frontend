"use client";

import { useEffect, useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchWFHiringPlans, createWFHiringPlan, updateWFHiringPlan,
  type WFHiringPlan, type WfPlanStatus, type WfPriority,
} from "../../../lib/workforce-api";

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Operations", "Legal", "Data"];
const PRIORITIES = ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"];
const STATUSES: WfPlanStatus[] = ["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"];

export default function HiringPlansPage() {
  const [plans, setPlans] = useState<WFHiringPlan[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ position: "", department: "Engineering", requiredHeadcount: "1", priority: "MEDIUM", budget: "0", hiringWindow: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchWFHiringPlans({
      search: search || undefined,
      status: statusFilter || undefined,
      priority: priorityFilter !== "All" ? priorityFilter : undefined,
      department: deptFilter || undefined,
      skip: page * pageSize, take: pageSize,
    })
      .then((res) => { if (!cancelled) { setPlans(res.data); setTotal(res.total); setError(""); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err instanceof Error ? err.message : "Failed to load hiring plans."); setLoading(false); } });
    return () => { cancelled = true; };
  }, [search, statusFilter, priorityFilter, deptFilter, page]);

  const handleStatus = async (id: string, status: WfPlanStatus) => {
    try { await updateWFHiringPlan(id, { status }); setToast(`Plan ${status.toLowerCase()}.`); loadData(); } catch { setError("Failed to update plan."); }
  };

  const loadData = async () => {
    try {
      const res = await fetchWFHiringPlans({ search: search || undefined, status: statusFilter || undefined, priority: priorityFilter !== "All" ? priorityFilter : undefined, department: deptFilter || undefined, skip: page * pageSize, take: pageSize });
      setPlans(res.data); setTotal(res.total);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load hiring plans."); }
  };

  const openCreate = () => {
    setEditId(null); setFormData({ position: "", department: "Engineering", requiredHeadcount: "1", priority: "MEDIUM", budget: "0", hiringWindow: "" }); setFormError(""); setShowForm(true);
  };

  const openEdit = (plan: WFHiringPlan) => {
    setEditId(plan.id); setFormData({ position: plan.position, department: plan.department, requiredHeadcount: String(plan.requiredHeadcount), priority: plan.priority, budget: String(plan.budget), hiringWindow: plan.hiringWindow }); setFormError(""); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.position.trim()) { setFormError("Position is required."); return; }
    setSubmitting(true); setFormError("");
    try {
      if (editId) {
        await updateWFHiringPlan(editId, { position: formData.position, department: formData.department, requiredHeadcount: parseInt(formData.requiredHeadcount) || 1, priority: formData.priority as WfPriority, budget: parseInt(formData.budget) || 0, hiringWindow: formData.hiringWindow });
        setToast("Plan updated.");
      } else {
        await createWFHiringPlan({ position: formData.position, department: formData.department, requiredHeadcount: parseInt(formData.requiredHeadcount) || 1, priority: formData.priority, budget: parseInt(formData.budget) || 0, hiringWindow: formData.hiringWindow });
        setToast("Plan created.");
      }
      setShowForm(false); loadData();
    } catch (err) { setFormError(err instanceof Error ? err.message : "Operation failed."); }
    finally { setSubmitting(false); }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); } }, [toast]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Hiring Plans"
        description="Plan and track hiring requirements across departments."
        action={
          <button type="button" onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Create Plan
          </button>
        }
      />
      {toast && <div className="mb-4 rounded-2xl bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-300 border border-emerald-500/20">{toast}</div>}
      {error && <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search positions..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[160px]">
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => { setPriorityFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[140px]">
          {PRIORITIES.map((p) => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[140px]">
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Hiring Plans <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Position</th>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Headcount</th>
                  <th className="px-5 py-3 font-semibold">Priority</th>
                  <th className="px-5 py-3 font-semibold">Budget</th>
                  <th className="px-5 py-3 font-semibold">Window</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {plans.length === 0 ? (
                  <tr><td colSpan={8} className="px-5 py-8 text-center text-sm text-slate-500">No hiring plans found.</td></tr>
                ) : (
                  plans.map((p) => (
                    <tr key={p.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4"><span className="text-white font-medium">{p.position}</span></td>
                      <td className="px-5 py-4 text-slate-400">{p.department}</td>
                      <td className="px-5 py-4 text-slate-400">{p.requiredHeadcount}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.priority} /></td>
                      <td className="px-5 py-4 text-slate-400">${(p.budget / 1000).toFixed(0)}K</td>
                      <td className="px-5 py-4 text-slate-400">{p.hiringWindow}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          {p.status === "DRAFT" && <button type="button" onClick={() => handleStatus(p.id, "ACTIVE")} className="rounded-3xl bg-emerald-600/20 px-3 py-1.5 text-xs text-emerald-400 transition hover:bg-emerald-600/30">Activate</button>}
                          {(p.status === "DRAFT" || p.status === "ACTIVE") && <button type="button" onClick={() => openEdit(p)} className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white">Edit</button>}
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
              <p className="text-xs text-slate-500">Showing {start}--{end} of {total}</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40"><ChevronLeft className="h-4 w-4" /></button>
                <span className="text-xs text-slate-400">Page {page + 1} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40"><ChevronRight className="h-4 w-4" /></button>
              </div>
            </div>
          )}
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white">{editId ? "Edit Hiring Plan" : "Create Hiring Plan"}</h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Position</label>
                <input type="text" value={formData.position} onChange={(e) => setFormData({ ...formData, position: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. Senior Software Engineer" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Department</label>
                  <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    {PRIORITIES.filter((p) => p !== "All").map((p) => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Required Headcount</label>
                  <input type="number" value={formData.requiredHeadcount} onChange={(e) => setFormData({ ...formData, requiredHeadcount: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Budget ($)</label>
                  <input type="number" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Hiring Window</label>
                <input type="text" value={formData.hiringWindow} onChange={(e) => setFormData({ ...formData, hiringWindow: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. Q3 2026" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {submitting ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
