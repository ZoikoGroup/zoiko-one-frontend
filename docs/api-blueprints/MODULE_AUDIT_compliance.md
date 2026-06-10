# Compliance Module — Implementation Audit

## Status Overview

| Layer | Status | Action Required |
|---|---|---|
| **Prisma Models** | ✅ 10 models exist | None needed |
| **Repository** (`app/repositories/complianceRepository.ts`) | ❌ Missing | Create |
| **Service** (`app/services/complianceService.ts`) | ❌ Missing | Create |
| **API Routes** (`app/api/zoiko-hr/compliance/`) | ❌ Missing | Create |
| **Frontend API** (`app/lib/api/compliance.api.ts`) | ❌ Missing | Create |
| **Barrel Export** (`workforce-api.ts` mocks) | ❌ 18 mock functions | Replace with re-export |
| **API Blueprint** | ✅ `docs/api-blueprints/COMPLIANCE_API_BLUEPRINT.md` | Reference only |

## Existing Prisma Models (10 total)

| Model | Key Fields | Relations |
|---|---|---|
| `Policy` | id, tenantId, orgId, policyName, category, description, version, status | → PolicyAcknowledgement[], PolicyViolation[] |
| `PolicyCategory` | id, tenantId, orgId, name, description, policyCount | — |
| `PolicyAcknowledgement` | id, tenantId, orgId, policyId, employeeId, status | → Policy, Employee |
| `ComplianceRequirement` | id, tenantId, orgId, title, description, priority, dueDate, status | — |
| `ComplianceAudit` | id, tenantId, orgId, auditName, auditType, auditor, scheduledDate, completedDate, status | — |
| `PolicyViolation` | id, tenantId, orgId, policyId, employeeId, severity, description, status | → Policy, Employee |
| `CorrectiveAction` | id, tenantId, orgId, title, description, assignedTo, priority, dueDate, status | — |
| `TrainingCompliance` | id, tenantId, orgId, employeeId, trainingModule, assignedDate, completionDate, score, status | → Employee |
| `ComplianceReport` | id, tenantId, packName, jurisdiction, score, alerts, violations, status | — |
| `GlobalComplianceFlags` | id, employeeId, tenantId, backgroundCheckStatus, visaStatus, workPermitStatus, etc. | → Employee |

## Enums

`PolicyStatus`, `RequirementPriority`, `RequirementStatus`, `AuditStatus`, `ViolationSeverity`, `ViolationStatus`, `CorrectiveActionStatus`, `AcknowledgementStatus`, `TrainingComplianceStatus`, `ComplianceStatus`, `BackgroundCheckStatus`, `VisaStatus`, `WorkPermitStatus`

## Endpoints to Create (18 total)

### Policies (4)
- `GET /api/zoiko-hr/compliance/policies` — list with search, filter, pagination
- `POST /api/zoiko-hr/compliance/policies` — create
- `PUT /api/zoiko-hr/compliance/policies/[id]` — update
- `DELETE /api/zoiko-hr/compliance/policies/[id]` — soft-delete

### Policy Categories (2)
- `GET /api/zoiko-hr/compliance/policy-categories` — list
- `POST /api/zoiko-hr/compliance/policy-categories` — create

### Compliance Requirements (3)
- `GET /api/zoiko-hr/compliance/requirements` — list
- `POST /api/zoiko-hr/compliance/requirements` — create
- `PUT /api/zoiko-hr/compliance/requirements/[id]` — update

### Audits (3)
- `GET /api/zoiko-hr/compliance/audits` — list
- `POST /api/zoiko-hr/compliance/audits` — create
- `PATCH /api/zoiko-hr/compliance/audits/[id]/status` — update status

### Violations (2)
- `GET /api/zoiko-hr/compliance/violations` — list
- `PATCH /api/zoiko-hr/compliance/violations/[id]/status` — update status

### Corrective Actions (3)
- `GET /api/zoiko-hr/compliance/corrective-actions` — list
- `POST /api/zoiko-hr/compliance/corrective-actions` — create
- `PUT /api/zoiko-hr/compliance/corrective-actions/[id]` — update

### Acknowledgements (1)
- `GET /api/zoiko-hr/compliance/acknowledgements` — list

### Training Compliance (1)
- `GET /api/zoiko-hr/compliance/training-compliance` — list

### Dashboard (1)
- `GET /api/zoiko-hr/compliance/dashboard` — aggregate stats

### Reports (5)
- `GET /api/zoiko-hr/compliance/reports/trends`
- `GET /api/zoiko-hr/compliance/reports/violations-by-category`
- `GET /api/zoiko-hr/compliance/reports/audit-completion`
- `GET /api/zoiko-hr/compliance/reports/department-compliance`
- `GET /api/zoiko-hr/compliance/reports/policy-adherence`

## Frontend Mock Functions to Replace (18)

| # | Function | HTTP | Endpoint |
|---|---|---|---|
| 1 | `fetchPolicies()` | GET | `/compliance/policies` |
| 2 | `createPolicy()` | POST | `/compliance/policies` |
| 3 | `updatePolicy()` | PUT | `/compliance/policies/[id]` |
| 4 | `fetchPolicyCategories()` | GET | `/compliance/policy-categories` |
| 5 | `createPolicyCategory()` | POST | `/compliance/policy-categories` |
| 6 | `updatePolicyCategory()` | PUT | `/compliance/policy-categories/[id]` |
| 7 | `fetchComplianceRequirements()` | GET | `/compliance/requirements` |
| 8 | `createComplianceRequirement()` | POST | `/compliance/requirements` |
| 9 | `updateComplianceRequirement()` | PUT | `/compliance/requirements/[id]` |
| 10 | `fetchAudits()` | GET | `/compliance/audits` |
| 11 | `createAudit()` | POST | `/compliance/audits` |
| 12 | `updateAuditStatus()` | PATCH | `/compliance/audits/[id]/status` |
| 13 | `fetchViolations()` | GET | `/compliance/violations` |
| 14 | `updateViolationStatus()` | PATCH | `/compliance/violations/[id]/status` |
| 15 | `fetchCorrectiveActions()` | GET | `/compliance/corrective-actions` |
| 16 | `createCorrectiveAction()` | POST | `/compliance/corrective-actions` |
| 17 | `updateCorrectiveAction()` | PUT | `/compliance/corrective-actions/[id]` |
| 18 | `fetchAcknowledgements()` | GET | `/compliance/acknowledgements` |
| 19 | `fetchTrainingCompliance()` | GET | `/compliance/training-compliance` |
| 20 | `fetchComplianceDashboard()` | GET | `/compliance/dashboard` |
| 21 | `fetchComplianceTrends()` | GET | `/compliance/reports/trends` |
| 22 | `fetchViolationByCategory()` | GET | `/compliance/reports/violations-by-category` |
| 23 | `fetchAuditCompletionData()` | GET | `/compliance/reports/audit-completion` |
| 24 | `fetchDeptComplianceStats()` | GET | `/compliance/reports/department-compliance` |
| 25 | `fetchPolicyAdherenceTrends()` | GET | `/compliance/reports/policy-adherence` |
