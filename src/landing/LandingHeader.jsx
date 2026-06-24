import { ChevronDown, Users, Clock, DollarSign, Grid3x3, ArrowLeftRight, ArrowRight, LayoutGrid, Hexagon, CheckCircle2, BarChart3, SquareDot } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import logo from "../assets/logo.png";

const NAVY = "#161B33";
const BODY = "#5B6373";
const LABEL_GRAY = "#8A93A3";
const BLUE = "#2B3FE0";
const ORANGE = "#F0973E";
const ORANGE_DARK = "#E8894F";
const ICON_BRIGHT_BLUE = "#3B9CE0";
const ICON_NAVY = "#1E2A6A";
const BORDER = "#E6E8EC";

const productColumns = [
  {
    label: "PEOPLE",
    items: [
      { icon: Users, iconBg: BLUE, title: "Zoiko HR", desc: "Records, onboarding, lifecycle", href: "/products/zoiko-hr" },
      { icon: Clock, iconBg: BLUE, title: "ZoikoTime", desc: "Time, attendance, schedules", href: "/products/zoikotime" },
      { icon: DollarSign, iconBg: BLUE, title: "Zoiko Payroll", desc: "Controlled pay runs", href: "/products/payroll" },
    ],
  },
  {
    label: "MONEY",
    items: [
      { icon: Grid3x3, iconBg: ORANGE, title: "Zoiko Billing", desc: "Invoices, subscriptions, revenue", href: "/products/billing" },
      { icon: ArrowLeftRight, iconBg: ORANGE, title: "Zoiko Spend", desc: "Procurement, POs, vendor AP", href: "/spend" },
    ],
    secondLabel: "WORK + SUPPLY",
    secondItems: [
      { icon: LayoutGrid, iconBg: ICON_BRIGHT_BLUE, title: "Zoiko Projects", desc: "Delivery, budgets, margin", href: "/projects" },
      { icon: Hexagon, iconBg: BLUE, title: "Zoiko Inventory", desc: "Stock, receiving, reorder", href: "/inventory" },
    ],
  },
  {
    label: "CONTROL",
    items: [
      { icon: CheckCircle2, iconBg: ICON_NAVY, title: "Zoiko Comply", desc: "Obligations, evidence, audit", href: "/comply" },
      { icon: BarChart3, iconBg: ICON_NAVY, title: "Zoiko Insights", desc: "Dashboards, risk, forecasts", href: "/insights" },
    ],
    secondLabel: "PREMIUM CAPABILITY",
    secondItems: [
      { icon: SquareDot, iconBg: ORANGE_DARK, title: "Zoiko Docs Pro", desc: "Jurisdiction-aware documents", href: "/zoiko-docs" },
    ],
  },
];

function ProductRowItem({ icon: Icon, iconBg, title, desc, href }) {
  return (
    <Link
      to={href}
      style={{
        display: "flex",
        gap: 12,
        alignItems: "flex-start",
        padding: "8px 6px",
        borderRadius: 10,
        cursor: "pointer",
        textDecoration: "none",
        transition: "background .15s ease",
      }}
      onMouseEnter={(e) => (e.currentTarget.style.background = "#F7F8FA")}
      onMouseLeave={(e) => (e.currentTarget.style.background = "transparent")}
    >
      <div
        style={{
          width: 38,
          height: 38,
          borderRadius: 10,
          background: iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          flexShrink: 0,
        }}
      >
        <Icon size={18} color="#fff" strokeWidth={2.2} />
      </div>
      <div>
        <div style={{ fontWeight: 800, fontSize: 14, color: NAVY, marginBottom: 2 }}>{title}</div>
        <div style={{ fontSize: 12, color: BODY, lineHeight: 1.4 }}>{desc}</div>
      </div>
    </Link>
  );
}

const navLinks = ["Home", "Platform", "Products", "Solutions", "Pricing", "Resources", "About"];

export default function LandingHeader() {
  const navigate = useNavigate();
  return (
    <div className="bg-gradient-to-b from-[#F1EEFC] to-white">
      <div className="px-4 sm:px-6 lg:px-20 pt-8">
        <nav className="flex items-center justify-between bg-white rounded-full shadow-[0_2px_20px_rgba(0,0,0,0.06)] px-6 py-3">
          <Link to="/" className="flex items-center gap-2 shrink-0 no-underline">
            <img src={logo} alt="Zoiko One" style={{ height: "36px", width: "auto", objectFit: "contain" }} />
          </Link>

          <div className="hidden md:flex items-center gap-7 text-sm font-medium text-[#2A2F55] overflow-visible">
            {navLinks.map((l) => {
              if (l === "Home") {
                return <Link key={l} to="/" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              if (l === "Products") {
                return (
                  <div key={l} className="relative group">
                    <span className="hover:text-[#4F46E5] transition-colors cursor-default inline-flex items-center gap-1">
                      Products <ChevronDown size={13} className="mt-0.5 transition-transform duration-200 group-hover:rotate-180" />
                    </span>
                    <div className="absolute top-full left-1/2 -translate-x-1/2 pt-3 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
                      <div
                        style={{
                          background: "#fff",
                          border: `1px solid ${BORDER}`,
                          borderRadius: 20,
                          boxShadow: "0 24px 60px rgba(20,25,50,0.12)",
                          padding: "28px 32px",
                          display: "grid",
                          gridTemplateColumns: "repeat(3, 1fr)",
                          gap: 40,
                          minWidth: 800,
                        }}
                      >
                        {productColumns.map((col) => (
                          <div key={col.label}>
                            <div style={{ fontSize: 11, fontWeight: 800, color: LABEL_GRAY, letterSpacing: "0.08em", marginBottom: 14 }}>{col.label}</div>
                            <div style={{ display: "flex", flexDirection: "column", gap: 4, marginBottom: col.secondLabel ? 22 : 0 }}>
                              {col.items.map((item) => (
                                <ProductRowItem key={item.title} {...item} />
                              ))}
                            </div>
                            {col.secondLabel && (
                              <>
                                <div style={{ fontSize: 11, fontWeight: 800, color: LABEL_GRAY, letterSpacing: "0.08em", marginBottom: 14 }}>{col.secondLabel}</div>
                                <div style={{ display: "flex", flexDirection: "column", gap: 4 }}>
                                  {col.secondItems.map((item) => (
                                    <ProductRowItem key={item.title} {...item} />
                                  ))}
                                </div>
                              </>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                );
              }
              if (l === "Solutions") {
                return <Link key={l} to="/solutions" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              if (l === "Pricing") {
                return <Link key={l} to="/pricing" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              if (l === "Resources") {
                return <Link key={l} to="/resources" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              if (l === "About") {
                return <Link key={l} to="/about" className="hover:text-[#4F46E5] transition-colors no-underline">{l}</Link>;
              }
              return (
                <a key={l} href={l === "Platform" ? "/platform" : "/"} className="hover:text-[#4F46E5] transition-colors">
                  {l}
                </a>
              );
            })}
          </div>

          <div className="flex items-center gap-4 text-sm font-semibold">
            <Link to="/login" className="text-[#1E1B4B] no-underline">
              Sign In
            </Link>
            <button onClick={() => navigate("/get-demo")} className="inline-flex items-center gap-1 bg-[#F97316] hover:bg-[#EA580C] text-white rounded-full px-5 py-2.5 shadow-md shadow-orange-200 transition-all duration-200">
              Get a Demo <ArrowRight size={15} />
            </button>
          </div>
        </nav>
      </div>
    </div>
  );
}
