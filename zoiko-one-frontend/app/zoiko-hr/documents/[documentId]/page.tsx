"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { FileText, ArrowLeft, ExternalLink, Trash2 } from "lucide-react";
import Link from "next/link";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import { getDocument, updateDocument, deleteDocument, type EmployeeDocument } from "../../../lib/workforce-api";

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

export default function DocumentDetailPage() {
  const { documentId } = useParams<{ documentId: string }>();
  const router = useRouter();
  const [doc, setDoc] = useState<EmployeeDocument | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    documentType: "",
    fileName: "",
    status: "",
    notes: "",
  });

  useEffect(() => {
    getDocument(documentId)
      .then((res) => {
        setDoc(res.data);
        setForm({
          documentType: res.data.documentType,
          fileName: res.data.fileName ?? "",
          status: res.data.status,
          notes: res.data.notes ?? "",
        });
      })
      .catch(() => router.push("/zoiko-hr/documents"))
      .finally(() => setLoading(false));
  }, [documentId, router]);

  const handleSave = async () => {
    setSaving(true);
    setError("");
    try {
      const updated = await updateDocument(documentId, {
        documentType: form.documentType,
        fileName: form.fileName || undefined,
        status: form.status,
        notes: form.notes || undefined,
      });
      setDoc(updated.data);
      setEditing(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update document.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm("Are you sure you want to delete this document?")) return;
    try {
      await deleteDocument(documentId);
      router.push("/zoiko-hr/documents");
    } catch (err) { setError("Failed to delete document."); }
  };

  if (loading) {
    return (
      <SuperAdminShell>
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
          <span className="ml-3 text-sm text-slate-400">Loading document...</span>
        </div>
      </SuperAdminShell>
    );
  }

  if (!doc) return null;

  return (
    <SuperAdminShell>
      <PageHeader
        title={doc.fileName || doc.documentType}
        description={`Document details • ${doc.documentType}`}
        action={
          <Link
            href="/zoiko-hr/documents"
            className="flex items-center gap-2 rounded-3xl bg-slate-800 px-4 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Documents
          </Link>
        }
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-white">Document Information</h2>
              {!editing && (
                <button
                  type="button"
                  onClick={() => setEditing(true)}
                  className="rounded-3xl bg-indigo-600 px-4 py-2 text-xs font-medium text-white transition hover:bg-indigo-500"
                >
                  Edit
                </button>
              )}
            </div>

            {editing ? (
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Document Type</label>
                  <select
                    value={form.documentType}
                    onChange={(e) => setForm((f) => ({ ...f, documentType: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
                  >
                    {DOCUMENT_TYPES.map((t) => <option key={t} value={t}>{t.replace(/_/g, " ")}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">File Name</label>
                  <input
                    type="text"
                    value={form.fileName}
                    onChange={(e) => setForm((f) => ({ ...f, fileName: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Status</label>
                  <select
                    value={form.status}
                    onChange={(e) => setForm((f) => ({ ...f, status: e.target.value }))}
                    className="w-full rounded-3xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
                  >
                    {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
                <div>
                  <label className="mb-1 block text-xs font-medium text-slate-400">Notes</label>
                  <textarea
                    value={form.notes}
                    onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))}
                    rows={3}
                    className="w-full rounded-2xl border border-slate-700 bg-slate-900/50 px-4 py-2 text-sm text-white outline-none transition focus:border-indigo-500"
                  />
                </div>
                <div className="flex gap-3">
                  <button
                    type="button"
                    onClick={handleSave}
                    disabled={saving}
                    className="rounded-3xl bg-indigo-600 px-6 py-2 text-sm font-medium text-white transition hover:bg-indigo-500 disabled:opacity-50"
                  >
                    {saving ? "Saving..." : "Save Changes"}
                  </button>
                  <button
                    type="button"
                    onClick={() => { setEditing(false); setForm({ documentType: doc.documentType, fileName: doc.fileName ?? "", status: doc.status, notes: doc.notes ?? "" }); }}
                    className="rounded-3xl bg-slate-800 px-6 py-2 text-sm text-slate-300 transition hover:bg-slate-700 hover:text-white"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <dl className="space-y-4 text-sm">
                <div className="flex justify-between">
                  <dt className="text-slate-400">Document Type</dt>
                  <dd className="text-white">{doc.documentType.replace(/_/g, " ")}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">File Name</dt>
                  <dd className="text-white">{doc.fileName || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">File Size</dt>
                  <dd className="text-white">{formatFileSize(doc.fileSize)}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">MIME Type</dt>
                  <dd className="text-white">{doc.mimeType || "-"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Status</dt>
                  <dd><StatusBadge status={doc.status} /></dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Expiry Date</dt>
                  <dd className="text-white">{doc.expiryDate ? new Date(doc.expiryDate).toLocaleDateString() : "N/A"}</dd>
                </div>
                <div className="flex justify-between">
                  <dt className="text-slate-400">Uploaded</dt>
                  <dd className="text-white">{new Date(doc.createdAt).toLocaleDateString()}</dd>
                </div>
                {doc.notes && (
                  <div className="flex justify-between">
                    <dt className="text-slate-400">Notes</dt>
                    <dd className="text-white max-w-xs text-right">{doc.notes}</dd>
                  </div>
                )}
              </dl>
            )}
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
            <h2 className="mb-4 text-lg font-semibold text-white">Employee</h2>
            {doc.employee ? (
              <div>
                <Link
                  href={`/zoiko-hr/workforce/employees/${doc.employee.id}`}
                  className="flex items-center gap-3 rounded-2xl bg-slate-900/50 p-4 transition hover:bg-slate-900"
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-indigo-600/20 text-sm font-semibold text-indigo-400">
                    {doc.employee.firstName[0]}{doc.employee.lastName[0]}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-white">{doc.employee.firstName} {doc.employee.lastName}</p>
                    <p className="text-xs text-slate-400">{doc.employee.email}</p>
                  </div>
                  <ExternalLink className="ml-auto h-4 w-4 text-slate-500" />
                </Link>
              </div>
            ) : (
              <p className="text-sm text-slate-400">Employee not found.</p>
            )}
          </div>

          {doc.fileUrl && (
            <div className="rounded-2xl border border-slate-800 bg-slate-950/60 p-6">
              <h2 className="mb-4 text-lg font-semibold text-white">File</h2>
              <a
                href={doc.fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-2 rounded-3xl bg-indigo-600 px-4 py-3 text-sm font-medium text-white transition hover:bg-indigo-500"
              >
                <ExternalLink className="h-4 w-4" />
                Open File
              </a>
            </div>
          )}

          <div className="rounded-2xl border border-rose-500/20 bg-rose-500/5 p-6">
            <h2 className="mb-4 text-lg font-semibold text-rose-300">Danger Zone</h2>
            <button
              type="button"
              onClick={handleDelete}
              className="flex w-full items-center justify-center gap-2 rounded-3xl border border-rose-500/30 px-4 py-2 text-sm font-medium text-rose-300 transition hover:bg-rose-500/10"
            >
              <Trash2 className="h-4 w-4" />
              Delete Document
            </button>
          </div>
        </div>
      </div>
    </SuperAdminShell>
  );
}
