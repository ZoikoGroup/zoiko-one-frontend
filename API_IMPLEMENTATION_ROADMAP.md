# API Implementation Roadmap

> **Goal:** Replace all mock/static data with real API calls backed by Prisma models and Next.js API routes under `/api/zoiko-hr/*`.

---

## Overview

| # | Phase | Pages | APIs | Effort (eng days) | Risk | Prisma Status |
|---|-------|-------|------|-------------------|------|---------------|
| 1 | Recruitment | 6 | 18 | 8–10 | Low–Medium | NEW models needed |
| 2 | Assets | 7 | 11 | 6–8 | Low | NEW models needed |
| 3 | Travel | 9 | 10 | 8–10 | Medium | NEW models needed |
| 4 | Compliance | 10 | 25 | 5–7 | Low | ALL MODELS EXIST |
| 5 | Onboarding | 7 | 16 | 5–7 | Medium | Partial (3 new) |
| 6 | Learning | 7 | 11 | 6–8 | Low | NEW models needed |
| 7 | Compensation | 10 | 13 | 8–10 | High | NEW models needed |
| 8 | Engagement | 11 | 23 | 5–7 | Low | ALL MODELS EXIST |
| 9 | ESS | 11 | 13 | 6–8 | High | EXISTING TABLES |
| 10 | Rewards | 5 | 16 | 5–6 | Low | NEW models needed |
| 11 | Workforce Planning | 10 | 27 | 8–10 | Low | NEW models needed |
| 12 | Employee Lifecycle | 4 | 0 | 2–3 | Low | EXISTING TABLES |
| 13 | Helpdesk | 6 | 0 | 4–5 | Low | NEW models needed |
| | **Total** | **103** | **183** | **80–110** | | |

---

## Phase 1: Recruitment (Priority 1)

| Field | Detail |
|-------|--------|
| **Pages** | 6 — dashboard, candidates, interviews, job-openings, offers, reports |
| **APIs to create** | 18 — all mock functions need real endpoints |
| **Estimated effort** | 8–10 engineering days |
| **Risks** | Low–Medium — well-defined data model, no existing Prisma models |
| **Dependencies** | Employee, Department |
| **Prisma models** | JobOpening, Candidate, Interview, Offer, OfferStatus history — **NEW** |
| **Recommended approach** | 1. Create Prisma models (JobOpening, Candidate, Interview, Offer)  2. Create backend routes at `/api/zoiko-hr/recruitment/*`  3. Create `app/lib/api/recruitment.api.ts`  4. Replace mock functions in workforce-api.ts with re-exports  5. Update 6 page imports |

---

## Phase 2: Assets (Priority 2)

| Field | Detail |
|-------|--------|
| **Pages** | 7 — dashboard, allocation, categories, inventory, maintenance, reports, returns |
| **APIs to create** | 11 |
| **Estimated effort** | 6–8 engineering days |
| **Risks** | Low — straightforward CRUD |
| **Dependencies** | Employee |
| **Prisma models** | Asset, AssetCategory, AssetAllocation, AssetReturn, AssetMaintenance — **NEW** |
| **Recommended approach** | 1. Create Prisma models  2. Create backend routes at `/api/zoiko-hr/assets/*`  3. Create `app/lib/api/assets.api.ts`  4. Replace mock functions with real API calls |

---

## Phase 3: Travel (Priority 3)

| Field | Detail |
|-------|--------|
| **Pages** | 9 |
| **APIs to create** | 10 |
| **Estimated effort** | 8–10 engineering days |
| **Risks** | Medium — expense approval workflow is complex |
| **Dependencies** | Employee, Department, Approval workflow |
| **Prisma models** | TravelRequest, ExpenseClaim, ExpenseCategory, TravelApproval, Reimbursement, CorporateTrip, TravelPolicy — **NEW** |
| **Recommended approach** | 1. Create Prisma models  2. Create backend routes at `/api/zoiko-hr/travel/*`  3. Create `app/lib/api/travel.api.ts` |

---

## Phase 4: Compliance (Priority 4)

| Field | Detail |
|-------|--------|
| **Pages** | 10 |
| **APIs to create** | 25 |
| **Estimated effort** | 5–7 engineering days |
| **Risks** | Low |
| **Dependencies** | Employee, Department (minimal) |
| **Prisma models** | GovernancePolicy ✓, PolicyCategory ✓, PolicyAcknowledgement ✓, ComplianceRequirement ✓, ComplianceAudit ✓, PolicyViolation ✓, CorrectiveAction ✓, TrainingCompliance ✓ — **ALL EXIST** |
| **Recommended approach** | 1. Create backend routes at `/api/zoiko-hr/compliance/*`  2. Create `app/lib/api/compliance.api.ts`  3. Replace mock functions with real API calls  4. **Lowest-risk phase** because all Prisma models already exist |

---

## Phase 5: Onboarding (Priority 5)

| Field | Detail |
|-------|--------|
| **Pages** | 7 |
| **APIs to create** | 16 |
| **Estimated effort** | 5–7 engineering days |
| **Risks** | Medium — depends on Recruitment for new joiners flow |
| **Dependencies** | Recruitment (hired candidates become new joiners), Assets (asset allocation) |
| **Prisma models** | Probation ✓ (exists); OnboardingDocumentVerification, OnboardingAssetAllocation, OnboardingWelcomeKit — **3 NEW** |
| **Recommended approach** | 1. Create new Prisma models for onboarding-specific tracking  2. Create backend routes at `/api/zoiko-hr/onboarding/*`  3. Create `app/lib/api/onboarding.api.ts` |

---

## Phase 6: Learning (Priority 6)

| Field | Detail |
|-------|--------|
| **Pages** | 7 |
| **APIs to create** | 11 |
| **Estimated effort** | 6–8 engineering days |
| **Risks** | Low |
| **Dependencies** | Employee |
| **Prisma models** | LearningCourse, LearningPath, Certification, Assessment, Enrollment — **NEW** |
| **Recommended approach** | 1. Create Prisma models  2. Create backend routes at `/api/zoiko-hr/learning/*`  3. Create `app/lib/api/learning.api.ts` |

---

## Phase 7: Compensation (Priority 7)

| Field | Detail |
|-------|--------|
| **Pages** | 10 |
| **APIs to create** | 13 |
| **Estimated effort** | 8–10 engineering days |
| **Risks** | **High** — sensitive salary data, integration with Payroll |
| **Dependencies** | Employee, Payroll (existing), PayGrade |
| **Prisma models** | SalaryStructure, PayGrade, Allowance, Deduction, BenefitPlan, Bonus, CompensationReview, SalaryRevision — **NEW** |
| **Recommended approach** | 1. Create Prisma models with soft-delete and audit fields  2. Create backend routes at `/api/zoiko-hr/compensation/*`  3. Create `app/lib/api/compensation.api.ts`  4. Add authorization checks for sensitive data |

---

## Phase 8: Engagement (Priority 8)

| Field | Detail |
|-------|--------|
| **Pages** | 11 |
| **APIs to create** | 23 |
| **Estimated effort** | 5–7 engineering days |
| **Risks** | Low |
| **Dependencies** | Employee, Department |
| **Prisma models** | EngagementSurvey ✓, EngagementSurveyTemplate ✓, EngagementPulseSurvey ✓, EngagementFeedbackCampaign ✓, EngagementRecognitionProgram ✓, EngagementEmployeeRecognition ✓, EngagementScore ✓, EngagementSentimentAnalysis ✓, EngagementActionPlan ✓ — **ALL EXIST** |
| **Recommended approach** | 1. Create backend routes at `/api/zoiko-hr/engagement/*`  2. Create `app/lib/api/engagement.api.ts`  3. Fast implementation since all models exist |

---

## Phase 9: ESS (Priority 9)

| Field | Detail |
|-------|--------|
| **Pages** | 11 |
| **APIs to create** | 13 (all map to existing tables) |
| **Estimated effort** | 6–8 engineering days |
| **Risks** | **High** — depends on ALL upstream modules being real |
| **Dependencies** | Attendance ✓, Leave ✓, Performance ✓, Assets (Phase 2), Learning (Phase 6), Compensation (Phase 7) |
| **Prisma models** | Reads from existing tables: Attendance, LeaveRequest, LeaveBalance, EmployeeDocumentReference, AssetAllocation, Enrollment, PerformanceReview, Payslip, Notification |
| **Recommended approach** | 1. Create backend routes at `/api/zoiko-hr/ess/*`  2. Create `app/lib/api/ess.api.ts`  3. Frontend reads aggregated data from existing tables  4. **Must be done AFTER** all dependency modules are integrated |

---

## Phase 10: Rewards (Priority 10)

| Field | Detail |
|-------|--------|
| **Pages** | 5 |
| **APIs to create** | 16 |
| **Estimated effort** | 5–6 engineering days |
| **Risks** | Low |
| **Dependencies** | Employee, Engagement (recognition programs) |
| **Prisma models** | EmployeeAward, RewardsProgram, RewardPointBalance, RewardPointTransaction, Achievement — **NEW** |
| **Recommended approach** | 1. Create Prisma models  2. Create backend routes at `/api/zoiko-hr/rewards/*`  3. Create `app/lib/api/rewards.api.ts` |

---

## Phase 11: Workforce Planning (Priority 11)

| Field | Detail |
|-------|--------|
| **Pages** | 10 |
| **APIs to create** | 27 |
| **Estimated effort** | 8–10 engineering days |
| **Risks** | Low |
| **Dependencies** | Employee, Department, Recruitment |
| **Prisma models** | WFHeadcountPlan, WFWorkforceForecast, WFHiringPlan, WFCapacityPlan, WFSkillGap, WFSuccessionPlan, WFBudgetPlan, WFScenarioPlan — **NEW** |
| **Recommended approach** | 1. Create Prisma models  2. Create backend routes at `/api/zoiko-hr/workforce-planning/*`  3. Create `app/lib/api/workforce-planning.api.ts` |

---

## Phase 12: Employee Lifecycle (Priority 12)

| Field | Detail |
|-------|--------|
| **Pages** | 4 |
| **APIs to create** | 0 — maps to existing Employee / EmploymentRecord |
| **Estimated effort** | 2–3 engineering days |
| **Risks** | Low |
| **Dependencies** | Employee ✓ |
| **Prisma models** | Already exists in Employee, EmploymentRecord |
| **Recommended approach** | 1. Replace static arrays with real fetch calls  2. No new backend routes needed — reuse Employee API |

---

## Phase 13: Helpdesk (Priority 13)

| Field | Detail |
|-------|--------|
| **Pages** | 6 |
| **APIs to create** | 0 — standalone, fully static |
| **Estimated effort** | 4–5 engineering days |
| **Risks** | Low |
| **Dependencies** | Employee |
| **Prisma models** | HelpdeskTicket, HelpdeskCase, HelpdeskSLA, KnowledgeArticle, EmployeeRequest — **NEW** |
| **Recommended approach** | 1. Create Prisma models  2. Create backend routes  3. Create `app/lib/api/helpdesk.api.ts` |

---

## Dependency Graph

```
Phase 1: Recruitment         ◄── Employee, Department
Phase 2: Assets              ◄── Employee
Phase 3: Travel              ◄── Employee, Department, Approval workflow
Phase 4: Compliance          ◄── Employee, Department
Phase 5: Onboarding          ◄── Phase 1 (Recruitment), Phase 2 (Assets)
Phase 6: Learning            ◄── Employee
Phase 7: Compensation        ◄── Employee, Payroll, PayGrade
Phase 8: Engagement          ◄── Employee, Department
Phase 9: ESS                 ◄── Attendance, Leave, Performance, Phase 2, Phase 6, Phase 7
Phase 10: Rewards            ◄── Employee, Phase 8 (Engagement)
Phase 11: Workforce Planning ◄── Employee, Department, Phase 1 (Recruitment)
Phase 12: Employee Lifecycle ◄── Employee
Phase 13: Helpdesk           ◄── Employee
```

```
Execution order (recommended):

  Phase 4 (Compliance) ──────┐
  Phase 12 (Lifecycle) ──────┤
                              ├──► Phase 9 (ESS) ──► Phase 10 (Rewards)
  Phase 1 (Recruitment) ─────┤
  Phase 2 (Assets) ──────────┤
  Phase 6 (Learning) ────────┘
  Phase 8 (Engagement) ──────┘

  Phase 3 (Travel) ────────── independent, any time
  Phase 7 (Compensation) ──── independent, any time (but needed for Phase 9)
  Phase 11 (WF Planning) ──── after Phase 1
  Phase 5 (Onboarding) ────── after Phase 1 + Phase 2
  Phase 13 (Helpdesk) ─────── independent, any time
```

**ESS (Phase 9) must be the final phase** because it reads from Attendance, Leave, Performance, Assets, Learning, and Compensation.

---

## Bonus: Attendance Shifts Bug Fix

| Field | Detail |
|-------|--------|
| **File** | `attendance/shifts/page.tsx` |
| **Fix** | Import `createShift`, `updateShift`, `deleteShift` |
| **Estimated effort** | 0.5 engineering day |
| **Risks** | None |

These functions exist but are not imported in the shifts page, causing runtime errors when attempting to create, update, or delete shifts.

---

## Summary

| Metric | Value |
|--------|-------|
| **Total phases** | 13 |
| **Total pages** | ~103 |
| **Total APIs to create** | ~183 |
| **New Prisma models needed** | ~38 (across 10 phases) |
| **Existing models (ready to use)** | ~17 (Compliance + Engagement) |
| **Total estimated effort** | **80–110 engineering days** |
| **Fastest phases** | Compliance (5–7d), Engagement (5–7d), Employee Lifecycle (2–3d) |
| **Highest-risk phases** | Compensation (salary data), ESS (upstream dependency chain) |
| **Phases blocked on others** | Onboarding (Phase 1+2), ESS (Phases 2+6+7), Rewards (Phase 8), Workforce Planning (Phase 1) |
| **Recommended sprint order** | Phase 4 → Phase 12 → Phase 1 → Phase 2 → Phase 6 → Phase 8 → Phase 3 → Phase 7 → Phase 5 → Phase 11 → Phase 13 → Phase 10 → Phase 9 |
