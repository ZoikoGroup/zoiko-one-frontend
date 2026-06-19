import { ArrowRight, CheckCircle2 } from "lucide-react";

const rows = [
  {
    traditional: "Disconnected tools that don't share data",
    zoiko: "Single operating layer connecting every function in real time",
  },
  {
    traditional: "Manual reconciliation across HR, payroll, billing and compliance",
    zoiko: "Automated data flow between products — no manual syncs",
  },
  {
    traditional: "Scaling means buying more disparate tools",
    zoiko: "Modular architecture — add products without adding complexity",
  },
  {
    traditional: "Compliance is an afterthought bolted onto existing systems",
    zoiko: "Compliance built into every workflow from day one",
  },
  {
    traditional: "Trust information hidden behind sales conversations",
    zoiko: "Full Trust Center published publicly before advertising",
  },
  {
    traditional: "Global operations requires separate instances per country",
    zoiko: "Multi-jurisdiction, multi-entity, multi-currency by design",
  },
  {
    traditional: "Pricing is opaque — hidden fees, annual lock-ins",
    zoiko: "Transparent pricing — standalone, bundle or enterprise",
  },
  {
    traditional: "Vendor lock-in makes switching nearly impossible",
    zoiko: "Open architecture — start with one, connect more, leave when you need",
  },
];

export default function ComparisonTable() {
  return (
    <section className="bg-[#F8F7FC] py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#F97316] tracking-[0.15em] uppercase mb-4">
            What makes Zoiko One different
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-4">
            What makes Zoiko One different.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Eight fundamental differences that separate Zoiko One from the traditional approach to
            business operations software.
          </p>
        </div>

        <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm">
          {/* Header row */}
          <div className="grid grid-cols-2">
            <div className="p-4 bg-gray-100 text-center">
              <span className="text-xs font-bold text-[#6B7280] tracking-wider uppercase">
                Traditional stack
              </span>
            </div>
            <div className="p-4 bg-gradient-to-r from-[#7C3AED] to-[#3B82F6] text-center">
              <span className="text-xs font-bold text-white tracking-wider uppercase">
                Zoiko One
              </span>
            </div>
          </div>

          {/* Rows */}
          {rows.map((r, i) => (
            <div key={i} className={`grid grid-cols-2 ${i % 2 === 0 ? "bg-white" : "bg-[#F8F7FC]"}`}>
              <div className="p-4 border-r border-gray-100 flex items-center">
                <p className="text-sm text-[#6B7280] leading-relaxed">{r.traditional}</p>
              </div>
              <div className="p-4 flex items-start gap-2.5">
                <CheckCircle2 size={16} className="text-[#F97316] mt-0.5 shrink-0" />
                <p className="text-sm text-[#374151] leading-relaxed">{r.zoiko}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-4 flex-wrap mt-10">
          <button className="inline-flex items-center gap-2 bg-white text-[#374151] font-semibold px-7 py-3.5 rounded-full text-sm border-2 border-gray-200 hover:border-[#F97316] hover:text-[#F97316] transition-all duration-200">
            Compare Products <ArrowRight size={16} />
          </button>
          <button className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg shadow-orange-200 transition-all duration-200 hover:scale-[1.03]">
            Get a Demo <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
