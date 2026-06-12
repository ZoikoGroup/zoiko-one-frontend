import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getGovernancePolicies, type GovernancePolicyRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function TrustCenterPage() {
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
      <PageHeader title="Trust Center" description="Trust and compliance posture for platform governance policies." />
      <ReusableTable title="Trust Policies" columns={columns} data={policies} />
    </SuperAdminShell>
  );
}
