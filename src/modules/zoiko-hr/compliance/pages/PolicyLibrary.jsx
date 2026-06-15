import { useState, useMemo } from "react";
import { Plus, Search, Edit2, Trash2, X } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import { usePolicies } from "../hooks/useCompliance";
import { formatDate } from "../utils/helpers";

const CATEGORIES = [
  { value: "data_privacy", label: "Data Privacy" },
  { value: "security", label: "Security" },
  { value: "hr", label: "HR" },
  { value: "finance", label: "Finance" },
  { value: "operations", label: "Operations" },
  { value: "legal", label: "Legal" },
  { value: "other", label: "Other" },
];

export default function PolicyLibrary() {
  const { data: policies, loading } = usePolicies();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    title: "", category: "", description: "", version: "1.0",
    effectiveDate: "", reviewDate: "", owner: "", department: "", status: "draft",
  });

  const filtered = useMemo(() => {
    let result = policies;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((p) => p.title.toLowerCase().includes(q) || p.description?.toLowerCase().includes(q));
    }
    if (categoryFilter) result = result.filter((p) => p.category === categoryFilter);
    return result;
  }, [policies, search, categoryFilter]);

  const openCreate = () => {
    setEditing(null);
    setForm({ title: "", category: "", description: "", version: "1.0", effectiveDate: "", reviewDate: "", owner: "", department: "", status: "draft" });
    setShowModal(true);
  };

  const openEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title, category: p.category, description: p.description, version: p.version,
      effectiveDate: p.effectiveDate, reviewDate: p.reviewDate, owner: p.owner, department: p.department, status: p.status,
    });
    setShowModal(true);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  if (loading) return <div className="p-6 text-gray-400">Loading policies...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 focus:border-emerald-500"
              placeholder="Search policies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>
        <button onClick={openCreate} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <Plus size={16} /> Add Policy
        </button>
      </div>

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Effective</th>
              <th className="px-4 py-3">Review</th>
              <th className="px-4 py-3">Owner</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-emerald-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{p.title}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-500">{p.category?.replace(/_/g, " ") || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">v{p.version}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{formatDate(p.effectiveDate)}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{formatDate(p.reviewDate)}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{p.owner}</td>
                <td className="px-4 py-4"><StatusBadge status={p.status} /></td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button onClick={() => openEdit(p)} className="text-emerald-600 hover:text-emerald-800"><Edit2 size={16} /></button>
                  <button className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No policies found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editing ? "Edit Policy" : "Create Policy"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                  <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                    <option value="">Select category</option>
                    {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Version</label>
                  <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Owner</label>
                  <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.owner} onChange={(e) => setForm({ ...form, owner: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date</label>
                  <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" type="date" value={form.effectiveDate} onChange={(e) => setForm({ ...form, effectiveDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Review Date</label>
                  <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" type="date" value={form.reviewDate} onChange={(e) => setForm({ ...form, reviewDate: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })} />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">{editing ? "Update" : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
