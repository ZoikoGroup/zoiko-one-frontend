# Learning API Blueprint

**Module:** Learning  
**Base Path:** `/api/zoiko-hr/learning`  
**Models:** LearningCourse, LearningPath, Certification, Assessment, Enrollment  
**Pages:** dashboard, assessments, certifications, courses, enrollments, learning-paths, reports

---

## Required Endpoints

### Dashboard

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/dashboard` | Aggregated learning dashboard metrics |

**GET /dashboard**  
- **Response (200):**
```json
{
  "totalCourses": 45,
  "activeEnrollments": 230,
  "completedCourses": 180,
  "completionRate": 78.3,
  "certificationsIssued": 25,
  "pendingAssessments": 15,
  "averageProgress": 65.0,
  "recentEnrollments": [
    { "id": 1, "course": "Advanced JavaScript", "employee": "John Doe", "enrolledAt": "2024-06-01", "progress": 45 }
  ],
  "popularCourses": [
    { "id": 1, "title": "Leadership 101", "enrollments": 50 }
  ]
}
```

---

### LearningCourse

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/courses` | List courses (paginated, searchable) |
| GET | `/courses/{id}` | Get single course |
| POST | `/courses` | Create a course |
| PUT | `/courses/{id}` | Update a course |
| DELETE | `/courses/{id}` | Delete a course |

**GET /courses**  
- **Query Params:** `search`, `category`, `level` (beginner | intermediate | advanced), `status` (draft | published | archived), `page` (default: 1), `pageSize` (default: 25, max: 100), `sortBy`, `sortOrder`

- **Response (200):**
```json
{
  "data": [
    {
      "id": 1,
      "title": "Advanced JavaScript",
      "description": "Deep dive into modern JavaScript",
      "category": "Programming",
      "level": "advanced",
      "duration": 40,
      "durationUnit": "hours",
      "status": "published",
      "instructor": "John Doe",
      "enrollmentCount": 30,
      "completionRate": 85.0,
      "createdAt": "2024-01-15T10:00:00Z",
      "updatedAt": "2024-06-01T08:00:00Z"
    }
  ],
  "pagination": { "page": 1, "pageSize": 25, "totalItems": 45, "totalPages": 2 }
}
```

**POST /courses**  
- **Request Body:**
```json
{
  "title": "Advanced JavaScript",
  "description": "Deep dive into modern JavaScript concepts",
  "category": "Programming",
  "level": "advanced",
  "duration": 40,
  "durationUnit": "hours",
  "status": "draft",
  "instructor": "John Doe",
  "syllabus": "Week 1: Closures\nWeek 2: Promises\n..."
}
```
- **Validation Rules:**
  - `title`: required, string, max 255 chars
  - `description`: optional, string, max 2000 chars
  - `category`: required, string, max 100 chars
  - `level`: required, enum (beginner | intermediate | advanced)
  - `duration`: required, integer > 0
  - `durationUnit`: required, enum (minutes | hours | days | weeks)
  - `status`: required, enum (draft | published | archived)
  - `instructor`: required, string, max 100 chars

---

### LearningPath

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/learning-paths` | List learning paths |
| GET | `/learning-paths/{id}` | Get single path |
| POST | `/learning-paths` | Create path |
| PUT | `/learning-paths/{id}` | Update path |
| DELETE | `/learning-paths/{id}` | Delete path |

**GET /learning-paths**  
- **Query Params:** `search`, `category`, `level`, `status` (active | inactive), `page` (default: 25), `sortBy`, `sortOrder`

**POST /learning-paths**  
- **Request Body:**
```json
{
  "title": "Frontend Developer Track",
  "description": "Complete path from beginner to advanced frontend",
  "category": "Web Development",
  "level": "beginner",
  "courses": [1, 2, 3],
  "status": "active"
}
```
- **Validation Rules:**
  - `title`: required, string, max 255 chars
  - `courses`: required, array of course IDs, min 1
  - `level`: required, enum
  - `status`: required, enum (active | inactive)

---

### Certification

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/certifications` | List certifications |
| GET | `/certifications/{id}` | Get single certification |
| POST | `/certifications` | Issue certification |
| PUT | `/certifications/{id}` | Update certification |

**GET /certifications**  
- **Query Params:** `search`, `status` (active | expired | revoked), `employeeId`, `courseId`, `issuedDateFrom`, `issuedDateTo`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /certifications**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "courseId": 1,
  "issuedDate": "2024-06-01",
  "expiryDate": "2026-06-01",
  "certificationNumber": "CERT-001",
  "status": "active"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `courseId`: required, must exist
  - `issuedDate`: required, valid date
  - `expiryDate`: optional, must be after issuedDate
  - `certificationNumber`: optional, unique if provided

---

### Assessment

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/assessments` | List assessments |
| GET | `/assessments/{id}` | Get single assessment |
| POST | `/assessments` | Create assessment |
| PUT | `/assessments/{id}` | Update assessment |
| DELETE | `/assessments/{id}` | Delete assessment |

**GET /assessments**  
- **Query Params:** `search`, `status` (draft | published | closed), `type` (quiz | exam | project | assignment), `courseId`, `page` (default: 25), `sortBy`, `sortOrder`

---

### Enrollment

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/enrollments` | List enrollments |
| GET | `/enrollments/{id}` | Get single enrollment |
| POST | `/enrollments` | Create enrollment |
| PUT | `/enrollments/{id}` | Update enrollment |
| DELETE | `/enrollments/{id}` | Delete enrollment |

**GET /enrollments**  
- **Query Params:** `search`, `status` (active | completed | dropped | paused), `courseId`, `employeeId`, `progressMin`, `progressMax`, `page` (default: 25), `sortBy`, `sortOrder`

**POST /enrollments**  
- **Request Body:**
```json
{
  "employeeId": 101,
  "courseId": 1,
  "enrolledAt": "2024-06-01",
  "status": "active"
}
```
- **Validation Rules:**
  - `employeeId`: required, must exist
  - `courseId`: required, must exist, course must be `published`
  - `enrolledAt`: required, valid date
  - `status`: required, enum (active | completed | dropped | paused)
  - No duplicate active enrollment for same employee + course

---

### Reports

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/reports/progress` | Employee learning progress |
| GET | `/reports/certification` | Certification statistics |
| GET | `/reports/completion` | Course completion rates |
| GET | `/reports/dept-stats` | Department-wise learning stats |
| GET | `/reports/skill-trends` | Skill trends analysis |

**GET /reports/progress**  
- **Query Params:** `department` (optional), `courseId` (optional)
- **Response (200):**
```json
{
  "averageProgress": 65.0,
  "byDepartment": [
    { "department": "Engineering", "averageProgress": 72.0, "enrollments": 50 }
  ],
  "distribution": [
    { "range": "0-25%", "count": 20 },
    { "range": "26-50%", "count": 35 },
    { "range": "51-75%", "count": 45 },
    { "range": "76-100%", "count": 60 }
  ]
}
```

**GET /reports/certification**  
- **Response (200):**
```json
{
  "totalIssued": 25,
  "active": 22,
  "expired": 3,
  "byCourse": [
    { "course": "Advanced JavaScript", "issued": 10, "active": 9 }
  ]
}
```

**GET /reports/completion**  
- **Query Params:** `dateFrom`, `dateTo`
- **Response (200):**
```json
{
  "overallCompletionRate": 78.3,
  "byCourse": [
    { "course": "Leadership 101", "enrollments": 50, "completed": 42, "rate": 84.0 }
  ]
}
```

**GET /reports/dept-stats**  
- **Response (200):**
```json
{
  "departments": [
    { "department": "Engineering", "enrollments": 80, "completed": 60, "rate": 75.0, "certifications": 10 }
  ]
}
```

**GET /reports/skill-trends**  
- **Response (200):**
```json
{
  "trends": [
    { "skill": "JavaScript", "enrollments": 120, "growthRate": 15.0 },
    { "skill": "Python", "enrollments": 95, "growthRate": 22.0 }
  ]
}
```

---

## Validation Rules Summary

| Entity | Field | Required | Constraints |
|--------|-------|----------|-------------|
| Course | title | Yes | max 255 chars |
| Course | category | Yes | max 100 chars |
| Course | level | Yes | beginner, intermediate, advanced |
| Course | duration | Yes | integer > 0 |
| Course | instructor | Yes | max 100 chars |
| LearningPath | title | Yes | max 255 chars |
| LearningPath | courses | Yes | array, min 1 |
| Certification | employeeId | Yes | must exist |
| Certification | courseId | Yes | must exist |
| Assessment | title | Yes | max 255 chars |
| Assessment | type | Yes | quiz, exam, project, assignment |
| Enrollment | employeeId | Yes | must exist |
| Enrollment | courseId | Yes | must exist, published |

## Pagination Strategy

- **Default pageSize:** 25 (all list endpoints)
- **Max pageSize:** 100
- **Type:** Offset-based
- **Response:** `{ data: [], pagination: { page, pageSize, totalItems, totalPages } }`

## Search Strategy

- **Scope:** Text search across `title`, `description`, `category`, `instructor`, `employeeName`, `courseName`
- **Method:** `ILIKE` / `LIKE` case-insensitive
- **Combinable with:** Category, level, status, type filters

## Filters

| Filter | Type | Endpoints |
|--------|------|-----------|
| category | string | /courses, /learning-paths |
| level | enum | /courses, /learning-paths |
| status | enum | /courses, /learning-paths, /certifications, /assessments, /enrollments |
| type | enum | /assessments |
| courseId | integer | /enrollments, /assessments, /certifications |
| employeeId | integer | /enrollments, /certifications |

## Sorting

- **Default:** `createdAt` desc
- **Allowed sort fields:** `createdAt`, `updatedAt`, `title`, `level`, `duration`, `status`, `enrollmentCount`, `completionRate`, `issuedDate`, `progress`

## Upload Requirements

- **None.** Course content/syllabus handled as markdown text fields.

## Export Requirements

- **None.** CSV/PDF export deferred to future phase.
