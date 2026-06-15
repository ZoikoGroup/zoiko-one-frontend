import { useState } from "react";
import { Plus, CheckCircle, XCircle } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useCorrections } from "../hooks/useAttendance";
import { createCorrection, approveCorrection, rejectCorrection } from "../services/attendanceService";
import { formatDate } from "../utils/helpers";

export default function AttendanceCorrections() {
  const { data, loading } = useCorrections();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employee: "", date: "", type: "missed_clock_in", reason: "" });

  const filtered = data.filter((r) => {
    if (search && !r.employee.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    return true;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    await createCorrection({ ...form, requestedOn: new Date().toISOString().split("T")[0], status: "pending" });
    setShowModal(false);
    setForm({ employee: "", date: "", type: "missed_clock_in", reason: "" });
  };

  const handleApprove = async (id) => {
    await approveCorrection(id);
  };

  const handleReject = async (id) => {
    await rejectCorrection(id);
  };

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "type", label: "Type", render: (v) => <span className="capitalize">{v.replace(/_/g, " ")}</span> },
    { key: "reason", label: "Reason", render: (v) => <span className="text-gray-500 max-w-[200px] truncate block">{v}</span> },
    { key: "requestedOn", label: "Requested", render: (v) => formatDate(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "id", label: "Actions", render: (v, row) => (
      <div className="flex gap-2">
        {row.status === "pending" && (
          <>
            <button onClick={() => handleApprove(v)} className="text-green-600 hover:text-green-800" title="Approve">
              <CheckCircle className="w-4 h-4" />
            </button>
            <button onClick={() => handleReject(v)} className="text-red-600 hover:text-red-800" title="Reject">
              <XCircle className="w-4 h-4" />
            </button>
          </>
        )}
      </div>
    )},
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading corrections...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Corrections</h1>
          <p className="text-sm text-gray-500 mt-1">Manage attendance correction requests</p>
        </div>
        <button onClick={() => setShowModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[{
          key: "status", placeholder: "All Statuses", value: statusFilter,
          options: [
            { value: "pending", label: "Pending" },
            { value: "approved", label: "Approved" },
            { value: "rejected", label: "Rejected" },
          ],
        }]}
        onFilterChange={(k, v) => setStatusFilter(v)}
      />

      <DataTable columns={columns} data={filtered} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">New Correction Request</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input type="text" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Correction Type</label>
                <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                  <option value="missed_clock_in">Missed Clock In</option>
                  <option value="missed_clock_out">Missed Clock Out</option>
                  <option value="incorrect_time">Incorrect Time</option>
                  <option value="wrong_status">Wrong Status</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
