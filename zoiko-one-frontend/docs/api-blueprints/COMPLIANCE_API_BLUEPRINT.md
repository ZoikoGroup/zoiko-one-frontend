# Compliance API Blueprint

**Module:** Compliance  
**Base Path:** `/api/zoiko-hr/compliance`  
**Models (existing in Prisma):** GovernancePolicy, PolicyCategory, PolicyAcknowledgement, ComplianceRequirement, ComplianceAudit, PolicyViolation, CorrectiveAction, TrainingCompliance  
**Pages:** dashboard, acknowledgements, audits, corrective-actions, policies, policy-categories, reports, requirements, training-compliance, violations

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated compliance dashboard metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "totalPolicies": 25,
  "activePolicies": 22,
  "pendingAcknowledgements": 45,
  "overallComplianceRate": 87.5,
  "openAudits": 3,
  "openViolations": 7,
  "openCorrectiveActions": 5,
  "trainingComplianceRate": 92.0,
  "recentViolations": [
    { "id": 1, "policy": "Data Protection Policy", "employee": "John Doe", "date": "2024-06-01", "severity": "high" }
  ],
  "complianceByCategory": [
    { "category": "Data Privacy", "complianceRate": 95.0, "totalPolicies": 5 }
  ]
}
```

---

### GovernancePolicy

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/policies` | List policies (paginated, searchable) |
| GET | `/policies/{id}` | Get single policy |
| POST | `/policies` | Create a policy |
| PUT | `/policies/{id}` | Update a policy |
| DELETE | `/policies/{id}` | Delete a policy |
| PATCH | `/policies/{id}/status` | Update policy status |

**GET /policies**  
- **Query Params:** `search`, `categoryId`, `status` (draft | active | archived | under-review), `effectiveFrom`, `effectiveTo`, `page` (default: 1), `pageSize` (default: 25, max: 100), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Data Protection Policy",
      "policyNumber": "POL-001",
      "category": { "id": 1, "name": "Data Privacy" },
      "status": "active",
      "version": 3,
      "effectiveFrom": "2024-01-01",
      "description": "Governs handling of personal data",
      "createdAt": "2023-06-01T10:00:00Z",
      "updatedAt": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 25, "totalItems": 25, "totalPages": 1 }
}
```

**POST /policies**  
- **Request Body:**
```json
{
  "title": "Data Protection Policy",
  "categoryId": 1,
  "description": "Governs handling of personal data",
  "content": "# Policy Content\n... (markdown)",
  "effectiveFrom": "2024-01-01",
  "status": "draft"
}
```
- **Validation Rules:**
  - `title`: required, unique, string, max 255 chars
  - `categoryId`: required, must exist in PolicyCategory
  - `description`: optional, string, max 1000 chars
  - `content`: required, string (markdown)
  - `effectiveFrom`: required, valid date
  - `status`: required, enum (draft | active | archived | under-review)
  - `policyNumber`: auto-generated (`POL-{increment}`)

---

### PolicyCategory

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/policy-categories` | List categories |
| POST | `/policy-categories` | Create category |
| PUT | `/policy-categories/{id}` | Update category |
| DELETE | `/policy-categories/{id}` | Delete category |

**Validation Rules:**
- `name`: required, unique, string, max 100 chars
- `description`: optional, string, max 500 chars

---

### PolicyAcknowledgement

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/acknowledgements` | List acknowledgements |
| GET | `/acknowledgements/{id}` | Get single acknowledgement |
| POST | `/acknowledgements` | Create acknowledgement |
| PUT | `/acknowledgements/{id}` | Update acknowledgement |

**GET /acknowledgements**  
- **Query Params:** `search`, `status` (pending | acknowledged | declined), `policyId`, `employeeId`, `department`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /acknowledgements**  
- **Request Body:**
```json
{
  "policyId": 1,
  "employeeId": 101,
  "status": "acknowledged",
  "acknowledgedAt": "2024-06-01T10:00:00Z"
}
```
- **Validation Rules:**
  - `policyId`: required, must exist, policy must be active
  - `employeeId`: required, must exist in Employee
  - `status`: required, enum (acknowledged | declined)
  - `acknowledgedAt`: auto-set to now if not provided

---

### ComplianceRequirement

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/requirements` | List requirements |
| GET | `/requirements/{id}` | Get single requirement |
| POST | `/requirements` | Create requirement |
| PUT | `/requirements/{id}` | Update requirement |
| DELETE | `/requirements/{id}` | Delete requirement |

**GET /requirements**  
- **Query Params:** `search`, `categoryId`, `status` (active | inactive | overdue), `priority` (low | medium | high | critical), `page` (default: 25), `sortBy`, `sortOrder`

---

### ComplianceAudit

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/audits` | List audits |
| GET | `/audits/{id}` | Get single audit |
| POST | `/audits` | Create audit |
| PUT | `/audits/{id}` | Update audit |
| PATCH | `/audits/{id}/status` | Update audit status |

**GET /audits**  
- **Query Params:** `search`, `status` (planned | in-progress | completed | cancelled), `auditor`, `department`, `page` (default: 25), `sortBy`, `sortOrder`

---

### PolicyViolation

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/violations` | List violations |
| GET | `/violations/{id}` | Get single violation |
| POST | `/violations` | Create violation |
| PUT | `/violations/{id}` | Update violation |
| PATCH | `/violations/{id}/status` | Update violation status |

**GET /violations**  
- **Query Params:** `search`, `status` (open | investigating | resolved | closed), `severity` (low | medium | high | critical), `policyId`, `employeeId`, `department`, `page` (default: 25), `sortBy`, `sortOrder`

---

### CorrectiveAction

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/corrective-actions` | List corrective actions |
| GET | `/corrective-actions/{id}` | Get single action |
| POST | `/corrective-actions` | Create action |
| PUT | `/corrective-actions/{id}` | Update action |
| PATCH | `/corrective-actions/{id}/status` | Update action status |

**GET /corrective-actions**  
- **Query Params:** `search`, `status` (open | in-progress | completed | overdue), `priority`, `violationId`, `assignedTo`, `page` (default: 25), `sortBy`, `sortOrder`

---

### TrainingCompliance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/training-compliance` | List training compliance records |
| GET | `/training-compliance/{id}` | Get single record |
| POST | `/training-compliance` | Create record |
| PUT | `/training-compliance/{id}` | Update record |

**GET /training-compliance**  
- **Query Params:** `search`, `status` (completed | pending | overdue | exempt), `employeeId`, `department`, `trainingType`, `page` (default: 25), `sortBy`, `sortOrder`

---

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/compliance-rate` | Overall compliance rate |
| GET | `/reports/category-compliance` | Compliance by category |
| GET | `/reports/violation-trends` | Violation trends over time |
| GET | `/reports/acknowledgement-status` | Acknowledgement status summary |
| GET | `/reports/training-compliance` | Training compliance summary |

**GET /reports/compliance-rate**  
- **Query Params:** `department` (optional), `dateFrom`, `dateTo`
- **Response (200):**
```json
{
  "overallRate": 87.5,
  "totalPolicies": 25,
  "acknowledged": 180,
  "pending": 45,
  "declined": 5,
  "byDepartment": [
    { "department": "Engineering", "rate": 92.0, "acknowledged": 50, "pending": 5 }
  ]
}
```

**GET /reports/category-compliance**  
- **Response (200):**
```json
{
  "data": [
    { "category": "Data Privacy", "totalPolicies": 5, "complianceRate": 95.0 },
    { "category": "Workplace Safety", "totalPolicies": 8, "complianceRate": 82.0 }
  ]
}
```

**GET /reports/violation-trends**  
- **Query Params:** `year` (required), `department` (optional)
- **Response (200):**
```json
{
  "year": 2024,
  "monthly": [
    { "month": "2024-01", "total": 5, "high": 1, "medium": 3, "low": 1 }
  ],
  "byCategory": [
    { "category": "Data Privacy", "count": 8 }
  ]
}
```

**GET /reports/acknowledgement-status**  
- **Query Params:** `policyId` (optional), `department` (optional)
- **Response (200):**
```json
{
  "totalEmployees": 230,
  "acknowledged": 180,
  "pending": 45,
  "declined": 5,
  "rate": 78.3
}
```

**GET /reports/training-compliance**  
- **Query Params:** `department` (optional)
- **Response (200):**
```json
{
  "overallRate": 92.0,
  "completed": 200,
  "pending": 15,
  "overdue": 10,
  "exempt": 5,
  "byTrainingType": [
    { "type": "Data Privacy", "completed": 180, "pending": 20, "rate": 90.0 }
  ]
}
```

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| GovernancePolicy | title | Yes | unique, max 255 chars |
| GovernancePolicy | content | Yes | markdown |
| GovernancePolicy | categoryId | Yes | must exist |
| PolicyAcknowledgement | policyId | Yes | policy must be active |
| PolicyAcknowledgement | employeeId | Yes | must exist |
| ComplianceAudit | title | Yes | max 255 chars |
| ComplianceAudit | auditDate | Yes | valid date |
| PolicyViolation | policyId | Yes | must exist |
| PolicyViolation | severity | Yes | low, medium, high, critical |
| CorrectiveAction | violationId | Yes | must exist |
| CorrectiveAction | assignedTo | Yes | must exist in Employee |
| TrainingCompliance | employeeId | Yes | must exist |
| TrainingCompliance | trainingType | Yes | max 255 chars |

## Pagination Strategy

- **Default pageSize:** 25 (all list endpoints)
- **Max pageSize:** 100
- **Type:** Offset-based
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`

## Search Strategy

- **Scope:** Text search across `title`, `description`, `content`, `policyNumber`, `employeeName`, `trainingType`
- **Method:** `ILIKE` / `LIKE` case-insensitive
- **Combinable with:** Category, status, severity, priority, department filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| categoryId | integer | /policies, /requirements |
| status | enum | /policies, /acknowledgements, /requirements, /audits, /violations, /corrective-actions, /training-compliance |
| severity | enum | /violations |
| priority | enum | /requirements, /corrective-actions |
| employeeId | integer | /acknowledgements, /violations, /training-compliance |
| department | string | /acknowledgements, /audits, /violations, /reports/* |
| policyId | integer | /acknowledgements, /violations |
| violationId | integer | /corrective-actions |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `title`, `status`, `effectiveFrom`, `severity`, `priority`, `version`, `auditDate`

## Upload Requirements

- **None.** Policy documents/content handled as markdown text fields.

## Export Requirements

- **None.** CSV/PDF export deferred to future phase.
