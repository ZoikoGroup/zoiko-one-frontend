import { apiFetch, buildUrl } from "./client";

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

export type EmployeeDocument = {
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
  employee?: {
    id: string;
    employeeId: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
};

export interface DocumentListResponse {
  data: EmployeeDocument[];
  total: number;
  skip: number;
  take: number;
}

export interface DocumentFilters {
  search?: string;
  documentType?: string;
  status?: string;
  employeeId?: string;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
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

export async function fetchEmployees(filters: EmployeeFilters = {}): Promise<EmployeeListResponse> {
  const qs = buildUrl(BASE, {
    search: filters.search,
    status: filters.status,
    employmentType: filters.employmentType,
    skip: filters.skip,
    take: filters.take,
    orderBy: filters.orderBy,
    orderDir: filters.orderDir,
  });
  const url = qs === BASE ? BASE : qs;
  return apiFetch<EmployeeListResponse>(url);
}

export async function fetchEmployee(id: string): Promise<{ data: Employee }> {
  return apiFetch<{ data: Employee }>(`${BASE}/${id}`);
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
  return apiFetch<{ data: Employee }>(BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
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
  return apiFetch<{ data: Employee }>(`${BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteEmployee(id: string, reason?: string): Promise<{ ok: boolean }> {
  const url = reason ? `${BASE}/${id}?reason=${encodeURIComponent(reason)}` : `${BASE}/${id}`;
  return apiFetch<{ ok: boolean }>(url, { method: "DELETE" });
}

export async function fetchEmployeeProfile(employeeId: string): Promise<EmployeeProfile> {
  return apiFetch<EmployeeProfile>(`${BASE}/${employeeId}/profile`);
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
  return apiFetch<EmployeeProfile>(`${BASE}/${employeeId}/profile`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function fetchEmploymentRecords(employeeId: string): Promise<EmploymentRecord[]> {
  return apiFetch<EmploymentRecord[]>(`${BASE}/${employeeId}/employment-records`);
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
  return apiFetch<EmploymentRecord>(`${BASE}/${employeeId}/employment-records`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function fetchEmployeeDocuments(employeeId: string): Promise<EmployeeDocument[]> {
  return apiFetch<EmployeeDocument[]>(`${BASE}/${employeeId}/documents`);
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
  return apiFetch<EmployeeDocument>(`${BASE}/${employeeId}/documents`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function deleteEmployeeDocument(employeeId: string, documentId: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${BASE}/${employeeId}/documents/${documentId}`, {
    method: "DELETE",
  });
}

export async function fetchEmergencyContacts(employeeId: string): Promise<EmergencyContact[]> {
  return apiFetch<EmergencyContact[]>(`${BASE}/${employeeId}/emergency-contacts`);
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
  return apiFetch<EmergencyContact>(`${BASE}/${employeeId}/emergency-contacts`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function deleteEmergencyContact(employeeId: string, contactId: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${BASE}/${employeeId}/emergency-contacts/${contactId}`, {
    method: "DELETE",
  });
}

export async function fetchEmployeeAddresses(employeeId: string): Promise<EmployeeAddress[]> {
  return apiFetch<EmployeeAddress[]>(`${BASE}/${employeeId}/addresses`);
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
  return apiFetch<EmployeeAddress>(`${BASE}/${employeeId}/addresses`, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function deleteEmployeeAddress(employeeId: string, addressId: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${BASE}/${employeeId}/addresses/${addressId}`, {
    method: "DELETE",
  });
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

export async function fetchDepartments(filters?: DepartmentFilters & { skip?: number; take?: number; orderBy?: string; orderDir?: string }): Promise<DepartmentListResponse> {
  const qs = buildUrl(DEPARTMENT_BASE, {
    search: filters?.search,
    status: filters?.status,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === DEPARTMENT_BASE ? DEPARTMENT_BASE : qs;
  return apiFetch<DepartmentListResponse>(url);
}

export async function fetchDepartment(id: string): Promise<{ data: Department }> {
  return apiFetch<{ data: Department }>(`${DEPARTMENT_BASE}/${id}`);
}

export async function createDepartment(body: {
  name: string;
  code: string;
  description?: string;
  parentDeptId?: string;
  headEmployeeId?: string;
  budget?: number;
}): Promise<{ data: Department }> {
  return apiFetch<{ data: Department }>(DEPARTMENT_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
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
  return apiFetch<{ data: Department }>(`${DEPARTMENT_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteDepartment(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${DEPARTMENT_BASE}/${id}`, { method: "DELETE" });
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

export async function fetchDesignations(filters?: DesignationFilters & { skip?: number; take?: number; orderBy?: string; orderDir?: string }): Promise<DesignationListResponse> {
  const qs = buildUrl(DESIGNATION_BASE, {
    search: filters?.search,
    status: filters?.status,
    level: filters?.level,
    category: filters?.category,
    departmentId: filters?.departmentId,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === DESIGNATION_BASE ? DESIGNATION_BASE : qs;
  return apiFetch<DesignationListResponse>(url);
}

export async function fetchDesignation(id: string): Promise<{ data: Designation }> {
  return apiFetch<{ data: Designation }>(`${DESIGNATION_BASE}/${id}`);
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
  return apiFetch<{ data: Designation }>(DESIGNATION_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
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
  return apiFetch<{ data: Designation }>(`${DESIGNATION_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteDesignation(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${DESIGNATION_BASE}/${id}`, { method: "DELETE" });
}

// ── Document Management (Standalone) ─────────────────────

const DOCUMENTS_BASE = "/api/zoiko-hr/documents";

export async function fetchDocuments(filters?: DocumentFilters): Promise<DocumentListResponse> {
  const qs = buildUrl(DOCUMENTS_BASE, {
    search: filters?.search,
    documentType: filters?.documentType,
    status: filters?.status,
    employeeId: filters?.employeeId,
    skip: filters?.skip,
    take: filters?.take,
    orderBy: filters?.orderBy,
    orderDir: filters?.orderDir,
  });
  const url = qs === DOCUMENTS_BASE ? DOCUMENTS_BASE : qs;
  return apiFetch<DocumentListResponse>(url);
}

export async function getDocument(id: string): Promise<{ data: EmployeeDocument }> {
  return apiFetch<{ data: EmployeeDocument }>(`${DOCUMENTS_BASE}/${id}`);
}

export async function createDocument(body: {
  employeeId: string;
  documentType: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  status?: string;
  expiryDate?: string;
  notes?: string;
}): Promise<{ data: EmployeeDocument }> {
  return apiFetch<{ data: EmployeeDocument }>(DOCUMENTS_BASE, {
    method: "POST",
    body: JSON.stringify(body),
  });
}

export async function updateDocument(id: string, body: {
  documentType?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  status?: string;
  expiryDate?: string;
  notes?: string;
}): Promise<{ data: EmployeeDocument }> {
  return apiFetch<{ data: EmployeeDocument }>(`${DOCUMENTS_BASE}/${id}`, {
    method: "PUT",
    body: JSON.stringify(body),
  });
}

export async function deleteDocument(id: string): Promise<{ ok: boolean }> {
  return apiFetch<{ ok: boolean }>(`${DOCUMENTS_BASE}/${id}`, { method: "DELETE" });
}
