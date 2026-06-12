import { getPayrollOperations, type PayrollOperationRow } from "../services/superAdminService";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";

export const dynamic = "force-dynamic";

export default async function PayrollPage() {
  const runs = await getPayrollOperations();

  const columns: TableColumn<PayrollOperationRow>[] = [
    { key: "runCode", header: "Run" },
    { key: "tenantName", header: "Tenant" },
    { key: "scheduleName", header: "Schedule" },
    { key: "payPeriod", header: "Pay Period" },
    { key: "grossAmount", header: "Gross" },
    { key: "employeeCount", header: "Employees" },
    { key: "status", header: "Status" },
  ];

  return (
    <SuperAdminShell>
      <PageHeader title="Zoiko Payroll" description="Payroll operations and runs across tenants." />
      <ReusableTable title="Payroll Runs" columns={columns} data={runs} />
    </SuperAdminShell>
  );
}
