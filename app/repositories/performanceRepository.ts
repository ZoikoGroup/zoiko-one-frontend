import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export interface PaginationOptions {
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
}

export interface CycleFilters {
  search?: string;
  status?: string;
  type?: string;
}

export interface GoalFilters {
  search?: string;
  status?: string;
  progressStatus?: string;
  employeeId?: string;
  category?: string;
  goalType?: string;
  managerId?: string;
}

export interface ReviewFilters {
  search?: string;
  status?: string;
  employeeId?: string;
  cycleId?: string;
  reviewerId?: string;
}

export interface FeedbackFilters {
  search?: string;
  employeeId?: string;
  giverId?: string;
  type?: string;
}

function buildCycleWhere(tenantId: string, organizationId: string, filters?: CycleFilters) {
  const where: Prisma.PerformanceCycleWhereInput = { tenantId, organizationId, deletedAt: null };
  if (filters?.search) {
    where.name = { contains: filters.search };
  }
  if (filters?.status) where.status = filters.status as never;
  if (filters?.type) where.type = filters.type as never;
  return where;
}

function buildGoalWhere(tenantId: string, organizationId: string, filters?: GoalFilters) {
  const where: Prisma.GoalWhereInput = { tenantId, organizationId, deletedAt: null };
  if (filters?.search) {
    where.title = { contains: filters.search };
  }
  if (filters?.status) where.status = filters.status as never;
  if (filters?.progressStatus) where.progressStatus = filters.progressStatus as never;
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.category) where.category = filters.category as never;
  if (filters?.goalType) where.goalType = filters.goalType as never;
  if (filters?.managerId) where.managerId = filters.managerId;
  return where;
}

function buildReviewWhere(tenantId: string, organizationId: string, filters?: ReviewFilters) {
  const where: Prisma.PerformanceReviewWhereInput = { tenantId, organizationId, deletedAt: null };
  if (filters?.search) {
    where.employee = {
      OR: [
        { firstName: { contains: filters.search } },
        { lastName: { contains: filters.search } },
        { employeeId: { contains: filters.search } },
      ],
    };
  }
  if (filters?.status) where.status = filters.status as never;
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.cycleId) where.cycleId = filters.cycleId;
  if (filters?.reviewerId) where.reviewerId = filters.reviewerId;
  return where;
}

function buildFeedbackWhere(tenantId: string, organizationId: string, filters?: FeedbackFilters) {
  const where: Prisma.FeedbackWhereInput = { tenantId, organizationId, deletedAt: null };
  if (filters?.search) {
    where.content = { contains: filters.search };
  }
  if (filters?.employeeId) where.employeeId = filters.employeeId;
  if (filters?.giverId) where.giverId = filters.giverId;
  if (filters?.type) where.type = filters.type as never;
  return where;
}

export const performanceRepository = {
  // ── Performance Cycles ──
  async findCycles(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: CycleFilters }) {
    const where = buildCycleWhere(tenantId, organizationId, options?.filters);
    const orderBy: Prisma.PerformanceCycleOrderByWithRelationInput = {};
    if (options?.orderBy) {
      orderBy[options.orderBy as keyof Prisma.PerformanceCycleOrderByWithRelationInput] = options.orderDir ?? "desc";
    } else {
      orderBy.startDate = "desc";
    }
    return prisma.performanceCycle.findMany({
      where,
      orderBy,
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
    });
  },

  async countCycles(tenantId: string, organizationId: string, filters?: CycleFilters) {
    return prisma.performanceCycle.count({ where: buildCycleWhere(tenantId, organizationId, filters) });
  },

  async findCycleById(tenantId: string, organizationId: string, id: string) {
    return prisma.performanceCycle.findFirst({
      where: { id, tenantId, organizationId, deletedAt: null },
      include: {
        selfReviews: { where: { deletedAt: null } },
        managerReviews: { where: { deletedAt: null } },
        peerReviews: { where: { deletedAt: null } },
      },
    });
  },

  async createCycle(data: {
    name: string; description?: string; type?: string;
    startDate: Date; endDate: Date; status?: string;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.performanceCycle.create({
      data: {
        ...data,
        type: (data.type ?? "ANNUAL") as never,
        status: (data.status ?? "DRAFT") as never,
      },
    });
  },

  async updateCycle(id: string, data: {
    name?: string; description?: string; type?: string;
    startDate?: Date; endDate?: Date; status?: string; updatedBy?: string;
  }) {
    return prisma.performanceCycle.update({
      where: { id },
      data: {
        ...data,
        type: data.type as never,
        status: data.status as never,
      },
    });
  },

  async softDeleteCycle(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.performanceCycle.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Review Templates ──
  async findTemplates(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: { search?: string } }) {
    const where: Prisma.ReviewTemplateWhereInput = { tenantId, organizationId, deletedAt: null };
    if (options?.filters?.search) {
      where.name = { contains: options.filters.search };
    }
    return prisma.reviewTemplate.findMany({
      where,
      include: { questions: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } } },
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      orderBy: { createdAt: "desc" },
    });
  },

  async countTemplates(tenantId: string, organizationId: string) {
    return prisma.reviewTemplate.count({ where: { tenantId, organizationId, deletedAt: null } });
  },

  async findTemplateById(tenantId: string, organizationId: string, id: string) {
    return prisma.reviewTemplate.findFirst({
      where: { id, tenantId, organizationId, deletedAt: null },
      include: { questions: { where: { deletedAt: null }, orderBy: { sortOrder: "asc" } } },
    });
  },

  async createTemplate(data: {
    name: string; description?: string; type?: string;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.reviewTemplate.create({ data });
  },

  async updateTemplate(id: string, data: {
    name?: string; description?: string; type?: string; isActive?: boolean; updatedBy?: string;
  }) {
    return prisma.reviewTemplate.update({ where: { id }, data });
  },

  async softDeleteTemplate(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.reviewTemplate.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Review Questions ──
  async createQuestion(data: {
    templateId: string; question: string; questionType?: string;
    weightage?: number; sortOrder?: number; isRequired?: boolean;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.reviewQuestion.create({ data });
  },

  async updateQuestion(id: string, data: {
    question?: string; questionType?: string; weightage?: number;
    sortOrder?: number; isRequired?: boolean; updatedBy?: string;
  }) {
    return prisma.reviewQuestion.update({ where: { id }, data });
  },

  async deleteQuestion(id: string) {
    return prisma.reviewQuestion.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },

  // ── Self Reviews ──
  async findSelfReviews(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: ReviewFilters }) {
    const where: Prisma.SelfReviewWhereInput = { tenantId, organizationId, deletedAt: null };
    if (options?.filters?.employeeId) where.employeeId = options.filters.employeeId;
    if (options?.filters?.cycleId) where.cycleId = options.filters.cycleId;
    if (options?.filters?.status) where.status = options.filters.status as never;
    return prisma.selfReview.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        cycle: { select: { id: true, name: true } },
      },
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      orderBy: { createdAt: "desc" },
    });
  },

  async countSelfReviews(tenantId: string, organizationId: string, filters?: ReviewFilters) {
    const where: Prisma.SelfReviewWhereInput = { tenantId, organizationId, deletedAt: null };
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.cycleId) where.cycleId = filters.cycleId;
    if (filters?.status) where.status = filters.status as never;
    return prisma.selfReview.count({ where });
  },

  async findSelfReviewById(tenantId: string, organizationId: string, id: string) {
    return prisma.selfReview.findFirst({
      where: { id, tenantId, organizationId, deletedAt: null },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, email: true } },
        cycle: { select: { id: true, name: true, startDate: true, endDate: true } },
      },
    });
  },

  async findSelfReviewByEmployeeAndCycle(tenantId: string, employeeId: string, cycleId: string) {
    return prisma.selfReview.findFirst({
      where: { tenantId, employeeId, cycleId, deletedAt: null },
    });
  },

  async createSelfReview(data: {
    employeeId: string; cycleId: string; comments?: string;
    achievements?: string; challenges?: string; rating?: number;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.selfReview.create({ data });
  },

  async updateSelfReview(id: string, data: {
    comments?: string; achievements?: string; challenges?: string;
    rating?: number; status?: string; submittedAt?: Date; updatedBy?: string;
  }) {
    return prisma.selfReview.update({
      where: { id },
      data: {
        ...data,
        status: data.status as never,
      },
    });
  },

  async softDeleteSelfReview(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.selfReview.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Manager Reviews ──
  async findManagerReviews(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: ReviewFilters }) {
    const where: Prisma.ManagerReviewWhereInput = { tenantId, organizationId, deletedAt: null };
    if (options?.filters?.employeeId) where.employeeId = options.filters.employeeId;
    if (options?.filters?.cycleId) where.cycleId = options.filters.cycleId;
    if (options?.filters?.reviewerId) where.managerId = options.filters.reviewerId;
    if (options?.filters?.status) where.status = options.filters.status as never;
    return prisma.managerReview.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        manager: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        cycle: { select: { id: true, name: true } },
      },
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      orderBy: { createdAt: "desc" },
    });
  },

  async countManagerReviews(tenantId: string, organizationId: string, filters?: ReviewFilters) {
    const where: Prisma.ManagerReviewWhereInput = { tenantId, organizationId, deletedAt: null };
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.cycleId) where.cycleId = filters.cycleId;
    if (filters?.reviewerId) where.managerId = filters.reviewerId;
    if (filters?.status) where.status = filters.status as never;
    return prisma.managerReview.count({ where });
  },

  async findManagerReviewById(tenantId: string, organizationId: string, id: string) {
    return prisma.managerReview.findFirst({
      where: { id, tenantId, organizationId, deletedAt: null },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, email: true } },
        manager: { select: { id: true, firstName: true, lastName: true, employeeId: true, email: true } },
        cycle: { select: { id: true, name: true, startDate: true, endDate: true } },
      },
    });
  },

  async findManagerReviewByEmployeeAndCycle(tenantId: string, employeeId: string, managerId: string, cycleId: string) {
    return prisma.managerReview.findFirst({
      where: { tenantId, employeeId, managerId, cycleId, deletedAt: null },
    });
  },

  async createManagerReview(data: {
    employeeId: string; managerId: string; cycleId: string;
    comments?: string; strengths?: string; improvements?: string; rating?: number;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.managerReview.create({ data });
  },

  async updateManagerReview(id: string, data: {
    comments?: string; strengths?: string; improvements?: string;
    rating?: number; status?: string; submittedAt?: Date; updatedBy?: string;
  }) {
    return prisma.managerReview.update({
      where: { id },
      data: { ...data, status: data.status as never },
    });
  },

  async softDeleteManagerReview(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.managerReview.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Peer Reviews ──
  async findPeerReviews(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: ReviewFilters }) {
    const where: Prisma.PeerReviewWhereInput = { tenantId, organizationId, deletedAt: null };
    if (options?.filters?.employeeId) where.employeeId = options.filters.employeeId;
    if (options?.filters?.cycleId) where.cycleId = options.filters.cycleId;
    if (options?.filters?.reviewerId) where.reviewerId = options.filters.reviewerId;
    if (options?.filters?.status) where.status = options.filters.status as never;
    return prisma.peerReview.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        cycle: { select: { id: true, name: true } },
      },
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      orderBy: { createdAt: "desc" },
    });
  },

  async countPeerReviews(tenantId: string, organizationId: string, filters?: ReviewFilters) {
    const where: Prisma.PeerReviewWhereInput = { tenantId, organizationId, deletedAt: null };
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.cycleId) where.cycleId = filters.cycleId;
    if (filters?.reviewerId) where.reviewerId = filters.reviewerId;
    if (filters?.status) where.status = filters.status as never;
    return prisma.peerReview.count({ where });
  },

  async findPeerReviewById(tenantId: string, organizationId: string, id: string) {
    return prisma.peerReview.findFirst({
      where: { id, tenantId, organizationId, deletedAt: null },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        cycle: { select: { id: true, name: true, startDate: true, endDate: true } },
      },
    });
  },

  async createPeerReview(data: {
    reviewerId: string; employeeId: string; cycleId: string;
    comments?: string; strengths?: string; improvements?: string;
    rating?: number; isAnonymous?: boolean; isRequested?: boolean;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.peerReview.create({ data });
  },

  async updatePeerReview(id: string, data: {
    comments?: string; strengths?: string; improvements?: string;
    rating?: number; isAnonymous?: boolean; status?: string;
    submittedAt?: Date; updatedBy?: string;
  }) {
    return prisma.peerReview.update({
      where: { id },
      data: { ...data, status: data.status as never },
    });
  },

  async softDeletePeerReview(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.peerReview.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Performance Reviews (Legacy) ──
  async findReviews(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: ReviewFilters }) {
    const where = buildReviewWhere(tenantId, organizationId, options?.filters);
    const orderBy: Prisma.PerformanceReviewOrderByWithRelationInput = {};
    if (options?.orderBy) {
      orderBy[options.orderBy as keyof Prisma.PerformanceReviewOrderByWithRelationInput] = options.orderDir ?? "desc";
    } else {
      orderBy.createdAt = "desc";
    }
    return prisma.performanceReview.findMany({
      where,
      orderBy,
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        cycle: { select: { id: true, name: true } },
      },
    });
  },

  async countReviews(tenantId: string, organizationId: string, filters?: ReviewFilters) {
    return prisma.performanceReview.count({ where: buildReviewWhere(tenantId, organizationId, filters) });
  },

  async findReviewById(tenantId: string, organizationId: string, id: string) {
    return prisma.performanceReview.findFirst({
      where: { id, tenantId, organizationId, deletedAt: null },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, email: true } },
        reviewer: { select: { id: true, firstName: true, lastName: true, employeeId: true, email: true } },
        cycle: { select: { id: true, name: true, startDate: true, endDate: true } },
      },
    });
  },

  async findReviewByEmployeeAndCycle(tenantId: string, employeeId: string, cycleId: string) {
    return prisma.performanceReview.findFirst({
      where: { tenantId, employeeId, cycleId, deletedAt: null },
    });
  },

  async createReview(data: {
    employeeId: string; reviewerId?: string; cycleId: string;
    overallRating?: number; status?: string; strengths?: string;
    improvements?: string; notes?: string; submittedAt?: Date;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.performanceReview.create({
      data: {
        ...data,
        status: (data.status ?? "DRAFT") as never,
      },
    });
  },

  async updateReview(id: string, data: {
    reviewerId?: string; overallRating?: number; status?: string;
    strengths?: string; improvements?: string; notes?: string;
    submittedAt?: Date; acknowledgedAt?: Date; updatedBy?: string;
  }) {
    return prisma.performanceReview.update({
      where: { id },
      data: {
        ...data,
        status: data.status as never,
      },
    });
  },

  async softDeleteReview(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.performanceReview.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Goal Updates ──
  async createGoalUpdate(data: {
    goalId: string; updateText: string;
    previousProgress?: number; newProgress?: number;
    tenantId: string; createdBy?: string;
  }) {
    return prisma.goalUpdate.create({ data });
  },

  // ── Goals ──
  async findGoals(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: GoalFilters }) {
    const where = buildGoalWhere(tenantId, organizationId, options?.filters);
    const orderBy: Prisma.GoalOrderByWithRelationInput = {};
    if (options?.orderBy) {
      orderBy[options.orderBy as keyof Prisma.GoalOrderByWithRelationInput] = options.orderDir ?? "desc";
    } else {
      orderBy.createdAt = "desc";
    }
    return prisma.goal.findMany({
      where,
      orderBy,
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        manager: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        updates: { orderBy: { createdAt: "desc" }, take: 3 },
        progressLogs: { orderBy: { createdAt: "desc" }, take: 5 },
      },
    });
  },

  async countGoals(tenantId: string, organizationId: string, filters?: GoalFilters) {
    return prisma.goal.count({ where: buildGoalWhere(tenantId, organizationId, filters) });
  },

  async findGoalById(tenantId: string, organizationId: string, id: string) {
    return prisma.goal.findFirst({
      where: { id, tenantId, organizationId, deletedAt: null },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        manager: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        updates: { orderBy: { createdAt: "desc" } },
        progressLogs: { orderBy: { createdAt: "desc" } },
      },
    });
  },

  async createGoal(data: {
    employeeId: string; managerId?: string; title: string; description?: string;
    goalType?: string; category?: string; weightage?: number;
    targetValue?: number; currentValue?: number; progressStatus?: string;
    startDate: Date; targetDate?: Date; status?: string; progress?: number;
    notes?: string;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.goal.create({
      data: {
        ...data,
        goalType: data.goalType as never,
        category: (data.category ?? "PERFORMANCE") as never,
        progressStatus: (data.progressStatus ?? "DRAFT") as never,
        status: data.status as never,
      },
    });
  },

  async updateGoal(id: string, data: {
    title?: string; description?: string; goalType?: string; category?: string;
    weightage?: number; targetValue?: number; currentValue?: number;
    progressStatus?: string; startDate?: Date; targetDate?: Date;
    completedDate?: Date; status?: string; progress?: number;
    notes?: string; managerId?: string; updatedBy?: string;
  }) {
    return prisma.goal.update({
      where: { id },
      data: {
        ...data,
        goalType: data.goalType as never,
        category: data.category as never,
        progressStatus: data.progressStatus as never,
        status: data.status as never,
      },
    });
  },

  async softDeleteGoal(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.goal.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Goal Progress ──
  async createGoalProgress(data: {
    goalId: string; progressValue?: number; progressText?: string;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.goalProgress.create({ data });
  },

  // ── Feedback ──
  async findFeedbacks(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: FeedbackFilters }) {
    const where = buildFeedbackWhere(tenantId, organizationId, options?.filters);
    const orderBy: Prisma.FeedbackOrderByWithRelationInput = {};
    if (options?.orderBy) {
      orderBy[options.orderBy as keyof Prisma.FeedbackOrderByWithRelationInput] = options.orderDir ?? "desc";
    } else {
      orderBy.createdAt = "desc";
    }
    return prisma.feedback.findMany({
      where,
      orderBy,
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        giver: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
    });
  },

  async countFeedbacks(tenantId: string, organizationId: string, filters?: FeedbackFilters) {
    return prisma.feedback.count({ where: buildFeedbackWhere(tenantId, organizationId, filters) });
  },

  async createFeedback(data: {
    employeeId: string; giverId?: string; type?: string;
    category?: string; content: string; isConfidential?: boolean;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.feedback.create({
      data: { ...data, type: (data.type ?? "PEER") as never },
    });
  },

  async softDeleteFeedback(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.feedback.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Ratings ──
  async findRatings(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: { employeeId?: string; cycleId?: string } }) {
    const where: Prisma.RatingWhereInput = { tenantId, organizationId, deletedAt: null };
    if (options?.filters?.employeeId) where.employeeId = options.filters.employeeId;
    if (options?.filters?.cycleId) where.cycleId = options.filters.cycleId;
    return prisma.rating.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        cycle: { select: { id: true, name: true } },
      },
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      orderBy: { createdAt: "desc" },
    });
  },

  async countRatings(tenantId: string, organizationId: string, filters?: { employeeId?: string; cycleId?: string }) {
    const where: Prisma.RatingWhereInput = { tenantId, organizationId, deletedAt: null };
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.cycleId) where.cycleId = filters.cycleId;
    return prisma.rating.count({ where });
  },

  async createRating(data: {
    employeeId: string; cycleId: string; rating: number;
    comments?: string; raterType?: string; raterId?: string;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.rating.create({ data });
  },

  async updateRating(id: string, data: {
    rating?: number; comments?: string; updatedBy?: string;
  }) {
    return prisma.rating.update({ where: { id }, data });
  },

  async softDeleteRating(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.rating.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Calibration Sessions ──
  async findCalibrationSessions(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: { cycleId?: string; status?: string } }) {
    const where: Prisma.CalibrationSessionWhereInput = { tenantId, organizationId, deletedAt: null };
    if (options?.filters?.cycleId) where.cycleId = options.filters.cycleId;
    if (options?.filters?.status) where.status = options.filters.status as never;
    return prisma.calibrationSession.findMany({
      where,
      include: {
        adjustments: { where: { deletedAt: null } },
        cycle: { select: { id: true, name: true } },
      },
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      orderBy: { createdAt: "desc" },
    });
  },

  async countCalibrationSessions(tenantId: string, organizationId: string, filters?: { cycleId?: string; status?: string }) {
    const where: Prisma.CalibrationSessionWhereInput = { tenantId, organizationId, deletedAt: null };
    if (filters?.cycleId) where.cycleId = filters.cycleId;
    if (filters?.status) where.status = filters.status as never;
    return prisma.calibrationSession.count({ where });
  },

  async findCalibrationSessionById(tenantId: string, organizationId: string, id: string) {
    return prisma.calibrationSession.findFirst({
      where: { id, tenantId, organizationId, deletedAt: null },
      include: {
        cycle: { select: { id: true, name: true, startDate: true, endDate: true } },
        adjustments: {
          where: { deletedAt: null },
          include: {
            employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
          },
        },
      },
    });
  },

  async createCalibrationSession(data: {
    name: string; description?: string; cycleId: string; status?: string;
    startDate?: Date; endDate?: Date; facilitatorId?: string;
    participants?: Prisma.InputJsonValue; notes?: string;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.calibrationSession.create({ data: { ...data, status: data.status as never } });
  },

  async updateCalibrationSession(id: string, data: {
    name?: string; description?: string; status?: string;
    startDate?: Date; endDate?: Date; facilitatorId?: string;
    participants?: Prisma.InputJsonValue; notes?: string; updatedBy?: string;
  }) {
    return prisma.calibrationSession.update({
      where: { id },
      data: { ...data, status: data.status as never },
    });
  },

  async softDeleteCalibrationSession(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.calibrationSession.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  // ── Rating Adjustments ──
  async createRatingAdjustment(data: {
    sessionId: string; employeeId: string;
    previousRating?: number; adjustedRating?: number;
    reason?: string; approvedBy?: string; approvedAt?: Date;
    organizationId: string; tenantId: string; createdBy?: string;
  }) {
    return prisma.ratingAdjustment.create({ data });
  },

  async updateRatingAdjustment(id: string, data: {
    adjustedRating?: number; reason?: string;
    approvedBy?: string; approvedAt?: Date; updatedBy?: string;
  }) {
    return prisma.ratingAdjustment.update({ where: { id }, data });
  },

  // ── Performance Audit ──
  async createAudit(data: {
    eventType: string; entityType: string; entityId: string;
    previousValue?: Prisma.InputJsonValue; newValue?: Prisma.InputJsonValue;
    performedBy?: string; notes?: string;
    organizationId: string; tenantId: string;
  }) {
    return prisma.performanceAudit.create({
      data: { ...data, eventType: data.eventType as never },
    });
  },

  async findAudits(tenantId: string, organizationId: string, options?: PaginationOptions & { filters?: { eventType?: string; entityType?: string; entityId?: string } }) {
    const where: Prisma.PerformanceAuditWhereInput = { tenantId, organizationId, deletedAt: null };
    if (options?.filters?.eventType) where.eventType = options.filters.eventType as never;
    if (options?.filters?.entityType) where.entityType = options.filters.entityType;
    if (options?.filters?.entityId) where.entityId = options.filters.entityId;
    return prisma.performanceAudit.findMany({
      where,
      skip: options?.skip ?? 0,
      take: options?.take ?? 50,
      orderBy: { performedAt: "desc" },
    });
  },

  // ── Dashboard Stats ──
  async getDashboardStats(tenantId: string, organizationId: string) {
    const now = new Date();

    const [activeCycles, totalReviews, pendingSelfReviews, completedSelfReviews,
      pendingManagerReviews, completedManagerReviews, totalGoals,
      completedGoals, inProgressGoals, overdueGoals, totalFeedbacks,
      recentAudits, averageRating] = await Promise.all([
      prisma.performanceCycle.count({ where: { tenantId, organizationId, status: "ACTIVE" as never, deletedAt: null } }),
      prisma.performanceReview.count({ where: { tenantId, organizationId, deletedAt: null } }),
      prisma.selfReview.count({ where: { tenantId, organizationId, status: "DRAFT" as never, deletedAt: null } }),
      prisma.selfReview.count({ where: { tenantId, organizationId, status: "SUBMITTED" as never, deletedAt: null } }),
      prisma.managerReview.count({ where: { tenantId, organizationId, status: "DRAFT" as never, deletedAt: null } }),
      prisma.managerReview.count({ where: { tenantId, organizationId, status: "SUBMITTED" as never, deletedAt: null } }),
      prisma.goal.count({ where: { tenantId, organizationId, deletedAt: null } }),
      prisma.goal.count({ where: { tenantId, organizationId, status: "COMPLETED" as never, deletedAt: null } }),
      prisma.goal.count({ where: { tenantId, organizationId, status: "IN_PROGRESS" as never, deletedAt: null } }),
      prisma.goal.count({ where: { tenantId, organizationId, progressStatus: "OVERDUE" as never, deletedAt: null } }),
      prisma.feedback.count({ where: { tenantId, organizationId, deletedAt: null } }),
      prisma.performanceAudit.findMany({
        where: { tenantId, organizationId, deletedAt: null },
        orderBy: { performedAt: "desc" },
        take: 10,
      }),
      prisma.rating.aggregate({
        where: { tenantId, organizationId, deletedAt: null },
        _avg: { rating: true },
      }),
    ]);

    return {
      activeCycles,
      totalReviews,
      pendingSelfReviews,
      completedSelfReviews,
      pendingManagerReviews,
      completedManagerReviews,
      reviewCompletionRate: totalReviews > 0
        ? Math.round(((completedSelfReviews + completedManagerReviews) / (totalReviews * 2)) * 100)
        : 0,
      totalGoals,
      completedGoals,
      inProgressGoals,
      overdueGoals,
      goalCompletionRate: totalGoals > 0 ? Math.round((completedGoals / totalGoals) * 100) : 0,
      totalFeedbacks,
      recentAudits,
      averageRating: averageRating._avg.rating ?? 0,
    };
  },

  // ── Manager Dashboard Stats ──
  async getManagerDashboardStats(tenantId: string, organizationId: string, managerId: string) {
    const directReports = await prisma.employee.findMany({
      where: { tenantId, organizationId, deletedAt: null },
      select: { id: true },
    });
    const reportIds = directReports.map((e) => e.id);

    const [pendingReviews, completedReviews, teamGoals, completedTeamGoals, teamRatings] = await Promise.all([
      prisma.managerReview.count({
        where: { tenantId, managerId, status: "DRAFT" as never, deletedAt: null },
      }),
      prisma.managerReview.count({
        where: { tenantId, managerId, status: "SUBMITTED" as never, deletedAt: null },
      }),
      prisma.goal.count({
        where: { tenantId, organizationId, employeeId: { in: reportIds }, deletedAt: null },
      }),
      prisma.goal.count({
        where: { tenantId, organizationId, employeeId: { in: reportIds }, status: "COMPLETED" as never, deletedAt: null },
      }),
      prisma.rating.aggregate({
        where: { tenantId, organizationId, employeeId: { in: reportIds }, deletedAt: null },
        _avg: { rating: true },
      }),
    ]);

    const highPerformers = await prisma.rating.findMany({
      where: { tenantId, organizationId, employeeId: { in: reportIds }, rating: { gte: 4 }, deletedAt: null },
      include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } } },
      distinct: ["employeeId"],
    });

    const atRiskEmployees = await prisma.goal.findMany({
      where: { tenantId, organizationId, employeeId: { in: reportIds }, progressStatus: "OVERDUE" as never, deletedAt: null },
      include: { employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } } },
      distinct: ["employeeId"],
    });

    return {
      pendingReviews,
      completedReviews,
      teamGoals,
      completedTeamGoals,
      teamGoalCompletionRate: teamGoals > 0 ? Math.round((completedTeamGoals / teamGoals) * 100) : 0,
      averageRating: teamRatings._avg.rating ?? 0,
      highPerformers: highPerformers.map((r) => r.employee),
      atRiskEmployees: atRiskEmployees.map((g) => g.employee),
      directReportCount: reportIds.length,
    };
  },

  // ── Reports ──
  async getPerformanceDistribution(tenantId: string, organizationId: string, cycleId?: string) {
    const where: Prisma.RatingWhereInput = { tenantId, organizationId, deletedAt: null };
    if (cycleId) where.cycleId = cycleId;
    const ratings = await prisma.rating.findMany({ where, select: { rating: true } });
    const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
    ratings.forEach((r) => { if (r.rating >= 1 && r.rating <= 5) distribution[r.rating as keyof typeof distribution]++; });
    return { distribution, total: ratings.length };
  },

  async getDepartmentPerformance(tenantId: string, organizationId: string, cycleId?: string) {
    const departments = await prisma.department.findMany({
      where: { tenantId, organizationId, deletedAt: null },
      select: {
        id: true, name: true, code: true,
        employmentRecords: {
          where: { deletedAt: null, expiresAt: null },
          select: { employeeId: true },
        },
      },
    });

    const result = [];
    for (const dept of departments) {
      const employeeIds = dept.employmentRecords.map((er) => er.employeeId);
      if (employeeIds.length === 0) continue;
      const ratingWhere: Prisma.RatingWhereInput = {
        tenantId, organizationId, employeeId: { in: employeeIds }, deletedAt: null,
      };
      if (cycleId) ratingWhere.cycleId = cycleId;
      const agg = await prisma.rating.aggregate({
        where: ratingWhere,
        _avg: { rating: true },
        _count: { rating: true },
      });
      result.push({
        departmentId: dept.id,
        departmentName: dept.name,
        departmentCode: dept.code,
        employeeCount: employeeIds.length,
        averageRating: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      });
    }
    return result;
  },

  async getReviewCompletionReport(tenantId: string, organizationId: string, cycleId?: string) {
    const cycleWhere: Prisma.PerformanceCycleWhereInput = { tenantId, organizationId, deletedAt: null };
    if (cycleId) cycleWhere.id = cycleId;
    const cycles = await prisma.performanceCycle.findMany({ where: cycleWhere, select: { id: true, name: true } });

    const result = [];
    for (const cycle of cycles) {
      const [totalEmployees, selfSubmitted, managerSubmitted, peerSubmitted] = await Promise.all([
        prisma.employee.count({ where: { tenantId, organizationId, deletedAt: null, status: "ACTIVE" as never } }),
        prisma.selfReview.count({ where: { tenantId, organizationId, cycleId: cycle.id, status: "SUBMITTED" as never, deletedAt: null } }),
        prisma.managerReview.count({ where: { tenantId, organizationId, cycleId: cycle.id, status: "SUBMITTED" as never, deletedAt: null } }),
        prisma.peerReview.count({ where: { tenantId, organizationId, cycleId: cycle.id, status: "SUBMITTED" as never, deletedAt: null } }),
      ]);
      result.push({
        cycleId: cycle.id,
        cycleName: cycle.name,
        totalEmployees,
        selfReviewsSubmitted: selfSubmitted,
        managerReviewsSubmitted: managerSubmitted,
        peerReviewsSubmitted: peerSubmitted,
        selfReviewCompletionRate: totalEmployees > 0 ? Math.round((selfSubmitted / totalEmployees) * 100) : 0,
        managerReviewCompletionRate: totalEmployees > 0 ? Math.round((managerSubmitted / totalEmployees) * 100) : 0,
      });
    }
    return result;
  },

  async getTopPerformers(tenantId: string, organizationId: string, cycleId?: string, limit = 10) {
    const where: Prisma.RatingWhereInput = { tenantId, organizationId, rating: { gte: 4 }, deletedAt: null };
    if (cycleId) where.cycleId = cycleId;
    return prisma.rating.findMany({
      where,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeId: true, email: true },
        },
        cycle: { select: { name: true } },
      },
      orderBy: { rating: "desc" },
      take: limit,
    });
  },

  async getGoalAchievementReport(tenantId: string, organizationId: string, options?: { departmentId?: string; cycleId?: string }) {
    const where: Prisma.GoalWhereInput = { tenantId, organizationId, deletedAt: null };
    if (options?.departmentId) {
      where.employee = { employmentRecords: { some: { departmentId: options.departmentId, deletedAt: null, expiresAt: null } } };
    }
    const goals = await prisma.goal.findMany({
      where,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        manager: { select: { id: true, firstName: true, lastName: true } },
      },
    });

    const total = goals.length;
    const completed = goals.filter((g) => g.status === "COMPLETED").length;
    const inProgress = goals.filter((g) => g.status === "IN_PROGRESS").length;
    const notStarted = goals.filter((g) => g.status === "NOT_STARTED").length;
    const overdue = goals.filter((g) => g.progressStatus === "OVERDUE").length;
    const cancelled = goals.filter((g) => g.status === "CANCELLED").length;

    const byCategory: Record<string, { total: number; completed: number }> = {};
    goals.forEach((g) => {
      const cat = g.category;
      if (!byCategory[cat]) byCategory[cat] = { total: 0, completed: 0 };
      byCategory[cat].total++;
      if (g.status === "COMPLETED") byCategory[cat].completed++;
    });

    return {
      total,
      completed,
      inProgress,
      notStarted,
      overdue,
      cancelled,
      completionRate: total > 0 ? Math.round((completed / total) * 100) : 0,
      byCategory,
      goals,
    };
  },

  async getPerformanceTrend(tenantId: string, organizationId: string) {
    const cycles = await prisma.performanceCycle.findMany({
      where: { tenantId, organizationId, deletedAt: null },
      orderBy: { startDate: "asc" },
      select: { id: true, name: true, startDate: true },
    });

    const trend = [];
    for (const cycle of cycles) {
      const agg = await prisma.rating.aggregate({
        where: { tenantId, organizationId, cycleId: cycle.id, deletedAt: null },
        _avg: { rating: true },
        _count: { rating: true },
      });
      trend.push({
        cycleId: cycle.id,
        cycleName: cycle.name,
        startDate: cycle.startDate,
        averageRating: agg._avg.rating ?? 0,
        ratingCount: agg._count.rating,
      });
    }
    return trend;
  },
};
