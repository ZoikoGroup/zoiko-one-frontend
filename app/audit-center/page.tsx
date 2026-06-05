import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import { getAuditLogs, type AuditLogRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function AuditCenterPage() {
  const rows = await getAuditLogs();

  const columns: TableColumn<AuditLogRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "actor", header: "Actor" },
    { key: "action", header: "Action" },
    { key: "eventType", header: "Event" },
    { key: "category", header: "Category" },
    { key: "outcome", header: "Outcome" },
    { key: "resource", header: "Resource" },
    { key: "createdAt", header: "When" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Audit Center" description="Audit logs across tenants and platform events." />
      <ReusableTable title="Audit Logs" columns={columns} data={rows} />
    </SuperAdminShell>
  );
}
