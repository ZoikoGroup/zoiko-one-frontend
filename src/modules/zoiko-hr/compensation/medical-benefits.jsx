import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";

const ITEMS_PER_PAGE = 8;

const initialForm = {
  employee_id: "",
  plan: "",
  coverage: "",
  premium: "",
  provider: "",
  deductible: "",
  dental_included: false,
  vision_included: false,
};

const mockMedical = [
  { id: 1, employee_id: 1, plan: "Gold", coverage: "Family", premium: 8000, provider: "MedLife", deductible: 1000, dental_included: true, vision_included: false },
  { id: 2, employee_id: 2, plan: "Silver", coverage: "Individual", premium: 5000, provider: "HealthFirst", deductible: 2000, dental_included: false, vision_included: false },
  { id: 3, employee_id: 3, plan: "Platinum", coverage: "Family", premium: 12000, provider: "MedLife", deductible: 500, dental_included: true, vision_included: true },
];

export default function ZoikOHRMedicalBenefits() {
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
      setItems([...mockMedical]);
    } catch (err) {
      setError(err.message || "Failed to load medical benefits");
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
    const avgPremium = items.length > 0 ? items.reduce((s, i) => s + (parseFloat(i.premium) || 0), 0) / items.length : 0;
    return { total, avgPremium };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.plan?.toLowerCase().includes(q) ||
          i.provider?.toLowerCase().includes(q) ||
          i.coverage?.toLowerCase().includes(q) ||
          String(i.employee_id).includes(q)
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
    if (!data.plan?.trim()) errors.plan = "Plan is required";
    if (!data.premium || isNaN(parseFloat(data.premium))) errors.premium = "Valid premium is required";
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
        plan: formData.plan.trim(),
        coverage: formData.coverage.trim(),
        premium: parseFloat(formData.premium),
        provider: formData.provider.trim() || null,
        deductible: formData.deductible ? parseFloat(formData.deductible) : null,
        dental_included: formData.dental_included,
        vision_included: formData.vision_included,
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
      plan: item.plan || "",
      coverage: item.coverage || "",
      premium: item.premium || "",
      provider: item.provider || "",
      deductible: item.deductible || "",
      dental_included: item.dental_included || false,
      vision_included: item.vision_included || false,
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
                plan: editForm.plan.trim(),
                coverage: editForm.coverage.trim(),
                premium: parseFloat(editForm.premium),
                provider: editForm.provider.trim() || null,
                deductible: editForm.deductible ? parseFloat(editForm.deductible) : null,
                dental_included: editForm.dental_included,
                vision_included: editForm.vision_included,
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
    if (!window.confirm("Are you sure you want to delete this medical benefit?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading && items.length === 0) {
    return (
      <HRPage title="Medical Benefits" subtitle="Manage employee medical insurance plans and coverage.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading medical benefits...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Medical Benefits" subtitle="Manage employee medical insurance plans and coverage.">
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
              <span className="text-gray-400">Avg Premium: </span>
              <span className="font-bold text-purple-600">${stats.avgPremium.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Medical Plan
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by plan, provider, or employee..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">🏥</div>
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? "No medical plans yet. Add your first plan to get started."
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
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Plan</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Coverage</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Premium</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Provider</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Deductible</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Dental</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Vision</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((i) => (
                      <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">#{i.employee_id}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{i.plan}</td>
                        <td className="px-4 py-3 text-gray-700">{i.coverage}</td>
                        <td className="px-4 py-3 text-gray-700">${parseFloat(i.premium).toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">{i.provider || <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3 text-gray-700">{i.deductible ? `$${parseFloat(i.deductible).toLocaleString()}` : <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${i.dental_included ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {i.dental_included ? "Yes" : "No"}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${i.vision_included ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>
                            {i.vision_included ? "Yes" : "No"}
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
              <h2 className="text-lg font-bold text-gray-800">Add Medical Plan</h2>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan *</label>
                <select
                  value={formData.plan}
                  onChange={(e) => setFormData({ ...formData, plan: e.target.value })}
                  className={`w-full border ${formErrors.plan ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select plan</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
                {formErrors.plan && <p className="text-red-500 text-xs mt-1">{formErrors.plan}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coverage</label>
                <select
                  value={formData.coverage}
                  onChange={(e) => setFormData({ ...formData, coverage: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select coverage</option>
                  <option value="Individual">Individual</option>
                  <option value="Family">Family</option>
                  <option value="Couple">Couple</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Premium *</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.premium}
                  onChange={(e) => setFormData({ ...formData, premium: e.target.value })}
                  className={`w-full border ${formErrors.premium ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.premium && <p className="text-red-500 text-xs mt-1">{formErrors.premium}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input
                  type="text"
                  value={formData.provider}
                  onChange={(e) => setFormData({ ...formData, provider: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deductible</label>
                <input
                  type="number"
                  step="0.01"
                  value={formData.deductible}
                  onChange={(e) => setFormData({ ...formData, deductible: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.dental_included}
                    onChange={(e) => setFormData({ ...formData, dental_included: e.target.checked })}
                    className="rounded"
                  />
                  Dental Included
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={formData.vision_included}
                    onChange={(e) => setFormData({ ...formData, vision_included: e.target.checked })}
                    className="rounded"
                  />
                  Vision Included
                </label>
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
              <h2 className="text-lg font-bold text-gray-800">Update Medical Plan</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Editing: <span className="font-medium text-gray-800">{editItem.plan}</span> (Employee #{editItem.employee_id})
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
                <label className="block text-sm font-medium text-gray-700 mb-1">Plan *</label>
                <select
                  value={editForm.plan}
                  onChange={(e) => setEditForm({ ...editForm, plan: e.target.value })}
                  className={`w-full border ${formErrors.plan ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select plan</option>
                  <option value="Bronze">Bronze</option>
                  <option value="Silver">Silver</option>
                  <option value="Gold">Gold</option>
                  <option value="Platinum">Platinum</option>
                </select>
                {formErrors.plan && <p className="text-red-500 text-xs mt-1">{formErrors.plan}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Coverage</label>
                <select
                  value={editForm.coverage}
                  onChange={(e) => setEditForm({ ...editForm, coverage: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select coverage</option>
                  <option value="Individual">Individual</option>
                  <option value="Family">Family</option>
                  <option value="Couple">Couple</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Premium *</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.premium}
                  onChange={(e) => setEditForm({ ...editForm, premium: e.target.value })}
                  className={`w-full border ${formErrors.premium ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.premium && <p className="text-red-500 text-xs mt-1">{formErrors.premium}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Provider</label>
                <input
                  type="text"
                  value={editForm.provider}
                  onChange={(e) => setEditForm({ ...editForm, provider: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Deductible</label>
                <input
                  type="number"
                  step="0.01"
                  value={editForm.deductible}
                  onChange={(e) => setEditForm({ ...editForm, deductible: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-6">
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.dental_included}
                    onChange={(e) => setEditForm({ ...editForm, dental_included: e.target.checked })}
                    className="rounded"
                  />
                  Dental Included
                </label>
                <label className="flex items-center gap-2 text-sm text-gray-700">
                  <input
                    type="checkbox"
                    checked={editForm.vision_included}
                    onChange={(e) => setEditForm({ ...editForm, vision_included: e.target.checked })}
                    className="rounded"
                  />
                  Vision Included
                </label>
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
