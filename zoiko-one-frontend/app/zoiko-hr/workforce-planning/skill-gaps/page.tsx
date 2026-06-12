"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchWFSkillGaps, createWFSkillGap,
  type WFSkillGap,
} from "../../../lib/workforce-api";

const DEPARTMENTS = ["Engineering", "Data", "Sales", "Marketing", "Finance", "HR", "Operations"];
const PRIORITIES = ["All", "CRITICAL", "HIGH", "MEDIUM", "LOW"];

export default function SkillGapAnalysisPage() {
  const [gaps, setGaps] = useState<WFSkillGap[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [deptFilter, setDeptFilter] = useState("");

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ department: "Engineering", currentSkills: "", requiredSkills: "", priority: "MEDIUM", recommendedTraining: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetchWFSkillGaps({
      search: search || undefined,
      priority: priorityFilter !== "All" ? priorityFilter : undefined,
      department: deptFilter || undefined,
    })
      .then((res) => { if (!cancelled) { setGaps(res.data); setLoading(false); } })
      .catch(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [search, priorityFilter, deptFilter]);

  const openCreate = () => {
    setFormData({ department: "Engineering", currentSkills: "", requiredSkills: "", priority: "MEDIUM", recommendedTraining: "" }); setFormError(""); setShowForm(true);
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.currentSkills.trim() || !formData.requiredSkills.trim()) { setFormError("Current and required skills are required."); return; }
    setSubmitting(true); setFormError("");
    try {
      await createWFSkillGap({
        department: formData.department,
        currentSkills: formData.currentSkills.split(",").map((s) => s.trim()),
        requiredSkills: formData.requiredSkills.split(",").map((s) => s.trim()),
        priority: formData.priority,
        recommendedTraining: formData.recommendedTraining,
      });
      setToast("Skill gap created."); setShowForm(false);
      const res = await fetchWFSkillGaps({ priority: priorityFilter !== "All" ? priorityFilter : undefined, department: deptFilter || undefined });
      setGaps(res.data);
    } catch (err) { setFormError(err instanceof Error ? err.message : "Operation failed."); }
    finally { setSubmitting(false); }
  };

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); } }, [toast]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Skill Gap Analysis"
        description="Identify skill gaps and plan training across departments."
        action={
          <button type="button" onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Add Skill Gap
          </button>
        }
      />
      {toast && <div className="mb-4 rounded-2xl bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-300 border border-emerald-500/20">{toast}</div>}
      {error && <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search skills..." value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[160px]">
          <option value="">All Departments</option>
          {DEPARTMENTS.map((d) => <option key={d} value={d}>{d}</option>)}
        </select>
        <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[140px]">
          {PRIORITIES.map((p) => <option key={p} value={p}>{p.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {gaps.length === 0 ? (
            <div className="col-span-full py-20 text-center text-sm text-slate-500">No skill gaps found.</div>
          ) : (
            gaps.map((g) => (
              <div key={g.id} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <div className="mb-3 flex items-start justify-between">
                  <div>
                    <h3 className="text-base font-semibold text-white">{g.department}</h3>
                    <StatusBadge status={g.priority} />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Current Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {g.currentSkills.map((s, i) => (
                        <span key={i} className="rounded-full bg-slate-800 px-2.5 py-1 text-xs text-slate-300">{s}</span>
                      ))}
                    </div>
                  </div>
                  <div>
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Required Skills</p>
                    <div className="flex flex-wrap gap-1.5">
                      {g.requiredSkills.map((s, i) => (
                        <span key={i} className={`rounded-full px-2.5 py-1 text-xs ${g.skillGap.includes(s) ? "bg-rose-500/20 text-rose-400" : "bg-emerald-500/20 text-emerald-400"}`}>{s}</span>
                      ))}
                    </div>
                  </div>
                </div>
                {g.skillGap.length > 0 && (
                  <div className="mt-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Skill Gaps</p>
                    <p className="text-sm text-rose-400">{g.skillGap.join(", ")}</p>
                  </div>
                )}
                {g.recommendedTraining && (
                  <div className="mt-3 border-t border-slate-800 pt-3">
                    <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-slate-500">Recommended Training</p>
                    <p className="text-sm text-indigo-400">{g.recommendedTraining}</p>
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
            <h3 className="text-lg font-semibold text-white">Add Skill Gap</h3>
            <form onSubmit={handleCreate} className="mt-5 space-y-4">
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
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
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Current Skills (comma separated)</label>
                <input type="text" value={formData.currentSkills} onChange={(e) => setFormData({ ...formData, currentSkills: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. JavaScript, Python, SQL" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Required Skills (comma separated)</label>
                <input type="text" value={formData.requiredSkills} onChange={(e) => setFormData({ ...formData, requiredSkills: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. Kubernetes, Go, Rust" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Recommended Training</label>
                <textarea value={formData.recommendedTraining} onChange={(e) => setFormData({ ...formData, recommendedTraining: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" rows={2} placeholder="e.g. Cloud Native Certification" />
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
