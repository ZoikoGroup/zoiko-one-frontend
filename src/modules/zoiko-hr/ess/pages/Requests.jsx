import { useState } from "react";
import { Plus, X } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useEssRequests } from "../hooks/useEss";
import { createEssRequestData } from "../services/essService";
import { formatDate } from "../utils/helpers";

const REQUEST_CATEGORIES = ["IT", "HR", "Facilities", "Admin"];
const PRIORITIES = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

export default function EssRequests() {
  const { data: requests, loading } = useEssRequests();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({ category: "IT", subject: "", description: "", priority: "medium" });

  if (loading) return <div className="p-6 text-gray-400">Loading requests...</div>;

  const filtered = requests.filter((r) => {
    if (search && !r.subject.toLowerCase().includes(search.toLowerCase()) && !r.description.toLowerCase().includes(search.toLowerCase()) && !r.category.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (categoryFilter && r.category !== categoryFilter) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    if (key === "status") setStatusFilter(value);
    if (key === "category") setCategoryFilter(value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.subject.trim()) {
      setFormError("Subject is required");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      await createEssRequestData(form);
      setShowModal(false);
      setForm({ category: "IT", subject: "", description: "", priority: "medium" });
    } catch (err) {
      setFormError(err.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "category", label: "Category", render: (v) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">{v}</span>
    )},
    { key: "subject", label: "Subject", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "description", label: "Description", render: (v) => <span className="text-gray-500 truncate max-w-[200px] block">{v}</span> },
    { key: "priority", label: "Priority", render: (v) => <StatusBadge status={v} /> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "createdOn", label: "Created", render: (v) => <span className="text-gray-400 text-xs">{formatDate(v)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ESS Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Submit and track IT, HR, Facilities, and Admin requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          { key: "status", placeholder: "All Statuses", value: statusFilter, options: [
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            { value: "completed", label: "Completed" },
          ]},
          { key: "category", placeholder: "All Categories", value: categoryFilter, options: REQUEST_CATEGORIES.map((c) => ({ value: c, label: c })) },
        ]}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <DataTable columns={columns} data={filtered} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">New ESS Request</h2>
              <button onClick={() => { setShowModal(false); setFormError(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {REQUEST_CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {PRIORITIES.map((p) => <option key={p.value} value={p.value}>{p.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                <input type="text" value={form.subject} onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setFormError(null); }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
