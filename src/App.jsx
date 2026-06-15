import { Routes, Route } from "react-router-dom";
import SuperAdminShell from "./components/SuperAdminShell";
import { flatRoutes } from "./navigation";
import PagePlaceholder from "./components/PagePlaceholder";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Target 'HrDashBoard.jsx' directly
import ZoikoHRModule from "./modules/zoiko-hr/HrDashBoard.jsx";

// Sub-module imports pointing explicitly to their component files inside each directory
import ZoikoHRWorkforce from "./modules/zoiko-hr/workforce/workforce.jsx";
import ZoikoHRDepartments from "./modules/zoiko-hr/departments/departments.jsx";
import ZoikoHRLeave from "./modules/zoiko-hr/leave/leave.jsx";
import ZoikoHRAttendance from "./modules/zoiko-hr/attendance/attendance.jsx";
import ZoikoHRPerformance from "./modules/zoiko-hr/performance/performance.jsx";
import ZoikoHRRecruitment from "./modules/zoiko-hr/recruitment/recruitment.jsx";
import ZoikoHROnboarding from "./modules/zoiko-hr/onboarding/onboarding.jsx";
import ZoikoHRAssets from "./modules/zoiko-hr/assets/assets.jsx";
import ZoikoHRLearning from "./modules/zoiko-hr/learning/learning.jsx";
import ZoikoHRCompensation from "./modules/zoiko-hr/compensation/compensation.jsx";
import ZoikoHREss from "./modules/zoiko-hr/ess/ess.jsx";
import ZoikoHRTravel from "./modules/zoiko-hr/travel/travel.jsx";
import ZoikoHRCompliance from "./modules/zoiko-hr/compliance/compliance.jsx";
import ZoikoHREngagement from "./modules/zoiko-hr/engagement/engagement.jsx";
import ZoikoHRWorkforcePlanning from "./modules/zoiko-hr/workforce-planning/workforce-planning.jsx";

import ZoikoTimeModule from "./modules/zoikotime";
import ZoikoPayrollModule from "./modules/payroll";
import ZoikoBillingModule from "./modules/billing";
import ZoikoComplyModule from "./modules/comply";
import ZoikoInsightsModule from "./modules/insights";

// Platform Governance modules
import RolesPage from "./modules/governance/RolesPage";
import SecurityPage from "./modules/governance/SecurityPage";
import TrustPage from "./modules/governance/TrustPage";
import AuditPage from "./modules/governance/AuditPage";
import CompliancePage from "./modules/governance/CompliancePage";

// Platform Command modules
import DashboardPage from "./modules/platform/DashboardPage";
import OrganizationsPage from "./modules/platform/OrganizationsPage";
import SubscriptionsPage from "./modules/platform/SubscriptionsPage";

// Platform Operations modules
import AdminProfilePage from "./modules/operations/AdminProfilePage";
import IntegrationsPage from "./modules/operations/IntegrationsPage";
import ApiManagementPage from "./modules/operations/ApiManagementPage";
import FeatureFlagsPage from "./modules/operations/FeatureFlagsPage";
import NotificationsPage from "./modules/operations/NotificationsPage";
import SystemMonitoringPage from "./modules/operations/SystemMonitoringPage";
import SupportCenterPage from "./modules/operations/SupportCenterPage";

// Shared Layers modules
import ZoikoIdPage from "./modules/shared-layers/ZoikoIdPage";
import ZoikoWorkflowPage from "./modules/shared-layers/ZoikoWorkflowPage";
import ZoikoHubPage from "./modules/shared-layers/ZoikoHubPage";
import ZoikoConnectPage from "./modules/shared-layers/ZoikoConnectPage";
import DocumentsPage from "./modules/shared-layers/DocumentsPage";
import ApprovalsPage from "./modules/shared-layers/ApprovalsPage";
import ExpensesPage from "./modules/shared-layers/ExpensesPage";
import AiAssistancePage from "./modules/shared-layers/AiAssistancePage";

const routeOverrides = {
  "/dashboard": <DashboardPage />,
  "/organizations": <OrganizationsPage />,
  "/subscriptions": <SubscriptionsPage />,
  "/shared/id": <ZoikoIdPage />,
  "/shared/workflow": <ZoikoWorkflowPage />,
  "/shared/hub": <ZoikoHubPage />,
  "/shared/connect": <ZoikoConnectPage />,
  "/shared/documents": <DocumentsPage />,
  "/shared/approvals": <ApprovalsPage />,
  "/shared/expenses": <ExpensesPage />,
  "/shared/ai-assistance": <AiAssistancePage />,
  "/zoiko-hr": <ZoikoHRModule />,
  "/zoiko-hr/workforce": <ZoikoHRWorkforce />,
  "/zoiko-hr/departments": <ZoikoHRDepartments />,
  "/zoiko-hr/leave": <ZoikoHRLeave />,
  "/zoiko-hr/attendance": <ZoikoHRAttendance />,
  "/zoiko-hr/performance": <ZoikoHRPerformance />,
  "/zoiko-hr/recruitment": <ZoikoHRRecruitment />,
  "/zoiko-hr/onboarding": <ZoikoHROnboarding />,
  "/zoiko-hr/assets": <ZoikoHRAssets />,
  "/zoiko-hr/learning": <ZoikoHRLearning />,
  "/zoiko-hr/compensation": <ZoikoHRCompensation />,
  "/zoiko-hr/ess": <ZoikoHREss />,
  "/zoiko-hr/travel": <ZoikoHRTravel />,
  "/zoiko-hr/compliance": <ZoikoHRCompliance />,
  "/zoiko-hr/engagement": <ZoikoHREngagement />,
  "/zoiko-hr/workforce-planning": <ZoikoHRWorkforcePlanning />,
  "/zoikotime": <ZoikoTimeModule />,
  "/payroll": <ZoikoPayrollModule />,
  "/payroll/company-setup": <ZoikoPayrollModule />,
  "/payroll/employees": <ZoikoPayrollModule />,
  "/payroll/payroll-runs": <ZoikoPayrollModule />,
  "/payroll/exceptions": <ZoikoPayrollModule />,
  "/payroll/approvals": <ZoikoPayrollModule />,
  "/payroll/payments": <ZoikoPayrollModule />,
  "/payroll/payslips": <ZoikoPayrollModule />,
  "/payroll/reports": <ZoikoPayrollModule />,
  "/payroll/audit": <ZoikoPayrollModule />,
  "/payroll/settings": <ZoikoPayrollModule />,
  "/billing": <ZoikoBillingModule />,
  "/comply": <ZoikoComplyModule />,
  "/insights": <ZoikoInsightsModule />,
  "/roles": <RolesPage />,
  "/security-center": <SecurityPage />,
  "/trust-center": <TrustPage />,
  "/audit-center": <AuditPage />,
  "/compliance-center": <CompliancePage />,
  "/operations/integrations": <IntegrationsPage />,
  "/operations/api-management": <ApiManagementPage />,
  "/operations/feature-flags": <FeatureFlagsPage />,
  "/operations/notifications": <NotificationsPage />,
  "/operations/system-monitoring": <SystemMonitoringPage />,
  "/operations/support-center": <SupportCenterPage />,
  "/admin-profile": <AdminProfilePage />,
};

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<HomePage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route
        path="/*"
        element={
          <ProtectedRoute>
            <SuperAdminShell>
              <Routes>
                {flatRoutes.map((route) => (
                  <Route
                    key={route.href}
                    path={route.href}
                    element={
                      routeOverrides[route.href] ?? (
                        <PagePlaceholder title={route.label} path={route.href} badge={route.badge} />
                      )
                    }
                  />
                ))}
                <Route path="*" element={<PagePlaceholder title="Not Found" description="This page is not available yet." />} />
              </Routes>
            </SuperAdminShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}