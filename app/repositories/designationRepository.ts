import { prisma } from "@/lib/prisma";

export type DesignationFilters = {
  search?: string;
  status?: string;
  level?: string;
  category?: string;
  departmentId?: string;
};

export type DesignationListOptions = {
  filters?: DesignationFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateDesignationInput = {
  organizationId: string;
  tenantId: string;
  title: string;
  code: string;
  level: string;
  category: string;
  grade?: string;
  description?: string;
  minSalary?: number;
  maxSalary?: number;
  departmentId?: string;
  createdBy?: string;
};

export type UpdateDesignationInput = {
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
  updatedBy?: string;
};

export class DesignationRepository {
  countDesignations(tenantId: string, filters?: DesignationFilters) {
    return prisma.designation.count({ where: this.buildDesignationWhere(tenantId, filters) });
  }

  findDesignations(tenantId: string, options?: DesignationListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "createdAt", orderDir = "desc" } = options ?? {};
    return prisma.designation.findMany({
      where: this.buildDesignationWhere(tenantId, filters),
      include: { department: { select: { id: true, name: true, code: true } } },
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
    });
  }

  findDesignationById(tenantId: string, id: string) {
    return prisma.designation.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        department: { select: { id: true, name: true, code: true } },
      },
    });
  }

  findDesignationByTitle(tenantId: string, organizationId: string, title: string, excludeId?: string) {
    return prisma.designation.findFirst({
      where: { tenantId, organizationId, title, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
  }

  findDesignationByCode(tenantId: string, organizationId: string, code: string, excludeId?: string) {
    return prisma.designation.findFirst({
      where: { tenantId, organizationId, code, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
  }

  createDesignation(input: CreateDesignationInput) {
    return prisma.designation.create({
      data: {
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        title: input.title,
        code: input.code,
        level: input.level as never,
        category: input.category as never,
        grade: input.grade,
        description: input.description,
        minSalary: input.minSalary ?? 0,
        maxSalary: input.maxSalary ?? 0,
        departmentId: input.departmentId,
        status: "ACTIVE" as never,
        createdBy: input.createdBy,
      },
    });
  }

  updateDesignation(tenantId: string, id: string, input: UpdateDesignationInput) {
    return prisma.designation.update({
      where: { id },
      data: {
        title: input.title,
        code: input.code,
        level: input.level as never,
        category: input.category as never,
        grade: input.grade,
        description: input.description,
        minSalary: input.minSalary,
        maxSalary: input.maxSalary,
        departmentId: input.departmentId,
        status: input.status as never,
        updatedBy: input.updatedBy,
      },
    });
  }

  softDeleteDesignation(tenantId: string, id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.designation.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  }

  private buildDesignationWhere(tenantId: string, filters?: DesignationFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (!filters) return where;
    if (filters.search) {
      where.OR = [
        { title: { contains: filters.search, mode: "insensitive" } },
        { code: { contains: filters.search, mode: "insensitive" } },
      ];
    }
    if (filters.status) where.status = filters.status;
    if (filters.level) where.level = filters.level;
    if (filters.category) where.category = filters.category;
    if (filters.departmentId) where.departmentId = filters.departmentId;
    return where;
  }
}

export const designationRepository = new DesignationRepository();
