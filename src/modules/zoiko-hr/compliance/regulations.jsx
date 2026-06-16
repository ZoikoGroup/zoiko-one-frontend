import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { Search } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getRegulatoryRequirements } from "../../../service/hrService";

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

const CATEGORIES = [
  { value: "data_privacy", label: "Data Privacy" },
  { value: "security", label: "Security" },
  { value: "financial", label: "Financial" },
  { value: "labor", label: "Labor" },
  { value: "other", label: "Other" },
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
  const colorMap = { active: "bg-emerald-100 text-emerald-800", pending: "bg-yellow-100 text-yellow-800", archived: "bg-gray-100 text-gray-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function Regulations() {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    getRegulatoryRequirements()
      .then((res) => { if (mounted) setRegulations(Array.isArray(res) ? res : res?.data || []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    let result = regulations;
    if (search) {
      const q = search.toLowerCase();
      result = result.filter((r) => r.name?.toLowerCase().includes(q) || r.jurisdiction?.toLowerCase().includes(q) || r.description?.toLowerCase().includes(q));
    }
    if (categoryFilter) result = result.filter((r) => r.category === categoryFilter);
    return result;
  }, [regulations, search, categoryFilter]);

  if (loading) return <div className="p-6 text-gray-400">Loading regulations...</div>;

  return (
    <HRPage title="Regulations" subtitle="Track regulatory requirements and compliance obligations">
      <SubNav />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20" placeholder="Search regulations..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
            <option value="">All Categories</option>
            {CATEGORIES.map((c) => <option key={c.value} value={c.value}>{c.label}</option>)}
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Regulation", "Jurisdiction", "Category", "Effective", "Last Updated", "Status", "Description"].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((r, i) => (
                <tr key={r.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{r.name}</td>
                  <td className="px-3 py-3">{r.jurisdiction}</td>
                  <td className="px-3 py-3 capitalize">{r.category?.replace(/_/g, " ")}</td>
                  <td className="px-3 py-3">{formatDate(r.effectiveDate)}</td>
                  <td className="px-3 py-3">{formatDate(r.lastUpdated)}</td>
                  <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                  <td className="px-3 py-3 text-gray-500 max-w-[250px] truncate">{r.description}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No regulations found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
