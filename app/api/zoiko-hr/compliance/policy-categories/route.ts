import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listPolicyCategories, createPolicyCategory } from "@/app/services/complianceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const search = searchParams.get("search") ?? undefined;
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const result = await listPolicyCategories({ search, skip, take });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = await request.json();
  const cat = await createPolicyCategory(body);
  return Response.json({ data: cat }, { status: 201 });
});
