import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { getReview, updateReview, deleteReview } from "@/app/services/performanceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  const data = await getReview(reviewId);
  return Response.json({ data });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  const body = (await request.json()) as {
    reviewerId?: string; overallRating?: number; status?: string;
    strengths?: string; improvements?: string; notes?: string;
  };
  const data = await updateReview(reviewId, body);
  return Response.json({ data });
});

export const DELETE = withPermission("workforce.*", async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ reviewId: string }> },
) {
  const { reviewId } = await params;
  const { searchParams } = new URL(request.url);
  const reason = searchParams.get("reason") ?? undefined;
  await deleteReview(reviewId, reason);
  return Response.json({ ok: true });
});
