import { useState, useMemo } from "react";
import { Plus, Search, X } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import { useAudits } from "../hooks/useCompliance";
import { formatDate } from "../utils/helpers";

export default function Audits() {
  const { data: audits, loading } = useAudits();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "", scope: "", auditor: "", scheduledDate: "", status: "planned",
  });

  const filtered = useMemo(() => {
    let result = audits;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q) || a.auditor.toLowerCase().includes(q) || a.scope.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    return result;
  }, [audits, search, statusFilter]);

  const columns = [
    { key: "title", label: "Title", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "scope", label: "Scope", render: (v) => <span className="text-gray-500 max-w-[200px] truncate block">{v}</span> },
    { key: "auditor", label: "Auditor" },
    { key: "scheduledDate", label: "Scheduled", render: (v) => formatDate(v) },
    { key: "completedDate", label: "Completed", render: (v) => v ? formatDate(v) : <span className="text-gray-400">—</span> },
    { key: "findings", label: "Findings", render: (v) => <span className="font-medium">{v > 0 ? v : "—"}</span> },
    { key: "score", label: "Score", render: (v) => v > 0 ? <span className="text-emerald-600 font-medium">{v}%</span> : <span className="text-gray-400">—</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  if (loading) return <div className="p-6 text-gray-400">Loading audits...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Search audits..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="planned">Planned</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <Plus size={16} /> Schedule Audit
        </button>
      </div>

      <DataTable columns={columns} data={filtered} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Schedule Audit</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scope</label>
                <textarea className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" rows={2} value={form.scope} onChange={(e) => setForm({ ...form, scope: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auditor</label>
                <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.auditor} onChange={(e) => setForm({ ...form, auditor: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Date</label>
                <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" type="date" value={form.scheduledDate} onChange={(e) => setForm({ ...form, scheduledDate: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">Schedule</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
