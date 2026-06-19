import { useState, useEffect, useCallback } from "react";
import { Edit2, Save, X, RefreshCw, Check, Search, Settings as SettingsIcon, Shield } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getDocuments, updateDocument, updateDocumentStatus } from "../../../service/hrService";

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

const CATEGORY_OPTIONS = ["employee", "company", "contract", "policy"];
const STATUS_OPTIONS   = ["pending", "approved", "rejected", "expired"];

export default function Settings() {
  const [docs, setDocs]       = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving]   = useState(null);
  const [editId, setEditId]   = useState(null);
  const [editFields, setEditFields] = useState({});
  const [search, setSearch]   = useState("");
  const [toast, setToast]     = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDocuments();
      setDocs(Array.isArray(res?.data) ? res.data : []);
    } catch {
      showToast("error", "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const startEdit = (d) => {
    setEditId(d.id);
    setEditFields({ name: d.name, category: d.category || "employee", description: d.description || "", status: d.status });
  };

  const cancelEdit = () => { setEditId(null); setEditFields({}); };

  const saveEdit = async (id) => {
    setSaving(id);
    try {
      await updateDocument(id, editFields);
      setDocs(prev => prev.map(d => d.id === id ? { ...d, ...editFields } : d));
      showToast("success", "Document updated successfully.");
      setEditId(null);
    } catch {
      showToast("error", "Failed to save changes. Please try again.");
    } finally {
      setSaving(null);
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    setSaving(id);
    try {
      await updateDocumentStatus(id, newStatus);
      setDocs(prev => prev.map(d => d.id === id ? { ...d, status: newStatus } : d));
      showToast("success", `Status updated to "${newStatus}".`);
    } catch {
      showToast("error", "Failed to update status.");
    } finally {
      setSaving(null);
    }
  };

  const filtered = docs.filter(
    d => !search.trim() || d.name?.toLowerCase().includes(search.trim().toLowerCase())
  );

  return (
    <HRPage title="Settings & Operations">
      <div className="space-y-6 pb-10">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-slate-100 rounded-xl">
              <SettingsIcon className="w-5 h-5 text-slate-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-900">Document Settings</h2>
              <p className="text-sm text-slate-500 mt-0.5">Edit document metadata, reassign categories, or override statuses.</p>
            </div>
          </div>
          <button onClick={load} className="flex items-center gap-2 text-sm font-medium text-slate-600 border border-gray-200 bg-white px-4 py-2 rounded-lg hover:bg-gray-50 self-start sm:self-center">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
        </div>

        {/* Info banner */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex items-start gap-3">
          <Shield className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
          <p className="text-sm text-blue-700">
            Changes here are saved directly to the database. Status overrides bypass the normal approval workflow — use with care.
          </p>
        </div>

        {/* Search */}
        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search documents…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {/* List */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-sm font-medium">Loading document settings…</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-center">
            <span className="text-5xl mb-4">⚙️</span>
            <p className="text-base font-semibold text-slate-700 mb-1">No documents found</p>
            <p className="text-sm text-slate-400">No documents match your search.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(d => {
              const isEditing = editId === d.id;
              const isSaving  = saving === d.id;
              return (
                <div key={d.id} className={`bg-white rounded-xl border transition-all shadow-sm ${isEditing ? "border-indigo-300 ring-1 ring-indigo-200 shadow-md" : "border-gray-100 hover:shadow-md"}`}>
                  {!isEditing ? (
                    /* View mode */
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 p-5">
                      <div className="min-w-0 space-y-1.5">
                        <p className="font-semibold text-slate-900 truncate">{d.name}</p>
                        <div className="flex flex-wrap items-center gap-2">
                          <CategoryPill category={d.category} />
                          <StatusBadge status={d.status} />
                          <span className="text-xs text-slate-400">{fmtDate(d.created_at)}</span>
                        </div>
                        {d.description && <p className="text-xs text-slate-400 line-clamp-1">{d.description}</p>}
                      </div>
                      <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                        <select
                          value={d.status}
                          onChange={e => handleStatusChange(d.id, e.target.value)}
                          disabled={isSaving}
                          className="border border-gray-200 rounded-lg px-2 py-1.5 text-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500/30 disabled:opacity-50"
                        >
                          {STATUS_OPTIONS.map(s => (
                            <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>
                          ))}
                        </select>
                        <button
                          onClick={() => startEdit(d)}
                          className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-600 border border-gray-200 bg-white rounded-lg hover:bg-gray-50 transition-colors"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit
                        </button>
                      </div>
                    </div>
                  ) : (
                    /* Edit mode */
                    <div className="p-5 space-y-4">
                      <p className="text-xs font-bold text-indigo-600 uppercase tracking-widest">Editing document</p>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Name</label>
                        <input
                          type="text"
                          value={editFields.name}
                          onChange={e => setEditFields(f => ({ ...f, name: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category</label>
                          <select
                            value={editFields.category}
                            onChange={e => setEditFields(f => ({ ...f, category: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                          >
                            {CATEGORY_OPTIONS.map(c => <option key={c} value={c}>{c.charAt(0).toUpperCase() + c.slice(1)}</option>)}
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Status Override</label>
                          <select
                            value={editFields.status}
                            onChange={e => setEditFields(f => ({ ...f, status: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
                          >
                            {STATUS_OPTIONS.map(s => <option key={s} value={s}>{s.charAt(0).toUpperCase() + s.slice(1)}</option>)}
                          </select>
                        </div>
                      </div>
                      <div>
                        <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
                        <textarea
                          rows={2}
                          value={editFields.description}
                          onChange={e => setEditFields(f => ({ ...f, description: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
                          placeholder="Optional description…"
                        />
                      </div>
                      <div className="flex gap-3 pt-1">
                        <button onClick={cancelEdit} className="flex-1 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1.5">
                          <X className="w-4 h-4" /> Cancel
                        </button>
                        <button
                          onClick={() => saveEdit(d.id)}
                          disabled={isSaving}
                          className="flex-1 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-1.5"
                        >
                          {isSaving
                            ? <><RefreshCw className="w-4 h-4 animate-spin" /> Saving…</>
                            : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
            <p className="text-xs text-slate-400 text-center pt-2">{filtered.length} document{filtered.length !== 1 ? "s" : ""} total</p>
          </div>
        )}
      </div>

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