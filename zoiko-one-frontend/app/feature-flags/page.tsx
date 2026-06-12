import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getGovernancePolicies, type GovernancePolicyRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function FeatureFlagsPage() {
  const policies = await getGovernancePolicies();

  const columns: TableColumn<GovernancePolicyRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "name", header: "Flag" },
    { key: "domain", header: "Domain" },
    { key: "enforcement", header: "State" },
    { key: "exceptions", header: "Exceptions" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Feature Flags" description="Feature rollout governance and flag status visibility for platform releases." />
      <ReusableTable title="Feature Flag Policies" columns={columns} data={policies} />
    </SuperAdminShell>
  );
}
