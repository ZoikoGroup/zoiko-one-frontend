import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getLeave,
  createLeaveRequest,
  reviewLeaveRequest,
  getMyLeave,
} from "../../../service/hrService";

const statusConfig = {
  pending: {
    label: "Pending",
    color: "bg-amber-100 text-amber-800",
    icon: "⏳",
  },
  approved: {
    label: "Approved",
    color: "bg-green-100 text-green-800",
    icon: "✓",
  },
  rejected: {
    label: "Rejected",
    color: "bg-red-100 text-red-800",
    icon: "✗",
  },
  cancelled: {
    label: "Cancelled",
    color: "bg-gray-100 text-gray-800",
    icon: "🚫",
  },
};

const LEAVE_TYPES = [
  { value: "annual", label: "Annual Leave" },
  { value: "sick", label: "Sick Leave" },
  { value: "maternity", label: "Maternity Leave" },
  { value: "paternity", label: "Paternity Leave" },
  { value: "casual", label: "Casual Leave" },
  { value: "earned", label: "Earned Leave" },
  { value: "unpaid", label: "Unpaid Leave" },
  { value: "study", label: "Study Leave" },
  { value: "emergency", label: "Emergency Leave" },
];

const ITEMS_PER_PAGE = 10;

const initialRequestForm = {
  leave_type: "annual",
  start_date: "",
  end_date: "",
  reason: "",
};

export default function ZoikoHRLeave() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [myLeaveRequests, setMyLeaveRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [employeeFilter, setEmployeeFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [editingRequest, setEditingRequest] = useState(null);
  const [reviewForm, setReviewForm] = useState({
    status: "",
    comments: "",
  });
  const [submitting, setSubmitting] = useState(false);

  const [requestForm, setRequestForm] = useState({ ...initialRequestForm });

  const fetchLeaveRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getLeave();
      setLeaveRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load leave requests");
      setLeaveRequests([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMyLeaveRequests = async () => {
    try {
      const data = await getMyLeave();
      setMyLeaveRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Failed to load my leave requests:", err);
    }
  };

  useEffect(() => {
    fetchLeaveRequests();
    fetchMyLeaveRequests();
  }, []);

  const stats = useMemo(() => {
    const total = leaveRequests.length;
    const pending = leaveRequests.filter((r) => r.status === "pending").length;
    const approved = leaveRequests.filter((r) => r.status === "approved").length;
    const rejected = leaveRequests.filter((r) => r.status === "rejected").length;
    const cancelled = leaveRequests.filter((r) => r.status === "cancelled").length;
    const totalDays = leaveRequests.reduce((sum, r) => sum + (r.days || 0), 0);

    return {
      total,
      pending,
      approved,
      rejected,
      cancelled,
      totalDays,
    };
  }, [leaveRequests]);

  const filteredRequests = useMemo(() => {
    let result = leaveRequests;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.employee_name?.toLowerCase().includes(q) ||
          r.leave_type?.toLowerCase().includes(q) ||
          r.reason?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((r) => r.status === statusFilter);
    }
    if (employeeFilter) {
      result = result.filter((r) => r.employee_id === parseInt(employeeFilter));
    }
    return result;
  }, [leaveRequests, search, statusFilter, employeeFilter]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginatedRequests = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filteredRequests.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredRequests, safePage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const resetRequestForm = () => setRequestForm({ ...initialRequestForm });

  const validateRequestForm = (data) => {
    const errors = {};
    if (!data.leave_type?.trim()) errors.leave_type = "Leave type is required";
    if (!data.start_date?.trim()) errors.start_date = "Start date is required";
    if (!data.end_date?.trim()) errors.end_date = "End date is required";
    if (data.start_date && data.end_date) {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      if (end < start) errors.end_date = "End date must be after start date";
      const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24)) + 1;
      if (days > 30) errors.end_date = "Maximum 30 days leave allowed";
    }
    return errors;
  };

  const handleSubmitRequest = async (e) => {
    e.preventDefault();
    const errors = validateRequestForm(requestForm);
    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        leave_type: requestForm.leave_type,
        start_date: requestForm.start_date,
        end_date: requestForm.end_date,
        reason: requestForm.reason || null,
      };
      await createLeaveRequest(payload);
      setShowRequestModal(false);
      resetRequestForm();
      await fetchLeaveRequests();
      await fetchMyLeaveRequests();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to submit leave request" });
    } finally {
      setSubmitting(false);
    }
  };

  const openReviewModal = (request) => {
    setEditingRequest(request);
    setReviewForm({
      status: "",
      comments: "",
    });
    setShowReviewModal(true);
  };

  const handleReview = async (e) => {
    e.preventDefault();
    if (!editingRequest) return;
    if (!reviewForm.status) {
      setFormErrors({ status: "Status is required" });
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        status: reviewForm.status,
        comments: reviewForm.comments || null,
      };
      await reviewLeaveRequest(editingRequest.id, payload);
      setShowReviewModal(false);
      setEditingRequest(null);
      await fetchLeaveRequests();
      await fetchMyLeaveRequests();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to review leave request" });
    } finally {
      setSubmitting(false);
    }
  };

  const getDaysCount = (start, end) => {
    if (!start || !end) return 0;
    const startDate = new Date(start);
    const endDate = new Date(end);
    return Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) + 1;
  };

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "requests": return <RequestsSection />;
      case "balances": return <BalancesSection />;
      default: return <Dashboard />;
    }
  };

  if (loading && leaveRequests.length === 0) {
    return (
      <HRPage title="Leave Management" subtitle="Track balances, approve configurations, and handle time-off requests.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading leave data...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Leave Management" subtitle="Track balances, approve configurations, and handle time-off requests.">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Requests: </span>
              <span className="font-bold text-gray-800">{stats.total}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-amber-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Pending: </span>
              <span className="font-bold text-amber-600">{stats.pending}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-green-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Approved: </span>
              <span className="font-bold text-green-600">{stats.approved}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-red-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Rejected: </span>
              <span className="font-bold text-red-600">{stats.rejected}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Days: </span>
              <span className="font-bold text-blue-600">{stats.totalDays}</span>
            </div>
          </div>
          <button
            onClick={() => { resetRequestForm(); setShowRequestModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Submit Leave Request
          </button>
        </div>

        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {[
            { key: "dashboard", label: "Dashboard" },
            { key: "requests", label: "Requests" },
            { key: "balances", label: "Balances" },
          ].map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-colors ${
                activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {renderTab()}
      </div>

      {showRequestModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Submit Leave Request</h2>
              <button onClick={() => { setShowRequestModal(false); resetRequestForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmitRequest} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Type *</label>
                <select
                  value={requestForm.leave_type}
                  onChange={(e) => setRequestForm({ ...requestForm, leave_type: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {LEAVE_TYPES.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                  <input
                    type="date"
                    value={requestForm.start_date}
                    onChange={(e) => setRequestForm({ ...requestForm, start_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                  <input
                    type="date"
                    value={requestForm.end_date}
                    onChange={(e) => setRequestForm({ ...requestForm, end_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              {requestForm.start_date && requestForm.end_date && (
                <div className="bg-blue-50 px-3 py-2 rounded-lg text-sm text-blue-700">
                  Duration: {getDaysCount(requestForm.start_date, requestForm.end_date)} days
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  rows={3}
                  value={requestForm.reason}
                  onChange={(e) => setRequestForm({ ...requestForm, reason: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Please provide reason for leave request..."
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowRequestModal(false); resetRequestForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Submitting..." : "Submit Request"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showReviewModal && editingRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Review Leave Request</h2>
              <button onClick={() => { setShowReviewModal(false); setEditingRequest(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleReview} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Request by: <span className="font-medium text-gray-800">{editingRequest.employee_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                  <p className="text-sm text-gray-900 capitalize">{editingRequest.leave_type}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration</label>
                  <p className="text-sm text-gray-900">{editingRequest.days} days</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Dates</label>
                  <p className="text-sm text-gray-900">{editingRequest.start_date} to {editingRequest.end_date}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${statusConfig[editingRequest.status]?.color || "bg-gray-100 text-gray-800"}`}>
                    {statusConfig[editingRequest.status]?.label || editingRequest.status}
                  </span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <p className="text-sm text-gray-700 bg-gray-50 p-2 rounded"> {editingRequest.reason || "-"}</p>
              </div>
              {editingRequest.comments && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Previous Comments</label>
                  <p className="text-sm text-gray-700 bg-yellow-50 p-2 rounded"> {editingRequest.comments}</p>
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Review Status *</label>
                <select
                  value={reviewForm.status}
                  onChange={(e) => setReviewForm({ ...reviewForm, status: e.target.value })}
                  className={`w-full border ${formErrors.status ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select status</option>
                  <option value="approved">Approve</option>
                  <option value="rejected">Reject</option>
                  <option value="cancelled">Cancel</option>
                </select>
                {formErrors.status && <p className="text-red-500 text-xs mt-1">{formErrors.status}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comments (optional)</label>
                <textarea
                  rows={2}
                  value={reviewForm.comments}
                  onChange={(e) => setReviewForm({ ...reviewForm, comments: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Add comments for the employee..."
                />
              </div>
              {editingRequest.reviewed_at && (
                <div className="text-xs text-gray-400">Reviewed: {new Date(editingRequest.reviewed_at).toLocaleString()}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowReviewModal(false); setEditingRequest(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Processing..." : "Submit Review"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
