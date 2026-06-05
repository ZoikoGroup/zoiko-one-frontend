import type { AuditCategory, AuditEventType, AuditOutcome, Prisma } from "@prisma/client";

import { prisma } from "@/lib/prisma";

export type AuditRecordInput = {
  tenantId: string;
  userId?: string;
  action: string;
  eventType?: AuditEventType;
  category?: AuditCategory;
  outcome?: AuditOutcome;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  details?: Prisma.InputJsonValue;
  ipAddress?: string;
  userAgent?: string;
};

export class SecurityRepository {
  findTenantBySlug(slug: string) {
    return prisma.tenant.findUnique({ where: { slug } });
  }

  findUserForLogin(tenantId: string, email: string) {
    return prisma.user.findUnique({
      where: { tenantId_email: { tenantId, email } },
      include: {
        tenant: true,
        roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
        permissions: { include: { permission: true } },
      },
    });
  }

  findSession(sessionId: string) {
    return prisma.session.findUnique({
      where: { id: sessionId },
      include: {
        user: {
          include: {
            roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
            permissions: { include: { permission: true } },
          },
        },
      },
    });
  }

  createSession(input: {
    tenantId: string;
    userId: string;
    accessTokenId: string;
    refreshTokenHash: string;
    expiresAt: Date;
    ipAddress?: string;
    userAgent?: string;
  }) {
    return prisma.session.create({ data: input });
  }

  rotateSession(sessionId: string, accessTokenId: string, refreshTokenHash: string, expiresAt: Date) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { accessTokenId, refreshTokenHash, expiresAt },
    });
  }

  revokeSession(sessionId: string) {
    return prisma.session.update({
      where: { id: sessionId },
      data: { revokedAt: new Date() },
    });
  }

  findSessionByRefreshHash(refreshTokenHash: string) {
    return prisma.session.findFirst({
      where: { refreshTokenHash, revokedAt: null, expiresAt: { gt: new Date() } },
      include: {
        user: {
          include: {
            tenant: true,
            roles: { include: { role: { include: { permissions: { include: { permission: true } } } } } },
            permissions: { include: { permission: true } },
          },
        },
      },
    });
  }

  writeAudit(input: AuditRecordInput) {
    return prisma.auditLog.create({
      data: {
        tenantId: input.tenantId,
        userId: input.userId,
        action: input.action,
        eventType: input.eventType ?? "SYSTEM_EVENT",
        category: input.category ?? "SYSTEM",
        outcome: input.outcome ?? "SUCCESS",
        resourceType: input.resourceType,
        resourceId: input.resourceId,
        resourceName: input.resourceName,
        details: input.details,
        ipAddress: input.ipAddress,
        userAgent: input.userAgent,
      },
    });
  }

  assignRole(userId: string, roleId: string, tenantId: string, assignedById?: string) {
    return prisma.userRole.upsert({
      where: { userId_roleId: { userId, roleId } },
      update: { assignedById },
      create: { userId, roleId, tenantId, assignedById },
    });
  }

  findRoleByKey(tenantId: string, key: string) {
    return prisma.role.findUnique({ where: { tenantId_key: { tenantId, key: key as never } } });
  }

  findPermissionByKey(tenantId: string, key: string) {
    return prisma.permission.findUnique({ where: { tenantId_key: { tenantId, key } } });
  }

  assignPermission(userId: string, permissionId: string, tenantId: string, assignedById?: string) {
    return prisma.userPermission.upsert({
      where: { userId_permissionId: { userId, permissionId } },
      update: { assignedById },
      create: { userId, permissionId, tenantId, assignedById },
    });
  }

  listApprovalWorkflows() {
    return prisma.approvalWorkflow.findMany({
      include: { tenant: true, currentApprover: true, actions: { include: { actor: true }, orderBy: { createdAt: "desc" } } },
      orderBy: { updatedAt: "desc" },
      take: 50,
    });
  }
}

export const securityRepository = new SecurityRepository();
