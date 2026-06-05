import GrowthLineChart from "../components/GrowthLineChart";
import PageHeader from "../components/PageHeader";
import SuperAdminShell from "../components/SuperAdminShell";
import { getAnalytics } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function AnalyticsPage() {
  const analytics = await getAnalytics();

  return (
    <SuperAdminShell>
      <PageHeader title="Analytics" description="Growth analytics prepared for revenue, tenants, and users." />
      <section className="grid gap-4 xl:grid-cols-3">
        <GrowthLineChart title="Revenue Growth" data={analytics.revenueGrowth} dataKey="value" stroke="#2563eb" valuePrefix="$" />
        <GrowthLineChart title="Tenant Growth" data={analytics.tenantGrowth} dataKey="value" stroke="#059669" />
        <GrowthLineChart title="User Growth" data={analytics.userGrowth} dataKey="value" stroke="#7c3aed" />
      </section>
    </SuperAdminShell>
  );
}
