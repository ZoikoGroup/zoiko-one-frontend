import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";
import { formatCurrency } from "./helpers.js";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Itineraries", href: "/zoiko-hr/travel/itineraries" },
  { label: "Expenses", href:
  "/zoiko-hr/travel/expenses" },
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

const mockApprovalsData = [
  { id: 1, employee: "Alice Johnson", destination: "New York", purpose: "Business Meeting", type: "Domestic", amount: 1500, requestedBy: "John Smith", status: "pending", submittedDate: "2025-03-28", approvedBy: null },
  { id: 2, employee: "Bob Smith", destination: "London", purpose: "Conference", type: "International", amount: 2500, requestedBy: "Jane Doe", status: "approved", submittedDate: "2025-03-25", approvedBy: "Mike Johnson" },
  { id: 3, employee: "Carol Davis", destination: "Paris", purpose: "Client Visit", type: "International", amount: 3000, requestedBy: "Sarah Williams", status: "rejected", submittedDate: "2025-03-24", approvedBy: "Robert Brown" },
  { id: 4, employee: "David Lee", destination: "Tokyo", purpose: "Training", type: "International", amount: 4000, requestedBy: "Lisa Smith", status: "pending", submittedDate: "2025-03-23", approvedBy: null },
  { id: 5, employee: "Eva Martinez", destination: "Singapore", purpose: "Partnership", type: "International", amount: 5000, requestedBy: "David Lee", status: "approved", submittedDate: "2025-03-22", approvedBy: "Emma Taylor" },
  { id: 6, employee: "Frank Wilson", destination: "Berlin", purpose: "Business Trip", type: "Domestic", amount: 800, requestedBy: "Sarah Williams", status: "approved", submittedDate: "2025-03-21", approvedBy: "John Smith" },
  { id: 7, employee: "Grace Kim", destination: "Sydney", purpose: "Conference", type: "International", amount: 3500, requestedBy: "David Lee", status: "pending", submittedDate: "2025-03-20", approvedBy: null },
  { id: 8, employee: "Henry Brown", destination: "Dubai", purpose: "Client Meeting", type: "International", amount: 2000, requestedBy: "Emma Taylor", status: "approved", submittedDate: "2025-03-19", approvedBy: "Mike Johnson" },
];

export default function TravelApprovals() {
  const [approvals, setApprovals] = useState(mockApprovalsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  const filtered = approvals.filter((a) => {
    if (search && !a.employee.toLowerCase().includes(search.toLowerCase()) && !a.destination.toLowerCase().includes(search.toLowerCase()) && !a.purpose.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && a.status !== statusFilter) return false;
    return true;
  });

  const handleApprove = (id) => {
    setApprovals((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, status: "approved", approvedBy: "Current User", approvedAt: new Date().toISOString().split("T")[0] }
          : a
      )
    );
  };

  const handleReject = (id) => {
    if (confirm("Reject this travel request?")) {
      setApprovals((prev) =>
        prev.map((a) =>
          a.id === id
            ? { ...a, status: "rejected", approvedBy: "Current User", approvedAt: new Date().toISOString().split("T")[0] }
            : a
        )
      );
    }
  };

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
    { key: "requestedBy", label: "Requested By", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "status", label: "Status", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${v === "approved" ? "bg-green-100 text-green-800" : v === "rejected" ? "bg-red-100 text-red-800" : "bg-orange-100 text-orange-800"}`}>{v}</span> },
    { key: "actions", label: "Actions", render: (_, r) => (
      <div className="flex gap-2">
        {r.status === "pending" && (
          <>
            <button
              onClick={() => handleApprove(r.id)}
              className="px-3 py-1 text-xs bg-green-600 text-white rounded hover:bg-green-700"
            >
              Approve
            </button>
            <button
              onClick={() => handleReject(r.id)}
              className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700"
            >
              Reject
            </button>
          </>
        )}
        {r.status !== "pending" && (
          <span className="text-xs text-gray-500">
            Approved by {r.approvedBy} on {r.approvedAt}
          </span>
        )}
      </div>
    )},
  ];

  return (
    <HRPage title="Travel" subtitle="Review and approve travel requests">
      <SubNav />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Travel Approvals</h1>
            <p className="text-sm text-gray-500 mt-1">Review and approve travel requests</p>
          </div>
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
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
            >
              <option value="">All Statuses</option>
              {statusOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>

          <DataTable columns={columns} data={filtered} />
        </div>
      </div>
    </HRPage>
  );
}
