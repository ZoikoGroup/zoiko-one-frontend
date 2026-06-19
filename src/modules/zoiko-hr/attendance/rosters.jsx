import { useState, useEffect, useMemo } from "react";
import { Plus, Trash2, Search, X, Calendar, Users } from "lucide-react";
import HRPage from "../../../components/HRPage";
import {
  getShifts,
  getRosters,
  createRoster,
  bulkCreateRosters,
  deleteRoster,
} from "../../../service/hrService";





function formatDate(dateStr) {
  if (!dateStr) return "-";
  try {
    return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
  } catch {
    return dateStr;
  }
}

export default function AttendanceRosters() {
  const [rosters, setRosters] = useState([]);
  const [shifts, setShifts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [viewMode, setViewMode] = useState("daily");
  const [search, setSearch] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [shiftFilter, setShiftFilter] = useState("");
  const [dateRangeStart, setDateRangeStart] = useState("");
  const [dateRangeEnd, setDateRangeEnd] = useState("");

  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showBulkModal, setShowBulkModal] = useState(false);

  const [assignForm, setAssignForm] = useState({ employee_id: "", shift_id: "", date: "" });
  const [bulkForm, setBulkForm] = useState({ employee_ids: "", shift_id: "", start_date: "", end_date: "" });
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const fetchAll = async () => {
    try {
      const [rostersRes, shiftsRes] = await Promise.all([
        getRosters(),
        getShifts(),
      ]);
      setRosters(Array.isArray(rostersRes) ? rostersRes : rostersRes?.data || []);
      setShifts(Array.isArray(shiftsRes) ? shiftsRes : shiftsRes?.data || []);
    } catch {
      // partial failures ok
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    Promise.all([
      getRosters(),
      getShifts(),
    ])
      .then(([rostersRes, shiftsRes]) => {
        if (!mounted) return;
        setRosters(Array.isArray(rostersRes) ? rostersRes : rostersRes?.data || []);
        setShifts(Array.isArray(shiftsRes) ? shiftsRes : shiftsRes?.data || []);
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = rosters;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        (r.employee_name || r.employee || "").toLowerCase().includes(q) ||
        (r.shift_name || r.shift || "").toLowerCase().includes(q)
      );
    }
    if (deptFilter) result = result.filter((r) => (r.department || "").toLowerCase() === deptFilter.toLowerCase());
    if (shiftFilter) result = result.filter((r) => (r.shift_id || r.shift) === parseInt(shiftFilter) || (r.shift_name || r.shift) === shiftFilter);
    if (dateRangeStart) result = result.filter((r) => r.date && r.date >= dateRangeStart);
    if (dateRangeEnd) result = result.filter((r) => r.date && r.date <= dateRangeEnd);
    return result;
  }, [rosters, search, deptFilter, shiftFilter, dateRangeStart, dateRangeEnd]);

  const shiftOptions = useMemo(() => {
    return shifts.filter((s) => s.is_active !== false);
  }, [shifts]);

  const resetAssignForm = () => {
    setAssignForm({ employee_id: "", shift_id: "", date: "" });
    setFormErrors({});
  };

  const resetBulkForm = () => {
    setBulkForm({ employee_ids: "", shift_id: "", start_date: "", end_date: "" });
    setFormErrors({});
  };

  const openAssignModal = () => {
    resetAssignForm();
    setShowAssignModal(true);
  };

  const openBulkModal = () => {
    resetBulkForm();
    setShowBulkModal(true);
  };

  const validateAssign = (data) => {
    const errors = {};
    if (!data.employee_id?.toString().trim()) errors.employee_id = "Employee ID is required";
    if (!data.shift_id) errors.shift_id = "Shift is required";
    if (!data.date) errors.date = "Date is required";
    return errors;
  };

  const validateBulk = (data) => {
    const errors = {};
    if (!data.employee_ids?.trim()) errors.employee_ids = "At least one employee ID is required";
    if (!data.shift_id) errors.shift_id = "Shift is required";
    if (!data.start_date) errors.start_date = "Start date is required";
    if (!data.end_date) errors.end_date = "End date is required";
    if (data.start_date && data.end_date && data.start_date > data.end_date) {
      errors.end_date = "End date must be after start date";
    }
    return errors;
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    const errors = validateAssign(assignForm);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await createRoster({
        employee_id: parseInt(assignForm.employee_id),
        shift_id: parseInt(assignForm.shift_id),
        date: assignForm.date,
      });
      setShowAssignModal(false);
      resetAssignForm();
      await fetchAll();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to assign shift" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleBulkAssign = async (e) => {
    e.preventDefault();
    const errors = validateBulk(bulkForm);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      const employeeIds = bulkForm.employee_ids
        .split(",")
        .map((id) => parseInt(id.trim()))
        .filter((id) => !isNaN(id));
      await bulkCreateRosters({
        employee_ids: employeeIds,
        shift_id: parseInt(bulkForm.shift_id),
        start_date: bulkForm.start_date,
        end_date: bulkForm.end_date,
      });
      setShowBulkModal(false);
      resetBulkForm();
      await fetchAll();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to bulk assign" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this roster assignment?")) return;
    try {
      await deleteRoster(id);
      await fetchAll();
    } catch (err) {
      setError(err.message || "Failed to delete roster");
    }
  };

  if (loading) {
    return (
      <HRPage title="Attendance" subtitle="Manage shift rosters">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-500">Loading rosters...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Attendance" subtitle="Manage shift rosters">
      <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Shift Rosters</h1>
            <p className="text-sm text-gray-500 mt-1">Assign shifts to employees</p>
          </div>
          <div className="flex gap-2">
            <button onClick={openBulkModal}
              className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
              <Users className="w-4 h-4" /> Bulk Assign
            </button>
            <button onClick={openAssignModal}
              className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
              <Plus className="w-4 h-4" /> Assign Shift
            </button>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by employee or shift..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
          <select value={deptFilter} onChange={(e) => setDeptFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Departments</option>
            {["Engineering", "Marketing", "Sales", "HR", "Finance", "Support", "Operations"].map((d) => (
              <option key={d} value={d}>{d}</option>
            ))}
          </select>
          <select value={shiftFilter} onChange={(e) => setShiftFilter(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
            <option value="">All Shifts</option>
            {shiftOptions.map((s) => (
              <option key={s.id} value={s.id}>{s.name}</option>
            ))}
          </select>
          <input type="date" value={dateRangeStart} onChange={(e) => setDateRangeStart(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          <span className="text-xs text-gray-400">to</span>
          <input type="date" value={dateRangeEnd} onChange={(e) => setDateRangeEnd(e.target.value)}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>

        <div className="flex items-center gap-2">
          {["daily", "weekly", "monthly"].map((mode) => (
            <button key={mode} onClick={() => setViewMode(mode)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium capitalize transition-colors ${
                viewMode === mode ? "bg-indigo-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}>
              {mode}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">
              {rosters.length === 0 ? "No rosters yet. Assign a shift to get started." : "No rosters match your filters."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Employee", "Shift", "Date", "Department", "Assigned By", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((r, i) => (
                    <tr key={r.id ?? i} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-4 py-3 text-sm font-medium text-gray-900">{r.employee_name || r.employee || `Employee #${r.employee_id}`}</td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-100 text-indigo-800">
                          {r.shift_name || r.shift || (shiftOptions.find((s) => s.id === r.shift_id)?.name) || "-"}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{formatDate(r.date)}</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{r.department || "-"}</td>
                      <td className="px-4 py-3 text-sm text-gray-500">{r.assigned_by || r.assignedBy || "-"}</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleDelete(r.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {showAssignModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Assign Shift</h2>
                <button onClick={() => { setShowAssignModal(false); resetAssignForm(); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleAssign} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                  <input type="number" min={1} value={assignForm.employee_id} onChange={(e) => setAssignForm({ ...assignForm, employee_id: e.target.value })}
                    className={`w-full border ${formErrors.employee_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                  {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift *</label>
                  <select value={assignForm.shift_id} onChange={(e) => setAssignForm({ ...assignForm, shift_id: e.target.value })}
                    className={`w-full border ${formErrors.shift_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}>
                    <option value="">Select shift</option>
                    {shiftOptions.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.start_time} - {s.end_time})</option>)}
                  </select>
                  {formErrors.shift_id && <p className="text-red-500 text-xs mt-1">{formErrors.shift_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                  <input type="date" value={assignForm.date} onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })}
                    className={`w-full border ${formErrors.date ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                  {formErrors.date && <p className="text-red-500 text-xs mt-1">{formErrors.date}</p>}
                </div>
                {formErrors.submit && <p className="text-red-500 text-sm">{formErrors.submit}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowAssignModal(false); resetAssignForm(); }}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors">
                    {submitting ? "Assigning..." : "Assign"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showBulkModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Bulk Assign Shift</h2>
                <button onClick={() => { setShowBulkModal(false); resetBulkForm(); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleBulkAssign} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee IDs *</label>
                  <input type="text" value={bulkForm.employee_ids} onChange={(e) => setBulkForm({ ...bulkForm, employee_ids: e.target.value })}
                    placeholder="e.g. 101, 102, 103"
                    className={`w-full border ${formErrors.employee_ids ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                  {formErrors.employee_ids && <p className="text-red-500 text-xs mt-1">{formErrors.employee_ids}</p>}
                  <p className="text-xs text-gray-400 mt-1">Comma-separated list of employee IDs</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Shift *</label>
                  <select value={bulkForm.shift_id} onChange={(e) => setBulkForm({ ...bulkForm, shift_id: e.target.value })}
                    className={`w-full border ${formErrors.shift_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`}>
                    <option value="">Select shift</option>
                    {shiftOptions.map((s) => <option key={s.id} value={s.id}>{s.name} ({s.start_time} - {s.end_time})</option>)}
                  </select>
                  {formErrors.shift_id && <p className="text-red-500 text-xs mt-1">{formErrors.shift_id}</p>}
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Start Date *</label>
                    <input type="date" value={bulkForm.start_date} onChange={(e) => setBulkForm({ ...bulkForm, start_date: e.target.value })}
                      className={`w-full border ${formErrors.start_date ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.start_date && <p className="text-red-500 text-xs mt-1">{formErrors.start_date}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">End Date *</label>
                    <input type="date" value={bulkForm.end_date} onChange={(e) => setBulkForm({ ...bulkForm, end_date: e.target.value })}
                      className={`w-full border ${formErrors.end_date ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.end_date && <p className="text-red-500 text-xs mt-1">{formErrors.end_date}</p>}
                  </div>
                </div>
                {formErrors.submit && <p className="text-red-500 text-sm">{formErrors.submit}</p>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowBulkModal(false); resetBulkForm(); }}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors">
                    {submitting ? "Assigning..." : "Bulk Assign"}
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

