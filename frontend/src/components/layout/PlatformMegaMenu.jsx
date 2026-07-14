import React from "react";
import { Link } from "react-router-dom";
import {
  ChevronDown,
  ChevronRight,
  Box,
  ShieldCheck,
  Cloud,
  Zap,
  Fingerprint,
  Workflow,
  Grid3x3,
  Plug,
  Sparkles,
  Database,
  BarChart3,
  LayoutDashboard,
  CodeXml,
  ShoppingBag,
  Puzzle,
  ServerCog,
  Globe,
  RefreshCw,
  Users,
  PlayCircle,
  DollarSign,
  Phone,
} from "lucide-react";

const COLORS = {
  blue: "#3B5BFF",
  blueBg: "#EAF0FF",
  green: "#1FA35C",
  greenBg: "#E7F8EE",
  purple: "#8B4FE0",
  purpleBg: "#F2EBFB",
  orange: "#E8703A",
  orangeBg: "#FDECE3",
};

const columns = [
  {
    title: "Platform Foundations",
    color: COLORS.blue,
    items: [
      { icon: Box, name: "Architecture", desc: "Cloud-native, multi-tenant and highly scalable.", chevron: true, href: "/platform" },
      { icon: ShieldCheck, name: "Security & Trust", desc: "Enterprise-grade security, privacy and compliance.", chevron: true, href: "/security" },
      { icon: Cloud, name: "Reliability", desc: "High availability, resilience and business continuity.", chevron: true, href: "/trust-center" },
      { icon: Zap, name: "Performance", desc: "Optimised for speed, scale and efficiency.", chevron: true, href: "/platform" },
    ],
  },
  {
    title: "Platform Services",
    color: COLORS.green,
    items: [
      { icon: Fingerprint, name: "ZoikoID", desc: "Unified identity, SSO, MFA and access management.", chevron: true, href: "/platform" },
      { icon: Workflow, name: "Zoiko Workflow", desc: "No-code automation, approvals and orchestration.", chevron: true, href: "/platform" },
      { icon: Grid3x3, name: "Zoiko Hub", desc: "Centralised configuration, admin and monitoring.", chevron: true, href: "/platform" },
      { icon: Plug, name: "Zoiko Connect", desc: "APIs, integrations and ecosystem connectivity.", chevron: true, href: "/platform" },
      { icon: Sparkles, name: "AI Assistance", desc: "Intelligent automation, insights and copilots.", chevron: true, href: "/platform" },
    ],
  },
  {
    title: "Data & Intelligence",
    color: COLORS.purple,
    items: [
      { icon: Database, name: "Unified Data Model", desc: "Consistent data across all products and pillars.", chevron: true, href: "/platform" },
      { icon: ShieldCheck, name: "Data Governance", desc: "Data quality, policies, classification and lineage.", chevron: true, href: "/platform" },
      { icon: BarChart3, name: "Analytics Engine", desc: "Real-time analytics, KPIs and custom metrics.", chevron: true, href: "/platform" },
      { icon: LayoutDashboard, name: "Insights & Reporting", desc: "Dashboards, reports and self-service analytics.", chevron: true, href: "/platform" },
    ],
  },
  {
    title: "Developer & Extensibility",
    color: COLORS.orange,
    items: [
      { icon: CodeXml, name: "Developer Portal", desc: "APIs, SDKs, docs and code samples.", chevron: true, href: "/api-documentation" },
      { icon: ShoppingBag, name: "Marketplace", desc: "Extensions, apps and partner solutions.", chevron: true, href: "/platform" },
      { icon: Puzzle, name: "Extensibility", desc: "Custom apps, plugins and low-code development.", chevron: true, href: "/platform" },
      { icon: ServerCog, name: "Environment Management", desc: "Dev, test, staging and production management.", chevron: true, href: "/system-status" },
    ],
  },
];

const trustBadges = [
  { icon: ShieldCheck, color: COLORS.blue, bg: COLORS.blueBg, title: "Secure by Design", desc: "Enterprise-grade security at every layer." },
  { icon: Grid3x3, color: COLORS.green, bg: COLORS.greenBg, title: "Built to Scale", desc: "Grow seamlessly. From startups to enterprises." },
  { icon: Globe, color: COLORS.purple, bg: COLORS.purpleBg, title: "Global Ready", desc: "Multi-region, multi-language and local compliance." },
  { icon: RefreshCw, color: COLORS.orange, bg: COLORS.orangeBg, title: "Always Evolving", desc: "Continuous innovation and platform updates.", linkColor: true },
  { icon: Users, color: COLORS.blue, bg: COLORS.blueBg, title: "Customer Focused", desc: "Built for your success and long-term growth." },
];

const bottomLinks = [
  { icon: PlayCircle, color: COLORS.blue, label: "How It Works", desc: "See the platform in action", href: "/how-it-works" },
  { icon: Box, color: COLORS.blue, label: "Platform Overview", desc: "Explore key capabilities", href: "/platform" },
  { icon: DollarSign, color: COLORS.blue, label: "View Pricing", desc: "Find the right plan", href: "/pricing" },
  { icon: Phone, color: COLORS.blue, label: "Talk to Sales", desc: "Speak with an expert", href: "/get-demo" },
];

function Row({ item }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      className="zoiko-row"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "6px 8px",
        borderRadius: 10,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <Icon size={16} strokeWidth={2} color={item.iconColor || "#4A4D5C"} style={{ marginTop: 2, flexShrink: 0 }} />
      <span style={{ flex: 1, minWidth: 0 }}>
        <span style={{ display: "block", fontSize: 14.5, fontWeight: 600, color: "#12142B", marginBottom: 2 }}>
          {item.name}
        </span>
        <span style={{ display: "block", fontSize: 12.5, lineHeight: 1.4, color: "#6B7280" }}>
          {item.desc}
        </span>
      </span>
      {item.chevron && (
        <ChevronRight size={16} color="#B0B4C0" style={{ marginTop: 8, flexShrink: 0 }} />
      )}
    </Link>
  );
}

export default function PlatformMegaMenu() {
  return (
    <div
      style={{
        fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
        background: "#FFFFFF",
        border: "1px solid #D6DEFF",
        borderRadius: 14,
        maxWidth: 1600,
        width: "88vw",
        margin: "0 auto",
        overflow: "hidden",
        color: "#12142B",
        boxShadow: "0 20px 50px rgba(20,30,80,0.10)",
      }}
    >
      {/* ---------- Body ---------- */}
      <div style={{ padding: "20px 32px 0" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 18,
            gap: 24,
          }}
        >
          <div style={{ minWidth: 0, flex: 1 }}>
            <div style={{ fontSize: 11.5, fontWeight: 700, color: "#8A8D99", marginBottom: 6 }}>
              The Zoiko One Platform
            </div>
            <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0, marginBottom: 6, color: "#12142B" }}>
              Engineered for connection, built for scale.
            </h1>
            <p style={{ fontSize: 14.5, color: "#6B7280", margin: 0, maxWidth: 420 }}>
              A unified foundation that powers every product, workflow and intelligent experience.
            </p>
          </div>

          <div
            style={{
              display: "flex",
              alignItems: "flex-start",
              gap: 12,
              background: "#F5F7FF",
              border: "1px solid #E3E8FF",
              borderRadius: 12,
              padding: "16px 18px",
              minWidth: 380,
              maxWidth: 440,
              flexShrink: 0,
            }}
          >
            <span
              style={{
                flexShrink: 0,
                width: 34,
                height: 34,
                borderRadius: 8,
                background: "#EAF0FF",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "#3B5BFF",
              }}
            >
              <Box size={17} />
            </span>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 700, color: "#12142B" }}>
                One platform. Infinite possibilities.
              </div>
              <div style={{ fontSize: 12.5, color: "#6B7280", margin: "2px 0 4px", lineHeight: 1.4 }}>
                Secure. Scalable. Intelligent. Built for your business.
              </div>
              <Link to="/platform" style={{ fontSize: 12.5, fontWeight: 600, color: "#3B5BFF", textDecoration: "none" }}>
                Explore Platform Overview →
              </Link>
            </div>
          </div>
        </div>

        {/* Four columns */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 32, paddingBottom: 18 }}>
          {columns.map((col) => (
            <div key={col.title}>
              <div style={{ fontSize: 11.5, fontWeight: 700, letterSpacing: 0.5, color: col.color, textTransform: "uppercase", marginBottom: 8 }}>
                {col.title}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: 0 }}>
                {col.items.map((item) => (
                  <Row key={item.name} item={{ ...item, iconColor: col.color }} />
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Trust badges row */}
        <div style={{ borderTop: "1px solid #EEF0F5", display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: 16, padding: "14px 0" }}>
          {trustBadges.map((b) => {
            const Icon = b.icon;
            return (
              <div key={b.title} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
                <span
                  style={{
                    flexShrink: 0,
                    width: 26,
                    height: 26,
                    borderRadius: "50%",
                    background: b.bg,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    color: b.color,
                  }}
                >
                  <Icon size={13} />
                </span>
                <div>
                  <div style={{ fontSize: 13.5, fontWeight: 700, color: b.linkColor ? COLORS.blue : "#12142B" }}>
                    {b.title}
                  </div>
                  <div style={{ fontSize: 12, color: "#6B7280", lineHeight: 1.4, marginTop: 2 }}>
                    {b.desc}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <div
        style={{
          borderTop: "1px solid #EEF0F5",
          background: "#FAFBFF",
          padding: "18px 32px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <span
            style={{
              flexShrink: 0,
              width: 30,
              height: 30,
              borderRadius: 8,
              background: "#EAF0FF",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#3B5BFF",
            }}
          >
            <Zap size={15} />
          </span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: "#12142B" }}>New to Zoiko One?</div>
            <div style={{ fontSize: 11.5, color: "#6B7280" }}>See how our platform can transform the way you work.</div>
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 16 }}>
          {bottomLinks.map((l) => {
            const Icon = l.icon;
            return (
              <Link key={l.label} to={l.href} style={{ display: "flex", alignItems: "center", gap: 8, textDecoration: "none", color: "inherit" }}>
                <Icon size={15} color={l.color} />
                <div>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: "#3B5BFF" }}>{l.label}</div>
                  <div style={{ fontSize: 11, color: "#6B7280" }}>{l.desc}</div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      <style>{`
        .zoiko-row:hover {
          background: #F5F7FF;
        }
      `}</style>
    </div>
  );
}
