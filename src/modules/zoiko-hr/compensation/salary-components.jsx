import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";

const ITEMS_PER_PAGE = 8;

const mockData = [
  { id: 1, component: "Basic", amount: 50000, period: "monthly", description: "Basic salary component" },
  { id: 2, component: "HRA", amount: 20000, period: "monthly", description: "House rent allowance" },
  { id: 3, component: "Special Allowance", amount: 15000, period: "monthly", description: "Special allowance" },
  { id: 4, component: "Bonus", amount: 100000, period: "yearly", description: "Annual bonus payout" },
];

const initialForm = {
  component: "",
  amount: "",
  period: "monthly",
  description: "",
};

export default function SalaryComponentsPage() {
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setItems(mockData);
      setLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const stats = useMemo(() => {
    const total = items.length;
    const monthly = items.filter((i) => i.period === "monthly").reduce((sum, i) => sum + (i.amount || 0), 0);
    const yearly = items.filter((i) => i.period === "yearly").reduce((sum, i) => sum + (i.amount || 0), 0);
    const oneTime = items.filter((i) => i.period === "one-time").reduce((sum, i) => sum + (i.amount || 0), 0);
    return { total, monthly, yearly, oneTime };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((i) => i.component?.toLowerCase().includes(q));
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

  let nextId = useMemo(() => Math.max(0, ...items.map((i) => i.id)) + 1, [items]);

  const resetForm = () => setFormData({ ...initialForm });

  const validateForm = (data) => {
    const errors = {};
    if (!data.component?.trim()) errors.component = "Component name is required";
    if (!data.amount || isNaN(parseFloat(data.amount)) || parseFloat(data.amount) <= 0) errors.amount = "Valid amount is required";
    return errors;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    setTimeout(() => {
      const newItem = {
        id: nextId,
        component: formData.component.trim(),
        amount: parseFloat(formData.amount),
        period: formData.period,
        description: formData.description.trim() || "",
      };
      setItems((prev) => [...prev, newItem]);
      setShowCreateModal(false);
      resetForm();
      setSubmitting(false);
    }, 200);
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      component: item.component || "",
      amount: String(item.amount || ""),
      period: item.period || "monthly",
      description: item.description || "",
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
    setSubmitting(true);
    setTimeout(() => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === editItem.id
            ? {
                ...i,
                component: editForm.component.trim(),
                amount: parseFloat(editForm.amount),
                period: editForm.period,
                description: editForm.description.trim() || "",
              }
            : i
        )
      );
      setShowEditModal(false);
      setEditItem(null);
      setSubmitting(false);
    }, 200);
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this salary component?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <HRPage title="Salary Components" subtitle="Manage salary components and compensation items.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading salary components...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Salary Components" subtitle="Manage salary components and compensation items.">
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
              <span className="text-gray-400">Monthly: </span>
              <span className="font-bold text-green-600">${stats.monthly.toLocaleString()}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Yearly: </span>
              <span className="font-bold text-blue-600">${stats.yearly.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Component
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by component name..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">🧩</div>
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? "No salary components yet. Add your first component to get started."
                : "No components match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Component</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Amount</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Period</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Description</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((i) => (
                      <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">{i.component}</td>
                        <td className="px-4 py-3 text-gray-700">${i.amount.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                            i.period === "monthly" ? "bg-green-100 text-green-800" :
                            i.period === "yearly" ? "bg-blue-100 text-blue-800" :
                            "bg-purple-100 text-purple-800"
                          }`}>
                            {i.period}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{i.description || <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(i)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(i.id)}
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
              <h2 className="text-lg font-bold text-gray-800">Add Salary Component</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Component Name *</label>
                <input
                  type="text"
                  value={formData.component}
                  onChange={(e) => setFormData({ ...formData, component: e.target.value })}
                  className={`w-full border ${formErrors.component ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.component && <p className="text-red-500 text-xs mt-1">{formErrors.component}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={formData.period}
                  onChange={(e) => setFormData({ ...formData, period: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="one-time">One Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Component"}
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
              <h2 className="text-lg font-bold text-gray-800">Update Salary Component</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Editing: <span className="font-medium text-gray-800">{editItem.component}</span>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Component Name *</label>
                <input
                  type="text"
                  value={editForm.component}
                  onChange={(e) => setEditForm({ ...editForm, component: e.target.value })}
                  className={`w-full border ${formErrors.component ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.component && <p className="text-red-500 text-xs mt-1">{formErrors.component}</p>}
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Period</label>
                <select
                  value={editForm.period}
                  onChange={(e) => setEditForm({ ...editForm, period: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                  <option value="one-time">One Time</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={2}
                  value={editForm.description}
                  onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Component"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
