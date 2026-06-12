# Helpdesk API Blueprint

**Module:** Helpdesk  
**Base Path:** `/api/zoiko-hr/helpdesk`  
**Models:** HelpdeskTicket, HelpdeskCase, HelpdeskSLA, KnowledgeArticle, EmployeeRequest  
**Pages:** dashboard, cases, employee-requests, knowledge-base, sla, tickets

> **Note:** Lowest priority module. All 6 pages are currently fully static. No pagination implemented yet.

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Computed helpdesk metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "openTickets": 12,
  "pendingRequests": 8,
  "activeCases": 5,
  "slaComplianceRate": 92.5,
  "ticketsByPriority": { "low": 3, "medium": 5, "high": 3, "critical": 1 },
  "ticketsByStatus": { "open": 12, "in-progress": 8, "resolved": 45, "closed": 120 },
  "averageResolutionTime": 24.5,
  "slaBreached": 2,
  "recentTickets": [
    { "id": 1, "title": "VPN access issue", "status": "open", "priority": "high", "createdAt": "2024-06-10T10:00:00Z" }
  ],
  "knowledgeBaseStats": { "totalArticles": 35, "mostViewed": "How to reset password" }
}
```

---

### HelpdeskTicket

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/tickets` | List all tickets |
| GET | `/tickets/{id}` | Get single ticket |
| POST | `/tickets` | Create ticket |
| PUT | `/tickets/{id}` | Update ticket |
| DELETE | `/tickets/{id}` | Delete ticket |
| PATCH | `/tickets/{id}/status` | Update ticket status |
| PATCH | `/tickets/{id}/assign` | Assign ticket to agent |

**GET /tickets**  
- **Query Params:** `search`, `status` (open | in-progress | resolved | closed | on-hold), `priority` (low | medium | high | critical), `category`, `assignedTo`, `createdBy`, `dateFrom`, `dateTo`, `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "VPN access issue",
      "description": "Unable to connect to VPN from remote location",
      "category": "IT",
      "priority": "high",
      "status": "open",
      "createdBy": { "id": 101, "name": "John Doe" },
      "assignedTo": null,
      "slaDeadline": "2024-06-11T10:00:00Z",
      "slaBreached": false,
      "resolution": null,
      "createdAt": "2024-06-10T10:00:00Z",
      "updatedAt": "2024-06-10T10:00:00Z"
    }
  ]
}
```

**POST /tickets**  
- **Request Body:**
```json
{
  "title": "VPN access issue",
  "description": "Unable to connect to VPN from remote location",
  "category": "IT",
  "priority": "high"
}
```
- **Validation Rules:**
  - `title`: required, string, max 255 chars
  - `description`: required, string, max 2000 chars
  - `category`: required, string, max 100 chars
  - `priority`: required, enum (low | medium | high | critical)
  - `status`: defaults to `open`
  - `createdBy`: set from authenticated user

**PATCH /tickets/{id}/status**  
- **Request Body:**
```json
{
  "status": "in-progress",
  "resolution": null
}
```
- Status transition rules: open → in-progress → resolved → closed; any → on-hold

**PATCH /tickets/{id}/assign**  
- **Request Body:**
```json
{
  "assignedTo": 201
}
```
- `assignedTo`: required, must exist in Employee with helpdesk agent role

---

### HelpdeskCase

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/cases` | List cases |
| GET | `/cases/{id}` | Get single case |
| POST | `/cases` | Create case |
| PUT | `/cases/{id}` | Update case |
| DELETE | `/cases/{id}` | Delete case |

**GET /cases**  
- **Query Params:** `search`, `status` (open | investigating | resolved | closed), `priority`, `ticketId`, `assignedTo`, `page`, `sortBy`, `sortOrder`

**POST /cases**  
- **Request Body:**
```json
{
  "title": "Network connectivity issues in office",
  "description": "Multiple employees reporting intermittent network drops",
  "relatedTickets": [1, 2, 3],
  "priority": "high",
  "status": "open",
  "assignedTo": 201
}
```
- **Validation Rules:**
  - `title`: required, unique, string, max 255 chars
  - `relatedTickets`: optional, array of ticket IDs
  - `priority`: required, enum
  - `status`: required, enum
  - `assignedTo`: optional, must exist

---

### HelpdeskSLA

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sla` | List SLA policies |
| GET | `/sla/{id}` | Get single SLA policy |
| POST | `/sla` | Create SLA policy |
| PUT | `/sla/{id}` | Update SLA policy |
| DELETE | `/sla/{id}` | Delete SLA policy |

**GET /sla**  
- **Query Params:** `search`, `priority`, `status` (active | inactive), `sortBy`, `sortOrder`

**POST /sla**  
- **Request Body:**
```json
{
  "name": "Critical Incident SLA",
  "priority": "critical",
  "responseTime": 30,
  "resolutionTime": 240,
  "timeUnit": "minutes",
  "status": "active"
}
```
- **Validation Rules:**
  - `name`: required, unique, string, max 255 chars
  - `priority`: required, enum (must be unique per active SLA)
  - `responseTime`: required, integer > 0
  - `resolutionTime`: required, integer > 0
  - `timeUnit`: required, enum (minutes | hours | days)
  - `status`: required, enum (active | inactive)

---

### KnowledgeArticle

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/knowledge-base` | List articles |
| GET | `/knowledge-base/{id}` | Get single article |
| POST | `/knowledge-base` | Create article |
| PUT | `/knowledge-base/{id}` | Update article |
| DELETE | `/knowledge-base/{id}` | Delete article |
| PATCH | `/knowledge-base/{id}/publish` | Toggle publish status |

**GET /knowledge-base**  
- **Query Params:** `search`, `category`, `status` (draft | published | archived), `author`, `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "How to reset your password",
      "content": "# Step-by-step guide\n1. Go to login page\n2. Click \"Forgot Password\"\n...",
      "category": "IT",
      "status": "published",
      "author": { "id": 201, "name": "IT Admin" },
      "viewCount": 150,
      "helpfulCount": 120,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-06-01T08:00:00Z"
    }
  ]
}
```

**POST /knowledge-base**  
- **Request Body:**
```json
{
  "title": "How to reset your password",
  "content": "# Step-by-step guide\n1. Go to login page\n2. Click \"Forgot Password\"\n...",
  "category": "IT",
  "tags": ["password", "account", "login"],
  "status": "draft"
}
```
- **Validation Rules:**
  - `title`: required, string, max 255 chars
  - `content`: required, string (markdown)
  - `category`: required, string, max 100 chars
  - `tags`: optional, array of strings, max 10 tags
  - `status`: required, enum (draft | published | archived)
  - `author`: set from authenticated user

---

### EmployeeRequest

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employee-requests` | List employee requests |
| GET | `/employee-requests/{id}` | Get single request |
| POST | `/employee-requests` | Create request |
| PUT | `/employee-requests/{id}` | Update request |
| PATCH | `/employee-requests/{id}/status` | Update request status |

**GET /employee-requests**  
- **Query Params:** `search`, `status` (pending | approved | rejected | fulfilled), `type` (equipment | access | facility | training | other), `employeeId`, `dateFrom`, `dateTo`, `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "employee": { "id": 101, "name": "John Doe" },
      "type": "equipment",
      "title": "Request for external monitor",
      "description": "Need additional monitor for productivity",
      "status": "pending",
      "assignedTo": null,
      "fulfilledAt": null,
      "createdAt": "2024-06-10T10:00:00Z",
      "updatedAt": "2024-06-10T10:00:00Z"
    }
  ]
}
```

**POST /employee-requests**  
- **Request Body:**
```json
{
  "type": "equipment",
  "title": "Request for external monitor",
  "description": "Need additional monitor for productivity"
}
```
- **Validation Rules:**
  - `type`: required, enum (equipment | access | facility | training | other)
  - `title`: required, string, max 255 chars
  - `description`: required, string, max 2000 chars
  - `employeeId`: set from authenticated user

**PATCH /employee-requests/{id}/status**  
- **Request Body:**
```json
{
  "status": "approved",
  "assignedTo": 201,
  "comments": "Approved. Will be fulfilled within 2 business days."
}
```
- Status transition: pending → approved | rejected; approved → fulfilled

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| Ticket | title | Yes | max 255 chars |
| Ticket | description | Yes | max 2000 chars |
| Ticket | priority | Yes | low, medium, high, critical |
| Case | title | Yes | unique, max 255 chars |
| Case | relatedTickets | No | array of existing ticket IDs |
| SLA | name | Yes | unique, max 255 chars |
| SLA | responseTime | Yes | integer > 0 |
| SLA | resolutionTime | Yes | integer > 0 |
| KnowledgeArticle | title | Yes | max 255 chars |
| KnowledgeArticle | content | Yes | markdown |
| EmployeeRequest | type | Yes | equipment, access, facility, training, other |
| EmployeeRequest | title | Yes | max 255 chars |
| EmployeeRequest | description | Yes | max 2000 chars |

## Pagination Strategy

- **Current state:** No pagination implemented (static data)
- **Recommended:** Offset-based pagination with default pageSize=25, max=100
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`

## Search Strategy

- **Scope:** Text search across `title`, `description`, `category`, `employeeName`, `articleContent`, `resolution`
- **Method:** `ILIKE` / `LIKE` case-insensitive
- **Combinable with:** Status, priority, category, type, date range filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| status | enum | /tickets, /cases, /knowledge-base, /employee-requests |
| priority | enum | /tickets, /cases, /sla |
| category | string | /tickets, /knowledge-base |
| type | enum | /employee-requests |
| assignedTo | integer | /tickets, /cases |
| ticketId | integer | /cases |
| dateFrom/dateTo | date | /tickets, /employee-requests |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `title`, `status`, `priority`, `viewCount`, `responseTime`, `resolutionTime`

## Upload Requirements

- **None.** Knowledge article content handled as markdown text fields.

## Export Requirements

- **None.** No export functionality currently planned for this module.
