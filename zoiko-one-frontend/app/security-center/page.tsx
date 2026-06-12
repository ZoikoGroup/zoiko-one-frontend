import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import { getGovernancePolicies, type GovernancePolicyRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function SecurityCenterPage() {
  const rows = await getGovernancePolicies();

  const columns: TableColumn<GovernancePolicyRow>[] = [
    { key: "name", header: "Policy" },
    { key: "tenantName", header: "Tenant" },
    { key: "domain", header: "Domain" },
    { key: "enforcement", header: "Enforcement" },
    { key: "exceptions", header: "Exceptions" },
    { key: "status", header: "Status" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Security Center" description="Governance policies and enforcement across tenants." />
      <ReusableTable title="Policies" columns={columns} data={rows} />
    </SuperAdminShell>
  );
}
