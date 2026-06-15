import { useState } from "react";
import { Plus, Download } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useDesignations } from "../hooks/useDesignation";
import { formatDate, formatCurrency, levelColor } from "../utils/helpers";

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

const emptyForm = { title: "", department: "", level: "L3", description: "", status: "active" };

export default function DesignationList() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", level: "", department: "" });
  const { data, loading } = useDesignations({ search, ...filters });
  const [page, setPage] = useState(1);
  const [showCreate, setShowCreate] = useState(false);
  const [showEdit, setShowEdit] = useState(false);
  const [showDetail, setShowDetail] = useState(false);
  const [detailItem, setDetailItem] = useState(null);
  const [editItem, setEditItem] = useState(null);
  const [form, setForm] = useState({ ...emptyForm });
  const [editForm, setEditForm] = useState({ ...emptyForm });
  const [formErrors, setFormErrors] = useState({});

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setPage(1);
  };

  const totalPages = Math.max(1, Math.ceil(data.length / ITEMS_PER_PAGE));
  const safePage = Math.min(page, totalPages);
  const paginated = data.slice((safePage - 1) * ITEMS_PER_PAGE, safePage * ITEMS_PER_PAGE);

  const total = data.length;
  const active = data.filter((d) => d.status === "active").length;
  const inactive = data.filter((d) => d.status === "inactive").length;
  const archived = data.filter((d) => d.status === "archived").length;

  const validate = (d) => {
    const e = {};
    if (!d.title?.trim()) e.title = "Title is required";
    if (!d.department) e.department = "Department is required";
    if (!d.level) e.level = "Level is required";
    return e;
  };

  const handleCreate = (e) => {
    e.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowCreate(false);
    setForm({ ...emptyForm });
    setFormErrors({});
  };

  const openEdit = (item) => {
    setEditItem(item);
    setEditForm({
      title: item.title,
      department: item.department_name,
      level: item.level,
      description: item.description || "",
      status: item.status,
    });
    setFormErrors({});
    setShowEdit(true);
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    const errors = validate(editForm);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowEdit(false);
    setEditItem(null);
    setFormErrors({});
  };

  const handleDelete = (id) => {
    if (!window.confirm("Are you sure you want to delete this designation?")) return;
  };

  const columns = [
    { key: "title", label: "Title", render: (v, row) => (
      <button onClick={() => { setDetailItem(row); setShowDetail(true); }} className="text-orange-600 hover:text-orange-800 hover:underline font-medium text-left">
        {v}
      </button>
    )},
    { key: "department_name", label: "Department" },
    { key: "level", label: "Level", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelColor(v)}`}>{v}</span> },
    { key: "salary", label: "Salary Range", render: (v, row) => <span className="text-xs font-mono">{formatCurrency(row.min_salary)} - {formatCurrency(row.max_salary)}</span> },
    { key: "employees_count", label: "Employees", render: (v) => <span className="font-medium">{v}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "actions", label: "Actions", render: (v, row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(row)} className="text-xs text-gray-500 hover:text-gray-800 font-medium">Edit</button>
        <button onClick={() => handleDelete(row.id)} className="text-xs text-red-500 hover:text-red-700 font-medium">Delete</button>
      </div>
    )},
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading designations...</div>;

  return (
    <div className="space-y-6">
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

      <FilterBar
        search={search}
        onSearchChange={(v) => { setSearch(v); setPage(1); }}
        filters={[
          { key: "status", placeholder: "All Statuses", value: filters.status, options: STATUS_OPTIONS },
          { key: "level", placeholder: "All Levels", value: filters.level, options: LEVEL_OPTIONS },
          { key: "department", placeholder: "All Departments", value: filters.department, options: DEPT_OPTIONS },
        ]}
        onFilterChange={handleFilterChange}
      />

      <DataTable columns={columns} data={paginated} />

      {totalPages > 1 && (
        <div className="flex justify-between items-center">
          <span className="text-xs text-gray-400">
            Showing {(safePage - 1) * ITEMS_PER_PAGE + 1}-{Math.min(safePage * ITEMS_PER_PAGE, data.length)} of {data.length}
          </span>
          <div className="flex gap-1">
            <button onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={safePage <= 1}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Prev</button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button key={p} onClick={() => setPage(p)}
                className={`px-3 py-1 text-sm border rounded-lg ${p === safePage ? "bg-orange-600 text-white border-orange-600" : "border-gray-200 hover:bg-gray-50"}`}>{p}</button>
            ))}
            <button onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={safePage >= totalPages}
              className="px-3 py-1 text-sm border border-gray-200 rounded-lg disabled:opacity-40 hover:bg-gray-50">Next</button>
          </div>
        </div>
      )}

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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
                <select value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                  className={`w-full border ${formErrors.department ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}>
                  <option value="">Select department</option>
                  {DEPT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
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

      {showEdit && editItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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
                <select value={editForm.department} onChange={(e) => setEditForm({ ...editForm, department: e.target.value })}
                  className={`w-full border ${formErrors.department ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500`}>
                  <option value="">Select department</option>
                  {DEPT_OPTIONS.map((opt) => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
                </select>
                {formErrors.department && <p className="text-red-500 text-xs mt-1">{formErrors.department}</p>}
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
              {editItem.created_at && <div className="text-xs text-gray-400">Created: {formatDate(editItem.created_at)}</div>}
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowEdit(false); setEditItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium transition-colors">Update Designation</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showDetail && detailItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
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
                  <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${levelColor(detailItem.level)}`}>{detailItem.level}</span>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Salary Range</label>
                  <p className="text-sm text-gray-900">{formatCurrency(detailItem.min_salary)} - {formatCurrency(detailItem.max_salary)}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Employees</label>
                  <p className="text-sm text-gray-900">{detailItem.employees_count}</p>
                </div>
                <div className="col-span-2">
                  <label className="block text-sm font-medium text-gray-500 mb-1">Description</label>
                  <p className="text-sm text-gray-700">{detailItem.description || "-"}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Status</label>
                  <StatusBadge status={detailItem.status} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-1">Created</label>
                  <p className="text-sm text-gray-600">{formatDate(detailItem.created_at)}</p>
                </div>
                {detailItem.updated_at && (
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-1">Updated</label>
                    <p className="text-sm text-gray-600">{formatDate(detailItem.updated_at)}</p>
                  </div>
                )}
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <button onClick={() => { setShowDetail(false); setDetailItem(null); }} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Close</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
