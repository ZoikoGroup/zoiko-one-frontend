import { useState } from "react";
import { CalendarDays, Plus, X } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useLeaveBalance, useLeaveRequests } from "../hooks/useEss";
import { createLeaveRequest } from "../services/essService";
import { formatDate } from "../utils/helpers";

export default function EssLeaveManagement() {
  const { data: balance, loading: bLoad } = useLeaveBalance();
  const { data: requests, loading: rLoad } = useLeaveRequests();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ type: "annual", startDate: "", endDate: "", reason: "" });
  const [formError, setFormError] = useState(null);

  if (bLoad || rLoad) return <div className="p-6 text-gray-400">Loading leave data...</div>;

  const balanceCards = balance ? [
    { title: "Annual Leave", value: `${balance.annual.remaining}/${balance.annual.total}`, icon: CalendarDays, change: null, trend: null },
    { title: "Sick Leave", value: `${balance.sick.remaining}/${balance.sick.total}`, icon: CalendarDays, change: null, trend: null },
    { title: "Personal Leave", value: `${balance.personal.remaining}/${balance.personal.total}`, icon: CalendarDays, change: null, trend: null },
    { title: "Unpaid Leave", value: `${balance.unpaid.remaining}/${balance.unpaid.total}`, icon: CalendarDays, change: null, trend: null },
  ] : [];

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
      await createLeaveRequest(form);
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
    { key: "startDate", label: "Start Date", render: (v) => formatDate(v) },
    { key: "endDate", label: "End Date", render: (v) => formatDate(v) },
    { key: "days", label: "Days", render: (v) => <span className="font-semibold">{v}</span> },
    { key: "reason", label: "Reason", render: (v) => <span className="text-gray-500 truncate max-w-[200px] block">{v}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "appliedOn", label: "Applied", render: (v) => <span className="text-gray-400 text-xs">{formatDate(v)}</span> },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Management</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your leave requests and view balance</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Apply Leave
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

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          { key: "status", placeholder: "All Statuses", value: statusFilter, options: [
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
            { value: "completed", label: "Completed" },
          ]},
          { key: "type", placeholder: "All Types", value: typeFilter, options: leaveTypes },
        ]}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Leave Requests</h2>
        <DataTable columns={columns} data={filtered} />
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Apply for Leave</h2>
              <button onClick={() => { setShowModal(false); setFormError(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              {formError && <div className="text-red-500 text-sm">{formError}</div>}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                  {leaveTypes.map((t) => <option key={t.value} value={t.value}>{t.label}</option>)}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input type="date" value={form.startDate} onChange={(e) => setForm({ ...form, startDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input type="date" value={form.endDate} onChange={(e) => setForm({ ...form, endDate: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setFormError(null); }}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
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
