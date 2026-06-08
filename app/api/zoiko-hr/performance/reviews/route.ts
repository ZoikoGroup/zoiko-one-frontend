import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listReviews, createReview } from "@/app/services/performanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    search: searchParams.get("search") ?? undefined,
    status: searchParams.get("status") ?? undefined,
    employeeId: searchParams.get("employeeId") ?? undefined,
    cycleId: searchParams.get("cycleId") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const orderBy = searchParams.get("orderBy") ?? "createdAt";
  const orderDir = (searchParams.get("orderDir") ?? "desc") as "asc" | "desc";
  const result = await listReviews({ filters, skip, take, orderBy, orderDir });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    employeeId: string; reviewerId?: string; cycleId: string;
    overallRating?: number; status?: string; strengths?: string;
    improvements?: string; notes?: string;
  };
  const review = await createReview(body);
  return Response.json({ data: review }, { status: 201 });
});
