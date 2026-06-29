import { useState, useEffect, useCallback, useRef } from "react";
import {
  Trash2, Plus, Upload, Search, X, Check, RefreshCw, FileText, Download, User, Briefcase, Hash, AlertCircle
} from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getDocuments, uploadDocument, deleteDocument } from "../../../service/hrService";
import { API_BASE_URL } from "../../../service/api";
import { useAuth } from "../../../context/AuthContext";

const fileTypeIcon = (filename = "") => {
  const ext = filename.split(".").pop()?.toLowerCase();
  const map = { pdf: "📄", doc: "📝", docx: "📝", xls: "📊", xlsx: "📊", png: "🖼️", jpg: "🖼️", jpeg: "🖼️", pptx: "📑" };
  return map[ext] || "📎";
};
const fmtDate = (iso) => {
  if (!iso) return "—";
  const d = new Date(iso);
  return isNaN(d) ? iso : d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" });
};

function UploadModal({ onClose, onUploaded, user }) {
  const [file, setFile]         = useState(null);
  const [name, setName]         = useState("");
  const [category, setCategory] = useState("employee");
  const [description, setDesc]  = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError]       = useState(null);
  const fileRef                 = useRef();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) { setError("Please select a file to upload."); return; }
    setUploading(true);
    setError(null);
    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("title", name || file.name);
      formData.append("category", category);
      if (description) formData.append("description", description);
      if (user?.id) formData.append("employee_id", user.id);
      await uploadDocument(formData);
      onUploaded();
      onClose();
    } catch (err) {
      const detail = err?.response?.data?.detail;
      const msg = Array.isArray(detail)
        ? detail.map(e => e.msg || e.message || JSON.stringify(e)).join("; ")
        : (typeof detail === "string" ? detail : null);
      setError(msg || "Upload failed. Please try again.");
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
            <Upload className="w-4 h-4 text-indigo-600" /> Upload Document
          </h3>
          <button onClick={onClose} className="p-1 rounded hover:bg-gray-100 text-slate-400 hover:text-slate-600">
            <X className="w-5 h-5" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">File *</label>
            <div
              onClick={() => fileRef.current?.click()}
              className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center cursor-pointer hover:border-indigo-400 hover:bg-indigo-50/50 transition-colors"
            >
              {file ? (
                <p className="text-sm font-medium text-slate-700">{file.name}</p>
              ) : (
                <>
                  <FileText className="w-6 h-6 text-gray-300 mx-auto mb-2" />
                  <p className="text-sm text-slate-400">Click to choose a file</p>
                  <p className="text-xs text-slate-300 mt-1">PDF, DOCX, XLSX, PNG…</p>
                </>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={e => setFile(e.target.files[0] || null)} />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Display Name</label>
            <input
              type="text"
              placeholder="Leave blank to use file name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Category *</label>
            <select
              value={category}
              onChange={e => setCategory(e.target.value)}
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
            >
              <option value="employee">Employee</option>
              <option value="company">Company</option>
              <option value="contract">Contract</option>
              <option value="policy">Policy</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wide mb-1.5">Description</label>
            <textarea
              rows={2}
              value={description}
              onChange={e => setDesc(e.target.value)}
              placeholder="Optional notes…"
              className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30 resize-none"
            />
          </div>
          {error && (
            <p className="text-xs text-rose-600 font-medium bg-rose-50 border border-rose-200 rounded-lg px-3 py-2">{error}</p>
          )}
          <div className="flex gap-3 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50">
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="flex-1 py-2 text-sm font-semibold bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 disabled:opacity-60 flex items-center justify-center gap-2"
            >
              {uploading
                ? <><RefreshCw className="w-4 h-4 animate-spin" /> Uploading…</>
                : <><Upload className="w-4 h-4" /> Upload</>}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default function EmployeeDocuments() {
  const { user } = useAuth();
  const [docs, setDocs]           = useState([]);
  const [loading, setLoading]     = useState(true);
  const [deletingId, setDeletingId] = useState(null);
  const [showUpload, setShowUpload] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [search, setSearch]       = useState("");
  const [toast, setToast]         = useState(null);

  const showToast = (type, message) => {
    setToast({ type, message });
    setTimeout(() => setToast(null), 3500);
  };

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await getDocuments({ category: "employee" });
      setDocs(Array.isArray(res?.data) ? res.data : []);
    } catch {
      showToast("error", "Failed to load documents.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const handleDelete = async () => {
    if (!confirmDelete) return;
    const { id, name } = confirmDelete;
    setConfirmDelete(null);
    setDeletingId(id);
    try {
      await deleteDocument(id);
      showToast("success", `"${name}" deleted successfully.`);
      load();
    } catch {
      showToast("error", `Failed to delete "${name}". Please try again.`);
    } finally {
      setDeletingId(null);
    }
  };

  const getDownloadUrl = (d) => {
    if (d.file_url) return d.file_url;
    if (d.file_path) return `${API_BASE_URL}/${d.file_path.replace(/\\/g, "/")}`;
    return null;
  };

  const filtered = docs
    .filter(d => !search.trim() || d.title?.toLowerCase().includes(search.trim().toLowerCase()));

  return (
    <HRPage title="Employee Documents">
      <div className="space-y-6 pb-10">

        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-gray-100 pb-4">
          <div>
            <h2 className="text-xl font-bold text-slate-900">Employee Documents</h2>
            <p className="text-sm text-slate-500 mt-0.5">View all documents uploaded by employees. Download and manage files.</p>
          </div>
          <div className="flex items-center gap-2 self-start sm:self-center">
            <button onClick={load} className="p-2 rounded-lg border border-gray-200 bg-white text-slate-400 hover:text-slate-600 hover:bg-gray-50">
              <RefreshCw className="w-4 h-4" />
            </button>
            <button
              onClick={() => setShowUpload(true)}
              className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors shadow-sm shadow-indigo-200"
            >
              <Plus className="w-4 h-4" /> Upload Document
            </button>
          </div>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search by document name…"
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/30"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3 text-slate-400">
            <svg className="animate-spin h-8 w-8 text-indigo-500" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z" />
            </svg>
            <span className="text-sm font-medium">Loading employee documents…</span>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            {filtered.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-20 text-center px-4">
                <span className="text-5xl mb-4">📄</span>
                <p className="text-base font-semibold text-slate-700 mb-1">
                  {search ? "No results found" : "No employee documents yet"}
                </p>
                <p className="text-sm text-slate-400 mb-5">
                  {search ? "Try a different search term." : "Upload the first document using the button above."}
                </p>
                {!search && (
                  <button
                    onClick={() => setShowUpload(true)}
                    className="flex items-center gap-2 bg-indigo-600 text-white text-sm font-semibold px-4 py-2 rounded-lg hover:bg-indigo-700"
                  >
                    <Plus className="w-4 h-4" /> Upload Document
                  </button>
                )}
              </div>
            ) : (
              <>
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 text-xs uppercase text-gray-400">
                    <tr>
                      <th className="text-left px-6 py-3 font-semibold"><Hash className="w-3 h-3 inline mr-1" />ID</th>
                      <th className="text-left px-6 py-3 font-semibold"><User className="w-3 h-3 inline mr-1" />Employee Name</th>
                      <th className="text-left px-6 py-3 font-semibold"><Briefcase className="w-3 h-3 inline mr-1" />Designation</th>
                      <th className="text-left px-6 py-3 font-semibold"><FileText className="w-3 h-3 inline mr-1" />Document Name</th>
                      <th className="text-center px-6 py-3 font-semibold"><Download className="w-3 h-3 inline mr-1" />Download</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filtered.map((d, idx) => (
                      <tr key={d.id} className="hover:bg-gray-50/60 transition-colors">
                        <td className="px-6 py-3 text-xs font-mono text-slate-400">{d.id || idx + 1}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-xs font-bold text-indigo-600 shrink-0">
                              {(d.employee_name || d.uploader_name || "?").charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-slate-800">{d.employee_name || d.uploader_name || "—"}</span>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-slate-600">{d.designation || d.designation_name || "—"}</td>
                        <td className="px-6 py-3">
                          <div className="flex items-center gap-2">
                            <span className="text-lg shrink-0">{fileTypeIcon(d.file_name || d.title)}</span>
                            <div>
                              <p className="font-medium text-slate-800 truncate max-w-[200px]">{d.title}</p>
                              {d.file_name && <p className="text-xs text-slate-400">{d.file_name}</p>}
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-3 text-center">
                          {getDownloadUrl(d) ? (
                            <a
                              href={getDownloadUrl(d)}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-indigo-600 border border-indigo-200 bg-indigo-50 rounded-lg hover:bg-indigo-100 transition-colors"
                            >
                              <Download className="w-3.5 h-3.5" /> Download
                            </a>
                          ) : (
                            <span className="text-xs text-slate-400">No file</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="px-6 py-3 border-t border-gray-100 text-xs text-slate-400">
                  {filtered.length} document{filtered.length !== 1 ? "s" : ""}
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {showUpload && <UploadModal onClose={() => setShowUpload(false)} onUploaded={load} user={user} />}

      {confirmDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl p-6 w-full max-w-sm">
            <h4 className="text-base font-bold text-slate-900 mb-2">Delete Document?</h4>
            <p className="text-sm text-slate-500 mb-6">
              &ldquo;<strong>{confirmDelete.name}</strong>&rdquo; will be permanently removed. This cannot be undone.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setConfirmDelete(null)} className="px-4 py-2 text-sm font-medium text-slate-600 border border-gray-200 rounded-lg hover:bg-gray-50">
                Cancel
              </button>
              <button onClick={handleDelete} className="px-4 py-2 text-sm font-semibold bg-rose-600 text-white rounded-lg hover:bg-rose-700">
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {toast && (
        <div className={`fixed bottom-6 right-6 z-50 px-4 py-3 rounded-xl shadow-lg text-sm font-medium flex items-center gap-2 ${toast.type === "success" ? "bg-emerald-600" : "bg-rose-600"} text-white`}>
          {toast.type === "success" ? <Check className="w-4 h-4" /> : <X className="w-4 h-4" />}
          {toast.message}
        </div>
      )}
    </HRPage>
  );
}
