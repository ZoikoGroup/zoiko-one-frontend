import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Download, Trash2 } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getDocuments } from "../../../service/hrService";

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
  const colorMap = { approved: "bg-green-100 text-green-800", pending_approval: "bg-yellow-100 text-yellow-800", draft: "bg-gray-100 text-gray-800", rejected: "bg-red-100 text-red-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function EmployeeDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");

  useEffect(() => {
    let mounted = true;
    getDocuments()
      .then((res) => { if (mounted) setDocs(Array.isArray(res) ? res : res?.data || []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = docs.filter((d) => {
    const matchSearch = !search || (d.name || "").toLowerCase().includes(search.toLowerCase()) || (d.employee || "").toLowerCase().includes(search.toLowerCase());
    const matchStatus = !statusFilter || d.status === statusFilter;
    return matchSearch && matchStatus;
  });

  if (loading) return <div className="p-6 text-gray-400">Loading employee documents...</div>;

  return (
    <HRPage title="Employee Documents" subtitle="Manage employee-specific documents">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Employee Documents</h1>
            <p className="text-sm text-gray-500 mt-1">{docs.length} employee documents</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> Upload Document
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="relative flex-1 max-w-sm">
            <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
          </div>
          <select className="border border-gray-200 rounded-lg px-3 py-2 text-sm" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="">All Statuses</option>
            <option value="approved">Approved</option>
            <option value="pending_approval">Pending</option>
            <option value="draft">Draft</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Document", "Employee", "Type", "Status", "Uploaded", "Size", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {filtered.map((d, i) => (
                <tr key={d.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{d.name}</td>
                  <td className="px-3 py-3">{d.employee || "-"}</td>
                  <td className="px-3 py-3">{d.type || d.category || "-"}</td>
                  <td className="px-3 py-3"><StatusBadge status={d.status} /></td>
                  <td className="px-3 py-3">{formatDate(d.uploadedDate || d.updated)}</td>
                  <td className="px-3 py-3">{d.size || "-"}</td>
                  <td className="px-3 py-3">
                    <div className="flex gap-2">
                      <button className="text-xs text-purple-600 hover:text-purple-800"><Download className="w-3.5 h-3.5" /></button>
                      <button className="text-xs text-red-600 hover:text-red-800"><Trash2 className="w-3.5 h-3.5" /></button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No documents found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
