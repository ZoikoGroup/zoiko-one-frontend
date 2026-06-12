"use client";

import { useEffect, useState } from "react";
import { Plus, Search, X } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import StatusBadge from "../../components/StatusBadge";
import { fetchDesignations, createDesignation, updateDesignation, deleteDesignation, fetchDepartments, type Designation, type Department } from "../../lib/workforce-api";

const LEVEL_OPTIONS = ["JUNIOR", "MID", "SENIOR", "LEAD", "MANAGER", "DIRECTOR", "VP", "EXECUTIVE", "C_SUITE"] as const;
const CATEGORY_OPTIONS = ["TECHNICAL", "MANAGEMENT", "SUPPORT", "SALES", "FINANCE", "HR", "OTHER"] as const;

export default function DesignationListPage() {
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [departments, setDepartments] = useState<Department[]>([]);
  const [page, setPage] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 20;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ title: "", code: "", level: "MID", category: "OTHER", grade: "", description: "", minSalary: "", maxSalary: "", departmentId: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  useEffect(() => {
    fetchDesignations({
      search: search || undefined,
      status: statusFilter || undefined,
      level: levelFilter || undefined,
      category: categoryFilter || undefined,
      departmentId: departmentFilter || undefined,
      skip: page * pageSize,
      take: pageSize,
      orderBy: "createdAt",
      orderDir: "desc",
    }).then((res) => { setDesignations(res.data); setTotal(res.total); setLoaded(true); }).catch(() => {});
  }, [search, statusFilter, levelFilter, categoryFilter, departmentFilter, page, refreshKey]);

  useEffect(() => {
    fetchDepartments({ take: 100, orderBy: "name", orderDir: "asc" })
      .then((res) => setDepartments(res.data))
      .catch(() => {});
  }, []);

  const openAddForm = () => {
    setEditId(null);
    setFormData({ title: "", code: "", level: "MID", category: "OTHER", grade: "", description: "", minSalary: "", maxSalary: "", departmentId: "" });
    setFormError("");
    setShowForm(true);
  };

  const openEditForm = (dg: Designation) => {
    setEditId(dg.id);
    setFormData({
      title: dg.title,
      code: dg.code,
      level: dg.level,
      category: dg.category,
      grade: dg.grade ?? "",
      description: dg.description ?? "",
      minSalary: String(dg.minSalary),
      maxSalary: String(dg.maxSalary),
      departmentId: dg.departmentId ?? "",
    });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setFormError("");
    try {
      const body = {
        title: formData.title,
        code: formData.code,
        level: formData.level,
        category: formData.category,
        grade: formData.grade || undefined,
        description: formData.description || undefined,
        minSalary: formData.minSalary ? Number(formData.minSalary) : undefined,
        maxSalary: formData.maxSalary ? Number(formData.maxSalary) : undefined,
        departmentId: formData.departmentId || undefined,
      };
      if (editId) {
        await updateDesignation(editId, body);
      } else {
        await createDesignation(body);
      }
      setShowForm(false);
      setRefreshKey((k) => k + 1);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to save designation.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    setDeleting(true);
    try {
      await deleteDesignation(id);
      setDeleteId(null);
      setRefreshKey((k) => k + 1);
    } catch (err) { console.error("Failed to delete designation:", err); }
    setDeleting(false);
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Designations"
        description="Manage job titles, levels, and salary bands."
        action={
          <button type="button" onClick={openAddForm}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Add Designation
          </button>
        }
      />

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[180px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search by title or code..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={levelFilter}
            onChange={(e) => { setLevelFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Levels</option>
            {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l.replace(/_/g, " ").charAt(0) + l.replace(/_/g, " ").slice(1).toLowerCase()}</option>)}
          </select>
          <select value={categoryFilter}
            onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Categories</option>
            {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c.charAt(0) + c.slice(1).toLowerCase()}</option>)}
          </select>
          <select value={departmentFilter}
            onChange={(e) => { setDepartmentFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Departments</option>
            {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
          </select>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">All Designations <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Code</th>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Level</th>
                <th className="px-5 py-3 font-semibold">Category</th>
                <th className="px-5 py-3 font-semibold">Department</th>
                <th className="px-5 py-3 font-semibold">Salary Range</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {!loaded ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400">Loading designations...</td></tr>
              ) : designations.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400">No designations found.</td></tr>
              ) : designations.map((dg) => (
                <tr key={dg.id} className="transition duration-200 hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4 font-mono text-xs text-slate-400">{dg.code ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <Link href={`/zoiko-hr/designations/${dg.id}`} className="text-white hover:text-indigo-400 transition">{dg.title ?? "—"}</Link>
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{(dg.level ?? "").replace(/_/g, " ") || "—"}</span>
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{dg.category ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{dg.department?.name ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">${dg.minSalary?.toLocaleString() ?? "—"} – ${dg.maxSalary?.toLocaleString() ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4"><StatusBadge status={dg.status ?? "ACTIVE"} /></td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <div className="flex items-center gap-2">
                      <Link href={`/zoiko-hr/designations/${dg.id}`}
                        className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white">View</Link>
                      <button type="button" onClick={() => openEditForm(dg)}
                        className="rounded-3xl bg-indigo-600/10 px-3 py-1.5 text-xs text-indigo-300 transition hover:bg-indigo-600/20">Edit</button>
                      <button type="button" onClick={() => setDeleteId(dg.id)}
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
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)] max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">{editId ? "Edit Designation" : "Add Designation"}</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Code *</label>
                <input type="text" required value={formData.code}
                  onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Level *</label>
                  <select required value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                    {LEVEL_OPTIONS.map((l) => <option key={l} value={l}>{l.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Category *</label>
                  <select required value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                    {CATEGORY_OPTIONS.map((c) => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Grade</label>
                <input type="text" value={formData.grade}
                  onChange={(e) => setFormData({ ...formData, grade: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea rows={2} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Min Salary</label>
                  <input type="number" min={0} value={formData.minSalary}
                    onChange={(e) => setFormData({ ...formData, minSalary: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Max Salary</label>
                  <input type="number" min={0} value={formData.maxSalary}
                    onChange={(e) => setFormData({ ...formData, maxSalary: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Department</label>
                <select value={formData.departmentId}
                  onChange={(e) => setFormData({ ...formData, departmentId: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                  <option value="">No Department</option>
                  {departments.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
                </select>
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
            <p className="mt-2 text-sm text-slate-400">Are you sure you want to delete this designation?</p>
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
