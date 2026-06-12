# ZoikoHR Product Requirements Document

## Executive Summary

ZoikoHR is the enterprise-grade human capital management product built natively inside the Zoiko One platform. It delivers a unified, tenant-scoped HR experience that spans workforce management, leave, recruitment, performance, learning, payroll profile, onboarding, offboarding, employee self-service, and analytics. ZoikoHR reuses Zoiko One foundational models for tenant isolation, RBAC, approval workflows, governance, and audit while extending them with HR-specific domain capabilities.

This PRD defines the business requirements, product scope, success metrics, and release strategy for ZoikoHR. It is intended for product, engineering, design, security, compliance, and operations stakeholders.

## Product Vision

ZoikoHR empowers HR teams, managers, and employees with a single platform for the complete employee lifecycle, from hire to retire. It combines workforce intelligence, governed workflows, and cross-product integration to deliver compliance-safe HR operations that scale for enterprise customers.

### Vision Statement

Provide a modern, secure, and audit-ready HR product that enables enterprises to manage people, processes, and compliance within the Zoiko One ecosystem.

### Value Proposition

- Unified HR master data and people operations in a multi-tenant SaaS environment
- Governed approvals and audit trails for all material HR actions
- Seamless integration with payroll, time, compliance, and analytics products
- Empowered employee self-service with contextual access based on role and tenant policy
- Enterprise analytics that turn workforce data into actionable insights

## Business Objectives

### Strategic Goals

1. Launch ZoikoHR as a native Zoiko One vertical that reuses platform security, tenant, and workflow services.
2. Deliver end-to-end employee lifecycle coverage, including recruitment, onboarding, workforce management, performance, learning, leave, payroll profile, and offboarding.
3. Ensure all HR operations are auditable, policy-driven, and approval-governed.
4. Support enterprise tenants with multi-organization, hierarchical structures, and role-based data access.
5. Enable cross-product workflows with ZoikoPayroll, ZoikoTime, ZoikoComply, and ZoikoInsights.

### Success Metrics

- Adoption: 80% of target tenants activate ZoikoHR within 6 months of launch
- Coverage: 90% of core HR processes supported in MVP scope
- Compliance: 100% of material HR actions generate audit entries and approval records
- Security: Zero critical RBAC or tenant isolation findings in pre-launch security review
- Performance: 95th percentile page load time under 2 seconds for HR dashboards and directories
- Retention: 75% of active users returning weekly to employee self-service or manager workflows
- Integration readiness: ZoikoPayroll, ZoikoTime, ZoikoComply, and ZoikoInsights integrations specified and validated for initial sync contracts

## User Personas

### Primary Users

- HR Manager: Manages employee lifecycle, hires, leave, policies, and HR processes for one or more organizations within a tenant.
- HR Administrator: Configures HR policies, manages org structure, oversees approvals, and enforces governance.
- People Operations Leader: Monitors workforce analytics, compliance, and organizational health across the tenant.
- Manager: Approves leave, reviews performance, manages direct reports, and participates in recruitment and onboarding.
- Employee: Accesses self-service features for profile updates, leave requests, documents, learning, and pay information.

### Secondary Users

- Payroll Administrator: Reviews payroll profile readiness and payroll integration status.
- Compliance Officer: Reviews audit logs, compliance reports, and policy enforcement results.
- Recruiter: Manages job requisitions, candidates, interviews, and offer workflows.
- Learning Coordinator: Creates and manages learning content and training enrollment.

## User Roles

### Role Definitions

- Super Admin: Full access across Zoiko One and ZoikoHR, including tenant-level HR configuration and governance.
- Tenant Admin: Broad access to ZoikoHR features within their tenant, excluding core tenant deletion and role-level system changes.
- HR Admin: Department and organization-level access to workforce, leave, recruitment, performance, and learning.
- Manager: Access to direct reports, team workflows, approvals, and relevant team analytics.
- Employee: Self-service access to personal HR records, leave requests, documents, and learning.
- Recruitment Team: Access to recruitment-specific workflows and candidate pipelines.
- Payroll Admin: Access to compensation and payroll profile data, payroll readiness, and integration status.
- Compliance Admin: Access to compliance reports, audit logs, and policy enforcement data.

### Permissions

ZoikoHR must extend Zoiko One permissions with HR-specific domains such as:
- `workforce.*`
- `leave.*`
- `recruitment.*`
- `performance.*`
- `learning.*`
- `payrollProfile.*`
- `onboarding.*`
- `offboarding.*`
- `documents.*`
- `assets.*`
- `analytics.*`
- `selfService.*`

Permissions must enforce both page visibility and API access, with tenant-scoped and role-aware checks.

## Functional Requirements

### Workforce Requirements

- Maintain tenant-scoped employee master records with workforce and organizational assignment data.
- Support hierarchical organization structures: tenants, organizations, divisions, business units, departments, locations, and cost centers.
- Track employee status, employment type, job title, level, reporting relationship, and primary work location.
- Provide a 360° employee profile with personal, employment, contact, and compliance information.
- Capture historical employment records and versioning for role changes, promotions, transfers, and salary updates.
- Enable org chart visualization with manager hierarchies, direct reports, and dotted-line relationships.

### Leave Requirements

- Define leave policies, leave types, accrual rules, carryover, and statutory compliance requirements.
- Support leave balance tracking, leave request submission, approval workflows, and leave calendars.
- Integrate leave data with timesheet and attendance systems for absence validation.
- Notify managers and HR of pending leave approvals and exceptions.
- Ensure leave approvals are audited and linked to workflow records.

### Recruitment Requirements

- Support job requisitions, candidate pipelines, interview scheduling, and offer management.
- Provide recruitment dashboards and funnel analytics.
- Enable candidate evaluation, feedback capture, and hiring approvals.
- Integrate offer acceptance with employee creation and onboarding workflows.
- Audit recruitment actions and maintain candidate history.

### Asset Requirements

- Track employee-owned and assigned assets, including inventory, assignment status, and condition.
- Manage asset lifecycle events such as issuance, return, maintenance, and retirement.
- Support asset approval workflows for procurement and assignment.
- Provide asset audit logs and compliance reporting.

### Performance Requirements

- Manage performance review cycles, goals, feedback, and ratings.
- Support self-review, manager review, peer feedback, and calibration workflows.
- Provide performance dashboards and talent insights.
- Enable performance approval and review sign-off processes.
- Audit performance changes and review actions.

### Learning Requirements

- Deliver learning course management, enrollment, certification, and progress tracking.
- Support mandatory and optional training assignments.
- Provide learning completion analytics and compliance tracking.
- Enable employee access to course catalogs and certification records.

### Payroll Profile Requirements

- Maintain payroll profile data, including salary structure, payment frequency, bank details, and tax profiles.
- Track payroll eligibility and integration readiness for ZoikoPayroll.
- Support historical payroll profile versions and compensation changes.
- Ensure payroll profile updates are audited and approval-governed where required.

### Employee Self-Service Requirements

- Provide employees with access to their personal profile, leave balances, documents, learning, and reviews.
- Enable employee requests for profile updates, leave, documents, and training.
- Support employee visibility into approvals, onboarding status, and pay-related notifications.
- Protect sensitive employee data through appropriate RBAC and privacy controls.

### Reporting Requirements

- Provide workforce analytics for headcount, attrition, leave usage, hiring velocity, performance distribution, and learning engagement.
- Offer dashboards for HR operations, manager insights, compliance, and payroll readiness.
- Support exported reports for compliance, leadership review, and audit.
- Enable configurable reports by organization, department, location, and role.

### Integration Requirements

- Integrate with ZoikoPayroll for payroll profile sync, payroll run status, payout details, and tax summary exchange.
- Integrate with ZoikoTime for timesheet submission, attendance records, overtime calculation, and approval status.
- Integrate with ZoikoComply for compliance alerts, audit findings, remediation tasks, and policy enforcement data.
- Integrate with ZoikoInsights for anonymized workforce metrics, attrition risk, hiring trends, and performance analytics.
- Support ZoikoCoreX automation for onboarding, offboarding, approval notifications, and workflow orchestration.

## Non Functional Requirements

### Performance

- Pages should render within 2 seconds for typical HR dashboards and directories.
- APIs should support sub-second response time for core read operations under normal load.
- System should scale to support large tenants with 10,000+ employees and 100,000+ audit events.

### Reliability

- HR data access must meet 99.9% availability for customer-facing screens.
- Approval workflows and audit records must be durable and recoverable.
- Integration contracts must tolerate intermittent external system failures with retry logic.

### Scalability

- Support horizontal scaling of web APIs and background jobs.
- Ensure database design supports tenant partitioning and tenant-scoped indexing.
- Plan for future expansion to global multi-region deployment.

### Usability

- UI must provide clear workflows for common HR tasks: hire, leave request, performance review, onboarding, and payroll profile updates.
- Navigation must be intuitive, with role-based menu items and context-sensitive actions.
- Reports and dashboards must surface key insights without overwhelming users.

### Maintainability

- Use modular architecture: pages → services → repositories → Prisma → PostgreSQL.
- Separate HR domain logic from Zoiko One platform concerns while reusing common services.
- Document APIs, data models, and workflows for engineering handover.

## Security Requirements

- Enforce tenant isolation through tenant-scoped data access and unique constraints.
- Implement role-based access control for all ZoikoHR screens and APIs.
- Require authentication for all user actions and API access.
- Protect sensitive HR and payroll data using encryption in transit and at rest as appropriate.
- Log authorization failures and security events in AuditLog.
- Use session rotation, refresh token revocation, and secure cookie controls.

## Compliance Requirements

- Capture audit trails for every material HR action, including who, what, when, where, and outcome.
- Support GDPR and CCPA data export and erasure workflows for employee data.
- Maintain retention policies for HR records, payroll audit logs, and compliance evidence.
- Track document acknowledgements, certification completions, and policy signoffs.
- Provide compliance reporting for employment laws, training mandates, and audit readiness.

## Employee Lifecycle Requirements

- Support complete lifecycle stages: recruitment, onboarding, active employment, development, leave, offboarding, and alumni status.
- Maintain timeline visibility for employee career events, approvals, and workflow milestones.
- Enable lifecycle handoffs between recruitment, HR operations, payroll, and compliance.
- Provide manager and employee views tailored to each stage of the lifecycle.

## Leave Requirements

- Define configurable leave policies and statutory compliance rules.
- Support leave request creation, modification, cancellation, and approval.
- Provide leave calendars and balance forecasting.
- Integrate leave status with attendance and payroll eligibility.
- Ensure leave exceptions and overrides are tracked with audit and approval records.

## Recruitment Requirements

- Create and manage job openings, requisitions, and candidate pipelines.
- Track interview stages, scorecards, and hiring team assignments.
- Manage offer approvals, acceptance, and connected employee creation.
- Provide recruitment analytics for time-to-fill, source effectiveness, and candidate flow.
- Audit candidate decisions and hiring approvals.

## Asset Requirements

- Manage inventory of IT equipment, devices, and employee-provisioned assets.
- Support asset assignment, return, maintenance, and disposal workflows.
- Provide asset status dashboards, owner history, and audit logs.
- Integrate asset clearance with onboarding and offboarding processes.
- Ensure asset approval workflows are available for procurement and assignment.

## Performance Requirements

- Define performance review cycles, goals, and calibration workflows.
- Support feedback collection from self, manager, peer, and 360-degree sources.
- Provide manager review dashboards and completion tracking.
- Track performance ratings, high-potential employees, and improvement plans.
- Audit review submissions, rating changes, and calibration approvals.

## Learning Requirements

- Manage courses, certifications, and training catalog items.
- Enable enrollments, progress tracking, completion certificates, and compliance training.
- Support learning assignments based on role, department, and compliance needs.
- Provide learning analytics and training completion dashboards.
- Audit course assignments and completion records.

## Payroll Profile Requirements

- Capture payroll profile data including compensation, bank details, tax withholding, and payment frequency.
- Support historical payroll profile versions for compensation changes.
- Provide payroll readiness indicators and integration status.
- Ensure payroll profile updates require approval for sensitive changes.
- Integrate payroll profile data with ZoikoPayroll, including payroll run initiation and status feedback.

## Employee Self-Service Requirements

- Provide employees access to their own profile, leave requests, documents, training, and pay-related information.
- Support employee-initiated requests for profile updates, leave, learning enrollment, and document access.
- Allow employees to view approval status and workflow progress.
- Ensure employees cannot access unauthorized data or sensitive records beyond their permitted scope.
- Provide a mobile-friendly self-service experience.

## Reporting Requirements

- Offer HR operational dashboards for workforce, leave, recruitment, performance, and learning.
- Provide compliance dashboards for training, document retention, and audit findings.
- Support payroll readiness and payroll profile completeness reporting.
- Enable exportable reports and scheduled report generation.
- Support filtering by tenant, organization, department, location, role, and time period.

## Integration Requirements

- Define integration contracts with ZoikoPayroll, ZoikoTime, ZoikoComply, ZoikoInsights, and ZoikoCoreX.
- Ensure ZoikoPayroll consumes payroll profile data, salary structure, bank and tax profiles, and payroll eligibility signals.
- Ensure ZoikoTime consumes employment and leave data, and provides timesheet, attendance, and approval status back to ZoikoHR.
- Ensure ZoikoComply consumes employee, audit, and compliance data, and returns alerts, findings, and remediation tasks.
- Ensure ZoikoInsights consumes anonymized workforce metrics, performance data, and leave analytics.
- Support event-driven notifications and webhook-based sync for cross-product state changes.

## Acceptance Criteria

- ZoikoHR delivers the target HR domain functionality for workforce, leave, recruitment, performance, learning, payroll profile, onboarding, offboarding, and employee self-service.
- All HR actions produce audit entries with actor, tenant, resource, event type, and timestamp.
- Tenant isolation is enforced for all ZoikoHR data and interactions.
- RBAC is implemented for all screen and API access according to defined user roles.
- Approval workflows are available for leave, offers, payroll, onboarding, offboarding, and compliance-related actions.
- Integration contracts are defined for ZoikoPayroll, ZoikoTime, ZoikoComply, and ZoikoInsights.
- UI content and navigation align with ZoikoHR UI architecture principles.
- Performance meets 95th percentile latency targets for core dashboards.
- Security review finds no critical vulnerabilities in authentication, authorization, or data protection.

## Risks

- **Scope creep**: ZoikoHR covers many HR domains; without strict prioritization, delivery may slip.
- **Integration complexity**: Cross-product contracts with payroll, time, compliance, and analytics increase risk.
- **Data privacy**: HR and payroll data are highly sensitive and require strong governance and compliance controls.
- **RBAC enforcement**: Incorrect permission mapping may expose sensitive employee information.
- **Audit completeness**: Missing audit points can undermine compliance and governance requirements.
- **API placeholder risk**: Without a detailed API spec, implementation and integration teams may misalign.
- **MVP trade-offs**: Incomplete domain coverage in early releases may reduce perceived value.

## Assumptions

- Zoiko One foundational models and platform services are available and stable.
- Tenant and RBAC infrastructure from Zoiko One can be reused for ZoikoHR.
- Existing platform approval and audit engines can be extended for HR-specific workflows.
- Customer tenants require multi-organization hierarchy and role-based access.
- Payroll, time, compliance, and analytics products will be available for integration in parallel releases.
- The initial launch will focus on enterprise customers who require governed HR operations.

## Release Strategy

### Release 1: Core Workforce and HR Operations

- Employee master data
- Organization hierarchy and org chart
- Employee profile and reporting relationships
- Basic leave policy and leave request workflow
- Approval workflow integration for leave and employee changes
- Audit logging for workforce actions
- Core HR dashboard and employee directory

### Release 2: Recruitment, Onboarding, and Offboarding

- Job requisitions, candidate pipeline, interview workflow
- Offer management and hire approval
- Onboarding plans, tasks, and documents
- Offboarding plans, clearance tasks, and exit workflows
- Integration handoffs to payroll and compliance

### Release 3: Performance, Learning, and Payroll Profile

- Performance reviews, goals, feedback, calibration
- Learning course management and enrollment
- Payroll profile management, bank/tax details, compensation readiness
- Payroll integration contract validation
- Employee self-service enhancements

### Release 4: Analytics, Compliance, and Cross-product Integration

- Workforce analytics dashboards and reporting
- Compliance dashboards and audit evidence workflows
- ZoikoTime attendance integration and leave reconciliation
- ZoikoComply compliance alerts and remediation
- ZoikoInsights analytics contract delivery
- Operational reports and export capabilities

### Release Governance

- Milestones aligned to domain readiness and integration dependencies.
- Each release must include security review, compliance validation, and stakeholder sign-off.
- Phased rollout should prioritize tenant isolation, governance, and audit first.
