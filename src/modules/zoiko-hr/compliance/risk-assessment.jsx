import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import { AlertTriangle } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getRiskAssessments } from "../../../service/hrService";

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
    open: "bg-red-100 text-red-800", mitigated: "bg-yellow-100 text-yellow-800",
    closed: "bg-gray-100 text-gray-800", critical: "bg-red-100 text-red-800",
    high: "bg-orange-100 text-orange-800", medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

const riskColor = (score) => {
  if (score >= 15) return "border-red-500 bg-red-50";
  if (score >= 8) return "border-orange-500 bg-orange-50";
  if (score >= 4) return "border-yellow-500 bg-yellow-50";
  return "border-emerald-500 bg-emerald-50";
};

const riskLabel = (score) => {
  if (score >= 15) return "Critical";
  if (score >= 8) return "High";
  if (score >= 4) return "Medium";
  return "Low";
};

export default function RiskAssessment() {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    getRiskAssessments()
      .then((res) => { if (mounted) setRisks(Array.isArray(res) ? res : res?.data || []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = useMemo(() => {
    if (!statusFilter) return risks;
    return risks.filter((r) => r.status === statusFilter);
  }, [risks, statusFilter]);

  if (loading) return <div className="p-6 text-gray-400">Loading risk assessments...</div>;

  return (
    <HRPage title="Risk Assessment" subtitle="Evaluate and manage compliance risks">
      <SubNav />
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-gray-900">Risk Matrix</h2>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="mitigated">Mitigated</option>
            <option value="closed">Closed</option>
          </select>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filtered.map((risk) => (
            <div key={risk.id} className={`rounded-xl border-2 p-4 ${riskColor(risk.riskScore)}`}>
              <div className="flex items-start justify-between">
                <div className="p-1.5 bg-white rounded-full shadow-sm">
                  <AlertTriangle size={18} className={
                    risk.riskScore >= 15 ? "text-red-600" : risk.riskScore >= 8 ? "text-orange-600" : risk.riskScore >= 4 ? "text-yellow-600" : "text-emerald-600"
                  } />
                </div>
              </div>
              <p className="text-sm font-semibold text-gray-900 mt-3">{risk.title}</p>
              <p className="text-xs text-gray-500 capitalize mt-0.5">{risk.category?.replace(/_/g, " ")}</p>
              <div className="flex items-center justify-between mt-3 text-xs text-gray-600">
                <span>L: {risk.likelihood}/5</span>
                <span>I: {risk.impact}/5</span>
                <span className="font-bold">{risk.riskScore}</span>
              </div>
              <div className="mt-2"><StatusBadge status={riskLabel(risk.riskScore)} /></div>
              <div className="mt-2"><StatusBadge status={risk.status} /></div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Mitigation Plans</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
                <tr>
                  {["Risk", "Category", "Likelihood", "Impact", "Risk Score", "Mitigation", "Owner", "Status"].map((h) => (
                    <th key={h} className="px-3 py-3 font-medium">{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.map((r, i) => (
                  <tr key={r.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                    <td className="px-3 py-3 font-medium text-gray-900">{r.title}</td>
                    <td className="px-3 py-3 capitalize">{r.category?.replace(/_/g, " ")}</td>
                    <td className="px-3 py-3">{r.likelihood}/5</td>
                    <td className="px-3 py-3">{r.impact}/5</td>
                    <td className="px-3 py-3"><StatusBadge status={riskLabel(r.riskScore)} /></td>
                    <td className="px-3 py-3 text-gray-500 max-w-[200px] truncate">{r.mitigation}</td>
                    <td className="px-3 py-3">{r.owner}</td>
                    <td className="px-3 py-3"><StatusBadge status={r.status} /></td>
                  </tr>
                ))}
                {filtered.length === 0 && (
                  <tr><td colSpan={8} className="px-3 py-8 text-center text-gray-400">No risk assessments found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
