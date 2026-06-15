import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getIncentives,
  createIncentive,
  updateIncentive,
  deleteIncentive,
} from "../../../service/hrService";

const STATUS_COLORS = {
  achieved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  missed: "bg-red-100 text-red-800",
};

const ITEMS_PER_PAGE = 8;

const initialForm = {
  employee_id: "",
  incentive_type: "",
  target: "",
  achieved: "",
  amount: "",
  period: "",
  status: "pending",
};

export default function ZoikoHRIncentives() {
  const [items, setItems] = useState([]);
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

  const fetchItems = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getIncentives();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load incentives");
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const achievedCount = items.filter(
      (i) => (parseFloat(i.achieved) || 0) >= (parseFloat(i.target) || 0)
    ).length;
    const achievedRate = total > 0 ? (achievedCount / total) * 100 : 0;
    return { total, achievedRate };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          String(i.employee_id).includes(q) ||
          (i.incentive_type && i.incentive_type.toLowerCase().includes(q)) ||
          (i.period && i.period.toLowerCase().includes(q))
      );
    }
    return result;
  }, [items, search]);

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
    if (!data.incentive_type) errors.incentive_type = "Incentive type is required";
    if (!data.target || isNaN(parseFloat(data.target))) errors.target = "Valid target is required";
    if (!data.achieved || isNaN(parseFloat(data.achieved))) errors.achieved = "Valid achieved value is required";
    if (!data.amount || isNaN(parseFloat(data.amount))) errors.amount = "Valid amount is required";
    if (!data.period) errors.period = "Period is required";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await createIncentive({
        employee_id: formData.employee_id ? parseInt(formData.employee_id) : null,
        incentive_type: formData.incentive_type.trim() || null,
        target: formData.target ? parseFloat(formData.target) : null,
        achieved: formData.achieved ? parseFloat(formData.achieved) : null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        period: formData.period.trim() || null,
        status: formData.status || "pending",
      });
      setShowCreateModal(false);
      resetForm();
      await fetchItems();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create incentive" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      employee_id: item.employee_id || "",
      incentive_type: item.incentive_type || "",
      target: item.target || "",
      achieved: item.achieved || "",
      amount: item.amount || "",
      period: item.period || "",
      status: item.status || "pending",
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
      const payload = {};
      for (const key of Object.keys(initialForm)) {
        let val, orig;
        if (key === "employee_id") {
          val = editForm[key] ? parseInt(editForm[key]) : null;
          orig = editItem[key] ? parseInt(editItem[key]) : null;
        } else if (["target", "achieved", "amount"].includes(key)) {
          val = editForm[key] ? parseFloat(editForm[key]) : null;
          orig = editItem[key] ? parseFloat(editItem[key]) : null;
        } else {
          val = editForm[key] || null;
          orig = editItem[key] || null;
        }
        if (String(val) !== String(orig)) payload[key] = val;
      }
      if (Object.keys(payload).length > 0) {
        await updateIncentive(editItem.id, payload);
      }
      setShowEditModal(false);
      setEditItem(null);
      await fetchItems();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to update incentive" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this incentive?")) return;
    try {
      await deleteIncentive(id);
      await fetchItems();
    } catch (err) {
      setError(err.message || "Failed to delete incentive");
    }
  };

  if (loading && items.length === 0) {
    return (
      <HRPage title="Incentives" subtitle="Manage performance-based incentives and targets.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading incentives...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Incentives" subtitle="Manage performance-based incentives and targets.">
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
            <div className="bg-white px-4 py-2 border border-green-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Achieved Rate: </span>
              <span className="font-bold text-green-600">{stats.achievedRate.toFixed(1)}%</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Incentive
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by Employee, Type, or Period..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">🏆</div>
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? "No incentives yet. Add your first incentive to get started."
                : "No incentives match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Target</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Achieved</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Period</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((item) => {
                      const target = parseFloat(item.target) || 0;
                      const achieved = parseFloat(item.achieved) || 0;
                      const achievedPct = target > 0 ? (achieved / target) * 100 : 0;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{item.employee_id}</td>
                          <td className="px-4 py-3 text-gray-700">{item.incentive_type || <span className="text-gray-300">-</span>}</td>
                          <td className="px-4 py-3 text-gray-700">{target.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-700">
                            {achieved.toLocaleString()}
                            {target > 0 && (
                              <span className={`ml-1 text-xs ${achieved >= target ? "text-green-600" : "text-red-600"}`}>
                                ({achievedPct.toFixed(0)}%)
                              </span>
                            )}
                          </td>
                          <td className="px-4 py-3 text-gray-700">${(parseFloat(item.amount) || 0).toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-700">{item.period || <span className="text-gray-300">-</span>}</td>
                          <td className="px-4 py-3">
                            <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[item.status] || STATUS_COLORS.pending}`}>
                              {item.status || "pending"}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                onClick={() => openEditModal(item)}
                                className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-500 hover:text-red-700 text-xs font-medium px-1"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
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
              <h2 className="text-lg font-bold text-gray-800">Add Incentive</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Incentive Type *</label>
                <input
                  type="text"
                  value={formData.incentive_type}
                  onChange={(e) => setFormData({ ...formData, incentive_type: e.target.value })}
                  className={`w-full border ${formErrors.incentive_type ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.incentive_type && <p className="text-red-500 text-xs mt-1">{formErrors.incentive_type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.target}
                  onChange={(e) => setFormData({ ...formData, target: e.target.value })}
                  className={`w-full border ${formErrors.target ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.target && <p className="text-red-500 text-xs mt-1">{formErrors.target}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Achieved *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.achieved}
                  onChange={(e) => setFormData({ ...formData, achieved: e.target.value })}
                  className={`w-full border ${formErrors.achieved ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.achieved && <p className="text-red-500 text-xs mt-1">{formErrors.achieved}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className={`w-full border ${formErrors.amount ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.amount && <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period *</label>
                <input
                  type="text"
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  placeholder="e.g. Q1 2026"
                  className={`w-full border ${formErrors.period ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.period && <p className="text-red-500 text-xs mt-1">{formErrors.period}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="achieved">Achieved</option>
                  <option value="missed">Missed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Incentive"}
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
              <h2 className="text-lg font-bold text-gray-800">Update Incentive</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Incentive Type *</label>
                <input
                  type="text"
                  value={editForm.incentive_type}
                  onChange={(e) => setEditForm({ ...editForm, incentive_type: e.target.value })}
                  className={`w-full border ${formErrors.incentive_type ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.incentive_type && <p className="text-red-500 text-xs mt-1">{formErrors.incentive_type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Target *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.target}
                  onChange={(e) => setEditForm({ ...editForm, target: e.target.value })}
                  className={`w-full border ${formErrors.target ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.target && <p className="text-red-500 text-xs mt-1">{formErrors.target}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Achieved *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.achieved}
                  onChange={(e) => setEditForm({ ...editForm, achieved: e.target.value })}
                  className={`w-full border ${formErrors.achieved ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.achieved && <p className="text-red-500 text-xs mt-1">{formErrors.achieved}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Amount *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.amount}
                  onChange={(e) => setEditForm({ ...editForm, amount: e.target.value })}
                  className={`w-full border ${formErrors.amount ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.amount && <p className="text-red-500 text-xs mt-1">{formErrors.amount}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Period *</label>
                <input
                  type="text"
                  value={editForm.period}
                  onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                  placeholder="e.g. Q1 2026"
                  className={`w-full border ${formErrors.period ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.period && <p className="text-red-500 text-xs mt-1">{formErrors.period}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="achieved">Achieved</option>
                  <option value="missed">Missed</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Incentive"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
