import { useState, useEffect, useMemo } from "react";
import { Plus, Search, CheckCircle, XCircle, Ban } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getRegularizations, createRegularization, approveRegularizationManager, approveRegularizationHR, rejectRegularization, cancelRegularization } from "../../../service/hrService";



const ITEMS_PER_PAGE = 15;

const STATUS_COLORS = {
  pending: "bg-yellow-100 text-yellow-800",
  manager_approved: "bg-blue-100 text-blue-800",
  approved: "bg-green-100 text-green-800",
  rejected: "bg-red-100 text-red-800",
  cancelled: "bg-gray-100 text-gray-800",
};

const CORRECTION_TYPES = [
  "missed_clock_in", "missed_clock_out", "incorrect_time", "wrong_status", "early_departure", "late_arrival",
];

const initialForm = {
  employee_id: "", date: "", correction_type: "missed_clock_in", reason: "",
};



function StatusBadge({ status }) {
  const colorClass = STATUS_COLORS[status] || "bg-gray-100 text-gray-800";
  return (
    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize">
      {status.replace(/_/g, " ")}
    </span>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export default function Regularization() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async (params = {}) => {
    setLoading(true);
    setError(null);
    try {
      const data = await getRegularizations(params);
      setRequests(data?.items || (Array.isArray(data) ? data : []));
    } catch (err) {
      setError(err.message || "Failed to load regularization requests");
      setRequests([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    let result = requests;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        (r.employee_name || r.employee || "").toLowerCase().includes(q)
      );
    }
    if (statusFilter) result = result.filter((r) => r.status === statusFilter);
    return result;
  }, [requests, search, statusFilter]);

  const paginated = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  const validate = (d) => {
    const e = {};
    if (!d.employee_id) e.employee_id = "Employee is required";
    if (!d.date) e.date = "Date is required";
    if (!d.reason.trim()) e.reason = "Reason is required";
    return e;
  };

  const handleCreate = async (ev) => {
    ev.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await createRegularization({
        employee_id: Number(form.employee_id),
        date: form.date,
        correction_type: form.correction_type,
        reason: form.reason.trim(),
      });
      setShowModal(false);
      setForm({ ...initialForm });
      setFormErrors({});
      await fetchData();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create request" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleApproveManager = async (id) => {
    try {
      await approveRegularizationManager(id, { approved_at: new Date().toISOString() });
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to approve");
    }
  };

  const handleApproveHR = async (id) => {
    try {
      await approveRegularizationHR(id, { approved_at: new Date().toISOString() });
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to approve");
    }
  };

  const handleReject = async (id) => {
    if (!window.confirm("Are you sure you want to reject this request?")) return;
    try {
      await rejectRegularization(id, { rejected_at: new Date().toISOString() });
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to reject");
    }
  };

  const handleCancel = async (id) => {
    try {
      await cancelRegularization(id);
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to cancel");
    }
  };

  if (loading && requests.length === 0) {
    return (
      <HRPage title="Regularization" subtitle="Manage attendance regularization requests">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-500">Loading requests...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Regularization" subtitle="Manage attendance regularization requests">
            <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Regularization Requests</h1>
            <p className="text-sm text-gray-500 mt-1">Manage attendance regularization/correction requests</p>
          </div>
          <button onClick={() => { setForm({ ...initialForm, date: new Date().toISOString().split("T")[0] }); setFormErrors({}); setShowModal(true); }}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> New Request
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by employee..." value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Statuses</option>
            <option value="pending">Pending</option>
            <option value="manager_approved">Manager Approved</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">
              {requests.length === 0 ? "No regularization requests yet. Create your first request." : "No requests match your filters."}
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
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {paginated.map((r) => (
                    <tr key={r.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.employee_name || r.employee || "Employee #" + r.id}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700 capitalize">{(r.correction_type || r.type || "").replace(/_/g, " ")}</td>
                      <td className="px-4 py-3 text-sm text-gray-500 max-w-[200px] truncate" title={r.reason}>{r.reason}</td>
                      <td className="px-4 py-3"><StatusBadge status={r.status} /></td>
                      <td className="px-4 py-3 text-right">
                        <div className="flex items-center justify-end gap-1">
                          {r.status === "pending" && (
                            <>
                              <button onClick={() => handleApproveManager(r.id)} className="p-1.5 text-blue-500 hover:text-blue-700 transition-colors rounded hover:bg-blue-50" title="Approve (Manager)">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(r.id)} className="p-1.5 text-red-500 hover:text-red-700 transition-colors rounded hover:bg-red-50" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleCancel(r.id)} className="p-1.5 text-gray-400 hover:text-gray-600 transition-colors rounded hover:bg-gray-50" title="Cancel">
                                <Ban className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {(r.status === "manager_approved") && (
                            <>
                              <button onClick={() => handleApproveHR(r.id)} className="p-1.5 text-green-500 hover:text-green-700 transition-colors rounded hover:bg-green-50" title="Approve (HR)">
                                <CheckCircle className="w-4 h-4" />
                              </button>
                              <button onClick={() => handleReject(r.id)} className="p-1.5 text-red-500 hover:text-red-700 transition-colors rounded hover:bg-red-50" title="Reject">
                                <XCircle className="w-4 h-4" />
                              </button>
                            </>
                          )}
                          {r.status === "approved" && (
                            <span className="text-xs text-gray-400 italic">Approved</span>
                          )}
                          {r.status === "rejected" && (
                            <span className="text-xs text-gray-400 italic">Rejected</span>
                          )}
                          {r.status === "cancelled" && (
                            <span className="text-xs text-gray-400 italic">Cancelled</span>
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

        {filtered.length > ITEMS_PER_PAGE && (
          <div className="flex justify-between items-center">
            <span className="text-xs text-gray-400">
              Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(currentPage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
              {Array.from({ length: Math.ceil(filtered.length / ITEMS_PER_PAGE) }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setCurrentPage(p)}
                  className={"px-3 py-1 text-sm border rounded-lg " + (p === currentPage ? "bg-indigo-600 text-white border-indigo-600" : "border-gray-200 hover:bg-gray-50")}>{p}</button>
              ))}
              <button onClick={() => setCurrentPage((p) => Math.min(Math.ceil(filtered.length / ITEMS_PER_PAGE), p + 1))}
                disabled={currentPage >= Math.ceil(filtered.length / ITEMS_PER_PAGE)}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
            </div>
          </div>
        )}

        {showModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">New Regularization Request</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                {formErrors.submit && <div className="text-red-500 text-sm bg-red-50 p-2 rounded">{formErrors.submit}</div>}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Enter employee ID" />
                  {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={form.date} onChange={(e) => setForm({ ...form, date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Correction Type</label>
                  <select value={form.correction_type} onChange={(e) => setForm({ ...form, correction_type: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500">
                    {CORRECTION_TYPES.map((t) => (<option key={t} value={t}>{t.replace(/_/g, " ")}</option>))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                  <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" placeholder="Explain the reason for correction..." />
                  {formErrors.reason && <p className="text-red-500 text-xs mt-1">{formErrors.reason}</p>}
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors">
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

