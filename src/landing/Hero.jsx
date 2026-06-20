import { ArrowRight, ShieldCheck, Globe2, Sparkles } from "lucide-react";

const trustLogos = ["Northpeak", "Veritas Labs", "Mercato", "Brightfield", "Hexa Group", "Stratus"];

const trustBadges = ["SOC 2 Type II", "ISO 27001", "GDPR aligned", "99.9% uptime", "Visit Trust Center"];

export default function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#F1EEFC] to-white">
      <div className="px-4 sm:px-6 lg:px-20 pt-16 pb-12 text-center">
        <span className="inline-flex items-center gap-2 bg-white border border-gray-200 rounded-full pl-1 pr-4 py-1 text-xs font-medium text-[#2A2F55] shadow-sm mb-6">
          <span className="bg-[#1E1B4B] text-white rounded-full px-3 py-1 text-[11px] font-semibold">
            Zoiko One
          </span>
          The End-to-End Business Operations Platform
        </span>

        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-5 text-[#111827]">
          Run people, time, payroll, billing, projects, compliance &{" "}
          <span className="text-[#F97316]">insights</span> — in one{" "}
          <span className="text-[#3B82F6]">connected platform.</span>
        </h1>

        <p className="text-[#6B7280] text-base md:text-lg mb-8 max-w-2xl mx-auto leading-relaxed">
          Zoiko One connects the work behind every paycheck, invoice, project, and executive
          decision. Start with one product, add more when you're ready, and run business
          operations from one connected operating layer.
        </p>

        <div className="flex items-center justify-center gap-4 mb-6 flex-wrap">
          <button className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-6 py-3 rounded-full text-sm shadow-lg shadow-orange-200 transition-all duration-200 hover:scale-[1.03]">
            Get a Demo <ArrowRight size={16} />
          </button>
          <button className="bg-white border border-gray-200 text-[#1E1B4B] font-semibold px-6 py-3 rounded-full text-sm shadow-sm transition-all duration-200 hover:border-[#3B82F6] hover:text-[#3B82F6]">
            Explore Products
          </button>
        </div>

        <div className="flex items-center justify-center gap-6 text-xs text-[#6B7280] flex-wrap">
          <span className="flex items-center gap-1.5">
            <ShieldCheck size={14} className="text-[#3B82F6]" /> SOC 2 · ISO 27001 ready
          </span>
          <span className="flex items-center gap-1.5">
            <Globe2 size={14} className="text-[#3B82F6]" /> Multi-currency · global ready
          </span>
          <span className="flex items-center gap-1.5">
            <Sparkles size={14} className="text-[#3B82F6]" /> 99.9% uptime commitment
          </span>
        </div>
      </div>

      {/* Trust strip */}
      <div className="border-t border-gray-100 bg-[#FAF9FE] py-10">
        <p className="text-center text-xs text-[#9CA3AF] mb-5">
          Built for controlled business operations from day one — trusted across regions &
          industries
        </p>
        <div className="flex items-center justify-center gap-8 flex-wrap text-sm font-semibold text-indigo-300 mb-6">
          {trustLogos.map((l) => (
            <span key={l} className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-orange-300" /> {l}
            </span>
          ))}
        </div>
        <div className="flex items-center justify-center gap-3 flex-wrap text-xs">
          {trustBadges.map((b) => (
            <span
              key={b}
              className="bg-white border border-gray-200 rounded-full px-3 py-1.5 text-[#3A3F66] flex items-center gap-1"
            >
              {b}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}