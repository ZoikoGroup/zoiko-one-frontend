import { useState, useEffect, useMemo } from "react";
import { Plus, Pencil, Trash2, Search, X, ToggleLeft, ToggleRight } from "lucide-react";
import HRPage from "../../../components/HRPage";
import {
  getAttendancePolicies,
  createAttendancePolicy,
  updateAttendancePolicy,
  deleteAttendancePolicy,
} from "../../../service/hrService";





const initialForm = {
  name: "",
  description: "",
  working_hours: 8,
  grace_time_minutes: 15,
  late_threshold_minutes: 30,
  early_exit_threshold_minutes: 15,
  requires_overtime_approval: false,
  overtime_rate: 1.5,
  max_overtime_hours: 4,
  break_duration_minutes: 60,
  min_working_days: 5,
  applicable_departments: "",
  is_active: true,
};

export default function AttendancePolicies() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [formData, setFormData] = useState({ ...initialForm });
  const [submitting, setSubmitting] = useState(false);
  const [formErrors, setFormErrors] = useState({});

  const fetchPolicies = async () => {
    try {
      const res = await getAttendancePolicies();
      const data = Array.isArray(res) ? res : res?.data || [];
      setPolicies(data);
    } catch {
      setPolicies([]);
    }
  };

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    getAttendancePolicies()
      .then((res) => { if (mounted) setPolicies(Array.isArray(res) ? res : res?.data || []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const resetForm = () => {
    setFormData({ ...initialForm });
    setFormErrors({});
    setEditItem(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const openEditModal = (policy) => {
    setEditItem(policy);
    setFormData({
      name: policy.name || "",
      description: policy.description || "",
      working_hours: policy.working_hours ?? 8,
      grace_time_minutes: policy.grace_time_minutes ?? 15,
      late_threshold_minutes: policy.late_threshold_minutes ?? 30,
      early_exit_threshold_minutes: policy.early_exit_threshold_minutes ?? 15,
      requires_overtime_approval: !!policy.requires_overtime_approval,
      overtime_rate: policy.overtime_rate ?? 1.5,
      max_overtime_hours: policy.max_overtime_hours ?? 4,
      break_duration_minutes: policy.break_duration_minutes ?? 60,
      min_working_days: policy.min_working_days ?? 5,
      applicable_departments: policy.applicable_departments || "",
      is_active: policy.is_active !== false,
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validateForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = "Name is required";
    if (data.working_hours == null || data.working_hours < 1) errors.working_hours = "Must be at least 1";
    if (data.grace_time_minutes < 0) errors.grace_time_minutes = "Cannot be negative";
    return errors;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      const payload = {
        ...formData,
        applicable_departments: formData.applicable_departments || null,
        description: formData.description?.trim() || null,
      };
      if (editItem) {
        await updateAttendancePolicy(editItem.id, payload);
      } else {
        await createAttendancePolicy(payload);
      }
      setShowModal(false);
      resetForm();
      await fetchPolicies();
    } catch (err) {
      setFormErrors({ submit: err.message || "Operation failed" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this attendance policy?")) return;
    try {
      await deleteAttendancePolicy(id);
      await fetchPolicies();
    } catch (err) {
      setError(err.message || "Failed to delete policy");
    }
  };

  const handleToggleStatus = async (policy) => {
    try {
      await updateAttendancePolicy(policy.id, { is_active: !policy.is_active });
      await fetchPolicies();
    } catch (err) {
      setError(err.message || "Failed to toggle policy status");
    }
  };

  const filtered = useMemo(() => {
    if (!search.trim()) return policies;
    const q = search.toLowerCase();
    return policies.filter((p) =>
      (p.name || "").toLowerCase().includes(q) ||
      (p.description || "").toLowerCase().includes(q)
    );
  }, [policies, search]);

  if (loading) {
    return (
      <HRPage title="Attendance" subtitle="Manage attendance policies">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-500">Loading policies...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Attendance" subtitle="Manage attendance policies">
      <div className="space-y-6">
        {error && (
          <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Policies</h1>
            <p className="text-sm text-gray-500 mt-1">Define and manage attendance rules and policies</p>
          </div>
          <button onClick={openCreateModal}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Create Policy
          </button>
        </div>

        <div className="relative max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <input type="text" placeholder="Search policies..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-200">
            <div className="text-4xl mb-3">&#128196;</div>
            <p className="text-gray-500 font-medium">
              {policies.length === 0 ? "No policies yet. Create your first attendance policy." : "No policies match your search."}
            </p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    {["Name", "Working Hours", "Grace Time", "Late Threshold", "Early Exit", "Overtime Rate", "Status", "Actions"].map((h) => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {filtered.map((p) => (
                    <tr key={p.id} className="hover:bg-indigo-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <p className="text-sm font-medium text-gray-900">{p.name}</p>
                        {p.description && <p className="text-xs text-gray-400 truncate max-w-[200px]">{p.description}</p>}
                      </td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.working_hours ?? 8}h/day</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.grace_time_minutes ?? 15} min</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.late_threshold_minutes ?? 30} min</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.early_exit_threshold_minutes ?? 15} min</td>
                      <td className="px-4 py-3 text-sm text-gray-700">{p.overtime_rate ?? 1.5}x</td>
                      <td className="px-4 py-3">
                        <button onClick={() => handleToggleStatus(p)}
                          className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium transition-colors ${
                            p.is_active !== false
                              ? "bg-green-100 text-green-800 hover:bg-green-200"
                              : "bg-gray-100 text-gray-500 hover:bg-gray-200"
                          }`}>
                          {p.is_active !== false ? <ToggleRight className="w-3 h-3" /> : <ToggleLeft className="w-3 h-3" />}
                          {p.is_active !== false ? "Active" : "Inactive"}
                        </button>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <button onClick={() => openEditModal(p)} className="p-1 text-gray-400 hover:text-indigo-600 transition-colors"><Pencil className="w-4 h-4" /></button>
                          <button onClick={() => handleDelete(p.id)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
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
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">{editItem ? "Edit Policy" : "Create Policy"}</h2>
                <button onClick={() => { setShowModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleSubmit} className="p-6 space-y-4">
                {editItem && <div className="text-sm text-gray-500 mb-1">Editing: <span className="font-medium text-gray-800">{editItem.name}</span></div>}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Policy Name *</label>
                    <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      className={`w-full border ${formErrors.name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                    <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Working Hours (per day) *</label>
                    <input type="number" min={1} step={0.5} value={formData.working_hours} onChange={(e) => setFormData({ ...formData, working_hours: parseFloat(e.target.value) || 0 })}
                      className={`w-full border ${formErrors.working_hours ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500`} />
                    {formErrors.working_hours && <p className="text-red-500 text-xs mt-1">{formErrors.working_hours}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Grace Time (minutes)</label>
                    <input type="number" min={0} value={formData.grace_time_minutes} onChange={(e) => setFormData({ ...formData, grace_time_minutes: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Late Threshold (minutes)</label>
                    <input type="number" min={0} value={formData.late_threshold_minutes} onChange={(e) => setFormData({ ...formData, late_threshold_minutes: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Early Exit Threshold (minutes)</label>
                    <input type="number" min={0} value={formData.early_exit_threshold_minutes} onChange={(e) => setFormData({ ...formData, early_exit_threshold_minutes: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Break Duration (minutes)</label>
                    <input type="number" min={0} value={formData.break_duration_minutes} onChange={(e) => setFormData({ ...formData, break_duration_minutes: parseInt(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Min Working Days (per week)</label>
                    <input type="number" min={1} max={7} value={formData.min_working_days} onChange={(e) => setFormData({ ...formData, min_working_days: parseInt(e.target.value) || 5 })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Rate (multiplier)</label>
                    <input type="number" min={1} step={0.25} value={formData.overtime_rate} onChange={(e) => setFormData({ ...formData, overtime_rate: parseFloat(e.target.value) || 1 })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Max Overtime (hours/day)</label>
                    <input type="number" min={0} step={0.5} value={formData.max_overtime_hours} onChange={(e) => setFormData({ ...formData, max_overtime_hours: parseFloat(e.target.value) || 0 })}
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Applicable Departments (comma-separated)</label>
                    <input type="text" value={formData.applicable_departments} onChange={(e) => setFormData({ ...formData, applicable_departments: e.target.value })}
                      placeholder="e.g. Engineering, Marketing, HR"
                      className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
                  </div>
                  <div className="md:col-span-2 flex items-center gap-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.requires_overtime_approval} onChange={(e) => setFormData({ ...formData, requires_overtime_approval: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm text-gray-700">Require overtime approval</span>
                    </label>
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={formData.is_active} onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                        className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                      <span className="text-sm text-gray-700">Active</span>
                    </label>
                  </div>
                </div>

                {formErrors.submit && <p className="text-red-500 text-sm">{formErrors.submit}</p>}

                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowModal(false); resetForm(); }}
                    className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting}
                    className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium transition-colors">
                    {submitting ? (editItem ? "Updating..." : "Creating...") : (editItem ? "Update Policy" : "Create Policy")}
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

