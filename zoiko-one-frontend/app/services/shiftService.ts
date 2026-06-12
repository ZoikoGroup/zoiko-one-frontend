import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { shiftRepository } from "@/app/repositories/shiftRepository";
import type { ShiftListOptions, ShiftFilters } from "@/app/repositories/shiftRepository";
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

export async function listShifts(options?: ShiftListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const orgId = await resolveOrganizationId(ctx);
  const data = await shiftRepository.findShifts(tenantId, orgId, options);
  const total = await shiftRepository.countShifts(tenantId, orgId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getShift(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const shift = await shiftRepository.findShiftById(ctx.tenantId, id);
  if (!shift) throw new AuthorizationError("Shift not found.", 404);
  return shift;
}

export async function createShift(input: {
  name: string;
  startTime: string;
  endTime: string;
  gracePeriod?: number;
  weeklyOff?: string[];
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.name, "Name"),
    validateRequired(input.startTime, "Start time"),
    validateRequired(input.endTime, "End time"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const orgId = await resolveOrganizationId(ctx);

  const existing = await prisma.shift.findFirst({
    where: { tenantId: ctx.tenantId, name: input.name, deletedAt: null },
  });
  if (existing) throw new AuthorizationError("A shift with this name already exists.", 409);

  const data = await shiftRepository.createShift({
    name: input.name,
    startTime: input.startTime,
    endTime: input.endTime,
    gracePeriod: input.gracePeriod ?? 15,
    weeklyOff: input.weeklyOff,
    organizationId: orgId,
    tenantId: ctx.tenantId,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "SHIFT_CREATE",
    resourceType: "Shift",
    resourceId: data.id,
    resourceName: input.name,
  });

  return data;
}

export async function updateShift(id: string, input: {
  name?: string;
  startTime?: string;
  endTime?: string;
  gracePeriod?: number;
  weeklyOff?: string[];
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await shiftRepository.findShiftById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Shift not found.", 404);

  if (input.name && input.name !== existing.name) {
    const duplicate = await prisma.shift.findFirst({
      where: { tenantId: ctx.tenantId, name: input.name, id: { not: id }, deletedAt: null },
    });
    if (duplicate) throw new AuthorizationError("A shift with this name already exists.", 409);
  }

  const data = await shiftRepository.updateShift(id, {
    ...input,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "SHIFT_UPDATE",
    resourceType: "Shift",
    resourceId: id,
    details: input,
  });

  return data;
}

export async function deleteShift(id: string, deletionReason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await shiftRepository.findShiftById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Shift not found.", 404);

  await shiftRepository.softDeleteShift(id, ctx.userId, deletionReason);

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "SHIFT_DELETE",
    resourceType: "Shift",
    resourceId: id,
  });
}

export async function assignShiftToEmployee(input: {
  shiftId: string;
  employeeId: string;
  effectiveFrom: string;
  effectiveTo?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.shiftId, "Shift"),
    validateRequired(input.employeeId, "Employee"),
    validateRequired(input.effectiveFrom, "Effective from date"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const shift = await shiftRepository.findShiftById(ctx.tenantId, input.shiftId);
  if (!shift) throw new AuthorizationError("Shift not found.", 404);

  const employee = await prisma.employee.findFirst({
    where: { id: input.employeeId, tenantId: ctx.tenantId, deletedAt: null },
  });
  if (!employee) throw new AuthorizationError("Employee not found.", 404);

  const data = await shiftRepository.assignShift({
    shiftId: input.shiftId,
    employeeId: input.employeeId,
    effectiveFrom: new Date(input.effectiveFrom),
    effectiveTo: input.effectiveTo ? new Date(input.effectiveTo) : undefined,
    tenantId: ctx.tenantId,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "SHIFT_ASSIGN",
    resourceType: "ShiftAssignment",
    resourceId: data.id,
    details: { shiftId: input.shiftId, employeeId: input.employeeId },
  });

  return data;
}
