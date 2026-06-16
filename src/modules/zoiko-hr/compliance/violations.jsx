import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Search, X, FileText } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getComplianceViolations } from "../../../service/hrService";

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
    open: "bg-red-100 text-red-800", investigating: "bg-orange-100 text-orange-800",
    resolved: "bg-blue-100 text-blue-800", closed: "bg-gray-100 text-gray-800",
    critical: "bg-red-100 text-red-800", high: "bg-orange-100 text-orange-800",
    medium: "bg-yellow-100 text-yellow-800", low: "bg-green-100 text-green-800",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function Violations() {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [severityFilter, setSeverityFilter] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [selectedViolation, setSelectedViolation] = useState(null);

  useEffect(() => {
    let mounted = true;
    getComplianceViolations()
      .then((res) => { if (mounted) setViolations(Array.isArray(res) ? res : res?.data || []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = violations;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((v) => v.employee?.toLowerCase().includes(q) || v.violation?.toLowerCase().includes(q) || v.policy?.toLowerCase().includes(q));
    }
    if (severityFilter) result = result.filter((v) => v.severity === severityFilter);
    if (statusFilter) result = result.filter((v) => v.status === statusFilter);
    return result;
  }, [violations, search, severityFilter, statusFilter]);

  if (loading) return <div className="p-6 text-gray-400">Loading violations...</div>;

  return (
    <HRPage title="Violations" subtitle="Track and manage compliance violations">
      <SubNav />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 min-w-[200px] max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Search violations..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={severityFilter} onChange={(e) => setSeverityFilter(e.target.value)}>
            <option value="">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Employee", "Policy", "Violation", "Severity", "Date", "Status", "Reported By", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((v, i) => (
                <tr key={v.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{v.employee}</td>
                  <td className="px-3 py-3">{v.policy}</td>
                  <td className="px-3 py-3 text-gray-500 max-w-[200px] truncate">{v.violation}</td>
                  <td className="px-3 py-3"><StatusBadge status={v.severity} /></td>
                  <td className="px-3 py-3">{formatDate(v.date)}</td>
                  <td className="px-3 py-3"><StatusBadge status={v.status} /></td>
                  <td className="px-3 py-3">{v.reportedBy}</td>
                  <td className="px-3 py-3"><button onClick={() => setSelectedViolation(v)} className="text-emerald-600 hover:text-emerald-800 text-xs font-medium">View</button></td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">No violations found</td></tr>
              )}
            </tbody>
          </table>
        </div>

        {selectedViolation && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
              <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
                <h2 className="text-lg font-bold text-gray-800">Violation Details</h2>
                <button onClick={() => setSelectedViolation(null)} className="text-gray-400 hover:text-gray-600"><X size={20} /></button>
              </div>
              <div className="p-6 space-y-4">
                <div className="flex items-start gap-3">
                  <div className="p-2 bg-red-50 rounded-lg"><FileText size={20} className="text-red-600" /></div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">{selectedViolation.employee}</p>
                    <p className="text-xs text-gray-500">{selectedViolation.policy}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Violation</p>
                  <p className="text-sm text-gray-900 mt-0.5">{selectedViolation.violation}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-xs text-gray-500">Severity</p>
                    <StatusBadge status={selectedViolation.severity} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Status</p>
                    <StatusBadge status={selectedViolation.status} />
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Date</p>
                    <p className="text-sm text-gray-900">{formatDate(selectedViolation.date)}</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Reported By</p>
                    <p className="text-sm text-gray-900">{selectedViolation.reportedBy}</p>
                  </div>
                </div>
                {selectedViolation.resolution && (
                  <div>
                    <p className="text-xs text-gray-500">Resolution</p>
                    <p className="text-sm text-gray-900 mt-0.5 bg-gray-50 rounded-lg p-3">{selectedViolation.resolution}</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}
