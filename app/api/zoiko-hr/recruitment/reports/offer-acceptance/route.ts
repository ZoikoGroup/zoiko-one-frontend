import { withPermission } from "../../../_security";
import { getOfferAcceptanceRate } from "@/app/services/recruitmentService";

export const dynamic = "force-dynamic";

export const GET = withPermission("workforce.*", async function GET() {
  const report = await getOfferAcceptanceRate();
  return Response.json({ data: { acceptanceRate: report } });
});
