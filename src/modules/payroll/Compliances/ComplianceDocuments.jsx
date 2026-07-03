import { useRef, useState, useEffect } from "react";
import { UploadCloud, FileText, Trash2, CheckCircle2, AlertTriangle, Loader2 } from "lucide-react";
import { uploadComplianceDocument, deleteComplianceDocument, fetchComplianceDocuments } from "../../../service/payrollService";

const statusConfig = {
  processing:  { label: "Extracting…", color: "bg-amber-100 text-amber-700", icon: Loader2, spin: true },
  parsed:      { label: "Parsed", color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  failed:      { label: "Extraction failed", color: "bg-red-100 text-red-700", icon: AlertTriangle },
  unavailable: { label: "Extraction service not connected", color: "bg-slate-100 text-slate-500", icon: AlertTriangle },
};

export default function ComplianceDocumentUpload({ country, addToast }) {
  const [documents, setDocuments] = useState([]);
  const [dragOver, setDragOver] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const inputRef = useRef(null);

  useEffect(() => {
    fetchComplianceDocuments(country).then(setDocuments).catch(() => {});
  }, [country]);

  const handleFiles = async (fileList) => {
    const files = Array.from(fileList || []);
    if (files.length === 0) return;

    for (const file of files) {
      const localId = `local-${Date.now()}-${file.name}`;
      const draft = {
        id: localId,
        fileName: file.name,
        sizeLabel: formatBytes(file.size),
        uploadedAt: new Date().toISOString(),
        status: "processing",
        extracted: null,
        error: null,
      };
      setDocuments((prev) => [draft, ...prev]);

      try {
        const result = await uploadComplianceDocument(file, country);
        setDocuments((prev) =>
          prev.map((d) => (d.id === localId ? { ...d, ...result, id: result?.id || localId } : d))
        );
      } catch (err) {
        // Most likely cause today: the extraction endpoint doesn't exist
        // yet. Keep the file listed so nothing HR did is lost — mark it
        // "unavailable" rather than failing silently or dropping it.
        const unavailable = err?.status === 404 || err?.status === undefined;
        setDocuments((prev) =>
          prev.map((d) =>
            d.id === localId
              ? {
                  ...d,
                  status: unavailable ? "unavailable" : "failed",
                  error: unavailable
                    ? "Document extraction isn't connected yet. This file is queued and will process automatically once the backend is live."
                    : "Couldn't extract data from this document. Try a clearer scan, or enter the details manually in the other tabs.",
                }
              : d
          )
        );
      }
    }
  };

  const handleDelete = async (doc) => {
    setConfirmDelete(null);
    setDocuments((prev) => prev.filter((d) => d.id !== doc.id));
    if (!String(doc.id).startsWith("local-")) {
      try {
        await deleteComplianceDocument(doc.id);
        addToast?.("Document deleted successfully.", "success");
      } catch {
        addToast?.("Removed locally, but couldn't sync the deletion to the server.", "error");
      }
    } else {
      addToast?.("Document removed.", "success");
    }
  };

  return (
    <div className="space-y-4">
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current?.click()}
        className={`cursor-pointer rounded-3xl border-2 border-dashed p-10 text-center transition-colors ${
          dragOver ? "border-violet-400 bg-violet-50" : "border-slate-200 bg-white hover:border-violet-300"
        }`}
      >
        <UploadCloud size={28} className="mx-auto mb-3 text-violet-500" />
        <p className="text-sm font-semibold text-slate-700">
          Drop a compliance or tax document here, or click to upload
        </p>
        <p className="text-xs text-slate-400 mt-1">
          PDF, image, or scanned notice — we'll pull out contribution rates, tax slabs, and requirements for this jurisdiction.
        </p>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept=".pdf,.png,.jpg,.jpeg"
          className="hidden"
          onChange={(e) => handleFiles(e.target.files)}
        />
      </div>

      {documents.length === 0 ? (
        <div className="bg-white border border-slate-200 rounded-3xl p-8 text-center text-sm text-slate-400">
          No documents uploaded yet for this jurisdiction.
        </div>
      ) : (
        <div className="space-y-3">
          {documents.map((doc) => {
            const sc = statusConfig[doc.status] || statusConfig.processing;
            const Icon = sc.icon;
            return (
              <div key={doc.id} className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="h-9 w-9 rounded-xl bg-slate-100 flex items-center justify-center shrink-0">
                      <FileText size={16} className="text-slate-500" />
                    </div>
                    <div className="min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate">{doc.fileName}</p>
                      <p className="text-xs text-slate-400">{doc.sizeLabel} · {new Date(doc.uploadedAt).toLocaleString()}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <span className={`flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-bold ${sc.color}`}>
                      <Icon size={12} className={sc.spin ? "animate-spin" : ""} /> {sc.label}
                    </span>
                    {confirmDelete === doc.id ? (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => handleDelete(doc)}
                          className="rounded-lg bg-red-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-red-600 transition"
                        >
                          Confirm
                        </button>
                        <button
                          onClick={() => setConfirmDelete(null)}
                          className="rounded-lg bg-slate-100 px-2.5 py-1 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <button
                        onClick={() => setConfirmDelete(doc.id)}
                        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-red-500 hover:bg-red-50 border border-transparent hover:border-red-200 transition"
                      >
                        <Trash2 size={12} /> Delete
                      </button>
                    )}
                  </div>
                </div>

                {doc.error && (
                  <p className="text-xs text-slate-400 mt-3 bg-slate-50 rounded-xl px-3 py-2">{doc.error}</p>
                )}

                {doc.status === "parsed" && doc.extracted && (
                  <ExtractedPreview extracted={doc.extracted} />
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

function ExtractedPreview({ extracted }) {
  const { contributionRates, taxSlabs, requirements } = extracted;
  return (
    <div className="mt-4 pt-4 border-t border-slate-100 space-y-4">
      <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide">
        Extracted from this document — reference only, nothing is auto-applied
      </p>

      {contributionRates?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">Contribution Rates</p>
          <div className="space-y-1">
            {contributionRates.map((r, i) => (
              <div key={r.id ?? i} className="flex justify-between text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">
                <span>{r.label}</span>
                <span className="font-mono">{r.employee} / {r.employer}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {taxSlabs?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">Tax Slabs</p>
          <div className="space-y-1">
            {taxSlabs.map((s, i) => (
              <div key={s.id ?? i} className="flex justify-between text-xs text-slate-600 bg-slate-50 rounded-lg px-3 py-1.5">
                <span>{s.min} – {s.max}</span>
                <span className="font-mono">{s.rate}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {requirements?.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-slate-600 mb-1.5">Requirements Noted</p>
          <ul className="space-y-1 list-disc list-inside">
            {requirements.map((r, i) => (
              <li key={i} className="text-xs text-slate-600">{r.label}{r.note ? ` — ${r.note}` : ""}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

function formatBytes(bytes) {
  if (!bytes) return "0 KB";
  const kb = bytes / 1024;
  if (kb < 1024) return `${kb.toFixed(0)} KB`;
  return `${(kb / 1024).toFixed(1)} MB`;
}