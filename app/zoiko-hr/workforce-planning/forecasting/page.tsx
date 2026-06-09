"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchWFWorkforceForecasts, createWFWorkforceForecast,
  type WFWorkforceForecast,
} from "../../../lib/workforce-api";

const PERIODS = ["All", "QUARTERLY", "BI_ANNUAL", "ANNUAL"];
const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Operations"];

export default function WorkforceForecastingPage() {
  const [forecasts, setForecasts] = useState<WFWorkforceForecast[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [periodFilter, setPeriodFilter] = useState("All");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ department: "Engineering", currentEmployees: "0", predictedAttrition: "0", predictedHiring: "0", forecastPeriod: "ANNUAL" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchWFWorkforceForecasts({ period: periodFilter !== "All" ? periodFilter : undefined })
      .then((res) => { if (!cancelled) { setForecasts(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [periodFilter]);

  const filtered = forecasts.filter((f) => {
    if (search && !f.department.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const openCreate = () => {
    setFormData({ department: "Engineering", currentEmployees: "0", predictedAttrition: "0", predictedHiring: "0", forecastPeriod: "ANNUAL" }); setFormError(""); setShowForm(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setFormError("");
    try {
      await createWFWorkforceForecast({
        department: formData.department,
        currentEmployees: parseInt(formData.currentEmployees) || 0,
        predictedAttrition: parseInt(formData.predictedAttrition) || 0,
        predictedHiring: parseInt(formData.predictedHiring) || 0,
        forecastPeriod: formData.forecastPeriod,
      });
      setToast("Forecast created."); setShowForm(false);
      const res = await fetchWFWorkforceForecasts({ period: periodFilter !== "All" ? periodFilter : undefined });
      setForecasts(res.data);
    } catch (err) { setFormError(err instanceof Error ? err.message : "Operation failed."); }
    finally { setSubmitting(false); }
  };

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); } }, [toast]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Workforce Forecasting"
        description="Predict workforce needs based on attrition and hiring trends."
        action={
          <button type="button" onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Create Forecast
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
        <select value={periodFilter} onChange={(e) => setPeriodFilter(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[160px]">
          {PERIODS.map((p) => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Forecasts</h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w=[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Current</th>
                  <th className="px-5 py-3 font-semibold">Predicted Attrition</th>
                  <th className="px-5 py-3 font-semibold">Predicted Hiring</th>
                  <th className="px-5 py-3 font-semibold">Forecasted</th>
                  <th className="px-5 py-3 font-semibold">Period</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {filtered.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No forecasts found.</td></tr>
                ) : (
                  filtered.map((f) => (
                    <tr key={f.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4"><span className="text-white font-medium">{f.department}</span></td>
                      <td className="px-5 py-4 text-slate-400">{f.currentEmployees}</td>
                      <td className="px-5 py-4 text-rose-400">{f.predictedAttrition}</td>
                      <td className="px-5 py-4 text-emerald-400">+{f.predictedHiring}</td>
                      <td className="px-5 py-4 font-medium text-white">{f.forecastedWorkforce}</td>
                      <td className="px-5 py-4"><StatusBadge status={f.forecastPeriod} /></td>
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
            <h3 className="text-lg font-semibold text-white">Create Forecast</h3>
            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Department</label>
                <select value={formData.department} onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Current Employees</label>
                  <input type="number" value={formData.currentEmployees} onChange={(e) => setFormData({ ...formData, currentEmployees: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Predicted Attrition</label>
                  <input type="number" value={formData.predictedAttrition} onChange={(e) => setFormData({ ...formData, predictedAttrition: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Predicted Hiring</label>
                  <input type="number" value={formData.predictedHiring} onChange={(e) => setFormData({ ...formData, predictedHiring: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Forecast Period</label>
                <select value={formData.forecastPeriod} onChange={(e) => setFormData({ ...formData, forecastPeriod: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  {PERIODS.filter((p) => p !== "All").map((p) => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
                </select>
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
