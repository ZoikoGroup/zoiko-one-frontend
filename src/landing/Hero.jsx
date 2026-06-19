import { ArrowRight, Globe, ShieldCheck, Building2, Network, Star, BadgeCheck, Lock } from "lucide-react";

const badges = [
  { icon: Globe, text: "Global SaaS platform" },
  { icon: Building2, text: "Jurisdiction-agnostic architecture" },
  { icon: Star, text: "Seven products at launch" },
  { icon: Network, text: "Standalone · bundle · enterprise" },
  { icon: ShieldCheck, text: "Trust Center before advertising" },
  { icon: BadgeCheck, text: "Part of Zoiko Group" },
  { icon: Lock, text: "Visit Trust Center" },
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-16 pb-12 md:pt-20 md:pb-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center gap-2 bg-orange-50 border border-orange-200 rounded-full px-4 py-1.5 mb-6">
          <span className="text-xs font-semibold text-[#F97316] tracking-wide">
            About Zoiko One | Part of the Zoiko Business Cloud
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-[#111827] leading-[1.1] tracking-tight mb-6 max-w-7xl mx-auto">
          The connected business operations platform for people, time, payroll, billing, projects,<br />compliance &{" "}
          <span className="text-[#F97316]">insights.</span>
        </h1>

        <div className="inline-flex items-start gap-2 bg-[#F1F0F6] rounded-2xl px-5 py-3 mb-10 max-w-xl mx-auto">
          <Lock size={16} className="text-[#6B7280] mt-0.5 shrink-0" />
          <p className="text-sm text-[#6B7280] leading-relaxed">
            <span className="font-semibold text-[#374151]">Standalone</span> when you need focus ·{" "}
            <span className="font-semibold text-[#374151]">Connected</span> when you need scale ·{" "}
            <span className="font-semibold text-[#374151]">Enterprise-ready</span> when your business demands more.
          </p>
        </div>

        <p className="text-lg md:text-xl text-[#6B7280] leading-relaxed max-w-5xl mx-auto mb-8">
          Zoiko One helps small, medium and large organizations run essential business operations from one
          modular platform. Start with a single product, connect related workflows, or scale through an
          enterprise framework — without rebuilding your operating stack.
        </p>



        <div className="flex items-center justify-center gap-4 flex-wrap mb-12">
          <button className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-7 py-3.5 rounded-full text-base shadow-lg shadow-orange-200 transition-all duration-200 hover:scale-[1.03]">
            Get a Demo <ArrowRight size={18} />
          </button>
          <button className="inline-flex items-center gap-2 bg-white text-[#374151] font-semibold px-7 py-3.5 rounded-full text-base border-2 border-gray-200 hover:border-[#F97316] hover:text-[#F97316] transition-all duration-200 hover:scale-[1.03]">
            Explore Products
          </button>
        </div>

        <p className="text-xs font-medium text-[#9CA3AF] tracking-wide mb-4 uppercase">
          Built for modern business operations from day one
        </p>

        <div className="flex flex-wrap items-center justify-center gap-2.5 max-w-3xl mx-auto">
          {badges.map((b, i) => (
            <span
              key={i}
              className="inline-flex items-center gap-1.5 text-xs font-medium text-[#6B7280] bg-[#F8F7FC] border border-gray-100 rounded-full px-3.5 py-1.5"
            >
              <b.icon size={13} className="text-[#F97316]" />
              {b.text}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
