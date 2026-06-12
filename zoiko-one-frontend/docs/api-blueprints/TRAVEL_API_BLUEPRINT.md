# Travel API Blueprint

**Module:** Travel  
**Base Path:** `/api/zoiko-hr/travel`  
**Models:** TravelRequest, ExpenseClaim, ExpenseCategory, TravelApproval, Reimbursement, CorporateTrip, TravelPolicy  
**Pages:** dashboard, approvals, corporate-travel, expense-categories, expense-claims, policy-management, reimbursements, reports, travel-requests

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated travel dashboard metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "pendingRequests": 12,
  "approvedRequests": 45,
  "totalExpenses": 85000.00,
  "pendingReimbursements": 8,
  "upcomingTrips": 3,
  "monthlyTrend": [
    { "month": "2024-01", "requests": 10, "expenses": 15000.00 },
    { "month": "2024-02", "requests": 15, "expenses": 22000.00 }
  ],
  "departmentBreakdown": [
    { "department": "Sales", "requests": 20, "expenses": 35000.00 }
  ]
}
```

---

### TravelRequest

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/travel-requests` | List travel requests (paginated) |
| GET | `/travel-requests/{id}` | Get single travel request |
| POST | `/travel-requests` | Create a travel request |
| PUT | `/travel-requests/{id}` | Update a travel request |
| DELETE | `/travel-requests/{id}` | Delete a travel request |

**GET /travel-requests**  
- **Query Params:** `search`, `status` (draft | submitted | approved | rejected | cancelled), `priority` (low | medium | high | urgent), `employeeId`, `department`, `travelFromDate`, `travelToDate`, `page` (default: 1), `pageSize` (default: 25, max: 100), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "employeeId": 101,
      "employee": { "id": 101, "name": "John Doe" },
      "department": "Sales",
      "destination": "New York",
      "purpose": "Client meeting",
      "travelFromDate": "2024-06-10",
      "travelToDate": "2024-06-12",
      "estimatedCost": 2500.00,
      "status": "submitted",
      "priority": "high",
      "createdAt": "2024-06-01T10:00:00Z",
      "updatedAt": "2024-06-01T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 25, "totalItems": 200, "totalPages": 8 }
}
```

**POST /travel-requests**  
- **Request Body:**
```json
{
  "destination": "New York",
  "purpose": "Client meeting",
  "travelFromDate": "2024-06-10",
  "travelToDate": "2024-06-12",
  "estimatedCost": 2500.00,
  "priority": "high",
  "remarks": "Meeting with ABC Corp"
}
```
- **Validation Rules:**
  - `destination`: required, string, max 255 chars
  - `purpose`: required, string, max 500 chars
  - `travelFromDate`: required, valid date, >= today
  - `travelToDate`: required, valid date, >= travelFromDate
  - `estimatedCost`: required, decimal > 0
  - `priority`: required, enum (low | medium | high | urgent)
  - Auto-sets `status = draft`, `employeeId` from auth context

---

### TravelApproval

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/approvals` | List approval records |
| GET | `/approvals/{id}` | Get single approval |
| POST | `/approvals` | Approve/reject a travel request |
| PUT | `/approvals/{id}` | Update approval |

**GET /approvals**  
- **Query Params:** `search`, `status` (approved | rejected | pending), `travelRequestId`, `approverId`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /approvals**  
- **Request Body:**
```json
{
  "travelRequestId": 1,
  "status": "approved",
  "comments": "Approved for business trip",
  "approvedAmount": 2400.00
}
```
- **Validation Rules:**
  - `travelRequestId`: required, must exist
  - `status`: required, enum (approved | rejected)
  - `comments`: optional, string, max 500 chars
  - `approvedAmount`: optional, must be <= estimatedCost if provided
  - On approve: updates TravelRequest.status = `approved`

---

### ExpenseCategory

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expense-categories` | List expense categories |
| GET | `/expense-categories/{id}` | Get single category |
| POST | `/expense-categories` | Create category |
| PUT | `/expense-categories/{id}` | Update category |
| DELETE | `/expense-categories/{id}` | Delete category |

**Validation Rules:**
- `name`: required, unique, string, max 100 chars
- `description`: optional, string, max 500 chars
- `maxReimbursableAmount`: optional, decimal >= 0

---

### ExpenseClaim

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/expense-claims` | List expense claims |
| GET | `/expense-claims/{id}` | Get single claim |
| POST | `/expense-claims` | Create expense claim |
| PUT | `/expense-claims/{id}` | Update claim |
| DELETE | `/expense-claims/{id}` | Delete claim |

**GET /expense-claims**  
- **Query Params:** `search`, `status` (draft | submitted | approved | rejected | reimbursed), `categoryId`, `travelRequestId`, `employeeId`, `expenseDateFrom`, `expenseDateTo`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /expense-claims**  
- **Request Body:**
```json
{
  "travelRequestId": 1,
  "categoryId": 2,
  "amount": 350.00,
  "expenseDate": "2024-06-11",
  "description": "Client dinner",
  "receiptUrl": null
}
```
- **Validation Rules:**
  - `travelRequestId`: optional, must exist if provided
  - `categoryId`: required, must exist
  - `amount`: required, decimal > 0
  - `expenseDate`: required, valid date, not in future
  - `description`: required, string, max 500 chars

---

### Reimbursement

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reimbursements` | List reimbursements |
| GET | `/reimbursements/{id}` | Get single reimbursement |
| POST | `/reimbursements` | Process reimbursement |
| PUT | `/reimbursements/{id}` | Update reimbursement |

**GET /reimbursements**  
- **Query Params:** `search`, `status` (pending | processed | failed), `employeeId`, `dateFrom`, `dateTo`, `page` (default: 25), `sortBy`, `sortOrder`

---

### CorporateTrip

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/corporate-travel` | List corporate trips |
| GET | `/corporate-travel/{id}` | Get single trip |
| POST | `/corporate-travel` | Create trip |
| PUT | `/corporate-travel/{id}` | Update trip |
| DELETE | `/corporate-travel/{id}` | Delete trip |

---

### TravelPolicy

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/policy-management` | List travel policies |
| GET | `/policy-management/{id}` | Get single policy |
| POST | `/policy-management` | Create policy |
| PUT | `/policy-management/{id}` | Update policy |
| DELETE | `/policy-management/{id}` | Delete policy |

---

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/expense-trends` | Monthly expense trends |
| GET | `/reports/dept-data` | Department-wise travel data |

**GET /reports/expense-trends**  
- **Query Params:** `year` (required), `department` (optional)
- **Response (200):**
```json
{
  "year": 2024,
  "monthly": [
    { "month": "2024-01", "totalExpenses": 15000.00, "requestCount": 10, "avgPerRequest": 1500.00 }
  ],
  "totalExpenses": 180000.00,
  "totalRequests": 120
}
```

**GET /reports/dept-data**  
- **Response (200):**
```json
{
  "departments": [
    {
      "department": "Sales",
      "totalRequests": 40,
      "approved": 35,
      "totalExpenses": 65000.00,
      "avgCostPerTrip": 1625.00
    }
  ]
}
```

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| TravelRequest | destination | Yes | max 255 chars |
| TravelRequest | travelFromDate | Yes | >= today |
| TravelRequest | travelToDate | Yes | >= travelFromDate |
| TravelRequest | estimatedCost | Yes | decimal > 0 |
| TravelRequest | priority | Yes | low, medium, high, urgent |
| ExpenseClaim | amount | Yes | decimal > 0 |
| ExpenseClaim | categoryId | Yes | must exist |
| ExpenseClaim | expenseDate | Yes | not in future |
| Reimbursement | amount | Yes | decimal > 0 |
| TravelPolicy | name | Yes | unique, max 200 chars |

## Pagination Strategy

- **Default pageSize:** 25 (all list endpoints)
- **Max pageSize:** 100
- **Type:** Offset-based (page × pageSize)
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`

## Search Strategy

- **Scope:** Text search across `destination`, `purpose`, `description`, `employeeName`, `policyName`
- **Method:** `LIKE` / `ILIKE` case-insensitive across searchable fields
- **Combinable with:** Status, priority, department, date range filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| status | enum | /travel-requests, /approvals, /expense-claims, /reimbursements |
| priority | enum | /travel-requests |
| employeeId | integer | /travel-requests, /expense-claims, /reimbursements |
| department | string | /travel-requests, /reports/* |
| categoryId | integer | /expense-claims |
| travelRequestId | integer | /expense-claims, /approvals |
| dateFrom/dateTo | date | /travel-requests, /expense-claims, /reimbursements |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `status`, `travelFromDate`, `travelToDate`, `amount`, `estimatedCost`, `priority`, `expenseDate`

## Upload Requirements

- **None.** Receipt uploads deferred to future phase.

## Export Requirements

- **None.** CSV/PDF export deferred to future phase.
