import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getApprovalWorkflows, type ApprovalWorkflowRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function SupportCenterPage() {
  const workflows = await getApprovalWorkflows();

  const columns: TableColumn<ApprovalWorkflowRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "workflowType", header: "Type" },
    { key: "title", header: "Title" },
    { key: "approver", header: "Assigned" },
    { key: "dueAt", header: "Due" },
    { key: "state", header: "State", render: (row) => <StatusBadge status={row.state} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Support Center" description="Service and escalation workflows for platform support operations." />
      <ReusableTable title="Support Workflows" columns={columns} data={workflows} />
    </SuperAdminShell>
  );
}
