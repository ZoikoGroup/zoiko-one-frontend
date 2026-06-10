"use client";

import { useState } from "react";
import { Plus, Search, X, CheckCircle, XCircle, Clock } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialEmployeeRequests, type EmployeeRequest } from "../mockData";

const REQUEST_TYPES = ["Leave", "Equipment", "Training", "Transfer", "Resignation", "Other"] as const;
const STATUSES = ["Pending", "Approved", "Rejected"] as const;

export default function EmployeeRequestsPage() {
  const [requests, setRequests] = useState<EmployeeRequest[]>(initialEmployeeRequests);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingReq, setEditingReq] = useState<EmployeeRequest | null>(null);
  const [formData, setFormData] = useState({
    employeeName: "",
    employeeEmail: "",
    requestType: "Equipment" as EmployeeRequest["requestType"],
    description: "",
    status: "Pending" as EmployeeRequest["status"],
    notes: "",
  });

  const handleOpenAdd = () => {
    setFormData({ employeeName: "", employeeEmail: "", requestType: "Equipment", description: "", status: "Pending", notes: "" });
    setEditingReq(null);
    setShowModal(true);
  };

  const handleOpenEdit = (req: EmployeeRequest) => {
    setFormData({
      employeeName: req.employeeName,
      employeeEmail: req.employeeEmail,
      requestType: req.requestType,
      description: req.description,
      status: req.status,
      notes: req.notes,
    });
    setEditingReq(req);
    setShowModal(true);
  };

  const handleQuickStatus = (id: string, status: "Approved" | "Rejected") => {
    setRequests(
      requests.map((r) =>
        r.id === id
          ? { ...r, status, resolvedAt: new Date().toISOString().split("T")[0], notes: status === "Approved" ? "Request approved." : "Request declined." }
          : r
      )
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingReq) {
      setRequests(
        requests.map((r) =>
          r.id === editingReq.id
            ? { ...r, ...formData, resolvedAt: formData.status !== "Pending" ? new Date().toISOString().split("T")[0] : r.resolvedAt }
            : r
        )
      );
    } else {
      const newReq: EmployeeRequest = {
        id: `req-${Date.now()}`,
        ...formData,
        createdAt: new Date().toISOString().split("T")[0],
        resolvedAt: "",
      };
      setRequests([newReq, ...requests]);
    }
    setShowModal(false);
  };

  const filtered = requests.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch = r.employeeName.toLowerCase().includes(q) || r.description.toLowerCase().includes(q) || r.employeeEmail.toLowerCase().includes(q);
    const matchType = typeFilter === "All" || r.requestType === typeFilter;
    const matchStatus = statusFilter === "All" || r.status === statusFilter;
    return matchSearch && matchType && matchStatus;
  });

  const pendingCount = requests.filter((r) => r.status === "Pending").length;
  const approvedCount = requests.filter((r) => r.status === "Approved").length;
  const rejectedCount = requests.filter((r) => r.status === "Rejected").length;

  return (
    <SuperAdminShell>
      <PageHeader
        title="Employee Requests"
        description="Manage employee requests including equipment, training, transfers, and more."
        action={
          <button type="button" onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Add Request
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Pending</p>
          <h3 className="mt-2 text-3xl font-bold text-amber-400">{pendingCount}</h3>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Approved</p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-400">{approvedCount}</h3>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Rejected</p>
          <h3 className="mt-2 text-3xl font-bold text-rose-400">{rejectedCount}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search by employee name, email, or description..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="All">All Types</option>
            {REQUEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        </div>
      </div>

      {/* Requests Cards */}
      <div className="grid grid-cols-1 gap-5">
        {filtered.length === 0 ? (
          <div className="rounded-[28px] border border-dashed border-slate-800 p-12 text-center text-slate-400">
            No employee requests found matching the selected filters.
          </div>
        ) : filtered.map((req) => (
          <div key={req.id} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg transition hover:border-slate-700">
            <div className="flex items-start justify-between flex-wrap gap-4">
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <h3 className="text-lg font-semibold text-white">{req.employeeName}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-medium ${getRequestTypeStyle(req.requestType)}`}>{req.requestType}</span>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${getStatusStyle(req.status)}`}>{req.status}</span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{req.description}</p>
                <div className="mt-3 flex items-center gap-4 text-xs text-slate-500">
                  <span>{req.employeeEmail}</span>
                  <span>Submitted: {req.createdAt}</span>
                  {req.resolvedAt && <span>Resolved: {req.resolvedAt}</span>}
                </div>
                {req.notes && (
                  <div className="mt-3 rounded-2xl bg-slate-950 px-4 py-2.5 text-xs text-slate-400 border border-slate-800">
                    <span className="font-semibold text-slate-300">Notes:</span> {req.notes}
                  </div>
                )}
              </div>
              <div className="flex items-center gap-2 shrink-0">
                {req.status === "Pending" && (
                  <>
                    <button type="button" onClick={() => handleQuickStatus(req.id, "Approved")}
                      className="inline-flex items-center gap-1.5 rounded-3xl bg-emerald-500/10 px-3.5 py-2 text-xs text-emerald-300 transition hover:bg-emerald-500/20">
                      <CheckCircle className="h-3.5 w-3.5" /> Approve
                    </button>
                    <button type="button" onClick={() => handleQuickStatus(req.id, "Rejected")}
                      className="inline-flex items-center gap-1.5 rounded-3xl bg-rose-500/10 px-3.5 py-2 text-xs text-rose-300 transition hover:bg-rose-500/20">
                      <XCircle className="h-3.5 w-3.5" /> Reject
                    </button>
                  </>
                )}
                <button type="button" onClick={() => handleOpenEdit(req)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-3.5 py-2 text-xs text-slate-300 transition hover:bg-slate-900">Edit</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">{editingReq ? "Edit Request" : "New Employee Request"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Employee Name *</label>
                  <input type="text" required value={formData.employeeName}
                    onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Email *</label>
                  <input type="email" required value={formData.employeeEmail}
                    onChange={(e) => setFormData({ ...formData, employeeEmail: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Request Type</label>
                  <select value={formData.requestType} onChange={(e) => setFormData({ ...formData, requestType: e.target.value as any })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                    {REQUEST_TYPES.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Status</label>
                  <select value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description *</label>
                <textarea required rows={3} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 resize-none" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">HR Notes</label>
                <textarea rows={2} value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit"
                  className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                  {editingReq ? "Update Request" : "Create Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}

function getRequestTypeStyle(type: string) {
  switch (type) {
    case "Leave": return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
    case "Equipment": return "bg-cyan-500/10 text-cyan-400 border border-cyan-500/20";
    case "Training": return "bg-purple-500/10 text-purple-400 border border-purple-500/20";
    case "Transfer": return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
    case "Resignation": return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    default: return "bg-slate-800 text-slate-400 border border-slate-700";
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "Pending": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "Approved": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    default: return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
  }
}
