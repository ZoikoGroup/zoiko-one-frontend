import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/ess" },
  { label: "Profile", href: "/zoiko-hr/ess/profile" },
  { label: "Leave Management", href: "/zoiko-hr/ess/leave" },
  { label: "Attendance", href: "/zoiko-hr/ess/attendance" },
  { label: "My Documents", href: "/zoiko-hr/ess/my-documents" },
  { label: "Requests", href: "/zoiko-hr/ess/requests" },
  { label: "Settings", href: "/zoiko-hr/ess/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/ess"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

const mockRequestsData = [
  { id: 1, category: "IT", subject: "Laptop Repair", description: "My laptop is not working properly", priority: "high", status: "pending", createdOn: "2025-04-01" },
  { id: 2, category: "HR", subject: "Leave Request", description: "Request for annual leave", priority: "medium", status: "approved", createdOn: "2025-03-28" },
  { id: 3, category: "Facilities", subject: "Office Maintenance", description: "AC not working in office", priority: "urgent", status: "pending", createdOn: "2025-04-02" },
  { id: 4, category: "Admin", subject: "ID Card", description: "Need new employee ID card", priority: "low", status: "completed", createdOn: "2025-03-25" },
  { id: 5, category: "IT", subject: "Software Installation", description: "Need Adobe Photoshop", priority: "medium", status: "pending", createdOn: "2025-04-03" },
  { id: 6, category: "HR", subject: "Training", description: "Request for training program", priority: "high", status: "pending", createdOn: "2025-04-04" },
  { id: 7, category: "Facilities", subject: "Parking", description: "Need parking space", priority: "low", status: "rejected", createdOn: "2025-03-30" },
];

export default function EssRequests() {
  const [requests] = useState(mockRequestsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState(null);
  const [form, setForm] = useState({ category: "IT", subject: "", description: "", priority: "medium" });

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
      setShowModal(false);
      setForm({ category: "IT", subject: "", description: "", priority: "medium" });
    } catch (err) {
      setFormError(err.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  const REQUEST_CATEGORIES = ["IT", "HR", "Facilities", "Admin"];
  const PRIORITIES = [
    { value: "low", label: "Low" },
    { value: "medium", label: "Medium" },
    { value: "high", label: "High" },
    { value: "urgent", label: "Urgent" },
  ];

  const columns = [
    { key: "category", label: "Category", render: (v) => (
      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
        {v}
      </span>
    )},
    { key: "subject", label: "Subject", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "description", label: "Description", render: (v) => <span className="text-gray-500 truncate max-w-[200px] block">{v}</span> },
    { key: "priority", label: "Priority", render: (v) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        v === "urgent" ? "bg-red-100 text-red-800" : v === "high" ? "bg-orange-100 text-orange-800" : v === "medium" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
      }`}>{v}</span>
    )},
    { key: "status", label: "Status", render: (v) => (
      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
        v === "pending" ? "bg-yellow-100 text-yellow-800" : v === "approved" ? "bg-green-100 text-green-800" : v === "rejected" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
      }`}>{v}</span>
    )},
    { key: "createdOn", label: "Created", render: (v) => <span className="text-gray-400 text-xs">{v}</span> },
  ];

  return (
    <HRPage title="Employee Self Service" subtitle="Submit and track IT, HR, Facilities, and Admin requests">
      <SubNav />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">ESS Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Submit and track IT, HR, Facilities, and Admin requests</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            New Request
          </button>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Requests</h2>
            <span className="text-sm text-gray-500">{filtered.length} requests</span>
          </div>
          <div className="space-y-3">
            {filtered.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-50 text-blue-700">
                      {r.category}
                    </span>
                    <span className="text-sm font-medium text-gray-900">{r.subject}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      r.status === "pending" ? "bg-yellow-100 text-yellow-800" : r.status === "approved" ? "bg-green-100 text-green-800" : r.status === "rejected" ? "bg-red-100 text-red-800" : "bg-blue-100 text-blue-800"
                    }`}>{r.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1 truncate max-w-[400px]">{r.description}</div>
                  <div className="text-xs text-gray-400 mt-1">Priority: {r.priority}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Created on</div>
                  <div className="text-sm font-medium text-gray-700">{r.createdOn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">New ESS Request</h2>
                <button
                  onClick={() => { setShowModal(false); setFormError(null); }}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {formError && <div className="text-red-500 text-sm">{formError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {REQUEST_CATEGORIES.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={form.priority}
                    onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {PRIORITIES.map((p) => (
                      <option key={p.value} value={p.value}>
                        {p.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subject *</label>
                  <input
                    type="text"
                    value={form.subject}
                    onChange={(e) => setForm({ ...form, subject: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea
                    rows={4}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setFormError(null); }}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                  >
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}
