import { useState, useEffect, useMemo } from "react";
import { Search, CheckCircle, ArrowUpCircle } from "lucide-react";
import HRPage from "../../../components/HRPage";
import {
  getAttendanceExceptions, resolveAttendanceException, escalateAttendanceException,
} from "../../../service/hrService";



const STATUS_COLORS = {
  open: "bg-red-100 text-red-800",
  resolved: "bg-green-100 text-green-800",
  escalated: "bg-orange-100 text-orange-800",
  ignored: "bg-gray-100 text-gray-800",
};

const TYPE_OPTIONS = [
  "Missing Punch", "Duplicate Entry", "Invalid Shift", "Late Arrival", "Early Departure", "Violation",
];



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

export default function AttendanceExceptions() {
  const [exceptions, setExceptions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [dateRange, setDateRange] = useState({ from: "", to: "" });
  const [resolveModal, setResolveModal] = useState(null);
  const [resolutionNotes, setResolutionNotes] = useState("");
  const [escalateModal, setEscalateModal] = useState(null);
  const [escalatedTo, setEscalatedTo] = useState("");

  useEffect(() => {
    let mounted = true;
    const fetch = async () => {
      setLoading(true);
      setError(null);
      try {
        const data = await getAttendanceExceptions();
        if (mounted) setExceptions(Array.isArray(data) ? data : data?.items || []);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load exceptions");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetch();
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = exceptions;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        (r.employee_name || r.employee || "").toLowerCase().includes(q) ||
        (r.description || "").toLowerCase().includes(q)
      );
    }
    if (typeFilter) result = result.filter((r) => (r.exception_type || r.type) === typeFilter);
    if (statusFilter) result = result.filter((r) => (r.status || "open") === statusFilter);
    if (dateRange.from) result = result.filter((r) => (r.date || r.exception_date) >= dateRange.from);
    if (dateRange.to) result = result.filter((r) => (r.date || r.exception_date) <= dateRange.to);
    return result;
  }, [exceptions, search, typeFilter, statusFilter, dateRange]);

  const handleResolve = async () => {
    if (!resolveModal) return;
    try {
      await resolveAttendanceException(resolveModal.id, { resolution_notes: resolutionNotes });
      setResolveModal(null);
      setResolutionNotes("");
      const data = await getAttendanceExceptions();
      setExceptions(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || "Failed to resolve exception");
    }
  };

  const handleEscalate = async () => {
    if (!escalateModal) return;
    try {
      await escalateAttendanceException(escalateModal.id, { escalated_to: Number(escalatedTo) });
      setEscalateModal(null);
      setEscalatedTo("");
      const data = await getAttendanceExceptions();
      setExceptions(Array.isArray(data) ? data : data?.items || []);
    } catch (err) {
      setError(err.message || "Failed to escalate exception");
    }
  };

  if (loading) {
    return (
      <HRPage title="Attendance Exceptions" subtitle="Auto-detected attendance anomalies and violations">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading exceptions...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Attendance Exceptions" subtitle="Auto-detected attendance anomalies and violations">
            <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Exceptions</h1>
            <p className="text-sm text-gray-500 mt-1">Review and resolve auto-detected attendance issues</p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by employee or description..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <select value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Types</option>
            {TYPE_OPTIONS.map((v) => (<option key={v} value={v}>{v}</option>))}
          </select>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Statuses</option>
            <option value="open">Open</option>
            <option value="resolved">Resolved</option>
            <option value="escalated">Escalated</option>
            <option value="ignored">Ignored</option>
          </select>
          <input type="date" value={dateRange.from} onChange={(e) => setDateRange({ ...dateRange, from: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="From" />
          <input type="date" value={dateRange.to} onChange={(e) => setDateRange({ ...dateRange, to: e.target.value })}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" placeholder="To" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <p className="text-gray-500 font-medium">
              {exceptions.length === 0 ? "No attendance exceptions detected." : "No exceptions match your filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Employee</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-4 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((r) => {
                    const type = r.exception_type || r.type || "Missing Punch";
                    const status = r.status || "open";
                    return (
                      <tr key={r.id} className="hover:bg-indigo-50/50 transition-colors">
                        <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.employee_name || r.employee || `Employee #${r.employee_id}`}</td>
                        <td className="px-4 py-3">
                          <span className="inline-flex items-center bg-indigo-50 text-indigo-700 text-xs px-2 py-0.5 rounded-full font-medium">{type}</span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-500 max-w-[250px] truncate">{r.description || "-"}</td>
                        <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.date || r.exception_date)}</td>
                        <td className="px-4 py-3 text-sm"><StatusBadge status={status} /></td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            {status === "open" && (
                              <>
                                <button onClick={() => { setResolveModal(r); setResolutionNotes(""); }}
                                  className="p-1.5 text-gray-400 hover:text-green-600 transition-colors rounded hover:bg-green-50" title="Resolve">
                                  <CheckCircle className="w-4 h-4" />
                                </button>
                                <button onClick={() => { setEscalateModal(r); setEscalatedTo(""); }}
                                  className="p-1.5 text-gray-400 hover:text-orange-600 transition-colors rounded hover:bg-orange-50" title="Escalate">
                                  <ArrowUpCircle className="w-4 h-4" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {resolveModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Resolve Exception</h2>
                <button onClick={() => setResolveModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Resolving exception for <span className="font-semibold">{resolveModal.employee_name || `Employee #${resolveModal.employee_id}`}</span>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Notes</label>
                  <textarea rows={3} value={resolutionNotes} onChange={(e) => setResolutionNotes(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setResolveModal(null)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={handleResolve}
                    className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-colors">Resolve</button>
                </div>
              </div>
            </div>
          </div>
        )}

        {escalateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Escalate Exception</h2>
                <button onClick={() => setEscalateModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <div className="p-6 space-y-4">
                <p className="text-sm text-gray-600">
                  Escalating exception for <span className="font-semibold">{escalateModal.employee_name || `Employee #${escalateModal.employee_id}`}</span>
                </p>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Escalate to (Employee ID)</label>
                  <input type="number" value={escalatedTo} onChange={(e) => setEscalatedTo(e.target.value)}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button onClick={() => setEscalateModal(null)}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button onClick={handleEscalate}
                    className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">Escalate</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}

