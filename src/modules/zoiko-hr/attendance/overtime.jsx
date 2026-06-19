import { useState, useEffect, useMemo } from "react";
import { Plus, Search, Download, CheckCircle, XCircle } from "lucide-react";
import HRPage from "../../../components/HRPage";
import {
  getOvertimeRequests, createOvertimeRequest, approveOvertimeRequest, rejectOvertimeRequest,
  exportAttendanceCsv,
} from "../../../service/hrService";



const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};



function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {status}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

const initialForm = {
  employee_id: "", date: "", hours_requested: "", reason: "",
};

export default function Overtime() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [approveModal, setApproveModal] = useState(null);
  const [hoursApproved, setHoursApproved] = useState("");
  const [rejectModal, setRejectModal] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getOvertimeRequests();
        if (mounted) setRequests(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load overtime requests");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = requests;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        (r.employee_name || r.employee || "").toLowerCase().includes(q)
      );
    }
    if (statusFilter) result = result.filter((r) => r.status === statusFilter);
    if (dateRange.from) result = result.filter((r) => (r.date || r.work_date) >= dateRange.from);
    if (dateRange.to) result = result.filter((r) => (r.date || r.work_date) <= dateRange.to);
    return result;
  }, [requests, search, statusFilter, dateRange]);

  const validate = (d) => {
    const e = {};
    if (!d.employee_id) e.employee_id = "Employee is required";
    if (!d.date) e.date = "Date is required";
    if (!d.hours_requested || Number(d.hours_requested) <= 0) e.hours_requested = "Valid hours required";
    if (!d.reason?.trim()) e.reason = "Reason is required";
    return e;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await createOvertimeRequest({
        employee_id: Number(form.employee_id),
        date: form.date,
        hours_requested: Number(form.hours_requested),
        reason: form.reason.trim(),
      });
      setShowModal(false);
      setForm({ ...initialForm });
      const data = await getOvertimeRequests();
      setRequests(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create request" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApprove = async () => {
    if (!approveModal) return;
    try {
      await approveOvertimeRequest(approveModal.id, { hours_approved: Number(hoursApproved) });
      setApproveModal(null);
      setHoursApproved("");
      const data = await getOvertimeRequests();
      setRequests(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || "Failed to approve request");
    }
  };

  const handleReject = async () => {
    if (!rejectModal) return;
    try {
      await rejectOvertimeRequest(rejectModal.id, { rejection_reason: rejectionReason });
      setRejectModal(null);
      setRejectionReason("");
      const data = await getOvertimeRequests();
      setRequests(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || "Failed to reject request");
    }
  };

  if (loading) {
    return (
      <HRPage title="Overtime Management" subtitle="Manage overtime requests and approvals">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading overtime requests...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Overtime Management" subtitle="Manage overtime requests and approvals">
            <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Overtime Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Submit and manage overtime work requests</p>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={async () => { try { await exportAttendanceCsv({ type: "overtime" }); } catch (err) { setError(err.message); } }}
              className="flex items-center gap-1 px-3 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 text-sm font-medium transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => setShowModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Request Overtime
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by employee..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
          <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="From" />
          <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="To" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">
              {requests.length === 0 ? "No overtime requests yet." : "No requests match your filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours Requested</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Hours Approved</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((r) => (
                    <tr key={r.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.employee_name || r.employee || `Employee #${r.employee_id}`}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.date || r.work_date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.hours_requested}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.hours_approved != null ? r.hours_approved : "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate">{r.reason || "-"}</td>
                      <td className="px-4 py-3 text-sm"><StatusBadge status={r.status || "pending"} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {(r.status === "pending") && (
                            <>
                              <button onClick={() => { setApproveModal(r); setHoursApproved(r.hours_requested?.toString() || ""); }}
                                className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded hover:bg-green-50" title="Approve">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => { setRejectModal(r); setRejectionReason(""); }}
                                className="p-1.5 text-gray-400 hover:text-red-600 transition-colors rounded hover:bg-red-50" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Request Overtime</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {formErrors.submit && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{formErrors.submit}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                    className={`w-full border ${formErrors.employee_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                  {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                    <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                      className={`w-full border ${formErrors.date ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Hours Requested *</label>
                    <input type="number" step="0.5" value={form.hours_requested} onChange={(e) => setForm({ ...form, hours_requested: e.target.value })}
                      className={`w-full border ${formErrors.hours_requested ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.hours_requested && <p className="text-red-500 text-xs mt-1">{formErrors.hours_requested}</p>}
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className={`w-full border ${formErrors.reason ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                  {formErrors.reason && <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors">
                    {submitting ? "Submitting..." : "Submit Request"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {approveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Approve Overtime</h2>
                <button onClick={() => setApproveModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Approving overtime for <span className="font-semibold">{approveModal.employee_name || `Employee #${approveModal.employee_id}`}</span>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Hours to Approve</label>
                  <input type="number" step="0.5" value={hoursApproved} onChange={(e) => setHoursApproved(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setApproveModal(null)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={handleApprove}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">Approve</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {rejectModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Reject Overtime</h2>
                <button onClick={() => setRejectModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Rejecting overtime for <span className="font-semibold">{rejectModal.employee_name || `Employee #${rejectModal.employee_id}`}</span>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Rejection Reason</label>
                  <textarea rows={3} value={rejectionReason} onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setRejectModal(null)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={handleReject}
                    className="px-4 py-2 text-sm bg-red-600 hover:bg-red-700 text-white rounded-lg font-medium transition-colors">Reject</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}

