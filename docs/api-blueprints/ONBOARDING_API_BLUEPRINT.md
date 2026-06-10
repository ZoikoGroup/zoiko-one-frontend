# Onboarding API Blueprint

**Module:** Onboarding  
**Base Path:** `/api/zoiko-hr/onboarding`  
**Models:** OnboardingDocumentVerification, OnboardingAssetAllocation, OnboardingWelcomeKit, NewJoiner → Employee (exists), Probation (exists)  
**Pages:** dashboard, asset-allocation, document-verification, new-joiners, probation, reports, welcome-kit

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated onboarding dashboard metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "totalNewJoiners": 15,
  "pendingDocumentVerification": 8,
  "pendingAssetAllocation": 5,
  "pendingWelcomeKit": 3,
  "probationEndingSoon": 4,
  "onboardingCompletionRate": 72.0,
  "joinersThisMonth": 5,
  "joinersNextMonth": 7,
  "recentJoiners": [
    { "id": 101, "name": "Jane Smith", "department": "Engineering", "startDate": "2024-06-01", "status": "onboarding" }
  ]
}
```

---

### NewJoiner (via Employee)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/new-joiners` | List new joiners (paginated) |
| GET | `/new-joiners/{id}` | Get single joiner details |
| PUT | `/new-joiners/{id}` | Update joiner status |
| PATCH | `/new-joiners/{id}/status` | Update onboarding status inline |

**GET /new-joiners**  
- **Query Params:** `search`, `status` (onboarding | completed | withdrawn), `department`, `startDateFrom`, `startDateTo`, `page` (default: 1), `pageSize` (default: 25, max: 100), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 101,
      "name": "Jane Smith",
      "email": "jane.smith@company.com",
      "department": "Engineering",
      "position": "Software Engineer",
      "startDate": "2024-06-01",
      "onboardingStatus": "onboarding",
      "documentVerificationStatus": "pending",
      "assetAllocationStatus": "pending",
      "welcomeKitStatus": "pending",
      "probationEndDate": "2024-12-01",
      "createdAt": "2024-05-15T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 25, "totalItems": 15, "totalPages": 1 }
}
```

**PATCH /new-joiners/{id}/status**  
- **Request Body:**
```json
{
  "onboardingStatus": "completed"
}
```
- **Validation Rules:** `onboardingStatus`: enum (onboarding | completed | withdrawn)

---

### Probation (via Employee / Probation)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/probation` | List employees on probation |
| GET | `/probation/{id}` | Get single probation record |

**GET /probation**  
- **Query Params:** `search`, `status` (active | ending-soon | completed | extended | terminated), `department`, `page` (default: 25), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "employee": { "id": 101, "name": "Jane Smith", "department": "Engineering" },
      "startDate": "2024-06-01",
      "endDate": "2024-12-01",
      "status": "active",
      "extensionDate": null,
      "completionNotes": null,
      "createdAt": "2024-06-01T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 25, "totalItems": 12, "totalPages": 1 }
}
```

---

### OnboardingDocumentVerification

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/document-verification` | List document verifications |
| GET | `/document-verification/{id}` | Get single verification |
| POST | `/document-verification` | Create verification record |
| PUT | `/document-verification/{id}` | Update verification |
| PATCH | `/document-verification/{id}/status` | Update verification status inline |

**GET /document-verification**  
- **Query Params:** `search`, `status` (pending | verified | rejected | resubmitted), `employeeId`, `documentType`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /document-verification**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "documentType": "id-proof",
  "documentName": "Passport.pdf",
  "documentUrl": "https://storage.company.com/docs/passport.pdf",
  "status": "pending"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist in Employee
  - `documentType`: required, enum (id-proof | address-proof | education-certificate | experience-letter | background-check | other)
  - `documentName`: required, string, max 255 chars
  - `documentUrl`: required, valid URL

**PATCH /document-verification/{id}/status**  
- **Request Body:**
```json
{
  "status": "verified",
  "verifiedBy": "HR Admin",
  "remarks": "All documents verified"
}
```
- **Validation Rules:** `status`: enum (verified | rejected), `remarks`: optional, string, max 500 chars

---

### OnboardingAssetAllocation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/asset-allocation` | List onboarding asset allocations |
| GET | `/asset-allocation/{id}` | Get single allocation |
| POST | `/asset-allocation` | Create allocation |
| PUT | `/asset-allocation/{id}` | Update allocation |
| PATCH | `/asset-allocation/{id}/status` | Update allocation status inline |

**GET /asset-allocation**  
- **Query Params:** `search`, `status` (pending | allocated | delayed), `employeeId`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /asset-allocation**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "assetId": 1,
  "allocatedBy": "IT Admin",
  "expectedDeliveryDate": "2024-06-05",
  "status": "allocated"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `assetId`: required, must exist in Asset
  - `expectedDeliveryDate`: required, valid date
  - `status`: required, enum (pending | allocated | delayed)

---

### OnboardingWelcomeKit

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/welcome-kit` | List welcome kit records |
| GET | `/welcome-kit/{id}` | Get single record |
| POST | `/welcome-kit` | Create record |
| PUT | `/welcome-kit/{id}` | Update record |
| PATCH | `/welcome-kit/{id}/status` | Update status inline |

**GET /welcome-kit**  
- **Query Params:** `search`, `status` (pending | prepared | dispatched | delivered), `employeeId`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /welcome-kit**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "items": ["Laptop Bag", "Welcome Letter", "ID Card", "Stationery Kit"],
  "preparedBy": "HR Admin",
  "status": "prepared"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `items`: required, array of strings, min 1 item, max 50 items
  - `preparedBy`: required, string, max 100 chars
  - `status`: required, enum (pending | prepared | dispatched | delivered)

---

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/onboarding-progress` | Onboarding progress by stage |
| GET | `/reports/completion-rate` | Onboarding completion rate |
| GET | `/reports/document-status` | Document verification status summary |
| GET | `/reports/department-onboarding` | Department-wise onboarding stats |
| GET | `/reports/probation-summary` | Probation status summary |

**GET /reports/onboarding-progress**  
- **Response (200):**
```json
{
  "stages": {
    "documentVerification": { "completed": 10, "pending": 8, "total": 15 },
    "assetAllocation": { "completed": 8, "pending": 5, "total": 15 },
    "welcomeKit": { "completed": 6, "pending": 3, "total": 15 }
  },
  "overallProgress": 53.3
}
```

**GET /reports/completion-rate**  
- **Query Params:** `dateFrom`, `dateTo`
- **Response (200):**
```json
{
  "period": { "from": "2024-01-01", "to": "2024-06-30" },
  "totalJoiners": 50,
  "completed": 35,
  "inProgress": 12,
  "withdrawn": 3,
  "completionRate": 70.0
}
```

**GET /reports/document-status**  
- **Response (200):**
```json
{
  "byType": [
    { "documentType": "id-proof", "verified": 12, "pending": 3, "rejected": 1 },
    { "documentType": "education-certificate", "verified": 10, "pending": 5, "rejected": 2 }
  ]
}
```

**GET /reports/department-onboarding**  
- **Response (200):**
```json
{
  "departments": [
    { "department": "Engineering", "joiners": 5, "completed": 4, "pendingDocuments": 2, "pendingAssets": 1 }
  ]
}
```

**GET /reports/probation-summary**  
- **Response (200):**
```json
{
  "active": 10,
  "endingSoon": 4,
  "completed": 20,
  "extended": 2,
  "terminated": 1,
  "averageProbationDays": 180
}
```

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| DocumentVerification | employeeId | Yes | must exist |
| DocumentVerification | documentType | Yes | enum |
| DocumentVerification | documentUrl | Yes | valid URL |
| AssetAllocation | employeeId | Yes | must exist |
| AssetAllocation | assetId | Yes | must exist |
| WelcomeKit | employeeId | Yes | must exist |
| WelcomeKit | items | Yes | array, min 1 |
| NewJoiner status | onboardingStatus | Yes | onboarding, completed, withdrawn |
| Probation | endDate | Yes | >= startDate |
| All status patches | status | Yes | entity-specific enum |

## Pagination Strategy

- **Default pageSize:** 25 (all list endpoints)
- **Max pageSize:** 100
- **Type:** Offset-based
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`

## Search Strategy

- **Scope:** Text search across `employeeName`, `employeeEmail`, `documentType`, `documentName`, `department`
- **Method:** `ILIKE` / `LIKE` case-insensitive
- **Combinable with:** Status, department, date range filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| status | enum | /new-joiners, /probation, /document-verification, /asset-allocation, /welcome-kit |
| department | string | /new-joiners, /probation, /reports/* |
| employeeId | integer | /document-verification, /asset-allocation, /welcome-kit |
| documentType | enum | /document-verification |
| dateFrom/dateTo | date | /new-joiners, /reports/* |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `name`, `startDate`, `status`, `documentType`, `expectedDeliveryDate`, `endDate`

## Upload Requirements

- **None.** Document uploads handled via external storage with URLs submitted to API.

## Export Requirements

- **None.** CSV/PDF export deferred to future phase.
