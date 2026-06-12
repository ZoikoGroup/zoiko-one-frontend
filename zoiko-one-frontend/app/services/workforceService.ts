import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { workforceRepository } from "@/app/repositories/workforceRepository";
import type { UpdateEmployeeInput, UpdateProfileInput, UpdateAddressInput, UpdateContactInput, UpdateDocumentInput, EmployeeListOptions } from "@/app/repositories/workforceRepository";

// ── Helpers ────────────────────────────────────────────────

function generateEmployeeId(): string {
  const rand = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `EMP-${rand}`;
}

function validateEmail(email: string): string | null {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email)) return "Invalid email format.";
  return null;
}

function validateRequired(value: unknown, field: string): string | null {
  if (value === undefined || value === null || value === "") return `${field} is required.`;
  return null;
}

function validateJoinDate(date: Date): string | null {
  if (date > new Date()) return "Join date cannot be in the future.";
  return null;
}

function collectErrors(checks: (string | null)[]): string[] {
  return checks.filter((c): c is string => c !== null);
}

// ── Audit Helper ───────────────────────────────────────────

async function writeAudit(params: {
  tenantId: string;
  userId?: string;
  action: string;
  resourceType: string;
  resourceId?: string;
  resourceName?: string;
  details?: Record<string, unknown>;
}) {
  const { prisma } = await import("@/lib/prisma");
  await prisma.auditLog.create({
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

// ── Employee ───────────────────────────────────────────────

export async function listEmployees(options?: EmployeeListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const tenantId = options?.tenantId ?? ctx.tenantId;
  const employees = await workforceRepository.findEmployees(tenantId, options);
  const total = await workforceRepository.countEmployees(tenantId, options?.filters);

  return {
    data: employees,
    total,
    skip: options?.skip ?? 0,
    take: options?.take ?? 25,
  };
}

export async function getEmployee(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const employee = await workforceRepository.findEmployeeById(ctx.tenantId, id);
  if (!employee) throw new AuthorizationError("Employee not found.", 404);

  return employee;
}

export async function createEmployee(input: {
  organizationId: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string;
  phoneNumber?: string;
  personalPhone?: string;
  joinDate: string;
  employmentType?: string;
  gender?: string;
  nationality?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const errors = collectErrors([
    validateRequired(input.organizationId, "organizationId"),
    validateRequired(input.firstName, "firstName"),
    validateRequired(input.lastName, "lastName"),
    validateRequired(input.email, "email"),
    validateRequired(input.joinDate, "joinDate"),
    input.email ? validateEmail(input.email) : null,
    input.joinDate ? validateJoinDate(new Date(input.joinDate)) : null,
  ]);
  if (errors.length > 0) {
    throw new AuthorizationError(errors.join(" "), 400);
  }

  const existing = await workforceRepository.findEmployeeByEmail(ctx.tenantId, input.email.toLowerCase());
  if (existing) {
    throw new AuthorizationError("An employee with this email already exists.", 409);
  }

  const employeeId = generateEmployeeId();

  const employee = await workforceRepository.createEmployee({
    organizationId: input.organizationId,
    tenantId: ctx.tenantId,
    employeeId,
    firstName: input.firstName,
    lastName: input.lastName,
    email: input.email.toLowerCase(),
    personalEmail: input.personalEmail,
    phoneNumber: input.phoneNumber,
    personalPhone: input.personalPhone,
    joinDate: new Date(input.joinDate),
    employmentType: input.employmentType,
    gender: input.gender,
    nationality: input.nationality,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Employee created",
    resourceType: "Employee",
    resourceId: employee.id,
    resourceName: `${input.firstName} ${input.lastName}`,
    details: { employeeId },
  });

  return employee;
}

export async function updateEmployee(id: string, input: UpdateEmployeeInput) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findEmployeeById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Employee not found.", 404);

  if (input.email) {
    const emailError = validateEmail(input.email);
    if (emailError) throw new AuthorizationError(emailError, 400);

    const dupe = await workforceRepository.findEmployeeByEmail(ctx.tenantId, input.email.toLowerCase());
    if (dupe && dupe.id !== id) {
      throw new AuthorizationError("An employee with this email already exists.", 409);
    }
  }

  const employee = await workforceRepository.updateEmployee(ctx.tenantId, id, {
    ...input,
    email: input.email?.toLowerCase(),
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Employee updated",
    resourceType: "Employee",
    resourceId: id,
    resourceName: `${existing.firstName} ${existing.lastName}`,
    details: { changes: Object.keys(input) },
  });

  return employee;
}

export async function deleteEmployee(id: string, reason?: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findEmployeeById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Employee not found.", 404);

  await workforceRepository.softDeleteEmployee(ctx.tenantId, id, ctx.userId, reason);

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Employee deleted",
    resourceType: "Employee",
    resourceId: id,
    resourceName: `${existing.firstName} ${existing.lastName}`,
    details: { reason },
  });

  return { ok: true };
}

// ── EmployeeProfile ───────────────────────────────────────

export async function getEmployeeProfile(employeeId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const profile = await workforceRepository.findProfileByEmployeeId(ctx.tenantId, employeeId);
  if (!profile) throw new AuthorizationError("Profile not found.", 404);

  return profile;
}

export async function upsertEmployeeProfile(employeeId: string, input: UpdateProfileInput) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findEmployeeById(ctx.tenantId, employeeId);
  if (!existing) throw new AuthorizationError("Employee not found.", 404);

  const profile = await workforceRepository.upsertProfile(employeeId, ctx.tenantId, {
    ...input,
    updatedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Employee profile updated",
    resourceType: "EmployeeProfile",
    resourceId: employeeId,
    resourceName: `${existing.firstName} ${existing.lastName}`,
    details: { changes: Object.keys(input) },
  });

  return profile;
}

// ── EmploymentRecord ──────────────────────────────────────

export async function listEmploymentRecords(employeeId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const records = await workforceRepository.findRecordsByEmployeeId(ctx.tenantId, employeeId);
  return records;
}

export async function getCurrentEmploymentRecord(employeeId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const record = await workforceRepository.findCurrentRecord(ctx.tenantId, employeeId);
  if (!record) throw new AuthorizationError("No active employment record found.", 404);

  return record;
}

export async function createEmploymentRecord(employeeId: string, input: {
  jobTitle?: string;
  jobLevel?: string;
  designationId?: string;
  departmentId?: string;
  reportingToId?: string;
  divisionId?: string;
  businessUnitId?: string;
  locationId?: string;
  costCenterId?: string;
  employmentType?: string;
  employmentStatus?: string;
  wfhEligible?: boolean;
  wfhDays?: number;
  salaryAmount?: number;
  salaryCurrency?: string;
  paymentFrequency?: string;
  changeReason: string;
  notes?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findEmployeeById(ctx.tenantId, employeeId);
  if (!existing) throw new AuthorizationError("Employee not found.", 404);

  const errors = collectErrors([
    validateRequired(input.changeReason, "changeReason"),
  ]);
  if (errors.length > 0) {
    throw new AuthorizationError(errors.join(" "), 400);
  }

  const lastVersion = await workforceRepository.getNextVersion(employeeId);
  const nextVersion = (lastVersion?.version ?? 0) + 1;

  await workforceRepository.expireCurrentRecord(ctx.tenantId, employeeId, new Date());

  const record = await workforceRepository.createRecord({
    employeeId,
    tenantId: ctx.tenantId,
    version: nextVersion,
    ...input,
    changedBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Employment record created",
    resourceType: "EmploymentRecord",
    resourceId: record.id,
    resourceName: `${existing.firstName} ${existing.lastName}`,
    details: { changeReason: input.changeReason, version: nextVersion },
  });

  return record;
}

// ── EmployeeAddress ────────────────────────────────────────

export async function listEmployeeAddresses(employeeId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return workforceRepository.findAddressesByEmployeeId(ctx.tenantId, employeeId);
}

export async function createEmployeeAddress(employeeId: string, input: {
  type: string;
  isPrimary?: boolean;
  address?: string;
  apt?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findEmployeeById(ctx.tenantId, employeeId);
  if (!existing) throw new AuthorizationError("Employee not found.", 404);

  const errors = collectErrors([
    validateRequired(input.type, "type"),
    validateRequired(input.country, "country"),
  ]);
  if (errors.length > 0) {
    throw new AuthorizationError(errors.join(" "), 400);
  }

  if (input.isPrimary) {
    await workforceRepository.unsetPrimaryAddresses(ctx.tenantId, employeeId, input.type);
  }

  const address = await workforceRepository.createAddress({
    employeeId,
    tenantId: ctx.tenantId,
    ...input,
    createdBy: ctx.userId,
  });

  return address;
}

export async function updateEmployeeAddress(addressId: string, input: UpdateAddressInput) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findAddressById(ctx.tenantId, addressId);
  if (!existing) throw new AuthorizationError("Address not found.", 404);

  if (input.isPrimary) {
    await workforceRepository.unsetPrimaryAddresses(ctx.tenantId, existing.employeeId, input.type ?? existing.type);
  }

  return workforceRepository.updateAddress(ctx.tenantId, addressId, { ...input, updatedBy: ctx.userId });
}

export async function deleteEmployeeAddress(addressId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findAddressById(ctx.tenantId, addressId);
  if (!existing) throw new AuthorizationError("Address not found.", 404);

  await workforceRepository.softDeleteAddress(ctx.tenantId, addressId);
  return { ok: true };
}

// ── EmergencyContact ───────────────────────────────────────

export async function listEmergencyContacts(employeeId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return workforceRepository.findContactsByEmployeeId(ctx.tenantId, employeeId);
}

export async function createEmergencyContact(employeeId: string, input: {
  firstName: string;
  lastName: string;
  relationship: string;
  phoneNumber: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findEmployeeById(ctx.tenantId, employeeId);
  if (!existing) throw new AuthorizationError("Employee not found.", 404);

  const errors = collectErrors([
    validateRequired(input.firstName, "firstName"),
    validateRequired(input.lastName, "lastName"),
    validateRequired(input.relationship, "relationship"),
    validateRequired(input.phoneNumber, "phoneNumber"),
  ]);
  if (errors.length > 0) {
    throw new AuthorizationError(errors.join(" "), 400);
  }

  const maxPriority = await workforceRepository.getMaxContactPriority(employeeId);
  const priority = (maxPriority?.priority ?? 0) + 1;

  const contact = await workforceRepository.createContact({
    employeeId,
    tenantId: ctx.tenantId,
    ...input,
    priority,
  });

  return contact;
}

export async function updateEmergencyContact(contactId: string, input: UpdateContactInput) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findContactById(ctx.tenantId, contactId);
  if (!existing) throw new AuthorizationError("Emergency contact not found.", 404);

  return workforceRepository.updateContact(ctx.tenantId, contactId, input);
}

export async function deleteEmergencyContact(contactId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findContactById(ctx.tenantId, contactId);
  if (!existing) throw new AuthorizationError("Emergency contact not found.", 404);

  await workforceRepository.softDeleteContact(ctx.tenantId, contactId);
  return { ok: true };
}

// ── EmployeeDocumentReference ──────────────────────────────

export async function listEmployeeDocuments(employeeId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  return workforceRepository.findDocumentsByEmployeeId(ctx.tenantId, employeeId);
}

export async function createEmployeeDocument(employeeId: string, input: {
  documentType: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  status?: string;
  expiryDate?: string;
  notes?: string;
}) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findEmployeeById(ctx.tenantId, employeeId);
  if (!existing) throw new AuthorizationError("Employee not found.", 404);

  const errors = collectErrors([
    validateRequired(input.documentType, "documentType"),
  ]);
  if (errors.length > 0) {
    throw new AuthorizationError(errors.join(" "), 400);
  }

  const doc = await workforceRepository.createDocument({
    employeeId,
    tenantId: ctx.tenantId,
    documentType: input.documentType,
    fileName: input.fileName,
    fileUrl: input.fileUrl,
    fileSize: input.fileSize,
    mimeType: input.mimeType,
    status: input.status,
    expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
    notes: input.notes,
    createdBy: ctx.userId,
  });

  await writeAudit({
    tenantId: ctx.tenantId,
    userId: ctx.userId,
    action: "Employee document uploaded",
    resourceType: "EmployeeDocumentReference",
    resourceId: doc.id,
    resourceName: input.fileName ?? input.documentType,
  });

  return doc;
}

export async function updateEmployeeDocument(documentId: string, input: UpdateDocumentInput) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findDocumentById(ctx.tenantId, documentId);
  if (!existing) throw new AuthorizationError("Document not found.", 404);

  return workforceRepository.updateDocument(ctx.tenantId, documentId, {
    ...input,
    expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
    updatedBy: ctx.userId,
  });
}

export async function deleteEmployeeDocument(documentId: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await workforceRepository.findDocumentById(ctx.tenantId, documentId);
  if (!existing) throw new AuthorizationError("Document not found.", 404);

  await workforceRepository.softDeleteDocument(ctx.tenantId, documentId);
  return { ok: true };
}
