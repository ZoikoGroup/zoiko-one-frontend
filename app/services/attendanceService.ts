import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { attendanceRepository } from "@/app/repositories/attendanceRepository";
import type { AttendanceListOptions, AttendanceFilters, ReportQuery } from "@/app/repositories/attendanceRepository";
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

function toDateString(d: Date): string {
  return d.toISOString().split("T")[0];
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

function calculateWorkingHours(checkIn: Date, checkOut: Date): number {
  const diffMs = checkOut.getTime() - checkIn.getTime();
  return Math.max(0, Math.round((diffMs / (1000 * 60 * 60)) * 100) / 100);
}

function calculateOvertime(workingHours: number, standardHours = 8): number {
  return Math.max(0, Math.round((workingHours - standardHours) * 100) / 100);
}

export async function listAttendances(options?: AttendanceListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const tenantId = options?.tenantId ?? ctx.tenantId;
  const data = await attendanceRepository.findAttendances(tenantId, options);
  const total = await attendanceRepository.countAttendances(tenantId, options?.filters);
  return { data, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getAttendance(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);
  const attendance = await attendanceRepository.findAttendanceById(ctx.tenantId, id);
  if (!attendance) throw new AuthorizationError("Attendance record not found.", 404);
  return attendance;
}

export async function createAttendance(input: {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  remarks?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.employeeId, "Employee"),
    validateRequired(input.date, "Date"),
    validateRequired(input.status, "Status"),
  ]);
  if (errors.length > 0) throw new AuthorizationError(errors.join(" "), 400);

  const employee = await prisma.employee.findFirst({
    where: { id: input.employeeId, tenantId: ctx.tenantId, deletedAt: null },
  });
  if (!employee) throw new AuthorizationError("Employee not found.", 404);

  const orgId = await resolveOrganizationId(ctx);

  const existing = await attendanceRepository.findByEmployeeAndDate(
    ctx.tenantId, input.employeeId, new Date(input.date),
  );
  if (existing) throw new AuthorizationError("Attendance record already exists for this employee on this date.", 409);

  let checkIn: Date | undefined;
  let checkOut: Date | undefined;
  let workingHours: number | undefined;
  let overtimeHours: number | undefined;

  if (input.checkIn) checkIn = new Date(input.checkIn);
  if (input.checkOut) checkOut = new Date(input.checkOut);
  if (checkIn && checkOut) {
    workingHours = calculateWorkingHours(checkIn, checkOut);
    overtimeHours = calculateOvertime(workingHours);
  }

  const data = await attendanceRepository.createAttendance({
    employeeId: input.employeeId,
    date: new Date(input.date),
    checkIn,
    checkOut,
    workingHours,
    overtimeHours,
    status: input.status,
    remarks: input.remarks,
    organizationId: orgId,
    tenantId: ctx.tenantId,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "ATTENDANCE_CREATE",
    resourceType: "Attendance",
    resourceId: data.id,
    resourceName: `${employee.firstName} ${employee.lastName} - ${input.date}`,
    details: { employeeId: input.employeeId, status: input.status },
  });

  return data;
}

export async function updateAttendance(id: string, input: {
  checkIn?: string;
  checkOut?: string;
  status?: string;
  remarks?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await attendanceRepository.findAttendanceById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Attendance record not found.", 404);

  let checkIn: Date | undefined;
  let checkOut: Date | undefined;
  let workingHours: number | undefined;
  let overtimeHours: number | undefined;

  if (input.checkIn !== undefined) checkIn = new Date(input.checkIn);
  if (input.checkOut !== undefined) checkOut = new Date(input.checkOut);
  if (checkIn && checkOut) {
    workingHours = calculateWorkingHours(checkIn, checkOut);
    overtimeHours = calculateOvertime(workingHours);
  }

  const data = await attendanceRepository.updateAttendance(id, {
    ...(input.checkIn !== undefined ? { checkIn } : {}),
    ...(input.checkOut !== undefined ? { checkOut } : {}),
    ...(workingHours !== undefined ? { workingHours } : {}),
    ...(overtimeHours !== undefined ? { overtimeHours } : {}),
    ...(input.status ? { status: input.status } : {}),
    ...(input.remarks !== undefined ? { remarks: input.remarks } : {}),
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "ATTENDANCE_UPDATE",
    resourceType: "Attendance",
    resourceId: id,
    details: input,
  });

  return data;
}

export async function deleteAttendance(id: string, deletionReason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await attendanceRepository.findAttendanceById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Attendance record not found.", 404);

  await attendanceRepository.softDeleteAttendance(id, ctx.userId, deletionReason);

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "ATTENDANCE_DELETE",
    resourceType: "Attendance",
    resourceId: id,
  });
}

export async function checkIn(employeeId: string, date?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, tenantId: ctx.tenantId, deletedAt: null },
  });
  if (!employee) throw new AuthorizationError("Employee not found.", 404);

  const orgId = await resolveOrganizationId(ctx);
  const today = date ? new Date(date) : new Date();
  today.setHours(0, 0, 0, 0);

  const existing = await attendanceRepository.findByEmployeeAndDate(ctx.tenantId, employeeId, today);
  if (existing && existing.checkIn) {
    throw new AuthorizationError("Already checked in today.", 409);
  }

  const now = date ? new Date(date) : new Date();
  const attendanceData = existing
    ? await attendanceRepository.updateAttendance(existing.id, { checkIn: now, status: "PRESENT", updatedBy: ctx.userId })
    : await attendanceRepository.createAttendance({
        employeeId,
        date: today,
        checkIn: now,
        status: "PRESENT",
        organizationId: orgId,
        tenantId: ctx.tenantId,
        createdBy: ctx.userId,
      });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "CHECK_IN",
    resourceType: "Attendance",
    resourceId: attendanceData.id,
    resourceName: `${employee.firstName} ${employee.lastName}`,
  });

  return attendanceData;
}

export async function checkOut(employeeId: string, date?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const employee = await prisma.employee.findFirst({
    where: { id: employeeId, tenantId: ctx.tenantId, deletedAt: null },
  });
  if (!employee) throw new AuthorizationError("Employee not found.", 404);

  const today = date ? new Date(date) : new Date();
  today.setHours(23, 59, 59, 999);

  const existing = await attendanceRepository.findByEmployeeAndDate(ctx.tenantId, employeeId, today);
  if (!existing) throw new AuthorizationError("No check-in record found for today.", 404);
  if (existing.checkOut) throw new AuthorizationError("Already checked out today.", 409);
  if (!existing.checkIn) throw new AuthorizationError("Must check in before checking out.", 400);

  const now = date ? new Date(date) : new Date();
  const workingHours = calculateWorkingHours(existing.checkIn, now);
  const overtimeHours = calculateOvertime(workingHours);

  const data = await attendanceRepository.updateAttendance(existing.id, {
    checkOut: now,
    workingHours,
    overtimeHours,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "CHECK_OUT",
    resourceType: "Attendance",
    resourceId: data.id,
    resourceName: `${employee.firstName} ${employee.lastName}`,
    details: { workingHours, overtimeHours },
  });

  return data;
}

export async function getDashboardStats() {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const orgId = await resolveOrganizationId(ctx);
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return attendanceRepository.getDashboardStats(ctx.tenantId, orgId, today);
}

export async function getAttendanceReport(query: Omit<ReportQuery, "tenantId">) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return attendanceRepository.getAttendanceReport({ ...query, tenantId: ctx.tenantId });
}
