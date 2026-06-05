import { Activity, AlertTriangle, Building2, CreditCard, ShieldCheck, Sparkles, Users, WalletCards } from "lucide-react";

import GrowthLineChart from "../components/GrowthLineChart";
import KPICard from "../components/KPICard";
import PageHeader from "../components/PageHeader";
import RecentActivity from "../components/RecentActivity";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import SuperAdminShell from "../components/SuperAdminShell";
import { getDashboardOverview } from "../services/superAdminService";

export const dynamic = "force-dynamic";

export default async function SuperAdminDashboardPage() {
  const overview = await getDashboardOverview();
  const {
    monthlyPayrollVolume = "$0",
    monthlyRevenue = "$0",
    totalEmployees = 0,
    totalUsers = 0,
    totalOrganizations = 0,
    activeOrganizations = 0,
    activePayrollRuns = 0,
    failedPayrollRuns = 0,
    complianceHealthScore = 0,
    platformHealthScore = 0,
    productAdoptionScore = 0,
    openIncidents = 0,
    payrollVolumeTrend = [],
    complianceHealthTrend = [],
    productAdoptionTrend = [],
    topRiskOrganizations = [],
    platformActivity = [],
    systemHealth = [],
  } = overview;

  const topRiskColumns: TableColumn<(typeof topRiskOrganizations)[number]>[] = [
    { key: "organization", header: "Organization" },
    { key: "tenant", header: "Tenant" },
    { key: "employees", header: "Employees" },
    { key: "monthlyPayroll", header: "Payroll" },
    {
      key: "riskScore",
      header: "Risk Score",
      render: (item) => (
        <span className="inline-flex rounded-full bg-amber-500/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.24em] text-amber-300">
          {item.riskScore}
        </span>
      ),
    },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Super Admin Dashboard"
        description="Platform control center for tenants, payroll, health, analytics and operational visibility."
      />

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <KPICard title="Monthly Payroll Volume" value={monthlyPayrollVolume} icon={CreditCard} trend="+8.3%" />
        <KPICard title="Monthly Revenue" value={monthlyRevenue} icon={WalletCards} trend="+12.1%" />
        <KPICard title="Total Employees" value={totalEmployees} icon={Users} trend="+6.4%" />
        <KPICard title="Total Users" value={totalUsers} icon={Users} trend="+9.8%" />
        <KPICard title="Total Organizations" value={totalOrganizations} icon={Building2} trend="+4.7%" />
        <KPICard title="Active Organizations" value={activeOrganizations} icon={ShieldCheck} trend="+3.1%" />
        <KPICard title="Active Payroll Runs" value={activePayrollRuns} icon={CreditCard} trend="+2.5%" />
        <KPICard title="Failed Payroll Runs" value={failedPayrollRuns} icon={AlertTriangle} trend="-1.2%" />
        <KPICard title="Compliance Health Score" value={`${complianceHealthScore}%`} icon={ShieldCheck} trend="Stable" />
        <KPICard title="Platform Health Score" value={`${platformHealthScore}%`} icon={Activity} trend="Healthy" />
        <KPICard title="Product Adoption Score" value={`${productAdoptionScore}%`} icon={Sparkles} trend="Growing" />
        <KPICard title="Open Incidents" value={openIncidents} icon={AlertTriangle} trend="Review" />
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.7fr_1fr]">
        <GrowthLineChart
          title="Payroll Volume Trend"
          data={payrollVolumeTrend}
          dataKey="value"
          stroke="#38bdf8"
          valuePrefix="$"
        />
        <div className="grid gap-4">
          <GrowthLineChart
            title="Compliance Health Trend"
            data={complianceHealthTrend}
            dataKey="value"
            stroke="#f97316"
          />
          <GrowthLineChart
            title="Product Adoption Trend"
            data={productAdoptionTrend}
            dataKey="value"
            stroke="#8b5cf6"
          />
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
        <ReusableTable
          title="Top-Risk Organizations"
          description="Organizations with the highest risk posture across payroll, compliance and platform activity."
          columns={topRiskColumns}
          data={topRiskOrganizations}
          emptyState="No risk organizations found."
        />

        <div className="space-y-4">
          <div className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
            <div className="flex items-center gap-3">
              <span className="rounded-lg bg-[#141d2f] p-2 text-sky-400">
                <Activity className="h-5 w-5" />
              </span>
              <div>
                <h2 className="text-lg font-semibold text-white">System Health</h2>
                <p className="text-sm text-slate-400">Realtime operational posture across the platform.</p>
              </div>
            </div>
            <dl className="mt-5 grid gap-3">
              {overview.systemHealth.map((item) => (
                <div key={item.name} className="flex items-center justify-between rounded-3xl bg-slate-950 px-4 py-3">
                  <dt className="text-sm text-slate-300">{item.name}</dt>
                  <dd className={`text-sm font-semibold ${item.status === "Healthy" ? "text-emerald-300" : item.status === "Warning" ? "text-amber-300" : "text-rose-300"}`}>
                    {item.status}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <RecentActivity activities={platformActivity} />
        </div>
      </section>
    </SuperAdminShell>
  );
}
