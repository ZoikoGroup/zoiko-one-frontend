"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import {
  fetchWFBudgetPlans, createWFBudgetPlan, updateWFBudgetPlan,
  type WFBudgetPlan,
} from "../../../lib/workforce-api";

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Operations", "Legal", "Data"];

export default function BudgetPlanningPage() {
  const [plans, setPlans] = useState<WFBudgetPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ department: "Engineering", currentBudget: "0", forecastBudget: "0", hiringCost: "0", trainingCost: "0" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    try {
      const res = await fetchWFBudgetPlans({ search: search || undefined });
      setPlans(res.data);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load budget plans."); }
  };

  useEffect(() => {
    let cancelled = false;
    fetchWFBudgetPlans({ search: search || undefined })
      .then((res) => { if (!cancelled) { setPlans(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search]);

  const openCreate = () => {
    setEditId(null); setFormData({ department: "Engineering", currentBudget: "0", forecastBudget: "0", hiringCost: "0", trainingCost: "0" }); setFormError(""); setShowForm(true);
  };

  const openEdit = (plan: WFBudgetPlan) => {
    setEditId(plan.id); setFormData({ department: plan.department, currentBudget: String(plan.currentBudget), forecastBudget: String(plan.forecastBudget), hiringCost: String(plan.hiringCost), trainingCost: String(plan.trainingCost) }); setFormError(""); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setFormError("");
    try {
      const current = parseInt(formData.currentBudget) || 0;
      const forecast = parseInt(formData.forecastBudget) || 0;
      const hiring = parseInt(formData.hiringCost) || 0;
      const training = parseInt(formData.trainingCost) || 0;
      if (editId) {
        await updateWFBudgetPlan(editId, { department: formData.department, currentBudget: current, forecastBudget: forecast, hiringCost: hiring, trainingCost: training });
        setToast("Budget plan updated.");
      } else {
        await createWFBudgetPlan({ department: formData.department, currentBudget: current, forecastBudget: forecast, hiringCost: hiring, trainingCost: training });
        setToast("Budget plan created.");
      }
      setShowForm(false); loadData();
    } catch (err) { setFormError(err instanceof Error ? err.message : "Operation failed."); }
    finally { setSubmitting(false); }
  };

  const totalCurrent = plans.reduce((s, b) => s + b.currentBudget, 0);
  const totalForecast = plans.reduce((s, b) => s + b.forecastBudget, 0);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); } }, [toast]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Budget Planning"
        description="Plan and track workforce budgets across departments."
        action={
          <button type="button" onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Create Budget
          </button>
        }
      />
      {toast && <div className="mb-4 rounded-2xl bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-300 border border-emerald-500/20">{toast}</div>}
      {error && <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search departments..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <>
          <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Current Budget</p>
              <p className="mt-1 text-2xl font-bold text-white">${(totalCurrent / 1000000).toFixed(1)}M</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Forecast Budget</p>
              <p className="mt-1 text-2xl font-bold text-white">${(totalForecast / 1000000).toFixed(1)}M</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Hiring Cost</p>
              <p className="mt-1 text-2xl font-bold text-white">${(plans.reduce((s, b) => s + b.hiringCost, 0) / 1000000).toFixed(1)}M</p>
            </div>
            <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
              <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Total Training Cost</p>
              <p className="mt-1 text-2xl font-bold text-white">${(plans.reduce((s, b) => s + b.trainingCost, 0) / 1000000).toFixed(1)}M</p>
            </div>
          </div>

          <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="border-b border-slate-800 px-5 py-4">
              <h2 className="text-lg font-semibold text-white">Department Budgets</h2>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
                <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                  <tr>
                    <th className="px-5 py-3 font-semibold">Department</th>
                    <th className="px-5 py-3 font-semibold">Current Budget</th>
                    <th className="px-5 py-3 font-semibold">Forecast Budget</th>
                    <th className="px-5 py-3 font-semibold">Hiring Cost</th>
                    <th className="px-5 py-3 font-semibold">Training Cost</th>
                    <th className="px-5 py-3 font-semibold">Variance</th>
                    <th className="px-5 py-3 font-semibold">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800">
                  {plans.length === 0 ? (
                    <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">No budget plans found.</td></tr>
                  ) : (
                    plans.map((b) => (
                      <tr key={b.id} className="transition duration-200 hover:bg-slate-900/80">
                        <td className="px-5 py-4"><span className="text-white font-medium">{b.department}</span></td>
                        <td className="px-5 py-4 text-slate-400">${(b.currentBudget / 1000000).toFixed(1)}M</td>
                        <td className="px-5 py-4 text-slate-400">${(b.forecastBudget / 1000000).toFixed(1)}M</td>
                        <td className="px-5 py-4 text-slate-400">${(b.hiringCost / 1000).toFixed(0)}K</td>
                        <td className="px-5 py-4 text-slate-400">${(b.trainingCost / 1000).toFixed(0)}K</td>
                        <td className="px-5 py-4">
                          <span className={`font-medium ${b.variance > 0 ? "text-emerald-400" : b.variance < 0 ? "text-rose-400" : "text-slate-400"}`}>
                            {b.variance > 0 ? "+" : ""}{b.variance > 0 ? "+" : ""}${(Math.abs(b.variance) / 1000000).toFixed(1)}M
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <button type="button" onClick={() => openEdit(b)} className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white">Edit</button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </section>
        </>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white">{editId ? "Edit Budget Plan" : "Create Budget Plan"}</h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Department</label>
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Current Budget ($)</label>
                  <input type="number" value={formData.currentBudget} onChange={(e) => setFormData({ ...formData, currentBudget: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Forecast Budget ($)</label>
                  <input type="number" value={formData.forecastBudget} onChange={(e) => setFormData({ ...formData, forecastBudget: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Hiring Cost ($)</label>
                  <input type="number" value={formData.hiringCost} onChange={(e) => setFormData({ ...formData, hiringCost: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Training Cost ($)</label>
                  <input type="number" value={formData.trainingCost} onChange={(e) => setFormData({ ...formData, trainingCost: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
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
