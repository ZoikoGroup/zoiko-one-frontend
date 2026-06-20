const items = [
  {
    num: "01",
    title: "Modularity",
    desc: "Every product works independently. You buy only what you need and connect when you're ready. No forced suites, no unused modules.",
  },
  {
    num: "02",
    title: "Connection",
    desc: "When products connect, data flows automatically. HR feeds payroll, time feeds billing, compliance monitors everything — no manual syncs.",
  },
  {
    num: "03",
    title: "Control",
    desc: "You decide who sees what, who approves what, and how workflows run. Governance is built in, not bolted on.",
  },
  {
    num: "04",
    title: "Global readiness",
    desc: "Multi-entity, multi-currency, multi-jurisdiction from day one. The architecture doesn't change when you cross borders.",
  },
  {
    num: "05",
    title: "Commercial clarity",
    desc: "Transparent pricing, no hidden fees, no lock-in. Standalone, bundle or enterprise — you choose the commercial model.",
  },
  {
    num: "06",
    title: "Trust before scale",
    desc: "Security, privacy and compliance materials are published before advertising begins. Every claim is substantiated.",
  },
];

export default function Philosophy() {
  return (
    <section className="bg-[#F8F7FC] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#F97316] tracking-[0.15em] uppercase mb-4 max-w-2xl mx-auto leading-relaxed">
            Modular enough to start. Connected enough to matter. Governed enough to trust.
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-4">
            Our operating philosophy.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Six principles that guide how Zoiko One is built, sold and operated.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {items.map((item) => (
            <div
              key={item.num}
              className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <span className="text-3xl font-black text-[#F97316] block mb-3">{item.num}</span>
              <h3 className="text-sm font-bold text-[#111827] mb-2">{item.title}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
