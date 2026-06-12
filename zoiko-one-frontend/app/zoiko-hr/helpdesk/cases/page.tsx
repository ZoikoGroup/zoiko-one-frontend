"use client";

import { useState } from "react";
import { Plus, Search, X, ArrowUpRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialCases, type HelpdeskCase } from "../mockData";

const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;
const STATUSES = ["New", "Investigating", "Resolved", "Closed"] as const;

export default function CasesPage() {
  const [cases, setCases] = useState<HelpdeskCase[]>(initialCases);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingCase, setEditingCase] = useState<HelpdeskCase | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    relatedTicketId: "",
    relatedTicketTitle: "",
    priority: "Medium" as HelpdeskCase["priority"],
    status: "New" as HelpdeskCase["status"],
    assignedTo: "",
    resolution: "",
  });

  const handleOpenAdd = () => {
    setFormData({ title: "", description: "", relatedTicketId: "", relatedTicketTitle: "", priority: "Medium", status: "New", assignedTo: "", resolution: "" });
    setEditingCase(null);
    setShowModal(true);
  };

  const handleOpenEdit = (c: HelpdeskCase) => {
    setFormData({
      title: c.title,
      description: c.description,
      relatedTicketId: c.relatedTicketId,
      relatedTicketTitle: c.relatedTicketTitle,
      priority: c.priority,
      status: c.status,
      assignedTo: c.assignedTo,
      resolution: c.resolution,
    });
    setEditingCase(c);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const today = new Date().toISOString().split("T")[0];
    if (editingCase) {
      setCases(
        cases.map((c) =>
          c.id === editingCase.id
            ? { ...c, ...formData, resolvedAt: (formData.status === "Resolved" || formData.status === "Closed") && !c.resolvedAt ? today : c.resolvedAt }
            : c
        )
      );
    } else {
      const count = cases.length + 1;
      const newCase: HelpdeskCase = {
        id: `case-${Date.now()}`,
        caseNumber: `CASE-${String(count).padStart(3, "0")}`,
        ...formData,
        createdAt: today,
        resolvedAt: "",
      };
      setCases([newCase, ...cases]);
    }
    setShowModal(false);
  };

  const filtered = cases.filter((c) => {
    const q = search.toLowerCase();
    const matchSearch = c.title.toLowerCase().includes(q) || c.caseNumber.toLowerCase().includes(q) || c.description.toLowerCase().includes(q) || c.assignedTo.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || c.status === statusFilter;
    const matchPriority = priorityFilter === "All" || c.priority === priorityFilter;
    return matchSearch && matchStatus && matchPriority;
  });

  const newCount = cases.filter((c) => c.status === "New").length;
  const investigatingCount = cases.filter((c) => c.status === "Investigating").length;
  const resolvedCount = cases.filter((c) => c.status === "Resolved").length;

  return (
    <SuperAdminShell>
      <PageHeader
        title="Case Management"
        description="Track and manage HR service desk cases from investigation through resolution."
        action={
          <button type="button" onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> New Case
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">New</p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-400">{newCount}</h3>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Investigating</p>
          <h3 className="mt-2 text-3xl font-bold text-amber-400">{investigatingCount}</h3>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Resolved</p>
          <h3 className="mt-2 text-3xl font-bold text-indigo-400">{resolvedCount}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search cases by title, number, or assignee..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="All">All Statuses</option>
            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
          <select value={priorityFilter} onChange={(e) => setPriorityFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="All">All Priorities</option>
            {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
          </select>
        </div>
      </div>

      {/* Cases Table */}
      <div className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Case</th>
                <th className="px-5 py-3 font-semibold">Title</th>
                <th className="px-5 py-3 font-semibold">Priority</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Assignee</th>
                <th className="px-5 py-3 font-semibold">Related Ticket</th>
                <th className="px-5 py-3 font-semibold">Created</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr><td colSpan={8} className="px-5 py-12 text-center text-slate-400">No cases found.</td></tr>
              ) : filtered.map((c) => (
                <tr key={c.id} className="transition hover:bg-slate-900/80">
                  <td className="px-5 py-4 font-mono text-xs text-amber-400">{c.caseNumber}</td>
                  <td className="px-5 py-4 text-slate-200 max-w-[220px] truncate">{c.title}</td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${getPriorityStyle(c.priority)}`}>{c.priority}</span>
                  </td>
                  <td className="px-5 py-4">
                    <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${getStatusStyle(c.status)}`}>{c.status}</span>
                  </td>
                  <td className="px-5 py-4 text-slate-300">{c.assignedTo}</td>
                  <td className="px-5 py-4 text-xs text-slate-500">{c.relatedTicketTitle}</td>
                  <td className="px-5 py-4 text-xs text-slate-500">{c.createdAt}</td>
                  <td className="px-5 py-4">
                    <button type="button" onClick={() => handleOpenEdit(c)}
                      className="rounded-3xl bg-indigo-600/10 px-3 py-1.5 text-xs text-indigo-300 transition hover:bg-indigo-600/20">View / Edit</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">{editingCase ? "Edit Case" : "Create Case"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Title *</label>
                <input type="text" required value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description *</label>
                <textarea required rows={3} value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Priority</label>
                  <select value={formData.priority} onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                    {PRIORITIES.map((p) => <option key={p} value={p}>{p}</option>)}
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
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Assigned To</label>
                  <input type="text" value={formData.assignedTo}
                    onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Related Ticket ID</label>
                  <input type="text" value={formData.relatedTicketId}
                    onChange={(e) => setFormData({ ...formData, relatedTicketId: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Related Ticket Title</label>
                <input type="text" value={formData.relatedTicketTitle}
                  onChange={(e) => setFormData({ ...formData, relatedTicketTitle: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Resolution Notes</label>
                <textarea rows={2} value={formData.resolution}
                  onChange={(e) => setFormData({ ...formData, resolution: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit"
                  className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                  {editingCase ? "Update Case" : "Create Case"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}

function getPriorityStyle(priority: string) {
  switch (priority) {
    case "Critical": return "bg-rose-500/10 text-rose-400 border border-rose-500/20";
    case "High": return "bg-orange-500/10 text-orange-400 border border-orange-500/20";
    case "Medium": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    default: return "bg-slate-800 text-slate-400 border border-slate-700";
  }
}

function getStatusStyle(status: string) {
  switch (status) {
    case "New": return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    case "Investigating": return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
    case "Resolved": return "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20";
    default: return "bg-slate-800 text-slate-400 border border-slate-700";
  }
}
