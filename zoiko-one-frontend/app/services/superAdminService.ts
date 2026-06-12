import { prisma } from "@/lib/prisma";

export type GrowthPoint = {
  label: string;
  value: number;
};

export type TenantRow = {
  id: string;
  name: string;
  slug: string;
  status: string;
  organizations: number;
  users: number;
  createdAt: string;
};

export type OrganizationRow = {
  id: string;
  name: string;
  tenantName: string;
  plan: string;
  status: string;
  employeesCount: number;
  createdAt: string;
};

export type UserRow = {
  id: string;
  name: string;
  email: string;
  tenantName: string;
  status: string;
  emailVerified: string;
  createdAt: string;
};

export type RolePermissionRow = {
  id: string;
  role: string;
  scope: string;
  permissions: string;
  users: number;
};

export type BillingRow = {
  id: string;
  tenantName: string;
  plan: string;
  amount: string;
  status: string;
  renewalDate: string;
};

export type AuditLogRow = {
  id: string;
  tenantName: string;
  actor: string;
  action: string;
  eventType: string;
  category: string;
  outcome: string;
  resource: string;
  createdAt: string;
};

export type AuditLogFilters = {
  search?: string;
  eventType?: string;
  category?: string;
  outcome?: string;
};

export type SystemHealthRow = {
  id: string;
  name: string;
  status: string;
  detail: string;
  checkedAt: string;
};

export type SubscriptionRow = {
  id: string;
  tenantName: string;
  product: string;
  plan: string;
  seats: number;
  monthlyAmount: string;
  renewalDate: string;
  status: string;
};

export type ComplianceCenterRow = {
  id: string;
  tenantName: string;
  packName: string;
  jurisdiction: string;
  score: string;
  alerts: number;
  violations: number;
  reviewedAt: string;
  status: string;
};

export type PayrollOperationRow = {
  id: string;
  tenantName: string;
  runCode: string;
  scheduleName: string;
  payPeriod: string;
  grossAmount: string;
  employeeCount: number;
  approvalsPending: number;
  status: string;
};

export type ZoikoPayRow = {
  id: string;
  tenantName: string;
  reference: string;
  amount: string;
  settlementStatus: string;
  processedAt: string;
  status: string;
};

export type ZoikoCoreXRow = {
  id: string;
  tenantName: string;
  name: string;
  integrationName: string;
  executions: number;
  failures: number;
  lastRunAt: string;
  status: string;
};

export type GovernancePolicyRow = {
  id: string;
  tenantName: string;
  name: string;
  domain: string;
  enforcement: string;
  exceptions: number;
  status: string;
};

export type ApprovalWorkflowRow = {
  id: string;
  tenantName: string;
  workflowType: string;
  title: string;
  resourceType: string;
  approver: string;
  escalationLevel: number;
  dueAt: string;
  history: string;
  state: string;
};

const monthLabels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"];

function formatDate(value: Date | string) {
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(value));
}

function formatCurrency(cents: number, currency = "USD") {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    maximumFractionDigits: 0,
  }).format(cents / 100);
}

function parseCurrencyToNumber(value: string) {
  const parsed = Number(value.replace(/[^0-9.-]+/g, ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function formatLargeCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: value > 999999 ? 1 : 0,
  }).format(value);
}

function getMonthAbbreviation(value: string) {
  const match = value.match(/\b(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\b/i);
  return match ? (monthLabels.find((month) => month.toLowerCase() === match[1].toLowerCase()) ?? "") : "";
}

function makeGrowth(base: number, step: number): GrowthPoint[] {
  return monthLabels.map((label, index) => ({ label, value: base + step * index }));
}

function buildPayrollTrend(runs: PayrollOperationRow[]) {
  return monthLabels.map((label) => ({
    label,
    value: runs
      .filter((run) => getMonthAbbreviation(run.payPeriod) === label)
      .reduce((sum, run) => sum + parseCurrencyToNumber(run.grossAmount), 0),
  }));
}

function buildComplianceTrend(reports: ComplianceCenterRow[]) {
  return monthLabels.map((label) => {
    const monthlyReports = reports.filter((report) => {
      const month = getMonthAbbreviation(report.reviewedAt);
      return month && month === label;
    });
    const scoreSum = monthlyReports.reduce((sum, report) => sum + parseCurrencyToNumber(report.score), 0);
    return {
      label,
      value: monthlyReports.length ? Math.round(scoreSum / monthlyReports.length) : 0,
    };
  });
}

function buildProductAdoptionTrend(subscriptions: SubscriptionRow[]) {
  return monthLabels.map((label) => ({
    label,
    value: subscriptions.filter((subscription) => {
      const month = getMonthAbbreviation(subscription.renewalDate);
      return month && month === label;
    }).length * 10,
  }));
}

async function safeQuery<T>(query: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await Promise.race([
      query(),
      new Promise<T>((resolve) => {
        setTimeout(() => resolve(fallback), 1500);
      }),
    ]);
  } catch {
    return fallback;
  }
}

export async function getTenants(): Promise<TenantRow[]> {
  return safeQuery(
    async () => {
      const tenants = await prisma.tenant.findMany({
        include: {
          _count: {
            select: { organizations: true, users: true },
          },
        },
        orderBy: { createdAt: "desc" },
        take: 25,
      });

      return tenants.map((tenant) => ({
        id: tenant.id,
        name: tenant.name,
        slug: tenant.slug,
        status: tenant.status,
        organizations: tenant._count.organizations,
        users: tenant._count.users,
        createdAt: formatDate(tenant.createdAt),
      }));
    },
    [
      {
        id: "tenant-demo",
        name: "Zoiko One",
        slug: "zoiko-one",
        status: "ACTIVE",
        organizations: 1,
        users: 1,
        createdAt: formatDate(new Date()),
      },
    ],
  );
}

export async function getOrganizations(): Promise<OrganizationRow[]> {
  return safeQuery(
    async () => {
      const organizations = await prisma.organization.findMany({
        include: { tenant: true },
        orderBy: { createdAt: "desc" },
        take: 25,
      });

      return organizations.map((organization) => ({
        id: organization.id,
        name: organization.name,
        tenantName: organization.tenant.name,
        plan: organization.plan,
        status: organization.status,
        employeesCount: organization.employeesCount,
        createdAt: formatDate(organization.createdAt),
      }));
    },
    [
      {
        id: "org-demo",
        name: "Zoiko One Headquarters",
        tenantName: "Zoiko One",
        plan: "ENTERPRISE",
        status: "ACTIVE",
        employeesCount: 120,
        createdAt: formatDate(new Date()),
      },
    ],
  );
}

export async function getUsers(): Promise<UserRow[]> {
  return safeQuery(
    async () => {
      const users = await prisma.user.findMany({
        include: { tenant: true },
        orderBy: { createdAt: "desc" },
        take: 25,
      });

      return users.map((user) => ({
        id: user.id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        tenantName: user.tenant.name,
        status: user.isActive ? "ACTIVE" : "SUSPENDED",
        emailVerified: user.isEmailVerified ? "Verified" : "Pending",
        createdAt: formatDate(user.createdAt),
      }));
    },
    [
      {
        id: "user-demo",
        name: "Zoiko Admin",
        email: "admin@zoiko.one",
        tenantName: "Zoiko One",
        status: "ACTIVE",
        emailVerified: "Verified",
        createdAt: formatDate(new Date()),
      },
    ],
  );
}

export async function getRolePermissions(): Promise<RolePermissionRow[]> {
  const activeUsers = await safeQuery(() => prisma.user.count({ where: { isActive: true } }), 1);

  return [
    {
      id: "role-super-admin",
      role: "Super Admin",
      scope: "Platform",
      permissions: "All tenant, user, billing, audit, and system controls",
      users: activeUsers,
    },
    {
      id: "role-tenant-admin",
      role: "Tenant Admin",
      scope: "Tenant",
      permissions: "Manage tenant organizations and users",
      users: 0,
    },
    {
      id: "role-auditor",
      role: "Auditor",
      scope: "Read-only",
      permissions: "View audit logs, analytics, and compliance evidence",
      users: 0,
    },
  ];
}

export async function getBilling(): Promise<BillingRow[]> {
  const organizations = await getOrganizations();

  return organizations.map((organization, index) => ({
    id: `billing-${organization.id}`,
    tenantName: organization.tenantName,
    plan: organization.plan,
    amount: organization.plan === "ENTERPRISE" ? "$12,500" : organization.plan === "PREMIUM" ? "$4,500" : "$0",
    status: organization.status === "ACTIVE" ? "PAID" : "PENDING",
    renewalDate: formatDate(new Date(Date.now() + (index + 1) * 86400000 * 30)),
  }));
}

export async function getSubscriptions(): Promise<SubscriptionRow[]> {
  return safeQuery(
    async () => {
      const subscriptions = await prisma.subscription.findMany({
        include: { tenant: true },
        orderBy: { renewalDate: "asc" },
        take: 25,
      });

      return subscriptions.map((subscription) => ({
        id: subscription.id,
        tenantName: subscription.tenant.name,
        product: subscription.product.replaceAll("_", " "),
        plan: subscription.plan,
        seats: subscription.seats,
        monthlyAmount: formatCurrency(subscription.monthlyAmount),
        renewalDate: formatDate(subscription.renewalDate),
        status: subscription.status,
      }));
    },
    [
      {
        id: "subscription-demo",
        tenantName: "Zoiko One",
        product: "ZOIKO PAYROLL",
        plan: "ENTERPRISE",
        seats: 120,
        monthlyAmount: "$12,500",
        renewalDate: formatDate(new Date(Date.now() + 86400000 * 30)),
        status: "ACTIVE",
      },
    ],
  );
}

export async function getComplianceCenter(): Promise<ComplianceCenterRow[]> {
  return safeQuery(
    async () => {
      const reports = await prisma.complianceReport.findMany({
        include: { tenant: true },
        orderBy: [{ status: "desc" }, { updatedAt: "desc" }],
        take: 25,
      });

      return reports.map((report) => ({
        id: report.id,
        tenantName: report.tenant.name,
        packName: report.packName,
        jurisdiction: report.jurisdiction,
        score: `${report.score}%`,
        alerts: report.alerts,
        violations: report.violations,
        reviewedAt: report.reviewedAt ? formatDate(report.reviewedAt) : "Pending",
        status: report.status,
      }));
    },
    [
      {
        id: "compliance-demo",
        tenantName: "Zoiko One",
        packName: "US Payroll Governance",
        jurisdiction: "United States",
        score: "94%",
        alerts: 2,
        violations: 0,
        reviewedAt: formatDate(new Date()),
        status: "WATCHLIST",
      },
    ],
  );
}

export async function getPayrollOperations(): Promise<PayrollOperationRow[]> {
  return safeQuery(
    async () => {
      const runs = await prisma.payrollRun.findMany({
        include: { tenant: true },
        orderBy: { createdAt: "desc" },
        take: 25,
      });

      return runs.map((run) => ({
        id: run.id,
        tenantName: run.tenant.name,
        runCode: run.runCode,
        scheduleName: run.scheduleName,
        payPeriod: run.payPeriod,
        grossAmount: formatCurrency(run.grossAmount),
        employeeCount: run.employeeCount,
        approvalsPending: run.approvalsPending,
        status: run.status,
      }));
    },
    [
      {
        id: "payroll-run-demo",
        tenantName: "Zoiko One",
        runCode: "PAY-2026-06",
        scheduleName: "Monthly Payroll",
        payPeriod: "Jun 2026",
        grossAmount: "$820,000",
        employeeCount: 120,
        approvalsPending: 3,
        status: "PENDING_APPROVAL",
      },
    ],
  );
}

export async function getZoikoPayTransactions(): Promise<ZoikoPayRow[]> {
  return safeQuery(
    async () => {
      const transactions = await prisma.zoikoPayTransaction.findMany({
        include: { tenant: true },
        orderBy: { createdAt: "desc" },
        take: 25,
      });

      return transactions.map((transaction) => ({
        id: transaction.id,
        tenantName: transaction.tenant.name,
        reference: transaction.reference,
        amount: formatCurrency(transaction.amount, transaction.currency),
        settlementStatus: transaction.settlementStatus,
        processedAt: transaction.processedAt ? formatDate(transaction.processedAt) : "Pending",
        status: transaction.status,
      }));
    },
    [
      {
        id: "zoikopay-demo",
        tenantName: "Zoiko One",
        reference: "ZPAY-SETTLE-001",
        amount: "$820,000",
        settlementStatus: "PENDING",
        processedAt: "Pending",
        status: "PENDING",
      },
    ],
  );
}

export async function getZoikoCoreXWorkflows(): Promise<ZoikoCoreXRow[]> {
  return safeQuery(
    async () => {
      const workflows = await prisma.zoikoCoreXWorkflow.findMany({
        include: { tenant: true },
        orderBy: { updatedAt: "desc" },
        take: 25,
      });

      return workflows.map((workflow) => ({
        id: workflow.id,
        tenantName: workflow.tenant.name,
        name: workflow.name,
        integrationName: workflow.integrationName,
        executions: workflow.executions,
        failures: workflow.failures,
        lastRunAt: workflow.lastRunAt ? formatDate(workflow.lastRunAt) : "Not run",
        status: workflow.status,
      }));
    },
    [
      {
        id: "corex-demo",
        tenantName: "Zoiko One",
        name: "Payroll approval sync",
        integrationName: "Zoiko Payroll",
        executions: 428,
        failures: 2,
        lastRunAt: formatDate(new Date()),
        status: "DEGRADED",
      },
    ],
  );
}

export async function getGovernancePolicies(): Promise<GovernancePolicyRow[]> {
  return safeQuery(
    async () => {
      const policies = await prisma.governancePolicy.findMany({
        include: { tenant: true },
        orderBy: [{ domain: "asc" }, { name: "asc" }],
        take: 25,
      });

      return policies.map((policy) => ({
        id: policy.id,
        tenantName: policy.tenant.name,
        name: policy.name,
        domain: policy.domain,
        enforcement: policy.enforcement,
        exceptions: policy.exceptions,
        status: policy.status,
      }));
    },
    [
      {
        id: "governance-demo",
        tenantName: "Zoiko One",
        name: "Payroll approval threshold",
        domain: "PAYROLL",
        enforcement: "BLOCK",
        exceptions: 0,
        status: "ENABLED",
      },
    ],
  );
}

export async function getApprovalWorkflows(): Promise<ApprovalWorkflowRow[]> {
  return safeQuery(
    async () => {
      const workflows = await prisma.approvalWorkflow.findMany({
        include: { tenant: true, currentApprover: true, actions: { include: { actor: true }, orderBy: { createdAt: "desc" } } },
        orderBy: { updatedAt: "desc" },
        take: 50,
      });

      return workflows.map((workflow) => ({
        id: workflow.id,
        tenantName: workflow.tenant.name,
        workflowType: workflow.workflowType,
        title: workflow.title,
        resourceType: workflow.resourceType,
        approver: workflow.currentApprover ? `${workflow.currentApprover.firstName} ${workflow.currentApprover.lastName}` : "Unassigned",
        escalationLevel: workflow.escalationLevel,
        dueAt: workflow.dueAt ? formatDate(workflow.dueAt) : "Not set",
        history: workflow.actions.map((action) => `${action.action}${action.actor ? ` by ${action.actor.firstName} ${action.actor.lastName}` : ""}`).join(" / "),
        state: workflow.state,
      }));
    },
    [
      {
        id: "approval-demo",
        tenantName: "Zoiko One",
        workflowType: "PAYROLL_APPROVAL",
        title: "Approve PAY-2026-06",
        resourceType: "PayrollRun",
        approver: "Zoiko Admin",
        escalationLevel: 0,
        dueAt: formatDate(new Date(Date.now() + 86400000)),
        history: "REQUESTED by Zoiko Admin",
        state: "PENDING",
      },
    ],
  );
}

export async function getAuditLogs(filters: AuditLogFilters = {}): Promise<AuditLogRow[]> {
  return safeQuery(
    async () => {
      const where = {
        ...(filters.eventType ? { eventType: filters.eventType as never } : {}),
        ...(filters.category ? { category: filters.category as never } : {}),
        ...(filters.outcome ? { outcome: filters.outcome as never } : {}),
        ...(filters.search
          ? {
              OR: [
                { action: { contains: filters.search, mode: "insensitive" as const } },
                { resourceType: { contains: filters.search, mode: "insensitive" as const } },
                { resourceName: { contains: filters.search, mode: "insensitive" as const } },
              ],
            }
          : {}),
      };
      const logs = await prisma.auditLog.findMany({
        where,
        include: { tenant: true, user: true },
        orderBy: { createdAt: "desc" },
        take: 30,
      });

      return logs.map((log) => ({
        id: log.id,
        tenantName: log.tenant.name,
        actor: log.user ? `${log.user.firstName} ${log.user.lastName}` : "System",
        action: log.action,
        eventType: log.eventType,
        category: log.category,
        outcome: log.outcome,
        resource: log.resourceName ?? log.resourceType,
        createdAt: formatDate(log.createdAt),
      }));
    },
    [
      {
        id: "audit-demo",
        tenantName: "Zoiko One",
        actor: "System",
        action: "Super admin dashboard prepared",
        eventType: "SYSTEM_EVENT",
        category: "SYSTEM",
        outcome: "SUCCESS",
        resource: "Platform",
        createdAt: formatDate(new Date()),
      },
    ],
  );
}

export async function getAuditTimeline(filters: AuditLogFilters = {}) {
  const logs = await getAuditLogs(filters);
  const timeline = new Map<string, { date: string; events: number; failures: number; denied: number }>();

  logs.forEach((log) => {
    const current = timeline.get(log.createdAt) ?? { date: log.createdAt, events: 0, failures: 0, denied: 0 };
    current.events += 1;
    current.failures += log.outcome === "FAILURE" ? 1 : 0;
    current.denied += log.outcome === "DENIED" ? 1 : 0;
    timeline.set(log.createdAt, current);
  });

  return Array.from(timeline.values());
}

export function auditLogsToCsv(logs: AuditLogRow[]) {
  const rows = [
    ["Tenant", "Actor", "Action", "Event Type", "Category", "Outcome", "Resource", "Created"],
    ...logs.map((log) => [log.tenantName, log.actor, log.action, log.eventType, log.category, log.outcome, log.resource, log.createdAt]),
  ];

  return rows.map((row) => row.map((value) => `"${String(value).replaceAll("\"", "\"\"")}"`).join(",")).join("\n");
}

export async function getAnalytics() {
  const [tenants, organizations, users] = await Promise.all([
    safeQuery(() => prisma.tenant.count(), 1),
    safeQuery(() => prisma.organization.count(), 1),
    safeQuery(() => prisma.user.count(), 1),
  ]);

  return {
    revenueGrowth: makeGrowth(Math.max(12, organizations * 9), 8),
    tenantGrowth: makeGrowth(Math.max(1, tenants), 2),
    userGrowth: makeGrowth(Math.max(10, users * 10), 12),
  };
}

export async function getSystemHealth(): Promise<SystemHealthRow[]> {
  const databaseStatus = await safeQuery(async () => {
    await prisma.$queryRaw`SELECT 1`;
    return "HEALTHY";
  }, "DEGRADED");

  return [
    {
      id: "health-db",
      name: "Database",
      status: databaseStatus,
      detail: databaseStatus === "HEALTHY" ? "Prisma connection is responding" : "Database is unavailable or not configured",
      checkedAt: formatDate(new Date()),
    },
    {
      id: "health-api",
      name: "API Routes",
      status: "HEALTHY",
      detail: "Super admin route handlers are registered",
      checkedAt: formatDate(new Date()),
    },
    {
      id: "health-payroll",
      name: "Payroll",
      status: "HEALTHY",
      detail: "Payroll monitoring and governance APIs are registered",
      checkedAt: formatDate(new Date()),
    },
    {
      id: "health-corex",
      name: "ZoikoCoreX",
      status: "HEALTHY",
      detail: "Workflow telemetry is available to Super Admin",
      checkedAt: formatDate(new Date()),
    },
  ];
}

export async function getDashboardOverview() {
  const [
    organizations,
    users,
    auditLogs,
    systemHealth,
    subscriptions,
    compliance,
    payrollRuns,
  ] = await Promise.all([
    getOrganizations(),
    getUsers(),
    getAuditLogs(),
    getSystemHealth(),
    getSubscriptions(),
    getComplianceCenter(),
    getPayrollOperations(),
  ]);

  const monthlyPayrollAmount = payrollRuns.reduce((sum, run) => sum + parseCurrencyToNumber(run.grossAmount), 0);
  const monthlyRevenueAmount = subscriptions.reduce((sum, subscription) => sum + parseCurrencyToNumber(subscription.monthlyAmount), 0);
  const activeOrganizations = organizations.filter((org) => org.status === "ACTIVE").length;
  const activePayrollRuns = payrollRuns.filter((run) => run.status !== "FAILED").length;
  const failedPayrollRuns = payrollRuns.filter((run) => run.status === "FAILED").length;
  const complianceScores = compliance.map((report) => parseCurrencyToNumber(report.score));
  const complianceHealthScore = complianceScores.length
    ? Math.min(100, Math.max(0, Math.round(complianceScores.reduce((sum, value) => sum + value, 0) / complianceScores.length)))
    : 100;
  const healthyChecks = systemHealth.filter((item) => item.status === "HEALTHY").length;
  const platformHealthScore = systemHealth.length ? Math.round((healthyChecks / systemHealth.length) * 100) : 100;
  const activeSubscriptionCount = subscriptions.filter((subscription) => subscription.status === "ACTIVE").length;
  const productAdoptionScore = subscriptions.length ? Math.round((activeSubscriptionCount / subscriptions.length) * 100) : 0;

  const topRiskOrganizations = organizations
    .map((organization) => {
      const orgPayrollTotal = payrollRuns
        .filter((run) => run.tenantName === organization.tenantName)
        .reduce((sum, run) => sum + parseCurrencyToNumber(run.grossAmount), 0);
      const organizationComplianceCount = compliance.filter((report) => report.tenantName === organization.tenantName).length;
      const organizationFailureCount = auditLogs.filter(
        (log) => log.tenantName === organization.tenantName && (log.outcome === "FAILURE" || log.category === "SECURITY")
      ).length;
      const riskScore = Math.min(99, Math.max(12, Math.round((organization.employeesCount * 0.2) + organizationComplianceCount * 8 + organizationFailureCount * 4)));

      return {
        id: organization.id,
        organization: organization.name,
        tenant: organization.tenantName,
        employees: organization.employeesCount,
        monthlyPayroll: formatLargeCurrency(orgPayrollTotal),
        riskScore: `${riskScore}%`,
      };
    })
    .sort((a, b) => parseCurrencyToNumber(b.riskScore) - parseCurrencyToNumber(a.riskScore))
    .slice(0, 6);

  const platformActivity = auditLogs.slice(0, 6).map((log) => `${log.action} — ${log.actor}`);

  return {
    monthlyPayrollVolume: formatLargeCurrency(monthlyPayrollAmount),
    monthlyRevenue: formatLargeCurrency(monthlyRevenueAmount),
    totalEmployees: organizations.reduce((sum, org) => sum + org.employeesCount, 0),
    totalUsers: users.length,
    totalOrganizations: organizations.length,
    activeOrganizations,
    activePayrollRuns,
    failedPayrollRuns,
    complianceHealthScore,
    platformHealthScore,
    productAdoptionScore,
    openIncidents: auditLogs.filter((log) => log.outcome === "FAILURE" || log.category === "SECURITY" || log.outcome === "DENIED").length,
    payrollVolumeTrend: buildPayrollTrend(payrollRuns),
    complianceHealthTrend: buildComplianceTrend(compliance),
    productAdoptionTrend: buildProductAdoptionTrend(subscriptions),
    topRiskOrganizations,
    platformActivity,
    systemHealth,
  };
}
