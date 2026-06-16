import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Shield, FileText, CheckCircle, AlertTriangle, ClipboardList, TrendingUp } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getComplianceDashboard } from "../../../service/hrService";

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

function StatsCard({ title, value, icon: Icon, change, trend }) {
  const trendIcon = trend === "up" ? TrendingUp : trend === "down" ? TrendingUp : null;
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <div className="p-2 bg-emerald-50 rounded-lg">
          <Icon size={20} className="text-emerald-600" />
        </div>
        {trendIcon && (
          <span className={`flex items-center gap-0.5 text-xs font-medium ${trend === "up" ? "text-red-500" : trend === "down" ? "text-emerald-500" : "text-gray-400"}`}>
            <trendIcon size={14} className={trend === "down" ? "rotate-180" : ""} />
            {Math.abs(change)}
          </span>
        )}
      </div>
      <p className="text-2xl font-bold text-gray-900 mt-3">{value}</p>
      <p className="text-xs text-gray-500 mt-1">{title}</p>
    </div>
  );
}

function DataTable({ columns, data }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left">
        <thead>
          <tr className="border-b border-gray-100 text-xs text-gray-500 uppercase tracking-wider">
            {columns.map((col) => (
              <th key={col.key} className="px-3 py-3 font-medium">{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={row.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
              {columns.map((col) => (
                <td key={col.key} className="px-3 py-3">{col.render ? col.render(row[col.key], row) : row[col.key]}</td>
              ))}
            </tr>
          ))}
          {data.length === 0 && (
            <tr><td colSpan={columns.length} className="px-3 py-8 text-center text-gray-400">No data</td></tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

function StatusBadge({ status }) {
  const colorMap = {
    active: "bg-emerald-100 text-emerald-800", acknowledged: "bg-emerald-100 text-emerald-800",
    pending: "bg-yellow-100 text-yellow-800", open: "bg-red-100 text-red-800",
    investigating: "bg-orange-100 text-orange-800", resolved: "bg-blue-100 text-blue-800",
    closed: "bg-gray-100 text-gray-800", planned: "bg-blue-100 text-blue-800",
    in_progress: "bg-orange-100 text-orange-800", completed: "bg-green-100 text-green-800",
    overdue: "bg-red-100 text-red-800", draft: "bg-gray-100 text-gray-800",
  };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorMap[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function ComplianceDashboard() {
  const [data, setData] = useState({ stats: {}, recentViolations: [], pendingItems: [] });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    getComplianceDashboard()
      .then((res) => { if (mounted) { const d = res?.data || res || {}; setData({ stats: d.stats || {}, recentViolations: d.recentViolations || [], pendingItems: d.pendingItems || [] }); } })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { stats, recentViolations, pendingItems } = data;

  const statCards = [
    { title: "Total Policies", value: stats.totalPolicies || 0, icon: FileText, change: 2, trend: "up" },
    { title: "Pending Acknowledgment", value: stats.pendingAcknowledgment || 0, icon: Shield, change: -1, trend: "down" },
    { title: "Open Violations", value: stats.openViolations || 0, icon: AlertTriangle, change: 1, trend: "up" },
    { title: "Upcoming Audits", value: stats.upcomingAudits || 0, icon: ClipboardList, change: 0, trend: "neutral" },
    { title: "Completed Audits", value: stats.completedAudits || 0, icon: CheckCircle, change: 3, trend: "up" },
    { title: "Risk Score", value: `${stats.riskScore || 0}/100`, icon: TrendingUp, change: -5, trend: "down" },
  ];

  const violationColumns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "policy", label: "Policy" },
    { key: "severity", label: "Severity", render: (v) => <StatusBadge status={v} /> },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <HRPage title="Compliance Dashboard" subtitle="Overview of compliance metrics, violations, and pending items">
      <SubNav />
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
          {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Recent Violations</h2>
              <span className="text-xs text-emerald-600 font-medium">View all</span>
            </div>
            <DataTable columns={violationColumns} data={recentViolations} />
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Pending Items</h2>
            <div className="space-y-3">
              {pendingItems.map((item) => (
                <div key={item.id} className="flex items-start gap-3 p-3 rounded-lg bg-gray-50 hover:bg-emerald-50 transition-colors">
                  <div className="p-1.5 bg-white rounded-full shadow-sm">
                    {item.type === "Policy Acknowledgment" ? <FileText size={16} className="text-emerald-600" /> :
                     item.type === "Audit Scheduled" ? <ClipboardList size={16} className="text-blue-600" /> :
                     item.type === "Corrective Action" ? <CheckCircle size={16} className="text-orange-600" /> :
                     <AlertTriangle size={16} className="text-amber-600" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 truncate">{item.description}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{item.type} &middot; Due {formatDate(item.dueDate)}</p>
                  </div>
                  <span className="text-xs text-gray-400 truncate max-w-[100px]">{item.assignee}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </HRPage>
  );
}
