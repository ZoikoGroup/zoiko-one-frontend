import { useState, useMemo } from "react";
import { Plus, Pencil, Trash2 } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useAssets } from "../hooks/useAssets";
import { formatDate, conditionColor } from "../utils/helpers";
import { ASSET_STATUS, ASSET_CATEGORY } from "../types";

const initialForm = {
  name: "", assetTag: "", category: "", serialNumber: "",
  employeeName: "", department: "", assignedDate: "", status: "available",
  condition: "new", purchaseDate: "", purchasePrice: "", notes: "",
};

const categoryOptions = Object.values(ASSET_CATEGORY).map((v) => ({ value: v, label: v }));
const statusOptions = Object.values(ASSET_STATUS).map((v) => ({ value: v, label: v.replace(/_/g, " ") }));
const conditionOptions = ["new", "good", "fair", "poor", "damaged"].map((v) => ({ value: v, label: v }));

export default function AssetCatalog() {
  const { data: assets, loading } = useAssets();
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [deptFilter, setDeptFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [editAsset, setEditAsset] = useState(null);
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});

  const departments = useMemo(() => {
    const depts = new Set(assets.map((a) => a.department).filter(Boolean));
    return [...depts].sort();
  }, [assets]);

  const filtered = useMemo(() => {
    let result = assets;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) =>
        a.name?.toLowerCase().includes(q) || a.assetTag?.toLowerCase().includes(q) ||
        a.serialNumber?.toLowerCase().includes(q)
      );
    }
    if (categoryFilter) result = result.filter((a) => a.category === categoryFilter);
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    if (deptFilter) result = result.filter((a) => a.department === deptFilter);
    return result;
  }, [assets, search, categoryFilter, statusFilter, deptFilter]);

  const openCreate = () => { setEditAsset(null); setForm({ ...initialForm }); setFormErrors({}); setShowModal(true); };
  const openEdit = (asset) => {
    setEditAsset(asset);
    setForm({
      name: asset.name || "", assetTag: asset.assetTag || "", category: asset.category || "",
      serialNumber: asset.serialNumber || "", employeeName: asset.employeeName || "",
      department: asset.department || "", assignedDate: asset.assignedDate || "",
      status: asset.status || "available", condition: asset.condition || "new",
      purchaseDate: asset.purchaseDate || "", purchasePrice: asset.purchasePrice?.toString() || "",
      notes: asset.notes || "",
    });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = (d) => {
    const e = {};
    if (!d.name?.trim()) e.name = "Name is required";
    if (!d.assetTag?.trim()) e.assetTag = "Asset tag is required";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowModal(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this asset?")) return;
  };

  const columns = [
    { key: "assetTag", label: "Tag", render: (v) => <span className="font-mono text-xs font-semibold text-amber-600">{v}</span> },
    { key: "name", label: "Name", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "category", label: "Category", render: (v) => <span className="inline-block bg-amber-50 text-amber-700 text-xs px-2 py-0.5 rounded-full font-medium">{v}</span> },
    { key: "employeeName", label: "Employee", render: (v) => v || <span className="text-gray-300">-</span> },
    { key: "department", label: "Dept", render: (v) => v || <span className="text-gray-300">-</span> },
    { key: "condition", label: "Condition", render: (v) => <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${conditionColor(v)}`}>{v}</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "id", label: "Actions", render: (v, row) => (
      <div className="flex items-center gap-2">
        <button onClick={() => openEdit(row)} className="p-1 text-gray-400 hover:text-amber-600 transition-colors"><Pencil className="w-4 h-4" /></button>
        <button onClick={() => handleDelete(v)} className="p-1 text-gray-400 hover:text-red-600 transition-colors"><Trash2 className="w-4 h-4" /></button>
      </div>
    )},
  ];

  const filters = [
    { key: "category", value: categoryFilter, placeholder: "All Categories", options: categoryOptions },
    { key: "status", value: statusFilter, placeholder: "All Statuses", options: statusOptions },
    { key: "department", value: deptFilter, placeholder: "All Departments", options: departments.map((d) => ({ value: d, label: d })) },
  ];

  const handleFilterChange = (key, value) => {
    if (key === "category") setCategoryFilter(value);
    else if (key === "status") setStatusFilter(value);
    else if (key === "department") setDeptFilter(value);
  };

  if (loading) return <div className="p-6 text-gray-400">Loading assets...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Catalog</h1>
          <p className="text-sm text-gray-500 mt-1">Complete inventory of all company assets</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Add Asset
        </button>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filters} onFilterChange={handleFilterChange} />

      <DataTable columns={columns} data={filtered} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">{editAsset ? "Edit Asset" : "Add Asset"}</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border ${formErrors.name ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                  {formErrors.name && <p className="text-red-500 text-xs mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag *</label>
                  <input type="text" value={form.assetTag} onChange={(e) => setForm({ ...form, assetTag: e.target.value })}
                    className={`w-full border ${formErrors.assetTag ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                  {formErrors.assetTag && <p className="text-red-500 text-xs mt-1">{formErrors.assetTag}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    <option value="">Select category</option>
                    {categoryOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Serial Number</label>
                  <input type="text" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                  <input type="text" value={form.employeeName} onChange={(e) => setForm({ ...form, employeeName: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                  <input type="text" value={form.department} onChange={(e) => setForm({ ...form, department: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {statusOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Condition</label>
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {conditionOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned Date</label>
                  <input type="date" value={form.assignedDate} onChange={(e) => setForm({ ...form, assignedDate: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Price ($)</label>
                  <input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Purchase Date</label>
                <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">
                  {editAsset ? "Update Asset" : "Create Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
