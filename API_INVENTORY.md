# Zoiko One Frontend — API Inventory

> Complete inventory of every API function used in the Zoiko One frontend.
> **Total: 263 functions** (80 Real + 183 Mock)

---

# PART I: REAL API FUNCTIONS

## Shared Infrastructure

### `app/lib/api/client.ts`

| # | Function | HTTP Method | Endpoint | Request Payload | Response Type | Used By | Backend |
|---|----------|-------------|----------|----------------|---------------|---------|---------|
| — | `apiFetch<T>(url, options?)` | any | dynamic | `ApiFetchOptions` (extended `RequestInit` + `timeout`) | `Promise<T>` | All real API functions | N/A (HTTP client) |
| — | `buildUrl(base, filters?)` | — | — | `base: string`, `filters?: Record<string, string\|number\|boolean\|undefined\|null>` | `string` | All real API functions | N/A (URL builder) |
| — | `ApiError` (class) | — | — | `status: number`, `message: string`, `body?: unknown` | `Error` subclass | All real API functions | N/A (error wrapper) |

### `app/lib/api/types.ts`

| # | Type | Description |
|---|------|-------------|
| — | `ApiResponse<T>` | `{ data: T; message?: string }` |
| — | `PaginatedResponse<T>` | Extends `ApiResponse<T>` with `total`, `skip`, `take`, `totalPages?` |
| — | `ApiErrorBody` | `{ error: string; message?: string; statusCode?: number; details?: unknown }` |

---

## Workforce — `app/lib/api/workforce.api.ts`

**Base endpoints:** `/api/zoiko-hr/workforce`, `/api/zoiko-hr/departments`, `/api/zoiko-hr/designations`, `/api/zoiko-hr/documents`

### Employees

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 1 | `fetchEmployees(filters?)` | GET | `/api/zoiko-hr/workforce` | `EmployeeFilters` | `EmployeeListResponse` | workforce/page, workforce/employees, workforce/addresses, workforce/documents, workforce/emergency-contacts, workforce/employment-records, leave/balances | Employee |
| 2 | `fetchEmployee(id)` | GET | `/api/zoiko-hr/workforce/{id}` | `id: string` | `{ data: Employee }` | workforce/employees/[employeeId], workforce/employees/[employeeId]/edit | Employee |
| 3 | `createEmployee(body)` | POST | `/api/zoiko-hr/workforce` | `{ firstName, lastName, email, phoneNumber?, joinDate, employmentType?, gender?, nationality?, personalEmail?, personalPhone? }` | `{ data: Employee }` | workforce/employees/new | Employee |
| 4 | `updateEmployee(id, body)` | PUT | `/api/zoiko-hr/workforce/{id}` | `{ firstName?, lastName?, email?, phoneNumber?, personalEmail?, personalPhone?, dateOfBirth?, gender?, nationality? }` | `{ data: Employee }` | workforce/employees/[employeeId]/edit | Employee |
| 5 | `deleteEmployee(id, reason?)` | DELETE | `/api/zoiko-hr/workforce/{id}?reason=...` | `id: string`, `reason?: string` | `{ ok: boolean }` | workforce/employees | Employee |

### Employee Profile

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 6 | `fetchEmployeeProfile(employeeId)` | GET | `/api/zoiko-hr/workforce/{employeeId}/profile` | `employeeId: string` | `EmployeeProfile` | workforce/employees/[employeeId] | EmployeeProfile |
| 7 | `upsertEmployeeProfile(employeeId, body)` | PUT | `/api/zoiko-hr/workforce/{employeeId}/profile` | `{ middleName?, preferredName?, maritalStatus?, bloodGroup?, allergies?, disabilities?, linkedinUrl?, bio? }` | `EmployeeProfile` | workforce/employees/[employeeId] | EmployeeProfile |

### Employment Records

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 8 | `fetchEmploymentRecords(employeeId)` | GET | `/api/zoiko-hr/workforce/{employeeId}/employment-records` | `employeeId: string` | `EmploymentRecord[]` | workforce/employees/[employeeId] | EmploymentRecord |
| 9 | `createEmploymentRecord(employeeId, body)` | POST | `/api/zoiko-hr/workforce/{employeeId}/employment-records` | `{ jobTitle?, departmentId?, employmentType?, salaryAmount?, salaryCurrency?, changeReason, notes? }` | `EmploymentRecord` | workforce/employees/[employeeId] | EmploymentRecord |

### Per-Employee Documents

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 10 | `fetchEmployeeDocuments(employeeId)` | GET | `/api/zoiko-hr/workforce/{employeeId}/documents` | `employeeId: string` | `EmployeeDocument[]` | workforce/employees/[employeeId] | EmployeeDocumentReference |
| 11 | `createEmployeeDocument(employeeId, body)` | POST | `/api/zoiko-hr/workforce/{employeeId}/documents` | `{ documentType, fileName?, fileUrl?, fileSize?, mimeType?, status?, expiryDate?, notes? }` | `EmployeeDocument` | — | EmployeeDocumentReference |
| 12 | `deleteEmployeeDocument(employeeId, documentId)` | DELETE | `/api/zoiko-hr/workforce/{employeeId}/documents/{documentId}` | `employeeId, documentId: string` | `{ ok: boolean }` | — | EmployeeDocumentReference |

### Emergency Contacts

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 13 | `fetchEmergencyContacts(employeeId)` | GET | `/api/zoiko-hr/workforce/{employeeId}/emergency-contacts` | `employeeId: string` | `EmergencyContact[]` | workforce/employees/[employeeId] | EmergencyContact |
| 14 | `createEmergencyContact(employeeId, body)` | POST | `/api/zoiko-hr/workforce/{employeeId}/emergency-contacts` | `{ firstName, lastName, relationship, phoneNumber, email?, address?, city?, state?, notes? }` | `EmergencyContact` | — | EmergencyContact |
| 15 | `deleteEmergencyContact(employeeId, contactId)` | DELETE | `/api/zoiko-hr/workforce/{employeeId}/emergency-contacts/{contactId}` | `employeeId, contactId: string` | `{ ok: boolean }` | — | EmergencyContact |

### Addresses

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 16 | `fetchEmployeeAddresses(employeeId)` | GET | `/api/zoiko-hr/workforce/{employeeId}/addresses` | `employeeId: string` | `EmployeeAddress[]` | workforce/employees/[employeeId] | EmployeeAddress |
| 17 | `createEmployeeAddress(employeeId, body)` | POST | `/api/zoiko-hr/workforce/{employeeId}/addresses` | `{ type, isPrimary?, address?, apt?, city?, state?, postalCode?, country }` | `EmployeeAddress` | — | EmployeeAddress |
| 18 | `deleteEmployeeAddress(employeeId, addressId)` | DELETE | `/api/zoiko-hr/workforce/{employeeId}/addresses/{addressId}` | `employeeId, addressId: string` | `{ ok: boolean }` | — | EmployeeAddress |

### Departments

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 19 | `fetchDepartments(filters?)` | GET | `/api/zoiko-hr/departments` | `DepartmentFilters` | `DepartmentListResponse` | departments, designations, leave/balances | Department |
| 20 | `fetchDepartment(id)` | GET | `/api/zoiko-hr/departments/{id}` | `id: string` | `{ data: Department }` | departments/[departmentId] | Department |
| 21 | `createDepartment(body)` | POST | `/api/zoiko-hr/departments` | `{ name, code, description?, parentDeptId?, headEmployeeId?, budget? }` | `{ data: Department }` | departments | Department |
| 22 | `updateDepartment(id, body)` | PUT | `/api/zoiko-hr/departments/{id}` | `{ name?, code?, description?, parentDeptId?, headEmployeeId?, budget?, status? }` | `{ data: Department }` | departments | Department |
| 23 | `deleteDepartment(id)` | DELETE | `/api/zoiko-hr/departments/{id}` | `id: string` | `{ ok: boolean }` | departments | Department |

### Designations

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 24 | `fetchDesignations(filters?)` | GET | `/api/zoiko-hr/designations` | `DesignationFilters` | `DesignationListResponse` | designations, departments/[departmentId] | Designation |
| 25 | `fetchDesignation(id)` | GET | `/api/zoiko-hr/designations/{id}` | `id: string` | `{ data: Designation }` | designations/[designationId] | Designation |
| 26 | `createDesignation(body)` | POST | `/api/zoiko-hr/designations` | `{ title, code, level, category, grade?, description?, minSalary?, maxSalary?, departmentId? }` | `{ data: Designation }` | designations | Designation |
| 27 | `updateDesignation(id, body)` | PUT | `/api/zoiko-hr/designations/{id}` | `{ title?, code?, level?, category?, grade?, description?, minSalary?, maxSalary?, departmentId?, status? }` | `{ data: Designation }` | designations | Designation |
| 28 | `deleteDesignation(id)` | DELETE | `/api/zoiko-hr/designations/{id}` | `id: string` | `{ ok: boolean }` | designations | Designation |

### Documents (Standalone)

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 29 | `fetchDocuments(filters?)` | GET | `/api/zoiko-hr/documents` | `DocumentFilters` | `DocumentListResponse` | documents | EmployeeDocumentReference |
| 30 | `getDocument(id)` | GET | `/api/zoiko-hr/documents/{id}` | `id: string` | `{ data: EmployeeDocument }` | documents/[documentId] | EmployeeDocumentReference |
| 31 | `createDocument(body)` | POST | `/api/zoiko-hr/documents` | `{ employeeId, documentType, fileName?, fileUrl?, fileSize?, mimeType?, status?, expiryDate?, notes? }` | `{ data: EmployeeDocument }` | — | EmployeeDocumentReference |
| 32 | `updateDocument(id, body)` | PUT | `/api/zoiko-hr/documents/{id}` | `{ documentType?, fileName?, fileUrl?, fileSize?, mimeType?, status?, expiryDate?, notes? }` | `{ data: EmployeeDocument }` | documents/[documentId] | EmployeeDocumentReference |
| 33 | `deleteDocument(id)` | DELETE | `/api/zoiko-hr/documents/{id}` | `id: string` | `{ ok: boolean }` | documents, documents/[documentId] | EmployeeDocumentReference |

---

## Leave — `app/lib/api/leave.api.ts`

**Base endpoint:** `/api/zoiko-hr/leave`

### Leave Types

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 34 | `fetchLeaveTypes(filters?)` | GET | `/api/zoiko-hr/leave/types` | `{ search?, category?, isActive?, skip?, take? }` | `LeaveTypeListResponse` | leave, leave/balances, leave/leave-types, leave/requests | LeaveType |
| 35 | `createLeaveType(body)` | POST | `/api/zoiko-hr/leave/types` | `{ name, code, description?, category, maxDaysPerYear?, minDaysRequired?, requiresApproval?, requiresMedicalCert?, attachmentRequired? }` | `{ data: LeaveType }` | leave/leave-types | LeaveType |
| 36 | `updateLeaveType(id, body)` | PUT | `/api/zoiko-hr/leave/types/{id}` | `{ name?, code?, description?, category?, maxDaysPerYear?, minDaysRequired?, requiresApproval?, requiresMedicalCert?, attachmentRequired?, isActive? }` | `{ data: LeaveType }` | leave/leave-types | LeaveType |
| 37 | `deleteLeaveType(id)` | DELETE | `/api/zoiko-hr/leave/types/{id}` | `id: string` | `{ ok: boolean }` | leave/leave-types | LeaveType |

### Leave Requests

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 38 | `fetchLeaveRequests(filters?)` | GET | `/api/zoiko-hr/leave/requests` | `{ search?, status?, leaveTypeId?, employeeId?, startDate?, endDate?, skip?, take?, orderBy?, orderDir? }` | `LeaveRequestListResponse` | leave, leave/requests | LeaveRequest |
| 39 | `fetchLeaveRequest(id)` | GET | `/api/zoiko-hr/leave/requests/{id}` | `id: string` | `{ data: LeaveRequest }` | leave/requests/[requestId] | LeaveRequest |
| 40 | `createLeaveRequest(body)` | POST | `/api/zoiko-hr/leave/requests` | `{ employeeId, leaveTypeId, startDate, endDate, workingDaysRequested?, reason? }` | `{ data: LeaveRequest }` | leave/requests | LeaveRequest |
| 41 | `approveLeaveRequest(requestId, action, reason?)` | POST | `/api/zoiko-hr/leave/requests/{requestId}/approve` | `requestId: string`, `action: "APPROVED"\|"REJECTED"`, `reason?: string` | `{ ok: boolean }` | leave/requests, leave/requests/[requestId] | LeaveApproval |
| 42 | `cancelLeaveRequest(requestId)` | DELETE | `/api/zoiko-hr/leave/requests/{requestId}` | `requestId: string` | `{ ok: boolean }` | leave/requests | LeaveRequest |

### Leave Balances

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 43 | `fetchLeaveBalances(filters?)` | GET | `/api/zoiko-hr/leave/balances` | `{ employeeId?, leaveTypeId?, year? }` | `LeaveBalance[]` | leave/balances | LeaveBalance |
| 44 | `initializeLeaveBalance(body)` | POST | `/api/zoiko-hr/leave/balances` | `{ employeeId, leaveTypeId, year?, allocatedDays }` | `{ data: LeaveBalance }` | — | LeaveBalance |

### Leave Calendar

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 45 | `fetchLeaveCalendar(filters?)` | GET | `/api/zoiko-hr/leave/calendar` | `{ startDate?, endDate?, employeeId? }` | `CalendarEvent[]` | leave/calendar | LeaveRequest |

---

## Attendance — `app/lib/api/attendance.api.ts`

**Base endpoints:** `/api/zoiko-hr/attendance`, `/api/zoiko-hr/shifts`

### Attendance

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 46 | `fetchAttendanceDashboard()` | GET | `/api/zoiko-hr/attendance/dashboard` | — | `{ data: AttendanceDashboardStats }` | attendance | Attendance |
| 47 | `fetchAttendances(filters?)` | GET | `/api/zoiko-hr/attendance` | `{ search?, status?, employeeId?, departmentId?, startDate?, endDate?, skip?, take?, orderBy?, orderDir? }` | `AttendanceListResponse` | attendance/records | Attendance |
| 48 | `fetchAttendance(id)` | GET | `/api/zoiko-hr/attendance/{id}` | `id: string` | `{ data: AttendanceRecord }` | — | Attendance |
| 49 | `createAttendance(body)` | POST | `/api/zoiko-hr/attendance` | `{ employeeId, date, checkIn?, checkOut?, status, remarks? }` | `{ data: AttendanceRecord }` | attendance/entry | Attendance |
| 50 | `updateAttendance(id, body)` | PUT | `/api/zoiko-hr/attendance/{id}` | `{ checkIn?, checkOut?, status?, remarks? }` | `{ data: AttendanceRecord }` | — | Attendance |
| 51 | `deleteAttendance(id, reason?)` | DELETE | `/api/zoiko-hr/attendance/{id}?reason=...` | `id: string`, `reason?: string` | `{ ok: boolean }` | — | Attendance |
| 52 | `checkInEmployee(employeeId, date?)` | POST | `/api/zoiko-hr/attendance/check-in` | `{ employeeId, date? }` | `{ data: AttendanceRecord }` | attendance/check-in-out | Attendance |
| 53 | `checkOutEmployee(employeeId, date?)` | POST | `/api/zoiko-hr/attendance/check-out` | `{ employeeId, date? }` | `{ data: AttendanceRecord }` | attendance/check-in-out | Attendance |
| 54 | `fetchAttendanceReport(filters)` | GET | `/api/zoiko-hr/attendance/reports` | `{ type, startDate, endDate, employeeId?, departmentId? }` | `AttendanceReport` | attendance/reports | Attendance |

### Shifts

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 55 | `fetchShifts(filters?)` | GET | `/api/zoiko-hr/shifts` | `{ search?, skip?, take?, orderBy?, orderDir? }` | `ShiftListResponse` | attendance/shifts | Shift |
| 56 | `fetchShift(id)` | GET | `/api/zoiko-hr/shifts/{id}` | `id: string` | `{ data: ShiftRecord }` | — | Shift |
| 57 | `createShift(body)` | POST | `/api/zoiko-hr/shifts` | `{ name, startTime, endTime, gracePeriod?, weeklyOff? }` | `{ data: ShiftRecord }` | — | Shift |
| 58 | `updateShift(id, body)` | PUT | `/api/zoiko-hr/shifts/{id}` | `{ name?, startTime?, endTime?, gracePeriod?, weeklyOff? }` | `{ data: ShiftRecord }` | — | Shift |
| 59 | `deleteShift(id, reason?)` | DELETE | `/api/zoiko-hr/shifts/{id}?reason=...` | `id: string`, `reason?: string` | `{ ok: boolean }` | — | Shift |
| 60 | `assignShiftToEmployee(body)` | POST | `/api/zoiko-hr/shifts/assign` | `{ shiftId, employeeId, effectiveFrom, effectiveTo? }` | `{ data: { id: string } }` | — | ShiftAssignment |

---

## Performance — `app/lib/api/performance.api.ts`

**Base endpoint:** `/api/zoiko-hr/performance`

### Dashboard

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 61 | `fetchPerformanceDashboard()` | GET | `/api/zoiko-hr/performance/dashboard` | — | `{ data: PerformanceDashboardStats }` | performance | PerformanceReview/Goal/Feedback |

### Review Cycles

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 62 | `fetchCycles(filters?)` | GET | `/api/zoiko-hr/performance/cycles` | `{ search?, status?, skip?, take?, orderBy?, orderDir? }` | `ReviewCycleListResponse` | performance/reviews | ReviewCycle |
| 63 | `fetchCycle(id)` | GET | `/api/zoiko-hr/performance/cycles/{id}` | `id: string` | `{ data: ReviewCycleRecord }` | — | ReviewCycle |
| 64 | `createCycle(body)` | POST | `/api/zoiko-hr/performance/cycles` | `{ name, description?, startDate, endDate, status? }` | `{ data: ReviewCycleRecord }` | — | ReviewCycle |
| 65 | `updateCycle(id, body)` | PUT | `/api/zoiko-hr/performance/cycles/{id}` | `{ name?, description?, startDate?, endDate?, status? }` | `{ data: ReviewCycleRecord }` | — | ReviewCycle |
| 66 | `deleteCycle(id, reason?)` | DELETE | `/api/zoiko-hr/performance/cycles/{id}?reason=...` | `id: string`, `reason?: string` | `{ ok: boolean }` | — | ReviewCycle |

### Reviews

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 67 | `fetchReviews(filters?)` | GET | `/api/zoiko-hr/performance/reviews` | `{ search?, status?, employeeId?, cycleId?, skip?, take?, orderBy?, orderDir? }` | `ReviewListResponse` | performance, performance/reviews | PerformanceReview |
| 68 | `fetchReview(id)` | GET | `/api/zoiko-hr/performance/reviews/{id}` | `id: string` | `{ data: PerformanceReviewRecord }` | — | PerformanceReview |
| 69 | `createReview(body)` | POST | `/api/zoiko-hr/performance/reviews` | `{ employeeId, reviewerId?, cycleId, overallRating?, status?, strengths?, improvements?, notes? }` | `{ data: PerformanceReviewRecord }` | performance/reviews | PerformanceReview |
| 70 | `updateReview(id, body)` | PUT | `/api/zoiko-hr/performance/reviews/{id}` | `{ reviewerId?, overallRating?, status?, strengths?, improvements?, notes? }` | `{ data: PerformanceReviewRecord }` | performance/reviews | PerformanceReview |
| 71 | `deleteReview(id, reason?)` | DELETE | `/api/zoiko-hr/performance/reviews/{id}?reason=...` | `id: string`, `reason?: string` | `{ ok: boolean }` | performance/reviews | PerformanceReview |

### Goals

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 72 | `fetchGoals(filters?)` | GET | `/api/zoiko-hr/performance/goals` | `{ search?, status?, employeeId?, category?, skip?, take?, orderBy?, orderDir? }` | `GoalListResponse` | performance, performance/goals | Goal |
| 73 | `fetchGoal(id)` | GET | `/api/zoiko-hr/performance/goals/{id}` | `id: string` | `{ data: GoalRecord }` | — | Goal |
| 74 | `createGoal(body)` | POST | `/api/zoiko-hr/performance/goals` | `{ employeeId, title, description?, category?, startDate, targetDate?, status?, progress?, notes? }` | `{ data: GoalRecord }` | performance/goals | Goal |
| 75 | `updateGoal(id, body)` | PUT | `/api/zoiko-hr/performance/goals/{id}` | `{ title?, description?, category?, startDate?, targetDate?, completedDate?, status?, progress?, notes? }` | `{ data: GoalRecord }` | performance/goals | Goal |
| 76 | `deleteGoal(id, reason?)` | DELETE | `/api/zoiko-hr/performance/goals/{id}?reason=...` | `id: string`, `reason?: string` | `{ ok: boolean }` | performance/goals | Goal |
| 77 | `createGoalUpdate(goalId, body)` | POST | `/api/zoiko-hr/performance/goals/{goalId}/updates` | `{ updateText, previousProgress?, newProgress? }` | `{ data: GoalUpdateRecord }` | performance/goals | GoalUpdate |

### Feedback

| # | Function | Method | Endpoint | Request Payload | Response Type | Frontend Pages | Backend |
|---|----------|--------|----------|----------------|---------------|----------------|---------|
| 78 | `fetchFeedbacks(filters?)` | GET | `/api/zoiko-hr/performance/feedback` | `{ search?, employeeId?, giverId?, type?, skip?, take?, orderBy?, orderDir? }` | `FeedbackListResponse` | performance/feedback | Feedback |
| 79 | `createFeedback(body)` | POST | `/api/zoiko-hr/performance/feedback` | `{ employeeId, giverId?, type?, category?, content, isConfidential? }` | `{ data: FeedbackRecord }` | performance/feedback | Feedback |
| 80 | `deleteFeedback(id, reason?)` | DELETE | `/api/zoiko-hr/performance/feedback/{id}?reason=...` | `id: string`, `reason?: string` | `{ ok: boolean }` | performance/feedback | Feedback |

---

# PART II: MOCK API FUNCTIONS

> All mock functions live in `app/lib/workforce-api.ts` and operate on in-memory data.
> **Backend dependency:** none (mock data).
> **Endpoint:** MOCK — in-memory.

---

## Recruitment (18 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 81 | `fetchRecruitmentDashboard()` | GET | — | `{ data: RecruitmentDashboardStats }` | recruitment |
| 82 | `fetchJobOpenings(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: JobOpening[], total, skip, take }` | recruitment/jobs |
| 83 | `createJobOpening(body)` | POST | `Partial<JobOpening> & { title, department }` | `{ data: JobOpening }` | recruitment/jobs |
| 84 | `updateJobOpening(id, body)` | PUT | `id`, `Partial<JobOpening>` | `{ data: JobOpening }` | recruitment/jobs |
| 85 | `closeJobOpening(id)` | POST | `id: string` | `{ ok: boolean }` | recruitment/jobs |
| 86 | `fetchCandidates(filters?)` | GET | `{ search?, stage?, status?, skip?, take? }` | `{ data: Candidate[], total, skip, take }` | recruitment/candidates |
| 87 | `updateCandidateStage(id, stage)` | PUT | `id`, `stage: CandidateStage` | `{ data: Candidate }` | recruitment/candidates |
| 88 | `fetchInterviews(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Interview[], total, skip, take }` | recruitment/interviews |
| 89 | `createInterview(body)` | POST | `{ candidateId, candidateName, position, interviewer, date, time, type }` | `{ data: Interview }` | recruitment/interviews |
| 90 | `updateInterviewStatus(id, status, feedback?, rating?)` | PUT | `id`, `status: InterviewStatus`, `feedback?, rating?` | `{ data: Interview }` | recruitment/interviews |
| 91 | `fetchOffers(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Offer[], total, skip, take }` | recruitment/offers |
| 92 | `createOffer(body)` | POST | `{ candidateId, candidateName, position, salary, currency?, notes? }` | `{ data: Offer }` | recruitment/offers |
| 93 | `updateOfferStatus(id, status)` | PUT | `id`, `status: OfferStatus` | `{ data: Offer }` | recruitment/offers |
| 94 | `fetchRecruitmentFunnel()` | GET | — | `{ data: RecruitmentFunnelData[] }` | recruitment |
| 95 | `fetchTimeToHire()` | GET | — | `{ data: TimeToHireData[] }` | recruitment |
| 96 | `fetchOfferAcceptanceRate()` | GET | — | `{ data: number }` | recruitment |
| 97 | `fetchHiringByDepartment()` | GET | — | `{ data: DepartmentHireData[] }` | recruitment |
| 98 | `fetchMonthlyRecruitmentActivity()` | GET | — | `{ data: MonthlyActivityData[] }` | recruitment |

---

## Onboarding (16 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 99 | `fetchOnboardingDashboard()` | GET | — | `{ data: OnboardingDashboardStats }` | onboarding |
| 100 | `fetchNewJoiners(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: NewJoiner[], total, skip, take }` | onboarding/joiners |
| 101 | `updateNewJoinerStatus(id, status)` | PUT | `id`, `status: OnboardingStatus` | `{ data: NewJoiner }` | onboarding/joiners |
| 102 | `fetchDocumentVerifications(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: DocumentVerification[], total, skip, take }` | onboarding/documents |
| 103 | `updateDocumentStatus(id, field, status)` | PUT | `id`, `field`, `status: DocumentVerifyStatus` | `{ data: DocumentVerification }` | onboarding/documents |
| 104 | `fetchAssetAllocations(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: AssetAllocation[], total, skip, take }` | onboarding/assets |
| 105 | `updateAssetStatus(id, field, status)` | PUT | `id`, `field`, `status: AssetStatus` | `{ data: AssetAllocation }` | onboarding/assets |
| 106 | `fetchWelcomeKits(filters?)` | GET | `{ search?, skip?, take? }` | `{ data: WelcomeKit[], total, skip, take }` | onboarding/welcome-kits |
| 107 | `updateWelcomeKitStatus(id, field, status)` | PUT | `id`, `field`, `status: WelcomeKitStatus` | `{ data: WelcomeKit }` | onboarding/welcome-kits |
| 108 | `fetchProbations(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Probation[], total, skip, take }` | onboarding/probations |
| 109 | `updateProbationStatus(id, status)` | PUT | `id`, `status: ProbationStatus` | `{ data: Probation }` | onboarding/probations |
| 110 | `fetchOnboardingCompletionRate()` | GET | — | `{ data: OnboardingCompletionRate[] }` | onboarding |
| 111 | `fetchDeptOnboarding()` | GET | — | `{ data: DeptOnboardingData[] }` | onboarding |
| 112 | `fetchProbationSummary()` | GET | — | `{ data: ProbationSummaryData[] }` | onboarding |
| 113 | `fetchAssetSummary()` | GET | — | `{ data: AssetSummaryData[] }` | onboarding |
| 114 | `fetchMonthlyJoiningTrends()` | GET | — | `{ data: MonthlyJoiningTrend[] }` | onboarding |

---

## Assets (11 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 115 | `fetchAssetDashboard()` | GET | — | `{ data: AssetDashboardStats }` | assets |
| 116 | `fetchAssets(filters?)` | GET | `{ search?, category?, status?, skip?, take? }` | `{ data: AssetItem[], total, skip, take }` | assets/inventory |
| 117 | `updateAssetItemStatus(id, status)` | PUT | `id`, `status: AssetItemStatus` | `{ data: AssetItem }` | assets/inventory |
| 118 | `fetchAllocationRecords(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: AssetAllocationRecord[], total, skip, take }` | assets/allocations |
| 119 | `fetchReturnRecords(filters?)` | GET | `{ search?, skip?, take? }` | `{ data: AssetReturnRecord[], total, skip, take }` | assets/returns |
| 120 | `fetchMaintenanceRecords(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: AssetMaintenanceRecord[], total, skip, take }` | assets/maintenance |
| 121 | `updateMaintenanceStatus(id, status)` | PUT | `id`, `status: AssetMaintenanceStatus` | `{ data: AssetMaintenanceRecord }` | assets/maintenance |
| 122 | `fetchAssetUtilization()` | GET | — | `{ data: AssetUtilizationData[] }` | assets |
| 123 | `fetchDeptAllocation()` | GET | — | `{ data: DeptAllocationData[] }` | assets |
| 124 | `fetchMaintenanceCost()` | GET | — | `{ data: MaintenanceCostData[] }` | assets |
| 125 | `fetchAssetLifecycle()` | GET | — | `{ data: AssetLifecycleData[] }` | assets |

---

## Learning & Development / LMS (11 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 126 | `fetchLMSDashboard()` | GET | — | `{ data: LMSDashboardStats }` | learning |
| 127 | `fetchCourses(filters?)` | GET | `{ search?, category?, level?, status?, skip?, take? }` | `{ data: Course[], total, skip, take }` | learning/courses |
| 128 | `fetchLearningPaths(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: LearningPath[], total, skip, take }` | learning/paths |
| 129 | `fetchCertifications(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Certification[], total, skip, take }` | learning/certifications |
| 130 | `fetchAssessments(filters?)` | GET | `{ search?, skip?, take? }` | `{ data: Assessment[], total, skip, take }` | learning/assessments |
| 131 | `fetchEnrollments(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Enrollment[], total, skip, take }` | learning/enrollments |
| 132 | `fetchLearningProgress()` | GET | — | `{ data: LearningProgressData[] }` | learning |
| 133 | `fetchCertificationReports()` | GET | — | `{ data: CertificationReportData[] }` | learning |
| 134 | `fetchCourseCompletionData()` | GET | — | `{ data: CourseCompletionData[] }` | learning |
| 135 | `fetchDeptLearningStats()` | GET | — | `{ data: DeptLearningData[] }` | learning |
| 136 | `fetchSkillTrends()` | GET | — | `{ data: SkillTrendData[] }` | learning |

---

## Compensation & Benefits (13 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 137 | `fetchCompensationDashboard()` | GET | — | `{ data: CompensationDashboardStats }` | compensation |
| 138 | `fetchSalaryStructures(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: SalaryStructure[], total, skip, take }` | compensation/salary-structures |
| 139 | `fetchPayGrades(filters?)` | GET | `{ search?, skip?, take? }` | `{ data: PayGrade[], total, skip, take }` | compensation/pay-grades |
| 140 | `fetchAllowances(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Allowance[], total, skip, take }` | compensation/allowances |
| 141 | `fetchDeductions(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Deduction[], total, skip, take }` | compensation/deductions |
| 142 | `fetchBenefits(filters?)` | GET | `{ search?, category?, status?, skip?, take? }` | `{ data: BenefitPlan[], total, skip, take }` | compensation/benefits |
| 143 | `fetchBonuses(filters?)` | GET | `{ search?, type?, status?, skip?, take? }` | `{ data: Bonus[], total, skip, take }` | compensation/bonuses |
| 144 | `fetchCompReviews(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: CompensationReview[], total, skip, take }` | compensation/reviews |
| 145 | `fetchSalaryRevisions(filters?)` | GET | `{ search?, skip?, take? }` | `{ data: SalaryRevision[], total, skip, take }` | compensation/revisions |
| 146 | `fetchSalaryDistribution()` | GET | — | `{ data: SalaryDistributionData[] }` | compensation |
| 147 | `fetchBenefitEnrollment()` | GET | — | `{ data: BenefitEnrollmentData[] }` | compensation |
| 148 | `fetchDeptCompCost()` | GET | — | `{ data: DeptCompCostData[] }` | compensation |
| 149 | `fetchReviewOutcomes()` | GET | — | `{ data: ReviewOutcomeData[] }` | compensation |

---

## Employee Self Service / ESS (13 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 150 | `fetchESSDashboard()` | GET | — | `{ data: ESSDashboardStats }` | ess |
| 151 | `fetchESSProfile()` | GET | — | `{ data: ESSProfile }` | ess/profile |
| 152 | `fetchESSAttendance()` | GET | — | `{ data: EmployeeAttendance[] }` | ess/attendance |
| 153 | `fetchESSLeaveRequests()` | GET | — | `{ data: EmployeeLeaveReq[] }` | ess/leave |
| 154 | `fetchESSLeaveBalances()` | GET | — | `{ data: ESSLeaveBalance[] }` | ess/leave |
| 155 | `fetchESSDocuments()` | GET | — | `{ data: ESSDocument[] }` | ess/documents |
| 156 | `fetchESSAssets()` | GET | — | `{ data: EmployeeAsset[] }` | ess/assets |
| 157 | `fetchESSCourses()` | GET | — | `{ data: EmployeeCourse[] }` | ess/learning |
| 158 | `fetchESSReviews()` | GET | — | `{ data: EmployeeReview[] }` | ess/reviews |
| 159 | `fetchESSPayslips()` | GET | — | `{ data: Payslip[] }` | ess/payslips |
| 160 | `fetchESSRequests()` | GET | — | `{ data: EmployeeRequest[] }` | ess/requests |
| 161 | `fetchESSNotifications()` | GET | — | `{ data: Notification[] }` | ess/notifications |
| 162 | `markNotificationRead(id)` | PUT | `id: string` | `void` | ess/notifications |

---

## Travel & Expense (10 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 163 | `fetchTravelDashboard()` | GET | — | `{ data: TravelDashboardStats }` | travel |
| 164 | `fetchTravelRequests(filters?)` | GET | `{ search?, status?, priority?, skip?, take? }` | `{ data: TravelRequest[], total, skip, take }` | travel/requests |
| 165 | `fetchExpenseClaims(filters?)` | GET | `{ search?, status?, category?, skip?, take? }` | `{ data: ExpenseClaim[], total, skip, take }` | travel/expenses |
| 166 | `fetchExpenseCategories(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: ExpenseCategory[], total, skip, take }` | travel/categories |
| 167 | `fetchTravelApprovals(filters?)` | GET | `{ search?, status?, requestType?, skip?, take? }` | `{ data: TravelApproval[], total, skip, take }` | travel/approvals |
| 168 | `fetchReimbursements(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Reimbursement[], total, skip, take }` | travel/reimbursements |
| 169 | `fetchCorporateTrips(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: CorporateTrip[], total, skip, take }` | travel/trips |
| 170 | `fetchTravelPolicies(filters?)` | GET | `{ search?, status?, category?, skip?, take? }` | `{ data: TravelPolicy[], total, skip, take }` | travel/policies |
| 171 | `fetchTravelExpenseReports()` | GET | — | `{ data: TravelExpenseReportData[] }` | travel |
| 172 | `fetchTravelDeptData()` | GET | — | `{ data: TravelDeptData[] }` | travel |

---

## Compliance & Policy Management (25 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 173 | `fetchComplianceDashboard()` | GET | — | `{ data: ComplianceDashboardStats }` | compliance |
| 174 | `fetchPolicies(filters?)` | GET | `{ search?, category?, status?, skip?, take?, orderBy?, orderDir? }` | `{ data: Policy[], total, skip, take }` | compliance/policies |
| 175 | `createPolicy(body)` | POST | `{ policyName, category, description?, version? }` | `{ data: Policy }` | compliance/policies |
| 176 | `updatePolicy(id, body)` | PUT | `id`, `Partial<Policy>` | `{ data: Policy }` | compliance/policies |
| 177 | `fetchPolicyCategories(filters?)` | GET | `{ search?, skip?, take? }` | `{ data: PolicyCategory[], total, skip, take }` | compliance/categories |
| 178 | `createPolicyCategory(body)` | POST | `{ name, description? }` | `{ data: PolicyCategory }` | compliance/categories |
| 179 | `updatePolicyCategory(id, body)` | PUT | `id`, `Partial<PolicyCategory>` | `{ data: PolicyCategory }` | compliance/categories |
| 180 | `fetchComplianceRequirements(filters?)` | GET | `{ search?, status?, priority?, skip?, take? }` | `{ data: ComplianceRequirement[], total, skip, take }` | compliance/requirements |
| 181 | `createComplianceRequirement(body)` | POST | `{ title, description?, priority?, dueDate? }` | `{ data: ComplianceRequirement }` | compliance/requirements |
| 182 | `updateComplianceRequirement(id, body)` | PUT | `id`, `Partial<ComplianceRequirement>` | `{ data: ComplianceRequirement }` | compliance/requirements |
| 183 | `fetchAudits(filters?)` | GET | `{ search?, auditType?, status?, skip?, take? }` | `{ data: Audit[], total, skip, take }` | compliance/audits |
| 184 | `createAudit(body)` | POST | `{ auditName, auditType, auditor, scheduledDate? }` | `{ data: Audit }` | compliance/audits |
| 185 | `updateAuditStatus(id, status)` | PUT | `id`, `status: AuditStatus` | `{ data: Audit }` | compliance/audits |
| 186 | `fetchViolations(filters?)` | GET | `{ search?, severity?, status?, skip?, take?, orderBy?, orderDir? }` | `{ data: Violation[], total, skip, take }` | compliance/violations |
| 187 | `updateViolationStatus(id, status)` | PUT | `id`, `status: ViolationStatus` | `{ data: Violation }` | compliance/violations |
| 188 | `fetchCorrectiveActions(filters?)` | GET | `{ search?, status?, priority?, skip?, take? }` | `{ data: CorrectiveAction[], total, skip, take }` | compliance/corrective-actions |
| 189 | `createCorrectiveAction(body)` | POST | `{ title, description?, assignedTo, priority?, dueDate? }` | `{ data: CorrectiveAction }` | compliance/corrective-actions |
| 190 | `updateCorrectiveAction(id, body)` | PUT | `id`, `Partial<CorrectiveAction>` | `{ data: CorrectiveAction }` | compliance/corrective-actions |
| 191 | `fetchAcknowledgements(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: Acknowledgement[], total, skip, take }` | compliance/acknowledgements |
| 192 | `fetchTrainingCompliance(filters?)` | GET | `{ search?, status?, skip?, take? }` | `{ data: TrainingCompliance[], total, skip, take }` | compliance/training |
| 193 | `fetchComplianceTrends()` | GET | — | `{ data: ComplianceTrendData[] }` | compliance |
| 194 | `fetchViolationByCategory()` | GET | — | `{ data: ViolationByCategoryData[] }` | compliance |
| 195 | `fetchAuditCompletionData()` | GET | — | `{ data: AuditCompletionData[] }` | compliance |
| 196 | `fetchDeptComplianceStats()` | GET | — | `{ data: DeptComplianceData[] }` | compliance |
| 197 | `fetchPolicyAdherenceTrends()` | GET | — | `{ data: PolicyAdherenceTrendData[] }` | compliance |

---

## Employee Engagement & Surveys (23 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 198 | `fetchEngagementDashboard()` | GET | — | `{ data: EngagementDashboardStats }` | engagement |
| 199 | `fetchSurveys(filters?)` | GET | `{ search?, status?, surveyType?, skip?, take? }` | `{ data: Survey[], total, skip, take }` | engagement/surveys |
| 200 | `createSurvey(body)` | POST | `{ title, description?, surveyType, targetResponses? }` | `{ data: Survey }` | engagement/surveys |
| 201 | `updateSurvey(id, body)` | PUT | `id`, `Partial<Survey>` | `{ data: Survey }` | engagement/surveys |
| 202 | `fetchSurveyTemplates(filters?)` | GET | `{ search?, surveyType?, skip?, take? }` | `{ data: SurveyTemplate[], total, skip, take }` | engagement/templates |
| 203 | `fetchPulseSurveys(filters?)` | GET | `{ search?, status?, pulseType?, skip?, take? }` | `{ data: PulseSurvey[], total, skip, take }` | engagement/pulse |
| 204 | `createPulseSurvey(body)` | POST | `{ title, pulseType, targetResponses?, dueDate? }` | `{ data: PulseSurvey }` | engagement/pulse |
| 205 | `updatePulseSurveyStatus(id, status)` | PUT | `id`, `status: SurveyStatus` | `{ data: PulseSurvey }` | engagement/pulse |
| 206 | `fetchFeedbackCampaigns(filters?)` | GET | `{ search?, status?, campaignScope?, skip?, take? }` | `{ data: FeedbackCampaign[], total, skip, take }` | engagement/campaigns |
| 207 | `createFeedbackCampaign(body)` | POST | `{ name, campaignScope, department?, targetFeedbacks? }` | `{ data: FeedbackCampaign }` | engagement/campaigns |
| 208 | `updateFeedbackCampaignStatus(id, status)` | PUT | `id`, `status: CampaignStatus` | `{ data: FeedbackCampaign }` | engagement/campaigns |
| 209 | `fetchRecognitionPrograms()` | GET | — | `{ data: RecognitionProgram[] }` | engagement/recognition |
| 210 | `fetchEmployeeRecognitions(filters?)` | GET | `{ search?, awardType?, department?, skip?, take? }` | `{ data: EmployeeRecognition[], total, skip, take }` | engagement/recognition |
| 211 | `createEmployeeRecognition(body)` | POST | `{ employeeName, department, awardType, recognitionNotes? }` | `{ data: EmployeeRecognition }` | engagement/recognition |
| 212 | `fetchEngagementScores()` | GET | — | `{ data: EngagementScore[] }` | engagement |
| 213 | `fetchSentimentAnalysis()` | GET | — | `{ data: SentimentAnalysis[] }` | engagement |
| 214 | `fetchActionPlans(filters?)` | GET | `{ search?, status?, priority?, skip?, take? }` | `{ data: ActionPlan[], total, skip, take }` | engagement/action-plans |
| 215 | `createActionPlan(body)` | POST | `{ title, description?, owner, dueDate, priority? }` | `{ data: ActionPlan }` | engagement/action-plans |
| 216 | `updateActionPlan(id, body)` | PUT | `id`, `Partial<ActionPlan>` | `{ data: ActionPlan }` | engagement/action-plans |
| 217 | `fetchSurveyReports()` | GET | — | `{ data: SurveyReport[] }` | engagement |
| 218 | `fetchEngagementReports()` | GET | — | `{ data: EngagementReport[] }` | engagement |
| 219 | `fetchRecognitionReports()` | GET | — | `{ data: RecognitionReport[] }` | engagement |
| 220 | `fetchParticipationReports()` | GET | — | `{ data: ParticipationReport[] }` | engagement |

---

## Rewards & Recognition (16 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 221 | `fetchRewardsDashboard()` | GET | — | `{ data: RewardsDashboardStats }` | rewards |
| 222 | `fetchAwards(filters?)` | GET | `{ search?, employeeId?, category?, status?, skip?, take?, orderBy?, orderDir? }` | `{ data: EmployeeAward[], total, skip, take }` | rewards/awards |
| 223 | `createAward(body)` | POST | `{ employeeId, awardName, category, description?, dateAwarded, awardedBy? }` | `{ data: EmployeeAward }` | rewards/awards |
| 224 | `updateAward(id, body)` | PUT | `id`, `{ awardName?, category?, description?, dateAwarded?, awardedBy?, status? }` | `{ data: EmployeeAward }` | rewards/awards |
| 225 | `deleteAward(id)` | DELETE | `id: string` | `{ ok: boolean }` | rewards/awards |
| 226 | `fetchRewardsRecognitionPrograms(filters?)` | GET | `{ search?, type?, status?, skip?, take?, orderBy?, orderDir? }` | `{ data: RewardsRecognitionProgram[], total, skip, take }` | rewards/programs |
| 227 | `createRewardsRecognitionProgram(body)` | POST | `{ name, description?, type, frequency, eligibilityCriteria?, rewardAmount? }` | `{ data: RewardsRecognitionProgram }` | rewards/programs |
| 228 | `updateRewardsRecognitionProgram(id, body)` | PUT | `id`, `{ name?, description?, type?, frequency?, eligibilityCriteria?, rewardAmount?, status? }` | `{ data: RewardsRecognitionProgram }` | rewards/programs |
| 229 | `deleteRewardsRecognitionProgram(id)` | DELETE | `id: string` | `{ ok: boolean }` | rewards/programs |
| 230 | `fetchRewardPointsBalances(filters?)` | GET | `{ search?, employeeId?, tier?, skip?, take?, orderBy?, orderDir? }` | `{ data: RewardPointBalance[], total, skip, take }` | rewards/points |
| 231 | `fetchRewardPointTransactions(filters?)` | GET | `{ employeeId?, type?, skip?, take?, orderBy?, orderDir? }` | `{ data: RewardPointTransaction[], total, skip, take }` | rewards/points |
| 232 | `awardPoints(body)` | POST | `{ employeeId, points, reason, referenceType?, referenceId? }` | `{ data: RewardPointTransaction }` | rewards/points |
| 233 | `fetchAchievements(filters?)` | GET | `{ search?, employeeId?, category?, status?, skip?, take?, orderBy?, orderDir? }` | `{ data: AchievementRecord[], total, skip, take }` | rewards/achievements |
| 234 | `createAchievement(body)` | POST | `{ employeeId, title, description?, category, badgeIcon?, criteria?, unlockDate }` | `{ data: AchievementRecord }` | rewards/achievements |
| 235 | `updateAchievement(id, body)` | PUT | `id`, `{ title?, description?, category?, badgeIcon?, criteria?, status? }` | `{ data: AchievementRecord }` | rewards/achievements |
| 236 | `deleteAchievement(id)` | DELETE | `id: string` | `{ ok: boolean }` | rewards/achievements |

---

## Workforce Planning (27 functions)

| # | Function | Method | Payload | Response | Used By |
|---|----------|--------|---------|----------|---------|
| 237 | `fetchWFDashboard()` | GET | — | `{ data: WFDashboardStats }` | workforce-planning |
| 238 | `fetchWFHeadcountPlans(filters?)` | GET | `{ search?, status?, department?, skip?, take? }` | `{ data: WFHeadcountPlan[], total, skip, take }` | workforce-planning/headcount |
| 239 | `createWFHeadcountPlan(body)` | POST | `{ department, currentHeadcount, plannedHeadcount, targetDate }` | `{ data: WFHeadcountPlan }` | workforce-planning/headcount |
| 240 | `updateWFHeadcountPlan(id, body)` | PUT | `id`, `Partial<WFHeadcountPlan>` | `{ data: WFHeadcountPlan }` | workforce-planning/headcount |
| 241 | `fetchWFWorkforceForecasts(filter?)` | GET | `{ department?, period? }` | `{ data: WFWorkforceForecast[] }` | workforce-planning/forecasts |
| 242 | `createWFWorkforceForecast(body)` | POST | `{ department, currentEmployees, predictedAttrition, predictedHiring, forecastPeriod }` | `{ data: WFWorkforceForecast }` | workforce-planning/forecasts |
| 243 | `fetchWFHiringPlans(filters?)` | GET | `{ search?, status?, priority?, department?, skip?, take? }` | `{ data: WFHiringPlan[], total, skip, take }` | workforce-planning/hiring |
| 244 | `createWFHiringPlan(body)` | POST | `{ position, department, requiredHeadcount, priority, budget, hiringWindow }` | `{ data: WFHiringPlan }` | workforce-planning/hiring |
| 245 | `updateWFHiringPlan(id, body)` | PUT | `id`, `Partial<WFHiringPlan>` | `{ data: WFHiringPlan }` | workforce-planning/hiring |
| 246 | `fetchWFCapacityPlans(filter?)` | GET | `{ department? }` | `{ data: WFCapacityPlan[] }` | workforce-planning/capacity |
| 247 | `createWFCapacityPlan(body)` | POST | `{ department, availableCapacity, requiredCapacity }` | `{ data: WFCapacityPlan }` | workforce-planning/capacity |
| 248 | `fetchWFSkillGaps(filters?)` | GET | `{ search?, priority?, department? }` | `{ data: WFSkillGap[] }` | workforce-planning/skills |
| 249 | `createWFSkillGap(body)` | POST | `{ department, currentSkills, requiredSkills, priority, recommendedTraining }` | `{ data: WFSkillGap }` | workforce-planning/skills |
| 250 | `fetchWFSuccessionPlans(filters?)` | GET | `{ search?, riskLevel?, readinessLevel? }` | `{ data: WFSuccessionPlan[] }` | workforce-planning/succession |
| 251 | `createWFSuccessionPlan(body)` | POST | `{ criticalRole, currentEmployee, potentialSuccessor, readinessLevel, developmentPlan, riskLevel }` | `{ data: WFSuccessionPlan }` | workforce-planning/succession |
| 252 | `updateWFSuccessionPlan(id, body)` | PUT | `id`, `Partial<WFSuccessionPlan>` | `{ data: WFSuccessionPlan }` | workforce-planning/succession |
| 253 | `fetchWFBudgetPlans(filters?)` | GET | `{ search?, department? }` | `{ data: WFBudgetPlan[] }` | workforce-planning/budget |
| 254 | `createWFBudgetPlan(body)` | POST | `{ department, currentBudget, forecastBudget, hiringCost, trainingCost }` | `{ data: WFBudgetPlan }` | workforce-planning/budget |
| 255 | `updateWFBudgetPlan(id, body)` | PUT | `id`, `Partial<WFBudgetPlan>` | `{ data: WFBudgetPlan }` | workforce-planning/budget |
| 256 | `fetchWFScenarioPlans(filter?)` | GET | `{ scenarioType? }` | `{ data: WFScenarioPlan[] }` | workforce-planning/scenarios |
| 257 | `createWFScenarioPlan(body)` | POST | `{ name, scenarioType, description, projectedHeadcount, projectedBudget, assumptions }` | `{ data: WFScenarioPlan }` | workforce-planning/scenarios |
| 258 | `fetchWFHeadcountReports()` | GET | — | `{ data: WFHeadcountReport[] }` | workforce-planning |
| 259 | `fetchWFForecastReports()` | GET | — | `{ data: WFForecastReport[] }` | workforce-planning |
| 260 | `fetchWFHiringReports()` | GET | — | `{ data: WFHiringReport[] }` | workforce-planning |
| 261 | `fetchWFSkillGapReports()` | GET | — | `{ data: WFSkillGapReport[] }` | workforce-planning |
| 262 | `fetchWFSuccessionReports()` | GET | — | `{ data: WFSuccessionReport[] }` | workforce-planning |
| 263 | `fetchWFBudgetReports()` | GET | — | `{ data: WFBudgetReport[] }` | workforce-planning |

---

# Summary

| Category | Real | Mock | Total |
|----------|------|------|-------|
| Shared Infrastructure | 3 | — | 3 |
| Workforce (Employees, Departments, Designations, Documents) | 33 | — | 33 |
| Leave Management | 12 | — | 12 |
| Attendance & Shifts | 15 | — | 15 |
| Performance Management | 20 | — | 20 |
| **Real API subtotal** | **80** | — | **80** |
| Recruitment | — | 18 | 18 |
| Onboarding | — | 16 | 16 |
| Asset Management | — | 11 | 11 |
| Learning & Development | — | 11 | 11 |
| Compensation & Benefits | — | 13 | 13 |
| Employee Self Service (ESS) | — | 13 | 13 |
| Travel & Expense | — | 10 | 10 |
| Compliance & Policy | — | 25 | 25 |
| Engagement & Surveys | — | 23 | 23 |
| Rewards & Recognition | — | 16 | 16 |
| Workforce Planning | — | 27 | 27 |
| **Mock API subtotal** | — | **183** | **183** |
| **GRAND TOTAL** | **80** | **183** | **263** |

---

> All real API functions are in `app/lib/api/` (client.ts, workforce.api.ts, leave.api.ts, attendance.api.ts, performance.api.ts, types.ts).
> All mock API functions are in `app/lib/workforce-api.ts` and operate on in-memory arrays with no backend dependency.
