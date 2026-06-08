"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, MessageSquare, UserCheck, Shield } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchFeedbacks, createFeedback, deleteFeedback,
  type FeedbackRecord,
} from "../../../lib/workforce-api";

export default function FeedbackPage() {
  const [feedbacks, setFeedbacks] = useState<FeedbackRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    employeeId: "", giverId: "", type: "PEER", category: "", content: "", isConfidential: false,
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchFeedbacks({
        search: search || undefined, type: typeFilter || undefined,
        skip: page * pageSize, take: pageSize,
      });
      setFeedbacks(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load feedback.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, typeFilter, page]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleSave = async () => {
    setFormError("");
    if (!formData.employeeId || !formData.content) {
      setFormError("Employee and Content are required.");
      return;
    }
    setSaving(true);
    try {
      await createFeedback({
        employeeId: formData.employeeId,
        giverId: formData.giverId || undefined,
        type: formData.type,
        category: formData.category || undefined,
        content: formData.content,
        isConfidential: formData.isConfidential,
      });
      showToast("success", "Feedback submitted successfully.");
      setShowForm(false);
      setFormData({ employeeId: "", giverId: "", type: "PEER", category: "", content: "", isConfidential: false });
      loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to submit feedback.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteFeedback(deleteId);
      showToast("success", "Feedback deleted.");
      setDeleteId(null);
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete feedback.");
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Feedback"
        description="Continuous feedback from peers, managers, and self-assessments."
        action={
          <button type="button" onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
            <Plus className="h-4 w-4" /> New Feedback
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
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search feedback..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Types</option>
          <option value="PEER">Peer</option>
          <option value="MANAGER">Manager</option>
          <option value="SELF">Self</option>
          <option value="SUBORDINATE">Subordinate</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Feedback Entries <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Giver</th>
                  <th className="px-5 py-3 font-semibold">Type</th>
                  <th className="px-5 py-3 font-semibold">Content</th>
                  <th className="px-5 py-3 font-semibold">Confidential</th>
                  <th className="px-5 py-3 font-semibold">Date</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {feedbacks.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">No feedback found.</td>
                  </tr>
                ) : (
                  feedbacks.map((f) => (
                    <tr key={f.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white">{f.employee ? `${f.employee.firstName} ${f.employee.lastName}` : f.employeeId}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {f.giver ? `${f.giver.firstName} ${f.giver.lastName}` : "—"}
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={f.type} /></td>
                      <td className="px-5 py-4">
                        <p className="text-slate-300 max-w-[250px] truncate" title={f.content}>{f.content}</p>
                      </td>
                      <td className="px-5 py-4">
                        {f.isConfidential ? <Shield className="h-4 w-4 text-amber-400" /> : <span className="text-slate-600">—</span>}
                      </td>
                      <td className="px-5 py-4 text-xs text-slate-400">
                        {new Date(f.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => setDeleteId(f.id)}
                          className="rounded-3xl bg-rose-600/20 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-600/30 transition">
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
              <p className="text-xs text-slate-500">Showing {start}–{end} of {total}</p>
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

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">New Feedback</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Employee ID *</label>
                <input type="text" value={formData.employeeId} onChange={(e) => setFormData((f) => ({ ...f, employeeId: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500"
                  placeholder="emp-001" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Giver ID (leave blank for self)</label>
                <input type="text" value={formData.giverId} onChange={(e) => setFormData((f) => ({ ...f, giverId: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500"
                  placeholder="Optional" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Type</label>
                  <select value={formData.type} onChange={(e) => setFormData((f) => ({ ...f, type: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    <option value="PEER">Peer</option>
                    <option value="MANAGER">Manager</option>
                    <option value="SELF">Self</option>
                    <option value="SUBORDINATE">Subordinate</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                  <input type="text" value={formData.category} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500"
                    placeholder="e.g. Leadership" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Content *</label>
                <textarea value={formData.content} onChange={(e) => setFormData((f) => ({ ...f, content: e.target.value }))} rows={4}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500 resize-none"
                  placeholder="Write your feedback here..." />
              </div>
              <label className="flex items-center gap-3 cursor-pointer">
                <input type="checkbox" checked={formData.isConfidential} onChange={(e) => setFormData((f) => ({ ...f, isConfidential: e.target.checked }))}
                  className="h-4 w-4 rounded border-slate-700 bg-slate-900 text-indigo-600 focus:ring-indigo-500" />
                <span className="text-sm text-slate-300">Mark as confidential</span>
              </label>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition inline-flex items-center gap-2">
                {saving ? <><MessageSquare className="h-4 w-4 animate-spin" /> Submitting...</> : "Submit Feedback"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this feedback entry?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">
                Cancel
              </button>
              <button type="button" onClick={handleDelete}
                className="rounded-3xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-500 transition">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
