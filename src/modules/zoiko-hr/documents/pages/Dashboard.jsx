import { FileText, Clock, AlertTriangle, CheckCircle, FileCheck2, Shield } from "lucide-react";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useDocumentsDashboard, useApprovals } from "../hooks/useDocuments";
import { formatDate } from "../utils/helpers";

export default function DocumentsDashboard() {
  const { data: stats, loading: sLoad } = useDocumentsDashboard();
  const { data: approvals, loading: aLoad } = useApprovals();

  if (sLoad || aLoad) return <div className="p-6 text-gray-400">Loading...</div>;

  const statCards = [
    { title: "Total Documents", value: stats.totalDocuments, icon: FileText, change: 12, trend: "up" },
    { title: "Pending Approvals", value: stats.pendingApprovals, icon: Clock, change: -3, trend: "down" },
    { title: "Expiring Soon", value: stats.expiringSoon, icon: AlertTriangle, change: 2, trend: "up" },
    { title: "Expired", value: stats.expired, icon: AlertTriangle, change: 0, trend: "neutral" },
    { title: "Templates", value: stats.templates, icon: FileCheck2, change: 2, trend: "up" },
    { title: "Compliance Docs", value: stats.complianceDocs, icon: Shield, change: 5, trend: "up" },
  ];

  const approvalColumns = [
    { key: "document", label: "Document", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "requester", label: "Requester" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "requestedDate", label: "Requested", render: (v) => formatDate(v) },
    { key: "approver", label: "Approver" },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Documents Dashboard</h1>
        <p className="text-sm text-gray-500 mt-1">Overview of document management</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        {statCards.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Pending Approvals</h2>
          <span className="text-xs text-purple-600 font-medium">View all</span>
        </div>
        <DataTable columns={approvalColumns} data={approvals.filter((a) => a.status === "pending").slice(0, 4)} />
      </div>
    </div>
  );
}
