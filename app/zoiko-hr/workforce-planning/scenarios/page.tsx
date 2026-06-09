"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchWFScenarioPlans, createWFScenarioPlan,
  type WFScenarioPlan,
} from "../../../lib/workforce-api";

const SCENARIO_TYPES = ["All", "GROWTH", "STABLE", "COST_REDUCTION", "EXPANSION"];

export default function ScenarioPlanningPage() {
  const [scenarios, setScenarios] = useState<WFScenarioPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ name: "", scenarioType: "GROWTH", description: "", projectedHeadcount: "0", projectedBudget: "0", assumptions: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchWFScenarioPlans({ scenarioType: typeFilter !== "All" ? typeFilter : undefined })
      .then((res) => { if (!cancelled) { setScenarios(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [typeFilter]);

  const openCreate = () => {
    setFormData({ name: "", scenarioType: "GROWTH", description: "", projectedHeadcount: "0", projectedBudget: "0", assumptions: "" }); setFormError(""); setShowForm(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) { setFormError("Scenario name is required."); return; }
    setSubmitting(true); setFormError("");
    try {
      await createWFScenarioPlan({
        name: formData.name,
        scenarioType: formData.scenarioType,
        description: formData.description,
        projectedHeadcount: parseInt(formData.projectedHeadcount) || 0,
        projectedBudget: parseInt(formData.projectedBudget) || 0,
        assumptions: formData.assumptions.split(",").map((a) => a.trim()).filter(Boolean),
      });
      setToast("Scenario created."); setShowForm(false);
      const res = await fetchWFScenarioPlans({ scenarioType: typeFilter !== "All" ? typeFilter : undefined });
      setScenarios(res.data);
    } catch (err) { setFormError(err instanceof Error ? err.message : "Operation failed."); }
    finally { setSubmitting(false); }
  };

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); } }, [toast]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Scenario Planning"
        description="Model workforce scenarios for strategic decision making."
        action={
          <button type="button" onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Create Scenario
          </button>
        }
      />
      {toast && <div className="mb-4 rounded-2xl bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-300 border border-emerald-500/20">{toast}</div>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[180px]">
          {SCENARIO_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {scenarios.length === 0 ? (
            <div className="col-span-full py-20 text-center text-sm text-slate-500">No scenarios found.</div>
          ) : (
            scenarios.map((s) => (
              <div key={s.id} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{s.name}</h3>
                    <StatusBadge status={s.scenarioType.replace(/_/g, " ")} />
                  </div>
                </div>
                <p className="text-sm text-slate-400">{s.description}</p>
                <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                  <div className="rounded-2xl bg-slate-900/50 p-3">
                    <p className="text-xs text-slate-500">Projected Headcount</p>
                    <p className="text-lg font-semibold text-white">{s.projectedHeadcount}</p>
                  </div>
                  <div className="rounded-2xl bg-slate-900/50 p-3">
                    <p className="text-xs text-slate-500">Projected Budget</p>
                    <p className="text-lg font-semibold text-white">${(s.projectedBudget / 1000000).toFixed(1)}M</p>
                  </div>
                </div>
                {s.assumptions.length > 0 && (
                  <div className="mt-4 border-t border-slate-800 pt-4">
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-slate-500">Assumptions</p>
                    <div className="flex flex-wrap gap-2">
                      {s.assumptions.map((a, i) => (
                        <span key={i} className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{a}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ))
          )}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white">Create Scenario</h3>
            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Scenario Name</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. Aggressive Growth" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Scenario Type</label>
                <select value={formData.scenarioType} onChange={(e) => setFormData({ ...formData, scenarioType: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  {SCENARIO_TYPES.filter((t) => t !== "All").map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" rows={2} placeholder="Scenario description..." />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Projected Headcount</label>
                  <input type="number" value={formData.projectedHeadcount} onChange={(e) => setFormData({ ...formData, projectedHeadcount: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Projected Budget ($)</label>
                  <input type="number" value={formData.projectedBudget} onChange={(e) => setFormData({ ...formData, projectedBudget: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Assumptions (comma separated)</label>
                <input type="text" value={formData.assumptions} onChange={(e) => setFormData({ ...formData, assumptions: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. New funding secured, Market expansion" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {submitting ? "Creating..." : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
