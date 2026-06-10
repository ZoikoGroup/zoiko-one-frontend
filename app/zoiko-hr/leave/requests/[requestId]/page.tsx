"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Calendar, Check, Ban } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SuperAdminShell from "../../../../components/SuperAdminShell";
import StatusBadge from "../../../../components/StatusBadge";
import { fetchLeaveRequest, approveLeaveRequest, type LeaveRequest } from "../../../../lib/workforce-api";

export default function LeaveRequestDetailPage() {
  const params = useParams();
  const requestId = params.requestId as string;

  const [request, setRequest] = useState<LeaveRequest | null>(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);

  const load = () => {
    fetchLeaveRequest(requestId)
      .then((res) => setRequest(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [requestId]);

  const handleAction = async (action: "APPROVED" | "REJECTED") => {
    setActionLoading(true);
    try {
      await approveLeaveRequest(requestId, action);
      load();
    } catch (err) { console.error("Failed to approve/reject leave request:", err); }
    setActionLoading(false);
  };

  if (loading) {
    return <SuperAdminShell><div className="flex items-center justify-center py-20"><p className="text-slate-400">Loading...</p></div></SuperAdminShell>;
  }

  if (!request) {
    return <SuperAdminShell><div className="flex items-center justify-center py-20"><p className="text-slate-400">Leave request not found.</p></div></SuperAdminShell>;
  }

  return (
    <SuperAdminShell>
      <div className="mb-6">
        <Link href="/zoiko-hr/leave/requests" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Leave Requests
        </Link>
      </div>

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600/10">
            <Calendar className="h-7 w-7 text-indigo-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">
                {request.employee?.firstName} {request.employee?.lastName}
              </h1>
              <StatusBadge status={request.status} />
            </div>
            <p className="mt-1 text-sm text-slate-400">
              {request.leaveType?.name} · {request.leaveType?.code} · {request.employee?.employeeId}
            </p>
          </div>
        </div>
        {request.status === "SUBMITTED" && (
          <div className="mt-4 flex gap-3 pt-4 border-t border-slate-800">
            <button type="button" disabled={actionLoading} onClick={() => handleAction("APPROVED")}
              className="inline-flex items-center gap-2 rounded-3xl bg-emerald-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50">
              <Check className="h-4 w-4" /> {actionLoading ? "Processing..." : "Approve"}
            </button>
            <button type="button" disabled={actionLoading} onClick={() => handleAction("REJECTED")}
              className="inline-flex items-center gap-2 rounded-3xl bg-rose-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-500 disabled:opacity-50">
              <Ban className="h-4 w-4" /> {actionLoading ? "Processing..." : "Reject"}
            </button>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white">Request Details</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between"><dt className="text-slate-400">Employee</dt><dd className="text-white">{request.employee?.firstName} {request.employee?.lastName}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Employee ID</dt><dd className="font-mono text-white">{request.employee?.employeeId}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Leave Type</dt><dd className="text-white">{request.leaveType?.name}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Category</dt><dd className="text-white">{request.leaveType?.category}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Start Date</dt><dd className="text-white">{new Date(request.startDate).toLocaleDateString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">End Date</dt><dd className="text-white">{new Date(request.endDate).toLocaleDateString()}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Working Days</dt><dd className="text-white font-semibold">{request.workingDaysRequested}</dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Status</dt><dd><StatusBadge status={request.status} /></dd></div>
            <div className="flex justify-between"><dt className="text-slate-400">Request Date</dt><dd className="text-slate-300">{new Date(request.requestDate).toLocaleDateString()}</dd></div>
            {request.rejectionReason && <div className="flex justify-between"><dt className="text-slate-400">Rejection Reason</dt><dd className="text-rose-300 text-right max-w-[50%]">{request.rejectionReason}</dd></div>}
          </dl>
          {request.reason && (
            <div className="mt-4 pt-4 border-t border-slate-800">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">Reason</h3>
              <p className="text-sm text-slate-300">{request.reason}</p>
            </div>
          )}
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white">Approval Timeline</h2>
          {(!request.approvals || request.approvals.length === 0) ? (
            <p className="text-sm text-slate-400">No approval actions recorded yet.</p>
          ) : (
            <div className="space-y-3">
              {request.approvals.map((a) => (
                <div key={a.id} className="flex items-start gap-3 rounded-2xl border border-slate-800 bg-slate-950/50 p-4">
                  <div className={`flex h-8 w-8 items-center justify-center rounded-full ${a.status === "APPROVED" ? "bg-emerald-600/20" : a.status === "REJECTED" ? "bg-rose-600/20" : "bg-slate-800"}`}>
                    {a.status === "APPROVED" ? <Check className="h-4 w-4 text-emerald-400" /> : a.status === "REJECTED" ? <Ban className="h-4 w-4 text-rose-400" /> : <span className="text-xs text-slate-400">{a.level}</span>}
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-white">
                      {a.status === "APPROVED" ? "Approved" : a.status === "REJECTED" ? "Rejected" : "Pending"} {a.approver ? `by ${a.approver.firstName} ${a.approver.lastName}` : ""}
                    </p>
                    {a.reason && <p className="text-xs text-slate-400 mt-0.5">{a.reason}</p>}
                    <p className="text-xs text-slate-500 mt-0.5">Level {a.level} · {a.approvedAt ? new Date(a.approvedAt).toLocaleString() : ""}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </SuperAdminShell>
  );
}
