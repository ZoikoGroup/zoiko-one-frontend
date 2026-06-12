import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getZoikoCoreXWorkflows, type ZoikoCoreXRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function ZoikoCoreXPage() {
  const workflows = await getZoikoCoreXWorkflows();
  const columns: TableColumn<ZoikoCoreXRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "name", header: "Workflow" },
    { key: "integrationName", header: "Integration" },
    { key: "executions", header: "Executions" },
    { key: "failures", header: "Failures" },
    { key: "lastRunAt", header: "Last Run" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="ZoikoCoreX" description="Workflow executions, integration health, background jobs, and automation reliability." />
      <ReusableTable title="Workflow Operations" columns={columns} data={workflows} />
    </SuperAdminShell>
  );
}
