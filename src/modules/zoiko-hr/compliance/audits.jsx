import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Search, X } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getAudits, createAudit } from "../../../service/hrService";

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
    planned: "bg-blue-100 text-blue-800", in_progress: "bg-orange-100 text-orange-800",
    completed: "bg-green-100 text-green-800",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

const emptyForm = { title: "", scope: "", auditor: "", scheduledDate: "", status: "planned" };

export default function Audits() {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });

  const fetchAudits = () => {
    setLoading(true);
    getAudits()
      .then((res) => setAudits(Array.isArray(res) ? res : res?.data || []))
      .catch(() => setAudits([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchAudits(); }, []);

  const filtered = useMemo(() => {
    let result = audits;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((a) => a.title?.toLowerCase().includes(q) || a.auditor?.toLowerCase().includes(q) || a.scope?.toLowerCase().includes(q));
    }
    if (statusFilter) result = result.filter((a) => a.status === statusFilter);
    return result;
  }, [audits, search, statusFilter]);

  const handleSubmit = (e) => {
    e.preventDefault();
    createAudit(form).then(() => { fetchAudits(); setShowModal(false); }).catch(() => {});
  };

  if (loading) return <div className="p-6 text-gray-400">Loading audits...</div>;

  return (
    <HRPage title="Audits" subtitle="Schedule and manage compliance audits">
      <SubNav />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 min-w-[200px]">
              <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
              <input className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Search audits..." value={search} onChange={(e) => setSearch(e.target.value)} />
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Title", "Scope", "Auditor", "Scheduled", "Completed", "Findings", "Score", "Status"].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((a, i) => (
                <tr key={a.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{a.title}</td>
                  <td className="px-3 py-3 text-gray-500 max-w-[200px] truncate">{a.scope}</td>
                  <td className="px-3 py-3">{a.auditor}</td>
                  <td className="px-3 py-3">{formatDate(a.scheduledDate)}</td>
                  <td className="px-3 py-3">{a.completedDate ? formatDate(a.completedDate) : <span className="text-gray-400">—</span>}</td>
                  <td className="px-3 py-3 font-medium">{a.findings > 0 ? a.findings : "—"}</td>
                  <td className="px-3 py-3">{a.score > 0 ? <span className="text-emerald-600 font-medium">{a.score}%</span> : <span className="text-gray-400">—</span>}</td>
                  <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">No audits found</td></tr>
              )}
            </tbody>
          </table>
        </div>

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
    </HRPage>
  );
}
