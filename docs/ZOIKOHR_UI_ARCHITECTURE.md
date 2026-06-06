# ZoikoHR UI Architecture

**Version:** 1.0  
**Date:** June 2026  
**Architect:** Principal Product & UX Architect  
**Status:** Enterprise UI Specification

---

## Overview

ZoikoHR UI Architecture extends the existing Zoiko One design system with a comprehensive, role-based interface for human resource management. The design maintains visual consistency with the platform while introducing HR-specific patterns for workforce management, leave approvals, recruitment pipelines, performance reviews, and employee self-service.

**Design Principles:**
- Reuse existing components (Sidebar, Header, KPICard, ReusableTable, Charts, StatusBadge)
- Maintain dark theme with consistent color palette
- Support multi-tenant, role-based access
- Optimize for both administrative and employee workflows
- Progressive disclosure: Show relevant data based on user role
- Mobile-first responsive design

---

## Design System Reference

### Color Palette
- **Background**: #0A0F1C (primary), #0b1220 (secondary), slate-950 (#1e293b variant)
- **Borders**: slate-800 (#1e293b)
- **Text**: white, slate-300, slate-400, slate-500
- **Accents**:
  - Status: emerald (active), amber (warning), red (error), slate (inactive)
  - Accent colors: cyan (#06b6d4), blue (#3b82f6), purple (#a855f7)
- **Shadows**: 0_20px_80px_rgba(0,0,0,0.35)

### Typography
- **Heading 1**: 3xl font-semibold (32px)
- **Heading 2**: lg font-semibold (18px)
- **Body**: sm (14px)
- **Caption**: xs font-semibold uppercase (12px)
- **Tracking**: [0.32em] for labels

### Components Library
- **KPICard**: Metric display with icon, value, trend
- **ReusableTable**: Generic data table with custom column rendering
- **PageHeader**: Title + description header on each page
- **StatusBadge**: Status indicator with color coding
- **GrowthLineChart**: Line chart for metrics over time
- **Header**: Top navigation with search, notifications, user menu
- **Sidebar**: Multi-section collapsible navigation

### Icons (Lucide React)
- Navigation: LayoutDashboard, Users, Building2, Briefcase, FileText, Settings
- Actions: Plus, Edit2, Trash2, Download, Upload, Share2, Search
- Status: CheckCircle, AlertCircle, Clock, XCircle, Play
- Domain: Users, FileText, DollarSign, Award, GraduationCap, Zap

---

## Section 1: Product Navigation

### 1.1 Sidebar Structure

**ZoikoHR Section (NEW)**

Primary navigation for HR module. Replaces the placeholder "Zoiko HR" in Sidebar.

```
ZOIKO HR (Product Section)
├─ Dashboard (href: /zoiko-hr/dashboard)
├─ Workforce (submenu)
│  ├─ Employee Directory (href: /zoiko-hr/employees)
│  ├─ Organization (submenu)
│  │  ├─ Departments (href: /zoiko-hr/departments)
│  │  ├─ Designations (href: /zoiko-hr/designations)
│  │  ├─ Business Units (href: /zoiko-hr/business-units)
│  │  ├─ Locations (href: /zoiko-hr/locations)
│  │  └─ Org Chart (href: /zoiko-hr/org-chart)
│  └─ Teams (submenu)
│     ├─ My Team (href: /zoiko-hr/my-team)
│     └─ All Teams (href: /zoiko-hr/all-teams)
├─ Leave & Time Off (submenu)
│  ├─ Leave Requests (href: /zoiko-hr/leave-requests)
│  ├─ Leave Policies (href: /zoiko-hr/leave-policies)
│  ├─ Leave Calendar (href: /zoiko-hr/leave-calendar)
│  └─ Leave Balances (href: /zoiko-hr/leave-balances)
├─ Recruitment (submenu)
│  ├─ Job Openings (href: /zoiko-hr/job-openings, badge: "5")
│  ├─ Candidates (href: /zoiko-hr/candidates, badge: "23")
│  ├─ Interviews (href: /zoiko-hr/interviews)
│  ├─ Offers (href: /zoiko-hr/offers)
│  └─ Hiring Pipeline (href: /zoiko-hr/hiring-pipeline)
├─ Onboarding & Offboarding (submenu)
│  ├─ Onboarding (href: /zoiko-hr/onboarding)
│  ├─ Offboarding (href: /zoiko-hr/offboarding)
│  └─ Exit Requests (href: /zoiko-hr/exit-requests)
├─ Performance (submenu)
│  ├─ Goals (href: /zoiko-hr/goals)
│  ├─ Reviews (href: /zoiko-hr/reviews)
│  ├─ Feedback (href: /zoiko-hr/feedback)
│  └─ Ratings (href: /zoiko-hr/ratings)
├─ Learning & Development (submenu)
│  ├─ Courses (href: /zoiko-hr/courses)
│  ├─ Certifications (href: /zoiko-hr/certifications)
│  ├─ Skills (href: /zoiko-hr/skills)
│  └─ Training History (href: /zoiko-hr/training-history)
├─ Documents & Assets (submenu)
│  ├─ Employee Documents (href: /zoiko-hr/documents)
│  ├─ Company Documents (href: /zoiko-hr/company-documents)
│  └─ Assets (href: /zoiko-hr/assets)
├─ Approvals (href: /zoiko-hr/approvals, badge: "12")
├─ Reports (submenu)
│  ├─ Headcount Report (href: /zoiko-hr/reports/headcount)
│  ├─ Attrition Report (href: /zoiko-hr/reports/attrition)
│  ├─ Leave Report (href: /zoiko-hr/reports/leave)
│  ├─ Recruitment Report (href: /zoiko-hr/reports/recruitment)
│  └─ Training Report (href: /zoiko-hr/reports/training)
├─ My Workspace (submenu)
│  ├─ My Profile (href: /zoiko-hr/my-profile)
│  ├─ My Leave (href: /zoiko-hr/my-leave)
│  ├─ My Documents (href: /zoiko-hr/my-documents)
│  ├─ My Training (href: /zoiko-hr/my-training)
│  └─ My Reviews (href: /zoiko-hr/my-reviews)
└─ Settings (href: /zoiko-hr/settings)
```

**Sidebar Specifications:**
- Section title: "ZOIKO HR" with badge if admin (e.g., "ADMIN")
- Collapsible subsections for Workforce, Leave, Recruitment, etc.
- Badge counts on high-priority items (Job Openings, Candidates, Approvals)
- Icons from Lucide (Users, Briefcase, Calendar, Award, etc.)
- Active state highlights for current page
- Breadcrumb trail in PageHeader shows navigation context

---

### 1.2 Header Integration

**Top Navigation Bar (Reuse Existing Header Component)**

Consistent with platform Header:
- Menu toggle (mobile)
- Search bar (employee search, cross-module)
- "Refresh data" button
- Notifications bell (leave approvals, offer decisions, reviews ready)
- User menu (avatar, user name, settings, logout)

**New Actions in Header (context-dependent):**
- Breadcrumb: Dashboard > Employees > [Employee Name]
- Action button area (e.g., "+ New Employee", "+ Leave Request")

---

## Section 2: Dashboard Architecture

### 2.1 Executive Dashboard (HR Admin/Manager View)

**URL**: `/zoiko-hr/dashboard`

**Layout**: 6-row grid layout

**Row 1: KPI Cards (6 cards, 2 cols on mobile, 3 on tablet, 6 on desktop)**

```
Grid (grid-cols-1 sm:grid-cols-3 lg:grid-cols-6)
├─ KPICard: Total Employees
│  - Title: "Total Employees"
│  - Value: "1,245"
│  - Icon: Users
│  - Trend: "+8.3% this month"
│  - Action: Click to view Employee Directory
│
├─ KPICard: Active Employees
│  - Title: "Active Employees"
│  - Value: "1,189"
│  - Icon: CheckCircle
│  - Trend: "+2.1% from last month"
│
├─ KPICard: New Hires
│  - Title: "New Hires"
│  - Value: "32"
│  - Icon: UserPlus
│  - Trend: "+15.2% YoY"
│  - Action: Link to Onboarding Dashboard
│
├─ KPICard: Attrition Rate
│  - Title: "Attrition Rate"
│  - Value: "2.1%"
│  - Icon: TrendingDown
│  - Trend: "-0.3% from Q1"
│  - Status Badge: "Healthy"
│
├─ KPICard: Open Positions
│  - Title: "Open Positions"
│  - Value: "8"
│  - Icon: Briefcase
│  - Trend: "1 closing soon"
│  - Action: Link to Job Openings
│
├─ KPICard: On Leave
│  - Title: "Employees on Leave"
│  - Value: "56"
│  - Icon: Calendar
│  - Trend: "13 returning tomorrow"
```

**Row 2: Primary Charts (2 cols on tablet, 1 full width on mobile)**

```
Grid (grid-cols-1 lg:grid-cols-2)
├─ GrowthLineChart: Headcount Trend
│  - Title: "Headcount Trend (12 months)"
│  - X-axis: Month
│  - Y-axis: Count
│  - Line: Headcount progression with color: cyan (#06b6d4)
│  - Action: Hover to see daily average, click to drill-down
│  - Export: Download as CSV/PNG
│
└─ StackedBarChart: Department Distribution
   - Title: "Department Distribution"
   - X-axis: Department names
   - Y-axis: Employee count
   - Color stack: [Active, On Leave, New Hires]
   - Hover: Show department details
```

**Row 3: Secondary Charts (2 cols)**

```
Grid (grid-cols-1 lg:grid-cols-2)
├─ PieChart: Gender Distribution
│  - Title: "Workforce Diversity"
│  - Segments: Male, Female, Non-binary, Prefer not to say
│  - Colors: Different shades per category
│  - Action: Click segment to filter employee list
│
└─ LineChart: Leave Trend (12 months)
   - Title: "Leave Usage Trend"
   - Lines: PTO vs Sick vs Other
   - Legend: Color-coded by leave type
```

**Row 4: Widgets Row 1 (3 equal columns)**

```
Grid (grid-cols-1 sm:grid-cols-3)
├─ Card: Upcoming Birthdays
│  - Title: "Upcoming Birthdays"
│  - Content: List of 5 employees with birthdays in next 7 days
│  - Format: Avatar + Name + Department + Date
│  - Action: Send birthday wishes (bulk)
│  - Empty state: "No birthdays this week"
│
├─ Card: Work Anniversaries
│  - Title: "Work Anniversaries"
│  - Content: List of 5 employees with anniversaries in next 7 days
│  - Format: Avatar + Name + Years + Department
│  - Action: Send anniversary congratulations
│
└─ Card: Pending Approvals
   - Title: "Pending Approvals"
   - Content: Count by type (Leave: 5, Recruitment: 2, Expense: 1)
   - Action: Click to view Approvals page
   - Color: Amber badge if count > 0
```

**Row 5: Document & Task Widgets**

```
Grid (grid-cols-1 lg:grid-cols-2)
├─ Card: Expiring Documents
│  - Title: "Expiring Documents"
│  - Content: Table with Document Name, Owner, Expiry Date, Days Remaining
│  - Columns: [Document, Owner, Expires In, Action]
│  - Rows: Top 5 by expiry date
│  - Action: Renew button, view all link
│  - Sort: By days remaining (ascending)
│
└─ Card: Onboarding Tasks
   - Title: "Active Onboarding Tasks"
   - Content: Progress bars for each new hire
   - Format: Name + Start Date + Progress % + Current Task
   - Rows: 5 most recent new hires
   - Action: Click to view onboarding plan
```

**Row 6: Recent Activity Feed**

```
Card: Recent Activity
├─ RecentActivityFeed (vertical timeline)
├─ Events: Employee hired, Left approved, Review completed, Offer extended
├─ Format: Icon + Event type + Actor + Timestamp
├─ Limit: Last 10 events
├─ Filter: By event type
└─ Action: "View all" link to Activity log
```

---

### 2.2 Employee/Self-Service Dashboard

**URL**: `/zoiko-hr/my-workspace/dashboard` (variant)

**Simplified view for non-admin employees**

```
Grid (simplified)
├─ KPICard: My Leave Balance
│  - PTO: 12.5 days remaining
│  - Sick: 5 days remaining
│  - Personal: 2 days remaining
│
├─ KPICard: My Performance
│  - Current review cycle status
│  - Goals completion %
│  - Action: View goals, submit feedback
│
├─ KPICard: My Training
│  - Enrolled courses: 2
│  - Completed this year: 3
│  - Action: Browse course catalog
│
├─ Card: Pending My Actions
│  - Leave requests from my team (if manager)
│  - Reviews I need to complete
│  - Feedback requests
│
└─ Card: My Documents
   - Recent documents
   - Expiring documents
   - Download payslips
```

---

## Section 3: Workforce Screens

### 3.1 Employee Directory (Employee List)

**URL**: `/zoiko-hr/employees`

**Layout**: Page Header + Filter Bar + Table + Sidebar Filters

**PageHeader Component:**
```
PageHeader
├─ Title: "Employee Directory"
├─ Description: "Manage and view all employees in your organization"
└─ Action Buttons:
   ├─ "+ New Employee" (blue button, icon: Plus)
   ├─ "Import" (gray button, icon: Upload)
   ├─ "Export" (gray button, icon: Download)
   └─ "Filters" (gray button, icon: SlidersHorizontal, on mobile)
```

**Filter Bar (Horizontal, above table):**
```
Grid (auto-fit columns)
├─ Search Input: By name, email, employee ID
├─ Dropdown: Department filter (multi-select)
├─ Dropdown: Status filter (Active, On Leave, Inactive, Terminated)
├─ Dropdown: Employment Type (Full-time, Part-time, Contract)
├─ Dropdown: Location (multi-select)
├─ Date Range Picker: Hire date range
└─ Button: "Clear Filters"
```

**ReusableTable: Employee List**
```
Columns:
├─ [Checkbox] (for bulk actions)
├─ Name (with avatar)
│  - Avatar (initials, colored background)
│  - First name + Last name
│  - Link to employee profile (underlined)
│  - Subtext: Job title in gray
├─ Email
│  - Email address (linked, copyable)
├─ Department
│  - Department name
│  - Subtext: Manager name
├─ Status
│  - Badge: ACTIVE (green), ON_LEAVE (amber), SUSPENDED (red), TERMINATED (gray)
├─ Location
│  - City, State
├─ Employment Type
│  - FULL_TIME, PART_TIME, CONTRACT
├─ Hire Date
│  - Format: MMM DD, YYYY
├─ Tenure
│  - Years of service (e.g., "2 years 3 months")
└─ Actions (dropdown menu)
   ├─ View Profile
   ├─ Edit
   ├─ Assign Role
   ├─ View Documents
   ├─ Terminate (if active)
   └─ Archive

Table Features:
├─ Sorting: Click column header to sort (name, email, hire date, tenure)
├─ Pagination: Show 25/50/100 rows per page
├─ Bulk Actions: Delete checkbox column
│  ├─ Select all checkbox in header
│  ├─ Bulk action toolbar appears: [Archive] [Assign Role] [Export]
├─ Row hover: Highlight row, show actions
├─ Empty state: "No employees found. Create your first employee or adjust filters."
└─ Loading state: Skeleton rows while data loads
```

**Sidebar Filters (Mobile-friendly collapsible):**
```
Card: Advanced Filters
├─ Department (Checkbox list, scrollable)
├─ Status (Radio buttons)
├─ Employment Type (Checkbox list)
├─ Location (Checkbox list)
├─ Designation (Searchable dropdown)
├─ Manager (Searchable dropdown)
├─ Tenure (Slider: 0-25 years)
└─ Buttons:
   ├─ "Apply Filters"
   └─ "Reset All"
```

---

### 3.2 Employee Directory (Alternative: Card View)

**Option for mobile or visual preference**

```
Grid (grid-cols-1 sm:grid-cols-2 lg:grid-cols-3)
└─ Card: Employee Card (per employee)
   ├─ Header: Avatar + Name + Job title
   ├─ Body:
   │  ├─ Department + Manager
   │  ├─ Email (linked)
   │  ├─ Phone
   │  ├─ Location
   │  └─ Status badge
   └─ Footer: [View Profile] [Edit] [More actions...]
```

---

### 3.3 Employee Profile

**URL**: `/zoiko-hr/employees/:employeeId`

**Layout**: Page Header + Tab Navigation + Tab Content

**PageHeader:**
```
Header Section
├─ Avatar (large, 96px)
├─ Name + Job title
├─ Department + Manager
├─ Status badge
├─ Contact info (email, phone)
└─ Action Buttons:
   ├─ "Edit Profile" (blue)
   ├─ "Send Message" (gray)
   ├─ "..." (dropdown: Download profile, Print, Share)
```

**Tab Navigation (Horizontal Tabs):**
```
Tabs:
├─ Overview (default)
├─ Employment
├─ Compensation
├─ Leave
├─ Attendance
├─ Documents
├─ Assets
├─ Performance
├─ Training
└─ Timeline
```

**Tab 1: Overview**
```
Grid (2 cols on tablet, 1 on mobile)
├─ Card: Personal Information
│  ├─ Full name
│  ├─ Email
│  ├─ Personal email
│  ├─ Phone
│  ├─ Date of birth (age)
│  ├─ Gender
│  ├─ Nationality
│  └─ Emergency contacts (list)
│
├─ Card: Current Employment
│  ├─ Employee ID
│  ├─ Status: ACTIVE (badge)
│  ├─ Hire date
│  ├─ Employment type
│  ├─ Job title
│  ├─ Department
│  ├─ Manager
│  ├─ Location
│  └─ Cost center
│
├─ Card: Reporting Structure
│  ├─ Direct manager (with link)
│  ├─ Dotted line manager(s) if any
│  ├─ Direct reports count
│  │  ├─ [View direct reports] (link to filtered list)
│  └─ Org chart (mini visualization)
│
└─ Card: Quick Actions
   ├─ [Assign to team]
   ├─ [Assign role]
   ├─ [View leave requests]
   ├─ [View performance reviews]
   └─ [Edit employment record]
```

**Tab 2: Employment**
```
Timeline/Accordion: Employment History
├─ Current Employment Record (expanded by default)
│  ├─ Designation
│  ├─ Department
│  ├─ Job level
│  ├─ Effective date
│  ├─ Reporting to
│  ├─ WFH eligible
│  ├─ Salary
│  └─ [Edit] button
│
├─ Previous Employment Record 1
│  ├─ Designation
│  ├─ Date range
│  ├─ Status at time
│  └─ [View details]
│
└─ Previous Employment Records (collapsed)
   └─ [View all...]

Card: Employment Timeline
├─ Vertical timeline of all employment events
├─ Events: Hire → Promotion → Transfer → Role change → etc.
├─ Format: Date + Event type + Details
└─ Download: [Export employment history]
```

**Tab 3: Compensation**
```
Card: Salary Information
├─ Current salary: $XX,XXX
├─ Salary effective date
├─ Payment frequency
├─ Currency
├─ [View salary structure]

Card: Salary History (Table)
├─ Columns: Effective Date, Salary, Change %, Change Type, Changed By
├─ Rows: Historical salary records (most recent first)
├─ Action: Click row to view details

Card: Bank Account
├─ Bank name
├─ Account type
├─ Last 4 digits (masked)
├─ Status: VERIFIED
├─ [Edit]

Card: Tax Information
├─ SSN (masked)
├─ Tax filing status
├─ Federal exemptions
├─ State
├─ [Edit W-4]

Card: Benefits
├─ Health insurance: Enrolled (plan name)
├─ Dental: Enrolled
├─ Vision: Enrolled
├─ 401(k): Enrolled ($XXX/month)
├─ HSA: Enrolled ($XXX/month)
└─ [Manage benefits]
```

**Tab 4: Leave**
```
Card: Leave Balances (Current Year)
├─ PTO: 12.5 / 20 days (62.5%) [progress bar]
├─ Sick: 5 / 5 days (100%) [progress bar]
├─ Personal: 2 / 3 days (67%) [progress bar]
└─ Other: Details

Card: Leave History (Table)
├─ Columns: Type, Start Date, End Date, Days, Status, Approver
├─ Rows: All leave requests (most recent first)
├─ Status badge: APPROVED (green), PENDING (amber), REJECTED (red)
├─ Action: Click row for details
└─ Download: [Export leave history]

Card: Upcoming Leave (Next 30 days)
├─ List of approved leave requests
├─ Format: Type + Dates + Days
├─ If none: "No leave scheduled in next 30 days"
```

**Tab 5: Attendance**
```
Card: Attendance Summary (Current Month)
├─ Total days: 20
├─ Present: 19
├─ Absent: 0
├─ Late: 1
├─ Attendance rate: 95%

Card: Month-by-Month Attendance
├─ Grid: Last 12 months
├─ Each month shows: Present%, Absent%, Late%
├─ Color coding: Green (good), Amber (caution), Red (low)
├─ Click to view daily details

Card: Daily Attendance Log (Table)
├─ Date picker: Select date range
├─ Columns: Date, In Time, Out Time, Duration, Status
├─ Status: PRESENT, ABSENT, LATE, LEAVE
├─ Pagination: 30 rows per page
```

**Tab 6: Documents**
```
Card: Documents (Table)
├─ Columns: Document Type, Name, Upload Date, Expiry Date, Status, Action
├─ Rows: All documents for employee
├─ Status badge: VALID (green), EXPIRING_SOON (amber), EXPIRED (red)
├─ Action: Download, Preview, Delete, Share
├─ Upload new: [+ Upload document] button

Document categories:
├─ Employment Agreements
├─ Certifications
├─ Background Check
├─ Performance Reviews
├─ Training Certificates
└─ Other
```

**Tab 7: Assets**
```
Card: Assigned Assets (Table)
├─ Columns: Asset ID, Asset Type, Name, Assigned Date, Status, Action
├─ Rows: All assets assigned to employee
├─ Status: ACTIVE, RETURNED, MISSING
├─ Action: View details, Return asset, Report missing
├─ If none: "No assets assigned"

Card: Asset History
├─ Timeline of asset assignments and returns
├─ Format: Date + Asset + Event type (Assigned/Returned)
```

**Tab 8: Performance**
```
Card: Current Performance Review Cycle
├─ Cycle name
├─ Status: NOT_STARTED, IN_PROGRESS, SUBMITTED, COMPLETED
├─ Self-review: [Submit/View]
├─ Manager review: [View] (if completed)
├─ Rating: X/5 (if available)
├─ [View full review]

Card: Performance History (Table)
├─ Columns: Cycle Year, Type, Rating, Status, Submitted Date
├─ Rows: All performance reviews
├─ Action: Click to view review

Card: Goals (Table)
├─ Columns: Goal, Type, Target Date, Progress, Status
├─ Rows: Current goals
├─ Progress bar: Visual progress indicator
├─ Status: ACTIVE, COMPLETED, ABANDONED
├─ Action: View goal, Update progress
```

**Tab 9: Training**
```
Card: Enrolled Courses
├─ Course name
├─ Provider
├─ Enrollment date
├─ Completion date (if completed)
├─ Status: IN_PROGRESS, COMPLETED, NOT_STARTED
├─ Certification (if applicable)
├─ Action: View details, Mark complete

Card: Certifications
├─ Certification name
├─ Issuer
├─ Issue date
├─ Expiry date
├─ Status: VALID, EXPIRING_SOON, EXPIRED
├─ Action: Renew, Download certificate

Card: Skills Assessments
├─ Skill name
├─ Proficiency level (1-5)
├─ Assessed date
├─ Assessed by
└─ Action: View details
```

**Tab 10: Timeline**
```
Vertical Timeline: All Events
├─ Event: Employee created/Hired
├─ Event: Employment record created
├─ Event: Salary change
├─ Event: Department transfer
├─ Event: Leave request
├─ Event: Performance review submitted
├─ Event: Training completed
├─ Event: Asset assigned
└─ Format:
   ├─ Date + Time
   ├─ Event type (icon)
   ├─ Event description
   ├─ Actor (who triggered)
   ├─ Impact (what changed)
   └─ Collapsible details

Filtering:
├─ Filter by event type
├─ Filter by date range
├─ Search events
└─ Export timeline
```

---

### 3.4 Employee Timeline (Alternative View)

**URL**: `/zoiko-hr/employees/:employeeId/timeline`

Full-screen timeline view of employee career progression.

```
Vertical Timeline
├─ Header: Employee name, profile summary
├─ Timeline: Chronological events
│  ├─ Hire event (green)
│  ├─ Onboarding completed (blue)
│  ├─ First performance review (purple)
│  ├─ Promotion (gold)
│  ├─ Transfer (gray)
│  ├─ Leave request (cyan)
│  ├─ Training completed (blue)
│  ├─ Salary change (green)
│  ├─ Certification earned (purple)
│  └─ Termination (red, if applicable)
├─ Detail panel: Click event to see details
└─ Export: Download timeline as PDF
```

---

### 3.5 Employee History View

**URL**: `/zoiko-hr/employees/:employeeId/history`

Point-in-time snapshots for compliance and audit.

```
Card: History Snapshots
├─ Date picker: Select snapshot date
├─ Snapshot details:
│  ├─ Employee status at that date
│  ├─ Employment record at that date
│  ├─ Salary at that date
│  ├─ Leave balance at that date
│  ├─ Manager at that date
│  └─ Location at that date
├─ Comparison: Side-by-side with current data
└─ Audit: Who created this snapshot and when
```

---

## Section 4: Employee Profile Architecture

### 4.1 360° Profile Design

**Comprehensive employee profile with integrated information model:**

The Employee Profile (Section 3.3) is the 360° view. Key integration points:

1. **Data Ownership**: Single source of truth for employee data
   - HR Admin: Full access to all tabs
   - Manager: View Overview, Employment, Performance, Training (if direct report)
   - Employee: View Overview (public data), own leave/documents/training
   - Finance: View Compensation (with restrictions)

2. **Tab Architecture**:
   - Overview: Current state snapshot
   - Employment: Career history, org chart position
   - Compensation: Salary, benefits, payroll profile
   - Leave: Balance, history, upcoming
   - Attendance: Time tracking (if integrated with ZoikoTime)
   - Documents: Storage, expiry, audit trail
   - Assets: Equipment, assignments, returns
   - Performance: Reviews, goals, feedback
   - Training: Courses, certifications, skills
   - Timeline: Complete audit trail of all changes

3. **Data Consistency**:
   - Changes to one tab auto-update related tabs
   - Status change → triggers leave policy evaluation
   - Salary change → triggers audit event, notification to finance
   - Manager change → auto-updates reporting relationships
   - Termination → starts offboarding workflow

---

## Section 5: Organization Screens

### 5.1 Departments

**URL**: `/zoiko-hr/departments`

**Layout**: Page Header + Filter Bar + Table + Tree View Toggle

**Tree View (Default for small organizations)**
```
Expandable Tree
├─ Organization: Acme Corp
   ├─ Division: Engineering
   │  ├─ BusinessUnit: Platform
   │  │  ├─ Department: Backend Services
   │  │  │  ├─ Team: Database (12 employees)
   │  │  │  └─ Team: API Gateway (8 employees)
   │  │  └─ Department: Frontend (10 employees)
   │  └─ BusinessUnit: Infrastructure
   │     └─ Department: DevOps (6 employees)
   └─ Division: Sales
      ├─ Department: Enterprise Sales (15 employees)
      └─ Department: Customer Success (12 employees)

Features:
├─ Expand/collapse each node
├─ Hover: Show department actions (Edit, View, Add child)
├─ Click: Go to department detail page
├─ Drag-drop: Reorganize (with confirmation)
└─ Search: Filter tree by department name
```

**Table View (For large organizations)**
```
ReusableTable: Departments
├─ Columns:
│  ├─ Department Name (with hierarchy indicator)
│  ├─ Manager
│  ├─ Parent Department
│  ├─ Location
│  ├─ Headcount
│  ├─ Budget
│  ├─ Status
│  └─ Actions
├─ Rows: All departments
├─ Sort: By name, manager, headcount, budget
├─ Filter: By parent department, location, status
└─ Action: Click row to view department detail
```

**Department Detail Page**
```
PageHeader
├─ Department name
├─ Manager name
├─ Headcount
└─ [Edit] [Archive] [...]

Tabs:
├─ Overview
│  ├─ Department info (name, code, description)
│  ├─ Manager
│  ├─ Parent department
│  ├─ Location
│  ├─ Cost center
│  ├─ Budget
│  └─ Headcount metrics
│
├─ Team Members (Table)
│  ├─ Columns: Name, Job Title, Manager, Hire Date, Status
│  ├─ Rows: All employees in department
│  ├─ Filter: By status, job level
│  └─ Action: Click to view employee profile
│
├─ Sub-departments (if applicable)
│  ├─ List of child departments
│  ├─ Each: Name + Manager + Headcount
│  └─ [+ Add sub-department]
│
├─ Documents
│  ├─ Department policies
│  ├─ Org charts
│  ├─ Budgets
│
└─ Settings
   ├─ Edit name, description
   ├─ Assign manager
   ├─ Set location, cost center
   └─ Archive department
```

---

### 5.2 Org Chart

**URL**: `/zoiko-hr/org-chart`

**Interactive org chart visualization**

```
Visual Organization Chart
├─ Display mode:
│  ├─ Hierarchical (top-down)
│  ├─ Org tree (expandable)
│  └─ Matrix (roles + departments)
│
├─ Node: Employee card
│  ├─ Name
│  ├─ Job title
│  ├─ Department
│  ├─ Avatar
│  └─ Hover: Show details + [View profile] link
│
├─ Connections: Reporting lines
│  ├─ Solid line: Primary reporting
│  ├─ Dotted line: Dotted reporting
│
├─ Filters:
│  ├─ Filter by department
│  ├─ Filter by location
│  ├─ Highlight key roles (executives, managers)
│  └─ Search: Find employee by name
│
├─ Actions:
│  ├─ Export: PDF, PNG, SVG
│  ├─ Print: Org chart
│  ├─ Share: Send chart to team
│
└─ Drill-down: Click node to open employee profile
```

**Alternative: Org Tree (Text-based for accessibility)**
```
Text-based tree for screen readers
├─ CEO
│  ├─ VP Engineering (reports to CEO)
│  │  ├─ Engineering Manager 1 (reports to VP)
│  │  │  ├─ Engineer 1
│  │  │  ├─ Engineer 2
│  │  │  └─ Engineer 3
│  │  └─ Engineering Manager 2 (reports to VP)
│  │     ├─ Engineer 4
│  │     └─ Engineer 5
│  └─ VP Sales (reports to CEO)
│     ├─ Sales Manager
│     │  ├─ Sales Rep 1
│     │  └─ Sales Rep 2
```

---

### 5.3 Designations

**URL**: `/zoiko-hr/designations`

**Job titles and levels**

```
ReusableTable: Designations
├─ Columns:
│  ├─ Title
│  ├─ Level (JUNIOR, MID, SENIOR, LEAD, MANAGER, DIRECTOR, VP, EXECUTIVE)
│  ├─ Category (TECHNICAL, MANAGEMENT, SUPPORT, SALES, etc.)
│  ├─ Grade
│  ├─ Salary Range (Min - Max)
│  ├─ Current Holders (count)
│  └─ Actions
│
├─ Rows: All designations
├─ Sort: By title, level, salary
├─ Filter: By category, level, active/archived
└─ Add: [+ New Designation]

Designation Detail:
├─ Title
├─ Level
├─ Category
├─ Grade reference
├─ Min/Max salary
├─ Description
├─ Employees holding this designation (list)
└─ [Edit] [Archive]
```

---

### 5.4 Locations

**URL**: `/zoiko-hr/locations`

**Office and work locations**

```
ReusableTable or Card Grid: Locations
├─ Card per location:
│  ├─ Name
│  ├─ Type (HEADQUARTERS, OFFICE, REMOTE, HYBRID)
│  ├─ Address
│  ├─ City, State, Country
│  ├─ Timezone
│  ├─ Employee count
│  ├─ Status
│  └─ [View details] [Edit]

OR Table:
├─ Columns: Name, Address, City, Country, Timezone, Employees, Status
├─ Sort: By name, employee count
├─ Filter: By country, timezone, type
└─ Add: [+ New Location]

Location Detail:
├─ Name + Type
├─ Full address
├─ Timezone
├─ Capacity
├─ Facilities (parking, cafeteria, etc.)
├─ Holiday calendar (region-specific)
├─ Employees (list)
└─ [Edit] [Archive]
```

---

## Section 6: Leave Screens

### 6.1 Leave Requests

**URL**: `/zoiko-hr/leave-requests`

**Leave request management**

```
Filter Bar:
├─ Search: By employee name, request ID
├─ Filter: By status (SUBMITTED, APPROVED, REJECTED, CANCELLED)
├─ Filter: By leave type (PTO, SICK, PERSONAL, UNPAID)
├─ Filter: By date range (requested date or leave date)
├─ Filter: By requester (current user, team, all)

ReusableTable: Leave Requests
├─ Columns:
│  ├─ Employee (name + department)
│  ├─ Leave Type
│  ├─ Start Date
│  ├─ End Date
│  ├─ Days
│  ├─ Status badge
│  ├─ Requested Date
│  ├─ Approver
│  └─ Actions
│
├─ Rows: All leave requests (manager/HR see team; employees see own)
├─ Status badges: PENDING (amber), APPROVED (green), REJECTED (red), CANCELLED (gray)
├─ Sort: By date, status, employee
├─ Bulk actions: Approve, Reject, Cancel
└─ Row click: View/edit request

Pending Approvals (for managers):
├─ Highlighted in different section/color
├─ Count badge on sidebar link
├─ Quick approve/reject buttons in table

Leave Request Detail:
├─ Employee info + avatar
├─ Leave type + dates
├─ Days requested
├─ Reason (optional)
├─ Attachments (if medical leave requires cert)
├─ Current balance impact
├─ History (previous requests for comparison)
├─ Approval workflow:
│  ├─ Current approver
│  ├─ Decision buttons: [Approve] [Reject]
│  ├─ Comments field
│  └─ Status: PENDING → APPROVED/REJECTED
└─ Escalation: If >N days, auto-escalate to HR
```

---

### 6.2 Leave Policies

**URL**: `/zoiko-hr/leave-policies`

**Organization leave policies**

```
ReusableTable: Leave Policies
├─ Columns:
│  ├─ Policy Name
│  ├─ Leave Type
│  ├─ Days Per Year
│  ├─ Effective Date
│  ├─ Expiry Date
│  ├─ Status
│  └─ Actions

Rows: All leave policies
├─ Filter: By status (ACTIVE, ARCHIVED)
├─ Sort: By leave type, effective date
└─ Add: [+ New Policy]

Policy Detail:
├─ Name + Version
├─ Leave type
├─ Days per year / Accruals per month
├─ Carryover limit
├─ Min notice required
├─ Max consecutive days
├─ Requires approval? Yes/No
├─ Effective date range
├─ [Edit] [Archive] [Duplicate for next year]
```

---

### 6.3 Leave Calendar

**URL**: `/zoiko-hr/leave-calendar`

**Visual calendar of leave and holidays**

```
Calendar View (Month/Week/Day):
├─ Month view (default):
│  ├─ Grid: 7 days x 4-5 weeks
│  ├─ Cell: Date + Leave indicators
│  │  ├─ Holiday (red background)
│  │  ├─ Company-wide leave event
│  │  ├─ Team member on leave (color per person or aggregated)
│  │  └─ Headcount in office vs. remote vs. on leave
│  ├─ Legend: Color key for leave types
│  └─ Hover: Show who's on leave that day
│
├─ Week view: More detail
│  ├─ Grid: 7 days (columns)
│  ├─ Rows: Team members
│  ├─ Cell: Leave status (color block)
│  └─ Hover: Show leave type, dates, approver
│
└─ Day view: Detailed
   ├─ Single day
   ├─ List all employees on leave
   ├─ Headcount in office
   └─ Headcount remote/WFH

Filters:
├─ Show: All employees, my team, department, location
├─ Filter: By leave type
├─ Highlight: Holidays, company events
└─ Team member filter (select specific people)

Actions:
├─ Click leave cell: View leave details
├─ [+ New leave request] button
├─ Drag-drop: Reschedule leave (if allowed)
├─ Export: Calendar view as PDF/ICS
└─ Share: Calendar link to team
```

---

### 6.4 Leave Balances

**URL**: `/zoiko-hr/leave-balances`

**Leave balance tracking**

```
Filter:
├─ Search: By employee name
├─ Filter: By department, location
├─ Filter: By leave type (PTO, SICK, PERSONAL, etc.)
├─ Filter: By year

ReusableTable: Leave Balances
├─ Columns:
│  ├─ Employee
│  ├─ Leave Type
│  ├─ Year
│  ├─ Allocated Days
│  ├─ Used Days
│  ├─ Pending Days
│  ├─ Available Days
│  ├─ Carryover Days
│  └─ Actions
│
├─ Rows: All employee leave balances
├─ Sort: By employee, leave type, available days
├─ Filter: By year, leave type
└─ Export: CSV (for payroll, compliance)

Balance Detail:
├─ Employee: Name + Photo
├─ Leave type breakdown:
│  ├─ PTO:
│  │  ├─ Allocated: 20 days
│  │  ├─ Used: 5 days (25%)
│  │  ├─ Pending: 2 days (approval pending)
│  │  ├─ Available: 13 days
│  │  ├─ Carryover from last year: 2 days
│  │  └─ Progress bar: Visual representation
│  ├─ Sick: [Similar breakdown]
│  └─ Personal: [Similar breakdown]
│
├─ Year-over-year comparison
├─ Expiring balance alerts
└─ Bulk adjust: If admin
```

---

## Section 7: Recruitment Screens

### 7.1 Job Openings

**URL**: `/zoiko-hr/job-openings`

**Recruitment requisitions**

```
Filter Bar:
├─ Search: By job title, opening ID
├─ Filter: By status (DRAFT, OPEN, CLOSED, FILLED, ON_HOLD)
├─ Filter: By department, location
├─ Filter: By urgency (LOW, MEDIUM, HIGH, CRITICAL)
├─ Filter: By posted date

ReusableTable: Job Openings
├─ Columns:
│  ├─ Job Title
│  ├─ Department
│  ├─ Location
│  ├─ Openings (count)
│  ├─ Posted Date
│  ├─ Closing Date
│  ├─ Applications (count)
│  ├─ Status badge
│  ├─ Urgency badge
│  └─ Actions
│
├─ Status badges: DRAFT (gray), OPEN (green), CLOSED (red), FILLED (blue)
├─ Sort: By job title, posted date, applications
├─ Bulk actions: Publish, Close, Extend deadline
└─ Add: [+ New Job Opening]

Job Opening Detail:
├─ Header: Title + Department + Location
├─ Tabs:
│  ├─ Overview
│  │  ├─ Job title + Designation level
│  │  ├─ Department + Location
│  │  ├─ Reports to
│  │  ├─ Job description
│  │  ├─ Responsibilities (list)
│  │  ├─ Requirements (must-have)
│  │  ├─ Nice-to-have (preferred)
│  │  ├─ Salary band (min-max)
│  │  ├─ Employment type (full-time, part-time, contract)
│  │  ├─ Urgency
│  │  ├─ Posted date / Closing date
│  │  ├─ [Publish] [Close] [Archive]
│  │  └─ [Edit]
│  │
│  ├─ Candidates (Table)
│  │  ├─ Columns: Name, Status, Applied Date, Rating, Stage
│  │  ├─ Status: APPLIED, SCREENING, SHORTLISTED, INTERVIEWED, OFFERED, HIRED
│  │  ├─ Sorting: By name, applied date, rating
│  │  └─ Actions: [View profile] [Move to next stage] [Reject]
│  │
│  ├─ Hiring Pipeline
│  │  ├─ Visual funnel chart
│  │  ├─ Stages: Applications → Screening → Interviews → Offers → Hired
│  │  ├─ Show: Count at each stage, conversion rate
│  │  ├─ Average time in stage
│  │  └─ [View candidates at each stage]
│  │
│  ├─ Interview Schedule
│  │  ├─ Calendar of scheduled interviews
│  │  ├─ Format: Candidate name + Interview type + Interviewer + Time
│  │  └─ Actions: [Reschedule] [Send reminder] [View interview feedback]
│  │
│  └─ Analytics
│     ├─ Time to hire (avg)
│     ├─ Total applications
│     ├─ Conversion rate (%)
│     ├─ Source breakdown (where candidates came from)
│     └─ Top sources (ranked)
```

---

### 7.2 Candidates

**URL**: `/zoiko-hr/candidates`

**Candidate pipeline management**

```
Filter Bar:
├─ Search: By name, email, phone
├─ Filter: By status (ACTIVE, REJECTED, HIRED, ON_HOLD, WITHDRAWN)
├─ Filter: By source channel (CAREER_SITE, LINKEDIN, REFERRAL, AGENCY, etc.)
├─ Filter: By job opening
├─ Filter: By application date

ReusableTable: Candidates
├─ Columns:
│  ├─ Name (with avatar)
│  ├─ Job Applied For
│  ├─ Applied Date
│  ├─ Current Stage
│  ├─ Rating (stars)
│  ├─ Source
│  ├─ Status badge
│  └─ Actions
│
├─ Status badges: ACTIVE, REJECTED, HIRED, ON_HOLD, WITHDRAWN
├─ Sort: By name, applied date, rating
├─ Bulk actions: Reject, Send interview invite
└─ Row click: View candidate profile

Candidate Detail:
├─ Header: Name + Avatar + Job title
├─ Contact: Email, Phone, LinkedIn
├─ Tabs:
│  ├─ Profile
│  │  ├─ Resume (PDF viewer + download)
│  │  ├─ Cover letter
│  │  ├─ Source
│  │  ├─ Referred by (if applicable)
│  │  ├─ Status
│  │  ├─ Notes
│  │  └─ [Edit candidate info]
│  │
│  ├─ Application
│  │  ├─ Job opening applied for
│  │  ├─ Application date
│  │  ├─ Application status (SUBMITTED, SCREENING, SHORTLISTED)
│  │  ├─ Screener rating (1-5)
│  │  ├─ Screening notes
│  │  ├─ [Move to next stage] button
│  │  └─ [Schedule interview] button
│  │
│  ├─ Interviews
│  │  ├─ Interview history (table)
│  │  ├─ Columns: Type, Date, Interviewer, Rating, Status
│  │  ├─ Interview feedback (expandable)
│  │  ├─ [Schedule new interview]
│  │  └─ [View interview notes]
│  │
│  ├─ Offer (if applicable)
│  │  ├─ Offer details
│  │  ├─ Salary, benefits, start date
│  │  ├─ Offer status (DRAFT, EXTENDED, ACCEPTED, REJECTED)
│  │  ├─ [Edit offer] [Send to candidate] [View response]
│  │  └─ [Make another offer]
│  │
│  └─ Timeline
│     ├─ Applied
│     ├─ Screening completed
│     ├─ First interview
│     ├─ Offer extended
│     ├─ Offer accepted/rejected
│     └─ Hired (if applicable)

Actions:
├─ [Schedule interview]
├─ [Send message]
├─ [Reject]
├─ [Hold]
├─ [Move to next stage]
└─ [Make offer]
```

---

### 7.3 Interviews

**URL**: `/zoiko-hr/interviews`

**Interview scheduling and feedback**

```
Calendar View:
├─ Calendar (month/week view)
├─ Interview events (color-coded by type)
├─ Hover: Show candidate name, job, interviewer, time
├─ Click: Edit interview, view feedback

ReusableTable: Interview Schedule
├─ Columns:
│  ├─ Candidate
│  ├─ Job
│  ├─ Interview Type
│  ├─ Scheduled Date
│  ├─ Interviewer
│  ├─ Status (SCHEDULED, COMPLETED, CANCELLED, NO_SHOW)
│  └─ Actions
│
├─ Status badges: SCHEDULED (blue), COMPLETED (green), CANCELLED (gray), NO_SHOW (red)
├─ Sort: By date, candidate, interviewer
├─ Filter: By type, status, interviewer, date range
└─ Add: [+ Schedule interview]

Interview Detail:
├─ Candidate info
├─ Job opening
├─ Interview type: PHONE_SCREEN, TECHNICAL, BEHAVIORAL, SYSTEM_DESIGN, PANEL, HR_ROUND, FINAL
├─ Scheduled date + time
├─ Duration: XX minutes
├─ Interviewers (list with links)
├─ Location/Meeting link
├─ Status: SCHEDULED, COMPLETED, CANCELLED
├─ [Reschedule] [Send reminder] [Cancel]
│
├─ Interview Feedback (if completed):
│  ├─ For each interviewer:
│  │  ├─ Communication skills: 1-5 rating
│  │  ├─ Technical skills: 1-5 rating
│  │  ├─ Culture fit: 1-5 rating
│  │  ├─ Leadership potential: 1-5 rating
│  │  ├─ Strengths (text)
│  │  ├─ Concerns (text)
│  │  ├─ Overall recommendation: STRONG_YES, YES, MAYBE, NO, STRONG_NO
│  │  └─ Comments
│  │
│  ├─ Aggregated ratings (average across interviewers)
│  ├─ Consensus recommendation
│  └─ [Share feedback with hiring manager]
│
└─ Actions: [Schedule next interview] [Make offer] [Reject] [Hold]
```

---

### 7.4 Offers

**URL**: `/zoiko-hr/offers`

**Job offers**

```
Filter:
├─ Filter: By status (DRAFT, EXTENDED, ACCEPTED, REJECTED, EXPIRED)
├─ Filter: By job opening
├─ Filter: By date range

ReusableTable: Offers
├─ Columns:
│  ├─ Candidate
│  ├─ Job
│  ├─ Salary
│  ├─ Start Date
│  ├─ Extended Date
│  ├─ Response Date
│  ├─ Status badge
│  └─ Actions
│
├─ Status badges: DRAFT, EXTENDED, ACCEPTED (green), REJECTED (red), EXPIRED (gray)
├─ Sort: By date, candidate, status
└─ Add: [+ Create offer]

Offer Detail:
├─ Header: Candidate name + Job title
├─ Offer details:
│  ├─ Salary amount + currency
│  ├─ Benefits (health, retirement, etc.)
│  ├─ Start date
│  ├─ Employment type (full-time, part-time, contract)
│  ├─ Terms (vacation, signing bonus, etc.)
│  ├─ Offer letter (PDF preview)
│  └─ [Download offer letter]
│
├─ Offer workflow:
│  ├─ Status: DRAFT → EXTENDED → ACCEPTED/REJECTED
│  ├─ Current status display
│  ├─ Extended date (when sent to candidate)
│  ├─ Response deadline
│  ├─ Candidate response: ACCEPTED, REJECTED, PENDING
│  ├─ Response date (if responded)
│  ├─ Response notes (if rejected, why?)
│  │
│  ├─ Buttons:
│  │  ├─ [Send offer] (if draft)
│  │  ├─ [Resend offer] (if pending response)
│  │  ├─ [Edit offer] (if draft)
│  │  ├─ [Accept response] (if accepted by candidate)
│  │  ├─ [Reject candidate] (if rejected by candidate)
│  │  └─ [Archive]
│
├─ Offer approval workflow (if required):
│  ├─ Approver: [Approve] [Reject]
│  ├─ Comments field
│
└─ On acceptance:
   └─ [Create employee record] button
      ├─ Pre-fill with offer details (job title, salary, start date)
      ├─ Launch onboarding workflow
      └─ Send welcome email to candidate
```

---

### 7.5 Hiring Pipeline

**URL**: `/zoiko-hr/hiring-pipeline`

**Visual recruitment funnel**

```
Funnel Chart:
├─ Stage 1: Applications
│  ├─ Count: 150
│  ├─ % of total: 100%
│  └─ Candidates (list link)
│
├─ Stage 2: Screening
│  ├─ Count: 45
│  ├─ % converted: 30%
│  └─ Candidates (list link)
│
├─ Stage 3: Shortlisted
│  ├─ Count: 20
│  ├─ % converted: 44%
│  └─ Candidates (list link)
│
├─ Stage 4: Interviews
│  ├─ Count: 15
│  ├─ % converted: 75%
│  └─ Candidates (list link)
│
├─ Stage 5: Offers
│  ├─ Count: 5
│  ├─ % converted: 33%
│  └─ Candidates (list link)
│
└─ Stage 6: Hired
   ├─ Count: 3
   ├─ % converted: 60%
   └─ New employees (list link)

Summary Metrics:
├─ Total applications: 150
├─ Overall conversion rate: 2% (3 hired / 150 applied)
├─ Time to hire (average): 28 days
├─ Hiring velocity: 3 hired per month
├─ Top source: LinkedIn (40%)
└─ Bottleneck identification: Highlight slowest stage

Filters:
├─ By date range
├─ By job opening
├─ By department
└─ By source channel

Export:
├─ Download as image
└─ Export metrics to CSV
```

---

## Section 8: Onboarding Screens

### 8.1 Onboarding Dashboard

**URL**: `/zoiko-hr/onboarding`

**New hire onboarding management**

```
Filter:
├─ Filter: By status (DRAFT, IN_PROGRESS, PAUSED, COMPLETED, CANCELLED)
├─ Filter: By start date range
├─ Filter: By department, location
├─ Sort: By start date, progress

Card Grid or Table: Active Onboarding Plans
├─ Card per new hire:
│  ├─ Avatar + Name
│  ├─ Job title
│  ├─ Start date
│  ├─ Department
│  ├─ Progress bar (% complete)
│  ├─ Manager
│  ├─ Buddy assigned? (Yes/No badge)
│  ├─ Current task: "IT Equipment Setup"
│  ├─ Days until completion deadline
│  └─ Actions: [View plan] [Edit] [Complete]
│
└─ OR Table format (for list view)

Summary Dashboard:
├─ KPICard: Active Onboarding (count)
├─ KPICard: Completed This Month (count)
├─ KPICard: Average Onboarding Duration (days)
├─ Chart: Onboarding completion trend
└─ Chart: Bottleneck identification (which tasks take longest?)

Actions:
├─ [+ New Onboarding Plan] (for manually created plans)
├─ [+ Import template] (to use standard onboarding template)
└─ Bulk actions: [Complete all] [Extend deadline]
```

---

### 8.2 Onboarding Plan Detail

**URL**: `/zoiko-hr/onboarding/:planId`

**Detailed onboarding plan tracking**

```
Header:
├─ New hire name + photo
├─ Job title, department, start date
├─ Onboarding end date
├─ Progress bar (overall % complete)
├─ Status: IN_PROGRESS
└─ Assigned coordinator, Buddy

Tabs:
├─ Checklists (default)
│  ├─ Card per category:
│  │  ├─ Category name (IT, HR, Training, Compliance, Facilities, Buddy, Manager)
│  │  ├─ Checklist progress: X / Y tasks complete
│  │  ├─ Progress bar
│  │  ├─ Expandable task list:
│  │  │  ├─ Task 1: "Create IT account" [checkbox] [Done by: IT Manager]
│  │  │  ├─ Task 2: "Set up laptop" [checkbox] [Done by: IT Manager]
│  │  │  ├─ Task 3: "Provide office tour" [checkbox] [Done by: Facilities]
│  │  │  └─ Task N: ...
│  │  └─ [Mark category complete] (if all tasks done)
│  │
│  └─ Buttons: [Add task] [Complete plan]
│
├─ Timeline
│  ├─ Vertical timeline of onboarding milestones
│  ├─ Hire date
│  ├─ First day (today)
│  ├─ End of week 1
│  ├─ End of week 2
│  ├─ End of month
│  ├─ End of onboarding period (3 months later)
│  └─ Planned date for each milestone
│
├─ Tasks (Table view)
│  ├─ Columns: Task, Category, Assigned To, Due Date, Status, Priority
│  ├─ Status: NOT_STARTED, IN_PROGRESS, COMPLETED
│  ├─ Completion date tracking
│  ├─ Sort: By due date, status
│  └─ Actions: [Complete] [Reassign] [Extend deadline]
│
├─ Documents
│  ├─ Required documents for onboarding (form list)
│  ├─ Status: PENDING, SUBMITTED, VERIFIED
│  ├─ [Request from employee] [Upload/receive]
│  └─ Examples: I-9 form, W-4, signed agreements
│
├─ Meeting Schedule
│  ├─ Scheduled 1:1s with manager, HR, team leads
│  ├─ Buddy meetings scheduled
│  ├─ Training sessions
│  ├─ [Schedule meeting] button
│  └─ Calendar integration
│
└─ Notes & Feedback
   ├─ Notes field for onboarding coordinator
   ├─ Feedback from manager
   ├─ Feedback from buddy
   ├─ Any blockers or issues
   └─ Sign-off: Manager confirms onboarding complete
```

---

## Section 9: Offboarding Screens

### 9.1 Exit Requests

**URL**: `/zoiko-hr/offboarding` or `/zoiko-hr/exit-requests`

**Employee departure management**

```
Filter:
├─ Filter: By status (SUBMITTED, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED)
├─ Filter: By exit type (RESIGNATION, TERMINATION, RETIREMENT, LAYOFF)
├─ Filter: By last working date range
├─ Sort: By last working date

ReusableTable: Exit Requests
├─ Columns:
│  ├─ Employee
│  ├─ Exit Type
│  ├─ Resignation/Termination Date
│  ├─ Last Working Date
│  ├─ Department
│  ├─ Status badge
│  ├─ Progress (% of clearance tasks complete)
│  └─ Actions
│
├─ Status: SUBMITTED, APPROVED, IN_PROGRESS, COMPLETED, CANCELLED
├─ Sort: By date, status, department
└─ Add: [+ New Exit Request]

Exit Request Detail:
├─ Header: Employee name + Last working date
├─ Tabs:
│  ├─ Overview
│  │  ├─ Exit type
│  │  ├─ Resignation date (if employee-initiated)
│  │  ├─ Last working date
│  │  ├─ Notice period (contractual)
│  │  ├─ Reason for departure
│  │  ├─ Notes
│  │  ├─ Final pay calculation (linked to ZoikoPayroll)
│  │  ├─ Status: SUBMITTED → APPROVED → IN_PROGRESS → COMPLETED
│  │  └─ [Approve] [Reject] (if not approved)
│  │
│  ├─ Clearance Tasks
│  │  ├─ Equipment return checklist
│  │  ├─ IT access revocation checklist
│  │  ├─ Knowledge transfer tasks
│  │  ├─ Benefits COBRA info
│  │  ├─ Each task:
│  │  │  ├─ Task name
│  │  │  ├─ Assigned to
│  │  │  ├─ Due date
│  │  │  ├─ Status: NOT_STARTED, IN_PROGRESS, COMPLETED
│  │  │  └─ Completion date
│  │  │
│  │  ├─ Sort: By due date, status
│  │  ├─ Progress bar: X% clearance tasks complete
│  │  └─ [Mark all complete] (if all done)
│  │
│  ├─ Exit Interview
│  │  ├─ Interview status: NOT_SCHEDULED, SCHEDULED, COMPLETED
│  │  ├─ Scheduled date + time
│  │  ├─ Interviewer
│  │  ├─ [Schedule interview] [Edit]
│  │  │
│  │  ├─ If completed, show results:
│  │  │  ├─ Overall experience (1-5)
│  │  │  ├─ Work environment rating
│  │  │  ├─ Management support rating
│  │  │  ├─ Compensation & benefits rating
│  │  │  ├─ Career growth rating
│  │  │  ├─ Reasons for leaving
│  │  │  ├─ Suggestions for improvement
│  │  │  ├─ Willing to be rehired?
│  │  │  └─ Feedback notes
│  │  │
│  │  └─ [View full interview]
│  │
│  ├─ Knowledge Transfer
│  │  ├─ Knowledge domains to transfer
│  │  ├─ Replacement employee (if assigned)
│  │  ├─ Transfer status per domain
│  │  ├─ [Add knowledge domain] [Assign replacement]
│  │  └─ Documentation links
│  │
│  ├─ Final Settlement
│  │  ├─ Last pay date
│  │  ├─ Unused PTO payout
│  │  ├─ Severance (if applicable)
│  │  ├─ Final net payment
│  │  ├─ Status: CALCULATED, APPROVED, PAID
│  │  ├─ [View detailed calculation]
│  │  └─ [Process final payment]
│  │
│  └─ Timeline
│     ├─ Exit request submitted
│     ├─ Approved
│     ├─ Exit interview completed
│     ├─ Clearance tasks completed
│     ├─ Final payment made
│     └─ Employee record archived

Actions:
├─ [Edit exit request]
├─ [Schedule exit interview]
├─ [Assign clearance tasks]
├─ [Calculate final settlement]
├─ [Archive]
└─ [Rehire?] (for former employees)
```

---

## Section 10: Documents & Assets

### 10.1 Employee Documents

**URL**: `/zoiko-hr/documents`

**Document storage and management**

```
Filter:
├─ Search: By document name, type
├─ Filter: By document type (Employment Agreements, Certifications, Background Check, etc.)
├─ Filter: By upload date range
├─ Filter: By expiry status (Valid, Expiring Soon, Expired)
├─ Sort: By expiry date, upload date

Card Grid or Table: Documents
├─ Card per document:
│  ├─ Document icon (PDF, Word, etc.)
│  ├─ Document name
│  ├─ Type
│  ├─ Upload date
│  ├─ Expiry date (if applicable)
│  ├─ Status badge (VALID, EXPIRING_SOON, EXPIRED)
│  ├─ Owner/Uploader
│  └─ Actions: [View] [Download] [Delete] [Share]
│
└─ OR Table format for list view

Bulk Actions:
├─ [Download all] (as ZIP)
├─ [Archive all]
└─ [Request renewal] (for expiring documents)

Upload Document:
├─ [+ Upload document] button
├─ Modal or dedicated page:
│  ├─ Document type (dropdown)
│  ├─ File upload (drag-drop)
│  ├─ Description (optional)
│  ├─ Expiry date (if applicable)
│  ├─ Make public? (if shareable)
│  ├─ [Upload]
│  └─ Encryption: Automatically encrypted at rest

Document Audit Trail:
├─ Who uploaded
├─ When uploaded
├─ Who viewed (access log)
├─ Modification history
└─ Deletion history (if soft-deleted)
```

---

### 10.2 Assets

**URL**: `/zoiko-hr/assets`

**Equipment and asset tracking**

```
Filter:
├─ Search: By asset tag, name, model
├─ Filter: By asset type (LAPTOP, PHONE, MONITOR, etc.)
├─ Filter: By status (AVAILABLE, ASSIGNED, IN_REPAIR, RETIRED, LOST)
├─ Filter: By assigned employee
├─ Sort: By asset tag, status

ReusableTable: Assets
├─ Columns:
│  ├─ Asset Tag / ID
│  ├─ Name (model)
│  ├─ Type
│  ├─ Serial Number
│  ├─ Assigned Employee (if assigned)
│  ├─ Assignment Date
│  ├─ Status
│  ├─ Depreciation Value
│  └─ Actions
│
├─ Status badges: AVAILABLE, ASSIGNED, IN_REPAIR, RETIRED, LOST
├─ Sort: By status, asset tag, depreciation
└─ Add: [+ New Asset]

Asset Detail:
├─ Asset tag + name + model
├─ Serial number
├─ Purchase date + price
├─ Warranty expiry
├─ Current depreciation value
├─ Status: AVAILABLE / ASSIGNED
├─ If assigned:
│  ├─ Current owner (employee name/link)
│  ├─ Assignment date
│  ├─ [Return asset] button
│  └─ Assignment history (timeline)
├─ Location/notes
└─ [Edit] [Archive] [Report missing]

Asset Assignment Workflow:
├─ [Assign asset] button
├─ Select employee (searchable)
├─ Confirm assignment
├─ System updates asset status to ASSIGNED
└─ Employee receives notification

Asset Return Workflow:
├─ [Return asset] button (on asset detail)
├─ Asset condition: GOOD, DAMAGED, MISSING_COMPONENTS, LOST
├─ Notes on condition
├─ Checked by (HR person)
├─ Confirm return
└─ Asset status changes to AVAILABLE

Asset Audit:
├─ Periodic asset audits
├─ [Conduct audit] button
├─ Verify physical presence
├─ Record condition
├─ Audit timeline
└─ Missing asset alerts
```

---

## Section 11: Performance Management

### 11.1 Goals & Objectives

**URL**: `/zoiko-hr/goals`

**Goal setting and tracking**

```
Filter:
├─ Filter: By goal status (ACTIVE, COMPLETED, ABANDONED)
├─ Filter: By goal type (STRATEGIC, OPERATIONAL, BEHAVIORAL, DEVELOPMENT)
├─ Filter: By employee, department
├─ Filter: By target date range
├─ Sort: By target date, status

Card Grid or Table: Goals
├─ Card per goal:
│  ├─ Goal title
│  ├─ Owner (employee)
│  ├─ Type badge
│  ├─ Target date
│  ├─ Progress: X% complete
│  ├─ Status badge (ACTIVE, COMPLETED, ABANDONED)
│  └─ Actions: [View] [Edit] [Complete] [Abandon]
│
└─ OR Table format

Goal Detail:
├─ Title + Description
├─ Owner (employee name/link)
├─ Type + Weight (% of overall rating)
├─ Status: ACTIVE, COMPLETED, ABANDONED
├─ Target date
├─ Start date
├─ Metrics: How success is measured (free text or structured)
├─ Progress:
│  ├─ % complete
│  ├─ Progress bar
│  ├─ Last updated date
│  ├─ Update progress [text field] [save]
│
├─ Related goals:
│  ├─ Aligned with: Higher-level goal (if applicable)
│  ├─ Supporting goals: Sub-goals
│
├─ Timeline:
│  ├─ Created date
│  ├─ Last updated date
│  ├─ Target date
│  ├─ Completion date (if completed)
│
├─ Comments & Updates:
│  ├─ Comments thread (employee + manager feedback)
│  ├─ Update log: Progress updates
│
└─ Actions:
   ├─ [Edit goal]
   ├─ [Update progress]
   ├─ [Mark complete]
   ├─ [Abandon]
   └─ [Archive]

Goal Setting (New Goal):
├─ Modal or dedicated page
├─ Employee (auto-filled if creating for self)
├─ Goal title
├─ Description
├─ Type (dropdown)
├─ Weight (if part of review rating)
├─ Alignment: Select parent goal (optional)
├─ Target date
├─ Success metrics (free text)
├─ [Save]
└─ Manager review & approval (if required)
```

---

### 11.2 Performance Reviews

**URL**: `/zoiko-hr/reviews`

**Annual/periodic performance reviews**

```
Filter:
├─ Filter: By review cycle (year dropdown)
├─ Filter: By status (NOT_STARTED, IN_PROGRESS, SUBMITTED, APPROVED, PUBLISHED)
├─ Filter: By employee, department, manager
├─ Sort: By submission date, status

ReusableTable: Performance Reviews
├─ Columns:
│  ├─ Employee
│  ├─ Manager
│  ├─ Review Type (SELF, MANAGER, PEER, 360, FINAL)
│  ├─ Rating
│  ├─ Status
│  ├─ Due Date
│  ├─ Submitted Date
│  └─ Actions
│
├─ Status badges: IN_PROGRESS, SUBMITTED, APPROVED, PUBLISHED
├─ Sort: By employee, rating, status
└─ Add: [+ Create review]

Review Cycle Dashboard:
├─ Review cycle name + year
├─ Cycle status: OPEN, CLOSED
├─ Timeline: Start date → Submission deadline → Calibration → Publication
├─ Progress: X% of reviews submitted
├─ Submissions by week (chart)
├─ Missing submissions (list of overdue reviews)
├─ Calibration status (if applicable)
└─ [Close cycle] [Publish all]

Performance Review Detail:
├─ Header: Employee name + Manager
├─ Cycle year + Review type
├─ Status: DRAFT, IN_PROGRESS, SUBMITTED, APPROVED, PUBLISHED
├─ Due date
├─ Tabs:
│  ├─ Self-Review (if type=SELF)
│  │  ├─ Instructions
│  │  ├─ Strengths (text area)
│  │  ├─ Areas for improvement (text area)
│  │  ├─ Accomplishments (list with add)
│  │  ├─ Goal progress (auto-populated from goals)
│  │  ├─ Self-rating: 1-5 or EXCELLENT/GOOD/SATISFACTORY/NEEDS_IMPROVEMENT
│  │  ├─ [Save as draft] [Submit]
│  │  └─ Manager can view submitted self-review
│  │
│  ├─ Manager Review (review by manager)
│  │  ├─ Instructions
│  │  ├─ Performance rating: 1-5 or descriptive (EXCELLENT, GOOD, etc.)
│  │  ├─ Strengths observed
│  │  ├─ Areas for development
│  │  ├─ Key accomplishments
│  │  ├─ Overall score (calibrated)
│  │  ├─ Compensation recommendation: RAISE, BONUS, PROMOTION, MAINTAIN, NONE
│  │  ├─ Comments for employee
│  │  ├─ View self-review (read-only)
│  │  ├─ View peer feedback (aggregated)
│  │  ├─ [Save as draft] [Submit]
│  │  └─ Notes for HR / Calibration session
│  │
│  ├─ Peer Feedback (if 360 review)
│  │  ├─ Aggregate feedback from peers
│  │  ├─ Anonymized comments
│  │  ├─ Themes extracted (strengths, development areas)
│  │  ├─ Sentiment analysis (optional)
│  │  └─ Read-only for employee
│  │
│  ├─ Feedback Tab
│  │  ├─ Thread of comments from manager, employee, HR
│  │  ├─ Add comment field
│  │  ├─ Comment history
│  │  └─ @ mentions for HR, manager, employee
│  │
│  ├─ Goals Tab
│  │  ├─ Goals for this cycle
│  │  ├─ Progress on each goal
│  │  ├─ Goal completion status
│  │  └─ [View all goals]
│  │
│  └─ Documents Tab
│     ├─ Review document (PDF)
│     ├─ Self-review document (PDF)
│     ├─ Peer feedback report (if applicable)
│     ├─ [Download all] [Print]
│     └─ Signature page (manager + employee sign-off)

Review Workflow:
├─ Employee completes self-review
├─ Manager completes review
├─ HR reviews for calibration
├─ Calibration session (if needed)
├─ Manager finalizes rating
├─ Employee acknowledges receipt
├─ Cycle closed and results published

Calibration Session:
├─ Managers meet to align on ratings
├─ Compare similar roles/levels
├─ Adjust ratings for consistency
├─ Document calibration adjustments
└─ Final ratings locked for publication

Publication:
├─ Reviews become final
├─ Employee sees final rating
├─ Generate report for HR, Finance, Executives
└─ Compensation adjustments processed
```

---

### 11.3 Feedback & Ratings

**URL**: `/zoiko-hr/feedback`

**Continuous feedback and 360 reviews**

```
Filter:
├─ Filter: By employee, department
├─ Filter: By feedback type (PEER, MANAGER, SELF)
├─ Filter: By date range
├─ Sort: By date, employee

Card Grid: Recent Feedback
├─ Card per feedback:
│  ├─ Recipient (who feedback is about)
│  ├─ Giver (who gave feedback)
│  ├─ Feedback category
│  ├─ Date submitted
│  ├─ Visibility: Anonymous or attributed
│  ├─ Sentiment: Positive / Neutral / Developmental
│  └─ [View]

Feedback Detail:
├─ Recipient name
├─ Feedback giver (if not anonymous)
├─ Category (GOAL_PERFORMANCE, COMPETENCY, BEHAVIOR, PROJECT)
├─ Content (text)
├─ Date submitted
├─ Anonymous? Yes/No badge
├─ Sentiment analysis (auto-calculated)
├─ Related to performance review? (link if applicable)
└─ [Edit] [Delete]

Give Feedback:
├─ [+ Give feedback] button
├─ Modal/form:
│  ├─ Recipient (searchable employee)
│  ├─ Category (dropdown)
│  ├─ Feedback text (encouragement to be specific)
│  ├─ Anonymous? (checkbox)
│  ├─ Related to goal? (optional link)
│  ├─ [Submit]
│  └─ Confirmation: Feedback sent successfully

Feedback for Employee (Self-Service):
├─ Tab: "Feedback I've received"
├─ List all feedback received (recent first)
├─ Actionable themes
├─ Feedback grouped by category
├─ [Request feedback] button (from specific people)
└─ Feedback trends over time
```

---

## Section 12: Learning & Development

### 12.1 Learning Management

**URL**: `/zoiko-hr/learning`

**Courses, training, certifications**

```
Filter:
├─ Search: By course name, provider
├─ Filter: By status (ACTIVE, ARCHIVED)
├─ Filter: By category (TECHNICAL, LEADERSHIP, SOFT_SKILLS, COMPLIANCE)
├─ Filter: By delivery method (IN_PERSON, ONLINE, HYBRID, SELF_PACED)
├─ Sort: By name, enrollment count

Card Grid: Course Catalog
├─ Card per course:
│  ├─ Course thumbnail/icon
│  ├─ Course name
│  ├─ Provider
│  ├─ Category badge
│  ├─ Duration (hours)
│  ├─ Delivery method
│  ├─ Enrollment count
│  ├─ Average rating (stars)
│  └─ Actions: [View details] [Enroll] [Share]

Course Detail:
├─ Title + Description
├─ Provider
├─ Category + Level (BEGINNER, INTERMEDIATE, ADVANCED)
├─ Duration + Delivery method
├─ Start date + End date
├─ Capacity + Current enrollment
├─ Prerequisites (if any)
├─ Certifications offered (if any)
├─ Syllabus / Topics
├─ Instructor(s)
├─ Rating (5-star)
├─ Reviews from participants
├─ [Enroll course] button
└─ [Share link]

My Enrollments (Employee view):
├─ In progress courses
│  ├─ Course name
│  ├─ Progress bar
│  ├─ Deadline
│  ├─ [Continue learning]
│  └─ [Drop course]
│
├─ Completed courses
│  ├─ Course name
│  ├─ Completion date
│  ├─ Certificate (download link)
│  ├─ Rating submitted? (Yes/No)
│  └─ [View certificate]
│
└─ Recommended courses (based on skills, role)
   └─ [Enroll]

Training Programs:
├─ Multi-course programs
├─ Onboarding program
├─ Leadership development program
├─ Technical certification path
├─ [Enroll in program]
└─ Track progress through program

Certifications:
├─ List of certifications
├─ Certification name
├─ Issuer
├─ Requirements to earn
├─ Renewal requirements
├─ Holders (employees with cert)
├─ [View certification details]
└─ Certification tracking (expiry alerts)

Skills Management:
├─ Organization-wide skills list
├─ Skill name + description
├─ Proficiency levels
├─ Employees with skill (count)
├─ Courses/trainings that teach this skill
├─ [View employees with skill]
└─ Skill assessment history
```

---

## Section 13: Employee Self-Service Portal

### 13.1 My Workspace

**URL**: `/zoiko-hr/my-workspace`

**Employee personal dashboard**

```
Tabs:
├─ My Dashboard (default)
│  ├─ KPICard: Leave Balance
│  │  ├─ PTO: 12.5 / 20 days
│  │  ├─ Sick: 5 / 5 days
│  │  ├─ Personal: 2 / 3 days
│  │  └─ [Request leave]
│  │
│  ├─ KPICard: Current Review Status
│  │  ├─ Review cycle: 2026 Annual
│  │  ├─ Status: Self-review due on [DATE]
│  │  ├─ [Complete self-review]
│  │
│  ├─ KPICard: Training & Development
│  │  ├─ Enrolled courses: 2
│  │  ├─ Completed this year: 3
│  │  ├─ [Browse courses]
│  │
│  ├─ Card: Pending My Actions
│  │  ├─ Leave requests pending approval (if manager)
│  │  ├─ Team members awaiting feedback (if assigned)
│  │  ├─ Reviews I need to complete (if reviewer)
│  │
│  ├─ Card: My Documents
│  │  ├─ Recent documents
│  │  ├─ Expiring documents (alerts)
│  │  ├─ [Download payslips]
│  │  ├─ [View pay stubs]
│  │  └─ [View benefits documents]
│  │
│  └─ Card: My Team (if manager)
│     ├─ Direct reports (count)
│     ├─ On leave today (count)
│     ├─ Pending approvals (count)
│     └─ [View team]
│
├─ My Profile
│  ├─ Personal information (edit-enabled)
│  │  ├─ Name, email, phone
│  │  ├─ Personal email
│  │  ├─ Date of birth
│  │  ├─ Gender
│  │  ├─ Nationality
│  │  └─ [Edit]
│  │
│  ├─ Employment Information (read-only)
│  │  ├─ Employee ID
│  │  ├─ Department
│  │  ├─ Manager
│  │  ├─ Hire date
│  │  ├─ Job title
│  │  └─ [Contact HR to change]
│  │
│  ├─ Emergency Contacts (edit-enabled)
│  │  ├─ Primary contact
│  │  ├─ Secondary contact
│  │  ├─ [Add] [Edit] [Delete]
│  │
│  ├─ Address (edit-enabled)
│  │  ├─ Current address
│  │  ├─ [Update address]
│  │
│  ├─ Bank Account (edit-enabled for payroll)
│  │  ├─ Last 4 digits of account
│  │  ├─ [Update bank account]
│
│  ├─ Preferences
│  │  ├─ Email notifications (checkbox)
│  │  ├─ SMS notifications (checkbox)
│  │  ├─ Quiet hours (time range)
│  │  ├─ Language preference
│  │  ├─ Timezone
│  │  └─ [Save]
│  │
│  └─ Password & Security
│     ├─ [Change password]
│     ├─ [Two-factor authentication setup]
│     └─ Recent login activity
│
├─ My Leave
│  ├─ Leave Balances (table)
│  │  ├─ Leave type, allocated, used, available
│  │  ├─ Progress bars
│  │
│  ├─ Request Leave (form)
│  │  ├─ [+ New leave request]
│  │  ├─ Modal/form:
│  │  │  ├─ Leave type (dropdown)
│  │  │  ├─ Start date (date picker)
│  │  │  ├─ End date (date picker)
│  │  │  ├─ Days calculated automatically
│  │  │  ├─ Reason (optional)
│  │  │  ├─ Attachments (if medical cert required)
│  │  │  ├─ [Submit request]
│  │  │  └─ Balance impact: "You will have X days remaining"
│  │
│  ├─ My Leave Requests (table)
│  │  ├─ Columns: Type, Start Date, End Date, Days, Status, Approver, Approval Date
│  │  ├─ Status: SUBMITTED, APPROVED, REJECTED, CANCELLED
│  │  ├─ Sort: By start date
│  │  └─ Actions: [View] [Cancel] (if not approved)
│  │
│  └─ Leave Calendar
│     ├─ Visual calendar
│     ├─ Show my leave requests
│     ├─ Show company holidays
│     └─ Show team leave (optional)
│
├─ My Documents
│  ├─ Recent documents
│  │  ├─ Download links
│  │  ├─ Upload date
│  │
│  ├─ Payslips & Pay Stubs
│  │  ├─ List of recent payslips
│  │  ├─ [Download] links
│  │  ├─ Date-based search
│  │
│  ├─ Tax Documents
│  │  ├─ W-2, W-4, etc.
│  │  ├─ [Download]
│  │
│  ├─ Benefits Documents
│  │  ├─ Benefits summary
│  │  ├─ [Download]
│  │
│  ├─ Agreements
│  │  ├─ Employment agreement
│  │  ├─ Signed offers
│  │  ├─ [Download]
│
│  └─ Upload Documents (if allowed)
│     ├─ [+ Upload]
│     └─ Drag-drop file upload
│
├─ My Training
│  ├─ Enrolled Courses
│  │  ├─ Course name + progress bar
│  │  ├─ Enrollment date + deadline
│  │  ├─ [Continue learning]
│  │  └─ [Drop course]
│  │
│  ├─ Completed Courses
│  │  ├─ Course name + completion date
│  │  ├─ Certificate (if earned)
│  │  ├─ [Download certificate]
│  │  └─ [Rate course]
│  │
│  ├─ Course Catalog
│  │  ├─ Recommended courses (for your role)
│  │  ├─ All courses (browsable)
│  │  ├─ [Search courses]
│  │  └─ [Enroll] buttons
│  │
│  └─ My Skills
│     ├─ Skills assessed for me
│     ├─ Proficiency level
│     └─ Last assessment date
│
├─ My Reviews
│  ├─ Current Review Cycle
│  │  ├─ Cycle name + year
│  │  ├─ Self-review: [Not started] [In progress] [Submitted] [View]
│  │  ├─ Manager review: [Pending] [Completed] [View]
│  │  ├─ Peer feedback: [Requested] [Received] [View]
│  │  └─ Overall rating (if available)
│  │
│  ├─ Previous Reviews
│  │  ├─ Year 2025: Rating [X/5] [View full review]
│  │  ├─ Year 2024: Rating [X/5] [View full review]
│  │  └─ [Download reviews]
│  │
│  ├─ My Goals
│  │  ├─ Goals for current cycle
│  │  ├─ Progress on each goal
│  │  ├─ [Update progress]
│  │  └─ [Add new goal]
│  │
│  └─ Feedback I've Received
│     ├─ Recent feedback (anonymized or attributed)
│     ├─ [View all feedback]
│     └─ Actionable themes
│
└─ My Payroll (if linked to ZoikoPayroll)
   ├─ Latest paycheck summary
   ├─ Gross pay, deductions, net pay
   ├─ YTD earnings
   ├─ [View detailed payslip]
   ├─ Tax information
   └─ Benefits deductions
```

---

## Section 14: Reports & Analytics

### 14.1 Reporting Dashboard

**URL**: `/zoiko-hr/reports`

**HR analytics and reporting**

```
Tab Navigation:
├─ Headcount
├─ Attrition
├─ Leave
├─ Recruitment
├─ Training
├─ Compensation (if Finance role)
└─ Compliance

Tab 1: Headcount Report
├─ KPICards:
│  ├─ Total employees (current)
│  ├─ Active employees
│  ├─ New hires (YTD)
│  ├─ Terminations (YTD)
│
├─ Charts:
│  ├─ Headcount trend (12 months line chart)
│  ├─ Department distribution (bar chart)
│  ├─ Gender distribution (pie chart)
│  ├─ Employment type breakdown
│  ├─ Location distribution
│  ├─ Tenure distribution (histogram)
│
├─ Table: Headcount by Department
│  ├─ Columns: Department, Active, On Leave, New Hires, Terminations, Total
│
├─ Filters:
│  ├─ Date range
│  ├─ Department, location, employment type
│
└─ Export: [Download PDF] [Download CSV]

Tab 2: Attrition Report
├─ KPICards:
│  ├─ Attrition rate (%)
│  ├─ Voluntary terminations (count)
│  ├─ Involuntary terminations (count)
│  ├─ Retirement count
│
├─ Charts:
│  ├─ Attrition trend (12 months)
│  ├─ Attrition by department (bar)
│  ├─ Attrition by role
│  ├─ Attrition by tenure (who's leaving at what tenure)
│  ├─ Top reasons for leaving (from exit interviews)
│
├─ Table: Recent Terminations
│  ├─ Columns: Employee, Date, Department, Reason, Rehire Eligible
│
├─ Risk Analysis:
│  ├─ Flight risk scores (predictive)
│  ├─ High-risk employees (list)
│  ├─ [Take action] links
│
└─ Export: [Download PDF] [Download CSV]

Tab 3: Leave Report
├─ KPICards:
│  ├─ Total leave taken (YTD)
│  ├─ Leave days remaining (aggregate)
│  ├─ Avg leave per employee
│
├─ Charts:
│  ├─ Leave usage by type (12 months)
│  ├─ Leave by department
│  ├─ Monthly leave trend
│
├─ Table: Leave Balances
│  ├─ Columns: Employee, Leave Type, Allocated, Used, Available, Carryover
│
├─ Expiring Leave Alert:
│  ├─ Employees with expiring leave (end of year)
│  ├─ Days at risk of being forfeited
│
└─ Export: [Download PDF] [Download CSV]

Tab 4: Recruitment Report
├─ KPICards:
│  ├─ Open positions
│  ├─ Total applications (YTD)
│  ├─ Hires (YTD)
│  ├─ Time to hire (avg)
│
├─ Charts:
│  ├─ Hiring funnel (by stage)
│  ├─ Time to hire trend
│  ├─ Source effectiveness (where hired from)
│  ├─ Applications by source
│
├─ Table: Job Opening Performance
│  ├─ Columns: Job Title, Applications, Interviews, Offers, Hired, Time to Hire
│
└─ Export: [Download PDF] [Download CSV]

Tab 5: Training Report
├─ KPICards:
│  ├─ Total training hours (YTD)
│  ├─ Avg hours per employee
│  ├─ Courses completed
│  ├─ Certifications earned
│
├─ Charts:
│  ├─ Training hours by category
│  ├─ Courses completed by department
│  ├─ Certification achievements
│
├─ Table: Employee Training
│  ├─ Columns: Employee, Courses Completed, Hours, Certifications, Budget Spent
│
└─ Export: [Download PDF] [Download CSV]

Report Export Options:
├─ PDF (formatted report)
├─ CSV (data export for Excel)
├─ Excel (pre-formatted tables)
└─ Scheduled reports (email delivery)
```

---

## Section 15: RBAC Screen Visibility

### 15.1 Role-Based Access Control

**Screen visibility and permissions by role**

```
SUPER_ADMIN:
├─ Full access to all ZoikoHR screens
├─ Can manage all organizations' HR data
├─ Can create/edit employees across tenants
├─ Can create/edit policies
├─ Can access all reports
└─ Can configure settings

TENANT_ADMIN:
├─ Dashboard (full access)
├─ Workforce (all employees)
├─ Organization (edit)
├─ Leave (all requests, policies)
├─ Recruitment (all openings, candidates)
├─ Onboarding / Offboarding (all)
├─ Performance (all reviews)
├─ Learning (course management)
├─ Reports (all)
├─ Settings (tenant-level)
└─ Cannot: Delete tenant data, change permissions

HR_ADMIN:
├─ Dashboard (department/team level)
├─ Workforce (view/edit employees in department)
├─ Organization (view departments)
├─ Leave (approve leave for team)
├─ Recruitment (view/manage job openings, candidates)
├─ Onboarding / Offboarding (view, manage checklist)
├─ Performance (view reviews for team)
├─ Learning (enroll employees)
├─ Reports (department level)
└─ Settings (limited, department level)

MANAGER:
├─ Dashboard (my team only)
├─ Workforce (view my direct reports)
├─ Organization (view my team structure)
├─ Leave (approve/reject my team's requests)
├─ Recruitment (view job openings for my dept)
├─ Performance (complete reviews for my team)
├─ My Workspace (own profile, leave, training)
└─ Cannot: Edit policies, view other teams' data

EMPLOYEE:
├─ My Workspace (all tabs: profile, leave, documents, training, reviews)
├─ Employee Directory (read-only view of colleagues)
├─ Leave Requests (create, view own)
├─ Org Chart (view, read-only)
├─ My Reviews (view own reviews)
├─ Training Courses (browse, enroll)
└─ Cannot: View others' documents, approve leave, access settings

RECRUITMENT_TEAM:
├─ Dashboard (recruitment funnel)
├─ Recruitment (full access - openings, candidates, interviews, offers)
├─ Reports (recruitment specific)
└─ Cannot: Access employee data outside recruitment

PAYROLL_ADMIN (linked from ZoikoPayroll):
├─ Employee Directory (read-only, compensation visible)
├─ Compensation tab (employee profiles)
├─ Payroll integration status
├─ Reports (compensation, tax)
└─ Cannot: Edit employee data outside compensation
```

---

## Section 16: Responsive Design Strategy

### 16.1 Mobile-First Approach

**Adaptive design for mobile, tablet, desktop**

**Mobile (< 768px):**
```
Navigation:
├─ Hamburger menu (top-left)
├─ Sidebar collapses to drawer
├─ Bottom navigation bar (optional) for key sections
├─ Breadcrumb navigation visible

Layout:
├─ Single column layout
├─ Full-width cards and tables
├─ Horizontal scrolling tables (if needed)
├─ Stacked form fields

KPI Cards:
├─ Single column grid
├─ Stack vertically
├─ Font sizes: Smaller body text (13px), larger headers (28px)

Tables:
├─ Card view (preferred) OR
├─ Horizontal scroll with sticky first column
├─ Collapsible rows (show key info, expand for details)
├─ Fewer columns (hide non-critical columns)

Forms:
├─ Full-width inputs
├─ Single column
├─ Larger tap targets (min 44px)
├─ Date pickers (native mobile)

Charts:
├─ Full-width, but may need scroll horizontally
├─ Simplified axis labels
├─ Larger touch targets

Actions:
├─ [Primary action] full-width button
├─ Secondary actions in dropdown menu
├─ Floating action button for common actions (e.g., "+ New Employee")
```

**Tablet (768px - 1024px):**
```
Layout:
├─ 2-column layout for some screens
├─ Sidebar visible but narrow
├─ Main content area flexible

Grid:
├─ 2 column grid for KPI cards
├─ 2-3 columns for card grids

Tables:
├─ Smaller font but still readable
├─ 8-10 columns visible with scroll
├─ Touch-friendly padding (20px rows)

Forms:
├─ 2-column form layout
├─ Larger form fields than desktop
```

**Desktop (> 1024px):**
```
Layout:
├─ Full sidebar + main content
├─ Multi-column layouts
├─ Hover effects and interactions

Grid:
├─ 3-6 column grid for KPI cards
├─ Responsive grid for cards

Tables:
├─ All columns visible
├─ Smaller padding (12px rows)
├─ Hover row highlight
├─ Sorting and filtering visible

Forms:
├─ 2-3 column layout
├─ Inline field labels

Charts:
├─ Full-size, interactive (hover tooltips)
├─ Drill-down capabilities
```

---

### 16.2 Touch & Interaction Patterns

**Mobile interaction patterns**

```
Buttons:
├─ Min 44x44px touch target
├─ Padding: 12px 16px (generous for touch)
├─ Clear visual feedback on press
├─ No double-tap zoom on buttons

Forms:
├─ Large input fields (48px height)
├─ Clear labels above fields
├─ Error messages visible inline
├─ Submit button full-width

Lists:
├─ Touch-friendly row height (48-56px)
├─ Swipe to reveal actions (or dropdown)
├─ Pull-to-refresh (if appropriate)

Modals:
├─ Full-screen on mobile
├─ Large dismiss button (X) in corner
├─ Keyboard-aware (don't cover input with keyboard)

Navigation:
├─ Clear back button
├─ Breadcrumbs visible
├─ Bottom sheet for filters/options
```

---

## Section 17: UI Components Reuse

### 17.1 Component Library Implementation

**Reused components from Zoiko One design system**

```
Button Component:
├─ Primary (blue background)
├─ Secondary (gray border)
├─ Danger (red background)
├─ Icon buttons
├─ Sizes: sm (32px), md (40px), lg (48px)
├─ States: default, hover, active, disabled
└─ Loading state (spinner)

Input Component:
├─ Text input
├─ Password input
├─ Textarea
├─ Date picker
├─ Time picker
├─ Dropdown/select
├─ Searchable dropdown
├─ Multi-select
├─ States: default, focused, error, disabled
└─ Validation messages

Card Component:
├─ Standard card (border + shadow)
├─ Transparent card
├─ Elevated card
├─ Padding: 16px, 20px, 24px variants
└─ Hover effects

Badge Component:
├─ Status badges (ACTIVE, PENDING, REJECTED, etc.)
├─ Count badges (3)
├─ Sizes: sm, md, lg
├─ Colors: green (success), amber (warning), red (error), slate (neutral)
└─ With icon option

Table Component (ReusableTable):
├─ Header with column names
├─ Sortable columns
├─ Filterable rows
├─ Pagination
├─ Row actions (dropdown menu)
├─ Bulk select
├─ Responsive (horizontal scroll on mobile)
└─ Empty state message

Chart Components:
├─ GrowthLineChart (line chart)
├─ BarChart (bar chart)
├─ PieChart (pie chart)
├─ FunnelChart (funnel/waterfall)
├─ Legend
├─ Hover tooltips
├─ Export as PNG/SVG
└─ Interactive drill-down

Navigation Components:
├─ Sidebar (sections, items, badges)
├─ Header (search, notifications, user menu)
├─ Breadcrumbs
├─ Tabs (horizontal navigation)
├─ Dropdown menu
└─ Footer

Dialog/Modal Components:
├─ Confirmation dialogs
├─ Alert dialogs
├─ Form modals
├─ Full-screen modals (on mobile)
├─ Close button (X)
├─ Escape key dismissal
└─ Backdrop click dismissal

Status Indicator:
├─ Colored circle + label
├─ Animated pulse (for active/pending)
├─ Tooltip on hover
└─ Colors: emerald (ACTIVE), amber (PENDING), red (REJECTED), slate (INACTIVE)

Progress Bar:
├─ Horizontal progress bar
├─ Percentage label
├─ Color coded by progress (green when complete)
└─ Striped animation (for in-progress)

Avatar Component:
├─ Profile image (if available)
├─ Initials (if no image)
├─ Size variants (24px, 32px, 48px, 96px)
├─ Placeholder color (generated from initials)
└─ Badge option (online/offline status)
```

---

## Section 18: UI Readiness Review

### 18.1 Completeness Assessment

**Screen coverage against requirements**

```
✅ IMPLEMENTED / DESIGNED:
├─ Sidebar Navigation (all sections)
├─ Dashboard (Executive, Employee, Recruitment)
├─ Employee Directory & Profile (comprehensive 360° view)
├─ Organization Hierarchy (Org chart, departments, designations)
├─ Leave Management (requests, policies, calendar, balances)
├─ Recruitment Pipeline (openings, candidates, interviews, offers)
├─ Onboarding / Offboarding workflows
├─ Performance Management (goals, reviews, feedback, ratings)
├─ Learning & Development (courses, certifications, skills)
├─ Employee Self-Service Portal (comprehensive)
├─ Reports & Analytics (all major reports)
├─ RBAC (role-based screen visibility)
└─ Responsive Design (mobile, tablet, desktop)

🔶 REQUIRES REFINEMENT:
├─ Mobile navigation patterns (test with real users)
├─ Touch interaction on data-heavy tables
├─ Form validation & error messaging
├─ Accessibility (WCAG 2.1 AA compliance)
├─ Keyboard navigation
├─ Screen reader support
└─ Performance optimization (lazy loading for large lists)

❌ NOT YET DESIGNED (For future sprints):
├─ Advanced analytics dashboards (predictive analytics, ML insights)
├─ Document version history UI
├─ Real-time collaboration (for shared documents, forms)
├─ Mobile app native UI (if planned)
├─ Internationalization & RTL support
├─ Dark mode toggle (if needed, beyond current dark theme)
└─ A/B testing framework integration
```

---

### 18.2 Missing Workflows

**User journeys not yet detailed**

```
Critical Workflows to Detail:
├─ Leave Approval Workflow (Manager → HR escalation)
├─ Employee Offboarding (Exit request → Final settlement)
├─ Recruitment Offer Acceptance → Employee Creation
├─ Performance Review Cycle (Self → Manager → Calibration → Publication)
├─ Compensation Review Process
├─ Promotion/Transfer Workflow
└─ Emergency Access Revocation

Secondary Workflows:
├─ Bulk actions (import employees, export data)
├─ Duplicate employee detection & merging
├─ Data correction & audit trail
├─ Notification preferences & delivery
└─ Help & support ticket creation
```

---

### 18.3 User Journey Recommendations

**Key user paths to optimize**

```
EMPLOYEE JOURNEY:
1. Login → Dashboard
2. View leave balance
3. Request leave
4. Receive approval
5. Complete self-review
6. View performance rating
7. Enroll in course
8. View payslip
9. Update profile

MANAGER JOURNEY:
1. Login → Dashboard (team overview)
2. View pending approvals (leave, reviews)
3. Approve/reject leave
4. Complete performance reviews
5. Give feedback to team
6. View team onboarding status
7. Submit my own review

HR ADMIN JOURNEY:
1. Login → Dashboard (org overview)
2. Monitor leave calendar
3. Manage job openings & candidates
4. Monitor recruitment funnel
5. View attrition metrics
6. Generate reports
7. Configure policies
8. Manage compliance tasks

RECRUITER JOURNEY:
1. Login → Recruitment Dashboard
2. View open positions
3. Screen candidates
4. Schedule interviews
5. Collect feedback
6. Make offer
7. Track hiring pipeline
```

---

### 18.4 Accessibility & Compliance

**WCAG 2.1 Level AA Compliance**

```
Color Contrast:
├─ All text meets 4.5:1 ratio (normal), 3:1 (large)
├─ Status badges have text labels (not just color)
├─ Links visually distinct from body text

Keyboard Navigation:
├─ All interactive elements focusable via Tab
├─ Focus visible indicator (highlight)
├─ Skip to main content link
├─ Modal focus trap
├─ Escape key closes modals

Screen Reader Support:
├─ Semantic HTML (headings, lists, buttons)
├─ ARIA labels for icons
├─ Form labels associated with inputs
├─ Table headers properly marked
├─ Live regions for dynamic content updates

Mobile Accessibility:
├─ Touch targets min 44x44px
├─ Readable text (min 16px)
├─ No time-limited interactions
├─ Clear error messages

Testing:
├─ Automated testing (axe, Lighthouse)
├─ Manual accessibility audit
├─ Screen reader testing (NVDA, JAWS)
├─ Keyboard-only navigation testing
└─ User testing with accessibility experts
```

---

### 18.5 Recommendations for Enhancement

**Priority improvements for future iterations**

```
PRIORITY 1 (High Impact, High Value):
├─ [ ] Implement keyboard shortcut help (?  key)
├─ [ ] Add advanced filtering with saved filter sets
├─ [ ] Employee bulk actions (import, export, bulk edit)
├─ [ ] Real-time notifications for approvals
├─ [ ] Dashboard customization (user-selectable widgets)
└─ [ ] Audit trail viewer (who did what, when)

PRIORITY 2 (Medium Impact, Medium Effort):
├─ [ ] Org chart visualization improvements (drag-drop reorganization)
├─ [ ] Leave calendar team view (better resource planning)
├─ [ ] Advanced recruitment analytics (source ROI, cost-per-hire)
├─ [ ] Performance calibration tool UI
├─ [ ] Integration with external systems (SSO, directory sync)
└─ [ ] Mobile app for critical workflows (leave, approvals)

PRIORITY 3 (Nice to Have):
├─ [ ] Predictive analytics dashboards
├─ [ ] AI-powered insights (recommendations, anomalies)
├─ [ ] Gamification (achievements, leaderboards)
├─ [ ] Social features (peer recognition, social feed)
├─ [ ] Advanced reporting builder
└─ [ ] Custom dashboards (power users)

ACCESSIBILITY IMPROVEMENTS:
├─ [ ] Full WCAG 2.1 Level AAA compliance
├─ [ ] High contrast mode option
├─ [ ] Dyslexia-friendly font option
├─ [ ] Reduced motion option (for animations)
└─ [ ] Multiple language support (i18n)

PERFORMANCE OPTIMIZATIONS:
├─ [ ] Lazy load large tables/lists
├─ [ ] Client-side pagination for better responsiveness
├─ [ ] Virtual scrolling for large lists
├─ [ ] Caching strategy for static data
├─ [ ] Code splitting by route
└─ [ ] Image optimization & CDN delivery
```

---

### 18.6 Testing Strategy

**Quality assurance approach**

```
UI Testing:
├─ Component visual tests (Storybook)
├─ Responsive design testing (multiple devices)
├─ Cross-browser testing (Chrome, Firefox, Safari, Edge)
├─ Mobile device testing (iOS, Android)
├─ Accessibility testing (automated + manual)

User Testing:
├─ Usability testing with real users
├─ A/B testing for key workflows
├─ Navigation testing (can users find features?)
├─ Pain point identification
├─ User feedback loops

Performance Testing:
├─ Page load time < 3s (target)
├─ Lighthouse score > 90 (performance)
├─ Core Web Vitals optimization
├─ Network throttling tests
├─ Large dataset performance (1000+ rows)

Acceptance Criteria:
├─ All screens render correctly on mobile/tablet/desktop
├─ All RBAC restrictions enforced
├─ All workflows tested end-to-end
├─ Accessibility compliance verified
├─ Performance targets met
├─ No critical bugs
└─ User feedback incorporated
```

---

## Conclusion

**ZoikoHR UI Architecture** provides a comprehensive, enterprise-grade interface built on the proven Zoiko One design system. The architecture covers all major HR domains (workforce, leave, recruitment, onboarding, offboarding, performance, learning) with reusable components, consistent patterns, and role-based access control.

**Key Strengths:**
- Consistent visual identity with existing Zoiko platform
- Role-based screen visibility for security
- Comprehensive employee profile (360° view)
- Workflow-oriented design (approval workflows, leave cycles, recruitment pipeline)
- Mobile-first responsive design
- Accessibility-focused (WCAG 2.1)
- Performance-optimized components
- Clear data visualization (charts, dashboards, reports)

**Ready for Implementation:** The UI architecture specification is complete and ready for detailed design system specifications, component library development, and frontend implementation.

---

**Document Version:** 1.0  
**Last Updated:** June 2026  
**Next Review:** Post-MVP Implementation (3 months)
