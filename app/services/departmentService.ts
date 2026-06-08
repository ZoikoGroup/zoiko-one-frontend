import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { departmentRepository } from "@/app/repositories/departmentRepository";
import type { DepartmentListOptions } from "@/app/repositories/departmentRepository";
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

export async function listDepartments(options?: DepartmentListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const tenantId = options?.tenantId ?? ctx.tenantId;
  const departments = await departmentRepository.findDepartments(tenantId, options);
  const total = await departmentRepository.countDepartments(tenantId, options?.filters);

  return { data: departments, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getDepartment(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const department = await departmentRepository.findDepartmentById(ctx.tenantId, id);
  if (!department) throw new AuthorizationError("Department not found.", 404);

  return department;
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

export async function createDepartment(input: {
  organizationId?: string;
  name: string;
  code: string;
  description?: string;
  parentDeptId?: string;
  headEmployeeId?: string;
  budget?: number;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.name, "name"),
    validateRequired(input.code, "code"),
  ]);
  if (errors.length > 0) {
    throw new AuthorizationError(errors.join(" "), 400);
  }

  const organizationId = await resolveOrganizationId(ctx, input.organizationId);

  const existingName = await departmentRepository.findDepartmentByName(ctx.tenantId, organizationId, input.name);
  if (existingName) throw new AuthorizationError("A department with this name already exists.", 409);

  const existingCode = await departmentRepository.findDepartmentByCode(ctx.tenantId, organizationId, input.code);
  if (existingCode) throw new AuthorizationError("A department with this code already exists.", 409);

  const department = await departmentRepository.createDepartment({
    organizationId,
    tenantId: ctx.tenantId,
    name: input.name,
    code: input.code.toUpperCase(),
    description: input.description,
    parentDeptId: input.parentDeptId,
    headEmployeeId: input.headEmployeeId,
    budget: input.budget,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Department created",
    resourceType: "Department",
    resourceId: department.id,
    resourceName: input.name,
    details: { code: input.code },
  });

  return department;
}

export async function updateDepartment(id: string, input: {
  name?: string;
  code?: string;
  description?: string;
  parentDeptId?: string;
  headEmployeeId?: string;
  budget?: number;
  status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await departmentRepository.findDepartmentById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Department not found.", 404);

  if (input.name) {
    const dupe = await departmentRepository.findDepartmentByName(ctx.tenantId, existing.organizationId, input.name, id);
    if (dupe) throw new AuthorizationError("A department with this name already exists.", 409);
  }

  if (input.code) {
    const dupe = await departmentRepository.findDepartmentByCode(ctx.tenantId, existing.organizationId, input.code, id);
    if (dupe) throw new AuthorizationError("A department with this code already exists.", 409);
  }

  const department = await departmentRepository.updateDepartment(ctx.tenantId, id, {
    ...input,
    status: input.status as never,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Department updated",
    resourceType: "Department",
    resourceId: id,
    resourceName: existing.name,
    details: { changes: Object.keys(input) },
  });

  return department;
}

export async function deleteDepartment(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await departmentRepository.findDepartmentById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Department not found.", 404);

  await departmentRepository.softDeleteDepartment(ctx.tenantId, id, ctx.userId, reason);

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Department deleted",
    resourceType: "Department",
    resourceId: id,
    resourceName: existing.name,
    details: { reason },
  });

  return { ok: true };
}
