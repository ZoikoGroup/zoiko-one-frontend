import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable, StatusBadge } from "./DataTable.jsx";
import { formatCurrency } from "./helpers.js";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Itineraries", href: "/zoiko-hr/travel/itineraries" },
  { label: "Expenses", href: "/zoiko-hr/travel/expenses" },
  { label: "Reports", href: "/zoiko-hr/travel/reports" },
  { label: "Settings", href: "/zoiko-hr/travel/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/travel"}
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
  { id: 1, employee: "Alice Johnson", destination: "New York", purpose: "Business Meeting", type: "Domestic", status: "pending", amount: 1500, submittedDate: "2025-03-28", requestedBy: "John Smith" },
  { id: 2, employee: "Bob Smith", destination: "London", purpose: "Conference", type: "International", status: "approved", amount: 2500, submittedDate: "2025-03-25", requestedBy: "Jane Doe" },
  { id: 3, employee: "Carol Davis", destination: "Paris", purpose: "Client Visit", type: "International", status: "pending", amount: 3000, submittedDate: "2025-03-24", requestedBy: "Mike Johnson" },
  { id: 4, employee: "David Lee", destination: "Tokyo", purpose: "Training", type: "International", status: "rejected", amount: 4000, submittedDate: "2025-03-23", requestedBy: "Sarah Williams" },
  { id: 5, employee: "Eva Martinez", destination: "Singapore", purpose: "Partnership", type: "International", status: "approved", amount: 5000, submittedDate: "2025-03-22", requestedBy: "Robert Brown" },
  { id: 6, employee: "Frank Wilson", destination: "Berlin", purpose: "Business Trip", type: "Domestic", status: "pending", amount: 800, submittedDate: "2025-03-21", requestedBy: "Lisa Smith" },
  { id: 7, employee: "Grace Kim", destination: "Sydney", purpose: "Conference", type: "International", status: "approved", amount: 3500, submittedDate: "2025-03-20", requestedBy: "David Lee" },
  { id: 8, employee: "Henry Brown", destination: "Dubai", purpose: "Client Meeting", type: "International", status: "pending", amount: 2000, submittedDate: "2025-03-19", requestedBy: "Emma Taylor" },
];

export default function TravelRequests() {
  const [requests] = useState(mockRequestsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ employee: "", destination: "", purpose: "", type: "", amount: "", requestedBy: "" });

  const filtered = requests.filter((r) => {
    if (search && !r.employee.toLowerCase().includes(search.toLowerCase()) && !r.destination.toLowerCase().includes(search.toLowerCase()) && !r.purpose.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (typeFilter && r.type !== typeFilter) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    if (key === "status") setStatusFilter(value);
    if (key === "type") setTypeFilter(value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.employee || !form.destination || !form.purpose || !form.type || !form.amount) {
      alert("Please fill all required fields");
      return;
    }
    setSubmitting(true);
    try {
      setShowModal(false);
      setForm({ employee: "", destination: "", purpose: "", type: "", amount: "", requestedBy: "" });
    } catch (err) {
      alert(err.message || "Failed to create request");
    } finally {
      setSubmitting(false);
    }
  };

  const typeOptions = [
    { value: "Domestic", label: "Domestic" },
    { value: "International", label: "International" },
  ];

  const statusOptions = [
    { value: "pending", label: "Pending" },
    { value: "approved", label: "Approved" },
    { value: "rejected", label: "Rejected" },
  ];

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "destination", label: "Destination", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "purpose", label: "Purpose", render: (v) => <span className="text-gray-500 truncate max-w-[200px] block">{v}</span> },
    { key: "type", label: "Type", render: (v) => <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">{v}</span> },
    { key: "amount", label: "Amount", render: (v) => <span className="font-medium text-gray-900">{formatCurrency(v)}</span> },
    { key: "status", label: "Status", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v === "approved" ? "bg-green-100 text-green-800" : v === "rejected" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}>{v}</span> },
    { key: "submittedDate", label: "Submitted", render: (v) => <span className="text-gray-500">{v}</span> },
  ];

  return (
    <HRPage title="Travel" subtitle="Submit and track travel requests">
      <SubNav />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Travel Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Submit and track travel requests</p>
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
            <h2 className="text-lg font-semibold text-gray-900">All Requests</h2>
            <span className="text-sm text-gray-500">{filtered.length} requests</span>
          </div>

          <div className="flex flex-wrap gap-3 mb-4">
            <div className="relative flex-1 max-w-xs">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400">🔍</span>
              <input
                type="text"
                placeholder="Search requests..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => handleFilterChange("status", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
            <select
              value={typeFilter}
              onChange={(e) => handleFilterChange("type", e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Types</option>
              {typeOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <DataTable columns={columns} data={filtered} />
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">New Travel Request</h2>
                <button
                  onClick={() => { setShowModal(false); setForm({ employee: "", destination: "", purpose: "", type: "", amount: "", requestedBy: "" }); }}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee *</label>
                  <input
                    type="text"
                    value={form.employee}
                    onChange={(e) => setForm({ ...form, employee: e.target.value })}
                    placeholder="Employee name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destination *</label>
                  <input
                    type="text"
                    value={form.destination}
                    onChange={(e) => setForm({ ...form, destination: e.target.value })}
                    placeholder="City, Country"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purpose *</label>
                  <input
                    type="text"
                    value={form.purpose}
                    onChange={(e) => setForm({ ...form, purpose: e.target.value })}
                    placeholder="Business meeting, conference, etc."
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type *</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select type</option>
                    {typeOptions.map((opt) => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                  <input
                    type="number"
                    value={form.amount}
                    onChange={(e) => setForm({ ...form, amount: e.target.value })}
                    placeholder="USD amount"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Requested By *</label>
                  <input
                    type="text"
                    value={form.requestedBy}
                    onChange={(e) => setForm({ ...form, requestedBy: e.target.value })}
                    placeholder="Manager name"
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setForm({ employee: "", destination: "", purpose: "", type: "", amount: "", requestedBy: "" }); }}
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
