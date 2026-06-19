import { ArrowRight, Building2, TrendingUp, Target, Globe, Briefcase, Cog } from "lucide-react";

const segments = [
  {
    icon: Building2,
    color: "#4F46E5",
    bg: "#EEF2FF",
    title: "Small business",
    desc: "One product, small team, simple operations — get started in minutes without overbuying.",
    tag: "Start: Standalone HR, Time, Billing or Payroll",
  },
  {
    icon: TrendingUp,
    color: "#059669",
    bg: "#ECFDF5",
    title: "Growing business",
    desc: "Multiple products, expanding team, connected workflows — grow without replacing your stack.",
    tag: "Start: HR + Time + Payroll bundle",
  },
  {
    icon: Target,
    color: "#D97706",
    bg: "#FFFBEB",
    title: "Mid-market",
    desc: "Full operations suite, governed processes, multi-entity support with dedicated success management.",
    tag: "Start: Operations Suite bundle",
  },
  {
    icon: Globe,
    color: "#0891B2",
    bg: "#E0F2FE",
    title: "Enterprise / multi-entity",
    desc: "Global, multi-jurisdiction operations with advanced governance, SLAs and custom contracting.",
    tag: "Start: Enterprise framework",
  },
  {
    icon: Briefcase,
    color: "#7C3AED",
    bg: "#F5F3FF",
    title: "Agencies & services",
    desc: "Project-based billing, time tracking, resource planning and client reporting in one system.",
    tag: "Start: Projects + Time + Billing",
  },
  {
    icon: Cog,
    color: "#DC2626",
    bg: "#FEF2F2",
    title: "Operations-heavy teams",
    desc: "Compliance-heavy, process-intensive teams that need governance, audit trails and controls.",
    tag: "Start: Comply + Insights + HR",
  },
];

export default function WhoItsFor() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#3B82F6] tracking-[0.15em] uppercase mb-4">
            Built for the teams that run the business
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-4">
            Who Zoiko One is for.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            From small teams to global enterprises — Zoiko One adapts to the size, complexity and
            operational maturity of your business.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {segments.map((s) => (
            <div
              key={s.title}
              className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3.5"
                style={{ background: s.bg }}
              >
                <s.icon size={18} color={s.color} />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-1.5">{s.title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed mb-4">{s.desc}</p>
              <span className="inline-block text-[10px] font-medium text-[#6B7280] bg-[#F1F0F6] rounded-full px-2.5 py-1">
                {s.tag}
              </span>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap mt-10">
          <button className="inline-flex items-center gap-2 bg-white text-[#374151] font-semibold px-7 py-3.5 rounded-full text-sm border-2 border-gray-200 hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-200">
            Find Your Solution <ArrowRight size={16} />
          </button>
          <button className="inline-flex items-center gap-2 bg-[#1E1B4B] hover:bg-[#2D2A6B] text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-200 hover:scale-[1.03]">
            Get a Demo <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
