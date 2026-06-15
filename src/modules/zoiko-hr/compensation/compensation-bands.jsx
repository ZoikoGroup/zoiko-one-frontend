import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";

const ITEMS_PER_PAGE = 8;

const mockData = [
  { id: 1, band: "A", min: 30000, max: 60000, level: "Entry" },
  { id: 2, band: "B", min: 60001, max: 100000, level: "Junior" },
  { id: 3, band: "C", min: 100001, max: 150000, level: "Mid" },
  { id: 4, band: "D", min: 150001, max: 250000, level: "Senior" },
  { id: 5, band: "E", min: 250001, max: 500000, level: "Executive" },
];

const initialForm = {
  band: "",
  min: "",
  max: "",
  level: "",
};

export default function CompensationBandsPage() {
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
    const highestMax = items.reduce((max, i) => Math.max(max, i.max || 0), 0);
    return { total, highestMax };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (i) =>
          i.band?.toLowerCase().includes(q) ||
          i.level?.toLowerCase().includes(q)
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

  let nextId = useMemo(() => Math.max(0, ...items.map((i) => i.id)) + 1, [items]);

  const resetForm = () => setFormData({ ...initialForm });

  const validateForm = (data) => {
    const errors = {};
    if (!data.band?.trim()) errors.band = "Band is required";
    if (!data.min || isNaN(parseFloat(data.min)) || parseFloat(data.min) < 0) errors.min = "Valid min is required";
    if (!data.max || isNaN(parseFloat(data.max)) || parseFloat(data.max) < 0) errors.max = "Valid max is required";
    if (parseFloat(data.min) > parseFloat(data.max)) errors.max = "Max must be greater than min";
    if (!data.level?.trim()) errors.level = "Level is required";
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
        band: formData.band.trim(),
        min: parseFloat(formData.min),
        max: parseFloat(formData.max),
        level: formData.level.trim(),
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
      band: item.band || "",
      min: String(item.min || ""),
      max: String(item.max || ""),
      level: item.level || "",
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
                band: editForm.band.trim(),
                min: parseFloat(editForm.min),
                max: parseFloat(editForm.max),
                level: editForm.level.trim(),
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
    if (!window.confirm("Are you sure you want to delete this compensation band?")) return;
    setItems((prev) => prev.filter((i) => i.id !== id));
  };

  if (loading) {
    return (
      <HRPage title="Compensation Bands" subtitle="Define compensation band ranges and levels.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading compensation bands...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Compensation Bands" subtitle="Define compensation band ranges and levels.">
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
              <span className="text-gray-400">Highest Band Max: </span>
              <span className="font-bold text-purple-600">${stats.highestMax.toLocaleString()}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Band
          </button>
        </div>

        {items.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by band or level..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">📋</div>
            <p className="text-gray-500 font-medium">
              {items.length === 0
                ? "No compensation bands yet. Add your first band to get started."
                : "No bands match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Band</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Min</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Max</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Level</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Range Width</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((i) => (
                      <tr key={i.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-mono text-xs font-semibold text-blue-600">{i.band}</td>
                        <td className="px-4 py-3 text-gray-700">${i.min.toLocaleString()}</td>
                        <td className="px-4 py-3 text-gray-700">${i.max.toLocaleString()}</td>
                        <td className="px-4 py-3">
                          <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {i.level}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-700">${(i.max - i.min).toLocaleString()}</td>
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
              <h2 className="text-lg font-bold text-gray-800">Add Compensation Band</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Band *</label>
                <input
                  type="text"
                  value={formData.band}
                  onChange={(e) => setFormData({ ...formData, band: e.target.value })}
                  className={`w-full border ${formErrors.band ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.band && <p className="text-red-500 text-xs mt-1">{formErrors.band}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.min}
                    onChange={(e) => setFormData({ ...formData, min: e.target.value })}
                    className={`w-full border ${formErrors.min ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.min && <p className="text-red-500 text-xs mt-1">{formErrors.min}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={formData.max}
                    onChange={(e) => setFormData({ ...formData, max: e.target.value })}
                    className={`w-full border ${formErrors.max ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.max && <p className="text-red-500 text-xs mt-1">{formErrors.max}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                <input
                  type="text"
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className={`w-full border ${formErrors.level ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.level && <p className="text-red-500 text-xs mt-1">{formErrors.level}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Band"}
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
              <h2 className="text-lg font-bold text-gray-800">Update Compensation Band</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Editing: <span className="font-medium text-gray-800">Band {editItem.band}</span> ({editItem.level})
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Band *</label>
                <input
                  type="text"
                  value={editForm.band}
                  onChange={(e) => setEditForm({ ...editForm, band: e.target.value })}
                  className={`w-full border ${formErrors.band ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.band && <p className="text-red-500 text-xs mt-1">{formErrors.band}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Min *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.min}
                    onChange={(e) => setEditForm({ ...editForm, min: e.target.value })}
                    className={`w-full border ${formErrors.min ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.min && <p className="text-red-500 text-xs mt-1">{formErrors.min}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max *</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editForm.max}
                    onChange={(e) => setEditForm({ ...editForm, max: e.target.value })}
                    className={`w-full border ${formErrors.max ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.max && <p className="text-red-500 text-xs mt-1">{formErrors.max}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                <input
                  type="text"
                  value={editForm.level}
                  onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                  className={`w-full border ${formErrors.level ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.level && <p className="text-red-500 text-xs mt-1">{formErrors.level}</p>}
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Band"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </HRPage>
  );
}
