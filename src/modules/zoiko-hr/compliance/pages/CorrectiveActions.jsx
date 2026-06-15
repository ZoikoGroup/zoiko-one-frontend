import { useState, useMemo } from "react";
import { Plus, Search, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import StatusBadge from "../components/StatusBadge";
import DataTable from "../components/DataTable";
import { useCorrectiveActions } from "../hooks/useCompliance";
import { formatDate, daysUntil } from "../utils/helpers";

const PRIORITY_ICONS = {
  critical: AlertTriangle,
  high: AlertTriangle,
  medium: Clock,
  low: CheckCircle,
};

export default function CorrectiveActions() {
  const { data: actions, loading } = useCorrectiveActions();
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    title: "", violation: "", assignedTo: "", deadline: "", priority: "medium", description: "",
  });

  const filtered = useMemo(() => {
    let result = actions;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.title.toLowerCase().includes(q) || a.violation.toLowerCase().includes(q) || a.assignedTo.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    return result;
  }, [actions, search, statusFilter]);

  const columns = [
    {
      key: "title", label: "Action", render: (v, r) => {
        const Icon = PRIORITY_ICONS[r.priority] || Clock;
        const iconColor = r.priority === "critical" ? "text-red-600" : r.priority === "high" ? "text-orange-600" : r.priority === "medium" ? "text-yellow-600" : "text-emerald-600";
        return (
          <div className="flex items-center gap-2">
            <Icon size={16} className={iconColor} />
            <span className="font-medium text-gray-900">{v}</span>
          </div>
        );
      },
    },
    { key: "violation", label: "Related Violation", render: (v) => <span className="text-gray-500 max-w-[150px] truncate block">{v}</span> },
    { key: "assignedTo", label: "Assigned To" },
    { key: "deadline", label: "Deadline", render: (v) => {
      const days = daysUntil(v);
      return (
        <span className={days <= 0 ? "text-red-600 font-medium" : days <= 7 ? "text-orange-600" : "text-gray-700"}>
          {formatDate(v)} {days <= 0 ? "(overdue)" : days <= 7 ? `(${days}d left)` : ""}
        </span>
      );
    }},
    { key: "priority", label: "Priority", render: (v) => <StatusBadge status={v} /> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    setShowModal(false);
  };

  if (loading) return <div className="p-6 text-gray-400">Loading corrective actions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="relative flex-1 min-w-[200px]">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              placeholder="Search actions..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        <button onClick={() => setShowModal(true)} className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-4 py-2 text-sm font-semibold text-white hover:bg-emerald-700">
          <Plus size={16} /> Create Action
        </button>
      </div>

      <DataTable columns={columns} data={filtered} />

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Create Corrective Action</h2>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
            </div>
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Related Violation</label>
                <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.violation} onChange={(e) => setForm({ ...form, violation: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Assigned To</label>
                  <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.assignedTo} onChange={(e) => setForm({ ...form, assignedTo: e.target.value })} />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Deadline</label>
                  <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                <select className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.priority} onChange={(e) => setForm({ ...form, priority: e.target.value })}>
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg font-medium">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
