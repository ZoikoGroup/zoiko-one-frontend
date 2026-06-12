import { withPermission } from "../../../_security";
import { getTimeToHire } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getTimeToHire();
  return Response.json({ data: report });
});
