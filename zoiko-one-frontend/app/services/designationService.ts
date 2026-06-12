import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { designationRepository } from "@/app/repositories/designationRepository";
import type { DesignationListOptions } from "@/app/repositories/designationRepository";
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

export async function listDesignations(options?: DesignationListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const tenantId = options?.tenantId ?? ctx.tenantId;
  const designations = await designationRepository.findDesignations(tenantId, options);
  const total = await designationRepository.countDesignations(tenantId, options?.filters);

  return { data: designations, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getDesignation(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const designation = await designationRepository.findDesignationById(ctx.tenantId, id);
  if (!designation) throw new AuthorizationError("Designation not found.", 404);

  return designation;
}

export async function createDesignation(input: {
  organizationId?: string;
  title: string;
  code: string;
  level: string;
  category: string;
  grade?: string;
  description?: string;
  minSalary?: number;
  maxSalary?: number;
  departmentId?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.title, "title"),
    validateRequired(input.code, "code"),
    validateRequired(input.level, "level"),
    validateRequired(input.category, "category"),
  ]);
  if (errors.length > 0) {
    throw new AuthorizationError(errors.join(" "), 400);
  }

  const organizationId = await resolveOrganizationId(ctx, input.organizationId);

  const existingTitle = await designationRepository.findDesignationByTitle(ctx.tenantId, organizationId, input.title);
  if (existingTitle) throw new AuthorizationError("A designation with this title already exists.", 409);

  const existingCode = await designationRepository.findDesignationByCode(ctx.tenantId, organizationId, input.code);
  if (existingCode) throw new AuthorizationError("A designation with this code already exists.", 409);

  const designation = await designationRepository.createDesignation({
    organizationId,
    tenantId: ctx.tenantId,
    title: input.title,
    code: input.code.toUpperCase(),
    level: input.level as never,
    category: input.category as never,
    grade: input.grade,
    description: input.description,
    minSalary: input.minSalary,
    maxSalary: input.maxSalary,
    departmentId: input.departmentId,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Designation created",
    resourceType: "Designation",
    resourceId: designation.id,
    resourceName: input.title,
    details: { code: input.code },
  });

  return designation;
}

export async function updateDesignation(id: string, input: {
  title?: string;
  code?: string;
  level?: string;
  category?: string;
  grade?: string;
  description?: string;
  minSalary?: number;
  maxSalary?: number;
  departmentId?: string;
  status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await designationRepository.findDesignationById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Designation not found.", 404);

  if (input.title) {
    const dupe = await designationRepository.findDesignationByTitle(ctx.tenantId, existing.organizationId, input.title, id);
    if (dupe) throw new AuthorizationError("A designation with this title already exists.", 409);
  }

  if (input.code) {
    const dupe = await designationRepository.findDesignationByCode(ctx.tenantId, existing.organizationId, input.code, id);
    if (dupe) throw new AuthorizationError("A designation with this code already exists.", 409);
  }

  const designation = await designationRepository.updateDesignation(ctx.tenantId, id, {
    ...input,
    level: input.level as never,
    category: input.category as never,
    status: input.status as never,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Designation updated",
    resourceType: "Designation",
    resourceId: id,
    resourceName: existing.title,
    details: { changes: Object.keys(input) },
  });

  return designation;
}

export async function deleteDesignation(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await designationRepository.findDesignationById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Designation not found.", 404);

  await designationRepository.softDeleteDesignation(ctx.tenantId, id, ctx.userId, reason);

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Designation deleted",
    resourceType: "Designation",
    resourceId: id,
    resourceName: existing.title,
    details: { reason },
  });

  return { ok: true };
}
