import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../../context/AuthContext";
import PageHeader from "../../components/PageHeader";
import {
  getAssets, createAsset, getAssetCategories, getHrEmployees, assignAsset,
} from "../../service/hrService";
import {
  Package, Search, Plus, X, Loader2, CheckCircle, Clock, AlertCircle, User,
} from "lucide-react";

const STATUS_COLORS = {
  available: "bg-green-100 text-green-800",
  assigned: "bg-blue-100 text-blue-800",
  maintenance: "bg-orange-100 text-orange-800",
  retired: "bg-gray-100 text-gray-800",
  lost: "bg-red-100 text-red-800",
};

const STATUS_OPTIONS = ["available", "assigned", "maintenance", "retired", "lost"];
const CONDITION_OPTIONS = ["new", "good", "fair", "poor", "damaged"];

const initialForm = {
  name: "", assetTag: "", category: "", serialNumber: "",
  status: "available", condition: "new", purchaseDate: "", purchasePrice: "",
  notes: "", employee_id: "",
};

export default function OrgAdminAssetsPage() {
  const { user } = useAuth();
  const [assets, setAssets] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [assetData, empData, catData] = await Promise.all([
        getAssets(),
        getHrEmployees({ per_page: 200 }),
        getAssetCategories(),
      ]);
      setAssets(assetData?.items || (Array.isArray(assetData) ? assetData : []));
      const empList = empData?.items || (Array.isArray(empData) ? empData : []);
      setEmployees(empList);
      const cats = Array.isArray(catData) ? catData : catData?.data || [];
      setCategories(cats.map((c) => c.name));
    } catch (err) {
      setError(err.message || "Failed to load data");
      setAssets([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchData(); }, []);

  const filtered = useMemo(() => {
    if (!search) return assets;
    const q = search.toLowerCase();
    return assets.filter((a) =>
      (a.name || a.itemName || "").toLowerCase().includes(q) ||
      (a.assetTag || a.asset_tag || "").toLowerCase().includes(q) ||
      (a.serialNumber || a.serial_number || "").toLowerCase().includes(q) ||
      (a.employeeName || a.employee_name || "").toLowerCase().includes(q)
    );
  }, [assets, search]);

  const openCreate = () => {
    setForm({ ...initialForm });
    setFormErrors({});
    setShowModal(true);
  };

  const validate = (d) => {
    const e = {};
    if (!d.name?.trim()) e.name = "Name is required";
    if (!d.assetTag?.trim()) e.assetTag = "Asset tag is required";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setSubmitting(true);
    try {
      const payload = {
        name: form.name.trim(),
        asset_tag: form.assetTag.trim(),
        category: form.category || null,
        serial_number: form.serialNumber || null,
        status: form.status,
        condition: form.condition,
        purchase_date: form.purchaseDate || null,
        purchase_cost: form.purchasePrice ? Number(form.purchasePrice) : null,
        notes: form.notes || null,
      };
      const created = await createAsset(payload);
      const assetId = created?.id || created?.data?.id;

      if (assetId && form.employee_id) {
        await assignAsset(assetId, { employee_id: parseInt(form.employee_id) });
      }

      setShowModal(false);
      await fetchData();
    } catch (err) {
      setFormErrors({ submit: err.message || "Failed to save asset" });
    } finally {
      setSubmitting(false);
    }
  };

  const handleAssign = async (assetId, employeeId) => {
    try {
      await assignAsset(assetId, { employee_id: parseInt(employeeId) });
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to assign asset");
    }
  };

  const totalCount = assets.length;
  const assignedCount = assets.filter((a) => a.status === "assigned").length;
  const availableCount = assets.filter((a) => a.status === "available").length;

  return (
    <div className="space-y-6">
      <PageHeader
        title="Assets"
        description="Manage your organization's assets and assign them to employees"
      />

      {error && (
        <div className="rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 flex items-center justify-between">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Total Assets</p>
          <p className="mt-1 text-2xl font-extrabold text-slate-800">{loading ? "..." : totalCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Assigned</p>
          <p className="mt-1 text-2xl font-extrabold text-blue-600">{loading ? "..." : assignedCount}</p>
        </div>
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wide">Available</p>
          <p className="mt-1 text-2xl font-extrabold text-green-600">{loading ? "..." : availableCount}</p>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text" placeholder="Search assets..."
            value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-slate-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400"
          />
        </div>
        <button onClick={openCreate}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition shadow-sm">
          <Plus size={16} /> Add Asset
        </button>
      </div>

      {loading && assets.length === 0 ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="w-6 h-6 text-indigo-500 animate-spin" />
          <span className="ml-3 text-sm text-slate-500 font-medium">Loading assets...</span>
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <Package className="mx-auto h-10 w-10 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">
            {assets.length === 0 ? "No assets yet. Add your first asset." : "No assets match your search."}
          </p>
        </div>
      ) : (
        <div className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-slate-100">
              <thead>
                <tr className="border-b border-slate-100">
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Asset</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Tag</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Category</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Assigned To</th>
                  <th className="px-5 py-3.5 text-left text-xs font-bold text-slate-400 uppercase tracking-widest">Status</th>
                  <th className="px-5 py-3.5 text-right text-xs font-bold text-slate-400 uppercase tracking-widest">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50">
                {filtered.map((a) => {
                  const status = a.status || "available";
                  const empName = a.employeeName || a.employee_name || "";
                  return (
                    <tr key={a.id} className="hover:bg-slate-50/60 transition">
                      <td className="px-5 py-3.5">
                        <p className="text-sm font-semibold text-slate-800">{a.name || a.itemName || "-"}</p>
                        {a.serialNumber || a.serial_number ? (
                          <p className="text-xs text-slate-400 font-mono mt-0.5">{a.serialNumber || a.serial_number}</p>
                        ) : null}
                      </td>
                      <td className="px-5 py-3.5 text-sm font-mono text-amber-600">{a.assetTag || a.asset_tag || "-"}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-500">{a.category || "-"}</td>
                      <td className="px-5 py-3.5 text-sm text-slate-600">
                        {empName ? (
                          <span className="inline-flex items-center gap-1.5">
                            <User size={12} className="text-slate-400" />
                            {empName}
                          </span>
                        ) : (
                          <span className="text-slate-300">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${STATUS_COLORS[status] || "bg-gray-100 text-gray-800"}`}>
                          {status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        {status === "available" && (
                          <AssignDropdown
                            employees={employees}
                            asset={a}
                            onAssign={handleAssign}
                          />
                        )}
                        {status === "assigned" && (
                          <span className="text-xs text-slate-400 flex items-center justify-end gap-1">
                            <CheckCircle size={12} className="text-blue-500" /> Assigned
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg">
            <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Add Asset</h2>
                <p className="text-xs text-slate-400 mt-0.5">Create and optionally assign to an employee</p>
              </div>
              <button onClick={() => setShowModal(false)} className="p-2 rounded-xl hover:bg-slate-100 text-slate-400 transition">
                <X size={18} />
              </button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              {formErrors.submit && (
                <div className="flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-red-700 text-sm font-semibold">
                  <AlertCircle size={14} /> {formErrors.submit}
                </div>
              )}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Name *</label>
                  <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition ${formErrors.name ? "border-red-300" : "border-slate-200"}`} />
                  {formErrors.name && <p className="text-xs text-red-500 mt-1">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Asset Tag *</label>
                  <input type="text" value={form.assetTag} onChange={(e) => setForm({ ...form, assetTag: e.target.value })}
                    className={`w-full border rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition ${formErrors.assetTag ? "border-red-300" : "border-slate-200"}`} />
                  {formErrors.assetTag && <p className="text-xs text-red-500 mt-1">{formErrors.assetTag}</p>}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Category</label>
                  <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition">
                    <option value="">Select category</option>
                    {categories.map((v) => (<option key={v} value={v}>{v}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Serial Number</label>
                  <input type="text" value={form.serialNumber} onChange={(e) => setForm({ ...form, serialNumber: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Assign to Employee</label>
                <select value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition">
                  <option value="">— Keep available —</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name} ({emp.email})</option>
                  ))}
                </select>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition">
                    {STATUS_OPTIONS.map((v) => (<option key={v} value={v}>{v.replace(/_/g, " ")}</option>))}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Condition</label>
                  <select value={form.condition} onChange={(e) => setForm({ ...form, condition: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition">
                    {CONDITION_OPTIONS.map((v) => (<option key={v} value={v}>{v}</option>))}
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Purchase Price ($)</label>
                  <input type="number" value={form.purchasePrice} onChange={(e) => setForm({ ...form, purchasePrice: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition" />
                </div>
                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Purchase Date</label>
                  <input type="date" value={form.purchaseDate} onChange={(e) => setForm({ ...form, purchaseDate: e.target.value })}
                    className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition" />
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wide block mb-1.5">Notes</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-slate-200 rounded-xl px-3 py-2.5 text-sm text-slate-800 bg-slate-50 outline-none focus:ring-2 focus:ring-indigo-300 focus:border-indigo-400 focus:bg-white transition resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)}
                  className="px-4 py-2.5 rounded-xl border border-slate-200 text-sm font-semibold text-slate-600 hover:bg-slate-50 transition">
                  Cancel
                </button>
                <button type="submit" disabled={submitting}
                  className="px-4 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white text-sm font-semibold transition shadow-sm flex items-center gap-2">
                  {submitting ? <><Loader2 size={14} className="animate-spin" /> Saving...</> : "Create Asset"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}

function AssignDropdown({ employees, asset, onAssign }) {
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState("");
  const [saving, setSaving] = useState(false);

  return (
    <div className="relative inline-block text-left">
      <button onClick={() => setOpen(!open)}
        className="px-3 py-1.5 text-xs font-semibold text-indigo-600 hover:bg-indigo-50 rounded-lg transition">
        Assign
      </button>
      {open && (
        <div className="absolute right-0 top-full mt-1 z-50 w-64 bg-white rounded-xl border border-slate-200 shadow-lg p-3">
          <p className="text-xs font-semibold text-slate-500 mb-2">Select Employee</p>
          <select value={selected} onChange={(e) => setSelected(e.target.value)}
            className="w-full border border-slate-200 rounded-lg px-2 py-1.5 text-sm mb-2">
            <option value="">-- Select --</option>
            {employees.map((emp) => (
              <option key={emp.id} value={emp.id}>{emp.first_name} {emp.last_name}</option>
            ))}
          </select>
          <div className="flex gap-2">
            <button onClick={() => setOpen(false)}
              className="flex-1 px-2 py-1 text-xs border border-slate-200 rounded-lg hover:bg-slate-50">Cancel</button>
            <button disabled={!selected || saving} onClick={async () => {
              setSaving(true);
              await onAssign(asset.id, selected);
              setSaving(false);
              setOpen(false);
            }}
              className="flex-1 px-2 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white rounded-lg font-medium">
              {saving ? "..." : "Assign"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
