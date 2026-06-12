"use client";

import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchWFCapacityPlans, createWFCapacityPlan, type WFCapacityPlan } from "../../../lib/workforce-api";

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Operations", "Legal", "Data"];

export default function CapacityPlanningPage() {
  const [plans, setPlans] = useState<WFCapacityPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ department: "Engineering", availableCapacity: "0", requiredCapacity: "0" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    try {
      const res = await fetchWFCapacityPlans();
      setPlans(res.data);
    } catch (err) { setError(err instanceof Error ? err.message : "Failed to load capacity plans."); }
  };

  useEffect(() => {
    let cancelled = false;
    fetchWFCapacityPlans()
      .then((res) => { if (!cancelled) { setPlans(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, []);

  const openCreate = () => {
    setFormData({ department: "Engineering", availableCapacity: "0", requiredCapacity: "0" }); setFormError(""); setShowForm(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setFormError("");
    try {
      await createWFCapacityPlan({ department: formData.department, availableCapacity: parseInt(formData.availableCapacity) || 0, requiredCapacity: parseInt(formData.requiredCapacity) || 0 });
      setToast("Capacity plan created."); setShowForm(false); loadData();
      const res = await fetchWFCapacityPlans();
      setPlans(res.data);
    } catch (err) { setFormError(err instanceof Error ? err.message : "Operation failed."); }
    finally { setSubmitting(false); }
  };

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); } }, [toast]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Capacity Planning"
        description="Analyze workforce capacity and utilization across departments."
        action={
          <button type="button" onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Add Capacity
          </button>
        }
      />
      {toast && <div className="mb-4 rounded-2xl bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-300 border border-emerald-500/20">{toast}</div>}
      {error && <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Department Capacity</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[850px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Available</th>
                  <th className="px-5 py-3 font-semibold">Required</th>
                  <th className="px-5 py-3 font-semibold">Utilization</th>
                  <th className="px-5 py-3 font-semibold">Gap</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {plans.length === 0 ? (
                  <tr><td colSpan={5} className="px-5 py-8 text-center text-sm text-slate-500">No capacity plans found.</td></tr>
                ) : (
                  plans.map((c, i) => (
                    <tr key={i} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4"><span className="text-white font-medium">{c.department}</span></td>
                      <td className="px-5 py-4 text-slate-400">{c.availableCapacity}</td>
                      <td className="px-5 py-4 text-slate-400">{c.requiredCapacity}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-800">
                            <div className={`h-full rounded-full ${c.utilization >= 90 ? "bg-emerald-500" : c.utilization >= 75 ? "bg-amber-500" : "bg-rose-500"}`}
                              style={{ width: `${Math.min(c.utilization, 100)}%` }} />
                          </div>
                          <span className={`text-xs font-medium ${c.utilization >= 90 ? "text-emerald-400" : c.utilization >= 75 ? "text-amber-400" : "text-rose-400"}`}>
                            {c.utilization}%
                          </span>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <span className={`font-medium ${c.gap > 0 ? "text-rose-400" : "text-emerald-400"}`}>
                          {c.gap > 0 ? `+${c.gap}` : c.gap}
                        </span>
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
            <h3 className="text-lg font-semibold text-white">Add Capacity Plan</h3>
            <form onSubmit={handleCreate} className="mt-5 space-y-4">
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
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Available Capacity</label>
                  <input type="number" value={formData.availableCapacity} onChange={(e) => setFormData({ ...formData, availableCapacity: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Required Capacity</label>
                  <input type="number" value={formData.requiredCapacity} onChange={(e) => setFormData({ ...formData, requiredCapacity: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {submitting ? "Adding..." : "Add"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
