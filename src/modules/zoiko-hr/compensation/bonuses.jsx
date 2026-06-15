import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getBonuses,
  createBonus,
  updateBonus,
  deleteBonus,
} from "../../../service/hrService";

const STATUS_COLORS = {
  approved: "bg-green-100 text-green-800",
  paid: "bg-blue-100 text-blue-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

const ITEMS_PER_PAGE = 8;

const initialForm = {
  employee_id: "",
  bonus_type: "",
  amount: "",
  reason: "",
  awarded_date: "",
  paid_date: "",
  status: "pending",
};

export default function ZoikoHRBonuses() {
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
      const data = await getBonuses();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load bonuses");
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
    const pending = items.filter((i) => i.status === "pending").length;
    const paid = items.filter((i) => i.status === "paid").length;
    return { total, pending, paid };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          String(i.employee_id).includes(q) ||
          (i.bonus_type && i.bonus_type.toLowerCase().includes(q)) ||
          (i.reason && i.reason.toLowerCase().includes(q))
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
    if (!data.bonus_type) errors.bonus_type = "Bonus type is required";
    if (!data.amount || isNaN(parseFloat(data.amount))) errors.amount = "Valid amount is required";
    if (!data.awarded_date) errors.awarded_date = "Awarded date is required";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await createBonus({
        employee_id: formData.employee_id ? parseInt(formData.employee_id) : null,
        bonus_type: formData.bonus_type.trim() || null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        reason: formData.reason.trim() || null,
        awarded_date: formData.awarded_date || null,
        paid_date: formData.paid_date || null,
        status: formData.status || "pending",
      });
      setShowCreateModal(false);
      resetForm();
      await fetchItems();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create bonus" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      employee_id: item.employee_id || "",
      bonus_type: item.bonus_type || "",
      amount: item.amount || "",
      reason: item.reason || "",
      awarded_date: item.awarded_date || "",
      paid_date: item.paid_date || "",
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
        } else if (key === "amount") {
          val = editForm[key] ? parseFloat(editForm[key]) : null;
          orig = editItem[key] ? parseFloat(editItem[key]) : null;
        } else {
          val = editForm[key] || null;
          orig = editItem[key] || null;
        }
        if (String(val) !== String(orig)) payload[key] = val;
      }
      if (Object.keys(payload).length > 0) {
        await updateBonus(editItem.id, payload);
      }
      setShowEditModal(false);
      setEditItem(null);
      await fetchItems();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to update bonus" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this bonus?")) return;
    try {
      await deleteBonus(id);
      await fetchItems();
    } catch (err) {
      setError(err.message || "Failed to delete bonus");
    }
  };

  if (loading && items.length === 0) {
    return (
      <HRPage title="Bonuses" subtitle="Manage employee bonuses and special awards.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading bonuses...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Bonuses" subtitle="Manage employee bonuses and special awards.">
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
            <div className="bg-white px-4 py-2 border border-yellow-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Pending: </span>
              <span className="font-bold text-yellow-600">{stats.pending}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Paid: </span>
              <span className="font-bold text-blue-600">{stats.paid}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Bonus
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by Employee, Type, or Reason..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">🎁</div>
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? "No bonuses yet. Add your first bonus to get started."
                : "No bonuses match your search criteria."}
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Reason</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Awarded Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Paid Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((item) => (
                      <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{item.employee_id}</td>
                        <td className="px-4 py-3 text-gray-700">{item.bonus_type || <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-gray-700">${(parseFloat(item.amount) || 0).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">{item.reason || <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-gray-700">{item.awarded_date || <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-gray-700">{item.paid_date || <span className="text-gray-300">-</span>}</td>
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
              <h2 className="text-lg font-bold text-gray-800">Add Bonus</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Type *</label>
                <input
                  type="text"
                  value={formData.bonus_type}
                  onChange={(e) => setFormData({ ...formData, bonus_type: e.target.value })}
                  className={`w-full border ${formErrors.bonus_type ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.bonus_type && <p className="text-red-500 text-xs mt-1">{formErrors.bonus_type}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  rows={2}
                  value={formData.reason}
                  onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Awarded Date *</label>
                <input
                  type="date"
                  value={formData.awarded_date}
                  onChange={(e) => setFormData({ ...formData, awarded_date: e.target.value })}
                  className={`w-full border ${formErrors.awarded_date ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.awarded_date && <p className="text-red-500 text-xs mt-1">{formErrors.awarded_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Date</label>
                <input
                  type="date"
                  value={formData.paid_date}
                  onChange={(e) => setFormData({ ...formData, paid_date: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Bonus"}
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
              <h2 className="text-lg font-bold text-gray-800">Update Bonus</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Type *</label>
                <input
                  type="text"
                  value={editForm.bonus_type}
                  onChange={(e) => setEditForm({ ...editForm, bonus_type: e.target.value })}
                  className={`w-full border ${formErrors.bonus_type ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.bonus_type && <p className="text-red-500 text-xs mt-1">{formErrors.bonus_type}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason</label>
                <textarea
                  rows={2}
                  value={editForm.reason}
                  onChange={(e) => setEditForm({ ...editForm, reason: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Awarded Date *</label>
                <input
                  type="date"
                  value={editForm.awarded_date}
                  onChange={(e) => setEditForm({ ...editForm, awarded_date: e.target.value })}
                  className={`w-full border ${formErrors.awarded_date ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.awarded_date && <p className="text-red-500 text-xs mt-1">{formErrors.awarded_date}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Paid Date</label>
                <input
                  type="date"
                  value={editForm.paid_date}
                  onChange={(e) => setEditForm({ ...editForm, paid_date: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="paid">Paid</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Bonus"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
