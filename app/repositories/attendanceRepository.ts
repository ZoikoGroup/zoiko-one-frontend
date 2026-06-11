import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export type AttendanceFilters = {
  search?: string;
  status?: string;
  employeeId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
};

export type AttendanceListOptions = {
  filters?: AttendanceFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateAttendanceInput = {
  employeeId: string;
  date: Date;
  checkIn?: Date;
  checkOut?: Date;
  workingHours?: number;
  overtimeHours?: number;
  status: string;
  remarks?: string;
  organizationId: string;
  tenantId: string;
  createdBy?: string;
};

export type UpdateAttendanceInput = {
  checkIn?: Date;
  checkOut?: Date;
  workingHours?: number;
  overtimeHours?: number;
  status?: string;
  remarks?: string;
  updatedBy?: string;
};

export type ReportQuery = {
  type: "daily" | "weekly" | "monthly" | "department" | "employee";
  startDate: string;
  endDate: string;
  employeeId?: string;
  departmentId?: string;
  tenantId: string;
};

function buildWhere(tenantId: string, filters?: AttendanceFilters) {
  const where: Prisma.AttendanceWhereInput = { tenantId, deletedAt: null };
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
  if (filters?.startDate) where.date = { ...(where.date as object || {}), gte: new Date(filters.startDate) };
  if (filters?.endDate) where.date = { ...(where.date as object || {}), lte: new Date(filters.endDate) };
  if (filters?.departmentId) {
    where.employee = {
      ...(where.employee as object || {}),
      employmentRecords: { some: { departmentId: filters.departmentId, deletedAt: null } },
    };
  }
  return where;
}

export const attendanceRepository = {
  async findAttendances(tenantId: string, options?: AttendanceListOptions) {
    const where = buildWhere(tenantId, options?.filters);
    const orderBy: Prisma.AttendanceOrderByWithRelationInput = {};
    if (options?.orderBy) {
      orderBy[options.orderBy as keyof Prisma.AttendanceOrderByWithRelationInput] = options.orderDir ?? "desc";
    } else {
      orderBy.date = "desc";
    }
    return prisma.attendance.findMany({
      where,
      orderBy,
      skip: options?.skip ?? 0,
      take: options?.take ?? 25,
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
    });
  },

  async countAttendances(tenantId: string, filters?: AttendanceFilters) {
    return prisma.attendance.count({ where: buildWhere(tenantId, filters) });
  },

  async findAttendanceById(tenantId: string, id: string) {
    return prisma.attendance.findFirst({
      where: { id, tenantId, deletedAt: null },
      include: {
        employee: { select: { id: true, firstName: true, lastName: true, employeeId: true } },
      },
    });
  },

  async findByEmployeeAndDate(tenantId: string, employeeId: string, date: Date) {
    return prisma.attendance.findFirst({
      where: { tenantId, employeeId, date, deletedAt: null },
    });
  },

  async createAttendance(data: CreateAttendanceInput) {
    return prisma.attendance.create({ data: { ...data, status: data.status as never } });
  },

  async updateAttendance(id: string, data: UpdateAttendanceInput) {
    return prisma.attendance.update({ where: { id }, data: { ...data, status: data.status as never } });
  },

  async softDeleteAttendance(id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.attendance.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  },

  async getDashboardStats(tenantId: string, organizationId: string, date: Date) {
    const dayStart = new Date(date);
    dayStart.setHours(0, 0, 0, 0);
    const dayEnd = new Date(date);
    dayEnd.setHours(23, 59, 59, 999);

    const [totalEmployees, todayAttendance, onLeave] = await Promise.all([
      prisma.employee.count({ where: { tenantId, organizationId, deletedAt: null, status: "ACTIVE" as never } }),
      prisma.attendance.findMany({
        where: { tenantId, date: { gte: dayStart, lte: dayEnd }, deletedAt: null },
        select: { status: true, checkIn: true },
      }),
      prisma.leaveRequest.count({
        where: {
          tenantId,
          status: "APPROVED" as never,
          startDate: { lte: dayEnd },
          endDate: { gte: dayStart },
          deletedAt: null,
        },
      }),
    ]);

    const present = todayAttendance.filter((a) => a.status === "PRESENT" || a.status === "WORK_FROM_HOME").length;
    const absent = todayAttendance.filter((a) => a.status === "ABSENT").length;
    const halfDay = todayAttendance.filter((a) => a.status === "HALF_DAY").length;
    const lateArrivals = todayAttendance.filter(
      (a) => a.checkIn && a.status === "PRESENT"
    ).length;

    const attendancePct = totalEmployees > 0 ? Math.round(((present + halfDay) / totalEmployees) * 100) : 0;

    return { totalEmployees, present, absent, halfDay, onLeave, lateArrivals, attendancePct };
  },

  async getAttendanceReport(query: ReportQuery) {
    const where: Prisma.AttendanceWhereInput = {
      tenantId: query.tenantId,
      deletedAt: null,
      date: { gte: new Date(query.startDate), lte: new Date(query.endDate) },
    };
    if (query.employeeId) where.employeeId = query.employeeId;
    if (query.departmentId) {
      where.employee = { employmentRecords: { some: { departmentId: query.departmentId, deletedAt: null } } };
    }

    const records = await prisma.attendance.findMany({
      where,
      include: {
        employee: {
          select: { id: true, firstName: true, lastName: true, employeeId: true },
        },
      },
      orderBy: { date: "asc" },
    });

    const summary = {
      total: records.length,
      present: records.filter((r) => r.status === "PRESENT").length,
      absent: records.filter((r) => r.status === "ABSENT").length,
      halfDay: records.filter((r) => r.status === "HALF_DAY").length,
      wfh: records.filter((r) => r.status === "WORK_FROM_HOME").length,
      onLeave: records.filter((r) => r.status === "ON_LEAVE").length,
      holiday: records.filter((r) => r.status === "HOLIDAY").length,
      totalWorkingHours: records.reduce((sum, r) => sum + (r.workingHours ?? 0), 0),
      totalOvertimeHours: records.reduce((sum, r) => sum + (r.overtimeHours ?? 0), 0),
    };

    return { records, summary };
  },
};
