# Rewards API Blueprint

**Module:** Rewards  
**Base Path:** `/api/zoiko-hr/rewards`  
**Models:** EmployeeAward, RewardsRecognitionProgram, RewardPointBalance, RewardPointTransaction, Achievement  
**Pages:** dashboard, achievements, awards, points, programs

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated rewards dashboard metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "totalPointsIssued": 150000,
  "totalPointsRedeemed": 85000,
  "activeParticipants": 180,
  "averagePointsPerEmployee": 833,
  "topPerformers": [
    { "employee": { "id": 101, "name": "John Doe" }, "points": 5000, "rank": 1 }
  ],
  "recentAwards": [
    { "id": 1, "awardName": "Employee of the Month", "employeeName": "Jane Smith", "date": "2024-06-01" }
  ],
  "programSummary": [
    { "program": "Peer Recognition", "pointsIssued": 50000, "participants": 120 }
  ],
  "achievementCount": 45
}
```

---

### EmployeeAward

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/awards` | List awards |
| GET | `/awards/{id}` | Get single award |
| POST | `/awards` | Create award |
| PUT | `/awards/{id}` | Update award |
| DELETE | `/awards/{id}` | Delete award |

**GET /awards**  
- **Query Params:** `search`, `employeeId`, `programId`, `dateFrom`, `dateTo`, `page` (default: 1), `pageSize` (default: 25, max: 100), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "awardName": "Employee of the Month",
      "employee": { "id": 101, "name": "Jane Smith", "department": "Engineering" },
      "program": { "id": 1, "name": "Monthly Recognition" },
      "dateAwarded": "2024-06-01",
      "description": "Outstanding performance in Q2",
      "pointsAwarded": 1000,
      "createdAt": "2024-06-01T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 25, "totalItems": 50, "totalPages": 2 }
}
```

**POST /awards**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "programId": 1,
  "awardName": "Employee of the Month",
  "description": "Outstanding performance in Q2",
  "dateAwarded": "2024-06-01",
  "pointsAwarded": 1000
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `programId`: required, must exist
  - `awardName`: required, string, max 255 chars
  - `description`: optional, string, max 1000 chars
  - `dateAwarded`: required, valid date, not in future
  - `pointsAwarded`: optional, integer >= 0; if provided, also creates point transaction

---

### RewardsRecognitionProgram

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/programs` | List programs |
| GET | `/programs/{id}` | Get single program |
| POST | `/programs` | Create program |
| PUT | `/programs/{id}` | Update program |
| DELETE | `/programs/{id}` | Delete program |

**GET /programs**  
- **Query Params:** `search`, `category` (performance | peer | milestone | anniversary | spot), `status` (active | inactive), `page` (default: 25), `sortBy`, `sortOrder`

**POST /programs**  
- **Request Body:**
```json
{
  "name": "Monthly Recognition",
  "description": "Awarded monthly to top performers",
  "category": "performance",
  "status": "active",
  "budget": 50000.00,
  "maxPointsPerAward": 2000
}
```
- **Validation Rules:**
  - `name`: required, unique, string, max 255 chars
  - `category`: required, enum
  - `status`: required, enum (active | inactive)
  - `budget`: optional, decimal >= 0
  - `maxPointsPerAward`: optional, integer >= 0

---

### RewardPointBalance

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/points` | List point balances |
| GET | `/points/{id}` | Get single balance |

**GET /points**  
- **Query Params:** `employeeId`, `department`, `minBalance`, `maxBalance`, `page` (default: 25), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "employee": { "id": 101, "name": "John Doe", "department": "Engineering" },
      "totalEarned": 5000,
      "totalRedeemed": 2000,
      "currentBalance": 3000,
      "lastUpdated": "2024-06-01T10:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 25, "totalItems": 180, "totalPages": 8 }
}
```

---

### RewardPointTransaction

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/points/transactions` | List point transactions |
| GET | `/points/transactions/{id}` | Get single transaction |
| POST | `/points/transactions` | Create transaction |

**GET /points/transactions**  
- **Query Params:** `employeeId`, `type` (earned | redeemed | expired | adjusted), `dateFrom`, `dateTo`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /points/transactions**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "type": "earned",
  "points": 500,
  "description": "Peer recognition bonus",
  "referenceId": 1,
  "referenceType": "award"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `type`: required, enum (earned | redeemed | expired | adjusted)
  - `points`: required, integer > 0
  - `description`: required, string, max 500 chars
  - `referenceId` + `referenceType`: optional, used to link to award

---

### Achievement

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/achievements` | List achievements |
| GET | `/achievements/{id}` | Get single achievement |
| POST | `/achievements` | Create achievement |
| PUT | `/achievements/{id}` | Update achievement |
| DELETE | `/achievements/{id}` | Delete achievement |

**GET /achievements**  
- **Query Params:** `search`, `category` (learning | performance | milestone | community | innovation), `employeeId`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /achievements**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "name": "Completed 10 Courses",
  "description": "Achieved milestone of completing 10 learning courses",
  "category": "learning",
  "icon": "trophy",
  "dateAchieved": "2024-06-01"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `name`: required, string, max 255 chars
  - `category`: required, enum
  - `dateAchieved`: required, valid date, not in future

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| EmployeeAward | employeeId | Yes | must exist |
| EmployeeAward | awardName | Yes | max 255 chars |
| EmployeeAward | dateAwarded | Yes | not in future |
| RecognitionProgram | name | Yes | unique, max 255 chars |
| RecognitionProgram | category | Yes | enum |
| PointTransaction | employeeId | Yes | must exist |
| PointTransaction | points | Yes | integer > 0 |
| PointTransaction | type | Yes | earned, redeemed, expired, adjusted |
| Achievement | name | Yes | max 255 chars |
| Achievement | category | Yes | enum |

## Pagination Strategy

- **Default pageSize:** 25 (client-side pagination for GET /awards, /awards/{id}/details)
- **Max pageSize:** 100
- **Type:** Offset-based server pagination
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`
- **Note:** Dashboard uses client-side aggregation; all list endpoints support server pagination.

## Search Strategy

- **Scope:** Text search across `awardName`, `programName`, `employeeName`, `description`, `achievementName`
- **Method:** `ILIKE` / `LIKE` case-insensitive
- **Combinable with:** Category, employeeId, department, date filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| category | enum | /programs, /achievements |
| status | enum | /programs |
| employeeId | integer | /awards, /points, /points/transactions, /achievements |
| type | enum | /points/transactions |
| department | string | /points |
| dateFrom/dateTo | date | /awards, /points/transactions |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `points`, `currentBalance`, `dateAwarded`, `name`, `category`

## Upload Requirements

- **None.** Achievement icons handled as string identifiers (no file upload).

## Export Requirements

- **None.** CSV/PDF export deferred to future phase.
