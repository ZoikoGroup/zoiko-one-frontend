# API Usage Audit

Generated: 2026-06-10

Scope: All pages under `app/zoiko-hr/`, `app/payroll/`, `app/payroll-operations/`

---

## Backend Connected

33 pages use real HTTP API calls via `app/lib/api/client.ts` (`apiFetch` / raw `fetch`).

### Workforce (9 pages)
| Page | Functions Imported | Backend Endpoint(s) |
|---|---|---|
| `app/zoiko-hr/workforce/page.tsx` | `fetchEmployees` | `GET /api/zoiko-hr/workforce` |
| `app/zoiko-hr/workforce/employees/page.tsx` | `fetchEmployees` | `GET /api/zoiko-hr/workforce`, `DELETE /api/zoiko-hr/workforce/{id}` |
| `app/zoiko-hr/workforce/employees/new/page.tsx` | _(none — raw fetch)_ | `POST /api/zoiko-hr/workforce` |
| `app/zoiko-hr/workforce/employees/[employeeId]/page.tsx` | `fetchEmployee`, `fetchEmploymentRecords`, `fetchEmployeeDocuments`, `fetchEmergencyContacts`, `fetchEmployeeAddresses` | `GET /api/zoiko-hr/workforce/{id}`, etc. |
| `app/zoiko-hr/workforce/employees/[employeeId]/edit/page.tsx` | `fetchEmployee` | `GET /api/zoiko-hr/workforce/{id}`, `PUT /api/zoiko-hr/workforce/{id}` |
| `app/zoiko-hr/workforce/addresses/page.tsx` | `fetchEmployees` | `GET /api/zoiko-hr/workforce` |
| `app/zoiko-hr/workforce/documents/page.tsx` | `fetchEmployees` | `GET /api/zoiko-hr/workforce` |
| `app/zoiko-hr/workforce/emergency-contacts/page.tsx` | `fetchEmployees` | `GET /api/zoiko-hr/workforce` |
| `app/zoiko-hr/workforce/employment-records/page.tsx` | `fetchEmployees` | `GET /api/zoiko-hr/workforce` |

### Attendance (6 pages)
| Page | Functions Imported | Backend Endpoint(s) |
|---|---|---|
| `app/zoiko-hr/attendance/page.tsx` | `fetchAttendanceDashboard` | `GET /api/zoiko-hr/attendance/dashboard` |
| `app/zoiko-hr/attendance/check-in-out/page.tsx` | `checkInEmployee`, `checkOutEmployee` | `POST /api/zoiko-hr/attendance/check-in`, `POST /api/zoiko-hr/attendance/check-out` |
| `app/zoiko-hr/attendance/entry/page.tsx` | `createAttendance` | `POST /api/zoiko-hr/attendance` |
| `app/zoiko-hr/attendance/records/page.tsx` | `fetchAttendances` | `GET /api/zoiko-hr/attendance` |
| `app/zoiko-hr/attendance/reports/page.tsx` | `fetchAttendanceReport` | `GET /api/zoiko-hr/attendance/reports` |
| `app/zoiko-hr/attendance/shifts/page.tsx` | `fetchShifts` | `GET /api/zoiko-hr/shifts` |

### Leave (6 pages)
| Page | Functions Imported | Backend Endpoint(s) |
|---|---|---|
| `app/zoiko-hr/leave/page.tsx` | `fetchLeaveRequests`, `fetchLeaveTypes` | `GET /api/zoiko-hr/leave/requests`, `GET /api/zoiko-hr/leave/types` |
| `app/zoiko-hr/leave/balances/page.tsx` | `fetchLeaveBalances`, `fetchLeaveTypes`, `fetchEmployees` | `GET /api/zoiko-hr/leave/balances`, etc. |
| `app/zoiko-hr/leave/calendar/page.tsx` | `fetchLeaveCalendar` | `GET /api/zoiko-hr/leave/calendar` |
| `app/zoiko-hr/leave/leave-types/page.tsx` | `fetchLeaveTypes`, `createLeaveType`, `updateLeaveType`, `deleteLeaveType` | `GET/POST/PUT/DELETE /api/zoiko-hr/leave/types` |
| `app/zoiko-hr/leave/requests/page.tsx` | `fetchLeaveRequests`, `createLeaveRequest`, `approveLeaveRequest`, `cancelLeaveRequest` | `GET/POST /api/zoiko-hr/leave/requests`, `PUT /api/zoiko-hr/leave/requests/{id}/approve`, `POST /api/zoiko-hr/leave/requests/{id}/cancel` |
| `app/zoiko-hr/leave/requests/[requestId]/page.tsx` | `fetchLeaveRequest`, `approveLeaveRequest` | `GET /api/zoiko-hr/leave/requests/{id}`, `PUT /api/zoiko-hr/leave/requests/{id}/approve` |

### Performance (4 pages)
| Page | Functions Imported | Backend Endpoint(s) |
|---|---|---|
| `app/zoiko-hr/performance/page.tsx` | `fetchPerformanceDashboard`, `fetchReviews`, `fetchGoals` | `GET /api/zoiko-hr/performance/dashboard`, etc. |
| `app/zoiko-hr/performance/feedback/page.tsx` | `fetchFeedbacks`, `createFeedback`, `deleteFeedback` | `GET/POST/DELETE /api/zoiko-hr/performance/feedback` |
| `app/zoiko-hr/performance/goals/page.tsx` | `fetchGoals`, `createGoal`, `updateGoal`, `deleteGoal`, `createGoalUpdate` | `GET/POST/PUT/DELETE /api/zoiko-hr/performance/goals` |
| `app/zoiko-hr/performance/reviews/page.tsx` | `fetchReviews`, `fetchCycles`, `createReview`, `updateReview`, `deleteReview` | `GET/POST/PUT/DELETE /api/zoiko-hr/performance/reviews` |

### Departments & Designations (4 pages)
| Page | Functions Imported | Backend Endpoint(s) |
|---|---|---|
| `app/zoiko-hr/departments/page.tsx` | `fetchDepartments`, `createDepartment`, `updateDepartment`, `deleteDepartment` | `GET/POST/PUT/DELETE /api/zoiko-hr/departments` |
| `app/zoiko-hr/departments/[departmentId]/page.tsx` | `fetchDepartment`, `fetchDesignations` | `GET /api/zoiko-hr/departments/{id}`, `GET /api/zoiko-hr/designations` |
| `app/zoiko-hr/designations/page.tsx` | `fetchDesignations`, `createDesignation`, `updateDesignation`, `deleteDesignation`, `fetchDepartments` | `GET/POST/PUT/DELETE /api/zoiko-hr/designations` |
| `app/zoiko-hr/designations/[designationId]/page.tsx` | `fetchDesignation` | `GET /api/zoiko-hr/designations/{id}` |

### Documents (2 pages)
| Page | Functions Imported | Backend Endpoint(s) |
|---|---|---|
| `app/zoiko-hr/documents/page.tsx` | `fetchDocuments`, `deleteDocument` | `GET/DELETE /api/zoiko-hr/documents` |
| `app/zoiko-hr/documents/[documentId]/page.tsx` | `getDocument`, `updateDocument`, `deleteDocument` | `GET/PUT/DELETE /api/zoiko-hr/documents/{id}` |

### Payroll (2 pages)
| Page | Functions Imported | Backend |
|---|---|---|
| `app/payroll/page.tsx` | `getPayrollOperations` | Prisma `payrollRun.findMany()` via `superAdminService` (real DB, with demo fallback row on error) |
| `app/payroll-operations/page.tsx` | `getPayrollOperations` | same as above |

---

## Bug: Missing Imports in Backend-Connected Page

**`app/zoiko-hr/attendance/shifts/page.tsx`** imports only `fetchShifts` and `ShiftRecord`, but its JSX calls `createShift` (line 84), `updateShift` (line 81), and `deleteShift` (line 99). These functions exist in `app/lib/api/attendance.api.ts` but are not imported. The page will throw runtime errors when these actions are triggered.

---

## Mock Data

93 pages use mock-backend functions defined in `app/lib/workforce-api.ts` (lines 150–3873). These functions operate on in-memory arrays, make no HTTP calls, and are not connected to any backend.

### Recruitment (6 pages)
- `app/zoiko-hr/recruitment/page.tsx` — `fetchRecruitmentDashboard` (mockJobs, mockCandidates, mockInterviews, mockOffers)
- `app/zoiko-hr/recruitment/candidates/page.tsx` — `fetchCandidates`, `updateCandidateStage` (mockCandidates)
- `app/zoiko-hr/recruitment/interviews/page.tsx` — `fetchInterviews`, `createInterview`, `updateInterviewStatus` (mockInterviews)
- `app/zoiko-hr/recruitment/job-openings/page.tsx` — `fetchJobOpenings`, `createJobOpening`, `updateJobOpening`, `closeJobOpening` (mockJobs)
- `app/zoiko-hr/recruitment/offers/page.tsx` — `fetchOffers`, `createOffer`, `updateOfferStatus` (mockOffers)
- `app/zoiko-hr/recruitment/reports/page.tsx` — 5 report functions (hardcoded static + mock-derived)

### Compliance (10 pages)
- `app/zoiko-hr/compliance/page.tsx` — `fetchComplianceDashboard`, `fetchViolations`
- `app/zoiko-hr/compliance/acknowledgements/page.tsx` — `fetchAcknowledgements`
- `app/zoiko-hr/compliance/audits/page.tsx` — `fetchAudits`, `createAudit`, `updateAuditStatus`
- `app/zoiko-hr/compliance/corrective-actions/page.tsx` — `fetchCorrectiveActions`, `createCorrectiveAction`, `updateCorrectiveAction`
- `app/zoiko-hr/compliance/policies/page.tsx` — `fetchPolicies`, `createPolicy`, `updatePolicy`
- `app/zoiko-hr/compliance/policy-categories/page.tsx` — `fetchPolicyCategories`, `createPolicyCategory`, `updatePolicyCategory`
- `app/zoiko-hr/compliance/reports/page.tsx` — 6 report functions
- `app/zoiko-hr/compliance/requirements/page.tsx` — `fetchComplianceRequirements`, `createComplianceRequirement`, `updateComplianceRequirement`
- `app/zoiko-hr/compliance/training-compliance/page.tsx` — `fetchTrainingCompliance`
- `app/zoiko-hr/compliance/violations/page.tsx` — `fetchViolations`, `updateViolationStatus`

### Assets (7 pages)
- `app/zoiko-hr/assets/page.tsx` — `fetchAssetDashboard`
- `app/zoiko-hr/assets/allocation/page.tsx` — `fetchAllocationRecords`
- `app/zoiko-hr/assets/categories/page.tsx` — `fetchAssets`
- `app/zoiko-hr/assets/inventory/page.tsx` — `fetchAssets`
- `app/zoiko-hr/assets/maintenance/page.tsx` — `fetchMaintenanceRecords`
- `app/zoiko-hr/assets/reports/page.tsx` — 4 report functions
- `app/zoiko-hr/assets/returns/page.tsx` — `fetchReturnRecords`

### Travel (9 pages)
- `app/zoiko-hr/travel/page.tsx` — `fetchTravelDashboard`
- `app/zoiko-hr/travel/approvals/page.tsx` — `fetchTravelApprovals`
- `app/zoiko-hr/travel/corporate-travel/page.tsx` — `fetchCorporateTrips`
- `app/zoiko-hr/travel/expense-categories/page.tsx` — `fetchExpenseCategories`
- `app/zoiko-hr/travel/expense-claims/page.tsx` — `fetchExpenseClaims`
- `app/zoiko-hr/travel/policy-management/page.tsx` — `fetchTravelPolicies`
- `app/zoiko-hr/travel/reimbursements/page.tsx` — `fetchReimbursements`
- `app/zoiko-hr/travel/reports/page.tsx` — 2 report functions
- `app/zoiko-hr/travel/travel-requests/page.tsx` — `fetchTravelRequests`

### Onboarding (7 pages)
- `app/zoiko-hr/onboarding/page.tsx` — `fetchOnboardingDashboard`
- `app/zoiko-hr/onboarding/asset-allocation/page.tsx` — `fetchAssetAllocations`, `updateAssetStatus`
- `app/zoiko-hr/onboarding/document-verification/page.tsx` — `fetchDocumentVerifications`, `updateDocumentStatus`
- `app/zoiko-hr/onboarding/new-joiners/page.tsx` — `fetchNewJoiners`, `updateNewJoinerStatus`
- `app/zoiko-hr/onboarding/probation/page.tsx` — `fetchProbations`, `updateProbationStatus`
- `app/zoiko-hr/onboarding/reports/page.tsx` — 5 report functions
- `app/zoiko-hr/onboarding/welcome-kit/page.tsx` — `fetchWelcomeKits`, `updateWelcomeKitStatus`

### ESS (11 pages)
- `app/zoiko-hr/ess/page.tsx` — `fetchESSDashboard`
- `app/zoiko-hr/ess/my-assets/page.tsx` — `fetchESSAssets`
- `app/zoiko-hr/ess/my-attendance/page.tsx` — `fetchESSAttendance`
- `app/zoiko-hr/ess/my-documents/page.tsx` — `fetchESSDocuments`
- `app/zoiko-hr/ess/my-learning/page.tsx` — `fetchESSCourses`
- `app/zoiko-hr/ess/my-leave/page.tsx` — `fetchESSLeaveRequests`, `fetchESSLeaveBalances`
- `app/zoiko-hr/ess/my-payslips/page.tsx` — `fetchESSPayslips`
- `app/zoiko-hr/ess/my-performance/page.tsx` — `fetchESSReviews`
- `app/zoiko-hr/ess/my-profile/page.tsx` — `fetchESSProfile`
- `app/zoiko-hr/ess/my-requests/page.tsx` — `fetchESSRequests`
- `app/zoiko-hr/ess/notifications/page.tsx` — `fetchESSNotifications`, `markNotificationRead`

### Engagement (11 pages)
- `app/zoiko-hr/engagement/page.tsx` — `fetchEngagementDashboard`, `fetchSurveys`
- `app/zoiko-hr/engagement/action-plans/page.tsx` — `fetchActionPlans`, `createActionPlan`, `updateActionPlan`
- `app/zoiko-hr/engagement/employee-recognition/page.tsx` — `fetchEmployeeRecognitions`, `createEmployeeRecognition`
- `app/zoiko-hr/engagement/engagement-scores/page.tsx` — `fetchEngagementScores`
- `app/zoiko-hr/engagement/feedback-campaigns/page.tsx` — `fetchFeedbackCampaigns`, `createFeedbackCampaign`, `updateFeedbackCampaignStatus`
- `app/zoiko-hr/engagement/pulse-surveys/page.tsx` — `fetchPulseSurveys`, `createPulseSurvey`, `updatePulseSurveyStatus`
- `app/zoiko-hr/engagement/recognition-programs/page.tsx` — `fetchRecognitionPrograms`
- `app/zoiko-hr/engagement/reports/page.tsx` — 4 report functions
- `app/zoiko-hr/engagement/sentiment-analysis/page.tsx` — `fetchSentimentAnalysis`
- `app/zoiko-hr/engagement/survey-templates/page.tsx` — `fetchSurveyTemplates`
- `app/zoiko-hr/engagement/surveys/page.tsx` — `fetchSurveys`, `createSurvey`, `updateSurvey`

### Rewards (5 pages)
- `app/zoiko-hr/rewards/page.tsx` — `fetchRewardsDashboard`
- `app/zoiko-hr/rewards/achievements/page.tsx` — `fetchAchievements`, `createAchievement`, `updateAchievement`, `deleteAchievement`
- `app/zoiko-hr/rewards/awards/page.tsx` — `fetchAwards`, `createAward`, `updateAward`, `deleteAward`
- `app/zoiko-hr/rewards/points/page.tsx` — `fetchRewardPointsBalances`, `fetchRewardPointTransactions`, `awardPoints`
- `app/zoiko-hr/rewards/programs/page.tsx` — `fetchRewardsRecognitionPrograms`, CRUD

### Learning (7 pages)
- `app/zoiko-hr/learning/page.tsx` — `fetchLMSDashboard`
- `app/zoiko-hr/learning/assessments/page.tsx` — `fetchAssessments`
- `app/zoiko-hr/learning/certifications/page.tsx` — `fetchCertifications`
- `app/zoiko-hr/learning/courses/page.tsx` — `fetchCourses` (mock-backed, but also has inline static `CATEGORIES`/`LEVELS` arrays)
- `app/zoiko-hr/learning/enrollments/page.tsx` — `fetchEnrollments`
- `app/zoiko-hr/learning/learning-paths/page.tsx` — `fetchLearningPaths`
- `app/zoiko-hr/learning/reports/page.tsx` — 5 report functions

### Compensation (10 pages)
- `app/zoiko-hr/compensation/page.tsx` — `fetchCompensationDashboard`
- `app/zoiko-hr/compensation/allowances/page.tsx` — `fetchAllowances`
- `app/zoiko-hr/compensation/benefits/page.tsx` — `fetchBenefits`
- `app/zoiko-hr/compensation/bonuses/page.tsx` — `fetchBonuses`
- `app/zoiko-hr/compensation/deductions/page.tsx` — `fetchDeductions`
- `app/zoiko-hr/compensation/pay-grades/page.tsx` — `fetchPayGrades`
- `app/zoiko-hr/compensation/reports/page.tsx` — 2 report functions
- `app/zoiko-hr/compensation/reviews/page.tsx` — `fetchCompReviews`
- `app/zoiko-hr/compensation/salary-history/page.tsx` — `fetchSalaryRevisions`
- `app/zoiko-hr/compensation/salary-structures/page.tsx` — `fetchSalaryStructures`

### Workforce Planning (10 pages)
- `app/zoiko-hr/workforce-planning/page.tsx` — `fetchWFDashboard`
- `app/zoiko-hr/workforce-planning/budget/page.tsx` — `fetchWFBudgetPlans`, CRUD
- `app/zoiko-hr/workforce-planning/capacity/page.tsx` — `fetchWFCapacityPlans`, CRUD
- `app/zoiko-hr/workforce-planning/forecasting/page.tsx` — `fetchWFWorkforceForecasts`, CRUD
- `app/zoiko-hr/workforce-planning/headcount/page.tsx` — `fetchWFHeadcountPlans`, CRUD
- `app/zoiko-hr/workforce-planning/hiring-plans/page.tsx` — `fetchWFHiringPlans`, CRUD
- `app/zoiko-hr/workforce-planning/reports/page.tsx` — 6 report functions
- `app/zoiko-hr/workforce-planning/scenarios/page.tsx` — `fetchWFScenarioPlans`, CRUD
- `app/zoiko-hr/workforce-planning/skill-gaps/page.tsx` — `fetchWFSkillGaps`, CRUD
- `app/zoiko-hr/workforce-planning/succession/page.tsx` — `fetchWFSuccessionPlans`, CRUD

---

## Static Data

10 pages use fully hardcoded inline data arrays with zero API calls.

### Employee Lifecycle (4 pages)
- `app/zoiko-hr/employee-lifecycle/page.tsx` — inline `lifecycleStats`, `recentOnboardings`, `recentTransfers`, `recentOffboardings`
- `app/zoiko-hr/employee-lifecycle/offboarding/page.tsx` — inline `initialRecords` array
- `app/zoiko-hr/employee-lifecycle/onboarding/page.tsx` — inline `initialRecords` array
- `app/zoiko-hr/employee-lifecycle/transfers/page.tsx` — inline `initialRecords` array

### Helpdesk (6 pages)
- `app/zoiko-hr/helpdesk/page.tsx` — imports from `./mockData`
- `app/zoiko-hr/helpdesk/cases/page.tsx` — imports from `../mockData`
- `app/zoiko-hr/helpdesk/employee-requests/page.tsx` — imports from `../mockData`
- `app/zoiko-hr/helpdesk/knowledge-base/page.tsx` — imports from `../mockData`
- `app/zoiko-hr/helpdesk/sla/page.tsx` — imports from `../mockData`
- `app/zoiko-hr/helpdesk/tickets/page.tsx` — imports from `../mockData`

---

## Mixed

**`app/zoiko-hr/page.tsx`** (dashboard) — imports `getUsers` from `../services/superAdminService` which runs a real Prisma query but has a `safeQuery()` wrapper that returns hardcoded fallback data on query failure.

---

## Missing API Integration

These should call a real backend but currently don't:

| Module | Pages | Priority |
|---|---|---|
| Recruitment | 6 pages | High — recruiting is a core HR function |
| Assets | 7 pages | High — asset tracking is operational |
| Travel | 9 pages | High — expense claims need real data |
| Onboarding | 7 pages | Medium — employee lifecycle depends on it |
| ESS | 11 pages | Medium — employee self-service for "my" data |
| Compliance | 10 pages | Medium — policy/violation tracking |
| Engagement | 11 pages | Medium — survey/feedback data |
| Rewards | 5 pages | Medium — points and recognition |
| Learning/LMS | 7 pages | Low — course catalog can wait |
| Compensation | 10 pages | Low — salary data is sensitive |
| Workforce Planning | 10 pages | Low — planning/forecasting is aspirational |
| Employee Lifecycle | 4 pages | Low — hardcoded data, small scope |
| Helpdesk | 6 pages | Low — ticketing is an add-on |

---

## Mock Data Inventory

All mock data lives in `app/lib/workforce-api.ts` (lines 150–3873). The mock arrays and the functions that consume them:

| Mock Array | Module | Lines |
|---|---|---|
| `mockJobs` | Recruitment | ~155 |
| `mockCandidates` | Recruitment | ~160 |
| `mockInterviews` | Recruitment | ~165 |
| `mockOffers` | Recruitment | ~170 |
| `mockNewJoiners` | Onboarding | ~540 |
| `mockDocumentVerifications` | Onboarding | ~545 |
| `mockAssetAllocations` | Onboarding | ~550 |
| `mockProbations` | Onboarding | ~555 |
| `mockWelcomeKits` | Onboarding | ~560 |
| `mockAssets` | Assets | ~835 |
| `mockAllocations` | Assets | ~840 |
| `mockMaintenance` | Assets | ~845 |
| `mockReturns` | Assets | ~850 |
| `mockCourses` | Learning | ~1125 |
| `mockEnrollments` | Learning | ~1130 |
| `mockCertifications` | Learning | ~1135 |
| `mockAssessments` | Learning | ~1140 |
| `mockLearningPaths` | Learning | ~1145 |
| `mockSalaryStructures` | Compensation | ~1500 |
| `mockBenefits` | Compensation | ~1505 |
| `mockAllowances` | Compensation | ~1510 |
| `mockBonuses` | Compensation | ~1515 |
| `mockDeductions` | Compensation | ~1520 |
| `mockPayGrades` | Compensation | ~1525 |
| `mockCompReviews` | Compensation | ~1530 |
| `mockSalaryRevisions` | Compensation | ~1535 |
| `currentEmployee` | ESS | ~1808 |
| `essAttendance` | ESS | ~1829 |
| `essLeaveRequests` | ESS | ~1845 |
| `essLeaveBalances` | ESS | ~1850 |
| `essDocuments` | ESS | ~1860 |
| `essAssets` | ESS | ~1869 |
| `essCourses` | ESS | ~1877 |
| `essReviews` | ESS | ~1885 |
| `essPayslips` | ESS | ~1892 |
| `essRequests` | ESS | ~1901 |
| `essNotifications` | ESS | ~1910 |
| `mockExpenseClaims` | Travel | ~2190 |
| `mockExpenseCategories` | Travel | ~2195 |
| `mockApprovals` | Travel | ~2200 |
| `mockCorporateTrips` | Travel | ~2205 |
| `mockReimbursements` | Travel | ~2210 |
| `mockTravelPolicies` | Travel | ~2215 |
| `mockTravelRequests` | Travel | ~2220 |
| `mockPolicies` | Compliance | ~2530 |
| `mockPolicyCategories` | Compliance | ~2535 |
| `mockAcknowledgements` | Compliance | ~2561 |
| `mockAudits` | Compliance | ~2670 |
| `mockRequirements` | Compliance | ~2700 |
| `mockViolations` | Compliance | ~2730 |
| `mockCorrectiveActions` | Compliance | ~2760 |
| `mockTrainingCompliance` | Compliance | ~2810 |
| `mockSurveys` | Engagement | ~3130 |
| `mockSurveyTemplates` | Engagement | ~3135 |
| `mockPulseSurveys` | Engagement | ~3140 |
| `mockFeedbackCampaigns` | Engagement | ~3145 |
| `mockActionPlans` | Engagement | ~3150 |
| `mockEmployeeRecognitions` | Engagement | ~3155 |
| `mockRecognitionPrograms` | Engagement | ~3160 |
| `mockEngagementScores` | Engagement | ~3165 |
| `mockSentimentData` | Engagement | ~3170 |
| `mockAwards` | Rewards | ~4090 |
| `mockRewardsPrograms` | Rewards | ~4095 |
| `mockRewardPoints` | Rewards | ~4100 |
| `mockAchievements` | Rewards | ~4105 |
| `mockHeadcountPlans` | WF Planning | ~3680 |
| `mockHiringPlans` | WF Planning | ~3685 |
| `mockSkillGaps` | WF Planning | ~3690 |
| `mockSuccessionPlans` | WF Planning | ~3695 |
| `mockBudgetPlans` | WF Planning | ~3700 |
| `mockCapacityPlans` | WF Planning | ~3705 |
| `mockScenarioPlans` | WF Planning | ~3710 |
| `mockWorkforceForecasts` | WF Planning | ~3715 |

Plus hardcoded static report data in functions like `fetchTimeToHire`, `fetchMonthlyRecruitmentActivity`, `fetchComplianceTrends`, etc.

**Total mock arrays: ~70**

---

## Endpoint Map

| Frontend Page | API Function | HTTP Method | Backend Endpoint | Status |
|---|---|---|---|---|
| `workforce/*` (9 pages) | `fetchEmployees` / `fetchEmployee` / raw `fetch` | GET/POST/PUT/DELETE | `/api/zoiko-hr/workforce` | **REAL** |
| `departments/*` (2 pages) | `fetchDepartments` / `fetchDepartment` / CRUD | GET/POST/PUT/DELETE | `/api/zoiko-hr/departments` | **REAL** |
| `designations/*` (2 pages) | `fetchDesignations` / `fetchDesignation` / CRUD | GET/POST/PUT/DELETE | `/api/zoiko-hr/designations` | **REAL** |
| `documents/*` (2 pages) | `fetchDocuments` / `getDocument` / CRUD | GET/PUT/DELETE | `/api/zoiko-hr/documents` | **REAL** |
| `leave/*` (6 pages) | `fetchLeave*` / `createLeave*` / CRUD | GET/POST/PUT/DELETE | `/api/zoiko-hr/leave/*` | **REAL** |
| `attendance/*` (6 pages) | `fetchAttendance*` / `createAttendance` / CRUD | GET/POST/PUT/DELETE | `/api/zoiko-hr/attendance/*` | **REAL** |
| `performance/*` (4 pages) | `fetchPerformance*` / `createGoal` / CRUD | GET/POST/PUT/DELETE | `/api/zoiko-hr/performance/*` | **REAL** |
| `recruitment/*` (6 pages) | `fetchRecruitment*` / `createJobOpening` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `compliance/*` (10 pages) | `fetchPolicies` / `createAudit` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `assets/*` (7 pages) | `fetchAssets` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `travel/*` (9 pages) | `fetchTravel*` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `onboarding/*` (7 pages) | `fetchOnboarding*` / `updateNewJoinerStatus` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `ess/*` (11 pages) | `fetchESS*` / `markNotificationRead` | — (in-memory) | _no endpoint_ | **MOCK** |
| `engagement/*` (11 pages) | `fetchEngagement*` / `createSurvey` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `rewards/*` (5 pages) | `fetchRewards*` / `createAward` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `learning/*` (7 pages) | `fetchCourses` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `compensation/*` (10 pages) | `fetchCompensation*` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `workforce-planning/*` (10 pages) | `fetchWF*` / CRUD | — (in-memory) | _no endpoint_ | **MOCK** |
| `employee-lifecycle/*` (4 pages) | none | — | — | **STATIC** |
| `helpdesk/*` (6 pages) | none | — | — | **STATIC** |
| `payroll/` | `getPayrollOperations` | — | Prisma `payrollRun.findMany()` | **REAL DB** |
| `payroll-operations/` | `getPayrollOperations` | — | Prisma `payrollRun.findMany()` | **REAL DB** |

---

## Priority Recommendations

| Rank | Module | Pages | Reason |
|---|---|---|---|
| 1 | **Recruitment** | 6 | Core hiring workflow; mock data prevents real candidate tracking |
| 2 | **Assets** | 7 | Asset allocation/maintenance is operational; employees need real inventory |
| 3 | **Travel** | 9 | Expense claims and reimbursements require real financial data |
| 4 | **Documents** | 2 *(already real)* | ✅ Already migrated in Phase 1 |
| 5 | **Compensation** | 10 | Salary structures and history need real data for payroll |
| 6 | **Learning** | 7 | Course enrollment/certification records should be persistent |
| 7 | **Engagement** | 11 | Survey/feedback data is lost without a backend |
| 8 | **Compliance** | 10 | Policy acknowledgment tracking is audit-sensitive |
| 9 | **Onboarding** | 7 | Depends on employee/workforce being real; gated by Recruitment |
| 10 | **ESS** | 11 | Gated by all upstream modules (attendance, leave, performance already real; assets, learning, etc. still mock) |
| 11 | **Workforce Planning** | 10 | Forecasting/headcount planning is aspirational; depends on real employee data |
| 12 | **Rewards** | 5 | Points and recognition are nice-to-have |
| 13 | **Employee Lifecycle** | 4 | Only 4 pages, fully static — quick to implement |
| 14 | **Helpdesk** | 6 | Fully static, standalone — can be built independently |

### Integration Order (Recommended)

```
Phase 3a: Recruitment    (6 pages, high priority)
Phase 3b: Compliance     (10 pages, Prisma models already exist)
Phase 4:  Assets         (7 pages)
Phase 5:  Travel         (9 pages)
Phase 6:  Onboarding     (7 pages, gated by Recruitment)
Phase 7:  Learning       (7 pages)
Phase 8:  Compensation   (10 pages)
Phase 9:  Engagement     (11 pages)
Phase 10: ESS            (11 pages, gated by everything above)
Phase 11: Rewards        (5 pages)
Phase 12: Employee Lifecycle (4 pages, static → mock or real)
Phase 13: Helpdesk       (6 pages, static → mock or real)
```

**Note:** Workforce Planning (10 pages) can be deferred until the core HR modules (Workforce, Leave, Attendance, Performance) are fully stable.

---

## Module Categorization Summary

| Category | Count | Pages |
|---|---|---|
| **Backend Connected** | 33 | Workforce(9), Attendance(6), Leave(6), Performance(4), Departments(2), Designations(2), Documents(2), Payroll(2) |
| **Mock Data** | 93 | Recruitment(6), Compliance(10), Assets(7), Travel(9), Onboarding(7), ESS(11), Engagement(11), Rewards(5), Learning(7), Compensation(10), Workforce Planning(10) |
| **Static Data** | 10 | Employee Lifecycle(4), Helpdesk(6) |
| **Mixed** | 1 | HR Dashboard |
| **Bug (missing imports)** | 1 | Attendance Shifts |
| **Total** | **129** | |

---

## Architecture Summary

```
app/lib/api/client.ts          ← Shared HTTP client (apiFetch, buildUrl)
app/lib/api/types.ts           ← Shared response types
app/lib/api/index.ts           ← Barrel export
app/lib/api/workforce.api.ts   ← Real API: Employee, Dept, Designation, Document
app/lib/api/leave.api.ts       ← Real API: Leave CRUD + balances + calendar
app/lib/api/attendance.api.ts  ← Real API: Attendance CRUD + check-in/out + shifts
app/lib/api/performance.api.ts ← Real API: Performance CRUD + cycles + feedback
app/lib/workforce-api.ts       ← Barrel re-export (lines 1-4) + mock functions (lines 5+)
                                  Imports: real API module re-exports
                                  Exports: 130+ mock functions for Recruitment through WF Planning
```

**Import chain:** `page.tsx` → `@/lib/workforce-api` → `./api/*.api.ts` (real) OR `workforce-api.ts` internal mock functions

33 pages reach the real API layer. 93 pages stop at the mock layer.
