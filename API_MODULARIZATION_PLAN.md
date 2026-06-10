# API Modularization Plan

**Source file:** `app/lib/workforce-api.ts` (5858 lines)  
**Target directory:** `app/lib/api/`  
**Status:** Plan only — no code modifications  

---

## 1. Current State Analysis

`app/lib/workforce-api.ts` is a monolithic file containing **two completely different layers**:

| Section | Lines | Behavior |
|---------|-------|----------|
| **Real API (fetch-based)** | 1–1524 | Calls `/api/zoiko-hr/*` endpoints via native `fetch()` |
| **Mock-only** | 1526–5858 | Operates on 63 in-memory mock arrays |

The file exports **~185 functions** across **18 logical modules**, with 7 duplicated `handle*Response<T>()` helpers and 8 base URL constants.

---

## 2. Target Structure

```
app/lib/
├── api/
│   ├── client.ts                  # Shared HTTP client, response handler, types
│   ├── workforce.api.ts           # Employees, Profiles, Addresses, etc.
│   ├── leave.api.ts               # Leave Types, Requests, Balances, Calendar
│   ├── attendance.api.ts          # Attendance records, Check-in/out, Reports
│   ├── performance.api.ts         # Reviews, Cycles, Goals, Feedback
│   ├── recruitment.api.ts         # Job Openings, Candidates, Interviews, Offers
│   ├── assets.api.ts              # Asset inventory, Allocation, Maintenance
│   ├── travel.api.ts              # Travel Requests, Expense Claims, Reimbursements
│   ├── rewards.api.ts             # Awards, Programs, Points, Achievements
│   ├── compensation.api.ts        # Salary Structures, Pay Grades, Benefits
│   ├── onboarding.api.ts          # New Joiners, Document Verification, Probation
│   ├── lifecycle.api.ts           # Employee Lifecycle (hardcoded pages → API)
│   ├── ess.api.ts                 # Employee Self Service
│   ├── engagement.api.ts          # Surveys, Pulse Surveys, Sentiment, etc.
│   ├── learning.api.ts            # Courses, Learning Paths, Certifications
│   ├── compliance.api.ts          # Policies, Violations, Audits, etc.
│   └── helpdesk.api.ts            # Tickets, Cases, Knowledge Base, SLA
└── workforce-api.ts               # Deprecated — re-export module for backward compat
```

**Note:** Departments, Designations, Shifts, and Documents are folded into `workforce.api.ts` (they are sub-resources of workforce) or into their respective modules.

---

## 3. Shared Foundation: `client.ts`

**Purpose:** Eliminate the 7 duplicated `handle*Response` functions, provide a single HTTP client with consistent error handling.

### To extract from `workforce-api.ts`

| Item | Type | Source (line) |
|------|------|---------------|
| `handleResponse<T>()` | Generic response handler | Line 207 |
| `handleDepartmentsResponse<T>()` | Identical to `handleResponse` | Line 472 |
| `handleDesignationsResponse<T>()` | Identical to `handleResponse` | Line 584 |
| `handleLeaveResponse<T>()` | Identical to `handleResponse` | Line 690 |
| `handleAttendanceResponse<T>()` | Identical to `handleResponse` | Line 935 |
| `handlePerformanceResponse<T>()` | Identical to `handleResponse` | Line 1220 |
| `handleDocumentResponse<T>()` | Identical to `handleResponse` | Line 1451 |

**All 7 handlers are structurally identical.** Consolidate into one.

### Proposed `client.ts` structure

```typescript
// Shared HTTP client for all API modules

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
    public body?: unknown,
  ) {
    super(message);
  }
}

export async function apiFetch<T>(
  url: string,
  options?: RequestInit,
): Promise<T> {
  const res = await fetch(url, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new ApiError(
      res.status,
      (body as { error?: string }).error ?? `Request failed with status ${res.status}`,
      body,
    );
  }
  return res.json() as Promise<T>;
}

// URL builder helper
export function buildUrl(
  base: string,
  filters?: Record<string, string | number | undefined | null>,
): string {
  const params = new URLSearchParams();
  if (filters) {
    for (const [key, value] of Object.entries(filters)) {
      if (value !== undefined && value !== null) {
        params.set(key, String(value));
      }
    }
  }
  const qs = params.toString();
  return qs ? `${base}?${qs}` : base;
}
```

### Types to include in `client.ts`

Types shared across multiple modules (determine exact list during extraction):

| Type | Source (line) |
|------|---------------|
| `EmployeeStatus` | Line 1 |
| `EmploymentType` | Line 8 |
| `MaritalStatus` | Line 15 |
| `AddressType` | Line 22 |
| `Relationship` | Line 24 |
| `DocumentType` | Line 32 |
| `DocumentStatus` | Line 44 |

**Dependencies:** None (pure TypeScript)  
**Risk:** Low  
**Effort:** Small (1 file, ~40 lines)

---

## 4. Module-by-Module Migration Plan

### 4.1 `workforce.api.ts` — Workforce / Employees

**Source lines:** 1–435 (real fetch) + 437–538 (Departments) + 540–659 (Designations) + 1447–1524 (Documents standalone)  
**Status:** Real API — `fetch()` based  
**Functions to move:** 32

| Function | HTTP Method | URL Pattern |
|----------|-------------|-------------|
| `fetchEmployees` | GET | `/api/zoiko-hr/workforce` |
| `fetchEmployee` | GET | `/api/zoiko-hr/workforce/:id` |
| `createEmployee` | POST | `/api/zoiko-hr/workforce` |
| `updateEmployee` | PUT | `/api/zoiko-hr/workforce/:id` |
| `deleteEmployee` | DELETE | `/api/zoiko-hr/workforce/:id` |
| `fetchEmployeeProfile` | GET | `/api/zoiko-hr/workforce/:id/profile` |
| `upsertEmployeeProfile` | PUT | `/api/zoiko-hr/workforce/:id/profile` |
| `fetchEmploymentRecords` | GET | `/api/zoiko-hr/workforce/:id/employment-records` |
| `createEmploymentRecord` | POST | `/api/zoiko-hr/workforce/:id/employment-records` |
| `fetchEmployeeDocuments` | GET | `/api/zoiko-hr/workforce/:id/documents` |
| `createEmployeeDocument` | POST | `/api/zoiko-hr/workforce/:id/documents` |
| `deleteEmployeeDocument` | DELETE | `/api/zoiko-hr/workforce/:id/documents/:docId` |
| `fetchEmergencyContacts` | GET | `/api/zoiko-hr/workforce/:id/emergency-contacts` |
| `createEmergencyContact` | POST | `/api/zoiko-hr/workforce/:id/emergency-contacts` |
| `deleteEmergencyContact` | DELETE | `/api/zoiko-hr/workforce/:id/emergency-contacts/:contactId` |
| `fetchEmployeeAddresses` | GET | `/api/zoiko-hr/workforce/:id/addresses` |
| `createEmployeeAddress` | POST | `/api/zoiko-hr/workforce/:id/addresses` |
| `deleteEmployeeAddress` | DELETE | `/api/zoiko-hr/workforce/:id/addresses/:addrId` |
| `fetchDepartments` | GET | `/api/zoiko-hr/departments` |
| `fetchDepartment` | GET | `/api/zoiko-hr/departments/:id` |
| `createDepartment` | POST | `/api/zoiko-hr/departments` |
| `updateDepartment` | PUT | `/api/zoiko-hr/departments/:id` |
| `deleteDepartment` | DELETE | `/api/zoiko-hr/departments/:id` |
| `fetchDesignations` | GET | `/api/zoiko-hr/designations` |
| `fetchDesignation` | GET | `/api/zoiko-hr/designations/:id` |
| `createDesignation` | POST | `/api/zoiko-hr/designations` |
| `updateDesignation` | PUT | `/api/zoiko-hr/designations/:id` |
| `deleteDesignation` | DELETE | `/api/zoiko-hr/designations/:id` |
| `fetchDocuments` | GET | `/api/zoiko-hr/documents` |
| `getDocument` | GET | `/api/zoiko-hr/documents/:id` |
| `createDocument` | POST | `/api/zoiko-hr/documents` |
| `updateDocument` | PUT | `/api/zoiko-hr/documents/:id` |
| `deleteDocument` | DELETE | `/api/zoiko-hr/documents/:id` |

**Types to include:** `Employee`, `EmployeeProfile`, `EmployeeListResponse`, `EmployeeFilters`, `EmploymentRecord`, `EmployeeAddress`, `EmergencyContact`, `EmployeeDocument`, `DocumentListResponse`, `DocumentFilters`, `Department`, `DepartmentListResponse`, `DepartmentFilters`, `Designation`, `DesignationListResponse`, `DesignationFilters`, `DesignationLevel`, `DesignationCategory`, `DesignationStatus`

**Dependencies:** `client.ts` (apiFetch, buildUrl)  
**Import changes required in pages:**
- `../../lib/workforce-api` → `../../lib/api/workforce.api`

**Risk:** Low — pure copy + search/replace import paths  
**Effort:** Medium (~40 functions, 3 existing page groups to update imports)

---

### 4.2 `leave.api.ts` — Leave Management

**Source lines:** 661–862 (real fetch)  
**Status:** Real API — `fetch()` based  
**Functions to move:** 12

| Function | HTTP Method | URL Pattern |
|----------|-------------|-------------|
| `fetchLeaveTypes` | GET | `/api/zoiko-hr/leave/types` |
| `createLeaveType` | POST | `/api/zoiko-hr/leave/types` |
| `updateLeaveType` | PUT | `/api/zoiko-hr/leave/types/:id` |
| `deleteLeaveType` | DELETE | `/api/zoiko-hr/leave/types/:id` |
| `fetchLeaveRequests` | GET | `/api/zoiko-hr/leave/requests` |
| `fetchLeaveRequest` | GET | `/api/zoiko-hr/leave/requests/:id` |
| `createLeaveRequest` | POST | `/api/zoiko-hr/leave/requests` |
| `approveLeaveRequest` | POST | `/api/zoiko-hr/leave/requests/:id/approve` |
| `cancelLeaveRequest` | DELETE | `/api/zoiko-hr/leave/requests/:id` |
| `fetchLeaveBalances` | GET | `/api/zoiko-hr/leave/balances` |
| `initializeLeaveBalance` | POST | `/api/zoiko-hr/leave/balances` |
| `fetchLeaveCalendar` | GET | `/api/zoiko-hr/leave/calendar` |

**Types to include:** `LeaveType`, `LeaveTypeListResponse`, `LeaveRequest`, `LeaveRequestListResponse`, `LeaveRequestStatus`, `LeaveApproval`, `LeaveBalance`, `CalendarEvent`

**Dependencies:** `client.ts`  
**Import changes:** `../../lib/workforce-api` → `../../lib/api/leave.api`  
**Risk:** Low  
**Effort:** Small

---

### 4.3 `attendance.api.ts` — Attendance & Shifts

**Source lines:** 864–1098 (real fetch)  
**Status:** Real API — `fetch()` based  
**Functions to move:** 14

| Function | HTTP Method | URL Pattern |
|----------|-------------|-------------|
| `fetchAttendanceDashboard` | GET | `/api/zoiko-hr/attendance/dashboard` |
| `fetchAttendances` | GET | `/api/zoiko-hr/attendance` |
| `fetchAttendance` | GET | `/api/zoiko-hr/attendance/:id` |
| `createAttendance` | POST | `/api/zoiko-hr/attendance` |
| `updateAttendance` | PUT | `/api/zoiko-hr/attendance/:id` |
| `deleteAttendance` | DELETE | `/api/zoiko-hr/attendance/:id` |
| `checkInEmployee` | POST | `/api/zoiko-hr/attendance/check-in` |
| `checkOutEmployee` | POST | `/api/zoiko-hr/attendance/check-out` |
| `fetchAttendanceReport` | GET | `/api/zoiko-hr/attendance/reports` |
| `fetchShifts` | GET | `/api/zoiko-hr/shifts` |
| `fetchShift` | GET | `/api/zoiko-hr/shifts/:id` |
| `createShift` | POST | `/api/zoiko-hr/shifts` |
| `updateShift` | PUT | `/api/zoiko-hr/shifts/:id` |
| `deleteShift` | DELETE | `/api/zoiko-hr/shifts/:id` |
| `assignShiftToEmployee` | POST | `/api/zoiko-hr/shifts/assign` |

**Types to include:** `AttendanceRecord`, `AttendanceListResponse`, `AttendanceDashboardStats`, `AttendanceReport`, `ShiftRecord`, `ShiftListResponse`

**Dependencies:** `client.ts`  
**Import changes:** `../../lib/workforce-api` → `../../lib/api/attendance.api`  
**Risk:** Low  
**Effort:** Small

---

### 4.4 `performance.api.ts` — Performance Management

**Source lines:** 1100–1445 (real fetch)  
**Status:** Real API — `fetch()` based  
**Functions to move:** 20

| Function | HTTP Method | URL Pattern |
|----------|-------------|-------------|
| `fetchPerformanceDashboard` | GET | `/api/zoiko-hr/performance/dashboard` |
| `fetchCycles` | GET | `/api/zoiko-hr/performance/cycles` |
| `fetchCycle` | GET | `/api/zoiko-hr/performance/cycles/:id` |
| `createCycle` | POST | `/api/zoiko-hr/performance/cycles` |
| `updateCycle` | PUT | `/api/zoiko-hr/performance/cycles/:id` |
| `deleteCycle` | DELETE | `/api/zoiko-hr/performance/cycles/:id` |
| `fetchReviews` | GET | `/api/zoiko-hr/performance/reviews` |
| `fetchReview` | GET | `/api/zoiko-hr/performance/reviews/:id` |
| `createReview` | POST | `/api/zoiko-hr/performance/reviews` |
| `updateReview` | PUT | `/api/zoiko-hr/performance/reviews/:id` |
| `deleteReview` | DELETE | `/api/zoiko-hr/performance/reviews/:id` |
| `fetchGoals` | GET | `/api/zoiko-hr/performance/goals` |
| `fetchGoal` | GET | `/api/zoiko-hr/performance/goals/:id` |
| `createGoal` | POST | `/api/zoiko-hr/performance/goals` |
| `updateGoal` | PUT | `/api/zoiko-hr/performance/goals/:id` |
| `deleteGoal` | DELETE | `/api/zoiko-hr/performance/goals/:id` |
| `createGoalUpdate` | POST | `/api/zoiko-hr/performance/goals/:id/updates` |
| `fetchFeedbacks` | GET | `/api/zoiko-hr/performance/feedback` |
| `createFeedback` | POST | `/api/zoiko-hr/performance/feedback` |
| `deleteFeedback` | DELETE | `/api/zoiko-hr/performance/feedback/:id` |

**Types to include:** `ReviewCycleRecord`, `ReviewCycleListResponse`, `PerformanceReviewRecord`, `ReviewListResponse`, `GoalRecord`, `GoalListResponse`, `GoalUpdateRecord`, `FeedbackRecord`, `FeedbackListResponse`, `PerformanceDashboardStats`

**Dependencies:** `client.ts`  
**Import changes:** `../../lib/workforce-api` → `../../lib/api/performance.api`  
**Risk:** Low  
**Effort:** Small

---

### 4.5 `recruitment.api.ts` — Recruitment Management

**Source lines:** 1526–1889 (mock only)  
**Status:** Mock data — needs API endpoint implementation  
**Functions to move:** 18

| Function | Current Behavior | Future Behavior |
|----------|-----------------|-----------------|
| `fetchRecruitmentDashboard` | `mockJobs`/`mockCandidates`/`mockInterviews`/`mockOffers` aggregation | GET `/api/zoiko-hr/recruitment/dashboard` |
| `fetchJobOpenings` | Filters `mockJobs` | GET `/api/zoiko-hr/recruitment/job-openings` |
| `createJobOpening` | `mockJobs.unshift(...)` | POST `/api/zoiko-hr/recruitment/job-openings` |
| `updateJobOpening` | Mutates `mockJobs[idx]` | PUT `/api/zoiko-hr/recruitment/job-openings/:id` |
| `closeJobOpening` | Sets `mockJobs[idx].status = "CLOSED"` | POST `/api/zoiko-hr/recruitment/job-openings/:id/close` |
| `fetchCandidates` | Filters `mockCandidates` | GET `/api/zoiko-hr/recruitment/candidates` |
| `updateCandidateStage` | Mutates `mockCandidates[idx].currentStage` | PATCH `/api/zoiko-hr/recruitment/candidates/:id/stage` |
| `fetchInterviews` | Filters `mockInterviews` | GET `/api/zoiko-hr/recruitment/interviews` |
| `createInterview` | `mockInterviews.unshift(...)` | POST `/api/zoiko-hr/recruitment/interviews` |
| `updateInterviewStatus` | Mutates `mockInterviews[idx]` | PATCH `/api/zoiko-hr/recruitment/interviews/:id/status` |
| `fetchOffers` | Filters `mockOffers` | GET `/api/zoiko-hr/recruitment/offers` |
| `createOffer` | `mockOffers.unshift(...)` | POST `/api/zoiko-hr/recruitment/offers` |
| `updateOfferStatus` | Mutates `mockOffers[idx].status` | PATCH `/api/zoiko-hr/recruitment/offers/:id/status` |
| `fetchRecruitmentFunnel` | Derived from `mockCandidates` | GET `/api/zoiko-hr/recruitment/reports/funnel` |
| `fetchTimeToHire` | Hardcoded monthly data | GET `/api/zoiko-hr/recruitment/reports/time-to-hire` |
| `fetchOfferAcceptanceRate` | Derived from `mockOffers` | GET `/api/zoiko-hr/recruitment/reports/offer-acceptance-rate` |
| `fetchHiringByDepartment` | Derived from `mockOffers` | GET `/api/zoiko-hr/recruitment/reports/hiring-by-department` |
| `fetchMonthlyRecruitmentActivity` | Hardcoded monthly data | GET `/api/zoiko-hr/recruitment/reports/monthly-activity` |

**Types to include:** `JobOpening`, `Candidate`, `Interview`, `Offer`, `RecruitmentDashboardStats`, `RecruitmentFunnelData`, `TimeToHireData`, `DepartmentHireData`, `MonthlyActivityData`, `JobStatus`, `CandidateStage`, `InterviewStatus`, `OfferStatus`

**Mock data to discard:** `mockJobs`, `mockCandidates`, `mockInterviews`, `mockOffers` (lines 1629–1671)  
**Dependencies:** `client.ts`  
**Import changes:** `../../lib/workforce-api` → `../../lib/api/recruitment.api`  
**Risk:** High — requires new API routes + backend service layer  
**Effort:** Large (~18 functions + 6-10 API routes + service + repository)

---

### 4.6 `onboarding.api.ts` — Employee Onboarding

**Source lines:** 1891–2241 (mock only)  
**Status:** Mock data  
**Functions to move:** 18

| Function | Mock Source | Future Endpoint |
|----------|-------------|-----------------|
| `fetchOnboardingDashboard` | All mock arrays | GET `/api/zoiko-hr/onboarding/dashboard` |
| `fetchNewJoiners` | `mockNewJoiners` | GET `/api/zoiko-hr/onboarding/new-joiners` |
| `updateNewJoinerStatus` | Mutates `mockNewJoiners` | PATCH `/api/zoiko-hr/onboarding/new-joiners/:id/status` |
| `fetchDocumentVerifications` | `mockDocumentVerifications` | GET `/api/zoiko-hr/onboarding/document-verifications` |
| `updateDocumentStatus` | Mutates `mockDocumentVerifications` | PATCH `/api/zoiko-hr/onboarding/document-verifications/:id/status` |
| `fetchAssetAllocations` | `mockAssetAllocations` | GET `/api/zoiko-hr/onboarding/asset-allocations` |
| `updateAssetStatus` | Mutates `mockAssetAllocations` | PATCH `/api/zoiko-hr/onboarding/asset-allocations/:id/status` |
| `fetchWelcomeKits` | `mockWelcomeKits` | GET `/api/zoiko-hr/onboarding/welcome-kits` |
| `updateWelcomeKitStatus` | Mutates `mockWelcomeKits` | PATCH `/api/zoiko-hr/onboarding/welcome-kits/:id/status` |
| `fetchProbations` | `mockProbations` | GET `/api/zoiko-hr/onboarding/probations` |
| `updateProbationStatus` | Mutates `mockProbations` | PATCH `/api/zoiko-hr/onboarding/probations/:id/status` |
| `fetchOnboardingCompletionRate` | Hardcoded | GET `/api/zoiko-hr/onboarding/reports/completion-rate` |
| `fetchDeptOnboarding` | Derived from `mockNewJoiners` | GET `/api/zoiko-hr/onboarding/reports/dept-onboarding` |
| `fetchProbationSummary` | Derived from `mockProbations` | GET `/api/zoiko-hr/onboarding/reports/probation-summary` |
| `fetchAssetSummary` | Derived from `mockAssetAllocations` | GET `/api/zoiko-hr/onboarding/reports/asset-summary` |
| `fetchMonthlyJoiningTrends` | Hardcoded | GET `/api/zoiko-hr/onboarding/reports/joining-trends` |

**Types & mock data to move:** `NewJoiner`, `DocumentVerification`, `AssetAllocation`, `WelcomeKit`, `Probation`, `OnboardingDashboardStats`, all report interfaces + `mockNewJoiners`, `mockDocumentVerifications`, `mockAssetAllocations`, `mockWelcomeKits`, `mockProbations`  
**Dependencies:** `client.ts`  
**Risk:** High — new API endpoints needed  
**Effort:** Large

---

### 4.7 `assets.api.ts` — Asset Management

**Source lines:** 2243–2490 (mock only)  
**Status:** Mock data  
**Functions to move:** 11

| Function | Mock Source | Future Endpoint |
|----------|-------------|-----------------|
| `fetchAssetDashboard` | All mock arrays | GET `/api/zoiko-hr/assets/dashboard` |
| `fetchAssets` | `mockAssets` | GET `/api/zoiko-hr/assets` |
| `createAsset` | (not yet implemented) | POST `/api/zoiko-hr/assets` |
| `updateAssetStatus` | Mutates `mockAssets` | PATCH `/api/zoiko-hr/assets/:id/status` |
| `fetchAssetAllocations` | `mockAllocations` | GET `/api/zoiko-hr/assets/allocations` |
| `fetchAssetReturns` | `mockReturns` | GET `/api/zoiko-hr/assets/returns` |
| `fetchAssetMaintenance` | `mockMaintenance` | GET `/api/zoiko-hr/assets/maintenance` |
| `updateMaintenanceStatus` | Mutates `mockMaintenance` | PATCH `/api/zoiko-hr/assets/maintenance/:id/status` |
| `fetchAssetUtilization` | Hardcoded | GET `/api/zoiko-hr/assets/reports/utilization` |
| `fetchDeptAllocation` | Derived from `mockAllocations` | GET `/api/zoiko-hr/assets/reports/dept-allocation` |
| `fetchMaintenanceCost` | Hardcoded | GET `/api/zoiko-hr/assets/reports/maintenance-cost` |
| `fetchAssetLifecycle` | Hardcoded | GET `/api/zoiko-hr/assets/reports/lifecycle` |

**Types & mock data:** `AssetItem`, `AssetAllocationRecord`, `AssetReturnRecord`, `AssetMaintenanceRecord`, `AssetDashboardStats`, `AssetUtilizationData`, `DeptAllocationData`, `MaintenanceCostData`, `AssetLifecycleData` + `mockAssets`, `mockAllocations`, `mockReturns`, `mockMaintenance`  
**Dependencies:** `client.ts`  
**Risk:** High — new endpoints needed  
**Effort:** Medium-Large

---

### 4.8 `travel.api.ts` — Travel & Expense

**Source lines:** 3504–3990 (mock only)  
**Status:** Mock data  
**Functions to move:** 15

| Function | Mock Source | Future Endpoint |
|----------|-------------|-----------------|
| `fetchTravelDashboard` | All mock arrays | GET `/api/zoiko-hr/travel/dashboard` |
| `fetchTravelRequests` | `mockTravelRequests` | GET `/api/zoiko-hr/travel/requests` |
| `createTravelRequest` | `mockTravelRequests.unshift()` | POST `/api/zoiko-hr/travel/requests` |
| `updateTravelRequestStatus` | Mutates mock | PATCH `/api/zoiko-hr/travel/requests/:id/status` |
| `fetchExpenseClaims` | `mockExpenseClaims` | GET `/api/zoiko-hr/travel/expense-claims` |
| `createExpenseClaim` | `mockExpenseClaims.unshift()` | POST `/api/zoiko-hr/travel/expense-claims` |
| `updateExpenseClaimStatus` | Mutates mock | PATCH `/api/zoiko-hr/travel/expense-claims/:id/status` |
| `fetchExpenseCategories` | `mockExpenseCategories` | GET `/api/zoiko-hr/travel/expense-categories` |
| `fetchTravelApprovals` | `mockApprovals` | GET `/api/zoiko-hr/travel/approvals` |
| `fetchReimbursements` | `mockReimbursements` | GET `/api/zoiko-hr/travel/reimbursements` |
| `fetchCorporateTrips` | `mockCorporateTrips` | GET `/api/zoiko-hr/travel/corporate-trips` |
| `fetchTravelPolicies` | `mockTravelPolicies` | GET `/api/zoiko-hr/travel/policies` |
| `fetchTravelDeptReports` | Hardcoded | GET `/api/zoiko-hr/travel/reports/dept` |
| `fetchTravelExpenseReports` | Hardcoded | GET `/api/zoiko-hr/travel/reports/expense` |
| `fetchCategoryExpenseReports` | Hardcoded | GET `/api/zoiko-hr/travel/reports/category` |

**Dependencies:** `client.ts`  
**Risk:** High — new endpoints needed  
**Effort:** Large

---

### 4.9 `rewards.api.ts` — Rewards & Recognition

**Source lines:** 5576–5858 (mock only)  
**Status:** Mock data  
**Functions to move:** 16

| Function | Mock Source | Future Endpoint |
|----------|-------------|-----------------|
| `fetchRewardsDashboard` | All mock arrays | GET `/api/zoiko-hr/rewards/dashboard` |
| `fetchAwards` | `mockEmployeeAwards` | GET `/api/zoiko-hr/rewards/awards` |
| `createAward` | `mockEmployeeAwards.unshift()` | POST `/api/zoiko-hr/rewards/awards` |
| `updateAward` | Mutates mock | PUT `/api/zoiko-hr/rewards/awards/:id` |
| `deleteAward` | `mockEmployeeAwards.splice()` | DELETE `/api/zoiko-hr/rewards/awards/:id` |
| `fetchRewardsRecognitionPrograms` | `mockRewardsPrograms` | GET `/api/zoiko-hr/rewards/programs` |
| `createRewardsRecognitionProgram` | `mockRewardsPrograms.unshift()` | POST `/api/zoiko-hr/rewards/programs` |
| `updateRewardsRecognitionProgram` | Mutates mock | PUT `/api/zoiko-hr/rewards/programs/:id` |
| `deleteRewardsRecognitionProgram` | Splices mock | DELETE `/api/zoiko-hr/rewards/programs/:id` |
| `fetchRewardPointsBalances` | `mockRewardBalances` | GET `/api/zoiko-hr/rewards/points/balances` |
| `fetchRewardPointTransactions` | `mockRewardTransactions` | GET `/api/zoiko-hr/rewards/points/transactions` |
| `awardPoints` | Mutates mock | POST `/api/zoiko-hr/rewards/points/award` |
| `fetchAchievements` | `mockAchievementRecords` | GET `/api/zoiko-hr/rewards/achievements` |
| `createAchievement` | `mockAchievementRecords.push()` | POST `/api/zoiko-hr/rewards/achievements` |
| `updateAchievement` | Mutates mock | PUT `/api/zoiko-hr/rewards/achievements/:id` |
| `deleteAchievement` | Splices mock | DELETE `/api/zoiko-hr/rewards/achievements/:id` |

**Dependencies:** `client.ts`  
**Risk:** High — new endpoints needed  
**Effort:** Large

---

### 4.10 `compensation.api.ts` — Compensation & Benefits

**Source lines:** 2812–3500 (mock only, includes ESS section at 3207)  
**Status:** Mock data  
**Functions to move:** 9 (compensation-specific)

| Function | Future Endpoint |
|----------|-----------------|
| `fetchCompensationDashboard` | GET `/api/zoiko-hr/compensation/dashboard` |
| `fetchSalaryStructures` | GET `/api/zoiko-hr/compensation/salary-structures` |
| `fetchPayGrades` | GET `/api/zoiko-hr/compensation/pay-grades` |
| `fetchAllowances` | GET `/api/zoiko-hr/compensation/allowances` |
| `fetchDeductions` | GET `/api/zoiko-hr/compensation/deductions` |
| `fetchBenefits` | GET `/api/zoiko-hr/compensation/benefits` |
| `fetchBonuses` | GET `/api/zoiko-hr/compensation/bonuses` |
| `fetchCompensationReviews` | GET `/api/zoiko-hr/compensation/reviews` |
| `fetchSalaryRevisions` | GET `/api/zoiko-hr/compensation/salary-revisions` |
| `fetchSalaryDistribution` | GET `/api/zoiko-hr/compensation/reports/salary-distribution` |
| `fetchBenefitEnrollment` | GET `/api/zoiko-hr/compensation/reports/benefit-enrollment` |

**Note:** The ESS section is interleaved in this area (line 3207). Separate ESS into its own file (4.14).  
**Dependencies:** `client.ts`  
**Risk:** High — new endpoints needed  
**Effort:** Medium

---

### 4.11 `compliance.api.ts` — Compliance & Policy Management

**Source lines:** 3871–4490 (mock only)  
**Status:** Mock data  
**Functions to move:** 20+

| Section | Functions |
|---------|-----------|
| Dashboard | `fetchComplianceDashboard` |
| Policies | `fetchPolicies`, `createPolicy`, `updatePolicy` |
| Policy Categories | `fetchPolicyCategories`, `createPolicyCategory`, `updatePolicyCategory` |
| Requirements | `fetchComplianceRequirements`, `createComplianceRequirement`, `updateComplianceRequirement` |
| Audits | `fetchAudits`, `createAudit`, `updateAuditStatus` |
| Violations | `fetchViolations`, `updateViolationStatus` |
| Corrective Actions | `fetchCorrectiveActions`, `createCorrectiveAction`, `updateCorrectiveAction` |
| Acknowledgements | `fetchAcknowledgements` |
| Training Compliance | `fetchTrainingCompliance` |
| Reports | `fetchComplianceTrends`, `fetchViolationByCategory`, `fetchAuditCompletionData`, `fetchDeptComplianceStats`, `fetchPolicyAdherenceTrends` |

**Dependencies:** `client.ts`  
**Risk:** High — new endpoints needed  
**Effort:** Large

---

### 4.12 `engagement.api.ts` — Employee Engagement

**Source lines:** 4430–4983 (mock only)  
**Status:** Mock data  
**Functions to move:** 22

| Section | Functions |
|---------|-----------|
| Dashboard | `fetchEngagementDashboard` |
| Surveys | `fetchSurveys`, `createSurvey`, `updateSurvey` |
| Survey Templates | `fetchSurveyTemplates` |
| Pulse Surveys | `fetchPulseSurveys`, `createPulseSurvey`, `updatePulseSurveyStatus` |
| Feedback Campaigns | `fetchFeedbackCampaigns`, `createFeedbackCampaign`, `updateFeedbackCampaignStatus` |
| Recognition Programs | `fetchRecognitionPrograms` |
| Employee Recognition | `fetchEmployeeRecognitions`, `createEmployeeRecognition` |
| Engagement Scores | `fetchEngagementScores` |
| Sentiment Analysis | `fetchSentimentAnalysis` |
| Action Plans | `fetchActionPlans`, `createActionPlan`, `updateActionPlan` |
| Reports | `fetchSurveyReports`, `fetchEngagementReports`, `fetchRecognitionReports`, `fetchParticipationReports` |

**Dependencies:** `client.ts`  
**Risk:** High — new endpoints needed  
**Effort:** Large

---

### 4.13 `learning.api.ts` — Learning & Development (LMS)

**Source lines:** 2488–2920 (mock only)  
**Status:** Mock data  
**Functions to move:** 7

| Function | Future Endpoint |
|----------|-----------------|
| `fetchLMSDashboard` | GET `/api/zoiko-hr/learning/dashboard` |
| `fetchCourses` | GET `/api/zoiko-hr/learning/courses` |
| `fetchLearningPaths` | GET `/api/zoiko-hr/learning/learning-paths` |
| `fetchCertifications` | GET `/api/zoiko-hr/learning/certifications` |
| `fetchAssessments` | GET `/api/zoiko-hr/learning/assessments` |
| `fetchEnrollments` | GET `/api/zoiko-hr/learning/enrollments` |
| `fetchLearningProgress` | GET `/api/zoiko-hr/learning/reports/progress` |
| `fetchCertificationReports` | GET `/api/zoiko-hr/learning/reports/certifications` |
| `fetchCourseCompletionData` | GET `/api/zoiko-hr/learning/reports/completion` |
| `fetchDeptLearningStats` | GET `/api/zoiko-hr/learning/reports/dept-stats` |
| `fetchSkillTrends` | GET `/api/zoiko-hr/learning/reports/skill-trends` |

**Dependencies:** `client.ts`  
**Risk:** High — new endpoints needed  
**Effort:** Medium-Large

---

### 4.14 `ess.api.ts` — Employee Self Service

**Source lines:** 3207–3440 (mock only, interleaved with compensation section)  
**Status:** Mock data  
**Functions to move:** 11

| Function | Future Endpoint |
|----------|-----------------|
| `fetchESSDashboard` | GET `/api/zoiko-hr/ess/dashboard` |
| `fetchESSProfile` | GET `/api/zoiko-hr/ess/profile` |
| `fetchESSAttendance` | GET `/api/zoiko-hr/ess/attendance` |
| `fetchESSLeaveRequests` | GET `/api/zoiko-hr/ess/leave-requests` |
| `fetchESSLeaveBalances` | GET `/api/zoiko-hr/ess/leave-balances` |
| `fetchESSDocuments` | GET `/api/zoiko-hr/ess/documents` |
| `fetchESSPayslips` | GET `/api/zoiko-hr/ess/payslips` |
| `fetchESSReviews` | GET `/api/zoiko-hr/ess/reviews` |
| `fetchESSCourses` | GET `/api/zoiko-hr/ess/courses` |
| `fetchESSAssets` | GET `/api/zoiko-hr/ess/assets` |
| `fetchESSRequests` | GET `/api/zoiko-hr/ess/requests` |
| `fetchESSNotifications` | GET `/api/zoiko-hr/ess/notifications` |
| `markNotificationRead` | PATCH `/api/zoiko-hr/ess/notifications/:id/read` |

**Note:** Many ESS endpoints could proxy to existing workforce/leave/attendance endpoints.  
**Dependencies:** `client.ts`  
**Risk:** Medium — some endpoints can reuse existing API routes  
**Effort:** Medium

---

### 4.15 `lifecycle.api.ts` — Employee Lifecycle

**Source lines:** N/A — data is hardcoded in page files (`app/zoiko-hr/employee-lifecycle/*/page.tsx`)  
**Status:** Hardcoded mock — no workforce-api.ts usage  
**Pages:** Overview, Onboarding, Offboarding, Transfers

This module does not exist in `workforce-api.ts`. The pages use inline `initialRecords`, `lifecycleStats`, etc.

#### Recommended approach

| Page | Current Data | Future Endpoint |
|------|-------------|-----------------|
| Lifecycle Dashboard | `lifecycleStats`, `recentOnboardings`, etc. | GET `/api/zoiko-hr/employee-lifecycle/dashboard` |
| Onboarding | `initialRecords` | GET `/api/zoiko-hr/employee-lifecycle/onboarding` |
| Offboarding | `initialRecords` | GET `/api/zoiko-hr/employee-lifecycle/offboarding` |
| Transfers | `initialRecords` | GET `/api/zoiko-hr/employee-lifecycle/transfers` |

**Dependencies:** `client.ts`  
**Risk:** High — needs new API endpoints, service file, repository, and Prisma schema  
**Effort:** Medium

---

### 4.16 `helpdesk.api.ts` — Helpdesk

**Source files:** `app/zoiko-hr/helpdesk/mockData.ts` (dedicated mock file, NOT in workforce-api.ts)  
**Status:** Mock data — separate `mockData.ts` file  
**Pages:** Overview, Cases, Employee Requests, Knowledge Base, SLA, Tickets

#### Recommended approach

| Page | Current Source | Future Endpoint |
|------|---------------|-----------------|
| Dashboard | `mockData.ts` | GET `/api/zoiko-hr/helpdesk/dashboard` |
| Tickets | `mockData.ts` | GET/POST `/api/zoiko-hr/helpdesk/tickets` |
| Cases | `mockData.ts` | GET/POST `/api/zoiko-hr/helpdesk/cases` |
| Employee Requests | `mockData.ts` | GET/POST `/api/zoiko-hr/helpdesk/employee-requests` |
| Knowledge Base | `mockData.ts` | GET `/api/zoiko-hr/helpdesk/knowledge-base` |
| SLA | `mockData.ts` | GET `/api/zoiko-hr/helpdesk/sla` |

**Dependencies:** `client.ts`  
**Risk:** High — completely new module  
**Effort:** Medium-Large

---

## 5. Migration Phases

| Phase | Modules | Type | Effort | Risk |
|-------|---------|------|--------|------|
| **1 — Foundation** | `client.ts` | New file | 1 day | Low |
| **2 — Real API (no behavior change)** | `workforce.api.ts`, `leave.api.ts`, `attendance.api.ts`, `performance.api.ts` | Split existing code | 2-3 days | Low |
| **3 — Read-only mock → API** | `recruitment.api.ts` (reads), `compliance.api.ts` (reads), `learning.api.ts` (reads) | New API routes + migrate | 3-5 days each | Medium |
| **4 — Full CRUD mock → API** | `assets.api.ts`, `travel.api.ts`, `rewards.api.ts`, `compensation.api.ts`, `onboarding.api.ts` | New API routes + migrate | 3-5 days each | High |
| **5 — Special modules** | `ess.api.ts`, `lifecycle.api.ts`, `helpdesk.api.ts`, `engagement.api.ts` | New API routes + migrate | 3-5 days each | High |
| **6 — Backward compat layer** | Deprecate `workforce-api.ts` with re-exports | Single file change | 1 day | Low |
| **7 — Cleanup** | Remove old `workforce-api.ts` | Delete file, update all imports | 1 day | Medium |

### Recommended order

```
Phase 1 ──► Phase 2 ──► Phase 6 ──► Phase 3 ──► Phase 4 ──► Phase 5 ──► Phase 7
```

---

## 6. Import Change Map

Every page file that currently imports from `workforce-api.ts` must be updated. Here is the mapping:

| Current Import Path | Pages | New Import Path |
|---------------------|-------|-----------------|
| `../../lib/workforce-api` | `app/zoiko-hr/{workforce,departments,designations,documents}/page.tsx` | `../../lib/api/workforce.api` |
| `../../../lib/workforce-api` | `app/zoiko-hr/{workforce/employees,leave,attendance,performance,compensation,compliance,etc.}/page.tsx` | `../../../lib/api/{module}.api` |
| `../../../../lib/workforce-api` | `app/zoiko-hr/{workforce/employees/new,workforce/employees/[id]}/page.tsx` | `../../../../lib/api/{module}.api` |
| `../../../../../lib/workforce-api` | `app/zoiko-hr/workforce/employees/[id]/edit/page.tsx` | `../../../../../lib/api/workforce.api` |

**Total import changes:** ~167 files (all page.tsx files in `app/zoiko-hr/`)

---

## 7. Risk Assessment

| Module | Risk Level | Reason |
|--------|-----------|--------|
| `client.ts` | **Low** | Pure utility, no business logic |
| `workforce.api.ts` | **Low** | Existing real API, no behavior change |
| `leave.api.ts` | **Low** | Existing real API, no behavior change |
| `attendance.api.ts` | **Low** | Existing real API, no behavior change |
| `performance.api.ts` | **Low** | Existing real API, no behavior change |
| `recruitment.api.ts` | **High** | Mock → real API, needs backend implementation |
| `onboarding.api.ts` | **High** | Mock → real API, needs backend implementation |
| `assets.api.ts` | **High** | Mock → real API, needs backend implementation |
| `travel.api.ts` | **High** | Mock → real API, needs backend implementation |
| `rewards.api.ts` | **High** | Mock → real API, needs backend implementation |
| `compensation.api.ts` | **High** | Mock → real API, needs backend implementation |
| `compliance.api.ts` | **High** | Mock → real API, needs backend implementation |
| `engagement.api.ts` | **High** | Mock → real API, needs backend implementation |
| `learning.api.ts` | **High** | Mock → real API, needs backend implementation |
| `ess.api.ts` | **Medium** | Mock → real API, some endpoints can reuse existing |
| `lifecycle.api.ts` | **High** | New module, inline hardcoded data |
| `helpdesk.api.ts` | **High** | New module, separate mockData.ts file |

---

## 8. Effort Summary

| Module | Functions | Types | Mock Arrays | Lines to Move | Est. Effort |
|--------|-----------|-------|-------------|---------------|-------------|
| `client.ts` | 2 | 5+ | 0 | ~40 | 1 hr |
| `workforce.api.ts` | 32 | 20+ | 0 | ~500 | 4 hr |
| `leave.api.ts` | 12 | 8+ | 0 | ~200 | 2 hr |
| `attendance.api.ts` | 15 | 6+ | 0 | ~240 | 2 hr |
| `performance.api.ts` | 20 | 8+ | 0 | ~350 | 3 hr |
| `recruitment.api.ts` | 18 | 10+ | 4 | ~370 | 4 hr (+ backend) |
| `onboarding.api.ts` | 16 | 12+ | 5 | ~340 | 4 hr (+ backend) |
| `assets.api.ts` | 12 | 10+ | 4 | ~250 | 3 hr (+ backend) |
| `travel.api.ts` | 15 | 12+ | 8 | ~300 | 4 hr (+ backend) |
| `rewards.api.ts` | 16 | 8+ | 5 | ~300 | 3 hr (+ backend) |
| `compensation.api.ts` | 11 | 10+ | 8 | ~350 | 3 hr (+ backend) |
| `compliance.api.ts` | 20+ | 14+ | 8 | ~500 | 5 hr (+ backend) |
| `engagement.api.ts` | 22 | 12+ | 9 | ~400 | 5 hr (+ backend) |
| `learning.api.ts` | 11 | 8+ | 5 | ~250 | 3 hr (+ backend) |
| `ess.api.ts` | 13 | 8+ | 6 | ~300 | 3 hr (+ backend) |
| `lifecycle.api.ts` | 4 | 4+ | 0 | ~100 | 2 hr (+ backend) |
| `helpdesk.api.ts` | 6+ | 6+ | 0 | ~150 | 2 hr (+ backend) |
| **Import updates** | — | — | — | ~167 files | 4 hr |
| **Total** | **~185** | **~90** | **63** | **~5858** | **~52 hr** |

---

## 9. Backward Compatibility Strategy

After creating all module files, create a thin re-export shim at `app/lib/workforce-api.ts`:

```typescript
// app/lib/workforce-api.ts — DEPRECATED
// Re-exports from modular API files for backward compatibility.
// New code should import directly from app/lib/api/{module}.api.ts

export * from "./api/workforce.api";
export * from "./api/leave.api";
export * from "./api/attendance.api";
// ... etc
```

This allows incremental migration without breaking existing imports. Once all imports are updated, delete this file.

---

## 10. Recommendations

1. **Do Phase 1 + 2 first** — `client.ts` and the 4 real-API modules (workforce, leave, attendance, performance) are safe, low-risk changes that deliver immediate value and establish the pattern.

2. **Add a `createAsset`, `createTravelRequest`, etc.** where missing — several mock modules have update/delete but no create functions. These should be added during migration.

3. **Consider reusing existing endpoints for ESS** — `ess.api.ts` functions like `fetchESSAttendance` could proxy to `attendance.api.ts` rather than requiring new backend endpoints.

4. **Plan Prisma schema changes** — Mock modules (Recruitment, Engagement, Learning, etc.) have no corresponding Prisma models. A schema migration is needed before these can be backed by real APIs.

5. **Automate import updates** — Use a codemod script to batch-update all `from "workforce-api"` imports to their new module paths.
