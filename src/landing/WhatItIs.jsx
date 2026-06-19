import { ArrowRight, Package, Layers, Server, Cloud } from "lucide-react";

const rows = [
  {
    icon: Package,
    bg: "#EEF2FF",
    color: "#4F46E5",
    title: "Core Products",
    subtitle: "Seven purchasable products",
  },
  {
    icon: Layers,
    bg: "#F0FDF4",
    color: "#16A34A",
    title: "Shared Layers",
    subtitle: "Capabilities inside the platform",
  },
  {
    icon: Server,
    bg: "#FFF7ED",
    color: "#F97316",
    title: "Infrastructure",
    subtitle: "ZoikoPay · ZoikoCoreX",
  },
  {
    icon: Cloud,
    bg: "#F0F9FF",
    color: "#3B82F6",
    title: "Business Cloud",
    subtitle: "Adjacent standalone platforms",
  },
];

export default function WhatItIs() {
  return (
    <section className="bg-[#F8F7FC] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-12 md:gap-16 items-center">
          <div>
            <p className="text-xs font-bold text-[#F97316] tracking-[0.15em] uppercase mb-4">
              What Zoiko One is
            </p>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-6">
              A modular, global business operations platform — not just another point tool.
            </h2>
            <p className="text-[#6B7280] leading-relaxed mb-4">
              Zoiko One is a connected operations platform that brings together people, time, payroll,
              billing, projects, compliance, spend and insights into a single, modular system with{" "}
              <span className="text-[#F97316] font-semibold">operational intelligence.</span>
            </p>
            <p className="text-[#6B7280] leading-relaxed mb-8">
              Whether you need one product or a full enterprise framework, Zoiko One adapts to how
              your business operates — not the other way around.
            </p>
            <div className="flex items-center gap-3 flex-wrap">
              <button className="inline-flex items-center gap-2 bg-[#1E1B4B] hover:bg-[#2D2A6B] text-white font-bold px-6 py-3 rounded-full text-sm transition-all duration-200 hover:scale-[1.03]">
                See the Platform Overview <ArrowRight size={16} />
              </button>
              <button className="inline-flex items-center gap-2 bg-white text-[#374151] font-semibold px-6 py-3 rounded-full text-sm border-2 border-gray-200 hover:border-[#F97316] hover:text-[#F97316] transition-all duration-200 hover:scale-[1.03]">
                Explore Products
              </button>
            </div>
          </div>

          <div className="flex flex-col gap-3">
            {rows.map((r) => (
              <div
                key={r.title}
                className="flex items-center gap-4 rounded-2xl p-4 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
                style={{ background: r.bg }}
              >
                <div
                  className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: r.color + "20" }}
                >
                  <r.icon size={22} color={r.color} />
                </div>
                <div>
                  <p className="font-bold text-[#111827] text-sm">{r.title}</p>
                  <p className="text-xs text-[#6B7280]">{r.subtitle}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
