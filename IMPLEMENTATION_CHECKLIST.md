# Implementation Checklist — Recruitment Module

> **Module:** Recruitment (6 pages, 18 API functions, 4 new Prisma models)  
> **Target:** Replace all mock functions in `workforce-api.ts` (lines 7–370) with real Prisma-backed API

---

## Phase 1: Prisma Schema Models

- [x] **JobOpening** model defined (`prisma/schema.prisma`)
  - Fields: id, organizationId, tenantId, title, departmentId, location, employmentType, minExperience, maxExperience, salaryMin, salaryMax, description, requirements, responsibilities, status, openingsCount, filledCount, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, deletionReason
  - Relations: Department, Candidate[], Interview[], Offer[]
  - Indexes: tenantId+organizationId, status, departmentId, title

- [x] **Candidate** model defined
  - Fields: id, organizationId, tenantId, jobOpeningId, firstName, lastName, email, phone, resumeUrl, coverLetter, source, status, appliedDate, rating, notes, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, deletionReason
  - Relations: JobOpening, Interview[], Offer[]
  - Indexes: tenantId+organizationId, status, jobOpeningId, email

- [x] **Interview** model defined
  - Fields: id, organizationId, tenantId, candidateId, jobOpeningId, interviewers, type, scheduledAt, durationMin, location, meetingLink, status, feedback, rating, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, deletionReason
  - Relations: Candidate, JobOpening
  - Indexes: tenantId+organizationId, status, candidateId, jobOpeningId, scheduledAt

- [x] **Offer** model defined
  - Fields: id, organizationId, tenantId, candidateId, jobOpeningId, salaryOffered, benefits, offerLetterUrl, status, sentAt, respondedAt, expiryDate, notes, createdAt, createdBy, updatedAt, updatedBy, deletedAt, deletedBy, deletionReason
  - Relations: Candidate, JobOpening
  - Indexes: tenantId+organizationId, status, candidateId, jobOpeningId

## Phase 2: Repository Layer

- [x] `app/repositories/recruitmentRepository.ts` created
  - `RecruitmentRepository` class with methods:
    - `countJobs()`, `findJobs()`, `findJobById()`
    - `createJob()`, `updateJob()`, `softDeleteJob()`
    - `countCandidates()`, `findCandidates()`, `findCandidateById()`
    - `createCandidate()`, `updateCandidate()`
    - `findInterviews()`, `findInterviewById()`
    - `createInterview()`, `updateInterview()`
    - `findOffers()`, `findOfferById()`
    - `createOffer()`, `updateOffer()`
    - Dashboard aggregate queries
    - Report aggregate queries

## Phase 3: Service Layer

- [x] `app/services/recruitmentService.ts` created
  - Security context enforcement on every function
  - Validation: required fields, stage progression rules, salary rules
  - Audit logging via `writeAudit()`
  - Business logic: stage progression, offer-to-hire flow
  - Functions:
    - Dashboard: `getRecruitmentDashboard()`
    - Jobs: `listJobs()`, `getJob()`, `createJob()`, `updateJob()`, `closeJob()`
    - Candidates: `listCandidates()`, `updateCandidateStage()`
    - Interviews: `listInterviews()`, `scheduleInterview()`, `updateInterviewStatus()`
    - Offers: `listOffers()`, `createOffer()`, `updateOfferStatus()`
    - Reports: `getHiringFunnel()`, `getTimeToHire()`, `getSourceEffectiveness()`, `getOfferAcceptanceRate()`, `getDepartmentHiring()`, `getMonthlyActivity()`

## Phase 4: API Routes

- [x] `app/api/zoiko-hr/recruitment/route.ts` — Dashboard + Jobs list + Create job
- [x] `app/api/zoiko-hr/recruitment/[id]/route.ts` — Get/update/close a job opening
- [x] `app/api/zoiko-hr/recruitment/candidates/route.ts` — List candidates
- [x] `app/api/zoiko-hr/recruitment/candidates/[id]/stage/route.ts` — Update candidate stage
- [x] `app/api/zoiko-hr/recruitment/interviews/route.ts` — List + create interviews
- [x] `app/api/zoiko-hr/recruitment/interviews/[id]/status/route.ts` — Update interview status
- [x] `app/api/zoiko-hr/recruitment/offers/route.ts` — List + create offers
- [x] `app/api/zoiko-hr/recruitment/offers/[id]/status/route.ts` — Update offer status
- [x] `app/api/zoiko-hr/recruitment/reports/` — 6 report endpoints

## Phase 5: Frontend API Integration

- [x] `app/lib/api/recruitment.api.ts` created — 18 functions matching mock signatures
- [x] `app/lib/workforce-api.ts` updated — add re-export, delete mock section (lines 7–370)

## Phase 6: Verification

- [x] `tsc --noEmit --skipLibCheck` passes with zero new errors
- [x] All 6 recruitment pages render without errors
- [x] No circular dependency warnings

---

## Mock Function → Real Endpoint Mapping

| # | Mock Function | HTTP | Endpoint | Repository Method |
|---|---|---|---|---|
| 1 | `fetchRecruitmentDashboard()` | GET | `/api/zoiko-hr/recruitment/dashboard` | `getDashboardStats()` |
| 2 | `fetchJobOpenings()` | GET | `/api/zoiko-hr/recruitment` | `findJobs()` |
| 3 | `createJobOpening()` | POST | `/api/zoiko-hr/recruitment` | `createJob()` |
| 4 | `updateJobOpening()` | PUT | `/api/zoiko-hr/recruitment/{id}` | `updateJob()` |
| 5 | `closeJobOpening()` | PUT | `/api/zoiko-hr/recruitment/{id}/close` | `softDeleteJob()` |
| 6 | `fetchCandidates()` | GET | `/api/zoiko-hr/recruitment/candidates` | `findCandidates()` |
| 7 | `updateCandidateStage()` | PATCH | `/api/zoiko-hr/recruitment/candidates/{id}/stage` | `updateCandidate()` |
| 8 | `fetchInterviews()` | GET | `/api/zoiko-hr/recruitment/interviews` | `findInterviews()` |
| 9 | `createInterview()` | POST | `/api/zoiko-hr/recruitment/interviews` | `createInterview()` |
| 10 | `updateInterviewStatus()` | PATCH | `/api/zoiko-hr/recruitment/interviews/{id}/status` | `updateInterview()` |
| 11 | `fetchOffers()` | GET | `/api/zoiko-hr/recruitment/offers` | `findOffers()` |
| 12 | `createOffer()` | POST | `/api/zoiko-hr/recruitment/offers` | `createOffer()` |
| 13 | `updateOfferStatus()` | PATCH | `/api/zoiko-hr/recruitment/offers/{id}/status` | `updateOffer()` |
| 14 | `fetchRecruitmentFunnel()` | GET | `/api/zoiko-hr/recruitment/reports/hiring-funnel` | aggregate |
| 15 | `fetchTimeToHire()` | GET | `/api/zoiko-hr/recruitment/reports/time-to-hire` | aggregate |
| 16 | `fetchOfferAcceptanceRate()` | GET | `/api/zoiko-hr/recruitment/reports/offer-acceptance` | aggregate |
| 17 | `fetchHiringByDepartment()` | GET | `/api/zoiko-hr/recruitment/reports/department-hiring` | aggregate |
| 18 | `fetchMonthlyRecruitmentActivity()` | GET | `/api/zoiko-hr/recruitment/reports/monthly-activity` | aggregate |

---

## New Endpoints (no mock exists)

| Endpoint | Reason | Priority |
|---|---|---|
| `GET /api/zoiko-hr/recruitment/jobs/{id}` | Blueprint requires, no mock | Medium |
| `GET /api/zoiko-hr/recruitment/reports/source-effectiveness` | Blueprint requires, no mock | Low |
