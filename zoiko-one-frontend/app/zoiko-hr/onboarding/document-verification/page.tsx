"use client";

import { useEffect, useState } from "react";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import StatusBadge from "../../../components/StatusBadge";
import {
  fetchDocumentVerifications, updateDocumentStatus,
  type DocumentVerification, type DocumentVerifyStatus,
} from "../../../lib/workforce-api";

const STATUSES: DocumentVerifyStatus[] = ["PENDING", "VERIFIED", "REJECTED"];
const DOC_FIELDS: { key: keyof Pick<DocumentVerification, "aadhaarStatus" | "panStatus" | "educationStatus" | "experienceStatus" | "bankDetailsStatus">; label: string }[] = [
  { key: "aadhaarStatus", label: "Aadhaar" },
  { key: "panStatus", label: "PAN" },
  { key: "educationStatus", label: "Education" },
  { key: "experienceStatus", label: "Experience" },
  { key: "bankDetailsStatus", label: "Bank Details" },
];

export default function DocumentVerificationPage() {
  const [docs, setDocs] = useState<DocumentVerification[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null);

  const [search, setSearch] = useState("");
  const [page, setPage] = useState(0);
  const pageSize = 25;

  const loadData = async () => {
    setLoading(true); setError("");
    try {
      const res = await fetchDocumentVerifications({ search: search || undefined, skip: page * pageSize, take: pageSize });
      setDocs(res.data); setTotal(res.total);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load documents.");
    } finally { setLoading(false); }
  };

  useEffect(() => { loadData(); }, [search, page]);

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 4000);
  };

  const handleStatusChange = async (id: string, field: typeof DOC_FIELDS[number]["key"], status: DocumentVerifyStatus) => {
    try {
      await updateDocumentStatus(id, field, status);
      showToast("success", `Document status updated.`);
      loadData();
    } catch (err) {
      showToast("error", err instanceof Error ? err.message : "Failed to update document status.");
    }
  };

  const totalPages = Math.ceil(total / pageSize);
  const start = total > 0 ? page * pageSize + 1 : 0;
  const end = Math.min((page + 1) * pageSize, total);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Document Verification"
        description="Verify employee documents for onboarding compliance."
      />

      {toast && (
        <div className={`mb-4 rounded-2xl px-5 py-3 text-sm font-medium shadow-lg transition-all ${
          toast.type === "success" ? "bg-emerald-500/15 text-emerald-300 border border-emerald-500/20" : "bg-rose-500/15 text-rose-300 border border-rose-500/20"
        }`}>
          {toast.message}
        </div>
      )}

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input type="text" placeholder="Search by employee name or ID..." value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(0); }}
            className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-2.5 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <section className="overflow-hidden rounded-[28px] border border-slate-800 bg-[#0b1220] shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
          <div className="border-b border-slate-800 px-5 py-4">
            <h2 className="text-lg font-semibold text-white">Document Verification <span className="ml-2 text-sm font-normal text-slate-400">({total})</span></h2>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] border-collapse text-left text-sm">
              <thead className="bg-slate-950 text-xs uppercase text-slate-500">
                <tr>
                  <th className="px-5 py-3 font-semibold">Employee</th>
                  {DOC_FIELDS.map((f) => <th key={f.key} className="px-4 py-3 font-semibold text-center">{f.label}</th>)}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800">
                {docs.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="px-5 py-8 text-center text-sm text-slate-500">No records found.</td>
                  </tr>
                ) : (
                  docs.map((dv) => (
                    <tr key={dv.id} className="transition duration-200 hover:bg-slate-900/80">
                      <td className="px-5 py-4">
                        <p className="text-white font-medium">{dv.employeeName}</p>
                        <p className="text-xs text-slate-500">{dv.employeeId}</p>
                      </td>
                      {DOC_FIELDS.map((f) => (
                        <td key={f.key} className="px-4 py-4">
                          <select value={dv[f.key]} onChange={(e) => handleStatusChange(dv.id, f.key, e.target.value as DocumentVerifyStatus)}
                            className="rounded-3xl border border-slate-800 bg-slate-950 px-2 py-1.5 text-xs text-slate-300 outline-none focus:border-indigo-500 w-full text-center">
                            {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                          </select>
                        </td>
                      ))}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-slate-800 px-5 py-3">
              <p className="text-xs text-slate-500">Showing {start}–{end} of {total}</p>
              <div className="flex items-center gap-2">
                <button type="button" disabled={page <= 0} onClick={() => setPage((p) => p - 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40">
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <span className="text-xs text-slate-400">Page {page + 1} of {totalPages}</span>
                <button type="button" disabled={page >= totalPages - 1} onClick={() => setPage((p) => p + 1)}
                  className="rounded-3xl bg-slate-800 p-2 text-slate-400 hover:bg-slate-700 disabled:opacity-40">
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </SuperAdminShell>
  );
}
