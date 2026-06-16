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
import {
  LeaveDashboard, MyLeave, LeaveRequests, LeaveCalendar,
  LeaveTypes, LeaveReports, LeaveSettings,
} from "./modules/zoiko-hr/leave/Index";

import {
  DepartmentsDashboard, DepartmentList, DepartmentStructure,
  DepartmentReports, DepartmentSettings,
} from "./modules/zoiko-hr/departments/Index";

import {
  DesignationsDashboard, DesignationList, LevelMatrix,
  DesignationReports, DesignationSettings,
} from "./modules/zoiko-hr/designations/Index";

import ZoikoHRPerformance from "./modules/zoiko-hr/performance/performance.jsx";
import ZoikoHRRecruitment from "./modules/zoiko-hr/recruitment/recruitment.jsx";
import ZoikoHROnboardingDashboard from "./modules/zoiko-hr/onboarding/dashboard.jsx";
import ZoikoHROnboardingNewHires from "./modules/zoiko-hr/onboarding/new-hires.jsx";
import ZoikoHROnboardingPreOnboarding from "./modules/zoiko-hr/onboarding/pre-onboarding.jsx";
import ZoikoHROnboardingDocuments from "./modules/zoiko-hr/onboarding/documents.jsx";
import ZoikoHROnboardingChecklists from "./modules/zoiko-hr/onboarding/checklists.jsx";
import ZoikoHROnboardingDeptAssignment from "./modules/zoiko-hr/onboarding/department-assignment.jsx";
import ZoikoHROnboardingManagerAssignment from "./modules/zoiko-hr/onboarding/manager-assignment.jsx";
import ZoikoHROnboardingAssetsAccess from "./modules/zoiko-hr/onboarding/assets-access.jsx";
import ZoikoHROnboardingOrientation from "./modules/zoiko-hr/onboarding/orientation.jsx";
import ZoikoHROnboardingTraining from "./modules/zoiko-hr/onboarding/training.jsx";
import ZoikoHROnboardingProgress from "./modules/zoiko-hr/onboarding/progress.jsx";
import ZoikoHROnboardingReports from "./modules/zoiko-hr/onboarding/reports.jsx";
import ZoikoHROnboardingSettings from "./modules/zoiko-hr/onboarding/settings.jsx";
import ZoikoHRLearning from "./modules/zoiko-hr/learning/learning.jsx";
import ZoikoHRCompensation from "./modules/zoiko-hr/compensation/compensation.jsx";
import { 
  WellnessPrograms, CSRActivities, Communications, Announcements, 
  NPSSurveys, EngagementAnalytics, EngagementReports, EngagementSettings 
} from "./pages/engagement/Index";

import {
  EssDashboard, EssProfile, EssLeaveManagement, EssAttendance,
  EssMyDocuments, EssRequests, EssSettings,
} from "./modules/zoiko-hr/ess/Index";

import {
  TravelDashboard, TravelRequests, TravelApprovals, TravelItineraries,
  TravelExpenses, TravelReports, TravelSettings,
} from "./modules/zoiko-hr/travel/Index";

import {
  AssetsDashboard, MyAssets, AssetCatalog, AssetRequests,
  AssetMaintenance, AssetReports, AssetSettings,
} from "./modules/zoiko-hr/assets/Index";

import {
  RecruitmentDashboard, JobRequisitions, OpenPositions, Candidates,
  CandidateDetails, InterviewPipeline, OfferManagement, HiringSchedule,
  RecruitmentAnalytics, RecruitmentReports, RecruitmentSettings,
} from "./modules/zoiko-hr/recruitment/Index";

import {
  PerformanceDashboard, GoalsOKRs, PerformanceReviews, Appraisals,
  Feedback, FortySixtyReviews, KpiTracking, Competencies,
  PerformanceAnalytics, PerformanceReports, PerformanceSettings,
} from "./modules/zoiko-hr/performance/Index";

import {
  DocumentsDashboard, EmployeeDocuments, CompanyDocuments, Templates,
  Policies, ComplianceDocuments, ApprovalWorkflow, ExpiringDocuments,
  Archive, DocumentsReports, DocumentsSettings,
} from "./modules/zoiko-hr/documents/Index";

import {
  ComplianceDashboard, PolicyLibrary, ComplianceTracking, Audits,
  Violations, RiskAssessment, Regulations, CorrectiveActions,
  ComplianceReports, ComplianceSettings,
} from "./modules/zoiko-hr/compliance/Index";

import {
  AttendanceDashboard, DailyRecords, MyAttendance, AttendanceCorrections,
  AttendanceSchedule, AttendanceReports, AttendanceSettings,
} from "./modules/zoiko-hr/attendance/Index";

import {
  WorkforceDashboard, WorkforcePlans, HeadcountPlanning, SuccessionPlanning,
  ScenarioPlanning, WorkforceReports, WorkforceSettings,
} from "./modules/zoiko-hr/workforce-planning/Index";

import ZoikoHRDocuments from "./modules/zoiko-hr/documents/documents.jsx";
import ZoikoHRLearningDashboard from "./modules/zoiko-hr/learning/dashboard.jsx";
import ZoikoHRLearningCourses from "./modules/zoiko-hr/learning/courses.jsx";
import ZoikoHRLearningTrainingPrograms from "./modules/zoiko-hr/learning/training-programs.jsx";
import ZoikoHRLearningPaths from "./modules/zoiko-hr/learning/learning-paths.jsx";
import ZoikoHRLearningCertifications from "./modules/zoiko-hr/learning/certifications.jsx";
import ZoikoHRLearningSkillMatrix from "./modules/zoiko-hr/learning/skill-matrix.jsx";
import ZoikoHRLearningAssessments from "./modules/zoiko-hr/learning/assessments.jsx";
import ZoikoHRLearningCalendar from "./modules/zoiko-hr/learning/calendar.jsx";
import ZoikoHRLearningProgress from "./modules/zoiko-hr/learning/progress.jsx";
import ZoikoHRLearningReports from "./modules/zoiko-hr/learning/reports.jsx";
import ZoikoHRCompDashboard from "./modules/zoiko-hr/compensation/dashboard.jsx";
import ZoikoHRCompSalaryStructures from "./modules/zoiko-hr/compensation/salary-structures.jsx";
import ZoikoHRCompPayGrades from "./modules/zoiko-hr/compensation/pay-grades.jsx";
import ZoikoHRCompSalaryComponents from "./modules/zoiko-hr/compensation/salary-components.jsx";
import ZoikoHRCompBands from "./modules/zoiko-hr/compensation/compensation-bands.jsx";
import ZoikoHRCompRevisions from "./modules/zoiko-hr/compensation/salary-revisions.jsx";
import ZoikoHRCompIncrements from "./modules/zoiko-hr/compensation/increments.jsx";
import ZoikoHRCompBonuses from "./modules/zoiko-hr/compensation/bonuses.jsx";
import ZoikoHRCompIncentives from "./modules/zoiko-hr/compensation/incentives.jsx";
import ZoikoHRCompAllowances from "./modules/zoiko-hr/compensation/allowances.jsx";
import ZoikoHRCompDeductions from "./modules/zoiko-hr/compensation/deductions.jsx";
import ZoikoHRCompBenefits from "./modules/zoiko-hr/compensation/benefits.jsx";
import ZoikoHRCompMedical from "./modules/zoiko-hr/compensation/medical-benefits.jsx";
import ZoikoHRCompInsurance from "./modules/zoiko-hr/compensation/insurance-benefits.jsx";
import ZoikoHRCompRetirement from "./modules/zoiko-hr/compensation/retirement-benefits.jsx";
import ZoikoHRCompReimbursements from "./modules/zoiko-hr/compensation/reimbursements.jsx";
import ZoikoHRCompPayroll from "./modules/zoiko-hr/compensation/payroll.jsx";
import ZoikoHRCompReports from "./modules/zoiko-hr/compensation/reports.jsx";
import ZoikoHRCompAnalytics from "./modules/zoiko-hr/compensation/analytics.jsx";
import ZoikoHRCompSettings from "./modules/zoiko-hr/compensation/settings.jsx";

import ZoikoTimeModule from "./modules/zoikotime";
import ZoikoPayrollModule from "./modules/payroll";
import ZoikoBillingModule from "./modules/billing";
import {
  ComplyDashboard, ComplyObligations, ComplyControlsLibrary, ControlDetail,
  ComplyRiskRegister, ComplyAudits, ComplyEvidence, ComplyPolicies,
  ComplyCalendar, ComplyIncidents, ComplyReports,
} from "./modules/comply";
import {
  InsightsDashboard, InsightsWorkforceAnalytics, InsightsPayrollAnalytics,
  InsightsFinancialAnalytics, InsightsProjectAnalytics, InsightsInventoryAnalytics,
  InsightsComplianceAnalytics, InsightsForecasting, InsightsCustomReports,
  InsightsSavedReports,
} from "./modules/insights";

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
  // Departments submodule routes
  "/zoiko-hr/departments": <DepartmentsDashboard />,
  "/zoiko-hr/departments/list": <DepartmentList />,
  "/zoiko-hr/departments/structure": <DepartmentStructure />,
  "/zoiko-hr/departments/reports": <DepartmentReports />,
  "/zoiko-hr/departments/settings": <DepartmentSettings />,
  // Designations submodule routes
  "/zoiko-hr/designations": <DesignationsDashboard />,
  "/zoiko-hr/designations/list": <DesignationList />,
  "/zoiko-hr/designations/levels": <LevelMatrix />,
  "/zoiko-hr/designations/reports": <DesignationReports />,
  "/zoiko-hr/designations/settings": <DesignationSettings />,
  // Leave submodule routes
  "/zoiko-hr/leave": <LeaveDashboard />,
  "/zoiko-hr/leave/my-leave": <MyLeave />,
  "/zoiko-hr/leave/requests": <LeaveRequests />,
  "/zoiko-hr/leave/calendar": <LeaveCalendar />,
  "/zoiko-hr/leave/leave-types": <LeaveTypes />,
  "/zoiko-hr/leave/reports": <LeaveReports />,
  "/zoiko-hr/leave/settings": <LeaveSettings />,
  // Attendance submodule routes
  "/zoiko-hr/attendance": <AttendanceDashboard />,
  "/zoiko-hr/attendance/daily": <DailyRecords />,
  "/zoiko-hr/attendance/my-attendance": <MyAttendance />,
  "/zoiko-hr/attendance/corrections": <AttendanceCorrections />,
  "/zoiko-hr/attendance/schedule": <AttendanceSchedule />,
  "/zoiko-hr/attendance/reports": <AttendanceReports />,
  "/zoiko-hr/attendance/settings": <AttendanceSettings />,
  "/zoiko-hr/performance": <ZoikoHRPerformance />,
  "/zoiko-hr/recruitment": <ZoikoHRRecruitment />,
  "/zoiko-hr/onboarding": <ZoikoHROnboardingDashboard />,
  "/zoiko-hr/onboarding/new-hires": <ZoikoHROnboardingNewHires />,
  "/zoiko-hr/onboarding/pre-onboarding": <ZoikoHROnboardingPreOnboarding />,
  "/zoiko-hr/onboarding/documents": <ZoikoHROnboardingDocuments />,
  "/zoiko-hr/onboarding/checklists": <ZoikoHROnboardingChecklists />,
  "/zoiko-hr/onboarding/department-assignment": <ZoikoHROnboardingDeptAssignment />,
  "/zoiko-hr/onboarding/manager-assignment": <ZoikoHROnboardingManagerAssignment />,
  "/zoiko-hr/onboarding/assets-access": <ZoikoHROnboardingAssetsAccess />,
  "/zoiko-hr/onboarding/orientation": <ZoikoHROnboardingOrientation />,
  "/zoiko-hr/onboarding/training": <ZoikoHROnboardingTraining />,
  "/zoiko-hr/onboarding/progress": <ZoikoHROnboardingProgress />,
  "/zoiko-hr/onboarding/reports": <ZoikoHROnboardingReports />,
  "/zoiko-hr/onboarding/settings": <ZoikoHROnboardingSettings />,
  // Assets submodule routes
  "/zoiko-hr/assets": <AssetsDashboard />,
  "/zoiko-hr/assets/my-assets": <MyAssets />,
  "/zoiko-hr/assets/catalog": <AssetCatalog />,
  "/zoiko-hr/assets/requests": <AssetRequests />,
  "/zoiko-hr/assets/maintenance": <AssetMaintenance />,
  "/zoiko-hr/assets/reports": <AssetReports />,
  "/zoiko-hr/assets/settings": <AssetSettings />,
  "/zoiko-hr/learning": <ZoikoHRLearningDashboard />,
  "/zoiko-hr/learning/courses": <ZoikoHRLearningCourses />,
  "/zoiko-hr/learning/training-programs": <ZoikoHRLearningTrainingPrograms />,
  "/zoiko-hr/learning/paths": <ZoikoHRLearningPaths />,
  "/zoiko-hr/learning/certifications": <ZoikoHRLearningCertifications />,
  "/zoiko-hr/learning/skills": <ZoikoHRLearningSkillMatrix />,
  "/zoiko-hr/learning/assessments": <ZoikoHRLearningAssessments />,
  "/zoiko-hr/learning/calendar": <ZoikoHRLearningCalendar />,
  "/zoiko-hr/learning/progress": <ZoikoHRLearningProgress />,
  "/zoiko-hr/learning/reports": <ZoikoHRLearningReports />,
  "/zoiko-hr/compensation": <ZoikoHRCompDashboard />,
  "/zoiko-hr/compensation/salary-structures": <ZoikoHRCompSalaryStructures />,
  "/zoiko-hr/compensation/pay-grades": <ZoikoHRCompPayGrades />,
  "/zoiko-hr/compensation/salary-components": <ZoikoHRCompSalaryComponents />,
  "/zoiko-hr/compensation/bands": <ZoikoHRCompBands />,
  "/zoiko-hr/compensation/revisions": <ZoikoHRCompRevisions />,
  "/zoiko-hr/compensation/increments": <ZoikoHRCompIncrements />,
  "/zoiko-hr/compensation/bonuses": <ZoikoHRCompBonuses />,
  "/zoiko-hr/compensation/incentives": <ZoikoHRCompIncentives />,
  "/zoiko-hr/compensation/allowances": <ZoikoHRCompAllowances />,
  "/zoiko-hr/compensation/deductions": <ZoikoHRCompDeductions />,
  "/zoiko-hr/compensation/benefits": <ZoikoHRCompBenefits />,
  "/zoiko-hr/compensation/medical": <ZoikoHRCompMedical />,
  "/zoiko-hr/compensation/insurance": <ZoikoHRCompInsurance />,
  "/zoiko-hr/compensation/retirement": <ZoikoHRCompRetirement />,
  "/zoiko-hr/compensation/reimbursements": <ZoikoHRCompReimbursements />,
  "/zoiko-hr/compensation/payroll": <ZoikoHRCompPayroll />,
  "/zoiko-hr/compensation/reports": <ZoikoHRCompReports />,
  "/zoiko-hr/compensation/analytics": <ZoikoHRCompAnalytics />,
  "/zoiko-hr/compensation/settings": <ZoikoHRCompSettings />,
  // ESS submodule routes
  "/zoiko-hr/ess": <EssDashboard />,
  "/zoiko-hr/ess/profile": <EssProfile />,
  "/zoiko-hr/ess/leave": <EssLeaveManagement />,
  "/zoiko-hr/ess/attendance": <EssAttendance />,
  "/zoiko-hr/ess/my-documents": <EssMyDocuments />,
  "/zoiko-hr/ess/requests": <EssRequests />,
  "/zoiko-hr/ess/settings": <EssSettings />,

  // Travel submodule routes
  "/zoiko-hr/travel": <TravelDashboard />,
  "/zoiko-hr/travel/requests": <TravelRequests />,
  "/zoiko-hr/travel/approvals": <TravelApprovals />,
  "/zoiko-hr/travel/itineraries": <TravelItineraries />,
  "/zoiko-hr/travel/expenses": <TravelExpenses />,
  "/zoiko-hr/travel/reports": <TravelReports />,
  "/zoiko-hr/travel/settings": <TravelSettings />,
  // Compliance submodule routes
  "/zoiko-hr/compliance": <ComplianceDashboard />,
  "/zoiko-hr/compliance/policies": <PolicyLibrary />,
  "/zoiko-hr/compliance/tracking": <ComplianceTracking />,
  "/zoiko-hr/compliance/audits": <Audits />,
  "/zoiko-hr/compliance/violations": <Violations />,
  "/zoiko-hr/compliance/risks": <RiskAssessment />,
  "/zoiko-hr/compliance/regulations": <Regulations />,
  "/zoiko-hr/compliance/corrective-actions": <CorrectiveActions />,
  "/zoiko-hr/compliance/reports": <ComplianceReports />,
  "/zoiko-hr/compliance/settings": <ComplianceSettings />,
  "/zoiko-hr/engagement/wellness": <WellnessPrograms />,
  "/zoiko-hr/engagement/csr": <CSRActivities />,
  "/zoiko-hr/engagement/communications": <Communications />,
  "/zoiko-hr/engagement/announcements": <Announcements />,
  "/zoiko-hr/engagement/nps": <NPSSurveys />,
  "/zoiko-hr/engagement/analytics": <EngagementAnalytics />,
  "/zoiko-hr/engagement/reports": <EngagementReports />,
  "/zoiko-hr/engagement/settings": <EngagementSettings />,

  // Recruitment submodule routes
  "/zoiko-hr/recruitment/job-requisitions": <JobRequisitions />,
  "/zoiko-hr/recruitment/open-positions": <OpenPositions />,
  "/zoiko-hr/recruitment/candidates": <Candidates />,
  "/zoiko-hr/recruitment/candidates/:id": <CandidateDetails />,
  "/zoiko-hr/recruitment/interview-pipeline": <InterviewPipeline />,
  "/zoiko-hr/recruitment/offers": <OfferManagement />,
  "/zoiko-hr/recruitment/hiring-schedule": <HiringSchedule />,
  "/zoiko-hr/recruitment/analytics": <RecruitmentAnalytics />,
  "/zoiko-hr/recruitment/reports": <RecruitmentReports />,
  "/zoiko-hr/recruitment/settings": <RecruitmentSettings />,

  // Performance submodule routes
  "/zoiko-hr/performance/goals": <GoalsOKRs />,
  "/zoiko-hr/performance/reviews": <PerformanceReviews />,
  "/zoiko-hr/performance/appraisals": <Appraisals />,
  "/zoiko-hr/performance/feedback": <Feedback />,
  "/zoiko-hr/performance/360-reviews": <FortySixtyReviews />,
  "/zoiko-hr/performance/kpis": <KpiTracking />,
  "/zoiko-hr/performance/competencies": <Competencies />,
  "/zoiko-hr/performance/analytics": <PerformanceAnalytics />,
  "/zoiko-hr/performance/reports": <PerformanceReports />,
  "/zoiko-hr/performance/settings": <PerformanceSettings />,

  // Documents submodule routes
  "/zoiko-hr/documents/employee-documents": <EmployeeDocuments />,
  "/zoiko-hr/documents/company-documents": <CompanyDocuments />,
  "/zoiko-hr/documents/templates": <Templates />,
  "/zoiko-hr/documents/policies": <Policies />,
  "/zoiko-hr/documents/compliance": <ComplianceDocuments />,
  "/zoiko-hr/documents/approvals": <ApprovalWorkflow />,
  "/zoiko-hr/documents/expiring-documents": <ExpiringDocuments />,
  "/zoiko-hr/documents/archive": <Archive />,
  "/zoiko-hr/documents/reports": <DocumentsReports />,
  "/zoiko-hr/documents/settings": <DocumentsSettings />,

  // Workforce Planning submodule routes
  "/zoiko-hr/workforce-planning": <WorkforceDashboard />,
  "/zoiko-hr/workforce-planning/plans": <WorkforcePlans />,
  "/zoiko-hr/workforce-planning/headcount": <HeadcountPlanning />,
  "/zoiko-hr/workforce-planning/succession": <SuccessionPlanning />,
  "/zoiko-hr/workforce-planning/scenarios": <ScenarioPlanning />,
  "/zoiko-hr/workforce-planning/reports": <WorkforceReports />,
  "/zoiko-hr/workforce-planning/settings": <WorkforceSettings />,
  "/zoiko-hr/documents": <ZoikoHRDocuments />,
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
  "/comply": <ComplyDashboard />,
  "/comply/obligations": <ComplyObligations />,
  "/comply/controls": <ComplyControlsLibrary />,
  "/comply/controls/:id": <ControlDetail />,
  "/comply/risks": <ComplyRiskRegister />,
  "/comply/audits": <ComplyAudits />,
  "/comply/evidence": <ComplyEvidence />,
  "/comply/policies": <ComplyPolicies />,
  "/comply/calendar": <ComplyCalendar />,
  "/comply/incidents": <ComplyIncidents />,
  "/comply/reports": <ComplyReports />,
  "/insights": <InsightsDashboard />,
  "/insights/workforce": <InsightsWorkforceAnalytics />,
  "/insights/payroll": <InsightsPayrollAnalytics />,
  "/insights/financial": <InsightsFinancialAnalytics />,
  "/insights/projects": <InsightsProjectAnalytics />,
  "/insights/inventory": <InsightsInventoryAnalytics />,
  "/insights/compliance": <InsightsComplianceAnalytics />,
  "/insights/forecasting": <InsightsForecasting />,
  "/insights/custom-reports": <InsightsCustomReports />,
  "/insights/saved-reports": <InsightsSavedReports />,
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