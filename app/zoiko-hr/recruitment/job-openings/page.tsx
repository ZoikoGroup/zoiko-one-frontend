"use client";

import { useEffect, useState } from "react";
import { Search, Plus, ChevronLeft, ChevronRight, X, Briefcase } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchJobOpenings, createJobOpening, updateJobOpening, closeJobOpening,
  type JobOpening, type JobStatus,
} from "../../../lib/workforce-api";

const EMPLOYMENT_TYPES = ["FULL_TIME", "PART_TIME", "CONTRACT", "INTERN", "TEMPORARY"];
const JOB_STATUSES = ["OPEN", "CLOSED", "DRAFT", "ON_HOLD"];

const defaultFormData = {
  title: "", department: "", location: "", employmentType: "FULL_TIME",
  openPositions: 1, status: "OPEN" as string, description: "", requirements: "",
  salaryMin: 0, salaryMax: 0,
};

export default function JobOpeningsPage() {
  const [jobs, setJobs] = useState<JobOpening[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState(defaultFormData);
  const [formError, setFormError] = useState("");
  const [saving, setSaving] = useState(false);

  const [closeId, setCloseId] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchJobOpenings({
        search: search || undefined, status: statusFilter || undefined,
        skip: page * pageSize, take: pageSize,
      });
      setJobs(res.data); setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load job openings.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, statusFilter, page]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const openCreate = () => {
    setEditId(null);
    setFormData(defaultFormData);
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (j: JobOpening) => {
    setEditId(j.id);
    setFormData({
      title: j.title, department: j.department, location: j.location,
      employmentType: j.employmentType, openPositions: j.openPositions,
      status: j.status, description: j.description ?? "",
      requirements: j.requirements ?? "", salaryMin: j.salaryMin ?? 0, salaryMax: j.salaryMax ?? 0,
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSave = async () => {
    setFormError("");
    if (!formData.title || !formData.department) {
      setFormError("Title and Department are required.");
      return;
    }
    setSaving(true);
    try {
      const body = {
        title: formData.title, department: formData.department,
        location: formData.location || undefined,
        employmentType: formData.employmentType,
        openPositions: formData.openPositions,
        status: formData.status as JobStatus,
        description: formData.description || undefined,
        requirements: formData.requirements || undefined,
        salaryMin: formData.salaryMin || undefined,
        salaryMax: formData.salaryMax || undefined,
      };
      if (editId) {
        await updateJobOpening(editId, body);
        showToast("success", "Job opening updated successfully.");
      } else {
        await createJobOpening(body);
        showToast("success", "Job opening created successfully.");
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save job opening.");
    } finally { setSaving(false); }
  };

  const handleClose = async () => {
    if (!closeId) return;
    try {
      await closeJobOpening(closeId);
      showToast("success", "Job opening closed.");
      setCloseId(null);
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to close job opening.");
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Job Openings"
        description="Manage job postings across departments."
        action={
          <button type="button" onClick={openCreate} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 transition">
            <Plus className="h-4 w-4" /> Add Job Opening
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
          <input type="text" placeholder="Search by title, department, or location..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
          <option value="">All Status</option>
          {JOB_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Job Openings <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Job Title</th>
                  <th className="px-5 py-3 font-semibold">Department</th>
                  <th className="px-5 py-3 font-semibold">Location</th>
                  <th className="px-5 py-3 font-semibold">Employment Type</th>
                  <th className="px-5 py-3 font-semibold">Open Positions</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Created Date</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {jobs.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="px-5 py-8 text-center text-sm text-slate-500">No job openings found.</td>
                  </tr>
                ) : (
                  jobs.map((j) => (
                    <tr key={j.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{j.title}</p>
                      </td>
                      <td className="px-5 py-4 text-slate-400">{j.department}</td>
                      <td className="px-5 py-4 text-slate-400">{j.location || "—"}</td>
                      <td className="px-5 py-4"><StatusBadge status={j.employmentType} /></td>
                      <td className="px-5 py-4 text-slate-300">{j.openPositions}</td>
                      <td className="px-5 py-4"><StatusBadge status={j.status} /></td>
                      <td className="px-5 py-4 text-slate-400">{new Date(j.createdDate).toLocaleDateString()}</td>
                      <td className="px-5 py-4">
                        <div className="flex items-center gap-2">
                          <button type="button" onClick={() => openEdit(j)}
                            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs font-medium text-slate-300 hover:bg-slate-700 transition">Edit</button>
                          {j.status !== "CLOSED" && (
                            <button type="button" onClick={() => setCloseId(j.id)}
                              className="rounded-3xl bg-rose-600/20 px-3 py-1.5 text-xs font-medium text-rose-300 hover:bg-rose-600/30 transition">Close</button>
                          )}
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
              <h3 className="text-lg font-semibold text-white">{editId ? "Edit Job Opening" : "New Job Opening"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white">
                <X className="h-5 w-5" />
              </button>
            </div>

            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}

            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Job Title *</label>
                  <input type="text" value={formData.title} onChange={(e) => setFormData((f) => ({ ...f, title: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Department *</label>
                  <input type="text" value={formData.department} onChange={(e) => setFormData((f) => ({ ...f, department: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Location</label>
                  <input type="text" value={formData.location} onChange={(e) => setFormData((f) => ({ ...f, location: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Employment Type</label>
                  <select value={formData.employmentType} onChange={(e) => setFormData((f) => ({ ...f, employmentType: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    {EMPLOYMENT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Open Positions</label>
                  <input type="number" min={1} value={formData.openPositions} onChange={(e) => setFormData((f) => ({ ...f, openPositions: parseInt(e.target.value) || 1 }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData((f) => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                    {JOB_STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Salary Min</label>
                  <input type="number" value={formData.salaryMin || ""} onChange={(e) => setFormData((f) => ({ ...f, salaryMin: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Salary Max</label>
                  <input type="number" value={formData.salaryMax || ""} onChange={(e) => setFormData((f) => ({ ...f, salaryMax: parseInt(e.target.value) || 0 }))}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData((f) => ({ ...f, description: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Requirements</label>
                <textarea value={formData.requirements} onChange={(e) => setFormData((f) => ({ ...f, requirements: e.target.value }))} rows={2}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 placeholder-slate-500 resize-none" />
              </div>
            </div>

            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Cancel</button>
              <button type="button" onClick={handleSave} disabled={saving}
                className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-indigo-500 disabled:opacity-50 transition inline-flex items-center gap-2">
                {saving ? <><Briefcase className="h-4 w-4 animate-spin" /> Saving...</> : (editId ? "Update" : "Create")}
              </button>
            </div>
          </div>
        </div>
      )}

      {closeId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Close Job Opening</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to close this job opening? This action can be undone by reopening it.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setCloseId(null)}
                className="rounded-3xl bg-slate-800 px-5 py-2.5 text-sm font-medium text-slate-300 hover:bg-slate-700 transition">Cancel</button>
              <button type="button" onClick={handleClose}
                className="rounded-3xl bg-rose-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-rose-500 transition">Close</button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
