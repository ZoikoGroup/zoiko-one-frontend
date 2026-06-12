import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import SuperAdminShell from "../components/SuperAdminShell";
import { getAuditLogs, type AuditLogRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function AuditLogsPage() {
  const logs = await getAuditLogs();
  const columns: TableColumn<AuditLogRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "actor", header: "Actor" },
    { key: "action", header: "Action" },
    { key: "eventType", header: "Event" },
    { key: "category", header: "Category" },
    { key: "outcome", header: "Outcome" },
    { key: "resource", header: "Resource" },
    { key: "createdAt", header: "Created" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Audit Center" description="Searchable platform audit trail for authentication, governance, payroll, compliance, billing, security, and system events." />
      <ReusableTable title="Audit Events" columns={columns} data={logs} />
    </SuperAdminShell>
  );
}
