"use client";

import { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchLeaveTypes, createLeaveType, updateLeaveType, deleteLeaveType, type LeaveType } from "../../../lib/workforce-api";

const CATEGORY_OPTIONS = ["PAID", "UNPAID", "STATUTORY", "MEDICAL", "BEREAVEMENT", "PARENTAL", "SABBATICAL", "OTHER"] as const;

export default function LeaveTypesPage() {
  const [types, setTypes] = useState<LeaveType[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [page, setPage] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 20;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "", category: "PAID", maxDaysPerYear: "", minDaysRequired: "", requiresApproval: true, requiresMedicalCert: false, attachmentRequired: false });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchLeaveTypes({ search: search || undefined, category: categoryFilter || undefined, skip: page * pageSize, take: pageSize })
      .then((res) => { setTypes(res.data); setTotal(res.total); setLoaded(true); })
      .catch(() => {});
  }, [search, categoryFilter, page, refreshKey]);

  const openAddForm = () => {
    setEditId(null);
    setFormData({ name: "", code: "", description: "", category: "PAID", maxDaysPerYear: "", minDaysRequired: "", requiresApproval: true, requiresMedicalCert: false, attachmentRequired: false });
    setFormError(""); setShowForm(true);
  };

  const openEditForm = (t: LeaveType) => {
    setEditId(t.id);
    setFormData({ name: t.name, code: t.code, description: t.description ?? "", category: t.category, maxDaysPerYear: String(t.maxDaysPerYear), minDaysRequired: String(t.minDaysRequired), requiresApproval: t.requiresApproval, requiresMedicalCert: t.requiresMedicalCert, attachmentRequired: t.attachmentRequired });
    setFormError(""); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setFormError("");
    try {
      if (editId) {
        await updateLeaveType(editId, { name: formData.name || undefined, code: formData.code || undefined, description: formData.description || undefined, category: formData.category || undefined, maxDaysPerYear: formData.maxDaysPerYear ? Number(formData.maxDaysPerYear) : undefined, minDaysRequired: formData.minDaysRequired ? Number(formData.minDaysRequired) : undefined, requiresApproval: formData.requiresApproval, requiresMedicalCert: formData.requiresMedicalCert, attachmentRequired: formData.attachmentRequired });
      } else {
        await createLeaveType({ name: formData.name, code: formData.code, description: formData.description || undefined, category: formData.category, maxDaysPerYear: formData.maxDaysPerYear ? Number(formData.maxDaysPerYear) : undefined, minDaysRequired: formData.minDaysRequired ? Number(formData.minDaysRequired) : undefined, requiresApproval: formData.requiresApproval, requiresMedicalCert: formData.requiresMedicalCert, attachmentRequired: formData.attachmentRequired });
      }
      setShowForm(false); setRefreshKey((k) => k + 1);
    } catch (err) { setFormError(err instanceof Error ? err.message : "Failed to save leave type."); }
    finally { setSubmitting(false); }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try { await deleteLeaveType(id); setDeleteId(null); setRefreshKey((k) => k + 1); } catch {}
    setDeleting(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <SuperAdminShell>
      <PageHeader title="Leave Types" description="Define leave categories and policies."
        action={<button type="button" onClick={openAddForm} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"><Plus className="h-4 w-4" /> Add Leave Type</button>}
      />
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search by name or code..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
      </div>
      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">All Leave Types <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Code</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Max Days/Year</th>
                <th className="px-5 py-3 font-semibold">Requires Approval</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {!loaded ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : types.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">No leave types found.</td></tr>
              ) : types.map((t) => (
                <tr key={t.id} className="transition duration-200 hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4 font-mono text-xs text-slate-400">{t.code}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-white">{t.name}</td>
                  <td className="border-t border-slate-800 px-5 py-4"><span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{t.category}</span></td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{t.maxDaysPerYear}</td>
                  <td className="border-t border-slate-800 px-5 py-4">{t.requiresApproval ? <span className="text-emerald-400">Yes</span> : <span className="text-slate-500">No</span>}</td>
                  <td className="border-t border-slate-800 px-5 py-4"><StatusBadge status={t.isActive ? "ACTIVE" : "INACTIVE"} /></td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <button type="button" onClick={() => openEditForm(t)} className="rounded-3xl bg-indigo-600/10 px-3 py-1.5 text-xs text-indigo-300 transition hover:bg-indigo-600/20">Edit</button>
                      <button type="button" onClick={() => setDeleteId(t.id)} className="rounded-3xl bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
            <p className="text-sm text-slate-400">Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40">Previous</button>
              <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{editId ? "Edit Leave Type" : "Add Leave Type"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Name *</label>
                  <input type="text" required value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Code *</label>
                  <input type="text" required value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Category *</label>
                <select required value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                  {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Max Days Per Year</label>
                  <input type="number" min={0} value={formData.maxDaysPerYear} onChange={(e) => setFormData({ ...formData, maxDaysPerYear: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Min Days Required</label>
                  <input type="number" min={0} value={formData.minDaysRequired} onChange={(e) => setFormData({ ...formData, minDaysRequired: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <fieldset className="space-y-2">
                <legend className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Requirements</legend>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input type="checkbox" checked={formData.requiresApproval} onChange={(e) => setFormData({ ...formData, requiresApproval: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600" /> Requires Approval
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input type="checkbox" checked={formData.requiresMedicalCert} onChange={(e) => setFormData({ ...formData, requiresMedicalCert: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600" /> Requires Medical Certificate
                </label>
                <label className="flex items-center gap-3 text-sm text-slate-300">
                  <input type="checkbox" checked={formData.attachmentRequired} onChange={(e) => setFormData({ ...formData, attachmentRequired: e.target.checked })}
                    className="h-4 w-4 rounded border-slate-800 bg-slate-950 text-indigo-600" /> Requires Attachment
                </label>
              </fieldset>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {submitting ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this leave type?</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)} className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
              <button type="button" disabled={deleting} onClick={() => handleDelete(deleteId)} className="rounded-3xl bg-rose-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
