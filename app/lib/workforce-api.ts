export type EmployeeStatus =
  | "ACTIVE"
  | "ON_LEAVE"
  | "SUSPENDED"
  | "INACTIVE"
  | "TERMINATED";

export type EmploymentType =
  | "FULL_TIME"
  | "PART_TIME"
  | "CONTRACT"
  | "INTERN"
  | "TEMPORARY";

export type MaritalStatus =
  | "SINGLE"
  | "MARRIED"
  | "DIVORCED"
  | "WIDOWED"
  | "SEPARATED";

export type AddressType = "RESIDENTIAL" | "MAILING" | "WORK" | "OTHER";

export type Relationship =
  | "SPOUSE"
  | "PARENT"
  | "SIBLING"
  | "CHILD"
  | "FRIEND"
  | "OTHER";

export type DocumentType =
  | "OFFER_LETTER"
  | "CONTRACT"
  | "NDA"
  | "ID_PROOF"
  | "PAYSLIP"
  | "TAX_FORM"
  | "BANK_DETAILS"
  | "CERTIFICATION"
  | "EDUCATION"
  | "OTHER";

export type DocumentStatus = "PENDING" | "APPROVED" | "REJECTED" | "EXPIRED";

export interface EmployeeProfile {
  id: string;
  employeeId: string;
  tenantId: string;
  middleName?: string | null;
  preferredName?: string | null;
  suffix?: string | null;
  maritalStatus?: string | null;
  spouseName?: string | null;
  numberDependents: number;
  bloodGroup?: string | null;
  allergies?: string | null;
  disabilities?: string | null;
  linkedinUrl?: string | null;
  personalWebsite?: string | null;
  bio?: string | null;
}

export interface EmploymentRecord {
  id: string;
  employeeId: string;
  tenantId: string;
  version: number;
  effectiveDate: string;
  expiresAt: string | null;
  employmentType: string;
  employmentStatus: string;
  jobTitle?: string | null;
  jobLevel?: string | null;
  departmentId?: string | null;
  divisionId?: string | null;
  locationId?: string | null;
  salaryAmount: number;
  salaryCurrency: string;
  paymentFrequency: string;
  changeReason: string;
  notes?: string | null;
  wfhEligible: boolean;
  wfhDays: number;
}

export interface EmployeeAddress {
  id: string;
  employeeId: string;
  tenantId: string;
  type: string;
  isPrimary: boolean;
  address?: string | null;
  apt?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country: string;
}

export interface EmergencyContact {
  id: string;
  employeeId: string;
  tenantId: string;
  priority: number;
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  alternatePhone?: string | null;
  email?: string | null;
  address?: string | null;
  city?: string | null;
  state?: string | null;
  postalCode?: string | null;
  country?: string | null;
  notes?: string | null;
}

export interface EmployeeDocument {
  id: string;
  employeeId: string;
  tenantId: string;
  documentType: string;
  fileName?: string | null;
  fileUrl?: string | null;
  fileSize?: number | null;
  mimeType?: string | null;
  status: string;
  expiryDate?: string | null;
  notes?: string | null;
  createdAt: string;
}

export type Employee = {
  id: string;
  tenantId: string;
  organizationId: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string | null;
  phoneNumber?: string | null;
  personalPhone?: string | null;
  dateOfBirth?: string | null;
  gender?: string | null;
  nationality?: string | null;
  profilePhotoUrl?: string | null;
  status: string;
  employmentType: string;
  joinDate: string;
  terminationDate?: string | null;
  createdAt: string;
  updatedAt: string;
  profile?: EmployeeProfile | null;
  employmentRecords?: EmploymentRecord[];
  addresses?: EmployeeAddress[];
  emergencyContacts?: EmergencyContact[];
  documentReferences?: EmployeeDocument[];
};

export interface EmployeeListResponse {
  data: Employee[];
  total: number;
  skip: number;
  take: number;
}

export interface EmployeeFilters {
  search?: string;
  status?: string;
  employmentType?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
}

const BASE = "/api/zoiko-hr/workforce";

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error ?? `Request failed with status ${res.status}`);
  }
  return res.json();
}

export async function fetchEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
  const params = new URLSearchParams();
  if (filters.search) params.set("search", filters.search);
  if (filters.status) params.set("status", filters.status);
  if (filters.employmentType) params.set("employmentType", filters.employmentType);
  if (filters.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters.take !== undefined) params.set("take", String(filters.take));
  if (filters.orderBy) params.set("orderBy", filters.orderBy);
  if (filters.orderDir) params.set("orderDir", filters.orderDir);
  const qs = params.toString();
  return handleResponse<EmployeeListResponse>(await fetch(qs ? `${BASE}?${qs}` : BASE));
}

export async function fetchEmployee(id: string): Promise<{ data: Employee }> {
  return handleResponse<{ data: Employee }>(await fetch(`${BASE}/${id}`));
}

export async function createEmployee(body: {
  firstName: string;
  lastName: string;
  email: string;
  phoneNumber?: string;
  joinDate: string;
  employmentType?: string;
  gender?: string;
  nationality?: string;
  personalEmail?: string;
  personalPhone?: string;
}): Promise<{ data: Employee }> {
  return handleResponse<{ data: Employee }>(
    await fetch(BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function updateEmployee(
  id: string,
  body: {
    firstName?: string;
    lastName?: string;
    email?: string;
    phoneNumber?: string;
    personalEmail?: string;
    personalPhone?: string;
    dateOfBirth?: string;
    gender?: string;
    nationality?: string;
  },
): Promise<{ data: Employee }> {
  return handleResponse<{ data: Employee }>(
    await fetch(`${BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function deleteEmployee(id: string, reason?: string): Promise<{ ok: boolean }> {
  const params = reason ? `?reason=${encodeURIComponent(reason)}` : "";
  return handleResponse<{ ok: boolean }>(
    await fetch(`${BASE}/${id}${params}`, { method: "DELETE" }),
  );
}

export async function fetchEmployeeProfile(employeeId: string): Promise<EmployeeProfile> {
  return handleResponse<EmployeeProfile>(await fetch(`${BASE}/${employeeId}/profile`));
}

export async function upsertEmployeeProfile(
  employeeId: string,
  body: {
    middleName?: string;
    preferredName?: string;
    maritalStatus?: string;
    bloodGroup?: string;
    allergies?: string;
    disabilities?: string;
    linkedinUrl?: string;
    bio?: string;
  },
): Promise<EmployeeProfile> {
  return handleResponse<EmployeeProfile>(
    await fetch(`${BASE}/${employeeId}/profile`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function fetchEmploymentRecords(employeeId: string): Promise<EmploymentRecord[]> {
  return handleResponse<EmploymentRecord[]>(await fetch(`${BASE}/${employeeId}/employment-records`));
}

export async function createEmploymentRecord(
  employeeId: string,
  body: {
    jobTitle?: string;
    departmentId?: string;
    employmentType?: string;
    salaryAmount?: number;
    salaryCurrency?: string;
    changeReason: string;
    notes?: string;
  },
): Promise<EmploymentRecord> {
  return handleResponse<EmploymentRecord>(
    await fetch(`${BASE}/${employeeId}/employment-records`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function fetchEmployeeDocuments(employeeId: string): Promise<EmployeeDocument[]> {
  return handleResponse<EmployeeDocument[]>(await fetch(`${BASE}/${employeeId}/documents`));
}

export async function createEmployeeDocument(
  employeeId: string,
  body: {
    documentType: string;
    fileName?: string;
    fileUrl?: string;
    fileSize?: number;
    mimeType?: string;
    status?: string;
    expiryDate?: string;
    notes?: string;
  },
): Promise<EmployeeDocument> {
  return handleResponse<EmployeeDocument>(
    await fetch(`${BASE}/${employeeId}/documents`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function deleteEmployeeDocument(employeeId: string, documentId: string): Promise<{ ok: boolean }> {
  return handleResponse<{ ok: boolean }>(
    await fetch(`${BASE}/${employeeId}/documents/${documentId}`, {
      method: "DELETE",
    }),
  );
}

export async function fetchEmergencyContacts(employeeId: string): Promise<EmergencyContact[]> {
  return handleResponse<EmergencyContact[]>(await fetch(`${BASE}/${employeeId}/emergency-contacts`));
}

export async function createEmergencyContact(
  employeeId: string,
  body: {
    firstName: string;
    lastName: string;
    relationship: string;
    phoneNumber: string;
    email?: string;
    address?: string;
    city?: string;
    state?: string;
    notes?: string;
  },
): Promise<EmergencyContact> {
  return handleResponse<EmergencyContact>(
    await fetch(`${BASE}/${employeeId}/emergency-contacts`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function deleteEmergencyContact(employeeId: string, contactId: string): Promise<{ ok: boolean }> {
  return handleResponse<{ ok: boolean }>(
    await fetch(`${BASE}/${employeeId}/emergency-contacts/${contactId}`, {
      method: "DELETE",
    }),
  );
}

export async function fetchEmployeeAddresses(employeeId: string): Promise<EmployeeAddress[]> {
  return handleResponse<EmployeeAddress[]>(await fetch(`${BASE}/${employeeId}/addresses`));
}

export async function createEmployeeAddress(
  employeeId: string,
  body: {
    type: string;
    isPrimary?: boolean;
    address?: string;
    apt?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country: string;
  },
): Promise<EmployeeAddress> {
  return handleResponse<EmployeeAddress>(
    await fetch(`${BASE}/${employeeId}/addresses`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function deleteEmployeeAddress(employeeId: string, addressId: string): Promise<{ ok: boolean }> {
  return handleResponse<{ ok: boolean }>(
    await fetch(`${BASE}/${employeeId}/addresses/${addressId}`, {
      method: "DELETE",
    }),
  );
}

// ── Department ──────────────────────────────────────────────

export interface Department {
  id: string;
  organizationId: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string | null;
  budget: number;
  status: string;
  parentDeptId?: string | null;
  parentDept?: { id: string; name: string; code: string } | null;
  headEmployeeId?: string | null;
  headEmployee?: { id: string; firstName: string; lastName: string } | null;
  childDepartments?: { id: string; name: string; code: string; status: string }[];
  designations?: Designation[];
  createdAt: string;
  updatedAt: string;
}

export interface DepartmentListResponse {
  data: Department[];
  total: number;
  skip: number;
  take: number;
}

export interface DepartmentFilters {
  search?: string;
  status?: string;
}

const DEPARTMENT_BASE = "/api/zoiko-hr/departments";

async function handleDepartmentsResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchDepartments(filters?: DepartmentFilters & { skip?: number; take?: number; orderBy?: string; orderDir?: string }): Promise<DepartmentListResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters?.take !== undefined) params.set("take", String(filters.take));
  if (filters?.orderBy) params.set("orderBy", filters.orderBy);
  if (filters?.orderDir) params.set("orderDir", filters.orderDir);
  const qs = params.toString();
  return handleDepartmentsResponse<DepartmentListResponse>(await fetch(`${DEPARTMENT_BASE}${qs ? `?${qs}` : ""}`));
}

export async function fetchDepartment(id: string): Promise<{ data: Department }> {
  return handleDepartmentsResponse<{ data: Department }>(await fetch(`${DEPARTMENT_BASE}/${id}`));
}

export async function createDepartment(body: {
  name: string;
  code: string;
  description?: string;
  parentDeptId?: string;
  headEmployeeId?: string;
  budget?: number;
}): Promise<{ data: Department }> {
  return handleDepartmentsResponse<{ data: Department }>(
    await fetch(DEPARTMENT_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function updateDepartment(
  id: string,
  body: {
    name?: string;
    code?: string;
    description?: string;
    parentDeptId?: string;
    headEmployeeId?: string;
    budget?: number;
    status?: string;
  },
): Promise<{ data: Department }> {
  return handleDepartmentsResponse<{ data: Department }>(
    await fetch(`${DEPARTMENT_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function deleteDepartment(id: string): Promise<{ ok: boolean }> {
  return handleDepartmentsResponse<{ ok: boolean }>(
    await fetch(`${DEPARTMENT_BASE}/${id}`, { method: "DELETE" }),
  );
}

// ── Designation ─────────────────────────────────────────────

export type DesignationLevel = "JUNIOR" | "MID" | "SENIOR" | "LEAD" | "MANAGER" | "DIRECTOR" | "VP" | "EXECUTIVE" | "C_SUITE";

export type DesignationCategory = "TECHNICAL" | "MANAGEMENT" | "SUPPORT" | "SALES" | "FINANCE" | "HR" | "OTHER";

export type DesignationStatus = "ACTIVE" | "ARCHIVED";

export interface Designation {
  id: string;
  organizationId: string;
  tenantId: string;
  title: string;
  code: string;
  level: DesignationLevel;
  category: DesignationCategory;
  grade?: string | null;
  description?: string | null;
  minSalary: number;
  maxSalary: number;
  status: DesignationStatus;
  departmentId?: string | null;
  department?: { id: string; name: string; code: string } | null;
  createdAt: string;
  updatedAt: string;
}

export interface DesignationListResponse {
  data: Designation[];
  total: number;
  skip: number;
  take: number;
}

export interface DesignationFilters {
  search?: string;
  status?: string;
  level?: string;
  category?: string;
  departmentId?: string;
}

const DESIGNATION_BASE = "/api/zoiko-hr/designations";

async function handleDesignationsResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchDesignations(filters?: DesignationFilters & { skip?: number; take?: number; orderBy?: string; orderDir?: string }): Promise<DesignationListResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.level) params.set("level", filters.level);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.departmentId) params.set("departmentId", filters.departmentId);
  if (filters?.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters?.take !== undefined) params.set("take", String(filters.take));
  if (filters?.orderBy) params.set("orderBy", filters.orderBy);
  if (filters?.orderDir) params.set("orderDir", filters.orderDir);
  const qs = params.toString();
  return handleDesignationsResponse<DesignationListResponse>(await fetch(`${DESIGNATION_BASE}${qs ? `?${qs}` : ""}`));
}

export async function fetchDesignation(id: string): Promise<{ data: Designation }> {
  return handleDesignationsResponse<{ data: Designation }>(await fetch(`${DESIGNATION_BASE}/${id}`));
}

export async function createDesignation(body: {
  title: string;
  code: string;
  level: string;
  category: string;
  grade?: string;
  description?: string;
  minSalary?: number;
  maxSalary?: number;
  departmentId?: string;
}): Promise<{ data: Designation }> {
  return handleDesignationsResponse<{ data: Designation }>(
    await fetch(DESIGNATION_BASE, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function updateDesignation(
  id: string,
  body: {
    title?: string;
    code?: string;
    level?: string;
    category?: string;
    grade?: string;
    description?: string;
    minSalary?: number;
    maxSalary?: number;
    departmentId?: string;
    status?: string;
  },
): Promise<{ data: Designation }> {
  return handleDesignationsResponse<{ data: Designation }>(
    await fetch(`${DESIGNATION_BASE}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }),
  );
}

export async function deleteDesignation(id: string): Promise<{ ok: boolean }> {
  return handleDesignationsResponse<{ ok: boolean }>(
    await fetch(`${DESIGNATION_BASE}/${id}`, { method: "DELETE" }),
  );
}

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

async function handleLeaveResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const err = await response.json().catch(() => ({ error: "Request failed" }));
    throw new Error(err.error ?? `HTTP ${response.status}`);
  }
  return response.json() as Promise<T>;
}

export async function fetchLeaveTypes(filters?: { search?: string; category?: string; isActive?: string; skip?: number; take?: number }): Promise<LeaveTypeListResponse> {
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.category) params.set("category", filters.category);
  if (filters?.isActive !== undefined) params.set("isActive", filters.isActive);
  if (filters?.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters?.take !== undefined) params.set("take", String(filters.take));
  const qs = params.toString();
  return handleLeaveResponse<LeaveTypeListResponse>(await fetch(`${LEAVE_BASE}/types${qs ? `?${qs}` : ""}`));
}

export async function createLeaveType(body: { name: string; code: string; description?: string; category: string; maxDaysPerYear?: number; minDaysRequired?: number; requiresApproval?: boolean; requiresMedicalCert?: boolean; attachmentRequired?: boolean }): Promise<{ data: LeaveType }> {
  return handleLeaveResponse<{ data: LeaveType }>(
    await fetch(`${LEAVE_BASE}/types`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  );
}

export async function updateLeaveType(id: string, body: { name?: string; code?: string; description?: string; category?: string; maxDaysPerYear?: number; minDaysRequired?: number; requiresApproval?: boolean; requiresMedicalCert?: boolean; attachmentRequired?: boolean; isActive?: boolean }): Promise<{ data: LeaveType }> {
  return handleLeaveResponse<{ data: LeaveType }>(
    await fetch(`${LEAVE_BASE}/types/${id}`, { method: "PUT", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  );
}

export async function deleteLeaveType(id: string): Promise<{ ok: boolean }> {
  return handleLeaveResponse<{ ok: boolean }>(await fetch(`${LEAVE_BASE}/types/${id}`, { method: "DELETE" }));
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
  const params = new URLSearchParams();
  if (filters?.search) params.set("search", filters.search);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.leaveTypeId) params.set("leaveTypeId", filters.leaveTypeId);
  if (filters?.employeeId) params.set("employeeId", filters.employeeId);
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  if (filters?.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters?.take !== undefined) params.set("take", String(filters.take));
  if (filters?.orderBy) params.set("orderBy", filters.orderBy);
  if (filters?.orderDir) params.set("orderDir", filters.orderDir);
  const qs = params.toString();
  return handleLeaveResponse<LeaveRequestListResponse>(await fetch(`${LEAVE_BASE}/requests${qs ? `?${qs}` : ""}`));
}

export async function fetchLeaveRequest(id: string): Promise<{ data: LeaveRequest }> {
  return handleLeaveResponse<{ data: LeaveRequest }>(await fetch(`${LEAVE_BASE}/requests/${id}`));
}

export async function createLeaveRequest(body: { employeeId: string; leaveTypeId: string; startDate: string; endDate: string; workingDaysRequested?: number; reason?: string }): Promise<{ data: LeaveRequest }> {
  return handleLeaveResponse<{ data: LeaveRequest }>(
    await fetch(`${LEAVE_BASE}/requests`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  );
}

export async function approveLeaveRequest(requestId: string, action: "APPROVED" | "REJECTED", reason?: string): Promise<{ ok: boolean }> {
  return handleLeaveResponse<{ ok: boolean }>(
    await fetch(`${LEAVE_BASE}/requests/${requestId}/approve`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ action, reason }) }),
  );
}

export async function cancelLeaveRequest(requestId: string): Promise<{ ok: boolean }> {
  return handleLeaveResponse<{ ok: boolean }>(await fetch(`${LEAVE_BASE}/requests/${requestId}`, { method: "DELETE" }));
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
  const params = new URLSearchParams();
  if (filters?.employeeId) params.set("employeeId", filters.employeeId);
  if (filters?.leaveTypeId) params.set("leaveTypeId", filters.leaveTypeId);
  if (filters?.year !== undefined) params.set("year", String(filters.year));
  const qs = params.toString();
  return handleLeaveResponse<LeaveBalance[]>(await fetch(`${LEAVE_BASE}/balances${qs ? `?${qs}` : ""}`));
}

export async function initializeLeaveBalance(body: { employeeId: string; leaveTypeId: string; year?: number; allocatedDays: number }): Promise<{ data: LeaveBalance }> {
  return handleLeaveResponse<{ data: LeaveBalance }>(
    await fetch(`${LEAVE_BASE}/balances`, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) }),
  );
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
  const params = new URLSearchParams();
  if (filters?.startDate) params.set("startDate", filters.startDate);
  if (filters?.endDate) params.set("endDate", filters.endDate);
  if (filters?.employeeId) params.set("employeeId", filters.employeeId);
  const qs = params.toString();
  return handleLeaveResponse<CalendarEvent[]>(await fetch(`${LEAVE_BASE}/calendar${qs ? `?${qs}` : ""}`));
}
