"use client";

import { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { fetchDepartments, createDepartment, updateDepartment, deleteDepartment, type Department } from "../../lib/workforce-api";

const STATUS_OPTIONS = ["ACTIVE", "INACTIVE", "ARCHIVED"] as const;

export default function DepartmentListPage() {
  const [departments, setDepartments] = useState<Department[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 20;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ name: "", code: "", description: "", parentDeptId: "", budget: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [parentDeptOptions, setParentDeptOptions] = useState<Department[]>([]);

  useEffect(() => {
    fetchDepartments({ search: search || undefined, status: statusFilter || undefined, skip: page * pageSize, take: pageSize, orderBy: "createdAt", orderDir: "desc" })
      .then((res) => { setDepartments(res.data); setTotal(res.total); setLoaded(true); })
      .catch(() => {});
  }, [search, statusFilter, page, refreshKey]);

  useEffect(() => {
    if (showForm) {
      fetchDepartments({ take: 100, orderBy: "name", orderDir: "asc" })
        .then((res) => setParentDeptOptions(res.data))
        .catch(() => {});
    }
  }, [showForm]);

  const openAddForm = () => {
    setEditId(null);
    setFormData({ name: "", code: "", description: "", parentDeptId: "", budget: "" });
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (dept: Department) => {
    setEditId(dept.id);
    setFormData({ name: dept.name, code: dept.code, description: dept.description ?? "", parentDeptId: dept.parentDeptId ?? "", budget: String(dept.budget) });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      if (editId) {
        await updateDepartment(editId, {
          name: formData.name || undefined,
          code: formData.code || undefined,
          description: formData.description || undefined,
          parentDeptId: formData.parentDeptId || undefined,
          budget: formData.budget ? Number(formData.budget) : undefined,
        });
      } else {
        await createDepartment({
          name: formData.name,
          code: formData.code,
          description: formData.description || undefined,
          parentDeptId: formData.parentDeptId || undefined,
          budget: formData.budget ? Number(formData.budget) : undefined,
        });
      }
      setShowForm(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save department.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteDepartment(id);
      setDeleteId(null);
      setRefreshKey((k) => k + 1);
    } catch {}
    setDeleting(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Departments"
        description="Manage organizational departments."
        action={
          <button type="button" onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Add Department
          </button>
        }
      />

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search by name or code..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={statusFilter}
            onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
          </select>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">All Departments <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[800px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Code</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Parent Dept</th>
                <th className="px-5 py-3 font-semibold">Budget</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {!loaded ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">Loading departments...</td></tr>
              ) : departments.length === 0 ? (
                <tr><td colSpan={6} className="px-5 py-12 text-center text-slate-400">No departments found.</td></tr>
              ) : departments.map((dept) => (
                <tr key={dept.id} className="transition duration-200 hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4 font-mono text-xs text-slate-400">{dept.code}</td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <Link href={`/zoiko-hr/departments/${dept.id}`} className="text-white hover:text-indigo-400 transition">{dept.name}</Link>
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{dept.parentDept?.name ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">${dept.budget.toLocaleString()}</td>
                  <td className="border-t border-slate-800 px-5 py-4"><StatusBadge status={dept.status} /></td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/zoiko-hr/departments/${dept.id}`}
                        className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white">View</Link>
                      <button type="button" onClick={() => openEditForm(dept)}
                        className="rounded-3xl bg-indigo-600/10 px-3 py-1.5 text-xs text-indigo-300 transition hover:bg-indigo-600/20">Edit</button>
                      <button type="button" onClick={() => setDeleteId(dept.id)}
                        className="rounded-3xl bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20">Delete</button>
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
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40">Previous</button>
              <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{editId ? "Edit Department" : "Add Department"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Name *</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Code *</label>
                <input type="text" required value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea rows={3} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Parent Department</label>
                <select value={formData.parentDeptId}
                  onChange={(e) => setFormData({ ...formData, parentDeptId: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                  <option value="">None (Top Level)</option>
                  {parentDeptOptions.filter((d) => d.id !== editId).map((d) => (
                    <option key={d.id} value={d.id}>{d.name} ({d.code})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Budget</label>
                <input type="number" min={0} value={formData.budget}
                  onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
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
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this department? This action can be undone by an administrator.</p>
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setDeleteId(null)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
              <button type="button" disabled={deleting} onClick={() => handleDelete(deleteId)}
                className="rounded-3xl bg-rose-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-50">
                {deleting ? "Deleting..." : "Delete"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
