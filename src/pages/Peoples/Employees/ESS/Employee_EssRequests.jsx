import { useEffect, useMemo, useRef, useState } from "react";
import { X, AlertCircle, CheckCircle, Loader2 } from "lucide-react";
import HRPage from "../../../../components/HRPage";
import { getEss, createEss } from "../../../../service/employee";

const tabs = ["All", "Pending", "Approved", "Rejected"];

const statusColor = {
  Pending: { color: "#D97706", bg: "#FFFBEB" },
  Approved: { color: "#059669", bg: "#ECFDF5" },
  Rejected: { color: "#DC2626", bg: "#FEF2F2" },
};

const REQUEST_TYPES = ["Leave", "Attendance Correction", "Document Request", "Travel", "Expense", "Other"];

export default function EssRequests() {
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState("All");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(null);
  const [form, setForm] = useState({ type: "Leave", description: "" });
  const [formError, setFormError] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    setError(null);

    getEss()
      .then((data) => {
        if (!mounted.current) return;
        setRequests(Array.isArray(data) ? data : []);
      })
      .catch((err) => {
        if (mounted.current) setError(err.message || "Failed to load requests");
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });

    return () => { mounted.current = false; };
  }, []);

  const handleNewRequest = async () => {
    if (!form.description.trim()) { setFormError("Please provide a description"); return; }
    setSubmitting(true);
    setFormError(null);
    try {
      await createEss({
        type: form.type,
        description: form.description,
        status: "Pending",
      });
      setShowModal(false);
      setForm({ type: "Leave", description: "" });
      setSuccess("Your request has been submitted successfully! It is under process and will be reviewed by the admin.");
      setTimeout(() => setSuccess(null), 5000);
      const data = await getEss();
      if (mounted.current) setRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setFormError(err?.message || "Failed to submit request");
    } finally {
      setSubmitting(false);
    }
  };

  const filtered = useMemo(
    () => (activeTab === "All" ? requests : requests.filter((r) => r.status === activeTab)),
    [requests, activeTab]
  );

  if (loading) {
    return (
      <HRPage title="My Requests" subtitle="Track all your submitted requests and their approval status.">
        <div className="flex justify-center items-center py-20">
          <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="My Requests" subtitle="Track all your submitted requests and their approval status.">
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
          {error}
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="My Requests" subtitle="Track all your submitted requests and their approval status.">
      {success && (
        <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-semibold">
          <CheckCircle size={16} /> {success}
        </div>
      )}

      <div className="flex justify-between items-start mb-7">
        <div />
        <button
          onClick={() => setShowModal(true)}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-semibold transition-colors"
        >
          + New Request
        </button>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">New Request</h2>
                <p className="text-xs text-slate-400 mt-0.5">Submit a new request for approval</p>
              </div>
              <button onClick={() => { setShowModal(false); setFormError(null); }} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition">
                <X size={18} />
              </button>
            </div>

            {formError && (
              <div className="mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-semibold">
                <AlertCircle size={14} /> {formError}
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Request Type</label>
                <select
                  value={form.type}
                  onChange={(e) => setForm((p) => ({ ...p, type: e.target.value }))}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition"
                >
                  {REQUEST_TYPES.map((t) => <option key={t}>{t}</option>)}
                </select>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Description</label>
                <textarea
                  rows={4}
                  value={form.description}
                  onChange={(e) => setForm((p) => ({ ...p, description: e.target.value }))}
                  placeholder="Describe your request in detail..."
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition resize-none"
                />
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => { setShowModal(false); setFormError(null); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button
                onClick={handleNewRequest}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold transition shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex gap-2 mb-5">
        {tabs.map((t) => (
          <button
            key={t}
            onClick={() => setActiveTab(t)}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-colors ${
              activeTab === t
                ? "bg-indigo-600 text-white"
                : "bg-white text-gray-500 border border-gray-200 hover:border-gray-300"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-500">
          <p className="text-lg font-medium">No {activeTab === "All" ? "" : activeTab.toLowerCase() + " "}requests found</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((r) => (
            <div
              key={r.id || r.requestId}
              className="p-5 rounded-xl bg-white border border-gray-200 flex justify-between items-center"
            >
              <div>
                <div className="flex items-center gap-2.5 mb-1">
                  <span className="text-xs font-bold text-gray-500">{r.id || r.requestId || r.reference}</span>
                  <span className="text-xs font-bold text-gray-900">{r.type || r.requestType || r.leave_type}</span>
                </div>
                <p className="text-xs text-gray-500 mb-1">{r.description || r.reason || r.purpose}</p>
                <p className="text-xs text-gray-400">Raised on {r.raised || r.createdAt || r.created_at ? new Date(r.raised || r.createdAt || r.created_at).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }) : "-"}</p>
              </div>
              <span
                className="text-xs font-semibold px-3 py-1 rounded-full whitespace-nowrap"
                style={{
                  color: statusColor[r.status]?.color || "#6B7280",
                  background: statusColor[r.status]?.bg || "#F3F4F6",
                }}
              >
                {r.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </HRPage>
  );
}
