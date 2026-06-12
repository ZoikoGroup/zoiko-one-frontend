# Zoiko One — Implementation Master Plan

> **Goal:** Replace all 183 mock functions with real API calls backed by Prisma models and Next.js API routes — 103 pages across 13 modules.
>
> **Target:** Single developer, 80–110 engineering days total.
>
> **Strategy:** Quick wins first (modules where all Prisma models already exist), then highest business value, then remaining CRUD modules, finally dependency-heavy modules.

---

## Table of Contents

1. [Architecture Reference](#1-architecture-reference)
2. [Execution Strategy](#2-execution-strategy)
3. [Tier 1 — Fast Wins (Models Exist)](#3-tier-1--fast-wins-models-exist)
   - [3a. Compliance](#3a-compliance)
   - [3b. Engagement](#3b-engagement)
4. [Tier 1a — High Business Value](#4-tier-1a--high-business-value)
   - [4a. Recruitment](#4a-recruitment)
5. [Tier 2 — Standard CRUD](#5-tier-2--standard-crud)
   - [5a. Assets](#5a-assets)
   - [5b. Learning](#5b-learning)
   - [5c. Rewards](#5c-rewards)
6. [Tier 3 — Complex / Blocked](#6-tier-3--complex--blocked)
   - [6a. Travel](#6a-travel)
   - [6b. Compensation](#6b-compensation)
   - [6c. Onboarding](#6c-onboarding)
7. [Tier 4 — Dependent / Lowest Priority](#7-tier-4--dependent--lowest-priority)
   - [7a. ESS](#7a-ess)
   - [7b. Workforce Planning](#7b-workforce-planning)
   - [7c. Employee Lifecycle](#7c-employee-lifecycle)
   - [7d. Helpdesk](#7d-helpdesk)
8. [Bonus Fixes](#8-bonus-fixes)
9. [Execution Roadmap](#9-execution-roadmap)
10. [Appendix: New Module Template](#10-appendix-new-module-template)

---

## 1. Architecture Reference

### File Layout

```
app/lib/api/
├── client.ts                  # Shared HTTP client — DO NOT MODIFY
├── types.ts                   # Shared response types — DO NOT MODIFY
├── index.ts                   # Barrel — DO NOT MODIFY
├── workforce.api.ts           # REAL — Employees, departments, designations, documents
├── leave.api.ts               # REAL — Leave types, requests, balances, calendar
├── attendance.api.ts          # REAL — Attendance records, shifts, check-in/out, reports
├── performance.api.ts         # REAL — Review cycles, reviews, goals, feedback
├── recruitment.api.ts         # TIER 1a — Job openings, candidates, interviews, offers
├── compliance.api.ts          # TIER 1 — Policies, audits, violations, corrective actions
├── engagement.api.ts          # TIER 1 — Surveys, pulse, campaigns, recognition, sentiment
├── assets.api.ts              # TIER 2 — Inventory, allocations, returns, maintenance
├── learning.api.ts            # TIER 2 — Courses, paths, certifications, assessments, enrollments
├── rewards.api.ts             # TIER 2 — Awards, programs, points, achievements
├── travel.api.ts              # TIER 3 — Requests, expenses, approvals, reimbursements
├── compensation.api.ts        # TIER 3 — Salary, pay grades, allowances, benefits, bonuses
├── onboarding.api.ts          # TIER 3 — New joiners, verification, asset allocation
├── ess.api.ts                 # TIER 4 — Employee self-service (aggregates 7 modules)
├── workforce-planning.api.ts  # TIER 4 — Headcount, forecasting, hiring, capacity
├── employee-lifecycle.api.ts  # TIER 4 — Transfers, promotions, separations
└── helpdesk.api.ts            # TIER 4 — Tickets, categories, knowledge base
```

### Import Chain

```
Page (.tsx)
  │  import { fetchJobs } from "@/lib/workforce-api"
  ▼
app/lib/workforce-api.ts        ← BACKWARD-COMPATIBILITY BARREL (never change page imports)
  ├── export * from "./api/workforce.api"         ← REAL
  ├── export * from "./api/leave.api"             ← REAL
  ├── export * from "./api/attendance.api"        ← REAL
  ├── export * from "./api/performance.api"       ← REAL
  ├── export * from "./api/recruitment.api"       ← NEW — add when created
  └── inline mock functions for remaining modules  ← Remove as each module is extracted
```

**Transition Rule:** When a new `*.api.ts` is created:
1. Create the file with real `apiFetch<T>()` calls
2. Add `export * from "./api/new-module.api"` to the re-export section of `workforce-api.ts`
3. Delete the inline types, mock data arrays, and mock functions from `workforce-api.ts`
4. Run `tsc --noEmit --skipLibCheck` — zero changes needed in any page

### Response Conventions

```typescript
// Single item
{ data: T }

// List with pagination
{ data: T[]; total: number; skip: number; take: number }

// Create/update response
{ data: T }

// Delete / action
{ ok: boolean }
```

### Filter Parameter Convention

```typescript
{ search?: string; status?: string; skip?: number; take?: number; orderBy?: string; orderDir?: string }
```

---

## 2. Execution Strategy

### Tiers Explained

| Tier | Rationale | Modules | Effort |
|------|-----------|---------|--------|
| **Tier 1** | All Prisma models exist — zero schema work | Compliance, Engagement | 10–14d |
| **Tier 1a** | Highest business value + simple data model | Recruitment | 8–10d |
| **Tier 2** | Standard CRUD, new models needed | Assets, Learning, Rewards | 17–22d |
| **Tier 3** | Complex workflows or blocked on dependencies | Travel, Compensation, Onboarding | 21–27d |
| **Tier 4** | Depends on upstream modules or aspirational | ESS, Workforce Planning, Lifecycle, Helpdesk | 20–26d |

### Single-Developer Execution Pattern (Per Module)

Each module follows the same 5-step pattern:

```
Step 1: Prisma models  ────→  schema.prisma (new models only)
Step 2: Backend routes ────→  app/api/zoiko-hr/{module}/*.ts
Step 3: API module     ────→  app/lib/api/{module}.api.ts
Step 4: Barrel update  ────→  workforce-api.ts (add re-export, delete mocks)
Step 5: Verify         ────→  tsc --noEmit --skipLibCheck + review each page
```

### Day-by-Day Breakdown Assumptions

- **Prisma models:** 0.5–1 day per module (new models only)
- **Backend routes:** 1–2 days per module (standard CRUD is faster)
- **API module (frontend):** 0.5–1 day per module
- **Integration + test:** 0.5–1 day per module
- **Buffer:** 20% overhead for bug fixes, documentation, review

---

## 3. Tier 1 — Fast Wins (Models Exist)

### 3a. Compliance

| Field | Value |
|-------|-------|
| **Pages** | 10 |
| **API functions** | 25 (currently mock in workforce-api.ts:2589–2907) |
| **Prisma models** | ALL 8 EXIST — GovernancePolicy, PolicyCategory, PolicyAcknowledgement, ComplianceRequirement, ComplianceAudit, PolicyViolation, CorrectiveAction, TrainingCompliance |
| **Endpoint blueprint** | `docs/api-blueprints/COMPLIANCE_API_BLUEPRINT.md` |
| **Effort** | 5–7 engineering days |

**Existing Prisma tables (all confirmed in schema.prisma):**

```
GovernancePolicy            → policies
PolicyCategory              → policy categories
PolicyAcknowledgement       → policy acknowledgements
ComplianceRequirement       → compliance requirements
ComplianceAudit             → audits
PolicyViolation             → violations
CorrectiveAction            → corrective actions
TrainingCompliance          → training compliance records
```

**API function reference (mock → real):**

| Mock Function | Real Endpoint | Method |
|---|---|---|
| `fetchComplianceDashboard` | GET `/api/zoiko-hr/compliance/dashboard` | GET |
| `fetchPolicies` | GET `/api/zoiko-hr/compliance/policies` | GET |
| `createPolicy` | POST `/api/zoiko-hr/compliance/policies` | POST |
| `updatePolicy` | PUT `/api/zoiko-hr/compliance/policies/{id}` | PUT |
| `fetchPolicyCategories` | GET `/api/zoiko-hr/compliance/policy-categories` | GET |
| `createPolicyCategory` | POST `/api/zoiko-hr/compliance/policy-categories` | POST |
| `updatePolicyCategory` | PUT `/api/zoiko-hr/compliance/policy-categories/{id}` | PUT |
| `fetchComplianceRequirements` | GET `/api/zoiko-hr/compliance/requirements` | GET |
| `createComplianceRequirement` | POST `/api/zoiko-hr/compliance/requirements` | POST |
| `updateComplianceRequirement` | PUT `/api/zoiko-hr/compliance/requirements/{id}` | PUT |
| `fetchAudits` | GET `/api/zoiko-hr/compliance/audits` | GET |
| `createAudit` | POST `/api/zoiko-hr/compliance/audits` | POST |
| `updateAuditStatus` | PUT `/api/zoiko-hr/compliance/audits/{id}/status` | PUT |
| `fetchViolations` | GET `/api/zoiko-hr/compliance/violations` | GET |
| `updateViolationStatus` | PUT `/api/zoiko-hr/compliance/violations/{id}/status` | PUT |
| `fetchCorrectiveActions` | GET `/api/zoiko-hr/compliance/corrective-actions` | GET |
| `createCorrectiveAction` | POST `/api/zoiko-hr/compliance/corrective-actions` | POST |
| `updateCorrectiveAction` | PUT `/api/zoiko-hr/compliance/corrective-actions/{id}` | PUT |
| `fetchAcknowledgements` | GET `/api/zoiko-hr/compliance/acknowledgements` | GET |
| `fetchTrainingCompliance` | GET `/api/zoiko-hr/compliance/training` | GET |
| `fetchComplianceTrends` | GET `/api/zoiko-hr/compliance/reports/trends` | GET |
| `fetchViolationByCategory` | GET `/api/zoiko-hr/compliance/reports/by-category` | GET |
| `fetchAuditCompletionData` | GET `/api/zoiko-hr/compliance/reports/audit-completion` | GET |
| `fetchDeptComplianceStats` | GET `/api/zoiko-hr/compliance/reports/dept-stats` | GET |
| `fetchPolicyAdherenceTrends` | GET `/api/zoiko-hr/compliance/reports/adherence` | GET |

**WARNING:** 8 blueprint endpoints have NO corresponding mock (`deletePolicy`, `deletePolicyCategory`, `deleteComplianceRequirement`, `createAcknowledgement`, `updateAcknowledgement`, `createViolation`, `updateViolation`, `updateCorrectiveActionStatus`). These are new additions — design and implement from scratch.

**Step-by-step tasks:**

```
Day 1:  Create app/api/zoiko-hr/compliance/ route handlers (dashboard + basic CRUD)
Day 2:  Continue route handlers (policies, categories, requirements)
Day 3:  Continue route handlers (audits, violations, corrective actions)
Day 4:  Finish route handlers (acknowledgements, training, reports)
Day 5:  Create app/lib/api/compliance.api.ts (25 functions)
Day 6:  Update workforce-api.ts — add re-export, delete mock section (lines 2352–2907)
Day 7:  Verify all 10 pages work, run tsc --noEmit --skipLibCheck
```

---

### 3b. Engagement

| Field | Value |
|-------|-------|
| **Pages** | 11 |
| **API functions** | 23 (currently mock in workforce-api.ts:3193–3462) |
| **Prisma models** | ALL 9 EXIST — EngagementSurvey, EngagementSurveyTemplate, EngagementPulseSurvey, EngagementFeedbackCampaign, EngagementRecognitionProgram, EngagementEmployeeRecognition, EngagementScore, EngagementSentimentAnalysis, EngagementActionPlan |
| **Endpoint blueprint** | `docs/api-blueprints/ENGAGEMENT_API_BLUEPRINT.md` |
| **Effort** | 5–7 engineering days |

**Step-by-step tasks:**

```
Day 1:  Create app/api/zoiko-hr/engagement/ route handlers (dashboard + surveys)
Day 2:  Continue route handlers (templates, pulse surveys, campaigns)
Day 3:  Continue route handlers (recognition programs, employee recognition)
Day 4:  Continue route handlers (scores, sentiment, action plans, reports)
Day 5:  Create app/lib/api/engagement.api.ts (23 functions)
Day 6:  Update workforce-api.ts — add re-export, delete mock section (lines 2909–3462)
Day 7:  Verify all 11 pages work, run tsc --noEmit --skipLibCheck
```

---

## 4. Tier 1a — High Business Value

### 4a. Recruitment

| Field | Value |
|-------|-------|
| **Pages** | 6 |
| **API functions** | 18 (currently mock in workforce-api.ts:154–371) |
| **Prisma models needed** | 4 NEW (JobOpening, Candidate, Interview, Offer) |
| **Endpoint blueprint** | `docs/api-blueprints/RECRUITMENT_API_BLUEPRINT.md` |
| **Effort** | 8–10 engineering days |

**New Prisma models (add to schema.prisma):**

```prisma
model JobOpening {
  id            String   @id @default(cuid())
  organizationId String
  tenantId      String
  title         String
  departmentId  String
  location      String?
  employmentType String  // FULL_TIME, PART_TIME, CONTRACT
  minExperience  Int?
  maxExperience  Int?
  salaryRange   String?
  description   String
  requirements  String?
  responsibilities String?
  status        String   @default("DRAFT") // DRAFT, OPEN, ON_HOLD, FILLED, CANCELLED
  openingsCount Int      @default(1)
  filledCount   Int      @default(0)
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  department    Department     @relation(fields: [departmentId], references: [id])
  candidates    Candidate[]
  interviews    Interview[]
  offers        Offer[]
}

model Candidate {
  id            String   @id @default(cuid())
  organizationId String
  tenantId      String
  jobOpeningId  String
  firstName     String
  lastName      String
  email         String   @unique
  phone         String?
  resumeUrl     String?
  coverLetter   String?
  source        String?  // REFERRAL, LINKEDIN, WEBSITE, AGENCY, OTHER
  status        String   @default("APPLIED") // APPLIED, SCREENING, SHORTLISTED, INTERVIEW_SCHEDULED, INTERVIEWED, OFFERED, HIRED, REJECTED, WITHDRAWN
  appliedDate   DateTime @default(now())
  rating        Float?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  jobOpening  JobOpening  @relation(fields: [jobOpeningId], references: [id])
  interviews  Interview[]
  offers      Offer[]
}

model Interview {
  id            String   @id @default(cuid())
  organizationId String
  tenantId      String
  candidateId   String
  jobOpeningId  String
  interviewers  String[] // array of employee IDs
  type          String   // PHONE, VIDEO, FACE_TO_FACE, TECHNICAL, HR, PANEL, FINAL
  scheduledAt   DateTime
  durationMin   Int?
  location      String?
  meetingLink   String?
  status        String   @default("SCHEDULED") // SCHEDULED, IN_PROGRESS, COMPLETED, CANCELLED, RESCHEDULED
  feedback      String?
  rating        Float?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  candidate  Candidate  @relation(fields: [candidateId], references: [id])
  jobOpening JobOpening @relation(fields: [jobOpeningId], references: [id])
}

model Offer {
  id            String   @id @default(cuid())
  organizationId String
  tenantId      String
  candidateId   String
  jobOpeningId  String
  salaryOffered Float?
  benefits      String?
  offerLetterUrl String?
  status        String   @default("DRAFT") // DRAFT, APPROVED, SENT, ACCEPTED, DECLINED, WITHDRAWN, EXPIRED
  sentAt        DateTime?
  respondedAt   DateTime?
  expiryDate    DateTime?
  notes         String?
  createdAt     DateTime @default(now())
  updatedAt     DateTime @updatedAt
  deletedAt     DateTime?

  candidate  Candidate  @relation(fields: [candidateId], references: [id])
  jobOpening JobOpening @relation(fields: [jobOpeningId], references: [id])
}
```

**NOTE:** The blueprint mentions `JobApplication` as a separate model — this has been merged into `Candidate` for simplicity. Use Candidate fields (`appliedDate`, `source`, `status`) to track the application.

**WARNING:** 2 blueprint endpoints have NO corresponding mock (`GET /jobs/{id}`, source-effectiveness report). Add `fetchJobOpening(id)` as a new function and the report as a new function. Additionally, `fetchMonthlyRecruitmentActivity` exists as a mock in the reports page but is undocumented in the blueprint — add it to the blueprint.

**Step-by-step tasks:**

```
Day 1:  Add JobOpening, Candidate, Interview, Offer models to schema.prisma
Day 2:  Run prisma migrate dev — create database tables
Day 3:  Create app/api/zoiko-hr/recruitment/ route handlers (dashboard + job openings CRUD)
Day 4:  Continue route handlers (candidates CRUD + stage updates)
Day 5:  Continue route handlers (interviews CRUD, offers CRUD + status updates)
Day 6:  Continue route handlers (reports — funnel, time-to-hire, acceptance rate, activity)
Day 7:  Create app/lib/api/recruitment.api.ts (18 functions)
Day 8:  Update workforce-api.ts — add re-export, delete mock section (lines 7–371)
Day 9:  Verify all 6 pages, run tsc --noEmit --skipLibCheck
```

---

## 5. Tier 2 — Standard CRUD

### 5a. Assets

| Field | Value |
|-------|-------|
| **Pages** | 7 (6 mock + 1 static) |
| **API functions** | 11 (currently mock in workforce-api.ts:857–968) |
| **Prisma models needed** | 5 NEW (Asset, AssetCategory, AssetAllocation, AssetReturn, AssetMaintenance) |
| **Endpoint blueprint** | `docs/api-blueprints/ASSETS_API_BLUEPRINT.md` |
| **Effort** | 6–8 engineering days |
| **Dependencies** | Employee table (for allocation tracking) — ✅ EXISTS |

**Step-by-step tasks:**

```
Day 1:  Add Asset, AssetCategory, AssetAllocation, AssetReturn, AssetMaintenance to schema.prisma
Day 2:  Run prisma migrate dev
Day 3:  Create app/api/zoiko-hr/assets/ route handlers (dashboard + inventory + categories)
Day 4:  Continue route handlers (allocations, returns, maintenance)
Day 5:  Continue route handlers (reports — utilization, dept allocation, cost, lifecycle)
Day 6:  Create app/lib/api/assets.api.ts (11 functions)
Day 7:  Update workforce-api.ts — delete asset mock section (lines 724–968)
Day 8:  Fix assets/categories/page.tsx (currently STATIC — inline hardcoded) to use real API
         Verify all 7 pages, run tsc --noEmit --skipLibCheck
```

**⚠️ Note:** The `assets/categories/page.tsx` page is currently STATIC (inline hardcoded data) — it needs to be updated to call the real API after the backend route is created. This is the **only static-to-real migration** in the entire plan.

---

### 5b. Learning

| Field | Value |
|-------|-------|
| **Pages** | 7 |
| **API functions** | 11 (currently mock in workforce-api.ts:1144–1291) |
| **Prisma models needed** | 5 NEW (LearningCourse, LearningPath, Certification, Assessment, Enrollment) |
| **Endpoint blueprint** | `docs/api-blueprints/LEARNING_API_BLUEPRINT.md` |
| **Effort** | 6–8 engineering days |

**Step-by-step tasks:**

```
Day 1:  Add LearningCourse, LearningPath, Certification, Assessment, Enrollment to schema.prisma
Day 2:  Run prisma migrate dev
Day 3:  Create app/api/zoiko-hr/learning/ route handlers (dashboard + courses + paths)
Day 4:  Continue route handlers (certifications, assessments, enrollments)
Day 5:  Continue route handlers (reports — progress, completion, dept stats, skill trends)
Day 6:  Create app/lib/api/learning.api.ts (11 functions)
Day 7:  Update workforce-api.ts — delete learning mock section (lines 969–1291)
Day 8:  Verify all 7 pages, run tsc --noEmit --skipLibCheck
```

---

### 5c. Rewards

| Field | Value |
|-------|-------|
| **Pages** | 5 |
| **API functions** | 16 (currently mock in workforce-api.ts:4108–4339) |
| **Prisma models needed** | 5 NEW (EmployeeAward, RewardsRecognitionProgram, RewardPointBalance, RewardPointTransaction, Achievement) |
| **Endpoint blueprint** | `docs/api-blueprints/REWARDS_API_BLUEPRINT.md` |
| **Effort** | 5–6 engineering days |
| **Dependencies** | Engagement recognition program (Tier 1) — ✅ EXISTS after Tier 1 |

**Step-by-step tasks:**

```
Day 1:  Add models to schema.prisma, run prisma migrate dev
Day 2:  Create app/api/zoiko-hr/rewards/ route handlers (dashboard + awards CRUD)
Day 3:  Continue route handlers (programs, points, transactions, achievements)
Day 4:  Create app/lib/api/rewards.api.ts (16 functions)
Day 5:  Update workforce-api.ts — delete rewards mock section (lines 4047–4339)
Day 6:  Verify all 5 pages, run tsc --noEmit --skipLibCheck
```

---

## 6. Tier 3 — Complex / Blocked

### 6a. Travel

| Field | Value |
|-------|-------|
| **Pages** | 9 |
| **API functions** | 10 (currently mock in workforce-api.ts:2214–2350) |
| **Prisma models needed** | 7 NEW (TravelRequest, ExpenseClaim, ExpenseCategory, TravelApproval, Reimbursement, CorporateTrip, TravelPolicy) |
| **Endpoint blueprint** | `docs/api-blueprints/TRAVEL_API_BLUEPRINT.md` |
| **Effort** | 8–10 engineering days |
| **Risk** | Medium — expense approval workflow is the most complex workflow in the app |

**Key design decisions:**
- TravelApproval follows the same multi-level pattern as LeaveApproval (reuse the existing pattern)
- Expense claim status flow: DRAFT → SUBMITTED → APPROVED → REIMBURSED (or REJECTED)
- Reimbursement is a separate model to support batch/partial reimbursements

**Step-by-step tasks:**

```
Day 1:  Add 7 Travel models to schema.prisma, run prisma migrate dev
Day 2:  Create app/api/zoiko-hr/travel/ route handlers (dashboard + travel requests)
Day 3:  Continue route handlers (expense claims + categories)
Day 4:  Continue route handlers (approvals — multi-level approval logic)
Day 5:  Continue route handlers (reimbursements, corporate trips, policies)
Day 6:  Continue route handlers (reports — expense reports, dept data)
Day 7:  Create app/lib/api/travel.api.ts (10 functions)
Day 8:  Update workforce-api.ts — delete travel mock section (lines 1985–2350)
Day 9:  Verify all 9 pages, run tsc --noEmit --skipLibCheck
```

---

### 6b. Compensation

| Field | Value |
|-------|-------|
| **Pages** | 10 |
| **API functions** | 13 (currently mock in workforce-api.ts:1521–1687) |
| **Prisma models needed** | 8 NEW (SalaryStructure, PayGrade, Allowance, Deduction, BenefitPlan, Bonus, CompensationReview, SalaryRevision) |
| **Endpoint blueprint** | `docs/api-blueprints/COMPENSATION_API_BLUEPRINT.md` |
| **Effort** | 8–10 engineering days |
| **Risk** | **HIGH** — sensitive salary data, needs authorization middleware |

**Key design decisions:**
- ALL compensation endpoints must check the authenticated user's role before returning salary data
- Soft-delete required for all compensation models (financial audit trail)
- SalaryRevision stores a snapshot of the full salary structure at the time of revision

**Step-by-step tasks:**

```
Day 1:  Add 8 Compensation models to schema.prisma, run prisma migrate dev
Day 2:  Design authorization middleware for salary-level access
Day 3:  Create app/api/zoiko-hr/compensation/ route handlers (dashboard + salary structures)
Day 4:  Continue route handlers (pay grades, allowances, deductions)
Day 5:  Continue route handlers (benefits, bonuses)
Day 6:  Continue route handlers (comp reviews, salary revisions, reports)
Day 7:  Create app/lib/api/compensation.api.ts (13 functions)
Day 8:  Update workforce-api.ts — delete compensation mock section (lines 1293–1687)
Day 9:  Verify all 10 pages, run tsc --noEmit --skipLibCheck
```

---

### 6c. Onboarding

| Field | Value |
|-------|-------|
| **Pages** | 7 |
| **API functions** | 16 (currently mock in workforce-api.ts:555–723) |
| **Prisma models needed** | 3 NEW (OnboardingDocumentVerification, OnboardingAssetAllocation, OnboardingWelcomeKit) + EXISTING (Probation) |
| **Endpoint blueprint** | `docs/api-blueprints/ONBOARDING_API_BLUEPRINT.md` |
| **Effort** | 5–7 engineering days |
| **Blocked on** | Recruitment (Tier 1a) — new joiners come from hired candidates |

**Step-by-step tasks:**

```
Day 1:  Add 3 Onboarding models to schema.prisma (note: Probation ✅ already exists)
Day 2:  Run prisma migrate dev
Day 3:  Create app/api/zoiko-hr/onboarding/ route handlers (dashboard + new joiners)
Day 4:  Continue route handlers (document verification, asset allocation)
Day 5:  Continue route handlers (welcome kits, probations)
Day 6:  Continue route handlers (reports — completion rate, dept onboarding, trends)
Day 7:  Create app/lib/api/onboarding.api.ts (16 functions)
Day 8:  Update workforce-api.ts — delete onboarding mock section (lines 372–723)
Day 9:  Verify all 7 pages, run tsc --noEmit --skipLibCheck
```

---

## 7. Tier 4 — Dependent / Lowest Priority

### 7a. ESS

| Field | Value |
|-------|-------|
| **Pages** | 11 |
| **API functions** | 13 (currently mock in workforce-api.ts:1921–1984) |
| **Prisma models** | 0 NEW — reads from existing tables: Attendance, LeaveRequest, LeaveBalance, EmployeeDocumentReference, AssetAllocation, Enrollment, PerformanceReview, Payslip, Notification |
| **Endpoint blueprint** | `docs/api-blueprints/ESS_API_BLUEPRINT.md` |
| **Effort** | 6–8 engineering days |
| **Blocked on** | ALL 7 upstream modules must be integrated first (Attendance ✅, Leave ✅, Performance ✅, Assets — Tier 2, Learning — Tier 2, Compensation — Tier 3) |

**Key design decisions:**
- ESS is a **read-only aggregation layer** — it reads from other modules' tables filtered by the current employee
- Needs session-based auth middleware to derive the employee ID (never from request body)
- ESS backend routes are thin wrappers: they query upstream tables with a `WHERE employeeId = session.user.id` filter

**Step-by-step tasks:**

```
Day 1:  Design ESS auth middleware — extract employee ID from session context
Day 2:  Create app/api/zoiko-hr/ess/ route handlers (dashboard + profile + attendance)
Day 3:  Continue route handlers (leave, documents, assets)
Day 4:  Continue route handlers (learning, performance, payslips)
Day 5:  Continue route handlers (requests, notifications)
Day 6:  Create app/lib/api/ess.api.ts (13 functions)
Day 7:  Update workforce-api.ts — delete ESS mock section (lines 1688–1984)
Day 8:  Verify all 11 pages, run tsc --noEmit --skipLibCheck
```

---

### 7b. Workforce Planning

| Field | Value |
|-------|-------|
| **Pages** | 10 |
| **API functions** | 27 (currently mock in workforce-api.ts:3705–4045) |
| **Prisma models needed** | 8 NEW (WFHeadcountPlan, WFWorkforceForecast, WFHiringPlan, WFCapacityPlan, WFSkillGap, WFSuccessionPlan, WFBudgetPlan, WFScenarioPlan) |
| **Endpoint blueprint** | `docs/api-blueprints/WORKFORCE_PLANNING_API_BLUEPRINT.md` |
| **Effort** | 8–10 engineering days |
| **Priority** | Lowest — this is an aspirational module (planning/forecasting) |

**Step-by-step tasks:**

```
Day 1:  Add 8 Wf models to schema.prisma, run prisma migrate dev
Day 2:  Create app/api/zoiko-hr/workforce-planning/ route handlers (dashboard + headcount)
Day 3:  Continue (forecasts, hiring plans, capacity)
Day 4:  Continue (skill gaps, succession, budget, scenarios)
Day 5:  Continue (reports — all 6)
Day 6:  Create app/lib/api/workforce-planning.api.ts (27 functions)
Day 7:  Update workforce-api.ts — delete WF planning mock section (lines 3464–4045)
Day 8:  Verify all 10 pages, run tsc --noEmit --skipLibCheck
```

---

### 7c. Employee Lifecycle

| Field | Value |
|-------|-------|
| **Pages** | 4 |
| **API functions** | 0 — all 4 pages are STATIC (inline hardcoded data) |
| **Prisma models** | 0 NEW — uses existing Employee, EmploymentRecord |
| **Effort** | 2–3 engineering days |
| **Note** | This module has NO mock functions to migrate — it needs API design from scratch |

**Step-by-step tasks:**

```
Day 1:  Create app/api/zoiko-hr/employee-lifecycle/ route handlers (events, transfers, promotions, separations)
Day 2:  Create app/lib/api/employee-lifecycle.api.ts (6–8 new functions)
Day 3:  Update 4 static pages to call real API instead of using inline data
         Run tsc --noEmit --skipLibCheck
```

---

### 7d. Helpdesk

| Field | Value |
|-------|-------|
| **Pages** | 6 |
| **API functions** | 0 — all 6 pages use inline `mockData.ts` (NOT workforce-api.ts) |
| **Prisma models needed** | 5 NEW (HelpdeskTicket, HelpdeskCase, HelpdeskSLA, KnowledgeArticle, EmployeeRequest) |
| **Effort** | 4–5 engineering days |
| **Note** | Helpdesk is structurally different — mock data lives in `app/zoiko-hr/helpdesk/mockData.ts`, not in workforce-api.ts |

**Step-by-step tasks:**

```
Day 1:  Add 5 Helpdesk models to schema.prisma, run prisma migrate dev
Day 2:  Create app/api/zoiko-hr/helpdesk/ route handlers (tickets, categories, articles)
Day 3:  Continue route handlers (cases, SLAs, employee requests)
Day 4:  Create app/lib/api/helpdesk.api.ts (6–8 new functions)
Day 5:  Update 6 pages to import from helpdesk.api.ts instead of mockData.ts
         Delete mockData.ts after migration
         Run tsc --noEmit --skipLibCheck
```

---

## 8. Bonus Fixes

These are low-effort, high-impact fixes that can be done during any sprint gap:

### 8.1 Attendance Shifts Missing Imports

| Field | Value |
|-------|-------|
| **File** | `app/zoiko-hr/attendance/shifts/page.tsx` |
| **Problem** | 44 TypeScript errors because `createShift`, `updateShift`, `deleteShift` are not imported |
| **Fix** | Add 3 import lines to the page |
| **Effort** | 0.5 day |

### 8.2 Documentation Discrepancies (8 issues)

| # | File | Fix |
|---|------|-----|
| 1 | `FULL_APPLICATION_AUDIT.md` | Add 8 missing module detail sections (attendance, leave, performance, workforce, departments, designations, documents, zoiko-hr root) |
| 2 | `API_INVENTORY.md` | Fix summary arithmetic: `3 + 33 + 12 + 15 + 20 = 83` — show `80 numbered + 3 utilities = 83` |
| 3 | `FRONTEND_BACKEND_MAPPING.md` | Add `fetchMonthlyRecruitmentActivity` to recruitment reports row |
| 4 | `FRONTEND_BACKEND_MAPPING.md` | Remove `updateAssetItemStatus` from assets inventory row |
| 5 | `RECRUITMENT_API_BLUEPRINT.md` | Document `fetchMonthlyRecruitmentActivity`, add `GET /jobs/{id}`, add source-effectiveness report |
| 6 | `COMPLIANCE_API_BLUEPRINT.md` | Note 8 CRUD functions as new additions (no mocks exist) |
| 7 | `ESS_API_BLUEPRINT.md` | Fix pagination description (client-side, not server-side), align dashboard shape |
| 8 | — | All docs: naming conventions are clean, no cosmetic issues |

---

## 9. Execution Roadmap

### Sprint 1: Foundation + Quick Wins (Weeks 1–3)

| Week | Module | Focus | Output |
|------|--------|-------|--------|
| 1a | Bonus Fix 8.1 | Shifts missing imports | 44 TS errors fixed |
| 1b | Bonus Fix 8.2 | Documentation fixes | 7 docs corrected |
| 1c–2a | **Compliance** (Tier 1) | 10 pages, 25 APIs, all models exist | Full compliance API module |
| 2b–3a | **Engagement** (Tier 1) | 11 pages, 23 APIs, all models exist | Full engagement API module |
| 3b | Buffer / review | Integration test all 21 pages | Clean tsc run |

**Deliverable:** 2 modules complete (21 pages, 48 APIs), 51 TS errors fixed.

### Sprint 2: Business Value (Weeks 4–6)

| Week | Module | Focus | Output |
|------|--------|-------|--------|
| 4 | **Recruitment** (Tier 1a) | 4 new Prisma models | Schema migration |
| 5 | Recruitment (cont.) | Backend routes + API module | Full recruitment API module |
| 6 | Recruitment integration | Barrel update, mock removal, test | 6 pages go real |

**Deliverable:** 3 modules complete (27 pages, 66 APIs).

### Sprint 3: Standard CRUD (Weeks 7–10)

| Week | Module | Focus | Output |
|------|--------|-------|--------|
| 7 | **Assets** (Tier 2) | 5 new Prisma models + routes | Full assets API module |
| 8 | **Learning** (Tier 2) | 5 new Prisma models + routes | Full learning API module |
| 9 | **Rewards** (Tier 2) | 5 new Prisma models + routes | Full rewards API module |
| 10 | Buffer / review | Integration test all 39 pages | Clean tsc run |

**Deliverable:** 6 modules complete (46 pages, 93 APIs).

### Sprint 4: Complex Modules (Weeks 11–14)

| Week | Module | Focus | Output |
|------|--------|-------|--------|
| 11 | **Travel** (Tier 3) | 7 new Prisma models + routes | Full travel API module |
| 12 | **Compensation** (Tier 3) | 8 new Prisma models + auth + routes | Full compensation API module |
| 13 | **Onboarding** (Tier 3) | 3 new Prisma models + routes | Full onboarding API module |
| 14 | Buffer / review | Integration test all 72 pages | Clean tsc run |

**Deliverable:** 9 modules complete (72 pages, 136 APIs).

### Sprint 5: Remaining + Dependency-Heavy (Weeks 15–18)

| Week | Module | Focus | Output |
|------|--------|-------|--------|
| 15 | **ESS** (Tier 4) | Auth middleware + aggregation routes | Full ESS API module |
| 16 | **Workforce Planning** (Tier 4) | 8 new Prisma models + routes | Full WF planning API module |
| 17 | **Employee Lifecycle** + **Helpdesk** (Tier 4) | 5 new models + new API functions | Full lifecycle + helpdesk modules |
| 18 | Final integration test | Verify all 103 pages | Clean tsc run, milestone complete |

**Deliverable:** All 13 modules complete (103 pages, 183 APIs → all real).

### Cumulative Progress

```
Sprint 1:  2 modules  21 pages  48 APIs  (Tier 1)
Sprint 2:  1 module   27 pages  66 APIs  (Tier 1a)
Sprint 3:  3 modules  46 pages  93 APIs  (Tier 2)
Sprint 4:  3 modules  72 pages  136 APIs (Tier 3)
Sprint 5:  4 modules  103 pages 183 APIs (Tier 4)

Total:     13 modules 103 pages 183 APIs  (80–110 engineering days)
```

---

## 10. Appendix: New Module Template

When creating a new `*.api.ts` file, use this exact template:

```typescript
import { apiFetch, buildUrl } from "./client";

// ── Types ────────────────────────────────────────────

export interface MyEntity {
  id: string;
  // ... fields
}

export interface MyEntityListResponse {
  data: MyEntity[];
  total: number;
  skip: number;
  take: number;
}

// ── Constants ────────────────────────────────────────

const BASE = "/api/zoiko-hr/module";

// ── CRUD Functions ───────────────────────────────────

export async function fetchEntities(filters?: {
  search?: string;
  status?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: string;
}): Promise<MyEntityListResponse> {
  const url = buildUrl(BASE, {
    search: filters?.search,
    status: filters?.status,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  return apiFetch<MyEntityListResponse>(url);
}

export async function fetchEntity(id: string): Promise<{ data: MyEntity }> {
  return apiFetch<{ data: MyEntity }>(`${BASE}/${id}`);
}

export async function createEntity(body: {
  // fields
}): Promise<{ data: MyEntity }> {
  return apiFetch<{ data: MyEntity }>(BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateEntity(id: string, body: {
  // partial fields
}): Promise<{ data: MyEntity }> {
  return apiFetch<{ data: MyEntity }>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteEntity(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${BASE}/${id}`, { method: "DELETE" });
}
```

### Barrel Update Pattern

In `app/lib/workforce-api.ts`, add to the re-export section (after line 4):

```typescript
export * from "./api/compliance.api";
export * from "./api/engagement.api";
```

Then delete the corresponding mock section (types + mock data arrays + mock functions).

### Backend Route Pattern

For each API module, create a route handler:

```typescript
// app/api/zoiko-hr/module/route.ts
import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const skip = parseInt(searchParams.get("skip") ?? "0");
  const take = parseInt(searchParams.get("take") ?? "20");

  const [data, total] = await Promise.all([
    prisma.myEntity.findMany({ skip, take }),
    prisma.myEntity.count(),
  ]);

  return NextResponse.json({ data, total, skip, take });
}

export async function POST(req: NextRequest) {
  const body = await req.json();
  const data = await prisma.myEntity.create({ data: body });
  return NextResponse.json({ data }, { status: 201 });
}
```

### Verification Checklist (Per Module)

- [ ] `tsc --noEmit --skipLibCheck` passes with zero new errors
- [ ] All pages render without 404/500 errors
- [ ] All CRUD operations succeed (create, read, update, delete)
- [ ] Pagination works on list pages
- [ ] Filter/sort parameters work on list pages
- [ ] Dashboard aggregates match Prisma query results
- [ ] Report endpoints return correct shapes
- [ ] workforce-api.ts barrel re-export is correctly added
- [ ] workforce-api.ts mock section is fully deleted (no leftover types)
- [ ] No circular dependency warnings
