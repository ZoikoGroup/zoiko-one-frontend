"use client";

<<<<<<< HEAD
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
=======
import { useState } from "react";
import { FileText, Search, Plus, Trash2, Download, Edit2, X, AlertCircle, Eye } from "lucide-react";
import SuperAdminShell from "../../components/SuperAdminShell";
import PageHeader from "../../components/PageHeader";

interface DocumentItem {
  id: string;
  title: string;
  category: "Policies" | "Legal" | "Templates" | "Onboarding" | "Handbooks";
  format: "PDF" | "DOCX" | "XLSX" | "PPTX" | "PNG";
  size: string;
  dateUploaded: string;
  owner: string;
  status: "Active" | "Archived";
}

const initialDocuments: DocumentItem[] = [
  {
    id: "doc-1",
    title: "Employee Handbook 2026",
    category: "Handbooks",
    format: "PDF",
    size: "4.2 MB",
    dateUploaded: "2026-01-15",
    owner: "HR Department",
    status: "Active"
  },
  {
    id: "doc-2",
    title: "Mutual Non-Disclosure Agreement (NDA)",
    category: "Legal",
    format: "DOCX",
    size: "1.1 MB",
    dateUploaded: "2026-02-10",
    owner: "Legal Team",
    status: "Active"
  },
  {
    id: "doc-3",
    title: "Leave Request Template",
    category: "Templates",
    format: "XLSX",
    size: "512 KB",
    dateUploaded: "2026-03-01",
    owner: "HR Operations",
    status: "Active"
  },
  {
    id: "doc-4",
    title: "Remote Work & Hybrid Policy",
    category: "Policies",
    format: "PDF",
    size: "2.5 MB",
    dateUploaded: "2026-05-18",
    owner: "HR Policy Team",
    status: "Active"
  },
  {
    id: "doc-5",
    title: "Direct Deposit Enrollment Form",
    category: "Templates",
    format: "PDF",
    size: "256 KB",
    dateUploaded: "2026-04-05",
    owner: "Finance",
    status: "Active"
  },
  {
    id: "doc-6",
    title: "Performance Review Guidelines",
    category: "Policies",
    format: "PDF",
    size: "1.8 MB",
    dateUploaded: "2026-05-20",
    owner: "HR Development",
    status: "Active"
  },
  {
    id: "doc-7",
    title: "Archived Code of Conduct 2024",
    category: "Policies",
    format: "PDF",
    size: "3.1 MB",
    dateUploaded: "2024-08-12",
    owner: "Compliance",
    status: "Archived"
  }
];

export default function DocumentsPage() {
  const [documents, setDocuments] = useState<DocumentItem[]>(initialDocuments);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");

  // Modals state
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [editingDoc, setEditingDoc] = useState<DocumentItem | null>(null);

  // Form states
  const [formData, setFormData] = useState({
    title: "",
    category: "Policies" as DocumentItem["category"],
    format: "PDF" as DocumentItem["format"],
    size: "1.0 MB",
    owner: "HR Department",
    status: "Active" as DocumentItem["status"]
  });

  const handleOpenUpload = () => {
    setFormData({
      title: "",
      category: "Policies",
      format: "PDF",
      size: "1.2 MB",
      owner: "HR Department",
      status: "Active"
    });
    setEditingDoc(null);
    setShowUploadModal(true);
  };

  const handleOpenEdit = (doc: DocumentItem) => {
    setEditingDoc(doc);
    setFormData({
      title: doc.title,
      category: doc.category,
      format: doc.format,
      size: doc.size,
      owner: doc.owner,
      status: doc.status
    });
    setShowUploadModal(true);
  };

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to permanently delete this document from the company archives?")) {
      setDocuments(documents.filter((doc) => doc.id !== id));
    }
  };

  const handleDownload = (doc: DocumentItem) => {
    alert(`Simulating secure download for "${doc.title}.${doc.format.toLowerCase()}" (${doc.size})`);
  };

  const handlePreview = (doc: DocumentItem) => {
    alert(`Opening preview modal for "${doc.title}.${doc.format.toLowerCase()}"...`);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) {
      alert("Please enter a document title.");
      return;
    }

    if (editingDoc) {
      // Edit
      setDocuments(
        documents.map((d) =>
          d.id === editingDoc.id
            ? { ...d, ...formData, title: formData.title.trim() }
            : d
        )
      );
    } else {
      // Add
      const newDoc: DocumentItem = {
        id: `doc-${Date.now()}`,
        title: formData.title.trim(),
        category: formData.category,
        format: formData.format,
        size: formData.size,
        dateUploaded: new Date().toISOString().split("T")[0],
        owner: formData.owner,
        status: formData.status
      };
      setDocuments([newDoc, ...documents]);
    }
    setShowUploadModal(false);
  };

  // Filter logic
  const filteredDocuments = documents.filter((doc) => {
    const matchesSearch =
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.owner.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || doc.category === selectedCategory;
    const matchesStatus = selectedStatus === "All" || doc.status === selectedStatus;
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Calculate stats
  const totalDocs = documents.length;
  const activePolicies = documents.filter((d) => d.category === "Policies" && d.status === "Active").length;
  const totalTemplates = documents.filter((d) => d.category === "Templates").length;
  
  // Calculate total size in MB (roughly)
  const totalSizeMB = documents.reduce((sum, doc) => {
    const isKB = doc.size.toLowerCase().includes("kb");
    const val = parseFloat(doc.size);
    return sum + (isKB ? val / 1024 : val);
  }, 0).toFixed(1);
>>>>>>> ea28a7f (Add latest Zoiko One frontend changes)

  return (
    <SuperAdminShell>
      <PageHeader
<<<<<<< HEAD
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
=======
        title="Documents Management"
        description="Access company policies, HR templates, legal handbooks, and system-wide file repositories."
        action={
          <button
            onClick={handleOpenUpload}
            className="inline-flex items-center gap-2 rounded-3xl bg-indigo-600 px-5 py-2.5 text-sm font-medium text-white transition hover:bg-indigo-500"
          >
            <Plus className="h-4 w-4" /> Upload Document
          </button>
        }
      />

      {/* KPI Cards */}
      <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 font-sans">Total Documents</p>
            <h3 className="mt-2 text-3xl font-bold text-white">{totalDocs}</h3>
            <p className="mt-1 text-xs text-slate-400">Archived or active files</p>
          </div>
          <div className="rounded-2xl bg-indigo-500/10 p-3 text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 font-sans">Storage Used</p>
            <h3 className="mt-2 text-3xl font-bold text-emerald-450">{totalSizeMB} MB</h3>
            <p className="mt-1 text-xs text-slate-400">Secure AWS S3 hosting</p>
          </div>
          <div className="rounded-2xl bg-emerald-500/10 p-3 text-emerald-450">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 font-sans">Active Policies</p>
            <h3 className="mt-2 text-3xl font-bold text-indigo-400">{activePolicies}</h3>
            <p className="mt-1 text-xs text-slate-400">Compliance & guide docs</p>
          </div>
          <div className="rounded-2xl bg-indigo-650/10 p-3 text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500 font-sans">HR Templates</p>
            <h3 className="mt-2 text-3xl font-bold text-amber-400">{totalTemplates}</h3>
            <p className="mt-1 text-xs text-slate-400">Forms & spreadsheets</p>
          </div>
          <div className="rounded-2xl bg-amber-500/10 p-3 text-amber-400">
            <FileText className="h-5 w-5" />
          </div>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="mb-6 rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 min-w-[260px]">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input
              type="text"
              placeholder="Search documents by title or owner..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 py-2.5 pl-10 pr-4 text-xs text-white placeholder-slate-500 outline-none transition focus:border-indigo-500"
            />
          </div>

          <div className="min-w-[150px]">
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Categories</option>
              <option value="Policies">Policies</option>
              <option value="Legal">Legal</option>
              <option value="Templates">Templates</option>
              <option value="Onboarding">Onboarding</option>
              <option value="Handbooks">Handbooks</option>
            </select>
          </div>

          <div className="min-w-[150px]">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
            >
              <option value="All">All Statuses</option>
              <option value="Active">Active</option>
              <option value="Archived">Archived</option>
            </select>
          </div>
        </div>
      </div>

      {/* Documents Registry Table */}
      <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-lg">
        <div className="overflow-x-auto rounded-[20px] border border-slate-850">
          <table className="w-full min-w-[700px] text-left text-xs">
            <thead className="bg-slate-950 text-slate-400 uppercase tracking-wider">
              <tr>
                <th className="px-4 py-3">Document Title</th>
                <th className="px-4 py-3">Category</th>
                <th className="px-4 py-3">Format</th>
                <th className="px-4 py-3">Size</th>
                <th className="px-4 py-3">Uploaded Date</th>
                <th className="px-4 py-3">Owner</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800">
              {filteredDocuments.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-slate-500">
                    No documents found matching the criteria.
                  </td>
                </tr>
              ) : (
                filteredDocuments.map((doc) => (
                  <tr key={doc.id} className="hover:bg-slate-950/40 transition">
                    <td className="px-4 py-3 font-semibold text-white">
                      <div className="flex items-center gap-2.5">
                        <div className="rounded-lg bg-indigo-500/10 p-2 text-indigo-400">
                          <FileText className="h-4 w-4" />
                        </div>
                        {doc.title}
                      </div>
                    </td>
                    <td className="px-4 py-3 text-slate-300">{doc.category}</td>
                    <td className="px-4 py-3">
                      <span className="rounded bg-slate-900 px-2 py-0.5 font-mono text-[10px] text-slate-400">
                        {doc.format}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-slate-400">{doc.size}</td>
                    <td className="px-4 py-3 text-slate-400">{doc.dateUploaded}</td>
                    <td className="px-4 py-3 text-slate-300">{doc.owner}</td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-medium ${
                          doc.status === "Active"
                            ? "bg-emerald-500/10 text-emerald-450"
                            : "bg-slate-900 text-slate-400"
                        }`}
                      >
                        {doc.status}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handlePreview(doc)}
                          title="Preview document"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDownload(doc)}
                          title="Download document"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition"
                        >
                          <Download className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleOpenEdit(doc)}
                          title="Edit metadata"
                          className="rounded-lg p-1.5 text-slate-400 hover:bg-slate-900 hover:text-white transition"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(doc.id)}
                          title="Delete document"
                          className="rounded-lg p-1.5 text-rose-400 hover:bg-slate-900 hover:text-rose-300 transition"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upload/Edit Document Modal */}
      {showUploadModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
          <div className="w-full max-w-md rounded-[28px] border border-slate-800 bg-[#0B1220] p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <h3 className="text-base font-semibold text-white">
                {editingDoc ? "Edit Document Metadata" : "Upload Document"}
              </h3>
              <button
                onClick={() => setShowUploadModal(false)}
                className="rounded-full p-1 text-slate-400 hover:bg-slate-900 hover:text-white"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="mt-4 space-y-4">
              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Health & Safety Handbook 2026"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition focus:border-indigo-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                    Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) =>
                      setFormData({ ...formData, category: e.target.value as DocumentItem["category"] })
                    }
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="Policies">Policies</option>
                    <option value="Legal">Legal</option>
                    <option value="Templates">Templates</option>
                    <option value="Onboarding">Onboarding</option>
                    <option value="Handbooks">Handbooks</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                    Format
                  </label>
                  <select
                    value={formData.format}
                    onChange={(e) =>
                      setFormData({ ...formData, format: e.target.value as DocumentItem["format"] })
                    }
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="PDF">PDF</option>
                    <option value="DOCX">DOCX</option>
                    <option value="XLSX">XLSX</option>
                    <option value="PPTX">PPTX</option>
                    <option value="PNG">PNG</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                    Document Size
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. 1.2 MB"
                    value={formData.size}
                    onChange={(e) => setFormData({ ...formData, size: e.target.value })}
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition focus:border-indigo-500"
                  />
                </div>

                <div>
                  <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                    Status
                  </label>
                  <select
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value as DocumentItem["status"] })
                    }
                    className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-slate-350 outline-none transition focus:border-indigo-500"
                  >
                    <option value="Active">Active</option>
                    <option value="Archived">Archived</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-[0.15em] text-slate-500 font-semibold mb-1">
                  Owner / Department
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Compliance Team"
                  value={formData.owner}
                  onChange={(e) => setFormData({ ...formData, owner: e.target.value })}
                  className="w-full rounded-3xl border border-slate-800 bg-slate-950/60 px-4 py-2.5 text-xs text-white placeholder-slate-650 outline-none transition focus:border-indigo-500"
                />
              </div>

              {!editingDoc && (
                <div className="rounded-2xl border border-dashed border-slate-800 bg-slate-950/40 p-4 text-center">
                  <FileText className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                  <p className="text-slate-400 text-xs">Simulating AWS secure file ingestion...</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Drag-and-drop or select file to attach</p>
                </div>
              )}

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={() => setShowUploadModal(false)}
                  className="flex-1 rounded-3xl border border-slate-800 bg-slate-950/80 px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-900 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 rounded-3xl bg-indigo-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-indigo-500"
                >
                  {editingDoc ? "Save Changes" : "Confirm Upload"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
>>>>>>> ea28a7f (Add latest Zoiko One frontend changes)
    </SuperAdminShell>
  );
}
