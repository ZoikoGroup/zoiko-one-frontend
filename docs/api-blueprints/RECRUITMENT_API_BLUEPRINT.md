# Recruitment API Blueprint

## Module Overview

| Property | Value |
|---|---|
| **Module** | Recruitment |
| **Pages** | 6 — dashboard, candidates, interviews, job-openings, offers, reports |
| **Mock Functions** | 18 |
| **Base Path** | `/api/zoiko-hr/recruitment` |
| **Models Needed** | JobOpening, Candidate, Interview, Offer |

## Entity Relationships

```
JobOpening ──┬── Candidate
             ├── Interview
             └── Offer
Department ──┘
```

- JobOpening → Department (via departmentId)
- Candidate → JobOpening (via jobOpeningId)
- Interview → Candidate (via candidateId), Interview → JobOpening (via jobOpeningId)
- Offer → Candidate (via candidateId), Offer → JobOpening (via jobOpeningId)

## Endpoints

### 1. GET /api/zoiko-hr/recruitment/jobs

List all job openings.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (title, department) |
| status | string | No | — | Filter by status (open, closed, draft) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 20 | Items per page |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "title": "Senior Software Engineer",
        "departmentId": 1,
        "department": "Engineering",
        "location": "Remote",
        "employmentType": "Full-time",
        "openings": 3,
        "filled": 1,
        "status": "open",
        "postedDate": "2026-05-01",
        "closingDate": "2026-07-01"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 15,
      "totalPages": 1
    }
  }
}
```

### POST /api/zoiko-hr/recruitment/jobs

Create a new job opening.

**Request Body**
```json
{
  "title": "Senior Software Engineer",
  "departmentId": 1,
  "location": "Remote",
  "employmentType": "Full-time",
  "openings": 3,
  "description": "We are looking for...",
  "requirements": "5+ years experience...",
  "salaryMin": 80000,
  "salaryMax": 120000,
  "closingDate": "2026-07-01"
}
```

**Validation Rules**
| Field | Rule |
|---|---|
| title | Required |
| departmentId | Required, must reference existing department |
| location | Required |
| employmentType | Required |
| openings | Required, must be positive integer |
| salaryMin | Optional, must be positive |
| salaryMax | Optional, must be positive, must be ≥ salaryMin |

**Response `201 Created`**
```json
{
  "status": "success",
  "message": "Job opening created",
  "data": {
    "id": 16,
    "title": "Senior Software Engineer",
    "departmentId": 1,
    "status": "open",
    "postedDate": "2026-06-10"
  }
}
```

### 2. GET /api/zoiko-hr/recruitment/jobs/{id}

Get job opening details.

**Path Parameters**
| Parameter | Type | Required | Description |
|---|---|---|---|
| id | integer | Yes | Job opening ID |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "title": "Senior Software Engineer",
    "departmentId": 1,
    "department": "Engineering",
    "location": "Remote",
    "employmentType": "Full-time",
    "openings": 3,
    "filled": 1,
    "status": "open",
    "description": "We are looking for...",
    "requirements": "5+ years experience...",
    "salaryMin": 80000,
    "salaryMax": 120000,
    "postedDate": "2026-05-01",
    "closingDate": "2026-07-01",
    "candidateCount": 12
  }
}
```

### PUT /api/zoiko-hr/recruitment/jobs/{id}

Update job opening.

**Request Body**
```json
{
  "title": "Senior Software Engineer II",
  "openings": 5,
  "closingDate": "2026-08-01"
}
```

**Response `200 OK`**
```json
{
  "status": "success",
  "message": "Job opening updated",
  "data": {
    "id": 1
  }
}
```

### DELETE /api/zoiko-hr/recruitment/jobs/{id}

Close/delete a job opening (soft delete — sets status to `closed`).

**Response `200 OK`**
```json
{
  "status": "success",
  "message": "Job opening closed"
}
```

### 3. GET /api/zoiko-hr/recruitment/candidates

List candidates with search, stage filter, pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (name, email, phone) |
| stage | string | No | — | Filter by stage (applied, screened, interviewed, offered, hired, rejected) |
| jobId | integer | No | — | Filter by job opening |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 20 | Items per page |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "firstName": "David",
        "lastName": "Brown",
        "email": "david.brown@email.com",
        "phone": "+123456789",
        "jobOpeningId": 1,
        "jobTitle": "Senior Software Engineer",
        "stage": "interviewed",
        "appliedDate": "2026-05-15",
        "resumeUrl": "/api/zoiko-hr/recruitment/candidates/1/resume"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 48,
      "totalPages": 3
    }
  }
}
```

### 4. PATCH /api/zoiko-hr/recruitment/candidates/{id}/stage

Update candidate stage. Must follow logical progression.

**Path Parameters**
| Parameter | Type | Required | Description |
|---|---|---|---|
| id | integer | Yes | Candidate ID |

**Request Body**
```json
{
  "stage": "interviewed"
}
```

**Stage Progression Rules**
```
applied → screened → interviewed → offered → hired
                                             → rejected (allowed from any stage)
```

**Validation Rules**
| Rule | Description |
|---|---|
| Stage progression | Cannot skip stages (e.g., applied → offered is invalid) |
| Rejection | Allowed from any stage |
| Hired | Only from offered stage |

**Response `200 OK`**
```json
{
  "status": "success",
  "message": "Candidate stage updated",
  "data": {
    "id": 1,
    "stage": "interviewed",
    "updatedAt": "2026-06-10T14:30:00Z"
  }
}
```

**Response `400 Bad Request`**
```json
{
  "status": "error",
  "message": "Invalid stage transition: cannot move from 'applied' to 'offered'"
}
```

### 5. GET /api/zoiko-hr/recruitment/interviews

List interviews.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (candidate name, job title) |
| status | string | No | — | Filter by status (scheduled, completed, cancelled) |
| jobId | integer | No | — | Filter by job opening |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 20 | Items per page |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "candidateId": 1,
        "candidateName": "David Brown",
        "jobOpeningId": 1,
        "jobTitle": "Senior Software Engineer",
        "interviewDate": "2026-06-20",
        "interviewTime": "10:00",
        "interviewType": "technical",
        "interviewer": "Jane Smith",
        "status": "scheduled",
        "feedback": null,
        "score": null
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 10,
      "totalPages": 1
    }
  }
}
```

### POST /api/zoiko-hr/recruitment/interviews

Schedule a new interview.

**Request Body**
```json
{
  "candidateId": 1,
  "jobOpeningId": 1,
  "interviewDate": "2026-06-20",
  "interviewTime": "10:00",
  "interviewType": "technical",
  "interviewer": "Jane Smith"
}
```

**Response `201 Created`**
```json
{
  "status": "success",
  "message": "Interview scheduled",
  "data": {
    "id": 11,
    "status": "scheduled"
  }
}
```

### 6. PATCH /api/zoiko-hr/recruitment/interviews/{id}/status

Update interview status.

**Path Parameters**
| Parameter | Type | Required | Description |
|---|---|---|---|
| id | integer | Yes | Interview ID |

**Request Body**
```json
{
  "status": "completed",
  "feedback": "Strong technical skills, good communication",
  "score": 4.5
}
```

**Response `200 OK`**
```json
{
  "status": "success",
  "message": "Interview status updated",
  "data": {
    "id": 1,
    "status": "completed",
    "feedback": "Strong technical skills, good communication",
    "score": 4.5
  }
}
```

### 7. GET /api/zoiko-hr/recruitment/offers

List offers.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (candidate name, job title) |
| status | string | No | — | Filter by status (draft, sent, accepted, rejected, withdrawn) |
| jobId | integer | No | — | Filter by job opening |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 20 | Items per page |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 1,
        "candidateId": 2,
        "candidateName": "Emily Clark",
        "jobOpeningId": 1,
        "jobTitle": "Senior Software Engineer",
        "offeredSalary": 95000,
        "offeredDate": "2026-06-05",
        "expiryDate": "2026-06-19",
        "status": "sent",
        "notes": null
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 20,
      "total": 5,
      "totalPages": 1
    }
  }
}
```

### POST /api/zoiko-hr/recruitment/offers

Create a new offer.

**Request Body**
```json
{
  "candidateId": 2,
  "jobOpeningId": 1,
  "offeredSalary": 95000,
  "expiryDate": "2026-06-19",
  "notes": "Standard benefits package included"
}
```

**Validation Rules**
| Field | Rule |
|---|---|
| candidateId | Required, candidate must be in `offered` stage |
| jobOpeningId | Required |
| offeredSalary | Required, must be positive |
| expiryDate | Required, must be in the future |
| notes | Optional |

**Response `201 Created`**
```json
{
  "status": "success",
  "message": "Offer created",
  "data": {
    "id": 6,
    "status": "draft"
  }
}
```

### 8. PATCH /api/zoiko-hr/recruitment/offers/{id}/status

Update offer status (accept/reject/withdraw).

**Path Parameters**
| Parameter | Type | Required | Description |
|---|---|---|---|
| id | integer | Yes | Offer ID |

**Request Body**
```json
{
  "status": "accepted"
}
```

**Response `200 OK`**
```json
{
  "status": "success",
  "message": "Offer status updated",
  "data": {
    "id": 1,
    "status": "accepted",
    "updatedAt": "2026-06-10T15:00:00Z"
  }
}
```

### 9. GET /api/zoiko-hr/recruitment/dashboard

Recruitment dashboard stats.

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "totalOpenings": 15,
    "activeJobs": 8,
    "totalCandidates": 120,
    "candidatesByStage": {
      "applied": 40,
      "screened": 30,
      "interviewed": 25,
      "offered": 5,
      "hired": 20
    },
    "upcomingInterviews": 5,
    "offersThisMonth": 3,
    "timeToHireAvg": 25
  }
}
```

### 10. GET /api/zoiko-hr/recruitment/reports/*

Five report endpoints:

#### a) GET /api/zoiko-hr/recruitment/reports/hiring-funnel

Hiring funnel report — counts at each stage.

```json
{
  "status": "success",
  "data": {
    "labels": ["Applied", "Screened", "Interviewed", "Offered", "Hired"],
    "values": [120, 80, 50, 15, 10]
  }
}
```

#### b) GET /api/zoiko-hr/recruitment/reports/time-to-hire

Average time-to-hire by job or department.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| departmentId | integer | No | — | Filter by department |

```json
{
  "status": "success",
  "data": {
    "averageDays": 25,
    "byJob": [
      {
        "jobId": 1,
        "jobTitle": "Senior Software Engineer",
        "averageDays": 22
      }
    ]
  }
}
```

#### c) GET /api/zoiko-hr/recruitment/reports/source-effectiveness

Effectiveness of candidate sources.

```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "source": "LinkedIn",
        "candidates": 50,
        "hired": 8,
        "conversionRate": 16.0
      },
      {
        "source": "Referral",
        "candidates": 30,
        "hired": 10,
        "conversionRate": 33.3
      }
    ]
  }
}
```

#### d) GET /api/zoiko-hr/recruitment/reports/offer-acceptance

Offer acceptance rate.

```json
{
  "status": "success",
  "data": {
    "totalOffers": 20,
    "accepted": 15,
    "rejected": 3,
    "withdrawn": 2,
    "acceptanceRate": 75.0
  }
}
```

#### e) GET /api/zoiko-hr/recruitment/reports/department-hiring

Hiring activity by department.

```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "department": "Engineering",
        "openings": 5,
        "hired": 3,
        "inPipeline": 12
      },
      {
        "department": "Marketing",
        "openings": 2,
        "hired": 1,
        "inPipeline": 5
      }
    ]
  }
}
```

## Page Patterns

| Pattern | Value |
|---|---|
| Search | Text + stage/status filters |
| Inline Stage Change | Candidate stage updated inline |
| Server Pagination | `pageSize=20` |
| Modals | None currently |
| Validation | Stage progression enforced; email format validation; salary must be positive |

## Validation Summary

| Validation | Detail |
|---|---|
| Candidate stage progression | Must follow: applied → screened → interviewed → offered → hired |
| Email format | Standard email regex validation |
| Salary (min/max) | Must be positive; max ≥ min |
| Offer salary | Must be positive |
| Candidate stage for offer | Candidate must be in `offered` stage |
