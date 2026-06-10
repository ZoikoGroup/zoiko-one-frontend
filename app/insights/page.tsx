import GrowthLineChart from "../components/GrowthLineChart";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import { getAnalytics } from "../services/superAdminService";
import { BarChart3, TrendingUp, Lightbulb, LineChart, Eye, BrainCircuit } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function InsightsPage() {
  const analytics = await getAnalytics();

  return (
    <SuperAdminShell>
      <PageHeader
        title="Zoiko Insights"
        description="Executive dashboards, payroll analytics, revenue insights, utilization trends, forecasting, and decision intelligence — powered by connected operations data."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-[24px] border border-slate-800 bg-slate-950 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Purpose</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Executive dashboards, payroll analytics, revenue insights, utilization trends, forecasting, and decision
                intelligence.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#141d2f] text-slate-200">
              <BarChart3 className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-300">Primary Buyer</span>
            <span className="text-slate-400">Board, Founder, CFO, COO</span>
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-800 bg-slate-950 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Workflow Position</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Step 6 of the Zoiko One operating workflow: <strong className="text-white">Govern and see</strong> — controls, evidence, dashboards, and forecasts.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#141d2f] text-slate-200">
              <Eye className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">Better decisions</span>
            <span className="text-slate-400">Real-time operational visibility</span>
          </div>
        </article>

        <article className="rounded-[24px] border border-slate-800 bg-slate-950 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Available As</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Standalone product, bundle component, or enterprise framework. Buy what you need, expand when ready.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#141d2f] text-slate-200">
              <Lightbulb className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span className="rounded-full bg-amber-500/10 px-3 py-1 text-amber-300">Pricing</span>
            <span className="text-slate-400">Standalone &bull; Bundle &bull; Enterprise</span>
          </div>
        </article>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-2">
        <article className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <BrainCircuit className="h-5 w-5 text-violet-400" />
            Key Capabilities
          </h2>
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              <span><strong className="text-white">Executive Dashboards</strong> — Role-specific views for Board, Founder, CFO, and COO with the metrics that matter most.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              <span><strong className="text-white">Payroll Analytics</strong> — Gross-to-net trends, departmental cost breakdowns, historical comparisons, and anomaly detection.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              <span><strong className="text-white">Revenue Insights</strong> — Billing revenue, subscription trends, collections performance, and revenue leakage identification.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              <span><strong className="text-white">Utilization Trends</strong> — Billable vs. non-billable time, capacity analysis, productivity evidence, and resource allocation insights.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              <span><strong className="text-white">Forecasting</strong> — Predictive models for payroll costs, revenue growth, hiring needs, and compliance risk trajectory.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
              <span><strong className="text-white">Decision Intelligence</strong> — Actionable recommendations surfaced from cross-product data patterns and historical outcomes.</span>
            </li>
          </ul>
        </article>

        <article className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <TrendingUp className="h-5 w-5 text-emerald-400" />
            Why Zoiko Insights Is Different
          </h2>
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span><strong className="text-white">Connected analytics</strong> — Insights are drawn from live HR, time, payroll, billing, and compliance data — not exported silos.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span><strong className="text-white">Real-time visibility</strong> — Dashboards reflect current operational state, not retrospective reports created after the fact.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span><strong className="text-white">Role-optimized views</strong> — Each executive sees the metrics relevant to their remit without noise from unrelated operational data.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span><strong className="text-white">Forecast from facts</strong> — Predictive models are built on actual payroll, revenue, and utilization history, not assumptions.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-400" />
              <span><strong className="text-white">Board-ready output</strong> — Charts, trends, and summaries are designed for stakeholder presentation and governance review.</span>
            </li>
          </ul>
        </article>
      </section>

      <section className="mb-6 grid gap-4 lg:grid-cols-3">
        <GrowthLineChart title="Revenue Growth" data={analytics.revenueGrowth} dataKey="value" stroke="#38bdf8" />
        <GrowthLineChart title="Tenant Growth" data={analytics.tenantGrowth} dataKey="value" stroke="#f97316" />
        <GrowthLineChart title="User Growth" data={analytics.userGrowth} dataKey="value" stroke="#8b5cf6" />
      </section>

      <article className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
        <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
          <LineChart className="h-5 w-5 text-sky-400" />
          Strategic Context
        </h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Product Category</p>
            <p className="mt-2 text-sm text-slate-300">Operational intelligence and analytics</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Primary Buyers</p>
            <p className="mt-2 text-sm text-slate-300">Board, Founder, CFO, COO</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Connected Products</p>
            <p className="mt-2 text-sm text-slate-300">HR, Time, Payroll, Billing, Comply</p>
          </div>
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Platform Role</p>
            <p className="mt-2 text-sm text-slate-300">Decision intelligence layer of Zoiko One</p>
          </div>
        </div>
      </article>
    </SuperAdminShell>
  );
}
