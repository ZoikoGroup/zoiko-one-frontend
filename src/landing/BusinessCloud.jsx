import { ArrowRight, MessageSquare, Globe, TrendingUp, Building2, Zap, CreditCard, Database } from "lucide-react";

const adjacentPlatforms = [
  {
    tag: "Communication",
    tagColor: "#0891B2",
    bg: "#E0F2FE",
    icon: MessageSquare,
    name: "Zoiko Sema",
    desc: "Team communication — messaging, meetings, video and channels for the modern workplace.",
  },
  {
    tag: "Global Comms",
    tagColor: "#059669",
    bg: "#ECFDF5",
    icon: Globe,
    name: "Zoiko Local",
    desc: "Global communication infrastructure for worldwide reachability and local presence.",
  },
  {
    tag: "Growth",
    tagColor: "#7C3AED",
    bg: "#F5F3FF",
    icon: TrendingUp,
    name: "ZoikoVertex",
    desc: "Growth automation platform connecting operational data to revenue outcomes.",
  },
  {
    tag: "Digitization",
    tagColor: "#D97706",
    bg: "#FFFBEB",
    icon: Building2,
    name: "Zoiko Web Services",
    desc: "Global digitization platform for websites, apps and business integrations.",
  },
];

const infraPlatforms = [
  {
    tag: "Settlement",
    tagColor: "#DC2626",
    icon: CreditCard,
    name: "ZoikoPay",
    desc: "Payment settlement, disbursement, FX, and reconciliation infrastructure beneath the platform.",
  },
  {
    tag: "Financial Truth",
    tagColor: "#4F46E5",
    icon: Database,
    name: "ZoikoCoreX",
    desc: "Financial truth layer — the single source of truth for all money movement across the platform.",
  },
];

export default function BusinessCloud() {
  return (
    <section className="bg-white py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-4">
          <span className="text-xs font-bold text-[#7C3AED] tracking-[0.15em] uppercase bg-purple-50 px-3 py-1 rounded-full">
            Part of the Zoiko Business Cloud.
          </span>
        </div>
        <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight text-center mb-3">
          Part of the Zoiko Business Cloud.
        </h2>
        <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed text-center mb-12">
          Zoiko One sits within a broader ecosystem of platforms that solve communication, growth,
          digitization and infrastructure needs.
        </p>

        <p className="text-[10px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase text-center mb-4">
          Adjacent standalone platforms
        </p>
        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-14">
          {adjacentPlatforms.map((p) => (
            <div key={p.name} className="rounded-2xl p-6 bg-white border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
              <span
                className="inline-block text-[10px] font-bold tracking-wider rounded-full px-2.5 py-0.5 mb-3"
                style={{ background: p.bg, color: p.tagColor }}
              >
                {p.tag}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: p.bg }}
              >
                <p.icon size={18} color={p.tagColor} />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-1.5">{p.name}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed">{p.desc}</p>
            </div>
          ))}
        </div>

        <p className="text-[10px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase text-center mb-4">
          The operations platform
        </p>
        <div className="rounded-2xl p-8 bg-gradient-to-br from-[#7C3AED] to-[#3B82F6] text-white shadow-lg mb-14 transition-all duration-200 hover:shadow-xl">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-[10px] font-bold bg-white/20 px-2.5 py-0.5 rounded-full tracking-wider">
              Business Operations · The Hero
            </span>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-xl bg-white/20 flex items-center justify-center shrink-0">
              <Zap size={22} className="text-white" />
            </div>
            <div>
              <h3 className="text-lg font-bold mb-1">Zoiko One</h3>
              <p className="text-sm text-white/80 leading-relaxed">
                The connected business operations platform — the hero product of the Zoiko Business
                Cloud, bringing together people, time, payroll, billing, projects, compliance, spend
                and insights.
              </p>
            </div>
          </div>
        </div>

        <p className="text-[10px] font-bold text-[#9CA3AF] tracking-[0.15em] uppercase text-center mb-4">
          Infrastructure beneath Zoiko One
        </p>
        <div className="grid sm:grid-cols-2 gap-4 mb-10">
          {infraPlatforms.map((p) => (
            <div key={p.name} className="rounded-2xl p-6 bg-[#F8F7FC] border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md">
              <span
                className="inline-block text-[10px] font-bold tracking-wider rounded-full px-2.5 py-0.5 mb-3"
                style={{ background: p.tagColor + "15", color: p.tagColor }}
              >
                {p.tag}
              </span>
              <div
                className="w-10 h-10 rounded-xl flex items-center justify-center mb-3"
                style={{ background: p.tagColor + "15" }}
              >
                <p.icon size={18} color={p.tagColor} />
              </div>
              <h3 className="text-sm font-bold text-[#111827] mb-1.5">{p.name}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{p.desc}</p>
              <button className="inline-flex items-center gap-1 text-xs font-semibold text-[#3B82F6] hover:gap-1.5 transition-all">
                Learn more <ArrowRight size={13} />
              </button>
            </div>
          ))}
        </div>

        <div className="text-center">
          <button className="inline-flex items-center gap-2 bg-white text-[#374151] font-semibold px-7 py-3.5 rounded-full text-sm border-2 border-gray-200 hover:border-[#3B82F6] hover:text-[#3B82F6] transition-all duration-200">
            Explore the Zoiko Business Cloud <ArrowRight size={16} />
          </button>
        </div>
      </div>
    </section>
  );
}
