import { useState, useMemo } from "react";
import { Calendar, Clock, CheckCircle, XCircle, Search } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useLeaveRequests } from "../hooks/useLeave";
import { reviewLeaveRequest } from "../services/leaveService";
import { formatDate } from "../utils/helpers";
import { LEAVE_STATUS } from "../types";

const statusOptions = Object.entries(LEAVE_STATUS).map(([k, v]) => ({ value: v, label: k.charAt(0) + k.slice(1).toLowerCase() }));
const deptOptions = [
  { value: "Engineering", label: "Engineering" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "HR", label: "HR" },
  { value: "Finance", label: "Finance" },
];

const ITEMS_PER_PAGE = 8;

export default function LeaveRequests() {
  const [filters, setFilters] = useState({});
  const [search, setSearch] = useState("");
  const { data, loading } = useLeaveRequests(filters);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [reviewStatus, setReviewStatus] = useState("");
  const [reviewComments, setReviewComments] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);

  const stats = useMemo(() => {
    const total = data.length;
    const pending = data.filter((r) => r.status === "pending").length;
    const approved = data.filter((r) => r.status === "approved").length;
    const rejected = data.filter((r) => r.status === "rejected").length;
    return { total, pending, approved, rejected };
  }, [data]);

  const filtered = useMemo(() => {
    let result = data;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.employee_name.toLowerCase().includes(q) || r.department.toLowerCase().includes(q));
    }
    return result;
  }, [data, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = filtered.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value || undefined }));
    setCurrentPage(1);
  };

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
      const res = await reviewLeaveRequest(selectedRequest.id, { status: reviewStatus, comments: reviewComments });
      setMessage(res.success ? `Request ${reviewStatus} successfully` : "Failed to review");
      setShowReviewModal(false);
      setSelectedRequest(null);
    } catch {
      setMessage("Failed to review request");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "employee_name", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department", render: (v) => <span className="text-gray-500">{v}</span> },
    { key: "leave_type", label: "Type", render: (v) => <span className="capitalize">{v}</span> },
    { key: "start_date", label: "Start", render: (v) => formatDate(v) },
    { key: "end_date", label: "End", render: (v) => formatDate(v) },
    { key: "days", label: "Days" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const statCards = [
    { title: "Total Requests", value: stats.total, icon: Calendar, change: null, trend: null },
    { title: "Pending", value: stats.pending, icon: Clock, change: null, trend: null },
    { title: "Approved", value: stats.approved, icon: CheckCircle, change: null, trend: null },
    { title: "Rejected", value: stats.rejected, icon: XCircle, change: null, trend: null },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading leave requests...</div>;

  return (
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
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          { key: "status", value: filters.status || "", placeholder: "All Statuses", options: statusOptions },
          { key: "department", value: filters.department || "", placeholder: "All Departments", options: deptOptions },
        ]}
        onFilterChange={handleFilterChange}
      />

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">All Requests</h2>
        <DataTable columns={columns} data={paginated} onRowClick={handleRowClick} />
        {totalPages > 1 && (
          <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
            <span className="text-sm text-gray-500">Page {safePage} of {totalPages}</span>
            <div className="flex gap-2">
              <button
                disabled={safePage <= 1}
                onClick={() => setCurrentPage(safePage - 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Previous
              </button>
              <button
                disabled={safePage >= totalPages}
                onClick={() => setCurrentPage(safePage + 1)}
                className="px-3 py-1.5 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
              >
                Next
              </button>
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
                <div>
                  <p className="text-gray-500">Employee</p>
                  <p className="font-medium text-gray-900">{selectedRequest.employee_name}</p>
                </div>
                <div>
                  <p className="text-gray-500">Department</p>
                  <p className="font-medium text-gray-900">{selectedRequest.department}</p>
                </div>
                <div>
                  <p className="text-gray-500">Leave Type</p>
                  <p className="font-medium text-gray-900 capitalize">{selectedRequest.leave_type}</p>
                </div>
                <div>
                  <p className="text-gray-500">Duration</p>
                  <p className="font-medium text-gray-900">{selectedRequest.days} days</p>
                </div>
                <div>
                  <p className="text-gray-500">Start Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedRequest.start_date)}</p>
                </div>
                <div>
                  <p className="text-gray-500">End Date</p>
                  <p className="font-medium text-gray-900">{formatDate(selectedRequest.end_date)}</p>
                </div>
                <div className="col-span-2">
                  <p className="text-gray-500">Status</p>
                  <StatusBadge status={selectedRequest.status} />
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-1">Reason</p>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded">{selectedRequest.reason || "-"}</p>
              </div>
              {selectedRequest.comments && (
                <div>
                  <p className="text-sm text-gray-500 mb-1">Previous Comments</p>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">{selectedRequest.comments}</p>
                </div>
              )}
              <form onSubmit={handleReview} className="space-y-4 pt-2 border-t border-gray-100">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Decision *</label>
                  <select
                    value={reviewStatus}
                    onChange={(e) => setReviewStatus(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  >
                    <option value="">Select decision</option>
                    <option value="approved">Approve</option>
                    <option value="rejected">Reject</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Comments</label>
                  <textarea
                    rows={2}
                    value={reviewComments}
                    onChange={(e) => setReviewComments(e.target.value)}
                    placeholder="Add comments for the employee..."
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                  />
                </div>
                {selectedRequest.reviewed_at && (
                  <div className="text-xs text-gray-400">Previously reviewed: {new Date(selectedRequest.reviewed_at).toLocaleString()}</div>
                )}
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
  );
}
