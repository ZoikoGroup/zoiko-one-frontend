import { useState, useEffect, useMemo } from "react";
import HRPage from "../../../components/HRPage";
import {
  getSkills,
  createSkill,
  updateSkill,
  deleteSkill,
  getSkillGapAnalysis,
} from "../../../service/hrService";

const ITEMS_PER_PAGE = 10;

const initialForm = {
  employee_id: "",
  skill_name: "",
  category: "",
  proficiency_level: "3",
};

const TABS = [
  { key: "skills", label: "Employee Skills" },
  { key: "gap", label: "Gap Analysis" },
];

export default function ZoikoHRSkillMatrix({ isTab }) {
  const [activeTab, setActiveTab] = useState("skills");

  const content = (
    <>
      <div className="mb-6 border-b border-gray-200">
        <div className="flex gap-1 overflow-x-auto">
          {TABS.map((t) => (
            <button
              key={t.key}
              onClick={() => setActiveTab(t.key)}
              className={`px-4 py-2.5 text-sm font-medium whitespace-nowrap border-b-2 transition-colors ${
                activeTab === t.key
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      {activeTab === "skills" && <EmployeeSkillsTab />}
      {activeTab === "gap" && <GapAnalysisTab />}
    </>
  );

  if (isTab) {
    return content;
  }

  return (
    <HRPage title="Skill Matrix" subtitle="Track employee skills, proficiency levels, and identify skill gaps.">
      {content}
    </HRPage>
  );
}

function EmployeeSkillsTab() {
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
      const data = await getSkills();
      setItems(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load skills");
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
    const categories = new Set(items.map((s) => s.category).filter(Boolean)).size;
    const employees = new Set(items.map((s) => s.employee_id)).size;
    const avgLevel = items.length > 0
      ? (items.reduce((sum, s) => sum + (s.proficiency_level || 0), 0) / items.length).toFixed(1)
      : "0.0";
    return { total, categories, employees, avgLevel };
  }, [items]);

  const filtered = useMemo(() => {
    let result = items;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((s) => s.skill_name?.toLowerCase().includes(q));
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
    if (!data.skill_name?.trim()) errors.skill_name = "Skill name is required";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await createSkill({
        employee_id: Number(formData.employee_id),
        skill_name: formData.skill_name.trim(),
        category: formData.category.trim() || null,
        proficiency_level: Number(formData.proficiency_level),
      });
      setShowCreateModal(false);
      resetForm();
      await fetchItems();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to create skill" });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (skill) => {
    setEditItem(skill);
    setEditForm({
      employee_id: String(skill.employee_id),
      skill_name: skill.skill_name || "",
      category: skill.category || "",
      proficiency_level: String(skill.proficiency_level || 3),
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
      if (Number(editForm.employee_id) !== editItem.employee_id) payload.employee_id = Number(editForm.employee_id);
      if (editForm.skill_name.trim() !== (editItem.skill_name || "")) payload.skill_name = editForm.skill_name.trim();
      if ((editForm.category.trim() || null) !== (editItem.category || null)) payload.category = editForm.category.trim() || null;
      if (Number(editForm.proficiency_level) !== (editItem.proficiency_level || 0)) payload.proficiency_level = Number(editForm.proficiency_level);
      if (Object.keys(payload).length > 0) {
        await updateSkill(editItem.id, payload);
      }
      setShowEditModal(false);
      setEditItem(null);
      await fetchItems();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to update skill" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      await deleteSkill(id);
      await fetchItems();
    } catch (err) {
      setError(err.message || "Failed to delete skill");
    }
  };

  if (loading && items.length === 0) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading skills...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {formErrors.submit && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">{formErrors.submit}</div>
      )}

      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex flex-wrap gap-3">
          <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
            <span className="text-gray-400">Total Skills: </span>
            <span className="font-bold text-gray-800">{stats.total}</span>
          </div>
          <div className="bg-white px-4 py-2 border border-purple-100 rounded-lg shadow-sm text-sm">
            <span className="text-gray-400">Categories: </span>
            <span className="font-bold text-purple-600">{stats.categories}</span>
          </div>
          <div className="bg-white px-4 py-2 border border-blue-100 rounded-lg shadow-sm text-sm">
            <span className="text-gray-400">Employees: </span>
            <span className="font-bold text-blue-600">{stats.employees}</span>
          </div>
          <div className="bg-white px-4 py-2 border border-green-100 rounded-lg shadow-sm text-sm">
            <span className="text-gray-400">Avg Level: </span>
            <span className="font-bold text-green-600">{stats.avgLevel}</span>
          </div>
        </div>
        <button
          onClick={() => { resetForm(); setShowCreateModal(true); }}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
        >
          + Add Skill
        </button>
      </div>

      {items.length > 0 && (
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search by skill name..."
            value={search}
            onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-64 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      )}

      {filtered.length === 0 && !loading ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="text-4xl mb-3">⚡</div>
          <p className="text-gray-500 font-medium">
            {items.length === 0
              ? "No skills tracked yet. Add your first skill to get started."
              : "No skills match your search criteria."}
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
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Skill Name</th>
                    <th className="text-left px-4 py-3 font-semibold text-gray-600">Category</th>
                    <th className="text-center px-4 py-3 font-semibold text-gray-600">Proficiency Level</th>
                    <th className="text-right px-4 py-3 font-semibold text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {paginated.map((s) => (
                    <tr key={s.id} className="hover:bg-gray-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs font-semibold text-gray-800">{s.employee_id}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{s.skill_name}</td>
                      <td className="px-4 py-3">
                        <span className="text-xs bg-purple-50 text-purple-700 px-2 py-0.5 rounded-full">{s.category || <span className="text-gray-300">-</span>}</span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <div className="flex items-center justify-center gap-1">
                          {[1, 2, 3, 4, 5].map((star) => (
                            <span key={star} className={`text-sm ${star <= s.proficiency_level ? "text-yellow-400" : "text-gray-200"}`}>&#9733;</span>
                          ))}
                        </div>
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

      {showCreateModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add Skill</h2>
              <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
                  <input
                    type="text"
                    value={formData.skill_name}
                    onChange={(e) => setFormData({ ...formData, skill_name: e.target.value })}
                    className={`w-full border ${formErrors.skill_name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.skill_name && <p className="text-red-500 text-xs mt-1">{formErrors.skill_name}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <input
                    type="text"
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                  <select
                    value={formData.proficiency_level}
                    onChange={(e) => setFormData({ ...formData, proficiency_level: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>{l} - {l === 1 ? "Beginner" : l === 2 ? "Elementary" : l === 3 ? "Intermediate" : l === 4 ? "Advanced" : "Expert"}</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Adding..." : "Add Skill"}
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
              <h2 className="text-lg font-bold text-gray-800">Update Skill</h2>
              <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleUpdate} className="p-6 space-y-4">
              <div className="text-sm text-gray-500 mb-1">
                Editing: <span className="font-medium text-gray-800">{editItem.skill_name}</span>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Skill Name *</label>
                  <input
                    type="text"
                    value={editForm.skill_name}
                    onChange={(e) => setEditForm({ ...editForm, skill_name: e.target.value })}
                    className={`w-full border ${formErrors.skill_name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500`}
                  />
                  {formErrors.skill_name && <p className="text-red-500 text-xs mt-1">{formErrors.skill_name}</p>}
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
                  <label className="block text-sm font-medium text-gray-700 mb-1">Proficiency Level</label>
                  <select
                    value={editForm.proficiency_level}
                    onChange={(e) => setEditForm({ ...editForm, proficiency_level: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    {[1, 2, 3, 4, 5].map((l) => (
                      <option key={l} value={l}>{l} - {l === 1 ? "Beginner" : l === 2 ? "Elementary" : l === 3 ? "Intermediate" : l === 4 ? "Advanced" : "Expert"}</option>
                    ))}
                  </select>
                </div>
              </div>
              {editItem.created_at && (
                <div className="text-xs text-gray-400">Created: {new Date(editItem.created_at).toLocaleString()}</div>
              )}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors">
                  {submitting ? "Updating..." : "Update Skill"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function GapAnalysisTab() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const result = await getSkillGapAnalysis();
      setData(Array.isArray(result) ? result : []);
    } catch (err) {
      setError(err.message || "Failed to load gap analysis");
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="flex justify-center items-center py-20">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-500">Loading gap analysis...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      {data.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
          <div className="text-4xl mb-3">📊</div>
          <p className="text-gray-500 font-medium">No gap analysis data available yet.</p>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-gray-100">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Department</th>
                  <th className="text-left px-4 py-3 font-semibold text-gray-600">Skill</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Avg Level</th>
                  <th className="text-center px-4 py-3 font-semibold text-gray-600">Employee Count</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-50">
                {data.map((row, idx) => (
                 <tr key={idx} className="hover:bg-gray-50 transition-colors">
                   <td className="px-4 py-3 font-medium text-gray-800">{row.category || "N/A"}</td>
                   <td className="px-4 py-3 text-gray-700">{row.skill_name || "N/A"}</td>
                   <td className="px-4 py-3 text-center">
                     <div className="flex items-center justify-center gap-2">
                       <div className="w-20 bg-gray-200 rounded-full h-2">
                         <div
                           className="bg-blue-600 h-2 rounded-full"
                           style={{ width: `${Math.min(((row.avg_level || 0) / 5) * 100, 100)}%` }}
                         />
                       </div>
                       <span className="text-xs font-medium text-gray-700">{(row.avg_level || 0).toFixed(1)}</span>
                     </div>
                   </td>
                   <td className="px-4 py-3 text-center">
                     <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                       {row.employee_count || 0}
                     </span>
                   </td>
                 </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
