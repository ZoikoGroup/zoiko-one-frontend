import { useState, useEffect, useCallback } from "react";
import { Check, X, Clock, RefreshCw, AlertCircle, Eye } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getDocuments, updateDocumentStatus } from "../../../service/hrService";
import { API_BASE_URL } from "../../../service/api";

// ── Shared inline helpers ─────────────────────────────────────────────────────
const STATUS_META = {
  pending:  { label: "Pending",  bg: "bg-amber-50",   text: "text-amber-700",  border: "border-amber-200",  dot: "bg-amber-500"  },
  approved: { label: "Approved", bg: "bg-emerald-50",  text: "text-emerald-700", border: "border-emerald-200", dot: "bg-emerald-500" },
  rejected: { label: "Rejected", bg: "bg-rose-50",    text: "text-rose-700",   border: "border-rose-200",   dot: "bg-rose-500"   },
  expired:  { label: "Expired",  bg: "bg-slate-100",  text: "text-slate-500",  border: "border-slate-200",  dot: "bg-slate-400"  },
};
const StatusBadge = ({ status }) => {
  const m = STATUS_META[status] || STATUS_META.pending;
  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold border ${m.bg} ${m.text} ${m.border}`}>
      <span className={`h-1.5 w-1.5 rounded-full ${m.dot}`} />
      {m.label}
    </span>
  );
};
const CAT_COLORS = {
  company:  "bg-indigo-50 text-indigo-700 border-indigo-200",
  employee: "bg-violet-50 text-violet-700 border-violet-200",
  contract: "bg-cyan-50 text-cyan-700 border-cyan-200",
  policy:   "bg-teal-50 text-teal-700 border-teal-200",
};
const CategoryPill = ({ category }) => {
  const cls = CAT_COLORS[category?.toLowerCase()] || "bg-slate-100 text-slate-600 border-slate-200";
  return (
    <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium border capitalize ${cls}`}>
      {category || "other"}
    </span>
  );
};
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

export default function Approvals() {
  const [docs, setDocs]             = useState([]);
  const [loading, setLoading]       = useState(true);
  const [processingId, setProcessingId] = useState(null);
  const [toast, setToast]           = useState(null);
  const [confirm, setConfirm]       = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDocuments();
      setDocs(Array.isArray(res?.data) ? res.data : []);
    } catch (err) {
      showToast("error", err?.message || "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleAction = async (id, status) => {
    setConfirm(null);
    setProcessingId(id);
    try {
      await updateDocumentStatus(id, status);
      showToast("success", `Document ${status === "approved" ? "approved" : "rejected"} successfully.`);
      load();
    } catch (err) {
      showToast("error", err?.message || `Failed to ${status} document.`);
    } finally {
      setProcessingId(null);
    }
  };

  const pending  = docs.filter(d => d.status === "pending");
  const resolved = docs.filter(d => d.status !== "pending");

  return (
    <HRPage title="Approvals">
      <div className="space-y-8 pb-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Document Approvals</h2>
            <p className="text-sm text-slate-500 mt-0.5">Review and approve or reject pending document submissions.</p>
          </div>
          <button
            onClick={load}
            className="flex items-center gap-2 text-sm font-medium text-slate-600 border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors self-start sm:self-center"
          >
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Summary bar */}
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: "Awaiting Review", value: pending.length, bg: "bg-amber-50", text: "text-amber-700", Icon: Clock },
            { label: "Approved", value: docs.filter(d => d.status === "approved").length, bg: "bg-emerald-50", text: "text-emerald-700", Icon: Check },
            { label: "Rejected", value: docs.filter(d => d.status === "rejected").length, bg: "bg-rose-50", text: "text-rose-700", Icon: X },
          ].map(s => (
            <div key={s.label} className={`rounded-xl p-4 ${s.bg} flex items-center gap-3`}>
              <s.Icon className={`w-5 h-5 ${s.text} shrink-0`} />
              <div>
                <p className={`text-2xl font-bold ${s.text}`}>{s.value}</p>
                <p className={`text-xs font-medium ${s.text} opacity-80`}>{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-sm font-medium">Loading pending documents…</span>
          </div>
        ) : (
          <>
            {/* Pending queue */}
            <section>
              <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                Pending ({pending.length})
              </h3>
              {pending.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-20 text-center">
                  <span className="text-5xl mb-4">✅</span>
                  <p className="text-base font-semibold text-slate-700 mb-1">All caught up!</p>
                  <p className="text-sm text-slate-400">No documents are waiting for review right now.</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {pending.map(d => (
                    <div key={d.id} className="bg-white rounded-xl border border-gray-100 shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 hover:shadow-md transition-shadow">
                      <div className="flex items-start gap-4 min-w-0">
                        <div className="p-3 bg-amber-50 rounded-lg shrink-0">
                          <AlertCircle className="w-5 h-5 text-amber-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold text-slate-900 truncate">{d.title}</p>
                          
                          {/* Employee Name & Details */}
                          {(d.employee_name || d.uploader_name) && (
                            <p className="text-xs text-slate-600 mt-1">
                              <strong>Employee:</strong> {d.employee_name || d.uploader_name}
                              {d.uploader_name && d.employee_name !== d.uploader_name && ` (Uploaded by: ${d.uploader_name})`}
                            </p>
                          )}
                          
                          {/* Document File details */}
                          {(d.file_name || d.file_size) && (
                            <p className="text-xs text-slate-400 mt-0.5">
                              {d.file_name && <span className="mr-2 font-medium">{d.file_name}</span>}
                              {d.file_size && <span>({(d.file_size / 1024).toFixed(1)} KB)</span>}
                            </p>
                          )}

                          <div className="flex flex-wrap items-center gap-2 mt-2">
                            <CategoryPill category={d.category} />
                            <StatusBadge status={d.status} />
                            <span className="text-xs text-slate-400">Uploaded {fmtDate(d.created_at)}</span>
                          </div>
                          {d.description && (
                            <p className="text-xs text-slate-400 mt-1.5 line-clamp-2">{d.description}</p>
                          )}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        {d.file_path && (
                          <a
                            href={`${API_BASE_URL}/${d.file_path.replace(/\\/g, "/")}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors mr-1"
                          >
                            <Eye className="w-4 h-4" /> View
                          </a>
                        )}
                        <button
                          onClick={() => setConfirm({ id: d.id, name: d.title, action: "rejected" })}
                          disabled={processingId === d.id}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-rose-600 border border-rose-200 bg-rose-50 rounded-lg hover:bg-rose-100 transition-colors disabled:opacity-50"
                        >
                          <X className="w-4 h-4" /> Reject
                        </button>
                        <button
                          onClick={() => setConfirm({ id: d.id, name: d.title, action: "approved" })}
                          disabled={processingId === d.id}
                          className="flex items-center gap-1.5 px-3 py-2 text-sm font-semibold text-emerald-700 border border-emerald-200 bg-emerald-50 rounded-lg hover:bg-emerald-100 transition-colors disabled:opacity-50"
                        >
                          {processingId === d.id
                            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
                            : <><Check className="w-4 h-4" /> Approve</>
                          }
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* Resolved history */}
            {resolved.length > 0 && (
              <section>
                <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3">
                  Recently Resolved ({resolved.length})
                </h3>
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                      <tr>
                        <th className="text-left px-6 py-3 font-semibold">Document</th>
                        <th className="text-left px-6 py-3 font-semibold">Employee</th>
                        <th className="text-left px-6 py-3 font-semibold">Category</th>
                        <th className="text-left px-6 py-3 font-semibold">Decision</th>
                        <th className="text-left px-6 py-3 font-semibold">Date</th>
                        <th className="text-center px-6 py-3 font-semibold">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                      {resolved.map(d => (
                        <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                          <td className="px-6 py-3">
                            <div>
                              <p className="font-medium text-slate-800">{d.title}</p>
                              {d.file_name && <p className="text-xs text-slate-400 mt-0.5">{d.file_name}</p>}
                            </div>
                          </td>
                          <td className="px-6 py-3 text-slate-600">{d.employee_name || d.uploader_name || "—"}</td>
                          <td className="px-6 py-3"><CategoryPill category={d.category} /></td>
                          <td className="px-6 py-3"><StatusBadge status={d.status} /></td>
                          <td className="px-6 py-3 text-slate-400 text-xs">{fmtDate(d.updated_at || d.created_at)}</td>
                          <td className="px-6 py-3 text-center">
                            {d.file_path && (
                              <a
                                href={`${API_BASE_URL}/${d.file_path.replace(/\\/g, "/")}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-1 px-2.5 py-1 text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 rounded hover:bg-indigo-100 transition-colors"
                              >
                                <Eye className="w-3.5 h-3.5" /> View
                              </a>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </section>
            )}
          </>
        )}
      </div>

      {/* Confirm dialog */}
      {confirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-slate-900 mb-2">
              {confirm.action === "approved" ? "Approve Document?" : "Reject Document?"}
            </h4>
            <p className="text-sm text-slate-500 mb-6">
              You are about to <strong>{confirm.action === "approved" ? "approve" : "reject"}</strong> &ldquo;{confirm.name}&rdquo;. This updates its status immediately.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirm(null)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button
                onClick={() => handleAction(confirm.id, confirm.action)}
                className={`px-4 py-2 text-sm font-semibold rounded-lg text-white ${confirm.action === "approved" ? "bg-emerald-600 hover:bg-emerald-700" : "bg-rose-600 hover:bg-rose-700"}`}
              >
                {confirm.action === "approved" ? "Yes, Approve" : "Yes, Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"} text-white`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
    </HRPage>
  );
}