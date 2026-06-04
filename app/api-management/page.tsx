import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getAuditLogs, type AuditLogRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function ApiManagementPage() {
  const logs = await getAuditLogs();

  const columns: TableColumn<AuditLogRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "actor", header: "Actor" },
    { key: "action", header: "Action" },
    { key: "eventType", header: "Event Type" },
    { key: "category", header: "Category" },
    { key: "outcome", header: "Outcome", render: (row) => <StatusBadge status={row.outcome} /> },
    { key: "resource", header: "Resource" },
    { key: "createdAt", header: "Created" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="API Management" description="Audit and event visibility for API traffic, integrations and platform operations." />
      <ReusableTable title="API Activity" columns={columns} data={logs} />
    </SuperAdminShell>
  );
}
