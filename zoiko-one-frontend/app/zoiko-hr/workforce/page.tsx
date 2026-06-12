"use client";

import { useEffect, useState } from "react";
import { Briefcase, UserCheck, UserCog, Users, UserPlus } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import StatusBadge from "../../components/StatusBadge";
import ReusableTable, { type TableColumn } from "../../components/ReusableTable";
import { fetchEmployees, type Employee } from "../../lib/workforce-api";

export default function WorkforceDashboardPage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    fetchEmployees({ take: 5, orderBy: "createdAt", orderDir: "desc" })
      .then((res) => {
        setEmployees(res.data);
        setTotal(res.total);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const activeCount = employees.filter((e) => e.status === "ACTIVE").length;
  const fullTimeCount = employees.filter((e) => e.employmentType === "FULL_TIME").length;
  const contractCount = employees.filter((e) => e.employmentType === "CONTRACT").length;

  const columns: TableColumn<Employee>[] = [
    { key: "employeeId", header: "Employee ID" },
    { key: "firstName", header: "Name", render: (row) => `${row.firstName} ${row.lastName}` },
    { key: "email", header: "Email" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "employmentType",
      header: "Type",
      render: (row) => (
        <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
          {row.employmentType.replace(/_/g, " ")}
        </span>
      ),
    },
    {
      key: "joinDate",
      header: "Joined",
      render: (row) => new Date(row.joinDate).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Link
          href={`/zoiko-hr/workforce/employees/${row.id}`}
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
        title="Workforce"
        description="Manage employees, track employment records, documents and emergency contacts."
        action={
          <Link
            href="/zoiko-hr/workforce/employees/new"
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <UserPlus className="h-4 w-4" />
            Add Employee
          </Link>
        }
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Employees" value={loading ? "..." : total} icon={Users} />
        <KPICard title="Active" value={loading ? "..." : activeCount} icon={UserCheck} />
        <KPICard title="Full-Time" value={loading ? "..." : fullTimeCount} icon={Briefcase} />
        <KPICard title="Contractors" value={loading ? "..." : contractCount} icon={UserCog} />
      </section>

      <ReusableTable
        title="Recent Employees"
        description="Newest additions to the workforce."
        columns={columns}
        data={employees}
        emptyState="No employees found."
      />
    </SuperAdminShell>
  );
}
