import { getCurrentSecurityContext, AuthorizationError } from "@/app/services/securityService";
import { documentRepository, type DocumentListOptions } from "@/app/repositories/documentRepository";
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

export async function listDocuments(options?: DocumentListOptions & { tenantId?: string }) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const tenantId = options?.tenantId ?? ctx.tenantId;
  const documents = await documentRepository.findDocuments(tenantId, options);
  const total = await documentRepository.countDocuments(tenantId, options?.filters);

  return { data: documents, total, skip: options?.skip ?? 0, take: options?.take ?? 25 };
}

export async function getDocument(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const document = await documentRepository.findDocumentById(ctx.tenantId, id);
  if (!document) throw new AuthorizationError("Document not found.", 404);

  return document;
}

export async function createDocument(input: {
  employeeId: string;
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

  const existing = await prisma.employee.findFirst({
    where: { id: input.employeeId, tenantId: ctx.tenantId, deletedAt: null },
  });
  if (!existing) throw new AuthorizationError("Employee not found.", 404);

  const errors = collectErrors([
    validateRequired(input.documentType, "documentType"),
    validateRequired(input.employeeId, "employeeId"),
  ]);
  if (errors.length > 0) {
    throw new AuthorizationError(errors.join(" "), 400);
  }

  const doc = await documentRepository.createDocument({
    employeeId: input.employeeId,
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
    action: "Document uploaded",
    resourceType: "EmployeeDocumentReference",
    resourceId: doc.id,
    resourceName: input.fileName ?? input.documentType,
  });

  return doc;
}

export async function updateDocument(id: string, input: {
  documentType?: string;
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

  const existing = await documentRepository.findDocumentById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Document not found.", 404);

  return documentRepository.updateDocument(ctx.tenantId, id, {
    ...input,
    expiryDate: input.expiryDate ? new Date(input.expiryDate) : undefined,
    updatedBy: ctx.userId,
  });
}

export async function deleteDocument(id: string) {
  const ctx = await getCurrentSecurityContext();
  if (!ctx) throw new AuthorizationError("Unauthorized.", 401);

  const existing = await documentRepository.findDocumentById(ctx.tenantId, id);
  if (!existing) throw new AuthorizationError("Document not found.", 404);

  await documentRepository.softDeleteDocument(ctx.tenantId, id);
  return { ok: true };
}
