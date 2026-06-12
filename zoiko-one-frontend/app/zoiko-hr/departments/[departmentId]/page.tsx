"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, Building2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SuperAdminShell from "../../../components/SuperAdminShell";
import StatusBadge from "../../../components/StatusBadge";
import { fetchDepartment, fetchDesignations, type Department, type Designation } from "../../../lib/workforce-api";

export default function DepartmentDetailPage() {
  const params = useParams();
  const departmentId = params.departmentId as string;

  const [department, setDepartment] = useState<Department | null>(null);
  const [designations, setDesignations] = useState<Designation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetchDepartment(departmentId).then((res) => setDepartment(res.data)),
      fetchDesignations({ departmentId, take: 100 }).then((res) => setDesignations(res.data)),
    ]).catch(() => {}).finally(() => setLoading(false));
  }, [departmentId]);

  if (loading) {
    return (
      <SuperAdminShell>
        <div className="flex items-center justify-center py-20"><p className="text-slate-400">Loading...</p></div>
      </SuperAdminShell>
    );
  }

  if (!department) {
    return (
      <SuperAdminShell>
        <div className="flex items-center justify-center py-20"><p className="text-slate-400">Department not found.</p></div>
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell>
      <div className="mb-6">
        <Link href="/zoiko-hr/departments" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Departments
        </Link>
      </div>

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600/10">
            <Building2 className="h-7 w-7 text-indigo-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">{department.name}</h1>
              <StatusBadge status={department.status} />
            </div>
            <p className="mt-1 text-sm text-slate-400">Code: <span className="font-mono text-slate-300">{department.code}</span></p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white">Department Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Name</dt>
              <dd className="text-white">{department.name}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Code</dt>
              <dd className="font-mono text-white">{department.code}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Description</dt>
              <dd className="text-white text-right max-w-[60%]">{department.description || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Parent Department</dt>
              <dd className="text-white">{department.parentDept ? department.parentDept.name : "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Budget</dt>
              <dd className="text-white">${department.budget.toLocaleString()}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Status</dt>
              <dd><StatusBadge status={department.status} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Created</dt>
              <dd className="text-slate-300">{new Date(department.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white">Linked Designations</h2>
          {designations.length === 0 ? (
            <p className="text-sm text-slate-400">No designations linked to this department.</p>
          ) : (
            <div className="space-y-2">
              {designations.map((dg) => (
                <Link key={dg.id} href={`/zoiko-hr/designations/${dg.id}`}
                  className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 transition hover:bg-slate-900">
                  <div>
                    <p className="text-sm font-medium text-white">{dg.title}</p>
                    <p className="text-xs text-slate-400">{dg.code} · {dg.level}</p>
                  </div>
                  <StatusBadge status={dg.status} />
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>

      {department.childDepartments && department.childDepartments.length > 0 && (
        <div className="mt-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white">Sub-departments</h2>
          <div className="space-y-2">
            {department.childDepartments.map((child) => (
              <Link key={child.id} href={`/zoiko-hr/departments/${child.id}`}
                className="flex items-center justify-between rounded-2xl border border-slate-800 bg-slate-950/50 px-4 py-3 transition hover:bg-slate-900">
                <div>
                  <p className="text-sm font-medium text-white">{child.name}</p>
                  <p className="text-xs text-slate-400">{child.code}</p>
                </div>
                <StatusBadge status={child.status} />
              </Link>
            ))}
          </div>
        </div>
      )}
    </SuperAdminShell>
  );
}
