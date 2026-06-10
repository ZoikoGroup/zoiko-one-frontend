# Employee Lifecycle API Blueprint

## Module Overview

| Property | Value |
|---|---|
| **Module** | Employee Lifecycle |
| **Pages** | 4 — dashboard, offboarding, onboarding, transfers |
| **Current State** | All static inline data (hardcoded arrays) |
| **Base Path** | `/api/zoiko-hr/employee-lifecycle` |
| **Models Needed** | None — maps to existing `Employee` and `EmploymentRecord` tables |

## Source Tables

| Endpoint | Source Table(s) |
|---|---|
| Dashboard | Employee (`joinDate`, `status`), EmploymentRecord (`type`) |
| Onboarding | Employee (`joinDate`) |
| Transfers | EmploymentRecord (`type` changes) |
| Offboarding | Employee (`status`, `exitDate`) |

## Endpoints

### 1. GET /api/zoiko-hr/employee-lifecycle/dashboard

Aggregated lifecycle stats.

**Computed from:**
- **Active employees** — `Employee.status = 'active'`
- **Onboarded this month** — `Employee.joinDate` within current month
- **Pending transfers** — `EmploymentRecord.type` changes with pending effective date
- **Offboarded this month** — `Employee.status = 'terminated'` with `exitDate` within current month

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "activeEmployees": 150,
    "onboardedThisMonth": 5,
    "pendingTransfers": 3,
    "offboardedThisMonth": 2
  }
}
```

### 2. GET /api/zoiko-hr/employee-lifecycle/onboarding

Employees with recent `joinDate`.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (name, department, designation) |
| reason | string | No | — | Filter by reason/category |
| status | string | No | — | Filter by onboarding status |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 10,
        "employeeId": "EMP010",
        "firstName": "Alice",
        "lastName": "Johnson",
        "email": "alice.johnson@zoiko.com",
        "department": "Engineering",
        "designation": "Junior Developer",
        "joinDate": "2026-06-01",
        "status": "active",
        "onboardingStatus": "completed",
        "reportingManager": "John Doe"
      }
    ]
  }
}
```

### 3. GET /api/zoiko-hr/employee-lifecycle/transfers

Employees with recent employment record changes.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (name, department, designation) |
| reason | string | No | — | Filter by transfer reason |
| status | string | No | — | Filter by transfer status |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 20,
        "employeeId": "EMP020",
        "firstName": "Bob",
        "lastName": "Smith",
        "email": "bob.smith@zoiko.com",
        "fromDepartment": "Engineering",
        "toDepartment": "Product",
        "fromDesignation": "Senior Developer",
        "toDesignation": "Lead Developer",
        "transferDate": "2026-06-15",
        "reason": "Promotion",
        "status": "approved"
      }
    ]
  }
}
```

### 4. GET /api/zoiko-hr/employee-lifecycle/offboarding

Employees with exit dates or terminated status.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (name, department, designation) |
| reason | string | No | — | Filter by offboarding reason |
| status | string | No | — | Filter by offboarding status |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 30,
        "employeeId": "EMP030",
        "firstName": "Carol",
        "lastName": "Williams",
        "email": "carol.williams@zoiko.com",
        "department": "Marketing",
        "designation": "Marketing Manager",
        "exitDate": "2026-06-30",
        "reason": "Resignation",
        "status": "notice_period",
        "remarks": "Serving 1 month notice"
      }
    ]
  }
}
```

### 5. POST /api/zoiko-hr/employee-lifecycle/offboarding

Create an offboarding record (updates `Employee.status` and sets `exitDate`).

**Request Body**
```json
{
  "employeeId": 30,
  "reason": "Resignation",
  "exitDate": "2026-06-30",
  "remarks": "Serving 1 month notice"
}
```

**Validation Rules**
| Field | Rule |
|---|---|
| employeeId | Required, must reference an existing active employee |
| reason | Required |
| exitDate | Required, must be today or in the future |
| remarks | Optional |

**Response `201 Created`**
```json
{
  "status": "success",
  "message": "Offboarding record created",
  "data": {
    "id": 30,
    "employeeId": "EMP030",
    "status": "notice_period",
    "exitDate": "2026-06-30",
    "reason": "Resignation",
    "remarks": "Serving 1 month notice"
  }
}
```

### 6. POST /api/zoiko-hr/employee-lifecycle/transfers

Create a transfer record (creates a new `EmploymentRecord`).

**Request Body**
```json
{
  "employeeId": 20,
  "fromDepartment": "Engineering",
  "toDepartment": "Product",
  "fromDesignation": "Senior Developer",
  "toDesignation": "Lead Developer",
  "transferDate": "2026-06-15",
  "reason": "Promotion"
}
```

**Validation Rules**
| Field | Rule |
|---|---|
| employeeId | Required, must reference an existing active employee |
| toDepartment | Required |
| toDesignation | Required |
| transferDate | Required, must be today or in the future |
| reason | Required |

**Response `201 Created`**
```json
{
  "status": "success",
  "message": "Transfer record created",
  "data": {
    "id": 20,
    "employeeId": "EMP020",
    "fromDepartment": "Engineering",
    "toDepartment": "Product",
    "fromDesignation": "Senior Developer",
    "toDesignation": "Lead Developer",
    "transferDate": "2026-06-15",
    "reason": "Promotion",
    "status": "approved"
  }
}
```

## Page Patterns

| Pattern | Value |
|---|---|
| Search | Text + reason + status filters |
| Create Modal | Offboarding and transfers use create modals |
| Pagination | None |
| Upload | None |
| Export | None |
