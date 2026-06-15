import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-800",
  frozen: "bg-blue-100 text-blue-800",
};

const ITEMS_PER_PAGE = 8;

const initialForm = {
  employee_id: "",
  plan_type: "",
  contribution_emp: "",
  contribution_employer: "",
  vesting_years: "",
  current_balance: "",
  status: "active",
};

const mockRetirement = [
  { id: 1, employee_id: 1, plan_type: "401(k)", contribution_emp: 5000, contribution_employer: 3000, vesting_years: 3, current_balance: 85000, status: "active" },
  { id: 2, employee_id: 2, plan_type: "Pension", contribution_emp: 4000, contribution_employer: 4000, vesting_years: 5, current_balance: 120000, status: "active" },
  { id: 3, employee_id: 3, plan_type: "401(k)", contribution_emp: 6000, contribution_employer: 3500, vesting_years: 2, current_balance: 45000, status: "active" },
];

export default function ZoikOHRRetirementBenefits() {
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
      await new Promise((r) => setTimeout(r, 300));
      setItems([...mockRetirement]);
    } catch (err) {
      setError(err.message || "Failed to load retirement benefits");
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
    const totalBalance = items.reduce((s, i) => s + (parseFloat(i.current_balance) || 0), 0);
    const avgVesting = items.length > 0 ? items.reduce((s, i) => s + (parseFloat(i.vesting_years) || 0), 0) / items.length : 0;
    return { total, totalBalance, avgVesting };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.plan_type?.toLowerCase().includes(q) ||
          String(i.employee_id).includes(q) ||
          i.status?.toLowerCase().includes(q)
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
    if (!data.plan_type?.trim()) errors.plan_type = "Plan type is required";
    if (data.contribution_emp && isNaN(parseFloat(data.contribution_emp))) errors.contribution_emp = "Must be a valid number";
    if (data.current_balance && isNaN(parseFloat(data.current_balance))) errors.current_balance = "Must be a valid number";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      const newItem = {
        id: Math.max(0, ...items.map((i) => i.id)) + 1,
        employee_id: parseInt(formData.employee_id),
        plan_type: formData.plan_type.trim(),
        contribution_emp: formData.contribution_emp ? parseFloat(formData.contribution_emp) : null,
        contribution_employer: formData.contribution_employer ? parseFloat(formData.contribution_employer) : null,
        vesting_years: formData.vesting_years ? parseInt(formData.vesting_years) : null,
        current_balance: formData.current_balance ? parseFloat(formData.current_balance) : null,
        status: formData.status,
      };
      setItems((prev) => [...prev, newItem]);
      setShowCreateModal(false);
      resetForm();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (item) => {
    setEditItem(item);
    setEditForm({
      employee_id: String(item.employee_id || ""),
      plan_type: item.plan_type || "",
      contribution_emp: item.contribution_emp || "",
      contribution_employer: item.contribution_employer || "",
      vesting_years: item.vesting_years || "",
      current_balance: item.current_balance || "",
      status: item.status || "active",
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
      setItems((prev) =>
        prev.map((i) =>
          i.id === editItem.id
            ? {
                ...i,
                employee_id: parseInt(editForm.employee_id),
                plan_type: editForm.plan_type.trim(),
                contribution_emp: editForm.contribution_emp ? parseFloat(editForm.contribution_emp) : null,
                contribution_employer: editForm.contribution_employer ? parseFloat(editForm.contribution_employer) : null,
                vesting_years: editForm.vesting_years ? parseInt(editForm.vesting_years) : null,
                current_balance: editForm.current_balance ? parseFloat(editForm.current_balance) : null,
                status: editForm.status,
              }
            : i
        )
      );
      setShowEditModal(false);
      setEditItem(null);
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to update" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this retirement plan?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading && items.length === 0) {
    return (
      <HRPage title="Retirement Benefits" subtitle="Manage 401(k), pension plans, and retirement contributions.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading retirement benefits...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Retirement Benefits" subtitle="Manage 401(k), pension plans, and retirement contributions.">
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
              <span className="text-gray-400">Total Plans: </span>
              <span className="font-bold text-gray-800">{stats.total}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-purple-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Total Balance: </span>
              <span className="font-bold text-purple-600">${stats.totalBalance.toLocaleString()}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Avg Vesting: </span>
              <span className="font-bold text-blue-600">{stats.avgVesting.toFixed(1)} yrs</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Retirement Plan
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by plan type, employee, or status..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">🏦</div>
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? "No retirement plans yet. Add your first plan to get started."
                : "No plans match your search criteria."}
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Plan Type</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee Contribution</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Employer Contribution</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Vesting</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Balance</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((i) => (
                      <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">#{i.employee_id}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{i.plan_type}</td>
                        <td className="px-4 py-3 text-gray-700">{i.contribution_emp ? `$${parseFloat(i.contribution_emp).toLocaleString()}` : <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-gray-700">{i.contribution_employer ? `$${parseFloat(i.contribution_employer).toLocaleString()}` : <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-gray-700">{i.vesting_years ? `${i.vesting_years} yrs` : <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-gray-700 font-medium">${parseFloat(i.current_balance).toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[i.status] || STATUS_COLORS.active}`}>
                            {i.status}
                          </span>
                        </td>
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
              <h2 className="text-lg font-bold text-gray-800">Add Retirement Plan</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type *</label>
                <select
                  value={formData.plan_type}
                  onChange={(e) => setFormData({ ...formData, plan_type: e.target.value })}
                  className={`w-full border ${formErrors.plan_type ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select plan type</option>
                  <option value="401(k)">401(k)</option>
                  <option value="Pension">Pension</option>
                  <option value="403(b)">403(b)</option>
                  <option value="IRA">IRA</option>
                  <option value="Roth IRA">Roth IRA</option>
                </select>
                {formErrors.plan_type && <p className="text-red-500 text-xs mt-1">{formErrors.plan_type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Contribution</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.contribution_emp}
                  onChange={(e) => setFormData({ ...formData, contribution_emp: e.target.value })}
                  className={`w-full border ${formErrors.contribution_emp ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.contribution_emp && <p className="text-red-500 text-xs mt-1">{formErrors.contribution_emp}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employer Contribution</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.contribution_employer}
                  onChange={(e) => setFormData({ ...formData, contribution_employer: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vesting Years</label>
                <input
                  type="number"
                  value={formData.vesting_years}
                  onChange={(e) => setFormData({ ...formData, vesting_years: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.current_balance}
                  onChange={(e) => setFormData({ ...formData, current_balance: e.target.value })}
                  className={`w-full border ${formErrors.current_balance ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.current_balance && <p className="text-red-500 text-xs mt-1">{formErrors.current_balance}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Plan"}
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
              <h2 className="text-lg font-bold text-gray-800">Update Retirement Plan</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Editing: <span className="font-medium text-gray-800">{editItem.plan_type}</span> (Employee #{editItem.employee_id})
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan Type *</label>
                <select
                  value={editForm.plan_type}
                  onChange={(e) => setEditForm({ ...editForm, plan_type: e.target.value })}
                  className={`w-full border ${formErrors.plan_type ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select plan type</option>
                  <option value="401(k)">401(k)</option>
                  <option value="Pension">Pension</option>
                  <option value="403(b)">403(b)</option>
                  <option value="IRA">IRA</option>
                  <option value="Roth IRA">Roth IRA</option>
                </select>
                {formErrors.plan_type && <p className="text-red-500 text-xs mt-1">{formErrors.plan_type}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Contribution</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.contribution_emp}
                  onChange={(e) => setEditForm({ ...editForm, contribution_emp: e.target.value })}
                  className={`w-full border ${formErrors.contribution_emp ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.contribution_emp && <p className="text-red-500 text-xs mt-1">{formErrors.contribution_emp}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employer Contribution</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.contribution_employer}
                  onChange={(e) => setEditForm({ ...editForm, contribution_employer: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Vesting Years</label>
                <input
                  type="number"
                  value={editForm.vesting_years}
                  onChange={(e) => setEditForm({ ...editForm, vesting_years: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Current Balance</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.current_balance}
                  onChange={(e) => setEditForm({ ...editForm, current_balance: e.target.value })}
                  className={`w-full border ${formErrors.current_balance ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.current_balance && <p className="text-red-500 text-xs mt-1">{formErrors.current_balance}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="frozen">Frozen</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Plan"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
