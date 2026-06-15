import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getDesignations,
  createDesignation,
  updateDesignation,
  deleteDesignation,
  getDesignationById,
  getEmployees,
  getDepartments,
} from "../../../service/hrService";

const STATUS_COLORS = {
  active: "bg-green-100 text-green-800",
  inactive: "bg-gray-100 text-gray-600",
  archived: "bg-red-100 text-red-800",
};

const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];

const LEVEL_COLORS = {
  L1: "bg-blue-100 text-blue-800",
  L2: "bg-indigo-100 text-indigo-800",
  L3: "bg-purple-100 text-purple-800",
  L4: "bg-pink-100 text-pink-800",
  L5: "bg-red-100 text-red-800",
  L6: "bg-orange-100 text-orange-800",
  L7: "bg-yellow-100 text-yellow-800",
  L8: "bg-green-100 text-green-800",
  L9: "bg-teal-100 text-teal-800",
  L10: "bg-cyan-100 text-cyan-800",
};

const ITEMS_PER_PAGE = 10;

const initialForm = {
  title: "",
  department_id: "",
  department_name: "",
  level: "L3",
  description: "",
  status: "active",
};

export default function ZoikoHRDesignations() {
  const [designations, setDesignations] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [levelFilter, setLevelFilter] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});

  const [editForm, setEditForm] = useState({ ...initialForm });

  const fetchDesignations = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getDesignations();
      setDesignations(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load designations");
      setDesignations([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchEmployees = async () => {
    try {
      const data = await getEmployees({ per_page: 200 });
      setEmployees(data.items || []);
    } catch (err) {
      console.error("Failed to load employees:", err);
    }
  };

  const fetchDepartments = async () => {
    try {
      const data = await getDepartments();
      setDepartments(data || []);
    } catch (err) {
      console.error("Failed to load departments:", err);
    }
  };

  useEffect(() => {
    fetchDesignations();
    fetchEmployees();
    fetchDepartments();
  }, []);

  const stats = useMemo(() => {
    const total = designations.length;
    const active = designations.filter((d) => d.status === "active").length;
    const inactive = designations.filter((d) => d.status === "inactive").length;
    const archived = designations.filter((d) => d.status === "archived").length;
    const withDepartments = designations.filter((d) => d.department_id).length;
    const levels = designations.reduce((acc, d) => {
      acc[d.level] = (acc[d.level] || 0) + 1;
      return acc;
    }, {});
    return { total, active, inactive, archived, withDepartments, levels };
  }, [designations]);

  const filtered = useMemo(() => {
    let result = designations;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (d) =>
          d.title?.toLowerCase().includes(q) ||
          d.description?.toLowerCase().includes(q) ||
          d.level?.toLowerCase().includes(q) ||
          d.department_name?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) {
      result = result.filter((d) => d.status === statusFilter);
    }
    if (levelFilter) {
      result = result.filter((d) => d.level === levelFilter);
    }
    if (departmentFilter) {
      result = result.filter((d) => d.department_id === parseInt(departmentFilter));
    }
    return result;
  }, [designations, search, statusFilter, levelFilter, departmentFilter]);

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
    if (!data.title?.trim()) errors.title = "Title is required";
    if (!data.level) errors.level = "Level is required";
    if (!data.department_id) errors.department_id = "Department is required";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      const payload = {
        title: formData.title,
        department_id: parseInt(formData.department_id),
        department_name: formData.department_name,
        level: formData.level,
        description: formData.description || null,
        status: formData.status,
      };
      await createDesignation(payload);
      setShowCreateModal(false);
      resetForm();
      fetchDesignations();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create designation" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (designation) => {
    setEditItem(designation);
    setEditForm({
      title: designation.title,
      department_id: designation.department_id || "",
      department_name: designation.department_name || "",
      level: designation.level || "L3",
      description: designation.description || "",
      status: designation.status || "active",
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
      const payload = {
        title: editForm.title,
        department_id: parseInt(editForm.department_id),
        department_name: editForm.department_name,
        level: editForm.level,
        description: editForm.description || null,
        status: editForm.status,
      };
      await updateDesignation(editItem.id, payload);
      setShowEditModal(false);
      setEditItem(null);
      fetchDesignations();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to update designation" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) return;
    try {
      await deleteDesignation(id);
      fetchDesignations();
    } catch (err) {
      setError(err.message || "Failed to delete designation");
    }
  };

  const openDetailModal = async (id) => {
    setLoading(true);
    try {
      const data = await getDesignationById(id);
      setDetailItem(data);
      setShowDetailModal(true);
    } catch (err) {
      setError(err.message || "Failed to load designation details");
    } finally {
      setLoading(false);
    }
  };

  if (loading && designations.length === 0) {
    return (
      <HRPage title="Designations" subtitle="Manage job titles, roles, and position levels within the organization.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading designations...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Designations" subtitle="Manage job titles, roles, and position levels within the organization.">
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
              <span className="text-gray-400">Active: </span>
              <span className="font-bold text-green-600">{stats.active}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Inactive: </span>
              <span className="font-bold text-gray-600">{stats.inactive}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-red-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">Archived: </span>
              <span className="font-bold text-red-600">{stats.archived}</span>
            </div>
            <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
              <span className="text-gray-400">With Dept: </span>
              <span className="font-bold text-blue-600">{stats.withDepartments}</span>
            </div>
          </div>
          <button
            onClick={() => { resetForm(); setShowCreateModal(true); }}
            className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            + Add Designation
          </button>
        </div>

        {designations.length > 0 && (
          <div className="flex flex-wrap gap-3">
            <input
              type="text"
              placeholder="Search by title, description, level, or department..."
              value={search}
              onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
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
            <select
              value={levelFilter}
              onChange={(e) => { setLevelFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Levels</option>
              {Object.keys(LEVEL_COLORS).map((level) => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
            <select
              value={departmentFilter}
              onChange={(e) => { setDepartmentFilter(e.target.value); setCurrentPage(1); }}
              className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">All Departments</option>
              {departments.map((dept) => (
                <option key={dept.id} value={dept.id}>{dept.name}</option>
              ))}
            </select>
          </div>
        )}

        {filtered.length === 0 && !loading ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <div className="text-4xl mb-3">🏢</div>
            <p className="text-gray-500 font-medium">
              {designations.length === 0
                ? "No designations yet. Add your first designation to get started."
                : "No designations match your search criteria."}
            </p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Title</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Department</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Level</th>
                      <th className="text-left px-4 py-3 font-semibold text-gray-600">Status</th>
                      <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {paginated.map((d) => (
                      <tr key={d.id} className="hover:bg-gray-50 transition-colors">
                        <td className="px-4 py-3 font-medium text-gray-800">
                          <button
                            onClick={() => openDetailModal(d.id)}
                            className="text-blue-600 hover:text-blue-800 hover:underline font-medium"
                          >
                            {d.title}
                          </button>
                        </td>
                        <td className="px-4 py-3 text-gray-700">{d.department_name || <span className="text-gray-300">-</span>}</td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${LEVEL_COLORS[d.level] || "bg-gray-100 text-gray-600"}`}>
                            {d.level}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[d.status] || STATUS_COLORS.active}`}>
                            {d.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <div className="flex items-center justify-end gap-1">
                            <button
                              onClick={() => openDetailModal(d.id)}
                              className="text-blue-600 hover:text-blue-800 text-xs font-medium px-1"
                            >
                              View
                            </button>
                            <button
                              onClick={() => openEditModal(d)}
                              className="text-gray-600 hover:text-gray-800 text-xs font-medium px-1"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(d.id)}
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
              <h2 className="text-lg font-bold text-gray-800">Add Designation</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className={`w-full border ${formErrors.title ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={formData.department_id}
                  onChange={(e) => {
                    const deptId = e.target.value;
                    const dept = departments.find((d) => d.id === parseInt(deptId));
                    setFormData({
                      ...formData,
                      department_id: deptId,
                      department_name: dept ? dept.name : "",
                    });
                  }}
                  className={`w-full border ${formErrors.department_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                {formErrors.department_id && <p className="text-red-500 text-xs mt-1">{formErrors.department_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                <select
                  value={formData.level}
                  onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                  className={`w-full border ${formErrors.level ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {Object.keys(LEVEL_COLORS).map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {formErrors.level && <p className="text-red-500 text-xs mt-1">{formErrors.level}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
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
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{opt.label}</option>
                  ))}
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Creating..." : "Create Designation"}
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
              <h2 className="text-lg font-bold text-gray-800">Edit Designation</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                <input
                  type="text"
                  value={editForm.title}
                  onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                  className={`w-full border ${formErrors.title ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                />
                {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                <select
                  value={editForm.department_id}
                  onChange={(e) => {
                    const deptId = e.target.value;
                    const dept = departments.find((d) => d.id === parseInt(deptId));
                    setEditForm({
                      ...editForm,
                      department_id: deptId,
                      department_name: dept ? dept.name : "",
                    });
                  }}
                  className={`w-full border ${formErrors.department_id ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  <option value="">Select department</option>
                  {departments.map((dept) => (
                    <option key={dept.id} value={dept.id}>{dept.name}</option>
                  ))}
                </select>
                {formErrors.department_id && <p className="text-red-500 text-xs mt-1">{formErrors.department_id}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                <select
                  value={editForm.level}
                  onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                  className={`w-full border ${formErrors.level ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                >
                  {Object.keys(LEVEL_COLORS).map((level) => (
                    <option key={level} value={level}>{level}</option>
                  ))}
                </select>
                {formErrors.level && <p className="text-red-500 text-xs mt-1">{formErrors.level}</p>}
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
              {editItem.created_at && (
                <div className="text-xs text-gray-400">Created: {new Date(editItem.created_at).toLocaleString()}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Designation"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetailModal && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Designation Details</h2>
              <button onClick={() => { setShowDetailModal(false); setDetailItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Designation ID</label>
                  <p className="text-sm text-gray-900 font-mono">#{detailItem.id}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Title</label>
                  <p className="text-sm text-gray-900 font-medium">{detailItem.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Department</label>
                  <p className="text-sm text-gray-900">{detailItem.department_name || <span className="text-gray-400">-</span>}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Level</label>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${LEVEL_COLORS[detailItem.level] || "bg-gray-100 text-gray-600"}`}>
                    {detailItem.level}
                  </span>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-sm text-gray-700">{detailItem.description || <span className="text-gray-400">-</span>}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_COLORS[detailItem.status] || STATUS_COLORS.active}`}>
                    {detailItem.status}
                  </span>
                </div>
                {detailItem.created_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                    <p className="text-sm text-gray-600">{new Date(detailItem.created_at).toLocaleString()}</p>
                  </div>
                )}
                {detailItem.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Updated</label>
                    <p className="text-sm text-gray-600">{new Date(detailItem.updated_at).toLocaleString()}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => { setShowDetailModal(false); setDetailItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HRPage>
  );
}
