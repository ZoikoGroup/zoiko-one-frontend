import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { complianceRepository } from "@/app/repositories/complianceRepository";
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

// ── Dashboard ──

export async function getComplianceDashboard() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return complianceRepository.getDashboardStats(ctx.tenantId);
}

// ── Policies ──

export async function listPolicies(options?: {
  filters?: { search?: string; category?: string; status?: string };
  skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
  tenantId?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await complianceRepository.findPolicies(tenantId, options ?? {});
  const total = await complianceRepository.countPolicies(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getPolicy(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return complianceRepository.findPolicyById(id, ctx.tenantId);
}

export async function createPolicy(input: {
  organizationId?: string;
  policyName?: string;
  category?: string;
  description?: string;
  version?: string;
  status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const errors = collectErrors([
    validateRequired(input.policyName, "policyName"),
    validateRequired(input.category, "category"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);
  const organizationId = await resolveOrganizationId(ctx, input.organizationId);
  const policy = await complianceRepository.createPolicy({
    organizationId,
    tenantId: ctx.tenantId,
    policyName: input.policyName!,
    category: input.category!,
    description: input.description,
    version: input.version ?? "1.0",
    status: (input.status as any) ?? "DRAFT",
    createdBy: ctx.userId,
  });
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Policy created",
    resourceType: "Policy", resourceId: policy.id, resourceName: input.policyName,
  });
  return policy;
}

export async function updatePolicy(id: string, input: {
  policyName?: string; category?: string; description?: string; version?: string; status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const existing = await complianceRepository.findPolicyById(id, ctx.tenantId);
  if (!existing) throw new AuthorizationError("Policy not found.", 404);
  const policy = await complianceRepository.updatePolicy(id, ctx.tenantId, {
    ...(input.policyName !== undefined && { policyName: input.policyName }),
    ...(input.category !== undefined && { category: input.category }),
    ...(input.description !== undefined && { description: input.description }),
    ...(input.version !== undefined && { version: input.version }),
    ...(input.status !== undefined && { status: input.status as any }),
    updatedBy: ctx.userId,
  });
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Policy updated",
    resourceType: "Policy", resourceId: policy.id, resourceName: existing.policyName,
  });
  return policy;
}

export async function deletePolicy(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const existing = await complianceRepository.findPolicyById(id, ctx.tenantId);
  if (!existing) throw new AuthorizationError("Policy not found.", 404);
  await complianceRepository.softDeletePolicy(id, ctx.tenantId, ctx.userId);
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Policy deleted",
    resourceType: "Policy", resourceId: id, resourceName: existing.policyName,
  });
  return { ok: true };
}

// ── Policy Categories ──

export async function listPolicyCategories(options?: { search?: string; skip?: number; take?: number; tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await complianceRepository.findPolicyCategories(tenantId, options ?? {});
  const total = await complianceRepository.countPolicyCategories(tenantId, options?.search);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function createPolicyCategory(input: { organizationId?: string; name?: string; description?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const errors = collectErrors([validateRequired(input.name, "name")]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);
  const organizationId = await resolveOrganizationId(ctx, input.organizationId);
  const cat = await complianceRepository.createPolicyCategory({
    organizationId,
    tenantId: ctx.tenantId,
    name: input.name!,
    description: input.description,
    createdBy: ctx.userId,
  });
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Policy category created",
    resourceType: "PolicyCategory", resourceId: cat.id, resourceName: input.name,
  });
  return cat;
}

export async function updatePolicyCategory(id: string, input: { name?: string; description?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const existing = await complianceRepository.findPolicyCategoryById(id, ctx.tenantId);
  if (!existing) throw new AuthorizationError("Policy category not found.", 404);
  const cat = await complianceRepository.updatePolicyCategory(id, {
    ...(input.name !== undefined && { name: input.name }),
    ...(input.description !== undefined && { description: input.description }),
    updatedBy: ctx.userId,
  });
  return cat;
}

// ── Compliance Requirements ──

export async function listRequirements(options?: {
  filters?: { search?: string; status?: string; priority?: string };
  skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
  tenantId?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await complianceRepository.findRequirements(tenantId, options ?? {});
  const total = await complianceRepository.countRequirements(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function createRequirement(input: {
  organizationId?: string; title?: string; description?: string; priority?: string; dueDate?: string; status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const errors = collectErrors([validateRequired(input.title, "title")]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);
  const organizationId = await resolveOrganizationId(ctx, input.organizationId);
  const req = await complianceRepository.createRequirement({
    organizationId,
    tenantId: ctx.tenantId,
    title: input.title!,
    description: input.description,
    priority: (input.priority as any) ?? "MEDIUM",
    dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    status: (input.status as any) ?? "ACTIVE",
    createdBy: ctx.userId,
  });
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Compliance requirement created",
    resourceType: "ComplianceRequirement", resourceId: req.id, resourceName: input.title,
  });
  return req;
}

export async function updateRequirement(id: string, input: {
  title?: string; description?: string; priority?: string; dueDate?: string; status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const existing = await complianceRepository.findRequirementById(id, ctx.tenantId);
  if (!existing) throw new AuthorizationError("Requirement not found.", 404);
  const req = await complianceRepository.updateRequirement(id, {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && { description: input.description }),
    ...(input.priority !== undefined && { priority: input.priority as any }),
    ...(input.dueDate !== undefined && { dueDate: new Date(input.dueDate) }),
    ...(input.status !== undefined && { status: input.status as any }),
    updatedBy: ctx.userId,
  });
  return req;
}

// ── Audits ──

export async function listAudits(options?: {
  filters?: { search?: string; auditType?: string; status?: string };
  skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
  tenantId?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await complianceRepository.findAudits(tenantId, options ?? {});
  const total = await complianceRepository.countAudits(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function createAudit(input: {
  organizationId?: string; auditName?: string; auditType?: string; auditor?: string; scheduledDate?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const errors = collectErrors([
    validateRequired(input.auditName, "auditName"),
    validateRequired(input.auditType, "auditType"),
    validateRequired(input.auditor, "auditor"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);
  const organizationId = await resolveOrganizationId(ctx, input.organizationId);
  const audit = await complianceRepository.createAudit({
    organizationId,
    tenantId: ctx.tenantId,
    auditName: input.auditName!,
    auditType: input.auditType!,
    auditor: input.auditor!,
    scheduledDate: input.scheduledDate ? new Date(input.scheduledDate) : new Date(),
    createdBy: ctx.userId,
  });
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Audit created",
    resourceType: "ComplianceAudit", resourceId: audit.id, resourceName: input.auditName,
  });
  return audit;
}

export async function updateAuditStatus(id: string, status: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const existing = await complianceRepository.findAuditById(id, ctx.tenantId);
  if (!existing) throw new AuthorizationError("Audit not found.", 404);
  const audit = await complianceRepository.updateAudit(id, {
    status: status as any,
    ...(status === "COMPLETED" && { completedDate: new Date() }),
    updatedBy: ctx.userId,
  });
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: `Audit status updated to ${status}`,
    resourceType: "ComplianceAudit", resourceId: id, resourceName: existing.auditName,
  });
  return audit;
}

// ── Violations ──

export async function listViolations(options?: {
  filters?: { search?: string; severity?: string; status?: string };
  skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
  tenantId?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await complianceRepository.findViolations(tenantId, options ?? {});
  const total = await complianceRepository.countViolations(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function updateViolationStatus(id: string, status: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const existing = await complianceRepository.findViolationById(id, ctx.tenantId);
  if (!existing) throw new AuthorizationError("Violation not found.", 404);
  const violation = await complianceRepository.updateViolation(id, {
    status: status as any,
    updatedBy: ctx.userId,
  });
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: `Violation status updated to ${status}`,
    resourceType: "PolicyViolation", resourceId: id,
  });
  return violation;
}

// ── Corrective Actions ──

export async function listCorrectiveActions(options?: {
  filters?: { search?: string; status?: string; priority?: string };
  skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
  tenantId?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await complianceRepository.findCorrectiveActions(tenantId, options ?? {});
  const total = await complianceRepository.countCorrectiveActions(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function createCorrectiveAction(input: {
  organizationId?: string; title?: string; description?: string; assignedTo?: string; priority?: string; dueDate?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const errors = collectErrors([
    validateRequired(input.title, "title"),
    validateRequired(input.assignedTo, "assignedTo"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);
  const organizationId = await resolveOrganizationId(ctx, input.organizationId);
  const action = await complianceRepository.createCorrectiveAction({
    organizationId,
    tenantId: ctx.tenantId,
    title: input.title!,
    description: input.description,
    assignedTo: input.assignedTo!,
    priority: (input.priority as any) ?? "MEDIUM",
    dueDate: input.dueDate ? new Date(input.dueDate) : undefined,
    createdBy: ctx.userId,
  });
  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "Corrective action created",
    resourceType: "CorrectiveAction", resourceId: action.id, resourceName: input.title,
  });
  return action;
}

export async function updateCorrectiveAction(id: string, input: {
  title?: string; description?: string; assignedTo?: string; priority?: string; dueDate?: string; status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const existing = await complianceRepository.findCorrectiveActionById(id, ctx.tenantId);
  if (!existing) throw new AuthorizationError("Corrective action not found.", 404);
  const action = await complianceRepository.updateCorrectiveAction(id, {
    ...(input.title !== undefined && { title: input.title }),
    ...(input.description !== undefined && { description: input.description }),
    ...(input.assignedTo !== undefined && { assignedTo: input.assignedTo }),
    ...(input.priority !== undefined && { priority: input.priority as any }),
    ...(input.dueDate !== undefined && { dueDate: new Date(input.dueDate) }),
    ...(input.status !== undefined && { status: input.status as any }),
    updatedBy: ctx.userId,
  });
  return action;
}

// ── Acknowledgements ──

export async function listAcknowledgements(options?: {
  filters?: { search?: string; status?: string };
  skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
  tenantId?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await complianceRepository.findAcknowledgements(tenantId, options ?? {});
  const total = await complianceRepository.countAcknowledgements(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

// ── Training Compliance ──

export async function listTrainingCompliance(options?: {
  filters?: { search?: string; status?: string };
  skip?: number; take?: number; orderBy?: string; orderDir?: "asc" | "desc";
  tenantId?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await complianceRepository.findTrainingCompliance(tenantId, options ?? {});
  const total = await complianceRepository.countTrainingCompliance(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

// ── Reports ──

export async function getComplianceTrends() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return complianceRepository.getTrends(ctx.tenantId);
}

export async function getViolationsByCategory() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return complianceRepository.getViolationsByCategory(ctx.tenantId);
}

export async function getAuditCompletionData() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return complianceRepository.getAuditCompletionData(ctx.tenantId);
}

export async function getDepartmentCompliance() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return complianceRepository.getDepartmentCompliance(ctx.tenantId);
}

export async function getPolicyAdherenceTrends() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  return complianceRepository.getPolicyAdherenceTrends(ctx.tenantId);
}
