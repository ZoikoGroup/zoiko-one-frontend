"use client";

import { useEffect, useState } from "react";
import { Plus, Search, X, Check, Ban } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchLeaveRequests, createLeaveRequest, approveLeaveRequest, cancelLeaveRequest, fetchLeaveTypes, fetchEmployees, type LeaveRequest, type LeaveType, type Employee } from "../../../lib/workforce-api";

const STATUS_OPTIONS = ["DRAFT", "SUBMITTED", "APPROVED", "REJECTED", "CANCELLED", "IN_PROGRESS", "COMPLETED"] as const;

export default function LeaveRequestsPage() {
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 20;

  const [leaveTypes, setLeaveTypes] = useState<LeaveType[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({ employeeId: "", leaveTypeId: "", startDate: "", endDate: "", workingDaysRequested: "", reason: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formError, setFormError] = useState("");

  const [approveId, setApproveId] = useState<string | null>(null);
  const [approveAction, setApproveAction] = useState<"APPROVED" | "REJECTED">("APPROVED");
  const [approveReason, setApproveReason] = useState("");
  const [approving, setApproving] = useState(false);

  useEffect(() => {
    fetchLeaveRequests({ search: search || undefined, status: statusFilter || undefined, leaveTypeId: typeFilter || undefined, skip: page * pageSize, take: pageSize, orderBy: "createdAt", orderDir: "desc" })
      .then((res) => { setRequests(res.data); setTotal(res.total); setLoaded(true); }).catch(() => {});
  }, [search, statusFilter, typeFilter, page, refreshKey]);

  useEffect(() => {
    fetchLeaveTypes({ take: 100 }).then((res) => setLeaveTypes(res.data)).catch(() => {});
    fetchEmployees({ take: 100, orderBy: "firstName", orderDir: "asc" }).then((res) => setEmployees(res.data)).catch(() => {});
  }, []);

  const openAddForm = () => {
    setFormData({ employeeId: "", leaveTypeId: "", startDate: "", endDate: "", workingDaysRequested: "", reason: "" });
    setFormError(""); setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true); setFormError("");
    try {
      await createLeaveRequest({
        employeeId: formData.employeeId, leaveTypeId: formData.leaveTypeId,
        startDate: formData.startDate, endDate: formData.endDate,
        workingDaysRequested: formData.workingDaysRequested ? Number(formData.workingDaysRequested) : undefined,
        reason: formData.reason || undefined,
      });
      setShowForm(false); setRefreshKey((k) => k + 1);
    } catch (err) { setFormError(err instanceof Error ? err.message : "Failed to create request."); }
    finally { setSubmitting(false); }
  };

  const handleApprove = async () => {
    if (!approveId) return;
    setApproving(true);
    try {
      await approveLeaveRequest(approveId, approveAction, approveReason || undefined);
      setApproveId(null); setApproveReason(""); setRefreshKey((k) => k + 1);
    } catch {}
    setApproving(false);
  };

  const handleCancel = async (id: string) => {
    try { await cancelLeaveRequest(id); setRefreshKey((k) => k + 1); } catch {}
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <SuperAdminShell>
      <PageHeader title="Leave Requests" description="View and manage employee leave requests."
        action={<button type="button" onClick={openAddForm} className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"><Plus className="h-4 w-4" /> New Request</button>}
      />
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" placeholder="Search by employee name or ID..." value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(0); }}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s.charAt(0) + s.slice(1).toLowerCase()}</option>)}
          </select>
          <select value={typeFilter} onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
            <option value="">All Leave Types</option>
            {leaveTypes.map((lt) => <option key={lt.id} value={lt.id}>{lt.name}</option>)}
          </select>
        </div>
      </div>
      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">All Requests <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[950px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Employee</th>
                <th className="px-5 py-3 font-semibold">Leave Type</th>
                <th className="px-5 py-3 font-semibold">From</th>
                <th className="px-5 py-3 font-semibold">To</th>
                <th className="px-5 py-3 font-semibold">Days</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {!loaded ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">Loading...</td></tr>
              ) : requests.length === 0 ? (
                <tr><td colSpan={7} className="px-5 py-12 text-center text-slate-400">No leave requests found.</td></tr>
              ) : requests.map((r) => (
                <tr key={r.id} className="transition duration-200 hover:bg-slate-900/80">
                  <td className="border-t border-slate-800 px-5 py-4">
                    <Link href={`/zoiko-hr/leave/requests/${r.id}`} className="text-white hover:text-indigo-400 transition">
                      {r.employee?.firstName} {r.employee?.lastName}
                    </Link>
                    <p className="text-xs text-slate-500">{r.employee?.employeeId}</p>
                  </td>
                  <td className="border-t border-slate-800 px-5 py-4">{r.leaveType?.name ?? "—"}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{new Date(r.startDate).toLocaleDateString()}</td>
                  <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{new Date(r.endDate).toLocaleDateString()}</td>
                  <td className="border-t border-slate-800 px-5 py-4">{r.workingDaysRequested}</td>
                  <td className="border-t border-slate-800 px-5 py-4"><StatusBadge status={r.status} /></td>
                  <td className="border-t border-slate-800 px-5 py-4">
                    <div className="flex items-center gap-1.5">
                      <Link href={`/zoiko-hr/leave/requests/${r.id}`} className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white">View</Link>
                      {r.status === "SUBMITTED" && (
                        <>
                          <button type="button" onClick={() => { setApproveId(r.id); setApproveAction("APPROVED"); setApproveReason(""); }} className="rounded-3xl bg-emerald-600/10 px-3 py-1.5 text-xs text-emerald-300 transition hover:bg-emerald-600/20"><Check className="h-3 w-3 inline mr-0.5" />Approve</button>
                          <button type="button" onClick={() => { setApproveId(r.id); setApproveAction("REJECTED"); setApproveReason(""); }} className="rounded-3xl bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20"><Ban className="h-3 w-3 inline mr-0.5" />Reject</button>
                        </>
                      )}
                      {(r.status === "DRAFT" || r.status === "SUBMITTED") && (
                        <button type="button" onClick={() => handleCancel(r.id)} className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-400 transition hover:bg-slate-700">Cancel</button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
            <p className="text-sm text-slate-400">Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}</p>
            <div className="flex gap-2">
              <button type="button" disabled={page === 0} onClick={() => setPage((p) => p - 1)} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40">Previous</button>
              <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40">Next</button>
            </div>
          </div>
        )}
      </section>

      {showForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-lg rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-white">New Leave Request</h3>
              <button type="button" onClick={() => setShowForm(false)} className="text-slate-400 hover:text-white"><X className="h-5 w-5" /></button>
            </div>
            {formError && <p className="mb-4 rounded-2xl bg-rose-500/10 px-4 py-2 text-sm text-rose-300">{formError}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Employee *</label>
                <select required value={formData.employeeId} onChange={(e) => setFormData({ ...formData, employeeId: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                  <option value="">Select employee...</option>
                  {employees.map((emp) => <option key={emp.id} value={emp.id}>{emp.firstName} {emp.lastName} ({emp.employeeId})</option>)}
                </select>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Leave Type *</label>
                <select required value={formData.leaveTypeId} onChange={(e) => setFormData({ ...formData, leaveTypeId: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500">
                  <option value="">Select leave type...</option>
                  {leaveTypes.map((lt) => <option key={lt.id} value={lt.id}>{lt.name} ({lt.code})</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Start Date *</label>
                  <input type="date" required value={formData.startDate} onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">End Date *</label>
                  <input type="date" required value={formData.endDate} onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Working Days</label>
                <input type="number" min={0} value={formData.workingDaysRequested} onChange={(e) => setFormData({ ...formData, workingDaysRequested: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-1.5">Reason</label>
                <textarea rows={2} value={formData.reason} onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowForm(false)} className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
                <button type="submit" disabled={submitting} className="rounded-3xl bg-indigo-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50">
                  {submitting ? "Submitting..." : "Submit"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {approveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">{approveAction === "APPROVED" ? "Approve" : "Reject"} Leave Request</h3>
            <p className="mt-2 text-sm text-slate-400">{approveAction === "APPROVED" ? "Confirm approval of this leave request." : "Provide a reason for rejection."}</p>
            {approveAction === "REJECTED" && (
              <textarea placeholder="Rejection reason..." rows={2} value={approveReason} onChange={(e) => setApproveReason(e.target.value)}
                className="mt-3 w-full rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-white outline-none transition focus:border-indigo-500" />
            )}
            <div className="mt-6 flex justify-end gap-3">
              <button type="button" onClick={() => setApproveId(null)} className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900">Cancel</button>
              <button type="button" disabled={approving} onClick={handleApprove}
                className={`rounded-3xl px-5 py-2 text-sm font-medium text-white transition disabled:opacity-50 ${approveAction === "APPROVED" ? "bg-emerald-600 hover:bg-emerald-500" : "bg-rose-600 hover:bg-rose-500"}`}>
                {approving ? "Processing..." : approveAction === "APPROVED" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
