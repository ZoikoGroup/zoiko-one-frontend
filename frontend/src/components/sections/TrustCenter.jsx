export default function TrustCenter() {
  const cards = [
    {
      icon: "🔒",
      title: "Access control",
      desc: "RBAC, MFA, SSO, and least-privilege permissions across every product.",
    },
    {
      icon: "🔐",
      title: "Encryption",
      desc: "Encryption in transit and at rest, with secure development practices.",
    },
    {
      icon: "📋",
      title: "Audit trails",
      desc: "Action logs and evidence packs that stand up to audit and review.",
    },
    {
      icon: "🌐",
      title: "Data residency",
      desc: "Clear data handling, retention, subprocessors, and residency approach.",
    },
  ];

  return (
    <section className="bg-[#1A2560] py-20 px-6 sm:px-8 lg:px-12">
      <div className="max-w-[1280px] mx-auto grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
        {/* Left */}
        <div>
          <p className="text-[11px] font-semibold tracking-widest text-[#F97316] uppercase mb-4">
            SECURITY, COMPLIANCE & TRUST
          </p>
          <h2
            className="font-bold text-white leading-tight mb-5"
            style={{ fontSize: "clamp(28px, 3.5vw, 42px)" }}
          >
            Built for security, control, and audit readiness.
          </h2>
          <p className="text-[15px] text-white/70 leading-relaxed mb-9">
            Controls are designed in from day one — not bolted on for the
            enterprise sale. Every public claim is substantiated in our Trust
            Center.
          </p>
          <div className="flex gap-3 flex-wrap">
            <a href="#" className="inline-block px-6 py-3 bg-[#F97316] text-white rounded-full font-semibold text-sm no-underline">
              Visit Trust Center →
            </a>
            <a href="#" className="inline-block px-6 py-3 bg-white/12 text-white rounded-full font-semibold text-sm no-underline border border-white/20">
              Download Security Overview
            </a>
          </div>
        </div>

        {/* Right — 2x2 grid */}
        <div className="grid sm:grid-cols-2 gap-4">
          {cards.map((card) => (
            <div key={card.title} className="bg-white/8 border border-white/12 rounded-xl p-6">
              <div className="text-xl mb-3">{card.icon}</div>
              <h4 className="text-[15px] font-bold text-white mb-2">{card.title}</h4>
              <p className="text-[13px] text-white/65 leading-relaxed m-0">{card.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}