# Compensation API Blueprint

**Module:** Compensation  
**Base Path:** `/api/zoiko-hr/compensation`  
**Models:** SalaryStructure, PayGrade, Allowance, Deduction, BenefitPlan, Bonus, CompensationReview, SalaryRevision  
**Pages:** dashboard, allowances, benefits, bonuses, deductions, pay-grades, reports, reviews, salary-history, salary-structures

> **⚠ HIGH SENSITIVITY DATA — Authorization is mandatory on all endpoints. All access must be logged.**

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated compensation dashboard metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "totalPayrollCost": 1250000.00,
  "averageSalary": 65000.00,
  "medianSalary": 58000.00,
  "headcount": 230,
  "totalAllowances": 150000.00,
  "totalDeductions": 45000.00,
  "totalBonuses": 200000.00,
  "pendingReviews": 5,
  "departmentBreakdown": [
    { "department": "Engineering", "headcount": 50, "totalSalary": 350000.00, "averageSalary": 70000.00 }
  ],
  "salaryRange": { "min": 30000.00, "max": 180000.00 }
}
```

---

### SalaryStructure

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salary-structures` | List salary structures |
| GET | `/salary-structures/{id}` | Get single structure |
| POST | `/salary-structures` | Create structure |
| PUT | `/salary-structures/{id}` | Update structure |
| DELETE | `/salary-structures/{id}` | Delete structure |

**GET /salary-structures**  
- **Query Params:** `search`, `payGradeId`, `status` (active | inactive), `page` (default: 1), `pageSize` (default: 20, max: 100), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "employee": { "id": 101, "name": "John Doe", "department": "Engineering" },
      "payGrade": { "id": 1, "name": "Grade 5" },
      "basicSalary": 50000.00,
      "housingAllowance": 15000.00,
      "transportAllowance": 5000.00,
      "totalSalary": 70000.00,
      "effectiveFrom": "2024-01-01",
      "status": "active",
      "createdAt": "2024-01-01T10:00:00Z",
      "updatedAt": "2024-06-01T08:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "totalItems": 230, "totalPages": 12 }
}
```

**POST /salary-structures**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "payGradeId": 1,
  "basicSalary": 50000.00,
  "housingAllowance": 15000.00,
  "transportAllowance": 5000.00,
  "otherAllowances": 0.00,
  "effectiveFrom": "2024-01-01",
  "status": "active"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist, unique active structure per employee
  - `payGradeId`: required, must exist
  - `basicSalary`: required, decimal, >= minimum wage
  - All allowance fields: optional, decimal, >= 0
  - `effectiveFrom`: required, valid date
  - `totalSalary` is computed as sum of all components

---

### PayGrade

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pay-grades` | List pay grades |
| GET | `/pay-grades/{id}` | Get single pay grade |
| POST | `/pay-grades` | Create pay grade |
| PUT | `/pay-grades/{id}` | Update pay grade |
| DELETE | `/pay-grades/{id}` | Delete pay grade |

**POST /pay-grades**  
- **Request Body:**
```json
{
  "name": "Grade 5",
  "level": 5,
  "minSalary": 45000.00,
  "maxSalary": 75000.00,
  "description": "Senior Individual Contributor"
}
```
- **Validation Rules:**
  - `name`: required, unique, string, max 100 chars
  - `level`: required, integer >= 1, unique
  - `minSalary`: required, decimal >= 0
  - `maxSalary`: required, decimal > minSalary

---

### Allowance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/allowances` | List allowances |
| GET | `/allowances/{id}` | Get single allowance |
| POST | `/allowances` | Create allowance |
| PUT | `/allowances/{id}` | Update allowance |
| DELETE | `/allowances/{id}` | Delete allowance |

**GET /allowances**  
- **Query Params:** `search`, `type` (housing | transport | medical | education | other), `status` (active | inactive), `employeeId`, `page` (default: 20), `sortBy`, `sortOrder`

**POST /allowances**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "type": "housing",
  "amount": 15000.00,
  "frequency": "monthly",
  "effectiveFrom": "2024-01-01",
  "effectiveTo": null,
  "status": "active"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `type`: required, enum
  - `amount`: required, decimal > 0
  - `frequency`: required, enum (monthly | quarterly | yearly | one-time)
  - `effectiveTo`: optional, must be after effectiveFrom if provided

---

### Deduction

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/deductions` | List deductions |
| GET | `/deductions/{id}` | Get single deduction |
| POST | `/deductions` | Create deduction |
| PUT | `/deductions/{id}` | Update deduction |
| DELETE | `/deductions/{id}` | Delete deduction |

**GET /deductions**  
- **Query Params:** `search`, `type` (tax | insurance | loan | pension | other), `status`, `employeeId`, `page` (default: 20), `sortBy`, `sortOrder`

---

### BenefitPlan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/benefits` | List benefit plans |
| GET | `/benefits/{id}` | Get single plan |
| POST | `/benefits` | Create plan |
| PUT | `/benefits/{id}` | Update plan |
| DELETE | `/benefits/{id}` | Delete plan |

**GET /benefits**  
- **Query Params:** `search`, `type` (health | dental | vision | life | retirement), `status`, `page` (default: 20), `sortBy`, `sortOrder`

---

### Bonus

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/bonuses` | List bonuses |
| GET | `/bonuses/{id}` | Get single bonus |
| POST | `/bonuses` | Create bonus |
| PUT | `/bonuses/{id}` | Update bonus |
| DELETE | `/bonuses/{id}` | Delete bonus |

**GET /bonuses**  
- **Query Params:** `search`, `type` (annual | performance | signing | referral | spot), `status`, `employeeId`, `page` (default: 20), `sortBy`, `sortOrder`

---

### CompensationReview

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reviews` | List compensation reviews |
| GET | `/reviews/{id}` | Get single review |
| POST | `/reviews` | Create review |
| PUT | `/reviews/{id}` | Update review |
| PATCH | `/reviews/{id}/status` | Update review status |

**GET /reviews**  
- **Query Params:** `search`, `status` (pending | in-progress | completed | cancelled), `employeeId`, `year`, `page` (default: 20), `sortBy`, `sortOrder`

**POST /reviews**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "reviewerId": 201,
  "year": 2024,
  "currentSalary": 65000.00,
  "recommendedSalary": 72000.00,
  "performanceRating": 4.5,
  "comments": "Exceeds expectations"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `reviewerId`: required, must exist
  - `year`: required, integer, >= current year - 1
  - `recommendedSalary`: optional, must be >= 0
  - `performanceRating`: optional, decimal between 1.0 and 5.0

---

### SalaryRevision (History)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/salary-history` | List salary revisions |
| GET | `/salary-history/{id}` | Get single revision |
| POST | `/salary-history` | Create revision record |

**GET /salary-history**  
- **Query Params:** `employeeId` (required), `page` (default: 20), `sortBy` (default: `effectiveFrom`), `sortOrder` (default: `desc`)

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "employee": { "id": 101, "name": "John Doe" },
      "previousSalary": 60000.00,
      "newSalary": 65000.00,
      "changeAmount": 5000.00,
      "changePercent": 8.33,
      "reason": "Annual review",
      "effectiveFrom": "2024-01-01",
      "approvedBy": { "id": 201, "name": "Manager Name" },
      "createdAt": "2024-01-01T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 20, "totalItems": 15, "totalPages": 1 }
}
```

---

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/salary-distribution` | Salary distribution stats |
| GET | `/reports/benefit-enrollment` | Benefit enrollment stats |

**GET /reports/salary-distribution**  
- **Query Params:** `department` (optional), `payGradeId` (optional)
- **Response (200):**
```json
{
  "distribution": [
    { "range": "0-30k", "count": 20 },
    { "range": "30-50k", "count": 60 },
    { "range": "50-80k", "count": 80 },
    { "range": "80-120k", "count": 50 },
    { "range": "120k+", "count": 20 }
  ],
  "totalPayroll": 1250000.00,
  "averageSalary": 65000.00,
  "medianSalary": 58000.00,
  "genderPayGap": 5.2
}
```

**GET /reports/benefit-enrollment**  
- **Response (200):**
```json
{
  "totalEligible": 230,
  "enrolled": 200,
  "enrollmentRate": 86.96,
  "byPlan": [
    { "plan": "Health Insurance", "enrolled": 200, "eligible": 230, "rate": 86.96 }
  ]
}
```

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| SalaryStructure | employeeId | Yes | must exist, unique active |
| SalaryStructure | basicSalary | Yes | >= minimum wage |
| PayGrade | name | Yes | unique, max 100 chars |
| PayGrade | level | Yes | unique, >= 1 |
| PayGrade | maxSalary | Yes | > minSalary |
| Allowance | amount | Yes | decimal > 0 |
| Allowance | frequency | Yes | monthly, quarterly, yearly, one-time |
| Deduction | amount | Yes | decimal > 0 |
| Bonus | amount | Yes | decimal > 0 |
| CompensationReview | year | Yes | >= current - 1 |
| CompensationReview | performanceRating | No | 1.0 - 5.0 |
| SalaryRevision | newSalary | Yes | decimal >= 0 |

## Pagination Strategy

- **Default pageSize:** 20 (all list endpoints)
- **Max pageSize:** 100
- **Type:** Offset-based
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`

## Search Strategy

- **Scope:** Text search across `employeeName`, `payGradeName`, `allowanceType`, `benefitType`, `reason`
- **Method:** `ILIKE` / `LIKE` case-insensitive
- **Combinable with:** Type, status, employeeId filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| status | enum | /salary-structures, /allowances, /deductions, /benefits, /bonuses, /reviews |
| type | enum | /allowances, /deductions, /benefits, /bonuses |
| employeeId | integer | /allowances, /deductions, /bonuses, /reviews, /salary-history |
| payGradeId | integer | /salary-structures, /reports/* |
| year | integer | /reviews |
| department | string | /reports/* |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `basicSalary`, `totalSalary`, `amount`, `level`, `effectiveFrom`, `year`, `performanceRating`

## Upload Requirements

- **None.** No file upload functionality in this module.

## Export Requirements

- **None.** CSV/PDF export deferred to future phase. Any export of salary data must be audited and restricted to authorized personnel only.

## Authorization (HIGH Sensitivity)

| Role | Access Level |
|------|-------------|
| Employee | View own salary structure and history only |
| Manager | View team salary info with approval |
| HR Admin | Full CRUD access |
| Payroll Admin | Full CRUD + report access |
| System Admin | All access, audit log review |

- All GET list endpoints must filter by authorization scope
- All POST/PUT/DELETE endpoints require `HR Admin` or `Payroll Admin` role
- All access to this module must be logged with timestamp, user, action, and resource ID
