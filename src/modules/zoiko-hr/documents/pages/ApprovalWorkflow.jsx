import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useApprovals } from "../hooks/useDocuments";
import { formatDate } from "../utils/helpers";
import { CheckCircle, XCircle, Clock } from "lucide-react";

export default function ApprovalWorkflow() {
  const { data: approvals, loading } = useApprovals();

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const pending = approvals.filter((a) => a.status === "pending");
  const completed = approvals.filter((a) => a.status !== "pending");

  const columns = [
    { key: "document", label: "Document", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "requester", label: "Requester" },
    { key: "type", label: "Type" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "requestedDate", label: "Requested", render: (v) => formatDate(v) },
    { key: "approver", label: "Approver" },
    { key: "actions", label: "", render: (v, r) => r.status === "pending" ? (
      <div className="flex gap-2">
        <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"><CheckCircle className="w-3 h-3" /> Approve</button>
        <button className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"><XCircle className="w-3 h-3" /> Reject</button>
      </div>
    ) : null},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Approval Workflow</h1>
        <p className="text-sm text-gray-500 mt-1">Manage document approvals and workflows</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-yellow-50 rounded-xl border border-yellow-200 p-4">
          <div className="flex items-center gap-2"><Clock className="w-4 h-4 text-yellow-600" /><p className="text-xs text-yellow-600 font-medium">Pending</p></div>
          <p className="text-2xl font-bold text-yellow-700 mt-1">{pending.length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <div className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-600" /><p className="text-xs text-green-600 font-medium">Approved</p></div>
          <p className="text-2xl font-bold text-green-700 mt-1">{completed.filter((a) => a.status === "approved").length}</p>
        </div>
        <div className="bg-red-50 rounded-xl border border-red-200 p-4">
          <div className="flex items-center gap-2"><XCircle className="w-4 h-4 text-red-600" /><p className="text-xs text-red-600 font-medium">Rejected</p></div>
          <p className="text-2xl font-bold text-red-700 mt-1">{completed.filter((a) => a.status === "rejected").length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={approvals} />
    </div>
  );
}
