import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getBilling, type BillingRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function BillingPage() {
  const billing = await getBilling();
  const columns: TableColumn<BillingRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "plan", header: "Plan" },
    { key: "amount", header: "Amount" },
    { key: "renewalDate", header: "Renewal" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Billing" description="Subscription billing readiness for tenant plans. Payroll billing is not implemented." />
      <ReusableTable title="Billing Accounts" columns={columns} data={billing} />
    </SuperAdminShell>
  );
}
