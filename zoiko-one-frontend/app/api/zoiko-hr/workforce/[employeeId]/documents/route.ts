import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { listEmployeeDocuments, createEmployeeDocument } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const documents = await listEmployeeDocuments(employeeId);
  return Response.json({ data: documents });
});

export const POST = withPermission("workforce.*", async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
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

  const document = await createEmployeeDocument(employeeId, {
    documentType: body.documentType ?? "",
    fileName: body.fileName,
    fileUrl: body.fileUrl,
    fileSize: body.fileSize,
    mimeType: body.mimeType,
    status: body.status,
    expiryDate: body.expiryDate,
    notes: body.notes,
  });

  return Response.json({ data: document }, { status: 201 });
});
