import React, { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../../assets/logo.png";

const navData = {
  platform: {
    title: "Platform",
    links: [
      "Overview",
      { label: "How Zoiko One Works", href: "/how-it-works" },
      { label: "Security", href: "/security" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "Integrations", href: "/integrations" },
      { label: "API Documentation", href: "/api-documentation" },
      { label: "System Status", href: "/system-status" },
    ],
  },
  products: {
    title: "Products",
    links: [
      { label: "Zoiko HR", href: "/products/zoiko-hr" },
      { label: "ZoikoTime", href: "/products/zoikotime" },
      { label: "Zoiko Payroll", href: "/products/payroll" },
      { label: "Zoiko Billing", href: "/products/billing" },
      { label: "Zoiko Spend", href: "/products/spend" },
      { label: "Zoiko Projects", href: "/projects" },
      { label: "Zoiko Inventory", href: "/inventory" },
      { label: "Zoiko Comply", href: "/products/comply" },
      { label: "Zoiko Insights", href: "/insights" },
      { label: "Zoiko Docs Pro", href: "/zoiko-docs" },
    ],
  },
  solutions: {
    title: "Solutions",
    links: [
      "Services Businesses",
      { label: "Agencies", href: "/solutions/agencies" },
      { label: "Retail Businesses", href: "/solutions/retail" },
      "Trades Businesses",
      "Hospitality",
      "E-Commerce",
      "Product Businesses",
      "Multi-Entity",
    ],
  },
  fivePillars: {
    title: "Five Pillars",
    links: [
      { label: "People — HR, Time, Payroll", href: "/five-pillars/people" },
      { label: "Money — Billing, Spend", href: "/five-pillars/money" },
      { label: "Work — Projects", href: "/five-pillars/work" },
      { label: "Supply — Inventory", href: "/five-pillars/supply" },
      { label: "Control — Comply, Insights", href: "/five-pillars/control" },
    ],
  },
  resources: {
    title: "Resources",
    links: [
      { label: "Resource Center", href: "/resources" },
      { label: "Trust Center", href: "/trust-center" },
      { label: "Security", href: "/security" },
      { label: "Integrations", href: "/integrations" },
      { label: "API Documentation", href: "/api-documentation" },
      { label: "System Status", href: "/system-status" },
      { label: "Pricing", href: "/pricing" },
      { label: "Contact", href: "/contact" },
    ],
  },
  company: {
    title: "Company",
    links: [
      { label: "About Zoiko One", href: "/about" },
      { label: "Leadership", href: "/leadership" },
      { label: "Careers", href: "/careers" },
      { label: "Contact", href: "/contact" },
      "Pricing",
      { label: "Trust Center", href: "/trust-center" },
      "Solutions",
    ],
  },
};

const ecosystemCards = [
  { name: "Zoiko One", desc: "Business operations — this platform", href: "/eco-system" },
  { name: "ZoikoVertex", desc: "CRM, sales, marketing & growth", href: "/vertex" },
  { name: "ZoikoSuite", desc: "Accounting & bookkeeping", href: "/suite" },
  { name: "Zoiko Sema", desc: "Communication & collaboration", href: "/sema" },
  { name: "Zoiko Local", desc: "Telephony & business calling", href: "/local" },
  { name: "Zoiko Digital", desc: "Web, app, cloud & digital services", href: "/digital" },
];

const legalLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Accessibility Statement",
  "Acceptable Use",
  { label: "Trust Center", href: "/trust-center" },
  { label: "Security", href: "/security" },
  "System Status",
  { label: "Contact", href: "/contact" },
];

const getStartedLinks = [
  { label: "Get a Demo", href: "/get-demo" },
  { label: "Request Pricing", href: "/pricing" },
  { label: "Explore Products", href: "/products" },
  { label: "Contact Sales", href: "/contact" },
  { label: "Sign In", href: "/login" },
];

function EcoFooterCard({ card }) {
  const [hovered, setHovered] = useState(false);
  const linkable = !!card.href;

  const content = (
    <div
      style={{
        border: "1.5px solid rgba(255,255,255,0.15)",
        borderRadius: "10px",
        padding: "14px",
        textAlign: "left",
        display: "flex",
        flexDirection: "column",
        height: "100%",
        background: linkable
          ? hovered
            ? "linear-gradient(135deg,#3b2fb0 0%,#4a3fc0 40%,#3a6fd8 100%)"
            : "#f97316"
          : hovered
            ? "rgba(255,255,255,0.08)"
            : "transparent",
        borderColor: hovered ? (linkable ? "transparent" : "rgba(255,255,255,0.35)") : undefined,
        cursor: linkable ? "pointer" : "default",
        transition: "background 0.2s, border-color 0.2s",
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <div style={{
        fontSize: "13px",
        fontWeight: "700",
        color: "#ffffff",
        marginBottom: "5px",
      }}>
        {card.name}
      </div>
      <div style={{
        fontSize: "11px",
        color: linkable ? "rgba(255,255,255,0.85)" : hovered ? "rgba(255,255,255,0.85)" : "rgba(255,255,255,0.65)",
        lineHeight: "1.35",
        transition: "color 0.2s",
        flex: "1",
      }}>
        {card.desc}
      </div>
    </div>
  );

  return linkable ? (
    <Link to={card.href} style={{ textDecoration: "none", display: "block" }}>
      {content}
    </Link>
  ) : (
    content
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#110d2e] text-white w-full" style={{ fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      {/* CTA Banner */}
      <div className="px-5 sm:px-7 pt-7">
        <div
          className="mx-auto max-w-[1100px] rounded-2xl px-5 py-7 sm:px-12 sm:py-9 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 sm:gap-8"
          style={{ background: "linear-gradient(135deg, #3a2caa 0%, #4a6fd8 60%, #4a99e8 100%)" }}
        >
          <div className="min-w-0">
            <h2 className="text-xl sm:text-[26px] font-bold text-white leading-tight mb-2.5">
              Everything your business runs on —<br className="hidden sm:block" />connected in one.
            </h2>
            <p className="text-[13.5px] text-white/88 mb-2 max-w-[480px] leading-relaxed">
              Run people, money, work, supply, compliance, business intelligence and
              document workflows through one connected business-operations platform.
            </p>
            <p className="text-xs text-white/60">
              Start with one product, one pillar or the full Zoiko One platform.
            </p>
          </div>
          <div className="flex flex-wrap items-center gap-3.5 shrink-0">
            <button className="text-white border-none rounded-full px-7 py-3.5 text-[15px] font-semibold cursor-pointer whitespace-nowrap" style={{ background: "linear-gradient(135deg, #f97316, #fb923c)" }}>
              Get a Demo →
            </button>
            <button className="text-white border-[1.5px] border-white/35 rounded-full px-7 py-3 text-[15px] font-semibold cursor-pointer whitespace-nowrap" style={{ background: "rgba(255,255,255,0.15)" }}>
              Explore Products
            </button>
            <button className="text-white border-none text-sm font-semibold cursor-pointer whitespace-underline whitespace-nowrap bg-transparent">
              Pricing
            </button>
          </div>
        </div>
      </div>

      {/* Main Nav Grid */}
      <div className="mx-auto max-w-[1100px] px-5 sm:px-7 pt-10 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-[200px_repeat(6,1fr)] gap-6">
        {/* Brand Column */}
        <div className="col-span-2 sm:col-span-3 lg:col-span-1">
          <div className="flex items-center gap-2.5 mb-3.5">
            <img src={logo} alt="Zoiko One" className="h-9 w-auto object-contain" />
          </div>
          <p className="text-[12.5px] text-white/55 leading-relaxed mb-4.5">
            The connected business-operations platform for people, money, work,
            supply and control.
          </p>
          <div className="flex gap-2.5">
            {["in", "𝕏", "⌥"].map((icon, i) => (
              <button key={i} className="w-[34px] h-[34px] rounded-full border-[1.5px] border-white/20 bg-transparent text-white/70 flex items-center justify-center text-sm cursor-pointer" aria-label={`Social ${i}`}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Nav Columns */}
        {Object.values(navData).map((col) => (
          <div key={col.title}>
            <div className="text-[11.5px] font-bold text-[#f97316] uppercase tracking-widest mb-3.5">
              {col.title}
            </div>
            <ul className="list-none p-0 m-0">
              {col.links.map((link) => (
                <li key={typeof link === "string" ? link : link.label} className="mb-2.5">
                  {typeof link === "string" ? (
                    <a href="#" className="text-white/72 no-underline text-[13px] leading-snug block">{link}</a>
                  ) : (
                    <Link to={link.href} className="text-white/72 no-underline text-[13px] leading-snug block">{link.label}</Link>
                  )}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Get Started */}
      <div className="border-t border-white/10 mt-10 px-5 sm:px-7 py-9 text-center max-w-[1100px] mx-auto">
        <div className="text-[11.5px] font-bold text-[#f97316] uppercase tracking-widest mb-4.5">Get Started</div>
        <div className="flex justify-center gap-8 flex-wrap">
          {getStartedLinks.map((link) => (
            <Link key={link.label} to={link.href} className="text-white/72 no-underline text-sm">
              {link.label}
            </Link>
          ))}
        </div>
      </div>

      {/* Ecosystem */}
      <div className="border-t border-white/10 px-5 sm:px-7 py-9 max-w-[1100px] mx-auto text-center">
        <div className="text-[11.5px] font-bold text-[#f97316] uppercase tracking-widest mb-4.5">The Zoiko Business Ecosystem</div>
        <p className="text-[13px] text-white/55 mb-6">
          Zoiko One runs business operations. The platforms below are ecosystem siblings
          they are not Zoiko One products.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3" style={{ gridAutoRows: "1fr" }}>
          {ecosystemCards.map((card) => (
            <EcoFooterCard key={card.name} card={card} />
          ))}
        </div>
      </div>

      {/* Legal */}
      <div className="border-t border-white/10 max-w-[1100px] mx-auto px-5 sm:px-7 pt-5 pb-7">
        <div className="flex flex-wrap justify-center gap-x-5 gap-y-1.5 mb-3">
          {legalLinks.map((link) => (
            typeof link === "string" ? (
              <a key={link} href="#" className="text-[12px] text-white/50 no-underline">{link}</a>
            ) : (
              <Link key={link.label} to={link.href} className="text-[12px] text-white/50 no-underline">{link.label}</Link>
            )
          ))}
          <button className="flex items-center gap-1.5 text-white/50 text-xs bg-transparent border-none cursor-pointer">🌐 EN · Global</button>
        </div>
        <div className="flex justify-center items-center text-xs text-white/40 text-center">
          © 2026 Zoiko Group. All rights reserved. · ZoikoOne™ · Nine core products
          plus Zoiko Docs Pro (Premium Capability).
        </div>
      </div>
    </footer>
  );
}


