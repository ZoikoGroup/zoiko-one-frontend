import GrowthLineChart from "../components/GrowthLineChart";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import { getAnalytics } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const analytics = await getAnalytics();

  return (
    <SuperAdminShell>
      <PageHeader title="Zoiko Insights" description="Platform analytics and growth metrics." />
      <section className="grid gap-4 lg:grid-cols-3">
        <GrowthLineChart title="Revenue Growth" data={analytics.revenueGrowth} dataKey="value" stroke="#38bdf8" />
        <GrowthLineChart title="Tenant Growth" data={analytics.tenantGrowth} dataKey="value" stroke="#f97316" />
        <GrowthLineChart title="User Growth" data={analytics.userGrowth} dataKey="value" stroke="#8b5cf6" />
      </section>
    </SuperAdminShell>
  );
}
