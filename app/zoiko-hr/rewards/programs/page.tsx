"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, Sparkles } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchRewardsRecognitionPrograms, createRewardsRecognitionProgram, updateRewardsRecognitionProgram, deleteRewardsRecognitionProgram, RewardsRecognitionProgram } from "../../../lib/workforce-api";

const types = ["PEER_RECOGNITION", "MANAGER_NOMINATION", "AUTO_RECOGNITION"];
const frequencies = ["MONTHLY", "QUARTERLY", "YEARLY", "ONGOING", "ONE_TIME"];

export default function RecognitionProgramsPage() {
  const [programs, setPrograms] = useState<RewardsRecognitionProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", description: "", type: "PEER_RECOGNITION", frequency: "MONTHLY", eligibilityCriteria: "", rewardAmount: "" });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadPrograms = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchRewardsRecognitionPrograms({ search: search || undefined, type: typeFilter || undefined });
      setPrograms(res.data);
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load programs");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPrograms();
  }, [search, typeFilter]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreate = () => {
    setEditId(null);
    setFormData({ name: "", description: "", type: "PEER_RECOGNITION", frequency: "MONTHLY", eligibilityCriteria: "", rewardAmount: "" });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (p: RewardsRecognitionProgram) => {
    setEditId(p.id);
    setFormData({ name: p.name, description: p.description ?? "", type: p.type, frequency: p.frequency, eligibilityCriteria: p.eligibilityCriteria ?? "", rewardAmount: p.rewardAmount?.toString() ?? "" });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!formData.name) { setFormError("Program name is required."); return; }
    setSaving(true);
    try {
      if (editId) {
        await updateRewardsRecognitionProgram(editId, {
          name: formData.name,
          description: formData.description || undefined,
          type: formData.type,
          frequency: formData.frequency,
          eligibilityCriteria: formData.eligibilityCriteria || undefined,
          rewardAmount: formData.rewardAmount ? Number(formData.rewardAmount) : undefined,
        });
        showToast("success", "Program updated successfully.");
      } else {
        await createRewardsRecognitionProgram({
          name: formData.name,
          description: formData.description || undefined,
          type: formData.type,
          frequency: formData.frequency,
          eligibilityCriteria: formData.eligibilityCriteria || undefined,
          rewardAmount: formData.rewardAmount ? Number(formData.rewardAmount) : undefined,
        });
        showToast("success", "Program created successfully.");
      }
      setShowForm(false);
      await loadPrograms();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Failed to save program");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteRewardsRecognitionProgram(deleteId);
      showToast("success", "Program deleted.");
      setDeleteId(null);
      await loadPrograms();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Failed to delete program");
      setDeleteId(null);
    }
  };

  const totalPages = Math.ceil(programs.length / pageSize);
  const start = programs.length > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, programs.length);
  const paged = programs.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Recognition Programs"
        description="Manage recognition programs that celebrate employee achievements and contributions."
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
            <Plus className="h-4 w-4" /> New Program
          </button>
        }
      />

      {toast && (
        <div className={`mb-4 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
          toast.type === "success" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" : "bg-rose-500/15 text-rose-300 border border-rose-500/20"
        }`}>
          {toast.message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search programs..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Types</option>
          {types.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Programs <span className="ml-2 text-sm font-normal text-slate-400">({programs.length})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Name</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Frequency</th>
                  <th className="px-5 py-3 font-semibold">Reward</th>
                  <th className="px-5 py-3 font-semibold">Participants</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paged.length === 0 ? (
                  <tr><td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">No programs found.</td></tr>
                ) : (
                  paged.map((p) => (
                    <tr key={p.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-violet-400" />
                          <div>
                            <p className="text-white font-medium">{p.name}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[250px]">{p.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={p.type} /></td>
                      <td className="px-5 py-4"><StatusBadge status={p.frequency} /></td>
                      <td className="px-5 py-4 text-slate-300">{p.rewardAmount ? `$${p.rewardAmount.toLocaleString()}` : "—"}</td>
                      <td className="px-5 py-4 text-slate-400">{p.participantCount}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openEdit(p)}
                            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition">Edit</button>
                          <button type="button" onClick={() => setDeleteId(p.id)}
                            className="rounded-3xl bg-rose-600/20 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-600/30 transition">Delete</button>
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
              <p className="text-xs text-slate-500">Showing {start}&ndash;{end} of {programs.length}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">{editId ? "Edit Program" : "New Program"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Name *</label>
                <input type="text" value={formData.name} onChange={(e) => setFormData((f) => ({ ...f, name: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    {types.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Frequency</label>
                  <select value={formData.frequency} onChange={(e) => setFormData((f) => ({ ...f, frequency: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    {frequencies.map((f) => <option key={f} value={f}>{f.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Eligibility Criteria</label>
                <textarea value={formData.eligibilityCriteria} onChange={(e) => setFormData((f) => ({ ...f, eligibilityCriteria: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Reward Amount ($)</label>
                <input type="number" min={0} value={formData.rewardAmount} onChange={(e) => setFormData((f) => ({ ...f, rewardAmount: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition inline-flex items-center gap-2">
                {saving ? <><Sparkles className="h-4 w-4 animate-spin" /> Saving...</> : (editId ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this program?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Cancel</button>
              <button type="button" onClick={handleDelete}
                className="rounded-3xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-500 transition">Delete</button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}