import { getAnalytics } from "@/app/services/superAdminService";
import { withPermission } from "../_security";

export const dynamic = "force-dynamic";

export const GET = withPermission("analytics.*", async function GET() {
  return Response.json(await getAnalytics());
});
