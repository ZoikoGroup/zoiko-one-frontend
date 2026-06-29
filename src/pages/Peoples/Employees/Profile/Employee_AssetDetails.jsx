import { useState } from "react";
import {
  Monitor, Laptop, CreditCard, Headphones, Mouse, Keyboard,
  Plus, X, Clock, CheckCircle, XCircle, AlertCircle, ChevronDown
} from "lucide-react";

const ASSIGNED_ASSETS = [
  { id: 1, type: "Laptop", name: "MacBook Pro 14\"", serial: "C02XK1ZBJGH5", icon: Laptop, assignedOn: "Mar 12, 2021", color: "indigo" },
  { id: 2, type: "Monitor", name: "Dell UltraSharp 27\"", serial: "CN-0V833H-74529", icon: Monitor, assignedOn: "Mar 14, 2021", color: "violet" },
  { id: 3, type: "ID Badge", name: "Corporate ID Card", serial: "EMP-20241087-ID", icon: CreditCard, assignedOn: "Mar 12, 2021", color: "emerald" },
  { id: 4, type: "Headset", name: "Sony WH-1000XM5", serial: "SN-WH1000XM5-087", icon: Headphones, assignedOn: "Jun 01, 2022", color: "amber" },
];

const PAST_REQUESTS = [
  { id: 1, asset: "Mechanical Keyboard", reason: "Ergonomic requirement", priority: "Medium", status: "Approved", date: "Jan 10, 2024" },
  { id: 2, asset: "Mouse", reason: "Old mouse stopped working", priority: "High", status: "Approved", date: "Sep 05, 2023" },
  { id: 3, asset: "Laptop Stand", reason: "Posture correction", priority: "Low", status: "Rejected", date: "Nov 20, 2023" },
  { id: 4, asset: "Headset", reason: "Frequent video calls", priority: "Medium", status: "Pending", date: "Jun 15, 2024" },
];

const ASSET_TYPES = ["Laptop", "Keyboard", "Mouse", "ID Card", "Headset", "Monitor", "Webcam", "Docking Station"];
const PRIORITIES = ["Low", "Medium", "High"];

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

export default function AssetDetails() {
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [requests, setRequests] = useState(PAST_REQUESTS);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.assetType) e.assetType = "Select an asset type";
    if (!form.reason.trim() || form.reason.length < 10) e.reason = "Provide at least 10 characters";
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    setRequests(prev => [{
      id: Date.now(),
      asset: form.assetType,
      reason: form.reason,
      priority: form.priority,
      status: "Pending",
      date: new Date().toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" }),
    }, ...prev]);
    setForm(emptyForm);
    setErrors({});
    setShowModal(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 p-4 md:p-8">
      <div className="max-w-5xl mx-auto">
        {/* Header */}
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

        {/* Assigned Assets Grid */}
        <section className="mb-8">
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Currently Assigned</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {ASSIGNED_ASSETS.map(asset => {
              const Icon = asset.icon;
              return (
                <div key={asset.id} className="bg-white rounded-2xl border border-slate-100 shadow-sm p-5 hover:shadow-md transition">
                  <div className={`inline-flex p-2.5 rounded-xl border ${colorMap[asset.color]} mb-4`}>
                    <Icon size={20} />
                  </div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">{asset.type}</p>
                  <p className="text-sm font-bold text-slate-800 mt-0.5">{asset.name}</p>
                  <p className="text-xs text-slate-400 font-mono mt-2 bg-slate-50 px-2 py-1 rounded-lg">{asset.serial}</p>
                  <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
                    <Clock size={11} /> Since {asset.assignedOn}
                  </p>
                </div>
              );
            })}
          </div>
        </section>

        {/* Past Requests Table */}
        <section>
          <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest mb-4">Request History</h2>
          <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-100">
                    {["Asset", "Reason", "Priority", "Date", "Status"].map(h => (
                      <th key={h} className="px-5 py-3 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {requests.map(req => {
                    const StatusIcon = statusConfig[req.status].icon;
                    return (
                      <tr key={req.id} className="border-b border-slate-50 hover:bg-slate-50/60 transition">
                        <td className="px-5 py-3.5 font-semibold text-slate-800">{req.asset}</td>
                        <td className="px-5 py-3.5 text-slate-500 max-w-[200px] truncate">{req.reason}</td>
                        <td className="px-5 py-3.5">
                          <span className={`text-xs font-semibold px-2.5 py-1 rounded-full ${priorityConfig[req.priority]}`}>
                            {req.priority}
                          </span>
                        </td>
                        <td className="px-5 py-3.5 text-slate-400 text-xs">{req.date}</td>
                        <td className="px-5 py-3.5">
                          <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full ${statusConfig[req.status].class}`}>
                            <StatusIcon size={12} /> {req.status}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
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

            <div className="p-6 space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Asset Type</label>
                <div className="relative">
                  <select
                    className={`w-full appearance-none border rounded-xl px-3 py-2.5 text-sm font-medium text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition pr-8 ${errors.assetType ? "border-red-300" : "border-slate-200"}`}
                    value={form.assetType}
                    onChange={e => setForm(p => ({ ...p, assetType: e.target.value }))}
                  >
                    <option value="">Select asset...</option>
                    {ASSET_TYPES.map(t => <option key={t}>{t}</option>)}
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
                  onChange={e => setForm(p => ({ ...p, reason: e.target.value }))}
                />
                {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Priority</label>
                <div className="flex gap-2">
                  {PRIORITIES.map(p => (
                    <button
                      key={p}
                      onClick={() => setForm(prev => ({ ...prev, priority: p }))}
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
              <button onClick={handleSubmit} className="flex-1 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold transition shadow-sm shadow-indigo-200">
                Submit Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}