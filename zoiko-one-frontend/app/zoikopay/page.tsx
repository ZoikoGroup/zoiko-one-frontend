import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getZoikoPayTransactions, type ZoikoPayRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function ZoikoPayPage() {
  const transactions = await getZoikoPayTransactions();
  const columns: TableColumn<ZoikoPayRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "reference", header: "Reference" },
    { key: "amount", header: "Amount" },
    { key: "settlementStatus", header: "Settlement" },
    { key: "processedAt", header: "Processed" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="ZoikoPay" description="Transaction volume, failure monitoring, settlement status, and payment health for platform finance operations." />
      <ReusableTable title="Payment Transactions" columns={columns} data={transactions} />
    </SuperAdminShell>
  );
}
