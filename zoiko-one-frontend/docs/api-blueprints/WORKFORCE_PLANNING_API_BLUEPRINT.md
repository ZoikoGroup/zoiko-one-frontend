# Workforce Planning API Blueprint

**Module:** Workforce Planning  
**Base Path:** `/api/zoiko-hr/workforce-planning`  
**Models:** WFHeadcountPlan, WFWorkforceForecast, WFHiringPlan, WFCapacityPlan, WFSkillGap, WFSuccessionPlan, WFBudgetPlan, WFScenarioPlan  
**Pages:** dashboard, budget, capacity, forecasting, headcount, hiring-plans, reports, scenarios, skill-gaps, succession

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated workforce planning dashboard metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "currentHeadcount": 230,
  "plannedHeadcount": 280,
  "openPositions": 15,
  "hiringPlanActive": 5,
  "successionReadyEmployees": 20,
  "skillGapCount": 8,
  "budgetUtilization": 72.5,
  "forecastGrowth": 15.0,
  "departmentSummary": [
    { "department": "Engineering", "current": 50, "planned": 65, "open": 5 }
  ],
  "upcomingChanges": [
    { "type": "hire", "department": "Engineering", "count": 5, "quarter": "Q3 2024" }
  ]
}
```

---

### WFHeadcountPlan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/headcount` | List headcount plans |
| GET | `/headcount/{id}` | Get single plan |
| POST | `/headcount` | Create plan |
| PUT | `/headcount/{id}` | Update plan |
| DELETE | `/headcount/{id}` | Delete plan |

**GET /headcount**  
- **Query Params:** `search`, `department`, `status` (draft | approved | active | completed | cancelled), `fiscalYear`, `quarter`, `page` (default: 1), `pageSize` (default: 25, max: 100), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "department": "Engineering",
      "fiscalYear": 2024,
      "quarter": "Q3",
      "currentHeadcount": 50,
      "plannedHeadcount": 65,
      "newPositions": 15,
      "replacementPositions": 5,
      "status": "approved",
      "budgetedCost": 750000.00,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-06-01T08:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 25, "totalItems": 20, "totalPages": 1 }
}
```

**POST /headcount**  
- **Request Body:**
```json
{
  "department": "Engineering",
  "fiscalYear": 2024,
  "quarter": "Q3",
  "currentHeadcount": 50,
  "plannedHeadcount": 65,
  "newPositions": 15,
  "replacementPositions": 5,
  "status": "draft",
  "budgetedCost": 750000.00,
  "justification": "Scaling team for new product launch"
}
```
- **Validation Rules:**
  - `department`: required, string, max 100 chars
  - `fiscalYear`: required, integer, 4 digits
  - `quarter`: required, enum (Q1 | Q2 | Q3 | Q4)
  - `plannedHeadcount`: required, integer >= 0
  - `newPositions`: required, integer >= 0
  - `replacementPositions`: required, integer >= 0
  - `status`: required, enum
  - `budgetedCost`: optional, decimal >= 0

---

### WFWorkforceForecast

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/forecasting` | List forecasts |
| GET | `/forecasting/{id}` | Get single forecast |
| POST | `/forecasting` | Create forecast |
| PUT | `/forecasting/{id}` | Update forecast |
| DELETE | `/forecasting/{id}` | Delete forecast |

**GET /forecasting**  
- **Query Params:** `search`, `department`, `status`, `fiscalYear`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /forecasting**  
- **Request Body:**
```json
{
  "department": "Engineering",
  "fiscalYear": 2024,
  "period": "Q3",
  "predictedHeadcount": 70,
  "predictedAttrition": 5,
  "predictedHires": 20,
  "confidenceLevel": 85.0,
  "assumptions": "Based on current growth rate",
  "status": "draft"
}
```
- **Validation Rules:**
  - `department`: required
  - `fiscalYear`: required
  - `period`: required, enum or string
  - `predictedHeadcount`: required, integer >= 0
  - `confidenceLevel`: optional, decimal 0-100

---

### WFHiringPlan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/hiring-plans` | List hiring plans |
| GET | `/hiring-plans/{id}` | Get single plan |
| POST | `/hiring-plans` | Create plan |
| PUT | `/hiring-plans/{id}` | Update plan |
| DELETE | `/hiring-plans/{id}` | Delete plan |
| PATCH | `/hiring-plans/{id}/status` | Update status |

**GET /hiring-plans**  
- **Query Params:** `search`, `department`, `status` (draft | open | in-progress | filled | on-hold | cancelled), `priority` (low | medium | high | critical), `page` (default: 25), `sortBy`, `sortOrder`

**POST /hiring-plans**  
- **Request Body:**
```json
{
  "position": "Senior Software Engineer",
  "department": "Engineering",
  "headcountPlanId": 1,
  "positionsOpen": 3,
  "positionsFilled": 0,
  "targetStartDate": "2024-09-01",
  "priority": "high",
  "status": "open",
  "budgetedSalary": 120000.00,
  "justification": "New product team"
}
```
- **Validation Rules:**
  - `position`: required, string, max 255 chars
  - `department`: required
  - `positionsOpen`: required, integer > 0
  - `targetStartDate`: required, valid date
  - `priority`: required, enum

---

### WFCapacityPlan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/capacity` | List capacity plans |
| GET | `/capacity/{id}` | Get single plan |
| POST | `/capacity` | Create plan |
| PUT | `/capacity/{id}` | Update plan |
| DELETE | `/capacity/{id}` | Delete plan |

**GET /capacity**  
- **Query Params:** `search`, `department`, `status`, `page` (default: 25), `sortBy`, `sortOrder`

---

### WFSkillGap

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/skill-gaps` | List skill gaps |
| GET | `/skill-gaps/{id}` | Get single gap |
| POST | `/skill-gaps` | Create gap record |
| PUT | `/skill-gaps/{id}` | Update record |
| DELETE | `/skill-gaps/{id}` | Delete record |

**GET /skill-gaps**  
- **Query Params:** `search`, `department`, `skillName`, `priority` (low | medium | high | critical), `status` (open | in-progress | addressed), `page` (default: 25), `sortBy`, `sortOrder`

**POST /skill-gaps**  
- **Request Body:**
```json
{
  "department": "Engineering",
  "skillName": "Machine Learning",
  "currentLevel": 2,
  "requiredLevel": 4,
  "gapSize": 2,
  "priority": "high",
  "status": "open",
  "affectedEmployees": 15,
  "mitigationPlan": "Hire ML engineers and upskill existing staff"
}
```
- **Validation Rules:**
  - `skillName`: required, string, max 100 chars
  - `currentLevel`, `requiredLevel`: integer 1-5
  - `priority`: required, enum
  - `status`: required, enum

---

### WFSuccessionPlan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/succession` | List succession plans |
| GET | `/succession/{id}` | Get single plan |
| POST | `/succession` | Create plan |
| PUT | `/succession/{id}` | Update plan |
| DELETE | `/succession/{id}` | Delete plan |

**GET /succession**  
- **Query Params:** `search`, `department`, `status` (active | inactive), `readiness` (now | 6-months | 1-year | 2-years), `page` (default: 25), `sortBy`, `sortOrder`

**POST /succession**  
- **Request Body:**
```json
{
  "position": "Director of Engineering",
  "department": "Engineering",
  "currentIncumbent": 101,
  "successorId": 102,
  "readiness": "1-year",
  "status": "active",
  "developmentPlan": "Executive leadership program",
  "notes": "Needs exposure to cross-functional management"
}
```
- **Validation Rules:**
  - `position`: required, string, max 255 chars
  - `currentIncumbent`: optional, must exist in Employee
  - `successorId`: required, must exist
  - `readiness`: required, enum

---

### WFBudgetPlan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/budget` | List budget plans |
| GET | `/budget/{id}` | Get single plan |
| POST | `/budget` | Create plan |
| PUT | `/budget/{id}` | Update plan |
| DELETE | `/budget/{id}` | Delete plan |

**GET /budget**  
- **Query Params:** `search`, `department`, `fiscalYear`, `status`, `page` (default: 25), `sortBy`, `sortOrder`

---

### WFScenarioPlan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/scenarios` | List scenario plans |
| GET | `/scenarios/{id}` | Get single scenario |
| POST | `/scenarios` | Create scenario |
| PUT | `/scenarios/{id}` | Update scenario |
| DELETE | `/scenarios/{id}` | Delete scenario |

**GET /scenarios**  
- **Query Params:** `search`, `department`, `type` (growth | contraction | restructuring | what-if), `status`, `page` (default: 25), `sortBy`, `sortOrder`

---

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/headcount-trend` | Headcount trends over time |
| GET | `/reports/hiring-progress` | Hiring plan progress |
| GET | `/reports/skill-gap-analysis` | Skill gap analysis |
| GET | `/reports/succession-readiness` | Succession readiness |
| GET | `/reports/budget-utilization` | Budget vs actual |
| GET | `/reports/capacity-vs-demand` | Capacity vs demand comparison |

**GET /reports/headcount-trend**  
- **Query Params:** `department`, `fiscalYear`, `period` (monthly | quarterly)
- **Response (200):**
```json
{
  "fiscalYear": 2024,
  "data": [
    { "period": "Q1", "planned": 230, "actual": 228, "variance": -2 },
    { "period": "Q2", "planned": 240, "actual": 235, "variance": -5 }
  ]
}
```

**GET /reports/hiring-progress**  
- **Response (200):**
```json
{
  "totalPositions": 20,
  "filled": 8,
  "inProgress": 5,
  "open": 7,
  "byDepartment": [
    { "department": "Engineering", "total": 10, "filled": 4, "inProgress": 3 }
  ]
}
```

**GET /reports/skill-gap-analysis**  
- **Response (200):**
```json
{
  "totalGaps": 8,
  "critical": 2,
  "high": 3,
  "medium": 2,
  "low": 1,
  "bySkill": [
    { "skill": "Machine Learning", "gapSize": 2, "affectedEmployees": 15, "priority": "critical" }
  ]
}
```

**GET /reports/succession-readiness**  
- **Response (200):**
```json
{
  "totalPlans": 12,
  "readyNow": 2,
  "ready6Months": 3,
  "ready1Year": 5,
  "ready2Years": 2,
  "byDepartment": [
    { "department": "Engineering", "total": 3, "readyNow": 1 }
  ]
}
```

**GET /reports/budget-utilization**  
- **Response (200):**
```json
{
  "totalBudget": 5000000.00,
  "totalSpent": 3625000.00,
  "utilizationRate": 72.5,
  "byDepartment": [
    { "department": "Engineering", "budget": 1500000.00, "spent": 1200000.00, "rate": 80.0 }
  ]
}
```

**GET /reports/capacity-vs-demand**  
- **Response (200):**
```json
{
  "departments": [
    { "department": "Engineering", "currentCapacity": 50, "demand": 65, "gap": -15, "utilization": 130.0 }
  ]
}
```

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| HeadcountPlan | department | Yes | max 100 chars |
| HeadcountPlan | fiscalYear | Yes | 4-digit integer |
| HeadcountPlan | quarter | Yes | Q1-Q4 |
| HeadcountPlan | plannedHeadcount | Yes | integer >= 0 |
| WorkforceForecast | predictedHeadcount | Yes | integer >= 0 |
| HiringPlan | position | Yes | max 255 chars |
| HiringPlan | positionsOpen | Yes | integer > 0 |
| SkillGap | skillName | Yes | max 100 chars |
| SkillGap | currentLevel | Yes | 1-5 |
| SkillGap | requiredLevel | Yes | 1-5 |
| SuccessionPlan | position | Yes | max 255 chars |
| SuccessionPlan | successorId | Yes | must exist |
| SuccessionPlan | readiness | Yes | now, 6-months, 1-year, 2-years |
| BudgetPlan | fiscalYear | Yes | 4-digit integer |
| BudgetPlan | totalBudget | Yes | decimal >= 0 |
| ScenarioPlan | type | Yes | growth, contraction, restructuring, what-if |

## Pagination Strategy

- **Default pageSize:** 25 (all list endpoints)
- **Max pageSize:** 100
- **Type:** Offset-based
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`

## Search Strategy

- **Scope:** Text search across `department`, `position`, `skillName`, `mitigationPlan`, `justification`, `notes`, `scenarioName`
- **Method:** `ILIKE` / `LIKE` case-insensitive
- **Combinable with:** Department, status, priority, fiscalYear, quarter filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| department | string | All entities |
| status | enum | All entities (entity-specific values) |
| priority | enum | /hiring-plans, /skill-gaps |
| fiscalYear | integer | /headcount, /forecasting, /budget, /reports/* |
| quarter | enum | /headcount |
| readiness | enum | /succession |
| type | enum | /scenarios |
| skillName | string | /skill-gaps |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `department`, `fiscalYear`, `quarter`, `status`, `priority`, `plannedHeadcount`, `predictedHeadcount`, `currentLevel`, `requiredLevel`, `budgetedCost`, `totalBudget`

## Upload Requirements

- **None.** No file upload functionality in this module.

## Export Requirements

- **None.** CSV/PDF export deferred to future phase.
