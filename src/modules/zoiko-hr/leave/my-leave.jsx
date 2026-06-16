import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, X } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getMyLeave, createLeaveRequest } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/leave" },
  { label: "My Leave", href: "/zoiko-hr/leave/my-leave" },
  { label: "Requests", href: "/zoiko-hr/leave/requests" },
  { label: "Calendar", href: "/zoiko-hr/leave/calendar" },
  { label: "Leave Types", href: "/zoiko-hr/leave/leave-types" },
  { label: "Reports", href: "/zoiko-hr/leave/reports" },
  { label: "Settings", href: "/zoiko-hr/leave/settings" },
];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const typeColors = {
  annual: "bg-blue-500", sick: "bg-pink-500", casual: "bg-orange-500", earned: "bg-teal-500",
  maternity: "bg-purple-500", paternity: "bg-indigo-500", unpaid: "bg-gray-500", study: "bg-cyan-500", emergency: "bg-red-500",
};

const leaveTypeOptions = [
  { value: "annual", label: "Annual Leave" }, { value: "sick", label: "Sick Leave" },
  { value: "casual", label: "Casual Leave" }, { value: "earned", label: "Earned Leave" },
  { value: "maternity", label: "Maternity Leave" }, { value: "paternity", label: "Paternity Leave" },
  { value: "unpaid", label: "Unpaid Leave" }, { value: "study", label: "Study Leave" },
  { value: "emergency", label: "Emergency Leave" },
];

const initialForm = { leave_type: "annual", start_date: "", end_date: "", reason: "" };

const balances = [
  { type: "annual", total: 20, used: 12 }, { type: "sick", total: 12, used: 4 },
  { type: "casual", total: 10, used: 6 }, { type: "earned", total: 15, used: 5 },
  { type: "unpaid", total: 30, used: 2 }, { type: "study", total: 10, used: 1 },
  { type: "emergency", total: 5, used: 2 },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/leave"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

function daysBetween(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1);
}

export default function MyLeave() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);

  useEffect(() => {
    let mounted = true;
    getMyLeave()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

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
      await createLeaveRequest(form);
      setMessage("Leave request submitted successfully!");
      setShowModal(false);
      setForm({ ...initialForm });
      const data = await getMyLeave();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setMessage("Failed to submit leave request");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <HRPage title="My Leave" subtitle="View and manage your leave requests">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-500">Loading leave records...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="My Leave" subtitle="View and manage your leave requests">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">My Leave</h1>
            <p className="text-sm text-gray-500 mt-1">View and manage your leave requests</p>
          </div>
          <button onClick={() => { setForm({ ...initialForm }); setErrors({}); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium">
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

        {records.length > 0 && (
          <div className="flex flex-wrap items-center gap-3 mb-4">
            <input type="text" placeholder="Search by type or reason..." onChange={(e) => {}}
              className="w-full max-w-sm px-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">My Leave Requests</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End Date</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {records.map((r, i) => (
                  <tr key={r.id ?? i} className="hover:bg-teal-50/50 transition-colors">
                    <td className="px-4 py-3 text-sm font-medium text-gray-900 capitalize">{r.leave_type || r.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.start_date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.end_date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{r.days || daysBetween(r.start_date, r.end_date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{r.reason || "-"}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {records.length === 0 && (
                  <tr>
                    <td colSpan={6} className="px-4 py-12 text-center text-gray-400 text-sm">No leave requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
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
                  <select value={form.leave_type} onChange={(e) => setForm({ ...form, leave_type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                    {leaveTypeOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input type="date" value={form.start_date} onChange={(e) => setForm({ ...form, start_date: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.start_date ? "border-red-300" : "border-gray-200"}`} />
                    {errors.start_date && <p className="text-xs text-red-500 mt-1">{errors.start_date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input type="date" value={form.end_date} onChange={(e) => setForm({ ...form, end_date: e.target.value })}
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.end_date ? "border-red-300" : "border-gray-200"}`} />
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
                  <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    placeholder="Please describe the reason for your leave..."
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500 ${errors.reason ? "border-red-300" : "border-gray-200"}`} />
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
    </HRPage>
  );
}
