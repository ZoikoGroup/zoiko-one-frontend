import { ArrowRight, Check, Zap } from "lucide-react";

const tiers = [
  {
    num: "01",
    title: "Standalone",
    desc: "Buy one product. Use it independently. Add more when you're ready.",
    bullets: [
      "Purchase any single product",
      "Works independently or connected",
      "Per-product pricing",
      "No minimum commitment",
      "Self-service onboarding",
    ],
    cta: "Explore Standalone",
    variant: "outline",
  },
  {
    num: "02",
    title: "Bundles",
    desc: "Pre-configured product combinations that solve common operational patterns.",
    bullets: [
      "Curated product bundles",
      "Discounted vs standalone",
      "HR + Time + Payroll bundle",
      "Billing + Spend bundle",
      "Operations Suite bundle",
    ],
    cta: "Compare Bundles",
    variant: "accent",
    popular: true,
  },
  {
    num: "03",
    title: "Enterprise",
    desc: "Full platform access with custom contracting, SLAs and dedicated support.",
    bullets: [
      "All products & shared layers",
      "Custom contracting & SLAs",
      "Multi-entity & global support",
      "Dedicated customer success",
      "Advanced governance & controls",
    ],
    cta: "Talk to Sales",
    variant: "dark",
  },
];

export default function PricingTiers() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#F97316] tracking-[0.15em] uppercase mb-4">
            How customers buy and grow
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-4">
            How customers buy and grow.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Three commercial tiers that match the way businesses adopt, expand and scale operations.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {tiers.map((t) => (
            <div
              key={t.title}
              className={`relative rounded-2xl p-7 border shadow-sm transition-all duration-200 hover:shadow-md ${
                t.popular ? "border-[#F97316] ring-1 ring-[#F97316]" : "border-gray-100"
              }`}
            >
              {t.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#F97316] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <span className="text-2xl font-black text-[#F97316] mb-2 block">{t.num}</span>
              <h3 className="text-xl font-bold text-[#111827] mb-2">{t.title}</h3>
              <p className="text-sm text-[#6B7280] leading-relaxed mb-6">{t.desc}</p>

              <ul className="flex flex-col gap-2.5 mb-8">
                {t.bullets.map((b) => (
                  <li key={b} className="flex items-start gap-2.5">
                    <Check size={14} className="text-[#F97316] mt-0.5 shrink-0" />
                    <span className="text-sm text-[#374151]">{b}</span>
                  </li>
                ))}
              </ul>

              {t.variant === "outline" && (
                <button className="w-full inline-flex items-center justify-center gap-2 bg-white text-[#374151] font-semibold px-5 py-3 rounded-full text-sm border-2 border-gray-200 hover:border-[#F97316] hover:text-[#F97316] transition-all duration-200">
                  {t.cta} <ArrowRight size={15} />
                </button>
              )}
              {t.variant === "accent" && (
                <button className="w-full inline-flex items-center justify-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-5 py-3 rounded-full text-sm shadow-lg shadow-orange-200 transition-all duration-200">
                  {t.cta} <ArrowRight size={15} />
                </button>
              )}
              {t.variant === "dark" && (
                <button className="w-full inline-flex items-center justify-center gap-2 bg-[#1E1B4B] hover:bg-[#2D2A6B] text-white font-bold px-5 py-3 rounded-full text-sm transition-all duration-200">
                  {t.cta} <ArrowRight size={15} />
                </button>
              )}
            </div>
          ))}
        </div>

        <p className="text-center text-sm font-bold text-[#111827] mt-10 flex items-center justify-center gap-2">
          <Zap size={16} className="text-[#F97316]" />
          Start with one. Connect more. Scale to enterprise.
        </p>
      </div>
    </section>
  );
}
