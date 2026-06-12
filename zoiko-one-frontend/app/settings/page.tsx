import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getGovernancePolicies, type GovernancePolicyRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function SettingsPage() {
  const policies = await getGovernancePolicies();
  const columns: TableColumn<GovernancePolicyRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "name", header: "Policy" },
    { key: "domain", header: "Domain" },
    { key: "enforcement", header: "Enforcement" },
    { key: "exceptions", header: "Exceptions" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Settings" description="Governance policies controlling RBAC, payroll, compliance, billing, security, and retention." />
      <ReusableTable title="Governance Policies" columns={columns} data={policies} />
    </SuperAdminShell>
  );
}
