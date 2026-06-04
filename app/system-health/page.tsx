import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getSystemHealth, type SystemHealthRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function SystemHealthPage() {
  const health = await getSystemHealth();
  const columns: TableColumn<SystemHealthRow>[] = [
    { key: "name", header: "Service" },
    { key: "detail", header: "Detail" },
    { key: "checkedAt", header: "Checked" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="System Health" description="Operational status for the platform services prepared in this phase." />
      <ReusableTable title="Health Checks" columns={columns} data={health} />
    </SuperAdminShell>
  );
}
