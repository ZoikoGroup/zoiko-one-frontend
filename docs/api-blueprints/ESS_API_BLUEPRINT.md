# ESS API Blueprint

## Module Overview

| Property | Value |
|---|---|
| **Module** | Employee Self Service (ESS) |
| **Pages** | 11 — dashboard, my-assets, my-attendance, my-documents, my-learning, my-leave, my-payslips, my-performance, my-profile, my-requests, notifications |
| **Current State** | All mock (13 functions: fetchESSDashboard, fetchESSProfile, fetchESSAttendance, fetchESSLeaveRequests, fetchESSLeaveBalances, fetchESSDocuments, fetchESSAssets, fetchESSCourses, fetchESSReviews, fetchESSPayslips, fetchESSRequests, fetchESSNotifications, markNotificationRead) |
| **Base Path** | `/api/zoiko-hr/ess` |
| **Models Needed** | None — all reads from existing tables |
| **Design Principle** | ESS is an **aggregation layer**, not a new data domain. It reads from existing tables filtered by the current employee. |

## Design Principles

- All endpoints use the authenticated employee's ID (from session/token) — no employee ID is passed as a parameter.
- ESS is **read-heavy**; only notification read status is writeable.
- This phase **MUST come AFTER** upstream modules (Attendance, Leave, Assets, Learning, Performance, Compensation) are integrated.

## Source Tables

| Endpoint | Source Table(s) |
|---|---|
| ESS Dashboard | Attendance, LeaveRequest, EmployeeDocumentReference, AssetAllocation, Enrollment, PerformanceReview, Payslip, Notification |
| Profile | Employee |
| My Attendance | Attendance |
| My Leave | LeaveRequest, LeaveBalance |
| My Documents | EmployeeDocumentReference |
| My Assets | AssetAllocation (mapped to Employee) |
| My Learning | Enrollment |
| My Performance | PerformanceReview |
| My Payslips | Payslip |
| My Requests | EmployeeRequest |
| Notifications | Notification |

## Endpoints

### 1. GET /api/zoiko-hr/ess/dashboard

Aggregated stats for the current employee.

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "attendance": {
      "presentToday": true,
      "totalPresentThisMonth": 18,
      "totalAbsentThisMonth": 2
    },
    "leave": {
      "pendingRequests": 1,
      "approvedRequests": 3,
      "availableAnnualLeave": 12,
      "availableSickLeave": 5
    },
    "documents": {
      "totalDocuments": 8,
      "expiringSoon": 1
    },
    "assets": {
      "allocatedAssets": 2,
      "pendingReturns": 0
    },
    "learning": {
      "enrolledCourses": 3,
      "inProgress": 1,
      "completed": 2
    },
    "performance": {
      "pendingReviews": 0,
      "latestReviewScore": 4.2
    },
    "payslips": {
      "latestAvailable": "2026-05"
    },
    "requests": {
      "pendingRequests": 2,
      "totalRequests": 15
    },
    "notifications": {
      "unreadCount": 3
    }
  }
}
```

### 2. GET /api/zoiko-hr/ess/profile

Current employee profile.

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "id": 1,
    "employeeId": "EMP001",
    "firstName": "John",
    "lastName": "Doe",
    "email": "john.doe@zoiko.com",
    "phone": "+1234567890",
    "department": "Engineering",
    "designation": "Senior Developer",
    "joinDate": "2022-03-15",
    "reportingManager": "Jane Smith",
    "employmentType": "Full-time",
    "workLocation": "Remote",
    "profileImageUrl": null
  }
}
```

### 3. GET /api/zoiko-hr/ess/attendance

My attendance records with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (date range, status) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |
| fromDate | string (date) | No | — | Filter from date |
| toDate | string (date) | No | — | Filter to date |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 101,
        "date": "2026-06-01",
        "checkIn": "09:00",
        "checkOut": "18:00",
        "status": "present",
        "hoursWorked": 8.0,
        "isLate": false,
        "isOvertime": false
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 42,
      "totalPages": 5
    }
  }
}
```

### 4. GET /api/zoiko-hr/ess/leave-requests

My leave requests with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (type, status, reason) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |
| status | string | No | — | Filter by status |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 51,
        "leaveType": "annual",
        "startDate": "2026-07-01",
        "endDate": "2026-07-05",
        "durationDays": 5,
        "status": "pending",
        "reason": "Family vacation",
        "appliedOn": "2026-06-10",
        "approvedBy": null
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 12,
      "totalPages": 2
    }
  }
}
```

### 5. GET /api/zoiko-hr/ess/leave-balances

My leave balances.

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "balances": [
      {
        "leaveType": "annual",
        "entitled": 20,
        "taken": 8,
        "remaining": 12,
        "pending": 5
      },
      {
        "leaveType": "sick",
        "entitled": 10,
        "taken": 5,
        "remaining": 5,
        "pending": 0
      },
      {
        "leaveType": "personal",
        "entitled": 5,
        "taken": 2,
        "remaining": 3,
        "pending": 1
      }
    ]
  }
}
```

### 6. GET /api/zoiko-hr/ess/documents

My documents with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (type, name) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 201,
        "documentType": "contract",
        "documentName": "Employment Contract.pdf",
        "uploadedAt": "2022-03-15",
        "expiryDate": null,
        "status": "active",
        "fileUrl": "/api/zoiko-hr/ess/documents/201/download"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 8,
      "totalPages": 1
    }
  }
}
```

### 7. GET /api/zoiko-hr/ess/assets

My allocated assets with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (asset name, serial) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 301,
        "assetName": "MacBook Pro 16\"",
        "assetTag": "AST-001",
        "serialNumber": "SN12345678",
        "allocatedDate": "2022-03-15",
        "returnDate": null,
        "status": "allocated",
        "condition": "good"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

### 8. GET /api/zoiko-hr/ess/courses

My enrolled courses with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (course name, provider) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |
| status | string | No | — | Filter by status (enrolled, in_progress, completed) |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 401,
        "courseName": "Advanced TypeScript",
        "provider": "Udemy",
        "enrolledDate": "2026-01-10",
        "completionDate": null,
        "status": "in_progress",
        "progressPercent": 65,
        "score": null
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 3,
      "totalPages": 1
    }
  }
}
```

### 9. GET /api/zoiko-hr/ess/reviews

My performance reviews with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (review period, reviewer) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 501,
        "reviewPeriod": "H1 2026",
        "reviewDate": "2026-06-30",
        "reviewerName": "Jane Smith",
        "overallScore": 4.2,
        "status": "completed",
        "comments": "Excellent performance this half."
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 2,
      "totalPages": 1
    }
  }
}
```

### 10. GET /api/zoiko-hr/ess/payslips

My payslips with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (month, year) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 601,
        "month": "May",
        "year": 2026,
        "grossPay": 5000.00,
        "netPay": 3800.00,
        "deductions": 1200.00,
        "generatedDate": "2026-06-01",
        "status": "generated",
        "pdfUrl": "/api/zoiko-hr/ess/payslips/601/download"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 12,
      "totalPages": 2
    }
  }
}
```

### 11. GET /api/zoiko-hr/ess/requests

My requests with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (type, reason) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |
| status | string | No | — | Filter by status |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 701,
        "requestType": "work_from_home",
        "reason": "Medical appointment",
        "requestDate": "2026-06-10",
        "status": "pending",
        "resolvedBy": null,
        "resolvedDate": null,
        "remarks": null
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 15,
      "totalPages": 2
    }
  }
}
```

### 12. GET /api/zoiko-hr/ess/notifications

My notifications with pagination.

**Query Parameters**
| Parameter | Type | Required | Default | Description |
|---|---|---|---|---|
| search | string | No | — | Text search (title, message) |
| page | integer | No | 1 | Page number |
| pageSize | integer | No | 10 | Items per page |
| unreadOnly | boolean | No | false | Filter unread only |

**Response `200 OK`**
```json
{
  "status": "success",
  "data": {
    "records": [
      {
        "id": 801,
        "title": "Leave Approved",
        "message": "Your annual leave request (Jul 1-5) has been approved.",
        "type": "leave",
        "isRead": false,
        "createdAt": "2026-06-11T10:30:00Z"
      }
    ],
    "pagination": {
      "page": 1,
      "pageSize": 10,
      "total": 25,
      "totalPages": 3
    }
  }
}
```

### 13. PATCH /api/zoiko-hr/ess/notifications/{id}/read

Mark a single notification as read.

**Path Parameters**
| Parameter | Type | Required | Description |
|---|---|---|---|
| id | integer | Yes | Notification ID |

**Response `200 OK`**
```json
{
  "status": "success",
  "message": "Notification marked as read"
}
```

**Response `404 Not Found`**
```json
{
  "status": "error",
  "message": "Notification not found"
}
```

## Page Patterns

| Pattern | Value |
|---|---|
| Search | Text search across relevant fields |
| Client Pagination | `pageSize=10` |
| Modals | None |
| Upload | None |
| Export | None |
