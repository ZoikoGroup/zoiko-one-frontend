import React from "react";
import { Link } from "react-router-dom";
import {
  Building2,
  Users,
  ShoppingBag,
  Wrench,
  Hotel,
  Lock,
  User,
  CircleDollarSign,
  FileText,
  Box,
  ShoppingCart,
  BarChart2,
  Gauge,
  Star,
  CheckCircle2,
  Lightbulb,
  Briefcase,
  Tag,
  Phone,
  RefreshCw,
  DollarSign,
  Trash2,
  Boxes,
} from "lucide-react";

const COLORS = {
  blue: "#3B5BFF",
  blueBg: "#EAF0FF",
  green: "#1FA35C",
  greenBg: "#E7F8EE",
  purple: "#8B4FE0",
  purpleBg: "#F2EBFB",
  orange: "#F0672B",
  orangeBg: "#FDECE3",
  gray: "#6B7280",
  grayIcon: "#B0B4C0",
};

const byBusinessType = [
  {
    icon: Briefcase,
    name: "Services Businesses",
    desc: "Run projects, people, billing, and spend and documents.",
    href: "/solutions",
  },
  {
    icon: Users,
    name: "Agencies",
    desc: "Connect client work, time, billing and approvals.",
    href: "/solutions/agencies",
  },
  {
    icon: ShoppingBag,
    name: "Retail Businesses",
    desc: "Control stock, purchasing, staff and location visibility.",
    href: "/solutions/retail",
  },
  {
    icon: Wrench,
    name: "Trades Businesses",
    desc: "Manage field teams, jobs, materials, time and billing.",
    href: "/solutions",
  },
  {
    icon: Hotel,
    name: "Hospitality Businesses",
    desc: "Connect staff, shifts, stock, suppliers and insights.",
    href: "/solutions",
  },
  {
    icon: Lock,
    name: "E-Commerce Businesses",
    desc: "Unify inventory, suppliers, workforce and orders.",
    href: "/solutions",
  },
];

const byOperatingNeed = [
  {
    icon: User,
    name: "People Operations",
    desc: "HR, time, attendance and payroll workflows.",
    href: "/five-pillars/people",
  },
  {
    icon: CircleDollarSign,
    name: "Money Control",
    desc: "Billing, spend, purchases, supplier invoices and approvals.",
    href: "/five-pillars/money",
  },
  {
    icon: FileText,
    name: "Project Delivery",
    desc: "Projects, tasks, resources, budgets and margins.",
    href: "/five-pillars/work",
  },
  {
    icon: Box,
    name: "Inventory & Supply",
    desc: "Stock, receiving, goods movement and visibility.",
    href: "/five-pillars/supply",
  },
];

const featuredPaths = [
  {
    icon: Building2,
    name: "Multi-Entity Control",
    desc: "Connect entities, teams, permissions, approvals and reporting.",
    href: "/five-pillars/control",
  },
  {
    icon: ShoppingCart,
    name: "Spend-to-Stock",
    desc: "From purchase request to stock receipt with full visibility.",
    href: "/inventory",
  },
  {
    icon: BarChart2,
    name: "HR-to-Payroll",
    desc: "From hire to pay with approved time and audit-ready data.",
    href: "/products/payroll",
  },
  {
    icon: Gauge,
    name: "Business Dashboards",
    desc: "Workforce, money, supply and compliance in one view.",
    href: "/insights",
  },
];

const footerItems = [
  {
    icon: Lightbulb,
    title: "Not sure where to start?",
    desc: "Explore Zoiko One by pillars or see how the platform connects.",
  },
  {
    icon: Briefcase,
    title: "Explore Platform →",
    desc: "See the full platform and five connected pillars.",
  },
  {
    icon: Tag,
    title: "View Pricing →",
    desc: "Transparent pricing for every business size.",
  },
  {
    icon: Phone,
    title: "Talk to Sales →",
    desc: "Speak with an expert about your business needs.",
  },
];

function Row({ item, highlight, premium }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      className={highlight ? "zoiko-row zoiko-row--highlight" : "zoiko-row"}
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 12,
        padding: highlight ? "10px 10px" : "6px 8px",
        borderRadius: 10,
        textDecoration: "none",
        color: "inherit",
      }}
    >
      <span
        style={{
          flexShrink: 0,
          width: 32,
          height: 32,
          borderRadius: 8,
          background: highlight ? "#DFF5E7" : COLORS.blueBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: highlight ? COLORS.green : COLORS.grayIcon,
        }}
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            fontSize: 13.5,
            fontWeight: 600,
            color: "#12142B",
            marginBottom: 1,
            lineHeight: 1.3,
          }}
        >
          {item.name}
          {premium && (
            <span
              style={{
                fontSize: 9,
                fontWeight: 700,
                color: COLORS.green,
                background: "#D8F0E1",
                borderRadius: 5,
                padding: "1.5px 5px",
                letterSpacing: 0.3,
              }}
            >
              PREMIUM
            </span>
          )}
        </span>
        <span
          style={{
            display: "block",
            fontSize: 11.5,
            lineHeight: 1.4,
            color: COLORS.gray,
          }}
        >
          {item.desc}
        </span>
      </span>
    </Link>
  );
}

function ColumnHeader({ icon: Icon, label, color }) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        gap: 6,
        marginBottom: 8,
      }}
    >
      <Icon size={12} color={color} strokeWidth={2} />
      <span
        style={{
          fontSize: 10.5,
          fontWeight: 700,
          letterSpacing: 0.5,
          color,
          textTransform: "uppercase",
        }}
      >
        {label}
      </span>
    </div>
  );
}

export default function SolutionsMegaMenu() {
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
      <div style={{ padding: "20px 28px 0" }}>
        <div style={{ marginBottom: 16 }}>
          <h1
            style={{
              fontSize: 22,
              fontWeight: 700,
              margin: 0,
              marginBottom: 4,
              color: "#12142B",
            }}
          >
            Find the right Zoiko One path for how your business operates.
          </h1>
          <p style={{ fontSize: 13, color: COLORS.gray, margin: 0 }}>
            One platform. Five pillars. Endless ways to run your business
            smarter.
          </p>
        </div>

        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr 260px",
            gap: 24,
            paddingBottom: 16,
          }}
        >
          <div>
            <ColumnHeader icon={Building2} label="By Business Type" color={COLORS.blue} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {byBusinessType.map((item) => (
                <Row key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div>
            <ColumnHeader icon={CheckCircle2} label="By Operating Need" color={COLORS.green} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {byOperatingNeed.map((item) => (
                <Row key={item.name} item={item} />
              ))}
              <div style={{ marginTop: 4 }}>
                <Row
                  item={{
                    icon: FileText,
                    name: "Document Workflows",
                    desc: "Premium templates, automation, approvals and secure storage.",
                    href: "/zoiko-docs",
                  }}
                  highlight
                  premium
                />
              </div>
            </div>
          </div>

          <div>
            <ColumnHeader icon={Star} label="Featured Paths" color={COLORS.purple} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {featuredPaths.map((item) => (
                <Row key={item.name} item={item} />
              ))}
            </div>
          </div>

          <div
            style={{
              background: "#F7F8FA",
              border: "1px solid #ECEEF3",
              borderRadius: 14,
              padding: "16px 16px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              textAlign: "center",
            }}
          >
            <div
              style={{
                position: "relative",
                width: 90,
                height: 90,
                marginBottom: 12,
              }}
            >
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  borderRadius: "50%",
                  border: "1.5px dashed #D8DCE8",
                }}
              />
              <div
                style={{
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  background: COLORS.orange,
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 15,
                  fontWeight: 700,
                  boxShadow: "0 4px 10px rgba(240,103,43,0.35)",
                }}
              >
                1
              </div>
              {[
                { Icon: User, top: 0, left: "50%", bg: COLORS.blueBg, color: COLORS.blue },
                { Icon: DollarSign, top: "22%", left: "94%", bg: COLORS.greenBg, color: COLORS.green },
                { Icon: Boxes, top: "78%", left: "94%", bg: COLORS.blueBg, color: COLORS.blue },
                { Icon: RefreshCw, top: "100%", left: "50%", bg: COLORS.greenBg, color: COLORS.green },
                { Icon: Trash2, top: "78%", left: "6%", bg: COLORS.blueBg, color: COLORS.blue },
                { Icon: CheckCircle2, top: "22%", left: "6%", bg: COLORS.greenBg, color: COLORS.green },
              ].map((n, i) => (
                <span
                  key={i}
                  style={{
                    position: "absolute",
                    top: n.top,
                    left: n.left,
                    transform: "translate(-50%, -50%)",
                    width: 20,
                    height: 20,
                    borderRadius: "50%",
                    background: n.bg,
                    color: n.color,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    border: "2px solid #fff",
                  }}
                >
                  <n.Icon size={11} />
                </span>
              ))}
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#12142B",
                marginBottom: 6,
                lineHeight: 1.3,
              }}
            >
              Find the right Zoiko One setup.
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.gray,
                lineHeight: 1.4,
                marginBottom: 12,
              }}
            >
              Tell us how your business operates. We'll map the right
              products, pillars, workflows and rollout path.
            </div>

            <Link
              to="/get-demo"
              className="zoiko-demo-btn"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: COLORS.orange,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "8px 0",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 6,
                textDecoration: "none",
              }}
            >
              Get a Demo →
            </Link>
            <Link
              to="/pricing"
              className="zoiko-pricing-btn"
              style={{
                width: "100%",
                background: "#fff",
                color: "#12142B",
                border: "1px solid #D9DCE5",
                borderRadius: 8,
                padding: "8px 0",
                fontSize: 12,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 10,
                textDecoration: "none",
                textAlign: "center",
              }}
            >
              Request Pricing
            </Link>
            <Link
              to="/platform"
              className="zoiko-explore-link"
              style={{
                fontSize: 11.5,
                fontWeight: 600,
                color: COLORS.blue,
                textDecoration: "none",
                marginBottom: 10,
              }}
            >
              Explore Platform →
            </Link>

            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 10.5,
                color: "#A6A9B4",
                borderTop: "1px solid #ECEEF3",
                paddingTop: 12,
                width: "100%",
                justifyContent: "center",
                textAlign: "left",
              }}
            >
              <Lock size={12} color="#A6A9B4" style={{ flexShrink: 0 }} />
              <span>Enterprise-grade security, privacy and compliance.</span>
            </div>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: "1px solid #EEF0F5",
          background: "#FAFBFF",
          padding: "14px 28px",
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: 16,
        }}
      >
        {footerItems.map((item) => {
          const Icon = item.icon;
          return (
            <div
              key={item.title}
              className="zoiko-footer-item"
              style={{
                display: "flex",
                alignItems: "flex-start",
                gap: 10,
                padding: "8px 8px",
                borderRadius: 8,
                cursor: "pointer",
                transition: "background 0.15s",
              }}
            >
              <Icon
                size={17}
                color={COLORS.blue}
                style={{ marginTop: 2, flexShrink: 0 }}
              />
              <div>
                <div
                  style={{ fontSize: 12.5, fontWeight: 700, color: "#12142B" }}
                >
                  {item.title}
                </div>
                <div
                  style={{
                    fontSize: 11,
                    color: COLORS.gray,
                    lineHeight: 1.4,
                    marginTop: 1,
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
        .zoiko-row {
          background: transparent;
          border: 1px solid transparent;
          transition: background 0.15s;
        }
        .zoiko-row:hover {
          background: #F5F7FF;
        }
        .zoiko-row--highlight {
          background: #E7F8EE;
          border: 1px solid #D8F0E1;
        }
        .zoiko-row--highlight:hover {
          background: #D8F0E1;
        }
        .zoiko-demo-btn {
          transition: background 0.15s, transform 0.15s;
        }
        .zoiko-demo-btn:hover {
          background: #E85C1F;
          transform: translateY(-1px);
        }
        .zoiko-pricing-btn {
          transition: background 0.15s, border-color 0.15s;
        }
        .zoiko-pricing-btn:hover {
          background: #F5F7FF;
          border-color: #B0B4C0;
        }
        .zoiko-explore-link {
          transition: opacity 0.15s;
        }
        .zoiko-explore-link:hover {
          opacity: 0.75;
        }
        .zoiko-footer-item {
          transition: background 0.15s;
        }
        .zoiko-footer-item:hover {
          background: #F5F7FF;
        }
      `}</style>
    </div>
  );
}
