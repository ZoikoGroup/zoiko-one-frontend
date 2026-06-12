import { prisma } from "@/lib/prisma";

export type LeaveTypeFilters = {
  search?: string;
  category?: string;
  isActive?: string;
};

export type LeaveTypeListOptions = {
  filters?: LeaveTypeFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateLeaveTypeInput = {
  organizationId: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  category: string;
  maxDaysPerYear?: number;
  minDaysRequired?: number;
  requiresApproval?: boolean;
  requiresMedicalCert?: boolean;
  attachmentRequired?: boolean;
  createdBy?: string;
};

export type UpdateLeaveTypeInput = {
  name?: string;
  code?: string;
  description?: string;
  category?: string;
  maxDaysPerYear?: number;
  minDaysRequired?: number;
  requiresApproval?: boolean;
  requiresMedicalCert?: boolean;
  attachmentRequired?: boolean;
  isActive?: boolean;
  updatedBy?: string;
};

export type LeaveRequestFilters = {
  search?: string;
  status?: string;
  leaveTypeId?: string;
  employeeId?: string;
  startDate?: string;
  endDate?: string;
};

export type LeaveRequestListOptions = {
  filters?: LeaveRequestFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateLeaveRequestInput = {
  employeeId: string;
  leaveTypeId: string;
  tenantId: string;
  startDate: Date;
  endDate: Date;
  workingDaysRequested?: number;
  reason?: string;
  attachmentUrl?: string;
  createdBy?: string;
};

export type UpdateLeaveRequestInput = {
  startDate?: Date;
  endDate?: Date;
  workingDaysRequested?: number;
  reason?: string;
  attachmentUrl?: string;
  status?: string;
  updatedBy?: string;
};

export class LeaveRepository {
  // ── LeaveType ────────────────────────────────────────────

  countLeaveTypes(tenantId: string, filters?: LeaveTypeFilters) {
    return prisma.leaveType.count({ where: this.buildLeaveTypeWhere(tenantId, filters) });
  }

  findLeaveTypes(tenantId: string, options?: LeaveTypeListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "createdAt", orderDir = "desc" } = options ?? {};
    return prisma.leaveType.findMany({
      where: this.buildLeaveTypeWhere(tenantId, filters),
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
    });
  }

  findLeaveTypeById(tenantId: string, id: string) {
    return prisma.leaveType.findFirst({ where: { tenantId, id, deletedAt: null } });
  }

  findLeaveTypeByName(tenantId: string, organizationId: string, name: string, excludeId?: string) {
    return prisma.leaveType.findFirst({
      where: { tenantId, organizationId, name, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
  }

  findLeaveTypeByCode(tenantId: string, organizationId: string, code: string, excludeId?: string) {
    return prisma.leaveType.findFirst({
      where: { tenantId, organizationId, code, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
  }

  createLeaveType(input: CreateLeaveTypeInput) {
    return prisma.leaveType.create({
      data: {
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        name: input.name,
        code: input.code,
        description: input.description,
        category: input.category as never,
        maxDaysPerYear: input.maxDaysPerYear ?? 0,
        minDaysRequired: input.minDaysRequired ?? 0,
        requiresApproval: input.requiresApproval ?? true,
        requiresMedicalCert: input.requiresMedicalCert ?? false,
        attachmentRequired: input.attachmentRequired ?? false,
        isActive: true,
        createdBy: input.createdBy,
      },
    });
  }

  updateLeaveType(tenantId: string, id: string, input: UpdateLeaveTypeInput) {
    return prisma.leaveType.update({
      where: { id },
      data: {
        name: input.name,
        code: input.code,
        description: input.description,
        category: input.category as never,
        maxDaysPerYear: input.maxDaysPerYear,
        minDaysRequired: input.minDaysRequired,
        requiresApproval: input.requiresApproval,
        requiresMedicalCert: input.requiresMedicalCert,
        attachmentRequired: input.attachmentRequired,
        isActive: input.isActive,
        updatedBy: input.updatedBy,
      },
    });
  }

  softDeleteLeaveType(tenantId: string, id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.leaveType.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  }

  // ── LeaveBalance ─────────────────────────────────────────

  findLeaveBalances(tenantId: string, filters?: { employeeId?: string; leaveTypeId?: string; year?: number }) {
    const where: Record<string, unknown> = { tenantId };
    if (filters?.employeeId) where.employeeId = filters.employeeId;
    if (filters?.leaveTypeId) where.leaveTypeId = filters.leaveTypeId;
    if (filters?.year) where.year = filters.year;
    return prisma.leaveBalance.findMany({
      where,
      include: { leaveType: { select: { id: true, name: true, code: true, category: true } } },
      orderBy: [{ year: "desc" }, { leaveType: { name: "asc" } }],
    });
  }

  findLeaveBalance(employeeId: string, leaveTypeId: string, year: number) {
    return prisma.leaveBalance.findUnique({
      where: { employeeId_leaveTypeId_year: { employeeId, leaveTypeId, year } },
    });
  }

  upsertLeaveBalance(input: {
    employeeId: string;
    leaveTypeId: string;
    tenantId: string;
    year: number;
    allocatedDays?: number;
    usedDays?: number;
    pendingDays?: number;
    carryoverDays?: number;
  }) {
    return prisma.leaveBalance.upsert({
      where: { employeeId_leaveTypeId_year: { employeeId: input.employeeId, leaveTypeId: input.leaveTypeId, year: input.year } },
      create: {
        employeeId: input.employeeId,
        leaveTypeId: input.leaveTypeId,
        tenantId: input.tenantId,
        year: input.year,
        allocatedDays: input.allocatedDays ?? 0,
        usedDays: input.usedDays ?? 0,
        pendingDays: input.pendingDays ?? 0,
        carryoverDays: input.carryoverDays ?? 0,
        availableDays: (input.allocatedDays ?? 0) + (input.carryoverDays ?? 0) - (input.usedDays ?? 0) - (input.pendingDays ?? 0),
      },
      update: {
        allocatedDays: input.allocatedDays,
        usedDays: input.usedDays,
        pendingDays: input.pendingDays,
        carryoverDays: input.carryoverDays,
        availableDays: (input.allocatedDays ?? 0) + (input.carryoverDays ?? 0) - (input.usedDays ?? 0) - (input.pendingDays ?? 0),
      },
    });
  }

  adjustPendingBalance(employeeId: string, leaveTypeId: string, year: number, delta: number, tenantId: string) {
    return prisma.$executeRaw`
      UPDATE "LeaveBalance"
      SET "pendingDays" = GREATEST(0, "pendingDays" + ${delta}),
          "availableDays" = GREATEST(0, "availableDays" - ${delta}),
          "lastUpdatedAt" = NOW()
      WHERE "employeeId" = ${employeeId}
        AND "leaveTypeId" = ${leaveTypeId}
        AND "year" = ${year}
    `;
  }

  adjustUsedBalance(employeeId: string, leaveTypeId: string, year: number, delta: number) {
    return prisma.$executeRaw`
      UPDATE "LeaveBalance"
      SET "usedDays" = GREATEST(0, "usedDays" + ${delta}),
          "pendingDays" = GREATEST(0, "pendingDays" - ${delta}),
          "availableDays" = GREATEST(0, "availableDays" - ${delta}),
          "lastUpdatedAt" = NOW()
      WHERE "employeeId" = ${employeeId}
        AND "leaveTypeId" = ${leaveTypeId}
        AND "year" = ${year}
    `;
  }

  // ── LeaveRequest ─────────────────────────────────────────

  countLeaveRequests(tenantId: string, filters?: LeaveRequestFilters) {
    return prisma.leaveRequest.count({ where: this.buildLeaveRequestWhere(tenantId, filters) });
  }

  findLeaveRequests(tenantId: string, options?: LeaveRequestListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "createdAt", orderDir = "desc" } = options ?? {};
    return prisma.leaveRequest.findMany({
      where: this.buildLeaveRequestWhere(tenantId, filters),
      include: {
        leaveType: { select: { id: true, name: true, code: true, category: true } },
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true } },
      },
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
    });
  }

  findLeaveRequestById(tenantId: string, id: string) {
    return prisma.leaveRequest.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        leaveType: { select: { id: true, name: true, code: true, category: true } },
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true, email: true } },
        approvedBy: { select: { id: true, firstName: true, lastName: true } },
        approvals: {
          include: { approver: { select: { id: true, firstName: true, lastName: true } } },
          orderBy: { level: "asc" },
        },
        approvalWorkflow: true,
      },
    });
  }

  createLeaveRequest(input: CreateLeaveRequestInput) {
    return prisma.leaveRequest.create({
      data: {
        employeeId: input.employeeId,
        leaveTypeId: input.leaveTypeId,
        tenantId: input.tenantId,
        startDate: input.startDate,
        endDate: input.endDate,
        workingDaysRequested: input.workingDaysRequested ?? 0,
        reason: input.reason,
        attachmentUrl: input.attachmentUrl,
        createdBy: input.createdBy,
      },
    });
  }

  updateLeaveRequestStatus(tenantId: string, id: string, status: string, approvedById?: string, approvedAt?: Date, rejectionReason?: string) {
    return prisma.leaveRequest.update({
      where: { id },
      data: {
        status: status as never,
        approvedById,
        approvedAt,
        rejectionReason,
        updatedBy: approvedById,
      },
    });
  }

  softDeleteLeaveRequest(tenantId: string, id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.leaveRequest.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  }

  // ── LeaveApproval ────────────────────────────────────────

  createLeaveApproval(input: {
    leaveRequestId: string;
    tenantId: string;
    level: number;
    approverId?: string;
    status?: string;
  }) {
    return prisma.leaveApproval.create({
      data: {
        leaveRequestId: input.leaveRequestId,
        tenantId: input.tenantId,
        level: input.level,
        approverId: input.approverId,
        status: (input.status as never) ?? "PENDING",
      },
    });
  }

  updateLeaveApproval(id: string, input: { status: string; reason?: string; comments?: string; approvedAt?: Date }) {
    return prisma.leaveApproval.update({
      where: { id },
      data: {
        status: input.status as never,
        reason: input.reason,
        comments: input.comments,
        approvedAt: input.approvedAt ?? new Date(),
      },
    });
  }

  // ── Calendar ─────────────────────────────────────────────

  findLeaveRequestsForCalendar(tenantId: string, startDate: Date, endDate: Date, employeeId?: string) {
    const where: Record<string, unknown> = {
      tenantId,
      deletedAt: null,
      status: { in: ["APPROVED", "SUBMITTED", "IN_PROGRESS"] },
      startDate: { lte: endDate },
      endDate: { gte: startDate },
    };
    if (employeeId) where.employeeId = employeeId;
    return prisma.leaveRequest.findMany({
      where,
      include: {
        leaveType: { select: { id: true, name: true, code: true, category: true } },
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
      orderBy: { startDate: "asc" },
    });
  }

  // ── Where builders ───────────────────────────────────────

  private buildLeaveTypeWhere(tenantId: string, filters?: LeaveTypeFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (!filters) return where;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search, mode: "insensitive" } },
        { code: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.category) where.category = filters.category;
    if (filters.isActive !== undefined && filters.isActive !== "") where.isActive = filters.isActive === "true";
    return where;
  }

  private buildLeaveRequestWhere(tenantId: string, filters?: LeaveRequestFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (!filters) return where;
    if (filters.search) {
      where.OR = [
        { employee: { firstName: { contains: filters.search, mode: "insensitive" } } },
        { employee: { lastName: { contains: filters.search, mode: "insensitive" } } },
        { employee: { employeeId: { contains: filters.search, mode: "insensitive" } } },
      ];
    }
    if (filters.status) where.status = filters.status;
    if (filters.leaveTypeId) where.leaveTypeId = filters.leaveTypeId;
    if (filters.employeeId) where.employeeId = filters.employeeId;
    if (filters.startDate) where.startDate = { gte: new Date(filters.startDate) };
    if (filters.endDate) where.endDate = { lte: new Date(filters.endDate) };
    return where;
  }
}

export const leaveRepository = new LeaveRepository();
