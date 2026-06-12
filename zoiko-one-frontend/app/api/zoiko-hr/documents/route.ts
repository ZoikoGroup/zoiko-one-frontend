import { type NextRequest } from "next/server";
import { withPermission } from "../_security";
import { listDocuments, createDocument } from "@/app/services/documentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);

  const filters = {
    search: searchParams.get("search") ?? undefined,
    documentType: searchParams.get("documentType") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    employeeId: searchParams.get("employeeId") ?? undefined,
  };

  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";

  const result = await listDocuments({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    employeeId?: string;
    documentType?: string;
    fileName?: string;
    fileUrl?: string;
    fileSize?: number;
    mimeType?: string;
    status?: string;
    expiryDate?: string;
    notes?: string;
  };

  const doc = await createDocument({
    employeeId: body.employeeId ?? "",
    documentType: body.documentType ?? "",
    fileName: body.fileName,
    fileUrl: body.fileUrl,
    fileSize: body.fileSize,
    mimeType: body.mimeType,
    status: body.status,
    expiryDate: body.expiryDate,
    notes: body.notes,
  });

  return Response.json({ data: doc }, { status: 201 });
});
