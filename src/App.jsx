import { Routes, Route } from "react-router-dom";
import SuperAdminShell from "./components/SuperAdminShell";
import { flatRoutes } from "./navigation";
import PagePlaceholder from "./components/PagePlaceholder";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import ZoikoProductsPage from "./pages/ZoikoProductsPage";
import PlatformPage from "./pages/PlatformPage";
import ProtectedRoute from "./components/ProtectedRoute";

// Target 'HrDashBoard.jsx' directly
import ZoikoHRModule from "./modules/zoiko-hr/HrDashBoard.jsx";

// Sub-module imports pointing explicitly to their component files inside each directory
import ZoikoHRWorkforce from "./modules/zoiko-hr/workforce/workforce.jsx";
import ZoikoHRLeaveDashboard from "./modules/zoiko-hr/leave/dashboard.jsx";
import ZoikoHRLeaveMyLeave from "./modules/zoiko-hr/leave/my-leave.jsx";
import ZoikoHRLeaveRequests from "./modules/zoiko-hr/leave/leave-requests.jsx";
import ZoikoHRLeaveCalendar from "./modules/zoiko-hr/leave/leave-calendar.jsx";
import ZoikoHRLeaveLeaveTypes from "./modules/zoiko-hr/leave/leave-types.jsx";
import ZoikoHRLeaveReports from "./modules/zoiko-hr/leave/reports.jsx";
import ZoikoHRLeaveSettings from "./modules/zoiko-hr/leave/settings.jsx";

import ZoikoHRDepartmentsDashboard from "./modules/zoiko-hr/departments/dashboard.jsx";
import ZoikoHRDepartmentsDepartmentList from "./modules/zoiko-hr/departments/department-list.jsx";
import ZoikoHRDepartmentsDepartmentStructure from "./modules/zoiko-hr/departments/department-structure.jsx";
import ZoikoHRDepartmentsReports from "./modules/zoiko-hr/departments/reports.jsx";
import ZoikoHRDepartmentsSettings from "./modules/zoiko-hr/departments/settings.jsx";

import ZoikoHRDesignationsDashboard from "./modules/zoiko-hr/designations/dashboard.jsx";
import ZoikoHRDesignationList from "./modules/zoiko-hr/designations/designation-list.jsx";
import ZoikoHRDesignationStructure from "./modules/zoiko-hr/designations/designation-structure.jsx";
import ZoikoHRDesignationReports from "./modules/zoiko-hr/designations/reports.jsx";
import ZoikoHRDesignationSettings from "./modules/zoiko-hr/designations/settings.jsx";

import PerformanceDashboard from "./modules/zoiko-hr/performance/dashboard.jsx";
import GoalsOKRs from "./modules/zoiko-hr/performance/goals.jsx";
import PerformanceReviews from "./modules/zoiko-hr/performance/reviews.jsx";
import Appraisals from "./modules/zoiko-hr/performance/appraisals.jsx";
import PerformanceAnalytics from "./modules/zoiko-hr/performance/analytics.jsx";
import RecruitmentDashboard from "./modules/zoiko-hr/recruitment/dashboard.jsx";
import JobRequisitions from "./modules/zoiko-hr/recruitment/job-requisitions.jsx";
import OpenPositions from "./modules/zoiko-hr/recruitment/open-positions.jsx";
import Candidates from "./modules/zoiko-hr/recruitment/candidates.jsx";
import CandidateDetails from "./modules/zoiko-hr/recruitment/candidate-details.jsx";
import InterviewPipeline from "./modules/zoiko-hr/recruitment/interview-pipeline.jsx";
import OfferManagement from "./modules/zoiko-hr/recruitment/offer-management.jsx";
import HiringSchedule from "./modules/zoiko-hr/recruitment/hiring-schedule.jsx";
import RecruitmentAnalytics from "./modules/zoiko-hr/recruitment/analytics.jsx";
import RecruitmentReports from "./modules/zoiko-hr/recruitment/reports.jsx";
import RecruitmentSettings from "./modules/zoiko-hr/recruitment/settings.jsx";
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
import EngagementDashboard from "./modules/zoiko-hr/engagement/engagement-dashboard.jsx";
import EngagementWellness from "./modules/zoiko-hr/engagement/engagement-wellness.jsx";
import EngagementCSR from "./modules/zoiko-hr/engagement/engagement-csr.jsx";
import EngagementCommunications from "./modules/zoiko-hr/engagement/engagement-communications.jsx";
import EngagementAnnouncements from "./modules/zoiko-hr/engagement/engagement-announcements.jsx";
import EngagementNPS from "./modules/zoiko-hr/engagement/engagement-nps.jsx";
import EngagementSurveys from "./modules/zoiko-hr/engagement/engagement-surveys.jsx";
import EngagementReports from "./modules/zoiko-hr/engagement/engagement-reports.jsx";
import EngagementSettings from "./modules/zoiko-hr/engagement/engagement-settings.jsx";

import EssDashboard from "./modules/zoiko-hr/ess/dashboard.jsx";
import EssProfile from "./modules/zoiko-hr/ess/profile.jsx";
import EssLeaveManagement from "./modules/zoiko-hr/ess/leave-management.jsx";
import EssAttendance from "./modules/zoiko-hr/ess/attendance.jsx";
import EssMyDocuments from "./modules/zoiko-hr/ess/my-documents.jsx";
import EssRequests from "./modules/zoiko-hr/ess/requests.jsx";
import EssSettings from "./modules/zoiko-hr/ess/settings.jsx";

import TravelDashboard from "./modules/zoiko-hr/travel/dashboard.jsx";
import TravelRequests from "./modules/zoiko-hr/travel/travel-requests.jsx";
import TravelApprovals from "./modules/zoiko-hr/travel/approvals.jsx";
import TravelExpenses from "./modules/zoiko-hr/travel/expenses.jsx";
import TravelSettings from "./modules/zoiko-hr/travel/settings.jsx";

import {
  AssetsDashboard,
  MyAssets,
  AssetCatalog,
  AssetRequests,
  AssetMaintenance,
  AssetReports,
  AssetSettings,
} from "./modules/zoiko-hr/assets/index.jsx";

import DocumentsDashboard from "./modules/zoiko-hr/documents/dashboard.jsx";
import EmployeeDocuments from "./modules/zoiko-hr/documents/employee-documents.jsx";
import CompanyDocuments from "./modules/zoiko-hr/documents/company-documents.jsx";
import ApprovalWorkflow from "./modules/zoiko-hr/documents/approvals.jsx";
import DocumentsSettings from "./modules/zoiko-hr/documents/settings.jsx";

import ComplianceDashboard from "./modules/zoiko-hr/compliance/dashboard.jsx";
import PolicyLibrary from "./modules/zoiko-hr/compliance/policy-library.jsx";
import ComplianceTracking from "./modules/zoiko-hr/compliance/compliance-tracking.jsx";
import Audits from "./modules/zoiko-hr/compliance/audits.jsx";
import Violations from "./modules/zoiko-hr/compliance/violations.jsx";
import RiskAssessment from "./modules/zoiko-hr/compliance/risk-assessment.jsx";
import Regulations from "./modules/zoiko-hr/compliance/regulations.jsx";
import CorrectiveActions from "./modules/zoiko-hr/compliance/corrective-actions.jsx";
import ComplianceReports from "./modules/zoiko-hr/compliance/reports.jsx";
import ComplianceSettings from "./modules/zoiko-hr/compliance/settings.jsx";

import ZoikoHRAttendanceDashboard from "./modules/zoiko-hr/attendance/dashboard.jsx";
import ZoikoHRAttendanceDailyRecords from "./modules/zoiko-hr/attendance/daily-records.jsx";
import ZoikoHRAttendanceMyAttendance from "./modules/zoiko-hr/attendance/my-attendance.jsx";
import ZoikoHRAttendanceRegularization from "./modules/zoiko-hr/attendance/regularization.jsx";
import ZoikoHRAttendancePolicies from "./modules/zoiko-hr/attendance/policies.jsx";
import ZoikoHRAttendanceShifts from "./modules/zoiko-hr/attendance/shifts.jsx";
import ZoikoHRAttendanceRosters from "./modules/zoiko-hr/attendance/rosters.jsx";
import ZoikoHRAttendanceBiometric from "./modules/zoiko-hr/attendance/biometric.jsx";
import ZoikoHRAttendanceGeofencing from "./modules/zoiko-hr/attendance/geofencing.jsx";
import ZoikoHRAttendanceOvertime from "./modules/zoiko-hr/attendance/overtime.jsx";
import ZoikoHRAttendanceReports from "./modules/zoiko-hr/attendance/reports.jsx";
import ZoikoHRAttendanceAnalytics from "./modules/zoiko-hr/attendance/analytics.jsx";
import ZoikoHRAttendanceExceptions from "./modules/zoiko-hr/attendance/exceptions.jsx";
import ZoikoHRAttendanceHolidays from "./modules/zoiko-hr/attendance/holidays.jsx";
import ZoikoHRAttendanceWeekends from "./modules/zoiko-hr/attendance/weekends.jsx";
import ZoikoHRAttendanceAuditLogs from "./modules/zoiko-hr/attendance/audit-logs.jsx";
import ZoikoHRAttendanceSettings from "./modules/zoiko-hr/attendance/settings.jsx";

import WorkforceDashboard from "./modules/zoiko-hr/workforce-planning/dashboard.jsx";
import WorkforcePlans from "./modules/zoiko-hr/workforce-planning/plans.jsx";
import HeadcountPlanning from "./modules/zoiko-hr/workforce-planning/headcount.jsx";
import Succession from "./modules/zoiko-hr/workforce-planning/succession.jsx";
import ScenarioPlanning from "./modules/zoiko-hr/workforce-planning/scenario-planning.jsx";
import WorkforceReports from "./modules/zoiko-hr/workforce-planning/reports.jsx";
import WorkforceSettings from "./modules/zoiko-hr/workforce-planning/settings.jsx";






import ZoikoHRCompDashboard from "./modules/zoiko-hr/compensation/dashboard.jsx";
import ZoikoHRCompSalaryStructures from "./modules/zoiko-hr/compensation/salary-structures.jsx";
import ZoikoHRCompPayGrades from "./modules/zoiko-hr/compensation/pay-grades.jsx";
import ZoikoHRCompSalaryComponents from "./modules/zoiko-hr/compensation/salary-components.jsx";
import ZoikoHRCompBands from "./modules/zoiko-hr/compensation/compensation-bands.jsx";
import ZoikoHRCompRevisions from "./modules/zoiko-hr/compensation/salary-revisions.jsx";
import ZoikoHRCompAllowances from "./modules/zoiko-hr/compensation/allowances.jsx";
import ZoikoHRCompBenefits from "./modules/zoiko-hr/compensation/benefits.jsx";

import ZoikoTimeModule from "./modules/zoikotime";
import ZoikoPayrollModule from "./modules/payroll";
import {
  ZoikoSpendModule,
  PurchaseRequestsPage,
  PosPage,
  VendorsPage,
  SupplierInvoicesPage,
  ApWorkflowPage,
  SpendPolicyPage,
  SpendApprovalsPage,
  PaymentPreparationPage,
} from "./modules/spend";
import {
  ZoikoBillingModule,
  InvoicingPage,
  InvoiceSchedulesPage,
  UsageBillingPage,
  TaxPage,
  CollectionsReceivablesPage,
  CreditNotesPage,
  DunningPage,
  ReportsPage,
} from "./modules/billing";
import ComplyDashboard from "./modules/comply/dashboard";
import ComplyPolicies from "./modules/comply/policies";
import ComplyAudits from "./modules/comply/audits";
import ComplyIncidents from "./modules/comply/incidents";
import ComplyCertifications from "./modules/comply/certifications";
import ComplyComplianceMonitoring from "./modules/comply/compliance-monitoring";
import ComplyReports from "./modules/comply/reports";
import ComplySettings from "./modules/comply/settings";
import ComplyRiskManagement from "./modules/comply/risk-management";
import ComplyControls from "./modules/comply/controls";
import ComplyTraining from "./modules/comply/compliance-training";
import InsightsDashboard from "./modules/insights/dashboard.jsx";
import WorkforceInsights from "./modules/insights/workforce-insights.jsx";
import PayrollInsights from "./modules/insights/payroll-insights.jsx";
import Analytics from "./modules/insights/analytics.jsx";
import Reports from "./modules/insights/reports.jsx";
import AttendanceInsights from "./modules/insights/attendance-insights.jsx";
import EngagementInsights from "./modules/insights/engagement-insights.jsx";
import PerformanceInsights from "./modules/insights/performance-insights.jsx";
import RecruitmentInsights from "./modules/insights/recruitment-insights.jsx";
import InsightsSettings from "./modules/insights/settings.jsx";
import ItemsPage from "./modules/inventory/pages/ItemsPage";

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
  "/zoiko-hr/departments": <ZoikoHRDepartmentsDashboard />,
  "/zoiko-hr/departments/list": <ZoikoHRDepartmentsDepartmentList />,
  "/zoiko-hr/departments/structure": <ZoikoHRDepartmentsDepartmentStructure />,
  "/zoiko-hr/departments/reports": <ZoikoHRDepartmentsReports />,
  "/zoiko-hr/departments/settings": <ZoikoHRDepartmentsSettings />,
  // Designations submodule routes
  "/zoiko-hr/designations": <ZoikoHRDesignationsDashboard />,
  "/zoiko-hr/designations/list": <ZoikoHRDesignationList />,
  "/zoiko-hr/designations/levels": <ZoikoHRDesignationStructure />,
  "/zoiko-hr/designations/reports": <ZoikoHRDesignationReports />,
  "/zoiko-hr/designations/settings": <ZoikoHRDesignationSettings />,
  // Leave submodule routes
  "/zoiko-hr/leave": <ZoikoHRLeaveDashboard />,
  "/zoiko-hr/leave/my-leave": <ZoikoHRLeaveMyLeave />,
  "/zoiko-hr/leave/requests": <ZoikoHRLeaveRequests />,
  "/zoiko-hr/leave/calendar": <ZoikoHRLeaveCalendar />,
  "/zoiko-hr/leave/leave-types": <ZoikoHRLeaveLeaveTypes />,
  "/zoiko-hr/leave/reports": <ZoikoHRLeaveReports />,
  "/zoiko-hr/leave/settings": <ZoikoHRLeaveSettings />,
  // Attendance submodule routes
  "/zoiko-hr/attendance": <ZoikoHRAttendanceDashboard />,
  "/zoiko-hr/attendance/daily": <ZoikoHRAttendanceDailyRecords />,
  "/zoiko-hr/attendance/my-attendance": <ZoikoHRAttendanceMyAttendance />,
  "/zoiko-hr/attendance/regularization": <ZoikoHRAttendanceRegularization />,
  "/zoiko-hr/attendance/policies": <ZoikoHRAttendancePolicies />,
  "/zoiko-hr/attendance/shifts": <ZoikoHRAttendanceShifts />,
  "/zoiko-hr/attendance/rosters": <ZoikoHRAttendanceRosters />,
  "/zoiko-hr/attendance/biometric": <ZoikoHRAttendanceBiometric />,
  "/zoiko-hr/attendance/geofencing": <ZoikoHRAttendanceGeofencing />,
  "/zoiko-hr/attendance/overtime": <ZoikoHRAttendanceOvertime />,
  "/zoiko-hr/attendance/reports": <ZoikoHRAttendanceReports />,
  "/zoiko-hr/attendance/analytics": <ZoikoHRAttendanceAnalytics />,
  "/zoiko-hr/attendance/exceptions": <ZoikoHRAttendanceExceptions />,
  "/zoiko-hr/attendance/holidays": <ZoikoHRAttendanceHolidays />,
  "/zoiko-hr/attendance/weekends": <ZoikoHRAttendanceWeekends />,
  "/zoiko-hr/attendance/audit-logs": <ZoikoHRAttendanceAuditLogs />,
  "/zoiko-hr/attendance/settings": <ZoikoHRAttendanceSettings />,
  "/zoiko-hr/performance": <PerformanceDashboard />,
  "/zoiko-hr/recruitment": <RecruitmentDashboard />,
  "/zoiko-hr/onboarding": <ZoikoHROnboardingDashboard />,
  "/zoiko-hr/onboarding/new-hires": <ZoikoHROnboardingNewHires />,
  "/zoiko-hr/onboarding/pre-onboarding": <ZoikoHROnboardingPreOnboarding />,
  "/zoiko-hr/onboarding/documents": <ZoikoHROnboardingDocuments />,
  "/zoiko-hr/onboarding/checklists": <ZoikoHROnboardingChecklists />,
  "/zoiko-hr/onboarding/department-assignment": (
    <ZoikoHROnboardingDeptAssignment />
  ),
  "/zoiko-hr/onboarding/manager-assignment": (
    <ZoikoHROnboardingManagerAssignment />
  ),
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



  
  "/zoiko-hr/learning": <ZoikoHRLearning />,
  "/zoiko-hr/learning/courses": <ZoikoHRLearning />,
  "/zoiko-hr/learning/training-programs": <ZoikoHRLearning />,
  "/zoiko-hr/learning/paths": <ZoikoHRLearning />,
  "/zoiko-hr/learning/certifications": <ZoikoHRLearning />,
  "/zoiko-hr/learning/skills": <ZoikoHRLearning />,
  "/zoiko-hr/learning/assessments": <ZoikoHRLearning />,
  "/zoiko-hr/learning/calendar": <ZoikoHRLearning />,
  "/zoiko-hr/learning/progress": <ZoikoHRLearning />,
  "/zoiko-hr/learning/reports": <ZoikoHRLearning />,
  "/zoiko-hr/learning/enrollments": <ZoikoHRLearning />,
"/zoiko-hr/compensation": <ZoikoHRCompDashboard />,
"/zoiko-hr/compensation/salary-structures": <ZoikoHRCompSalaryStructures />,
"/zoiko-hr/compensation/pay-grades": <ZoikoHRCompPayGrades />,
"/zoiko-hr/compensation/salary-components": <ZoikoHRCompSalaryComponents />,
"/zoiko-hr/compensation/bands": <ZoikoHRCompBands />,
"/zoiko-hr/compensation/revisions": <ZoikoHRCompRevisions />,
"/zoiko-hr/compensation/allowances": <ZoikoHRCompAllowances />,
"/zoiko-hr/compensation/benefits": <ZoikoHRCompBenefits />,
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
  "/zoiko-hr/travel/expenses": <TravelExpenses />,
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
  "/zoiko-hr/engagement": <EngagementDashboard />,
  "/zoiko-hr/engagement/wellness": <EngagementWellness />,
  "/zoiko-hr/engagement/csr": <EngagementCSR />,
  "/zoiko-hr/engagement/communications": <EngagementCommunications />,
  "/zoiko-hr/engagement/announcements": <EngagementAnnouncements />,
  "/zoiko-hr/engagement/nps": <EngagementNPS />,
  "/zoiko-hr/engagement/surveys": <EngagementSurveys />,
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
  "/zoiko-hr/performance/analytics": <PerformanceAnalytics />,

  // Documents submodule routes
  "/zoiko-hr/documents/employee-documents": <EmployeeDocuments />,
  "/zoiko-hr/documents/company-documents": <CompanyDocuments />,
  "/zoiko-hr/documents/approvals": <ApprovalWorkflow />,
  "/zoiko-hr/documents/settings": <DocumentsSettings />,

  // Workforce Planning submodule routes
  "/zoiko-hr/workforce-planning": <WorkforceDashboard />,
  "/zoiko-hr/workforce-planning/plans": <WorkforcePlans />,
  "/zoiko-hr/workforce-planning/headcount": <HeadcountPlanning />,
  "/zoiko-hr/workforce-planning/succession": <Succession />,
  "/zoiko-hr/workforce-planning/scenarios": <ScenarioPlanning />,
  "/zoiko-hr/workforce-planning/reports": <WorkforceReports />,
  "/zoiko-hr/workforce-planning/settings": <WorkforceSettings />,
  "/zoiko-hr/documents": <DocumentsDashboard />,
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
  "/spend/purchase-requests": <PurchaseRequestsPage />,
  "/spend/purchase-orders": <PosPage />,
  "/spend/vendors": <VendorsPage />,
  "/spend/supplier-invoices": <SupplierInvoicesPage />,
  "/spend/ap-workflow": <ApWorkflowPage />,
  "/spend/spend-policy": <SpendPolicyPage />,
  "/spend/approvals": <SpendApprovalsPage />,
  "/spend/payment-preparation": <PaymentPreparationPage />,
  "/billing": <ZoikoBillingModule />,
  "/billing/invoices": <InvoicingPage />,
  "/billing/invoice-schedules": <InvoiceSchedulesPage />,
  "/billing/usage-billing": <UsageBillingPage />,
  "/billing/tax": <TaxPage />,
  "/billing/collections-receivables": <CollectionsReceivablesPage />,
  "/billing/credit-notes": <CreditNotesPage />,
  "/billing/dunning": <DunningPage />,
  "/billing/reports": <ReportsPage />,
  // Zoiko Inventory routes
  "/inventory/items": <ItemsPage />,
  "/inventory/locations": (
    <PagePlaceholder
      title="Locations"
      path="/inventory/locations"
      badge="Inventory"
    />
  ),
  "/inventory/stock": (
    <PagePlaceholder title="Stock" path="/inventory/stock" badge="Inventory" />
  ),
  "/inventory/receiving": (
    <PagePlaceholder
      title="Receiving"
      path="/inventory/receiving"
      badge="Inventory"
    />
  ),
  "/inventory/goods-issue": (
    <PagePlaceholder
      title="Goods Issue"
      path="/inventory/goods-issue"
      badge="Inventory"
    />
  ),
  "/inventory/transfers": (
    <PagePlaceholder
      title="Transfers"
      path="/inventory/transfers"
      badge="Inventory"
    />
  ),
  "/inventory/stock-counts": (
    <PagePlaceholder
      title="Stock Counts"
      path="/inventory/stock-counts"
      badge="Inventory"
    />
  ),
  "/inventory/reorder": (
    <PagePlaceholder
      title="Reorder"
      path="/inventory/reorder"
      badge="Inventory"
    />
  ),
  "/inventory/assets": (
    <PagePlaceholder
      title="Assets"
      path="/inventory/assets"
      badge="Inventory"
    />
  ),
  "/inventory/reports": (
    <PagePlaceholder
      title="Reports"
      path="/inventory/reports"
      badge="Inventory"
    />
  ),
  "/comply": <ComplyDashboard />,
  "/comply/policies": <ComplyPolicies />,
  "/comply/audits": <ComplyAudits />,
  "/comply/incidents": <ComplyIncidents />,
  "/comply/certifications": <ComplyCertifications />,
  "/comply/compliance-monitoring": <ComplyComplianceMonitoring />,
  "/comply/reports": <ComplyReports />,
  "/comply/settings": <ComplySettings />,
  "/comply/risk-management": <ComplyRiskManagement />,
  "/comply/controls": <ComplyControls />,
  "/comply/training": <ComplyTraining />,
  "/insights": <InsightsDashboard />,
  "/insights/workforce": <WorkforceInsights />,
  "/insights/payroll": <PayrollInsights />,
  "/insights/financial": <Analytics defaultTab="financial" />,
  "/insights/projects": <Analytics defaultTab="projects" />,
  "/insights/inventory": <Analytics defaultTab="inventory" />,
  "/insights/compliance": <Analytics defaultTab="compliance" />,
  "/insights/forecasting": <Analytics defaultTab="forecasting" />,
  "/insights/analytics": <Analytics />,
  "/insights/custom-reports": <Reports defaultTab="custom" />,
  "/insights/saved-reports": <Reports defaultTab="saved" />,
  "/insights/reports": <Reports />,
  "/insights/attendance": <AttendanceInsights />,
  "/insights/engagement": <EngagementInsights />,
  "/insights/performance": <PerformanceInsights />,
  "/insights/recruitment": <RecruitmentInsights />,
  "/insights/settings": <InsightsSettings />,
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
      <Route path="/products" element={<ZoikoProductsPage />} />
      <Route path="/platform" element={<PlatformPage />} />
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
                        <PagePlaceholder
                          title={route.label}
                          path={route.href}
                          badge={route.badge}
                        />
                      )
                    }
                  />
                ))}
                <Route
                  path="*"
                  element={
                    <PagePlaceholder
                      title="Not Found"
                      description="This page is not available yet."
                    />
                  }
                />
              </Routes>
            </SuperAdminShell>
          </ProtectedRoute>
        }
      />
    </Routes>
  );
}
