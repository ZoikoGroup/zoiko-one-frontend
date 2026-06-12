import { prisma } from "@/lib/prisma";

export type EmployeeFilters = {
  search?: string;
  status?: string;
  employmentType?: string;
  departmentId?: string;
  locationId?: string;
  designationId?: string;
};

export type EmployeeListOptions = {
  filters?: EmployeeFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateEmployeeInput = {
  organizationId: string;
  tenantId: string;
  userId?: string;
  employeeId: string;
  firstName: string;
  lastName: string;
  email: string;
  personalEmail?: string;
  phoneNumber?: string;
  personalPhone?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  status?: string;
  employmentType?: string;
  joinDate: Date;
  createdBy?: string;
};

export type UpdateEmployeeInput = {
  firstName?: string;
  lastName?: string;
  email?: string;
  personalEmail?: string;
  phoneNumber?: string;
  personalPhone?: string;
  dateOfBirth?: Date;
  gender?: string;
  nationality?: string;
  profilePhotoUrl?: string;
  updatedBy?: string;
};

export type CreateProfileInput = {
  middleName?: string;
  preferredName?: string;
  suffix?: string;
  maritalStatus?: string;
  spouseName?: string;
  numberDependents?: number;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  linkedinUrl?: string;
  personalWebsite?: string;
  bio?: string;
  createdBy?: string;
};

export type UpdateProfileInput = {
  middleName?: string;
  preferredName?: string;
  suffix?: string;
  maritalStatus?: string;
  spouseName?: string;
  numberDependents?: number;
  bloodGroup?: string;
  allergies?: string;
  disabilities?: string;
  linkedinUrl?: string;
  personalWebsite?: string;
  bio?: string;
  updatedBy?: string;
};

export type CreateEmploymentRecordInput = {
  employeeId: string;
  tenantId: string;
  version?: number;
  employmentType?: string;
  employmentStatus?: string;
  jobTitle?: string;
  jobLevel?: string;
  designationId?: string;
  departmentId?: string;
  reportingToId?: string;
  divisionId?: string;
  businessUnitId?: string;
  locationId?: string;
  costCenterId?: string;
  wfhEligible?: boolean;
  wfhDays?: number;
  workingHours?: string;
  salaryAmount?: number;
  salaryCurrency?: string;
  paymentFrequency?: string;
  probationEndDate?: Date;
  changeReason: string;
  notes?: string;
  changedBy?: string;
};

export type CreateAddressInput = {
  employeeId: string;
  tenantId: string;
  type: string;
  isPrimary?: boolean;
  address?: string;
  apt?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country: string;
  createdBy?: string;
};

export type UpdateAddressInput = {
  type?: string;
  isPrimary?: boolean;
  address?: string;
  apt?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  updatedBy?: string;
};

export type CreateContactInput = {
  employeeId: string;
  tenantId: string;
  priority?: number;
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
};

export type UpdateContactInput = {
  priority?: number;
  firstName?: string;
  lastName?: string;
  relationship?: string;
  phoneNumber?: string;
  alternatePhone?: string;
  email?: string;
  address?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  notes?: string;
};

export type CreateDocumentInput = {
  employeeId: string;
  tenantId: string;
  documentType: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  status?: string;
  expiryDate?: Date;
  notes?: string;
  createdBy?: string;
};

export type UpdateDocumentInput = {
  documentType?: string;
  fileName?: string;
  fileUrl?: string;
  fileSize?: number;
  mimeType?: string;
  status?: string;
  expiryDate?: Date;
  notes?: string;
  updatedBy?: string;
};

export class WorkforceRepository {
  // ── Employee ──────────────────────────────────────────────

  countEmployees(tenantId: string, filters?: EmployeeFilters) {
    return prisma.employee.count({ where: this.buildEmployeeWhere(tenantId, filters) });
  }

  findEmployees(tenantId: string, options?: EmployeeListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "createdAt", orderDir = "desc" } = options ?? {};
    return prisma.employee.findMany({
      where: this.buildEmployeeWhere(tenantId, filters),
      include: {
        profile: true,
        employmentRecords: { where: { expiresAt: null }, take: 1, orderBy: { version: "desc" } },
      },
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
    });
  }

  findEmployeeById(tenantId: string, id: string) {
    return prisma.employee.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        profile: true,
        employmentRecords: { where: { expiresAt: null }, orderBy: { version: "desc" }, take: 1 },
        addresses: { where: { deletedAt: null } },
        emergencyContacts: { where: { deletedAt: null }, orderBy: { priority: "asc" } },
        identities: { where: { deletedAt: null, isActive: true } },
        documentReferences: { where: { deletedAt: null } },
        skillProfiles: { where: { deletedAt: null } },
        complianceFlags: true,
      },
    });
  }

  findEmployeeByEmail(tenantId: string, email: string) {
    return prisma.employee.findUnique({
      where: { tenantId_email: { tenantId, email } },
    });
  }

  findEmployeeByEmployeeId(organizationId: string, employeeId: string) {
    return prisma.employee.findUnique({
      where: { organizationId_employeeId: { organizationId, employeeId } },
    });
  }

  createEmployee(input: CreateEmployeeInput) {
    return prisma.employee.create({
      data: {
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        userId: input.userId,
        employeeId: input.employeeId,
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        personalEmail: input.personalEmail,
        phoneNumber: input.phoneNumber,
        personalPhone: input.personalPhone,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        nationality: input.nationality,
        status: input.status as never ?? "ACTIVE",
        employmentType: input.employmentType as never ?? "FULL_TIME",
        joinDate: input.joinDate,
        createdBy: input.createdBy,
      },
    });
  }

  updateEmployee(tenantId: string, id: string, input: UpdateEmployeeInput) {
    return prisma.employee.update({
      where: { id },
      data: {
        firstName: input.firstName,
        lastName: input.lastName,
        email: input.email,
        personalEmail: input.personalEmail,
        phoneNumber: input.phoneNumber,
        personalPhone: input.personalPhone,
        dateOfBirth: input.dateOfBirth,
        gender: input.gender,
        nationality: input.nationality,
        profilePhotoUrl: input.profilePhotoUrl,
        updatedBy: input.updatedBy,
      },
    });
  }

  softDeleteEmployee(tenantId: string, id: string, deletedBy: string, deletionReason?: string) {
    return prisma.employee.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  }

  private buildEmployeeWhere(tenantId: string, filters?: EmployeeFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };

    if (!filters) return where;

    if (filters.search) {
      where.OR = [
        { firstName: { contains: filters.search, mode: "insensitive" } },
        { lastName: { contains: filters.search, mode: "insensitive" } },
        { email: { contains: filters.search, mode: "insensitive" } },
        { employeeId: { contains: filters.search, mode: "insensitive" } },
      ];
    }

    if (filters.status) where.status = filters.status;
    if (filters.employmentType) where.employmentType = filters.employmentType;

    if (filters.departmentId || filters.locationId || filters.designationId) {
      where.employmentRecords = {
        some: {
          expiresAt: null,
          ...(filters.departmentId ? { departmentId: filters.departmentId } : {}),
          ...(filters.locationId ? { locationId: filters.locationId } : {}),
          ...(filters.designationId ? { designationId: filters.designationId } : {}),
        },
      };
    }

    return where;
  }

  // ── EmployeeProfile ──────────────────────────────────────

  findProfileByEmployeeId(tenantId: string, employeeId: string) {
    return prisma.employeeProfile.findFirst({
      where: { tenantId, employeeId },
    });
  }

  upsertProfile(employeeId: string, tenantId: string, input: UpdateProfileInput) {
    return prisma.employeeProfile.upsert({
      where: { employeeId },
      create: {
        employeeId,
        tenantId,
        middleName: input.middleName,
        preferredName: input.preferredName,
        suffix: input.suffix,
        maritalStatus: input.maritalStatus as never,
        spouseName: input.spouseName,
        numberDependents: input.numberDependents ?? 0,
        bloodGroup: input.bloodGroup,
        allergies: input.allergies,
        disabilities: input.disabilities,
        linkedinUrl: input.linkedinUrl,
        personalWebsite: input.personalWebsite,
        bio: input.bio,
        createdBy: input.updatedBy,
      },
      update: {
        middleName: input.middleName,
        preferredName: input.preferredName,
        suffix: input.suffix,
        maritalStatus: input.maritalStatus as never,
        spouseName: input.spouseName,
        numberDependents: input.numberDependents,
        bloodGroup: input.bloodGroup,
        allergies: input.allergies,
        disabilities: input.disabilities,
        linkedinUrl: input.linkedinUrl,
        personalWebsite: input.personalWebsite,
        bio: input.bio,
        updatedBy: input.updatedBy,
      },
    });
  }

  // ── EmploymentRecord ─────────────────────────────────────

  findRecordsByEmployeeId(tenantId: string, employeeId: string) {
    return prisma.employmentRecord.findMany({
      where: { tenantId, employeeId, deletedAt: null },
      orderBy: { version: "desc" },
    });
  }

  findCurrentRecord(tenantId: string, employeeId: string) {
    return prisma.employmentRecord.findFirst({
      where: { tenantId, employeeId, expiresAt: null, deletedAt: null },
      orderBy: { version: "desc" },
    });
  }

  findRecordById(tenantId: string, id: string) {
    return prisma.employmentRecord.findFirst({
      where: { tenantId, id, deletedAt: null },
    });
  }

  getNextVersion(employeeId: string) {
    return prisma.employmentRecord.findFirst({
      where: { employeeId },
      orderBy: { version: "desc" },
      select: { version: true },
    });
  }

  createRecord(input: CreateEmploymentRecordInput) {
    return prisma.employmentRecord.create({
      data: {
        employeeId: input.employeeId,
        tenantId: input.tenantId,
        version: input.version ?? 1,
        employmentType: input.employmentType as never ?? "FULL_TIME",
        employmentStatus: input.employmentStatus as never ?? "ACTIVE",
        jobTitle: input.jobTitle,
        jobLevel: input.jobLevel as never,
        designationId: input.designationId,
        departmentId: input.departmentId,
        reportingToId: input.reportingToId,
        divisionId: input.divisionId,
        businessUnitId: input.businessUnitId,
        locationId: input.locationId,
        costCenterId: input.costCenterId,
        wfhEligible: input.wfhEligible ?? false,
        wfhDays: input.wfhDays ?? 0,
        workingHours: input.workingHours as never ?? "FULL_TIME",
        salaryAmount: input.salaryAmount ?? 0,
        salaryCurrency: input.salaryCurrency ?? "USD",
        paymentFrequency: input.paymentFrequency as never ?? "MONTHLY",
        probationEndDate: input.probationEndDate,
        changeReason: input.changeReason as never,
        changedBy: input.changedBy,
        notes: input.notes,
        effectiveDate: new Date(),
      },
    });
  }

  expireCurrentRecord(tenantId: string, employeeId: string, expiresAt: Date) {
    return prisma.employmentRecord.updateMany({
      where: { tenantId, employeeId, expiresAt: null, deletedAt: null },
      data: { expiresAt },
    });
  }

  // ── EmployeeAddress ──────────────────────────────────────

  findAddressesByEmployeeId(tenantId: string, employeeId: string) {
    return prisma.employeeAddress.findMany({
      where: { tenantId, employeeId, deletedAt: null },
      orderBy: [{ isPrimary: "desc" }, { createdAt: "desc" }],
    });
  }

  findAddressById(tenantId: string, id: string) {
    return prisma.employeeAddress.findFirst({
      where: { tenantId, id, deletedAt: null },
    });
  }

  createAddress(input: CreateAddressInput) {
    return prisma.employeeAddress.create({
      data: {
        employeeId: input.employeeId,
        tenantId: input.tenantId,
        type: input.type as never,
        isPrimary: input.isPrimary ?? false,
        address: input.address,
        apt: input.apt,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        createdBy: input.createdBy,
      },
    });
  }

  updateAddress(tenantId: string, id: string, input: UpdateAddressInput) {
    return prisma.employeeAddress.update({
      where: { id },
      data: {
        type: input.type as never,
        isPrimary: input.isPrimary,
        address: input.address,
        apt: input.apt,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        updatedBy: input.updatedBy,
      },
    });
  }

  softDeleteAddress(tenantId: string, id: string) {
    return prisma.employeeAddress.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  unsetPrimaryAddresses(tenantId: string, employeeId: string, type: string) {
    return prisma.employeeAddress.updateMany({
      where: { tenantId, employeeId, type: type as never, isPrimary: true, deletedAt: null },
      data: { isPrimary: false },
    });
  }

  // ── EmergencyContact ─────────────────────────────────────

  findContactsByEmployeeId(tenantId: string, employeeId: string) {
    return prisma.emergencyContact.findMany({
      where: { tenantId, employeeId, deletedAt: null },
      orderBy: { priority: "asc" },
    });
  }

  findContactById(tenantId: string, id: string) {
    return prisma.emergencyContact.findFirst({
      where: { tenantId, id, deletedAt: null },
    });
  }

  getMaxContactPriority(employeeId: string) {
    return prisma.emergencyContact.findFirst({
      where: { employeeId, deletedAt: null },
      orderBy: { priority: "desc" },
      select: { priority: true },
    });
  }

  createContact(input: CreateContactInput) {
    return prisma.emergencyContact.create({
      data: {
        employeeId: input.employeeId,
        tenantId: input.tenantId,
        priority: input.priority ?? 1,
        firstName: input.firstName,
        lastName: input.lastName,
        relationship: input.relationship as never,
        phoneNumber: input.phoneNumber,
        alternatePhone: input.alternatePhone,
        email: input.email,
        address: input.address,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        notes: input.notes,
      },
    });
  }

  updateContact(tenantId: string, id: string, input: UpdateContactInput) {
    return prisma.emergencyContact.update({
      where: { id },
      data: {
        priority: input.priority,
        firstName: input.firstName,
        lastName: input.lastName,
        relationship: input.relationship as never,
        phoneNumber: input.phoneNumber,
        alternatePhone: input.alternatePhone,
        email: input.email,
        address: input.address,
        city: input.city,
        state: input.state,
        postalCode: input.postalCode,
        country: input.country,
        notes: input.notes,
      },
    });
  }

  softDeleteContact(tenantId: string, id: string) {
    return prisma.emergencyContact.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }

  // ── EmployeeDocumentReference ────────────────────────────

  findDocumentsByEmployeeId(tenantId: string, employeeId: string) {
    return prisma.employeeDocumentReference.findMany({
      where: { tenantId, employeeId, deletedAt: null },
      orderBy: { createdAt: "desc" },
    });
  }

  findDocumentById(tenantId: string, id: string) {
    return prisma.employeeDocumentReference.findFirst({
      where: { tenantId, id, deletedAt: null },
    });
  }

  createDocument(input: CreateDocumentInput) {
    return prisma.employeeDocumentReference.create({
      data: {
        employeeId: input.employeeId,
        tenantId: input.tenantId,
        documentType: input.documentType as never,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        status: input.status as never ?? "PENDING",
        expiryDate: input.expiryDate,
        notes: input.notes,
        createdBy: input.createdBy,
      },
    });
  }

  updateDocument(tenantId: string, id: string, input: UpdateDocumentInput) {
    return prisma.employeeDocumentReference.update({
      where: { id },
      data: {
        documentType: input.documentType as never,
        fileName: input.fileName,
        fileUrl: input.fileUrl,
        fileSize: input.fileSize,
        mimeType: input.mimeType,
        status: input.status as never,
        expiryDate: input.expiryDate,
        notes: input.notes,
        updatedBy: input.updatedBy,
      },
    });
  }

  softDeleteDocument(tenantId: string, id: string) {
    return prisma.employeeDocumentReference.update({
      where: { id },
      data: { deletedAt: new Date() },
    });
  }
}

export const workforceRepository = new WorkforceRepository();
