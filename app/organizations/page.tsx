import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getOrganizations, type OrganizationRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function OrganizationsPage() {
  const organizations = await getOrganizations();
  const columns: TableColumn<OrganizationRow>[] = [
    { key: "name", header: "Organization" },
    { key: "tenantName", header: "Tenant" },
    { key: "plan", header: "Plan" },
    { key: "employeesCount", header: "Employees" },
    { key: "createdAt", header: "Created" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Organizations" description="Review organization accounts across tenants and subscription plans." />
      <ReusableTable title="Organizations" columns={columns} data={organizations} />
    </SuperAdminShell>
  );
}
