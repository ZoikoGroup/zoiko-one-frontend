import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getSalaryStructures,
  createSalaryStructure,
  updateSalaryStructure,
  deleteSalaryStructure,
} from "../../../service/hrService";

const ITEMS_PER_PAGE = 8;

const initialForm = {
  employee_id: "",
  pay_grade_id: "",
  basic_salary: "",
  housing_allowance: "0",
  transport_allowance: "0",
  medical_allowance: "0",
  other_allowances: "0",
  effective_from: "",
};

export default function SalaryStructuresPage() {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [editForm, setEditForm] = useState({ ...initialForm });

  const fetchStructures = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getSalaryStructures();
      setStructures(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load salary structures");
      setStructures([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStructures();
  }, []);

  const stats = useMemo(() => {
    const total = structures.length;
    const avgCtc = total > 0
      ? structures.reduce((sum, s) => sum + parseFloat(s.total_ctc || s.basic_salary || 0), 0) / total
      : 0;
    return { total, avgCtc };
  }, [structures]);

  const filtered = useMemo(() => {
    let result = structures;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (s) =>
          String(s.employee_id).toLowerCase().includes(q) ||
          (s.employee_name || "").toLowerCase().includes(q)
      );
    }
    return result;
  }, [structures, search]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const resetForm = () => setFormData({ ...initialForm });

  const validateForm = (data) => {
    const errors = {};
    if (!data.employee_id) errors.employee_id = "Employee ID is required";
    if (!data.basic_salary || isNaN(parseFloat(data.basic_salary))) errors.basic_salary = "Valid basic salary is required";
    if (!data.effective_from) errors.effective_from = "Effective from date is required";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await createSalaryStructure({
        employee_id: parseInt(formData.employee_id),
        pay_grade_id: formData.pay_grade_id ? parseInt(formData.pay_grade_id) : null,
        basic_salary: parseFloat(formData.basic_salary),
        housing_allowance: parseFloat(formData.housing_allowance) || 0,
        transport_allowance: parseFloat(formData.transport_allowance) || 0,
        medical_allowance: parseFloat(formData.medical_allowance) || 0,
        other_allowances: parseFloat(formData.other_allowances) || 0,
        effective_from: formData.effective_from,
      });
      setShowCreateModal(false);
      resetForm();
      await fetchStructures();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create salary structure" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      employee_id: String(item.employee_id || ""),
      pay_grade_id: String(item.pay_grade_id || ""),
      basic_salary: String(item.basic_salary || ""),
      housing_allowance: String(item.housing_allowance || "0"),
      transport_allowance: String(item.transport_allowance || "0"),
      medical_allowance: String(item.medical_allowance || "0"),
      other_allowances: String(item.other_allowances || "0"),
      effective_from: item.effective_from || "",
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editItem) return;
    const errors = validateForm(editForm);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await updateSalaryStructure(editItem.id, {
        employee_id: parseInt(editForm.employee_id),
        pay_grade_id: editForm.pay_grade_id ? parseInt(editForm.pay_grade_id) : null,
        basic_salary: parseFloat(editForm.basic_salary),
        housing_allowance: parseFloat(editForm.housing_allowance) || 0,
        transport_allowance: parseFloat(editForm.transport_allowance) || 0,
        medical_allowance: parseFloat(editForm.medical_allowance) || 0,
        other_allowances: parseFloat(editForm.other_allowances) || 0,
        effective_from: editForm.effective_from,
      });
      setShowEditModal(false);
      setEditItem(null);
      await fetchStructures();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to update salary structure" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this salary structure?")) return;
    try {
      await deleteSalaryStructure(id);
      await fetchStructures();
    } catch (err) {
      setError(err.message || "Failed to delete salary structure");
    }
  };

  if (loading && structures.length === 0) {
    return (
      <HRPage title="Salary Structures" subtitle="Manage employee salary structures and allowances.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading salary structures...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Salary Structures" subtitle="Manage employee salary structures and allowances.">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {formErrors.submit && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{formErrors.submit}</div>
      )}

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total: </span>
              <span className="font-bold text-gray-800">{stats.total}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-purple-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Avg CTC: </span>
              <span className="font-bold text-purple-600">${stats.avgCtc.toLocaleString(undefined, { maximumFractionDigits: 0 })}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Salary Structure
          </button>
        </div>

        {structures.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by employee ID..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">💰</div>
            <p className="text-gray-500 font-medium">
              {structures.length === 0
                ? "No salary structures yet. Add your first one to get started."
                : "No salary structures match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee ID</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Basic Salary</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Housing</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Transport</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Medical</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Total CTC</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Effective From</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((s) => (
                      <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">#{s.employee_id}</td>
                        <td className="px-4 py-3 text-gray-700">${parseFloat(s.basic_salary || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">${parseFloat(s.housing_allowance || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">${parseFloat(s.transport_allowance || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">${parseFloat(s.medical_allowance || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 font-semibold text-gray-800">${parseFloat(s.total_ctc || s.basic_salary || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">{s.effective_from || <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${s.is_active !== false ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {s.is_active !== false ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(s)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(s.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium px-1"
                            >
                              Delete
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {totalPages > 1 && (
              <div className="flex justify-between items-center">
                <span className="text-xs text-gray-400">
                  Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}
                </span>
                <div className="flex gap-1">
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={safePage <= 1}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Prev
                  </button>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                    <button
                      key={p}
                      onClick={() => setCurrentPage(p)}
                      className={`px-3 py-1 text-sm border rounded-lg ${
                        p === safePage
                          ? "bg-blue-600 text-white border-blue-600"
                          : "border-gray-200 hover:bg-gray-50"
                      }`}
                    >
                      {p}
                    </button>
                  ))}
                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={safePage >= totalPages}
                    className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add Salary Structure</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <input
                  type="number"
                  value={formData.employee_id}
                  onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                  className={`w-full border ${formErrors.employee_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Grade ID</label>
                <input
                  type="number"
                  value={formData.pay_grade_id}
                  onChange={(e) => setFormData({ ...formData, pay_grade_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.basic_salary}
                  onChange={(e) => setFormData({ ...formData, basic_salary: e.target.value })}
                  className={`w-full border ${formErrors.basic_salary ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.basic_salary && <p className="text-red-500 text-xs mt-1">{formErrors.basic_salary}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Housing Allowance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.housing_allowance}
                    onChange={(e) => setFormData({ ...formData, housing_allowance: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport Allowance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.transport_allowance}
                    onChange={(e) => setFormData({ ...formData, transport_allowance: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Allowance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.medical_allowance}
                    onChange={(e) => setFormData({ ...formData, medical_allowance: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Allowances</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.other_allowances}
                    onChange={(e) => setFormData({ ...formData, other_allowances: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective From *</label>
                <input
                  type="date"
                  value={formData.effective_from}
                  onChange={(e) => setFormData({ ...formData, effective_from: e.target.value })}
                  className={`w-full border ${formErrors.effective_from ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.effective_from && <p className="text-red-500 text-xs mt-1">{formErrors.effective_from}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Structure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showEditModal && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Update Salary Structure</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Editing: <span className="font-medium text-gray-800">Employee #{editItem.employee_id}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
                <input
                  type="number"
                  value={editForm.employee_id}
                  onChange={(e) => setEditForm({ ...editForm, employee_id: e.target.value })}
                  className={`w-full border ${formErrors.employee_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pay Grade ID</label>
                <input
                  type="number"
                  value={editForm.pay_grade_id}
                  onChange={(e) => setEditForm({ ...editForm, pay_grade_id: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Basic Salary *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.basic_salary}
                  onChange={(e) => setEditForm({ ...editForm, basic_salary: e.target.value })}
                  className={`w-full border ${formErrors.basic_salary ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.basic_salary && <p className="text-red-500 text-xs mt-1">{formErrors.basic_salary}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Housing Allowance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.housing_allowance}
                    onChange={(e) => setEditForm({ ...editForm, housing_allowance: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Transport Allowance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.transport_allowance}
                    onChange={(e) => setEditForm({ ...editForm, transport_allowance: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Medical Allowance</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.medical_allowance}
                    onChange={(e) => setEditForm({ ...editForm, medical_allowance: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Other Allowances</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.other_allowances}
                    onChange={(e) => setEditForm({ ...editForm, other_allowances: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective From *</label>
                <input
                  type="date"
                  value={editForm.effective_from}
                  onChange={(e) => setEditForm({ ...editForm, effective_from: e.target.value })}
                  className={`w-full border ${formErrors.effective_from ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.effective_from && <p className="text-red-500 text-xs mt-1">{formErrors.effective_from}</p>}
              </div>
              {editItem.created_at && (
                <div className="text-xs text-gray-400">Created: {new Date(editItem.created_at).toLocaleString()}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Structure"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
