import { PrismaClient } from "@prisma/client";
import { hashPassword } from "../lib/security/password";
import { permissionKeys, rolePermissionMap } from "../lib/security/rbac";

const prisma = new PrismaClient();

async function main() {
  const tenant = await prisma.tenant.upsert({
    where: { slug: "zoiko-one" },
    update: {},
    create: {
      name: "Zoiko One",
      slug: "zoiko-one",
      status: "ACTIVE",
    },
  });

  await prisma.organization.upsert({
    where: { id: "org-0001" },
    update: {
      name: "Zoiko One Headquarters",
      plan: "ENTERPRISE",
      status: "ACTIVE",
      employeesCount: 120,
      tenantId: tenant.id,
    },
    create: {
      id: "org-0001",
      tenantId: tenant.id,
      name: "Zoiko One Headquarters",
      plan: "ENTERPRISE",
      status: "ACTIVE",
      employeesCount: 120,
    },
  });

  const adminPasswordHash = await hashPassword(process.env.SEED_ADMIN_PASSWORD ?? "ZoikoAdmin!2026");
  const admin = await prisma.user.upsert({
    where: {
      tenantId_email: {
        tenantId: tenant.id,
        email: "admin@zoiko.one",
      },
    },
    update: {
      firstName: "Zoiko",
      lastName: "Admin",
      passwordHash: adminPasswordHash,
      isActive: true,
      isEmailVerified: true,
    },
    create: {
      tenantId: tenant.id,
      email: "admin@zoiko.one",
      firstName: "Zoiko",
      lastName: "Admin",
      passwordHash: adminPasswordHash,
      isActive: true,
      isEmailVerified: true,
    },
  });

  const permissions = new Map<string, string>();
  for (const key of permissionKeys) {
    const [domain, action] = key.split(".");
    const permission = await prisma.permission.upsert({
      where: { tenantId_key: { tenantId: tenant.id, key } },
      update: { domain: domain.toUpperCase() as never, action },
      create: {
        tenantId: tenant.id,
        key,
        domain: domain.toUpperCase() as never,
        action,
        description: `Zoiko One permission for ${key}`,
      },
    });
    permissions.set(key, permission.id);
  }

  for (const [roleKey, grants] of Object.entries(rolePermissionMap)) {
    const role = await prisma.role.upsert({
      where: { tenantId_key: { tenantId: tenant.id, key: roleKey as never } },
      update: { name: roleKey.replaceAll("_", " ") },
      create: {
        tenantId: tenant.id,
        key: roleKey as never,
        name: roleKey.replaceAll("_", " "),
        description: `Zoiko One ${roleKey.replaceAll("_", " ").toLowerCase()} role`,
      },
    });

    for (const grant of grants) {
      const permissionId = permissions.get(grant);
      if (!permissionId) continue;
      await prisma.rolePermission.upsert({
        where: { roleId_permissionId: { roleId: role.id, permissionId } },
        update: {},
        create: { tenantId: tenant.id, roleId: role.id, permissionId },
      });
    }

    if (roleKey === "SUPER_ADMIN") {
      await prisma.userRole.upsert({
        where: { userId_roleId: { userId: admin.id, roleId: role.id } },
        update: {},
        create: { tenantId: tenant.id, userId: admin.id, roleId: role.id },
      });
    }
  }

  await prisma.subscription.upsert({
    where: { tenantId_product: { tenantId: tenant.id, product: "ZOIKO_PAYROLL" } },
    update: {
      plan: "ENTERPRISE",
      status: "ACTIVE",
      seats: 120,
      monthlyAmount: 1250000,
      renewalDate: new Date("2026-07-04T00:00:00.000Z"),
    },
    create: {
      tenantId: tenant.id,
      product: "ZOIKO_PAYROLL",
      plan: "ENTERPRISE",
      status: "ACTIVE",
      seats: 120,
      monthlyAmount: 1250000,
      renewalDate: new Date("2026-07-04T00:00:00.000Z"),
    },
  });

  await prisma.complianceReport.upsert({
    where: { id: "compliance-0001" },
    update: {
      tenantId: tenant.id,
      packName: "US Payroll Governance",
      jurisdiction: "United States",
      score: 94,
      alerts: 2,
      violations: 0,
      status: "WATCHLIST",
      reviewedAt: new Date("2026-06-04T00:00:00.000Z"),
    },
    create: {
      id: "compliance-0001",
      tenantId: tenant.id,
      packName: "US Payroll Governance",
      jurisdiction: "United States",
      score: 94,
      alerts: 2,
      violations: 0,
      status: "WATCHLIST",
      reviewedAt: new Date("2026-06-04T00:00:00.000Z"),
    },
  });

  await prisma.payrollRun.upsert({
    where: { tenantId_runCode: { tenantId: tenant.id, runCode: "PAY-2026-06" } },
    update: {
      scheduleName: "Monthly Payroll",
      payPeriod: "Jun 2026",
      grossAmount: 82000000,
      employeeCount: 120,
      approvalsPending: 3,
      status: "PENDING_APPROVAL",
    },
    create: {
      tenantId: tenant.id,
      runCode: "PAY-2026-06",
      scheduleName: "Monthly Payroll",
      payPeriod: "Jun 2026",
      grossAmount: 82000000,
      employeeCount: 120,
      approvalsPending: 3,
      status: "PENDING_APPROVAL",
    },
  });

  await prisma.zoikoPayTransaction.upsert({
    where: { tenantId_reference: { tenantId: tenant.id, reference: "ZPAY-SETTLE-001" } },
    update: {
      amount: 82000000,
      currency: "USD",
      status: "PENDING",
      settlementStatus: "PENDING",
    },
    create: {
      tenantId: tenant.id,
      reference: "ZPAY-SETTLE-001",
      amount: 82000000,
      currency: "USD",
      status: "PENDING",
      settlementStatus: "PENDING",
    },
  });

  await prisma.zoikoCoreXWorkflow.upsert({
    where: { tenantId_workflowKey: { tenantId: tenant.id, workflowKey: "payroll-approval-sync" } },
    update: {
      name: "Payroll approval sync",
      integrationName: "Zoiko Payroll",
      executions: 428,
      failures: 2,
      status: "DEGRADED",
      lastRunAt: new Date("2026-06-04T00:00:00.000Z"),
    },
    create: {
      tenantId: tenant.id,
      workflowKey: "payroll-approval-sync",
      name: "Payroll approval sync",
      integrationName: "Zoiko Payroll",
      executions: 428,
      failures: 2,
      status: "DEGRADED",
      lastRunAt: new Date("2026-06-04T00:00:00.000Z"),
    },
  });

  await prisma.governancePolicy.upsert({
    where: { tenantId_name: { tenantId: tenant.id, name: "Payroll approval threshold" } },
    update: {
      domain: "PAYROLL",
      enforcement: "BLOCK",
      status: "ENABLED",
      exceptions: 0,
    },
    create: {
      tenantId: tenant.id,
      name: "Payroll approval threshold",
      domain: "PAYROLL",
      enforcement: "BLOCK",
      status: "ENABLED",
      exceptions: 0,
    },
  });

  const approval = await prisma.approvalWorkflow.upsert({
    where: { id: "approval-0001" },
    update: {
      tenantId: tenant.id,
      workflowType: "PAYROLL_APPROVAL",
      resourceType: "PayrollRun",
      resourceId: "PAY-2026-06",
      title: "Approve PAY-2026-06",
      state: "PENDING",
      currentApproverId: admin.id,
      escalationLevel: 0,
      dueAt: new Date("2026-06-05T00:00:00.000Z"),
    },
    create: {
      id: "approval-0001",
      tenantId: tenant.id,
      workflowType: "PAYROLL_APPROVAL",
      resourceType: "PayrollRun",
      resourceId: "PAY-2026-06",
      title: "Approve PAY-2026-06",
      state: "PENDING",
      currentApproverId: admin.id,
      escalationLevel: 0,
      dueAt: new Date("2026-06-05T00:00:00.000Z"),
    },
  });

  await prisma.approvalAction.upsert({
    where: { id: "approval-action-0001" },
    update: {
      workflowId: approval.id,
      tenantId: tenant.id,
      actorId: admin.id,
      action: "REQUESTED",
      comment: "Initial payroll approval requested for governance monitoring.",
    },
    create: {
      id: "approval-action-0001",
      workflowId: approval.id,
      tenantId: tenant.id,
      actorId: admin.id,
      action: "REQUESTED",
      comment: "Initial payroll approval requested for governance monitoring.",
    },
  });
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
