"use client";

import { useEffect, useState } from "react";
import { Briefcase, Users } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import KPICard from "../../../components/KPICard";
import StatusBadge from "../../../components/StatusBadge";
import ReusableTable, { type TableColumn } from "../../../components/ReusableTable";
import { fetchEmployees, type Employee } from "../../../lib/workforce-api";

export default function EmploymentRecordsPage() {
  const [loading, setLoading] = useState(true);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [activeCount, setActiveCount] = useState(0);
  const [fullTimeCount, setFullTimeCount] = useState(0);
  const [contractCount, setContractCount] = useState(0);

  useEffect(() => {
    fetchEmployees({ take: 5, orderBy: "createdAt", orderDir: "desc" })
      .then((res) => {
        setEmployees(res.data);
        setTotal(res.total);
        setActiveCount(res.data.filter((e) => e.status === "ACTIVE").length);
        setFullTimeCount(res.data.filter((e) => e.employmentType === "FULL_TIME").length);
        setContractCount(res.data.filter((e) => e.employmentType === "CONTRACT").length);
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const columns: TableColumn<Employee>[] = [
    { key: "employeeId", header: "Employee ID" },
    { key: "firstName", header: "Name", render: (row) => `${row.firstName} ${row.lastName}` },
    { key: "email", header: "Email" },
    { key: "employmentType", header: "Type", render: (row) => (
      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
        {row.employmentType.replace(/_/g, " ")}
      </span>
    )},
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Link
          href={`/zoiko-hr/workforce/employees/${row.id}`}
          className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          View Records
        </Link>
      ),
    },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Employment Records"
        description="Track employment history, job titles, salary changes, and role transitions."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Employees" value={loading ? "..." : total} icon={Users} />
        <KPICard title="Active" value={loading ? "..." : activeCount} icon={Briefcase} />
        <KPICard title="Full-Time" value={loading ? "..." : fullTimeCount} icon={Briefcase} />
        <KPICard title="Contractors" value={loading ? "..." : contractCount} icon={Briefcase} />
      </section>

      <ReusableTable
        title="Employees"
        description="Select an employee to view and manage their employment records."
        columns={columns}
        data={employees}
        emptyState="No employees found."
      />
    </SuperAdminShell>
  );
}
