"use client";

import { useState } from "react";
import { Search, X, Plus } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { initialSLAs, type SLA } from "../mockData";

const PRIORITIES = ["Low", "Medium", "High", "Critical"] as const;

export default function SLAPage() {
  const [slas, setSLAs] = useState<SLA[]>(initialSLAs);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [showModal, setShowModal] = useState(false);
  const [editingSLA, setEditingSLA] = useState<SLA | null>(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    priority: "Medium" as SLA["priority"],
    targetResponse: 8,
    targetResolution: 48,
    breachCount: 0,
    overallCompliance: 100,
    status: "Active" as SLA["status"],
  });

  const handleOpenAdd = () => {
    setFormData({ name: "", description: "", priority: "Medium", targetResponse: 8, targetResolution: 48, breachCount: 0, overallCompliance: 100, status: "Active" });
    setEditingSLA(null);
    setShowModal(true);
  };

  const handleOpenEdit = (sla: SLA) => {
    setFormData({
      name: sla.name,
      description: sla.description,
      priority: sla.priority,
      targetResponse: sla.targetResponse,
      targetResolution: sla.targetResolution,
      breachCount: sla.breachCount,
      overallCompliance: sla.overallCompliance,
      status: sla.status,
    });
    setEditingSLA(sla);
    setShowModal(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingSLA) {
      setSLAs(slas.map((s) => (s.id === editingSLA.id ? { ...s, ...formData } : s)));
    } else {
      const newSLA: SLA = {
        id: `sla-${Date.now()}`,
        ...formData,
      };
      setSLAs([...slas, newSLA]);
    }
    setShowModal(false);
  };

  const filtered = slas.filter((s) => {
    const q = search.toLowerCase();
    const matchSearch = s.name.toLowerCase().includes(q) || s.description.toLowerCase().includes(q);
    const matchStatus = statusFilter === "All" || s.status === statusFilter;
    return matchSearch && matchStatus;
  });

  const activeSLAs = slas.filter((s) => s.status === "Active");
  const totalBreaches = slas.reduce((sum, s) => sum + s.breachCount, 0);
  const avgCompliance = activeSLAs.length > 0 ? activeSLAs.reduce((sum, s) => sum + s.overallCompliance, 0) / activeSLAs.length : 0;

  return (
    <SuperAdminShell>
      <PageHeader
        title="SLA Tracking"
        description="Monitor service level agreements, compliance rates, and breach metrics for the HR helpdesk."
        action={
          <button type="button" onClick={handleOpenAdd}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500">
            <Plus className="h-4 w-4" /> Add SLA
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Active SLAs</p>
          <h3 className="mt-2 text-3xl font-bold text-emerald-400">{activeSLAs.length}</h3>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Avg Compliance</p>
          <h3 className={`mt-2 text-3xl font-bold ${avgCompliance >= 90 ? "text-emerald-400" : avgCompliance >= 80 ? "text-amber-400" : "text-rose-400"}`}>
            {avgCompliance.toFixed(1)}%
          </h3>
        </div>
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">Total Breaches</p>
          <h3 className="mt-2 text-3xl font-bold text-rose-400">{totalBreaches}</h3>
        </div>
      </div>

      {/* Filters */}
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[220px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search SLA policies by name or description..." value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="All">All Statuses</option>
            <option value="Active">Active</option>
            <option value="Inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* SLA Cards */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 rounded-[28px] border border-dashed border-slate-800 p-12 text-center text-slate-400">
            No SLA policies found.
          </div>
        ) : filtered.map((sla) => (
          <div key={sla.id} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-lg transition hover:border-slate-700">
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <h3 className="text-lg font-semibold text-white">{sla.name}</h3>
                  <span className={`rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${sla.status === "Active" ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-slate-800 text-slate-400 border border-slate-700"}`}>
                    {sla.status}
                  </span>
                </div>
                <p className="mt-2 text-sm text-slate-400">{sla.description}</p>
              </div>
              <span className={`shrink-0 rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase ${getPriorityStyle(sla.priority)}`}>
                {sla.priority}
              </span>
            </div>

            <div className="mt-5 grid grid-cols-3 gap-4">
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Response</p>
                <p className="mt-1 text-lg font-bold text-white">{sla.targetResponse}h</p>
              </div>
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Resolution</p>
                <p className="mt-1 text-lg font-bold text-white">{sla.targetResolution}h</p>
              </div>
              <div className="rounded-2xl bg-slate-950 border border-slate-800 p-3 text-center">
                <p className="text-[10px] uppercase tracking-wider text-slate-500">Breaches</p>
                <p className="mt-1 text-lg font-bold text-rose-400">{sla.breachCount}</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
                <span>Compliance</span>
                <span className={`font-semibold ${sla.overallCompliance >= 95 ? "text-emerald-400" : sla.overallCompliance >= 85 ? "text-amber-400" : "text-rose-400"}`}>
                  {sla.overallCompliance}%
                </span>
              </div>
              <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-500 ${sla.overallCompliance >= 95 ? "bg-emerald-500" : sla.overallCompliance >= 85 ? "bg-amber-500" : "bg-rose-500"}`}
                  style={{ width: `${sla.overallCompliance}%` }}
                />
              </div>
            </div>

            <div className="mt-5 flex justify-end">
              <button type="button" onClick={() => handleOpenEdit(sla)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-3.5 py-1.5 text-xs text-slate-300 transition hover:bg-slate-900">Edit SLA</button>
            </div>
          </div>
        ))}
      </div>

      {/* Add/Edit Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/85 p-4 overflow-y-auto">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-850 pb-4">
              <h3 className="text-lg font-semibold text-white">{editingSLA ? "Edit SLA" : "Create SLA"}</h3>
              <button type="button" onClick={() => setShowModal(false)} className="text-slate-400 hover:text-white transition"><X className="h-5 w-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">SLA Name *</label>
                <input type="text" required value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Description</label>
                <textarea rows={2} value={formData.description}
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
                    <option value="Active">Active</option>
                    <option value="Inactive">Inactive</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Target Response (hours)</label>
                  <input type="number" min={0} step={0.5} required value={formData.targetResponse}
                    onChange={(e) => setFormData({ ...formData, targetResponse: Number(e.target.value) })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Target Resolution (hours)</label>
                  <input type="number" min={0} step={0.5} required value={formData.targetResolution}
                    onChange={(e) => setFormData({ ...formData, targetResolution: Number(e.target.value) })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Breach Count</label>
                  <input type="number" min={0} value={formData.breachCount}
                    onChange={(e) => setFormData({ ...formData, breachCount: Number(e.target.value) })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1.5">Overall Compliance (%)</label>
                  <input type="number" min={0} max={100} value={formData.overallCompliance}
                    onChange={(e) => setFormData({ ...formData, overallCompliance: Number(e.target.value) })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 border-t border-slate-850 pt-4 mt-6">
                <button type="button" onClick={() => setShowModal(false)}
                  className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit"
                  className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-indigo-500">
                  {editingSLA ? "Update SLA" : "Create SLA"}
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
