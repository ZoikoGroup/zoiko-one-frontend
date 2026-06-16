import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Calendar, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getLeave, reviewLeaveRequest } from "../../../service/hrService";

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

const ITEMS_PER_PAGE = 8;

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

function StatCard({ title, value, icon: Icon, change, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-500 font-medium">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
        </div>
        {Icon && <div className="p-2 bg-teal-50 rounded-lg"><Icon className="w-5 h-5 text-teal-600" /></div>}
      </div>
    </div>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function LeaveRequests() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    let mounted = true;
    getLeave()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const total = records.length;
    const pending = records.filter((r) => r.status === "pending").length;
    const approved = records.filter((r) => r.status === "approved").length;
    const rejected = records.filter((r) => r.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [records]);

  const filtered = useMemo(() => {
    let result = records;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => (r.employee_name || "").toLowerCase().includes(q) || (r.department || "").toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((r) => r.status === statusFilter);
    if (deptFilter) result = result.filter((r) => r.department === deptFilter);
    return result;
  }, [records, search, statusFilter, deptFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleRowClick = (row) => {
    setSelectedRequest(row);
    setReviewStatus("");
    setReviewComments("");
    setShowReviewModal(true);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!reviewStatus || !selectedRequest) return;
    setSubmitting(true);
    setMessage(null);
    try {
      await reviewLeaveRequest(selectedRequest.id, { status: reviewStatus, comments: reviewComments });
      setMessage(`Request ${reviewStatus} successfully`);
      setShowReviewModal(false);
      setSelectedRequest(null);
      const data = await getLeave();
      setRecords(Array.isArray(data) ? data : []);
    } catch {
      setMessage("Failed to review request");
    } finally {
      setSubmitting(false);
    }
  };

  const statCards = [
    { title: "Total Requests", value: stats.total, icon: Calendar },
    { title: "Pending", value: stats.pending, icon: Clock },
    { title: "Approved", value: stats.approved, icon: CheckCircle },
    { title: "Rejected", value: stats.rejected, icon: XCircle },
  ];

  if (loading) {
    return (
      <HRPage title="Leave Requests" subtitle="Review and manage employee leave requests">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-500">Loading leave requests...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Leave Requests" subtitle="Review and manage employee leave requests">
      <SubNav />
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Review and manage employee leave requests</p>
        </div>

        {message && (
          <div className={`px-4 py-3 rounded-lg text-sm ${message.includes("success") || message.includes("approved") || message.includes("rejected") ? "bg-green-50 border border-green-200 text-green-700" : "bg-red-50 border border-red-200 text-red-700"}`}>
            {message}
          </div>
        )}

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {statCards.map((s) => <StatCard key={s.title} {...s} />)}
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by employee or department..." value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>
          <select value={deptFilter} onChange={(e) => { setDeptFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
            <option value="">All Departments</option>
            <option value="Engineering">Engineering</option>
            <option value="Marketing">Marketing</option>
            <option value="Sales">Sales</option>
            <option value="HR">HR</option>
            <option value="Finance">Finance</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">All Requests</h2>
          <div className="overflow-x-auto rounded-lg border border-gray-200">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Department</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Start</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">End</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Days</th>
                  <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-100">
                {paginated.map((row, i) => (
                  <tr key={row.id ?? i} className="hover:bg-teal-50/50 transition-colors cursor-pointer" onClick={() => handleRowClick(row)}>
                    <td className="px-4 py-3 text-sm font-medium text-gray-900">{row.employee_name || row.employee}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{row.department}</td>
                    <td className="px-4 py-3 text-sm capitalize text-gray-700">{row.leave_type || row.type}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(row.start_date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{formatDate(row.end_date)}</td>
                    <td className="px-4 py-3 text-sm text-gray-700">{row.days || "-"}</td>
                    <td className="px-4 py-3 text-sm"><StatusBadge status={row.status} /></td>
                  </tr>
                ))}
                {paginated.length === 0 && (
                  <tr>
                    <td colSpan={7} className="px-4 py-12 text-center text-gray-400 text-sm">No requests found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
          {totalPages > 1 && (
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <span className="text-sm text-gray-500">Page {safePage} of {totalPages}</span>
              <div className="flex gap-2">
                <button disabled={safePage <= 1} onClick={() => setCurrentPage(safePage - 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Previous</button>
                <button disabled={safePage >= totalPages} onClick={() => setCurrentPage(safePage + 1)}
                  className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
              </div>
            </div>
          )}
        </div>

        {showReviewModal && selectedRequest && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Review Leave Request</h2>
                <button onClick={() => setShowReviewModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div><p className="text-gray-500">Employee</p><p className="font-medium text-gray-900">{selectedRequest.employee_name || selectedRequest.employee}</p></div>
                  <div><p className="text-gray-500">Department</p><p className="font-medium text-gray-900">{selectedRequest.department}</p></div>
                  <div><p className="text-gray-500">Leave Type</p><p className="font-medium text-gray-900 capitalize">{selectedRequest.leave_type || selectedRequest.type}</p></div>
                  <div><p className="text-gray-500">Duration</p><p className="font-medium text-gray-900">{selectedRequest.days} days</p></div>
                  <div><p className="text-gray-500">Start Date</p><p className="font-medium text-gray-900">{formatDate(selectedRequest.start_date)}</p></div>
                  <div><p className="text-gray-500">End Date</p><p className="font-medium text-gray-900">{formatDate(selectedRequest.end_date)}</p></div>
                  <div className="col-span-2"><p className="text-gray-500">Status</p><StatusBadge status={selectedRequest.status} /></div>
                </div>
                <div><p className="text-sm text-gray-500 mb-1">Reason</p><p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{selectedRequest.reason || "-"}</p></div>
                {selectedRequest.comments && (
                  <div><p className="text-sm text-gray-500 mb-1">Previous Comments</p><p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">{selectedRequest.comments}</p></div>
                )}
                <form onSubmit={handleReview} className="space-y-4 pt-2 border-t border-gray-100">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Decision *</label>
                    <select value={reviewStatus} onChange={(e) => setReviewStatus(e.target.value)}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
                      <option value="">Select decision</option>
                      <option value="approved">Approve</option>
                      <option value="rejected">Reject</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                    <textarea rows={2} value={reviewComments} onChange={(e) => setReviewComments(e.target.value)}
                      placeholder="Add comments for the employee..."
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                  </div>
                  <div className="flex justify-end gap-3">
                    <button type="button" onClick={() => setShowReviewModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                    <button type="submit" disabled={submitting || !reviewStatus} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 disabled:bg-teal-400 text-white rounded-lg font-medium transition-colors">
                      {submitting ? "Processing..." : "Submit Review"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}
