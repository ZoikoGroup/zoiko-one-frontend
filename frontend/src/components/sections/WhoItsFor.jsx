import { useState } from "react";

const tabs = [
  {
    id: "finance",
    label: "Finance / CFO",
    headline: "Project-to-cash discipline, with less reconciliation.",
    description:
      "Connect billable work to revenue and pay, cut manual reconciliation, and report with numbers you trust.",
    bullets: [
      "Revenue connected to delivered work",
      "Controlled, auditable pay runs",
      "Live margin and forecasting",
      "One source of financial truth",
    ],
    tags: ["Billing", "Payroll", "Projects", "Insights"],
    metrics: [
      { label: "Reconciliation time", value: "-61%", color: "#F97316" },
      { label: "Days sales outstanding", value: "-9 days", color: "#2B4EFF" },
      { label: "Forecast confidence", value: "High", color: "#1A1A2E" },
    ],
  },
  {
    id: "hr",
    label: "HR / CHRO",
    headline: "One people platform, from hire to pay.",
    description:
      "Manage contracts, time, leave, and payroll without switching tools or chasing data across systems.",
    bullets: [
      "Unified employee records",
      "Automated leave and attendance",
      "Compliant payroll every cycle",
      "Real-time headcount reporting",
    ],
    tags: ["People", "Payroll", "Time", "Compliance"],
    metrics: [
      { label: "Admin time saved", value: "-40%", color: "#F97316" },
      { label: "Payroll errors", value: "~Zero", color: "#2B4EFF" },
      { label: "Compliance risk", value: "Low", color: "#1A1A2E" },
    ],
  },
  {
    id: "agencies",
    label: "Agencies",
    headline: "Run client work without the spreadsheet sprawl.",
    description:
      "Track time, bill accurately, and keep projects profitable from kickoff to invoice.",
    bullets: [
      "Time tracked against projects",
      "Accurate client invoicing",
      "Live project margins",
      "Integrated team payroll",
    ],
    tags: ["Projects", "Billing", "Time", "Insights"],
    metrics: [
      { label: "Invoicing time", value: "-55%", color: "#F97316" },
      { label: "Revenue leakage", value: "Eliminated", color: "#2B4EFF" },
      { label: "Margin visibility", value: "Live", color: "#1A1A2E" },
    ],
  },
  {
    id: "enterprise",
    label: "Enterprise",
    headline: "Control and visibility across every entity.",
    description:
      "Multi-entity payroll, consolidated reporting, and audit-ready compliance — all in one place.",
    bullets: [
      "Multi-entity payroll runs",
      "Consolidated financial reporting",
      "Role-based access controls",
      "Audit trail on every action",
    ],
    tags: ["Payroll", "Compliance", "Insights", "Billing"],
    metrics: [
      { label: "Reporting time", value: "-70%", color: "#F97316" },
      { label: "Audit readiness", value: "Always", color: "#2B4EFF" },
      { label: "Entity coverage", value: "Full", color: "#1A1A2E" },
    ],
  },
];

export default function WhoItsFor() {
  const [activeTab, setActiveTab] = useState("finance");
  const active = tabs.find((t) => t.id === activeTab);

  return (
    <section className="bg-[#F7F7F9] py-20 px-6 text-center" style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* Eyebrow */}
      <p className="text-[11px] font-semibold tracking-widest text-[#F97316] uppercase mb-4">
        SOLUTIONS BY BUYER
      </p>

      {/* Heading */}
      <h2
        className="font-bold text-[#0F0F1A] leading-tight max-w-[640px] mx-auto mb-4"
        style={{ fontSize: "clamp(28px, 4vw, 44px)" }}
      >
        Built for the teams that run the business.
      </h2>

      {/* Subheading */}
      <p className="text-base text-[#5A5A72] max-w-[520px] mx-auto mb-12 leading-relaxed">
        Every role sees the products and outcomes that matter to them — and the
        next logical step.
      </p>

      {/* Tabs */}
      <div className="flex justify-center gap-2 flex-wrap mb-12">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-full text-sm font-medium cursor-pointer border-none transition-all ${
              activeTab === tab.id
                ? "bg-[#1A2560] text-white"
                : "bg-transparent text-[#3D3D55]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Content Panel */}
      <div className="grid md:grid-cols-2 gap-8 md:gap-12 max-w-[1200px] mx-auto text-left items-start">
        {/* Left */}
        <div>
          <h3
            className="font-bold text-[#0F0F1A] mb-3.5 leading-snug"
            style={{ fontSize: "clamp(20px, 2.5vw, 28px)" }}
          >
            {active.headline}
          </h3>
          <p className="text-[15px] text-[#5A5A72] leading-relaxed mb-6">
            {active.description}
          </p>

          <ul className="list-none p-0 m-0 flex flex-col gap-2.5 mb-7">
            {active.bullets.map((b) => (
              <li key={b} className="flex items-center gap-2.5 text-sm text-[#3D3D55] font-medium">
                <span className="text-[#F97316] font-bold text-[13px]">✓</span>
                {b}
              </li>
            ))}
          </ul>

          <div className="flex gap-2 flex-wrap">
            {active.tags.map((tag) => (
              <span
                key={tag}
                className="px-3 py-1 bg-[#EBEBF5] rounded-full text-xs font-semibold text-[#3D3D55]"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Right — Metrics Card */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden" style={{ boxShadow: "0 2px 20px rgba(0,0,0,0.06)" }}>
          {active.metrics.map((m, i) => (
            <div
              key={m.label}
              className="flex justify-between items-center px-7 py-5.5"
              style={{
                borderBottom: i < active.metrics.length - 1 ? "1px solid #E8E8EE" : "none",
              }}
            >
              <span className="text-sm text-[#8888A4] font-normal">{m.label}</span>
              <span className="text-xl font-bold" style={{ color: m.color }}>
                {m.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

