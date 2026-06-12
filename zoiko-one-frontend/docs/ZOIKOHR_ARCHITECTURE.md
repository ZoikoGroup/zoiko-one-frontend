# ZoikoHR Architecture

## Executive Summary

ZoikoHR is a first-class HR product built as a native vertical inside the Zoiko One enterprise platform. It extends Zoiko One’s proven tenant, organization, user, RBAC, approval workflow, governance, and audit framework to deliver a complete employee experience from hire to retire.

ZoikoHR is designed to compete with enterprise HR suites like Darwinbox, Rippling, BambooHR, Workday, and Keka by combining deep workforce lifecycle management with strong governance, audit, and cross-product integration.

## Product Vision

ZoikoHR empowers HR, people operations, and business leaders with a single platform for workforce management, employee lifecycle services, compliance, and insights. It is built to:

- Reuse Zoiko One foundational models and security architecture
- Provide a unified employee lifecycle experience across workforce, onboarding, leave, performance, learning, payroll profile, and offboarding
- Enable employee self-service and manager self-service in a governed way
- Deliver enterprise-grade analytics, org chart, and manager hierarchy visibility
- Support integrated workflows across payroll, attendance, governance, and audit

## Strategic Goals

1. **Native Integration**: Leverage Zoiko One’s shared multi-tenant and RBAC infrastructure without duplicating identity or tenant boundaries.
2. **Lifecycle Coverage**: Support hiring, onboarding, workforce management, development, and offboarding end to end.
3. **Governance & Compliance**: Make every HR action auditable and governed by policy, approval matrices, and workflow state.
4. **Employee Empowerment**: Provide self-service for profile updates, leave requests, document access, and learning.
5. **Analytics-led HR**: Deliver workforce analytics, attrition signals, absence trends, and operational dashboards that drive decisions.
6. **Cross-Product Synergy**: Integrate with payroll, attendance, time, compliance, and payments across Zoiko One.

## Competitive Comparison

ZoikoHR is positioned as an enterprise alternative to leading HR systems:

- **Darwinbox**: Strong end-to-end lifecycle, approvals, and configurable flows. ZoikoHR matches this by reusing Zoiko One’s approval engine and adding onboarding/offboarding and self-service.
- **Rippling**: Unified HR, IT, payroll, and employee experience. ZoikoHR emphasizes integrated product workflows and shared governance across products.
- **BambooHR**: People data and employee self-service. ZoikoHR extends this to enterprise-grade role-based governance, audit, and cross-product integration.
- **Workday**: Enterprise-scale HCM with deep analytics and global compliance. ZoikoHR aligns with this through workforce analytics, org chart architecture, manager hierarchy, and approval matrix design.
- **Keka**: Attendance-driven payroll and Indian payroll compliance. ZoikoHR will close attendance and payroll profile gaps with explicit attendance integration models and global payroll eligibility.

## Architecture Principles

- **Reuse first**: Build on existing Zoiko One models for Tenant, Organization, User, Role, Permission, ApprovalWorkflow, GovernancePolicy, and AuditLog.
- **Page → Service → Repository → Prisma → PostgreSQL**: Enforce this pattern for all ZoikoHR modules.
- **Tenant-scoped isolation**: All HR models include `tenantId` and use tenant-bound query constraints.
- **Domain-driven design**: Separate HR domains into bounded contexts while preserving shared platform services.
- **Audit-first**: Every material state change records an audit event, especially workforce, payroll, leave, document, asset, recruitment, performance, learning, onboarding, and offboarding actions.
- **Governance-first**: Implement governance policies and approval matrices before feature rollout.

## Domain Architecture

### Domain Model

ZoikoHR is composed of the following domains:

- Workforce Domain
- Organization Domain
- Leave Domain
- Document Domain
- Asset Domain
- Recruitment Domain
- Performance Domain
- Learning Domain
- Payroll Profile Domain
- Onboarding Domain
- Offboarding Domain
- Employee Self Service Domain
- Workforce Analytics Domain

Each domain maps to a set of page routes, services, repositories, and Prisma models. Shared platform concerns are handled by Zoiko One’s core services.

### Bounded Contexts

- **Workforce**: Employee master data, assignments, profile lifecycle
- **Organization**: Structure, business units, org chart, cost centers
- **Leave**: Entitlement, absence tracking, approvals
- **Document**: Records, policies, employee files, retention
- **Asset**: Inventory, assignment, lifecycle, maintenance
- **Recruitment**: Jobs, candidates, offers, hiring workflow
- **Performance**: Reviews, goals, feedback, talent calibration
- **Learning**: Courses, enrollments, certifications
- **Payroll Profile**: Compensation details, bank details, tax profile
- **Onboarding**: Checklists, task flows, orientation
- **Offboarding**: Separation, exit interviews, clearance
- **Employee Self Service**: Profile, leave, document access, learning
- **Workforce Analytics**: Dashboards, KPI metrics, trend analysis

### Employee Lifecycle Architecture

ZoikoHR models the employee lifecycle as a continuous journey:

1. **Recruitment**: Job requisition, candidate management, interview, offer
2. **Onboarding**: Preboarding tasks, document completion, training plans
3. **Workforce**: Employee profiles, role changes, transfers, promotions
4. **Performance**: Reviews, goals, feedback, development plans
5. **Learning**: Course enrollment and certification
6. **Leave**: Absence and entitlement management
7. **Payroll Profile**: Salary structure, bank, tax, payroll eligibility
8. **Offboarding**: Exit approvals, clearance, knowledge transfer

This journey is supported by workflow orchestration, audit trails, and self-service access.

### Org Chart Architecture

ZoikoHR’s org chart architecture is a first-class representation of business structure. Key components include:

- **Organization units**: departments, divisions, business units, cost centers
- **Reporting relationships**: manager-to-report and dotted-line assignments
- **Location hierarchy**: global site, region, country, office
- **Headcount plans**: capacity, budget, fill rate
- **Matrix dimensions**: functional and project structures

Org chart data is derived from shared organization entities plus HR-specific assignments and manager hierarchy records.

### Manager Hierarchy Architecture

ZoikoHR will explicitly model manager relationships and escalation chains:

- **Direct manager**: primary reporting manager for each employee
- **Secondary manager**: dotted-line or project manager relationship
- **Approval manager**: workflow approver for leave, recruitment, promotions
- **Skip-level manager**: escalation point for approvals and performance calibration
- **Matrix manager**: cross-functional reporting for program-based structures

Manager hierarchy is used by approval routing, org visualization, and self-service delegation.

### Employee Timeline Architecture

Employee timeline provides a unified chronological view of career events:

- Hire and contract events
- Role changes and promotions
- Location transfers
- Leave and absence records
- Performance reviews and feedback
- Learning enrollment and completion
- Document uploads and changes
- Payroll profile updates
- Onboarding/offboarding milestones

Timelines are implemented as event aggregates that join workforce, leave, recruitment, performance, learning, payroll profile, document, and workflow audit records.

### Approval Matrix Architecture

ZoikoHR approval logic is driven by a matrix rather than static roles alone. It includes:

- Role-based approval rules
- Amount and scope thresholds
- Manager and department matrix
- Job family and location-specific rules
- Delegation and escalation paths
- Governance policy enforcement modes

Approval matrix definitions are stored in the governance layer and applied by the approval workflow engine to route decisions.

### Cross Product Integration Architecture

ZoikoHR is integrated with Zoiko One products via shared contracts:

- **Payroll**: payroll profile data, pay eligibility, earnings/deductions mapping
- **Attendance / Time**: absence validation, time-based leave accruals, attendance exceptions
- **Compliance**: training, document retention, audit event correlation
- **Billing / Subscription**: product entitlements, seat counts, HR licensing
- **ZoikoCoreX**: automation triggers for HR workflows, onboarding tasks, offboarding handoffs
- **Audit / Analytics**: enterprise-level HR metrics in platform dashboards

Integration is defined by domain event models, secure APIs, and tenant-aware contracts.

## Workforce Domain

### Domain Scope

The Workforce Domain is the heart of ZoikoHR. It covers employee master data, employment status, role and assignment history, and workforce planning.

### Missing Workforce Models

To be enterprise-complete, the Workforce Domain must include:

- `EmployeeProfile` with demographic, contact, and personal data
- `EmploymentContract` and `EmploymentType` (full-time, part-time, contractor)
- `JobAssignment` / `PositionAssignment` tracking current role, job family, grade, and payroll assignment
- `EmploymentStatus` history (active, probation, leave of absence, terminated)
- `WorkLocation` and remote/hybrid status
- `WorkerRelationship` for internal referrals, manager chains, team membership
- `SkillProfile` and competency metadata
- `GlobalComplianceFlags` for background check, visa, certification, and security clearance
- `Probation` and confirmation milestone metadata
- `WorkforcePlan` and headcount forecast data

### Architecture

- **Pages**: `/zoiko-hr/workforce`, `/zoiko-hr/workforce/[employeeId]`
- **Services**: `workforceService.ts`, `workforceAnalyticsService.ts`
- **Repositories**: `workforceRepository.ts`
- **Prisma**: `EmployeeProfile`, `EmploymentContract`, `JobAssignment`, `WorkLocation`, `SkillProfile`

### Key Requirements

- Support multiple active assignments per employee with primary and secondary roles
- Preserve historical employment records for audit and compliance
- Include manager hierarchy and org chart identity in the employee record
- Provide employee lifecycle status across hire, transfer, promotion, leave, and separation

## Organization Domain

### Domain Scope

The Organization Domain represents the business structure and reporting model used by HR and the broader enterprise.

### Missing Organizational Models

Key missing models include:

- `OrgUnit` / `Department` / `Division` for nested business structure
- `CostCenter` / `BudgetCenter` for financial accountability
- `LegalEntity` for compliance and payroll separation
- `BusinessUnit` and `SharedServiceUnit`
- `Location` and `OfficeSite` geography models
- `OrganizationSnapshot` for headcount and budget history
- `OrgStructure` for matrix reporting and span of control

### Architecture

- **Pages**: `/zoiko-hr/organization`, `/zoiko-hr/organization/hierarchy`
- **Services**: `organizationService.ts`
- **Repositories**: `organizationRepository.ts`
- **Prisma**: `OrgUnit`, `CostCenter`, `Location`, `OrganizationSnapshot`

### Org Chart Architecture

Org chart architecture should support:

- Hierarchical and matrix views
- Role-level aggregation and span of control
- Location and legal entity filters
- Visual display of active vs. vacant positions
- Integration with employee assignments and manager hierarchy

### Manager Hierarchy Architecture

Include both direct reporting and non-hierarchical relationships:

- Primary manager assignment
- Secondary / dotted-line manager linking
- Approval manager roles aligned to workflow matrix
- Skip-level escalations and temporary delegation

## Leave Domain

### Domain Scope

The Leave Domain manages all absence-related activity for employees and contractors.

### Missing Leave Models

HR-grade leave management must include:

- `LeavePolicy` with jurisdiction rules, accrual formulas, and carryover settings
- `LeaveType` classification (vacation, sick, parental, bereavement, unpaid)
- `LeaveRequest` and `LeaveApproval` workflow records
- `LeaveBalance` and entitlement tracking
- `LeaveCalendar` and absence summaries
- `LeaveException` and override records
- `LeaveAccrualSchedule` and pro-rata calculations
- `LeaveComplianceRule` for statutory requirements
- `AttendanceLink` for integration with time systems

### Attendance Integration Models

Attendance integration is essential and should include:

- `AttendanceRecord` synced from time/attendance systems
- `AbsenceValidation` rules for leave approval and payroll eligibility
- `AttendanceException` for missed punches and approvals
- `TimeOffSync` for cross-product reconciliation

### Architecture

- **Pages**: `/zoiko-hr/leave`, `/zoiko-hr/leave/calendar`
- **Services**: `leaveService.ts`
- **Repositories**: `leaveRepository.ts`
- **Prisma**: `LeavePolicy`, `LeaveRequest`, `LeaveBalance`, `AttendanceRecord`

## Document Domain

### Domain Scope

The Document Domain handles employee records, policies, agreements, and verification artifacts.

### Missing Document Models

To meet enterprise standards:

- `DocumentRecord` and `EmployeeDocument`
- `DocumentFolder` and category taxonomy
- `DocumentVersion` for revisions and history
- `DocumentAccessRule` for RBAC and confidentiality levels
- `DocumentRetentionPolicy`
- `DocumentAcknowledgement` and e-signature metadata
- `DocumentAuditTrail` for access and changes
- `DocumentTag` for compliance classification

### Architecture

- **Pages**: `/zoiko-hr/documents`, `/zoiko-hr/documents/[documentId]`
- **Services**: `documentService.ts`
- **Repositories**: `documentRepository.ts`
- **Prisma**: `DocumentRecord`, `DocumentFolder`, `DocumentVersion`

## Asset Domain

### Domain Scope

The Asset Domain manages HR-provisioned assets and their lifecycle.

### Missing Asset Models

Enterprise asset management requires:

- `AssetItem` master inventory
- `AssetAssignment` linking asset to employee or location
- `AssetCategory` and type definitions
- `AssetCondition` and lifecycle stage
- `AssetMaintenance` and warranty records
- `AssetDepreciation` and value tracking
- `AssetReturnRequest` and clearance workflow
- `AssetApprovalRule` for procurement and assignment

### Architecture

- **Pages**: `/zoiko-hr/assets`
- **Services**: `assetService.ts`
- **Repositories**: `assetRepository.ts`
- **Prisma**: `AssetItem`, `AssetAssignment`, `AssetMaintenance`

## Recruitment Domain

### Domain Scope

Recruitment covers sourcing, evaluation, hiring, and requisition approval.

### Missing Recruitment Models

A complete recruitment domain should include:

- `JobRequisition` and budget line
- `CandidateProfile` and applicant record
- `Application` and stage tracking
- `Interview` schedule and scorecards
- `Offer` and employment terms
- `HiringTeam` and stakeholder assignments
- `CandidateSource` and pipeline analytics
- `RecruitmentApproval` workflow
- `BackgroundCheck` and compliance status

### Architecture

- **Pages**: `/zoiko-hr/recruitment`, `/zoiko-hr/recruitment/pipeline`
- **Services**: `recruitmentService.ts`
- **Repositories**: `recruitmentRepository.ts`
- **Prisma**: `JobRequisition`, `CandidateProfile`, `Interview`, `Offer`

## Performance Domain

### Domain Scope

Performance covers reviews, goals, feedback, calibration, and talent plans.

### Missing Performance Models

To meet enterprise expectations:

- `PerformanceReview` and cycle definitions
- `Goal` and objective records
- `FeedbackEntry` and 360-degree feedback
- `ReviewCycle` and calibration events
- `RatingScale` and competency frameworks
- `PerformanceImprovementPlan` (PIP)
- `SuccessionPlan` and talent pool classification
- `ReviewApproval` workflow

### Architecture

- **Pages**: `/zoiko-hr/performance`
- **Services**: `performanceService.ts`
- **Repositories**: `performanceRepository.ts`
- **Prisma**: `PerformanceReview`, `Goal`, `ReviewCycle`

## Learning Domain

### Domain Scope

Learning supports training, compliance, and career development.

### Missing Learning Models

The learning domain should include:

- `LearningCourse` and curriculum catalog
- `LearningEnrollment` and progress tracking
- `Certification` and renewal schedules
- `LearningPath` and development plans
- `TrainingAssignment` for mandatory courses
- `LearningCompletion` and transcript records
- `LearningProvider` and course metadata
- `ComplianceTraining` linkage

### Architecture

- **Pages**: `/zoiko-hr/learning`
- **Services**: `learningService.ts`
- **Repositories**: `learningRepository.ts`
- **Prisma**: `LearningCourse`, `LearningEnrollment`, `Certification`

## Payroll Profile Domain

### Domain Scope

Payroll Profile stores the data needed to process compensation in payroll systems.

### Missing Payroll Integration Models

A robust payroll profile requires:

- `PayrollProfile` with pay type, frequency, and eligibility flags
- `BankDetail` and payment method information
- `TaxProfile` and withholding rules
- `CompensationPlan` and pay components
- `PayComponent` definitions for earnings and deductions
- `PayrollMapping` to payroll systems
- `PayrollEligibility` for leave, attendance, and compliance validation
- `PayrollIntegrationEvent` for sync state

### Architecture

- **Pages**: `/zoiko-hr/payroll-profile`
- **Services**: `payrollProfileService.ts`
- **Repositories**: `payrollProfileRepository.ts`
- **Prisma**: `PayrollProfile`, `BankDetail`, `TaxProfile`, `PayComponent`

## Onboarding Domain

### Domain Scope

Onboarding bridges recruitment and workforce activation.

### Missing Onboarding Models

Onboarding should include:

- `OnboardingPlan` and phase definitions
- `OnboardingTask` with due dates and assignees
- `PreboardingChecklist` for offer acceptance and paperwork
- `OrientationSchedule` and training assignments
- `OnboardingDocument` and acknowledgement status
- `OnboardingWorkflow` tied to approval matrix
- `BuddyAssignment` and mentor relationship

### Architecture

- **Pages**: `/zoiko-hr/onboarding`
- **Services**: `onboardingService.ts`
- **Repositories**: `onboardingRepository.ts`
- **Prisma**: `OnboardingPlan`, `OnboardingTask`, `OnboardingDocument`

## Offboarding Domain

### Domain Scope

Offboarding manages separation, clearance, and knowledge transfer.

### Missing Offboarding Models

Critical offboarding models include:

- `OffboardingPlan` and checklist
- `ExitInterview` and feedback capture
- `ClearanceTask` for IT, finance, and facilities
- `SeparationReason` and exit type
- `FinalSettlement` and payment reconciliation
- `KnowledgeTransfer` documentation
- `SeparationApproval` workflow

### Architecture

- **Pages**: `/zoiko-hr/offboarding`
- **Services**: `offboardingService.ts`
- **Repositories**: `offboardingRepository.ts`
- **Prisma**: `OffboardingPlan`, `ExitInterview`, `ClearanceTask`

## Employee Self Service Domain

### Domain Scope

Employee self service allows employees to manage their own HR experience.

### Missing Employee Self Service Models

Self-service should include:

- `EmployeePortalProfile` access controls
- `SelfServiceRequest` for leave, document, and HR tickets
- `LearningDashboard` and training recommendations
- `PaySlipAccess` and payroll document downloads
- `PersonalInformationUpdate` workflow with approval
- `TimeOffBalanceView` and leave calendars
- `BenefitsEnrollment` and compensation viewing

### Architecture

- **Pages**: `/zoiko-hr/self-service`
- **Services**: `selfService.ts`
- **Repositories**: `selfServiceRepository.ts`
- **Prisma**: `SelfServiceRequest`, `PaySlip`, `BenefitEnrollment`

## Workforce Analytics Domain

### Domain Scope

Workforce analytics delivers data-driven HR insights.

### Missing Analytics Models

Analytics requires:

- `WorkforceKPI` and metric definitions
- `AttritionTrend` and headcount analysis
- `AbsenceTrend` and leave utilization metrics
- `HiringVelocity` and time-to-fill reports
- `PerformanceDistribution` and calibration analytics
- `LearningEngagement` and compliance training metrics
- `OrgHealth` and manager effectiveness dashboards
- `CompensationSpend` and payroll eligibility analytics

### Architecture

- **Pages**: `/zoiko-hr/analytics`
- **Services**: `workforceAnalyticsService.ts`
- **Repositories**: `analyticsRepository.ts`
- **Prisma**: analytics table views or materialized summary models as needed

## Cross Domain Features

### Approval Workflows

ZoikoHR must extend the existing Zoiko One approval workflow engine with HR-specific use cases:

- Hire approval and offer authorization
- Leave approval and escalation
- Promotion and compensation changes
- Onboarding and offboarding clearance
- Document acknowledgements and policy signoffs
- Asset issuance and return approvals
- Recruitment requisition and candidate offer approval
- Performance review signoff and calibration approval

### Audit Requirements

ZoikoHR must capture audit events for every material HR action. Required audit coverage includes:

- Workforce master changes
- Compensation and payroll profile updates
- Leave request submission, approval, and exception handling
- Document access, upload, approval, and retention actions
- Recruitment stage transitions and offer approvals
- Performance review submissions, rating changes, and calibrations
- Learning assignment, completion, and compliance training status
- Onboarding and offboarding milestone completion
- Self service requests and profile updates

Audit data must capture tenant, user, action, resource type, resource identifier, event category, outcome, IP address, user agent, and timestamp.

### Compliance Requirements

ZoikoHR must support compliance for:

- Employment law and statutory leave rules by jurisdiction
- Data privacy and document retention policies
- Payroll tax and bank detail handling
- Background checks, visa, and work authorization
- Training and certification compliance
- Auditability of approvals and policy enforcement
- Separation and final settlement compliance
- Governance policy enforcement modes (MONITOR, WARN, BLOCK)

### Analytics Requirements

ZoikoHR analytics must provide:

- Workforce headcount and growth trends
- Attrition and retention analysis
- Leave utilization and absence risk indicators
- Hiring funnel and time-to-fill metrics
- Performance distribution and high-potential identification
- Learning completion and mandatory training compliance
- Payroll profile readiness and payroll eligibility signals
- Manager effectiveness and org health dashboards

### Employee Self Service Requirements

Employee self service must enable:

- Profile review and controlled updates
- Leave requests and balance visibility
- Document access and e-signature acknowledgements
- Learning course enrollment and progress tracking
- Pay slip and payroll profile visibility
- Onboarding checklist access and status
- Offboarding tasks, exit interviews, and knowledge transfer
- Request status tracking and communication

### Integration Contracts

ZoikoHR must define clear integration contracts for:

- **Payroll Integration**: payroll profile sync, pay component mapping, eligibility signals, payout status
- **Attendance Integration**: attendance records, leave reconciliation, exception handling, shift schedules
- **Compliance Integration**: training completion, audit events, document retention metadata
- **Onboarding Integration**: employee data sync, asset provisioning, workspace and IT provisioning
- **Offboarding Integration**: clearance status, final settlement, account deprovisioning, asset recovery
- **Cross-Product Events**: HR lifecycle events emitted to ZoikoCoreX and governance systems
- **Subscription & Billing**: entitlement checks for ZoikoHR features and seat consumption

## Security Architecture

ZoikoHR security is inherited from Zoiko One. It must continue to enforce:

- Session-based JWT authentication with token rotation
- Tenant-scoped authorization using RBAC
- Permission-based access control for every HR endpoint and page
- Audit logging for authorization denials and HR actions
- Strong data protection for personal, financial, and payroll data
- Policy-driven access for sensitive documents and payroll profiles

### Access Control

- Use existing permission domain model and extend with HR-specific keys such as `workforce.*`, `leave.*`, `recruitment.*`, `performance.*`, `learning.*`, `payrollProfile.*`, `onboarding.*`, `offboarding.*`, `selfService.*`, `analytics.*`
- Protect API routes with the `withPermission()` wrapper
- Use page-level permission gating via `requirePagePermission()` and secure service methods

### Data Protection

- Apply tenant isolation at the database layer
- Protect payroll and tax data with restricted CRUD and audit access
- Enforce document confidentiality levels and retention policies
- Track all sensitive access through `AuditLog`

## Dashboard Architecture

ZoikoHR dashboards should deliver targeted operational and leadership views:

- **HR Operations Dashboard**: leave pipeline, open requisitions, onboarding status, employee changes
- **People Analytics Dashboard**: attrition, headcount, performance, learning engagement
- **Manager Dashboard**: direct report health, team leave, performance cycle status
- **Compliance Dashboard**: mandatory training, documentation completion, audit exceptions
- **Payroll Readiness Dashboard**: payroll profile completeness and attendance reconciliation

### Visualization

- Use charts for trend lines, distribution, and metric cards
- Surface high-risk and exception conditions with status badges
- Provide drill-down lists for managers and HR leaders
- Support export-ready reports and scheduled analytics summaries

## Folder Structure

The ZoikoHR codebase should mirror Zoiko One conventions:

```
app/
  zoiko-hr/
    page.tsx
    workforce/page.tsx
    organization/page.tsx
    leave/page.tsx
    documents/page.tsx
    assets/page.tsx
    recruitment/page.tsx
    performance/page.tsx
    learning/page.tsx
    payroll-profile/page.tsx
    onboarding/page.tsx
    offboarding/page.tsx
    self-service/page.tsx
    analytics/page.tsx
    components/
      EmployeeTimeline.tsx
      OrgChart.tsx
      ManagerHierarchy.tsx
      ApprovalMatrix.tsx
    api/
      workforce/
      leave/
      documents/
      recruitment/
      performance/
      learning/
      payroll-profile/
      onboarding/
      offboarding/
      self-service/
      analytics/
app/services/
  workforceService.ts
  organizationService.ts
  leaveService.ts
  documentService.ts
  assetService.ts
  recruitmentService.ts
  performanceService.ts
  learningService.ts
  payrollProfileService.ts
  onboardingService.ts
  offboardingService.ts
  selfService.ts
  analyticsService.ts
app/repositories/
  workforceRepository.ts
  organizationRepository.ts
  leaveRepository.ts
  documentRepository.ts
  assetRepository.ts
  recruitmentRepository.ts
  performanceRepository.ts
  learningRepository.ts
  payrollProfileRepository.ts
  onboardingRepository.ts
  offboardingRepository.ts
  selfServiceRepository.ts
  analyticsRepository.ts
lib/
  security/
  prisma.ts

prisma/
  schema.prisma  # extend with HR models and tenant-scoped relations
```

## Development Roadmap

### Phase 1 — Core HR Foundation

- Add employee master data and workforce models
- Implement org unit, cost center, and manager hierarchy foundation
- Build HR product shell and shared ZoikoHR navigation
- Establish RBAC permission extensions and audit logging for HR actions
- Create workforce and organization pages with service/repository pattern

### Phase 2 — Leave, Document, and Asset

- Deliver leave policy, request, and approval workflow support
- Build document repository, retention, and access controls
- Add asset inventory, assignment, and lifecycle tracking
- Add attendance integration planning and model definitions

### Phase 3 — Recruitment, Performance, Learning

- Add hiring pipeline, candidate management, and offer workflows
- Deliver performance review cycles, goals, and feedback
- Add learning course catalog, enrollment, and certification tracking
- Enable employee timeline and manager dashboards

### Phase 4 — Payroll Profile, Onboarding, Offboarding

- Add payroll profile, bank/tax details, and payroll eligibility models
- Deliver onboarding and offboarding workflows with task plans
- Build self-service portal capabilities for employees and managers
- Add analytics dashboards and HR operational reports

### Phase 5 — Enterprise Optimization

- Harden approval matrices, governance enforcement, and escalation paths
- Add cross-product integrations with payroll, attendance, compliance, and ZoikoCoreX
- Build workforce analytics domain and advanced reporting
- Optimize scalability, audit analytics, and compliance readiness

## Gap Analysis

### Identified Missing Elements

- Workforce models for contract, assignment, skill, and workforce planning
- Organization models for legal entity, cost center, org unit, and matrix reporting
- Payroll integration models for pay components, eligibility, and integration events
- Attendance integration models for attendance record sync, validation, and exceptions
- Onboarding models for plans, tasks, and preboarding workflows
- Offboarding models for clearance, exit interviews, settlement, and knowledge transfer
- HR-specific approval workflows for hire, promotion, leave, onboarding, offboarding, and asset provisioning
- Audit requirements that span lifecycle, governance, compliance, and self-service actions
- Compliance requirements for leave law, payroll tax, document retention, and training
- Analytics requirements for workforce health, attrition, absence, hiring velocity, and manager effectiveness
- Employee self-service requirements for profile, leave, documents, pay slips, learning, and request tracking
- Integration contracts for cross-product sync with payroll, attendance, compliance, and automation engines

### Market Alignment

The improved architecture brings ZoikoHR closer to competitors by adding:

- **Darwinbox-style** lifecycle coverage and workflow configurability
- **Rippling-style** cross-product HR/payroll integration and self-service
- **BambooHR-style** employee central and time-off management with self-service
- **Workday-style** enterprise analytics, org chart, and approval matrix discipline
- **Keka-style** attendance and payroll integration with compliance focus

## Conclusion

This updated ZoikoHR architecture transforms the placeholder design into a fully realized enterprise HR module that is aligned to Zoiko One’s platform architecture and competitive market expectations. It now includes the essential missing domains, lifecycle models, approval frameworks, analytics capabilities, self-service experiences, and integration contracts required for a successful enterprise HR product.
