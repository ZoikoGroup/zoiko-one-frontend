"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchWFSuccessionPlans, createWFSuccessionPlan, updateWFSuccessionPlan,
  type WFSuccessionPlan, type WfReadinessLevel, type WfRiskLevel,
} from "../../../lib/workforce-api";

const READINESS_LEVELS = ["READY_NOW", "READY_1_2_YEARS", "READY_3_5_YEARS", "DEVELOPMENT_NEEDED"];
const RISK_LEVELS = ["All", "LOW", "MEDIUM", "HIGH", "CRITICAL"];

export default function SuccessionPlanningPage() {
  const [plans, setPlans] = useState<WFSuccessionPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ criticalRole: "", currentEmployee: "", potentialSuccessor: "", readinessLevel: "DEVELOPMENT_NEEDED", developmentPlan: "", riskLevel: "MEDIUM" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    try {
      const res = await fetchWFSuccessionPlans({ search: search || undefined, riskLevel: riskFilter !== "All" ? riskFilter : undefined });
      setPlans(res.data);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load succession plans."); }
  };

  useEffect(() => {
    let cancelled = false;
    fetchWFSuccessionPlans({ search: search || undefined, riskLevel: riskFilter !== "All" ? riskFilter : undefined })
      .then((res) => { if (!cancelled) { setPlans(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, riskFilter]);

  const openCreate = () => {
    setEditId(null); setFormData({ criticalRole: "", currentEmployee: "", potentialSuccessor: "", readinessLevel: "DEVELOPMENT_NEEDED", developmentPlan: "", riskLevel: "MEDIUM" }); setFormError(""); setShowForm(true);
  };

  const openEdit = (plan: WFSuccessionPlan) => {
    setEditId(plan.id); setFormData({ criticalRole: plan.criticalRole, currentEmployee: plan.currentEmployee, potentialSuccessor: plan.potentialSuccessor, readinessLevel: plan.readinessLevel, developmentPlan: plan.developmentPlan, riskLevel: plan.riskLevel }); setFormError(""); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.criticalRole.trim()) { setFormError("Critical role is required."); return; }
    setSubmitting(true); setFormError("");
    try {
      if (editId) {
        await updateWFSuccessionPlan(editId, { criticalRole: formData.criticalRole, currentEmployee: formData.currentEmployee, potentialSuccessor: formData.potentialSuccessor, readinessLevel: formData.readinessLevel as WfReadinessLevel, developmentPlan: formData.developmentPlan, riskLevel: formData.riskLevel as WfRiskLevel });
        setToast("Succession plan updated.");
      } else {
        await createWFSuccessionPlan({ criticalRole: formData.criticalRole, currentEmployee: formData.currentEmployee, potentialSuccessor: formData.potentialSuccessor, readinessLevel: formData.readinessLevel, developmentPlan: formData.developmentPlan, riskLevel: formData.riskLevel });
        setToast("Succession plan created.");
      }
      setShowForm(false); loadData();
    } catch (err) { setFormError(err instanceof Error ? err.message : "Operation failed."); }
    finally { setSubmitting(false); }
  };

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); } }, [toast]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Succession Planning"
        description="Identify and develop future leaders for critical roles."
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
          <input type="text" placeholder="Search roles or employees..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[140px]">
          {RISK_LEVELS.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Succession Plans</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1050px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Critical Role</th>
                  <th className="px-5 py-3 font-semibold">Current Employee</th>
                  <th className="px-5 py-3 font-semibold">Potential Successor</th>
                  <th className="px-5 py-3 font-semibold">Readiness</th>
                  <th className="px-5 py-3 font-semibold">Risk</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {plans.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No succession plans found.</td></tr>
                ) : (
                  plans.map((p) => (
                    <tr key={p.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4"><span className="text-white font-medium">{p.criticalRole}</span></td>
                      <td className="px-5 py-4 text-slate-400">{p.currentEmployee}</td>
                      <td className="px-5 py-4 text-slate-400">{p.potentialSuccessor}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.readinessLevel.replace(/_/g, " ")} /></td>
                      <td className="px-5 py-4">
                        <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium uppercase tracking-wider ${
                          p.riskLevel === "CRITICAL" || p.riskLevel === "HIGH" ? "bg-rose-500/20 text-rose-400" :
                          p.riskLevel === "MEDIUM" ? "bg-amber-500/20 text-amber-400" :
                          "bg-emerald-500/20 text-emerald-400"
                        }`}>{p.riskLevel}</span>
                      </td>
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => openEdit(p)} className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white">Edit</button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white">{editId ? "Edit Succession Plan" : "Create Succession Plan"}</h3>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Critical Role</label>
                  <input type="text" value={formData.criticalRole} onChange={(e) => setFormData({ ...formData, criticalRole: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. CTO" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Risk Level</label>
                  <select value={formData.riskLevel} onChange={(e) => setFormData({ ...formData, riskLevel: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    {RISK_LEVELS.filter((r) => r !== "All").map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Current Employee</label>
                  <input type="text" value={formData.currentEmployee} onChange={(e) => setFormData({ ...formData, currentEmployee: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. Alice Chen" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Potential Successor</label>
                  <input type="text" value={formData.potentialSuccessor} onChange={(e) => setFormData({ ...formData, potentialSuccessor: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. Bob Kumar" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Readiness Level</label>
                <select value={formData.readinessLevel} onChange={(e) => setFormData({ ...formData, readinessLevel: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  {READINESS_LEVELS.map((r) => <option key={r} value={r}>{r.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Development Plan</label>
                <textarea value={formData.developmentPlan} onChange={(e) => setFormData({ ...formData, developmentPlan: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" rows={2} placeholder="e.g. Executive Leadership Program" />
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
