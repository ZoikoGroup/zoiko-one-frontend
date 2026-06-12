# ZoikoHR Database Architecture

**Version:** 1.0  
**Date:** June 2026  
**Author:** Principal Enterprise Architect  
**Status:** Enterprise Design Specification

---

## Executive Summary

ZoikoHR is the **Master People System** for the Zoiko ecosystem, serving as the single source of truth for workforce and organizational data. It provides a comprehensive, multi-tenant, enterprise-grade database architecture that supports human resource management, organizational hierarchy, talent acquisition, onboarding, payroll integration, compliance, and workforce analytics.

**Core Design Principles:**
- Single tenant scoping with organization-level hierarchies
- Master data ownership with downstream integration contracts
- Complete audit and compliance lineage
- Soft deletion with retention policies
- Data versioning for sensitive records
- Future-proof extensibility for ZoikoTime, ZoikoPayroll, ZoikoComply, ZoikoInsights, ZoikoPay, and ZoikoCoreX

---

## Section 1: Database Strategy

### 1.1 Multi-Tenant Strategy

**Tenant Isolation Model: Hard Tenancy**

All ZoikoHR entities are scoped to a tenant via `tenantId` foreign key. This ensures:
- **Data isolation:** No cross-tenant queries possible; every query must include `WHERE tenantId = ?`
- **Compliance:** Regulatory boundaries enforced at database level
- **Performance:** Tenant-scoped indexes for horizontal scalability
- **Security:** Row-level security can be layered on top for additional control

**Tenant Boundaries:**
- One legal entity per tenant
- Multiple organizations per tenant (subsidiaries, divisions, geographic entities)
- All employees, departments, policies, workflows belong to parent tenant
- Audit logs and compliance records inherit tenant scoping

**Multi-Organization within Tenant:**
- Tenants can have multiple organizations (e.g., parent corp + subsidiaries)
- Each organization has its own department hierarchy, cost centers, and policies
- Cross-organization reporting lines supported (e.g., dotted reporting to parent org)
- Shared payroll infrastructure at tenant level, organization-specific in ZoikoPayroll

---

### 1.2 Organization Scoping

**Hierarchical Organization Model:**

```
Tenant (legal entity boundary)
  ├─ Organization (e.g., "US Operations", "EMEA", "HQ")
  │   ├─ Division (e.g., "Engineering", "Sales")
  │   │   ├─ BusinessUnit (e.g., "Backend", "Frontend")
  │   │   │   ├─ Department (e.g., "Platform Services")
  │   │   │   │   ├─ Location (e.g., "San Francisco")
  │   │   │   │   ├─ CostCenter (e.g., "CC-001-ENG")
  │   │   │   │   └─ Employee (reporting to dept)
```

**Scoping Rules:**
- Employee scoped to Organization (primary) + Department (functional)
- Location is always under Organization (ensures geographic compliance)
- Department hierarchy is tree structure; depth varies by org
- Cost centers may span multiple departments (matrix reporting)
- Reporting lines can cross departments and divisions within same organization
- Soft-delete at any level cascades to children (with audit trail)

**Organization Status Lifecycle:**
```
ACTIVE → (optional) SUSPENDED → (optional) ARCHIVED → (optional) DELETED
```

---

### 1.3 Audit Strategy

**Comprehensive Audit Framework:**

Every ZoikoHR entity change is audited using the enterprise AuditLog model:

**Audit Capture Points:**

1. **Employee Lifecycle:**
   - Employee creation (hire date, employee ID assigned)
   - Profile updates (name, email, phone)
   - Status transitions (ACTIVE → INACTIVE, etc.)
   - Compensation changes (salary, benefits)
   - Role/reporting changes

2. **Organization Changes:**
   - Department creation/deletion
   - Org chart restructuring
   - Cost center allocation changes
   - Location changes

3. **Leave Management:**
   - Leave request submission
   - Leave approval/rejection
   - Balance adjustments
   - Cancellations

4. **Performance & Goals:**
   - Performance review creation/completion
   - Rating assignments
   - Goal submissions and updates
   - Feedback recorded

5. **Recruitment:**
   - Job opening creation
   - Candidate status changes
   - Offer extended/accepted/rejected
   - Hire conversion

6. **Onboarding/Offboarding:**
   - Onboarding plan created/started/completed
   - Task assignments and completions
   - Exit interviews
   - Clearance task completions

7. **Payroll Integration:**
   - PayrollProfile updates
   - Bank account changes
   - Tax profile modifications
   - Benefit enrollments

**Audit Fields in Core Entities:**
- `createdAt`: When record created
- `createdBy`: User ID who created
- `updatedAt`: Last modification time
- `updatedBy`: User ID who last modified
- `deletedAt`: When soft-deleted (nullable)
- `deletedBy`: User ID who deleted (nullable)
- `deletionReason`: Why deleted (nullable)

**AuditLog Entity Enhancements for HR:**
- New `AuditEventType` values: `EMPLOYEE_HIRE`, `EMPLOYEE_TERMINATION`, `LEAVE_REQUEST`, `RECRUITMENT_EVENT`, `PERFORMANCE_REVIEW`, `COMPENSATION_CHANGE`
- New `AuditCategory` values: `HUMAN_RESOURCES`, `RECRUITMENT`, `PERFORMANCE`, `COMPENSATION`
- `beforeValues`/`afterValues` for sensitive changes (salary, employment status)
- `correlationId` linking related events (e.g., all steps in an onboarding)

**Who Can Access Audit Logs:**
- HR Admins (full HR audit logs for their organization)
- Compliance Admins (cross-org compliance audit logs)
- Tenant Admins (all tenant HR events)
- Employees (their own events only, e.g., leave requests)
- Auditors (read-only access per governance policy)

---

### 1.4 Soft Delete Strategy

**Soft Delete Policy:**

All entities support logical deletion (not hard removal from database):

```
DELETE operation → SET deletedAt = NOW(), deletedBy = userId, deletionReason = ?
QUERY operation → WHERE deletedAt IS NULL (implicit, always applied)
```

**Exceptions (Hard Delete):**
- Session tokens (after expiry/revocation)
- Temporary workflow objects after completion
- Sensitive PII after retention period expires

**Soft Delete Cascade:**
When a parent entity is soft-deleted, children are also soft-deleted:
- Organization deleted → all departments, cost centers, employees set `deletedAt`
- Department deleted → all employees in department deleted (unless reassigned)
- Employee deleted → all related records (leave, reviews, training) deleted
- Employee offboarded → exit request, clearance tasks archived

**Soft Delete with Data Availability:**
- Admin can view historical/deleted records via audit reports
- ESS cannot see deleted records
- Payroll can see deleted employees for prior period calculations
- GDPR erasure (hard delete) handled separately via Data Erasure request

---

### 1.5 Data Versioning Strategy

**Versioning for Sensitive Records:**

Certain entities require version history to track changes over time:

**Versioned Entities:**
1. **PayrollProfile** - track salary history, benefit changes
2. **SalaryStructure** - salary grade changes, component modifications
3. **EmployeeProfile** - name, contact info, emergency contacts
4. **EmploymentRecord** - employment type changes, role changes
5. **TaxProfile** - tax withholding, W-4 changes
6. **LeavePolicy** - policy changes with effective dates
7. **GovernancePolicy** - HR policy versions for compliance

**Versioning Mechanism:**

```
EmploymentRecord (current record)
  ├─ version: 1
  ├─ effectiveDate: 2026-01-01
  ├─ expiresAt: null
  ├─ status: ACTIVE
  └─ Previous versions stored separately or as JSON history

EmploymentRecordHistory (point-in-time snapshots)
  ├─ employmentRecordId (FK)
  ├─ version: 1
  ├─ recordData (JSON snapshot)
  ├─ effectiveDate: 2026-01-01
  ├─ expiresAt: null
  ├─ changedBy: userId
  ├─ changeReason: "Promotion"
  ├─ createdAt: 2026-01-01
```

**Version Query Pattern:**
```
SELECT * FROM EmploymentRecord 
WHERE employeeId = ? 
  AND effectiveDate <= NOW() 
  AND (expiresAt IS NULL OR expiresAt > NOW())
ORDER BY version DESC
LIMIT 1
```

**Historical Lookup:**
```
SELECT * FROM EmploymentRecordHistory
WHERE employmentRecordId = ?
ORDER BY version ASC
-- Reconstructs complete employment history
```

---

### 1.6 Retention Strategy

**Data Retention Policies:**

ZoikoHR implements tiered retention based on entity type and regulatory requirements:

**Active Employee Data (indefinite):**
- Employee, EmploymentRecord, EmployeeProfile
- Current compensation, benefits, payroll profile
- Active leave balance
- Current goals and reviews

**Historical Employee Data (7 years after termination):**
- Previous employment records
- Payroll run history
- Tax records (W-4, 1099, etc.)
- Performance reviews
- Training records
- Leave history

**Sensitive Temporary Data (30-90 days after creation/action):**
- Interview feedback (90 days post-hire decision)
- Recruitment candidate records (90 days post-hire or rejection)
- Exit interview notes (90 days post-termination)
- Applicant PII (90 days post-rejection per GDPR)

**Audit Logs (7 years):**
- All HR-related audit logs retained per compliance requirements
- Payroll audit logs (7 years)
- Security/access audit logs (5 years minimum)

**Soft-Deleted Records (2 years):**
- Employees deleted (accidental hire, duplicate record)
- Departments deleted (restructuring)
- Leave requests cancelled
- Reviews/feedback deleted
- Hard delete after retention window

**Retention Enforcement:**
- Automated job runs daily to identify expired records
- Notification to HR Admin 30 days before purge
- Purge executed on schedule with audit log of deletions
- Retention policies configurable per tenant

---

### 1.7 Compliance Strategy

**Regulatory Compliance Framework:**

ZoikoHR designed for multi-jurisdiction compliance:

**GDPR (European Union):**
- Right to access: Employees can download all personal data
- Right to erasure: Hard-delete after retention period (with audit)
- Data portability: Export employment records in standard format
- Consent tracking: Document consent for data processing
- DPIA: Data Protection Impact Assessment support

**CCPA (California):**
- Consumer right to know: Employee data export
- Consumer right to delete: Erasure request processing
- Opt-out: Email/notification preferences honored
- Verification: Identity verification before data access

**FCRA (Fair Credit Reporting Act, US):**
- Background check consent/disclosure tracking
- Pre-adverse action process workflow
- Dispute tracking

**EEOC (Equal Employment Opportunity, US):**
- EEO-1 report generation from demographic data
- Pay equity analysis and reporting
- Diversity metrics

**SOX (Sarbanes-Oxley):**
- Executive compensation tracking
- Insider trading blackout management
- Executive certifications

**Compliance Features in Database:**
- Consent flags on EmployeeProfile (GDPR consent, FCRA consent)
- Jurisdiction field on Organization (for applicable regulations)
- Data classification (PII, Sensitive, Public) on all fields
- Erasure request workflow with audit trail
- Compliance report generation from audit logs

---

## Section 2: Workforce Domain

### 2.1 Employee Entity

**Purpose:** Master record for each person employed by the organization. Single source of truth for identity, contact, and employment authorization.

**Primary Attributes:**
- `id`: Unique identifier (UUID)
- `tenantId`: Parent tenant (multi-tenant scoping)
- `organizationId`: Primary organization assignment
- `employeeId`: Human-readable unique identifier per organization (e.g., "EMP-12345")
- `firstName`, `lastName`: Legal name
- `email`: Corporate email (unique per tenant)
- `personalEmail`: Personal email for communication
- `phoneNumber`: Work phone
- `personalPhone`: Personal phone for emergency contact
- `dateOfBirth`: Age calculation, compliance tracking
- `gender`: Demographic tracking, EEOC reporting
- `nationality`: Immigration compliance, passport tracking
- `profilePhotoUrl`: Avatar for directory
- `status`: ACTIVE, ON_LEAVE, SUSPENDED, INACTIVE, TERMINATED
- `employmentType`: FULL_TIME, PART_TIME, CONTRACT, INTERN, TEMPORARY
- `joinDate`: Official hire date
- `terminationDate`: When employment ends (for terminated employees)
- `terminationReason`: RESIGNATION, TERMINATION, RETIREMENT, LAYOFF, OTHER
- `terminationNotes`: Additional context

**Relationships:**
- One Employee → One Tenant (FK)
- One Employee → One Organization (primary org)
- One Employee → One Department (functional assignment)
- One Employee → One EmploymentRecord (current)
- One Employee → Many EmploymentRecordHistory
- One Employee → One EmployeeProfile
- One Employee → One PayrollProfile (to ZoikoPayroll)
- One Employee → Many LeaveRequest
- One Employee → Many PerformanceReview
- One Employee → Many Goal
- One Employee → Many InterviewRound (as interviewee)
- One Employee → One Manager (reporting to)
- One Employee → Many DirectReports (manages)

**Cardinality:**
```
Tenant (1) ──→ (M) Employee
Organization (1) ──→ (M) Employee
```

**Audit Requirements:**
- `EMPLOYEE_HIRE` audit event on creation
- `EMPLOYEE_TERMINATION` audit event on termination
- `EMPLOYEE_PROFILE_UPDATE` on profile changes
- Track before/after for status, employment type, compensation
- Log who hired, who terminated, and reason

**Constraints:**
- Unique (tenantId, email)
- Unique (organizationId, employeeId)
- Join date cannot be in future
- Termination date >= join date (if applicable)
- Only TERMINATED status can have terminationDate

---

### 2.2 EmployeeProfile Entity

**Purpose:** Extended personal and professional profile information. Separated from core Employee for modularity and selective access.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee (1:1 relationship)
- `tenantId`: Parent tenant
- `middleName`: Middle name/initials
- `preferredName`: Name to use in communication
- `suffix`: Jr., Sr., PhD, etc.
- `maritalStatus`: SINGLE, MARRIED, DIVORCED, WIDOWED, PREFER_NOT_TO_SAY
- `spouseName`: For benefits coordination
- `numberDependents`: For tax/benefits
- `bloodGroup`: Optional, for emergency medical
- `allergies`: Medical information for emergency
- `disabilities`: ADA accommodation tracking
- `languages`: Multilingual capability (JSON array)
- `specialSkills`: Free-form skills summary
- `bio`: Professional biography
- `profilePhotoUrl`: Extended version of photo (high-res)
- `linkedinUrl`: Professional network profile
- `personalWebsite`: Portfolio or blog URL
- `createdAt`, `createdBy`, `updatedAt`, `updatedBy`

**Relationships:**
```
EmployeeProfile (1) ← → (1) Employee
```

**Audit Requirements:**
- Track changes to sensitive fields (maritalStatus, disabilities, allergies)
- Log modifications by HR admin
- Compliance: Medical information access logging

**Constraints:**
- 1:1 with Employee (one profile per employee)
- Profile created on employee hire (auto-created)

---

### 2.3 EmploymentRecord Entity

**Purpose:** Snapshot of employment contract, status, and role. Versioned to track career progression.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `version`: Integer version number (1, 2, 3, ...)
- `effectiveDate`: When this record became/becomes active
- `expiresAt`: When this record expires (nullable; null = no expiry)
- `employmentType`: FULL_TIME, PART_TIME, CONTRACT, INTERN
- `employmentStatus`: ACTIVE, PROBATION, EXTENDED_LEAVE, SUSPENDED, NOTICE_PERIOD, TERMINATED
- `jobTitle`: Current job title
- `jobLevel`: JUNIOR, MID, SENIOR, LEAD, MANAGER, DIRECTOR, VP, EXECUTIVE, C_SUITE
- `designation`: Reference to Designation entity
- `department`: Reference to Department entity
- `reportingTo`: Reference to Manager's Employee record (FK)
- `division`: Reference to Division entity
- `businessUnit`: Reference to BusinessUnit entity
- `location`: Reference to Location entity
- `costCenter`: Reference to CostCenter entity
- `wfhEligible`: Is remote work allowed?
- `wfhDays`: How many days per week allowed remote
- `workingHours`: FULL_TIME (40h), PART_TIME (30h), CUSTOM
- `contractStartDate`: For contractors
- `contractEndDate`: For contractors
- `salaryGrade`: Reference to salary grade (ZoikoPayroll integration)
- `salaryAmount`: Annual salary in cents
- `salaryCurrency`: USD, EUR, GBP, etc.
- `paymentFrequency`: MONTHLY, SEMI_MONTHLY, WEEKLY, BI_WEEKLY
- `probationEndDate`: When probation period ends
- `changeReason`: Why this employment record was created (HIRE, PROMOTION, TRANSFER, DEMOTION, ROLE_CHANGE, CONTRACT_RENEWAL)
- `changedBy`: User who created this record
- `notes`: Additional context for the change

**Relationships:**
```
EmploymentRecord (M) ← → (1) Employee
EmploymentRecord (M) ← → (1) Department
EmploymentRecord (M) ← → (1) Designation
EmploymentRecord (M) ← → (1) Manager (Employee via reportingTo)
EmploymentRecord (M) ← → (1) Location
EmploymentRecord (M) ← → (1) CostCenter
EmploymentRecord (M) ← → (1) Division
EmploymentRecord (M) ← → (1) BusinessUnit
```

**Cardinality:**
```
Employee (1) ──→ (M) EmploymentRecord
```

**Audit Requirements:**
- New version created on any employment change
- Track before/after for jobTitle, salary, reporting line
- HR Admin must provide changeReason
- Audit event includes promotion, transfer, salary change
- Escalation workflow for certain changes (e.g., executive compensation)

**Constraints:**
- effectiveDate required
- expiresAt >= effectiveDate (if specified)
- Exactly one EmploymentRecord per employee with (expiresAt IS NULL) at any time
- Salary updates must be approved via GovernancePolicy
- Demotion/termination must have audit trail with justification

**Version Query:**
```
-- Get current employment record
SELECT * FROM EmploymentRecord 
WHERE employeeId = ? 
  AND effectiveDate <= NOW() 
  AND (expiresAt IS NULL OR expiresAt > NOW())

-- Get historical record at specific date
SELECT * FROM EmploymentRecord 
WHERE employeeId = ? 
  AND effectiveDate <= '2024-01-01' 
  AND (expiresAt IS NULL OR expiresAt > '2024-01-01')
```

---

### 2.4 EmployeeStatus Entity

**Purpose:** Status history and transitions. Tracks lifecycle state (ACTIVE, ON_LEAVE, SUSPENDED, TERMINATED) with timestamps and reasons.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `currentStatus`: ACTIVE, ON_LEAVE, SUSPENDED, INACTIVE, TERMINATED
- `previousStatus`: Prior status (for transition tracking)
- `effectiveDate`: When status took effect
- `reason`: Status change reason (HIRE, TERMINATION, LEAVE, SUSPENSION, RETURN, etc.)
- `statusReason`: RESIGNATION, TERMINATION, RETIREMENT, LAYOFF, MEDICAL_LEAVE, SABBATICAL, etc.
- `notes`: Additional context
- `changedBy`: User who initiated change
- `changedAt`: When change was recorded

**Relationships:**
```
EmployeeStatus (M) ← → (1) Employee
```

**Cardinality:**
```
Employee (1) ──→ (M) EmployeeStatus
```

**Audit Requirements:**
- Status transitions to TERMINATED create EMPLOYEE_TERMINATION audit event
- Track who changed status and when
- Log reason for suspension or leave

**Constraints:**
- Immutable history (no updates, only new records)
- Status transitions validated by business rules
- TERMINATED status cannot transition back

---

### 2.5 EmployeeHistory Entity

**Purpose:** Complete point-in-time snapshot of employee data. Used for reconstruction, audit, and analytics.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `snapshotDate`: When snapshot was taken (monthly, on-demand)
- `employeeData`: JSON blob of complete employee record
- `employmentRecordData`: JSON blob of employment record
- `statusData`: JSON blob of status record
- `profileData`: JSON blob of profile record
- `takenBy`: System or user who triggered snapshot
- `createdAt`: Timestamp of snapshot

**Relationships:**
```
EmployeeHistory (M) ← → (1) Employee
```

**Audit Requirements:**
- Snapshots taken monthly automatically
- Snapshots taken on termination
- Used for compliance audits (reconstruct employee state at any point)

**Use Cases:**
- Regulatory inquiry: "What was employee's status on 2025-06-15?"
- Severance calculation: "What was salary on termination date?"
- Tax reporting: "Who was employed in Q1 2026?"

---

### 2.6 EmergencyContact Entity

**Purpose:** Next-of-kin and emergency contact information for employee safety and notification.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `priority`: 1 (primary), 2 (secondary), 3 (tertiary)
- `firstName`, `lastName`: Contact name
- `relationship`: SPOUSE, CHILD, PARENT, SIBLING, FRIEND, OTHER
- `phoneNumber`: Primary contact number
- `alternatePhone`: Secondary contact number
- `email`: Email address
- `address`: Physical address
- `city`, `state`, `postalCode`, `country`: Address components
- `notes`: Special instructions (e.g., "call after 5pm")
- `createdAt`, `updatedAt`

**Relationships:**
```
EmergencyContact (M) ← → (1) Employee
```

**Cardinality:**
```
Employee (1) ──→ (M) EmergencyContact (typically 1-3)
```

**Constraints:**
- At least one emergency contact required for active employee
- Priority values unique per employee (no two primary contacts)

---

### 2.7 EmployeeAddress Entity

**Purpose:** Current and historical addresses for employee for tax, benefits, and compliance purposes.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `type`: RESIDENTIAL, MAILING, WORK, OTHER
- `isPrimary`: Boolean (one primary per type)
- `address`: Street address
- `apt`: Apartment/suite number
- `city`: City
- `state`: State/province
- `postalCode`: Zip/postal code
- `country`: Country code (ISO 3166)
- `effectiveDate`: When address became active
- `expiresAt`: When address ended (nullable)
- `notes`: Additional info

**Relationships:**
```
EmployeeAddress (M) ← → (1) Employee
```

**Cardinality:**
```
Employee (1) ──→ (M) EmployeeAddress
```

**Audit Requirements:**
- Track address changes (for tax, benefits, payroll)
- Log who made change and when
- Soft-delete old addresses (keep for audit)

**Constraints:**
- One primary residential address at any time
- Address changes trigger payroll/benefits update workflows

---

### 2.8 EmployeeIdentity Entity

**Purpose:** Government ID, passport, visa, and work authorization tracking for compliance and onboarding.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `type`: PASSPORT, NATIONAL_ID, DRIVERS_LICENSE, SSN, VISA, WORK_PERMIT, I9
- `country`: Issuing country
- `idNumber`: Government ID number (encrypted)
- `issuedDate`: When issued
- `expiryDate`: When expires
- `issueLocation`: Where issued
- `notes`: Additional info
- `verifiedDate`: When verified by HR
- `verifiedBy`: User who verified
- `documentUrl`: Reference to stored document (via Document Storage)
- `isActive`: Current valid ID
- `createdAt`, `updatedAt`, `deletedAt`

**Relationships:**
```
EmployeeIdentity (M) ← → (1) Employee
```

**Cardinality:**
```
Employee (1) ──→ (M) EmployeeIdentity (typically 1-3 active)
```

**Audit Requirements:**
- Log ID verifications
- Track expiry alerts
- Audit access to sensitive ID numbers (encrypted fields)

**Constraints:**
- At least one active identity document for all employees
- Expiry dates checked daily; alerts sent 30 days before
- SSN and government IDs must be encrypted at rest

---

## Section 3: Organization Domain

### 3.1 Organization Hierarchy

**Root Entity: Organization**

Parent container for entire organizational structure.

**Primary Attributes:**
- `id`: UUID
- `tenantId`: FK to Tenant (1:1 relationship)
- `name`: Organization name (e.g., "Acme Corp US", "EMEA Operations")
- `shortName`: Abbreviation (e.g., "ACME-US")
- `parentOrgId`: FK to Organization (for org-within-org)
- `type`: HEADQUARTERS, REGIONAL, SUBSIDIARY, DIVISION, BUSINESS_UNIT
- `status`: ACTIVE, INACTIVE, SUSPENDED, ARCHIVED
- `foundingYear`: Year organization established
- `industryCode`: SIC/NAICS code for industry classification
- `size`: STARTUP, SMALL, MEDIUM, LARGE, ENTERPRISE
- `headquarters`: Location name
- `website`: Organization website
- `ein`: US Employer ID Number (for payroll)
- `registrationNumber`: Business registration number (country-specific)
- `legalStatus`: PRIVATE, PUBLIC, NON_PROFIT, COOPERATIVE
- `description`: Organization description
- `createdAt`, `updatedAt`, `deletedAt`, `deletedBy`

**Relationships:**
```
Organization (M) ← → (1) Tenant
Organization (M) ← → (1) ParentOrganization (self-join)
Organization (1) ─→ (M) Division
Organization (1) ─→ (M) Department
Organization (1) ─→ (M) Location
Organization (1) ─→ (M) CostCenter
Organization (1) ─→ (M) Employee
```

**Audit Requirements:**
- Organization creation/deletion tracked
- Name changes, status changes logged
- Track parent org changes (for restructuring)
- Generate org tree snapshot on structural change

---

### 3.2 Division Entity

**Purpose:** Major business lines or segments within organization.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Division name (e.g., "Engineering", "Sales")
- `code`: Division code (e.g., "DIV-ENG")
- `description`: Division description
- `divisionHead`: FK to Employee (who leads)
- `budget`: Annual budget in cents
- `headcount`: Number of employees (computed)
- `status`: ACTIVE, INACTIVE, ARCHIVED

**Relationships:**
```
Division (M) ← → (1) Organization
Division (M) ← → (1) DivisionHead (Employee)
Division (1) ─→ (M) Department
```

---

### 3.3 BusinessUnit Entity

**Purpose:** Sub-division of Division. Enables matrix organizational structures.

**Primary Attributes:**
- `id`: UUID
- `divisionId`: FK to Division
- `tenantId`: Parent tenant
- `name`: Business unit name
- `code`: BU code
- `businessUnitHead`: FK to Employee
- `budget`: Budget allocation
- `headcount`: Employee count
- `status`: ACTIVE, INACTIVE, ARCHIVED

**Relationships:**
```
BusinessUnit (M) ← → (1) Division
BusinessUnit (1) ─→ (M) Department
```

---

### 3.4 Department Entity

**Purpose:** Functional teams within organization. Core grouping for employee assignment.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `divisionId`: FK to Division (optional)
- `businessUnitId`: FK to BusinessUnit (optional)
- `tenantId`: Parent tenant
- `name`: Department name (e.g., "Backend Engineering")
- `code`: Department code (e.g., "DEPT-BE")
- `description`: Department description
- `parentDeptId`: FK to Department (for nested hierarchy)
- `departmentHead`: FK to Employee (manager)
- `costCenter`: FK to CostCenter
- `location`: FK to Location
- `budget`: Annual budget
- `headcount`: Current employee count
- `status`: ACTIVE, INACTIVE, ARCHIVED
- `createdAt`, `updatedAt`, `deletedAt`

**Relationships:**
```
Department (M) ← → (1) Organization
Department (M) ← → (1) Division (optional)
Department (M) ← → (1) BusinessUnit (optional)
Department (M) ← → (1) ParentDepartment (self-join, optional)
Department (1) ─→ (M) ChildDepartment (self-join)
Department (1) ─→ (M) Employee
Department (M) ← → (1) DepartmentHead (Employee)
Department (M) ← → (1) CostCenter
Department (M) ← → (1) Location
```

**Constraints:**
- Circular hierarchy prevented (parent cannot be descendant)
- Department must have head (Manager with HR_ADMIN role minimum)
- Cannot delete if has active employees (must transfer first)

**Hierarchy Example:**
```
Organization: Acme Corp
├─ Division: Engineering
│  ├─ BusinessUnit: Platform
│  │  ├─ Department: Backend Services
│  │  │  ├─ Team: Database (sub-dept)
│  │  │  └─ Team: API Gateway (sub-dept)
│  │  └─ Department: Frontend
│  └─ BusinessUnit: Infrastructure
│     └─ Department: DevOps
└─ Division: Sales
   ├─ Department: Enterprise Sales
   └─ Department: Customer Success
```

---

### 3.5 Designation Entity

**Purpose:** Job titles and levels. Reference for employment records.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization (org-specific designations)
- `tenantId`: Parent tenant
- `title`: Job title (e.g., "Senior Software Engineer")
- `code`: Designation code (e.g., "SWE-L4")
- `level`: JUNIOR, MID, SENIOR, LEAD, MANAGER, DIRECTOR, VP, EXECUTIVE, C_SUITE
- `category`: TECHNICAL, MANAGEMENT, SUPPORT, SALES, FINANCE, HR, OTHER
- `grade`: Salary grade reference
- `description`: Role description
- `minSalary`: Minimum salary for role
- `maxSalary`: Maximum salary for role
- `status`: ACTIVE, ARCHIVED

**Relationships:**
```
Designation (M) ← → (1) Organization
Designation (1) ─→ (M) EmploymentRecord (who holds this designation)
```

---

### 3.6 Location Entity

**Purpose:** Physical office locations for employees.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Location name (e.g., "San Francisco HQ")
- `code`: Location code (e.g., "LOC-SF")
- `locationType`: HEADQUARTERS, OFFICE, REMOTE, HYBRID, FIELD
- `address`: Street address
- `city`: City
- `state`: State/province
- `postalCode`: Postal code
- `country`: Country code
- `timezone`: Timezone (America/Los_Angeles)
- `status`: ACTIVE, INACTIVE, ARCHIVED

**Relationships:**
```
Location (M) ← → (1) Organization
Location (1) ─→ (M) EmploymentRecord
Location (1) ─→ (M) Employee
```

---

### 3.7 CostCenter Entity

**Purpose:** Budget and cost allocation for payroll and expenses.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Cost center name (e.g., "CC-ENG-SF")
- `code`: Cost center code
- `description`: Cost center description
- `manager`: FK to Employee (cost center owner)
- `budget`: Annual budget allocation
- `budgetYear`: Fiscal year budget applies to
- `status`: ACTIVE, INACTIVE, ARCHIVED

**Relationships:**
```
CostCenter (M) ← → (1) Organization
CostCenter (M) ← → (1) Manager (Employee)
CostCenter (1) ─→ (M) EmploymentRecord
CostCenter (1) ─→ (M) Department
```

---

### 3.8 ReportingRelationship Entity

**Purpose:** Flexible reporting structure. Supports dotted lines, matrix management, and complex hierarchies.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee (who reports)
- `managerId`: FK to Employee (who is manager)
- `tenantId`: Parent tenant
- `type`: PRIMARY, DOTTED, FUNCTIONAL, SKIP_LEVEL, MENTOR
- `effectiveDate`: When relationship starts
- `expiresAt`: When relationship ends (nullable)
- `authority`: FULL, PARTIAL, ADVISORY, REVIEW (what decision rights)
- `createdAt`, `updatedAt`

**Relationships:**
```
ReportingRelationship (M) ← → (1) Employee (as subordinate)
ReportingRelationship (M) ← → (1) Manager (Employee, as manager)
```

**Cardinality:**
```
Employee (1) ──→ (M) ReportingRelationship (as subordinate)
Employee (1) ──→ (M) ManagerialRelationship (as manager)
```

**Constraints:**
- One PRIMARY reporting relationship per employee at any time
- Cannot create circular reporting (A→B→C→A)
- Skip-level requires approval from intermediate manager

**Example:**
```
CEO
  ├─ VP Engineering (Primary: CEO)
  │   ├─ Staff Engineer (Primary: VP Eng, Dotted: CTO)
  │   └─ Backend Team Lead (Primary: VP Eng, Mentor: Staff Engineer)
  │       └─ Backend Engineer (Primary: Team Lead, Dotted: Staff Eng)
```

---

### 3.9 ManagerRelationship Entity

**Purpose:** Inverse of ReportingRelationship. Tracks who manages whom.

**Primary Attributes:**
- `managerId`: FK to Employee
- `reporteeId`: FK to Employee
- `tenantId`: Parent tenant
- Attributes same as ReportingRelationship

**Relationships:**
```
ManagerRelationship (1) ← → (1) ReportingRelationship (denormalized)
```

**Purpose of Denormalization:**
- Quick lookup: "Who reports to Manager X?"
- Query optimization for org charts
- Maintained automatically via triggers/hooks

---

### 3.10 OrgNode Entity

**Purpose:** Graph representation of organizational hierarchy for efficient traversal.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `nodeType`: ORGANIZATION, DIVISION, BUSINESS_UNIT, DEPARTMENT, EMPLOYEE
- `nodeId`: FK to actual entity (Organization, Department, or Employee ID)
- `parentNodeId`: FK to parent OrgNode
- `depth`: Tree depth (for performance)
- `path`: Hierarchical path (e.g., "ORG-001/DIV-002/DEPT-003")
- `label`: Display name

**Relationships:**
```
OrgNode (M) ← → (1) Organization (organizational context)
OrgNode (M) ← → (1) ParentOrgNode (self-join)
```

**Use Cases:**
- Fast org chart generation
- "Get all descendants of node X"
- "Get path from employee to CEO"
- Stored separately from entities for query performance

---

### 3.11 OrgSnapshot Entity

**Purpose:** Point-in-time snapshot of entire org structure for compliance, audit, and historical analysis.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `snapshotDate`: When snapshot taken
- `orgStructure`: JSON (full hierarchy)
- `headcount`: Total employee count at snapshot date
- `departmentCount`: Number of departments
- `divisionCount`: Number of divisions
- `takenBy`: User or system who triggered snapshot
- `reason`: WHY_TAKEN (QUARTERLY_AUDIT, RESTRUCTURING, EXIT_PROCESSING, etc.)
- `createdAt`: Timestamp

**Relationships:**
```
OrgSnapshot (M) ← → (1) Organization
```

**Use Cases:**
- "Show org structure as of Q1 2026"
- "What was John's reporting line on 2025-06-15?"
- Compliance audits
- Severance calculations based on org structure at termination date

---

## Section 4: Leave Domain

### 4.1 Leave Management Architecture

**Core Entities:**
1. LeaveType
2. LeavePolicy
3. LeaveBalance
4. LeaveRequest
5. LeaveApproval (integrated with ApprovalWorkflow)
6. HolidayCalendar
7. Holiday

---

### 4.2 LeaveType Entity

**Purpose:** Defines types of leave available (vacation, sick, personal, unpaid, etc.).

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Leave type name (e.g., "Paid Time Off")
- `code`: Leave code (e.g., "PTO", "SICK", "PARENTAL")
- `description`: Description
- `category`: PAID, UNPAID, STATUTORY, MEDICAL, BEREAVEMENT, PARENTAL, SABBATICAL, OTHER
- `maxDaysPerYear`: Maximum accrual per year
- `minDaysRequired`: Minimum notice for approval
- `requiresApproval`: Boolean
- `requiresMedicalCert`: For medical leave
- `attachmentRequired`: Boolean (must attach document)
- `isActive`: Boolean

**Relationships:**
```
LeaveType (M) ← → (1) Organization
LeaveType (1) ─→ (M) LeavePolicy
LeaveType (1) ─→ (M) LeaveRequest
```

---

### 4.3 LeavePolicy Entity

**Purpose:** Organization-specific leave policies. Versioned for compliance tracking.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `leaveTypeId`: FK to LeaveType
- `name`: Policy name (e.g., "US PTO Policy 2026")
- `version`: Version number
- `effectiveDate`: When policy takes effect
- `expiresAt`: When policy expires
- `daysPerYear`: Annual allocation
- `accrualsPerMonth`: Monthly accrual (alternative to annual)
- `carryoverLimit`: Max days that can roll over
- `carryoverExpiry`: When carryover expires
- `minNotice`: Minimum notice in days
- `maxConsecutiveDays`: Max consecutive days allowed
- `requiresApproval`: Needs manager approval
- `status`: ACTIVE, ARCHIVED

**Relationships:**
```
LeavePolicy (1) ← → (1) LeaveType
LeavePolicy (M) ← → (1) Organization
```

---

### 4.4 LeaveBalance Entity

**Purpose:** Tracks employee leave balance for each leave type.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `leaveTypeId`: FK to LeaveType
- `tenantId`: Parent tenant
- `year`: Calendar or fiscal year
- `allocatedDays`: Annual allocation
- `usedDays`: Days used to date
- `pendingDays`: Days in pending approval
- `carryoverDays`: Days carried from prior year
- `availableDays`: Computed (allocated + carryover - used - pending)
- `lastUpdatedAt`: When balance updated

**Relationships:**
```
LeaveBalance (1) ← → (1) Employee
LeaveBalance (1) ← → (1) LeaveType
```

**Constraints:**
- One LeaveBalance per (Employee, LeaveType, Year)
- Available days cannot go negative
- Automatically decrement on LeaveRequest approval

---

### 4.5 LeaveRequest Entity

**Purpose:** Employee request to take leave. Integrated with ApprovalWorkflow.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `leaveTypeId`: FK to LeaveType
- `tenantId`: Parent tenant
- `approvalWorkflowId`: FK to ApprovalWorkflow (for routing to manager)
- `requestDate`: When request submitted
- `startDate`: When leave starts
- `endDate`: When leave ends
- `workingDaysRequested`: Number of working days
- `reason`: Optional reason for leave
- `attachmentUrl`: Reference to medical cert, etc.
- `status`: DRAFT, SUBMITTED, APPROVED, REJECTED, CANCELLED, IN_PROGRESS, COMPLETED
- `approvedBy`: FK to Employee (approver)
- `approvedAt`: When approved
- `rejectionReason`: If rejected
- `createdAt`, `updatedAt`, `deletedAt`

**Relationships:**
```
LeaveRequest (M) ← → (1) Employee
LeaveRequest (M) ← → (1) LeaveType
LeaveRequest (1) ← → (1) ApprovalWorkflow (for approval)
LeaveRequest (M) ← → (1) Approver (Employee)
```

**Integration with ApprovalWorkflow:**
```
LeaveRequest created
  ↓
ApprovalWorkflow created with:
  - workflowType: LEAVE_APPROVAL
  - resourceType: LeaveRequest
  - resourceId: leaveRequestId
  - currentApproverId: employee.directManager
  - state: PENDING
  ↓
Manager approves/rejects
  ↓
ApprovalAction recorded
  ↓
LeaveRequest status updated
  ↓
LeaveBalance adjusted (on approval)
```

---

### 4.6 LeaveApproval Entity

**Purpose:** Track approval history and decisions for leave requests.

**Primary Attributes:**
- `id`: UUID
- `leaveRequestId`: FK to LeaveRequest
- `approvalWorkflowId`: FK to ApprovalWorkflow
- `tenantId`: Parent tenant
- `level`: 1 (Manager), 2 (Department Head), 3 (HR)
- `approver`: FK to Employee
- `status`: PENDING, APPROVED, REJECTED, ESCALATED
- `approvedAt`: When decided
- `reason`: Approval/rejection reason
- `comments`: Additional comments

**Relationships:**
```
LeaveApproval (1) ← → (1) LeaveRequest
LeaveApproval (1) ← → (1) ApprovalWorkflow
```

---

### 4.7 HolidayCalendar Entity

**Purpose:** Organizational holiday calendar. Different calendars for different countries/locations.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Calendar name (e.g., "US Holidays 2026")
- `countryCode`: Country code (US, UK, CA, etc.)
- `year`: Year calendar applies to
- `status`: ACTIVE, ARCHIVED

**Relationships:**
```
HolidayCalendar (M) ← → (1) Organization
HolidayCalendar (1) ─→ (M) Holiday
```

---

### 4.8 Holiday Entity

**Purpose:** Specific holidays in calendar.

**Primary Attributes:**
- `id`: UUID
- `holidayCalendarId`: FK to HolidayCalendar
- `tenantId`: Parent tenant
- `name`: Holiday name (e.g., "Christmas")
- `date`: Holiday date
- `isOptional`: Is observance optional?
- `halfDay`: Is it half-day observance?
- `regionCode`: Region-specific holiday (optional)

**Relationships:**
```
Holiday (M) ← → (1) HolidayCalendar
```

---

### 4.9 Leave Approval Workflow Integration

**Workflow Flow:**

```
Employee requests leave
  ↓ (SUBMITTED)
ApprovalWorkflow created with current manager as approver
  ↓ (PENDING)
Manager receives notification (via Notification Service)
  ↓
Manager approves or rejects
  ↓ (APPROVED/REJECTED)
ApprovalAction recorded with decision
  ↓
LeaveRequest status updated
  ↓ (if APPROVED)
LeaveBalance.usedDays incremented
  ↓
Employee notified of decision
```

**Escalation:**
- If manager doesn't respond in N days, escalate to department head
- If still pending after 2N days, escalate to HR admin
- HR admin can force-approve for compliance

---

### 4.10 Leave Balance Audit

All leave operations generate AuditLog entries:

```
AuditEventType.LEAVE_REQUEST
  - Employee requests leave
  - Fields: employeeId, leaveTypeId, startDate, endDate, workingDays

AuditEventType.LEAVE_APPROVED
  - Manager/HR approves
  - Fields: leaveRequestId, approver, approvalDate
  - Change: LeaveBalance.usedDays changed

AuditEventType.LEAVE_REJECTED
  - Leave request rejected
  - Fields: leaveRequestId, rejecter, rejectionReason

AuditEventType.LEAVE_CANCELLED
  - Employee or manager cancels leave
  - Fields: leaveRequestId, cancelledBy, reason
  - Change: LeaveBalance.usedDays decremented
```

---

## Section 5: Recruitment Domain

### 5.1 Recruitment Lifecycle

**Workflow Path:**
```
JobOpening
  ↓ (recruitment campaign)
Candidate
  ↓ (application)
Application
  ↓ (interview scheduling)
Interview
  ↓ (offer decision)
Offer
  ↓ (acceptance)
Employee (on start date)
```

---

### 5.2 JobOpening Entity

**Purpose:** Active job requisitions in the organization.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `jobTitle`: Title of position
- `designation`: FK to Designation (target level/role)
- `department`: FK to Department (reporting to)
- `division`: FK to Division
- `reportsTo`: FK to Employee (hiring manager)
- `description`: Job description
- `responsibilities`: Key responsibilities (JSON array)
- `requirements`: Must-have skills (JSON array)
- `niceToHave`: Preferred skills (JSON array)
- `salaryMin`, `salaryMax`: Salary band
- `salaryCurrency`: Currency
- `employmentType`: FULL_TIME, PART_TIME, CONTRACT
- `numberOfOpenings`: How many positions to fill
- `location`: FK to Location
- `isRemote`: Allows remote work
- `status`: DRAFT, OPEN, CLOSED, ON_HOLD, FILLED, CANCELLED
- `publishedDate`: When posted publicly
- `closingDate`: Application deadline
- `urgency`: LOW, MEDIUM, HIGH, CRITICAL
- `createdBy`: FK to Employee (recruiter)
- `createdAt`, `updatedAt`, `closedAt`

**Relationships:**
```
JobOpening (M) ← → (1) Organization
JobOpening (M) ← → (1) Department
JobOpening (M) ← → (1) Designation
JobOpening (M) ← → (1) HiringManager (Employee)
JobOpening (1) ─→ (M) Candidate
JobOpening (1) ─→ (M) Application
```

---

### 5.3 Candidate Entity

**Purpose:** Individuals in recruitment pipeline.

**Primary Attributes:**
- `id`: UUID
- `tenantId`: Parent tenant
- `firstName`, `lastName`: Candidate name
- `email`: Email address
- `phoneNumber`: Contact phone
- `linkedinProfile`: LinkedIn URL
- `sourceChannel`: CAREER_SITE, LINKEDIN, REFERRAL, RECRUITER, AGENCY, COLLEGE, OTHER
- `referredBy`: FK to Employee (if employee referral)
- `sourceDetails`: JSON (tracking data)
- `status`: ACTIVE, REJECTED, HIRED, ON_HOLD, WITHDRAWN
- `rejectionReason`: If rejected
- `createdAt`, `updatedAt`

**Relationships:**
```
Candidate (M) ← → (1) Tenant
Candidate (1) ─→ (M) Application
Candidate (1) ─→ (M) Interview
```

---

### 5.4 Application Entity

**Purpose:** Candidate's application to specific job opening.

**Primary Attributes:**
- `id`: UUID
- `jobOpeningId`: FK to JobOpening
- `candidateId`: FK to Candidate
- `tenantId`: Parent tenant
- `appliedDate`: When submitted
- `resumeUrl`: Reference to resume document
- `coverLetterUrl`: Reference to cover letter
- `sourceData`: JSON (tracking pixel, referral code, etc.)
- `screenerNotes`: Initial screening comments
- `screenerRating`: 1-5 star rating
- `status`: SUBMITTED, SCREENING, SHORTLISTED, REJECTED, ACCEPTED_OFFER, HIRED, WITHDRAWN
- `screenedBy`: FK to Employee (recruiter)
- `screenedAt`: Date screened
- `rejectionReason`: If rejected
- `rejectedAt`: Date rejected
- `createdAt`, `updatedAt`, `deletedAt`

**Relationships:**
```
Application (M) ← → (1) JobOpening
Application (M) ← → (1) Candidate
Application (1) ─→ (M) Interview
Application (1) ─→ (1) Offer (if extended)
```

---

### 5.5 Interview Entity

**Purpose:** Interview rounds and feedback.

**Primary Attributes:**
- `id`: UUID
- `applicationId`: FK to Application
- `candidateId`: FK to Candidate
- `jobOpeningId`: FK to JobOpening
- `tenantId`: Parent tenant
- `interviewType`: PHONE_SCREEN, TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PANEL, HR_ROUND, FINAL
- `round`: 1, 2, 3, ... (interview sequence)
- `scheduledDate`: When interview scheduled
- `scheduledTime`: Time of interview
- `interviewers`: JSON array of interviewer IDs
- `duration`: Minutes duration
- `location`: PHONE, VIDEO, IN_PERSON, OTHER
- `meetingLink`: Video call link
- `status`: SCHEDULED, COMPLETED, CANCELLED, NO_SHOW, RESCHEDULED
- `feedback`: JSON (aggregated feedback)
- `overallRating`: 1-5 rating
- `recommendedForNext`: Boolean
- `completedDate`: When interview occurred
- `createdAt`, `updatedAt`

**Relationships:**
```
Interview (M) ← → (1) Application
Interview (M) ← → (1) Candidate
Interview (1) ─→ (M) InterviewFeedback
```

---

### 5.6 InterviewFeedback Entity

**Purpose:** Structured feedback from each interviewer.

**Primary Attributes:**
- `id`: UUID
- `interviewId`: FK to Interview
- `interviewerId`: FK to Employee (who conducted)
- `tenantId`: Parent tenant
- `communicationSkills`: 1-5 rating
- `technicalSkills`: 1-5 rating
- `cultureFit`: 1-5 rating
- `leadershipPotential`: 1-5 rating (if applicable)
- `strengths`: Text feedback
- `concerns`: Text feedback
- `overallRecommendation`: STRONG_YES, YES, MAYBE, NO, STRONG_NO
- `comments`: Additional notes
- `submittedAt`: When feedback submitted

**Relationships:**
```
InterviewFeedback (M) ← → (1) Interview
InterviewFeedback (M) ← → (1) Interviewer (Employee)
```

---

### 5.7 Offer Entity

**Purpose:** Job offer extended to candidate.

**Primary Attributes:**
- `id`: UUID
- `applicationId`: FK to Application
- `candidateId`: FK to Candidate
- `jobOpeningId`: FK to JobOpening
- `tenantId`: Parent tenant
- `offerDate`: When offer extended
- `expiryDate`: When offer expires
- `jobTitle`: Offered title
- `salaryAmount`: Offered salary
- `salaryCurrency`: Currency
- `benefits`: JSON (health, retirement, stock options, etc.)
- `startDate`: Proposed start date
- `employmentType`: FULL_TIME, PART_TIME, CONTRACT
- `terms`: JSON (vacation days, signing bonus, etc.)
- `offerLetterUrl`: Reference to offer letter document
- `status`: DRAFT, EXTENDED, ACCEPTED, REJECTED, EXPIRED, WITHDRAWN
- `respondBy`: Candidate response deadline
- `respondedDate`: When candidate responded
- `acceptedAt`: When accepted
- `declinedAt`: When declined
- `declineReason`: If declined
- `createdBy`: FK to Employee (HR/hiring manager)
- `createdAt`, `updatedAt`

**Relationships:**
```
Offer (1) ← → (1) Application
Offer (1) ← → (1) Candidate
Offer (1) ← → (1) JobOpening
```

---

### 5.8 HiringPipeline Entity

**Purpose:** Summary view of all candidates in pipeline for a job opening.

**Primary Attributes:**
- `id`: UUID
- `jobOpeningId`: FK to JobOpening
- `tenantId`: Parent tenant
- `totalApplications`: Count of applications
- `screening`: Count in screening stage
- `shortlisted`: Count shortlisted
- `interview`: Count in interview
- `offered`: Count with offers
- `hired`: Count hired
- `rejected`: Count rejected
- `conversionRate`: Percentage offered/applications
- `timeToHire`: Average days from application to hire
- `lastUpdatedAt`: When metrics updated

**Relationships:**
```
HiringPipeline (1) ← → (1) JobOpening
```

---

### 5.9 Recruitment Workflow

**Integration with ApprovalWorkflow:**

```
Offer Extended
  ↓
ApprovalWorkflow created (if offer requires approval):
  - workflowType: OFFER_APPROVAL
  - resourceType: Offer
  - resourceId: offerId
  - currentApproverId: hriingManager
  - state: PENDING
  ↓
Hiring Manager approves offer
  ↓
ApprovalAction recorded
  ↓
Offer.status set to EXTENDED
  ↓
Candidate notified
  ↓
Candidate accepts/declines
  ↓
Offer.status set to ACCEPTED/REJECTED
  ↓
If accepted + on start date:
    Employee record created
```

---

## Section 6: Onboarding Domain

### 6.1 OnboardingPlan Entity

**Purpose:** Structured onboarding process for new employees.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `offerId`: FK to Offer
- `startDate`: Employee start date
- `endDate`: Planned onboarding completion date
- `planTemplate`: Reference to onboarding template (if used)
- `assignedTo`: FK to Employee (onboarding coordinator)
- `buddyId`: FK to Employee (buddy/mentor)
- `status`: DRAFT, IN_PROGRESS, PAUSED, COMPLETED, CANCELLED
- `progressPercentage`: % complete (computed from tasks)
- `createdAt`, `updatedAt`, `completedAt`

**Relationships:**
```
OnboardingPlan (1) ← → (1) Employee
OnboardingPlan (1) ← → (1) Offer
OnboardingPlan (1) ─→ (M) OnboardingChecklist
OnboardingPlan (1) ─→ (M) OnboardingTask
```

---

### 6.2 OnboardingChecklist Entity

**Purpose:** Grouped tasks within onboarding plan.

**Primary Attributes:**
- `id`: UUID
- `onboardingPlanId`: FK to OnboardingPlan
- `tenantId`: Parent tenant
- `name`: Checklist name (e.g., "IT Setup", "HR Paperwork", "Training")
- `description`: Description
- `category`: IT, HR, TRAINING, COMPLIANCE, FACILITIES, BUDDY, MANAGER, OTHER
- `order`: Display order
- `isComplete`: Boolean (computed)
- `completedAt`: When finished

**Relationships:**
```
OnboardingChecklist (M) ← → (1) OnboardingPlan
OnboardingChecklist (1) ─→ (M) OnboardingTask
```

---

### 6.3 OnboardingTask Entity

**Purpose:** Individual tasks within onboarding checklist.

**Primary Attributes:**
- `id`: UUID
- `checklistId`: FK to OnboardingChecklist
- `onboardingPlanId`: FK to OnboardingPlan
- `tenantId`: Parent tenant
- `title`: Task title (e.g., "Create IT account", "Benefits enrollment")
- `description`: Task description
- `assignedTo`: FK to Employee (who completes)
- `dueDate`: When task due
- `priority`: LOW, MEDIUM, HIGH
- `status`: NOT_STARTED, IN_PROGRESS, COMPLETED, BLOCKED, SKIPPED
- `assignmentDate`: When assigned
- `completedDate`: When completed
- `completedBy`: FK to Employee (who completed)
- `notes`: Task completion notes
- `documentRequired`: Reference to required documents
- `createdAt`, `updatedAt`

**Relationships:**
```
OnboardingTask (M) ← → (1) OnboardingChecklist
OnboardingTask (M) ← → (1) AssignedTo (Employee)
OnboardingTask (M) ← → (1) CompletedBy (Employee)
```

---

### 6.4 BuddyAssignment Entity

**Purpose:** Assigns peer mentor/buddy to new employee.

**Primary Attributes:**
- `id`: UUID
- `newEmployeeId`: FK to Employee
- `buddyId`: FK to Employee
- `tenantId`: Parent tenant
- `startDate`: When buddy assignment begins
- `endDate`: When assignment ends
- `status`: ACTIVE, COMPLETED, ON_HOLD

**Relationships:**
```
BuddyAssignment (1) ← → (1) NewEmployee (Employee)
BuddyAssignment (1) ← → (1) Buddy (Employee)
```

---

## Section 7: Offboarding Domain

### 7.1 ExitRequest Entity

**Purpose:** Employee departure/termination request and tracking.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `initiatedBy`: EMPLOYEE (resignation), ORGANIZATION (termination), MUTUAL
- `exitType`: RESIGNATION, TERMINATION_FOR_CAUSE, TERMINATION_WITHOUT_CAUSE, RETIREMENT, LAYOFF, VOLUNTARY, INVOLUNTARY
- `noticePeriodDays`: Contractual notice period
- `lastWorkingDate`: Last day of employment
- `resignationDate`: When resignation submitted (if employee-initiated)
- `effectiveDate`: When exit is effective
- `reason`: Free-form reason for departure
- `status`: SUBMITTED, APPROVED, REJECTED, IN_PROGRESS, COMPLETED, CANCELLED
- `approvedBy`: FK to Employee (approver)
- `approvedAt`: When approved
- `createdAt`, `updatedAt`, `completedAt`

**Relationships:**
```
ExitRequest (1) ← → (1) Employee
ExitRequest (1) ─→ (1) ExitInterview
ExitRequest (1) ─→ (M) ClearanceTask
```

**Integration with ApprovalWorkflow:**
```
ExitRequest submitted
  ↓
ApprovalWorkflow created (if needed):
  - workflowType: EXIT_APPROVAL
  - resourceType: ExitRequest
  - resourceId: exitRequestId
  - state: PENDING
  ↓
Manager/HR approves
  ↓
ExitRequest.status = APPROVED
  ↓
Final pay calculation initiated (ZoikoPayroll)
```

---

### 7.2 ExitInterview Entity

**Purpose:** Conduct exit interview with departing employee.

**Primary Attributes:**
- `id`: UUID
- `exitRequestId`: FK to ExitRequest
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `conductedBy`: FK to Employee (HR conducting interview)
- `interviewDate`: When interview conducted
- `noticeGiven`: Boolean
- `experience`: Employee's overall experience (1-5)
- `workEnvironment`: Rating (1-5)
- `managementSupport`: Rating (1-5)
- `compAndBenefits`: Rating (1-5)
- `careerGrowth`: Rating (1-5)
- `reasonsForLeaving`: JSON (checkboxes)
- `suggestionsForImprovement`: Text feedback
- `wouldRehire`: YES, NO, MAYBE
- `referralPlan`: Employee willing to refer others?
- `notes`: Interview notes
- `createdAt`, `updatedAt`

**Relationships:**
```
ExitInterview (1) ← → (1) ExitRequest
ExitInterview (M) ← → (1) Conductor (Employee)
```

---

### 7.3 ClearanceTask Entity

**Purpose:** Track offboarding tasks (return equipment, revoke access, final settlement).

**Primary Attributes:**
- `id`: UUID
- `exitRequestId`: FK to ExitRequest
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `taskType`: EQUIPMENT_RETURN, IT_ACCESS_REVOKE, KNOWLEDGE_TRANSFER, FINAL_PAYCHECK, BENEFITS_COBRA, DOCUMENT_COLLECTION, OTHER
- `taskName`: Task description
- `assignedTo`: FK to Employee (who is responsible)
- `dueDate`: When due
- `status`: NOT_STARTED, IN_PROGRESS, COMPLETED, NOT_APPLICABLE
- `completedDate`: When completed
- `completedBy`: FK to Employee
- `notes`: Completion notes

**Relationships:**
```
ClearanceTask (M) ← → (1) ExitRequest
ClearanceTask (M) ← → (1) AssignedTo (Employee)
```

---

### 7.4 KnowledgeTransfer Entity

**Purpose:** Document knowledge transfer from departing employee to replacement.

**Primary Attributes:**
- `id`: UUID
- `exitRequestId`: FK to ExitRequest
- `departingEmployeeId`: FK to Employee
- `replacementEmployeeId`: FK to Employee (or null if not yet hired)
- `tenantId`: Parent tenant
- `topic`: Knowledge domain (e.g., "Client relationships", "System administration")
- `description`: What needs to be transferred
- `isCompleted`: Boolean
- `completedDate`: When transfer completed
- `transferredVia`: DOCUMENT, SESSION, BOTH, OTHER
- `documentUrl`: Reference to knowledge document
- `notes`: Transfer notes

**Relationships:**
```
KnowledgeTransfer (M) ← → (1) ExitRequest
KnowledgeTransfer (M) ← → (1) DepartingEmployee (Employee)
KnowledgeTransfer (M) ← → (1) ReplacementEmployee (Employee)
```

---

### 7.5 FinalSettlementRequest Entity

**Purpose:** Track final pay, benefits, and severance settlement.

**Primary Attributes:**
- `id`: UUID
- `exitRequestId`: FK to ExitRequest
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `lastWorkingDate`: Last day worked
- `finalPayDate`: When final paycheck issued
- `unusedPTODays`: Accrued PTO to be paid
- `unusedPTOAmount`: PTO payout in cents
- `severanceDays`: Severance days (if applicable)
- `severanceAmount`: Severance payout in cents
- `bonusForfeited`: Any forfeited bonus
- `taxesDue`: Estimated taxes
- `netSettlement`: Net amount due to employee
- `status`: CALCULATED, APPROVED, PAID, DISPUTED
- `payoutDate`: When paid out
- `createdAt`, `updatedAt`

**Relationships:**
```
FinalSettlementRequest (1) ← → (1) ExitRequest
FinalSettlementRequest (1) ← → (1) Employee
FinalSettlementRequest (1) ← → (1) PayrollRun (final pay run)
```

---

## Section 8: Asset Domain

### 8.1 Asset Entity

**Purpose:** Company assets (laptops, phones, badges) assigned to employees.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `assetType`: FK to AssetCategory
- `assetTag`: Unique asset tag/serial number
- `name`: Asset name (e.g., "MacBook Pro 16-inch")
- `model`: Model number
- `serialNumber`: Manufacturer serial
- `purchaseDate`: When acquired
- `purchasePrice`: Cost in cents
- `warrantyExpiry`: When warranty expires
- `depreciation`: Current value
- `status`: AVAILABLE, ASSIGNED, IN_REPAIR, RETIRED, LOST
- `location`: Where asset is physically
- `createdAt`, `updatedAt`

**Relationships:**
```
Asset (M) ← → (1) Organization
Asset (M) ← → (1) AssetCategory
Asset (1) ─→ (M) AssetAssignment
Asset (1) ─→ (M) AssetAudit
```

---

### 8.2 AssetCategory Entity

**Purpose:** Classification of asset types (laptops, phones, software licenses, etc.).

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Category name
- `code`: Category code
- `description`: Description

**Relationships:**
```
AssetCategory (M) ← → (1) Organization
AssetCategory (1) ─→ (M) Asset
```

---

### 8.3 AssetAssignment Entity

**Purpose:** Track asset assignment to employee over time.

**Primary Attributes:**
- `id`: UUID
- `assetId`: FK to Asset
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `assignmentDate`: When assigned
- `returnDate`: When returned (nullable)
- `status`: ACTIVE, RETURNED
- `assignedBy`: FK to Employee (who assigned)
- `createdAt`, `updatedAt`

**Relationships:**
```
AssetAssignment (M) ← → (1) Asset
AssetAssignment (M) ← → (1) Employee
```

---

### 8.4 AssetReturn Entity

**Purpose:** Track asset return from employee.

**Primary Attributes:**
- `id`: UUID
- `assetAssignmentId`: FK to AssetAssignment
- `tenantId`: Parent tenant
- `returnDate`: When returned
- `returnedBy`: FK to Employee
- `condition`: GOOD, DAMAGED, LOST, MISSING_COMPONENTS
- `notes`: Condition notes
- `checkedBy`: FK to Employee (who verified return)

**Relationships:**
```
AssetReturn (1) ← → (1) AssetAssignment
```

---

### 8.5 AssetAudit Entity

**Purpose:** Periodic asset audits to track inventory.

**Primary Attributes:**
- `id`: UUID
- `assetId`: FK to Asset
- `tenantId`: Parent tenant
- `auditDate`: When audit performed
- `auditor`: FK to Employee
- `physicallyVerified`: Boolean (was asset physically located)
- `condition`: Current condition
- `location`: Where found
- `notes`: Audit notes

**Relationships:**
```
AssetAudit (M) ← → (1) Asset
```

---

## Section 9: Performance Domain

### 9.1 Goal Entity

**Purpose:** Strategic and personal goals for employees.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `title`: Goal title
- `description`: Goal description
- `type`: STRATEGIC, OPERATIONAL, BEHAVIORAL, DEVELOPMENT
- `status`: ACTIVE, COMPLETED, ABANDONED
- `targetDate`: Goal target completion date
- `weight`: Relative weight (e.g., 25% of overall rating)
- `measurable`: Boolean (is goal measurable)
- `metrics`: JSON (how success is measured)
- `alignedWith`: Higher-level goal (FK to Goal, optional)
- `owner`: FK to Employee (goal owner)
- `createdAt`, `updatedAt`, `completedAt`

**Relationships:**
```
Goal (M) ← → (1) Employee
Goal (M) ← → (1) ParentGoal (self-join)
Goal (1) ─→ (M) ChildGoal (self-join)
```

---

### 9.2 ReviewCycle Entity

**Purpose:** Annual or periodic performance review cycles.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Cycle name (e.g., "2026 Annual Review")
- `year`: Calendar year
- `startDate`: Cycle start date
- `endDate`: Cycle end date
- `status`: DRAFT, OPEN, IN_PROGRESS, CLOSED, PUBLISHED
- `createdAt`, `updatedAt`

**Relationships:**
```
ReviewCycle (M) ← → (1) Organization
ReviewCycle (1) ─→ (M) PerformanceReview
```

---

### 9.3 PerformanceReview Entity

**Purpose:** Employee performance review document.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `reviewCycleId`: FK to ReviewCycle
- `tenantId`: Parent tenant
- `managerId`: FK to Manager (Employee)
- `type`: SELF, MANAGER, PEER, 360, FINAL
- `status`: DRAFT, IN_PROGRESS, SUBMITTED, APPROVED, PUBLISHED, ARCHIVED
- `performanceRating`: EXCELLENT, GOOD, SATISFACTORY, NEEDS_IMPROVEMENT, UNSATISFACTORY
- `overallScore`: 1-5 or percentage
- `strengths`: Text
- `areasForImprovement`: Text
- `keyAccomplishments`: JSON array
- `goalProgress`: JSON (progress on goals)
- `calibrationScore`: Adjusted score from calibration
- `compensation_recommendation`: RAISE, BONUS, PROMOTION, MAINTAIN, NONE
- `dueDate`: When review due
- `submittedDate`: When submitted
- `reviewedAt`: When reviewed
- `calibratedAt`: When calibrated with others
- `createdAt`, `updatedAt`, `deletedAt`

**Relationships:**
```
PerformanceReview (M) ← → (1) Employee
PerformanceReview (M) ← → (1) ReviewCycle
PerformanceReview (M) ← → (1) Manager (Employee)
PerformanceReview (1) ─→ (M) Feedback
```

---

### 9.4 Feedback Entity

**Purpose:** Feedback comments and evidence for performance reviews.

**Primary Attributes:**
- `id`: UUID
- `performanceReviewId`: FK to PerformanceReview
- `tenantId`: Parent tenant
- `giverEmployeeId`: FK to Employee (who gave feedback)
- `category`: GOAL_PERFORMANCE, COMPETENCY, BEHAVIOR, PROJECT
- `content`: Feedback text
- `isAnonymous`: Boolean (anonymous vs attributed)
- `createdAt`

**Relationships:**
```
Feedback (M) ← → (1) PerformanceReview
Feedback (M) ← → (1) GiverEmployee (Employee)
```

---

### 9.5 Rating Entity

**Purpose:** Performance rating scale and definitions.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `scale`: 5-POINT, 4-POINT, 3-POINT, PERCENTAGE
- `ratingName`: Rating label (e.g., "EXCELLENT")
- `ratingValue`: Numeric value (1-5)
- `description`: Description of rating level
- `percentage`: Percentage range (for calibration)

**Relationships:**
```
Rating (M) ← → (1) Organization
```

---

## Section 10: Learning Domain

### 10.1 Course Entity

**Purpose:** Training courses available to employees.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Course name
- `code`: Course code
- `description`: Course description
- `provider`: INTERNAL, EXTERNAL, PARTNER
- `category`: TECHNICAL, LEADERSHIP, SOFT_SKILLS, COMPLIANCE, ONBOARDING
- `level`: BEGINNER, INTERMEDIATE, ADVANCED
- `duration`: Hours
- `deliveryMethod`: IN_PERSON, ONLINE, HYBRID, SELF_PACED
- `maxParticipants`: Max enrollment (if applicable)
- `status`: ACTIVE, ARCHIVED
- `createdAt`, `updatedAt`

**Relationships:**
```
Course (M) ← → (1) Organization
Course (1) ─→ (M) TrainingProgram
```

---

### 10.2 TrainingProgram Entity

**Purpose:** Structured learning programs (multiple courses).

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Program name (e.g., "New Manager Bootcamp")
- `description`: Description
- `duration`: Total duration
- `targetRole`: Target role/level
- `status`: ACTIVE, ARCHIVED
- `createdAt`, `updatedAt`

**Relationships:**
```
TrainingProgram (M) ← → (1) Organization
TrainingProgram (1) ─→ (M) Course
```

---

### 10.3 Certification Entity

**Purpose:** Professional certifications and credentials.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Certification name
- `issuer`: Issuing organization
- `description`: Cert description
- `renewalFrequency`: How often to renew (e.g., yearly)
- `status`: ACTIVE, ARCHIVED

**Relationships:**
```
Certification (M) ← → (1) Organization
```

---

### 10.4 Skill Entity

**Purpose:** Competencies and skills for the organization.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `name`: Skill name (e.g., "Python")
- `category`: TECHNICAL, BUSINESS, LEADERSHIP, INTERPERSONAL
- `level`: BASIC, INTERMEDIATE, ADVANCED, EXPERT
- `description`: Skill description

**Relationships:**
```
Skill (M) ← → (1) Organization
```

---

### 10.5 SkillAssessment Entity

**Purpose:** Track employee skill proficiency.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `skillId`: FK to Skill
- `tenantId`: Parent tenant
- `proficiencyLevel`: 1-5 or BASIC/INTERMEDIATE/ADVANCED/EXPERT
- `assessedBy`: FK to Employee
- `assessmentDate`: When assessed
- `expiryDate`: When skill expires or needs re-assessment
- `verified`: Boolean (is proficiency verified)
- `evidence`: Reference to proof (certification, project, test)

**Relationships:**
```
SkillAssessment (M) ← → (1) Employee
SkillAssessment (M) ← → (1) Skill
```

---

## Section 11: Payroll Profile Domain

### 11.1 PayrollProfile Entity

**Purpose:** Employee payroll-specific data. Primary integration point with ZoikoPayroll.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `employeePayrollId`: Unique payroll system ID
- `paymentFrequency`: WEEKLY, BI_WEEKLY, SEMI_MONTHLY, MONTHLY
- `paymentMethod`: DIRECT_DEPOSIT, CHECK, CARD
- `salaryAmount`: Annual salary in cents
- `salaryEffectiveDate`: When salary is effective
- `payrollStatus`: ACTIVE, INACTIVE, ON_LEAVE, SUSPENDED
- `exemptionStatus`: EXEMPT, NON_EXEMPT
- `workersCompClass`: Workers comp classification
- `baseHours`: Scheduled weekly hours
- `isRemote`: Is fully remote (affects tax jurisdiction)
- `primaryWorkState`: For tax purposes
- `yearlySalary`: Computed annual
- `createdAt`, `updatedAt`

**Relationships:**
```
PayrollProfile (1) ← → (1) Employee
PayrollProfile (1) ─→ (1) SalaryStructure
PayrollProfile (1) ─→ (M) BankAccount
PayrollProfile (1) ─→ (1) TaxProfile
PayrollProfile (1) ─→ (1) BenefitProfile
```

**How ZoikoPayroll Consumes:**
1. Pulls PayrollProfile for each active employee
2. Uses paymentFrequency to determine pay cycle
3. References SalaryStructure for component breakdown
4. Fetches BankAccount for direct deposit routing
5. Applies TaxProfile calculations
6. References BenefitProfile deductions
7. Writes PayrollRun entries with gross/net amounts

---

### 11.2 SalaryStructure Entity

**Purpose:** Breakdown of employee compensation (base, allowances, deductions).

**Primary Attributes:**
- `id`: UUID
- `payrollProfileId`: FK to PayrollProfile
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `salaryGrade`: Salary grade reference
- `baseSalary`: Base salary component
- `houseRentAllowance`: HRA (if applicable)
- `conveyanceAllowance`: Travel allowance
- `medicalAllowance`: Medical allowance
- `otherAllowances`: JSON (other components)
- `grossSalary`: Total compensation
- `effectiveDate`: When structure takes effect
- `expiresAt`: When expires
- `version`: Version number (for history)
- `createdAt`, `updatedAt`

**Relationships:**
```
SalaryStructure (M) ← → (1) PayrollProfile
```

**Versioning:**
- New SalaryStructure version created on any component change
- Historical versions kept for audit and backdated payroll calculations

---

### 11.3 BankAccount Entity

**Purpose:** Employee bank account for direct deposit.

**Primary Attributes:**
- `id`: UUID
- `payrollProfileId`: FK to PayrollProfile
- `tenantId`: Parent tenant
- `bankName`: Bank name
- `accountHolderName`: Account holder
- `accountType`: CHECKING, SAVINGS
- `accountNumber`: Account number (encrypted)
- `routingNumber`: US routing number (encrypted)
- `iban`: IBAN (international)
- `swiftCode`: SWIFT code
- `isPrimary`: Is this the primary account
- `isActive`: Is account active
- `verificationStatus`: UNVERIFIED, VERIFIED, FAILED
- `createdAt`, `updatedAt`, `deletedAt`

**Relationships:**
```
BankAccount (M) ← → (1) PayrollProfile
```

**Constraints:**
- At least one active account for payroll processing
- Encrypted storage for PCI compliance
- Account changes require verification

---

### 11.4 TaxProfile Entity

**Purpose:** Tax withholding and compliance information.

**Primary Attributes:**
- `id`: UUID
- `payrollProfileId`: FK to PayrollProfile
- `tenantId`: Parent tenant
- `ssn`: Social Security Number (encrypted, US)
- `taxFilingStatus`: SINGLE, MARRIED, HEAD_OF_HOUSEHOLD
- `federalW4Version`: W-4 form year
- `federalExemptions`: Number of exemptions
- `federalWithholding`: Additional federal withholding
- `stateCode`: State of residence
- `stateW4Version`: State W-4 year
- `stateExemptions`: State exemptions
- `stateWithholding`: Additional state withholding
- `localTaxJurisdiction`: Local tax area (if applicable)
- `localWithholding`: Local tax withholding
- `w4DocumentUrl`: Reference to W-4 document
- `lastW4Date`: When W-4 last filed
- `createdAt`, `updatedAt`

**Relationships:**
```
TaxProfile (1) ← → (1) PayrollProfile
```

---

### 11.5 BenefitProfile Entity

**Purpose:** Employee benefit elections and deductions.

**Primary Attributes:**
- `id`: UUID
- `payrollProfileId`: FK to PayrollProfile
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `healthInsuranceEnrolled`: Boolean
- `healthPlanId`: Selected health plan
- `healthContribution`: Employee monthly contribution
- `dentalEnrolled`: Boolean
- `dentalPlanId`: Dental plan reference
- `visionEnrolled`: Boolean
- `visionPlanId`: Vision plan reference
- `fsa401kEnrolled`: Boolean
- `fsa401kAmount`: Monthly amount
- `hsa401kEnrolled`: Boolean
- `hsa401kAmount`: Monthly amount
- `lifestyleEnrolled`: Boolean (gym, etc.)
- `dependents`: Number of dependents for insurance
- `beneficiaries`: JSON (beneficiary names for life insurance)
- `lastEnrollmentDate`: When benefits last enrolled
- `enrollmentPlanYear`: Coverage plan year
- `createdAt`, `updatedAt`

**Relationships:**
```
BenefitProfile (1) ← → (1) PayrollProfile
```

---

## Section 12: Employee Self-Service Domain

### 12.1 EmployeePreference Entity

**Purpose:** Employee personal preferences for notifications, communication, etc.

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `emailNotifications`: Boolean
- `smsNotifications`: Boolean
- `quietHoursStart`, `quietHoursEnd`: Time window
- `languagePreference`: EN, ES, FR, DE, etc.
- `timezone`: Employee's preferred timezone
- `preferredContactMethod`: EMAIL, PHONE, SMS
- `documentDelivery`: ELECTRONIC, PRINTED
- `createdAt`, `updatedAt`

**Relationships:**
```
EmployeePreference (1) ← → (1) Employee
```

---

### 12.2 EmployeeRequest Entity

**Purpose:** Track various employee self-service requests (address change, name change, etc.).

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `requestType`: ADDRESS_CHANGE, NAME_CHANGE, PHONE_CHANGE, BENEFICIARY_UPDATE, DIRECT_DEPOSIT_CHANGE, TAX_FORM_UPDATE, BENEFITS_CHANGE, OTHER
- `requestData`: JSON (data being requested)
- `status`: SUBMITTED, IN_REVIEW, APPROVED, REJECTED, COMPLETED
- `submittedDate`: When submitted
- `approvedBy`: FK to Employee (who approved)
- `approvedDate`: When approved
- `rejectionReason`: If rejected
- `createdAt`, `updatedAt`

**Relationships:**
```
EmployeeRequest (M) ← → (1) Employee
```

---

### 12.3 EmployeeNotification Entity

**Purpose:** Notifications sent to employees (leave approved, review ready, etc.).

**Primary Attributes:**
- `id`: UUID
- `employeeId`: FK to Employee
- `tenantId`: Parent tenant
- `type`: LEAVE_APPROVED, LEAVE_REJECTED, REVIEW_READY, GOAL_FEEDBACK, ANNOUNCEMENT, OTHER
- `title`: Notification title
- `body`: Notification body
- `actionUrl`: Link to action in system
- `isRead`: Boolean
- `readAt`: When read
- `createdAt`

**Relationships:**
```
EmployeeNotification (M) ← → (1) Employee
```

---

## Section 13: Workforce Analytics Domain

### 13.1 Workforce Analytics Model

**Purpose:** Pre-computed metrics and analytics for dashboards and reports.

Analytics entities are computed nightly and stored for fast retrieval:

---

### 13.2 HeadcountMetric Entity

**Purpose:** Track headcount over time.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `reportDate`: Date of metric
- `totalHeadcount`: Total employees
- `activeEmployees`: Non-terminated
- `fullTimeCount`: FTE count
- `partTimeCount`: PT count
- `contractorCount`: Contractor count
- `onLeaveCount`: On leave
- `newHires`: New hires this period
- `terminations`: Terminations this period
- `transfersIn`, `transfersOut`: Internal movements
- `femaleCount`: Gender demographics
- `maleCount`: Gender demographics
- `nonBinaryCount`: Gender demographics
- `diversityIndexes`: JSON (diversity metrics)

**Relationships:**
```
HeadcountMetric (M) ← → (1) Organization
```

---

### 13.3 AttritionMetric Entity

**Purpose:** Calculate turnover and attrition rates.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `reportDate`: Report date
- `period`: MONTHLY, QUARTERLY, ANNUALLY
- `voluntaryTerminations`: Employee resignations
- `involuntaryTerminations`: Terminations for cause
- `retirements`: Retirements
- `attritionRate`: % terminations / avg headcount
- `voluntaryAttritionRate`: Voluntary %
- `topDepartmentAttrition`: Department with highest attrition
- `attritionByTenure`: JSON (attrition by years of service)
- `attritionByRole`: JSON (attrition by designation)

**Relationships:**
```
AttritionMetric (M) ← → (1) Organization
```

---

### 13.4 HiringMetric Entity

**Purpose:** Recruitment pipeline and hiring analytics.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `reportDate`: Report date
- `openRequisitions`: Number of open job openings
- `totalApplications`: Applications received
- `qualifiedApplicants`: Passed screening
- `interviewsScheduled`: Interview count
- `offersExtended`: Offers made
- `offersAccepted`: Offers accepted
- `offersRejected`: Offers rejected
- `hireCount`: Hired this period
- `timeToHire`: Average days from application to hire
- `conversionRate`: % of applications → hired
- `costPerHire`: Average recruitment cost

**Relationships:**
```
HiringMetric (M) ← → (1) Organization
```

---

### 13.5 LeaveMetric Entity

**Purpose:** Leave usage analytics.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `reportDate`: Report date
- `totalLeaveRequests`: Leave requests submitted
- `approvedRequests`: Approved
- `deniedRequests`: Denied
- `totalLeaveDaysTaken`: Days taken
- `averageDaysPerEmployee`: Avg consumption
- `leaveByType`: JSON (breakdown by type)
- `unusedLeaveDays`: Accrued but unused
- `leaveCarryover`: Days carried to next year

**Relationships:**
```
LeaveMetric (M) ← → (1) Organization
```

---

### 13.6 PerformanceMetric Entity

**Purpose:** Performance review analytics.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `reportDate`: Report date
- `reviewsCycle`: Review cycle year
- `completedReviews`: Completed reviews
- `pendingReviews`: Pending completion
- `ratingDistribution`: JSON (breakdown by rating)
- `averageRating`: Overall average
- `topPerformers`: Count of "Excellent" rated
- `needsImprovement`: Count of lower ratings
- `calibrationDone`: Was calibration completed

**Relationships:**
```
PerformanceMetric (M) ← → (1) Organization
```

---

### 13.7 TrainingMetric Entity

**Purpose:** Learning and development analytics.

**Primary Attributes:**
- `id`: UUID
- `organizationId`: FK to Organization
- `tenantId`: Parent tenant
- `reportDate`: Report date
- `employeesInTraining`: Active course enrollments
- `coursesCompleted`: Courses finished
- `certificationsEarned`: Certifications
- `averageTrainingHours`: Hours per employee
- `trainingBudgetUtilization`: % of budget spent

**Relationships:**
```
TrainingMetric (M) ← → (1) Organization
```

---

## Section 14: Integration Contracts

### 14.1 ZoikoTime Integration Contract

**Data Consumed from ZoikoHR:**
- Employee (ID, name, status)
- EmploymentRecord (employment type, working hours, WFH eligibility)
- PayrollProfile (payment frequency)
- Department
- Location
- Manager/Reporting structure

**Data Provided to ZoikoHR:**
- Timesheet submissions (hours worked)
- Attendance records (present/absent/late)
- OT calculations
- Approval status

**Integration Points:**
- TimesheetApprovalWorkflow created for timesheet reviews
- AuditLog entries for time modifications
- LeaveRequest integration (leaves factored into attendance)

---

### 14.2 ZoikoPayroll Integration Contract

**Data Consumed from ZoikoHR:**
- Employee (ID, name, hire date, status)
- EmploymentRecord (salary, employment type, working hours)
- PayrollProfile (complete profile)
- SalaryStructure (compensation components)
- BankAccount (direct deposit)
- TaxProfile (tax withholding)
- BenefitProfile (deductions)
- LeaveBalance (leave used affects pay)
- Department / CostCenter (allocations)

**Data Provided to ZoikoHR:**
- PayrollRun status (created, processing, completed, failed)
- PayoutDetails (gross, net, deductions)
- YearlyTaxSummary (W-2 data)
- CompensationHistory (for records)

**Integration Points:**
- ApprovalWorkflow for payroll run approvals
- AuditLog for payroll modifications
- Document storage for tax forms, payslips

---

### 14.3 ZoikoComply Integration Contract

**Data Consumed from ZoikoHR:**
- Employee (demographics, status, employment dates)
- EmploymentRecord (role, location, tenure)
- ComplianceReport (linked)
- AuditLog (for compliance evidence)
- GovernancePolicy (policies affecting HR)

**Data Provided to ZoikoHR:**
- ComplianceAlert (policy violations)
- AuditFinding (compliance issues)
- RemediationTask

**Integration Points:**
- Document storage for compliance evidence
- AuditLog for compliance events
- GovernancePolicy enforcement

---

### 14.4 ZoikoInsights Integration Contract

**Data Consumed from ZoikoHR:**
- HeadcountMetric, AttritionMetric, HiringMetric, PerformanceMetric, TrainingMetric
- Employee (anonymized)
- EmploymentRecord (anonymized)
- PerformanceReview (anonymized)
- LeaveMetric

**Provides:**
- Dashboard charts and trends
- Predictive analytics (attrition risk, performance)
- Cohort analysis
- Benchmarking reports

---

### 14.5 ZoikoPay Integration Contract

**Data Consumed from ZoikoHR:**
- Employee (name, email)
- PayrollProfile (for compensation context)
- BankAccount (for payment routing info, not actual account numbers)

**Provides:**
- Payment authorization requests
- Settlement confirmations

---

### 14.6 ZoikoCoreX Integration Contract

**Data Consumed from ZoikoHR:**
- Employee (ID, name, for workflow context)
- Department
- ApprovalWorkflow (for workflow automation)

**Provides:**
- Workflow execution results
- Automation logs
- Integration status

---

## Section 15: Relationship Diagram

### 15.1 Hierarchical Entity Relationships

```
┌─────────────────────────────────────────────────────────────────────┐
│ TENANT (Legal Entity)                                               │
│ - id, name, slug, status                                            │
└─────────────────────────────────────────────────────────────────────┘
                           │
                           │ (1:M)
                           ▼
┌─────────────────────────────────────────────────────────────────────┐
│ ORGANIZATION (Business Entity)                                      │
│ - id, name, shortName, type, status, ein                            │
│ - Relationships: Division, Department, Location, CostCenter         │
└─────────────────────────────────────────────────────────────────────┘
                           │
            ┌──────────────┼──────────────┐
            │              │              │
          (1:M)          (1:M)          (1:M)
            │              │              │
            ▼              ▼              ▼
       ┌────────────┐  ┌────────────┐  ┌────────────┐
       │ DIVISION   │  │LOCATION    │  │COSTCENTER  │
       │ id, name   │  │ id, name   │  │ id, name   │
       └────────────┘  └────────────┘  └────────────┘
            │
          (1:M)
            │
            ▼
       ┌────────────────┐
       │ BUSINESSUNIT   │
       │ id, name       │
       └────────────────┘
            │
          (1:M)
            │
            ▼
       ┌────────────────┐
       │ DEPARTMENT     │
       │ id, name       │
       │ parentDeptId   │
       └────────────────┘
            │
          (1:M)
            │
            ▼
┌─────────────────────────────────────────────────────────────────────┐
│ EMPLOYEE (Core Person Record)                                       │
│ - id, tenantId, email, firstName, lastName                          │
│ - joinDate, status, employmentType                                  │
│ - Relations: EmployeeProfile, EmploymentRecord, EmployeeAddress,   │
│              EmergencyContact, EmployeeIdentity, PayrollProfile     │
└─────────────────────────────────────────────────────────────────────┘
                           │
        ┌──────────────────┼──────────────────┬─────────────┐
        │                  │                  │             │
      (1:1)              (1:M)              (1:M)         (1:M)
        │                  │                  │             │
        ▼                  ▼                  ▼             ▼
   ┌──────────┐    ┌────────────────┐ ┌──────────────┐ ┌──────────────┐
   │EMPLOYMENT│    │EMPLOYMENT      │ │EMERGENCY    │ │EMPLOYEE      │
   │RECORD    │    │RECORDHISTORY   │ │CONTACT      │ │ADDRESS       │
   │(versioned│    │(snapshots)     │ │             │ │              │
   └──────────┘    └────────────────┘ └──────────────┘ └──────────────┘
        │
        │ (1:1 current)
        │
    ┌───┴────────────────────────┐
    │ Current Version Attributes: │
    │ - jobTitle, jobLevel        │
    │ - reportingTo (Manager)     │
    │ - salaryAmount              │
    └────────────────────────────┘

                    │ (M:M via ReportingRelationship)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ REPORTING HIERARCHY                                                  │
│ ReportingRelationship: PRIMARY, DOTTED, FUNCTIONAL, MENTOR          │
│ ManagerRelationship: Inverse view (who manages whom)                │
└─────────────────────────────────────────────────────────────────────┘

                    │ (1:1)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PAYROLL PROFILE (Payroll Integration Point)                         │
│ - id, employeeId, payrollStatus                                     │
│ - Relations: SalaryStructure, BankAccount, TaxProfile, BenefitProfile│
└─────────────────────────────────────────────────────────────────────┘
            │             │              │               │
          (1:1)         (1:M)           (1:1)           (1:1)
            │             │              │               │
            ▼             ▼              ▼               ▼
       ┌─────────┐  ┌──────────┐  ┌───────────┐  ┌────────────┐
       │SALARY   │  │BANK      │  │TAX        │  │BENEFIT     │
       │STRUCTURE│  │ACCOUNT   │  │PROFILE    │  │PROFILE     │
       │(versioned)└──────────┘  └───────────┘  └────────────┘

                    │ (1:M)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ LEAVE MANAGEMENT                                                     │
│ LeaveType → LeavePolicy → LeaveBalance → LeaveRequest → LeaveApproval│
│                                             │                        │
│                                           (1:1)                      │
│                                             │                        │
│                                             ▼                        │
│                                    ApprovalWorkflow                  │
└─────────────────────────────────────────────────────────────────────┘

                    │ (1:M)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ RECRUITMENT PIPELINE                                                 │
│ JobOpening → Candidate → Application → Interview → Offer → Employee │
└─────────────────────────────────────────────────────────────────────┘

                    │ (1:1 on hire)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ ONBOARDING / OFFBOARDING                                             │
│ OnboardingPlan → OnboardingChecklist → OnboardingTask               │
│ ExitRequest → ExitInterview → ClearanceTask → FinalSettlement       │
└─────────────────────────────────────────────────────────────────────┘

                    │ (1:M)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ PERFORMANCE & LEARNING                                               │
│ Goal ← → ReviewCycle → PerformanceReview → Feedback & Rating        │
│ Course → TrainingProgram → Certification → SkillAssessment          │
└─────────────────────────────────────────────────────────────────────┘

                    │ (1:M)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ ASSET MANAGEMENT                                                     │
│ Asset → AssetCategory                                                │
│ Asset → AssetAssignment → Employee                                   │
│ Asset → AssetAudit                                                    │
└─────────────────────────────────────────────────────────────────────┘

                    │ (Audit & Analytics)
                    │
                    ▼
┌─────────────────────────────────────────────────────────────────────┐
│ AUDIT & ANALYTICS                                                    │
│ AuditLog (shared platform entity)                                   │
│ Metrics: Headcount, Attrition, Hiring, Leave, Performance, Training │
└─────────────────────────────────────────────────────────────────────┘
```

---

## Section 16: Indexing Strategy

### 16.1 Primary Indexes

**Employee Entity:**
```
- PRIMARY: id (UUID)
- UNIQUE: (tenantId, email)
- UNIQUE: (organizationId, employeeId)
- INDEX: tenantId (multi-tenant scoping)
- INDEX: status (filter for active)
- INDEX: organizationId
- INDEX: joinDate (hire date range queries)
```

**EmploymentRecord Entity:**
```
- PRIMARY: id
- COMPOSITE INDEX: (employeeId, effectiveDate DESC, expiresAt)
  - Supports: "Get current employment record for employee"
  - Supports: "Get employment record on specific date"
- INDEX: tenantId
- INDEX: departmentId
- INDEX: reportingTo (managers and direct reports)
```

**Department Entity:**
```
- PRIMARY: id
- COMPOSITE INDEX: (organizationId, parentDeptId)
  - Supports: Org chart traversal, subtree queries
- INDEX: tenantId
- INDEX: departmentHead
```

**LeaveRequest Entity:**
```
- PRIMARY: id
- COMPOSITE INDEX: (employeeId, startDate, endDate)
  - Supports: "Get overlapping leave requests"
- INDEX: tenantId
- INDEX: status (filter by pending/approved)
- INDEX: approvedAt (date range queries for reports)
```

**PerformanceReview Entity:**
```
- PRIMARY: id
- COMPOSITE INDEX: (employeeId, reviewCycleId)
  - Supports: "Get employee's review for cycle"
- INDEX: tenantId
- INDEX: managerId (all reviews by manager)
- INDEX: status (pending reviews)
```

---

### 16.2 Composite Indexes (Performance Critical)

**Org Chart Query:**
```
CREATE INDEX idx_reporting_hierarchy 
ON ReportingRelationship(employeeId, type, effectiveDate DESC)
-- Query: "Get current managers of employee X"
-- Query: "Get all direct reports of employee X"
```

**Leave Balance Query:**
```
CREATE INDEX idx_leave_balance 
ON LeaveBalance(employeeId, leaveTypeId, year)
-- Query: "Get PTO balance for employee for current year"
```

**Employment History Query:**
```
CREATE INDEX idx_employment_timeline 
ON EmploymentRecord(employeeId, effectiveDate DESC)
-- Query: "Get employment history (all versions)"
```

**Department Hierarchy:**
```
CREATE INDEX idx_dept_hierarchy 
ON Department(organizationId, parentDeptId, status)
-- Query: "Get all subdepartments in org"
```

**Payroll Processing:**
```
CREATE INDEX idx_payroll_ready 
ON PayrollProfile(tenantId, payrollStatus, salaryEffectiveDate)
-- Query: "Get all employees ready for payroll run"
```

---

### 16.3 Search Indexes

**Full-Text Search on Employees:**
```
CREATE INDEX idx_employee_search 
ON Employee(tenantId, firstName, lastName, email)
-- Supports: Employee directory search
```

**Performance Review Search:**
```
CREATE INDEX idx_performance_text_search 
ON PerformanceReview(tenantId, employeeId, performanceRating)
-- Supports: Filter reviews by rating
```

---

### 16.4 Audit & Analytics Indexes

**Audit Trail Query:**
```
CREATE INDEX idx_audit_employee_trail 
ON AuditLog(tenantId, resourceType, resourceId, createdAt DESC)
-- Query: "Get all audit events for specific employee"
```

**Analytics Queries:**
```
CREATE INDEX idx_headcount_reporting 
ON HeadcountMetric(organizationId, reportDate DESC)
-- Query: "Get historical headcount trends"
```

---

## Section 17: Scalability Strategy

### 17.1 Supporting 100 Organizations (Startup Phase)

**Characteristics:**
- Total employees: ~10,000-50,000
- Database size: ~50-100 GB
- Peak transactions: Low
- Reporting: Ad-hoc

**Architecture:**
- Single PostgreSQL instance (RDS, 4 vCPU, 32 GB RAM)
- All data in primary hot storage
- Index strategy per Section 16
- Caching layer (Redis) for frequently accessed entities (organizations, departments)
- Nightly analytics batch job

**Performance Targets:**
- Employee search: <100ms
- Org chart generation: <500ms
- Payroll processing: <1 hour
- Report generation: <5 minutes

---

### 17.2 Supporting 1,000 Organizations (Growth Phase)

**Characteristics:**
- Total employees: ~500,000-1,000,000
- Database size: ~500 GB - 1 TB
- Peak transactions: Medium
- Reporting: Frequent (hourly dashboards)

**Architecture:**
- PostgreSQL with read replicas (1 primary, 2-3 read replicas)
- Automatic failover via RDS multi-AZ
- Write operations go to primary only
- Read operations distributed to replicas
- Partitioning by `tenantId` for large tables (Analytics)
- Connection pooling via PgBouncer
- Query result caching (Redis) for slow queries
- Nightly ETL to separate analytics database
- Search index on dedicated Elasticsearch cluster

**Performance Targets:**
- Employee search: <100ms
- Org chart: <1s (with caching)
- Payroll run: <2 hours (parallel processing)
- Dashboard queries: <5s

---

### 17.3 Supporting 10,000 Organizations (Enterprise Scale)

**Characteristics:**
- Total employees: ~5,000,000-10,000,000
- Database size: ~5-10 TB
- Peak transactions: High
- Reporting: Real-time analytics

**Architecture:**

1. **Write Database:**
   - PostgreSQL primary with 3-way multi-AZ replication
   - 16+ vCPU, 256 GB RAM minimum
   - Dedicated connection for writes

2. **Read Replicas:**
   - 5-10 dedicated read replicas across regions
   - Auto-scaling read pool based on connection count
   - Regional replicas for low-latency access

3. **Analytics Database:**
   - Separate Redshift cluster or cloud data warehouse (BigQuery, Snowflake)
   - Daily ETL from primary database
   - Optimized for OLAP queries
   - Historical data retention

4. **Caching Layer:**
   - Redis cluster with sharding
   - Cache: Org charts, departments, designations, leave policies
   - 5-minute TTL for most cached data

5. **Search Infrastructure:**
   - Elasticsearch cluster (3+ nodes)
   - Indexes: Employees, applications, candidates
   - Replicated across regions

6. **Partitioning Strategy:**
   ```
   Table partitioning by tenantId:
   - EmploymentRecord: Partition by tenantId (allows parallel scans)
   - AuditLog: Partition by (tenantId, createdAt) (quarterly rolls)
   - LeaveRequest: Partition by (tenantId, year)
   ```

7. **Sharding (Optional at 10K+ orgs):**
   - Shard key: `tenantId`
   - Sticky routing: All requests for tenant go to same shard
   - Benefits: Reduced lock contention, improved cache locality

8. **Asynchronous Processing:**
   - Background job queue (Celery, RabbitMQ)
   - Payroll processing: Async with progress tracking
   - Analytics computation: Scheduled jobs
   - Report generation: Async, emailed to user

9. **Monitoring & Alerting:**
   - Query performance tracking (pg_stat_statements)
   - Slow query log (>1s queries)
   - Connection pool monitoring
   - Replication lag alerts
   - Disk space alerts

**Performance Targets:**
- Employee search: <50ms (cached)
- Org chart: <500ms (with Redis)
- Payroll run: <30 minutes (parallel distributed processing)
- Dashboard: <2s (Redshift query)
- Report generation: <10 minutes (async)

---

## Section 18: Database Readiness Review

### 18.1 Missing Models (Recommendations)

**Gaps Requiring Future Models:**

1. **Compensation Management** (beyond PayrollProfile)
   - **Model:** CompensationHistory
   - **Purpose:** Track all compensation changes (salary, bonus, equity vesting)
   - **Consumer:** ZoikoPayroll, compensation planning

2. **Benefits Management** (beyond BenefitProfile)
   - **Models:** BenefitPlan, BenefitEnrollment, BenefitClaim, DependentRelationship
   - **Purpose:** Detailed benefit tracking, open enrollment workflows, claims processing
   - **Consumer:** Third-party benefit processors

3. **Disciplinary Records**
   - **Model:** DisciplinaryAction, DisciplinaryHistory
   - **Purpose:** Track warnings, performance improvement plans, terminations for cause
   - **Audit:** Highly audited, especially for legal defensibility

4. **Succession Planning**
   - **Model:** SuccessionPlan, SuccessionCandidate, SuccessionRisk
   - **Purpose:** Identify flight risks, plan for key person departures
   - **Consumer:** Talent strategy, leadership development

5. **Compensation Bands & Equity**
   - **Models:** EquityGrant, VestingSchedule
   - **Purpose:** Stock options, RSUs, vesting tracking
   - **Consumer:** ZoikoPayroll (for equity component), finance reporting

6. **Employee Wellness**
   - **Model:** WellnessProgram, WellnessParticipation, HealthMetric
   - **Purpose:** Wellness program tracking, health initiatives
   - **Consumer:** HR analytics, benefits coordination

7. **Internal Mobility & Career Path**
   - **Model:** InternalTransfer, CareerPath, SuccessorRecommendation
   - **Purpose:** Track promotions, transfers, career progression
   - **Audit:** Part of EEOC compliance (career development tracking)

8. **Union & Labor Relations** (if applicable)
   - **Models:** UnionMembership, UnionCertification, CollectiveBargainingAgreement
   - **Purpose:** Union contract compliance, labor tracking
   - **Audit:** Highly regulated

9. **Remote Work & Ergonomics**
   - **Models:** RemoteWorkAgreement, HomeOfficeSetup, EquipmentAllocation
   - **Purpose:** Remote work compliance, equipment tracking
   - **Audit:** Health & safety compliance

10. **Employee Engagement & Surveys**
    - **Models:** EmployeeEngagementSurvey, SurveyResponse, Sentiment
    - **Purpose:** Track engagement scores, cultural health
    - **Consumer:** HR analytics, leadership insights

---

### 18.2 Identified Risks

**Risk 1: Performance at 10K+ organizations**
- **Issue:** Single PayrollRun table with millions of employee-run combinations
- **Mitigation:** Partition PayrollRun by (tenantId, processedAt), archive old runs to archive DB
- **Owner:** Database architect

**Risk 2: Circular reporting relationships**
- **Issue:** Accidental creation of A→B→C→A cycles causing recursion errors
- **Mitigation:** Graph cycle detection on every ReportingRelationship insert, unit tests
- **Owner:** Application layer validation

**Risk 3: Leave balance inconsistency**
- **Issue:** LeaveRequest marked approved but LeaveBalance not updated, causing negative balance
- **Mitigation:** Database trigger to update LeaveBalance on LeaveRequest.status change, transaction guarantees
- **Owner:** Database & application consistency

**Risk 4: Tax and compliance data freshness**
- **Issue:** Stale W-4 data leading to incorrect withholding
- **Mitigation:** TaxProfile expiry alerts (annual), validation before payroll processing
- **Owner:** Payroll system, compliance

**Risk 5: PII exposure in logs**
- **Issue:** SSN, bank account numbers logged in audit trails or error messages
- **Mitigation:** Encryption at rest for sensitive fields, masking in logs, access control on audit logs
- **Owner:** Security, DevOps

**Risk 6: Multi-organization reporting complexity**
- **Issue:** Cross-organization transfers not properly handled in org chart queries
- **Mitigation:** Document transfer workflow, test cross-org scenarios, clear data model ownership
- **Owner:** Product, Database

---

### 18.3 Recommendations

**Immediate (Pre-Release):**
1. ✓ Complete all models in Sections 2-13
2. ✓ Implement full audit trail per Section 1.3
3. ✓ Design and test indexing strategy (Section 16)
4. ✓ Implement referential integrity constraints
5. ✓ Create comprehensive unit tests for complex queries

**Short-term (3 months):**
1. Implement partitioning strategy for large tables (EmploymentRecord, LeaveRequest, AuditLog)
2. Set up read replicas and test failover
3. Implement caching layer for performance-critical entities
4. Create analytics database/warehouse
5. Build comprehensive audit reporting

**Medium-term (6-12 months):**
1. Implement missing models (Section 18.1)
2. Add multi-region deployment for geographic resilience
3. Implement advanced analytics and reporting
4. Create BI dashboards for HR leaders
5. Implement automated compliance reporting

**Long-term (12+ months):**
1. Evaluate sharding for 10K+ organization scale
2. Implement machine learning for attrition prediction, succession planning
3. Advanced compensation analytics and pay equity analysis
4. Global payroll processing with regional compliance
5. Integrated workforce planning and forecasting

---

### 18.4 Future Expansion Strategy

**Phase 1: Core HR (Current)**
- Employee lifecycle (hire, manage, terminate)
- Organization hierarchy
- Leave management
- Basic performance reviews
- Payroll integration foundation

**Phase 2: Talent & Engagement (6-12 months)**
- Advanced recruitment (pipeline, ATS features)
- Employee engagement surveys
- Career pathing and succession planning
- Learning management system (full LMS)
- Compensation management

**Phase 3: Compliance & Analytics (12-24 months)**
- Advanced compliance reporting (EEOC, OFCCP, etc.)
- Pay equity analysis
- Predictive analytics (attrition, flight risk)
- Workforce planning and forecasting
- Internal mobility tracking

**Phase 4: Enterprise Integrations (24+ months)**
- Background check integration
- Benefits provider integrations (health, retirement, etc.)
- Background check services
- Time & attendance integration (with ZoikoTime)
- SSO/SCIM integrations
- Global payroll (ZoikoPayroll multi-country)

**Phase 5: AI/ML Capabilities (Ongoing)**
- Resume parsing for recruitment
- Predictive analytics for performance, attrition
- Natural language processing for feedback analysis
- Chatbot for HR Q&A
- Automated policy recommendations based on compliance data

---

## Conclusion

The ZoikoHR database architecture is designed as the **Master People System** for the Zoiko ecosystem, providing comprehensive workforce management while maintaining enterprise-grade security, compliance, and scalability. By reusing platform entities (Tenant, Organization, User, etc.) and creating specialized HR domain entities, ZoikoHR serves as the authoritative source for all people data consumed by ZoikoTime, ZoikoPayroll, ZoikoComply, ZoikoInsights, ZoikoPay, and ZoikoCoreX.

**Key Success Factors:**
- Rigorous data validation at the application layer
- Comprehensive audit trail for compliance and forensics
- Flexible scalability from 100 to 10,000+ organizations
- Clean integration contracts with downstream systems
- Privacy-by-design with encryption, access control, and retention policies

**Ready for Implementation:** The architecture specification is complete and implementation can proceed with Prisma schema design based on this document.

---

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Next Review:** Q4 2026 (Post-MVP Release)
