import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import SuperAdminShell from "../components/SuperAdminShell";
import { getRolePermissions, type RolePermissionRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function RolesPermissionsPage() {
  const roles = await getRolePermissions();
  const columns: TableColumn<RolePermissionRow>[] = [
    { key: "role", header: "Role" },
    { key: "scope", header: "Scope" },
    { key: "permissions", header: "Permissions" },
    { key: "users", header: "Users" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Roles & Permissions" description="Prepared platform RBAC overview backed by current user counts." />
      <ReusableTable title="Role Matrix" columns={columns} data={roles} />
    </SuperAdminShell>
  );
}
