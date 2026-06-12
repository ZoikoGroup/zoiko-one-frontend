import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getTenants, type TenantRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function TenantsPage() {
  const tenants = await getTenants();
  const columns: TableColumn<TenantRow>[] = [
    { key: "name", header: "Tenant" },
    { key: "slug", header: "Slug" },
    { key: "organizations", header: "Organizations" },
    { key: "users", header: "Users" },
    { key: "createdAt", header: "Created" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Tenants" description="Manage tenant lifecycle, activation state, and tenant-level usage." />
      <ReusableTable title="Tenant Directory" columns={columns} data={tenants} />
    </SuperAdminShell>
  );
}
