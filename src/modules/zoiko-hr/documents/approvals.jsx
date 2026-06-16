import { useState } from "react";
import { NavLink } from "react-router-dom";
import { CheckCircle, XCircle, Clock } from "lucide-react";
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

const MOCK_APPROVALS = [
  { id: 1, document: "Travel Reimbursement", requester: "Eve M.", type: "Expense", status: "pending", requestedDate: "2025-03-05", approver: "Jane D." },
  { id: 2, document: "Resignation Letter", requester: "Grace C.", type: "HR", status: "pending", requestedDate: "2025-03-12", approver: "Sarah M." },
  { id: 3, document: "Remote Work Policy", requester: "Tom K.", type: "Policy", status: "pending", requestedDate: "2025-03-01", approver: "Mike R." },
  { id: 4, document: "Training Budget", requester: "Alice J.", type: "Finance", status: "approved", requestedDate: "2025-02-28", approver: "Carol D." },
  { id: 5, document: "Equipment Purchase", requester: "Bob S.", type: "Procurement", status: "rejected", requestedDate: "2025-02-20", approver: "Lisa P." },
  { id: 6, document: "Time Off Request", requester: "Frank L.", type: "HR", status: "approved", requestedDate: "2025-03-10", approver: "Mike R." },
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
  const m = { pending: "bg-yellow-100 text-yellow-800", approved: "bg-green-100 text-green-800", rejected: "bg-red-100 text-red-800" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${m[status] || "bg-gray-100 text-gray-800"}`}>{status?.replace(/_/g, " ")}</span>;
}

function formatDate(dateStr) {
  if (!dateStr) return "-";
  try { return new Date(dateStr).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }); }
  catch { return dateStr; }
}

export default function ApprovalWorkflow() {
  const approvals = MOCK_APPROVALS;
  const pending = approvals.filter((a) => a.status === "pending");
  const completed = approvals.filter((a) => a.status !== "pending");

  return (
    <HRPage title="Approval Workflow" subtitle="Manage document approvals and workflows">
      <SubNav />
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

        <div className="bg-white rounded-xl border border-gray-200 overflow-x-auto">
          <table className="w-full text-left">
            <thead className="border-b border-gray-200 bg-gray-50 text-xs text-gray-500 uppercase tracking-wider">
              <tr>
                {["Document", "Requester", "Type", "Status", "Requested", "Approver", ""].map((h) => (
                  <th key={h} className="px-3 py-3 font-medium">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {approvals.map((a, i) => (
                <tr key={a.id || i} className="border-b border-gray-50 hover:bg-gray-50 text-sm">
                  <td className="px-3 py-3 font-medium text-gray-900">{a.document}</td>
                  <td className="px-3 py-3">{a.requester}</td>
                  <td className="px-3 py-3">{a.type}</td>
                  <td className="px-3 py-3"><StatusBadge status={a.status} /></td>
                  <td className="px-3 py-3">{formatDate(a.requestedDate)}</td>
                  <td className="px-3 py-3">{a.approver}</td>
                  <td className="px-3 py-3">
                    {a.status === "pending" && (
                      <div className="flex gap-2">
                        <button className="flex items-center gap-1 text-xs text-green-600 hover:text-green-800 font-medium"><CheckCircle className="w-3 h-3" /> Approve</button>
                        <button className="flex items-center gap-1 text-xs text-red-600 hover:text-red-800 font-medium"><XCircle className="w-3 h-3" /> Reject</button>
                      </div>
                    )}
                  </td>
                </tr>
              ))}
              {approvals.length === 0 && (
                <tr><td colSpan={7} className="px-3 py-8 text-center text-gray-400">No approvals found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </HRPage>
  );
}
