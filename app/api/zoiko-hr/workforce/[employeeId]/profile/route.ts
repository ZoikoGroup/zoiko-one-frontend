import { type NextRequest } from "next/server";
import { withPermission } from "../../../_security";
import { getEmployeeProfile, upsertEmployeeProfile } from "@/app/services/workforceService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const profile = await getEmployeeProfile(employeeId);
  return Response.json({ data: profile });
});

export const PUT = withPermission("workforce.*", async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ employeeId: string }> },
) {
  const { employeeId } = await params;
  const body = (await request.json()) as {
    middleName?: string;
    preferredName?: string;
    suffix?: string;
    maritalStatus?: string;
    spouseName?: string;
    numberDependents?: number;
    bloodGroup?: string;
    allergies?: string;
    disabilities?: string;
    linkedinUrl?: string;
    personalWebsite?: string;
    bio?: string;
  };

  const profile = await upsertEmployeeProfile(employeeId, body);
  return Response.json({ data: profile });
});
