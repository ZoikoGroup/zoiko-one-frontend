import React from "react";
import { Link } from "react-router-dom";
import {
  Box,
  FileText,
  BookOpen,
  Lightbulb,
  Presentation,
  PlayCircle,
  Bell,
  CodeXml,
  Blend,
  Building2,
  ShieldCheck,
  LifeBuoy,
  Headset,
  Users,
  Handshake,
  GraduationCap,
  ChevronRight,
  CheckCircle2,
  Contact,
  BarChart3,
  Target,
  ArrowRight,
  PenLine,
  User,
  Briefcase,
  Boxes,
  Receipt,
  HelpCircle,
  Tag,
  Phone,
} from "lucide-react";

const COLORS = {
  blue: "#3B5BFF",
  blueBg: "#EAF0FF",
  green: "#1FA35C",
  greenBg: "#E7F8EE",
  purple: "#8B4FE0",
  purpleBg: "#F2EBFB",
  gray: "#6B7280",
  grayIcon: "#B0B4C0",
  border: "#EEF0F5",
};

const learnDiscover = [
  {
    icon: FileText,
    name: "Resource Center",
    desc: "Guides, how-tos, and best practices.",
    href: "/resources",
  },
  {
    icon: BookOpen,
    name: "Knowledge Base",
    desc: "Answers to common questions and topics.",
    href: "/resources",
  },
  {
    icon: Lightbulb,
    name: "Blog",
    desc: "Insights on operations, productivity, and growth.",
    href: "/resources",
  },
  {
    icon: Presentation,
    name: "Research & Reports",
    desc: "Industry research, benchmarks, and whitepapers.",
    href: "/resources",
  },
  {
    icon: PlayCircle,
    name: "Webinars & Events",
    desc: "Live sessions and on-demand webinars.",
    href: "/resources",
  },
  {
    icon: Bell,
    name: "What's New",
    desc: "Product updates, releases, and announcements.",
    href: "/resources",
  },
];

const buildIntegrate = [
  {
    icon: CodeXml,
    name: "API Documentation",
    desc: "Technical references and guides for developers.",
    href: "/api-documentation",
  },
  {
    icon: Blend,
    name: "Integrations",
    desc: "Connect Zoiko One with your favourite tools.",
    href: "/integrations",
  },
  {
    icon: Building2,
    name: "Developer Hub",
    desc: "SDKs, guides, sandboxes, and developer resources.",
    href: "/api-documentation",
  },
  {
    icon: ShieldCheck,
    name: "Security Center",
    desc: "Security practices, certifications, and trust resources.",
    href: "/security",
  },
];

const getHelp = [
  {
    icon: LifeBuoy,
    name: "Help Center",
    desc: "Step-by-step help and support articles.",
    href: "/resources",
  },
  {
    icon: Headset,
    name: "Support",
    desc: "Open a ticket or chat with our support team.",
    href: "/contact",
  },
  {
    icon: Users,
    name: "Community",
    desc: "Connect with users, experts, and partners.",
    href: "/resources",
  },
  {
    icon: Handshake,
    name: "Partners",
    desc: "Find implementation partners and technology alliances.",
    href: "/eco-system",
  },
  {
    icon: GraduationCap,
    name: "Training & Certification",
    desc: "Courses, learning paths, and product certifications.",
    href: "/resources",
  },
];

const popularTopics = [
  { icon: PenLine, label: "Getting Started", href: "/how-it-works" },
  { icon: User, label: "HR & Payroll", href: "/products/zoiko-hr" },
  { icon: Briefcase, label: "Projects & Work", href: "/projects" },
  { icon: Boxes, label: "Inventory & Supply", href: "/inventory" },
  { icon: Receipt, label: "Billing & Spend", href: "/products/billing" },
  { icon: ShieldCheck, label: "Compliance", href: "/products/comply" },
];

function Row({ item, color }) {
  const Icon = item.icon;
  return (
    <Link
      to={item.href}
      className="zoiko-row"
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "6px 8px",
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
          background: COLORS.blueBg,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          color: color,
        }}
      >
        <Icon size={16} strokeWidth={2} />
      </span>
      <span style={{ flex: 1, minWidth: 0 }}>
        <span
          style={{
            display: "block",
            fontSize: 13.5,
            fontWeight: 600,
            color: "#12142B",
            marginBottom: 1,
          }}
        >
          {item.name}
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
      <ChevronRight
        size={14}
        color="#C4C7D0"
        style={{ marginTop: 6, flexShrink: 0 }}
      />
    </Link>
  );
}

function ColumnHeader({ label, color }) {
  return (
    <div
      style={{
        fontSize: 10.5,
        fontWeight: 700,
        letterSpacing: 0.5,
        color,
        textTransform: "uppercase",
        marginBottom: 8,
      }}
    >
      {label}
    </div>
  );
}

export default function ResourcesMegaMenu() {
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
            Everything you need to learn, build, and succeed with Zoiko
            One.
          </h1>
          <p style={{ fontSize: 13, color: COLORS.gray, margin: 0 }}>
            Expert insights. Practical guidance. Developer tools. All in
            one place.
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
            <ColumnHeader label="Learn & Discover" color={COLORS.blue} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {learnDiscover.map((item) => (
                <Row key={item.name} item={item} color={COLORS.blue} />
              ))}
            </div>
          </div>

          <div>
            <ColumnHeader label="Build & Integrate" color={COLORS.green} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {buildIntegrate.map((item) => (
                <Row key={item.name} item={item} color={COLORS.green} />
              ))}
            </div>
          </div>

          <div>
            <ColumnHeader label="Get Help & Connect" color={COLORS.purple} />
            <div style={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {getHelp.map((item) => (
                <Row key={item.name} item={item} color={COLORS.purple} />
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
                background: "#FFFFFF",
                borderRadius: 10,
                padding: 14,
                display: "flex",
                alignItems: "flex-end",
                justifyContent: "space-between",
                height: 80,
                marginBottom: 10,
                position: "relative",
                overflow: "hidden",
                width: "100%",
              }}
            >
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  left: 8,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: COLORS.greenBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.green,
                }}
              >
                <CheckCircle2 size={12} />
              </span>
              <span
                style={{
                  position: "absolute",
                  top: 8,
                  right: 8,
                  width: 22,
                  height: 22,
                  borderRadius: "50%",
                  background: COLORS.blueBg,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: COLORS.blue,
                }}
              >
                <Contact size={12} />
              </span>

              <div
                style={{
                  display: "flex",
                  alignItems: "flex-end",
                  gap: 4,
                  marginLeft: 4,
                }}
              >
                <span style={{ width: 6, height: 18, background: "#DCE2F7", borderRadius: 2 }} />
                <span style={{ width: 6, height: 30, background: "#B7C3F5", borderRadius: 2 }} />
                <span style={{ width: 6, height: 44, background: COLORS.blue, borderRadius: 2 }} />
                <span style={{ width: 6, height: 26, background: "#B7C3F5", borderRadius: 2 }} />
              </div>

              <div
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: "50%",
                  border: `4px solid ${COLORS.green}`,
                  borderRightColor: "#F0672B",
                  marginRight: 4,
                }}
              />
            </div>

            <div
              style={{
                fontSize: 14,
                fontWeight: 700,
                color: "#12142B",
                lineHeight: 1.3,
                marginBottom: 6,
              }}
            >
              Customer Success Starts Here
            </div>
            <div
              style={{
                fontSize: 11,
                color: COLORS.gray,
                lineHeight: 1.4,
                marginBottom: 10,
              }}
            >
              Explore best practices, implementation guides, and expert
              resources to get the most from Zoiko One.
            </div>

            <Link
              to="/resources"
              className="zoiko-resource-btn"
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                gap: 6,
                background: COLORS.blue,
                color: "#fff",
                border: "none",
                borderRadius: 8,
                padding: "7px 0",
                fontSize: 11.5,
                fontWeight: 600,
                cursor: "pointer",
                marginBottom: 8,
                textDecoration: "none",
              }}
            >
              View Resource Center <ArrowRight size={14} />
            </Link>

            <Link
              to="/get-demo"
              className="zoiko-explore-link"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 4,
                fontSize: 11.5,
                fontWeight: 600,
                color: COLORS.blue,
                textDecoration: "none",
              }}
            >
              Get a Demo <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      </div>

      <div
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          padding: "12px 28px",
          display: "flex",
          alignItems: "center",
          gap: 10,
          flexWrap: "wrap",
        }}
      >
        <span
          style={{
            fontSize: 10.5,
            fontWeight: 700,
            letterSpacing: 0.5,
            color: "#9AA0AC",
            textTransform: "uppercase",
            flexShrink: 0,
          }}
        >
          Popular Topics
        </span>
        {popularTopics.map((t) => {
          const Icon = t.icon;
          return (
            <Link
              key={t.label}
              to={t.href}
              className="zoiko-topic-pill"
              style={{
                display: "flex",
                alignItems: "center",
                gap: 6,
                fontSize: 11,
                fontWeight: 500,
                color: "#3A3D4A",
                textDecoration: "none",
                border: "1px solid #E1E4EA",
                borderRadius: 20,
                padding: "4px 10px",
              }}
            >
              <Icon size={12} color="#8A8D99" />
              {t.label}
            </Link>
          );
        })}
      </div>

      <div
        style={{
          borderTop: `1px solid ${COLORS.border}`,
          background: "#FAFBFF",
          padding: "14px 28px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 16,
        }}
      >
        <div style={{ display: "flex", alignItems: "flex-start", gap: 10 }}>
          <span
            style={{
              flexShrink: 0,
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "#EDEFF4",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "#6B7280",
            }}
          >
            <HelpCircle size={13} />
          </span>
          <div>
            <div style={{ fontSize: 12, fontWeight: 700, color: "#12142B" }}>
              Not sure where to start?
            </div>
            <div style={{ fontSize: 11, color: COLORS.gray }}>
              We'll help you find the right resources for your business.
            </div>
          </div>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <Link
            to="/platform"
            className="zoiko-footer-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 6,
              fontSize: 11.5,
              fontWeight: 600,
              color: COLORS.blue,
              textDecoration: "none",
            }}
          >
            <Box size={13} /> Explore Platform <ArrowRight size={12} />
          </Link>
          <Link
            to="/pricing"
            className="zoiko-footer-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11.5,
              fontWeight: 600,
              color: COLORS.blue,
              textDecoration: "none",
            }}
          >
            <Tag size={13} /> View Pricing <ArrowRight size={12} />
          </Link>
          <Link
            to="/get-demo"
            className="zoiko-footer-link"
            style={{
              display: "flex",
              alignItems: "center",
              gap: 5,
              fontSize: 11.5,
              fontWeight: 600,
              color: COLORS.blue,
              textDecoration: "none",
            }}
          >
            <Phone size={13} /> Talk to Sales <ArrowRight size={12} />
          </Link>
        </div>
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
        .zoiko-resource-btn {
          transition: background 0.15s, transform 0.15s;
        }
        .zoiko-resource-btn:hover {
          background: #2A4AE0;
          transform: translateY(-1px);
        }
        .zoiko-explore-link {
          transition: opacity 0.15s;
        }
        .zoiko-explore-link:hover {
          opacity: 0.75;
        }
        .zoiko-topic-pill {
          transition: background 0.15s, border-color 0.15s;
        }
        .zoiko-topic-pill:hover {
          background: #F5F7FF;
          border-color: #B0B4C0;
        }
        .zoiko-footer-link {
          transition: opacity 0.15s;
        }
        .zoiko-footer-link:hover {
          opacity: 0.75;
        }
      `}</style>
    </div>
  );
}
