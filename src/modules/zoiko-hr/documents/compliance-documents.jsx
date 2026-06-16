import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Shield } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/documents" },
  { label: "Employee Documents", href: "/zoiko-hr/documents/employee-documents" },
  { label: "Company Documents", href: "/zoiko-hr/documents/company-documents" },
  { label: "Templates", href: "/zoiko-hr/documents/templates" },
  { label: "Policies", href: "/zoiko-hr/documents/policies" },
  { label: "Compliance Documents", href: "/zoiko-hr/documents/compliance" },
  { label: "Approval Workflow", href: "/zoiko-hr/documents/approvals" },
  { label: "Expiring Documents", href: "/zoiko-hr/documents/expiring-documents" },
  { label: "Archive", href: "/zoiko-hr/documents/archive" },
  { label: "Reports", href: "/zoiko-hr/documents/reports" },
  { label: "Settings", href: "/zoiko-hr/documents/settings" },
];

const MOCK_COMPLIANCE_DOCS = [
  { id: 1, name: "SOC 2 Report", regulation: "SOC 2", status: "approved", expiryDate: "2025-12-31", owner: "Security Team" },
  { id: 2, name: "ISO 27001 Certificate", regulation: "ISO 27001", status: "approved", expiryDate: "2025-09-15", owner: "Compliance Team" },
  { id: 3, name: "GDPR Compliance Statement", regulation: "GDPR", status: "approved", expiryDate: "2025-06-30", owner: "Legal Team" },
  { id: 4, name: "HIPAA Compliance Report", regulation: "HIPAA", status: "draft", expiryDate: null, owner: "Security Team" },
  { id: 5, name: "Data Processing Agreement", regulation: "GDPR", status: "approved", expiryDate: "2025-08-01", owner: "Legal Team" },
  { id: 6, name: "Business Continuity Plan", regulation: "ISO 22301", status: "pending_approval", expiryDate: null, owner: "Operations Team" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/documents"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function StatusBadge({ status }) {
  const m = { draft: "bg-gray-100 text-gray-800", pending_approval: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function ComplianceDocuments() {
  const [filter, setFilter] = useState("");
  const docs = MOCK_COMPLIANCE_DOCS;
  const filtered = filter ? docs.filter((d) => d.regulation === filter) : docs;
  const regulations = [...new Set(docs.map((d) => d.regulation))];

  return (
    <HRPage title="Compliance Documents" subtitle="Regulatory and compliance documentation">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Compliance Documents</h1>
            <p className="text-sm text-gray-500 mt-1">Regulatory and compliance documentation</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> Upload Compliance Doc
          </button>
        </div>

        <div className="flex gap-2 flex-wrap">
          <button onClick={() => setFilter("")} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${!filter ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>All</button>
          {regulations.map((r) => (
            <button key={r} onClick={() => setFilter(r)} className={`px-3 py-1.5 rounded-lg text-xs font-medium ${filter === r ? "bg-purple-600 text-white" : "bg-gray-100 text-gray-600 hover:bg-gray-200"}`}>{r}</button>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Document", "Regulation", "Status", "Expiry", "Owner"].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-3 py-3"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{d.regulation}</span></td>
                  <td className="px-3 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-3">{d.expiryDate ? <span className={new Date(d.expiryDate) < new Date() ? "text-red-600 font-medium" : ""}>{formatDate(d.expiryDate)}</span> : "-"}</td>
                  <td className="px-3 py-3 text-gray-500">{d.owner}</td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={5} className="px-3 py-8 text-center text-gray-400">No compliance documents found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
