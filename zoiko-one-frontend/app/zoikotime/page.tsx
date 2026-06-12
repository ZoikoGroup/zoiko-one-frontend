import { getPayrollOperations, type PayrollOperationRow } from "../services/superAdminService";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";

export const dynamic = "force-dynamic";

export default async function ZoikoTimePage() {
  const runs = await getPayrollOperations();

  const columns: TableColumn<PayrollOperationRow>[] = [
    { key: "runCode", header: "Run" },
    { key: "tenantName", header: "Tenant" },
    { key: "scheduleName", header: "Schedule" },
    { key: "payPeriod", header: "Pay Period" },
    { key: "grossAmount", header: "Gross" },
    { key: "employeeCount", header: "Employees" },
    { key: "approvalsPending", header: "Approvals Pending" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="ZoikoTime" description="Time and attendance operations, payroll run schedules, and approval readiness." />
      <ReusableTable title="Time Operations" columns={columns} data={runs} />
    </SuperAdminShell>
  );
}
