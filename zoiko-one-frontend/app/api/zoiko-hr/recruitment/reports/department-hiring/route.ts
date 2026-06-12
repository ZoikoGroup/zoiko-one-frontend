import { withPermission } from "../../../_security";
import { getDepartmentHiring } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getDepartmentHiring();
  return Response.json({ data: report });
});
