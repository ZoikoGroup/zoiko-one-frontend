import { useState, useMemo } from "react";
import { Plus, Wrench, CheckCircle } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useMaintenance } from "../hooks/useAssets";
import { formatDate, formatCurrency } from "../utils/helpers";
import { MAINTENANCE_STATUS } from "../types";

const initialForm = { assetName: "", assetTag: "", issue: "", priority: "medium", reportedBy: "" };

const priorityOptions = [
  { value: "low", label: "Low" },
  { value: "medium", label: "Medium" },
  { value: "high", label: "High" },
  { value: "urgent", label: "Urgent" },
];

const statusOptions = Object.values(MAINTENANCE_STATUS).map((v) => ({ value: v, label: v.replace(/_/g, " ") }));

export default function AssetMaintenance() {
  const { data: records, loading } = useMaintenance();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [resolveId, setResolveId] = useState(null);
  const [resolution, setResolution] = useState("");
  const [form, setForm] = useState({ ...initialForm });
  const [formErrors, setFormErrors] = useState({});

  const filtered = useMemo(() => {
    let result = records;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) =>
        r.assetName?.toLowerCase().includes(q) || r.assetTag?.toLowerCase().includes(q) ||
        r.issue?.toLowerCase().includes(q) || r.reportedBy?.toLowerCase().includes(q)
      );
    }
    if (statusFilter) result = result.filter((r) => r.status === statusFilter);
    return result;
  }, [records, search, statusFilter]);

  const validate = (d) => {
    const e = {};
    if (!d.assetName?.trim()) e.assetName = "Asset name is required";
    if (!d.assetTag?.trim()) e.assetTag = "Asset tag is required";
    if (!d.issue?.trim()) e.issue = "Issue description is required";
    if (!d.reportedBy?.trim()) e.reportedBy = "Reporter name is required";
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

  const handleResolve = (e) => {
    e.preventDefault();
    if (!resolution.trim()) return;
    setResolveId(null);
    setResolution("");
  };

  const columns = [
    { key: "assetName", label: "Asset", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "assetTag", label: "Tag", render: (v) => <span className="font-mono text-xs text-amber-600 font-semibold">{v}</span> },
    { key: "issue", label: "Issue", render: (v) => <span className="text-gray-600 max-w-xs truncate block">{v}</span> },
    { key: "priority", label: "Priority", render: (v) => <StatusBadge status={v} /> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "reportedBy", label: "Reported By" },
    { key: "reportedOn", label: "Date", render: (v) => formatDate(v) },
    { key: "id", label: "Actions", render: (v, row) => (
      row.status !== "resolved" && row.status !== "cancelled" ? (
        <button onClick={() => setResolveId(v)} className="flex items-center gap-1 text-xs font-medium text-green-600 hover:text-green-800 transition-colors">
          <CheckCircle className="w-3.5 h-3.5" /> Resolve
        </button>
      ) : <span className="text-xs text-gray-400">-</span>
    )},
  ];

  const filters = [
    { key: "status", value: statusFilter, placeholder: "All Statuses", options: statusOptions },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading maintenance records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Maintenance</h1>
          <p className="text-sm text-gray-500 mt-1">Track and manage asset repairs and maintenance</p>
        </div>
        <button onClick={() => { setForm({ ...initialForm }); setFormErrors({}); setShowModal(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium transition-colors">
          <Plus className="w-4 h-4" /> Report Issue
        </button>
      </div>

      <FilterBar search={search} onSearchChange={setSearch} filters={filters} onFilterChange={(k, v) => setStatusFilter(v)} />

      <DataTable columns={columns} data={filtered} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Report Maintenance Issue</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Name *</label>
                  <input type="text" value={form.assetName} onChange={(e) => setForm({ ...form, assetName: e.target.value })}
                    className={`w-full border ${formErrors.assetName ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                  {formErrors.assetName && <p className="text-red-500 text-xs mt-1">{formErrors.assetName}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Asset Tag *</label>
                  <input type="text" value={form.assetTag} onChange={(e) => setForm({ ...form, assetTag: e.target.value })}
                    className={`w-full border ${formErrors.assetTag ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                  {formErrors.assetTag && <p className="text-red-500 text-xs mt-1">{formErrors.assetTag}</p>}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Issue Description *</label>
                <textarea rows={3} value={form.issue} onChange={(e) => setForm({ ...form, issue: e.target.value })}
                  className={`w-full border ${formErrors.issue ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                {formErrors.issue && <p className="text-red-500 text-xs mt-1">{formErrors.issue}</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500">
                    {priorityOptions.map((o) => <option key={o.value} value={o.value}>{o.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Reported By *</label>
                  <input type="text" value={form.reportedBy} onChange={(e) => setForm({ ...form, reportedBy: e.target.value })}
                    className={`w-full border ${formErrors.reportedBy ? "border-red-300" : "border-gray-200"} rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500`} />
                  {formErrors.reportedBy && <p className="text-red-500 text-xs mt-1">{formErrors.reportedBy}</p>}
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-amber-600 hover:bg-amber-700 text-white rounded-lg font-medium transition-colors">Report Issue</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {resolveId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Resolve Maintenance</h2>
              <button onClick={() => setResolveId(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleResolve} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Resolution Details *</label>
                <textarea rows={3} value={resolution} onChange={(e) => setResolution(e.target.value)}
                  placeholder="Describe how the issue was resolved..."
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-amber-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setResolveId(null)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" disabled={!resolution.trim()} className="px-4 py-2 text-sm bg-green-600 hover:bg-green-700 disabled:bg-green-400 text-white rounded-lg font-medium transition-colors">
                  Mark Resolved
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
