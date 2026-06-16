import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Plus, CheckCircle, XCircle, Search } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getAttendance, createAttendance } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/attendance" },
  { label: "Daily Records", href: "/zoiko-hr/attendance/daily" },
  { label: "My Attendance", href: "/zoiko-hr/attendance/my-attendance" },
  { label: "Corrections", href: "/zoiko-hr/attendance/corrections" },
  { label: "Schedule", href: "/zoiko-hr/attendance/schedule" },
  { label: "Reports", href: "/zoiko-hr/attendance/reports" },
  { label: "Settings", href: "/zoiko-hr/attendance/settings" },
];

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
};

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/attendance"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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

export default function AttendanceCorrections() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ employee: "", date: "", type: "missed_clock_in", reason: "" });

  useEffect(() => {
    let mounted = true;
    getAttendance()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const correctionRequests = useMemo(() => {
    return records
      .filter((r) => r.correction_requested || r.status === "pending_correction")
      .map((r, i) => ({
        id: r.id || i,
        employee: r.employee_name || r.employee || `Employee #${r.employee_id}`,
        date: r.work_date || r.date,
        type: r.correction_type || "missed_clock_in",
        reason: r.correction_reason || r.notes || "Correction requested",
        requestedOn: r.correction_date || r.work_date || r.date,
        status: r.correction_status || "pending",
      }));
  }, [records]);

  const filtered = correctionRequests.filter((r) => {
    if (search && !r.employee.toLowerCase().includes(search.toLowerCase())) return false;
    if (statusFilter && r.status !== statusFilter) return false;
    return true;
  });

  const handleCreate = async (e) => {
    e.preventDefault();
    await createAttendance({
      employee_name: form.employee,
      work_date: form.date,
      correction_type: form.type,
      correction_reason: form.reason,
      correction_requested: true,
      correction_status: "pending",
      status: "pending_correction",
    });
    setShowModal(false);
    setForm({ employee: "", date: "", type: "missed_clock_in", reason: "" });
    const data = await getAttendance();
    setRecords(Array.isArray(data) ? data : []);
  };

  const handleApprove = async (id) => {
    await createAttendance({ id, correction_status: "approved", status: "present" });
    const data = await getAttendance();
    setRecords(Array.isArray(data) ? data : []);
  };

  const handleReject = async (id) => {
    await createAttendance({ id, correction_status: "rejected" });
    const data = await getAttendance();
    setRecords(Array.isArray(data) ? data : []);
  };

  if (loading) {
    return (
      <HRPage title="Attendance Corrections" subtitle="Manage attendance correction requests">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading corrections...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Attendance Corrections" subtitle="Manage attendance correction requests">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Corrections</h1>
            <p className="text-sm text-gray-500 mt-1">Manage attendance correction requests</p>
          </div>
          <button onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" /> New Request
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3 mb-4">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="overflow-x-auto rounded-lg border border-gray-200">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Requested</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filtered.map((r) => (
                <tr key={r.id} className="hover:bg-indigo-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.employee}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.date)}</td>
                  <td className="px-4 py-3 text-sm text-gray-700 capitalize">{r.type.replace(/_/g, " ")}</td>
                  <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{r.reason}</td>
                  <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.requestedOn)}</td>
                  <td className="px-4 py-3 text-sm"><StatusBadge status={r.status} /></td>
                  <td className="px-4 py-3 text-sm">
                    <div className="flex gap-2">
                      {r.status === "pending" && (
                        <>
                          <button onClick={() => handleApprove(r.id)} className="text-green-600 hover:text-green-800" title="Approve">
                            <CheckCircle className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleReject(r.id)} className="text-red-600 hover:text-red-800" title="Reject">
                            <XCircle className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No correction requests found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

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
    </HRPage>
  );
}
