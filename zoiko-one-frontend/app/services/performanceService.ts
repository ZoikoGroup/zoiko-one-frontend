import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { performanceRepository } from "@/app/repositories/performanceRepository";
import type { ReviewFilters, GoalFilters, FeedbackFilters, PaginationOptions, CycleFilters } from "@/app/repositories/performanceRepository";
import { prisma } from "@/lib/prisma";

// ── Audit helper ──
async function writeAudit(params: {
  tenantId: string; userId?: string; action: string;
  resourceType: string; resourceId?: string; resourceName?: string;
  details?: Record<string, unknown>;
}) {
  const { prisma: p } = await import("@/lib/prisma");
  await p.auditLog.create({
    data: {
      ...params,
      details: params.details as never ?? undefined,
      createdAt: new Date(),
    },
  });
}

// ── Validation helpers ──
function validateRequired(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === "") return `${field} is required.`;
  return null;
}

function collectErrors(checks: (string | null)[]): string[] {
  return checks.filter((c): c is string => c !== null);
}

// ── Organization resolver ──
async function resolveOrganizationId(ctx: { tenantId: string }, providedId?: string): Promise<string> {
  if (providedId) return providedId;
  const org = await prisma.organization.findFirst({
    where: { tenantId: ctx.tenantId, status: "ACTIVE" },
    orderBy: { createdAt: "asc" },
  });
  if (!org) throw new AuthorizationError("No active organization found for tenant.", 400);
  return org.id;
}

// ── Review Cycles ──

export async function listCycles(options?: PaginationOptions & { filters?: CycleFilters; tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const orgId = await resolveOrganizationId(ctx);
  const data = await performanceRepository.findCycles(tenantId, orgId, options);
  const total = await performanceRepository.countCycles(tenantId, orgId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getCycle(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);
  const cycle = await performanceRepository.findCycleById(ctx.tenantId, orgId, id);
  if (!cycle) throw new AuthorizationError("Review cycle not found.", 404);
  return cycle;
}

export async function createCycle(input: {
  name: string; description?: string; startDate: string; endDate: string; status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.name, "Name"),
    validateRequired(input.startDate, "Start date"),
    validateRequired(input.endDate, "End date"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const orgId = await resolveOrganizationId(ctx);

  const existing = await performanceRepository.findCycles(ctx.tenantId, orgId, {
    filters: { search: input.name },
    take: 1,
  });
  if (existing.length > 0) throw new AuthorizationError("A review cycle with this name already exists.", 409);

  const data = await performanceRepository.createCycle({
    name: input.name,
    description: input.description,
    startDate: new Date(input.startDate),
    endDate: new Date(input.endDate),
    status: input.status,
    organizationId: orgId,
    tenantId: ctx.tenantId,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "CREATE",
    resourceType: "ReviewCycle",
    resourceId: data.id,
    resourceName: data.name,
  });

  return data;
}

export async function updateCycle(id: string, input: {
  name?: string; description?: string; startDate?: string; endDate?: string; status?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);

  await getCycle(id);

  const data = await performanceRepository.updateCycle(id, {
    ...input,
    startDate: input.startDate ? new Date(input.startDate) : undefined,
    endDate: input.endDate ? new Date(input.endDate) : undefined,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "UPDATE",
    resourceType: "ReviewCycle", resourceId: data.id, resourceName: data.name,
  });

  return data;
}

export async function deleteCycle(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  await getCycle(id);
  await performanceRepository.softDeleteCycle(id, ctx.userId, reason);

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "DELETE",
    resourceType: "ReviewCycle", resourceId: id,
  });
  return { ok: true };
}

// ── Performance Reviews ──

export async function listReviews(options?: PaginationOptions & { filters?: ReviewFilters; tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const orgId = await resolveOrganizationId(ctx);
  const data = await performanceRepository.findReviews(tenantId, orgId, options);
  const total = await performanceRepository.countReviews(tenantId, orgId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getReview(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);
  const review = await performanceRepository.findReviewById(ctx.tenantId, orgId, id);
  if (!review) throw new AuthorizationError("Performance review not found.", 404);
  return review;
}

export async function createReview(input: {
  employeeId: string; reviewerId?: string; cycleId: string;
  overallRating?: number; status?: string; strengths?: string;
  improvements?: string; notes?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.employeeId, "Employee"),
    validateRequired(input.cycleId, "Review cycle"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const employee = await prisma.employee.findFirst({
    where: { id: input.employeeId, tenantId: ctx.tenantId, deletedAt: null },
  });
  if (!employee) throw new AuthorizationError("Employee not found.", 404);

  const orgId = await resolveOrganizationId(ctx);

  const existing = await performanceRepository.findReviewByEmployeeAndCycle(ctx.tenantId, input.employeeId, input.cycleId);
  if (existing) throw new AuthorizationError("A review already exists for this employee in this cycle.", 409);

  const submittedAt = input.status === "SUBMITTED" ? new Date() : undefined;

  const data = await performanceRepository.createReview({
    employeeId: input.employeeId,
    reviewerId: input.reviewerId,
    cycleId: input.cycleId,
    overallRating: input.overallRating,
    status: input.status,
    strengths: input.strengths,
    improvements: input.improvements,
    notes: input.notes,
    submittedAt,
    organizationId: orgId,
    tenantId: ctx.tenantId,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "CREATE",
    resourceType: "PerformanceReview", resourceId: data.id,
    details: { employeeId: input.employeeId, cycleId: input.cycleId },
  });

  return data;
}

export async function updateReview(id: string, input: {
  reviewerId?: string; overallRating?: number; status?: string;
  strengths?: string; improvements?: string; notes?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);

  const existing = await performanceRepository.findReviewById(ctx.tenantId, orgId, id);
  if (!existing) throw new AuthorizationError("Performance review not found.", 404);

  const submittedAt = input.status === "SUBMITTED" && existing.status === "DRAFT" ? new Date() : undefined;
  const acknowledgedAt = input.status === "ACKNOWLEDGED" && existing.status === "SUBMITTED" ? new Date() : undefined;

  const data = await performanceRepository.updateReview(id, {
    ...input,
    submittedAt,
    acknowledgedAt,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "UPDATE",
    resourceType: "PerformanceReview", resourceId: id,
    details: { status: input.status },
  });

  return data;
}

export async function deleteReview(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);
  const existing = await performanceRepository.findReviewById(ctx.tenantId, orgId, id);
  if (!existing) throw new AuthorizationError("Performance review not found.", 404);
  await performanceRepository.softDeleteReview(id, ctx.userId, reason);

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "DELETE",
    resourceType: "PerformanceReview", resourceId: id,
  });
  return { ok: true };
}

// ── Goals ──

export async function listGoals(options?: PaginationOptions & { filters?: GoalFilters; tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const orgId = await resolveOrganizationId(ctx);
  const data = await performanceRepository.findGoals(tenantId, orgId, options);
  const total = await performanceRepository.countGoals(tenantId, orgId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getGoal(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);
  const goal = await performanceRepository.findGoalById(ctx.tenantId, orgId, id);
  if (!goal) throw new AuthorizationError("Goal not found.", 404);
  return goal;
}

export async function createGoal(input: {
  employeeId: string; title: string; description?: string;
  category?: string; startDate: string; targetDate?: string;
  status?: string; progress?: number; notes?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.employeeId, "Employee"),
    validateRequired(input.title, "Title"),
    validateRequired(input.startDate, "Start date"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const employee = await prisma.employee.findFirst({
    where: { id: input.employeeId, tenantId: ctx.tenantId, deletedAt: null },
  });
  if (!employee) throw new AuthorizationError("Employee not found.", 404);

  const orgId = await resolveOrganizationId(ctx);

  const data = await performanceRepository.createGoal({
    employeeId: input.employeeId,
    title: input.title,
    description: input.description,
    category: input.category,
    startDate: new Date(input.startDate),
    targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
    status: input.status,
    progress: input.progress,
    notes: input.notes,
    organizationId: orgId,
    tenantId: ctx.tenantId,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "CREATE",
    resourceType: "Goal", resourceId: data.id, resourceName: data.title,
  });

  return data;
}

export async function updateGoal(id: string, input: {
  title?: string; description?: string; category?: string;
  startDate?: string; targetDate?: string; completedDate?: string;
  status?: string; progress?: number; notes?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);

  const existing = await performanceRepository.findGoalById(ctx.tenantId, orgId, id);
  if (!existing) throw new AuthorizationError("Goal not found.", 404);

  const completedDate = input.status === "COMPLETED" && existing.status !== "COMPLETED" ? new Date() : undefined;

  const data = await performanceRepository.updateGoal(id, {
    ...input,
    startDate: input.startDate ? new Date(input.startDate) : undefined,
    targetDate: input.targetDate ? new Date(input.targetDate) : undefined,
    completedDate: input.completedDate ? new Date(input.completedDate) : completedDate,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "UPDATE",
    resourceType: "Goal", resourceId: id, resourceName: data.title,
    details: { status: input.status, progress: input.progress },
  });

  return data;
}

export async function deleteGoal(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);
  const existing = await performanceRepository.findGoalById(ctx.tenantId, orgId, id);
  if (!existing) throw new AuthorizationError("Goal not found.", 404);
  await performanceRepository.softDeleteGoal(id, ctx.userId, reason);

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "DELETE",
    resourceType: "Goal", resourceId: id,
  });
  return { ok: true };
}

// ── Goal Updates ──

export async function createGoalUpdate(goalId: string, input: {
  updateText: string; previousProgress?: number; newProgress?: number;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.updateText, "Update text"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const orgId = await resolveOrganizationId(ctx);
  const goal = await performanceRepository.findGoalById(ctx.tenantId, orgId, goalId);
  if (!goal) throw new AuthorizationError("Goal not found.", 404);

  const data = await performanceRepository.createGoalUpdate({
    goalId,
    updateText: input.updateText,
    previousProgress: input.previousProgress,
    newProgress: input.newProgress,
    tenantId: ctx.tenantId,
    createdBy: ctx.userId,
  });

  if (input.newProgress !== undefined) {
    await performanceRepository.updateGoal(goalId, {
      progress: input.newProgress,
      status: input.newProgress >= 100 ? "COMPLETED" : goal.status,
      completedDate: input.newProgress >= 100 ? new Date() : undefined,
      updatedBy: ctx.userId,
    });
  }

  return data;
}

// ── Feedback ──

export async function listFeedbacks(options?: PaginationOptions & { filters?: FeedbackFilters; tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const orgId = await resolveOrganizationId(ctx);
  const data = await performanceRepository.findFeedbacks(tenantId, orgId, options);
  const total = await performanceRepository.countFeedbacks(tenantId, orgId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function createFeedback(input: {
  employeeId: string; giverId?: string; type?: string;
  category?: string; content: string; isConfidential?: boolean;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.employeeId, "Employee"),
    validateRequired(input.content, "Content"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const employee = await prisma.employee.findFirst({
    where: { id: input.employeeId, tenantId: ctx.tenantId, deletedAt: null },
  });
  if (!employee) throw new AuthorizationError("Employee not found.", 404);

  const orgId = await resolveOrganizationId(ctx);

  const data = await performanceRepository.createFeedback({
    employeeId: input.employeeId,
    giverId: input.giverId ?? ctx.userId,
    type: input.type,
    category: input.category,
    content: input.content,
    isConfidential: input.isConfidential,
    organizationId: orgId,
    tenantId: ctx.tenantId,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "CREATE",
    resourceType: "Feedback", resourceId: data.id,
  });

  return data;
}

export async function deleteFeedback(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);
  const existing = await performanceRepository.findFeedbacks(ctx.tenantId, orgId, { filters: {}, take: 1 });
  const fb = (await performanceRepository.findFeedbacks(ctx.tenantId, orgId, { take: 200 })).find(f => f.id === id);
  if (!fb) throw new AuthorizationError("Feedback not found.", 404);
  await performanceRepository.softDeleteFeedback(id, ctx.userId, reason);

  await writeAudit({
    tenantId: ctx.tenantId, userId: ctx.userId, action: "DELETE",
    resourceType: "Feedback", resourceId: id,
  });
  return { ok: true };
}

// ── Dashboard ──

export async function getPerformanceDashboard() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const orgId = await resolveOrganizationId(ctx);
  return performanceRepository.getDashboardStats(ctx.tenantId, orgId);
}
