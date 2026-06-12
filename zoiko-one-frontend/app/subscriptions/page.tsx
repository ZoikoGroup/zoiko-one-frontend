import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getSubscriptions, type SubscriptionRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function SubscriptionsPage() {
  const subscriptions = await getSubscriptions();
  const columns: TableColumn<SubscriptionRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "product", header: "Product" },
    { key: "plan", header: "Plan" },
    { key: "seats", header: "Seats" },
    { key: "monthlyAmount", header: "MRR" },
    { key: "renewalDate", header: "Renewal" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Subscriptions" description="Tenant product entitlements across Zoiko HR, ZoikoTime, Payroll, Billing, Comply, and Insights." />
      <ReusableTable title="Subscription Portfolio" columns={columns} data={subscriptions} />
    </SuperAdminShell>
  );
}
