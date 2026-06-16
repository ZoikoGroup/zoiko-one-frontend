import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/ess" },
  { label: "Profile", href: "/zoiko-hr/ess/profile" },
  { label: "Leave Management", href: "/zoiko-hr/ess/leave" },
  { label: "Attendance", href: "/zoiko-hr/ess/attendance" },
  { label: "My Documents", href: "/zoiko-hr/ess/my-documents" },
  { label: "Requests", href: "/zoiko-hr/ess/requests" },
  { label: "Settings", href: "/zoiko-hr/ess/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/ess"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

const mockLeaveBalanceData = {
  annual: { remaining: 12, total: 20 },
  sick: { remaining: 2, total: 5 },
  personal: { remaining: 1, total: 3 },
  unpaid: { remaining: 0, total: 2 },
};

const mockLeaveRequestsData = [
  { id: 1, type: "annual", startDate: "2025-04-01", endDate: "2025-04-05", days: 5, reason: "Family vacation", status: "pending", appliedOn: "2025-03-28" },
  { id: 2, type: "sick", startDate: "2025-03-25", endDate: "2025-03-26", days: 2, reason: "Doctor's appointment", status: "approved", appliedOn: "2025-03-24" },
  { id: 3, type: "personal", startDate: "2025-04-10", endDate: "2025-04-10", days: 1, reason: "Family event", status: "pending", appliedOn: "2025-04-01" },
  { id: 4, type: "annual", startDate: "2025-05-01", endDate: "2025-05-03", days: 3, reason: "Conference", status: "pending", appliedOn: "2025-03-30" },
  { id: 5, type: "unpaid", startDate: "2025-04-15", endDate: "2025-04-20", days: 6, reason: "Personal project", status: "approved", appliedOn: "2025-04-02" },
];

export default function EssLeaveManagement() {
  const [balance] = useState(mockLeaveBalanceData);
  const [requests] = useState(mockLeaveRequestsData);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ type: "annual", startDate: "", endDate: "", reason: "" });
  const [formError, setFormError] = useState(null);

  const balanceCards = balance
    ? [
        { title: "Annual Leave", value: `${balance.annual.remaining}/${balance.annual.total}`, icon: "📅", change: null, trend: null },
        { title: "Sick Leave", value: `${balance.sick.remaining}/${balance.sick.total}`, icon: "🤒", change: null, trend: null },
        { title: "Personal Leave", value: `${balance.personal.remaining}/${balance.personal.total}`, icon: "🏠", change: null, trend: null },
        { title: "Unpaid Leave", value: `${balance.unpaid.remaining}/${balance.unpaid.total}`, icon: "💼", change: null, trend: null },
      ]
    : [];

  const filtered = requests.filter((r) => {
    if (search && !r.type.toLowerCase().includes(search.toLowerCase()) && !r.reason.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    if (typeFilter && r.type !== typeFilter) return false;
    return true;
  });

  const handleFilterChange = (key, value) => {
    if (key === "status") setStatusFilter(value);
    if (key === "type") setTypeFilter(value);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.startDate || !form.endDate) {
      setFormError("Start and end dates are required");
      return;
    }
    setSubmitting(true);
    setFormError(null);
    try {
      setShowModal(false);
      setForm({ type: "annual", startDate: "", endDate: "", reason: "" });
    } catch (err) {
      setFormError(err.message || "Failed to create leave request");
    } finally {
      setSubmitting(false);
    }
  };

  const leaveTypes = [
    { value: "annual", label: "Annual" },
    { value: "sick", label: "Sick" },
    { value: "personal", label: "Personal" },
    { value: "unpaid", label: "Unpaid" },
  ];

  const columns = [
    { key: "type", label: "Type", render: (v) => <span className="font-medium capitalize text-gray-900">{v}</span> },
    { key: "startDate", label: "Start Date", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "endDate", label: "End Date", render: (v) => <span className="text-gray-700">{v}</span> },
    { key: "days", label: "Days", render: (v) => <span className="font-semibold">{v}</span> },
    { key: "reason", label: "Reason", render: (v) => <span className="text-gray-500 truncate max-w-[200px] block">{v}</span> },
    { key: "status", label: "Status", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
      v === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
    }`}>{v}</span> },
    { key: "appliedOn", label: "Applied", render: (v) => <span className="text-gray-400 text-xs">{v}</span> },
  ];

  return (
    <HRPage title="Employee Self Service" subtitle="Manage your leave requests and view balance">
      <SubNav />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
            <p className="text-sm text-gray-500 mt-1">Manage your leave requests and view balance</p>
          </div>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
            </svg>
            Apply Leave
          </button>
        </div>

        {balance && (
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {balanceCards.map((c) => (
              <div key={c.title} className="bg-white rounded-xl border border-gray-200 p-4">
                <p className="text-sm text-gray-500">{c.title}</p>
                <p className="text-2xl font-bold text-gray-900 mt-1">{c.value}</p>
                <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                  <div
                    className="bg-blue-500 h-1.5 rounded-full"
                    style={{ width: `${balance[c.title.toLowerCase().split(" ")[0]].used / balance[c.title.toLowerCase().split(" ")[0]].total * 100}%` }}
                  />
                </div>
                <p className="text-xs text-gray-400 mt-1">{balance[c.title.toLowerCase().split(" ")[0]].used} used</p>
              </div>
            ))}
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests</h2>
          <div className="space-y-4">
            {filtered.map((r) => (
              <div key={r.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-medium text-gray-900 capitalize">{r.type}</span>
                    <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium capitalize ${
                      r.status === "pending" ? "bg-yellow-100 text-yellow-800" : "bg-green-100 text-green-800"
                    }`}>{r.status}</span>
                  </div>
                  <div className="text-sm text-gray-500 mt-1">
                    {r.startDate} to {r.endDate} ({r.days} days)
                  </div>
                  <div className="text-xs text-gray-400 mt-1">Reason: {r.reason}</div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-gray-400">Applied on</div>
                  <div className="text-sm font-medium text-gray-700">{r.appliedOn}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Apply for Leave</h2>
                <button
                  onClick={() => { setShowModal(false); setFormError(null); }}
                  className="text-gray-400 hover:text-gray-600 text-xl leading-none"
                >
                  &times;
                </button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {formError && <div className="text-red-500 text-sm">{formError}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                  <select
                    value={form.type}
                    onChange={(e) => setForm({ ...form, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {leaveTypes.map((t) => (
                      <option key={t.value} value={t.value}>
                        {t.label}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                    <input
                      type="date"
                      value={form.startDate}
                      onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                    <input
                      type="date"
                      value={form.endDate}
                      onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                  <textarea
                    rows={3}
                    value={form.reason}
                    onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => { setShowModal(false); setFormError(null); }}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                  >
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
