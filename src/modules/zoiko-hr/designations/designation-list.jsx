import { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Download, RefreshCw } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { 
  getDesignations, 
  createDesignation, 
  updateDesignation, 
  deleteDesignation 
} from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/designations" },
  { label: "Designation List", href: "/zoiko-hr/designations/list" },
  { label: "Designation Structure", href: "/zoiko-hr/designations/levels" },
  { label: "Reports", href: "/zoiko-hr/designations/reports" },
  { label: "Settings", href: "/zoiko-hr/designations/settings" },
];

const LEVEL_OPTIONS = ["L1", "L2", "L3", "L4", "L5", "L6", "L7", "L8", "L9", "L10"].map((l) => ({ value: l, label: l }));
const STATUS_OPTIONS = [
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "archived", label: "Archived" },
];
const DEPT_OPTIONS = [
  { value: "Engineering", label: "Engineering" },
  { value: "Product", label: "Product" },
  { value: "Marketing", label: "Marketing" },
  { value: "Sales", label: "Sales" },
  { value: "HR", label: "HR" },
  { value: "Finance", label: "Finance" },
];
const ITEMS_PER_PAGE = 10;

const emptyForm = { title: "", department_name: "", level: "L3", description: "", status: "active" };

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/designations"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function DesignationList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", level: "", department: "" });
  const [page, setPage] = useState(1);
  
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  
  const [form, setForm] = useState({ ...emptyForm });
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});

  // ── GET OPERATION (FETCH ALL) ───────────────────────────────────
  const fetchDesignations = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await getDesignations();
      setRecords(Array.isArray(response) ? response : []);
    } catch (err) {
      setError(err.message || "Failed to load designations");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDesignations();
  }, []);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  // Local filtering & Searching mechanics
  const filteredRecords = useMemo(() => {
    return records.filter((item) => {
      const matchesSearch = !search ? true : item.title?.toLowerCase().includes(search.toLowerCase());
      const matchesStatus = !filters.status ? true : item.status === filters.status;
      const matchesLevel = !filters.level ? true : item.level === filters.level;
      const matchesDept = !filters.department ? true : item.department_name === filters.department;
      return matchesSearch && matchesStatus && matchesLevel && matchesDept;
    });
  }, [records, search, filters]);

  const totalPages = Math.max(1, Math.ceil(filteredRecords.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = filteredRecords.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const total = filteredRecords.length;
  const active = filteredRecords.filter((d) => d.status === "active").length;
  const inactive = filteredRecords.filter((d) => d.status === "inactive").length;
  const archived = filteredRecords.filter((d) => d.status === "archived").length;

  const validate = (d) => {
    const e = {};
    if (!d.title?.trim()) e.title = "Title is required";
    if (!d.department_name) e.department_name = "Department is required";
    if (!d.level) e.level = "Level is required";
    return e;
  };

  // ── POST OPERATION (CREATE) ─────────────────────────────────────
  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      await createDesignation(form);
      setShowCreate(false);
      setForm({ ...emptyForm });
      setFormErrors({});
      await fetchDesignations(); // Refresh list cleanly
    } catch (err) {
      alert("Error creating designation: " + err.message);
      setLoading(false);
    }
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      department_name: item.department_name,
      level: item.level,
      description: item.description || "",
      status: item.status,
    });
    setFormErrors({});
    setShowEdit(true);
  };

  // ── PUT OPERATION (UPDATE) ──────────────────────────────────────
  const handleUpdate = async (e) => {
    e.preventDefault();
    const errors = validate(editForm);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    try {
      setLoading(true);
      await updateDesignation(editItem.id, editForm);
      setShowEdit(false);
      setEditItem(null);
      setFormErrors({});
      await fetchDesignations(); // Refresh list cleanly
    } catch (err) {
      alert("Error updating designation: " + err.message);
      setLoading(false);
    }
  };

  // ── DELETE OPERATION (DELETE) ───────────────────────────────────
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) return;
    try {
      setLoading(true);
      await deleteDesignation(id);
      await fetchDesignations(); // Refresh list cleanly
    } catch (err) {
      alert("Error deleting designation: " + err.message);
      setLoading(false);
    }
  };

  if (loading && records.length === 0) {
    return <div className="p-6 text-gray-500 animate-pulse">Loading designations...</div>;
  }

  return (
    <HRPage title="Designations" subtitle="Manage job titles, roles, and position levels">
      <SubNav />
      <div className="space-y-6">
        
        {error && (
          <div className="p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span><strong>Error:</strong> {error}</span>
            <button onClick={fetchDesignations} className="p-1 bg-white border border-red-300 rounded shadow-sm hover:bg-red-100 transition-colors"><RefreshCw className="w-4 h-4 text-red-700" /></button>
          </div>
        )}

        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Designations</h1>
            <p className="text-sm text-gray-500 mt-1">Manage job titles, roles, and position levels</p>
          </div>
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
              <Download className="w-4 h-4" /> Export
            </button>
            <button onClick={() => { setForm({ ...emptyForm }); setFormErrors({}); setShowCreate(true); }} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
              <Plus className="w-4 h-4" /> Add Designation
            </button>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
            <span className="text-gray-400">Total: </span><span className="font-bold text-gray-800">{total}</span>
          </div>
          <div className="bg-white px-4 py-2 border border-green-100 rounded-lg shadow-sm text-sm">
            <span className="text-gray-400">Active: </span><span className="font-bold text-green-600">{active}</span>
          </div>
          <div className="bg-white px-4 py-2 border border-gray-100 rounded-lg shadow-sm text-sm">
            <span className="text-gray-400">Inactive: </span><span className="font-bold text-gray-600">{inactive}</span>
          </div>
          <div className="bg-white px-4 py-2 border border-red-100 rounded-lg shadow-sm text-sm">
            <span className="text-gray-400">Archived: </span><span className="font-bold text-red-600">{archived}</span>
          </div>
        </div>

        {/* Real Dynamic Filter Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-3 bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
          <input type="text" placeholder="Search title..." value={search} onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:outline-none" />
          <select value={filters.status} onChange={(e) => handleFilterChange("status", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
            <option value="">All Statuses</option>
            {STATUS_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={filters.level} onChange={(e) => handleFilterChange("level", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
            <option value="">All Levels</option>
            {LEVEL_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
          <select value={filters.department} onChange={(e) => handleFilterChange("department", e.target.value)}
            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
            <option value="">All Departments</option>
            {DEPT_OPTIONS.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
          </select>
        </div>

        {/* Interactive Data Table Component */}
        <div className="overflow-x-auto rounded-xl border border-gray-200 bg-white shadow-sm">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Title</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Department</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Level</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Salary Range</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Employees</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Status</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100 bg-white">
              {paginated.map((row) => (
                <tr key={row.id} className="hover:bg-gray-50/70 transition-colors">
                  <td className="px-6 py-4">
                    <button onClick={() => { setDetailItem(row); setShowDetail(true); }} className="text-orange-600 hover:text-orange-800 hover:underline font-medium text-left">
                      {row.title}
                    </button>
                  </td>
                  <td className="px-6 py-4 text-gray-700">{row.department_name || "N/A"}</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">{row.level}</span>
                  </td>
                  <td className="px-6 py-4 font-mono text-xs text-gray-500">
                    {row.min_salary != null && row.max_salary != null ? `${row.min_salary} - ${row.max_salary}` : "Not Configured"}
                  </td>
                  <td className="px-6 py-4 font-medium text-gray-900">{row.employees_count ?? 0}</td>
                  <td className="px-6 py-4">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${row.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{row.status}</span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <button onClick={() => openEdit(row)} className="text-xs text-blue-600 hover:text-blue-800 font-medium">Edit</button>
                      <button onClick={() => handleDelete(row.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
              {paginated.length === 0 && (
                <tr>
                  <td colSpan="7" className="px-6 py-10 text-center text-gray-400">No matching designations discovered.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center bg-white p-4 rounded-xl border border-gray-200 shadow-sm">
            <span className="text-xs text-gray-400">
              Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filteredRecords.length)} of {filteredRecords.length}
            </span>
            <div className="flex gap-1">
              <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all">Prev</button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <button key={p} onClick={() => setPage(p)}
                  className={`px-3 py-1 text-sm border rounded-lg ${p === safePage ? "bg-orange-600 text-white border-orange-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
              ))}
              <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
                className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50 transition-all">Next</button>
            </div>
          </div>
        )}

        {/* ── CREATE MODAL ── */}
        {showCreate && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Add Designation</h2>
                <button onClick={() => { setShowCreate(false); setForm({ ...emptyForm }); setFormErrors({}); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className={`w-full border ${formErrors.title ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`} />
                  {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select value={form.department_name} onChange={(e) => setForm({ ...form, department_name: e.target.value })}
                    className={`w-full border ${formErrors.department_name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}>
                    <option value="">Select department</option>
                    {DEPT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  {formErrors.department_name && <p className="text-red-500 text-xs mt-1">{formErrors.department_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <select value={form.level} onChange={(e) => setForm({ ...form, level: e.target.value })}
                    className={`w-full border ${formErrors.level ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}>
                    {LEVEL_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  {formErrors.level && <p className="text-red-500 text-xs mt-1">{formErrors.level}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                    {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowCreate(false); setForm({ ...emptyForm }); setFormErrors({}); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">Create Designation</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── EDIT MODAL ── */}
        {showEdit && editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Edit Designation</h2>
                <button onClick={() => { setShowEdit(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
                  <input type="text" value={editForm.title} onChange={(e) => setEditForm({ ...editForm, title: e.target.value })}
                    className={`w-full border ${formErrors.title ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`} />
                  {formErrors.title && <p className="text-red-500 text-xs mt-1">{formErrors.title}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
                  <select value={editForm.department_name} onChange={(e) => setEditForm({ ...editForm, department_name: e.target.value })}
                    className={`w-full border ${formErrors.department_name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}>
                    <option value="">Select department</option>
                    {DEPT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  {formErrors.department_name && <p className="text-red-500 text-xs mt-1">{formErrors.department_name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Level *</label>
                  <select value={editForm.level} onChange={(e) => setEditForm({ ...editForm, level: e.target.value })}
                    className={`w-full border ${formErrors.level ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}>
                    {LEVEL_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                  {formErrors.level && <p className="text-red-500 text-xs mt-1">{formErrors.level}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={2} value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                    {STATUS_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                  </select>
                </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowEdit(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">Update Designation</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* ── DETAIL MODAL ── */}
        {showDetail && detailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Designation Details</h2>
                <button onClick={() => { setShowDetail(false); setDetailItem(null); }} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
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
                    <p className="text-sm text-gray-900">{detailItem.department_name || "-"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Level</label>
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-orange-100 text-orange-800">{detailItem.level}</span>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Salary Range</label>
                    <p className="text-sm text-gray-900 font-mono">{detailItem.min_salary ?? "N/A"} - {detailItem.max_salary ?? "N/A"}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Employees</label>
                    <p className="text-sm text-gray-900 font-semibold">{detailItem.employees_count ?? 0}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <p className="capitalize text-sm font-medium text-gray-900">{detailItem.status}</p>
                  </div>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-sm text-gray-700 bg-gray-50 p-3 rounded-lg border border-gray-100">{detailItem.description || "No description provided."}</p>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => { setShowDetail(false); setDetailItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}