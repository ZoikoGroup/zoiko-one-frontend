import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type ShiftFilters = {
  search?: string;
};

export type ShiftListOptions = {
  filters?: ShiftFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateShiftInput = {
  name: string;
  startTime: string;
  endTime: string;
  gracePeriod?: number;
  weeklyOff?: string[];
  organizationId: string;
  tenantId: string;
  createdBy?: string;
};

export type UpdateShiftInput = {
  name?: string;
  startTime?: string;
  endTime?: string;
  gracePeriod?: number;
  weeklyOff?: string[];
  updatedBy?: string;
};

export type CreateShiftAssignmentInput = {
  shiftId: string;
  employeeId: string;
  effectiveFrom: Date;
  effectiveTo?: Date;
  tenantId: string;
  createdBy?: string;
};

function buildWhere(tenantId: string, filters?: ShiftFilters) {
  const where: Prisma.ShiftWhereInput = { tenantId, deletedAt: null };
  if (filters?.search) {
    where.OR = [
      { name: { contains: filters.search, mode: "insensitive" } },
    ];
  }
  return where;
}

export const shiftRepository = {
  async findShifts(tenantId: string, organizationId: string, options?: ShiftListOptions) {
    const where = { ...buildWhere(tenantId, options?.filters), organizationId };
    return prisma.shift.findMany({
      where,
      orderBy: options?.orderBy ? { [options.orderBy]: options.orderDir ?? "desc" } : { createdAt: "desc" },
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      include: {
        assignments: { where: { deletedAt: null }, include: { employee: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });
  },

  async countShifts(tenantId: string, organizationId: string, filters?: ShiftFilters) {
    return prisma.shift.count({ where: { ...buildWhere(tenantId, filters), organizationId } });
  },

  async findShiftById(tenantId: string, id: string) {
    return prisma.shift.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        assignments: { where: { deletedAt: null }, include: { employee: { select: { id: true, firstName: true, lastName: true } } } },
      },
    });
  },

  async createShift(data: CreateShiftInput) {
    return prisma.shift.create({
      data: { ...data, weeklyOff: data.weeklyOff as never ?? undefined },
    });
  },

  async updateShift(id: string, data: UpdateShiftInput) {
    return prisma.shift.update({
      where: { id },
      data: { ...data, weeklyOff: data.weeklyOff as never ?? undefined },
    });
  },

  async softDeleteShift(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.shift.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  async findAssignmentsByEmployee(tenantId: string, employeeId: string, date: Date) {
    return prisma.shiftAssignment.findFirst({
      where: {
        tenantId,
        employeeId,
        deletedAt: null,
        effectiveFrom: { lte: date },
        AND: [{ effectiveTo: null }, { effectiveTo: { gte: date } }],
      },
      include: { shift: true },
    });
  },

  async assignShift(data: CreateShiftAssignmentInput) {
    return prisma.shiftAssignment.create({ data });
  },

  async removeAssignment(id: string) {
    return prisma.shiftAssignment.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  },
};
