import { type NextRequest } from "next/server";
import { withPermission } from "../../../../_security";
import { updateEmployeeDocument, deleteEmployeeDocument } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string; documentId: string }> },
) {
  const { documentId } = await params;
  const body = (await request.json()) as {
    documentType?: string;
    fileName?: string;
    fileUrl?: string;
    fileSize?: number;
    mimeType?: string;
    status?: string;
    expiryDate?: string;
    notes?: string;
  };

  const document = await updateEmployeeDocument(documentId, {
    documentType: body.documentType,
    fileName: body.fileName,
    fileUrl: body.fileUrl,
    fileSize: body.fileSize,
    mimeType: body.mimeType,
    status: body.status,
    expiryDate: body.expiryDate ? new Date(body.expiryDate) : undefined,
    notes: body.notes,
  });

  return Response.json({ data: document });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string; documentId: string }> },
) {
  const { documentId } = await params;
  const result = await deleteEmployeeDocument(documentId);
  return Response.json(result);
});
