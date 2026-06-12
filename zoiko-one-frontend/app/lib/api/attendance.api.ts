import { apiFetch, buildUrl } from "./client";

const ATTENDANCE_BASE = "/api/zoiko-hr/attendance";
const SHIFT_BASE = "/api/zoiko-hr/shifts";

export interface AttendanceRecord {
  id: string;
  employeeId: string;
  date: string;
  checkIn: string | null;
  checkOut: string | null;
  workingHours: number | null;
  overtimeHours: number | null;
  status: string;
  remarks: string | null;
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  createdAt: string;
  updatedAt: string;
}

export interface AttendanceListResponse {
  data: AttendanceRecord[];
  total: number;
  skip: number;
  take: number;
}

export interface ShiftRecord {
  id: string;
  name: string;
  startTime: string;
  endTime: string;
  gracePeriod: number;
  weeklyOff: string[] | null;
  assignments?: { id: string; employeeId: string; employee: { id: string; firstName: string; lastName: string } }[];
  createdAt: string;
  updatedAt: string;
}

export interface ShiftListResponse {
  data: ShiftRecord[];
  total: number;
  skip: number;
  take: number;
}

export interface AttendanceDashboardStats {
  totalEmployees: number;
  present: number;
  absent: number;
  halfDay: number;
  onLeave: number;
  lateArrivals: number;
  attendancePct: number;
}

export interface AttendanceReport {
  records: AttendanceRecord[];
  summary: {
    total: number;
    present: number;
    absent: number;
    halfDay: number;
    wfh: number;
    onLeave: number;
    holiday: number;
    totalWorkingHours: number;
    totalOvertimeHours: number;
  };
}

export async function fetchAttendanceDashboard(): Promise<{ data: AttendanceDashboardStats }> {
  return apiFetch<{ data: AttendanceDashboardStats }>(`${ATTENDANCE_BASE}/dashboard`);
}

export async function fetchAttendances(filters?: {
  search?: string;
  status?: string;
  employeeId?: string;
  departmentId?: string;
  startDate?: string;
  endDate?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: string;
}): Promise<AttendanceListResponse> {
  const qs = buildUrl(ATTENDANCE_BASE, {
    search: filters?.search,
    status: filters?.status,
    employeeId: filters?.employeeId,
    departmentId: filters?.departmentId,
    startDate: filters?.startDate,
    endDate: filters?.endDate,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === ATTENDANCE_BASE ? ATTENDANCE_BASE : qs;
  return apiFetch<AttendanceListResponse>(url);
}

export async function fetchAttendance(id: string): Promise<{ data: AttendanceRecord }> {
  return apiFetch<{ data: AttendanceRecord }>(`${ATTENDANCE_BASE}/${id}`);
}

export async function createAttendance(body: {
  employeeId: string;
  date: string;
  checkIn?: string;
  checkOut?: string;
  status: string;
  remarks?: string;
}): Promise<{ data: AttendanceRecord }> {
  return apiFetch<{ data: AttendanceRecord }>(ATTENDANCE_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateAttendance(id: string, body: {
  checkIn?: string;
  checkOut?: string;
  status?: string;
  remarks?: string;
}): Promise<{ data: AttendanceRecord }> {
  return apiFetch<{ data: AttendanceRecord }>(`${ATTENDANCE_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteAttendance(id: string, reason?: string): Promise<{ ok: boolean }> {
  const url = reason ? `${ATTENDANCE_BASE}/${id}?reason=${encodeURIComponent(reason)}` : `${ATTENDANCE_BASE}/${id}`;
  return apiFetch<{ ok: boolean }>(url, { method: "DELETE" });
}

export async function checkInEmployee(employeeId: string, date?: string): Promise<{ data: AttendanceRecord }> {
  return apiFetch<{ data: AttendanceRecord }>(`${ATTENDANCE_BASE}/check-in`, {
    method: "POST",
    body: JSON.stringify({ employeeId, date }),
  });
}

export async function checkOutEmployee(employeeId: string, date?: string): Promise<{ data: AttendanceRecord }> {
  return apiFetch<{ data: AttendanceRecord }>(`${ATTENDANCE_BASE}/check-out`, {
    method: "POST",
    body: JSON.stringify({ employeeId, date }),
  });
}

export async function fetchAttendanceReport(filters: {
  type: string;
  startDate: string;
  endDate: string;
  employeeId?: string;
  departmentId?: string;
}): Promise<AttendanceReport> {
  const url = buildUrl(`${ATTENDANCE_BASE}/reports`, {
    type: filters.type,
    startDate: filters.startDate,
    endDate: filters.endDate,
    employeeId: filters.employeeId,
    departmentId: filters.departmentId,
  });
  return apiFetch<AttendanceReport>(url);
}

// ── Shifts ──────────────────────────────────────────────────

export async function fetchShifts(filters?: {
  search?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: string;
}): Promise<ShiftListResponse> {
  const qs = buildUrl(SHIFT_BASE, {
    search: filters?.search,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === SHIFT_BASE ? SHIFT_BASE : qs;
  return apiFetch<ShiftListResponse>(url);
}

export async function fetchShift(id: string): Promise<{ data: ShiftRecord }> {
  return apiFetch<{ data: ShiftRecord }>(`${SHIFT_BASE}/${id}`);
}

export async function createShift(body: {
  name: string;
  startTime: string;
  endTime: string;
  gracePeriod?: number;
  weeklyOff?: string[];
}): Promise<{ data: ShiftRecord }> {
  return apiFetch<{ data: ShiftRecord }>(SHIFT_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateShift(id: string, body: {
  name?: string;
  startTime?: string;
  endTime?: string;
  gracePeriod?: number;
  weeklyOff?: string[];
}): Promise<{ data: ShiftRecord }> {
  return apiFetch<{ data: ShiftRecord }>(`${SHIFT_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteShift(id: string, reason?: string): Promise<{ ok: boolean }> {
  const url = reason ? `${SHIFT_BASE}/${id}?reason=${encodeURIComponent(reason)}` : `${SHIFT_BASE}/${id}`;
  return apiFetch<{ ok: boolean }>(url, { method: "DELETE" });
}

export async function assignShiftToEmployee(body: {
  shiftId: string;
  employeeId: string;
  effectiveFrom: string;
  effectiveTo?: string;
}): Promise<{ data: { id: string } }> {
  return apiFetch<{ data: { id: string } }>(`${SHIFT_BASE}/assign`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}
