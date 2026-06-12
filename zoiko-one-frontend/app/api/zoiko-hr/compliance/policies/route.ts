import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listPolicies, createPolicy, updatePolicy, deletePolicy } from "@/app/services/complianceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    category: searchParams.get("category") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";
  const result = await listPolicies({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = await request.json();
  const policy = await createPolicy(body);
  return Response.json({ data: policy }, { status: 201 });
});
