"use client";

import { useEffect, useState } from "react";
import { Calendar, CheckCircle2, Clock, XCircle, FileText } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import StatusBadge from "../../components/StatusBadge";
import ReusableTable, { type TableColumn } from "../../components/ReusableTable";
import { fetchLeaveRequests, fetchLeaveTypes, type LeaveRequest } from "../../lib/workforce-api";

export default function LeaveDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState<LeaveRequest[]>([]);
  const [total, setTotal] = useState(0);
  const [typeCount, setTypeCount] = useState(0);

  useEffect(() => {
    Promise.all([
      fetchLeaveRequests({ take: 5, orderBy: "createdAt", orderDir: "desc" }),
      fetchLeaveTypes({ take: 0 }),
    ])
      .then(([reqRes, typeRes]) => {
        setRequests(reqRes.data);
        setTotal(reqRes.total);
        setTypeCount(typeRes.total ?? 0);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const pendingCount = requests.filter((r) => r.status === "SUBMITTED" || r.status === "IN_PROGRESS").length;
  const approvedCount = requests.filter((r) => r.status === "APPROVED").length;
  const rejectedCount = requests.filter((r) => r.status === "REJECTED").length;

  const columns: TableColumn<LeaveRequest>[] = [
    { key: "employeeId", header: "Employee", render: (row) => row.employee ? `${row.employee.firstName} ${row.employee.lastName}` : "-" },
    { key: "leaveType", header: "Leave Type", render: (row) => row.leaveType?.name ?? "-" },
    { key: "startDate", header: "Start", render: (row) => new Date(row.startDate).toLocaleDateString() },
    { key: "endDate", header: "End", render: (row) => new Date(row.endDate).toLocaleDateString() },
    { key: "workingDaysRequested", header: "Days" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Link
          href={`/zoiko-hr/leave/requests/${row.id}`}
          className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          View
        </Link>
      ),
    },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Leave Management"
        description="Manage leave types, requests, balances, and the leave calendar."
        action={
          <Link
            href="/zoiko-hr/leave/requests"
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <FileText className="h-4 w-4" />
            View All Requests
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Requests" value={loading ? "..." : total} icon={FileText} />
        <KPICard title="Pending" value={loading ? "..." : pendingCount} icon={Clock} />
        <KPICard title="Approved" value={loading ? "..." : approvedCount} icon={CheckCircle2} />
        <KPICard title="Rejected" value={loading ? "..." : rejectedCount} icon={XCircle} />
      </section>

      <div className="mt-4 grid gap-4 sm:grid-cols-2">
        <KPICard title="Leave Types" value={loading ? "..." : typeCount} icon={Calendar} />
        <KPICard title="Active Requests" value={loading ? "..." : pendingCount + approvedCount} icon={Clock} />
      </div>

      <ReusableTable
        title="Recent Leave Requests"
        description="Latest leave requests submitted."
        columns={columns}
        data={requests}
        emptyState="No leave requests found."
      />
    </SuperAdminShell>
  );
}
