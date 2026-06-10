# Zoiko One — Frontend ↔ Backend API Connectivity Audit

**Generated:** 2026-06-10  
**Scope:** Full frontend codebase at `zoiko-one-frontend/`  
**Methodology:** Static code analysis — traced imports, service calls, fetch() usage, mock data patterns, and API route handlers.

---

## Architecture Overview

The project uses a **hybrid data-fetching architecture** with two distinct paths:

| Path | Mechanism | Used By |
|------|-----------|---------|
| **Server-side (Prisma)** | Services (`app/services/`) → Repositories (`app/repositories/`) → Prisma ORM → PostgreSQL | Super-admin pages, zoiko-hr root page |
| **Client-side (REST API)** | Pages → `app/lib/workforce-api.ts` → `fetch()` → Next.js API routes (`app/api/`) → Services → Repositories → Prisma | Core HR modules (Employees, Leave, Attendance, etc.) |
| **Client-side (Mock)** | Pages → `app/lib/workforce-api.ts` → **In-memory mock arrays** | Recruitment, Engagement, ESS, Learning, etc. |

**No external HTTP client libraries are used.** No axios, React Query, or SWR. All HTTP calls use native `fetch()`.

---

## Module-by-Module Audit

### MODULE: Workforce (Core)
**Status: Connected** — All CRUD operations hit real `/api/zoiko-hr/workforce/*` endpoints.

| Page | Status | Data Source | API Endpoints | File |
|------|--------|-------------|---------------|------|
| Overview | **Connected** | `workforce-api.ts` → `fetch()` | GET /api/zoiko-hr/workforce | `app/zoiko-hr/workforce/page.tsx` |
| Employees | **Connected** | `workforce-api.ts` → `fetch()` | GET, POST /api/zoiko-hr/workforce | `app/zoiko-hr/workforce/employees/page.tsx` |
| Employee Detail | **Connected** | `workforce-api.ts` → `fetch()` | GET, PUT, DELETE /api/zoiko-hr/workforce/:id | `app/zoiko-hr/workforce/employees/[employeeId]/page.tsx` |
| New Employee | **Connected** | Direct `fetch()` | POST /api/zoiko-hr/workforce | `app/zoiko-hr/workforce/employees/new/page.tsx` |
| Edit Employee | **Connected** | `workforce-api.ts` + direct `fetch()` | PUT /api/zoiko-hr/workforce/:id | `app/zoiko-hr/workforce/employees/[employeeId]/edit/page.tsx` |
| Addresses | **Connected** | `workforce-api.ts` → `fetch()` | GET /api/zoiko-hr/workforce/:id/addresses | `app/zoiko-hr/workforce/addresses/page.tsx` |
| Documents | **Connected** | `workforce-api.ts` → `fetch()` | GET /api/zoiko-hr/workforce/:id/documents | `app/zoiko-hr/workforce/documents/page.tsx` |
| Emergency Contacts | **Connected** | `workforce-api.ts` → `fetch()` | GET /api/zoiko-hr/workforce/:id/emergency-contacts | `app/zoiko-hr/workforce/emergency-contacts/page.tsx` |
| Employment Records | **Connected** | `workforce-api.ts` → `fetch()` | GET, POST /api/zoiko-hr/workforce/:id/employment-records | `app/zoiko-hr/workforce/employment-records/page.tsx` |

**API Endpoints Used:**
- `GET /api/zoiko-hr/workforce` — list employees
- `POST /api/zoiko-hr/workforce` — create employee
- `GET /api/zoiko-hr/workforce/[employeeId]` — get employee
- `PUT /api/zoiko-hr/workforce/[employeeId]` — update employee
- `DELETE /api/zoiko-hr/workforce/[employeeId]` — delete employee
- `GET /api/zoiko-hr/workforce/[employeeId]/profile` — get profile
- `PUT /api/zoiko-hr/workforce/[employeeId]/profile` — upsert profile
- `GET /api/zoiko-hr/workforce/[employeeId]/addresses` — list addresses
- `POST /api/zoiko-hr/workforce/[employeeId]/addresses` — create address
- `PUT /api/zoiko-hr/workforce/[employeeId]/addresses/[addressId]` — update address
- `DELETE /api/zoiko-hr/workforce/[employeeId]/addresses/[addressId]` — delete address
- `GET /api/zoiko-hr/workforce/[employeeId]/documents` — list documents
- `POST /api/zoiko-hr/workforce/[employeeId]/documents` — create document
- `PUT /api/zoiko-hr/workforce/[employeeId]/documents/[documentId]` — update document
- `DELETE /api/zoiko-hr/workforce/[employeeId]/documents/[documentId]` — delete document
- `GET /api/zoiko-hr/workforce/[employeeId]/emergency-contacts` — list contacts
- `POST /api/zoiko-hr/workforce/[employeeId]/emergency-contacts` — create contact
- `PUT /api/zoiko-hr/workforce/[employeeId]/emergency-contacts/[contactId]` — update contact
- `DELETE /api/zoiko-hr/workforce/[employeeId]/emergency-contacts/[contactId]` — delete contact
- `GET /api/zoiko-hr/workforce/[employeeId]/employment-records` — list records
- `POST /api/zoiko-hr/workforce/[employeeId]/employment-records` — create record

**Service File:** `app/lib/workforce-api.ts` (lines 215–435, real fetch)  
**API Route:** `app/api/zoiko-hr/workforce/route.ts`, `app/api/zoiko-hr/workforce/[employeeId]/route.ts` and sub-resource routes

---

### MODULE: Workforce Planning
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | Data Source | File |
|------|--------|-------------|------|
| Overview | **Mock Data** | `fetchWFDashboard` → mock arrays | `app/zoiko-hr/workforce-planning/page.tsx` |
| Headcount | **Mock Data** | `fetchWFHeadcountPlans` → mock arrays | `app/zoiko-hr/workforce-planning/headcount/page.tsx` |
| Forecasting | **Mock Data** | `fetchWFWorkforceForecasts` → mock arrays | `app/zoiko-hr/workforce-planning/forecasting/page.tsx` |
| Hiring Plans | **Mock Data** | `fetchWFHiringPlans` → mock arrays | `app/zoiko-hr/workforce-planning/hiring-plans/page.tsx` |
| Capacity | **Mock Data** | `fetchWFCapacityPlans` → mock arrays | `app/zoiko-hr/workforce-planning/capacity/page.tsx` |
| Skill Gaps | **Mock Data** | `fetchWFSkillGaps` → mock arrays | `app/zoiko-hr/workforce-planning/skill-gaps/page.tsx` |
| Succession | **Mock Data** | `fetchWFSuccessionPlans` → mock arrays | `app/zoiko-hr/workforce-planning/succession/page.tsx` |
| Budget | **Mock Data** | `fetchWFBudgetPlans` → mock arrays | `app/zoiko-hr/workforce-planning/budget/page.tsx` |
| Scenarios | **Mock Data** | `fetchWFScenarioPlans` → mock arrays | `app/zoiko-hr/workforce-planning/scenarios/page.tsx` |
| Reports | **Mock Data** | Multiple `fetchWF*Reports` → mock arrays | `app/zoiko-hr/workforce-planning/reports/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 5226–5560) — mock arrays: `mockHeadcountPlans`, `mockWorkforceForecasts`, `mockHiringPlans`, `mockCapacityPlans`, `mockSkillGaps`, `mockSuccessionPlans`, `mockBudgetPlans`, `mockScenarioPlans`

**Missing API Integration:** No real API endpoints exist for workforce planning. Need to create routes under `/api/zoiko-hr/workforce-planning/`.

---

### MODULE: Recruitment
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | Data Source | File |
|------|--------|-------------|------|
| Overview | **Mock Data** | `fetchRecruitmentDashboard` → mock arrays | `app/zoiko-hr/recruitment/page.tsx` |
| Candidates | **Mock Data** | `fetchCandidates` → mock arrays | `app/zoiko-hr/recruitment/candidates/page.tsx` |
| Interviews | **Mock Data** | `fetchInterviews` → mock arrays | `app/zoiko-hr/recruitment/interviews/page.tsx` |
| Job Openings | **Mock Data** | `fetchJobOpenings` → mock arrays | `app/zoiko-hr/recruitment/job-openings/page.tsx` |
| Offers | **Mock Data** | `fetchOffers` → mock arrays | `app/zoiko-hr/recruitment/offers/page.tsx` |
| Reports | **Mock Data** | `fetchRecruitmentFunnel` → mock arrays | `app/zoiko-hr/recruitment/reports/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 1629–1871) — mock arrays: `mockJobs`, `mockCandidates`, `mockInterviews`, `mockOffers`

**Missing API Integration:** No `/api/zoiko-hr/recruitment/*` routes exist. Need full CRUD + reporting endpoints.

---

### MODULE: Leave
**Status: Connected** — All pages use real fetch-based functions in `workforce-api.ts`.

| Page | Status | Data Source | API Endpoints | File |
|------|--------|-------------|---------------|------|
| Overview | **Connected** | `fetchLeaveRequests`, `fetchLeaveTypes` | GET leave/requests, GET leave/types | `app/zoiko-hr/leave/page.tsx` |
| Requests | **Connected** | `fetchLeaveRequests`, `createLeaveRequest`, `approveLeaveRequest` | GET, POST leave/requests; POST approve | `app/zoiko-hr/leave/requests/page.tsx` |
| Request Detail | **Connected** | `fetchLeaveRequest`, `approveLeaveRequest` | GET leave/requests/:id; POST approve | `app/zoiko-hr/leave/requests/[requestId]/page.tsx` |
| Balances | **Connected** | `fetchLeaveBalances` | GET, POST leave/balances | `app/zoiko-hr/leave/balances/page.tsx` |
| Calendar | **Connected** | `fetchLeaveCalendar` | GET leave/calendar | `app/zoiko-hr/leave/calendar/page.tsx` |
| Leave Types | **Connected** | `fetchLeaveTypes`, `createLeaveType`, `updateLeaveType`, `deleteLeaveType` | GET, POST types; PUT, DELETE types/:id | `app/zoiko-hr/leave/leave-types/page.tsx` |

**API Endpoints Used:**
- `GET /api/zoiko-hr/leave/types` — list leave types
- `POST /api/zoiko-hr/leave/types` — create leave type
- `GET /api/zoiko-hr/leave/types/[typeId]` — get leave type
- `PUT /api/zoiko-hr/leave/types/[typeId]` — update leave type
- `DELETE /api/zoiko-hr/leave/types/[typeId]` — delete leave type
- `GET /api/zoiko-hr/leave/requests` — list leave requests
- `POST /api/zoiko-hr/leave/requests` — create leave request
- `GET /api/zoiko-hr/leave/requests/[requestId]` — get leave request
- `DELETE /api/zoiko-hr/leave/requests/[requestId]` — cancel leave request
- `POST /api/zoiko-hr/leave/requests/[requestId]/approve` — approve/reject
- `GET /api/zoiko-hr/leave/balances` — list leave balances
- `POST /api/zoiko-hr/leave/balances` — initialize leave balance
- `GET /api/zoiko-hr/leave/calendar` — get calendar data

**Service File:** `app/lib/workforce-api.ts` (lines 691–862, real fetch)  
**API Route:** `app/api/zoiko-hr/leave/*` (types, requests, balances, calendar)

---

### MODULE: Attendance
**Status: Connected** — All pages use real fetch-based functions in `workforce-api.ts`.

| Page | Status | Data Source | API Endpoints | File |
|------|--------|-------------|---------------|------|
| Overview | **Connected** | `fetchAttendanceDashboard` | GET attendance/dashboard | `app/zoiko-hr/attendance/page.tsx` |
| Check In/Out | **Connected** | `checkInEmployee`, `checkOutEmployee` | POST check-in, POST check-out | `app/zoiko-hr/attendance/check-in-out/page.tsx` |
| Entry | **Connected** | `createAttendance` | POST attendance | `app/zoiko-hr/attendance/entry/page.tsx` |
| Records | **Connected** | `fetchAttendances` | GET attendance | `app/zoiko-hr/attendance/records/page.tsx` |
| Reports | **Connected** | `fetchAttendanceReport` | GET attendance/reports | `app/zoiko-hr/attendance/reports/page.tsx` |
| Shifts | **Connected** | `fetchShifts` | GET shifts | `app/zoiko-hr/attendance/shifts/page.tsx` |

**API Endpoints Used:** All `app/api/zoiko-hr/attendance/*` routes (list, detail, check-in, check-out, dashboard, reports) and `app/api/zoiko-hr/shifts/*` routes.

**Service File:** `app/lib/workforce-api.ts` (lines 936–1096, real fetch)

---

### MODULE: Departments & Designations
**Status: Connected** — Full CRUD via real fetch functions.

| Page | Status | API Endpoints | File |
|------|--------|---------------|------|
| Departments | **Connected** | GET, POST departments; GET, PUT, DELETE departments/:id | `app/zoiko-hr/departments/page.tsx` |
| Department Detail | **Connected** | GET departments/:id | `app/zoiko-hr/departments/[departmentId]/page.tsx` |
| Designations | **Connected** | GET, POST designations; GET, PUT, DELETE designations/:id | `app/zoiko-hr/designations/page.tsx` |
| Designation Detail | **Connected** | GET designations/:id | `app/zoiko-hr/designations/[designationId]/page.tsx` |

---

### MODULE: Documents
**Status: Connected** — Full CRUD via real fetch functions.

| Page | Status | API Endpoints | File |
|------|--------|---------------|------|
| Documents | **Connected** | GET, POST documents; DELETE documents/:id | `app/zoiko-hr/documents/page.tsx` |
| Document Detail | **Connected** | GET, PUT, DELETE documents/:id | `app/zoiko-hr/documents/[documentId]/page.tsx` |

---

### MODULE: Performance
**Status: Connected** — All pages use real fetch-based functions in `workforce-api.ts`.

| Page | Status | API Endpoints | File |
|------|--------|---------------|------|
| Overview | **Connected** | GET performance/dashboard, reviews, goals, feedback | `app/zoiko-hr/performance/page.tsx` |
| Feedback | **Connected** | GET, POST feedback; DELETE feedback/:id | `app/zoiko-hr/performance/feedback/page.tsx` |
| Goals | **Connected** | GET, POST goals; PUT, DELETE goals/:id; POST goals/:id/updates | `app/zoiko-hr/performance/goals/page.tsx` |
| Reviews | **Connected** | GET, POST reviews; GET cycles; PUT, DELETE reviews/:id | `app/zoiko-hr/performance/reviews/page.tsx` |

**Full set of API routes exist at `app/api/zoiko-hr/performance/*`.**

---

### MODULE: ESS (Employee Self Service)
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | Data Source | File |
|------|--------|-------------|------|
| Dashboard | **Mock Data** | `fetchESSDashboard` → mock arrays | `app/zoiko-hr/ess/page.tsx` |
| My Profile | **Mock Data** | `fetchESSProfile` → mock arrays | `app/zoiko-hr/ess/my-profile/page.tsx` |
| My Attendance | **Mock Data** | `fetchESSAttendance` → mock arrays | `app/zoiko-hr/ess/my-attendance/page.tsx` |
| My Leave | **Mock Data** | `fetchESSLeaveRequests`, `fetchESSLeaveBalances` → mock arrays | `app/zoiko-hr/ess/my-leave/page.tsx` |
| My Documents | **Mock Data** | `fetchESSDocuments` → mock arrays | `app/zoiko-hr/ess/my-documents/page.tsx` |
| My Payslips | **Mock Data** | `fetchESSPayslips` → mock arrays | `app/zoiko-hr/ess/my-payslips/page.tsx` |
| My Performance | **Mock Data** | `fetchESSReviews` → mock arrays | `app/zoiko-hr/ess/my-performance/page.tsx` |
| My Learning | **Mock Data** | `fetchESSCourses` → mock arrays | `app/zoiko-hr/ess/my-learning/page.tsx` |
| My Assets | **Mock Data** | `fetchESSAssets` → mock arrays | `app/zoiko-hr/ess/my-assets/page.tsx` |
| My Requests | **Mock Data** | `fetchESSRequests` → mock arrays | `app/zoiko-hr/ess/my-requests/page.tsx` |
| Notifications | **Mock Data** | `fetchESSNotifications` → mock arrays | `app/zoiko-hr/ess/notifications/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (ESS section) — ESS functions operate on separate mock arrays (e.g., `mockESSAttendance`, `mockESSLeave`, etc.) found in the ESS section of the file.

**Missing API Integration:** No `/api/zoiko-hr/ess/*` routes exist. ESS pages need dedicated API endpoints, though many could reuse existing employee/leave/attendance endpoints.

---

### MODULE: Engagement
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | File |
|------|--------|------|
| Overview | **Mock Data** | `app/zoiko-hr/engagement/page.tsx` |
| Action Plans | **Mock Data** | `app/zoiko-hr/engagement/action-plans/page.tsx` |
| Employee Recognition | **Mock Data** | `app/zoiko-hr/engagement/employee-recognition/page.tsx` |
| Engagement Scores | **Mock Data** | `app/zoiko-hr/engagement/engagement-scores/page.tsx` |
| Feedback Campaigns | **Mock Data** | `app/zoiko-hr/engagement/feedback-campaigns/page.tsx` |
| Pulse Surveys | **Mock Data** | `app/zoiko-hr/engagement/pulse-surveys/page.tsx` |
| Recognition Programs | **Mock Data** | `app/zoiko-hr/engagement/recognition-programs/page.tsx` |
| Reports | **Mock Data** | `app/zoiko-hr/engagement/reports/page.tsx` |
| Sentiment Analysis | **Mock Data** | `app/zoiko-hr/engagement/sentiment-analysis/page.tsx` |
| Survey Templates | **Mock Data** | `app/zoiko-hr/engagement/survey-templates/page.tsx` |
| Surveys | **Mock Data** | `app/zoiko-hr/engagement/surveys/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 4632–4980) — mock arrays: `mockSurveys`, `mockSurveyTemplates`, `mockPulseSurveys`, `mockFeedbackCampaigns`, `mockRecognitionPrograms`, `mockEmployeeRecognitions`, `mockEngagementScores`, `mockSentiments`, `mockActionPlans`

---

### MODULE: Learning (LMS)
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | File |
|------|--------|------|
| Overview | **Mock Data** | `app/zoiko-hr/learning/page.tsx` |
| Assessments | **Mock Data** | `app/zoiko-hr/learning/assessments/page.tsx` |
| Certifications | **Mock Data** | `app/zoiko-hr/learning/certifications/page.tsx` |
| Courses | **Mock Data** | `app/zoiko-hr/learning/courses/page.tsx` |
| Enrollments | **Mock Data** | `app/zoiko-hr/learning/enrollments/page.tsx` |
| Learning Paths | **Mock Data** | `app/zoiko-hr/learning/learning-paths/page.tsx` |
| Reports | **Mock Data** | `app/zoiko-hr/learning/reports/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 2588–2920) — mock arrays: `mockCourses`, `mockLearningPaths`, `mockCertifications`, `mockAssessments`, `mockEnrollments`

---

### MODULE: Compensation
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | File |
|------|--------|------|
| Overview | **Mock Data** | `app/zoiko-hr/compensation/page.tsx` |
| Allowances | **Mock Data** | `app/zoiko-hr/compensation/allowances/page.tsx` |
| Benefits | **Mock Data** | `app/zoiko-hr/compensation/benefits/page.tsx` |
| Bonuses | **Mock Data** | `app/zoiko-hr/compensation/bonuses/page.tsx` |
| Deductions | **Mock Data** | `app/zoiko-hr/compensation/deductions/page.tsx` |
| Pay Grades | **Mock Data** | `app/zoiko-hr/compensation/pay-grades/page.tsx` |
| Reports | **Mock Data** | `app/zoiko-hr/compensation/reports/page.tsx` |
| Reviews | **Mock Data** | `app/zoiko-hr/compensation/reviews/page.tsx` |
| Salary History | **Mock Data** | `app/zoiko-hr/compensation/salary-history/page.tsx` |
| Salary Structures | **Mock Data** | `app/zoiko-hr/compensation/salary-structures/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 2932–3500) — mock arrays: `mockSalaryStructures`, `mockPayGrades`, `mockAllowances`, `mockDeductions`, `mockBenefits`, `mockBonuses`, `mockCompReviews`, `mockSalaryRevisions`

---

### MODULE: Compliance
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | File |
|------|--------|------|
| Overview | **Mock Data** | `app/zoiko-hr/compliance/page.tsx` |
| Acknowledgements | **Mock Data** | `app/zoiko-hr/compliance/acknowledgements/page.tsx` |
| Audits | **Mock Data** | `app/zoiko-hr/compliance/audits/page.tsx` |
| Corrective Actions | **Mock Data** | `app/zoiko-hr/compliance/corrective-actions/page.tsx` |
| Policies | **Mock Data** | `app/zoiko-hr/compliance/policies/page.tsx` |
| Policy Categories | **Mock Data** | `app/zoiko-hr/compliance/policy-categories/page.tsx` |
| Reports | **Mock Data** | `app/zoiko-hr/compliance/reports/page.tsx` |
| Requirements | **Mock Data** | `app/zoiko-hr/compliance/requirements/page.tsx` |
| Training Compliance | **Mock Data** | `app/zoiko-hr/compliance/training-compliance/page.tsx` |
| Violations | **Mock Data** | `app/zoiko-hr/compliance/violations/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 4006–4490) — mock arrays: `mockPolicies`, `mockPolicyCategories`, `mockRequirements`, `mockAudits`, `mockViolations`, `mockCorrectiveActions`, `mockAcknowledgements`, `mockTrainingCompliance`

---

### MODULE: Employee Lifecycle
**Status: Mock Data (Hardcoded in Page)** — These pages contain inline hardcoded mock data.

| Page | Status | Data Source | File |
|------|--------|-------------|------|
| Overview | **Mock Data** | `lifecycleStats`, `recentOnboardings`, `recentTransfers`, `recentOffboardings` (hardcoded arrays) | `app/zoiko-hr/employee-lifecycle/page.tsx` |
| Onboarding | **Mock Data** | `initialRecords` (hardcoded array) | `app/zoiko-hr/employee-lifecycle/onboarding/page.tsx` |
| Offboarding | **Mock Data** | `initialRecords` (hardcoded array) | `app/zoiko-hr/employee-lifecycle/offboarding/page.tsx` |
| Transfers | **Mock Data** | `initialRecords` (hardcoded array) | `app/zoiko-hr/employee-lifecycle/transfers/page.tsx` |

**Note:** These pages do NOT import from `workforce-api.ts`. They define mock data inline.

---

### MODULE: Onboarding
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | File |
|------|--------|------|
| Overview | **Mock Data** | `app/zoiko-hr/onboarding/page.tsx` |
| Asset Allocation | **Mock Data** | `app/zoiko-hr/onboarding/asset-allocation/page.tsx` |
| Document Verification | **Mock Data** | `app/zoiko-hr/onboarding/document-verification/page.tsx` |
| New Joiners | **Mock Data** | `app/zoiko-hr/onboarding/new-joiners/page.tsx` |
| Probation | **Mock Data** | `app/zoiko-hr/onboarding/probation/page.tsx` |
| Reports | **Mock Data** | `app/zoiko-hr/onboarding/reports/page.tsx` |
| Welcome Kit | **Mock Data** | `app/zoiko-hr/onboarding/welcome-kit/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 2009–2230) — mock arrays: `mockNewJoiners`, `mockDocumentVerifications`, `mockAssetAllocations`, `mockWelcomeKits`, `mockProbations`

---

### MODULE: Assets
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | File |
|------|--------|------|
| Overview | **Mock Data** | `app/zoiko-hr/assets/page.tsx` |
| Allocation | **Mock Data** | `app/zoiko-hr/assets/allocation/page.tsx` |
| Categories | **Mock Data** | `app/zoiko-hr/assets/categories/page.tsx` |
| Inventory | **Mock Data** | `app/zoiko-hr/assets/inventory/page.tsx` |
| Maintenance | **Mock Data** | `app/zoiko-hr/assets/maintenance/page.tsx` |
| Reports | **Mock Data** | `app/zoiko-hr/assets/reports/page.tsx` |
| Returns | **Mock Data** | `app/zoiko-hr/assets/returns/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 2322–2490) — mock arrays: `mockAssets`, `mockAllocations`, `mockReturns`, `mockMaintenance`

---

### MODULE: Travel
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | File |
|------|--------|------|
| Overview | **Mock Data** | `app/zoiko-hr/travel/page.tsx` |
| Approvals | **Mock Data** | `app/zoiko-hr/travel/approvals/page.tsx` |
| Corporate Travel | **Mock Data** | `app/zoiko-hr/travel/corporate-travel/page.tsx` |
| Expense Categories | **Mock Data** | `app/zoiko-hr/travel/expense-categories/page.tsx` |
| Expense Claims | **Mock Data** | `app/zoiko-hr/travel/expense-claims/page.tsx` |
| Policy Management | **Mock Data** | `app/zoiko-hr/travel/policy-management/page.tsx` |
| Reimbursements | **Mock Data** | `app/zoiko-hr/travel/reimbursements/page.tsx` |
| Reports | **Mock Data** | `app/zoiko-hr/travel/reports/page.tsx` |
| Travel Requests | **Mock Data** | `app/zoiko-hr/travel/travel-requests/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 3629–3990) — mock arrays: `mockTravelRequests`, `mockExpenseClaims`, `mockExpenseCategories`, `mockApprovals`, `mockReimbursements`, `mockCorporateTrips`, `mockTravelPolicies`

---

### MODULE: Rewards
**Status: Mock Data** — All pages use mock-only functions in `workforce-api.ts`.

| Page | Status | File |
|------|--------|------|
| Overview | **Mock Data** | `app/zoiko-hr/rewards/page.tsx` |
| Achievements | **Mock Data** | `app/zoiko-hr/rewards/achievements/page.tsx` |
| Awards | **Mock Data** | `app/zoiko-hr/rewards/awards/page.tsx` |
| Points | **Mock Data** | `app/zoiko-hr/rewards/points/page.tsx` |
| Programs | **Mock Data** | `app/zoiko-hr/rewards/programs/page.tsx` |

**Mock Source:** `app/lib/workforce-api.ts` (lines 5578–5852) — mock arrays: `mockEmployeeAwards`, `mockRewardsPrograms`, `mockRewardBalances`, `mockRewardTransactions`, `mockAchievementRecords`

---

### MODULE: Helpdesk
**Status: Mock Data (Dedicated mockData.ts)** — Uses a separate mock data file, NOT `workforce-api.ts`.

| Page | Status | Mock Source | File |
|------|--------|-------------|------|
| Overview | **Mock Data** | `app/zoiko-hr/helpdesk/mockData.ts` | `app/zoiko-hr/helpdesk/page.tsx` |
| Cases | **Mock Data** | `../mockData` | `app/zoiko-hr/helpdesk/cases/page.tsx` |
| Employee Requests | **Mock Data** | `../mockData` | `app/zoiko-hr/helpdesk/employee-requests/page.tsx` |
| Knowledge Base | **Mock Data** | `../mockData` | `app/zoiko-hr/helpdesk/knowledge-base/page.tsx` |
| SLA | **Mock Data** | `../mockData` | `app/zoiko-hr/helpdesk/sla/page.tsx` |
| Tickets | **Mock Data** | `../mockData` | `app/zoiko-hr/helpdesk/tickets/page.tsx` |

**Dedicated Mock File:** `app/zoiko-hr/helpdesk/mockData.ts` — Contains hardcoded arrays for tickets, cases, knowledge base articles, SLAs, and employee requests.

---

### MODULE: Super Admin
**Status: Connected** — All pages use server-side `superAdminService.ts` which queries Prisma directly.

| Page | Service Function | File |
|------|-----------------|------|
| Dashboard | `getDashboardOverview()` | `app/dashboard/page.tsx` |
| Analytics | `getAnalytics()` | `app/analytics/page.tsx` |
| Approvals | `getApprovalWorkflows()` | `app/approvals/page.tsx` |
| API Management | `getAuditLogs()` | `app/api-management/page.tsx` |
| Audit Center | `getAuditLogs()` | `app/audit-center/page.tsx` |
| Audit Logs | `getAuditLogs()` | `app/audit-logs/page.tsx` |
| Billing | `getBilling()` | `app/billing/page.tsx` |
| Compliance | `getComplianceCenter()` | `app/compliance/page.tsx` |
| Compliance Center | `getComplianceCenter()` | `app/compliance-center/page.tsx` |
| Comply | `getComplianceCenter()` | `app/comply/page.tsx` |
| Feature Flags | `getGovernancePolicies()` | `app/feature-flags/page.tsx` |
| Insights | `getAnalytics()` | `app/insights/page.tsx` |
| Integrations | `getZoikoCoreXWorkflows()` | `app/integrations/page.tsx` |
| Notifications | `getAuditLogs()` | `app/notifications/page.tsx` |
| Organizations | `getOrganizations()` | `app/organizations/page.tsx` |
| Payroll | `getPayrollOperations()` | `app/payroll/page.tsx` |
| Payroll Operations | `getPayrollOperations()` | `app/payroll-operations/page.tsx` |
| Roles | `getRolePermissions()` | `app/roles/page.tsx` |
| Roles & Permissions | `getRolePermissions()` | `app/roles-permissions/page.tsx` |
| Security Center | `getGovernancePolicies()` | `app/security-center/page.tsx` |
| Settings | `getGovernancePolicies()` | `app/settings/page.tsx` |
| Subscriptions | `getSubscriptions()` | `app/subscriptions/page.tsx` |
| Support Center | `getApprovalWorkflows()` | `app/support-center/page.tsx` |
| System Health | `getSystemHealth()` | `app/system-health/page.tsx` |
| Tenants | `getTenants()` | `app/tenants/page.tsx` |
| Trust Center | `getGovernancePolicies()` | `app/trust-center/page.tsx` |
| Users | `getUsers()` | `app/users/page.tsx` |
| Zoiko CoreX | `getZoikoCoreXWorkflows()` | `app/zoikocorex/page.tsx` |
| Zoiko Pay | `getZoikoPayTransactions()` | `app/zoikopay/page.tsx` |
| Zoiko Time | `getPayrollOperations()` | `app/zoikotime/page.tsx` |

**Service File:** `app/services/superAdminService.ts` — uses Prisma directly (no HTTP layer)  
**Data Source:** PostgreSQL via Prisma ORM

---

### MODULE: Zoiko HR Root
**Status: Connected** — Uses `superAdminService.getDashboardOverview()` (server-side Prisma).

| Page | Status | Service Function | File |
|------|--------|-----------------|------|
| Root | **Connected** | `getDashboardOverview()` | `app/zoiko-hr/page.tsx` |

---

### Static Pages (No Data Fetching)

| Page | Status | File |
|------|--------|------|
| Login | **Static** (no data) — renders LoginForm client component which uses `fetch("/api/auth/login")` | `app/login/page.tsx` |
| Root (/) | **Static** (redirect) — redirects to `/login` or `/dashboard` | `app/page.tsx` |

---

## Cross-Cutting Findings

### 1. Unused API Service

**`app/services/dashboardService.ts`** is completely unused. No file in the project imports it.

```typescript
// Contents (unused):
export async function getDashboardData() {
  const response = await fetch("/api/dashboard");
  return response.json();
}
```

**Confidence: High** — `grep` across entire project found zero references.

### 2. No Broken Imports

All import paths across the project resolve correctly. The `@` alias in `tsconfig.json` maps to the project root.

### 3. Endpoints Referenced but Not Implemented

These URL patterns are called by `workforce-api.ts` (client-side) but have NO corresponding Next.js API route handler:

| Function Pattern | Called By Pages | Route Missing |
|-----------------|-----------------|---------------|
| All `fetchWF*` | 10 workforce-planning pages | `/api/zoiko-hr/workforce-planning/*` |
| All `fetchRecruit*` / `fetchCandidates` / `fetchInterviews` / `fetchJobOpenings` / `fetchOffers` | 6 recruitment pages | `/api/zoiko-hr/recruitment/*` |
| All `fetchESS*` | 11 ESS pages | `/api/zoiko-hr/ess/*` (reuses existing endpoints partially) |
| All `fetchSurvey*` / `fetchPulse*` / `fetchFeedbackCampaign*` / `fetchEngagement*` / `fetchSentiment*` / `fetchActionPlan*` | 11 engagement pages | `/api/zoiko-hr/engagement/*` |
| All `fetchLMS*` / `fetchCourse*` / `fetchLearningPath*` / `fetchCertification*` / `fetchAssessment*` / `fetchEnrollment*` | 7 learning pages | `/api/zoiko-hr/learning/*` |
| All `fetchCompensation*` / `fetchSalary*` / `fetchPayGrade*` / `fetchAllowance*` / `fetchDeduction*` / `fetchBenefit*` / `fetchBonus*` | 10 compensation pages | `/api/zoiko-hr/compensation/*` |
| All `fetchPolic*` / `fetchCompliance*` / `fetchViolation*` / `fetchCorrectiveAction*` / `fetchAcknowledgement*` / `fetchTrainingCompliance*` | 10 compliance pages | `/api/zoiko-hr/compliance/*` |
| All `fetchOnboarding*` / `fetchNewJoiner*` / `fetchProbation*` / `fetchWelcomeKit*` / `fetchAssetAllocation*` | 7 onboarding pages | `/api/zoiko-hr/onboarding/*` |
| All `fetchAsset*` (management) | 7 asset management pages | `/api/zoiko-hr/assets/*` |
| All `fetchTravel*` / `fetchExpense*` / `fetchReimbursement*` / `fetchCorporateTrip*` | 9 travel pages | `/api/zoiko-hr/travel/*` |
| All `fetchReward*` / `fetchAward*` / `fetchAchievement*` | 5 rewards pages | `/api/zoiko-hr/rewards/*` |
| `fetchEmployeeLifecycle*` / Lifecycle inline pages | 4 employee lifecycle pages | `/api/zoiko-hr/employee-lifecycle/*` |
| Helpdesk (mockData.ts) | 6 helpdesk pages | `/api/zoiko-hr/helpdesk/*` |

### 4. Hybrid Nature of `workforce-api.ts`

This single 5858-line file acts as **two completely different layers**:

| Section | Lines | Behavior |
|---------|-------|----------|
| Employees, Leave, Attendance, Performance, Departments, Designations, Documents | 1–1523 | **Real fetch()** to API routes |
| Recruitment, Onboarding, Assets, Learning, Compensation, ESS, Travel, Engagement, Compliance, Workforce Planning, Rewards | 1526–5858 | **Mock only** — operates on in-memory arrays |

There is **no conditional fallback** between real and mock. Each function is either always-real or always-mock.

### 5. Mock Data Volatility

All mock data is stored in **module-level mutable arrays** inside `workforce-api.ts`. Mutations (create/update/delete) use `.push()`/`.unshift()` and direct array mutation. Data is **lost on page refresh** — there is no persistence mechanism.

---

## Final Summary Table

| Module | Total Pages | Connected | Partial | Mock | Missing |
|--------|------------|-----------|---------|------|---------|
| **Super Admin** | 30 | 30 | 0 | 0 | 0 |
| **Workforce (Core HR)** | 9 | 9 | 0 | 0 | 0 |
| **Leave** | 6 | 6 | 0 | 0 | 0 |
| **Attendance** | 6 | 6 | 0 | 0 | 0 |
| **Departments** | 2 | 2 | 0 | 0 | 0 |
| **Designations** | 2 | 2 | 0 | 0 | 0 |
| **Documents** | 2 | 2 | 0 | 0 | 0 |
| **Performance** | 4 | 4 | 0 | 0 | 0 |
| **Workforce Planning** | 10 | 0 | 0 | 10 | 10 |
| **Recruitment** | 6 | 0 | 0 | 6 | 6 |
| **ESS** | 11 | 0 | 0 | 11 | 11 |
| **Engagement** | 11 | 0 | 0 | 11 | 11 |
| **Learning (LMS)** | 7 | 0 | 0 | 7 | 7 |
| **Compensation** | 10 | 0 | 0 | 10 | 10 |
| **Compliance** | 10 | 0 | 0 | 10 | 10 |
| **Employee Lifecycle** | 4 | 0 | 0 | 4 | 4 |
| **Onboarding** | 7 | 0 | 0 | 7 | 7 |
| **Assets** | 7 | 0 | 0 | 7 | 7 |
| **Travel** | 9 | 0 | 0 | 9 | 9 |
| **Rewards** | 5 | 0 | 0 | 5 | 5 |
| **Helpdesk** | 6 | 0 | 0 | 6 | 6 |
| **Zoiko HR Root** | 1 | 1 | 0 | 0 | 0 |
| **Login / Root** | 2 | 0 | 0 | 0 | 2 |
| **TOTAL** | **167** | **64** | **0** | **103** | **101** |

### Totals

- **Connected pages:** 64 (38.3%)
- **Partially connected:** 0 (0%)
- **Mock data pages:** 103 (61.7%)
- **Pages with no backend integration:** 101 (60.5%) — these 101 mock-only pages need API endpoints to be built

---

## Recommendations

1. **Convert mock sections of `workforce-api.ts` to real API calls** — For each mock-only section (Recruitment, Engagement, etc.), create corresponding Next.js API routes under `app/api/zoiko-hr/` and update the `workforce-api.ts` functions to call `fetch()` with real URLs.

2. **Remove `dashboardService.ts`** — It is dead code with zero imports.

3. **Consider splitting `workforce-api.ts`** — This 5858-line file mixes real API calls with mock data. Split into separate client libraries per module (e.g., `app/lib/recruitment-api.ts`, `app/lib/engagement-api.ts`, etc.) to improve maintainability.

4. **Align API naming conventions** — The real API routes follow `/api/zoiko-hr/{module}/{action}`. Mock sections in `workforce-api.ts` should follow the same convention.

5. **Add service files for missing modules** — Following the existing pattern (service → repository → Prisma), create service files for Recruitment, Engagement, Learning, Compensation, Compliance, Assets, Travel, Rewards, and Helpdesk modules.
