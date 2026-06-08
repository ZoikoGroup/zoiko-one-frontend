import { prisma } from "@/lib/prisma";

export type DocumentFilters = {
  search?: string;
  documentType?: string;
  status?: string;
  employeeId?: string;
};

export type DocumentListOptions = {
  filters?: DocumentFilters;
  skip?: number;
  take?: number;
  orderBy?: string;
  orderDir?: "asc" | "desc";
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

export class DocumentRepository {
  countDocuments(tenantId: string, filters?: DocumentFilters) {
    return prisma.employeeDocumentReference.count({
      where: this.buildWhere(tenantId, filters),
    });
  }

  findDocuments(tenantId: string, options?: DocumentListOptions) {
    const { filters, skip = 0, take = 25, orderBy = "createdAt", orderDir = "desc" } = options ?? {};
    return prisma.employeeDocumentReference.findMany({
      where: this.buildWhere(tenantId, filters),
      include: {
        employee: {
          select: { id: true, employeeId: true, firstName: true, lastName: true, email: true },
        },
      },
      skip,
      take,
      orderBy: { [orderBy]: orderDir },
    });
  }

  findDocumentById(tenantId: string, id: string) {
    return prisma.employeeDocumentReference.findFirst({
      where: { tenantId, id, deletedAt: null },
      include: {
        employee: {
          select: { id: true, employeeId: true, firstName: true, lastName: true, email: true },
        },
      },
    });
  }

  findDocumentsByEmployeeId(tenantId: string, employeeId: string) {
    return prisma.employeeDocumentReference.findMany({
      where: { tenantId, employeeId, deletedAt: null },
      orderBy: { createdAt: "desc" },
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
        status: (input.status as never) ?? "PENDING",
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

  private buildWhere(tenantId: string, filters?: DocumentFilters) {
    const where: Record<string, unknown> = { tenantId, deletedAt: null };
    if (!filters) return where;
    if (filters.employeeId) where.employeeId = filters.employeeId;
    if (filters.documentType) where.documentType = filters.documentType;
    if (filters.status) where.status = filters.status;
    if (filters.search) {
      where.OR = [
        { fileName: { contains: filters.search, mode: "insensitive" } },
        { notes: { contains: filters.search, mode: "insensitive" } },
        { employee: { firstName: { contains: filters.search, mode: "insensitive" } } },
        { employee: { lastName: { contains: filters.search, mode: "insensitive" } } },
      ];
    }
    return where;
  }
}

export const documentRepository = new DocumentRepository();
