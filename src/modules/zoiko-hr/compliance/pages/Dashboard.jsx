import { Shield, FileText, CheckCircle, AlertTriangle, ClipboardList, TrendingUp } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useComplianceDashboard } from "../hooks/useCompliance";
import { formatDate } from "../utils/helpers";

export default function ComplianceDashboard() {
  const { data, loading } = useComplianceDashboard();

  if (loading) return <div className="p-6 text-gray-400">Loading dashboard...</div>;

  const { stats, recentViolations, pendingItems } = data;

  const statCards = [
    { title: "Total Policies", value: stats.totalPolicies, icon: FileText, change: 2, trend: "up" },
    { title: "Pending Acknowledgment", value: stats.pendingAcknowledgment, icon: Shield, change: -1, trend: "down" },
    { title: "Open Violations", value: stats.openViolations, icon: AlertTriangle, change: 1, trend: "up" },
    { title: "Upcoming Audits", value: stats.upcomingAudits, icon: ClipboardList, change: 0, trend: "neutral" },
    { title: "Completed Audits", value: stats.completedAudits, icon: CheckCircle, change: 3, trend: "up" },
    { title: "Risk Score", value: `${stats.riskScore}/100`, icon: TrendingUp, change: -5, trend: "down" },
  ];

  const violationColumns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "policy", label: "Policy" },
    { key: "severity", label: "Severity", render: (v) => <StatusBadge status={v} /> },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of compliance metrics, violations, and pending items</p>
      </div>

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
  );
}
