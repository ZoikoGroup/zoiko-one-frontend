import React from "react";
import { Link } from "react-router-dom";

const platformLinks = [
  "Overview",
  "How Zoiko One Works",
  "Security",
  "Trust Center",
  "Integrations",
  "API Documentation",
  "System Status",
];

const productLinks = [
  { label: "Zoiko HR", href: "/products/zoiko-hr" },
  { label: "ZoikoTime", href: "/products/zoikotime" },
  { label: "Zoiko Payroll", href: "/products/payroll" },
  { label: "Zoiko Billing", href: "/products/billing" },
  { label: "Zoiko Projects", href: "#" },
  { label: "Zoiko Comply", href: "/products/comply" },
  { label: "Zoiko Insights", href: "/products/insights" },
];

const solutionLinks = [
  "Small Business",
  "Agencies",
  "Professional Services",
  "Mid-Market",
  "Enterprise",
  "Multi-Entity",
  "Global Teams",
];

const ecosystemBrands = [
  "Zoiko Sema",
  "Zoiko Local",
  "ZoikoVertex",
  "Zoiko Digital",
  "ZoikoPay",
  "ZoikoCoreX",
];

const legalLinks = [
  "Privacy",
  "Terms",
  "Cookies",
  "DPA",
  "Security Overview",
  "Accessibility",
];

function FooterColumn({ heading, links }) {
  return (
    <div>
      <p className="text-[#F5A623] text-xs font-bold tracking-wide uppercase mb-5">
        {heading}
      </p>
      <ul className="space-y-4">
        {links.map((link) => {
          const isObj = typeof link === "object";
          const key = isObj ? link.label : link;
          const href = isObj ? link.href : "#";
          const label = isObj ? link.label : link;
          return (
            <li key={key}>
              {isObj ? (
                <Link
                  to={href}
                  className="text-white/90 text-[15px] font-medium hover:text-white transition-colors"
                >
                  {label}
                </Link>
              ) : (
                <a
                  href={href}
                  className="text-white/90 text-[15px] font-medium hover:text-white transition-colors"
                >
                  {label}
                </a>
              )}
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function Footer() {
  return (
    <footer className="bg-[#1B2A6B] w-full">
      <div className="max-w-7xl mx-auto px-10 pt-16 pb-10">
        {/* Top section */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand block */}
          <div>
            <div className="flex items-center gap-2 mb-6">
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-[#3B82F6] to-[#F5A623] flex items-center justify-center">
                <span className="text-white font-bold text-lg">/</span>
              </div>
              <span className="text-white font-bold text-xl">
                Zoiko<span className="text-[#F5A623]">One</span>
                <sup className="text-xs align-super">™</sup>
              </span>
            </div>
            <p className="text-white/80 text-[15px] leading-relaxed mb-6 max-w-xs">
              The end-to-end business operations platform. Run people, time,
              payroll, billing, projects, compliance, and insights in one
              connected layer.
            </p>
            <div className="flex items-center gap-3">
              <a
                href="#"
                className="w-9 h-9 rounded-md bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-md bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <span className="text-white font-bold text-sm">X</span>
              </a>
              <a
                href="#"
                className="w-9 h-9 rounded-md bg-white/15 flex items-center justify-center hover:bg-white/25 transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="currentColor" className="text-white"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/><path d="M9 18c-4.51 2-5-2-7-2"/></svg>
              </a>
            </div>
          </div>

          <FooterColumn heading="Platform" links={platformLinks} />
          <FooterColumn heading="Products" links={productLinks} />
          <FooterColumn heading="Solutions" links={solutionLinks} />
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 my-12" />

        {/* Ecosystem brand row */}
        <div className="flex flex-wrap justify-center gap-x-16 gap-y-4 mb-10">
          {ecosystemBrands.map((brand) => (
            <a
              key={brand}
              href="#"
              className="text-white font-bold text-[15px] hover:text-[#F5A623] transition-colors"
            >
              {brand}
            </a>
          ))}
        </div>

        {/* Divider */}
        <div className="border-t border-white/15 mb-8" />

        {/* Ecosystem description */}
        <p className="text-center text-white/80 text-[15px] leading-relaxed max-w-3xl mx-auto mb-8">
          Zoiko One is part of the Zoiko Business Ecosystem. Zoiko One runs
          business operations; ZoikoPay powers settlement; ZoikoCoreX records
          financial truth.
        </p>

        {/* Legal links */}
        <div className="flex flex-wrap justify-center items-center gap-x-8 gap-y-3 mb-6">
          {legalLinks.map((link) => (
            <a
              key={link}
              href="#"
              className="text-white/80 text-sm font-medium hover:text-white transition-colors"
            >
              {link}
            </a>
          ))}
          <span className="flex items-center gap-1.5 text-white/80 text-sm font-medium">
            <span className="w-2.5 h-2.5 rounded-full bg-[#2DD4BF] inline-block" />
            EN · Global
          </span>
        </div>

        {/* Copyright */}
        <p className="text-center text-white/60 text-sm">
          © 2026 Zoiko Group. All rights reserved. · Zoiko One™
        </p>
      </div>
    </footer>
  );
}
