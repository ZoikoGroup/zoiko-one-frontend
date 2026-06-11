import { prisma } from "@/lib/prisma";

export type DepartmentFilters = {
  search?: string;
  status?: string;
};

export type DepartmentListOptions = {
  filters?: DepartmentFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
};

export type CreateDepartmentInput = {
  organizationId: string;
  tenantId: string;
  name: string;
  code: string;
  description?: string;
  parentDeptId?: string;
  headEmployeeId?: string;
  budget?: number;
  createdBy?: string;
};

export type UpdateDepartmentInput = {
  name?: string;
  code?: string;
  description?: string;
  parentDeptId?: string;
  headEmployeeId?: string;
  budget?: number;
  status?: string;
  updatedBy?: string;
};

export class DepartmentRepository {
  countDepartments(tenantId: string, filters?: DepartmentFilters) {
    return prisma.department.count({ where: this.buildDepartmentWhere(tenantId, filters) });
  }

  findDepartments(tenantId: string, options?: DepartmentListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "createdAt", orderDir = "desc" } = options ?? {};
    return prisma.department.findMany({
      where: this.buildDepartmentWhere(tenantId, filters),
      include: { parentDept: { select: { id: true, name: true, code: true } }, headEmployee: { select: { id: true, firstName: true, lastName: true } } },
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
    });
  }

  findDepartmentById(tenantId: string, id: string) {
    return prisma.department.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        parentDept: { select: { id: true, name: true, code: true } },
        childDepartments: { where: { deletedAt: null }, select: { id: true, name: true, code: true, status: true } },
        headEmployee: { select: { id: true, firstName: true, lastName: true, email: true } },
        designations: { where: { deletedAt: null }, include: { department: { select: { id: true, name: true } } } },
      },
    });
  }

  findDepartmentByName(tenantId: string, organizationId: string, name: string, excludeId?: string) {
    return prisma.department.findFirst({
      where: { tenantId, organizationId, name, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
  }

  findDepartmentByCode(tenantId: string, organizationId: string, code: string, excludeId?: string) {
    return prisma.department.findFirst({
      where: { tenantId, organizationId, code, deletedAt: null, ...(excludeId ? { id: { not: excludeId } } : {}) },
    });
  }

  createDepartment(input: CreateDepartmentInput) {
    return prisma.department.create({
      data: {
        organizationId: input.organizationId,
        tenantId: input.tenantId,
        name: input.name,
        code: input.code,
        description: input.description,
        parentDeptId: input.parentDeptId,
        headEmployeeId: input.headEmployeeId,
        budget: input.budget ?? 0,
        status: "ACTIVE" as never,
        createdBy: input.createdBy,
      },
    });
  }

  updateDepartment(tenantId: string, id: string, input: UpdateDepartmentInput) {
    return prisma.department.update({
      where: { id },
      data: {
        name: input.name,
        code: input.code,
        description: input.description,
        parentDeptId: input.parentDeptId,
        headEmployeeId: input.headEmployeeId,
        budget: input.budget,
        status: input.status as never,
        updatedBy: input.updatedBy,
      },
    });
  }

  softDeleteDepartment(tenantId: string, id: string, deletedBy?: string, deletionReason?: string) {
    return prisma.department.update({
      where: { id },
      data: { deletedAt: new Date(), deletedBy, deletionReason },
    });
  }

  private buildDepartmentWhere(tenantId: string, filters?: DepartmentFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (!filters) return where;
    if (filters.search) {
      where.OR = [
        { name: { contains: filters.search } },
        { code: { contains: filters.search } },
      ];
    }
    if (filters.status) where.status = filters.status;
    return where;
  }
}

export const departmentRepository = new DepartmentRepository();
