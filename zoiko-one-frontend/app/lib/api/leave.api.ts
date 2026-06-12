import { apiFetch, buildUrl } from "./client";

// ── Leave Types ────────────────────────────────────────────

export interface LeaveType {
  id: string;
  organizationId: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string | null;
  category: string;
  maxDaysPerYear: number;
  minDaysRequired: number;
  requiresApproval: boolean;
  requiresMedicalCert: boolean;
  attachmentRequired: boolean;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface LeaveTypeListResponse {
  data: LeaveType[];
  total: number;
  skip: number;
  take: number;
}

const LEAVE_BASE = "/api/zoiko-hr/leave";

export async function fetchLeaveTypes(filters?: { search?: string; category?: string; isActive?: string; skip?: number; take?: number }): Promise<LeaveTypeListResponse> {
  const qs = buildUrl(`${LEAVE_BASE}/types`, {
    search: filters?.search,
    category: filters?.category,
    isActive: filters?.isActive,
    skip: filters?.skip,
    take: filters?.take,
  });
  const url = qs === `${LEAVE_BASE}/types` ? `${LEAVE_BASE}/types` : qs;
  return apiFetch<LeaveTypeListResponse>(url);
}

export async function createLeaveType(body: { name: string; code: string; description?: string; category: string; maxDaysPerYear?: number; minDaysRequired?: number; requiresApproval?: boolean; requiresMedicalCert?: boolean; attachmentRequired?: boolean }): Promise<{ data: LeaveType }> {
  return apiFetch<{ data: LeaveType }>(`${LEAVE_BASE}/types`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateLeaveType(id: string, body: { name?: string; code?: string; description?: string; category?: string; maxDaysPerYear?: number; minDaysRequired?: number; requiresApproval?: boolean; requiresMedicalCert?: boolean; attachmentRequired?: boolean; isActive?: boolean }): Promise<{ data: LeaveType }> {
  return apiFetch<{ data: LeaveType }>(`${LEAVE_BASE}/types/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteLeaveType(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${LEAVE_BASE}/types/${id}`, { method: "DELETE" });
}

// ── Leave Requests ─────────────────────────────────────────

export type LeaveRequestStatus = "DRAFT" | "SUBMITTED" | "APPROVED" | "REJECTED" | "CANCELLED" | "IN_PROGRESS" | "COMPLETED";

export interface LeaveRequest {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  tenantId: string;
  requestDate: string;
  startDate: string;
  endDate: string;
  workingDaysRequested: number;
  reason?: string | null;
  attachmentUrl?: string | null;
  status: LeaveRequestStatus;
  approvedById?: string | null;
  approvedAt?: string | null;
  rejectionReason?: string | null;
  createdAt: string;
  leaveType?: { id: string; name: string; code: string; category: string };
  employee?: { id: string; firstName: string; lastName: string; employeeId: string };
  approvedBy?: { id: string; firstName: string; lastName: string };
  approvals?: LeaveApproval[];
}

export interface LeaveRequestListResponse {
  data: LeaveRequest[];
  total: number;
  skip: number;
  take: number;
}

export interface LeaveApproval {
  id: string;
  leaveRequestId: string;
  tenantId: string;
  level: number;
  approverId?: string | null;
  status: string;
  approvedAt?: string | null;
  reason?: string | null;
  comments?: string | null;
  createdAt: string;
  approver?: { id: string; firstName: string; lastName: string };
}

export async function fetchLeaveRequests(filters?: { search?: string; status?: string; leaveTypeId?: string; employeeId?: string; startDate?: string; endDate?: string; skip?: number; take?: number; orderBy?: string; orderDir?: string }): Promise<LeaveRequestListResponse> {
  const qs = buildUrl(`${LEAVE_BASE}/requests`, {
    search: filters?.search,
    status: filters?.status,
    leaveTypeId: filters?.leaveTypeId,
    employeeId: filters?.employeeId,
    startDate: filters?.startDate,
    endDate: filters?.endDate,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === `${LEAVE_BASE}/requests` ? `${LEAVE_BASE}/requests` : qs;
  return apiFetch<LeaveRequestListResponse>(url);
}

export async function fetchLeaveRequest(id: string): Promise<{ data: LeaveRequest }> {
  return apiFetch<{ data: LeaveRequest }>(`${LEAVE_BASE}/requests/${id}`);
}

export async function createLeaveRequest(body: { employeeId: string; leaveTypeId: string; startDate: string; endDate: string; workingDaysRequested?: number; reason?: string }): Promise<{ data: LeaveRequest }> {
  return apiFetch<{ data: LeaveRequest }>(`${LEAVE_BASE}/requests`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function approveLeaveRequest(requestId: string, action: "APPROVED" | "REJECTED", reason?: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${LEAVE_BASE}/requests/${requestId}/approve`, {
    method: "POST",
    body: JSON.stringify({ action, reason }),
  });
}

export async function cancelLeaveRequest(requestId: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${LEAVE_BASE}/requests/${requestId}`, { method: "DELETE" });
}

// ── Leave Balances ─────────────────────────────────────────

export interface LeaveBalance {
  id: string;
  employeeId: string;
  leaveTypeId: string;
  tenantId: string;
  year: number;
  allocatedDays: number;
  usedDays: number;
  pendingDays: number;
  carryoverDays: number;
  availableDays: number;
  lastUpdatedAt: string;
  leaveType?: { id: string; name: string; code: string; category: string };
}

export async function fetchLeaveBalances(filters?: { employeeId?: string; leaveTypeId?: string; year?: number }): Promise<LeaveBalance[]> {
  const qs = buildUrl(`${LEAVE_BASE}/balances`, {
    employeeId: filters?.employeeId,
    leaveTypeId: filters?.leaveTypeId,
    year: filters?.year,
  });
  const url = qs === `${LEAVE_BASE}/balances` ? `${LEAVE_BASE}/balances` : qs;
  return apiFetch<LeaveBalance[]>(url);
}

export async function initializeLeaveBalance(body: { employeeId: string; leaveTypeId: string; year?: number; allocatedDays: number }): Promise<{ data: LeaveBalance }> {
  return apiFetch<{ data: LeaveBalance }>(`${LEAVE_BASE}/balances`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

// ── Leave Calendar ─────────────────────────────────────────

export interface CalendarEvent {
  id: string;
  title: string;
  start: string;
  end: string;
  status: string;
  employeeName: string;
  employeeId: string;
  leaveType: string;
  leaveTypeCode: string;
  leaveTypeCategory: string;
}

export async function fetchLeaveCalendar(filters?: { startDate?: string; endDate?: string; employeeId?: string }): Promise<CalendarEvent[]> {
  const qs = buildUrl(`${LEAVE_BASE}/calendar`, {
    startDate: filters?.startDate,
    endDate: filters?.endDate,
    employeeId: filters?.employeeId,
  });
  const url = qs === `${LEAVE_BASE}/calendar` ? `${LEAVE_BASE}/calendar` : qs;
  return apiFetch<CalendarEvent[]>(url);
}
