"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, Target, UserCheck } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchGoals, createGoal, updateGoal, deleteGoal, createGoalUpdate,
  type GoalRecord,
} from "../../../lib/workforce-api";

function todayStr() {
  return new Date().toISOString().split("T")[0];
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<GoalRecord[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    employeeId: "", title: "", description: "", category: "PERFORMANCE",
    startDate: todayStr(), targetDate: "", status: "NOT_STARTED", progress: "0", notes: "",
  });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [deleteId, setDeleteId] = useState<string | null>(null);

  const [updateGoalId, setUpdateGoalId] = useState<string | null>(null);
  const [updateText, setUpdateText] = useState("");
  const [newProgress, setNewProgress] = useState("");
  const [updating, setUpdating] = useState(false);

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchGoals({
        search: search || undefined, status: statusFilter || undefined,
        category: categoryFilter || undefined, skip: page * pageSize, take: pageSize,
      });
      setGoals(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load goals.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, statusFilter, categoryFilter, page]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreate = () => {
    setEditId(null);
    setFormData({
      employeeId: "", title: "", description: "", category: "PERFORMANCE",
      startDate: todayStr(), targetDate: "", status: "NOT_STARTED", progress: "0", notes: "",
    });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (g: GoalRecord) => {
    setEditId(g.id);
    setFormData({
      employeeId: g.employeeId, title: g.title, description: g.description ?? "",
      category: g.category, startDate: g.startDate.split("T")[0],
      targetDate: g.targetDate?.split("T")[0] ?? "",
      status: g.status, progress: g.progress.toString(), notes: g.notes ?? "",
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!formData.employeeId || !formData.title || !formData.startDate) {
      setFormError("Employee, Title, and Start Date are required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        employeeId: formData.employeeId, title: formData.title,
        description: formData.description || undefined, category: formData.category,
        startDate: formData.startDate, targetDate: formData.targetDate || undefined,
        status: formData.status, progress: parseInt(formData.progress, 10) || 0,
        notes: formData.notes || undefined,
      };

      if (editId) {
        await updateGoal(editId, body);
        showToast("success", "Goal updated successfully.");
      } else {
        await createGoal(body);
        showToast("success", "Goal created successfully.");
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save goal.");
    } finally { setSaving(false); }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteGoal(deleteId);
      showToast("success", "Goal deleted.");
      setDeleteId(null);
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to delete goal.");
    }
  };

  const handleUpdateGoal = async () => {
    if (!updateGoalId || !updateText) return;
    setUpdating(true);
    try {
      await createGoalUpdate(updateGoalId, {
        updateText,
        newProgress: newProgress ? parseInt(newProgress, 10) : undefined,
      });
      showToast("success", "Progress updated.");
      setUpdateGoalId(null);
      setUpdateText("");
      setNewProgress("");
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update goal.");
    } finally { setUpdating(false); }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Goals"
        description="Track employee goals and OKRs across the organization."
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
            <Plus className="h-4 w-4" /> New Goal
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
          <input type="text" placeholder="Search goals..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Status</option>
          <option value="NOT_STARTED">Not Started</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
          <option value="CANCELLED">Cancelled</option>
        </select>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Categories</option>
          <option value="PERFORMANCE">Performance</option>
          <option value="DEVELOPMENT">Development</option>
          <option value="PROJECT">Project</option>
          <option value="BEHAVIORAL">Behavioral</option>
          <option value="OTHER">Other</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Goals <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Title</th>
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Progress</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Target</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {goals.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-5 py-8 text-center text-sm text-slate-500">No goals found.</td>
                  </tr>
                ) : (
                  goals.map((g) => (
                    <tr key={g.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{g.title}</p>
                        {g.description && <p className="mt-0.5 text-xs text-slate-500 truncate max-w-[200px]">{g.description}</p>}
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white">{g.employee ? `${g.employee.firstName} ${g.employee.lastName}` : g.employeeId}</p>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={g.category} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <div className="h-1.5 w-16 rounded-full bg-slate-800 overflow-hidden">
                            <div className="h-full rounded-full bg-indigo-500" style={{ width: `${g.progress}%` }} />
                          </div>
                          <span className="text-xs text-slate-400">{g.progress}%</span>
                        </div>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={g.status} /></td>
                      <td className="px-5 py-4 text-slate-400 text-xs">
                        {g.targetDate ? new Date(g.targetDate).toLocaleDateString() : "—"}
                      </td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => {
                            setUpdateGoalId(g.id);
                            setUpdateText("");
                            setNewProgress(g.progress.toString());
                          }}
                            className="rounded-3xl bg-indigo-600/20 px-3 py-1.5 text-xs font-medium text-indigo-300 hover:bg-indigo-600/30 transition">
                            Update
                          </button>
                          <button type="button" onClick={() => openEdit(g)}
                            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition">
                            Edit
                          </button>
                          <button type="button" onClick={() => setDeleteId(g.id)}
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
              <h3 className="text-lg font-semibold text-white">{editId ? "Edit Goal" : "New Goal"}</h3>
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
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    <option value="PERFORMANCE">Performance</option>
                    <option value="DEVELOPMENT">Development</option>
                    <option value="PROJECT">Project</option>
                    <option value="BEHAVIORAL">Behavioral</option>
                    <option value="OTHER">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    <option value="NOT_STARTED">Not Started</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Start Date *</label>
                  <input type="date" value={formData.startDate} onChange={(e) => setFormData((f) => ({ ...f, startDate: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Target Date</label>
                  <input type="date" value={formData.targetDate} onChange={(e) => setFormData((f) => ({ ...f, targetDate: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Progress (%)</label>
                <input type="number" min={0} max={100} value={formData.progress} onChange={(e) => setFormData((f) => ({ ...f, progress: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
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
                {saving ? <><Target className="h-4 w-4 animate-spin" /> Saving...</> : (editId ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {updateGoalId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-lg font-semibold text-white">Update Progress</h3>
              <button type="button" onClick={() => setUpdateGoalId(null)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Progress (%)</label>
                <input type="number" min={0} max={100} value={newProgress} onChange={(e) => setNewProgress(e.target.value)}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Update Notes *</label>
                <textarea value={updateText} onChange={(e) => setUpdateText(e.target.value)} rows={3}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 placeholder-slate-500 resize-none"
                  placeholder="Describe the progress made..." />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setUpdateGoalId(null)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">
                Cancel
              </button>
              <button type="button" onClick={handleUpdateGoal} disabled={updating || !updateText}
                className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition inline-flex items-center gap-2">
                {updating ? <><Target className="h-4 w-4 animate-spin" /> Saving...</> : "Update"}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this goal?</p>
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
