import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import { getRolePermissions, type RolePermissionRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function RolesPage() {
  const rows = await getRolePermissions();

  const columns: TableColumn<RolePermissionRow>[] = [
    { key: "role", header: "Role" },
    { key: "scope", header: "Scope" },
    { key: "permissions", header: "Permissions" },
    { key: "users", header: "Users" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Users & Roles" description="Role and permission management across the platform." />
      <ReusableTable title="Roles" columns={columns} data={rows} />
    </SuperAdminShell>
  );
}
