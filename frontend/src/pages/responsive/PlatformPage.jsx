import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Menu,
  X as CloseIcon,
  ArrowRight,
  Check,
  X as XIcon,
  ChevronDown,
  Users,
  DollarSign,
  Grid3x3,
  Package,
  ShieldCheck,
  Fingerprint,
  ArrowLeftRight,
  Circle,
  Link2,
  FileText,
  Sparkles,
  FileBarChart,
  Wallet,
  ArrowUpRight,
  Diamond,
} from "lucide-react";
import logo from "../../assets/logo.png";
import Footer from "../../components/layout/Footer";

/* ---------------------------------------------------------
   Data
--------------------------------------------------------- */

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Platform", href: "/platform" },
  { label: "Products", href: "/products" },
  { label: "Solutions", href: "/solutions" },
  { label: "Pricing", href: "/pricing" },
  { label: "Resources", href: "/resources" },
  { label: "About", href: "/about" },
];

const disconnectedStack = [
  "Manual exports between tools",
  "Approvals lost in email",
  "Re-keyed data & errors",
  "Reporting after the fact",
  "No shared evidence trail",
];

const zoikoOneStack = [
  "One shared data spine",
  "Structured approval routing",
  "Clean cross-product handoffs",
  "Live operating visibility",
  "Audit-ready evidence",
];

const pillars = [
  {
    icon: Users,
    gradient: "from-[#7C6CF6] to-[#4F46E5]",
    label: "People",
    title: "People",
    desc: "Manage, track and pay the people who run the business.",
    tags: ["HR", "Time", "Payroll"],
  },
  {
    icon: DollarSign,
    gradient: "from-[#FB923C] to-[#F97316]",
    label: "Money",
    title: "Money",
    desc: "Control money in, money out, billing and vendor spend.",
    tags: ["Billing", "Spend"],
  },
  {
    icon: Grid3x3,
    gradient: "from-[#38BDF8] to-[#3B82F6]",
    label: "Work",
    title: "Work",
    desc: "Plan, deliver and monitor projects, budgets, margins and milestones.",
    tags: ["Projects"],
  },
  {
    icon: Package,
    gradient: "from-[#818CF8] to-[#6366F1]",
    label: "Supply",
    title: "Supply",
    desc: "Manage stock, locations, goods movement, receiving and valuation.",
    tags: ["Inventory"],
  },
  {
    icon: Check,
    gradient: "from-[#4338CA] to-[#312E81]",
    label: "Control",
    title: "Control",
    desc: "Govern compliance, evidence, risk, dashboards and intelligence.",
    tags: ["Comply", "Insights"],
  },
];

const spineItems = [
  { icon: Fingerprint, title: "ZoikoID", desc: "Identity, roles, permissions, entities" },
  { icon: ArrowLeftRight, title: "Zoiko Workflow", desc: "Routing, approvals, escalations, policy" },
  { icon: Circle, title: "Zoiko Hub", desc: "Tasks, alerts, approvals, daily priorities" },
  { icon: Link2, title: "Zoiko Connect", desc: "APIs, connectors, imports & exports" },
  { icon: FileText, title: "Documents + Docs Pro", desc: "Governance plus premium automation" },
  { icon: Sparkles, title: "AI Assistance", desc: "Governed, inside policy & approvals" },
];

const workflowSteps = [
  {
    number: 1,
    title: "New employee to payroll",
    chain: ["HR record", "ZoikoID access", "Approved time", "Payroll workflow", "Approval", "Documents / evidence", "Insights"],
  },
  {
    number: 2,
    title: "Project to billing",
    chain: ["Project setup", "Resources & milestones", "Approved billable time", "Billing event", "Approval", "Revenue & margin"],
  },
  {
    number: 3,
    title: "Spend to inventory",
    chain: ["Purchase request", "Policy check", "Approval", "PO", "Goods received", "Inventory movement", "Supplier invoice evidence"],
  },
  {
    number: 4,
    title: "Documents to compliance",
    chain: ["Approved template", "Guided workflow", "Review", "Approval", "Secure storage", "Evidence", "Compliance trail"],
  },
];

const governanceCards = [
  { icon: Fingerprint, title: "Identity & permissions", desc: "Role boundaries across teams, departments and entities." },
  { icon: Check, title: "Approval routing", desc: "Structured, standardized approvals across products." },
  { icon: FileBarChart, title: "Evidence & audit", desc: "Decision trails, document history and activity records." },
  { icon: Sparkles, title: "Governed AI", desc: "Summaries, drafting, routing and exception analysis — in-bounds." },
];

const moneyFlow = [
  { icon: FileBarChart, gradient: "from-[#FB923C] to-[#F97316]", title: "Billing → money in", desc: "Invoices, subscriptions and revenue records." },
  { icon: DollarSign, gradient: "from-[#818CF8] to-[#6366F1]", title: "Payroll → money to people", desc: "Approved pay runs from HR and time data." },
  { icon: ArrowLeftRight, gradient: "from-[#FB923C] to-[#F97316]", title: "Spend → money to vendors", desc: "Requests, POs, supplier invoices and AP." },
  { icon: Package, gradient: "from-[#818CF8] to-[#6366F1]", title: "Inventory → money in goods", desc: "Stock value, receiving and movement." },
  { icon: ArrowRight, gradient: "from-[#38BDF8] to-[#3B82F6]", title: "ZoikoPay → moves money", desc: "Settlement and money movement support." },
  { icon: Diamond, gradient: "from-[#4338CA] to-[#312E81]", title: "ZoikoCoreX → financial truth", desc: "Ledger-grade governed traceability." },
];

const faqs = [
  {
    q: "How many products does Zoiko One have?",
    a: "Zoiko One covers nine core operational products across five pillars — HR, Time, Payroll, Billing, Spend, Projects, Inventory, Comply and Insights — plus the Docs Pro premium layer, all connected by the platform spine.",
  },
  {
    q: "What is the platform spine?",
    a: "The platform spine consists of shared layers — ZoikoID, Workflow, Hub, Connect, Documents, Approvals, Expenses and AI Assistance — that run beneath every product and provide identity, routing, tasks, integrations and governance across the platform.",
  },
  {
    q: "Is Docs Pro legal advice?",
    a: "No. Zoiko Docs Pro is a premium document automation capability that works from approved templates and guided workflows. It is not legal advice and does not replace qualified professional review.",
  },
  {
    q: "Can I start with one product?",
    a: "Yes. You can activate any single core product first — HR, Time, Payroll, Billing, Spend, Projects, Inventory, Comply or Insights — and expand into a pillar workflow or full platform as your needs grow.",
  },
  {
    q: "How does Zoiko One handle accounting?",
    a: "Zoiko One manages operational transactions and money movement through ZoikoPay and ZoikoCoreX. ZoikoSuite — an ecosystem sibling — keeps the formal books outside the platform.",
  },
];

/* ---------------------------------------------------------
   Reusable bits
--------------------------------------------------------- */

function SectionLabel({ color = "text-accent", children }) {
  return (
    <p className={`text-xs font-bold tracking-widest uppercase ${color} mb-2`}>
      {children}
    </p>
  );
}

function PrimaryButton({ children, to, onClick, className = "" }) {
  const Comp = to ? Link : "button";
  return (
    <Comp
      to={to}
      onClick={onClick}
      className={`inline-flex items-center justify-center gap-2 bg-accent hover:bg-accent-hover text-white font-semibold rounded-full px-6 py-3.5 shadow-md shadow-orange-200 transition-colors no-underline ${className}`}
    >
      {children}
    </Comp>
  );
}

function OutlineButton({ children, to, className = "" }) {
  return (
    <Link
      to={to}
      className={`inline-flex items-center justify-center gap-2 bg-white hover:bg-gray-50 border border-gray-200 text-primary-dark font-semibold rounded-full px-6 py-3.5 transition-colors no-underline ${className}`}
    >
      {children}
    </Link>
  );
}

/* ---------------------------------------------------------
   Header
--------------------------------------------------------- */

function ResponsiveHeader() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <>
      <header className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-[#E2E4EF]">
        <div className="mx-auto max-w-7xl flex items-center justify-between px-4 sm:px-6 lg:px-8 h-16">
          <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
            <img src={logo} alt="Zoiko One" className="h-8 sm:h-9 w-auto object-contain" />
          </Link>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-6 text-sm font-medium text-[#2A2F55]">
            {navLinks.map((l) => (
              <Link
                key={l.label}
                to={l.href}
                className="hover:text-accent transition-colors no-underline"
              >
                {l.label}
              </Link>
            ))}
          </nav>

          <div className="hidden md:flex items-center gap-4 text-sm font-semibold">
            <Link to="/login" className="text-primary-dark no-underline">
              Sign In
            </Link>
            <button
              onClick={() => navigate("/get-demo")}
              className="inline-flex items-center gap-1 bg-accent hover:bg-accent-hover text-white rounded-full px-5 py-2.5 shadow-md shadow-orange-200 transition-colors"
            >
              Get a Demo <ArrowRight size={15} />
            </button>
          </div>

          {/* Mobile hamburger */}
          <button
            aria-label="Toggle menu"
            onClick={() => setOpen((o) => !o)}
            className="md:hidden inline-flex items-center justify-center w-9 h-9 text-primary-dark"
          >
            {open ? <CloseIcon size={24} /> : <Menu size={24} />}
          </button>
        </div>

        {/* Mobile menu panel */}
        {open && (
          <div className="md:hidden border-t border-[#E2E4EF] bg-white px-4 pb-4">
            <nav className="flex flex-col gap-1 pt-2">
              {navLinks.map((l) => (
                <Link
                  key={l.label}
                  to={l.href}
                  onClick={() => setOpen(false)}
                  className="py-2.5 text-sm font-medium text-[#2A2F55] no-underline border-b border-gray-100 last:border-0"
                >
                  {l.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-3 mt-4">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="text-center text-sm font-semibold text-primary-dark no-underline py-2"
              >
                Sign In
              </Link>
              <button
                onClick={() => {
                  setOpen(false);
                  navigate("/get-demo");
                }}
                className="inline-flex items-center justify-center gap-1 bg-accent hover:bg-accent-hover text-white rounded-full px-5 py-3 shadow-md shadow-orange-200 transition-colors font-semibold text-sm"
              >
                Get a Demo <ArrowRight size={15} />
              </button>
            </div>
          </div>
        )}
      </header>
    </>
  );
}

/* ---------------------------------------------------------
   Hero
--------------------------------------------------------- */

function Hero() {
  return (
    <section className="bg-gradient-to-b from-[#EDEBFA] via-[#F3F1FA] to-bg-lavender px-4 sm:px-6 lg:px-8 pt-8 pb-12">
      <div className="max-w-5xl mx-auto">
        <p className="text-xs text-muted-text mb-4">
          <Link to="/" className="hover:text-accent no-underline">Home</Link>
          <span className="mx-1.5">/</span>
          <span className="text-primary-dark font-medium">Platform</span>
        </p>

        <div className="inline-flex items-center gap-2 bg-white rounded-full pl-1 pr-4 py-1 mb-6 shadow-sm border border-gray-100">
          <span className="bg-secondary text-white text-xs font-semibold rounded-full px-3 py-1">
            Platform
          </span>
          <span className="text-xs text-muted-text font-medium">
            One governed operating spine
          </span>
        </div>

        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-primary-dark leading-tight max-w-2xl">
          One platform to run people, money, work, supply and{" "}
          <span className="text-accent">control.</span>
        </h1>

        <p className="mt-5 text-base text-muted-text max-w-xl leading-relaxed">
          Zoiko One connects the core operations of a modern business through
          one governed business-operations platform — HR, time, payroll,
          billing, spend, projects, inventory, compliance, documents,
          approvals, workflows, insights and AI assistance in one shared
          operating system.
        </p>

        <div className="mt-6 bg-card-bg border border-[#E5E1F5] rounded-2xl px-5 py-4 max-w-xl">
          <p className="text-sm text-[#3F3A66] font-medium">
            Start with one product, activate a pillar or scale into the full
            platform.
          </p>
        </div>

        <div className="mt-7 flex flex-col sm:flex-row gap-3 max-w-xl">
          <PrimaryButton to="/get-demo">
            Get a Demo <ArrowRight size={16} />
          </PrimaryButton>
          <OutlineButton to="/how-it-works">See How It Works</OutlineButton>
          <OutlineButton to="/products">Explore Products</OutlineButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Platform Problem
--------------------------------------------------------- */

function PlatformProblem() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>The Platform Problem</SectionLabel>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-dark leading-tight max-w-xl">
          Disconnected tools slow down growing businesses.
        </h2>
        <p className="mt-4 text-base text-muted-text max-w-xl leading-relaxed">
          Most businesses don't suffer from too little software — they suffer
          from too many disconnected systems. Zoiko One fixes the operating
          gap between departments by connecting data, approvals, documents,
          workflows and evidence.
        </p>

        <PrimaryButton
          to="/how-it-works"
          className="mt-6 !bg-primary-dark hover:!bg-[#151234]"
        >
          See the Platform Difference <ArrowRight size={16} />
        </PrimaryButton>

        <div className="mt-9 grid sm:grid-cols-2 gap-5 max-w-3xl">
          <div className="border border-dashed border-gray-300 rounded-2xl p-6">
            <h3 className="text-base font-bold text-primary-dark mb-4">
              Disconnected stack
            </h3>
            <ul className="space-y-3">
              {disconnectedStack.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm text-[#4B4869]">
                  <XIcon size={16} className="text-red-400 mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="rounded-2xl p-6 text-white bg-gradient-to-br from-[#3B2FB0] via-[#4A3FC0] to-[#3B82F6]">
            <h3 className="text-base font-bold mb-4">Zoiko One</h3>
            <ul className="space-y-3">
              {zoikoOneStack.map((item) => (
                <li key={item} className="flex items-start gap-2.5 text-sm">
                  <Check size={16} className="text-accent mt-0.5 shrink-0" />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Five Pillars
--------------------------------------------------------- */

function FivePillars() {
  return (
    <section className="bg-bg-lavender px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-5xl mx-auto">
        <SectionLabel color="text-secondary">Five-Pillar Operating Model</SectionLabel>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-dark leading-tight max-w-xl">
          Built around how businesses actually operate.
        </h2>
        <p className="mt-4 text-base text-muted-text max-w-xl leading-relaxed">
          Every product belongs to a pillar and shares the same platform
          spine.
        </p>

        <div className="mt-9 grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {pillars.map((p) => (
            <div
              key={p.title}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div
                className={`w-11 h-11 rounded-xl bg-gradient-to-br ${p.gradient} flex items-center justify-center mb-4`}
              >
                <p.icon size={20} className="text-white" />
              </div>
              <p className="text-xs font-bold tracking-widest uppercase text-secondary mb-1">
                {p.label}
              </p>
              <h3 className="text-lg font-bold text-primary-dark mb-2">
                {p.title}
              </h3>
              <p className="text-sm text-muted-text leading-relaxed mb-4">
                {p.desc}
              </p>
              <div className="flex flex-wrap gap-2">
                {p.tags.map((t) => (
                  <span
                    key={t}
                    className="bg-card-bg text-[#3F3A66] text-xs font-medium rounded-full px-3 py-1"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="mt-9 text-center">
          <OutlineButton to="/five-pillars/people" className="inline-flex">
            Explore the Five Pillars
          </OutlineButton>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Connected Spine
--------------------------------------------------------- */

function ConnectedSpine() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-5xl mx-auto">
        <SectionLabel color="text-secondary">The Connected Spine</SectionLabel>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-dark leading-tight max-w-xl">
          One connected spine beneath every product.
        </h2>
        <p className="mt-4 text-base text-muted-text max-w-xl leading-relaxed">
          ZoikoID, Workflow, Hub, Connect, Documents, Approvals, Expenses and
          AI Assistance create the common operating foundation across the
          platform. These are shared layers — not separate pillar products.
        </p>

        <PrimaryButton to="/integrations" className="mt-6 !bg-primary-dark hover:!bg-[#151234]">
          See Connected Workflows <ArrowRight size={16} />
        </PrimaryButton>

        <div className="mt-8 rounded-3xl p-5 sm:p-6 bg-gradient-to-b from-[#241B62] to-[#3B2FB0] max-w-3xl">
          <div className="grid sm:grid-cols-2 gap-3">
            {spineItems.map((s) => (
              <div
                key={s.title}
                className="flex items-start gap-3 bg-white/10 rounded-xl p-4"
              >
                <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center shrink-0">
                  <s.icon size={16} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-bold text-white">{s.title}</p>
                  <p className="text-xs text-white/65 mt-0.5">{s.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   How Zoiko One Works
--------------------------------------------------------- */

function HowItWorks() {
  return (
    <section className="bg-bg-lavender px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>How Zoiko One Works</SectionLabel>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-dark leading-tight max-w-xl">
          From business event to approved action.
        </h2>
        <p className="mt-4 text-base text-muted-text max-w-xl leading-relaxed">
          Business events trigger structured workflows, approvals, record
          updates and evidence capture across the relevant products and
          platform layers.
        </p>

        <div className="mt-9 grid sm:grid-cols-2 gap-5">
          {workflowSteps.map((step) => (
            <div
              key={step.number}
              className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100"
            >
              <div className="flex items-center gap-3 mb-4">
                <span className="w-7 h-7 rounded-full bg-accent text-white text-sm font-bold flex items-center justify-center shrink-0">
                  {step.number}
                </span>
                <h3 className="text-base font-bold text-primary-dark">
                  {step.title}
                </h3>
              </div>
              <div className="flex flex-wrap items-center gap-x-1.5 gap-y-2">
                {step.chain.map((item, i) => (
                  <span key={item} className="flex items-center gap-1.5">
                    <span className="bg-card-bg text-[#3F3A66] text-xs font-medium rounded-full px-3 py-1.5 whitespace-nowrap">
                      {item}
                    </span>
                    {i < step.chain.length - 1 && (
                      <ArrowRight size={13} className="text-accent shrink-0" />
                    )}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Governance & AI
--------------------------------------------------------- */

function GovernanceAI() {
  return (
    <section className="bg-gradient-to-b from-[#241B62] to-[#1E1B4B] px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Governance &amp; AI</SectionLabel>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white leading-tight max-w-xl">
          Control is built into the platform, not added at the end.
        </h2>
        <p className="mt-4 text-base text-white/65 max-w-xl leading-relaxed">
          Governance is embedded through identity, permissions, approvals,
          evidence trails and document controls. AI assistance helps users
          act faster — inside permission, policy and approval boundaries.
        </p>

        <div className="mt-9 grid sm:grid-cols-2 gap-4 max-w-3xl">
          {governanceCards.map((c) => (
            <div
              key={c.title}
              className="bg-white/10 border border-white/10 rounded-2xl p-5"
            >
              <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center mb-3">
                <c.icon size={17} className="text-white" />
              </div>
              <h3 className="text-sm font-bold text-white mb-1.5">
                {c.title}
              </h3>
              <p className="text-xs text-white/60 leading-relaxed">
                {c.desc}
              </p>
            </div>
          ))}
        </div>

        <PrimaryButton to="/how-it-works" className="mt-8">
          See AI Assistance in Action <ArrowRight size={16} />
        </PrimaryButton>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Money Architecture
--------------------------------------------------------- */

function MoneyArchitecture() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-5xl mx-auto">
        <SectionLabel>Money Architecture</SectionLabel>
        <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-primary-dark leading-tight max-w-xl">
          Money flows through the platform with clear boundaries.
        </h2>

        <div className="mt-9 grid sm:grid-cols-2 gap-4 max-w-3xl">
          {moneyFlow.map((m) => (
            <div
              key={m.title}
              className="border border-gray-100 shadow-sm rounded-2xl p-5 flex items-start gap-4"
            >
              <div
                className={`w-10 h-10 rounded-xl bg-gradient-to-br ${m.gradient} flex items-center justify-center shrink-0`}
              >
                <m.icon size={17} className="text-white" />
              </div>
              <div>
                <h3 className="text-sm font-bold text-primary-dark mb-1">
                  {m.title}
                </h3>
                <p className="text-xs text-muted-text leading-relaxed">
                  {m.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-6 text-sm text-muted-text max-w-2xl">
          ZoikoSuite keeps the books — outside Zoiko One, as an ecosystem
          sibling.
        </p>

        <div className="mt-9 grid sm:grid-cols-2 gap-5 max-w-3xl">
          <div className="bg-card-bg rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#818CF8] to-[#4F46E5] flex items-center justify-center mb-4">
              <Link2 size={18} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-primary-dark mb-2">
              Connect what you already use.
            </h3>
            <p className="text-sm text-muted-text leading-relaxed mb-3">
              Zoiko Connect supports APIs, connectors, data imports, exports,
              workflow triggers and secure third-party links.
            </p>
            <Link
              to="/integrations"
              className="text-sm font-semibold text-secondary hover:text-accent no-underline inline-flex items-center gap-1"
            >
              Explore Zoiko Connect <ArrowRight size={14} />
            </Link>
          </div>

          <div className="bg-card-bg rounded-2xl p-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#FB923C] to-[#F97316] flex items-center justify-center mb-4">
              <ArrowUpRight size={18} className="text-white" />
            </div>
            <h3 className="text-base font-bold text-primary-dark mb-2">
              Start small. Expand with control.
            </h3>
            <p className="text-sm text-muted-text leading-relaxed">
              Begin with one product, one pillar or one urgent workflow, then
              activate more products on the same shared spine.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   FAQ
--------------------------------------------------------- */

function FAQ() {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <section className="bg-bg-lavender px-4 sm:px-6 lg:px-8 py-14">
      <div className="max-w-3xl mx-auto text-center">
        <SectionLabel color="text-secondary">
          <span className="block text-center">Platform FAQs</span>
        </SectionLabel>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-primary-dark">
          Questions about the platform.
        </h2>

        <div className="mt-8 space-y-3 text-left">
          {faqs.map((faq, i) => {
            const isOpen = openIdx === i;
            return (
              <div key={i} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <button
                  onClick={() => setOpenIdx(isOpen ? null : i)}
                  className="w-full flex items-center justify-between px-5 py-4 text-left"
                >
                  <span className="text-sm font-semibold text-primary-dark">
                    {faq.q}
                  </span>
                  <ChevronDown
                    size={18}
                    className={`text-secondary shrink-0 transition-transform ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-sm text-muted-text leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   CTA Banner
--------------------------------------------------------- */

function CTABanner() {
  return (
    <section className="bg-white px-4 sm:px-6 lg:px-8 pb-14">
      <div className="max-w-5xl mx-auto rounded-3xl p-8 sm:p-12 text-center bg-gradient-to-br from-[#3B2FB0] via-[#4A3FC0] to-[#3B82F6]">
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white leading-tight max-w-xl mx-auto">
          Run the business from one connected platform.
        </h2>
        <p className="mt-4 text-sm sm:text-base text-white/80 max-w-lg mx-auto leading-relaxed">
          Bring people, money, work, supply, control, documents, approvals,
          workflows, insights and AI assistance into one governed operating
          system.
        </p>
        <div className="mt-7 flex flex-col sm:flex-row items-center justify-center gap-3">
          <PrimaryButton to="/get-demo" className="w-full sm:w-auto">
            Get a Demo <ArrowRight size={16} />
          </PrimaryButton>
          <Link
            to="/products"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white/15 hover:bg-white/25 border border-white/35 text-white font-semibold rounded-full px-6 py-3.5 transition-colors no-underline"
          >
            Explore Products
          </Link>
          <Link
            to="/pricing"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 text-white font-semibold underline decoration-white/50 px-2 py-2"
          >
            Request Pricing
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------
   Page
--------------------------------------------------------- */

export default function PlatformPage() {
  return (
    <div className="bg-white">
      <ResponsiveHeader />
      <Hero />
      <PlatformProblem />
      <FivePillars />
      <ConnectedSpine />
      <HowItWorks />
      <GovernanceAI />
      <MoneyArchitecture />
      <FAQ />
      <CTABanner />
      <Footer />
    </div>
  );
}
