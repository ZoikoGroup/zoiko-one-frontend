import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { recruitmentRepository } from "@/app/repositories/recruitmentRepository";
import type { JobListOptions, CandidateListOptions, InterviewListOptions, OfferListOptions } from "@/app/repositories/recruitmentRepository";
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

const VALID_STAGE_TRANSITIONS: Record<string, string[]> = {
  APPLIED: ["SCREENING", "REJECTED", "WITHDRAWN"],
  SCREENING: ["SHORTLISTED", "REJECTED", "WITHDRAWN"],
  SHORTLISTED: ["INTERVIEW_SCHEDULED", "REJECTED", "WITHDRAWN"],
  INTERVIEW_SCHEDULED: ["INTERVIEWED", "CANCELLED", "REJECTED", "WITHDRAWN"],
  INTERVIEWED: ["OFFERED", "REJECTED", "WITHDRAWN"],
  OFFERED: ["HIRED", "REJECTED", "WITHDRAWN"],
  HIRED: [],
  REJECTED: [],
  WITHDRAWN: [],
};

function validateStageTransition(currentStage: string, newStage: string): string | null {
  if (currentStage === newStage) return null;
  const allowed = VALID_STAGE_TRANSITIONS[currentStage];
  if (!allowed) return `Unknown current stage: ${currentStage}`;
  if (!allowed.includes(newStage)) return `Invalid stage transition: cannot move from '${currentStage}' to '${newStage}'`;
  return null;
}

// ── Dashboard ──

export async function getRecruitmentDashboard() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return recruitmentRepository.getDashboardStats(ctx.tenantId);
}

// ── Jobs ──

export async function listJobs(options?: JobListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const tenantId = options?.tenantId ?? ctx.tenantId;
  const jobs = await recruitmentRepository.findJobs(tenantId, options);
  const total = await recruitmentRepository.countJobs(tenantId, options?.filters);

  return {
    data: jobs,
    total,
    skip: options?.skip ?? 0,
    take: options?.take ?? 25,
  };
}

export async function getJob(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const job = await recruitmentRepository.findJobById(ctx.tenantId, id);
  if (!job) throw new AuthorizationError("Job opening not found.", 404);

  return job;
}

export async function createJob(input: {
  organizationId?: string;
  title: string;
  departmentId: string;
  location?: string;
  employmentType?: string;
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  status?: string;
  openingsCount?: number;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.title, "title"),
    validateRequired(input.departmentId, "departmentId"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  if (input.salaryMin !== undefined && input.salaryMax !== undefined && input.salaryMin > input.salaryMax) {
    throw new AuthorizationError("Salary minimum cannot exceed maximum.", 400);
  }

  const organizationId = await resolveOrganizationId(ctx, input.organizationId);

  const job = await recruitmentRepository.createJob({
    organizationId,
    tenantId: ctx.tenantId,
    title: input.title,
    departmentId: input.departmentId,
    location: input.location,
    employmentType: input.employmentType,
    minExperience: input.minExperience,
    maxExperience: input.maxExperience,
    salaryMin: input.salaryMin,
    salaryMax: input.salaryMax,
    description: input.description,
    requirements: input.requirements,
    responsibilities: input.responsibilities,
    status: input.status,
    openingsCount: input.openingsCount,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Job opening created",
    resourceType: "JobOpening",
    resourceId: job.id,
    resourceName: input.title,
  });

  return job;
}

export async function updateJob(id: string, input: {
  title?: string;
  departmentId?: string;
  location?: string;
  employmentType?: string;
  minExperience?: number;
  maxExperience?: number;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  requirements?: string;
  responsibilities?: string;
  status?: string;
  openingsCount?: number;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await recruitmentRepository.findJobById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Job opening not found.", 404);

  if (input.salaryMin !== undefined && input.salaryMax !== undefined && input.salaryMin > input.salaryMax) {
    throw new AuthorizationError("Salary minimum cannot exceed maximum.", 400);
  }

  const job = await recruitmentRepository.updateJob(ctx.tenantId, id, { ...input, updatedBy: ctx.userId });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Job opening updated",
    resourceType: "JobOpening",
    resourceId: id,
    resourceName: existing.title,
    details: { changes: Object.keys(input) },
  });

  return job;
}

export async function closeJob(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await recruitmentRepository.findJobById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Job opening not found.", 404);

  await recruitmentRepository.softDeleteJob(ctx.tenantId, id, ctx.userId, reason);

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Job opening closed",
    resourceType: "JobOpening",
    resourceId: id,
    resourceName: existing.title,
    details: reason ? { reason } : undefined,
  });

  return { ok: true };
}

export async function reopenJob(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await recruitmentRepository.findJobById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Job opening not found.", 404);

  const job = await prisma.jobOpening.update({
    where: { id },
    data: { deletedAt: null, deletedBy: null, deletionReason: null, updatedBy: ctx.userId },
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Job opening reopened",
    resourceType: "JobOpening",
    resourceId: id,
    resourceName: existing.title,
  });

  return job;
}

// ── Candidates ──

export async function listCandidates(options?: CandidateListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const tenantId = options?.tenantId ?? ctx.tenantId;
  const candidates = await recruitmentRepository.findCandidates(tenantId, options);
  const total = await recruitmentRepository.countCandidates(tenantId, options?.filters);

  return {
    data: candidates,
    total,
    skip: options?.skip ?? 0,
    take: options?.take ?? 25,
  };
}

export async function updateCandidateStage(id: string, stage: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const candidate = await recruitmentRepository.findCandidateById(ctx.tenantId, id);
  if (!candidate) throw new AuthorizationError("Candidate not found.", 404);

  const transitionError = validateStageTransition(candidate.status, stage);
  if (transitionError) throw new AuthorizationError(transitionError, 400);

  const updated = await recruitmentRepository.updateCandidate(ctx.tenantId, id, {
    stage,
    status: stage,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Candidate stage updated",
    resourceType: "Candidate",
    resourceId: id,
    resourceName: `${candidate.firstName} ${candidate.lastName}`,
    details: { from: candidate.status, to: stage },
  });

  return updated;
}

// ── Interviews ──

export async function listInterviews(options?: InterviewListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const tenantId = options?.tenantId ?? ctx.tenantId;
  const interviews = await recruitmentRepository.findInterviews(tenantId, options);
  const total = await recruitmentRepository.countInterviews(tenantId, options?.filters);

  return {
    data: interviews,
    total,
    skip: options?.skip ?? 0,
    take: options?.take ?? 25,
  };
}

export async function scheduleInterview(input: {
  organizationId?: string;
  candidateId: string;
  jobOpeningId: string;
  interviewers: string[];
  type: string;
  scheduledAt: string;
  durationMin?: number;
  location?: string;
  meetingLink?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.candidateId, "candidateId"),
    validateRequired(input.jobOpeningId, "jobOpeningId"),
    validateRequired(input.type, "type"),
    validateRequired(input.scheduledAt, "scheduledAt"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const organizationId = await resolveOrganizationId(ctx, input.organizationId);

  const interview = await recruitmentRepository.createInterview({
    organizationId,
    tenantId: ctx.tenantId,
    candidateId: input.candidateId,
    jobOpeningId: input.jobOpeningId,
    interviewers: input.interviewers,
    type: input.type,
    scheduledAt: new Date(input.scheduledAt),
    durationMin: input.durationMin,
    location: input.location,
    meetingLink: input.meetingLink,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Interview scheduled",
    resourceType: "Interview",
    resourceId: interview.id,
  });

  return interview;
}

export async function updateInterviewStatus(id: string, status: string, feedback?: string, rating?: number) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await recruitmentRepository.findInterviewById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Interview not found.", 404);

  const updated = await recruitmentRepository.updateInterview(ctx.tenantId, id, {
    status,
    feedback,
    rating,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Interview status updated",
    resourceType: "Interview",
    resourceId: id,
    details: { status, feedback, rating },
  });

  return updated;
}

// ── Offers ──

export async function listOffers(options?: OfferListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const tenantId = options?.tenantId ?? ctx.tenantId;
  const offers = await recruitmentRepository.findOffers(tenantId, options);
  const total = await recruitmentRepository.countOffers(tenantId, options?.filters);

  return {
    data: offers,
    total,
    skip: options?.skip ?? 0,
    take: options?.take ?? 25,
  };
}

export async function createOffer(input: {
  organizationId?: string;
  candidateId: string;
  jobOpeningId: string;
  salaryOffered?: number;
  benefits?: string;
  offerLetterUrl?: string;
  expiryDate?: string;
  notes?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.candidateId, "candidateId"),
    validateRequired(input.jobOpeningId, "jobOpeningId"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const candidate = await recruitmentRepository.findCandidateById(ctx.tenantId, input.candidateId);
  if (!candidate) throw new AuthorizationError("Candidate not found.", 404);
  if (candidate.status !== "OFFERED") {
    throw new AuthorizationError("Candidate must be in OFFERED stage to create an offer.", 400);
  }

  if (input.salaryOffered !== undefined && input.salaryOffered <= 0) {
    throw new AuthorizationError("Offered salary must be positive.", 400);
  }

  const organizationId = await resolveOrganizationId(ctx, input.organizationId);

  const offer = await recruitmentRepository.createOffer({
    organizationId,
    tenantId: ctx.tenantId,
    candidateId: input.candidateId,
    jobOpeningId: input.jobOpeningId,
    salaryOffered: input.salaryOffered,
    benefits: input.benefits,
    offerLetterUrl: input.offerLetterUrl,
    expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
    notes: input.notes,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Offer created",
    resourceType: "Offer",
    resourceId: offer.id,
  });

  return offer;
}

export async function updateOfferStatus(id: string, status: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await recruitmentRepository.findOfferById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Offer not found.", 404);

  const now = new Date();
  const updateData: Record<string, unknown> = { status, updatedBy: ctx.userId };

  if (status === "SENT") updateData.sentAt = now;
  if (status === "ACCEPTED" || status === "DECLINED") updateData.respondedAt = now;

  const updated = await recruitmentRepository.updateOffer(ctx.tenantId, id, updateData as Parameters<typeof recruitmentRepository.updateOffer>[2]);

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Offer status updated",
    resourceType: "Offer",
    resourceId: id,
    details: { status },
  });

  return updated;
}

// ── Reports ──

export async function getHiringFunnel() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const candidatesByStage = await recruitmentRepository.getCandidatesByStage(ctx.tenantId);
  const stages = ["APPLIED", "SCREENING", "SHORTLISTED", "INTERVIEW_SCHEDULED", "INTERVIEWED", "OFFERED", "HIRED", "REJECTED", "WITHDRAWN"];
  return stages.map((stage) => ({ stage, count: candidatesByStage[stage] ?? 0 }));
}

export async function getTimeToHire() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return { averageDays: await recruitmentRepository.getAvgTimeToHire(ctx.tenantId) };
}

export async function getSourceEffectiveness() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return recruitmentRepository.getSourceEffectiveness(ctx.tenantId);
}

export async function getOfferAcceptanceRate() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const [accepted, sent] = await Promise.all([
    prisma.offer.count({ where: { tenantId: ctx.tenantId, deletedAt: null, status: "ACCEPTED" } }),
    prisma.offer.count({ where: { tenantId: ctx.tenantId, deletedAt: null, status: { in: ["SENT", "ACCEPTED", "DECLINED"] } } }),
  ]);

  return sent > 0 ? Math.round((accepted / sent) * 100) : 0;
}

export async function getDepartmentHiring() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return recruitmentRepository.getDepartmentHiring(ctx.tenantId);
}

export async function getMonthlyActivity(year?: number) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return recruitmentRepository.getMonthlyActivity(ctx.tenantId, year);
}
