import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, Download, FileText } from "lucide-react";
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
  const colorMap = { active: "bg-green-100 text-green-800", draft: "bg-gray-100 text-gray-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function CompanyDocuments() {
  const [docs, setDocs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");

  useEffect(() => {
    let mounted = true;
    getDocuments()
      .then((res) => { if (mounted) setDocs(Array.isArray(res) ? res : res?.data || []); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const filtered = search
    ? docs.filter((d) => (d.name || "").toLowerCase().includes(search.toLowerCase()) || (d.type || "").toLowerCase().includes(search.toLowerCase()))
    : docs;

  if (loading) return <div className="p-6 text-gray-400">Loading company documents...</div>;

  return (
    <HRPage title="Company Documents" subtitle="Policies, manuals, and company-wide documents">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Company Documents</h1>
            <p className="text-sm text-gray-500 mt-1">Policies, manuals, and company-wide documents</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> Upload
          </button>
        </div>

        <div className="relative max-w-sm">
          <input type="text" placeholder="Search documents..." value={search} onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-4 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((doc, i) => (
            <div key={doc.id || i} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between mb-3">
                <div className="p-2 bg-purple-50 rounded-lg"><FileText className="w-5 h-5 text-purple-600" /></div>
                <StatusBadge status={doc.status} />
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">{doc.name}</h3>
              <div className="space-y-1 text-xs text-gray-500">
                <p>Type: {doc.type || doc.category || "-"} | Version: {doc.version || "1.0"}</p>
                <p>Updated: {formatDate(doc.updatedDate || doc.updated)}</p>
                <p>Size: {doc.size || "-"}</p>
              </div>
              <button className="mt-3 w-full flex items-center justify-center gap-2 px-3 py-2 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50">
                <Download className="w-4 h-4" /> Download
              </button>
            </div>
          ))}
          {filtered.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-400">No documents found</div>
          )}
        </div>
      </div>
    </HRPage>
  );
}
