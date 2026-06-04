import { withPermission } from "../super-admin/_security";

export const dynamic = "force-dynamic";

export const GET = withPermission("analytics.*", async function GET() {
  return Response.json({
    organizations: 1245,
    activeUsers: 52842,
    revenue: "INR 2.4 Cr",
    payrollVolume: "INR 125 Cr",
    payments: 18500,
    complianceScore: "98.7%",
  });
});
