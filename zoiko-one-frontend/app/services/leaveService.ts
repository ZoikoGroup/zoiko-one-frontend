import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { leaveRepository } from "@/app/repositories/leaveRepository";
import type { LeaveTypeListOptions, LeaveRequestListOptions } from "@/app/repositories/leaveRepository";
import { prisma } from "@/lib/prisma";

async function writeAudit(params: {
  tenantId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, unknown>;
}) {
  const { prisma: p } = await import("@/lib/prisma");
  await p.auditLog.create({
    data: {
      tenantId: params.tenantId,
      userId: params.userId,
      action: params.action,
      resourceType: params.resourceType,
      resourceId: params.resourceId,
      resourceName: params.resourceName,
      details: params.details as never ?? undefined,
      createdAt: new Date(),
    },
  });
}

function validateRequired(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === "") return `${field} is required.`;
  return null;
}

function collectErrors(checks: (string | null)[]): string[] {
  return checks.filter((c): c is string => c !== null);
}

async function resolveOrganizationId(ctx: { tenantId: string }, providedId?: string): Promise<string> {
  if (providedId) return providedId;
  const org = await prisma.organization.findFirst({
    where: { tenantId: ctx.tenantId, status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });
  if (!org) throw new AuthorizationError("No active organization found for tenant.", 400);
  return org.id;
}

// ── LeaveType ──────────────────────────────────────────────

export async function listLeaveTypes(options?: LeaveTypeListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await leaveRepository.findLeaveTypes(tenantId, options);
  const total = await leaveRepository.countLeaveTypes(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getLeaveType(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const leaveType = await leaveRepository.findLeaveTypeById(ctx.tenantId, id);
  if (!leaveType) throw new AuthorizationError("Leave type not found.", 404);
  return leaveType;
}

export async function createLeaveType(input: {
  organizationId?: string;
  name: string;
  code: string;
  description?: string;
  category: string;
  maxDaysPerYear?: number;
  minDaysRequired?: number;
  requiresApproval?: boolean;
  requiresMedicalCert?: boolean;
  attachmentRequired?: boolean;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.name, "name"),
    validateRequired(input.code, "code"),
    validateRequired(input.category, "category"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const organizationId = await resolveOrganizationId(ctx, input.organizationId);

  const existingName = await leaveRepository.findLeaveTypeByName(ctx.tenantId, organizationId, input.name);
  if (existingName) throw new AuthorizationError("A leave type with this name already exists.", 409);

  const existingCode = await leaveRepository.findLeaveTypeByCode(ctx.tenantId, organizationId, input.code);
  if (existingCode) throw new AuthorizationError("A leave type with this code already exists.", 409);

  const leaveType = await leaveRepository.createLeaveType({
    organizationId, tenantId: ctx.tenantId, name: input.name, code: input.code.toUpperCase(),
    description: input.description, category: input.category,
    maxDaysPerYear: input.maxDaysPerYear, minDaysRequired: input.minDaysRequired,
    requiresApproval: input.requiresApproval, requiresMedicalCert: input.requiresMedicalCert,
    attachmentRequired: input.attachmentRequired, createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Leave type created",
    resourceType: "LeaveType", resourceId: leaveType.id, resourceName: input.name,
    details: { code: input.code },
  });

  return leaveType;
}

export async function updateLeaveType(id: string, input: {
  name?: string; code?: string; description?: string; category?: string;
  maxDaysPerYear?: number; minDaysRequired?: number;
  requiresApproval?: boolean; requiresMedicalCert?: boolean; attachmentRequired?: boolean; isActive?: boolean;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await leaveRepository.findLeaveTypeById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Leave type not found.", 404);

  if (input.name) {
    const dupe = await leaveRepository.findLeaveTypeByName(ctx.tenantId, existing.organizationId, input.name, id);
    if (dupe) throw new AuthorizationError("A leave type with this name already exists.", 409);
  }
  if (input.code) {
    const dupe = await leaveRepository.findLeaveTypeByCode(ctx.tenantId, existing.organizationId, input.code, id);
    if (dupe) throw new AuthorizationError("A leave type with this code already exists.", 409);
  }

  const leaveType = await leaveRepository.updateLeaveType(ctx.tenantId, id, { ...input, updatedBy: ctx.userId });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Leave type updated",
    resourceType: "LeaveType", resourceId: id, resourceName: existing.name,
    details: { changes: Object.keys(input) },
  });

  return leaveType;
}

export async function deleteLeaveType(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const existing = await leaveRepository.findLeaveTypeById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Leave type not found.", 404);
  await leaveRepository.softDeleteLeaveType(ctx.tenantId, id, ctx.userId, reason);
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Leave type deleted",
    resourceType: "LeaveType", resourceId: id, resourceName: existing.name,
  });
  return { ok: true };
}

// ── LeaveBalance ───────────────────────────────────────────

export async function getLeaveBalances(filters?: { employeeId?: string; leaveTypeId?: string; year?: number }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return leaveRepository.findLeaveBalances(ctx.tenantId, filters);
}

export async function initializeLeaveBalance(input: { employeeId: string; leaveTypeId: string; year: number; allocatedDays: number }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return leaveRepository.upsertLeaveBalance({
    employeeId: input.employeeId, leaveTypeId: input.leaveTypeId, tenantId: ctx.tenantId,
    year: input.year, allocatedDays: input.allocatedDays,
  });
}

// ── LeaveRequest ───────────────────────────────────────────

export async function listLeaveRequests(options?: LeaveRequestListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await leaveRepository.findLeaveRequests(tenantId, options);
  const total = await leaveRepository.countLeaveRequests(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getLeaveRequest(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const request = await leaveRepository.findLeaveRequestById(ctx.tenantId, id);
  if (!request) throw new AuthorizationError("Leave request not found.", 404);
  return request;
}

export async function createLeaveRequest(input: {
  employeeId: string;
  leaveTypeId: string;
  startDate: string;
  endDate: string;
  workingDaysRequested?: number;
  reason?: string;
  attachmentUrl?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.employeeId, "employeeId"),
    validateRequired(input.leaveTypeId, "leaveTypeId"),
    validateRequired(input.startDate, "startDate"),
    validateRequired(input.endDate, "endDate"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const startDate = new Date(input.startDate);
  const endDate = new Date(input.endDate);
  if (endDate < startDate) throw new AuthorizationError("End date must be after start date.", 400);

  const leaveType = await leaveRepository.findLeaveTypeById(ctx.tenantId, input.leaveTypeId);
  if (!leaveType) throw new AuthorizationError("Leave type not found.", 404);

  const year = startDate.getFullYear();
  let balance = await leaveRepository.findLeaveBalance(input.employeeId, input.leaveTypeId, year);
  if (balance && input.workingDaysRequested && input.workingDaysRequested > balance.availableDays) {
    throw new AuthorizationError("Insufficient leave balance.", 400);
  }

  const request = await leaveRepository.createLeaveRequest({
    employeeId: input.employeeId, leaveTypeId: input.leaveTypeId, tenantId: ctx.tenantId,
    startDate, endDate, workingDaysRequested: input.workingDaysRequested ?? 0,
    reason: input.reason, attachmentUrl: input.attachmentUrl, createdBy: ctx.userId,
  });

  if (leaveType.requiresApproval) {
    await leaveRepository.createLeaveApproval({
      leaveRequestId: request.id, tenantId: ctx.tenantId, level: 1,
    });
  }

  if (input.workingDaysRequested && input.workingDaysRequested > 0) {
    if (balance) {
      await leaveRepository.adjustPendingBalance(input.employeeId, input.leaveTypeId, year, input.workingDaysRequested, ctx.tenantId);
    } else {
      await leaveRepository.upsertLeaveBalance({
        employeeId: input.employeeId, leaveTypeId: input.leaveTypeId, tenantId: ctx.tenantId,
        year, pendingDays: input.workingDaysRequested,
      });
    }
  }

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Leave request created",
    resourceType: "LeaveRequest", resourceId: request.id,
    resourceName: `${input.employeeId} - ${leaveType.name}`,
    details: { startDate: input.startDate, endDate: input.endDate, days: input.workingDaysRequested },
  });

  return request;
}

export async function approveLeaveRequest(id: string, action: "APPROVED" | "REJECTED", reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const request = await leaveRepository.findLeaveRequestById(ctx.tenantId, id);
  if (!request) throw new AuthorizationError("Leave request not found.", 404);
  if (request.status !== "SUBMITTED") throw new AuthorizationError("Leave request must be in SUBMITTED status.", 400);

  const year = request.startDate.getFullYear();
  const days = request.workingDaysRequested;

  if (action === "APPROVED") {
    await leaveRepository.updateLeaveRequestStatus(ctx.tenantId, id, "APPROVED", ctx.userId, new Date());
    if (days > 0) {
      await leaveRepository.adjustUsedBalance(request.employeeId, request.leaveTypeId, year, days);
    }
  } else {
    await leaveRepository.updateLeaveRequestStatus(ctx.tenantId, id, "REJECTED", ctx.userId, undefined, reason);
    if (days > 0) {
      await leaveRepository.adjustPendingBalance(request.employeeId, request.leaveTypeId, year, -days, ctx.tenantId);
    }
  }

  const approval = await leaveRepository.createLeaveApproval({
    leaveRequestId: id, tenantId: ctx.tenantId, level: 1, approverId: ctx.userId, status: action,
  });
  await leaveRepository.updateLeaveApproval(approval.id, {
    status: action, reason, approvedAt: new Date(),
  });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId,
    action: action === "APPROVED" ? "Leave request approved" : "Leave request rejected",
    resourceType: "LeaveRequest", resourceId: id,
    resourceName: `${request.employee.firstName} ${request.employee.lastName}`,
    details: { reason },
  });

  return { ok: true };
}

export async function cancelLeaveRequest(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const request = await leaveRepository.findLeaveRequestById(ctx.tenantId, id);
  if (!request) throw new AuthorizationError("Leave request not found.", 404);
  if (!["DRAFT", "SUBMITTED"].includes(request.status)) {
    throw new AuthorizationError("Only draft or submitted requests can be cancelled.", 400);
  }

  const year = request.startDate.getFullYear();
  const days = request.workingDaysRequested;

  await leaveRepository.updateLeaveRequestStatus(ctx.tenantId, id, "CANCELLED", ctx.userId);
  if (days > 0) {
    await leaveRepository.adjustPendingBalance(request.employeeId, request.leaveTypeId, year, -days, ctx.tenantId);
  }

  return { ok: true };
}

// ── Calendar ───────────────────────────────────────────────

export async function getLeaveCalendar(startDate: string, endDate: string, employeeId?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const requests = await leaveRepository.findLeaveRequestsForCalendar(
    ctx.tenantId, new Date(startDate), new Date(endDate), employeeId,
  );

  const events = requests.map((r) => ({
    id: r.id,
    title: `${r.employee.firstName} ${r.employee.lastName} - ${r.leaveType.name}`,
    start: r.startDate.toISOString(),
    end: r.endDate.toISOString(),
    status: r.status,
    employeeName: `${r.employee.firstName} ${r.employee.lastName}`,
    employeeId: r.employee.employeeId,
    leaveType: r.leaveType.name,
    leaveTypeCode: r.leaveType.code,
    leaveTypeCategory: r.leaveType.category,
  }));

  return events;
}
