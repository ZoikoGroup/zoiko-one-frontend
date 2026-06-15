import { useState, useMemo } from "react";
import HRPage from "../../../components/HRPage";

const MOCK_DATA = [
  { id: 1, employee_id: 1, current_ctc: 600000, new_ctc: 720000, increment_percent: 20, effective_date: "2026-04-01", reason: "Annual Review", status: "approved" },
  { id: 2, employee_id: 2, current_ctc: 840000, new_ctc: 966000, increment_percent: 15, effective_date: "2026-04-01", reason: "Promotion", status: "pending" },
];

const STATUS_COLORS = {
  approved: "bg-green-100 text-green-800",
  pending: "bg-yellow-100 text-yellow-800",
  rejected: "bg-red-100 text-red-800",
};

const ITEMS_PER_PAGE = 8;

const initialForm = {
  employee_id: "",
  current_ctc: "",
  new_ctc: "",
  increment_percent: "",
  effective_date: "",
  reason: "",
  status: "pending",
};

let nextId = 3;

export default function ZoikoHRIncrements() {
  const [items, setItems] = useState(MOCK_DATA);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [editForm, setEditForm] = useState({ ...initialForm });

  const stats = useMemo(() => {
    const total = items.length;
    const avgPercent = total > 0
      ? items.reduce((sum, i) => sum + (parseFloat(i.increment_percent) || 0), 0) / total
      : 0;
    const totalAmount = items.reduce((sum, i) => {
      return sum + ((parseFloat(i.new_ctc) || 0) - (parseFloat(i.current_ctc) || 0));
    }, 0);
    return { total, avgPercent, totalAmount };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          String(i.employee_id).includes(q) ||
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

  useMemo(() => {
    if (currentPage > totalPages) setCurrentPage(totalPages);
  }, [totalPages, currentPage]);

  const resetForm = () => setFormData({ ...initialForm });

  const validateForm = (data) => {
    const errors = {};
    if (!data.employee_id) errors.employee_id = "Employee ID is required";
    if (!data.current_ctc || isNaN(parseFloat(data.current_ctc))) errors.current_ctc = "Valid current CTC is required";
    if (!data.new_ctc || isNaN(parseFloat(data.new_ctc))) errors.new_ctc = "Valid new CTC is required";
    if (!data.effective_date) errors.effective_date = "Effective date is required";
    return errors;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    const amount = (parseFloat(formData.new_ctc) || 0) - (parseFloat(formData.current_ctc) || 0);
    const pct = formData.increment_percent || ((parseFloat(formData.current_ctc) || 0) > 0
      ? Math.round((amount / (parseFloat(formData.current_ctc) || 0)) * 100)
      : 0);
    const newItem = {
      id: nextId++,
      employee_id: formData.employee_id ? parseInt(formData.employee_id) : null,
      current_ctc: formData.current_ctc ? parseFloat(formData.current_ctc) : null,
      new_ctc: formData.new_ctc ? parseFloat(formData.new_ctc) : null,
      increment_percent: parseInt(pct),
      effective_date: formData.effective_date || null,
      reason: formData.reason.trim() || null,
      status: formData.status || "pending",
    };
    setItems([...items, newItem]);
    setShowCreateModal(false);
    resetForm();
    setSubmitting(false);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      employee_id: item.employee_id || "",
      current_ctc: item.current_ctc || "",
      new_ctc: item.new_ctc || "",
      increment_percent: item.increment_percent || "",
      effective_date: item.effective_date || "",
      reason: item.reason || "",
      status: item.status || "pending",
    });
    setFormErrors({});
    setShowEditModal(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    if (!editItem) return;
    const errors = validateForm(editForm);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    const amount = (parseFloat(editForm.new_ctc) || 0) - (parseFloat(editForm.current_ctc) || 0);
    const pct = editForm.increment_percent || ((parseFloat(editForm.current_ctc) || 0) > 0
      ? Math.round((amount / (parseFloat(editForm.current_ctc) || 0)) * 100)
      : 0);
    const updated = {
      ...editItem,
      employee_id: editForm.employee_id ? parseInt(editForm.employee_id) : null,
      current_ctc: editForm.current_ctc ? parseFloat(editForm.current_ctc) : null,
      new_ctc: editForm.new_ctc ? parseFloat(editForm.new_ctc) : null,
      increment_percent: parseInt(pct),
      effective_date: editForm.effective_date || null,
      reason: editForm.reason.trim() || null,
      status: editForm.status || "pending",
    };
    setItems(items.map((i) => (i.id === editItem.id ? updated : i)));
    setShowEditModal(false);
    setEditItem(null);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this increment?")) return;
    setItems(items.filter((i) => i.id !== id));
  };

  return (
    <HRPage title="Increment Management" subtitle="Manage employee salary increments and revisions.">
      {formErrors.submit && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{formErrors.submit}</div>
      )}

      <div className="space-y-6">
        <div className="flex flex-wrap justify-between items-center gap-4">
          <div className="flex flex-wrap gap-3">
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Increments: </span>
              <span className="font-bold text-gray-800">{stats.total}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Avg %: </span>
              <span className="font-bold text-blue-600">{stats.avgPercent.toFixed(1)}%</span>
            </div>
            <div className="bg-white px-4 py-2 border border-purple-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Amount: </span>
              <span className="font-bold text-purple-600">${stats.totalAmount.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Increment
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by Employee ID or reason..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">📈</div>
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? "No increments yet. Add your first increment to get started."
                : "No increments match your search criteria."}
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Current CTC</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">New CTC</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Increment %</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Effective Date</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((item) => {
                      const cur = parseFloat(item.current_ctc) || 0;
                      const nxt = parseFloat(item.new_ctc) || 0;
                      const amount = nxt - cur;
                      return (
                        <tr key={item.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{item.employee_id}</td>
                          <td className="px-4 py-3 text-gray-700">${cur.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-700">${nxt.toLocaleString()}</td>
                          <td className="px-4 py-3 text-gray-700">{item.increment_percent}%</td>
                          <td className={`px-4 py-3 font-medium ${amount >= 0 ? "text-green-600" : "text-red-600"}`}>
                            ${amount.toLocaleString()}
                          </td>
                          <td className="px-4 py-3 text-gray-700">{item.effective_date || <span className="text-gray-300">-</span>}</td>
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
              <h2 className="text-lg font-bold text-gray-800">Add Increment</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Current CTC *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.current_ctc}
                  onChange={(e) => setFormData({ ...formData, current_ctc: e.target.value })}
                  className={`w-full border ${formErrors.current_ctc ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.current_ctc && <p className="text-red-500 text-xs mt-1">{formErrors.current_ctc}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New CTC *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.new_ctc}
                  onChange={(e) => setFormData({ ...formData, new_ctc: e.target.value })}
                  className={`w-full border ${formErrors.new_ctc ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.new_ctc && <p className="text-red-500 text-xs mt-1">{formErrors.new_ctc}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Increment %</label>
                <input
                  type="number"
                  value={formData.increment_percent}
                  onChange={(e) => setFormData({ ...formData, increment_percent: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
                <input
                  type="date"
                  value={formData.effective_date}
                  onChange={(e) => setFormData({ ...formData, effective_date: e.target.value })}
                  className={`w-full border ${formErrors.effective_date ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.effective_date && <p className="text-red-500 text-xs mt-1">{formErrors.effective_date}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Increment"}
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
              <h2 className="text-lg font-bold text-gray-800">Update Increment</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Current CTC *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.current_ctc}
                  onChange={(e) => setEditForm({ ...editForm, current_ctc: e.target.value })}
                  className={`w-full border ${formErrors.current_ctc ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.current_ctc && <p className="text-red-500 text-xs mt-1">{formErrors.current_ctc}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">New CTC *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.new_ctc}
                  onChange={(e) => setEditForm({ ...editForm, new_ctc: e.target.value })}
                  className={`w-full border ${formErrors.new_ctc ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.new_ctc && <p className="text-red-500 text-xs mt-1">{formErrors.new_ctc}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Increment %</label>
                <input
                  type="number"
                  value={editForm.increment_percent}
                  onChange={(e) => setEditForm({ ...editForm, increment_percent: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Effective Date *</label>
                <input
                  type="date"
                  value={editForm.effective_date}
                  onChange={(e) => setEditForm({ ...editForm, effective_date: e.target.value })}
                  className={`w-full border ${formErrors.effective_date ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.effective_date && <p className="text-red-500 text-xs mt-1">{formErrors.effective_date}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="pending">Pending</option>
                  <option value="approved">Approved</option>
                  <option value="rejected">Rejected</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Increment"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
