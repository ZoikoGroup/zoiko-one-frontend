"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, Target, Gift, Award } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchAchievements, createAchievement, updateAchievement, deleteAchievement, AchievementRecord } from "../../../lib/workforce-api";

const categories = ["PROJECT_MILESTONE", "ATTENDANCE", "SKILL_MASTERY", "MENTORSHIP", "MILESTONE", "INNOVATION", "COLLABORATION", "LEADERSHIP", "PERFORMANCE", "CUSTOMER_SERVICE", "CULTURE"];

interface AchievementWithName extends AchievementRecord {
  employeeName: string;
}

export default function AchievementsPage() {
  const [achievements, setAchievements] = useState<AchievementWithName[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ employeeId: "", title: "", description: "", category: "SKILL_MASTERY", badgeIcon: "", criteria: "", unlockDate: new Date().toISOString().split("T")[0] });
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadAchievements = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetchAchievements({ search: search || undefined, category: categoryFilter || undefined, status: statusFilter || undefined });
      setAchievements(
        res.data.map((a) => ({
          ...a,
          employeeName: a.employee ? `${a.employee.firstName} ${a.employee.lastName}` : a.employeeId,
        })),
      );
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : "Failed to load achievements");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAchievements();
  }, [search, categoryFilter, statusFilter]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreate = () => {
    setEditId(null);
    setFormData({ employeeId: "", title: "", description: "", category: "SKILL_MASTERY", badgeIcon: "", criteria: "", unlockDate: new Date().toISOString().split("T")[0] });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (a: AchievementWithName) => {
    setEditId(a.id);
    setFormData({ employeeId: a.employeeId, title: a.title, description: a.description ?? "", category: a.category, badgeIcon: a.badgeIcon ?? "", criteria: a.criteria ?? "", unlockDate: a.unlockDate });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!formData.employeeId || !formData.title || !formData.unlockDate) {
      setFormError("Employee, Title, and Date are required.");
      return;
    }
    setSaving(true);
    try {
      if (editId) {
        await updateAchievement(editId, {
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category,
          badgeIcon: formData.badgeIcon || undefined,
          criteria: formData.criteria || undefined,
        });
        showToast("success", "Achievement updated successfully.");
      } else {
        await createAchievement({
          employeeId: formData.employeeId,
          title: formData.title,
          description: formData.description || undefined,
          category: formData.category,
          badgeIcon: formData.badgeIcon || undefined,
          criteria: formData.criteria || undefined,
          unlockDate: formData.unlockDate,
        });
        showToast("success", "Achievement created successfully.");
      }
      setShowForm(false);
      await loadAchievements();
    } catch (e: unknown) {
      setFormError(e instanceof Error ? e.message : "Failed to save achievement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await deleteAchievement(deleteId);
      showToast("success", "Achievement deleted.");
      setDeleteId(null);
      await loadAchievements();
    } catch (e: unknown) {
      showToast("error", e instanceof Error ? e.message : "Failed to delete achievement");
      setDeleteId(null);
    }
  };

  const totalPages = Math.ceil(achievements.length / pageSize);
  const start = achievements.length > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, achievements.length);
  const paged = achievements.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Achievement Tracking"
        description="Track employee achievements, milestones, and unlocked badges across the organization."
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
            <Plus className="h-4 w-4" /> New Achievement
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
          <input type="text" placeholder="Search achievements..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Categories</option>
          {categories.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Status</option>
          <option value="UNLOCKED">Unlocked</option>
          <option value="LOCKED">Locked</option>
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Achievements <span className="ml-2 text-sm font-normal text-slate-400">({achievements.length})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[950px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Achievement</th>
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Unlocked</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {paged.length === 0 ? (
                  <tr><td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No achievements found.</td></tr>
                ) : (
                  paged.map((a) => (
                    <tr key={a.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <Gift className={`h-4 w-4 ${a.status === "UNLOCKED" ? "text-amber-400" : "text-slate-600"}`} />
                          <div>
                            <p className="text-white font-medium">{a.title}</p>
                            <p className="text-xs text-slate-500 truncate max-w-[250px]">{a.description}</p>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-4">
                        <p className="text-white">{a.employeeName}</p>
                        <p className="text-xs text-slate-500">{a.employeeId}</p>
                      </td>
                      <td className="px-5 py-4"><StatusBadge status={a.category} /></td>
                      <td className="px-5 py-4 text-slate-400 text-xs">{new Date(a.unlockDate).toLocaleDateString()}</td>
                      <td className="px-5 py-4"><StatusBadge status={a.status} /></td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openEdit(a)}
                            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition">Edit</button>
                          <button type="button" onClick={() => setDeleteId(a.id)}
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
              <p className="text-xs text-slate-500">Showing {start}&ndash;{end} of {achievements.length}</p>
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
              <h3 className="text-lg font-semibold text-white">{editId ? "Edit Achievement" : "New Achievement"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Employee ID *</label>
                <input type="text" value={formData.employeeId} onChange={(e) => setFormData((f) => ({ ...f, employeeId: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="EMP-001" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Title *</label>
                <input type="text" value={formData.title} onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Category</label>
                  <select value={formData.category} onChange={(e) => setFormData((f) => ({ ...f, category: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    {categories.map((c) => <option key={c} value={c}>{c.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Date Unlocked *</label>
                  <input type="date" value={formData.unlockDate} onChange={(e) => setFormData((f) => ({ ...f, unlockDate: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white [color-scheme:dark] outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Badge Icon</label>
                <input type="text" value={formData.badgeIcon} onChange={(e) => setFormData((f) => ({ ...f, badgeIcon: e.target.value }))}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="trophy, star, code, etc." />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Criteria</label>
                <textarea value={formData.criteria} onChange={(e) => setFormData((f) => ({ ...f, criteria: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500 resize-none" />
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition inline-flex items-center gap-2">
                {saving ? <><Award className="h-4 w-4 animate-spin" /> Saving...</> : (editId ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this achievement?</p>
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