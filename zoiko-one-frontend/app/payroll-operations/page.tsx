import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import SuperAdminShell from "../components/SuperAdminShell";
import { getPayrollOperations, type PayrollOperationRow } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function PayrollOperationsPage() {
  const payrollRuns = await getPayrollOperations();
  const columns: TableColumn<PayrollOperationRow>[] = [
    { key: "tenantName", header: "Tenant" },
    { key: "runCode", header: "Run" },
    { key: "scheduleName", header: "Schedule" },
    { key: "payPeriod", header: "Pay Period" },
    { key: "grossAmount", header: "Gross Amount" },
    { key: "employeeCount", header: "Employees" },
    { key: "approvalsPending", header: "Pending Approvals" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Payroll Operations" description="Governance monitoring for payroll runs, approvals, failures, corrections, and audit readiness." />
      <ReusableTable title="Payroll Run Monitor" columns={columns} data={payrollRuns} />
    </SuperAdminShell>
  );
}
