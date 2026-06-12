# API Folder Structure

## Directory Tree

```
app/lib/api/
├── client.ts                  # Shared HTTP client (apiFetch, buildUrl, ApiError)
├── types.ts                   # Shared response types (ApiResponse, PaginatedResponse, ApiErrorBody)
├── index.ts                   # Barrel export — re-exports shared utilities + types
│
├── workforce.api.ts           # Employees, departments, designations, documents
├── attendance.api.ts          # Attendance records, shifts, check-in/out, reports
├── leave.api.ts               # Leave types, requests, balances, calendar
├── performance.api.ts         # Review cycles, reviews, goals, feedback
│
├── recruitment.api.ts         # Job openings, candidates, interviews, offers
├── assets.api.ts              # Asset inventory, allocations, returns, maintenance
├── travel.api.ts              # Travel requests, expense claims, approvals, policies
├── compliance.api.ts          # Policies, audits, violations, corrective actions
├── onboarding.api.ts          # New joiners, document verification, asset allocation, probations
├── ess.api.ts                 # Employee self-service: profile, attendance, leave, payslips
├── engagement.api.ts          # Surveys, pulse surveys, feedback campaigns, sentiment
├── rewards.api.ts             # Awards, recognition programs, points, achievements
├── learning.api.ts            # Courses, learning paths, certifications, enrollments
├── compensation.api.ts        # Salary structures, pay grades, allowances, benefits, bonuses
├── workforce-planning.api.ts  # Headcount, forecasting, hiring plans, capacity, succession
├── employee-lifecycle.api.ts  # Employee lifecycle events, transfers, promotions, separations
└── helpdesk.api.ts            # HR helpdesk tickets, categories, knowledge base
```

---

## File Details

### 1. `client.ts` — Shared HTTP Client

| Field | Value |
|---|---|
| **Purpose** | Provides a thin wrapper around `fetch` with JSON defaults, timeout, abort-signal merging, and error handling. |
| **Exports** | `ApiError` (class), `ApiFetchOptions` (interface), `apiFetch<T>()` (generic async function), `buildUrl()` (query-string builder) |
| **Pattern** | All API modules import `{ apiFetch, buildUrl }` from here. Every HTTP request flows through `apiFetch`. Error responses are thrown as `ApiError` with status + parsed body. |
| **Base path** | None — this is a utility, not a domain module. |

**Signature:**

```ts
export async function apiFetch<T>(url: string, options?: ApiFetchOptions): Promise<T>
export function buildUrl(base: string, filters?: Record<string, string | number | boolean | undefined | null>): string
```

- Default timeout is 30s, configurable per call.
- `buildUrl` strips `undefined`, `null`, and empty-string values from the query string.
- `apiFetch` auto-sets `Content-Type: application/json` and returns `undefined as T` for 204 responses.

---

### 2. `types.ts` — Shared Response Types

| Field | Value |
|---|---|
| **Purpose** | Defines the standard API response envelopes used across all modules. |
| **Exports** | `ApiResponse<T>`, `PaginatedResponse<T>`, `ApiErrorBody` |

**Interfaces:**

```ts
export interface ApiResponse<T> {
  data: T;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T> {
  total: number;
  skip: number;
  take: number;
  totalPages?: number;
}

export interface ApiErrorBody {
  error: string;
  message?: string;
  statusCode?: number;
  details?: unknown;
}
```

- `ApiResponse<T>` is the standard single-item / success envelope.
- `PaginatedResponse<T>` extends it with pagination fields (`total`, `skip`, `take`).
- Module-specific list responses often define their own `*ListResponse` types that mirror `PaginatedResponse`.

---

### 3. `index.ts` — Barrel Export

| Field | Value |
|---|---|
| **Purpose** | Provides a clean public API surface. Pages never import from individual API modules directly — they always go through the barrel or through `workforce-api.ts`. |
| **Exports** | Re-exports `ApiError`, `apiFetch`, `buildUrl`, `ApiFetchOptions`, `ApiResponse`, `PaginatedResponse`, `ApiErrorBody` |

**Content:**

```ts
export { ApiError, apiFetch, buildUrl } from "./client";
export type { ApiFetchOptions } from "./client";
export type { ApiResponse, PaginatedResponse, ApiErrorBody } from "./types";
```

Domain-specific types and functions are consumed directly from their respective `*.api.ts` files, not re-exported here (to avoid circular dependencies and keep the barrel lean).

---

### 4. `workforce.api.ts` — Workforce Core

| Field | Value |
|---|---|
| **Purpose** | Employees, profiles, employment records, addresses, emergency contacts, documents, departments, designations. |
| **Base API path** | `/api/zoiko-hr/workforce`, `/api/zoiko-hr/departments`, `/api/zoiko-hr/designations`, `/api/zoiko-hr/documents` |
| **Exports** | Types: `Employee`, `EmployeeProfile`, `EmploymentRecord`, `EmployeeAddress`, `EmergencyContact`, `EmployeeDocument`, `Department`, `Designation`, `*ListResponse`, `*Filters`<br>Functions: `fetchEmployees`, `fetchEmployee`, `createEmployee`, `updateEmployee`, `deleteEmployee`, `fetchEmployeeProfile`, `upsertEmployeeProfile`, `fetchEmploymentRecords`, `createEmploymentRecord`, `fetchEmployeeDocuments`, `createEmployeeDocument`, `deleteEmployeeDocument`, `fetchEmergencyContacts`, `createEmergencyContact`, `deleteEmergencyContact`, `fetchEmployeeAddresses`, `createEmployeeAddress`, `deleteEmployeeAddress`, `fetchDepartments`, `fetchDepartment`, `createDepartment`, `updateDepartment`, `deleteDepartment`, `fetchDesignations`, `fetchDesignation`, `createDesignation`, `updateDesignation`, `deleteDesignation`, `fetchDocuments`, `getDocument`, `createDocument`, `updateDocument`, `deleteDocument` |
| **Pattern** | Imports `{ apiFetch, buildUrl }`, defines domain types, a `const BASE` path, then exported async functions. Functions use `buildUrl` for filtered list endpoints. Uses `{ data: T }` or `{ data: T[] }` response objects consistently. |
| **Dependencies** | `client.ts` only |

---

### 5. `attendance.api.ts` — Attendance & Shifts

| Field | Value |
|---|---|
| **Purpose** | Daily attendance records, shift management, check-in/out, attendance reports/dashboard. |
| **Base API path** | `/api/zoiko-hr/attendance`, `/api/zoiko-hr/shifts` |
| **Exports** | Types: `AttendanceRecord`, `ShiftRecord`, `AttendanceDashboardStats`, `AttendanceReport`, `*ListResponse`<br>Functions: `fetchAttendanceDashboard`, `fetchAttendances`, `fetchAttendance`, `createAttendance`, `updateAttendance`, `deleteAttendance`, `checkInEmployee`, `checkOutEmployee`, `fetchAttendanceReport`, `fetchShifts`, `fetchShift`, `createShift`, `updateShift`, `deleteShift`, `assignShiftToEmployee` |
| **Pattern** | Same as workforce.api.ts. Dashboard endpoints return `{ data: StatsType }`. Shift assignment uses a dedicated `/assign` sub-path. |
| **Dependencies** | `client.ts` only |

---

### 6. `leave.api.ts` — Leave Management

| Field | Value |
|---|---|
| **Purpose** | Leave types, leave requests, leave balances, leave calendar. |
| **Base API path** | `/api/zoiko-hr/leave` |
| **Exports** | Types: `LeaveType`, `LeaveRequest`, `LeaveApproval`, `LeaveBalance`, `CalendarEvent`, `*ListResponse`<br>Functions: `fetchLeaveTypes`, `createLeaveType`, `updateLeaveType`, `deleteLeaveType`, `fetchLeaveRequests`, `fetchLeaveRequest`, `createLeaveRequest`, `approveLeaveRequest`, `cancelLeaveRequest`, `fetchLeaveBalances`, `initializeLeaveBalance`, `fetchLeaveCalendar` |
| **Pattern** | Sub-paths per resource: `/types`, `/requests`, `/balances`, `/calendar`. Approval uses a `/requests/{id}/approve` POST. |
| **Dependencies** | `client.ts` only |

---

### 7. `performance.api.ts` — Performance Management

| Field | Value |
|---|---|
| **Purpose** | Review cycles, performance reviews, goals/goal updates, 360 feedback. |
| **Base API path** | `/api/zoiko-hr/performance` |
| **Exports** | Types: `ReviewCycleRecord`, `PerformanceReviewRecord`, `GoalRecord`, `GoalUpdateRecord`, `FeedbackRecord`, `PerformanceDashboardStats`, `*ListResponse`<br>Functions: `fetchPerformanceDashboard`, `fetchCycles`, `fetchCycle`, `createCycle`, `updateCycle`, `deleteCycle`, `fetchReviews`, `fetchReview`, `createReview`, `updateReview`, `deleteReview`, `fetchGoals`, `fetchGoal`, `createGoal`, `updateGoal`, `deleteGoal`, `createGoalUpdate`, `fetchFeedbacks`, `createFeedback`, `deleteFeedback` |
| **Pattern** | Sub-paths: `/cycles`, `/reviews`, `/goals`, `/feedback`. Goal updates at `/goals/{id}/updates`. Each sub-path has CRUD functions. Dashboard endpoint is `{BASE}/dashboard`. |
| **Dependencies** | `client.ts` only |

---

### 8. `recruitment.api.ts` — Recruitment (Planned)

| Field | Value |
|---|---|
| **Purpose** | Job openings, candidates, interviews, offers, recruitment funnel/reports. |
| **Base API path** | `/api/zoiko-hr/recruitment` |
| **Exports** | Types: `JobOpening`, `Candidate`, `Interview`, `Offer`, `RecruitmentDashboardStats`, `RecruitmentFunnelData`<br>Functions: `fetchRecruitmentDashboard`, `fetchJobOpenings`, `createJobOpening`, `updateJobOpening`, `closeJobOpening`, `fetchCandidates`, `updateCandidateStage`, `fetchInterviews`, `createInterview`, `updateInterviewStatus`, `fetchOffers`, `createOffer`, `updateOfferStatus`, `fetchRecruitmentFunnel`, `fetchTimeToHire`, `fetchOfferAcceptanceRate`, `fetchHiringByDepartment`, `fetchMonthlyRecruitmentActivity` |
| **Pattern** | Follows workforce.api.ts pattern. Dashboard at `{BASE}/dashboard`. Funnel/reports at `{BASE}/reports/*`. |
| **Dependencies** | `client.ts` only |

---

### 9. `assets.api.ts` — Asset Management (Planned)

| Field | Value |
|---|---|
| **Purpose** | Asset inventory, allocations, returns, maintenance tracking. |
| **Base API path** | `/api/zoiko-hr/assets` |
| **Exports** | Types: `AssetItem`, `AssetAllocationRecord`, `AssetReturnRecord`, `AssetMaintenanceRecord`, `AssetDashboardStats`, `AssetUtilizationData`, `DeptAllocationData`<br>Functions: `fetchAssetDashboard`, `fetchAssets`, `updateAssetItemStatus`, `fetchAllocationRecords`, `fetchReturnRecords`, `fetchMaintenanceRecords`, `updateMaintenanceStatus`, `fetchAssetUtilization`, `fetchDeptAllocation`, `fetchMaintenanceCost`, `fetchAssetLifecycle` |
| **Pattern** | Same CRUD pattern. Sub-paths: `/inventory`, `/allocations`, `/returns`, `/maintenance`. |
| **Dependencies** | `client.ts` only |

---

### 10. `travel.api.ts` — Travel & Expense (Planned)

| Field | Value |
|---|---|
| **Purpose** | Travel requests, expense claims, categories, approvals, reimbursements, corporate trips, policies. |
| **Base API path** | `/api/zoiko-hr/travel` |
| **Exports** | Types: `TravelRequest`, `ExpenseClaim`, `ExpenseCategory`, `TravelApproval`, `Reimbursement`, `CorporateTrip`, `TravelPolicy`, `TravelDashboardStats`<br>Functions: `fetchTravelDashboard`, `fetchTravelRequests`, `fetchExpenseClaims`, `fetchExpenseCategories`, `fetchTravelApprovals`, `fetchReimbursements`, `fetchCorporateTrips`, `fetchTravelPolicies`, `fetchTravelExpenseReports`, `fetchTravelDeptData` |
| **Pattern** | Dashboard at `{BASE}/dashboard`. Sub-paths per resource. |
| **Dependencies** | `client.ts` only |

---

### 11. `compliance.api.ts` — Compliance & Policy (Planned)

| Field | Value |
|---|---|
| **Purpose** | Policies, policy categories, compliance requirements, audits, violations, corrective actions, acknowledgements, training compliance. |
| **Base API path** | `/api/zoiko-hr/compliance` |
| **Exports** | Types: `Policy`, `PolicyCategory`, `ComplianceRequirement`, `Audit`, `Violation`, `CorrectiveAction`, `Acknowledgement`, `TrainingCompliance`, `ComplianceDashboardStats`<br>Functions: `fetchComplianceDashboard`, `fetchPolicies`, `createPolicy`, `updatePolicy`, `fetchPolicyCategories`, `createPolicyCategory`, `updatePolicyCategory`, `fetchComplianceRequirements`, `createComplianceRequirement`, `updateComplianceRequirement`, `fetchAudits`, `createAudit`, `updateAuditStatus`, `fetchViolations`, `updateViolationStatus`, `fetchCorrectiveActions`, `createCorrectiveAction`, `updateCorrectiveAction`, `fetchAcknowledgements`, `fetchTrainingCompliance`, `fetchComplianceTrends`, `fetchViolationByCategory`, `fetchAuditCompletionData`, `fetchDeptComplianceStats`, `fetchPolicyAdherenceTrends` |
| **Pattern** | Sub-paths: `/policies`, `/policy-categories`, `/requirements`, `/audits`, `/violations`, `/corrective-actions`, `/acknowledgements`, `/training`. Dashboard + trend endpoints. |
| **Dependencies** | `client.ts` only |

---

### 12. `onboarding.api.ts` — Employee Onboarding (Planned)

| Field | Value |
|---|---|
| **Purpose** | New joiners, document verification, asset allocation, welcome kits, probation tracking. |
| **Base API path** | `/api/zoiko-hr/onboarding` |
| **Exports** | Types: `NewJoiner`, `DocumentVerification`, `AssetAllocation`, `WelcomeKit`, `Probation`, `OnboardingDashboardStats`<br>Functions: `fetchOnboardingDashboard`, `fetchNewJoiners`, `updateNewJoinerStatus`, `fetchDocumentVerifications`, `updateDocumentStatus`, `fetchAssetAllocations`, `updateAssetStatus`, `fetchWelcomeKits`, `updateWelcomeKitStatus`, `fetchProbations`, `updateProbationStatus`, `fetchOnboardingCompletionRate`, `fetchDeptOnboarding`, `fetchProbationSummary`, `fetchAssetSummary`, `fetchMonthlyJoiningTrends` |
| **Pattern** | Dashboard at `{BASE}/dashboard`. Sub-paths for each onboarding stage. |
| **Dependencies** | `client.ts` only |

---

### 13. `ess.api.ts` — Employee Self Service (Planned)

| Field | Value |
|---|---|
| **Purpose** | Employee-facing views of their own data: profile, attendance, leave, documents, assets, courses, payslips, notifications. |
| **Base API path** | `/api/zoiko-hr/ess` |
| **Exports** | Types: `ESSDashboardStats`, `ESSProfile`, `EmployeeAttendance`, `EmployeeLeaveReq`, `ESSLeaveBalance`, `ESSDocument`, `EmployeeAsset`, `EmployeeCourse`, `EmployeeReview`, `Payslip`, `EmployeeRequest`, `Notification`<br>Functions: `fetchESSDashboard`, `fetchESSProfile`, `fetchESSAttendance`, `fetchESSLeaveRequests`, `fetchESSLeaveBalances`, `fetchESSDocuments`, `fetchESSAssets`, `fetchESSCourses`, `fetchESSReviews`, `fetchESSPayslips`, `fetchESSRequests`, `fetchESSNotifications`, `markNotificationRead` |
| **Pattern** | No pagination — ESS data is scoped to the current employee. Functions return `{ data: T }` (single item or array). |
| **Dependencies** | `client.ts` only |

---

### 14. `engagement.api.ts` — Employee Engagement (Planned)

| Field | Value |
|---|---|
| **Purpose** | Surveys, pulse surveys, feedback campaigns, recognition, engagement scores, sentiment analysis, action plans. |
| **Base API path** | `/api/zoiko-hr/engagement` |
| **Exports** | Types: `Survey`, `SurveyTemplate`, `PulseSurvey`, `FeedbackCampaign`, `RecognitionProgram`, `EmployeeRecognition`, `EngagementScore`, `SentimentAnalysis`, `ActionPlan`, `EngagementDashboardStats`<br>Functions: `fetchEngagementDashboard`, `fetchSurveys`, `createSurvey`, `updateSurvey`, `fetchSurveyTemplates`, `fetchPulseSurveys`, `createPulseSurvey`, `updatePulseSurveyStatus`, `fetchFeedbackCampaigns`, `createFeedbackCampaign`, `updateFeedbackCampaignStatus`, `fetchRecognitionPrograms`, `fetchEmployeeRecognitions`, `createEmployeeRecognition`, `fetchEngagementScores`, `fetchSentimentAnalysis`, `fetchActionPlans`, `createActionPlan`, `updateActionPlan`, `fetchSurveyReports`, `fetchEngagementReports`, `fetchRecognitionReports`, `fetchParticipationReports` |
| **Pattern** | Dashboard at `{BASE}/dashboard`. Sub-paths for surveys, pulse, campaigns, recognition, sentiment. |
| **Dependencies** | `client.ts` only |

---

### 15. `rewards.api.ts` — Rewards & Recognition (Planned)

| Field | Value |
|---|---|
| **Purpose** | Employee awards, recognition programs, reward points/balances, achievements/badges. |
| **Base API path** | `/api/zoiko-hr/rewards` |
| **Exports** | Types: `RewardsDashboardStats`, `EmployeeAward`, `RewardsRecognitionProgram`, `RewardPointBalance`, `RewardPointTransaction`, `AchievementRecord`<br>Functions: `fetchRewardsDashboard`, `fetchAwards`, `createAward`, `updateAward`, `deleteAward`, `fetchRewardsRecognitionPrograms`, `createRewardsRecognitionProgram`, `updateRewardsRecognitionProgram`, `deleteRewardsRecognitionProgram`, `fetchRewardPointsBalances`, `fetchRewardPointTransactions`, `awardPoints`, `fetchAchievements`, `createAchievement`, `updateAchievement`, `deleteAchievement` |
| **Pattern** | Dashboard at `{BASE}/dashboard`. Sub-paths: `/awards`, `/programs`, `/points`, `/achievements`. |
| **Dependencies** | `client.ts` only |

---

### 16. `learning.api.ts` — Learning & Development (Planned)

| Field | Value |
|---|---|
| **Purpose** | Courses, learning paths, certifications, assessments, enrollments, LMS reports. |
| **Base API path** | `/api/zoiko-hr/learning` |
| **Exports** | Types: `Course`, `LearningPath`, `Certification`, `Assessment`, `Enrollment`, `LMSDashboardStats`, `LearningProgressData`, `CertificationReportData`, `CourseCompletionData`, `DeptLearningData`, `SkillTrendData`<br>Functions: `fetchLMSDashboard`, `fetchCourses`, `fetchLearningPaths`, `fetchCertifications`, `fetchAssessments`, `fetchEnrollments`, `fetchLearningProgress`, `fetchCertificationReports`, `fetchCourseCompletionData`, `fetchDeptLearningStats`, `fetchSkillTrends` |
| **Pattern** | Dashboard at `{BASE}/dashboard`. Sub-paths: `/courses`, `/paths`, `/certifications`, `/assessments`, `/enrollments`. |
| **Dependencies** | `client.ts` only |

---

### 17. `compensation.api.ts` — Compensation & Benefits (Planned)

| Field | Value |
|---|---|
| **Purpose** | Salary structures, pay grades, allowances, deductions, benefit plans, bonuses, compensation reviews, salary revisions. |
| **Base API path** | `/api/zoiko-hr/compensation` |
| **Exports** | Types: `SalaryStructure`, `PayGrade`, `Allowance`, `Deduction`, `BenefitPlan`, `Bonus`, `CompensationReview`, `SalaryRevision`, `CompensationDashboardStats`, `SalaryDistributionData`, `BenefitEnrollmentData`, `DeptCompCostData`, `ReviewOutcomeData`<br>Functions: `fetchCompensationDashboard`, `fetchSalaryStructures`, `fetchPayGrades`, `fetchAllowances`, `fetchDeductions`, `fetchBenefits`, `fetchBonuses`, `fetchCompReviews`, `fetchSalaryRevisions`, `fetchSalaryDistribution`, `fetchBenefitEnrollment`, `fetchDeptCompCost`, `fetchReviewOutcomes` |
| **Pattern** | Dashboard at `{BASE}/dashboard`. Each resource gets its own sub-path. |
| **Dependencies** | `client.ts` only |

---

### 18. `workforce-planning.api.ts` — Workforce Planning (Planned)

| Field | Value |
|---|---|
| **Purpose** | Headcount planning, workforce forecasting, hiring plans, capacity planning, skill gap analysis, succession planning, budget planning, scenario planning. |
| **Base API path** | `/api/zoiko-hr/workforce-planning` |
| **Exports** | Types: `WFDashboardStats`, `WFHeadcountPlan`, `WFWorkforceForecast`, `WFHiringPlan`, `WFCapacityPlan`, `WFSkillGap`, `WFSuccessionPlan`, `WFBudgetPlan`, `WFScenarioPlan`, `*Report`<br>Functions: `fetchWFDashboard`, `fetchWFHeadcountPlans`, `createWFHeadcountPlan`, `updateWFHeadcountPlan`, `fetchWFWorkforceForecasts`, `createWFWorkforceForecast`, `fetchWFHiringPlans`, `createWFHiringPlan`, `updateWFHiringPlan`, `fetchWFCapacityPlans`, `createWFCapacityPlan`, `fetchWFSkillGaps`, `createWFSkillGap`, `fetchWFSuccessionPlans`, `createWFSuccessionPlan`, `updateWFSuccessionPlan`, `fetchWFBudgetPlans`, `createWFBudgetPlan`, `updateWFBudgetPlan`, `fetchWFScenarioPlans`, `createWFScenarioPlan`, `fetchWFHeadcountReports`, `fetchWFForecastReports`, `fetchWFHiringReports`, `fetchWFSkillGapReports`, `fetchWFSuccessionReports`, `fetchWFBudgetReports` |
| **Pattern** | Heavier on planning-specific operations. Sub-paths per planning domain. |
| **Dependencies** | `client.ts` only |

---

### 19. `employee-lifecycle.api.ts` — Employee Lifecycle (Planned)

| Field | Value |
|---|---|
| **Purpose** | Lifecycle events: transfers, promotions, demotions, role changes, separations (resignation, termination, retirement), rehires. |
| **Base API path** | `/api/zoiko-hr/employee-lifecycle` |
| **Exports** | Types: `LifecycleEvent`, `TransferRecord`, `PromotionRecord`, `SeparationRecord`, `LifecycleDashboardStats`<br>Functions: `fetchLifecycleDashboard`, `fetchLifecycleEvents`, `createTransfer`, `createPromotion`, `createSeparation`, `approveSeparation`, `fetchSeparationList` |
| **Pattern** | Dashboard + CRUD per event type. |
| **Dependencies** | `client.ts` only. May reference types from `workforce.api.ts` (e.g. `Employee`). |

---

### 20. `helpdesk.api.ts` — HR Helpdesk (Planned)

| Field | Value |
|---|---|
| **Purpose** | HR ticket management: ticket creation, assignment, categories, knowledge base articles, resolution tracking. |
| **Base API path** | `/api/zoiko-hr/helpdesk` |
| **Exports** | Types: `HelpdeskTicket`, `TicketCategory`, `KnowledgeBaseArticle`, `HelpdeskDashboardStats`<br>Functions: `fetchHelpdeskDashboard`, `fetchTickets`, `createTicket`, `updateTicketStatus`, `assignTicket`, `fetchTicketCategories`, `fetchKnowledgeBaseArticles` |
| **Pattern** | Dashboard + ticket lifecycle. |
| **Dependencies** | `client.ts` only |

---

## Import Chain Architecture

```
Page (.tsx)
  │
  ▼  import { fetchEmployees } from "@/lib/workforce-api"
  │   or relative: from "../../lib/workforce-api"
  │
  ▼
app/lib/workforce-api.ts          ← BACKWARD-COMPATIBILITY BARREL
  │  ├── export * from "./api/workforce.api"       ← real API → apiFetch → fetch
  │  ├── export * from "./api/leave.api"
  │  ├── export * from "./api/attendance.api"
  │  ├── export * from "./api/performance.api"
  │  └── inline mock implementations               ← fallback for modules not yet migrated
  │
  ▼
app/lib/api/*.api.ts              ← REAL API MODULE
  │  ├── import { apiFetch, buildUrl } from "./client"
  │  └── define const BASE, domain types, async functions
  │
  ▼
app/lib/api/client.ts             ← SHARED HTTP CLIENT
     └── uses native fetch(), AbortController, JSON parsing
```

### Data Flow

1. **Page** imports a function (e.g. `fetchEmployees`) from `workforce-api.ts`.
2. **workforce-api.ts** re-exports from `./api/workforce.api.ts` (if a real API module exists).
3. **workforce.api.ts** calls `apiFetch(url)` with the appropriate path.
4. **client.ts** calls `fetch()` with JSON headers, timeout/abort logic, and throws `ApiError` on non-ok responses.
5. For modules without dedicated `.api.ts` files yet, `workforce-api.ts` provides **inline mock implementations** that simulate API responses in-memory.

---

## Backward Compatibility Pattern (`workforce-api.ts`)

`app/lib/workforce-api.ts` serves as a **superset barrel** that:

1. **Re-exports** all functions and types from the real API modules:
   ```ts
   export * from "./api/workforce.api";
   export * from "./api/leave.api";
   export * from "./api/attendance.api";
   export * from "./api/performance.api";
   ```

2. **Defines inline** all types, mock data, and async functions for modules that have not yet been extracted into their own `*.api.ts` files (currently: recruitment, onboarding, assets, travel, compliance, ess, engagement, rewards, learning, compensation, workforce-planning).

3. **Transition plan**: When a new `*.api.ts` file is created:
   - Move the types and functions from `workforce-api.ts` into the new file.
   - Add an `export * from "./api/new-module.api"` line to the re-export section at the top of `workforce-api.ts`.
   - Remove the inline definitions from `workforce-api.ts`.
   - No page imports need to change — they all go through `workforce-api.ts`.

---

## Barrel Export Pattern (`index.ts`)

- Only re-exports shared utilities from `client.ts` and `types.ts`.
- Does NOT re-export domain-specific types or functions.
- Domain modules are consumed directly via `workforce-api.ts` (or eventually via direct `@/lib/api/module.api` imports).
- Keeps the barrel lean and avoids circular dependency issues.

---

## Client Pattern (`client.ts`)

- **Singleton instance**: No class instantiation — functions are standalone.
- **Timeout**: Default 30s via `AbortController`.
- **Signal merging**: `apiFetch` supports passing an external `AbortSignal` which is combined with the timeout signal.
- **Error handling**: Non-ok responses throw `ApiError` with `status`, `message`, and parsed `body`.
- **No-op responses**: HTTP 204 returns `undefined` cast to `T`.
- **No auth/header injection**: Headers are minimal (just `Content-Type`). Auth is expected to be handled externally (e.g., via middleware, cookies, or interceptor layer above this).
