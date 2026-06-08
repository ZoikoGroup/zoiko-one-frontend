"use client";

import { useEffect, useState } from "react";
import { Plus, Search } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { fetchEmployees, type Employee } from "../../../lib/workforce-api";

export default function EmployeeListPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [total, setTotal] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [page, setPage] = useState(0);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 20;

  useEffect(() => {
    fetchEmployees({
      search: search || undefined,
      status: statusFilter || undefined,
      employmentType: typeFilter || undefined,
      skip: page * pageSize,
      take: pageSize,
      orderBy: "createdAt",
      orderDir: "desc",
    })
      .then((res) => {
        setEmployees(res.data);
        setTotal(res.total);
        setLoaded(true);
      })
      .catch(() => {});
  }, [search, statusFilter, typeFilter, page, refreshKey]);

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch(`/api/zoiko-hr/workforce/${id}`, { method: "DELETE" });
      if (res.ok) {
        setDeleteId(null);
        setRefreshKey((k) => k + 1);
      }
    } catch {}
  };

  const totalPages = Math.ceil(total / pageSize);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Employees"
        description="View and manage all employees in the organization."
        action={
          <Link
            href="/zoiko-hr/workforce/employees/new"
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" />
            Add Employee
          </Link>
        }
      />

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search by name, email or employee ID..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(0);
              }}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
          >
            <option value="">All Statuses</option>
            <option value="ACTIVE">Active</option>
            <option value="ON_LEAVE">On Leave</option>
            <option value="SUSPENDED">Suspended</option>
            <option value="INACTIVE">Inactive</option>
            <option value="TERMINATED">Terminated</option>
          </select>
          <select
            value={typeFilter}
            onChange={(e) => {
              setTypeFilter(e.target.value);
              setPage(0);
            }}
            className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2.5 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
          >
            <option value="">All Types</option>
            <option value="FULL_TIME">Full-Time</option>
            <option value="PART_TIME">Part-Time</option>
            <option value="CONTRACT">Contract</option>
            <option value="INTERN">Intern</option>
            <option value="TEMPORARY">Temporary</option>
          </select>
        </div>
      </div>

      <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="border-b border-slate-800 px-5 py-4">
          <h2 className="text-lg font-semibold text-white">
            All Employees
            <span className="ml-2 text-sm font-normal text-slate-400">({total})</span>
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[900px] border-collapse text-left text-sm">
            <thead className="bg-slate-950 text-xs uppercase text-slate-500">
              <tr>
                <th className="px-5 py-3 font-semibold">Employee ID</th>
                <th className="px-5 py-3 font-semibold">Name</th>
                <th className="px-5 py-3 font-semibold">Email</th>
                <th className="px-5 py-3 font-semibold">Status</th>
                <th className="px-5 py-3 font-semibold">Type</th>
                <th className="px-5 py-3 font-semibold">Joined</th>
                <th className="px-5 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {!loaded ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    Loading employees...
                  </td>
                </tr>
              ) : employees.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-5 py-12 text-center text-slate-400">
                    No employees found.
                  </td>
                </tr>
              ) : (
                employees.map((emp) => (
                  <tr key={emp.id} className="transition duration-200 hover:bg-slate-900/80">
                    <td className="border-t border-slate-800 px-5 py-4 font-mono text-xs text-slate-400">
                      {emp.employeeId}
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4">
                      <span className="text-white">{emp.firstName} {emp.lastName}</span>
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4 text-slate-300">{emp.email}</td>
                    <td className="border-t border-slate-800 px-5 py-4">
                      <StatusBadge status={emp.status} />
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4">
                      <span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">
                        {emp.employmentType.replace(/_/g, " ")}
                      </span>
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4 text-slate-300">
                      {new Date(emp.joinDate).toLocaleDateString()}
                    </td>
                    <td className="border-t border-slate-800 px-5 py-4">
                      <div className="flex items-center gap-2">
                        <Link
                          href={`/zoiko-hr/workforce/employees/${emp.id}`}
                          className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white"
                        >
                          View
                        </Link>
                        <Link
                          href={`/zoiko-hr/workforce/employees/${emp.id}/edit`}
                          className="rounded-3xl bg-indigo-600/10 px-3 py-1.5 text-xs text-indigo-300 transition hover:bg-indigo-600/20"
                        >
                          Edit
                        </Link>
                        <button
                          type="button"
                          onClick={() => setDeleteId(emp.id)}
                          className="rounded-3xl bg-rose-500/10 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/20"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t border-slate-800 px-5 py-4">
            <p className="text-sm text-slate-400">
              Showing {page * pageSize + 1}–{Math.min((page + 1) * pageSize, total)} of {total}
            </p>
            <div className="flex gap-2">
              <button
                type="button"
                disabled={page === 0}
                onClick={() => setPage((p) => p - 1)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40"
              >
                Previous
              </button>
              <button
                type="button"
                disabled={page >= totalPages - 1}
                onClick={() => setPage((p) => p + 1)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-900 disabled:opacity-40"
              >
                Next
              </button>
            </div>
          </div>
        )}
      </section>

      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.5)]">
            <h3 className="text-lg font-semibold text-white">Confirm Delete</h3>
            <p className="mt-2 text-sm text-slate-400">
              Are you sure you want to delete this employee? This action can be undone by an administrator.
            </p>
            <div className="mt-6 flex justify-end gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="rounded-3xl border border-slate-800 bg-slate-950 px-5 py-2 text-sm text-slate-300 transition hover:bg-slate-900"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => handleDelete(deleteId)}
                className="rounded-3xl bg-rose-600 px-5 py-2 text-sm font-medium text-white transition hover:bg-rose-500"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
