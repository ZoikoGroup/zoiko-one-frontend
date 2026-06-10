# Mock Data Inventory — Zoiko One Frontend

> **Source:** `app/lib/workforce-api.ts` (all mock arrays and hardcoded report data)  
> **Static pages:** Scattered across `app/zoiko-hr/employee-lifecycle/` and `app/zoiko-hr/helpdesk/`

---

## Summary Table

| Mock Array | Module | Interface | Items | Lines |
|---|---|---|---|---|
| mockJobs | Recruitment | JobOpening[] | 8 | ~110 |
| mockCandidates | Recruitment | Candidate[] | 10 | ~121 |
| mockInterviews | Recruitment | Interview[] | 8 | ~134 |
| mockOffers | Recruitment | Offer[] | 6 | ~145 |
| mockNewJoiners | Onboarding | NewJoiner[] | 10 | ~490 |
| mockDocumentVerifications | Onboarding | DocumentVerification[] | 10 | ~503 |
| mockAssetAllocations | Onboarding | AssetAllocation[] | 10 | ~516 |
| mockWelcomeKits | Onboarding | WelcomeKit[] | 10 | ~529 |
| mockProbations | Onboarding | Probation[] | 10 | ~542 |
| mockAssets | Assets | AssetItem[] | 20 | ~803 |
| mockAllocations | Assets | AssetAllocationRecord[] | 12 | ~826 |
| mockReturns | Assets | AssetReturnRecord[] | 5 | ~841 |
| mockMaintenance | Assets | AssetMaintenanceRecord[] | 5 | ~849 |
| mockCourses | Learning | Course[] | 15 | ~1069 |
| mockLearningPaths | Learning | LearningPath[] | 8 | ~1087 |
| mockCertifications | Learning | Certification[] | 12 | ~1098 |
| mockAssessments | Learning | Assessment[] | 10 | ~1113 |
| mockEnrollments | Learning | Enrollment[] | 15 | ~1126 |
| mockSalaryStructures | Compensation | SalaryStructure[] | 8 | ~1413 |
| mockPayGrades | Compensation | PayGrade[] | 8 | ~1424 |
| mockAllowances | Compensation | Allowance[] | 10 | ~1435 |
| mockDeductions | Compensation | Deduction[] | 10 | ~1448 |
| mockBenefits | Compensation | BenefitPlan[] | 12 | ~1461 |
| mockBonuses | Compensation | Bonus[] | 12 | ~1476 |
| mockCompReviews | Compensation | CompensationReview[] | 12 | ~1491 |
| mockSalaryRevisions | Compensation | SalaryRevision[] | 12 | ~1506 |
| currentEmployee | ESS | ESSProfile | 1 obj | ~1808 |
| essAttendance | ESS | EmployeeAttendance[] | 12 | ~1829 |
| essLeaveRequests | ESS | EmployeeLeaveReq[] | 6 | ~1844 |
| essLeaveBalances | ESS | ESSLeaveBalance[] | 4 | ~1853 |
| essDocuments | ESS | ESSDocument[] | 6 | ~1860 |
| essAssets | ESS | EmployeeAsset[] | 5 | ~1869 |
| essCourses | ESS | EmployeeCourse[] | 5 | ~1877 |
| essReviews | ESS | EmployeeReview[] | 4 | ~1885 |
| essPayslips | ESS | Payslip[] | 6 | ~1892 |
| essRequests | ESS | EmployeeRequest[] | 6 | ~1901 |
| essNotifications | ESS | Notification[] | 8 | ~1910 |
| mockTravelRequests | Travel | TravelRequest[] | 15 | ~2110 |
| mockExpenseClaims | Travel | ExpenseClaim[] | 15 | ~2128 |
| mockExpenseCategories | Travel | ExpenseCategory[] | 10 | ~2146 |
| mockApprovals | Travel | TravelApproval[] | 15 | ~2159 |
| mockReimbursements | Travel | Reimbursement[] | 8 | ~2177 |
| mockCorporateTrips | Travel | CorporateTrip[] | 10 | ~2188 |
| mockTravelPolicies | Travel | TravelPolicy[] | 10 | ~2201 |
| mockPolicies | Compliance | Policy[] | 12 | ~2487 |
| mockPolicyCategories | Compliance | PolicyCategory[] | 8 | ~2502 |
| mockRequirements | Compliance | ComplianceRequirement[] | 10 | ~2513 |
| mockAudits | Compliance | Audit[] | 8 | ~2526 |
| mockViolations | Compliance | Violation[] | 10 | ~2537 |
| mockCorrectiveActions | Compliance | CorrectiveAction[] | 8 | ~2550 |
| mockAcknowledgements | Compliance | Acknowledgement[] | 10 | ~2561 |
| mockTrainingCompliance | Compliance | TrainingCompliance[] | 12 | ~2574 |
| mockSurveys | Engagement | Survey[] | 8 | ~3113 |
| mockSurveyTemplates | Engagement | SurveyTemplate[] | 5 | ~3124 |
| mockPulseSurveys | Engagement | PulseSurvey[] | 6 | ~3132 |
| mockFeedbackCampaigns | Engagement | FeedbackCampaign[] | 5 | ~3141 |
| mockRecognitionPrograms | Engagement | RecognitionProgram[] | 4 | ~3149 |
| mockEmployeeRecognitions | Engagement | EmployeeRecognition[] | 8 | ~3156 |
| mockEngagementScores | Engagement | EngagementScore[] | 8 | ~3167 |
| mockSentiments | Engagement | SentimentAnalysis[] | 3 | ~3178 |
| mockActionPlans | Engagement | ActionPlan[] | 6 | ~3184 |
| mockEmployeeAwards | Rewards | EmployeeAward[] | 8 | ~4059 |
| mockRewardsPrograms | Rewards | RewardsRecognitionProgram[] | 4 | ~4070 |
| mockRewardBalances | Rewards | RewardPointBalance[] | 6 | ~4077 |
| mockRewardTransactions | Rewards | RewardPointTransaction[] | 9 | ~4086 |
| mockAchievementRecords | Rewards | AchievementRecord[] | 7 | ~4098 |
| mockHeadcountPlans | Workforce Planning | WFHeadcountPlan[] | 8 | ~3627 |
| mockWorkforceForecasts | Workforce Planning | WFWorkforceForecast[] | 6 | ~3638 |
| mockHiringPlans | Workforce Planning | WFHiringPlan[] | 8 | ~3647 |
| mockCapacityPlans | Workforce Planning | WFCapacityPlan[] | 8 | ~3658 |
| mockSkillGaps | Workforce Planning | WFSkillGap[] | 6 | ~3669 |
| mockSuccessionPlans | Workforce Planning | WFSuccessionPlan[] | 6 | ~3678 |
| mockBudgetPlans | Workforce Planning | WFBudgetPlan[] | 8 | ~3687 |
| mockScenarioPlans | Workforce Planning | WFScenarioPlan[] | 4 | ~3698 |

---

## 1. Recruitment (`app/lib/workforce-api.ts` ~110–370)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockJobs` | `JobOpening[]` | 8 | ~110 | `fetchRecruitmentDashboard`, `fetchJobOpenings`, `createJobOpening` (push), `updateJobOpening`, `closeJobOpening` | `JobOpening` |
| `mockCandidates` | `Candidate[]` | 10 | ~121 | `fetchRecruitmentDashboard`, `fetchCandidates`, `updateCandidateStage`, `fetchRecruitmentFunnel` | `Candidate` |
| `mockInterviews` | `Interview[]` | 8 | ~134 | `fetchRecruitmentDashboard`, `fetchInterviews`, `createInterview` (push), `updateInterviewStatus` | `Interview` |
| `mockOffers` | `Offer[]` | 6 | ~145 | `fetchRecruitmentDashboard`, `fetchOffers`, `createOffer` (push), `updateOfferStatus`, `fetchOfferAcceptanceRate`, `fetchHiringByDepartment` | `Offer` |

---

## 2. Onboarding (`app/lib/workforce-api.ts` ~490–722)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockNewJoiners` | `NewJoiner[]` | 10 | ~490 | `fetchOnboardingDashboard`, `fetchNewJoiners`, `updateNewJoinerStatus`, `fetchDeptOnboarding` | `Employee` (joinDate field) |
| `mockDocumentVerifications` | `DocumentVerification[]` | 10 | ~503 | `fetchOnboardingDashboard`, `fetchDocumentVerifications`, `updateDocumentStatus` | `OnboardingDocumentVerification` |
| `mockAssetAllocations` | `AssetAllocation[]` | 10 | ~516 | `fetchOnboardingDashboard`, `fetchAssetAllocations`, `updateAssetStatus`, `fetchAssetSummary` | `OnboardingAssetAllocation` |
| `mockWelcomeKits` | `WelcomeKit[]` | 10 | ~529 | `fetchWelcomeKits`, `updateWelcomeKitStatus` | `OnboardingWelcomeKit` |
| `mockProbations` | `Probation[]` | 10 | ~542 | `fetchOnboardingDashboard`, `fetchProbations`, `updateProbationStatus`, `fetchProbationSummary` | `Probation` (already in schema) |

---

## 3. Assets (`app/lib/workforce-api.ts` ~803–967)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockAssets` | `AssetItem[]` | 20 | ~803 | `fetchAssetDashboard`, `fetchAssets`, `updateAssetItemStatus`, `fetchAssetLifecycle` | `Asset` |
| `mockAllocations` | `AssetAllocationRecord[]` | 12 | ~826 | `fetchAssetDashboard`, `fetchAllocationRecords`, `fetchDeptAllocation` | `AssetAllocation` |
| `mockReturns` | `AssetReturnRecord[]` | 5 | ~841 | `fetchReturnRecords` | `AssetReturn` |
| `mockMaintenance` | `AssetMaintenanceRecord[]` | 5 | ~849 | `fetchMaintenanceRecords`, `updateMaintenanceStatus`, `fetchMaintenanceCost` | `AssetMaintenance` |

---

## 4. Learning / LMS (`app/lib/workforce-api.ts` ~1069–1291)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockCourses` | `Course[]` | 15 | ~1069 | `fetchLMSDashboard`, `fetchCourses`, `fetchCourseCompletionData` | `Course` / `LearningCourse` |
| `mockLearningPaths` | `LearningPath[]` | 8 | ~1087 | `fetchLearningPaths` | `LearningPath` |
| `mockCertifications` | `Certification[]` | 12 | ~1098 | `fetchLMSDashboard`, `fetchCertifications` | `Certification` |
| `mockAssessments` | `Assessment[]` | 10 | ~1113 | `fetchLMSDashboard`, `fetchAssessments` | `Assessment` |
| `mockEnrollments` | `Enrollment[]` | 15 | ~1126 | `fetchLMSDashboard`, `fetchEnrollments`, `fetchCourseCompletionData` | `Enrollment` |

---

## 5. Compensation (`app/lib/workforce-api.ts` ~1413–1686)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockSalaryStructures` | `SalaryStructure[]` | 8 | ~1413 | `fetchCompensationDashboard`, `fetchSalaryStructures` | `SalaryStructure` |
| `mockPayGrades` | `PayGrade[]` | 8 | ~1424 | `fetchPayGrades`, `fetchSalaryDistribution` | `PayGrade` |
| `mockAllowances` | `Allowance[]` | 10 | ~1435 | `fetchAllowances` | `Allowance` |
| `mockDeductions` | `Deduction[]` | 10 | ~1448 | `fetchDeductions` | `Deduction` |
| `mockBenefits` | `BenefitPlan[]` | 12 | ~1461 | `fetchCompensationDashboard`, `fetchBenefits`, `fetchBenefitEnrollment` | `BenefitPlan` |
| `mockBonuses` | `Bonus[]` | 12 | ~1476 | `fetchBonuses` | `Bonus` |
| `mockCompReviews` | `CompensationReview[]` | 12 | ~1491 | `fetchCompensationDashboard`, `fetchCompReviews` | `CompensationReview` |
| `mockSalaryRevisions` | `SalaryRevision[]` | 12 | ~1506 | `fetchSalaryRevisions` | `SalaryRevision` |

---

## 6. ESS — Employee Self-Service (`app/lib/workforce-api.ts` ~1808–1983)

| Variable | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `currentEmployee` | `ESSProfile` | 1 obj | ~1808 | `fetchESSProfile` | `Employee` (profile fields) |
| `essAttendance` | `EmployeeAttendance[]` | 12 | ~1829 | `fetchESSDashboard`, `fetchESSAttendance` | `Attendance` |
| `essLeaveRequests` | `EmployeeLeaveReq[]` | 6 | ~1844 | `fetchESSDashboard`, `fetchESSLeaveRequests` | `LeaveRequest` |
| `essLeaveBalances` | `ESSLeaveBalance[]` | 4 | ~1853 | `fetchESSLeaveBalances` | `LeaveBalance` |
| `essDocuments` | `ESSDocument[]` | 6 | ~1860 | `fetchESSDocuments` | `EmployeeDocumentReference` |
| `essAssets` | `EmployeeAsset[]` | 5 | ~1869 | `fetchESSAssets` | `AssetAllocation` |
| `essCourses` | `EmployeeCourse[]` | 5 | ~1877 | `fetchESSDashboard`, `fetchESSCourses` | `Enrollment` |
| `essReviews` | `EmployeeReview[]` | 4 | ~1885 | `fetchESSReviews` | `PerformanceReview` |
| `essPayslips` | `Payslip[]` | 6 | ~1892 | `fetchESSDashboard`, `fetchESSPayslips` | `Payslip` |
| `essRequests` | `EmployeeRequest[]` | 6 | ~1901 | `fetchESSDashboard`, `fetchESSRequests` | `EmployeeRequest` |
| `essNotifications` | `Notification[]` | 8 | ~1910 | `fetchESSNotifications`, `markNotificationRead` | `Notification` |

---

## 7. Travel & Expense (`app/lib/workforce-api.ts` ~2110–2350)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockTravelRequests` | `TravelRequest[]` | 15 | ~2110 | `fetchTravelDashboard`, `fetchTravelRequests` | `TravelRequest` |
| `mockExpenseClaims` | `ExpenseClaim[]` | 15 | ~2128 | `fetchTravelDashboard`, `fetchExpenseClaims` | `ExpenseClaim` |
| `mockExpenseCategories` | `ExpenseCategory[]` | 10 | ~2146 | `fetchExpenseCategories` | `ExpenseCategory` |
| `mockApprovals` | `TravelApproval[]` | 15 | ~2159 | `fetchTravelDashboard`, `fetchTravelApprovals` | `TravelApproval` |
| `mockReimbursements` | `Reimbursement[]` | 8 | ~2177 | `fetchTravelDashboard`, `fetchReimbursements` | `Reimbursement` |
| `mockCorporateTrips` | `CorporateTrip[]` | 10 | ~2188 | `fetchCorporateTrips` | `CorporateTrip` |
| `mockTravelPolicies` | `TravelPolicy[]` | 10 | ~2201 | `fetchTravelPolicies` | `TravelPolicy` |

---

## 8. Compliance & Governance (`app/lib/workforce-api.ts` ~2487–2907)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockPolicies` | `Policy[]` | 12 | ~2487 | `fetchComplianceDashboard`, `fetchPolicies`, `createPolicy` (push), `updatePolicy` | `GovernancePolicy` (already in schema) |
| `mockPolicyCategories` | `PolicyCategory[]` | 8 | ~2502 | `fetchPolicyCategories`, `createPolicyCategory` (push), `updatePolicyCategory` | `PolicyCategory` (already in schema) |
| `mockRequirements` | `ComplianceRequirement[]` | 10 | ~2513 | `fetchComplianceDashboard`, `fetchComplianceRequirements`, `createComplianceRequirement` (push), `updateComplianceRequirement` | `ComplianceRequirement` (already in schema) |
| `mockAudits` | `Audit[]` | 8 | ~2526 | `fetchComplianceDashboard`, `fetchAudits`, `createAudit` (push), `updateAuditStatus` | `ComplianceAudit` (already in schema) |
| `mockViolations` | `Violation[]` | 10 | ~2537 | `fetchComplianceDashboard`, `fetchViolations`, `updateViolationStatus`, `fetchViolationByCategory` | `PolicyViolation` (already in schema) |
| `mockCorrectiveActions` | `CorrectiveAction[]` | 8 | ~2550 | `fetchCorrectiveActions`, `createCorrectiveAction` (push), `updateCorrectiveAction` | `CorrectiveAction` (already in schema) |
| `mockAcknowledgements` | `Acknowledgement[]` | 10 | ~2561 | `fetchComplianceDashboard`, `fetchAcknowledgements` | `PolicyAcknowledgement` (already in schema) |
| `mockTrainingCompliance` | `TrainingCompliance[]` | 12 | ~2574 | `fetchComplianceDashboard`, `fetchTrainingCompliance` | `TrainingCompliance` (already in schema) |

---

## 9. Engagement (`app/lib/workforce-api.ts` ~3113–3462)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockSurveys` | `Survey[]` | 8 | ~3113 | `fetchEngagementDashboard`, `fetchSurveys`, `createSurvey` (push), `updateSurvey` | `EngagementSurvey` (already in schema) |
| `mockSurveyTemplates` | `SurveyTemplate[]` | 5 | ~3124 | `fetchSurveyTemplates` | `EngagementSurveyTemplate` (already in schema) |
| `mockPulseSurveys` | `PulseSurvey[]` | 6 | ~3132 | `fetchPulseSurveys`, `createPulseSurvey` (push), `updatePulseSurveyStatus` | `EngagementPulseSurvey` (already in schema) |
| `mockFeedbackCampaigns` | `FeedbackCampaign[]` | 5 | ~3141 | `fetchFeedbackCampaigns`, `createFeedbackCampaign` (push), `updateFeedbackCampaignStatus` | `EngagementFeedbackCampaign` (already in schema) |
| `mockRecognitionPrograms` | `RecognitionProgram[]` | 4 | ~3149 | `fetchRecognitionPrograms` | `EngagementRecognitionProgram` (already in schema) |
| `mockEmployeeRecognitions` | `EmployeeRecognition[]` | 8 | ~3156 | `fetchEngagementDashboard`, `fetchEmployeeRecognitions`, `createEmployeeRecognition` (push) | `EngagementEmployeeRecognition` (already in schema) |
| `mockEngagementScores` | `EngagementScore[]` | 8 | ~3167 | `fetchEngagementDashboard`, `fetchEngagementScores` | `EngagementScore` (already in schema) |
| `mockSentiments` | `SentimentAnalysis[]` | 3 | ~3178 | `fetchSentimentAnalysis` | `EngagementSentimentAnalysis` (already in schema) |
| `mockActionPlans` | `ActionPlan[]` | 6 | ~3184 | `fetchActionPlans`, `createActionPlan` (push), `updateActionPlan` | `EngagementActionPlan` (already in schema) |

---

## 10. Rewards & Recognition (`app/lib/workforce-api.ts` ~4059–4338)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockEmployeeAwards` | `EmployeeAward[]` | 8 | ~4059 | `fetchRewardsDashboard`, `fetchAwards`, `createAward` (push), `updateAward`, `deleteAward` (splice) | `EmployeeAward` |
| `mockRewardsPrograms` | `RewardsRecognitionProgram[]` | 4 | ~4070 | `fetchRewardsDashboard`, `fetchRewardsRecognitionPrograms`, `createRewardsRecognitionProgram` (push), `updateRewardsRecognitionProgram`, `deleteRewardsRecognitionProgram` (splice) | `RewardsProgram` |
| `mockRewardBalances` | `RewardPointBalance[]` | 6 | ~4077 | `fetchRewardsDashboard`, `fetchRewardPointsBalances`, `awardPoints` (mutate) | `RewardPointBalance` |
| `mockRewardTransactions` | `RewardPointTransaction[]` | 9 | ~4086 | `fetchRewardPointTransactions`, `awardPoints` (push) | `RewardPointTransaction` |
| `mockAchievementRecords` | `AchievementRecord[]` | 7 | ~4098 | `fetchRewardsDashboard`, `fetchAchievements`, `createAchievement` (push), `updateAchievement`, `deleteAchievement` (splice) | `Achievement` |

---

## 11. Workforce Planning (`app/lib/workforce-api.ts` ~3627–4045)

| Array | Interface | Items | Lines | Consumed By | DB Table |
|---|---|---|---|---|---|
| `mockHeadcountPlans` | `WFHeadcountPlan[]` | 8 | ~3627 | `fetchWFDashboard`, `fetchWFHeadcountPlans`, `createWFHeadcountPlan` (push), `updateWFHeadcountPlan`, `fetchWFHeadcountReports` (map) | `WFHeadcountPlan` |
| `mockWorkforceForecasts` | `WFWorkforceForecast[]` | 6 | ~3638 | `fetchWFWorkforceForecasts`, `createWFWorkforceForecast` (push) | `WFWorkforceForecast` |
| `mockHiringPlans` | `WFHiringPlan[]` | 8 | ~3647 | `fetchWFDashboard`, `fetchWFHiringPlans`, `createWFHiringPlan` (push), `updateWFHiringPlan` | `WFHiringPlan` |
| `mockCapacityPlans` | `WFCapacityPlan[]` | 8 | ~3658 | `fetchWFDashboard`, `fetchWFCapacityPlans`, `createWFCapacityPlan` (push) | `WFCapacityPlan` |
| `mockSkillGaps` | `WFSkillGap[]` | 6 | ~3669 | `fetchWFDashboard`, `fetchWFSkillGaps`, `createWFSkillGap` (push) | `WFSkillGap` |
| `mockSuccessionPlans` | `WFSuccessionPlan[]` | 6 | ~3678 | `fetchWFDashboard`, `fetchWFSuccessionPlans`, `createWFSuccessionPlan` (push), `updateWFSuccessionPlan`, `fetchWFSuccessionReports` (map) | `WFSuccessionPlan` |
| `mockBudgetPlans` | `WFBudgetPlan[]` | 8 | ~3687 | `fetchWFDashboard`, `fetchWFBudgetPlans`, `createWFBudgetPlan` (push), `updateWFBudgetPlan`, `fetchWFBudgetReports` (map) | `WFBudgetPlan` |
| `mockScenarioPlans` | `WFScenarioPlan[]` | 4 | ~3698 | `fetchWFScenarioPlans`, `createWFScenarioPlan` (push) | `WFScenarioPlan` |

---

## 12. Hardcoded Report Data (no arrays, inline return)

These functions return static data directly from hardcoded values rather than mapping from mock arrays.

### Recruitment
| Function | Payload | Scope |
|---|---|---|
| `fetchTimeToHire` | 12 months of hardcoded `{ month, days }` | ~line 380 |
| `fetchMonthlyRecruitmentActivity` | 12 months of hardcoded `{ month, applications, interviews, offers }` | ~line 410 |

### Onboarding
| Function | Payload | Scope |
|---|---|---|
| `fetchOnboardingCompletionRate` | 6 months of hardcoded `{ month, completed, total, rate }` | ~line 730 |
| `fetchMonthlyJoiningTrends` | 6 months of hardcoded `{ month, joinings }` | ~line 760 |

### Assets
| Function | Payload | Scope |
|---|---|---|
| `fetchAssetUtilization` | 6 months of hardcoded `{ month, utilized, available }` | ~line 970 |
| `fetchMaintenanceCost` | 6 months of hardcoded `{ month, cost }` | ~line 1000 |

### Learning
| Function | Payload | Scope |
|---|---|---|
| `fetchLearningProgress` | 5 hardcoded items `{ course, enrolled, completed, rate }` | ~line 1300 |
| `fetchCertificationReports` | 5 hardcoded items `{ cert, active, expired }` | ~line 1320 |
| `fetchDeptLearningStats` | 5 hardcoded items `{ department, enrolled, completed, rate }` | ~line 1340 |
| `fetchSkillTrends` | 6 months of hardcoded `{ month, beginners, intermediate, advanced }` | ~line 1360 |

### Compensation
| Function | Payload | Scope |
|---|---|---|
| `fetchDeptCompCost` | 5 hardcoded items `{ department, cost }` | ~line 1700 |
| `fetchReviewOutcomes` | 6 months of hardcoded `{ month, approved, rejected, pending }` | ~line 1730 |

### Travel
| Function | Payload | Scope |
|---|---|---|
| `fetchTravelExpenseReports` | 6 months of hardcoded `{ month, expense, reimbursed }` | ~line 2370 |
| `fetchTravelDeptData` | 5 hardcoded items `{ department, travelCount, expenseCount, totalAmount }` | ~line 2400 |

### Compliance
| Function | Payload | Scope |
|---|---|---|
| `fetchComplianceTrends` | 12 months of hardcoded `{ month, complianceRate }` | ~line 2920 |
| `fetchAuditCompletionData` | 4 quarters of hardcoded `{ quarter, completed, pending }` | ~line 2950 |
| `fetchDeptComplianceStats` | 6 hardcoded items `{ department, compliant, nonCompliant }` | ~line 2980 |
| `fetchPolicyAdherenceTrends` | 12 months of hardcoded `{ month, adherenceRate, acknowledgementRate }` | ~line 3010 |

### Engagement
| Function | Payload | Scope |
|---|---|---|
| `fetchSurveyReports` | 4 hardcoded items `{ survey, responses, score }` | ~line 3400 |
| `fetchEngagementReports` | 4 hardcoded items `{ metric, value, previous }` | ~line 3430 |
| `fetchRecognitionReports` | 4 hardcoded items `{ program, count, Impact }` | ~line 3460 |
| `fetchParticipationReports` | 4 hardcoded items `{ activity, Participation, rate }` | ~line 3490 |

### Workforce Planning
| Function | Payload | Scope |
|---|---|---|
| `fetchWFForecastReports` | 6 periods of hardcoded `{ period, forecasted, actual }` | ~line 3800 |
| `fetchWFHiringReports` | 5 hardcoded items `{ department, planned, actual }` | ~line 3830 |
| `fetchWFSkillGapReports` | 5 hardcoded items `{ department, gapCount, criticalRole }` | ~line 3860 |

---

## 13. Static Pages (no import from `workforce-api.ts`)

### Employee Lifecycle Dashboard
**File:** `app/zoiko-hr/employee-lifecycle/page.tsx`

| Variable | Data | Items | Notes |
|---|---|---|---|
| `lifecycleStats` | `{ totalActive, onboardedThisMonth, pendingTransfers, offboardedThisMonth }` | 1 obj | Hardcoded inline (line 8) |
| `recentOnboardings` | Array of `{ id, name, position, department, startDate, status }` | 3 | Lines 15–19 |
| `recentTransfers` | Array of `{ id, name, from, to, department, effectiveDate, status }` | 3 | Lines 21–25 |
| `recentOffboardings` | Array of `{ id, name, position, department, exitDate, status }` | 2 | Lines 27–30 |

### Employee Lifecycle — Offboarding
**File:** `app/zoiko-hr/employee-lifecycle/offboarding/page.tsx`

| Variable | Data | Items | Notes |
|---|---|---|---|
| `initialRecords` | `OffboardingRecord[]` | 5 | Line 21 |

### Employee Lifecycle — Onboarding
**File:** `app/zoiko-hr/employee-lifecycle/onboarding/page.tsx`

| Variable | Data | Items | Notes |
|---|---|---|---|
| `initialRecords` | `OnboardingRecord[]` | 5 | Line 21 |

### Employee Lifecycle — Transfers
**File:** `app/zoiko-hr/employee-lifecycle/transfers/page.tsx`

| Variable | Data | Items | Notes |
|---|---|---|---|
| `initialRecords` | `TransferRecord[]` | 6 | Line 21 |

### Helpdesk
**File:** `app/zoiko-hr/helpdesk/mockData.ts`

| Variable | Interface | Items | Notes |
|---|---|---|---|
| `initialTickets` | `Ticket[]` | 8 | Line 74 |
| `initialEmployeeRequests` | `EmployeeRequest[]` | 6 | Line 181 |
| `initialCases` | `HelpdeskCase[]` | 5 | Line 272 |
| `initialSLAs` | `SLA[]` | 4 | Line 359 |
| `initialKnowledgeArticles` | `KnowledgeArticle[]` | 5 | Line 428 |

---

## Legend

| Annotation | Meaning |
|---|---|
| `push` | Function appends to the mock array (non-persistent — lost on refresh) |
| `splice` | Function removes from the mock array |
| `mutate` | Function mutates an array element in place |
| `map` | Function derives report data by mapping over the mock array |
| `(already in schema)` | DB table name matches an existing Prisma schema model |
