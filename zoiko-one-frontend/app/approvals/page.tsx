import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getApprovalWorkflows, type ApprovalWorkflowRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function ApprovalsPage() {
  const workflows = await getApprovalWorkflows();
  const columns: TableColumn<ApprovalWorkflowRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "workflowType", header: "Workflow" },
    { key: "title", header: "Title" },
    { key: "resourceType", header: "Resource" },
    { key: "approver", header: "Approver" },
    { key: "escalationLevel", header: "Escalation" },
    { key: "dueAt", header: "Due" },
    { key: "history", header: "History" },
    { key: "state", header: "State", render: (row) => <StatusBadge status={row.state} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Approvals" description="Governance workflows for payroll, compliance, subscriptions, and tenant activation." />
      <ReusableTable title="Approval Workflows" columns={columns} data={workflows} />
    </SuperAdminShell>
  );
}
