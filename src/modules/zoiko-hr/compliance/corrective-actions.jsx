import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Search, X, AlertTriangle, CheckCircle, Clock } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getCorrectiveActions, createCorrectiveAction } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/compliance" },
  { label: "Policy Library", href: "/zoiko-hr/compliance/policies" },
  { label: "Compliance Tracking", href: "/zoiko-hr/compliance/tracking" },
  { label: "Audits", href: "/zoiko-hr/compliance/audits" },
  { label: "Violations", href: "/zoiko-hr/compliance/violations" },
  { label: "Risk Assessment", href: "/zoiko-hr/compliance/risks" },
  { label: "Regulations", href: "/zoiko-hr/compliance/regulations" },
  { label: "Corrective Actions", href: "/zoiko-hr/compliance/corrective-actions" },
  { label: "Reports", href: "/zoiko-hr/compliance/reports" },
  { label: "Settings", href: "/zoiko-hr/compliance/settings" },
];

const PRIORITY_ICONS = { critical: AlertTriangle, high: AlertTriangle, medium: Clock, low: CheckCircle };

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/compliance"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-emerald-600 border-b-2 border-emerald-600 bg-emerald-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const colorMap = {
    open: "bg-red-100 text-red-800", in_progress: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800", critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800", medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

function daysUntil(dateStr) {
  if (!dateStr) return 999;
  const diff = new Date(dateStr) - new Date();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}

const emptyForm = { title: "", violation: "", assignedTo: "", deadline: "", priority: "medium", description: "" };

export default function CorrectiveActions() {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchActions = () => {
    setLoading(true);
    getCorrectiveActions()
      .then((res) => setActions(Array.isArray(res) ? res : res?.data || []))
      .catch(() => setActions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchActions(); }, []);

  const filtered = useMemo(() => {
    let result = actions;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.title?.toLowerCase().includes(q) || a.violation?.toLowerCase().includes(q) || a.assignedTo?.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    return result;
  }, [actions, search, statusFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createCorrectiveAction(form).then(() => { fetchActions(); setShowModal(false); }).catch(() => {});
  };

  if (loading) return <div className="p-6 text-gray-400">Loading corrective actions...</div>;

  return (
    <HRPage title="Corrective Actions" subtitle="Manage and track corrective actions for compliance issues">
      <SubNav />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Search actions..." value={search} onChange={(e) => setSearch(e.target.value)} />
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Action", "Related Violation", "Assigned To", "Deadline", "Priority", "Status"].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => {
                const Icon = PRIORITY_ICONS[a.priority] || Clock;
                const iconColor = a.priority === "critical" ? "text-red-600" : a.priority === "high" ? "text-orange-600" : a.priority === "medium" ? "text-yellow-600" : "text-emerald-600";
                const days = daysUntil(a.deadline);
                return (
                  <tr key={a.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                    <td className="px-3 py-3">
                      <div className="flex items-center gap-2">
                        <Icon size={16} className={iconColor} />
                        <span className="font-medium text-gray-900">{a.title}</span>
                      </div>
                    </td>
                    <td className="px-3 py-3 text-gray-500 max-w-[150px] truncate">{a.violation}</td>
                    <td className="px-3 py-3">{a.assignedTo}</td>
                    <td className="px-3 py-3">
                      <span className={days <= 0 ? "text-red-600 font-medium" : days <= 7 ? "text-orange-600" : "text-gray-700"}>
                        {formatDate(a.deadline)} {days <= 0 ? "(overdue)" : days <= 7 ? `(${days}d left)` : ""}
                      </span>
                    </td>
                    <td className="px-3 py-3"><StatusBadge status={a.priority} /></td>
                    <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr><td colSpan={6} className="px-3 py-8 text-center text-gray-400">No corrective actions found</td></tr>
              )}
            </tbody>
          </table>
        </div>

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
    </HRPage>
  );
}
