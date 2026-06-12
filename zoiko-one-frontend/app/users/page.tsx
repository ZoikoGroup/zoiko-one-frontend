import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getUsers, type UserRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function UsersPage() {
  const users = await getUsers();
  const columns: TableColumn<UserRow>[] = [
    { key: "name", header: "User" },
    { key: "email", header: "Email" },
    { key: "tenantName", header: "Tenant" },
    { key: "emailVerified", header: "Email" },
    { key: "createdAt", header: "Created" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Users" description="Monitor platform users and account verification state." />
      <ReusableTable title="User Directory" columns={columns} data={users} />
    </SuperAdminShell>
  );
}
