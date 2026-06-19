import { ArrowRight, XCircle, CheckCircle2 } from "lucide-react";

const pairs = [
  {
    problem: "HR speaks one language, payroll another, and finance a third — data never reconciles.",
    solution: "A single operating layer connects people, time, payroll, billing and compliance in real time.",
  },
  {
    problem: "Scaling means adding more tools, more vendors, more contracts — complexity compounds.",
    solution: "Modular architecture lets you start with one product and connect more without disruption.",
  },
  {
    problem: "Global compliance is bolted on after the fact — exposing the business to unnecessary risk.",
    solution: "Jurisdiction-agnostic design with compliance built into every workflow from day one.",
  },
  {
    problem: "Trust materials are hidden behind sales conversations — buyers can't verify claims independently.",
    solution: "Full Trust Center published publicly before any advertising campaign begins.",
  },
];

export default function WhyExists() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#F97316] tracking-[0.15em] uppercase mb-4">
            Why Zoiko One exists
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-4">
            Modern businesses run across more systems than ever — yet none of them talk.
          </h2>
          <p className="text-[#6B7280] max-w-2xl mx-auto leading-relaxed">
            The average mid-market business uses 8+ disconnected tools for operations. Data is
            siloed, reconciliation is manual, and compliance risk grows with every new vendor.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-4 mb-12">
          {pairs.map((p, i) => (
            <div key={i} className="grid grid-cols-1 sm:grid-cols-2 rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="bg-gray-50 p-5 border-b sm:border-b-0 sm:border-r border-gray-100">
                <span className="inline-block text-[10px] font-bold text-[#6B7280] tracking-[0.1em] uppercase bg-gray-200 rounded-full px-2.5 py-0.5 mb-2.5">
                  Buyer Problem
                </span>
                <div className="flex items-start gap-2.5">
                  <XCircle size={16} className="text-[#EF4444] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#6B7280] leading-relaxed">{p.problem}</p>
                </div>
              </div>
              <div className="bg-white p-5">
                <span className="inline-block text-[10px] font-bold text-[#F97316] tracking-[0.1em] uppercase bg-orange-50 rounded-full px-2.5 py-0.5 mb-2.5">
                  Zoiko One
                </span>
                <div className="flex items-start gap-2.5">
                  <CheckCircle2 size={16} className="text-[#F97316] mt-0.5 shrink-0" />
                  <p className="text-sm text-[#374151] leading-relaxed">{p.solution}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center gap-2 bg-[#1E1B4B] hover:bg-[#2D2A6B] text-white font-bold px-7 py-3.5 rounded-full text-sm transition-all duration-200 hover:scale-[1.03]">
            See How Zoiko One Works <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
