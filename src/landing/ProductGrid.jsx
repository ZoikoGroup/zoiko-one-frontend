import { ArrowRight, Users, Clock, WalletCards, CreditCard, Briefcase, FileCheck2, BarChart3, Wallet } from "lucide-react";

const products = [
  {
    name: "Zoiko HR",
    icon: Users,
    color: "#4F46E5",
    bg: "#EEF2FF",
    desc: "Employee records, onboarding, leave, performance and full lifecycle management.",
    question: '"Can we manage the full employee lifecycle from one place?"',
  },
  {
    name: "ZoikoTime",
    icon: Clock,
    color: "#0891B2",
    bg: "#E0F2FE",
    desc: "Time tracking, attendance, shifts, scheduling and payroll-ready evidence.",
    question: '"How do we capture time without the spreadsheets?"',
  },
  {
    name: "Zoiko Payroll",
    icon: WalletCards,
    color: "#059669",
    bg: "#ECFDF5",
    desc: "Pay runs, payslips, deductions, filings, approvals and payment readiness.",
    question: '"Can payroll finally stop being a fire drill every cycle?"',
  },
  {
    name: "Zoiko Billing",
    icon: CreditCard,
    color: "#D97706",
    bg: "#FFFBEB",
    desc: "Invoicing, recurring billing, collections, payment links and revenue dashboards.",
    question: '"How do we get paid faster without chasing every invoice?"',
  },
  {
    name: "Zoiko Projects",
    icon: Briefcase,
    color: "#6366F1",
    bg: "#EEF2FF",
    desc: "Project planning, task tracking, timesheets, budgets and team collaboration.",
    question: '"Can projects, time and billing finally live in the same system?"',
  },
  {
    name: "Zoiko Comply",
    icon: FileCheck2,
    color: "#DC2626",
    bg: "#FEF2F2",
    desc: "Compliance dashboards, filing calendars, audit logs and governance workflows.",
    question: '"How do we prove compliance without the manual spreadsheet scramble?"',
  },
  {
    name: "Zoiko Insights",
    icon: BarChart3,
    color: "#7C3AED",
    bg: "#F5F3FF",
    desc: "Executive dashboards, payroll analytics, revenue insights and forecasting.",
    question: '"Where is the single source of truth for business decisions?"',
  },
];

export default function ProductGrid() {
  return (
    <section className="bg-[#F8F7FC] py-20 md:py-24">
      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-14">
          <p className="text-xs font-bold text-[#F97316] tracking-[0.15em] uppercase mb-4">
            Seven products. One connected operating layer.
          </p>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#111827] leading-tight tracking-tight mb-4">
            One platform, eight core products.
          </h2>
          <p className="text-[#6B7280] max-w-xl mx-auto leading-relaxed">
            Buy standalone, combine in bundles, or adopt the enterprise framework — each product
            connects seamlessly.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {products.map((p) => (
            <div
              key={p.name}
              className="rounded-2xl p-6 border border-gray-100 shadow-sm transition-all duration-200 hover:shadow-md hover:-translate-y-0.5 bg-white"
            >
              <div
                className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                style={{ background: p.bg }}
              >
                <p.icon size={20} color={p.color} />
              </div>
              <h3 className="text-base font-bold text-[#111827] mb-1.5">{p.name}</h3>
              <p className="text-xs text-[#6B7280] leading-relaxed mb-3">{p.desc}</p>
              <p className="text-xs italic text-[#9CA3AF] mb-4 leading-relaxed">"{p.question}"</p>
              <button
                className="inline-flex items-center gap-1 text-xs font-semibold transition-colors duration-200 hover:gap-1.5"
                style={{ color: p.color }}
              >
                Explore {p.name.split(" ")[1] || p.name} <ArrowRight size={13} />
              </button>
            </div>
          ))}

          {/* Featured/CTA card */}
          <div className="rounded-2xl p-6 bg-gradient-to-br from-[#93C5FD] to-[#2563EB] text-white shadow-lg transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5">
            <div className="w-11 h-11 rounded-xl bg-white/20 flex items-center justify-center mb-4">
              <Wallet size={20} className="text-white" />
            </div>
            <h3 className="text-base font-bold mb-1.5">Zoiko Spend</h3>
            <p className="text-xs text-white/80 leading-relaxed mb-3">
              Vendor records, purchase requests, supplier invoices, spend policies and approvals.
            </p>
            <p className="text-xs italic text-white/60 mb-4 leading-relaxed">
              "How do we control spend without the procurement headache?"
            </p>
            <button className="inline-flex items-center gap-1 text-xs font-semibold text-white hover:gap-1.5 transition-all">
              Explore Spend <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
