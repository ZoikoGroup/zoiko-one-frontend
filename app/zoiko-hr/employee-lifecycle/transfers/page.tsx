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
  const [records] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

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
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
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
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
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
    </SuperAdminShell>
  );
}
