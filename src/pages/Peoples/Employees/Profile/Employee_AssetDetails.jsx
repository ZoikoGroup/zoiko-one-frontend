import { useState, useEffect, useRef } from "react";
import {
  Monitor, Laptop, CreditCard, Headphones, Mouse, Keyboard,
  Plus, X, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown, Loader2, Bell
} from "lucide-react";
import { getMyProfile, getMyAssets, getAssetRequests, createAssetRequest } from "../../../../service/employee";
import HRPage from "../../../../components/HRPage";

const ASSET_TYPES = ["Laptop", "Keyboard", "Mouse", "ID Card", "Headset", "Monitor", "Webcam", "Docking Station"];
const PRIORITIES = ["Low", "Medium", "High"];

const iconMap = {
  Laptop, Monitor: Monitor, Keyboard, Mouse,
  "ID Card": CreditCard, Headset: Headphones,
  Webcam: Monitor, "Docking Station": Monitor,
};

const colorMap = {
  indigo: "bg-indigo-50 text-indigo-600 border-indigo-100",
  violet: "bg-violet-50 text-violet-600 border-violet-100",
  emerald: "bg-emerald-50 text-emerald-600 border-emerald-100",
  amber: "bg-amber-50 text-amber-600 border-amber-100",
};

const statusConfig = {
  Approved: { icon: CheckCircle, class: "bg-emerald-50 text-emerald-700 border border-emerald-200" },
  Rejected: { icon: XCircle, class: "bg-red-50 text-red-700 border border-red-200" },
  Pending: { icon: Clock, class: "bg-amber-50 text-amber-700 border border-amber-200" },
};

const priorityConfig = {
  Low: "bg-slate-100 text-slate-600",
  Medium: "bg-blue-50 text-blue-600",
  High: "bg-red-50 text-red-600",
};

const emptyForm = { assetType: "", reason: "", priority: "Medium" };

const assetColors = ["indigo", "violet", "emerald", "amber"];

export default function AssetDetails() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [requests, setRequests] = useState([]);
  const [assignedAssets, setAssignedAssets] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [employeeId, setEmployeeId] = useState(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    setLoading(true);
    setError(null);

    getMyProfile()
      .then((res) => {
        if (!mounted.current) return;
        const p = res.data || res;
        const eid = p.id || p._id || p.employeeId || p.employeeCode;
        setEmployeeId(eid);
        return Promise.all([
          getMyAssets(eid).catch(() => []),
          getAssetRequests().catch(() => ({ data: [] })),
        ]);
      })
      .then(([assetsRes, reqsRes]) => {
        if (!mounted.current) return;
        const assets = assetsRes?.items || assetsRes?.data || (Array.isArray(assetsRes) ? assetsRes : []);
        const reqs = reqsRes?.items || reqsRes?.data || (Array.isArray(reqsRes) ? reqsRes : []);
        setAssignedAssets(Array.isArray(assets) ? assets : []);
        setRequests(Array.isArray(reqs) ? reqs : []);
      })
      .catch((err) => {
        if (mounted.current) setError(err?.message || "Failed to load asset details");
      })
      .finally(() => {
        if (mounted.current) setLoading(false);
      });

    return () => { mounted.current = false; };
  }, []);

  const validate = () => {
    const e = {};
    if (!form.assetType) e.assetType = "Select an asset type";
    if (!form.reason.trim() || form.reason.length < 10) e.reason = "Provide at least 10 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setSubmitting(true);
    setErrors({});
    setSuccess(null);
    createAssetRequest({
      asset_type: form.assetType,
      reason: form.reason,
      priority: form.priority.toLowerCase(),
      requested_on: new Date().toISOString().split("T")[0],
    })
      .then((res) => {
        if (!mounted.current) return;
        const newReq = res?.data || {
          id: Date.now(),
          asset: form.assetType,
          reason: form.reason,
          priority: form.priority,
          status: "Pending",
          date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
        };
        setRequests((prev) => [newReq, ...prev]);
        setForm(emptyForm);
        setShowModal(false);
        setSuccess("Your asset request has been submitted successfully! It is under process and will be reviewed by the admin.");
        setTimeout(() => { if (mounted.current) setSuccess(null); }, 5000);
      })
      .catch((err) => {
        if (mounted.current) setErrors({ _api: err?.message || "Failed to submit request" });
      })
      .finally(() => {
        if (mounted.current) setSubmitting(false);
      });
  };

  if (loading) {
    return (
      <HRPage title="Asset Details" subtitle="Profile">
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          <span className="ml-3 text-sm text-slate-500 font-medium">Loading asset details...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Asset Details" subtitle="Profile">
      <div className="max-w-5xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Profile</p>
            <h1 className="text-2xl font-bold text-slate-800 mt-1">Asset Details</h1>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 text-sm font-semibold text-white bg-indigo-600 hover:bg-indigo-700 px-4 py-2.5 rounded-xl transition shadow-sm shadow-indigo-200"
          >
            <Plus size={16} /> Request Asset
          </button>
        </div>

        {success && (
          <div className="mb-6 flex items-center gap-3 bg-emerald-50 border border-emerald-200 rounded-xl px-4 py-3 text-emerald-700 text-sm font-semibold">
            <Bell size={16} /> {success}
          </div>
        )}

        {error && (
          <div className="mb-6 flex items-center gap-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-semibold">
            <AlertCircle size={16} /> {error}
          </div>
        )}

        {/* Assigned Assets Grid */}
        <section className="mb-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Currently Assigned</h2>
          {assignedAssets.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400 text-sm font-medium">
              No assets assigned to you.
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {assignedAssets.map((asset, idx) => {
                const Icon = iconMap[asset.type || asset.assetType] || Monitor;
                return (
                  <div key={asset.id || idx} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
                    <div className={`inline-flex p-2.5 rounded-xl border ${colorMap[assetColors[idx % 4]]} mb-4`}>
                      <Icon size={20} />
                    </div>
                    <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{asset.type || asset.assetType}</p>
                    <p className="text-sm font-bold text-slate-800 mt-0.5">{asset.name || asset.assetName}</p>
                    <p className="text-xs text-slate-400 font-mono mt-2 bg-slate-50 px-2 py-1 rounded-lg">{asset.serial || asset.serialNumber || "—"}</p>
                    <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                      <Clock size={11} /> Since {asset.assignedOn ? new Date(asset.assignedOn).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}
                    </p>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Past Requests Table */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Request History</h2>
          {requests.length === 0 ? (
            <div className="text-center py-12 bg-white rounded-2xl border border-slate-100 shadow-sm text-slate-400 text-sm font-medium">
              No asset requests yet.
            </div>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-100">
                      {["Asset", "Reason", "Priority", "Date", "Status"].map((h) => (
                        <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {requests.map((req) => {
                      const StatusIcon = statusConfig[req.status]?.icon || Clock;
                      return (
                        <tr key={req.id || req._id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                          <td className="px-5 py-3.5 font-semibold text-slate-800">{req.asset || req.assetType}</td>
                          <td className="px-5 py-3.5 text-slate-500 max-w-[200px] truncate">{req.reason}</td>
                          <td className="px-5 py-3.5">
                            <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityConfig[req.priority] || priorityConfig.Medium}`}>
                              {req.priority}
                            </span>
                          </td>
                          <td className="px-5 py-3.5 text-slate-400 text-xs">{req.date ? new Date(req.date).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }) : "—"}</td>
                          <td className="px-5 py-3.5">
                            <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[req.status]?.class || statusConfig.Pending.class}`}>
                              <StatusIcon size={12} /> {req.status || "Pending"}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </section>
      </div>

      {/* Request Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md">
            <div className="flex items-center justify-between p-6 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Request New Asset</h2>
                <p className="text-xs text-slate-400 mt-0.5">Submit a request to your IT team</p>
              </div>
              <button onClick={() => { setShowModal(false); setErrors({}); }} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition">
                <X size={18} />
              </button>
            </div>

            {errors._api && (
              <div className="mx-6 mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-semibold">
                <AlertCircle size={14} /> {errors._api}
              </div>
            )}

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Asset Type</label>
                <div className="relative">
                  <select
                    className={`w-full appearance-none border rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition pr-8 ${errors.assetType ? "border-red-300" : "border-slate-200"}`}
                    value={form.assetType}
                    onChange={(e) => setForm((p) => ({ ...p, assetType: e.target.value }))}
                  >
                    <option value="">Select asset...</option>
                    {ASSET_TYPES.map((t) => <option key={t}>{t}</option>)}
                  </select>
                  <ChevronDown size={14} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
                </div>
                {errors.assetType && <p className="text-xs text-red-500 mt-1">{errors.assetType}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Reason for Request</label>
                <textarea
                  rows={3}
                  className={`w-full border rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition resize-none ${errors.reason ? "border-red-300" : "border-slate-200"}`}
                  placeholder="Describe why you need this asset..."
                  value={form.reason}
                  onChange={(e) => setForm((p) => ({ ...p, reason: e.target.value }))}
                />
                {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map((p) => (
                    <button
                      key={p}
                      onClick={() => setForm((prev) => ({ ...prev, priority: p }))}
                      className={`flex-1 py-2 rounded-xl text-sm font-semibold border transition ${
                        form.priority === p
                          ? p === "High" ? "bg-red-500 text-white border-red-500"
                            : p === "Medium" ? "bg-blue-500 text-white border-blue-500"
                            : "bg-slate-700 text-white border-slate-700"
                          : "bg-slate-50 text-slate-500 border-slate-200 hover:bg-slate-100"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-0 flex gap-3">
              <button onClick={() => { setShowModal(false); setErrors({}); }} className="flex-1 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                Cancel
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold transition shadow-sm shadow-indigo-200 flex items-center justify-center gap-2"
              >
                {submitting ? <><Loader2 size={14} className="animate-spin" /> Submitting...</> : "Submit Request"}
              </button>
            </div>
          </div>
        </div>
      )}
    </HRPage>
  );
}
