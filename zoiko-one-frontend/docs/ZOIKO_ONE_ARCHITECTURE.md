# Executive Summary

## Overview

Zoiko One is an enterprise multi-tenant HR and governance platform built on Next.js 16 with React 19, TypeScript, and Prisma ORM backed by PostgreSQL. The platform provides a unified command center for organizational governance, payroll operations, compliance management, and tenant administration across the Zoiko product ecosystem.

## Architecture Vision

Zoiko One implements a **modern full-stack architecture** with clear separation of concerns:
- **Frontend**: Next.js App Router with React components, TypeScript, Tailwind CSS
- **Backend**: Service-oriented architecture with Repository pattern for data access
- **Database**: Prisma ORM with PostgreSQL for multi-tenant, audit-compliant data storage
- **Security**: Session-based JWT authentication, PBKDF2 password hashing, comprehensive RBAC, IP/User-Agent logging
- **Operations**: Multi-tenant isolation, approval workflows, governance policies, audit logging

## Key Design Principles

1. **Multi-Tenant First** — Every data model includes `tenantId` with unique constraints and cascade deletes
2. **Permission-Based Security** — All routes enforce granular, domain-scoped permissions
3. **Audit Compliance** — All sensitive operations logged to AuditLog with immutable event trails
4. **Service Layer Pattern** — Business logic in services, data access in repositories
5. **Session Rotation** — Refresh tokens rotated on each refresh; 15-minute access token TTL
6. **Type Safety** — End-to-end TypeScript for compile-time safety

# Platform Overview

## Purpose

Zoiko One serves as the **enterprise governance backbone** for the Zoiko product family. It provides:
- **Multi-tenant SaaS isolation** with per-tenant data and configuration
- **Unified identity and access management** (RBAC with 7 roles and 9 permission domains)
- **Approval and workflow orchestration** for payroll, compliance, and business processes
- **Governance and compliance framework** with policy enforcement and audit trails
- **Real-time analytics and health monitoring** of platform and product operations
- **Integration hub** for payroll, payments, and automation systems

## Multi-Tenant SaaS Model

### Tenant Hierarchy

```
Tenant (root entity)
├── Organization (business units)
│   └── Users (employees and admins)
├── Roles (admin, payroll manager, auditor, etc.)
├── Permissions (fine-grained access control)
├── Subscriptions (product licensing)
├── PayrollRuns (monthly/periodic payroll batches)
├── Compliance Reports (regulatory compliance status)
├── AuditLogs (immutable event trail)
└── Workflows (approvals, automations)
```

### Data Isolation Strategy

- **Tenant-scoped queries**: All `findMany()` include `{ where: { tenantId } }`
- **Unique constraints**: Models use `@@unique([tenantId, field])` to prevent collisions
- **Session binding**: Sessions tied to specific tenant; no cross-tenant reuse
- **Cascade deletes**: Deleting tenant cascades to all child entities
- **Audit separation**: All logs include `tenantId` and filtered on read

## Enterprise Governance Model

Zoiko One enforces governance through:
- **Governance Policies** with enforcement modes (MONITOR, WARN, BLOCK)
- **Approval Workflows** with escalation, reassignment, and multi-level approvals
- **Compliance Reports** tracking regulatory and internal policy adherence
- **Audit Logs** recording all critical actions with actor, timestamp, and outcome

# Technology Stack

## Frontend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Framework** | Next.js | 16.2.7 | App Router, SSR, API routes |
| **UI Library** | React | 19.2.4 | Component rendering |
| **Language** | TypeScript | 5 | Type safety and DX |
| **Styling** | Tailwind CSS | 4 | Utility-first CSS |
| **Icons** | lucide-react | 1.17.0 | SVG icon library |
| **Charts** | recharts | 3.8.1 | Data visualization |

### Frontend Architecture Pattern

```
Page Component
  ↓
  └─ ServiceCall (e.g., getDashboardData())
      ↓
      └─ API Route Handler
          ↓
          └─ Service Layer (e.g., superAdminService.getTenants())
              ↓
              └─ Repository (e.g., securityRepository.findTenantBySlug())
                  ↓
                  └─ Prisma Client
                      ↓
                      └─ PostgreSQL
```

## Backend Stack

| Component | Technology | Version | Purpose |
|-----------|-----------|---------|---------|
| **Runtime** | Node.js | Latest | JavaScript execution |
| **API Framework** | Next.js API Routes | 16.2.7 | HTTP endpoints in `app/api/` |
| **Language** | TypeScript | 5 | Type-safe backend code |
| **ORM** | Prisma | 6.19.3 | Database abstraction and migrations |
| **Database** | PostgreSQL | Latest | Relational data storage |

### Backend Architecture Layers

**API Routes** (`app/api/`)
- Entry points for HTTP requests
- Dynamic rendering enabled (`force-dynamic`)
- Error handling and HTTP response formatting
- Protected via `withPermission()` wrapper for super-admin routes

**Service Layer** (`app/services/`)
- Business logic and orchestration
- Data aggregation and transformations
- Auth flows (login, refresh, logout)
- Analytics and reporting
- Error handling and fallbacks

**Repository Layer** (`app/repositories/`)
- Singleton instances (e.g., `securityRepository`)
- Prisma query abstraction
- Data access methods with consistent signatures
- Tenant-scoped query enforcement

**Prisma Client** (`lib/prisma.ts`)
- Singleton Prisma instance
- Configured with logging in dev mode
- Connection pooling to PostgreSQL

## Security Stack

| Component | Technology | Purpose |
|-----------|-----------|---------|
| **Password Hashing** | PBKDF2 | 210k iterations + 16-byte salt + SHA256 |
| **JWT Algorithm** | HMAC-SHA256 | Access token signing (15-min TTL) |
| **Refresh Token** | Base64URL | 48-byte random, hashed in session |
| **Session Storage** | PostgreSQL | Secure refresh token hash storage |
| **Cookie Security** | httpOnly + sameSite=lax | XSS and CSRF protection |
| **Timing Safety** | crypto.timingSafeEqual | Token comparison protection |

# Frontend Architecture

## Layout Structure

### Root Layout (`app/layout.tsx`)

```typescript
// Global styles, metadata, body wrapping
<html>
  <body className="min-h-full bg-[#0A0F1C] text-white">
    {children}
  </body>
</html>
```

- Dark theme: `#0A0F1C` background, white text
- Global CSS in `app/globals.css`
- Typography and spacing via Tailwind

### Page Structure

Feature pages located in `app/[feature]/page.tsx`:
- Dashboard (`/dashboard`)
- User Management (`/users`)
- Organizations (`/organizations`)
- Roles & Permissions (`/roles`, `/roles-permissions`)
- Payroll (`/payroll`, `/payroll-operations`)
- Compliance (`/compliance`, `/compliance-center`)
- Audit (`/audit-logs`, `/audit-center`)
- Billing & Subscriptions (`/billing`, `/subscriptions`)
- System (`/settings`, `/system-health`, `/tenants`)
- Product hubs (`/zoiko-hr`, `/zoikopay`, `/zoikocorex`, `/zoikotime`)

## Dashboard Architecture

### Main Dashboard (`/dashboard`)

**Data Flow**:
1. Page calls `getDashboardData()` from `dashboardService`
2. Service calls `GET /api/dashboard` (analytics.* permission)
3. API returns KPI metrics:
   - Organizations count
   - Active users
   - Revenue
   - Payroll volume
   - Payments count
   - Compliance score

**Components**:
- `Header` — Navigation and user menu
- `Sidebar` — Feature navigation
- `KPICard` — Metric display
- `RevenueChart` — Revenue trends
- `UserGrowthChart` — User adoption
- `RecentActivity` — Activity feed

### Super Admin Dashboard (`/api/super-admin/dashboard`)

**Overview Metrics**:
- Monthly payroll volume and revenue
- Total employees, users, organizations
- Active vs. failed payroll runs
- Compliance health score (0-100)
- Platform health score (healthy checks %)
- Product adoption score (active subscriptions %)
- Open incidents (failures + security denials)

**Trending Data**:
- Payroll volume monthly trend
- Compliance health trend
- Product adoption trend

**Risk Analysis**:
- Top 6 risk organizations by risk score
- Risk calculation: (employee_count * 0.2) + (compliance_issues * 8) + (security_failures * 4)

**System Health**:
- Database connectivity
- API routes availability
- Payroll APIs status
- ZoikoCoreX workflow health

## Shared Components

| Component | Location | Purpose |
|-----------|----------|---------|
| `Header` | `app/components/Header.tsx` | Navigation bar, branding |
| `Sidebar` | `app/components/Sidebar.tsx` | Feature navigation |
| `KPICard` | `app/components/KPICard.tsx` | Metric display with styling |
| `ReusableTable` | `app/components/ReusableTable.tsx` | Generic table for listings |
| `RevenueChart` | `app/components/RevenueChart.tsx` | Line chart visualization |
| `UserGrowthChart` | `app/components/UserGrowthChart.tsx` | User growth trends |
| `GrowthLineChart` | `app/components/GrowthLineChart.tsx` | Generic growth visualization |
| `RiskTable` | `app/components/RiskTable.tsx` | Risk scoring table |
| `StatusBadge` | `app/components/StatusBadge.tsx` | Status display (ACTIVE, FAILED, etc.) |
| `SearchBar` | `app/components/SearchBar.tsx` | Filterable search |
| `NotificationBell` | `app/components/NotificationBell.tsx` | Notification icon |
| `Notifications` | `app/components/Notifications.tsx` | Notification panel |
| `ActivityFeed` | `app/components/ActivityFeed.tsx` | Recent activity display |
| `SystemHealthCard` | `app/components/SystemHealthCard.tsx` | Health check visualization |
| `SuperAdminShell` | `app/components/SuperAdminShell.tsx` | Layout wrapper for admin pages |

## Navigation System

**Top-Level Routes**:
- `/dashboard` — Main hub
- `/analytics` — Platform analytics
- `/users` — User management
- `/organizations` — Org management
- `/roles` — Role definitions
- `/roles-permissions` — Role-permission mapping
- `/approvals` — Approval workflows
- `/audit-logs` — Audit log viewer
- `/compliance` — Compliance center
- `/billing` — Billing management
- `/payroll` — Payroll hub
- `/subscriptions` — Subscription management
- `/settings` — Platform settings
- `/tenants` — Tenant management
- `/trust-center` — Trust and security
- `/security-center` — Security policies
- `/system-health` — System health dashboard
- Product hubs: `/zoiko-hr`, `/zoikopay`, `/zoikocorex`, `/zoikotime`

**Sidebar Navigation**:
- Links to main features
- Active state indication
- Permission-based visibility (future enhancement)

## Analytics Components

### Chart Components

**GrowthLineChart**
- Generic line chart for growth metrics
- X-axis: month labels (Jan-Jun)
- Y-axis: numeric values
- Used for revenue, user growth, payroll volume

**RevenueChart**
- Specialized line chart for financial data
- Currency formatting on Y-axis
- Monthly aggregation

**UserGrowthChart**
- User adoption over time
- Base + step linear growth
- Monthly breakdown

### Data Visualization

- **recharts** for all charting
- Color-coded status badges
- Responsive table layouts
- Trend indicators (up/down)

## Tables

### ReusableTable

Generic table component with:
- Dynamic columns
- Sorting capability
- Row styling based on status
- Pagination support (future)
- Search filtering

### Table Types

**Tenant Table** (`TenantRow`)
- ID, name, slug, status, organizations count, users count, created date

**Organization Table** (`OrganizationRow`)
- ID, name, tenant, plan, status, employee count, created date

**User Table** (`UserRow`)
- ID, name, email, tenant, status, email verification, created date

**Role Permission Table** (`RolePermissionRow`)
- ID, role, scope, permissions, user count

**Audit Log Table** (`AuditLogRow`)
- ID, tenant, actor, action, event type, category, outcome, resource, timestamp

**Subscription Table** (`SubscriptionRow`)
- ID, tenant, product, plan, seats, monthly amount, renewal date, status

**Payroll Table** (`PayrollOperationRow`)
- ID, tenant, run code, schedule, pay period, gross amount, employee count, approvals pending, status

**Compliance Table** (`ComplianceCenterRow`)
- ID, tenant, pack name, jurisdiction, score, alerts, violations, reviewed date, status

**ZoikoPay Table** (`ZoikoPayRow`)
- ID, tenant, reference, amount, settlement status, processed date, status

**ZoikoCoreX Table** (`ZoikoCoreXRow`)
- ID, tenant, name, integration, executions, failures, last run, status

# Backend Architecture

## Service-to-Data Pattern

### Complete Request Flow

```
HTTP Request
  ↓
API Route Handler (app/api/[feature]/route.ts)
  ├─ Dynamic rendering (force-dynamic)
  ├─ Permission check via withPermission() wrapper
  └─ Service method call
      ↓
Service Layer (app/services/[service].ts)
  ├─ Business logic
  ├─ Data aggregation
  ├─ Error handling
  └─ Repository method call
      ↓
Repository Layer (app/repositories/[repo].ts)
  ├─ Prisma query construction
  ├─ Tenant scoping
  └─ Data access
      ↓
Prisma Client (lib/prisma.ts)
  ├─ ORM translation
  └─ Connection pooling
      ↓
PostgreSQL
  └─ Data persistence
      ↓
Response
  ├─ JSON formatting
  ├─ Error handling
  └─ HTTP status codes
```

## API Routes

### Authentication Routes

**POST `/api/auth/login`**
- Public endpoint (no permission required)
- Input: `{ tenantSlug, email, password }`
- Output: `{ ok: true }` (tokens in httpOnly cookies)
- Handler: `login(input)` from securityService
- Audit: LOGIN event logged

**POST `/api/auth/refresh`**
- Public endpoint (validates refresh token)
- Input: None (reads refresh token from cookie)
- Output: `{ ok: true }` (new tokens in httpOnly cookies)
- Handler: `refreshSession(request)` from securityService
- Behavior: Rotates refresh token, issues new access token

**POST `/api/auth/logout`**
- Public endpoint (session-based)
- Input: None (reads access token from cookie)
- Output: Redirect to `/login`
- Handler: `logout(request)` from securityService
- Behavior: Revokes session, clears cookies, logs LOGOUT event

### Dashboard Routes

**GET `/api/dashboard`**
- Permission: `analytics.*`
- Handler: Dashboard KPI metrics
- Returns: Organization, user, revenue, payroll, compliance counts

**GET `/api/super-admin/dashboard`**
- Permission: `system.*`
- Handler: `getDashboardOverview()` from superAdminService
- Returns: Complete super admin dashboard data (KPIs, trends, risk analysis)

### Super Admin Routes

**GET `/api/super-admin/users`**
- Permission: `users.*`
- Handler: `getUsers()` from superAdminService
- Returns: UserRow[] (user listings with status, email verification)

**GET `/api/super-admin/organizations`**
- Permission: `organizations.*`
- Handler: `getOrganizations()` from superAdminService
- Returns: OrganizationRow[] (org listings with plans, employee counts)

**GET `/api/super-admin/tenants`**
- Permission: `tenants.*`
- Handler: `getTenants()` from superAdminService
- Returns: TenantRow[] (tenant listings with org/user counts)

**GET `/api/super-admin/roles-permissions`**
- Permission: `system.*`
- Handler: `getRolePermissions()` from superAdminService
- Returns: RolePermissionRow[] (role-permission mappings)

**POST `/api/super-admin/rbac/assign-role`**
- Permission: `system.*`
- Handler: Assigns role to user via `assignRole()`
- Input: `{ userId, roleId, tenantId }`

**POST `/api/super-admin/rbac/assign-permission`**
- Permission: `system.*`
- Handler: Assigns permission to user via `assignPermission()`
- Input: `{ userId, permissionId, tenantId }`

**GET `/api/super-admin/audit-logs`**
- Permission: `audit.*`
- Handler: `getAuditLogs(filters)` from superAdminService
- Filters: `{ search, eventType, category, outcome }`
- Returns: AuditLogRow[] (audit trail with pagination)

**GET `/api/super-admin/approvals`**
- Permission: `system.*`
- Handler: `getApprovalWorkflows()` from superAdminService
- Returns: ApprovalWorkflowRow[] (pending and completed approvals)

**GET `/api/super-admin/billing`**
- Permission: `billing.*`
- Handler: `getBilling()` from superAdminService
- Returns: BillingRow[] (plan, amount, renewal date)

**GET `/api/super-admin/subscriptions`**
- Permission: `billing.*`
- Handler: `getSubscriptions()` from superAdminService
- Returns: SubscriptionRow[] (active products and seats)

**GET `/api/super-admin/compliance`**
- Permission: `compliance.*`
- Handler: `getComplianceCenter()` from superAdminService
- Returns: ComplianceCenterRow[] (compliance packs and scores)

**GET `/api/super-admin/payroll-operations`**
- Permission: `payroll.*`
- Handler: `getPayrollOperations()` from superAdminService
- Returns: PayrollOperationRow[] (payroll runs with approval status)

**GET `/api/super-admin/zoikopay`**
- Permission: `billing.*`
- Handler: `getZoikoPayTransactions()` from superAdminService
- Returns: ZoikoPayRow[] (payment transactions and settlement status)

**GET `/api/super-admin/zoikocorex`**
- Permission: `system.*`
- Handler: `getZoikoCoreXWorkflows()` from superAdminService
- Returns: ZoikoCoreXRow[] (workflow telemetry and health)

**GET `/api/super-admin/analytics`**
- Permission: `analytics.*`
- Handler: `getAnalytics()` from superAdminService
- Returns: Revenue growth, tenant growth, user growth trends

**GET `/api/super-admin/system-health`**
- Permission: `system.*`
- Handler: `getSystemHealth()` from superAdminService
- Returns: SystemHealthRow[] (database, API, payroll, ZoikoCoreX health)

**GET `/api/super-admin/settings`**
- Permission: `system.*`
- Handler: Platform settings and configuration (future)

## Service Layer

### SecurityService (`app/services/securityService.ts`)

**Authentication Methods**:
- `login(input)` — Authenticate user with email/password
  - Validates tenant status
  - Verifies password against hash
  - Creates session with token hashing
  - Logs audit event
  - Returns access and refresh tokens

- `refreshSession(request)` — Rotate tokens on refresh
  - Validates refresh token from cookie
  - Verifies session still active
  - Rotates refresh token (new one generated)
  - Issues new access token
  - Returns tokens

- `logout(request)` — Revoke session
  - Extracts access token from cookie
  - Revokes session record
  - Logs audit event
  - Returns redirect to login

**Authorization Methods**:
- `requirePermission(permission)` — Enforce permission or throw 403
  - Gets current security context
  - Checks permission against user's grants
  - Logs denied access to audit
  - Throws AuthorizationError if denied

- `getCurrentSecurityContext()` — Get context from cookies
  - Verifies access token signature and expiry
  - Validates session binding
  - Returns SecurityContext with tenantId, userId, roles, permissions

**Utility Methods**:
- `setLoginCookies(response, tokens)` — Set auth cookies
  - Sets httpOnly, sameSite=lax, secure in prod
  - Max age: 15 minutes for access token

- `clearAuthCookies(response)` — Clear auth cookies
  - Deletes both access and refresh token cookies

**Error Class**:
- `AuthorizationError(message, status)` — Custom error for auth failures
  - Default status: 403
  - Message included in JSON response

### SuperAdminService (`app/services/superAdminService.ts`)

**Data Query Methods**:
- `getTenants()` — Fetch all tenants with org/user counts
- `getOrganizations()` — Fetch all orgs with status and employee count
- `getUsers()` — Fetch all users with status and email verification
- `getRolePermissions()` — Fetch role-permission mappings with user counts
- `getSubscriptions()` — Fetch product subscriptions with renewal dates
- `getComplianceCenter()` — Fetch compliance reports with scores and violations
- `getPayrollOperations()` — Fetch payroll runs with approval status
- `getZoikoPayTransactions()` — Fetch payment transactions and settlement status
- `getZoikoCoreXWorkflows()` — Fetch workflow telemetry with execution stats
- `getGovernancePolicies()` — Fetch governance policies with enforcement modes
- `getApprovalWorkflows()` — Fetch approval workflows with action history

**Audit Methods**:
- `getAuditLogs(filters)` — Query audit logs with full-text search
  - Filters: `{ search, eventType, category, outcome }`
  - Returns: AuditLogRow[] with pagination (take: 30)

- `getAuditTimeline(filters)` — Aggregate audit logs by date
  - Returns timeline with event/failure/denial counts

- `auditLogsToCsv(logs)` — Export audit logs to CSV
  - Fields: Tenant, Actor, Action, Event Type, Category, Outcome, Resource, Created

**Analytics Methods**:
- `getAnalytics()` — Fetch growth trends
  - Revenue growth (month-over-month)
  - Tenant growth
  - User growth

- `getSystemHealth()` — Fetch system health checks
  - Database connectivity via `prisma.$queryRaw`
  - API route availability
  - Payroll APIs status
  - ZoikoCoreX workflow health

- `getDashboardOverview()` — Fetch complete super admin dashboard
  - All KPIs and metrics
  - Trend data
  - Risk analysis
  - Top 6 risk organizations

**Fallback Pattern**:
- `safeQuery(query, fallback)` — Execute query with 1.5s timeout
  - Returns fallback data on timeout or error
  - Prevents dashboard failures on slow DB

### DashboardService (`app/services/dashboardService.ts`)

**Data Methods**:
- `getDashboardData()` — Fetch dashboard from `/api/dashboard`
  - Returns KPI metrics: organizations, users, revenue, payroll, payments, compliance

## Repository Layer

### SecurityRepository (`app/repositories/securityRepository.ts`)

**Authentication Methods**:
- `findTenantBySlug(slug)` — Lookup tenant by unique slug
- `findUserForLogin(tenantId, email)` — Fetch user with roles/permissions for login
  - Includes: tenant, roles with role.permissions, direct permissions
- `findSession(sessionId)` — Lookup active session with user/roles/permissions
- `createSession(input)` — Create new session record
  - Input: tenantId, userId, accessTokenId, refreshTokenHash, expiresAt, ipAddress, userAgent
- `rotateSession(sessionId, accessTokenId, refreshTokenHash, expiresAt)` — Update session tokens
- `revokeSession(sessionId)` — Mark session as revoked
- `findSessionByRefreshHash(refreshTokenHash)` — Lookup session by refresh token hash
  - Filters: not revoked, not expired, valid refresh hash

**Authorization Methods**:
- `assignRole(userId, roleId, tenantId, assignedById)` — Assign role to user (upsert)
- `assignPermission(userId, permissionId, tenantId, assignedById)` — Assign permission to user (upsert)
- `findRoleByKey(tenantId, key)` — Lookup role by RoleKey enum
- `findPermissionByKey(tenantId, key)` — Lookup permission by key string

**Audit Methods**:
- `writeAudit(input)` — Create audit log record
  - Input: tenantId, userId, action, eventType, category, outcome, resourceType, resourceId, resourceName, details, ipAddress, userAgent
  - Defaults: eventType=SYSTEM_EVENT, category=SYSTEM, outcome=SUCCESS

**Workflow Methods**:
- `listApprovalWorkflows()` — Fetch approval workflows with tenant, approver, action history
  - Includes: actions with actor, ordered by created date desc
  - Limit: 50 most recent

**Singleton Export**:
- `export const securityRepository = new SecurityRepository()`
  - Maintains single instance across application

## Prisma Integration

### Prisma Client (`lib/prisma.ts`)

```typescript
const prisma = globalForPrisma.prisma ?? new PrismaClient({ 
  log: ["query", "error", "warn"] 
});

// Dev environment caching to prevent multiple instances
if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

### Query Patterns

**Tenant-scoped findMany**:
```typescript
prisma.user.findMany({
  where: { tenantId },
  include: { tenant: true, roles: {...} },
  orderBy: { createdAt: "desc" },
  take: 25
})
```

**Permission checking**:
```typescript
prisma.user.findUnique({
  where: { tenantId_email: { tenantId, email } },
  include: {
    roles: { include: { role: { include: { permissions: {...} } } } },
    permissions: { include: { permission: true } }
  }
})
```

**Upsert for assignments**:
```typescript
prisma.userRole.upsert({
  where: { userId_roleId: { userId, roleId } },
  update: { assignedById },
  create: { userId, roleId, tenantId, assignedById }
})
```

# Authentication Architecture

## Login Flow

### Step-by-Step Process

1. **User submits credentials**
   ```
   POST /api/auth/login
   Body: { tenantSlug, email, password }
   ```

2. **Tenant validation**
   - SecurityRepository finds tenant by slug
   - Checks tenant.status === ACTIVE
   - Throws 401 if not found or suspended

3. **User lookup**
   - SecurityRepository finds user by (tenantId, email)
   - Includes: roles with permissions, direct permissions
   - Throws 401 if not found or inactive

4. **Password verification**
   - `verifyPassword(inputPassword, user.passwordHash)` using PBKDF2
   - Timing-safe comparison prevents timing attacks
   - Throws 401 if invalid

5. **Session creation**
   - Generate refresh token: `randomBytes(48).toString("base64url")`
   - Hash refresh token: `hmac(refresh_token, JWT_SECRET)`
   - Generate access token ID: `randomBytes(24).toString("base64url")`
   - Create Session record with refresh token hash
   - Set expiry: now + 30 days

6. **Grant collection**
   - Aggregate user roles → role permissions
   - Aggregate direct user permissions
   - Merge into unique permission set

7. **Token generation**
   - Sign access token with payload:
     ```json
     {
       "sub": userId,
       "tenantId": tenantId,
       "sessionId": sessionId,
       "jti": accessTokenId,
       "roles": ["SUPER_ADMIN", ...],
       "permissions": ["tenants.*", "users.*", ...],
       "iat": now,
       "exp": now + 900
     }
     ```
   - Algorithm: HMAC-SHA256
   - TTL: 15 minutes (900 seconds)

8. **Response**
   - Set httpOnly cookies:
     - `zoiko_access_token`: JWT access token (15 min)
     - `zoiko_refresh_token`: refresh token (30 days)
   - Cookie flags: sameSite=lax, secure (prod only)

9. **Audit logging**
   - Log LOGIN event: eventType=LOGIN, category=AUTHENTICATION, outcome=SUCCESS
   - Include IP address and User-Agent from request

## JWT Architecture

### Access Token

**Algorithm**: HMAC-SHA256

**Header**:
```json
{
  "alg": "HS256",
  "typ": "JWT"
}
```

**Payload**:
```json
{
  "sub": "user-id",
  "tenantId": "tenant-id",
  "sessionId": "session-id",
  "jti": "access-token-id",
  "roles": ["SUPER_ADMIN"],
  "permissions": ["tenants.*", "organizations.*", ...],
  "iat": 1234567890,
  "exp": 1234568790
}
```

**Signature**:
```
HMACSHA256(
  base64url(header) + "." + base64url(payload),
  JWT_SECRET
)
```

**TTL**: 15 minutes (900 seconds)

**Verification Process**:
1. Extract header, body, signature from token
2. Recompute signature with `HMACSHA256(header.body, JWT_SECRET)`
3. Timing-safe compare: `timingSafeEqual(provided, expected)`
4. Verify expiry: `exp > now`
5. Validate payload structure

### Refresh Token

**Generation**:
- Random 48 bytes encoded as base64url
- Each refresh issues new refresh token (rotation)

**Storage**:
- Hashed with HMAC-SHA256 in Session.refreshTokenHash
- Original token only sent to client once

**Validation**:
- Hash incoming refresh token
- Lookup Session by refreshTokenHash
- Verify session not revoked
- Verify session not expired
- Issue new tokens

## Refresh Token Flow

### Step-by-Step Process

1. **Client sends refresh token**
   ```
   POST /api/auth/refresh
   Cookies: { zoiko_refresh_token: <token> }
   ```

2. **Extract and hash refresh token**
   - Get refresh token from cookie
   - Hash it: `hmac(token, JWT_SECRET)`

3. **Lookup session**
   - Find Session where refreshTokenHash matches
   - Filters: revokedAt IS NULL, expiresAt > now

4. **Validate session**
   - User must be active
   - Tenant must be ACTIVE
   - Session must not be expired

5. **Rotate tokens**
   - Generate new refresh token (48 bytes)
   - Generate new access token ID (24 bytes)
   - Hash new refresh token
   - Update Session with new tokens and expiry
   - Set expiry: now + 30 days

6. **Sign new access token**
   - Payload includes new jti (token ID)
   - Same grants (roles/permissions)
   - TTL: 15 minutes

7. **Set cookies**
   - New access token in httpOnly cookie
   - New refresh token in httpOnly cookie

8. **Response**
   ```json
   { "ok": true }
   ```

## Session Management

### Session Model

```prisma
model Session {
  id               String    @id @default(cuid())
  tenantId         String
  userId           String
  accessTokenId    String?   @unique
  refreshTokenHash String
  expiresAt        DateTime
  ipAddress        String?
  userAgent        String?
  createdAt        DateTime  @default(now())
  revokedAt        DateTime?

  tenant Tenant @relation(...)
  user   User   @relation(...)

  @@index([userId])
  @@index([tenantId])
  @@index([expiresAt])
}
```

### Session Lifecycle

1. **Creation** — On successful login
   - Store refresh token hash (not plaintext)
   - Record access token ID (for jti binding)
   - Capture IP and User-Agent
   - Expiry: 30 days

2. **Validation** — On each request
   - Verify access token signature
   - Check token expiry
   - Lookup Session by token ID
   - Verify jti matches (token theft prevention)
   - Verify user active
   - Verify tenant active
   - Return SecurityContext if valid

3. **Rotation** — On token refresh
   - Generate new refresh token
   - Hash new refresh token
   - Update Session with new hashes and expiry
   - Old tokens become invalid

4. **Revocation** — On logout
   - Set revokedAt to now
   - Session becomes invalid for all future requests
   - Audit logged

### Security Properties

- **Session binding**: Access token jti must match Session.accessTokenId
- **Refresh token security**: Only hash stored, not plaintext
- **Expiry enforcement**: Sessions expire after 30 days
- **User state binding**: User must be active and tenant must be ACTIVE
- **IP/User-Agent logging**: Captured for security audits

## Password Security

### Hashing Algorithm: PBKDF2

**Parameters**:
- **Algorithm**: PBKDF2 with SHA256
- **Iterations**: 210,000 (industry standard)
- **Salt**: 16 random bytes (base64url encoded)
- **Key length**: 32 bytes
- **Digest**: SHA256

### Hash Format

```
pbkdf2:210000:salt:derivedKey
```

Example:
```
pbkdf2:210000:rB9Q_vX2k8L4mN7qP9Yz2w:3F4kL5pQ9vX2m8n7zB3cJ6R4T9wZ1xY5u4vM8sP
```

### Verification Process

1. Parse stored hash: `[algorithm, iterations, salt, hash]`
2. Validate format: algorithm must be "pbkdf2"
3. Derive key from input password:
   - PBKDF2(password, salt, iterations=210000, keyLength=32, digest="sha256")
4. Timing-safe compare: `timingSafeEqual(derivedKey, storedHash)`
5. Return true only if lengths match AND bytes match

### Security Practices

- **Timing-safe comparison** prevents timing attacks
- **High iteration count** (210k) resists brute force
- **Unique salt per password** prevents rainbow tables
- **Never return whether password is wrong** (generic 401 message)

# RBAC Architecture

## Role Model

### Available Roles

| Role | Scope | Purpose | Key Permissions |
|------|-------|---------|-----------------|
| `SUPER_ADMIN` | Platform | Full platform access | All 9 domains.* |
| `PLATFORM_ADMIN` | Platform | Admin without tenant control | tenants.*, organizations.*, users.*, billing.*, analytics.*, audit.*, system.* |
| `TENANT_ADMIN` | Tenant | Manage org and users | organizations.*, users.*, analytics.*, audit.* |
| `HR_ADMIN` | Tenant | HR operations | organizations.*, users.*, analytics.* |
| `PAYROLL_ADMIN` | Tenant | Payroll operations | payroll.*, audit.* |
| `COMPLIANCE_ADMIN` | Tenant | Compliance management | compliance.*, audit.* |
| `AUDITOR` | Tenant | Read-only audit | analytics.*, audit.*, compliance.* |

### Role Model Fields

```prisma
model Role {
  id          String   @id @default(cuid())
  tenantId    String
  key         RoleKey  @enum  // SUPER_ADMIN, PLATFORM_ADMIN, etc.
  name        String   // Human-readable name
  description String?  // Optional description
  isSystem    Boolean  @default(true)  // System role vs custom
  createdAt   DateTime
  updatedAt   DateTime

  tenant      Tenant
  users       UserRole[]
  permissions RolePermission[]

  @@unique([tenantId, key])
  @@index([tenantId])
}
```

## Permission Model

### Permission Domains

| Domain | Purpose | Actions (examples) |
|--------|---------|------------------|
| `TENANTS` | Tenant management | Create, read, update, suspend |
| `ORGANIZATIONS` | Org management | Create, read, update, delete |
| `USERS` | User management | Create, read, update, deactivate |
| `PAYROLL` | Payroll operations | Create runs, approve, process |
| `COMPLIANCE` | Compliance enforcement | View reports, manage policies |
| `BILLING` | Billing and subscriptions | Manage subscriptions, view invoices |
| `ANALYTICS` | Analytics and reporting | View dashboards, export data |
| `AUDIT` | Audit trail access | View logs, export audit trails |
| `SYSTEM` | Platform administration | System settings, health checks |

### Permission Format

Permissions use `domain.action` format with wildcard support:
- Specific: `users.create`, `payroll.approve`
- Domain wildcard: `users.*` (all user actions)
- System wildcard: `system.*` (platform-wide access)

### Permission Model Fields

```prisma
model Permission {
  id          String           @id @default(cuid())
  tenantId    String
  key         String           // "users.create", "payroll.*", etc.
  domain      PermissionDomain @enum  // Enum value for grouping
  action      String           // Action part of permission
  description String?
  createdAt   DateTime
  updatedAt   DateTime

  tenant Tenant
  roles  RolePermission[]
  users  UserPermission[]

  @@unique([tenantId, key])
  @@index([tenantId])
  @@index([domain])
}

enum PermissionDomain {
  TENANTS
  ORGANIZATIONS
  USERS
  PAYROLL
  COMPLIANCE
  BILLING
  ANALYTICS
  AUDIT
  SYSTEM
}
```

## Assignment Models

### UserRole

Maps users to roles with audit trail:

```prisma
model UserRole {
  id           String   @id @default(cuid())
  tenantId     String
  userId       String
  roleId       String
  assignedAt   DateTime @default(now())
  assignedById String?  // Who assigned this role

  user User
  role Role

  @@unique([userId, roleId])
  @@index([tenantId])
  @@index([roleId])
}
```

### RolePermission

Maps roles to permissions:

```prisma
model RolePermission {
  id           String   @id @default(cuid())
  tenantId     String
  roleId       String
  permissionId String
  assignedAt   DateTime @default(now())

  role       Role
  permission Permission

  @@unique([roleId, permissionId])
  @@index([tenantId])
  @@index([permissionId])
}
```

### UserPermission

Direct user-to-permission overrides (bypass role):

```prisma
model UserPermission {
  id           String   @id @default(cuid())
  tenantId     String
  userId       String
  permissionId String
  assignedAt   DateTime @default(now())
  assignedById String?  // Who assigned this permission

  user       User
  permission Permission

  @@unique([userId, permissionId])
  @@index([tenantId])
  @@index([permissionId])
}
```

## Permission Checking

### hasPermission() Function

Located in `lib/security/rbac.ts`:

```typescript
export function hasPermission(grants: string[], required: string) {
  const [domain] = required.split(".");
  
  return grants.includes(required)           // Exact match: "users.create"
      || grants.includes(`${domain}.*`)      // Domain wildcard: "users.*"
      || grants.includes("system.*");        // System wildcard
}
```

### Grant Collection

In `securityService.collectGrants(user)`:

1. Aggregate user roles → role permissions
2. Aggregate direct user permissions
3. Merge into unique set
4. Return: `{ roles: [...], permissions: [...] }`

### Authorization Enforcement

All protected routes use `withPermission(domain.action, handler)`:

```typescript
export function withPermission(permission: string, handler: ...) {
  return async function protectedHandler(request: NextRequest) {
    try {
      await requirePermission(permission);  // Throws 403 if denied
      return await handler(request);
    } catch (error) {
      if (error instanceof AuthorizationError) {
        return NextResponse.json(
          { error: error.message }, 
          { status: error.status }
        );
      }
      return NextResponse.json(
        { error: "Security enforcement failed." }, 
        { status: 500 }
      );
    }
  };
}
```

### Denied Access Audit

When permission denied:
- Log audit event: eventType=SECURITY_EVENT, category=AUTHORIZATION, outcome=DENIED
- Include resourceName (the permission that was denied)
- Log IP and User-Agent
- Return 403 with error message

# Multi-Tenant Architecture

## Tenant Model

Root entity for all tenant data:

```prisma
model Tenant {
  id        String       @id @default(cuid())
  name      String
  slug      String       @unique
  status    TenantStatus @default(ACTIVE)
  createdAt DateTime     @default(now())
  updatedAt DateTime     @updatedAt

  // Relations to all tenant-owned data
  organizations        Organization[]
  users                User[]
  sessions             Session[]
  auditLogs            AuditLog[]
  subscriptions        Subscription[]
  complianceReports    ComplianceReport[]
  payrollRuns          PayrollRun[]
  zoikoPayTransactions ZoikoPayTransaction[]
  zoikoCoreXWorkflows  ZoikoCoreXWorkflow[]
  governancePolicies   GovernancePolicy[]
  approvalWorkflows    ApprovalWorkflow[]
  roles                Role[]
  permissions          Permission[]

  @@unique([slug])
  @@index([status])
}

enum TenantStatus {
  ACTIVE         // Can login and operate
  SUSPENDED      // No access, audit logged
  DELETED        // Soft-delete, cascades to children
}
```

## Organization Model

Business units within tenant:

```prisma
model Organization {
  id             String             @id @default(cuid())
  tenantId       String
  name           String
  plan           Plan               @default(ENTERPRISE)
  status         OrganizationStatus @default(ACTIVE)
  employeesCount Int                @default(0)
  createdAt      DateTime
  updatedAt      DateTime

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, name])
  @@index([tenantId])
}

enum Plan {
  TRIAL
  PREMIUM
  ENTERPRISE
}

enum OrganizationStatus {
  ACTIVE
  PENDING
  SUSPENDED
  DELETED
}
```

## User Model

Platform users at tenant level:

```prisma
model User {
  id              String   @id @default(cuid())
  tenantId        String
  email           String
  firstName       String
  lastName        String
  passwordHash    String
  isActive        Boolean  @default(true)
  isEmailVerified Boolean  @default(false)
  createdAt       DateTime
  updatedAt       DateTime

  tenant            Tenant
  sessions          Session[]
  auditLogs         AuditLog[]
  roles             UserRole[]
  permissions       UserPermission[]
  approvalActions   ApprovalAction[]
  assignedApprovals ApprovalWorkflow[] @relation("ApprovalAssignee")

  @@unique([tenantId, email])
  @@index([tenantId])
}
```

## Data Isolation Strategy

### Query Scoping

Every Prisma query must include `{ where: { tenantId } }`:

```typescript
// ✅ Correct: tenant-scoped
prisma.user.findMany({
  where: { tenantId },  // Essential!
  ...
})

// ❌ Wrong: exposes all tenants
prisma.user.findMany(...)
```

### Unique Constraints

Most models use composite unique constraints:

```prisma
@@unique([tenantId, field])  // Prevents cross-tenant collisions
```

Examples:
- `User`: `@@unique([tenantId, email])`
- `Organization`: `@@unique([tenantId, name])`
- `Role`: `@@unique([tenantId, key])`
- `Permission`: `@@unique([tenantId, key])`
- `PayrollRun`: `@@unique([tenantId, runCode])`
- `ZoikoPayTransaction`: `@@unique([tenantId, reference])`

### Cascade Deletes

Deleting a tenant cascades to all child entities:

```prisma
tenant Tenant @relation(
  fields: [tenantId], 
  references: [id], 
  onDelete: Cascade  // Cascade all deletions
)
```

Children that cascade:
- Organizations
- Users (and their sessions, roles, permissions)
- AuditLogs
- Subscriptions
- PayrollRuns
- ZoikoPayTransactions
- Compliance reports
- Governance policies
- Approval workflows

### Session Isolation

Sessions tied to specific tenant (no cross-tenant reuse):

```prisma
model Session {
  tenantId    String  // Session bound to tenant
  userId      String
  ...
  @@index([tenantId])
}
```

Session validation checks:
1. Token signature valid
2. Tenant status = ACTIVE
3. User active
4. Session not revoked
5. Session not expired

### Audit Isolation

All audit logs include `tenantId`:

```prisma
model AuditLog {
  tenantId    String  // Audit log belongs to tenant
  ...
  @@index([tenantId])
}
```

Query filters:
```typescript
prisma.auditLog.findMany({
  where: { tenantId }  // Tenant-scoped audit queries
})
```

## Subscription Management

### Subscription Model

Product subscriptions per tenant:

```prisma
model Subscription {
  id            String             @id @default(cuid())
  tenantId      String
  product       ZoikoProduct
  plan          Plan               @default(ENTERPRISE)
  status        SubscriptionStatus @default(ACTIVE)
  seats         Int                @default(0)
  monthlyAmount Int                @default(0)  // In cents
  renewalDate   DateTime
  createdAt     DateTime
  updatedAt     DateTime

  tenant Tenant @relation(fields: [tenantId], references: [id], onDelete: Cascade)

  @@unique([tenantId, product])  // One subscription per product per tenant
  @@index([tenantId])
  @@index([status])
}

enum ZoikoProduct {
  ZOIKO_HR
  ZOIKO_TIME
  ZOIKO_PAYROLL
  ZOIKO_BILLING
  ZOIKO_COMPLY
  ZOIKO_INSIGHTS
}

enum SubscriptionStatus {
  ACTIVE
  TRIALING
  PAST_DUE
  SUSPENDED
  CANCELED
}
```

### Subscription Lifecycle

1. **Trial** — Start with TRIALING status
   - Limited time access
   - Renewable for evaluation period

2. **Active** — ACTIVE status
   - Paid subscription
   - Monthly renewal tracking

3. **Past Due** — PAST_DUE status
   - Payment failed
   - Escalation warning

4. **Suspended** — SUSPENDED status
   - Payment issue or manual suspension
   - No feature access

5. **Canceled** — CANCELED status
   - Tenant opted out
   - May be reactivated

# Governance Architecture

## Governance Policies

### Model

```prisma
model GovernancePolicy {
  id          String           @id @default(cuid())
  tenantId    String
  name        String
  domain      GovernanceDomain
  enforcement EnforcementMode  @default(MONITOR)
  status      GovernanceStatus @default(ENABLED)
  exceptions  Int              @default(0)
  updatedAt   DateTime         @updatedAt
  createdAt   DateTime

  tenant Tenant

  @@unique([tenantId, name])
  @@index([tenantId])
  @@index([domain])
}

enum GovernanceDomain {
  RBAC               // Role-based access control rules
  PAYROLL            // Payroll-specific governance
  COMPLIANCE         // Compliance requirements
  BILLING            // Billing and subscription rules
  SECURITY           // Security and authentication
  DATA_RETENTION     // Data retention policies
}

enum EnforcementMode {
  MONITOR            // Log policy violations, allow action
  WARN               // Alert on violation, allow action
  BLOCK              // Deny action, enforce policy
}

enum GovernanceStatus {
  ENABLED            // Policy is active
  DISABLED           // Policy not enforced
  REVIEW_REQUIRED    // Policy needs review
}
```

### Examples

- **RBAC**: Role assignment restrictions, permission escalation limits
- **PAYROLL**: Approval thresholds, dual approval requirements
- **COMPLIANCE**: Jurisdiction-specific rules, audit frequency
- **BILLING**: Payment method restrictions, discount caps
- **SECURITY**: Password complexity, session duration limits
- **DATA_RETENTION**: Log retention periods, export restrictions

## Approval Workflows

### Model

```prisma
model ApprovalWorkflow {
  id                String               @id @default(cuid())
  tenantId          String
  workflowType      ApprovalWorkflowType
  resourceType      String               // Type of resource being approved
  resourceId        String?              // ID of resource
  title             String               // Human-readable title
  state             ApprovalState        @default(PENDING)
  requestedById     String?              // Who requested approval
  currentApproverId String?              // Current approver
  escalationLevel   Int                  @default(0)
  escalatedAt       DateTime?
  dueAt             DateTime?            // Approval deadline
  completedAt       DateTime?
  createdAt         DateTime
  updatedAt         DateTime

  tenant          Tenant
  currentApprover User?                @relation("ApprovalAssignee", ...)
  actions         ApprovalAction[]

  @@index([tenantId])
  @@index([workflowType])
  @@index([state])
}

enum ApprovalWorkflowType {
  PAYROLL_APPROVAL              // Payroll run approval
  COMPLIANCE_APPROVAL           // Compliance policy approval
  SUBSCRIPTION_APPROVAL         // Product subscription approval
  TENANT_ACTIVATION_APPROVAL    // Tenant onboarding approval
}

enum ApprovalState {
  PENDING              // Awaiting approval
  APPROVED             // Approved and ready for processing
  REJECTED             // Rejected by approver
  ESCALATED            // Escalated to higher authority
  CANCELED             // Canceled/withdrawn
}
```

### Approval Actions

Track approval history:

```prisma
model ApprovalAction {
  id         String             @id @default(cuid())
  workflowId String
  tenantId   String
  actorId    String?            // Who performed action
  action     ApprovalActionType
  comment    String?            // Optional comment
  createdAt  DateTime

  workflow ApprovalWorkflow
  actor    User?

  @@index([tenantId])
  @@index([workflowId])
  @@index([actorId])
}

enum ApprovalActionType {
  REQUESTED              // Approval requested
  APPROVED               // Approved by reviewer
  REJECTED               // Rejected by reviewer
  ESCALATED              // Escalated to higher level
  REASSIGNED             // Reassigned to different approver
  COMMENTED              // Comment added (no decision)
}
```

### Multi-Level Approvals

Workflow supports escalation:
1. Level 0: Direct approver handles
2. Level 1: Escalate if no response (reassign or escalate)
3. Level 2: Senior approver override
4. Level N: Final authority override

## Compliance Reports

### Model

```prisma
model ComplianceReport {
  id           String           @id @default(cuid())
  tenantId     String
  packName     String           // "US Payroll Governance", etc.
  jurisdiction String           // "United States", "EU", etc.
  score        Int              // 0-100 compliance score
  alerts       Int              @default(0)
  violations   Int              @default(0)
  status       ComplianceStatus @default(COMPLIANT)
  reviewedAt   DateTime?
  createdAt    DateTime
  updatedAt    DateTime

  tenant Tenant

  @@index([tenantId])
  @@index([status])
}

enum ComplianceStatus {
  COMPLIANT              // No violations
  WATCHLIST              // Minor issues, monitoring
  VIOLATION              // Policy violations detected
  REMEDIATION            // Violation remediation in progress
}
```

### Compliance Scoring

- **Score**: 0-100 (higher = more compliant)
- **Alerts**: Count of compliance warnings
- **Violations**: Count of policy violations
- **Status**: Overall compliance state

### Compliance Dashboard

Displays:
- Packs by jurisdiction
- Scores and trends
- Violations and alerts
- Remediation actions

# Payroll Foundation

## PayrollRun Model

```prisma
model PayrollRun {
  id               String           @id @default(cuid())
  tenantId         String
  runCode          String           // "PAY-2026-06" format
  scheduleName     String           // "Monthly Payroll", "Bi-weekly", etc.
  payPeriod        String           // "Jun 2026"
  grossAmount      Int              @default(0)  // In cents
  employeeCount    Int              @default(0)
  approvalsPending Int              @default(0)
  status           PayrollRunStatus @default(PENDING_APPROVAL)
  failureReason    String?
  processedAt      DateTime?
  createdAt        DateTime
  updatedAt        DateTime

  tenant Tenant

  @@unique([tenantId, runCode])
  @@index([tenantId])
  @@index([status])
}

enum PayrollRunStatus {
  DRAFT                      // Initial creation
  PENDING_APPROVAL           // Awaiting approvals
  APPROVED                   // All approvals complete
  PROCESSING                 // Being processed by payroll system
  COMPLETED                  // Successfully processed
  FAILED                     // Processing failed
  CORRECTION_REQUIRED        // Corrections needed before retry
}
```

## Approval Process

Payroll runs require approval workflow before processing:

1. **Create PayrollRun** → status = DRAFT
2. **Submit for approval** → status = PENDING_APPROVAL
3. **Create ApprovalWorkflow** → type = PAYROLL_APPROVAL
4. **Approvers review** → ApprovalActions recorded
5. **All approvals granted** → status = APPROVED
6. **Submit to payroll system** → status = PROCESSING
7. **Payroll system processes** → status = COMPLETED or FAILED

### Approval Requirements

- Approval threshold based on gross amount
- Dual approval for large payrolls (>$500k)
- Department manager approval
- Finance manager sign-off
- Escalation if approver unavailable

## Status Lifecycle

```
DRAFT
  ↓ (Submit)
PENDING_APPROVAL
  ├─ (Reject) → Returns to DRAFT
  ├─ (Escalate) → Higher approval level
  └─ (All approve) → APPROVED
      ↓ (Process)
      PROCESSING
        ├─ (Success) → COMPLETED
        └─ (Failure) → FAILED
            ├─ (Correct & retry) → CORRECTION_REQUIRED
            └─ (Debug) → Remains FAILED
```

## Payroll Analytics

Tracked and visualized in dashboard:

### Volume Metrics
- Monthly payroll volume (sum of gross amount)
- Payroll run count
- Active vs. failed runs
- Average run size

### Timeline Data
- Monthly trend: gross amount per month
- Run status distribution: DRAFT, PENDING, APPROVED, PROCESSING, COMPLETED, FAILED
- Approval duration: time from submission to approval

### Risk Scoring
- By organization: payroll size, compliance violations, security failures
- Risk formula: (employee_count * 0.2) + (compliance_issues * 8) + (security_failures * 4)
- Top 6 risk organizations highlighted

### Compliance
- Approval adherence: % of runs with required approvals
- Processing time: average payroll processing duration
- Error rate: % of runs that failed

# ZoikoPay Foundation

## ZoikoPayTransaction Model

```prisma
model ZoikoPayTransaction {
  id               String                    @id @default(cuid())
  tenantId         String
  reference        String                   // Transaction reference ID
  amount           Int                      // In cents
  currency         String                   @default("USD")
  status           ZoikoPayTransactionStatus @default(PENDING)
  settlementStatus SettlementStatus         @default(PENDING)
  processedAt      DateTime?
  createdAt        DateTime
  updatedAt        DateTime

  tenant Tenant

  @@unique([tenantId, reference])
  @@index([tenantId])
  @@index([status])
}

enum ZoikoPayTransactionStatus {
  PENDING             // Initial creation, awaiting processing
  SUCCESSFUL          // Transaction processed successfully
  FAILED              // Payment processing failed
  REVERSED            // Transaction reversed/refunded
}

enum SettlementStatus {
  PENDING             // Awaiting settlement
  SETTLED             // Funds settled
  DELAYED             // Settlement delayed
  FAILED              // Settlement failed
}
```

## Transaction Lifecycle

### Step-by-step Flow

1. **Transaction Created**
   - Status: PENDING
   - settlementStatus: PENDING
   - Timestamp: createdAt

2. **Payment Processing**
   - Gateway processes payment
   - Status updated: SUCCESSFUL or FAILED
   - If successful: processedAt set

3. **Settlement Initiation**
   - settlementStatus: PENDING
   - Funds moved to settlement queue
   - Hold period: typically 1-3 business days

4. **Settlement Completion**
   - settlementStatus: SETTLED or DELAYED
   - If delayed: reason logged
   - Funds transferred to tenant account

5. **Failure Handling**
   - settlementStatus: FAILED
   - Retry mechanism triggered
   - Notification sent to tenant

### Multi-Currency Support

- `currency` field stores ISO code (USD, EUR, GBP, etc.)
- Conversion tracked separately
- Settlement in local currency if needed

## Integration with Payroll

- PayrollRun creates ZoikoPayTransaction records
- Settlement status linked to payroll completion
- Dashboard shows settlement backlog

# ZoikoCoreX Foundation

## ZoikoCoreXWorkflow Model

```prisma
model ZoikoCoreXWorkflow {
  id              String         @id @default(cuid())
  tenantId        String
  workflowKey     String         // Unique workflow identifier
  name            String         // Human-readable name
  integrationName String         // System it integrates with
  executions      Int            @default(0)  // Total execution count
  failures        Int            @default(0)  // Total failure count
  status          WorkflowStatus @default(HEALTHY)
  lastRunAt       DateTime?      // Last execution timestamp
  createdAt       DateTime
  updatedAt       DateTime

  tenant Tenant

  @@unique([tenantId, workflowKey])
  @@index([tenantId])
  @@index([status])
}

enum WorkflowStatus {
  HEALTHY              // All recent executions successful
  DEGRADED             // Some failures but still operational
  FAILED               // Majority of recent executions failing
  PAUSED               // Manually paused
}
```

## Workflow Automation Model

### Supported Workflows

- **Payroll Approval Sync** — Sync approval decisions to payroll system
- **Compliance Reporting** — Automated compliance report generation
- **Tax Filing Automation** — Automated tax calculations and filing
- **Payment Settlement** — Automated payment settlement and reconciliation
- **Audit Trail Generation** — Automated audit log archival and reporting
- **Policy Enforcement** — Automated policy compliance checking

### Execution Telemetry

Tracks:
- **executions**: Total workflow runs
- **failures**: Total failed runs
- **lastRunAt**: Last execution timestamp
- **status**: Overall health

### Health Monitoring

Status determined by:
- Recent execution success rate
- Error trend
- Response time

**HEALTHY**: >95% success rate, <1s avg response
**DEGRADED**: 80-95% success rate, 1-5s avg response
**FAILED**: <80% success rate
**PAUSED**: Manually paused by admin

### Integration Points

Workflows integrate with:
- **Zoiko Payroll** — Payroll processing and approvals
- **ZoikoPay** — Payment processing and settlement
- **Compliance System** — Report generation and policy enforcement
- **Audit System** — Log collection and archival
- **External APIs** — Tax systems, banking, regulatory

# Database Architecture

## Complete Prisma Schema

### Core Platform Models

**Tenant**
- Root multi-tenant entity
- Status: ACTIVE, SUSPENDED, DELETED
- Relations: All tenant-owned data

**Organization**
- Business units within tenant
- Plan: TRIAL, PREMIUM, ENTERPRISE
- Status: ACTIVE, PENDING, SUSPENDED, DELETED

**User**
- Platform users at tenant level
- Email and password stored (hashed)
- Email verification flag
- Active status

**Session**
- Active user sessions
- Refresh token hash stored (not plaintext)
- Access token ID for jti binding
- IP and User-Agent logging
- Expiry and revocation tracking

### RBAC Models

**Role**
- Named role per tenant
- Predefined system roles
- Role-to-permission mapping

**Permission**
- Granular permission per tenant
- Domain-scoped (TENANTS, USERS, PAYROLL, etc.)
- Wildcard support

**UserRole**
- User-to-role assignment
- Audit trail (assignedById)

**RolePermission**
- Role-to-permission mapping
- Bulk assignment support

**UserPermission**
- Direct user-to-permission override
- Bypasses role hierarchy

### Audit & Compliance Models

**AuditLog**
- Immutable event trail
- Event type and category
- Outcome (SUCCESS, FAILURE, DENIED)
- Actor and resource tracking
- IP and User-Agent logging
- JSON details field for complex data

**ComplianceReport**
- Compliance pack status
- Score and violation tracking
- Status: COMPLIANT, WATCHLIST, VIOLATION, REMEDIATION

### Product Models

**Subscription**
- Product subscription per tenant
- Plan and seat tracking
- Monthly amount and renewal date
- Status: ACTIVE, TRIALING, PAST_DUE, SUSPENDED, CANCELED

**PayrollRun**
- Payroll batch processing
- Status: DRAFT, PENDING_APPROVAL, APPROVED, PROCESSING, COMPLETED, FAILED, CORRECTION_REQUIRED
- Gross amount and employee count
- Approval tracking

**ZoikoPayTransaction**
- Payment transaction
- Status and settlement tracking
- Multi-currency support
- Processed timestamp

### Governance Models

**GovernancePolicy**
- Policy enforcement rules
- Domain-scoped (RBAC, PAYROLL, COMPLIANCE, BILLING, SECURITY, DATA_RETENTION)
- Enforcement mode: MONITOR, WARN, BLOCK
- Status: ENABLED, DISABLED, REVIEW_REQUIRED

**ApprovalWorkflow**
- Multi-step approval process
- Type: PAYROLL_APPROVAL, COMPLIANCE_APPROVAL, SUBSCRIPTION_APPROVAL, TENANT_ACTIVATION_APPROVAL
- State: PENDING, APPROVED, REJECTED, ESCALATED, CANCELED
- Escalation level and due date tracking

**ApprovalAction**
- Approval history
- Action type: REQUESTED, APPROVED, REJECTED, ESCALATED, REASSIGNED, COMMENTED
- Actor and timestamp tracking

### Automation Models

**ZoikoCoreXWorkflow**
- Workflow automation telemetry
- Execution and failure tracking
- Status: HEALTHY, DEGRADED, FAILED, PAUSED
- Last run timestamp

## Relationship Hierarchy

```
Tenant (root)
├── Organization (has many)
├── User (has many)
│   ├── Session (has many)
│   ├── UserRole → Role (many-to-many)
│   │   └── RolePermission → Permission (many-to-many)
│   └── UserPermission → Permission (many-to-many)
├── Role (has many)
├── Permission (has many)
├── AuditLog (has many)
├── Subscription (has many)
├── PayrollRun (has many)
│   └── ApprovalWorkflow (1-to-1)
│       └── ApprovalAction (has many)
├── ZoikoPayTransaction (has many)
├── ComplianceReport (has many)
├── GovernancePolicy (has many)
├── ApprovalWorkflow (has many)
└── ZoikoCoreXWorkflow (has many)
```

## Indexing Strategy

### Tenant Scoping
- Primary index: `@@index([tenantId])` on all tenant-scoped models
- Enables efficient filtering by tenant

### Unique Constraints
- Composite unique: `@@unique([tenantId, field])` prevents collisions
- Examples: email, org name, role key, permission key, run code, transaction reference

### Query Optimization
- Indexes on foreign keys: `userId`, `roleId`, `permissionId`
- Indexes on status fields: `status`, `state`, `workflowStatus`
- Indexes on timestamps: `expiresAt`, `createdAt`
- Indexes on lookups: `slug`, `email`, `key`

### Query Patterns
- Tenant + status: `findMany({ where: { tenantId, status } })`
- Tenant + timestamp: `findMany({ where: { tenantId, createdAt: { gte } } })`
- Unique lookups: `findUnique({ where: { tenantId_key } })`

# Product Ecosystem

## Currently Implemented

### Zoiko One (Platform)
- **Purpose**: Multi-tenant governance and operations hub
- **Status**: Core platform (MVP)
- **Features**:
  - Tenant management and activation
  - RBAC and access control
  - Audit logging and compliance
  - Dashboard and analytics
  - System health monitoring
  - Approval workflows

### Zoiko Payroll (Foundation)
- **Purpose**: Payroll processing and management
- **Status**: Foundation models implemented
- **Features**:
  - Payroll run creation and tracking
  - Multi-level approval workflows
  - Payroll analytics and reporting
  - Settlement tracking
  - Status lifecycle management

### ZoikoPay (Foundation)
- **Purpose**: Payment transaction processing
- **Status**: Foundation models implemented
- **Features**:
  - Transaction creation and tracking
  - Settlement status monitoring
  - Multi-currency support
  - Integration with payroll settlement

### ZoikoCoreX (Foundation)
- **Purpose**: Workflow automation and orchestration
- **Status**: Foundation models implemented
- **Features**:
  - Workflow execution telemetry
  - Health monitoring
  - Integration tracking
  - Failure analysis and recovery

## Planned Products

### ZoikoHR (Phase 1)
- **Purpose**: Comprehensive HR and workforce management
- **Planned Features**:
  - Employee lifecycle management
  - Organizational hierarchy
  - Leave and attendance
  - Document management
  - Asset tracking
  - Recruitment pipeline
  - Performance reviews
  - Learning and development
  - Compensation and benefits

### ZoikoTime (Phase 2)
- **Purpose**: Time and attendance tracking
- **Planned Features**:
  - Shift scheduling
  - Time clock / punch-in system
  - Overtime tracking
  - Attendance reports
  - Mobile app integration

### ZoikoBilling (Phase 3)
- **Purpose**: Billing and invoicing
- **Planned Features**:
  - Invoice generation
  - Payment tracking
  - Subscription management
  - Revenue recognition
  - Financial reporting

### ZoikoComply (Phase 4)
- **Purpose**: Compliance and regulatory management
- **Planned Features**:
  - Compliance pack management
  - Audit trail and evidence
  - Policy enforcement
  - Regulatory reporting
  - Compliance dashboards

### ZoikoInsights (Phase 5)
- **Purpose**: Analytics and business intelligence
- **Planned Features**:
  - Custom dashboards
  - Data warehouse integration
  - Predictive analytics
  - Reporting and export
  - Data visualization

## Product Integration Model

### Hub-and-Spoke Architecture

```
Zoiko One (Hub)
├── Identity & Access (RBAC)
├── Approval Workflows
├── Audit & Compliance
├── Governance Policies
└── Notifications

↓ (APIs)

Product Modules (Spokes)
├── ZoikoHR
├── ZoikoTime
├── ZoikoBilling
├── ZoikoComply
└── ZoikoInsights
```

### Integration Points

**Authentication**:
- All products consume JWT from Zoiko One
- Session management centralized
- RBAC applied across products

**Approval Workflows**:
- HR approvals (leave, documents)
- Payroll approvals (runs, bonuses)
- Compliance approvals (policies, changes)

**Audit Logging**:
- All product events logged to central AuditLog
- Compliance trail spans all products
- Unified audit dashboard

**Governance**:
- Policies enforced across products
- Tenant-level governance rules
- Product-specific policy domains (future)

**Analytics**:
- Cross-product dashboards
- Unified reporting
- Centralized analytics service

# Future Expansion Strategy

## Architectural Evolution

### Phase 1: ZoikoHR Foundation (Current)
- Focus: Core HR models and APIs
- Architecture: Extend current multi-tenant pattern
- Data: New models in shared Prisma schema (short term) or separate service (long term)

### Phase 2: Workflow Orchestration (Q3 2026)
- Enhance ZoikoCoreX with visual workflow builder
- Support custom approvals and automations
- Event-driven architecture for real-time updates

### Phase 3: Analytics Platform (Q4 2026)
- Implement data warehouse for reporting
- Real-time dashboards and insights
- Custom query builder for end users

### Phase 4: Integration Hub (Q1 2027)
- API marketplace for third-party integrations
- Webhook support for outbound events
- EDI support for enterprise customers

### Phase 5: Enterprise Capabilities (Q2 2027)
- Advanced RBAC with delegated administration
- SSO/SAML support
- Advanced encryption at rest
- Custom branding and white-labeling

## Multi-Tenant Scaling Strategy

### Current (Up to 100 tenants)
- Single Prisma schema, single PostgreSQL database
- Tenant isolation via `tenantId` column
- Adequate for evaluation and small-scale deployment

### Mid-scale (100-1000 tenants, Q3 2026)
- Database per tenant option (configurable)
- Read replicas for analytics
- Connection pooling for performance

### Enterprise-scale (1000+ tenants, Q4 2026)
- Sharded database by tenant
- Separate microservices per product
- Event-driven async processing
- Real-time streaming analytics

## API Versioning Strategy

### Current API
- No versioning prefix (implicit v1)
- Located at `/api/`, `/api/super-admin/`

### Future Versioning (Q3 2026)
- Introduce `/api/v1/`, `/api/v2/` prefixes
- Backward compatibility for 2 major versions
- Deprecation notices 6 months before removal

## Database Evolution

### Current Schema Organization
- Single `prisma/schema.prisma` file
- All models in one database
- Suitable for MVP

### Future Organization (Q3 2026)
- Separate schema files per product: `schema-hr.prisma`, `schema-billing.prisma`
- Prisma composite features for organization
- Clear separation of concerns

### Long-term Strategy (Q4 2026+)
- Option 1: Database per product (with shared platform DB)
- Option 2: Event sourcing for audit trail (append-only events)
- Option 3: CQRS pattern (read/write separation)

## Security Evolution

### Current Security
- Session-based JWT authentication
- PBKDF2 password hashing
- httpOnly cookies
- IP/User-Agent logging

### Near-term Additions (Q2 2026)
- Two-factor authentication (2FA)
- Password reset flows
- Account lockout policies
- Session timeout warnings

### Medium-term Additions (Q3 2026)
- SSO/SAML support
- API key management for service-to-service
- OAuth 2.0 for third-party integrations
- Advanced permission delegation

### Long-term Additions (Q4 2026+)
- Encryption at rest (TDE)
- End-to-end encryption for sensitive data
- Hardware security module (HSM) support
- Advanced threat detection

## Performance Optimization Roadmap

### Database Optimization (Q2 2026)
- Query optimization and index tuning
- Connection pooling refinement
- Read replica strategy for reporting queries

### Caching Strategy (Q3 2026)
- Redis for session and permission caching
- Cache invalidation patterns
- API response caching

### Real-time Updates (Q4 2026)
- WebSocket support for live dashboards
- Server-sent events (SSE) for notifications
- Pub/Sub pattern for cross-tenant events

## Deployment Evolution

### Current Deployment
- Single Next.js instance
- PostgreSQL managed database
- Suitable for single-region deployment

### Future Deployment (Q3 2026)
- Docker containerization
- Kubernetes orchestration
- Multi-region failover
- Auto-scaling policies

### Enterprise Deployment (Q4 2026+)
- On-premise deployment option
- Hybrid cloud support
- Air-gapped deployment for regulated industries
- Custom infrastructure integrations
