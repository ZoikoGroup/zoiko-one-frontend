import React from "react";
import { Link } from "react-router-dom";
import {
  Search,
  ChevronDown,
  ChevronRight,
  Users,
  Clock,
  Landmark,
  Receipt,
  ScanLine,
  Briefcase,
  Box,
  ShieldCheck,
  BarChart3,
  FileText,
  Zap,
  Copy,
  LayoutGrid,
  Phone,
} from "lucide-react";

const mainProducts = [
  {
    icon: Users,
    iconBg: "#EAF0FF",
    iconColor: "#3B5BFF",
    name: "Zoiko HR",
    desc: "HR management, employee data, onboarding and performance.",
    href: "/products/zoiko-hr",
  },
  {
    icon: Clock,
    iconBg: "#E7F8EE",
    iconColor: "#1FA35C",
    name: "Zoiko Time",
    desc: "Time tracking, attendance, scheduling and productivity.",
    href: "/products/zoikotime",
  },
  {
    icon: Landmark,
    iconBg: "#F2EBFB",
    iconColor: "#8B4FE0",
    name: "Zoiko Payroll",
    desc: "Payroll processing, compliance and employee payments.",
    href: "/products/payroll",
  },
  {
    icon: Receipt,
    iconBg: "#FDECE3",
    iconColor: "#E8703A",
    name: "Zoiko Billing",
    desc: "Invoicing, billing automation and payment collection.",
    href: "/products/billing",
  },
  {
    icon: ScanLine,
    iconBg: "#FCE9E9",
    iconColor: "#E14B4B",
    name: "Zoiko Spend",
    desc: "Purchase requests, approvals, expenses and vendor management.",
    href: "/products/spend",
  },
];

const midProducts = [
  {
    icon: Briefcase,
    iconBg: "#EAF0FF",
    iconColor: "#3B5BFF",
    name: "Zoiko Projects",
    desc: "Project planning, tasks, resources, budgets and delivery.",
    chevron: true,
    href: "/projects",
  },
  {
    icon: Box,
    iconBg: "#E7F8EE",
    iconColor: "#1FA35C",
    name: "Zoiko Inventory",
    desc: "Inventory management, stock control and asset tracking.",
    chevron: true,
    href: "/inventory",
  },
  {
    icon: ShieldCheck,
    iconBg: "#EAF0FF",
    iconColor: "#3B5BFF",
    name: "Zoiko Comply",
    desc: "Compliance management, policies, risks and audit readiness.",
    chevron: true,
    href: "/products/comply",
  },
  {
    icon: BarChart3,
    iconBg: "#FDECE3",
    iconColor: "#E8703A",
    name: "Zoiko Insights",
    desc: "Dashboards, analytics and business intelligence.",
    chevron: true,
    href: "/insights",
  },
];

const pillars = [
  {
    icon: Users,
    iconBg: "#EAF0FF",
    iconColor: "#3B5BFF",
    name: "People",
    desc: "Zoiko HR, ZoikoTime, Zoiko Payroll",
    href: "/products/zoiko-hr",
  },
  {
    icon: () => (
      <span style={{ fontSize: 16, fontWeight: 700, lineHeight: 1 }}>$</span>
    ),
    iconBg: "#E7F8EE",
    iconColor: "#1FA35C",
    name: "Money",
    desc: "Zoiko Billing, Zoiko Spend",
    href: "/products/billing",
  },
  {
    icon: Briefcase,
    iconBg: "#F2EBFB",
    iconColor: "#8B4FE0",
    name: "Work",
    desc: "Zoiko Projects",
    href: "/projects",
  },
  {
    icon: Box,
    iconBg: "#FDECE3",
    iconColor: "#E8703A",
    name: "Supply",
    desc: "Zoiko Inventory",
    href: "/inventory",
  },
  {
    icon: ShieldCheck,
    iconBg: "#EAF0FF",
    iconColor: "#3B5BFF",
    name: "Control",
    desc: "Zoiko Comply, Zoiko Insights",
    href: "/products/comply",
  },
];

const footerItems = [
  {
    icon: Zap,
    color: "#3B5BFF",
    title: "Not sure where to start?",
    desc: "We'll help you find the right products and rollout path for your business.",
  },
  {
    icon: Copy,
    color: "#3B5BFF",
    title: "Compare Products",
    desc: "See product capabilities, integrations and plans.",
  },
  {
    icon: LayoutGrid,
    color: "#1FA35C",
    title: "See How It Works",
    desc: "Explore product demos and key features.",
  },
  {
    icon: Phone,
    color: "#8B4FE0",
    title: "Talk to Sales",
    desc: "Speak with an expert about your business needs.",
  },
];

function ProductRow({ item }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: "8px 10px",
        borderRadius: 10,
        textDecoration: "none",
        color: "inherit",
        cursor: "pointer",
      }}
      className="zoiko-row"
    >
      <span
        style={{
          flexShrink: 0,
          width: 36,
          height: 36,
          borderRadius: 9,
          background: item.iconBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: item.iconColor,
        }}
      >
        <Icon size={18} strokeWidth={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 14.5,
            fontWeight: 600,
            color: "#12142B",
            marginBottom: 2,
          }}
        >
          {item.name}
        </span>
        <span
          style={{
            display: "block",
            fontSize: 12.5,
            lineHeight: 1.4,
            color: "#6B7280",
          }}
        >
          {item.desc}
        </span>
      </span>
      {item.chevron && (
        <ChevronRight
          size={16}
          color="#B0B4C0"
          style={{ marginTop: 8, flexShrink: 0 }}
        />
      )}
    </Link>
  );
}

export default function ProductsMegaMenu() {
  return (
    <div
      style={{
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
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
      <div style={{ padding: "28px 32px 0" }}>
        {/* Header row */}
        <div
          style={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            marginBottom: 26,
            gap: 24,
          }}
        >
          <div>
            <h1
              style={{
                fontSize: 26,
                fontWeight: 700,
                margin: 0,
                marginBottom: 6,
                color: "#12142B",
              }}
            >
              One platform. Nine powerful products.
            </h1>
            <p style={{ fontSize: 14.5, color: "#6B7280", margin: 0 }}>
              Every tool you need to run people, money, work, supply and
              control — connected.
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
              padding: "14px 18px",
              minWidth: 360,
              maxWidth: 420,
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
              <div
                style={{ fontSize: 13.5, fontWeight: 700, color: "#12142B" }}
              >
                Built on Zoiko One Platform
              </div>
              <div
                style={{
                  fontSize: 12.5,
                  color: "#6B7280",
                  margin: "2px 0 4px",
                  lineHeight: 1.4,
                }}
              >
                Unified data, shared workflows, and connected intelligence
              </div>
              <Link
                to="/platform"
                style={{
                  fontSize: 12.5,
                  fontWeight: 600,
                  color: "#3B5BFF",
                  textDecoration: "none",
                }}
              >
                Explore Platform →
              </Link>
            </div>
          </div>
        </div>

        {/* Three columns */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 260px",
            gap: 32,
            paddingBottom: 26,
          }}
        >
          {/* Column 1: Our Products */}
          <div>
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: "#3B5BFF",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Our Products
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {mainProducts.map((item) => (
                <ProductRow key={item.name} item={item} />
              ))}
            </div>
          </div>

          {/* Column 2: more products + premium card */}
          <div>
            <div style={{ height: 23.5 }} />
            <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {midProducts.map((item) => (
                <ProductRow key={item.name} item={item} />
              ))}
            </div>

            <div
              style={{
                marginTop: 6,
                marginBottom: 4,
                textAlign: "center",
                color: "#B0B4C0",
              }}
            >
              <ChevronDown size={14} />
            </div>

            <Link
              to="/zoiko-docs"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 12,
                background: "#F2FBF6",
                border: "1px solid #D8F0E1",
                borderRadius: 12,
                padding: "14px 14px",
                textDecoration: "none",
                color: "inherit",
              }}
            >
              <span
                style={{
                  flexShrink: 0,
                  width: 36,
                  height: 36,
                  borderRadius: 9,
                  background: "#DFF5E7",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "#1FA35C",
                }}
              >
                <FileText size={18} />
              </span>
              <div>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 8,
                    marginBottom: 2,
                  }}
                >
                  <span
                    style={{ fontSize: 14.5, fontWeight: 600, color: "#12142B" }}
                  >
                    Zoiko Docs Pro
                  </span>
                  <span
                    style={{
                      fontSize: 10,
                      fontWeight: 700,
                      color: "#1FA35C",
                      background: "#D8F0E1",
                      borderRadius: 5,
                      padding: "2px 7px",
                      letterSpacing: 0.3,
                    }}
                  >
                    PREMIUM
                  </span>
                </div>
                <div
                  style={{ fontSize: 12.5, color: "#6B7280", lineHeight: 1.4 }}
                >
                  Premium document automation, templates, approvals and
                  storage.
                </div>
              </div>
            </Link>
          </div>

          {/* Column 3: Product by Pillar */}
          <div
            style={{
              borderLeft: "1px solid #EEF0F5",
              paddingLeft: 28,
            }}
          >
            <div
              style={{
                fontSize: 11.5,
                fontWeight: 700,
                letterSpacing: 0.5,
                color: "#3B5BFF",
                textTransform: "uppercase",
                marginBottom: 12,
              }}
            >
              Product by Pillar
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {pillars.map((p) => {
                const Icon = p.icon;
                return (
                  <Link
                    key={p.name}
                    to={p.href}
                    className="zoiko-pillar"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: 10,
                      textDecoration: "none",
                      color: "inherit",
                      padding: "6px 4px",
                      borderRadius: 8,
                    }}
                  >
                    <span
                      style={{
                        flexShrink: 0,
                        width: 32,
                        height: 32,
                        borderRadius: 8,
                        background: p.iconBg,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        color: p.iconColor,
                      }}
                    >
                      <Icon size={16} />
                    </span>
                    <span style={{ flex: 1, minWidth: 0 }}>
                      <span
                        style={{
                          display: "block",
                          fontSize: 14,
                          fontWeight: 600,
                          color: "#12142B",
                        }}
                      >
                        {p.name}
                      </span>
                      <span
                        style={{
                          display: "block",
                          fontSize: 11.5,
                          color: "#6B7280",
                        }}
                      >
                        {p.desc}
                      </span>
                    </span>
                    <ChevronRight size={15} color="#B0B4C0" />
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* ---------- Footer ---------- */}
      <div
        style={{
          borderTop: "1px solid #EEF0F5",
          background: "#FAFBFF",
          padding: "20px 32px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 24,
        }}
      >
        {footerItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              style={{ display: "flex", alignItems: "flex-start", gap: 10 }}
            >
              <span style={{ color: item.color, marginTop: 2, flexShrink: 0 }}>
                <Icon size={17} />
              </span>
              <div>
                <div
                  style={{ fontSize: 13.5, fontWeight: 700, color: "#12142B" }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 12,
                    color: "#6B7280",
                    lineHeight: 1.4,
                    marginTop: 2,
                  }}
                >
                  {item.desc}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <style>{`
        .zoiko-row:hover {
          background: #F5F7FF;
        }
        .zoiko-pillar:hover {
          background: #F5F7FF;
        }
      `}</style>
    </div>
  );
}
