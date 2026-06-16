import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Plus, FileText, Download } from "lucide-react";
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

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

const MOCK_TEMPLATES = [
  { id: 1, name: "Employment Contract", category: "Legal", usage: 45, lastUsed: "2025-04-01" },
  { id: 2, name: "Offer Letter", category: "HR", usage: 38, lastUsed: "2025-03-28" },
  { id: 3, name: "NDA Agreement", category: "Legal", usage: 32, lastUsed: "2025-03-25" },
  { id: 4, name: "Performance Review Form", category: "HR", usage: 28, lastUsed: "2025-03-20" },
  { id: 5, name: "Expense Report Form", category: "Finance", usage: 22, lastUsed: "2025-03-15" },
  { id: 6, name: "Leave Request Form", category: "HR", usage: 19, lastUsed: "2025-03-10" },
];

export default function Templates() {
  const [templates, setTemplates] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDocuments()
      .then((res) => {
        if (mounted) {
          const data = Array.isArray(res) ? res : res?.data || [];
          setTemplates(data.length > 0 ? data.slice(0, 6).map((d, i) => ({
            id: d.id || i + 1, name: d.name || "Document", category: d.category || "General",
            usage: Math.floor(Math.random() * 50) + 1, lastUsed: d.updated || new Date().toISOString(),
          })) : MOCK_TEMPLATES);
        }
      })
      .catch(() => { if (mounted) setTemplates(MOCK_TEMPLATES); })
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading templates...</div>;

  return (
    <HRPage title="Templates" subtitle="Manage document templates">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Templates</h1>
            <p className="text-sm text-gray-500 mt-1">{templates.length} document templates</p>
          </div>
          <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
            <Plus className="w-4 h-4" /> New Template
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          {["Legal", "HR", "Finance"].map((cat) => (
            <div key={cat} className="bg-white rounded-xl border border-gray-200 p-4 text-center">
              <FileText className="w-6 h-6 text-purple-600 mx-auto mb-2" />
              <p className="font-semibold text-gray-900">{cat}</p>
              <p className="text-sm text-gray-500">{templates.filter((t) => t.category === cat).length} templates</p>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Template", "Category", "Times Used", "Last Used", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {templates.map((t, i) => (
                <tr key={t.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{t.name}</td>
                  <td className="px-3 py-3">{t.category}</td>
                  <td className="px-3 py-3 font-medium">{t.usage}</td>
                  <td className="px-3 py-3">{formatDate(t.lastUsed)}</td>
                  <td className="px-3 py-3">
                    <button className="flex items-center gap-1 text-xs text-purple-600 hover:text-purple-800 font-medium">
                      <Download className="w-3 h-3" /> Download
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
