import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getAuditLogs, type AuditLogRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function NotificationsPage() {
  const notifications = await getAuditLogs();

  const columns: TableColumn<AuditLogRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "actor", header: "Source" },
    { key: "action", header: "Notification" },
    { key: "category", header: "Category" },
    { key: "outcome", header: "Outcome", render: (row) => <StatusBadge status={row.outcome} /> },
    { key: "createdAt", header: "Received" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Notifications" description="Platform notification stream and event outcomes for Super Admin operations." />
      <ReusableTable title="Notification Events" columns={columns} data={notifications} />
    </SuperAdminShell>
  );
}
