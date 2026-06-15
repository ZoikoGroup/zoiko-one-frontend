import { useState } from "react";
import { Plus, X } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useMyLeave } from "../hooks/useLeave";
import { createLeaveRequest } from "../services/leaveService";
import { formatDate, daysBetween } from "../utils/helpers";
import { LEAVE_TYPE, LEAVE_STATUS } from "../types";

const leaveTypeOptions = Object.entries(LEAVE_TYPE).map(([k, v]) => ({ value: v, label: k.charAt(0) + k.slice(1).toLowerCase() + " Leave" }));
const statusOptions = Object.entries(LEAVE_STATUS).map(([k, v]) => ({ value: v, label: k.charAt(0) + k.slice(1).toLowerCase() }));

const typeColors = {
  annual: "bg-blue-500", sick: "bg-pink-500", casual: "bg-orange-500", earned: "bg-teal-500",
  maternity: "bg-purple-500", paternity: "bg-indigo-500", unpaid: "bg-gray-500", study: "bg-cyan-500", emergency: "bg-red-500",
};

const initialForm = { leave_type: "annual", start_date: "", end_date: "", reason: "" };

export default function MyLeave() {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const { data, loading } = useMyLeave(filters);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  const balances = [
    { type: "annual", total: 20, used: 12 },
    { type: "sick", total: 12, used: 4 },
    { type: "casual", total: 10, used: 6 },
    { type: "earned", total: 15, used: 5 },
    { type: "unpaid", total: 30, used: 2 },
    { type: "study", total: 10, used: 1 },
    { type: "emergency", total: 5, used: 2 },
  ];

  const filtered = data.filter((r) => {
    if (search && !r.leave_type.toLowerCase().includes(search.toLowerCase()) && !r.reason?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const columns = [
    { key: "leave_type", label: "Type", render: (v) => <span className="capitalize font-medium text-gray-900">{v}</span> },
    { key: "start_date", label: "Start Date", render: (v) => formatDate(v) },
    { key: "end_date", label: "End Date", render: (v) => formatDate(v) },
    { key: "days", label: "Days" },
    { key: "reason", label: "Reason", render: (v) => v || "-" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
  };

  const validateForm = (d) => {
    const errs = {};
    if (!d.leave_type) errs.leave_type = "Required";
    if (!d.start_date) errs.start_date = "Required";
    if (!d.end_date) errs.end_date = "Required";
    if (d.start_date && d.end_date && new Date(d.end_date) < new Date(d.start_date)) errs.end_date = "End must be after start";
    if (!d.reason?.trim()) errs.reason = "Reason is required";
    return errs;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errs = validateForm(form);
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setSubmitting(true);
    setMessage(null);
    try {
      const res = await createLeaveRequest(form);
      setMessage(res.success ? "Leave request submitted successfully!" : "Failed to submit");
      setShowModal(false);
      setForm({ ...initialForm });
    } catch {
      setMessage("Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) return <div className="p-6 text-gray-400">Loading leave records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Leave</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage your leave requests</p>
        </div>
        <button
          onClick={() => { setForm({ ...initialForm }); setErrors({}); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      {message && (
        <div className={`px-4 py-3 rounded-lg text-sm ${message.includes("success") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
          {message}
        </div>
      )}

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Balances</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {balances.map((b) => {
            const pct = b.total > 0 ? Math.round((b.used / b.total) * 100) : 0;
            return (
              <div key={b.type} className="bg-gray-50 rounded-lg p-4 border border-gray-100">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-gray-900 capitalize">{b.type}</span>
                  <span className="text-xs text-gray-400">{b.used}/{b.total}</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div className={`${typeColors[b.type]} h-2 rounded-full`} style={{ width: `${pct}%` }} />
                </div>
                <p className="text-xs text-gray-500 mt-1">{b.total - b.used} remaining</p>
              </div>
            );
          })}
        </div>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          { key: "status", value: filters.status || "", placeholder: "All Statuses", options: statusOptions },
        ]}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">My Leave Requests</h2>
        <DataTable columns={columns} data={filtered} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">New Leave Request</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                <select
                  value={form.leave_type}
                  onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                >
                  {leaveTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date" value={form.start_date}
                    onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.start_date ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date" value={form.end_date}
                    onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.end_date ? "border-red-300" : "border-gray-200"}`}
                  />
                  {errors.end_date && <p className="text-xs text-red-500 mt-1">{errors.end_date}</p>}
                </div>
              </div>
              {form.start_date && form.end_date && (
                <div className="bg-teal-50 px-3 py-2 rounded-lg text-sm text-teal-700">
                  Duration: {daysBetween(form.start_date, form.end_date)} days
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea
                  rows={3} value={form.reason}
                  onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Please describe the reason for your leave..."
                  className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.reason ? "border-red-300" : "border-gray-200"}`}
                />
                {errors.reason && <p className="text-xs text-red-500 mt-1">{errors.reason}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
