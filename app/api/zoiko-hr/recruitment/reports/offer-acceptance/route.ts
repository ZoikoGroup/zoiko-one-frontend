import { withPermission } from "../../../_security";
import { getOfferAcceptanceReport } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getOfferAcceptanceReport();
  return Response.json({ data: report });
});
