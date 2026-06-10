# Engagement API Blueprint

**Module:** Engagement  
**Base Path:** `/api/zoiko-hr/engagement`  
**Models (existing in Prisma):** EngagementSurvey, PulseSurvey, SurveyTemplate, FeedbackCampaign, EmployeeRecognition, RecognitionProgram, EngagementScore, SentimentAnalysis, ActionPlan  
**Pages:** dashboard, action-plans, employee-recognition, engagement-scores, feedback-campaigns, pulse-surveys, recognition-programs, reports, sentiment-analysis, survey-templates, surveys

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated engagement dashboard metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "overallEngagementScore": 78.5,
  "participationRate": 72.0,
  "activeSurveys": 3,
  "activeCampaigns": 2,
  "recentRecognitions": 15,
  "pendingActionPlans": 8,
  "sentimentTrend": [
    { "month": "2024-01", "score": 75.0 },
    { "month": "2024-02", "score": 78.0 }
  ],
  "departmentScores": [
    { "department": "Engineering", "score": 82.0, "participation": 78.0 }
  ],
  "recognitionCount": 120
}
```

---

### SurveyTemplate

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/survey-templates` | List survey templates |
| GET | `/survey-templates/{id}` | Get single template |
| POST | `/survey-templates` | Create template |
| PUT | `/survey-templates/{id}` | Update template |
| DELETE | `/survey-templates/{id}` | Delete template |

**GET /survey-templates**  
- **Query Params:** `search`, `type` (engagement | pulse | feedback | exit), `status` (active | inactive | draft), `page` (default: 1), `pageSize` (default: 25, max: 100), `sortBy`, `sortOrder`

**POST /survey-templates**  
- **Request Body:**
```json
{
  "title": "Quarterly Engagement Survey",
  "description": "Standard quarterly survey for all employees",
  "type": "engagement",
  "questions": [
    { "questionText": "How satisfied are you with your role?", "type": "rating", "options": [1, 2, 3, 4, 5] },
    { "questionText": "What can we improve?", "type": "text", "options": null }
  ],
  "status": "active"
}
```
- **Validation Rules:**
  - `title`: required, string, max 255 chars
  - `type`: required, enum
  - `questions`: required, array, min 1 question
  - Each question: `questionText` required, `type` required (rating | text | multiple-choice | yes-no)
  - `status`: required, enum

---

### EngagementSurvey

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/surveys` | List surveys |
| GET | `/surveys/{id}` | Get single survey |
| POST | `/surveys` | Create survey |
| PUT | `/surveys/{id}` | Update survey |
| PATCH | `/surveys/{id}/status` | Update survey status |

**GET /surveys**  
- **Query Params:** `search`, `status` (draft | open | closed | archived), `templateId`, `department`, `page` (default: 25), `sortBy`, `sortOrder`

---

### PulseSurvey

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/pulse-surveys` | List pulse surveys |
| GET | `/pulse-surveys/{id}` | Get single pulse survey |
| POST | `/pulse-surveys` | Create pulse survey |
| PUT | `/pulse-surveys/{id}` | Update pulse survey |
| PATCH | `/pulse-surveys/{id}/status` | Update status |

**GET /pulse-surveys**  
- **Query Params:** `search`, `status`, `frequency` (weekly | biweekly | monthly), `department`, `page` (default: 25), `sortBy`, `sortOrder`

---

### FeedbackCampaign

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feedback-campaigns` | List feedback campaigns |
| GET | `/feedback-campaigns/{id}` | Get single campaign |
| POST | `/feedback-campaigns` | Create campaign |
| PUT | `/feedback-campaigns/{id}` | Update campaign |
| PATCH | `/feedback-campaigns/{id}/status` | Update campaign status |

**GET /feedback-campaigns**  
- **Query Params:** `search`, `status` (draft | active | completed | cancelled), `type` (360 | peer | manager | self), `page` (default: 25), `sortBy`, `sortOrder`

---

### RecognitionProgram

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/recognition-programs` | List programs |
| GET | `/recognition-programs/{id}` | Get single program |
| POST | `/recognition-programs` | Create program |
| PUT | `/recognition-programs/{id}` | Update program |
| DELETE | `/recognition-programs/{id}` | Delete program |

**GET /recognition-programs**  
- **Query Params:** `search`, `status` (active | inactive), `type`, `page` (default: 25), `sortBy`, `sortOrder`

---

### EmployeeRecognition

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/employee-recognition` | List recognitions |
| GET | `/employee-recognition/{id}` | Get single recognition |
| POST | `/employee-recognition` | Create recognition |
| PUT | `/employee-recognition/{id}` | Update recognition |

**GET /employee-recognition**  
- **Query Params:** `search`, `status` (pending | approved | rejected), `programId`, `employeeId`, `recognizerId`, `department`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /employee-recognition**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "recognizerId": 201,
  "programId": 1,
  "reason": "Exceptional work on project X",
  "message": "Thank you for going above and beyond!",
  "status": "pending"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `recognizerId`: required, must exist
  - `programId`: required, must exist, must be active
  - `reason`: required, string, max 500 chars
  - `message`: optional, string, max 1000 chars

---

### EngagementScore

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/engagement-scores` | List engagement scores |
| GET | `/engagement-scores/{id}` | Get single score |
| POST | `/engagement-scores` | Calculate/create score |
| PUT | `/engagement-scores/{id}` | Update score |

**GET /engagement-scores**  
- **Query Params:** `employeeId`, `department`, `scoreMin`, `scoreMax`, `dateFrom`, `dateTo`, `page` (default: 25), `sortBy`, `sortOrder`

---

### SentimentAnalysis

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/sentiment-analysis` | List sentiment data |
| GET | `/sentiment-analysis/{id}` | Get single record |
| POST | `/sentiment-analysis` | Create sentiment record |

**GET /sentiment-analysis**  
- **Query Params:** `department`, `sentiment` (positive | neutral | negative | mixed), `dateFrom`, `dateTo`, `page` (default: 25), `sortBy`, `sortOrder`

---

### ActionPlan

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/action-plans` | List action plans |
| GET | `/action-plans/{id}` | Get single plan |
| POST | `/action-plans` | Create plan |
| PUT | `/action-plans/{id}` | Update plan |
| PATCH | `/action-plans/{id}/status` | Update status |

**GET /action-plans**  
- **Query Params:** `search`, `status` (open | in-progress | completed | overdue), `priority` (low | medium | high | critical), `assignedTo`, `department`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /action-plans**  
- **Request Body:**
```json
{
  "title": "Improve cross-team communication",
  "description": "Organize monthly cross-team sync meetings",
  "assignedTo": 201,
  "department": "Engineering",
  "priority": "high",
  "dueDate": "2024-07-01",
  "source": "engagement-survey",
  "sourceId": 1
}
```
- **Validation Rules:**
  - `title`: required, string, max 255 chars
  - `assignedTo`: required, must exist
  - `priority`: required, enum
  - `dueDate`: required, valid date
  - `source`: optional, enum (engagement-survey | pulse-survey | feedback-campaign | sentiment-analysis | manual)

---

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/survey` | Survey response analysis |
| GET | `/reports/engagement` | Engagement score trends |
| GET | `/reports/recognition` | Recognition statistics |
| GET | `/reports/participation` | Participation rates |

**GET /reports/survey**  
- **Query Params:** `surveyId`, `department`
- **Response (200):**
```json
{
  "surveyId": 1,
  "title": "Quarterly Engagement Survey",
  "totalResponses": 180,
  "totalSent": 230,
  "responseRate": 78.3,
  "averageScore": 4.2,
  "byQuestion": [
    { "questionId": 1, "questionText": "How satisfied are you?", "averageScore": 4.1, "distribution": { "1": 5, "2": 10, "3": 25, "4": 80, "5": 60 } }
  ]
}
```

**GET /reports/engagement**  
- **Response (200):**
```json
{
  "currentScore": 78.5,
  "previousScore": 75.0,
  "change": 3.5,
  "trend": [
    { "quarter": "Q1 2024", "score": 75.0 },
    { "quarter": "Q2 2024", "score": 78.5 }
  ],
  "byDepartment": [
    { "department": "Engineering", "score": 82.0, "change": 2.0 }
  ]
}
```

**GET /reports/recognition**  
- **Response (200):**
```json
{
  "totalRecognitions": 120,
  "thisMonth": 15,
  "byProgram": [
    { "program": "Peer Recognition", "count": 60 }
  ],
  "topRecognizers": [
    { "employee": "Jane Doe", "count": 10 }
  ]
}
```

**GET /reports/participation**  
- **Response (200):**
```json
{
  "overallParticipationRate": 72.0,
  "byActivity": {
    "surveys": { "rate": 78.0, "eligible": 230, "participated": 180 },
    "pulseSurveys": { "rate": 65.0, "eligible": 230, "participated": 150 },
    "recognitions": { "rate": 45.0, "eligible": 230, "participated": 104 }
  },
  "byDepartment": [
    { "department": "Engineering", "survey": 82.0, "pulse": 70.0, "recognition": 50.0 }
  ]
}
```

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| SurveyTemplate | title | Yes | max 255 chars |
| SurveyTemplate | type | Yes | engagement, pulse, feedback, exit |
| SurveyTemplate | questions | Yes | array, min 1 |
| EngagementSurvey | templateId | Yes | must exist |
| EngagementSurvey | status | Yes | draft, open, closed, archived |
| FeedbackCampaign | type | Yes | 360, peer, manager, self |
| EmployeeRecognition | employeeId | Yes | must exist |
| EmployeeRecognition | reason | Yes | max 500 chars |
| RecognitionProgram | name | Yes | max 255 chars |
| ActionPlan | title | Yes | max 255 chars |
| ActionPlan | dueDate | Yes | valid date |
| ActionPlan | priority | Yes | low, medium, high, critical |

## Pagination Strategy

- **Default pageSize:** 25 (all list endpoints)
- **Max pageSize:** 100
- **Type:** Offset-based
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`

## Search Strategy

- **Scope:** Text search across `title`, `description`, `employeeName`, `recognizerName`, `reason`, `programName`, `department`
- **Method:** `ILIKE` / `LIKE` case-insensitive
- **Combinable with:** Type, status, department, priority filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| type | enum | /survey-templates, /feedback-campaigns, /recognition-programs |
| status | enum | /survey-templates, /surveys, /pulse-surveys, /feedback-campaigns, /recognition-programs, /employee-recognition, /action-plans |
| department | string | /surveys, /pulse-surveys, /employee-recognition, /sentiment-analysis, /action-plans, /reports/* |
| employeeId | integer | /employee-recognition, /engagement-scores |
| priority | enum | /action-plans |
| templateId | integer | /surveys |
| programId | integer | /employee-recognition |
| sentiment | enum | /sentiment-analysis |
| scoreMin/Max | float | /engagement-scores |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `title`, `status`, `type`, `score`, `participationRate`, `dueDate`, `priority`, `responseRate`

## Upload Requirements

- **None.** No file upload functionality in this module.

## Export Requirements

- **None.** CSV/PDF export deferred to future phase.
