import { useState, useMemo, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Pencil, Trash2, Building2, Users, CircleDollarSign, UserX, Search, X } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getDepartments } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/departments" },
  { label: "Department List", href: "/zoiko-hr/departments/list" },
  { label: "Department Structure", href: "/zoiko-hr/departments/structure" },
  { label: "Reports", href: "/zoiko-hr/departments/reports" },
  { label: "Settings", href: "/zoiko-hr/departments/settings" },
];

const ITEMS_PER_PAGE = 10;

const initialForm = { name: "", code: "", description: "", head: "", budget: "", status: "active" };

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/departments"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-rose-600 border-b-2 border-rose-600 bg-rose-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function DepartmentList() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [editItem, setEditItem] = useState(null);
  const [detailItem, setDetailItem] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState({ ...initialForm });
  const [editForm, setEditForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});

  useEffect(() => {
    let mounted = true;
    getDepartments()
      .then((data) => { if (mounted) setRecords(Array.isArray(data) ? data : []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const stats = useMemo(() => {
    const total = records.length;
    const active = records.filter((d) => d.status === "active").length;
    const totalEmployees = records.reduce((s, d) => s + (d.employee_count || 0), 0);
    const totalBudget = records.reduce((s, d) => s + (d.budget || 0), 0);
    const withoutHeads = records.filter((d) => !d.head).length;
    return { total, active, totalEmployees, totalBudget, withoutHeads };
  }, [records]);

  const filtered = useMemo(() => {
    let result = records;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((d) => d.name.toLowerCase().includes(q) || d.code.toLowerCase().includes(q) || (d.head && d.head.toLowerCase().includes(q)));
    }
    if (statusFilter) result = result.filter((d) => d.status === statusFilter);
    return result;
  }, [records, search, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / ITEMS_PER_PAGE));
  const safePage = Math.min(currentPage, totalPages);
  const paginated = useMemo(() => {
    const start = (safePage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, safePage]);

  useEffect(() => { if (currentPage > totalPages) setCurrentPage(totalPages); }, [totalPages, currentPage]);

  const resetForm = () => setFormData({ ...initialForm });
  const validateForm = (data) => {
    const errors = {};
    if (!data.name?.trim()) errors.name = "Name is required";
    if (!data.code?.trim()) errors.code = "Code is required";
    if (data.budget && isNaN(parseFloat(data.budget))) errors.budget = "Must be a valid number";
    return errors;
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    const errors = validateForm(formData);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      await fetch("http://localhost:3000/hr/departments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...formData, budget: formData.budget ? parseFloat(formData.budget) : null, description: formData.description.trim() || null, head: formData.head.trim() || null }),
      });
      setShowCreateModal(false);
      resetForm();
      const data = await getDepartments();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const openEditModal = (department) => {
    setEditItem(department);
    setEditForm({ name: department.name || "", code: department.code || "", description: department.description || "", head: department.head || "", budget: department.budget || "", status: department.status || "active" });
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
      await fetch(`http://localhost:3000/hr/departments/${editItem.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...editForm, budget: editForm.budget ? parseFloat(editForm.budget) : null, description: editForm.description.trim() || null, head: editForm.head.trim() || null }),
      });
      setShowEditModal(false);
      setEditItem(null);
      const data = await getDepartments();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setFormErrors({ submit: err.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this department?")) return;
    try {
      await fetch(`http://localhost:3000/hr/departments/${id}`, { method: "DELETE" });
      const data = await getDepartments();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const openDetailModal = async (id) => {
    try {
      const res = await fetch(`http://localhost:3000/hr/departments/${id}`);
      const item = await res.json();
      setDetailItem(item);
      setShowDetailModal(true);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading && records.length === 0) return <div className="p-6 text-gray-400">Loading departments...</div>;

  const statusOptions = [
    { value: "active", label: "Active" },
    { value: "inactive", label: "Inactive" },
    { value: "archived", label: "Archived" },
  ];

  const columns = [
    { key: "code", label: "Code", render: (v) => <span className="font-mono text-xs font-semibold text-rose-600">{v}</span> },
    { key: "name", label: "Name", render: (v, row) => <button onClick={() => openDetailModal(row.id)} className="text-rose-600 hover:text-rose-800 hover:underline font-medium">{v}</button> },
    { key: "head", label: "Head", render: (v) => v || <span className="text-gray-300">-</span> },
    { key: "employee_count", label: "Employees", render: (v) => <span className="font-medium">{v || 0}</span> },
    { key: "budget", label: "Budget", render: (v) => `$${v?.toLocaleString() || "0"}` },
    { key: "status", label: "Status", render: (v) => <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${v === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{v}</span> },
    { key: "actions", label: "Actions", render: (_, row) => (
      <div className="flex items-center gap-2">
        <button onClick={(e) => { e.stopPropagation(); openEditModal(row); }} className="p-1 text-gray-400 hover:text-rose-600 transition-colors"><Pencil className="w-4 h-4" /></button>
        <button onClick={(e) => { e.stopPropagation(); handleDelete(row.id); }} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  return (
    <HRPage title="Department List" subtitle="Manage all departments in the organization">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Department List</h1>
            <p className="text-sm text-gray-500 mt-1">Manage all departments in the organization</p>
          </div>
          <button onClick={() => { resetForm(); setShowCreateModal(true); }} className="flex items-center gap-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 text-sm font-medium transition-colors">
            <Plus className="w-4 h-4" /> Add Department
          </button>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total</p>
                <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg"><Building2 className="w-5 h-5 text-rose-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Active</p>
                <p className="text-2xl font-bold text-gray-900">{stats.active}</p>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg"><Building2 className="w-5 h-5 text-rose-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Employees</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalEmployees}</p>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg"><Users className="w-5 h-5 text-rose-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">${(stats.totalBudget / 1000000).toFixed(1)}M</p>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg"><CircleDollarSign className="w-5 h-5 text-rose-600" /></div>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm text-gray-500 font-medium">Without Heads</p>
                <p className="text-2xl font-bold text-gray-900">{stats.withoutHeads}</p>
              </div>
              <div className="p-2 bg-rose-50 rounded-lg"><UserX className="w-5 h-5 text-rose-600" /></div>
            </div>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search by name, code, or head..." value={search} onChange={(e) => { setSearch(e.target.value); setCurrentPage(1); }}
              className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500" />
          </div>
          <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
            className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/20 focus:border-rose-500">
            <option value="">All Statuses</option>
            {statusOptions.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
          </select>
        </div>

        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
            <Building2 className="w-12 h-12 text-gray-300 mx-auto mb-3" />
            <p className="text-gray-500 font-medium">{records.length === 0 ? "No departments yet. Add your first department to get started." : "No departments match your search criteria."}</p>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-xl border border-gray-200 p-5">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">All Departments</h2>
              <div className="overflow-x-auto rounded-lg border border-gray-200">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      {columns.map((col) => (
                        <th key={col.key} className="px-4 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider">{col.label}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-100">
                    {paginated.map((row, i) => (
                      <tr key={row.id ?? i} className="hover:bg-rose-50/50 transition-colors cursor-pointer" onClick={() => openDetailModal(row.id)}>
                        {columns.map((col) => (
                          <td key={col.key} className="px-4 py-3 text-sm text-gray-700 whitespace-nowrap">{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {totalPages > 1 && (
                <div className="flex justify-between items-center mt-4 pt-4 border-t border-gray-100">
                  <span className="text-xs text-gray-400">Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, filtered.length)} of {filtered.length}</span>
                  <div className="flex gap-1">
                    <button onClick={() => setCurrentPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                      <button key={p} onClick={() => setCurrentPage(p)} className={`px-3 py-1 text-sm border rounded-lg ${p === safePage ? "bg-rose-600 text-white border-rose-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
                    ))}
                    <button onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages} className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
                  </div>
                </div>
              )}
            </div>
          </>
        )}

        {showCreateModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div classKey="create-modal" className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Add Department</h2>
                <button onClick={() => { setShowCreateModal(false); resetForm(); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleCreate} className="p-6 space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className={`w-full border ${formErrors.name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500`} />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Code *</label>
                  <input type="text" value={formData.code} onChange={(e) => setFormData({ ...formData, code: e.target.value })} className={`w-full border ${formErrors.code ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500`} />
                  {formErrors.code && <p className="text-red-500 text-xs mt-1">{formErrors.code}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                  <textarea rows={2} value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department Head</label>
                  <input type="text" value={formData.head} onChange={(e) => setFormData({ ...formData, head: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Budget</label>
                  <input type="number" step="0.01" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} className={`w-full border ${formErrors.budget ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500`} />
                  {formErrors.budget && <p className="text-red-500 text-xs mt-1">{formErrors.budget}</p>}
                </div>
                 <div>
                   <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                   <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                     {statusOptions.map((opt) => (
                       <option key={opt.value} value={opt.value}>{opt.label}</option>
                     ))}
                   </select>
                 </div>
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowCreateModal(false); resetForm(); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-lg font-medium transition-colors">{submitting ? "Creating..." : "Create Department"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showEditModal && editItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Update Department</h2>
                <button onClick={() => { setShowEditModal(false); setEditItem(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <form onSubmit={handleUpdate} className="p-6 space-y-4">
                <div className="text-sm text-gray-500 mb-1">Editing: <span className="font-medium text-gray-800">{editItem.name}</span> ({editItem.code})</div>
                {["name", "code", "description", "head", "budget", "status"].map((field) => (
                  <div key={field}>
                    <label className="block text-sm font-medium text-gray-700 mb-1 capitalize">{field.replace("_", " ")}{field === "name" || field === "code" ? " *" : ""}</label>
                    {field === "description" ? (
                      <textarea rows={2} value={editForm[field]} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500" />
                    ) : field === "status" ? (
                      <select value={editForm.status} onChange={(e) => setEditForm({ ...editForm, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500">
                        {statusOptions.map((opt) => (
                          <option key={opt.value} value={opt.value}>{opt.label}</option>
                        ))}
                      </select>
                    ) : (
                      <input type={field === "budget" ? "number" : "text"} step={field === "budget" ? "0.01" : undefined} value={editForm[field]} onChange={(e) => setEditForm({ ...editForm, [field]: e.target.value })} className={`w-full border ${formErrors[field] ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-rose-500`} />
                    )}
                    {formErrors[field] && <p className="text-red-500 text-xs mt-1">{formErrors[field]}</p>}
                  </div>
                ))}
                {editItem.created_at && <div className="text-xs text-gray-400">Created: {new Date(editItem.created_at).toLocaleString()}</div>}
                <div className="flex justify-end gap-3 pt-2">
                  <button type="button" onClick={() => { setShowEditModal(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting} className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 disabled:bg-rose-400 text-white rounded-lg font-medium transition-colors">{submitting ? "Updating..." : "Update Department"}</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {showDetailModal && detailItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl mx-4 max-h-[90vh] overflow-y-auto">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Department Details</h2>
                <button onClick={() => { setShowDetailModal(false); setDetailItem(null); }} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Department ID</label>
                    <p className="text-sm text-gray-900 font-mono">#{detailItem.id}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Code</label>
                    <p className="text-sm text-gray-900 font-mono">{detailItem.code}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Name</label>
                    <p className="text-sm text-gray-900 font-medium">{detailItem.name}</p>
                  </div>
                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                    <p className="text-sm text-gray-700">{detailItem.description || <span className="text-gray-400">-</span>}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Department Head</label>
                    <p className="text-sm text-gray-900">{detailItem.head || <span className="text-gray-400">-</span>}</p>
                    {detailItem.head_title && <p className="text-xs text-gray-400">{detailItem.head_title}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Employees</label>
                    <p className="text-sm text-gray-900 font-medium">{detailItem.employee_count}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Budget</label>
                    <p className="text-sm text-gray-900 font-semibold">{detailItem.budget}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${detailItem.status === "active" ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"}`}>{detailItem.status}</span>
                  </div>
                </div>
                <div className="pt-4 border-t border-gray-100">
                  <h3 className="text-sm font-medium text-gray-500 mb-2">Timeline</h3>
                  <div className="space-y-1 text-xs text-gray-600">
                    <div>Created: {detailItem.created_at ? new Date(detailItem.created_at).toLocaleString() : <span className="text-gray-400">-</span>}</div>
                    <div>Updated: {detailItem.updated_at ? new Date(detailItem.updated_at).toLocaleString() : <span className="text-gray-400">-</span>}</div>
                  </div>
                </div>
                <div className="flex justify-end gap-3 pt-4">
                  <button onClick={() => { setShowDetailModal(false); setDetailItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
                  <button onClick={() => { setShowDetailModal(false); setDetailItem(null); openEditModal(detailItem); }} className="px-4 py-2 text-sm bg-rose-600 hover:bg-rose-700 text-white rounded-lg font-medium transition-colors">Edit Department</button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}
