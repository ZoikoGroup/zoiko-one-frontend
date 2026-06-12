import { getComplianceCenter, type ComplianceCenterRow } from "../services/superAdminService";
import SuperAdminShell from "../components/SuperAdminShell";
import PageHeader from "../components/PageHeader";
import ReusableTable, { type TableColumn } from "../components/ReusableTable";
import StatusBadge from "../components/StatusBadge";
import { Shield, FileCheck, AlertTriangle, Scale, ClipboardCheck, Gavel } from "lucide-react";

export const dynamic = "force-dynamic";

export default async function ComplyPage() {
  const reports = await getComplianceCenter();

  const columns: TableColumn<ComplianceCenterRow>[] = [
    { key: "packName", header: "Pack" },
    { key: "tenantName", header: "Tenant" },
    { key: "jurisdiction", header: "Jurisdiction" },
    { key: "score", header: "Score" },
    { key: "alerts", header: "Alerts" },
    { key: "status", header: "Status", render: (row) => <StatusBadge status={row.status} /> },
  ];

  return (
    <SuperAdminShell>
      <PageHeader
        title="Zoiko Comply"
        description="Compliance dashboards, filing calendars, audit logs, evidence packs, risk alerts, and governance workflows — built into the operating layer of your business."
      />

      <section className="mb-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <article className="rounded-[24px] border border-slate-800 bg-slate-950 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.4)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500">Purpose</p>
              <p className="mt-4 text-sm leading-6 text-slate-300">
                Compliance dashboards, filing calendars, audit logs, evidence packs, risk alerts, and governance
                workflows.
              </p>
            </div>
            <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-3xl bg-[#141d2f] text-slate-200">
              <Shield className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span className="rounded-full bg-indigo-500/10 px-3 py-1 text-indigo-300">Primary Buyer</span>
            <span className="text-slate-400">CFO, HR Director, Compliance Lead</span>
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
              <ClipboardCheck className="h-5 w-5" />
            </span>
          </div>
          <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-400">
            <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-300">Better decisions</span>
            <span className="text-slate-400">Stronger accountability</span>
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
              <Gavel className="h-5 w-5" />
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
            <Scale className="h-5 w-5 text-sky-400" />
            Key Capabilities
          </h2>
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              <span><strong className="text-white">Compliance Dashboards</strong> — Real-time visibility into compliance posture across jurisdictions, packs, and tenants.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              <span><strong className="text-white">Filing Calendars</strong> — Automated tracking of regulatory deadlines, filing obligations, and submission schedules.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              <span><strong className="text-white">Audit Logs</strong> — Immutable, governed trail of every compliance action, review, and evidence submission.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              <span><strong className="text-white">Evidence Packs</strong> — Structured collections of compliance artifacts ready for internal audit or regulatory inspection.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              <span><strong className="text-white">Risk Alerts</strong> — Proactive notifications when compliance scores drop, violations occur, or filings approach deadline.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-sky-400" />
              <span><strong className="text-white">Governance Workflows</strong> — Configurable approval chains, enforcement policies, and automated remediation paths.</span>
            </li>
          </ul>
        </article>

        <article className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_24px_80px_rgba(0,0,0,0.35)]">
          <h2 className="mb-4 flex items-center gap-2 text-lg font-semibold text-white">
            <FileCheck className="h-5 w-5 text-amber-400" />
            Why Zoiko Comply Is Different
          </h2>
          <ul className="space-y-3 text-sm leading-6 text-slate-300">
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span><strong className="text-white">Compliance inside daily operations</strong> — Not a separate tool. Governance is visible and operational alongside HR, Payroll, and Billing.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span><strong className="text-white">Jurisdiction-agnostic</strong> — Built for global use without being locked to one country, tax system, or legal model.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span><strong className="text-white">Connected evidence</strong> — Audit trails, risk alerts, and evidence packs are linked to the actual payroll runs, billing transactions, and people records they govern.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span><strong className="text-white">Proactive, not reactive</strong> — Filing calendars and risk alerts surface obligations and issues before they become violations.</span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-400" />
              <span><strong className="text-white">Board-ready reporting</strong> — Compliance scores, trends, and risk summaries are designed for stakeholder and board-level review.</span>
            </li>
          </ul>
        </article>
      </section>

      <ReusableTable title="Compliance Center" columns={columns} data={reports} />
    </SuperAdminShell>
  );
}
