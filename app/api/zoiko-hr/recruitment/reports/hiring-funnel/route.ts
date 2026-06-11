import { withPermission } from "../../../_security";
import { getHiringFunnel } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getHiringFunnel();
  return Response.json({ data: report });
});
