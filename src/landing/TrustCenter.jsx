import { ArrowRight, Shield, Lock, FileCheck2, Activity, FileText, Download } from "lucide-react";

const cards = [
  {
    icon: Shield,
    title: "Security Overview",
    question: "How is Zoiko One secured?",
    desc: "SOC 2-aligned controls, encryption at rest and in transit, and continuous monitoring across the platform.",
    link: "View Security Overview",
  },
  {
    icon: Lock,
    title: "Privacy & Data",
    question: "How is customer data handled?",
    desc: "Data processing agreements, data residency controls, and privacy-by-design architecture.",
    link: "View Privacy Overview",
  },
  {
    icon: FileCheck2,
    title: "Compliance & Governance",
    question: "What compliance certifications do you hold?",
    desc: "Jurisdiction-agnostic compliance engine, audit trails, and regulatory reporting capabilities.",
    link: "View Compliance Center",
  },
  {
    icon: Activity,
    title: "System Status",
    question: "Is the platform reliable?",
    desc: "Real-time system status, incident reporting, and 99.9% uptime SLA commitments.",
    link: "View System Status",
  },
];

export default function TrustCenter() {
  return (
    <section className="bg-[#F8F7FC] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#3B82F6] tracking-[0.15em] uppercase mb-4">
            Trust must be visible before the buyer asks for it
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-4">
            Trust, security and governance.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Every claim we make is substantiated. Our Trust Center is published before
            advertising campaigns begin.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cards.map((c) => (
            <div key={c.title} className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
              <div className="w-10 h-10 rounded-xl bg-[#EEF2FF] flex items-center justify-center mb-3.5">
                <c.icon size={18} className="text-[#3B82F6]" />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-1">{c.title}</h3>
              <p className="text-xs italic text-[#9CA3AF] mb-2">{c.question}</p>
              <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{c.desc}</p>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B82F6] hover:gap-1.5 transition-all">
                {c.link} <ArrowRight size={13} />
              </button>
            </div>
          ))}

          {/* Enterprise Due Diligence - featured */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-white shadow-lg transition-all duration-200 hover:shadow-xl">
            <div className="w-10 h-10 rounded-xl bg-white/20 flex items-center justify-center mb-3.5">
              <FileText size={18} className="text-white" />
            </div>
            <h3 className="text-sm font-bold mb-1">Enterprise Due Diligence</h3>
            <p className="text-xs italic text-white/60 mb-2">"We need to review your enterprise readiness."</p>
            <p className="text-xs text-white/80 leading-relaxed mb-4">
              Security questionnaires, penetration test results, and enterprise architecture reviews.
            </p>
            <button className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-4 py-2 rounded-full text-xs transition-all duration-200">
              Contact Sales <ArrowRight size={13} />
            </button>
          </div>

          {/* Security Overview PDF */}
          <div className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
            <div className="w-10 h-10 rounded-xl bg-[#FEF2F2] flex items-center justify-center mb-3.5">
              <Download size={18} className="text-[#DC2626]" />
            </div>
            <h3 className="text-sm font-bold text-[#111827] mb-1">Security Overview PDF</h3>
            <p className="text-xs italic text-[#9CA3AF] mb-2">"Can you share a security summary?"</p>
            <p className="text-xs text-[#6B7280] leading-relaxed mb-4">
              Download a concise overview of Zoiko One's security architecture and controls.
            </p>
            <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#DC2626] border border-[#DC2626] rounded-full px-3.5 py-1.5 hover:bg-red-50 transition-all duration-200">
              Download Security Overview <Download size={12} />
            </button>
          </div>
        </div>

        <p className="text-center text-xs text-[#9CA3AF] mt-8 max-w-xl mx-auto leading-relaxed">
          Trust Center is published before advertising campaigns — every public claim is substantiated.
        </p>
      </div>
    </section>
  );
}
