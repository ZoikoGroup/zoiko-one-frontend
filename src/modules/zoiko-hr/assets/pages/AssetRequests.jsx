import { useState, useMemo } from "react";
import { Plus, ClipboardList } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useAssetRequests } from "../hooks/useAssets";
import { formatDate } from "../utils/helpers";
import { REQUEST_STATUS } from "../types";

const initialForm = { employee: "", assetType: "", quantity: 1, priority: "medium", reason: "", notes: "" };

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const statusOptions = Object.values(REQUEST_STATUS).map((v) => ({ value: v, label: v.replace(/_/g, " ") }));

export default function AssetRequests() {
  const { data: requests, loading } = useAssetRequests();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});

  const filtered = useMemo(() => {
    let result = requests;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.employee?.toLowerCase().includes(q) || r.assetType?.toLowerCase().includes(q) ||
        r.reason?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) result = result.filter((r) => r.status === statusFilter);
    return result;
  }, [requests, search, statusFilter]);

  const validate = (d) => {
    const e = {};
    if (!d.employee?.trim()) e.employee = "Employee name is required";
    if (!d.assetType?.trim()) e.assetType = "Asset type is required";
    if (!d.quantity || d.quantity < 1) e.quantity = "Quantity must be at least 1";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const errors = validate(form);
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;
    setShowModal(false);
    setForm({ ...initialForm });
  };

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "assetType", label: "Asset Type" },
    { key: "quantity", label: "Qty" },
    { key: "priority", label: "Priority", render: (v) => <StatusBadge status={v} /> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "requestedOn", label: "Requested", render: (v) => formatDate(v) },
    { key: "approvedOn", label: "Approved", render: (v) => v ? formatDate(v) : <span className="text-gray-300">-</span> },
  ];

  const filters = [
    { key: "status", value: statusFilter, placeholder: "All Statuses", options: statusOptions },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading requests...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Requests</h1>
          <p className="text-sm text-gray-500 mt-1">Request new assets and track approval status</p>
        </div>
        <button onClick={() => { setForm({ ...initialForm }); setFormErrors({}); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> New Request
        </button>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filters} onFilterChange={(k, v) => setStatusFilter(v)} />

      <DataTable columns={columns} data={filtered} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">New Asset Request</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name *</label>
                <input type="text" value={form.employee} onChange={(e) => setForm({ ...form, employee: e.target.value })}
                  className={`w-full border ${formErrors.employee ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                {formErrors.employee && <p className="text-red-500 text-xs mt-1">{formErrors.employee}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Type *</label>
                  <input type="text" value={form.assetType} onChange={(e) => setForm({ ...form, assetType: e.target.value })}
                    placeholder="e.g. MacBook Pro"
                    className={`w-full border ${formErrors.assetType ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                  {formErrors.assetType && <p className="text-red-500 text-xs mt-1">{formErrors.assetType}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Quantity *</label>
                  <input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: parseInt(e.target.value) || 1 })}
                    className={`w-full border ${formErrors.quantity ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                  {formErrors.quantity && <p className="text-red-500 text-xs mt-1">{formErrors.quantity}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                  {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Reason *</label>
                <textarea rows={3} value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })}
                  placeholder="Why do you need this asset?"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Additional Notes</label>
                <textarea rows={2} value={form.notes} onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">Submit Request</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
