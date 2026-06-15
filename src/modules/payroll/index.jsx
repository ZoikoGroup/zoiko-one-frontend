import { useLocation } from "react-router-dom";
import { PayrollProvider } from "./PayrollContext";
import PayrollLayout from "./PayrollLayout";
import PayrollDashboard from "./dashboard/PayrollDashboard";
import CompanySetup from "./company-setup/CompanySetup";
import Employees from "./employees/Employees";
import PayrollRuns from "./payroll-runs/PayrollRuns";
import Exceptions from "./exceptions/Exceptions";
import Approvals from "./approvals/Approvals";
import Payments from "./payments/Payments";
import Payslips from "./payslips/Payslips";
import Reports from "./reports/Reports";
import AuditCompliance from "./audit/AuditCompliance";
import PayrollSettings from "./settings/PayrollSettings";

const pageMap = {
  "/payroll": <PayrollDashboard />,
  "/payroll/company-setup": <CompanySetup />,
  "/payroll/employees": <Employees />,
  "/payroll/payroll-runs": <PayrollRuns />,
  "/payroll/exceptions": <Exceptions />,
  "/payroll/approvals": <Approvals />,
  "/payroll/payments": <Payments />,
  "/payroll/payslips": <Payslips />,
  "/payroll/reports": <Reports />,
  "/payroll/audit": <AuditCompliance />,
  "/payroll/settings": <PayrollSettings />,
};

export default function ZoikoPayrollModule() {
  const { pathname } = useLocation();
  const page = pageMap[pathname] ?? <PayrollDashboard />;
  return (
    <PayrollProvider>
      <PayrollLayout>{page}</PayrollLayout>
    </PayrollProvider>
  );
}
