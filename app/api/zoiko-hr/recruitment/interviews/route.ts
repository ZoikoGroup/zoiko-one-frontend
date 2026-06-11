import { type NextRequest } from "next/server";
import { withPermission } from "../../_security";
import { listInterviews, scheduleInterview } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const filters = {
    candidateId: searchParams.get("candidateId") ?? undefined,
    jobId: searchParams.get("jobId") ?? undefined,
    interviewerId: searchParams.get("interviewerId") ?? undefined,
    status: searchParams.get("status") ?? undefined,
  };
  const skip = parseInt(searchParams.get("skip") ?? "0", 10);
  const take = parseInt(searchParams.get("take") ?? "25", 10);
  const result = await listInterviews({ filters, skip, take });
  return Response.json(result);
});

export const POST = withPermission("workforce.*", async function POST(request: NextRequest) {
  const body = (await request.json()) as {
    organizationId?: string;
    candidateId?: string;
    jobOpeningId?: string;
    interviewers?: string[];
    scheduledAt?: string;
    type?: string;
    durationMin?: number;
    location?: string;
    meetingLink?: string;
  };

  const interview = await scheduleInterview({
    organizationId: body.organizationId,
    candidateId: body.candidateId ?? "",
    jobOpeningId: body.jobOpeningId ?? "",
    interviewers: body.interviewers ?? [],
    scheduledAt: body.scheduledAt ?? new Date().toISOString(),
    type: body.type ?? "PHONE",
    durationMin: body.durationMin,
    location: body.location,
    meetingLink: body.meetingLink,
  });

  return Response.json({ data: interview }, { status: 201 });
});
