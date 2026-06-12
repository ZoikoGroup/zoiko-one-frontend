import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listFeedbacks, createFeedback } from "@/app/services/performanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    employeeId: searchParams.get("employeeId") ?? undefined,
    giverId: searchParams.get("giverId") ?? undefined,
    type: searchParams.get("type") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";
  const result = await listFeedbacks({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    employeeId: string; giverId?: string; type?: string;
    category?: string; content: string; isConfidential?: boolean;
  };
  const feedback = await createFeedback(body);
  return Response.json({ data: feedback }, { status: 201 });
});
