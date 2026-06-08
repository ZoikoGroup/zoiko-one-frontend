"use client";

import { useEffect, useState } from "react";
import { FileText, Search, X, AlertCircle } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";
import KPICard from "../../components/KPICard";
import StatusBadge from "../../components/StatusBadge";
import ReusableTable, { type TableColumn } from "../../components/ReusableTable";
import { fetchDocuments, deleteDocument, type EmployeeDocument } from "../../lib/workforce-api";

const DOCUMENT_TYPES = [
  "OFFER_LETTER", "APPOINTMENT_LETTER", "CONTRACT", "NDA",
  "POLICY_ACKNOWLEDGMENT", "ID_PROOF", "ADDRESS_PROOF",
  "EDUCATION_CERTIFICATE", "EXPERIENCE_LETTER", "PAYSLIP",
  "TAX_FORM", "BANK_DETAILS", "MEDICAL_REPORT", "OTHER",
] as const;

const STATUS_OPTIONS = ["PENDING", "UPLOADED", "VERIFIED", "REJECTED", "EXPIRED"] as const;

function formatFileSize(bytes?: number | null) {
  if (!bytes) return "-";
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<EmployeeDocument[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page, setPage] = useState(0);
  const [refreshKey, setRefreshKey] = useState(0);
  const pageSize = 20;

  const [deleting, setDeleting] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetchDocuments({
      search: search || undefined,
      documentType: typeFilter || undefined,
      status: statusFilter || undefined,
      skip: page * pageSize,
      take: pageSize,
      orderBy: "createdAt",
      orderDir: "desc",
    })
      .then((res) => { setDocuments(res.data); setTotal(res.total); })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [search, typeFilter, statusFilter, page, refreshKey]);

  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    setDeleting(id);
    try {
      await deleteDocument(id);
      setRefreshKey((k) => k + 1);
    } catch {}
    setDeleting(null);
  };

  const columns: TableColumn<EmployeeDocument>[] = [
    {
      key: "fileName",
      header: "File Name",
      render: (row) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 shrink-0 text-slate-400" />
          <span className="truncate max-w-[200px]">{row.fileName || row.documentType}</span>
        </div>
      ),
    },
    {
      key: "employee",
      header: "Employee",
      render: (row) => (
        <Link
          href={`/zoiko-hr/workforce/employees/${row.employeeId}`}
          className="text-indigo-400 hover:text-indigo-300 transition"
        >
          {row.employee?.firstName} {row.employee?.lastName}
        </Link>
      ),
    },
    { key: "documentType", header: "Type" },
    { key: "fileSize", header: "Size", render: (row) => formatFileSize(row.fileSize) },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
    {
      key: "createdAt",
      header: "Uploaded",
      render: (row) => new Date(row.createdAt).toLocaleDateString(),
    },
    {
      key: "actions",
      header: "",
      render: (row) => (
        <div className="flex items-center gap-2">
          <Link
            href={`/zoiko-hr/documents/${row.id}`}
            className="rounded-3xl bg-slate-800 px-3 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            View
          </Link>
          <button
            type="button"
            onClick={() => handleDelete(row.id)}
            disabled={deleting === row.id}
            className="rounded-3xl bg-rose-500/20 px-3 py-1.5 text-xs text-rose-300 transition hover:bg-rose-500/30 disabled:opacity-50"
          >
            {deleting === row.id ? "..." : "Delete"}
          </button>
        </div>
      ),
    },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Documents"
        description="Central document repository. Manage employee documents across the organization."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Total Documents" value={loading ? "..." : total} icon={FileText} />
        <KPICard title="Pending" value={documents.filter((d) => d.status === "PENDING").length} icon={AlertCircle} />
        <KPICard title="Verified" value={documents.filter((d) => d.status === "VERIFIED").length} icon={FileText} />
        <KPICard title="Expired" value={documents.filter((d) => d.status === "EXPIRED").length} icon={AlertCircle} />
      </section>

      <div className="mt-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="text"
            placeholder="Search documents..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-700 bg-slate-900/50 py-2 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
          />
          {search && (
            <button type="button" onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        <select
          value={typeFilter}
          onChange={(e) => { setTypeFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
        >
          <option value="">All Types</option>
          {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
        </select>

        <select
          value={statusFilter}
          onChange={(e) => { setStatusFilter(e.target.value); setPage(0); }}
          className="rounded-3xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-slate-300 outline-none transition focus:border-indigo-500"
        >
          <option value="">All Statuses</option>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {total > pageSize && (
        <div className="mt-4 flex items-center justify-between text-sm text-slate-400">
          <span>Showing {page * pageSize + 1}-{Math.min((page + 1) * pageSize, total)} of {total}</span>
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="rounded-3xl bg-slate-800 px-4 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
            >
              Previous
            </button>
            <button
              type="button"
              onClick={() => setPage((p) => p + 1)}
              disabled={(page + 1) * pageSize >= total}
              className="rounded-3xl bg-slate-800 px-4 py-1.5 text-xs text-slate-300 transition hover:bg-slate-700 disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}

      <ReusableTable
        title="All Documents"
        description="View and manage all employee documents."
        columns={columns}
        data={documents}
        emptyState="No documents found. Upload a document to get started."
      />
    </SuperAdminShell>
  );
}
