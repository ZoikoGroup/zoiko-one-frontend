"use client";

import { useEffect, useState } from "react";
import { ArrowLeft, BadgeCheck } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import SuperAdminShell from "../../../components/SuperAdminShell";
import StatusBadge from "../../../components/StatusBadge";
import { fetchDesignation, type Designation } from "../../../lib/workforce-api";

export default function DesignationDetailPage() {
  const params = useParams();
  const designationId = params.designationId as string;

  const [designation, setDesignation] = useState<Designation | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDesignation(designationId)
      .then((res) => setDesignation(res.data))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [designationId]);

  if (loading) {
    return (
      <SuperAdminShell>
        <div className="flex items-center justify-center py-20"><p className="text-slate-400">Loading...</p></div>
      </SuperAdminShell>
    );
  }

  if (!designation) {
    return (
      <SuperAdminShell>
        <div className="flex items-center justify-center py-20"><p className="text-slate-400">Designation not found.</p></div>
      </SuperAdminShell>
    );
  }

  return (
    <SuperAdminShell>
      <div className="mb-6">
        <Link href="/zoiko-hr/designations" className="inline-flex items-center gap-2 text-sm text-slate-400 transition hover:text-white">
          <ArrowLeft className="h-4 w-4" /> Back to Designations
        </Link>
      </div>

      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-indigo-600/10">
            <BadgeCheck className="h-7 w-7 text-indigo-400" />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-semibold text-white">{designation.title}</h1>
              <StatusBadge status={designation.status} />
            </div>
            <p className="mt-1 text-sm text-slate-400">
              Code: <span className="font-mono text-slate-300">{designation.code}</span>
              <span className="mx-2">·</span>
              {designation.level.replace(/_/g, " ")}
              <span className="mx-2">·</span>
              {designation.category}
            </p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white">Designation Information</h2>
          <dl className="space-y-3 text-sm">
            <div className="flex justify-between">
              <dt className="text-slate-400">Title</dt>
              <dd className="text-white">{designation.title}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Code</dt>
              <dd className="font-mono text-white">{designation.code}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Level</dt>
              <dd><span className="rounded-full bg-slate-800 px-3 py-1 text-xs text-slate-300">{designation.level.replace(/_/g, " ")}</span></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Category</dt>
              <dd className="text-white">{designation.category}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Grade</dt>
              <dd className="text-white">{designation.grade || "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Department</dt>
              <dd className="text-white">{designation.department?.name ?? "—"}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Status</dt>
              <dd><StatusBadge status={designation.status} /></dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-slate-400">Created</dt>
              <dd className="text-slate-300">{new Date(designation.createdAt).toLocaleDateString()}</dd>
            </div>
          </dl>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 text-lg font-semibold text-white">Salary Range</h2>
          <div className="flex items-center gap-6">
            <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Minimum</p>
              <p className="text-2xl font-semibold text-white">${designation.minSalary.toLocaleString()}</p>
            </div>
            <div className="flex-1 rounded-2xl border border-slate-800 bg-slate-950/50 p-4 text-center">
              <p className="text-xs uppercase tracking-wider text-slate-400 mb-1">Maximum</p>
              <p className="text-2xl font-semibold text-white">${designation.maxSalary.toLocaleString()}</p>
            </div>
          </div>
          {designation.description && (
            <div className="mt-4">
              <h3 className="text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">Description</h3>
              <p className="text-sm text-slate-300">{designation.description}</p>
            </div>
          )}
        </div>
      </div>
    </SuperAdminShell>
  );
}
