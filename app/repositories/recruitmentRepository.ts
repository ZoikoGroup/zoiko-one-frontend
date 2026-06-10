import { prisma } from "@/lib/prisma";

// ── Types ────────────────────────────────────────────────

export type JobFilters = {
  search?: string;
  status?: string;
  departmentId?: string;
};

export type JobListOptions = {
  filters?: JobFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateJobInput = {
  organizationId: string;
  tenantId: string;
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
  createdBy?: string;
};

export type UpdateJobInput = {
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
  updatedBy?: string;
};

export type CandidateFilters = {
  search?: string;
  stage?: string;
  status?: string;
  jobOpeningId?: string;
};

export type CandidateListOptions = {
  filters?: CandidateFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type UpdateCandidateInput = {
  stage?: string;
  status?: string;
  rating?: number;
  notes?: string;
  updatedBy?: string;
};

export type InterviewFilters = {
  search?: string;
  status?: string;
  candidateId?: string;
  jobOpeningId?: string;
};

export type InterviewListOptions = {
  filters?: InterviewFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateInterviewInput = {
  organizationId: string;
  tenantId: string;
  candidateId: string;
  jobOpeningId: string;
  interviewers: string[];
  type: string;
  scheduledAt: Date;
  durationMin?: number;
  location?: string;
  meetingLink?: string;
  createdBy?: string;
};

export type UpdateInterviewInput = {
  status?: string;
  feedback?: string;
  rating?: number;
  updatedBy?: string;
};

export type OfferFilters = {
  search?: string;
  status?: string;
  candidateId?: string;
  jobOpeningId?: string;
};

export type OfferListOptions = {
  filters?: OfferFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateOfferInput = {
  organizationId: string;
  tenantId: string;
  candidateId: string;
  jobOpeningId: string;
  salaryOffered?: number;
  benefits?: string;
  offerLetterUrl?: string;
  expiryDate?: Date;
  notes?: string;
  createdBy?: string;
};

export type UpdateOfferInput = {
  status?: string;
  salaryOffered?: number;
  benefits?: string;
  offerLetterUrl?: string;
  sentAt?: Date;
  respondedAt?: Date;
  expiryDate?: Date;
  notes?: string;
  updatedBy?: string;
};

// ── Repository ───────────────────────────────────────────

export class RecruitmentRepository {
  // ── Dashboard ──

  async getDashboardStats(tenantId: string) {
    const [totalOpenings, activeJobs, totalCandidates, candidatesByStage, upcomingInterviewsCount, offersThisMonth, timeToHireAvg] = await Promise.all([
      prisma.jobOpening.count({ where: { tenantId, deletedAt: null } }),
      prisma.jobOpening.count({ where: { tenantId, deletedAt: null, status: "OPEN" } }),
      prisma.candidate.count({ where: { tenantId, deletedAt: null } }),
      this.getCandidatesByStage(tenantId),
      prisma.interview.count({ where: { tenantId, deletedAt: null, status: "SCHEDULED" } }),
      prisma.offer.count({
        where: { tenantId, deletedAt: null, createdAt: { gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1) } },
      }),
      this.getAvgTimeToHire(tenantId),
    ]);

    const totalOffersAccepted = await prisma.offer.count({ where: { tenantId, deletedAt: null, status: "ACCEPTED" } });
    const totalOffersSent = await prisma.offer.count({ where: { tenantId, deletedAt: null, status: { in: ["SENT", "ACCEPTED", "DECLINED"] } } });

    return {
      totalOpenings,
      activeJobs,
      totalCandidates,
      candidatesByStage,
      upcomingInterviews: upcomingInterviewsCount,
      offersThisMonth,
      timeToHireAvg,
      hiringSuccessRate: totalOffersSent > 0 ? Math.round((totalOffersAccepted / totalOffersSent) * 100) : 0,
    };
  }

  // ── Jobs ──

  countJobs(tenantId: string, filters?: JobFilters) {
    return prisma.jobOpening.count({ where: this.buildJobWhere(tenantId, filters) });
  }

  findJobs(tenantId: string, options?: JobListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "createdAt", orderDir = "desc" } = options ?? {};
    return prisma.jobOpening.findMany({
      where: this.buildJobWhere(tenantId, filters),
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
      include: { department: { select: { id: true, name: true, code: true } } },
    });
  }

  findJobById(tenantId: string, id: string) {
    return prisma.jobOpening.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        department: { select: { id: true, name: true, code: true } },
        _count: { select: { candidates: true, interviews: true, offers: true } },
      },
    });
  }

  createJob(input: CreateJobInput) {
    return prisma.jobOpening.create({
      data: {
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        title: input.title,
        departmentId: input.departmentId,
        location: input.location,
        employmentType: input.employmentType ?? "FULL_TIME",
        minExperience: input.minExperience,
        maxExperience: input.maxExperience,
        salaryMin: input.salaryMin,
        salaryMax: input.salaryMax,
        description: input.description,
        requirements: input.requirements,
        responsibilities: input.responsibilities,
        status: input.status ?? "DRAFT",
        openingsCount: input.openingsCount ?? 1,
        createdBy: input.createdBy,
      },
    });
  }

  updateJob(tenantId: string, id: string, input: UpdateJobInput) {
    return prisma.jobOpening.update({
      where: { id },
      data: {
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
        updatedBy: input.updatedBy,
      },
    });
  }

  softDeleteJob(tenantId: string, id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.jobOpening.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  }

  // ── Candidates ──

  countCandidates(tenantId: string, filters?: CandidateFilters) {
    return prisma.candidate.count({ where: this.buildCandidateWhere(tenantId, filters) });
  }

  findCandidates(tenantId: string, options?: CandidateListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "appliedDate", orderDir = "desc" } = options ?? {};
    return prisma.candidate.findMany({
      where: this.buildCandidateWhere(tenantId, filters),
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
      include: {
        jobOpening: { select: { id: true, title: true, department: { select: { name: true } } } },
      },
    });
  }

  findCandidateById(tenantId: string, id: string) {
    return prisma.candidate.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        jobOpening: { select: { id: true, title: true, department: { select: { name: true } } } },
        interviews: { orderBy: { scheduledAt: "desc" } },
        offers: { orderBy: { createdAt: "desc" } },
      },
    });
  }

  findCandidateByEmail(tenantId: string, organizationId: string, email: string, excludeId?: string) {
    return prisma.candidate.findFirst({
      where: {
        tenantId, organizationId, email, deletedAt: null,
        ...(excludeId ? { id: { not: excludeId } } : {}),
      },
    });
  }

  createCandidate(data: {
    organizationId: string; tenantId: string; jobOpeningId: string;
    firstName: string; lastName: string; email: string;
    phone?: string; resumeUrl?: string; coverLetter?: string;
    source?: string; notes?: string; createdBy?: string;
  }) {
    return prisma.candidate.create({ data });
  }

  updateCandidate(tenantId: string, id: string, input: UpdateCandidateInput) {
    return prisma.candidate.update({
      where: { id },
      data: {
        status: input.status,
        rating: input.rating,
        notes: input.notes,
        updatedBy: input.updatedBy,
      },
    });
  }

  // ── Interviews ──

  countInterviews(tenantId: string, filters?: InterviewFilters) {
    return prisma.interview.count({ where: this.buildInterviewWhere(tenantId, filters) });
  }

  findInterviews(tenantId: string, options?: InterviewListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "scheduledAt", orderDir = "desc" } = options ?? {};
    return prisma.interview.findMany({
      where: this.buildInterviewWhere(tenantId, filters),
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true } },
        jobOpening: { select: { id: true, title: true } },
      },
    });
  }

  findInterviewById(tenantId: string, id: string) {
    return prisma.interview.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
        jobOpening: { select: { id: true, title: true } },
      },
    });
  }

  createInterview(input: CreateInterviewInput) {
    return prisma.interview.create({ data: input });
  }

  updateInterview(tenantId: string, id: string, input: UpdateInterviewInput) {
    return prisma.interview.update({
      where: { id },
      data: {
        status: input.status,
        feedback: input.feedback,
        rating: input.rating,
        updatedBy: input.updatedBy,
      },
    });
  }

  // ── Offers ──

  countOffers(tenantId: string, filters?: OfferFilters) {
    return prisma.offer.count({ where: this.buildOfferWhere(tenantId, filters) });
  }

  findOffers(tenantId: string, options?: OfferListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "createdAt", orderDir = "desc" } = options ?? {};
    return prisma.offer.findMany({
      where: this.buildOfferWhere(tenantId, filters),
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true } },
        jobOpening: { select: { id: true, title: true } },
      },
    });
  }

  findOfferById(tenantId: string, id: string) {
    return prisma.offer.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        candidate: { select: { id: true, firstName: true, lastName: true, email: true } },
        jobOpening: { select: { id: true, title: true } },
      },
    });
  }

  createOffer(input: CreateOfferInput) {
    return prisma.offer.create({ data: input });
  }

  updateOffer(tenantId: string, id: string, input: UpdateOfferInput) {
    return prisma.offer.update({
      where: { id },
      data: {
        status: input.status,
        salaryOffered: input.salaryOffered,
        benefits: input.benefits,
        offerLetterUrl: input.offerLetterUrl,
        sentAt: input.sentAt,
        respondedAt: input.respondedAt,
        expiryDate: input.expiryDate,
        notes: input.notes,
        updatedBy: input.updatedBy,
      },
    });
  }

  // ── Reports ──

  async getCandidatesByStage(tenantId: string) {
    const stages = ["APPLIED", "SCREENING", "SHORTLISTED", "INTERVIEW_SCHEDULED", "INTERVIEWED", "OFFERED", "HIRED", "REJECTED", "WITHDRAWN"];
    const results = await Promise.all(
      stages.map((stage) =>
        prisma.candidate.count({ where: { tenantId, deletedAt: null, status: stage } })
      ),
    );
    const map: Record<string, number> = {};
    stages.forEach((stage, i) => { map[stage] = results[i]; });
    return map;
  }

  async getAvgTimeToHire(tenantId: string) {
    const hired = await prisma.candidate.findMany({
      where: { tenantId, deletedAt: null, status: "HIRED" },
      select: { appliedDate: true, updatedAt: true },
    });
    if (hired.length === 0) return 0;
    const totalDays = hired.reduce((sum, c) => {
      return sum + Math.round((c.updatedAt.getTime() - c.appliedDate.getTime()) / (1000 * 60 * 60 * 24));
    }, 0);
    return Math.round(totalDays / hired.length);
  }

  async getSourceEffectiveness(tenantId: string) {
    const candidates = await prisma.candidate.findMany({
      where: { tenantId, deletedAt: null },
      select: { source: true, status: true },
    });
    const sourceMap = new Map<string, { total: number; hired: number }>();
    for (const c of candidates) {
      const source = c.source ?? "OTHER";
      const entry = sourceMap.get(source) ?? { total: 0, hired: 0 };
      entry.total++;
      if (c.status === "HIRED") entry.hired++;
      sourceMap.set(source, entry);
    }
    return Array.from(sourceMap.entries()).map(([source, { total, hired }]) => ({
      source,
      candidates: total,
      hired,
      conversionRate: total > 0 ? Math.round((hired / total) * 100 * 10) / 10 : 0,
    }));
  }

  async getMonthlyActivity(tenantId: string, year?: number) {
    const y = year ?? new Date().getFullYear();
    const months = Array.from({ length: 12 }, (_, i) => new Date(y, i, 1));
    const results = await Promise.all(
      months.map(async (monthStart) => {
        const monthEnd = new Date(monthStart.getFullYear(), monthStart.getMonth() + 1, 0);
        const [applications, interviews, offers] = await Promise.all([
          prisma.candidate.count({ where: { tenantId, deletedAt: null, appliedDate: { gte: monthStart, lte: monthEnd } } }),
          prisma.interview.count({ where: { tenantId, deletedAt: null, createdAt: { gte: monthStart, lte: monthEnd } } }),
          prisma.offer.count({ where: { tenantId, deletedAt: null, createdAt: { gte: monthStart, lte: monthEnd } } }),
        ]);
        return { month: monthStart.toLocaleString("en-US", { month: "short" }), applications, interviews, offers };
      }),
    );
    return results;
  }

  async getDepartmentHiring(tenantId: string) {
    const hired = await prisma.candidate.findMany({
      where: { tenantId, deletedAt: null, status: "HIRED" },
      include: { jobOpening: { select: { department: { select: { name: true } } } } },
    });
    const deptMap = new Map<string, number>();
    for (const c of hired) {
      const name = c.jobOpening.department.name;
      deptMap.set(name, (deptMap.get(name) ?? 0) + 1);
    }
    return Array.from(deptMap.entries()).map(([department, hires]) => ({ department, hires }));
  }

  // ── Where Builders ──

  private buildJobWhere(tenantId: string, filters?: JobFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { department: { name: { contains: filters.search, mode: "insensitive" } } },
        { location: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.status) where.status = filters.status;
    if (filters?.departmentId) where.departmentId = filters.departmentId;
    return where;
  }

  private buildCandidateWhere(tenantId: string, filters?: CandidateFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters?.stage) where.status = filters.stage;
    if (filters?.status) where.status = filters.status;
    if (filters?.jobOpeningId) where.jobOpeningId = filters.jobOpeningId;
    return where;
  }

  private buildInterviewWhere(tenantId: string, filters?: InterviewFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { candidate: { firstName: { contains: filters.search, mode: "insensitive" } } },
        { candidate: { lastName: { contains: filters.search, mode: "insensitive" } } },
        { jobOpening: { title: { contains: filters.search, mode: "insensitive" } } },
      ];
    }
    if (filters?.status) where.status = filters.status;
    if (filters?.candidateId) where.candidateId = filters.candidateId;
    if (filters?.jobOpeningId) where.jobOpeningId = filters.jobOpeningId;
    return where;
  }

  private buildOfferWhere(tenantId: string, filters?: OfferFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (filters?.search) {
      where.OR = [
        { candidate: { firstName: { contains: filters.search, mode: "insensitive" } } },
        { candidate: { lastName: { contains: filters.search, mode: "insensitive" } } },
        { jobOpening: { title: { contains: filters.search, mode: "insensitive" } } },
      ];
    }
    if (filters?.status) where.status = filters.status;
    if (filters?.candidateId) where.candidateId = filters.candidateId;
    if (filters?.jobOpeningId) where.jobOpeningId = filters.jobOpeningId;
    return where;
  }
}

export const recruitmentRepository = new RecruitmentRepository();
