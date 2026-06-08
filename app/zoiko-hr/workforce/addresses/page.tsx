"use client";

import { useEffect, useState } from "react";
import { MapPin, Users } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import KPICard from "../../../components/KPICard";
import StatusBadge from "../../../components/StatusBadge";
import ReusableTable, { type TableColumn } from "../../../components/ReusableTable";
import { fetchEmployees, type Employee } from "../../../lib/workforce-api";

export default function AddressesPage() {
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

  const columns: TableColumn<Employee>[] = [
    { key: "employeeId", header: "Employee ID" },
    { key: "firstName", header: "Name", render: (row) => `${row.firstName} ${row.lastName}` },
    { key: "email", header: "Email" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <Link
          href={`/zoiko-hr/workforce/employees/${row.id}`}
          className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white"
        >
          View Addresses
        </Link>
      ),
    },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Addresses"
        description="Manage employee residential, mailing, and work addresses."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Employees" value={loading ? "..." : total} icon={Users} />
        <KPICard title="Addresses" value="—" icon={MapPin} description="View per employee" />
      </section>

      <ReusableTable
        title="Employees"
        description="Select an employee to view and manage their addresses."
        columns={columns}
        data={employees}
        emptyState="No employees found."
      />
    </SuperAdminShell>
  );
}
