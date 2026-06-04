import { getUsers, type UserRow } from "../services/superAdminService";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";

export const dynamic = "force-dynamic";

export default async function ZoikoHRPage() {
  const users = await getUsers();

  const columns: TableColumn<UserRow>[] = [
    { key: "name", header: "Name" },
    { key: "email", header: "Email" },
    { key: "tenantName", header: "Tenant" },
    { key: "status", header: "Status" },
    { key: "emailVerified", header: "Email Verified" },
    { key: "createdAt", header: "Joined" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Zoiko HR" description="Manage users and directory across tenants." />
      <ReusableTable title="Users" columns={columns} data={users} />
    </SuperAdminShell>
  );
}
