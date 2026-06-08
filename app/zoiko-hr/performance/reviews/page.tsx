"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, UserCheck } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchReviews, fetchCycles, createReview, updateReview, deleteReview,
  type PerformanceReviewRecord, type ReviewCycleRecord,
} from "../../../lib/workforce-api";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function ReviewsPage() {
  const [reviews, setReviews] = useState<PerformanceReviewRecord[]>([]);
  const [cycles, setCycles] = useState<ReviewCycleRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [cycleFilter, setCycleFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employeeId: "", reviewerId: "", cycleId: "",
    overallRating: "", status: "DRAFT", strengths: "", improvements: "", notes: "",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const [revRes, cycRes] = await Promise.all([
        fetchReviews({
          search: search || undefined, status: statusFilter || undefined,
          cycleId: cycleFilter || undefined, skip: page * pageSize, take: pageSize,
        }),
        fetchCycles({ take: 100 }),
      ]);
      setReviews(revRes.data);
      setTotal(revRes.total);
      setCycles(cycRes.data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reviews.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, statusFilter, cycleFilter, page]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreate = () => {
    setEditId(null);
    setFormData({ employeeId: "", reviewerId: "", cycleId: "", overallRating: "", status: "DRAFT", strengths: "", improvements: "", notes: "" });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (r: PerformanceReviewRecord) => {
    setEditId(r.id);
    setFormData({
      employeeId: r.employeeId, reviewerId: r.reviewerId ?? "", cycleId: r.cycleId,
      overallRating: r.overallRating?.toString() ?? "", status: r.status,
      strengths: r.strengths ?? "", improvements: r.improvements ?? "", notes: r.notes ?? "",
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!formData.employeeId || !formData.cycleId) {
      setFormError("Employee and Review Cycle are required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        employeeId: formData.employeeId,
        reviewerId: formData.reviewerId || undefined,
        cycleId: formData.cycleId,
        overallRating: formData.overallRating ? parseInt(formData.overallRating, 10) : undefined,
        status: formData.status || undefined,
        strengths: formData.strengths || undefined,
        improvements: formData.improvements || undefined,
        notes: formData.notes || undefined,
      };

      if (editId) {
        await updateReview(editId, body);
        showToast("success", "Review updated successfully.");
      } else {
        await createReview(body);
        showToast("success", "Review created successfully.");
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save review.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteReview(deleteId);
      showToast("success", "Review deleted.");
      setDeleteId(null);
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete review.");
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  const ratingOptions = [1, 2, 3, 4, 5];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Performance Reviews"
        description="Manage employee performance reviews across review cycles."
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
            <Plus className="h-4 w-4" /> New Review
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
          <input
            type="text" placeholder="Search by employee..."
            value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
          />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Status</option>
          <option value="DRAFT">Draft</option>
          <option value="SUBMITTED">Submitted</option>
          <option value="ACKNOWLEDGED">Acknowledged</option>
        </select>
        <select value={cycleFilter} onChange={(e) => { setCycleFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Cycles</option>
          {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Reviews <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Reviewer</th>
                  <th className="px-5 py-3 font-semibold">Cycle</th>
                  <th className="px-5 py-3 font-semibold">Rating</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {reviews.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No reviews found.</td>
                  </tr>
                ) : (
                  reviews.map((r) => (
                    <tr key={r.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white">{r.employee ? `${r.employee.firstName} ${r.employee.lastName}` : r.employeeId}</p>
                        <p className="mt-0.5 text-xs text-slate-500">{r.employee?.employeeId}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">
                        {r.reviewer ? `${r.reviewer.firstName} ${r.reviewer.lastName}` : "—"}
                      </td>
                      <td className="px-5 py-4 text-slate-400">{r.cycle?.name}</td>
                      <td className="px-5 py-4">
                        {r.overallRating ? <span className="text-amber-400 font-semibold">{r.overallRating}/5</span> : "—"}
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={r.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openEdit(r)}
                            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition">
                            Edit
                          </button>
                          <button type="button" onClick={() => setDeleteId(r.id)}
                            className="rounded-3xl bg-rose-600/20 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-600/30 transition">
                            Delete
                          </button>
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
              <h3 className="text-lg font-semibold text-white">{editId ? "Edit Review" : "New Review"}</h3>
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
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Reviewer ID</label>
                <input type="text" value={formData.reviewerId} onChange={(e) => setFormData((f) => ({ ...f, reviewerId: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500"
                  placeholder="Optional" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Review Cycle *</label>
                <select value={formData.cycleId} onChange={(e) => setFormData((f) => ({ ...f, cycleId: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  <option value="">Select cycle</option>
                  {cycles.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Rating</label>
                  <select value={formData.overallRating} onChange={(e) => setFormData((f) => ({ ...f, overallRating: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    <option value="">—</option>
                    {ratingOptions.map((n) => <option key={n} value={n}>{n}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    <option value="DRAFT">Draft</option>
                    <option value="SUBMITTED">Submitted</option>
                    <option value="ACKNOWLEDGED">Acknowledged</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Strengths</label>
                <textarea value={formData.strengths} onChange={(e) => setFormData((f) => ({ ...f, strengths: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Improvements</label>
                <textarea value={formData.improvements} onChange={(e) => setFormData((f) => ({ ...f, improvements: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Notes</label>
                <textarea value={formData.notes} onChange={(e) => setFormData((f) => ({ ...f, notes: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500 resize-none" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">
                Cancel
              </button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition inline-flex items-center gap-2">
                {saving ? <><UserCheck className="h-4 w-4 animate-spin" /> Saving...</> : (editId ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this review? This action can be undone by an administrator.</p>
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
