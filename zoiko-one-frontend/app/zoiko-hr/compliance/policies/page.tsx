"use client";

import { useEffect, useState } from "react";
import { Plus, Search, ChevronLeft, ChevronRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchPolicies, createPolicy, updatePolicy,
  type Policy, type PolicyStatus,
} from "../../../lib/workforce-api";

const CATEGORIES = ["All", "HR", "IT", "Finance", "Security", "Data Privacy", "Ethics", "Compliance", "Operations"];
const STATUSES: PolicyStatus[] = ["ACTIVE", "DRAFT", "ARCHIVED", "REVIEW_REQUIRED"];

export default function PoliciesPage() {
  const [policies, setPolicies] = useState<Policy[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState("");
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const [showForm, setShowForm] = useState(false);
  const [editId, setEditId] = useState<string | null>(null);
  const [formData, setFormData] = useState({ policyName: "", category: "", description: "", version: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const loadData = async () => {
    try {
      const res = await fetchPolicies({
        search: search || undefined,
        category: categoryFilter !== "All" ? categoryFilter : undefined,
        status: statusFilter || undefined,
        skip: page * pageSize, take: pageSize,
      });
      setPolicies(res.data);
      setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load policies.");
    } finally { setLoading(false); }
  };

  useEffect(() => {
    let cancelled = false;
    fetchPolicies({
      search: search || undefined,
      category: categoryFilter !== "All" ? categoryFilter : undefined,
      status: statusFilter || undefined,
      skip: page * pageSize, take: pageSize,
    })
      .then((res) => { if (!cancelled) { setPolicies(res.data); setTotal(res.total); setError(""); setLoading(false); } })
      .catch((err) => { if (!cancelled) { setError(err instanceof Error ? err.message : "Failed to load policies."); setLoading(false); } });
    return () => { cancelled = true; };
  }, [search, categoryFilter, statusFilter, page]);

  const openCreate = () => {
    setEditId(null);
    setFormData({ policyName: "", category: "HR", description: "", version: "1.0" });
    setFormError("");
    setShowForm(true);
  };

  const openEdit = (policy: Policy) => {
    setEditId(policy.id);
    setFormData({ policyName: policy.policyName, category: policy.category, description: policy.description ?? "", version: policy.version });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.policyName.trim() || !formData.category) { setFormError("Policy name and category are required."); return; }
    setSubmitting(true); setFormError("");
    try {
      if (editId) {
        await updatePolicy(editId, { policyName: formData.policyName, category: formData.category, description: formData.description || undefined, version: formData.version || undefined });
        setToast("Policy updated successfully.");
      } else {
        await createPolicy({ policyName: formData.policyName, category: formData.category, description: formData.description || undefined, version: formData.version || undefined });
        setToast("Policy created successfully.");
      }
      setShowForm(false);
      loadData();
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Operation failed.");
    } finally { setSubmitting(false); }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  useEffect(() => { if (toast) { const t = setTimeout(() => setToast(""), 3000); return () => clearTimeout(t); } }, [toast]);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Policies"
        description="Create and manage organizational policies."
        action={
          <button type="button" onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Create Policy
          </button>
        }
      />
      {toast && (
        <div className="mb-4 rounded-2xl bg-emerald-500/15 px-5 py-3 text-sm font-medium text-emerald-300 border border-emerald-500/20">
          {toast}
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
          <input type="text" placeholder="Search by policy name, category, or description..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
        <select value={categoryFilter} onChange={(e) => { setCategoryFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[140px]">
          {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
        </select>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500 min-w-[160px]">
          <option value="">All Status</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s.replace(/_/g, " ")}</option>)}
        </select>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Policies <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Policy Name</th>
                  <th className="px-5 py-3 font-semibold">Category</th>
                  <th className="px-5 py-3 font-semibold">Version</th>
                  <th className="px-5 py-3 font-semibold">Last Updated</th>
                  <th className="px-5 py-3 font-semibold">Status</th>
                  <th className="px-5 py-3 font-semibold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {policies.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No policies found.</td>
                  </tr>
                ) : (
                  policies.map((p) => (
                    <tr key={p.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{p.policyName}</p>
                        {p.description && <p className="mt-0.5 text-xs text-slate-500">{p.description}</p>}
                      </td>
                      <td className="px-5 py-4 text-slate-400">{p.category}</td>
                      <td className="px-5 py-4 text-slate-400">v{p.version}</td>
                      <td className="px-5 py-4 text-slate-400">{new Date(p.updatedAt).toLocaleDateString()}</td>
                      <td className="px-5 py-4"><StatusBadge status={p.status} /></td>
                      <td className="px-5 py-4">
                        <button type="button" onClick={() => openEdit(p)}
                          className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white">
                          Edit
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
              <p className="text-xs text-slate-500">Showing {start}--{end} of {total}</p>
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
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 p-4" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-lg font-semibold text-white">{editId ? "Edit Policy" : "Create Policy"}</h3>
            <p className="mt-1 text-sm text-slate-400">{editId ? "Update the policy details below." : "Fill in the details to create a new policy."}</p>
            <form onSubmit={handleSubmit} className="mt-5 space-y-4">
              {formError && <p className="text-sm text-rose-400">{formError}</p>}
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Policy Name</label>
                <input type="text" value={formData.policyName} onChange={(e) => setFormData({ ...formData, policyName: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="e.g. Data Protection Policy" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Category</label>
                <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none focus:border-indigo-500">
                  {CATEGORIES.filter((c) => c !== "All").map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Version</label>
                <input type="text" value={formData.version} onChange={(e) => setFormData({ ...formData, version: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" placeholder="1.0" />
              </div>
              <div>
                <label className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-slate-400">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none focus:border-indigo-500" rows={3} placeholder="Brief description of the policy..." />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2.5 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {submitting ? "Saving..." : editId ? "Update" : "Create"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
