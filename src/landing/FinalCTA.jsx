import { ArrowRight } from "lucide-react";

export default function FinalCTA() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
        <div className="rounded-3xl p-10 md:p-14 bg-gradient-to-br from-[#1E1B4B] via-[#312E81] to-[#3B82F6] text-center shadow-2xl">
          <p className="text-xs font-bold text-[#F97316] tracking-[0.15em] uppercase mb-4">
            Ready to see Zoiko One in action?
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white leading-tight tracking-tight mb-4">
            Start with one product. Connect the business. Scale with Zoiko One.
          </h2>
          <p className="text-blue-200 max-w-xl mx-auto leading-relaxed mb-8">
            No pressure, no lock-in. See Zoiko One mapped to your operations in a personalized
            demo tailored to your business size, industry and operational complexity.
          </p>

          <div className="flex items-center justify-center gap-4 flex-wrap mb-8">
            <button className="inline-flex items-center gap-2 bg-[#F97316] hover:bg-[#EA580C] text-white font-bold px-7 py-3.5 rounded-full text-sm shadow-lg shadow-orange-500/30 transition-all duration-200 hover:scale-[1.03]">
              Get a Demo <ArrowRight size={16} />
            </button>
            <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full text-sm border border-white/20 transition-all duration-200">
              Explore Products
            </button>
            <button className="inline-flex items-center gap-2 bg-white/10 hover:bg-white/20 text-white font-semibold px-7 py-3.5 rounded-full text-sm border border-white/20 transition-all duration-200">
              View Pricing
            </button>
          </div>

          <p className="text-xs text-blue-300/70">
            No pressure, no lock-in. See Zoiko One mapped to your operations.
          </p>
        </div>
      </div>
    </section>
  );
}
