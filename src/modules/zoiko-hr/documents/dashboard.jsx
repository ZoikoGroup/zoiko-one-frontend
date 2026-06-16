import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { FileText, Clock, AlertTriangle, FileCheck2, Shield } from "lucide-react";
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

function StatsCard({ title, value, icon: Icon, change, trend }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-purple-50 rounded-lg"><Icon size={20} className="text-purple-600" /></div>
        {trend && (
          <span className={`text-xs font-medium ${trend === "up" ? "text-red-500" : trend === "down" ? "text-emerald-500" : "text-gray-400"}`}>
            {change > 0 ? "+" : ""}{change}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{title}</p>
    </div>
  );
}

function StatusBadge({ status }) {
  const colorMap = { pending: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function DocumentsDashboard() {
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getDocuments()
      .then((res) => { if (mounted) setTotal(Array.isArray(res) ? res.length : res?.data?.length || 0); })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const statCards = [
    { title: "Total Documents", value: total, icon: FileText, change: 12, trend: "up" },
    { title: "Pending Approvals", value: 3, icon: Clock, change: -3, trend: "down" },
    { title: "Expiring Soon", value: 5, icon: AlertTriangle, change: 2, trend: "up" },
    { title: "Expired", value: 2, icon: AlertTriangle, change: 0, trend: "neutral" },
    { title: "Templates", value: 6, icon: FileCheck2, change: 2, trend: "up" },
    { title: "Compliance Docs", value: 8, icon: Shield, change: 5, trend: "up" },
  ];

  return (
    <HRPage title="Documents Dashboard" subtitle="Overview of document management">
      <SubNav />
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
        </div>
      </div>
    </HRPage>
  );
}
