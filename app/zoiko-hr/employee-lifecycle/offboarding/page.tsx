"use client";

import { useState } from "react";
import { UserX, Search, X, CheckCircle2, Clock, AlertTriangle } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";

interface OffboardingRecord {
  id: string;
  employeeName: string;
  position: string;
  department: string;
  exitDate: string;
  reason: "RESIGNATION" | "RETIREMENT" | "TERMINATION" | "END_OF_CONTRACT" | "OTHER";
  status: "PENDING" | "IN_PROGRESS" | "COMPLETED" | "CANCELLED";
  tasksCompleted: number;
  totalTasks: number;
}

const initialRecords: OffboardingRecord[] = [
  { id: "of-1", employeeName: "Grace Hopper", position: "Data Analyst", department: "Analytics", exitDate: "2026-06-10", reason: "RESIGNATION", status: "PENDING", tasksCompleted: 2, totalTasks: 7 },
  { id: "of-2", employeeName: "Hank Miller", position: "QA Engineer", department: "Engineering", exitDate: "2026-05-28", reason: "END_OF_CONTRACT", status: "COMPLETED", tasksCompleted: 7, totalTasks: 7 },
  { id: "of-3", employeeName: "Ivy Adams", position: "Marketing Specialist", department: "Marketing", exitDate: "2026-05-15", reason: "RESIGNATION", status: "COMPLETED", tasksCompleted: 7, totalTasks: 7 },
  { id: "of-4", employeeName: "Jack Wilson", position: "Operations Manager", department: "Operations", exitDate: "2026-06-30", reason: "RETIREMENT", status: "PENDING", tasksCompleted: 0, totalTasks: 7 },
  { id: "of-5", employeeName: "Katherine Lee", position: "Accountant", department: "Finance", exitDate: "2026-06-05", reason: "OTHER", status: "IN_PROGRESS", tasksCompleted: 3, totalTasks: 7 },
];

export default function OffboardingPage() {
  const [records] = useState(initialRecords);
  const [search, setSearch] = useState("");
  const [reasonFilter, setReasonFilter] = useState("All");
  const [statusFilter, setStatusFilter] = useState("All");

  const filtered = records.filter((r) => {
    const matchesSearch = r.employeeName.toLowerCase().includes(search.toLowerCase()) || r.position.toLowerCase().includes(search.toLowerCase());
    const matchesReason = reasonFilter === "All" || r.reason === reasonFilter;
    const matchesStatus = statusFilter === "All" || r.status === statusFilter;
    return matchesSearch && matchesReason && matchesStatus;
  });

  const totalCount = records.length;
  const inProgress = records.filter((r) => r.status === "IN_PROGRESS").length;
  const completed = records.filter((r) => r.status === "COMPLETED").length;
  const pending = records.filter((r) => r.status === "PENDING").length;

  return (
    <SuperAdminShell>
      <PageHeader
        title="Offboarding"
        description="Manage employee offboarding — track exit checklists, asset returns, and final settlements."
        action={
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <UserX className="h-4 w-4" /> New Offboarding
          </button>
        }
      />

      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Total Offboardings", value: totalCount, icon: <UserX className="h-5 w-5" />, color: "text-rose-400" },
          { label: "In Progress", value: inProgress, icon: <Clock className="h-5 w-5" />, color: "text-amber-400" },
          { label: "Completed", value: completed, icon: <CheckCircle2 className="h-5 w-5" />, color: "text-emerald-400" },
          { label: "Pending", value: pending, icon: <AlertTriangle className="h-5 w-5" />, color: "text-slate-400" },
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
              value={reasonFilter}
              onChange={(e) => setReasonFilter(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Reasons</option>
              <option value="RESIGNATION">Resignation</option>
              <option value="RETIREMENT">Retirement</option>
              <option value="TERMINATION">Termination</option>
              <option value="END_OF_CONTRACT">End of Contract</option>
              <option value="OTHER">Other</option>
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
              <option value="IN_PROGRESS">In Progress</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
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
                <th className="px-4 py-3">Position</th>
                <th className="px-4 py-3">Department</th>
                <th className="px-4 py-3">Exit Date</th>
                <th className="px-4 py-3">Reason</th>
                <th className="px-4 py-3">Progress</th>
                <th className="px-4 py-3">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-slate-500">No offboarding records found.</td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-950/40 transition">
                    <td className="px-4 py-3 text-white font-medium">{r.employeeName}</td>
                    <td className="px-4 py-3 text-slate-300">{r.position}</td>
                    <td className="px-4 py-3 text-slate-300">{r.department}</td>
                    <td className="px-4 py-3 text-slate-400">{new Date(r.exitDate).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <span className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${
                        r.reason === "RESIGNATION" ? "bg-amber-500/10 text-amber-400" : r.reason === "RETIREMENT" ? "bg-blue-500/10 text-blue-400" : r.reason === "TERMINATION" ? "bg-rose-500/10 text-rose-400" : r.reason === "END_OF_CONTRACT" ? "bg-purple-500/10 text-purple-400" : "bg-slate-500/10 text-slate-400"
                      }`}>
                        {r.reason.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <div className="h-1.5 w-20 rounded-full bg-slate-800 overflow-hidden">
                          <div
                            className={`h-full rounded-full ${r.tasksCompleted === r.totalTasks ? "bg-emerald-500" : r.tasksCompleted > 0 ? "bg-amber-500" : "bg-slate-700"}`}
                            style={{ width: `${(r.tasksCompleted / r.totalTasks) * 100}%` }}
                          />
                        </div>
                        <span className="text-slate-400">{r.tasksCompleted}/{r.totalTasks}</span>
                      </div>
                    </td>
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
