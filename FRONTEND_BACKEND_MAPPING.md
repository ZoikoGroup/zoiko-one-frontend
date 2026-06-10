# Zoiko One — Frontend → Backend Mapping

> **Legend**  
> `REAL` = page calls a live REST endpoint or uses a Prisma-backed service.  
> `MOCK` = page calls functions from `workforce-api.ts` that return hardcoded/in-memory data (no DB).  
> `STATIC` = page renders inline hardcoded data without any API call.  
> `—` denotes N/A.

---

## 1. SUPER ADMIN / PLATFORM

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 1 | `app/page.tsx` (Landing) | STATIC (marketing content) | — | — | — |
| 2 | `app/dashboard/page.tsx` | `getDashboardOverview` | — | Prisma query directly | Organization, PayrollRun, User, etc. |
| 3 | `app/login/page.tsx` | STATIC (renders `<LoginForm/>` client component) | — | — | — |
| 4 | `app/users/page.tsx` | `getUsers` | — | Prisma `user.findMany()` | User |
| 5 | `app/tenants/page.tsx` | `getTenants` | — | Prisma `tenant.findMany()` | Tenant |
| 6 | `app/organizations/page.tsx` | `getOrganizations` | — | Prisma `organization.findMany()` | Organization |
| 7 | `app/settings/page.tsx` | `getGovernancePolicies` | — | Prisma `governancePolicy.findMany()` | GovernancePolicy |
| 8 | `app/subscriptions/page.tsx` | `getSubscriptions` | — | Prisma `subscription.findMany()` | Subscription |
| 9 | `app/billing/page.tsx` | `getBilling` | — | Prisma billing query | Invoice / Billing |
| 10 | `app/insights/page.tsx` | `getAnalytics` | — | Prisma analytics query | Analytics |
| 11 | `app/audit-logs/page.tsx` | `getAuditLogs` | — | Prisma `auditLog.findMany()` | AuditLog |
| 12 | `app/notifications/page.tsx` | `getAuditLogs` | — | Prisma `auditLog.findMany()` | AuditLog |
| 13 | `app/approvals/page.tsx` | `getApprovals` | — | Prisma approval query | Approval |
| 14 | `app/roles/page.tsx` | STATIC / inline placeholder | — | — | — |
| 15 | `app/roles-permissions/page.tsx` | STATIC / inline placeholder | — | — | — |
| 16 | `app/api-management/page.tsx` | STATIC / inline placeholder | — | — | — |
| 17 | `app/audit-center/page.tsx` | STATIC / inline placeholder | — | — | — |
| 18 | `app/compliance-center/page.tsx` | STATIC / inline placeholder | — | — | — |
| 19 | `app/trust-center/page.tsx` | STATIC / inline placeholder | — | — | — |
| 20 | `app/security-center/page.tsx` | STATIC / inline placeholder | — | — | — |
| 21 | `app/system-health/page.tsx` | STATIC / inline placeholder | — | — | — |
| 22 | `app/support-center/page.tsx` | STATIC / inline placeholder | — | — | — |
| 23 | `app/comply/page.tsx` | STATIC / inline placeholder | — | — | — |
| 24 | `app/feature-flags/page.tsx` | STATIC / inline placeholder | — | — | — |
| 25 | `app/analytics/page.tsx` | STATIC / inline placeholder | — | — | — |
| 26 | `app/integrations/page.tsx` | STATIC / inline placeholder | — | — | — |

---

## 2. WORKFORCE (REAL — 9 pages)

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 1 | `app/zoiko-hr/workforce/page.tsx` | `fetchEmployees` | GET | `/api/zoiko-hr/workforce` | Employee |
| 2 | `app/zoiko-hr/workforce/employees/page.tsx` | `fetchEmployees`; raw `DELETE` | GET; DELETE | `/api/zoiko-hr/workforce`; `/api/zoiko-hr/workforce/{id}` | Employee |
| 3 | `app/zoiko-hr/workforce/employees/new/page.tsx` | raw `POST` | POST | `/api/zoiko-hr/workforce` | Employee |
| 4 | `app/zoiko-hr/workforce/employees/[employeeId]/page.tsx` | `fetchEmployee`, `fetchEmploymentRecords`, `fetchEmployeeDocuments`, `fetchEmergencyContacts`, `fetchEmployeeAddresses`, `upsertEmployeeProfile`, `createEmploymentRecord`, `createEmployeeDocument`, `createEmergencyContact`, `createEmployeeAddress` | GET; GET; GET; GET; GET; PUT; POST; POST; POST; POST | `/api/zoiko-hr/workforce/{id}`; `.../{id}/employment-records`; `.../{id}/documents`; `.../{id}/emergency-contacts`; `.../{id}/addresses`; `.../{id}/profile`; `.../{id}/employment-records`; `.../{id}/documents`; `.../{id}/emergency-contacts`; `.../{id}/addresses` | Employee, EmploymentRecord, EmployeeDocumentReference, EmergencyContact, EmployeeAddress, EmployeeProfile |
| 5 | `app/zoiko-hr/workforce/employees/[employeeId]/edit/page.tsx` | `fetchEmployee`; raw `PUT` | GET; PUT | `/api/zoiko-hr/workforce/{id}` | Employee |
| 6 | `app/zoiko-hr/workforce/addresses/page.tsx` | `fetchEmployees` | GET | `/api/zoiko-hr/workforce` | Employee |
| 7 | `app/zoiko-hr/workforce/documents/page.tsx` | `fetchEmployees` | GET | `/api/zoiko-hr/workforce` | Employee |
| 8 | `app/zoiko-hr/workforce/emergency-contacts/page.tsx` | `fetchEmployees` | GET | `/api/zoiko-hr/workforce` | Employee |
| 9 | `app/zoiko-hr/workforce/employment-records/page.tsx` | `fetchEmployees` | GET | `/api/zoiko-hr/workforce` | Employee |

---

## 3. ATTENDANCE (REAL — 6 pages)

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 10 | `app/zoiko-hr/attendance/page.tsx` | `fetchAttendanceDashboard` | GET | `/api/zoiko-hr/attendance/dashboard` | Attendance |
| 11 | `app/zoiko-hr/attendance/check-in-out/page.tsx` | `checkInEmployee`, `checkOutEmployee` | POST; POST | `/api/zoiko-hr/attendance/check-in`; `/api/zoiko-hr/attendance/check-out` | Attendance |
| 12 | `app/zoiko-hr/attendance/entry/page.tsx` | `createAttendance` | POST | `/api/zoiko-hr/attendance` | Attendance |
| 13 | `app/zoiko-hr/attendance/records/page.tsx` | `fetchAttendances` | GET | `/api/zoiko-hr/attendance` | Attendance |
| 14 | `app/zoiko-hr/attendance/reports/page.tsx` | `fetchAttendanceReport` | GET | `/api/zoiko-hr/attendance/reports` | Attendance |
| 15 | `app/zoiko-hr/attendance/shifts/page.tsx` | `fetchShifts` | GET | `/api/zoiko-hr/shifts` | Shift |

---

## 4. LEAVE (REAL — 6 pages)

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 16 | `app/zoiko-hr/leave/page.tsx` | `fetchLeaveRequests`, `fetchLeaveTypes` | GET; GET | `/api/zoiko-hr/leave/requests`; `/api/zoiko-hr/leave/types` | LeaveRequest, LeaveType |
| 17 | `app/zoiko-hr/leave/balances/page.tsx` | `fetchLeaveBalances`, `fetchLeaveTypes`, `fetchEmployees` | GET; GET; GET | `/api/zoiko-hr/leave/balances`; `/api/zoiko-hr/leave/types`; `/api/zoiko-hr/workforce` | LeaveBalance, LeaveType, Employee |
| 18 | `app/zoiko-hr/leave/calendar/page.tsx` | `fetchLeaveCalendar` | GET | `/api/zoiko-hr/leave/calendar` | LeaveRequest |
| 19 | `app/zoiko-hr/leave/leave-types/page.tsx` | `fetchLeaveTypes`, `createLeaveType`, `updateLeaveType`, `deleteLeaveType` | GET; POST; PUT; DELETE | `/api/zoiko-hr/leave/types` | LeaveType |
| 20 | `app/zoiko-hr/leave/requests/page.tsx` | `fetchLeaveRequests`, `createLeaveRequest`, `approveLeaveRequest`, `cancelLeaveRequest` | GET; POST; POST; DELETE | `/api/zoiko-hr/leave/requests`; `...`; `.../approve`; `...` | LeaveRequest, LeaveApproval |
| 21 | `app/zoiko-hr/leave/requests/[requestId]/page.tsx` | `fetchLeaveRequest`, `approveLeaveRequest` | GET; POST | `/api/zoiko-hr/leave/requests/{id}`; `.../{id}/approve` | LeaveRequest, LeaveApproval |

---

## 5. PERFORMANCE (REAL — 4 pages)

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 22 | `app/zoiko-hr/performance/page.tsx` | `fetchPerformanceDashboard`, `fetchReviews`, `fetchGoals` | GET; GET; GET | `/api/zoiko-hr/performance/dashboard`; `/api/zoiko-hr/performance/reviews`; `/api/zoiko-hr/performance/goals` | PerformanceReview, Goal, Feedback |
| 23 | `app/zoiko-hr/performance/feedback/page.tsx` | `fetchFeedbacks`, `createFeedback`, `deleteFeedback` | GET; POST; DELETE | `/api/zoiko-hr/performance/feedback` | Feedback |
| 24 | `app/zoiko-hr/performance/goals/page.tsx` | `fetchGoals`, `createGoal`, `updateGoal`, `deleteGoal`, `createGoalUpdate` | GET; POST; PUT; DELETE; POST | `/api/zoiko-hr/performance/goals`; `...`; `...`; `...`; `.../updates` | Goal, GoalUpdate |
| 25 | `app/zoiko-hr/performance/reviews/page.tsx` | `fetchReviews`, `fetchCycles`, `createReview`, `updateReview`, `deleteReview` | GET; GET; POST; PUT; DELETE | `/api/zoiko-hr/performance/reviews`; `/api/zoiko-hr/performance/cycles`; `...`; `...`; `...` | PerformanceReview, ReviewCycle |

---

## 6. DEPARTMENTS (REAL — 2 pages)

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 26 | `app/zoiko-hr/departments/page.tsx` | `fetchDepartments`, `createDepartment`, `updateDepartment`, `deleteDepartment` | CRUD | `/api/zoiko-hr/departments` | Department |
| 27 | `app/zoiko-hr/departments/[departmentId]/page.tsx` | `fetchDepartment`, `fetchDesignations` | GET; GET | `/api/zoiko-hr/departments/{id}`; `/api/zoiko-hr/designations` | Department, Designation |

---

## 7. DESIGNATIONS (REAL — 2 pages)

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 28 | `app/zoiko-hr/designations/page.tsx` | `fetchDesignations`, `createDesignation`, `updateDesignation`, `deleteDesignation` | CRUD | `/api/zoiko-hr/designations` | Designation |
| 29 | `app/zoiko-hr/designations/[designationId]/page.tsx` | `fetchDesignation` | GET | `/api/zoiko-hr/designations/{id}` | Designation |

---

## 8. DOCUMENTS (REAL — 2 pages)

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 30 | `app/zoiko-hr/documents/page.tsx` | `fetchDocuments`, `deleteDocument` | GET; DELETE | `/api/zoiko-hr/documents` | EmployeeDocumentReference |
| 31 | `app/zoiko-hr/documents/[documentId]/page.tsx` | `getDocument`, `updateDocument`, `deleteDocument` | GET; PUT; DELETE | `/api/zoiko-hr/documents/{id}` | EmployeeDocumentReference |

---

## 9. PAYROLL (REAL — 2 pages)

| # | Frontend Page | API Function(s) | HTTP Method | Endpoint | Database Table |
|---|---|---|---|---|---|
| 32 | `app/payroll/page.tsx` | `getPayrollOperations` | — | Prisma `payrollRun.findMany()` | PayrollRun |
| 33 | `app/payroll-operations/page.tsx` | `getPayrollOperations` | — | Prisma `payrollRun.findMany()` | PayrollRun |

---

## 10. RECRUITMENT (MOCK — 6 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 34 | `app/zoiko-hr/recruitment/page.tsx` | `fetchRecruitmentDashboard` | MOCK | JobOpening, Candidate, Interview, Offer |
| 35 | `app/zoiko-hr/recruitment/job-openings/page.tsx` | `fetchJobOpenings`, `createJobOpening`, `updateJobOpening`, `closeJobOpening` | MOCK | JobOpening |
| 36 | `app/zoiko-hr/recruitment/candidates/page.tsx` | `fetchCandidates`, `updateCandidateStage` | MOCK | Candidate |
| 37 | `app/zoiko-hr/recruitment/interviews/page.tsx` | `fetchInterviews`, `createInterview`, `updateInterviewStatus` | MOCK | Interview |
| 38 | `app/zoiko-hr/recruitment/offers/page.tsx` | `fetchOffers`, `createOffer`, `updateOfferStatus` | MOCK | Offer |
| 39 | `app/zoiko-hr/recruitment/reports/page.tsx` | `fetchRecruitmentFunnel`, `fetchTimeToHire`, `fetchOfferAcceptanceRate`, `fetchHiringByDepartment` | MOCK | Aggregated views |

---

## 11. ONBOARDING (MOCK — 7 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 40 | `app/zoiko-hr/onboarding/page.tsx` | `fetchOnboardingDashboard` | MOCK | NewJoiner, DocumentVerification, AssetAllocation, Probation |
| 41 | `app/zoiko-hr/onboarding/new-joiners/page.tsx` | `fetchNewJoiners`, `updateNewJoinerStatus` | MOCK | NewJoiner |
| 42 | `app/zoiko-hr/onboarding/document-verification/page.tsx` | `fetchDocumentVerifications`, `updateDocumentStatus` | MOCK | DocumentVerification |
| 43 | `app/zoiko-hr/onboarding/asset-allocation/page.tsx` | `fetchAssetAllocations`, `updateAssetStatus` | MOCK | AssetAllocation |
| 44 | `app/zoiko-hr/onboarding/welcome-kit/page.tsx` | `fetchWelcomeKits`, `updateWelcomeKitStatus` | MOCK | WelcomeKit |
| 45 | `app/zoiko-hr/onboarding/probation/page.tsx` | `fetchProbations`, `updateProbationStatus` | MOCK | Probation |
| 46 | `app/zoiko-hr/onboarding/reports/page.tsx` | `fetchOnboardingCompletionRate`, `fetchDeptOnboarding`, `fetchProbationSummary`, `fetchAssetSummary`, `fetchMonthlyJoiningTrends` | MOCK | Aggregated views |

---

## 12. EMPLOYEE LIFECYCLE (STATIC — 4 pages)

| # | Frontend Page | Data Source | Status | Future Table(s) |
|---|---|---|---|---|
| 47 | `app/zoiko-hr/employee-lifecycle/page.tsx` | Inline `lifecycleStats` / hardcoded arrays | STATIC | Employee, EmploymentRecord |
| 48 | `app/zoiko-hr/employee-lifecycle/onboarding/page.tsx` | Inline hardcoded data | STATIC | Employee, EmploymentRecord |
| 49 | `app/zoiko-hr/employee-lifecycle/transfers/page.tsx` | Inline hardcoded data | STATIC | EmploymentRecord |
| 50 | `app/zoiko-hr/employee-lifecycle/offboarding/page.tsx` | Inline hardcoded data | STATIC | Employee (soft-delete) |

---

## 13. COMPENSATION & BENEFITS (MOCK — 10 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 51 | `app/zoiko-hr/compensation/page.tsx` | `fetchCompensationDashboard` | MOCK | SalaryStructure, BenefitPlan, CompensationReview |
| 52 | `app/zoiko-hr/compensation/salary-structures/page.tsx` | `fetchSalaryStructures` | MOCK | SalaryStructure |
| 53 | `app/zoiko-hr/compensation/pay-grades/page.tsx` | `fetchPayGrades` | MOCK | PayGrade |
| 54 | `app/zoiko-hr/compensation/allowances/page.tsx` | `fetchAllowances` | MOCK | Allowance |
| 55 | `app/zoiko-hr/compensation/deductions/page.tsx` | `fetchDeductions` | MOCK | Deduction |
| 56 | `app/zoiko-hr/compensation/benefits/page.tsx` | `fetchBenefits` | MOCK | BenefitPlan |
| 57 | `app/zoiko-hr/compensation/bonuses/page.tsx` | `fetchBonuses` | MOCK | Bonus |
| 58 | `app/zoiko-hr/compensation/reviews/page.tsx` | `fetchCompReviews` | MOCK | CompensationReview |
| 59 | `app/zoiko-hr/compensation/salary-history/page.tsx` | `fetchSalaryRevisions` | MOCK | SalaryRevision |
| 60 | `app/zoiko-hr/compensation/reports/page.tsx` | `fetchSalaryDistribution`, `fetchBenefitEnrollment`, `fetchDeptCompCost`, `fetchReviewOutcomes` | MOCK | Aggregated views |

---

## 14. TRAVEL & EXPENSE (MOCK — 9 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 61 | `app/zoiko-hr/travel/page.tsx` | `fetchTravelDashboard` | MOCK | TravelRequest, ExpenseClaim, Reimbursement |
| 62 | `app/zoiko-hr/travel/travel-requests/page.tsx` | `fetchTravelRequests` | MOCK | TravelRequest |
| 63 | `app/zoiko-hr/travel/expense-claims/page.tsx` | `fetchExpenseClaims` | MOCK | ExpenseClaim |
| 64 | `app/zoiko-hr/travel/expense-categories/page.tsx` | `fetchExpenseCategories` | MOCK | ExpenseCategory |
| 65 | `app/zoiko-hr/travel/approvals/page.tsx` | `fetchTravelApprovals` | MOCK | TravelApproval |
| 66 | `app/zoiko-hr/travel/reimbursements/page.tsx` | `fetchReimbursements` | MOCK | Reimbursement |
| 67 | `app/zoiko-hr/travel/corporate-travel/page.tsx` | `fetchCorporateTrips` | MOCK | CorporateTrip |
| 68 | `app/zoiko-hr/travel/policy-management/page.tsx` | `fetchTravelPolicies` | MOCK | TravelPolicy |
| 69 | `app/zoiko-hr/travel/reports/page.tsx` | `fetchTravelExpenseReports`, `fetchTravelDeptData` | MOCK | Aggregated views |

---

## 15. COMPLIANCE (MOCK — 10 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 70 | `app/zoiko-hr/compliance/page.tsx` | `fetchComplianceDashboard`, `fetchViolations` | MOCK | Policy, Violation, Audit, CorrectiveAction |
| 71 | `app/zoiko-hr/compliance/policies/page.tsx` | `fetchPolicies`, `createPolicy`, `updatePolicy` | MOCK | Policy |
| 72 | `app/zoiko-hr/compliance/policy-categories/page.tsx` | `fetchPolicyCategories`, `createPolicyCategory`, `updatePolicyCategory` | MOCK | PolicyCategory |
| 73 | `app/zoiko-hr/compliance/requirements/page.tsx` | `fetchComplianceRequirements`, `createComplianceRequirement`, `updateComplianceRequirement` | MOCK | ComplianceRequirement |
| 74 | `app/zoiko-hr/compliance/audits/page.tsx` | `fetchAudits`, `createAudit`, `updateAuditStatus` | MOCK | Audit |
| 75 | `app/zoiko-hr/compliance/violations/page.tsx` | `fetchViolations`, `updateViolationStatus` | MOCK | Violation |
| 76 | `app/zoiko-hr/compliance/corrective-actions/page.tsx` | `fetchCorrectiveActions`, `createCorrectiveAction`, `updateCorrectiveAction` | MOCK | CorrectiveAction |
| 77 | `app/zoiko-hr/compliance/acknowledgements/page.tsx` | `fetchAcknowledgements` | MOCK | Acknowledgement |
| 78 | `app/zoiko-hr/compliance/training-compliance/page.tsx` | `fetchTrainingCompliance` | MOCK | TrainingCompliance |
| 79 | `app/zoiko-hr/compliance/reports/page.tsx` | `fetchComplianceTrends`, `fetchViolationByCategory`, `fetchAuditCompletionData`, `fetchDeptComplianceStats`, `fetchPolicyAdherenceTrends` | MOCK | Aggregated views |

---

## 16. LEARNING & DEVELOPMENT (MOCK — 7 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 80 | `app/zoiko-hr/learning/page.tsx` | `fetchLMSDashboard` | MOCK | Course, Enrollment, Certification, Assessment |
| 81 | `app/zoiko-hr/learning/courses/page.tsx` | `fetchCourses` | MOCK | Course |
| 82 | `app/zoiko-hr/learning/learning-paths/page.tsx` | `fetchLearningPaths` | MOCK | LearningPath |
| 83 | `app/zoiko-hr/learning/certifications/page.tsx` | `fetchCertifications` | MOCK | Certification |
| 84 | `app/zoiko-hr/learning/assessments/page.tsx` | `fetchAssessments` | MOCK | Assessment |
| 85 | `app/zoiko-hr/learning/enrollments/page.tsx` | `fetchEnrollments` | MOCK | Enrollment |
| 86 | `app/zoiko-hr/learning/reports/page.tsx` | `fetchCertificationReports`, `fetchCourseCompletionData`, `fetchDeptLearningStats`, `fetchSkillTrends`, `fetchLearningProgress` | MOCK | Aggregated views |

---

## 17. ASSET MANAGEMENT (MOCK — 6 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 87 | `app/zoiko-hr/assets/page.tsx` | `fetchAssetDashboard` | MOCK | Asset, AssetAllocation, AssetMaintenance |
| 88 | `app/zoiko-hr/assets/inventory/page.tsx` | `fetchAssets`, `updateAssetItemStatus` | MOCK | Asset |
| 89 | `app/zoiko-hr/assets/allocation/page.tsx` | `fetchAllocationRecords` | MOCK | AssetAllocation |
| 90 | `app/zoiko-hr/assets/returns/page.tsx` | `fetchReturnRecords` | MOCK | AssetReturn |
| 91 | `app/zoiko-hr/assets/maintenance/page.tsx` | `fetchMaintenanceRecords`, `updateMaintenanceStatus` | MOCK | AssetMaintenance |
| 92 | `app/zoiko-hr/assets/categories/page.tsx` | (inline categories) | STATIC | AssetCategory |
| 93 | `app/zoiko-hr/assets/reports/page.tsx` | `fetchAssetUtilization`, `fetchDeptAllocation`, `fetchMaintenanceCost`, `fetchAssetLifecycle` | MOCK | Aggregated views |

---

## 18. ENGAGEMENT (MOCK — 11 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 94 | `app/zoiko-hr/engagement/page.tsx` | `fetchEngagementDashboard`, `fetchSurveys` | MOCK | Survey, EmployeeRecognition, EngagementScore |
| 95 | `app/zoiko-hr/engagement/surveys/page.tsx` | `fetchSurveys`, `createSurvey`, `updateSurvey` | MOCK | Survey |
| 96 | `app/zoiko-hr/engagement/survey-templates/page.tsx` | `fetchSurveyTemplates` | MOCK | SurveyTemplate |
| 97 | `app/zoiko-hr/engagement/pulse-surveys/page.tsx` | `fetchPulseSurveys`, `createPulseSurvey`, `updatePulseSurveyStatus` | MOCK | PulseSurvey |
| 98 | `app/zoiko-hr/engagement/feedback-campaigns/page.tsx` | `fetchFeedbackCampaigns`, `createFeedbackCampaign`, `updateFeedbackCampaignStatus` | MOCK | FeedbackCampaign |
| 99 | `app/zoiko-hr/engagement/recognition-programs/page.tsx` | `fetchRecognitionPrograms` | MOCK | RecognitionProgram |
| 100 | `app/zoiko-hr/engagement/employee-recognition/page.tsx` | `fetchEmployeeRecognitions`, `createEmployeeRecognition` | MOCK | EmployeeRecognition |
| 101 | `app/zoiko-hr/engagement/engagement-scores/page.tsx` | `fetchEngagementScores` | MOCK | EngagementScore |
| 102 | `app/zoiko-hr/engagement/sentiment-analysis/page.tsx` | `fetchSentimentAnalysis` | MOCK | SentimentAnalysis |
| 103 | `app/zoiko-hr/engagement/action-plans/page.tsx` | `fetchActionPlans`, `createActionPlan`, `updateActionPlan` | MOCK | ActionPlan |
| 104 | `app/zoiko-hr/engagement/reports/page.tsx` | `fetchSurveyReports`, `fetchEngagementReports`, `fetchRecognitionReports`, `fetchParticipationReports` | MOCK | Aggregated views |

---

## 19. HR HELPDESK (MOCK + STATIC — 6 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 105 | `app/zoiko-hr/helpdesk/page.tsx` | `initialTickets`, `initialEmployeeRequests`, `initialCases`, `initialSLAs`, `initialKnowledgeArticles` from `mockData.ts` | MOCK (inline mock data) | Ticket, EmployeeRequest, HelpdeskCase, SLA, KnowledgeArticle |
| 106 | `app/zoiko-hr/helpdesk/tickets/page.tsx` | `initialTickets` from `mockData.ts` | MOCK (inline mock data) | Ticket |
| 107 | `app/zoiko-hr/helpdesk/employee-requests/page.tsx` | `initialEmployeeRequests` from `mockData.ts` | MOCK (inline mock data) | EmployeeRequest |
| 108 | `app/zoiko-hr/helpdesk/cases/page.tsx` | `initialCases` from `mockData.ts` | MOCK (inline mock data) | HelpdeskCase |
| 109 | `app/zoiko-hr/helpdesk/sla/page.tsx` | `initialSLAs` from `mockData.ts` | MOCK (inline mock data) | SLA |
| 110 | `app/zoiko-hr/helpdesk/knowledge-base/page.tsx` | `initialKnowledgeArticles` from `mockData.ts` | MOCK (inline mock data) | KnowledgeArticle |

---

## 20. EMPLOYEE SELF-SERVICE / ESS (MOCK — 11 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 111 | `app/zoiko-hr/ess/page.tsx` | `fetchESSDashboard` | MOCK | Employee (self), Attendance, LeaveRequest, Document |
| 112 | `app/zoiko-hr/ess/my-profile/page.tsx` | `fetchESSProfile` | MOCK | Employee, EmployeeProfile |
| 113 | `app/zoiko-hr/ess/my-attendance/page.tsx` | `fetchESSAttendance` | MOCK | Attendance |
| 114 | `app/zoiko-hr/ess/my-leave/page.tsx` | `fetchESSLeaveRequests`, `fetchESSLeaveBalances` | MOCK | LeaveRequest, LeaveBalance |
| 115 | `app/zoiko-hr/ess/my-documents/page.tsx` | `fetchESSDocuments` | MOCK | EmployeeDocumentReference |
| 116 | `app/zoiko-hr/ess/my-assets/page.tsx` | `fetchESSAssets` | MOCK | AssetAllocation |
| 117 | `app/zoiko-hr/ess/my-learning/page.tsx` | `fetchESSCourses` | MOCK | Enrollment |
| 118 | `app/zoiko-hr/ess/my-performance/page.tsx` | `fetchESSReviews` | MOCK | PerformanceReview |
| 119 | `app/zoiko-hr/ess/my-payslips/page.tsx` | `fetchESSPayslips` | MOCK | Payslip |
| 120 | `app/zoiko-hr/ess/my-requests/page.tsx` | `fetchESSRequests` | MOCK | EmployeeRequest |
| 121 | `app/zoiko-hr/ess/notifications/page.tsx` | `fetchESSNotifications` | MOCK | Notification |

---

## 21. REWARDS & RECOGNITION (MOCK — 5 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 122 | `app/zoiko-hr/rewards/page.tsx` | `fetchRewardsDashboard` | MOCK | Award, RecognitionProgram, RewardPoints |
| 123 | `app/zoiko-hr/rewards/awards/page.tsx` | `fetchAwards`, `createAward`, `updateAward`, `deleteAward` | MOCK | Award |
| 124 | `app/zoiko-hr/rewards/programs/page.tsx` | `fetchRewardsRecognitionPrograms`, `createRewardsRecognitionProgram`, `updateRewardsRecognitionProgram`, `deleteRewardsRecognitionProgram` | MOCK | RecognitionProgram |
| 125 | `app/zoiko-hr/rewards/points/page.tsx` | `fetchRewardPointsBalances`, `fetchRewardPointTransactions` | MOCK | RewardPoints |
| 126 | `app/zoiko-hr/rewards/achievements/page.tsx` | `fetchAchievements`, `createAchievement`, `updateAchievement`, `deleteAchievement` | MOCK | Achievement |

---

## 22. WORKFORCE PLANNING (MOCK — 9 pages)

| # | Frontend Page | Mock Function(s) | Status | Future Table(s) |
|---|---|---|---|---|
| 127 | `app/zoiko-hr/workforce-planning/page.tsx` | `fetchWFDashboard` | MOCK | WFHeadcountPlan, WFWorkforceForecast, WFHiringPlan |
| 128 | `app/zoiko-hr/workforce-planning/headcount/page.tsx` | `fetchWFHeadcountPlans`, `createWFHeadcountPlan`, `updateWFHeadcountPlan` | MOCK | WFHeadcountPlan |
| 129 | `app/zoiko-hr/workforce-planning/forecasting/page.tsx` | `fetchWFWorkforceForecasts`, `createWFWorkforceForecast` | MOCK | WFWorkforceForecast |
| 130 | `app/zoiko-hr/workforce-planning/hiring-plans/page.tsx` | `fetchWFHiringPlans`, `createWFHiringPlan`, `updateWFHiringPlan` | MOCK | WFHiringPlan |
| 131 | `app/zoiko-hr/workforce-planning/capacity/page.tsx` | `fetchWFCapacityPlans`, `createWFCapacityPlan` | MOCK | WFCapacityPlan |
| 132 | `app/zoiko-hr/workforce-planning/skill-gaps/page.tsx` | `fetchWFSkillGaps`, `createWFSkillGap` | MOCK | WFSkillGap |
| 133 | `app/zoiko-hr/workforce-planning/succession/page.tsx` | `fetchWFSuccessionPlans`, `createWFSuccessionPlan`, `updateWFSuccessionPlan` | MOCK | WFSuccessionPlan |
| 134 | `app/zoiko-hr/workforce-planning/budget/page.tsx` | `fetchWFBudgetPlans`, `createWFBudgetPlan`, `updateWFBudgetPlan` | MOCK | WFBudgetPlan |
| 135 | `app/zoiko-hr/workforce-planning/scenarios/page.tsx` | `fetchWFScenarioPlans`, `createWFScenarioPlan` | MOCK | WFScenarioPlan |
| 136 | `app/zoiko-hr/workforce-planning/reports/page.tsx` | `fetchWFHeadcountReports`, `fetchWFForecastReports`, `fetchWFHiringReports`, `fetchWFSkillGapReports`, `fetchWFSuccessionReports`, `fetchWFBudgetReports` | MOCK | Aggregated views |

---

## 23. PRODUCT PAGES (STATIC / MOCK — 4 pages)

| # | Frontend Page | Data Source | Status | Future Table(s) |
|---|---|---|---|---|
| 137 | `app/zoikocorex/page.tsx` | STATIC / inline placeholders | STATIC | — |
| 138 | `app/zoikopay/page.tsx` | STATIC / inline placeholders | STATIC | — |
| 139 | `app/zoikotime/page.tsx` | STATIC / inline placeholders | STATIC | — |
| 140 | `app/zoiko-hr/page.tsx` | STATIC / inline placeholders | STATIC | — |

---

## 24. HR HOME (STATIC — 1 page)

| # | Frontend Page | Data Source | Status |
|---|---|---|---|
| 141 | `app/zoiko-hr/page.tsx` | STATIC (inline navigation tiles) | STATIC |

---

## Summary

| Category | Count | Description |
|---|---|---|
| **REAL** (REST API / Prisma) | 33 | Workforce(9), Attendance(6), Leave(6), Performance(4), Departments(2), Designations(2), Documents(2), Payroll(2) |
| **REAL** (Super Admin Prisma) | 13 | Dashboard, Users, Tenants, Organizations, Settings, Subscriptions, Billing, Insights, AuditLogs, Notifications, Approvals, Payroll, PayrollOps |
| **MOCK** (`workforce-api.ts`) | 93 | Recruitment(6), Onboarding(7), Compensation(10), Travel(9), Compliance(10), Learning(7), Assets(6), Engagement(11), Helpdesk(6), ESS(11), Rewards(5), Workforce Planning(10) |
| **STATIC** | 10 | Employee Lifecycle(4), Platform pages(5), HR home(1) |
| **Total** | **149** | |

> **Note on mock pages**: All mock functions live in `app/lib/workforce-api.ts` and use in-memory arrays / hardcoded data. They follow real API function signatures so swapping to real endpoints requires only changing the function body to call the actual backend.
