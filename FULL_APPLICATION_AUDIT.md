# Zoiko One Frontend — Full Application Audit

> **Generated:** 2026-06-10  
> **Scope:** All 13 modules across the Zoiko One HR application  
> **Total Pages:** 93 mock, 33 real, 10 static, 1 mixed (mock + real), 1 bug (shifts)

---

## 1. Overview

| Category | Count | Details |
|---|---|---|
| **Modules** | 13 | Recruitment, Assets, Travel, Compliance, Onboarding, Learning, Compensation, Engagement, ESS, Rewards, Workforce Planning, Employee Lifecycle, Helpdesk |
| **Total Pages** | 103 | Sum of all page files across modules |
| **Mock Pages** | 93 | Pages using mock data from `workforce-api.ts` or `mockData.ts` |
| **Real API Pages** | 33 | Pages connected to backend via `app/lib/api/*.api.ts` |
| **Static Pages** | 10 | Pages using hardcoded inline data (no mock functions) |
| **Mixed Pages** | 1 | Attendance dashboard (some real, some mock via `fetchShifts`) |
| **Bug Pages** | 1 | Shifts (`app/zoiko-hr/attendance/shifts/page.tsx`) — missing state variables and imports |
| **Total Mock Functions** | 183 | Sum of all exported mock/API functions across modules |
| **Total Mock Arrays** | ~160+ | Seed data items across all modules |
| **Report Functions** | 37 | Across 9 report pages |
| **Dashboard KPIs** | 71 | Sum of all KPI metrics across 13 modules |
| **Charts** | BarChart, LineChart, PieChart | Recharts library — zero donut, area, or radar charts |
| **File Uploads** | 0 | No upload features anywhere |
| **Exports** | 0 | No export/CSV features anywhere |
| **Date Range Pickers** | 0 | No date range selectors anywhere |

---

## 2. Module-by-Module Audit Table

| # | Module | Pages | Mock Fns | Real Fns | Dashboard KPIs | Report Fns | Charts | Priority | Risk | Prisma Models | Dependencies |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Recruitment | 6 | 18 | 18 | 6 | 5 | Bar, Line, Pie | 1 | High | ❌ | Employee, Dept |
| 2 | Assets | 7 | 11 | 0 | 6 | 4 | None | 2 | Medium | ❌ | Employee |
| 3 | Travel | 9 | 10 | 0 | 6 | 2 | CSS Bar | 3 | Medium | ❌ | Employee, Dept |
| 4 | Compliance | 10 | 25 | 0 | 6 | 5 | Bar, Line, Pie | 4 | Low | ✅ (8 models) | Employee, Dept, Policy |
| 5 | Onboarding | 7 | 16 | 0 | 6 | 5 | Bar, Line, Pie | 5 | Medium | ❌ | Recruitment, Assets |
| 6 | Learning | 7 | 11 | 0 | 6 | 5 | Bar, Line | 6 | Low | ❌ | Employee |
| 7 | Compensation | 10 | 13 | 0 | 5 | 2 | None (cards) | 7 | High | ❌ | Employee, Payroll |
| 8 | Engagement | 11 | 23 | 0 | 6 | 4 | Bar | 8 | Low | ✅ (9 models) | Employee, Dept |
| 9 | ESS | 11 | 13 | 0 | 6 | 0 | None | 9 | High | ❌ | ALL modules |
| 10 | Rewards | 5 | 16 | 0 | 4 | 0 | None | 10 | Low | ❌ | Employee, Engagement |
| 11 | Workforce Planning | 10 | 27 | 0 | 8 | 6 | Bar | 11 | Low | ❌ | Employee, Dept, Recruitment |
| 12 | Employee Lifecycle | 4 | 0 | 0 | 4 | 0 | None | 12 | Low | ❌ | Employee, Dept |
| 13 | Helpdesk | 6 | 0 | 0 | 4 | 0 | None | 13 | Low | ❌ | Employee |
| **Total** | **13** | **103** | **183** | **18** | **71** | **37** | — | — | — | **17 models** | — |

---

## 3. Detailed Module Analysis

### 3.1 Recruitment (#1 — Priority: High)

| Property | Details |
|---|---|
| **Pages (6)** | `dashboard`, `candidates`, `interviews`, `job-openings`, `offers`, `reports` |
| **API Status** | All 18 functions are mock (in `workforce-api.ts`) |
| **Mock Functions** | `fetchRecruitmentDashboard`, `fetchJobOpenings`, `createJobOpening`, `updateJobOpening`, `closeJobOpening`, `fetchCandidates`, `updateCandidateStage`, `fetchInterviews`, `createInterview`, `updateInterviewStatus`, `fetchOffers`, `createOffer`, `updateOfferStatus`, `fetchRecruitmentFunnel`, `fetchTimeToHire`, `fetchOfferAcceptanceRate`, `fetchHiringByDepartment`, `fetchMonthlyRecruitmentActivity` |
| **Mock Arrays** | `mockJobs` (8), `mockCandidates` (10), `mockInterviews` (8), `mockOffers` (6) |
| **Real Fns Connected** | 0 of 18 — fully mock |
| **Dashboard** | 6 KPIs: Total Open Positions, Active Candidates, Interviews Scheduled, Offers Sent, Offers Accepted, Hiring Success Rate |
| **Reports** | 5 report functions; recharts: BarChart (funnel), LineChart (time-to-hire), PieChart (dept hiring), BarChart (monthly activity) |
| **CRUD** | ✅ Jobs (C/R/U, no D), Candidates (R/U — stage only), Interviews (C/R/U), Offers (C/R/U) |
| **Search** | Text + stage/status dropdown |
| **Pagination** | Server-side, pageSize=20 |
| **Modals** | None — uses inline status change via `<select>` in table rows |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee/Department (for job openings) |
| **Recommendation** | Highest priority. Connect to real API first. No delete for jobs/candidates/interviews/offers — consider soft-delete support. |

---

### 3.2 Assets (#2 — Priority: Medium)

| Property | Details |
|---|---|
| **Pages (7)** | `dashboard`, `allocation`, `categories`, `inventory`, `maintenance`, `reports`, `returns` |
| **API Status** | All 11 functions are mock (in `workforce-api.ts`) |
| **Mock Functions** | `fetchAssetDashboard`, `fetchAssets`, `updateAssetItemStatus`, `fetchAllocationRecords`, `fetchReturnRecords`, `fetchMaintenanceRecords`, `updateMaintenanceStatus`, `fetchAssetUtilization`, `fetchDeptAllocation`, `fetchMaintenanceCost`, `fetchAssetLifecycle` |
| **Mock Arrays** | `mockAssets` (20), `mockAllocations` (12), `mockReturns` (5), `mockMaintenance` (5) |
| **Dashboard** | 6 KPIs: Total Assets, Allocated, Available, Under Maintenance, Returned, Utilization% |
| **Reports** | 4 report functions, tables only (no charts) |
| **CRUD** | ✅ Limited — Asset status updates only. No create/delete for any entity |
| **Search** | Text + status dropdown |
| **Pagination** | Server-side, pageSize=20 |
| **Modals** | None |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee (for allocation tracking) |
| **Recommendation** | Add CRUD for categories, full asset lifecycle, and maintenance records. Consider adding barcode/QR code asset tagging. |

---

### 3.3 Travel (#3 — Priority: Medium)

| Property | Details |
|---|---|
| **Pages (9)** | `dashboard`, `approvals`, `corporate-travel`, `expense-categories`, `expense-claims`, `policy-management`, `reimbursements`, `reports`, `travel-requests` |
| **API Status** | All 10 functions are mock |
| **Mock Functions** | `fetchTravelDashboard`, `fetchTravelRequests`, `fetchExpenseClaims`, `fetchExpenseCategories`, `fetchTravelApprovals`, `fetchReimbursements`, `fetchCorporateTrips`, `fetchTravelPolicies`, `fetchTravelExpenseReports`, `fetchTravelDeptData` |
| **Mock Arrays** | `mockTravelRequests` (15), `mockExpenseClaims` (15), `mockExpenseCategories` (10), `mockApprovals` (15), `mockReimbursements` (8), `mockCorporateTrips` (10), `mockTravelPolicies` (10) |
| **Dashboard** | 6 KPIs: Total Claims, Pending Approvals, Approved Claims, Rejected Claims, Reimbursement Amount, Travel Requests |
| **Reports** | 2 report functions + custom CSS bar charts + tables |
| **CRUD** | ❌ Read-only for all entities. No create/update/delete |
| **Search** | Text + status + priority dropdowns |
| **Pagination** | Server-side, pageSize=25 |
| **Modals** | None |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee, Department |
| **Recommendation** | Add CRUD for travel requests, expense claims, and approvals. Approval workflow is a critical missing piece. |

---

### 3.4 Compliance (#4 — Priority: Low)

| Property | Details |
|---|---|
| **Pages (10)** | `dashboard`, `acknowledgements`, `audits`, `corrective-actions`, `policies`, `policy-categories`, `reports`, `requirements`, `training-compliance`, `violations` |
| **API Status** | All 25 functions are mock |
| **Mock Functions** | `fetchPolicies`, `createPolicy`, `updatePolicy`, `fetchPolicyCategories`, `createPolicyCategory`, `updatePolicyCategory`, `fetchComplianceRequirements`, `createComplianceRequirement`, `updateComplianceRequirement`, `fetchAudits`, `createAudit`, `updateAuditStatus`, `fetchViolations`, `updateViolationStatus`, `fetchCorrectiveActions`, `createCorrectiveAction`, `updateCorrectiveAction`, `fetchAcknowledgements`, `fetchTrainingCompliance`, `fetchComplianceDashboard`, `fetchComplianceTrends`, `fetchViolationByCategory`, `fetchAuditCompletionData`, `fetchDeptComplianceStats`, `fetchPolicyAdherenceTrends` |
| **Mock Arrays** | `mockPolicies` (12), `mockPolicyCategories` (8), `mockRequirements` (10), `mockAudits` (8), `mockViolations` (10), `mockCorrectiveActions` (8), `mockAcknowledgements` (10), `mockTrainingCompliance` (12) |
| **Dashboard** | 6 KPIs + Recent Violations table |
| **Reports** | 5 report functions + recharts: LineChart (trends), PieChart (violations by category), BarChart (audit completion) |
| **CRUD** | ✅ Policies (C/R/U), Categories (C/R/U), Requirements (C/R/U), Audits (C/R/U — status only), Violations (R/U — status only), Corrective Actions (C/R/U) |
| **Search** | Text + category + status |
| **Pagination** | Server-side, pageSize=25 |
| **Modals** | ✅ Create/edit modals present |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Prisma Models** | ✅ Already exist: `GovernancePolicy`, `PolicyCategory`, `PolicyAcknowledgement`, `ComplianceRequirement`, `ComplianceAudit`, `PolicyViolation`, `CorrectiveAction`, `TrainingCompliance` |
| **Dependencies** | Employee, Department, Policy |
| **Recommendation** | Lowest risk to connect to real API — Prisma models already exist. Create the API routes and swap mock imports for real. |

---

### 3.5 Onboarding (#5 — Priority: Medium)

| Property | Details |
|---|---|
| **Pages (7)** | `dashboard`, `asset-allocation`, `document-verification`, `new-joiners`, `probation`, `reports`, `welcome-kit` |
| **API Status** | All 16 functions are mock |
| **Mock Functions** | `fetchOnboardingDashboard`, `fetchNewJoiners`, `updateNewJoinerStatus`, `fetchDocumentVerifications`, `updateDocumentStatus`, `fetchAssetAllocations`, `updateAssetStatus`, `fetchWelcomeKits`, `updateWelcomeKitStatus`, `fetchProbations`, `updateProbationStatus`, `fetchOnboardingCompletionRate`, `fetchDeptOnboarding`, `fetchProbationSummary`, `fetchAssetSummary`, `fetchMonthlyJoiningTrends` |
| **Mock Arrays** | `mockNewJoiners` (10), `mockDocumentVerifications` (10), `mockAssetAllocations` (10), `mockWelcomeKits` (10), `mockProbations` (10) |
| **Dashboard** | 6 KPIs |
| **Reports** | 5 report functions + recharts: LineChart (completion rate), BarChart (dept onboarding), PieChart (probation summary), BarChart (asset summary), LineChart (monthly trends) |
| **CRUD** | ✅ Status updates only (U). No creates or deletes |
| **Search** | Text + status |
| **Pagination** | Server-side, pageSize=25 |
| **Modals** | None — inline status change via `<select>` |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Recruitment (new joiners from hired candidates), Assets (asset allocation) |
| **Recommendation** | Requires upstream Recruitment module to be connected first (new joiners originate from hired candidates). |

---

### 3.6 Learning (#6 — Priority: Low)

| Property | Details |
|---|---|
| **Pages (7)** | `dashboard`, `assessments`, `certifications`, `courses`, `enrollments`, `learning-paths`, `reports` |
| **API Status** | All 11 functions are mock |
| **Mock Functions** | `fetchLMSDashboard`, `fetchCourses`, `fetchLearningPaths`, `fetchCertifications`, `fetchAssessments`, `fetchEnrollments`, `fetchLearningProgress`, `fetchCertificationReports`, `fetchCourseCompletionData`, `fetchDeptLearningStats`, `fetchSkillTrends` |
| **Mock Arrays** | `mockCourses` (15), `mockLearningPaths` (8), `mockCertifications` (12), `mockAssessments` (10), `mockEnrollments` (15) |
| **Dashboard** | 6 KPIs |
| **Reports** | 5 report functions + recharts: BarChart, LineChart |
| **CRUD** | ❌ Read-only for all entities |
| **Search** | Text + category + level + status |
| **Pagination** | Server-side, pageSize=25 |
| **Modals** | None |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee (for enrollments) |
| **Recommendation** | No CRUD operations at all — this is a fully read-only module. Add course creation, enrollment management, and assessment scoring. |

---

### 3.7 Compensation (#7 — Priority: High)

| Property | Details |
|---|---|
| **Pages (10)** | `dashboard`, `allowances`, `benefits`, `bonuses`, `deductions`, `pay-grades`, `reports`, `reviews`, `salary-history`, `salary-structures` |
| **API Status** | All 13 functions are mock |
| **Mock Functions** | `fetchCompensationDashboard`, `fetchSalaryStructures`, `fetchPayGrades`, `fetchAllowances`, `fetchDeductions`, `fetchBenefits`, `fetchBonuses`, `fetchCompReviews`, `fetchSalaryRevisions`, `fetchSalaryDistribution`, `fetchBenefitEnrollment`, `fetchDeptCompCost`, `fetchReviewOutcomes` |
| **Mock Arrays** | `mockSalaryStructures` (8), `mockPayGrades` (8), `mockAllowances` (10), `mockDeductions` (10), `mockBenefits` (12), `mockBonuses` (12), `mockCompReviews` (12), `mockSalaryRevisions` (12) |
| **Dashboard** | 5 KPIs: Total Compensation Cost, Active Salary Structures, Benefits Enrolled, Pending Reviews, Upcoming Increments |
| **Reports** | 2 report functions, custom card lists (no recharts) |
| **CRUD** | ❌ Read-only for all entities |
| **Search** | Text + status/type/category |
| **Pagination** | Server-side, pageSize=20 |
| **Modals** | None |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee, Payroll |
| **Recommendation** | **High risk due to sensitive financial data.** Must implement proper authorization, audit logging, and data encryption before connecting to real API. Add CRUD operations for salary structures, allowances, deductions, and reviews. |

---

### 3.8 Engagement (#8 — Priority: Low)

| Property | Details |
|---|---|
| **Pages (11)** | `dashboard`, `action-plans`, `employee-recognition`, `engagement-scores`, `feedback-campaigns`, `pulse-surveys`, `recognition-programs`, `reports`, `sentiment-analysis`, `survey-templates`, `surveys` |
| **API Status** | All 23 functions are mock |
| **Mock Functions** | `fetchEngagementDashboard`, `fetchSurveys`, `createSurvey`, `updateSurvey`, `fetchSurveyTemplates`, `fetchPulseSurveys`, `createPulseSurvey`, `updatePulseSurveyStatus`, `fetchFeedbackCampaigns`, `createFeedbackCampaign`, `updateFeedbackCampaignStatus`, `fetchRecognitionPrograms`, `fetchEmployeeRecognitions`, `createEmployeeRecognition`, `fetchEngagementScores`, `fetchSentimentAnalysis`, `fetchActionPlans`, `createActionPlan`, `updateActionPlan`, `fetchSurveyReports`, `fetchEngagementReports`, `fetchRecognitionReports`, `fetchParticipationReports` |
| **Mock Arrays** | `mockSurveys` (8), `mockSurveyTemplates` (5), `mockPulseSurveys` (6), `mockFeedbackCampaigns` (5), `mockRecognitionPrograms` (4), `mockEmployeeRecognitions` (8), `mockEngagementScores` (8), `mockSentiments` (3), `mockActionPlans` (6) |
| **Dashboard** | 6 KPIs + Active Surveys table |
| **Reports** | 4 report functions + recharts: BarChart |
| **CRUD** | ✅ Surveys (C/R/U), Pulse Surveys (C/R/U — status), Feedback Campaigns (C/R/U — status), Employee Recognitions (C/R), Action Plans (C/R/U) |
| **Search** | Text + type + status |
| **Pagination** | Server-side, pageSize=25 |
| **Modals** | ✅ Create/edit modals present |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Prisma Models** | ✅ Already exist: `EngagementSurvey`, `EngagementSurveyTemplate`, `EngagementPulseSurvey`, `EngagementFeedbackCampaign`, `EngagementRecognitionProgram`, `EngagementEmployeeRecognition`, `EngagementScore`, `EngagementSentimentAnalysis`, `EngagementActionPlan` |
| **Dependencies** | Employee, Department |
| **Recommendation** | 11 pages is the most of any module. Prisma models exist — good candidate for early API connection. The sentiment analysis page is unique — consider adding NLP integration later. |

---

### 3.9 ESS (#9 — Priority: High)

| Property | Details |
|---|---|
| **Pages (11)** | `dashboard`, `my-assets`, `my-attendance`, `my-documents`, `my-learning`, `my-leave`, `my-payslips`, `my-performance`, `my-profile`, `my-requests`, `notifications` |
| **API Status** | All 13 functions are mock |
| **Mock Functions** | `fetchESSDashboard`, `fetchESSProfile`, `fetchESSAttendance`, `fetchESSLeaveRequests`, `fetchESSLeaveBalances`, `fetchESSDocuments`, `fetchESSAssets`, `fetchESSCourses`, `fetchESSReviews`, `fetchESSPayslips`, `fetchESSRequests`, `fetchESSNotifications`, `markNotificationRead` |
| **Mock Arrays** | `currentEmployee` (1), `essAttendance` (12), `essLeaveRequests` (6), `essLeaveBalances` (4), `essDocuments` (6), `essAssets` (5), `essCourses` (5), `essReviews` (4), `essPayslips` (6), `essRequests` (6), `essNotifications` (8) |
| **Dashboard** | 6 KPIs |
| **Reports** | None (ESS is employee-self-service, not reporting) |
| **CRUD** | ✅ Limited — notifications (mark read). Everything else read-only |
| **Search** | Text |
| **Pagination** | Client-side, pageSize=10 |
| **Modals** | None |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | **ALL upstream modules:** Attendance, Leave, Assets, Learning, Performance, Payroll, Documents |
| **Recommendation** | **Highest risk due to extreme dependency coupling.** ESS cannot connect to real API until ALL upstream modules are connected. Consider lazy-loading or micro-frontend architecture. |

---

### 3.10 Rewards (#10 — Priority: Low)

| Property | Details |
|---|---|
| **Pages (5)** | `dashboard`, `achievements`, `awards`, `points`, `programs` |
| **API Status** | All 16 functions are mock |
| **Mock Functions** | `fetchRewardsDashboard`, `fetchAwards`, `createAward`, `updateAward`, `deleteAward`, `fetchRewardsRecognitionPrograms`, `createRewardsRecognitionProgram`, `updateRewardsRecognitionProgram`, `deleteRewardsRecognitionProgram`, `fetchRewardPointsBalances`, `fetchRewardPointTransactions`, `awardPoints`, `fetchAchievements`, `createAchievement`, `updateAchievement`, `deleteAchievement` |
| **Mock Arrays** | `mockEmployeeAwards` (8), `mockRewardsPrograms` (4), `mockRewardBalances` (6), `mockRewardTransactions` (9), `mockAchievementRecords` (7) |
| **Dashboard** | 4 custom KPIs + Top Performers list + Recent Awards + Recent Achievements table |
| **Reports** | None |
| **CRUD** | ✅ Full CRUD: Awards (C/R/U/D), Programs (C/R/U/D), Achievements (C/R/U/D), Points (R/U — awardPoints) |
| **Search** | Text + category |
| **Pagination** | Client-side, pageSize=25 |
| **Modals** | ✅ Create/edit modals + delete confirmation |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee, Engagement |
| **Recommendation** | Only module with full delete support. Consider adding reward redemption workflow and points expiry. |

---

### 3.11 Workforce Planning (#11 — Priority: Low)

| Property | Details |
|---|---|
| **Pages (10)** | `dashboard`, `budget`, `capacity`, `forecasting`, `headcount`, `hiring-plans`, `reports`, `scenarios`, `skill-gaps`, `succession` |
| **API Status** | All 27 functions are mock |
| **Mock Functions** | `fetchWFDashboard`, `fetchWFHeadcountPlans`, `createWFHeadcountPlan`, `updateWFHeadcountPlan`, `fetchWFWorkforceForecasts`, `createWFWorkforceForecast`, `fetchWFHiringPlans`, `createWFHiringPlan`, `updateWFHiringPlan`, `fetchWFCapacityPlans`, `createWFCapacityPlan`, `fetchWFSkillGaps`, `createWFSkillGap`, `fetchWFSuccessionPlans`, `createWFSuccessionPlan`, `updateWFSuccessionPlan`, `fetchWFBudgetPlans`, `createWFBudgetPlan`, `updateWFBudgetPlan`, `fetchWFScenarioPlans`, `createWFScenarioPlan`, `fetchWFHeadcountReports`, `fetchWFForecastReports`, `fetchWFHiringReports`, `fetchWFSkillGapReports`, `fetchWFSuccessionReports`, `fetchWFBudgetReports` |
| **Mock Arrays** | `mockHeadcountPlans` (8), `mockWorkforceForecasts` (6), `mockHiringPlans` (8), `mockCapacityPlans` (8), `mockSkillGaps` (6), `mockSuccessionPlans` (6), `mockBudgetPlans` (8), `mockScenarioPlans` (4) |
| **Dashboard** | **8 KPIs** (most of any module): Current Headcount, Planned Headcount, Open Positions, Critical Skill Gaps, Successor Coverage, Workforce Budget, Forecast Accuracy, Capacity Utilization |
| **Reports** | 6 report functions + recharts: BarChart + Succession table |
| **CRUD** | ✅ Most entities (C/R/U): Headcount, Forecasts, Hiring Plans, Capacity, Skill Gaps, Succession, Budget, Scenarios |
| **Search** | Text + department + status/priority |
| **Pagination** | Server-side, pageSize=25 |
| **Modals** | ✅ Create/edit modals present |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee, Department, Recruitment |
| **Recommendation** | Most mock functions (27). Heavy CRUD coverage. The "scenarios" module is unique — consider what-if analysis capabilities. |

---

### 3.12 Employee Lifecycle (#12 — Priority: Low)

| Property | Details |
|---|---|
| **Pages (4)** | `dashboard`, `offboarding`, `onboarding`, `transfers` |
| **API Status** | Fully static inline data |
| **Mock Functions** | 0 — all data is hardcoded as `lifecycleStats` and `initialRecords` |
| **Data Source** | Inline arrays within the page components |
| **Dashboard** | 4 custom KPIs + 3 lists/tables |
| **Reports** | None |
| **CRUD** | ❌ Read-only, static data |
| **Search** | Text + reason + status |
| **Pagination** | None (no pagination on any page) |
| **Modals** | ✅ Create modal present |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee, Department |
| **Recommendation** | Only 4 pages — easiest module to build out. Should be converted to mock+real API pattern like others. |

---

### 3.13 Helpdesk (#13 — Priority: Low)

| Property | Details |
|---|---|
| **Pages (6)** | `dashboard`, `cases`, `employee-requests`, `knowledge-base`, `sla`, `tickets` |
| **API Status** | All data from `mockData.ts` imports (static arrays) |
| **Mock Functions** | 0 — data imported directly from `./mockData` |
| **Data Source** | Initial arrays in mockData.ts |
| **Dashboard** | 4 custom computed KPIs + Recent Tickets + SLA Overview + Active Cases + Knowledge Articles + Recent Requests |
| **Reports** | None |
| **CRUD** | ✅ Create/edit modals, delete confirmation |
| **Search** | Text + status + priority |
| **Pagination** | None |
| **Modals** | ✅ Create/edit modals + delete confirmation |
| **Export** | ❌ |
| **Upload** | ❌ |
| **Dependencies** | Employee |
| **Recommendation** | Only standalone ticketing module. Consider adding file attachments for tickets, email-to-ticket integration, and SLA escalation automation. |

---

## 4. Cross-Cutting Patterns Summary

### 4.1 Shell & Layout
- **All pages** use `SuperAdminShell` wrapper with `PageHeader` component
- Consistent dark theme: `bg-[#0b1220]`, rounded corners (`rounded-[28px]`), `border-slate-800`

### 4.2 Search & Filtering
- Text search with `Search` icon from `lucide-react`
- Dropdown filters for status/type/category/priority
- All searches reset pagination to page 0
- **No date range selectors** anywhere in the application

### 4.3 Tables
- `overflow-x-auto` wrapper for horizontal scroll
- Dark header (`bg-slate-950`, `text-slate-500`)
- Hover rows (`hover:bg-slate-900/80`)
- `divide-y divide-slate-800` for row separators
- Status displayed as color-coded pills via `StatusBadge` component

### 4.4 Pagination
- **Server-side**: `skip`/`take` params with `{data, total}` response — used in most modules (pageSize varies: 20 or 25)
- **Client-side**: `array.slice()` — used in ESS (pageSize=10), Rewards (pageSize=25)
- **None**: Employee Lifecycle, Helpdesk

### 4.5 Modals
- **Create/Edit modals**: Overlay, centered, Cancel/Submit buttons — present in: Compliance, Engagement, Rewards, Workforce Planning, Helpdesk, Employee Lifecycle
- **No modals**: Recruitment (uses inline `<select>`), Assets, Travel, Onboarding, Learning, Compensation, ESS

### 4.6 Inline Status Changes
- Used in Recruitment and Onboarding — `<select>` dropdown in table row that triggers `update*Status` function
- Avoids modal overhead for quick status transitions

### 4.7 Empty, Loading, Error States
- **Empty**: `"No X found."` centered in table
- **Loading**: Spinning border ring (`animate-spin rounded-full border-4 border-indigo-500 border-t-transparent`)
- **Error**: Rose-colored toast notification
- **Success**: Emerald auto-dismiss toast (3-4s)

### 4.8 Reports & Charts
- **9 report pages** across modules
- **37 report functions** total
- **Recharts library**: BarChart (most common), LineChart, PieChart
- **No donut, area, or radar charts** used
- Reports use `fetch*Reports()` with `useEffect` + state pattern

### 4.9 Gaps (Features Not Present)
| Feature | Status |
|---|---|
| File Upload | ❌ Zero upload features across all 103 pages |
| Export (CSV/PDF/Excel) | ❌ Zero export features |
| Date Range Pickers | ❌ Zero date range selectors |
| Donut/Area/Radar Charts | ❌ Not used anywhere |
| Dark/Light Mode Toggle | ❌ Not implemented |
| Bulk Operations | ❌ No select-all, bulk update, or bulk delete |

---

## 5. Key Findings & Recommendations

### 5.1 Critical Issues

1. **Shifts Page Bug** (`app/zoiko-hr/attendance/shifts/page.tsx:1-178`)
   - **Missing state variables (12):** `toast`, `setToast`, `setLoaded`, `refreshKey`, `setRefreshKey`, `editId`, `setEditId`, `formData`, `setFormData`, `formError`, `setFormError`, `showForm`, `setShowForm`, `defaultForm`, `submitting`, `setSubmitting`, `deleting`, `setDeleting`, `deleteId`, `setDeleteId`
   - **Missing imports (3):** `createShift`, `updateShift`, `deleteShift` (exist in `attendance.api.ts` but not imported on the page)
   - **Impact:** Page will crash on any interaction (add, edit, delete). Search and pagination work because they only use `fetchShifts` which is imported.
   - **Fix:** Add all missing `useState` declarations and import the three missing functions from `../../../lib/workforce-api`.

2. **ESS Module Blocked by Upstream Dependencies**
   - ESS depends on 7 upstream modules (Attendance, Leave, Assets, Learning, Performance, Payroll, Documents)
   - Cannot be connected to real API until all upstream modules are connected
   - Recommend implementing lazy data loading or a dedicated ESS API aggregator service

3. **No Data Export Capability**
   - Zero export features anywhere in the application
   - Critical gap for reporting modules (Recruitment, Assets, Compliance, Onboarding, Learning, Compensation, Workforce Planning)
   - Recommend adding CSV export as minimum, with PDF for formal reports

### 5.2 Prioritization for API Connection

| Tier | Modules | Rationale |
|---|---|---|
| **1 — Immediate** | Compliance, Engagement | Prisma models already exist — fastest to connect |
| **2 — High Impact** | Recruitment, Onboarding | Core HR workflows, highest priority rating |
| **3 — Medium** | Assets, Travel, Learning, Rewards, Workforce Planning | Important but lower dependency chains |
| **4 — High Risk** | Compensation, ESS | Sensitive data / extreme dependency coupling |

### 5.3 Feature Gaps to Fill

| Feature | Priority | Notes |
|---|---|---|
| CSV Export | High | Needed for all report pages |
| Date Range Filters | High | All report dashboards need date filtering |
| File Upload (Documents) | Medium | Document verification, offer letters, profile pictures |
| Bulk Operations | Medium | Bulk status updates, bulk assign |
| Activity Log / Audit Trail | Medium | Required for Compliance and Compensation |
| Notification System | Medium | Real-time notifications (currently mock-only in ESS) |

### 5.4 Architecture Observations

1. **Consistent Pattern:** Every page follows the same `useState` + `useEffect` + `fetch*()` pattern, making the codebase highly uniform and easy to refactor.
2. **No State Management Library:** All state is local `useState` — no Redux, Zustand, or Context API. This works for now but may become a bottleneck as real API calls introduce loading/error/caching complexity.
3. **No React Query/SWR:** No caching, retry, or optimistic update library. Every page manages its own loading/error states manually.
4. **All modules in one Next.js app:** No micro-frontends or module federation. The ESS dependency issue highlights the coupling risk.
5. **Mock data lives in `workforce-api.ts`:** A single 800+ line file with all mock data and functions. Should be split by module when connecting to real APIs.

---

## 6. Bug Report: Shifts Page — Missing State & Imports

### File
`app/zoiko-hr/attendance/shifts/page.tsx` (178 lines)

### Current Import
```ts
import { fetchShifts, type ShiftRecord } from "../../../lib/workforce-api";
```

### Required Additional Imports
```ts
import { createShift, updateShift, deleteShift } from "../../../lib/workforce-api";
```

### Missing State Variables (add with `useState`)
| Variable | Type | Default | Used At Lines |
|---|---|---|---|
| `toast` | `string` | `""` | 18, 19, 20, 21 |
| `setToast` | — | — | 19, 82, 85, 101 |
| `setLoaded` | — | — | 34 |
| `refreshKey` / `setRefreshKey` | `number` | `0` | 37, 88, 102 |
| `editId` / `setEditId` | `string \| null` | `null` | 40, 46, 80 |
| `formData` / `setFormData` | `object` | `defaultForm` | 41, 48–55, 59–66, 73–79 |
| `formError` / `setFormError` | `string` | `""` | 42, 70, 90 |
| `showForm` / `setShowForm` | `boolean` | `false` | 43, 87 |
| `defaultForm` | `object` | — | 41 |
| `submitting` / `setSubmitting` | `boolean` | `false` | 70, 92 |
| `deleting` / `setDeleting` | `boolean` | `false` | 97, 98, 103, 104 |
| `deleteId` / `setDeleteId` | `string \| null` | `null` | 100, 102 |

### Root Cause
The shifts page was written with full CRUD UI (add form, edit form, delete confirmation) but the author forgot to:
1. Add `useState` declarations for 12 state variables
2. Import `createShift`, `updateShift`, `deleteShift` from the workforce-api barrel

The functions themselves exist and are correctly implemented in `app/lib/api/attendance.api.ts:194-222` and re-exported through `app/lib/workforce-api.ts` (which does `export * from "./api/attendance.api"`).

### Fix Impact
Once fixed, the page will have complete CRUD functionality for shifts including:
- Create shift with name, start time, end time, grace period, weekly off days
- Edit existing shift
- Delete shift with confirmation
- Toast notifications for success/error feedback
- Loading and submitting states
