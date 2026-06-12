import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getZoikoCoreXWorkflows, type ZoikoCoreXRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function IntegrationsPage() {
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
      <PageHeader title="Integrations" description="Integration workflow telemetry and health status across tenants." />
      <ReusableTable title="Integration Workflows" columns={columns} data={workflows} />
    </SuperAdminShell>
  );
}
