import { ArrowRight, Globe, DollarSign, Building2, ShieldCheck, Database, Route } from "lucide-react";

const items = [
  {
    icon: Globe,
    title: "Locale",
    desc: "Multi-language, date, timezone and regional formatting built into every product.",
  },
  {
    icon: DollarSign,
    title: "Currency",
    desc: "Multi-currency billing, payroll, spend and reporting with live FX capabilities.",
  },
  {
    icon: Building2,
    title: "Entity",
    desc: "Multi-entity architecture supporting subsidiaries, branches and holding structures.",
  },
  {
    icon: ShieldCheck,
    title: "Compliance",
    desc: "Jurisdiction-agnostic compliance engine that adapts to local regulatory requirements.",
  },
  {
    icon: Database,
    title: "Data",
    desc: "Data residency controls, regional hosting options and cross-border processing policies.",
  },
  {
    icon: Route,
    title: "Sales routing",
    desc: "Partner-led, direct and marketplace distribution with jurisdiction-based routing.",
  },
];

export default function GlobalReadiness() {
  return (
    <section className="bg-gradient-to-br from-[#1E1B4B] via-[#1E1B4B] to-[#312E81] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#F97316] tracking-[0.15em] uppercase mb-4">
            Built for global operations
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            A global SaaS offering with jurisdiction-agnostic architecture.
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto leading-relaxed">
            Zoiko One is designed from the ground up for multi-country, multi-currency,
            multi-entity and multi-regulatory environments.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-10">
          {items.map((item) => (
            <div
              key={item.title}
              className="rounded-2xl p-5 bg-white/5 backdrop-blur-sm border border-white/10 transition-all duration-200 hover:bg-white/10"
            >
              <div className="w-10 h-10 rounded-xl bg-[#F97316]/20 flex items-center justify-center mb-3.5">
                <item.icon size={18} className="text-[#F97316]" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">{item.title}</h3>
              <p className="text-xs text-blue-200 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap">
          <button className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-[1.03]">
            Explore Global Readiness <ArrowRight size={16} />
          </button>
          <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full text-sm border border-white/20 transition-all duration-200">
            Contact Sales
          </button>
        </div>
      </div>
    </section>
  );
}
