"use client";

import { useState } from "react";
import { ArrowUpDown, Search, X, CheckCircle2, Clock, TrendingUp } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";

interface TransferRecord {
  id: string;
  employeeName: string;
  fromPosition: string;
  toPosition: string;
  fromDepartment: string;
  toDepartment: string;
  effectiveDate: string;
  type: "PROMOTION" | "TRANSFER" | "DEMOTION";
  status: "PENDING" | "APPROVED" | "COMPLETED" | "REJECTED";
}

const initialRecords: TransferRecord[] = [
  { id: "tr-1", employeeName: "David Kim", fromPosition: "Frontend Developer", toPosition: "Senior Frontend Developer", fromDepartment: "Engineering", toDepartment: "Engineering", effectiveDate: "2026-06-15", type: "PROMOTION", status: "APPROVED" },
  { id: "tr-2", employeeName: "Eva Green", fromPosition: "HR Associate", toPosition: "HR Manager", fromDepartment: "Human Resources", toDepartment: "Human Resources", effectiveDate: "2026-05-30", type: "PROMOTION", status: "COMPLETED" },
  { id: "tr-3", employeeName: "Frank Liu", fromPosition: "Software Engineer", toPosition: "Product Manager", fromDepartment: "Engineering", toDepartment: "Product", effectiveDate: "2026-05-20", type: "TRANSFER", status: "COMPLETED" },
  { id: "tr-4", employeeName: "Grace Kim", fromPosition: "Marketing Lead", toPosition: "Brand Manager", fromDepartment: "Marketing", toDepartment: "Marketing", effectiveDate: "2026-06-20", type: "PROMOTION", status: "PENDING" },
  { id: "tr-5", employeeName: "Henry Zhao", fromPosition: "Data Analyst", toPosition: "Senior Data Analyst", fromDepartment: "Analytics", toDepartment: "Analytics", effectiveDate: "2026-07-01", type: "PROMOTION", status: "PENDING" },
  { id: "tr-6", employeeName: "Iris Chen", fromPosition: "Operations", toPosition: "Operations", fromDepartment: "Operations", toDepartment: "Supply Chain", effectiveDate: "2026-05-15", type: "TRANSFER", status: "COMPLETED" },
];

export default function TransfersPage() {
  const [records, setRecords] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ employeeName: "", fromPosition: "", toPosition: "", fromDepartment: "", toDepartment: "", type: "TRANSFER" as TransferRecord["type"] });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const openCreate = () => {
    setFormData({ employeeName: "", fromPosition: "", toPosition: "", fromDepartment: "", toDepartment: "", type: "TRANSFER" });
    setFormError("");
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.employeeName.trim() || !formData.toPosition.trim() || !formData.toDepartment.trim()) {
      setFormError("Employee name, new position, and new department are required.");
      return;
    }
    setSubmitting(true); setFormError("");
    try {
      const newRecord: TransferRecord = {
        id: `tr-${Date.now()}`,
        employeeName: formData.employeeName.trim(),
        fromPosition: formData.fromPosition.trim() || "N/A",
        toPosition: formData.toPosition.trim(),
        fromDepartment: formData.fromDepartment.trim() || "N/A",
        toDepartment: formData.toDepartment.trim(),
        effectiveDate: new Date().toISOString().split("T")[0],
        type: formData.type,
        status: "PENDING",
      };
      setRecords((prev) => [...prev, newRecord]);
      setShowForm(false);
    } catch (err) {
      setFormError(err instanceof Error ? err.message : "Failed to create transfer record.");
    } finally { setSubmitting(false); }
  };

  const filtered = records.filter((r) => {
    const matchesSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.fromPosition.toLowerCase().includes(search.toLowerCase()) || r.toPosition.toLowerCase().includes(search.toLowerCase());
    const matchesType = typeFilter === "All" || r.type === typeFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesType && matchesStatus;
  });

  const totalCount = records.length;
  const approved = records.filter((r) => r.status === "APPROVED" || r.status === "COMPLETED").length;
  const pending = records.filter((r) => r.status === "PENDING").length;
  const promotions = records.filter((r) => r.type === "PROMOTION").length;

  return (
    <SuperAdminShell>
      <PageHeader
        title="Promotions & Transfers"
        description="Track employee promotions, internal transfers, and role changes across the organization."
        action={
          <button
            type="button"
            onClick={openCreate}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <ArrowUpDown className="h-4 w-4" /> New Transfer
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Changes", value: totalCount, icon: <ArrowUpDown className="h-5 w-5" />, color: "text-indigo-400" },
          { label: "Completed", value: approved, icon: <CheckCircle2 className="h-5 w-5" />, color: "text-emerald-400" },
          { label: "Pending", value: pending, icon: <Clock className="h-5 w-5" />, color: "text-amber-400" },
          { label: "Promotions", value: promotions, icon: <TrendingUp className="h-5 w-5" />, color: "text-blue-400" },
        ].map((card) => (
          <div key={card.label} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">{card.label}</p>
              <h3 className="mt-2 text-3xl font-bold text-white">{card.value}</h3>
            </div>
            <div className={`rounded-2xl bg-slate-800/50 p-3 ${card.color}`}>{card.icon}</div>
          </div>
        ))}
      </div>

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name or position..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
            {search && (
              <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="h-4 w-4" />
              </button>
            )}
          </div>
          <div className="min-w-[130px]">
            <select
              value={typeFilter}
              onChange={(e) => setTypeFilter(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-400 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Types</option>
              <option value="PROMOTION">Promotion</option>
              <option value="TRANSFER">Transfer</option>
              <option value="DEMOTION">Demotion</option>
            </select>
          </div>
          <div className="min-w-[130px]">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-400 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="PENDING">Pending</option>
              <option value="APPROVED">Approved</option>
              <option value="COMPLETED">Completed</option>
              <option value="REJECTED">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="overflow-x-auto rounded-[20px] border border-slate-850">
          <table className="w-full min-w-[800px] text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Employee</th>
                <th className="px-4 py-3">From</th>
                <th className="px-4 py-3">To</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Effective Date</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-slate-500">No transfer records found.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-950/40 transition">
                    <td className="px-4 py-3 text-white font-medium">{r.employeeName}</td>
                    <td className="px-4 py-3">
                      <div className="text-slate-300">{r.fromPosition}</div>
                      <div className="text-[10px] text-slate-500">{r.fromDepartment}</div>
                    </td>
                    <td className="px-4 py-3">
                      <div className="text-slate-300">{r.toPosition}</div>
                      <div className="text-[10px] text-slate-500">{r.toDepartment}</div>
                    </td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        r.type === "PROMOTION" ? "bg-emerald-500/10 text-emerald-400" : r.type === "TRANSFER" ? "bg-blue-500/10 text-blue-400" : "bg-rose-500/10 text-rose-400"
                      }`}>
                        {r.type}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{new Date(r.effectiveDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm" onClick={() => setShowForm(false)}>
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <h2 className="mb-4 text-lg font-semibold text-white">New Transfer Record</h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-xs text-slate-400">Employee Name *</label>
                <input type="text" value={formData.employeeName} onChange={(e) => setFormData({ ...formData, employeeName: e.target.value })} className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">From Position</label>
                  <input type="text" value={formData.fromPosition} onChange={(e) => setFormData({ ...formData, fromPosition: e.target.value })} className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-400">To Position *</label>
                  <input type="text" value={formData.toPosition} onChange={(e) => setFormData({ ...formData, toPosition: e.target.value })} className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="mb-1 block text-xs text-slate-400">From Department</label>
                  <input type="text" value={formData.fromDepartment} onChange={(e) => setFormData({ ...formData, fromDepartment: e.target.value })} className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                </div>
                <div>
                  <label className="mb-1 block text-xs text-slate-400">To Department *</label>
                  <input type="text" value={formData.toDepartment} onChange={(e) => setFormData({ ...formData, toDepartment: e.target.value })} className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="mb-1 block text-xs text-slate-400">Type *</label>
                <select value={formData.type} onChange={(e) => setFormData({ ...formData, type: e.target.value as TransferRecord["type"] })} className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white outline-none focus:border-indigo-500">
                  <option value="TRANSFER">Transfer</option>
                  <option value="PROMOTION">Promotion</option>
                  <option value="DEMOTION">Demotion</option>
                </select>
              </div>
              {formError && <p className="text-xs text-rose-400">{formError}</p>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-3xl border border-slate-700 px-5 py-2 text-xs text-slate-300 hover:bg-slate-800">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-3xl bg-indigo-600 px-5 py-2 text-xs text-white hover:bg-indigo-500 disabled:opacity-50">{submitting ? "Saving..." : "Create"}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
