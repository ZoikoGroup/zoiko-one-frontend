import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { getDocument, updateDocument, deleteDocument } from "@/app/services/documentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const document = await getDocument(documentId);
  return Response.json({ data: document });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
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

  const document = await updateDocument(documentId, {
    documentType: body.documentType,
    fileName: body.fileName,
    fileUrl: body.fileUrl,
    fileSize: body.fileSize,
    mimeType: body.mimeType,
    status: body.status,
    expiryDate: body.expiryDate,
    notes: body.notes,
  });

  return Response.json({ data: document });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ documentId: string }> },
) {
  const { documentId } = await params;
  const result = await deleteDocument(documentId);
  return Response.json(result);
});
