import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getAssets,
  createAsset,
  updateAsset,
  deleteAsset,
} from "../../../service/hrService";

const STATUS_COLORS = {
  assigned: "bg-blue-100 text-blue-800",
  returned: "bg-gray-100 text-gray-800",
  maintenance: "bg-orange-100 text-orange-800",
};

const STATUS_OPTIONS = [
  { value: "assigned", label: "Assigned" },
  { value: "returned", label: "Returned" },
  { value: "maintenance", label: "Maintenance" },
];

const ITEMS_PER_PAGE = 10;

const initialForm = {
  name: "",
  asset_tag: "",
  category: "",
  serial_number: "",
  employee_id: "",
  assigned_date: "",
  status: "assigned",
  notes: "",
};

export default function ZoikoHRAssets() {
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});

  const [editForm, setEditForm] = useState({ ...initialForm });

  const fetchAssets = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getAssets();
      setAssets(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load assets");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  const categories = useMemo(() => {
    const cats = new Set(assets.map((a) => a.category).filter(Boolean));
    return ["", ...Array.from(cats).sort()];
  }, [assets]);

  const filtered = useMemo(() => {
    let result = assets;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (a) =>
          a.name?.toLowerCase().includes(q) ||
          a.asset_tag?.toLowerCase().includes(q) ||
          a.serial_number?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) {
      result = result.filter((a) => a.category === categoryFilter);
    }
    if (statusFilter) {
      result = result.filter((a) => a.status === statusFilter);
    }
    return result;
  }, [assets, search, categoryFilter, statusFilter]);

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
    if (!data.name?.trim()) errors.name = "Name is required";
    if (!data.asset_tag?.trim()) errors.asset_tag = "Asset tag is required";
    if (data.employee_id && (isNaN(Number(data.employee_id)) || Number(data.employee_id) <= 0))
      errors.employee_id = "Must be a valid employee ID";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await createAsset({
        name: formData.name.trim(),
        asset_tag: formData.asset_tag.trim(),
        category: formData.category.trim() || null,
        serial_number: formData.serial_number.trim() || null,
        employee_id: formData.employee_id ? Number(formData.employee_id) : null,
        assigned_date: formData.assigned_date || null,
        status: formData.status,
        notes: formData.notes.trim() || null,
      });
      setShowCreateModal(false);
      resetForm();
      await fetchAssets();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create asset" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (asset) => {
    setEditItem(asset);
    setEditForm({
      name: asset.name || "",
      asset_tag: asset.asset_tag || "",
      category: asset.category || "",
      serial_number: asset.serial_number || "",
      employee_id: asset.employee_id ? String(asset.employee_id) : "",
      assigned_date: asset.assigned_date || "",
      status: asset.status || "assigned",
      notes: asset.notes || "",
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
        const val = key === "employee_id"
          ? (editForm[key] ? Number(editForm[key]) : null)
          : editForm[key] || null;
        const orig = key === "employee_id"
          ? editItem.employee_id || null
          : editItem[key] || null;
        if (String(val) !== String(orig)) {
          payload[key] = val;
        }
      }
      if (Object.keys(payload).length > 0) {
        await updateAsset(editItem.id, payload);
      }
      setShowEditModal(false);
      setEditItem(null);
      await fetchAssets();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to update asset" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;
    try {
      await deleteAsset(id);
      await fetchAssets();
    } catch (err) {
      setError(err.message || "Failed to delete asset");
    }
  };

  const quickStatusChange = async (asset, newStatus) => {
    try {
      await updateAsset(asset.id, { status: newStatus });
      await fetchAssets();
    } catch (err) {
      setError(err.message || "Failed to update asset status");
    }
  };

  const stats = useMemo(() => {
    const total = assets.length;
    const assigned = assets.filter((a) => a.status === "assigned").length;
    const returned = assets.filter((a) => a.status === "returned").length;
    const maintenance = assets.filter((a) => a.status === "maintenance").length;
    return { total, assigned, returned, maintenance };
  }, [assets]);

  if (loading && assets.length === 0) {
    return (
      <HRPage title="Asset Management" subtitle="Manage and track company hardware and software inventory.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading assets...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Asset Management" subtitle="Manage and track company hardware and software inventory.">
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
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Assigned: </span>
              <span className="font-bold text-blue-600">{stats.assigned}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Returned: </span>
              <span className="font-bold text-gray-600">{stats.returned}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-orange-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Maintenance: </span>
              <span className="font-bold text-orange-600">{stats.maintenance}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Asset
          </button>
        </div>

        {assets.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by name, asset tag, or serial number..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <select
              value={categoryFilter}
              onChange={(e) => { setCategoryFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Categories</option>
              {categories.filter(Boolean).map((c) => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Statuses</option>
              {STATUS_OPTIONS.map((opt) => (
                <option key={opt.value} value={opt.value}>{opt.label}</option>
              ))}
            </select>
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">&#x1F4E6;</div>
            <p className="text-gray-500 font-medium">
              {assets.length === 0
                ? "No assets yet. Add your first asset to get started."
                : "No assets match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Asset Tag</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Name</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Serial #</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Employee</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Assigned</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((a) => (
                      <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{a.asset_tag}</td>
                        <td className="px-4 py-3 font-medium text-gray-800">{a.name}</td>
                        <td className="px-4 py-3">
                          {a.category ? (
                            <span className="inline-block bg-blue-50 text-blue-700 text-xs px-2 py-0.5 rounded-full font-medium">
                              {a.category}
                            </span>
                          ) : (
                            <span className="text-gray-300">-</span>
                          )}
                        </td>
                        <td className="px-4 py-3 text-xs text-gray-500 font-mono">{a.serial_number || '-'}</td>
                        <td className="px-4 py-3 text-gray-700">{a.employee_id ? `#${a.employee_id}` : <span className="text-gray-300">Unassigned</span>}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{a.assigned_date || '-'}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[a.status] || STATUS_COLORS.assigned}`}>
                            {a.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openEditModal(a)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1"
                            >
                              Edit
                            </button>
                            {a.status !== "returned" && (
                              <button
                                onClick={() => quickStatusChange(a, "returned")}
                                className="text-gray-500 hover:text-gray-700 text-xs px-1"
                                title="Mark as returned"
                              >
                                Return
                              </button>
                            )}
                            {a.status !== "maintenance" && (
                              <button
                                onClick={() => quickStatusChange(a, "maintenance")}
                                className="text-orange-500 hover:text-orange-700 text-xs px-1"
                                title="Mark as maintenance"
                              >
                                Maint.
                              </button>
                            )}
                            {a.status !== "assigned" && (
                              <button
                                onClick={() => quickStatusChange(a, "assigned")}
                                className="text-blue-500 hover:text-blue-700 text-xs px-1"
                                title="Reassign"
                              >
                                Assign
                              </button>
                            )}
                            <button
                              onClick={() => handleDelete(a.id)}
                              className="text-red-500 hover:text-red-700 text-xs font-medium px-1"
                            >
                              Del
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
              <h2 className="text-lg font-bold text-gray-800">Add Asset</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className={`w-full border ${formErrors.name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag *</label>
                  <input
                    type="text"
                    value={formData.asset_tag}
                    onChange={(e) => setFormData({ ...formData, asset_tag: e.target.value })}
                    placeholder="e.g. AST-001"
                    className={`w-full border ${formErrors.asset_tag ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.asset_tag && <p className="text-red-500 text-xs mt-1">{formErrors.asset_tag}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    placeholder="e.g. Hardware, Software"
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={formData.serial_number}
                    onChange={(e) => setFormData({ ...formData, serial_number: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assign to Employee ID</label>
                  <input
                    type="number"
                    min="1"
                    value={formData.employee_id}
                    onChange={(e) => setFormData({ ...formData, employee_id: e.target.value })}
                    className={`w-full border ${formErrors.employee_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
                  <input
                    type="date"
                    value={formData.assigned_date}
                    onChange={(e) => setFormData({ ...formData, assigned_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={formData.status}
                  onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={formData.notes}
                  onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Asset"}
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
              <h2 className="text-lg font-bold text-gray-800">Update Asset</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Editing: <span className="font-medium text-gray-800">{editItem.name}</span> ({editItem.asset_tag})
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className={`w-full border ${formErrors.name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag *</label>
                  <input
                    type="text"
                    value={editForm.asset_tag}
                    onChange={(e) => setEditForm({ ...editForm, asset_tag: e.target.value })}
                    className={`w-full border ${formErrors.asset_tag ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.asset_tag && <p className="text-red-500 text-xs mt-1">{formErrors.asset_tag}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={editForm.category}
                    onChange={(e) => setEditForm({ ...editForm, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input
                    type="text"
                    value={editForm.serial_number}
                    onChange={(e) => setEditForm({ ...editForm, serial_number: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID</label>
                  <input
                    type="number"
                    min="1"
                    value={editForm.employee_id}
                    onChange={(e) => setEditForm({ ...editForm, employee_id: e.target.value })}
                    className={`w-full border ${formErrors.employee_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.employee_id && <p className="text-red-500 text-xs mt-1">{formErrors.employee_id}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
                  <input
                    type="date"
                    value={editForm.assigned_date}
                    onChange={(e) => setEditForm({ ...editForm, assigned_date: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  value={editForm.status}
                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea
                  rows={2}
                  value={editForm.notes}
                  onChange={(e) => setEditForm({ ...editForm, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              {editItem.created_at && (
                <div className="text-xs text-gray-400">Created: {new Date(editItem.created_at).toLocaleString()}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
