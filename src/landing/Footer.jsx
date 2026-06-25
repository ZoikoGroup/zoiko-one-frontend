import React from "react";

const navData = {
  platform: {
    title: "Platform",
    links: [
      "Overview",
      "How Zoiko One Works",
      "Security",
      "Trust Center",
      "Integrations",
      "API Documentation",
      "System Status",
    ],
  },
  products: {
    title: "Products",
    links: [
      "Zoiko HR",
      "ZoikoTime",
      "Zoiko Payroll",
      "Zoiko Billing",
      "Zoiko Spend",
      "Zoiko Projects",
      "Zoiko Inventory",
      "Zoiko Comply",
      "Zoiko Insights",
      "Zoiko Docs Pro",
    ],
  },
  solutions: {
    title: "Solutions",
    links: [
      "Services Businesses",
      "Agencies",
      "Retail Businesses",
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
      "People — HR, Time, Payroll",
      "Money — Billing, Spend",
      "Work — Projects",
      "Supply — Inventory",
      "Control — Comply, Insights",
    ],
  },
  resources: {
    title: "Resources",
    links: [
      "Resource Center",
      "Trust Center",
      "Security",
      "Integrations",
      "API Documentation",
      "System Status",
      "Pricing",
      "Contact",
    ],
  },
  company: {
    title: "Company",
    links: [
      "About Zoiko One",
      "Leadership",
      "Careers",
      "Contact",
      "Pricing",
      "Trust Center",
      "Solutions",
    ],
  },
};

const ecosystemCards = [
  { name: "Zoiko One", desc: "Business operations — this platform", active: true },
  { name: "ZoikoVertex", desc: "CRM, sales, marketing & growth", active: false },
  { name: "ZoikoSuite", desc: "Accounting & bookkeeping", active: false },
  { name: "Zoiko Sema", desc: "Communication & collaboration", active: false },
  { name: "Zoiko Local", desc: "Telephony & business calling", active: false },
  { name: "Zoiko Digital", desc: "Web, app, cloud & digital services", active: false },
];

const legalLinks = [
  "Privacy Policy",
  "Terms of Service",
  "Cookie Policy",
  "Accessibility Statement",
  "Acceptable Use",
  "Trust Center",
  "Security",
  "System Status",
  "Contact",
];

const getStartedLinks = [
  "Get a Demo",
  "Request Pricing",
  "Explore Products",
  "Contact Sales",
  "Sign In",
];

export default function Footer() {
  return (
    <footer style={styles.root}>
      {/* CTA Banner */}
      <div style={styles.ctaBannerWrap}>
        <div style={styles.ctaBanner}>
          <div>
            <h2 style={styles.ctaTitle}>
              Everything your business runs on —<br />connected in one.
            </h2>
            <p style={styles.ctaSub}>
              Run people, money, work, supply, compliance, business intelligence and
              document workflows through one connected business-operations platform.
            </p>
            <p style={styles.ctaNote}>
              Start with one product, one pillar or the full Zoiko One platform.
            </p>
          </div>
          <div style={styles.ctaActions}>
            <button style={styles.btnDemo}>Get a Demo &nbsp;→</button>
            <button style={styles.btnExplore}>Explore Products</button>
            <button style={styles.btnPricing}>Pricing</button>
          </div>
        </div>
      </div>

      {/* Main Nav Grid */}
      <div style={styles.footerMain}>
        {/* Brand Column */}
        <div style={styles.brandCol}>
          <div style={styles.logoWrap}>
            <div style={styles.logoIcon}>1</div>
            <span style={styles.logoText}>
              ZoikoOne<sup style={styles.logoTm}>™</sup>
            </span>
          </div>
          <p style={styles.brandDesc}>
            The connected business-operations platform for people, money, work,
            supply and control.
          </p>
          <div style={styles.socialIcons}>
            {["in", "𝕏", "⌥"].map((icon, i) => (
              <button key={i} style={styles.socialBtn} aria-label={`Social ${i}`}>
                {icon}
              </button>
            ))}
          </div>
        </div>

        {/* Nav Columns */}
        {Object.values(navData).map((col) => (
          <div key={col.title} style={styles.navCol}>
            <div style={styles.navColTitle}>{col.title}</div>
            <ul style={styles.navList}>
              {col.links.map((link) => (
                <li key={link} style={styles.navItem}>
                  <a href="#" style={styles.navLink}>
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Get Started */}
      <div style={styles.getStartedSection}>
        <div style={styles.sectionLabel}>Get Started</div>
        <div style={styles.getStartedLinks}>
          {getStartedLinks.map((link) => (
            <a key={link} href="#" style={styles.getStartedLink}>
              {link}
            </a>
          ))}
        </div>
      </div>

      {/* Ecosystem */}
      <div style={styles.ecosystemSection}>
        <div style={styles.sectionLabel}>The Zoiko Business Ecosystem</div>
        <p style={styles.ecosystemDesc}>
          Zoiko One runs business operations. The platforms below are ecosystem siblings
          they are not Zoiko One products.
        </p>
        <div style={styles.ecosystemCards}>
          {ecosystemCards.map((card) => (
            <div
              key={card.name}
              style={{
                ...styles.ecoCard,
                ...(card.active ? styles.ecoCardActive : {}),
              }}
            >
              <div style={styles.ecoCardName}>{card.name}</div>
              <div
                style={{
                  ...styles.ecoCardDesc,
                  ...(card.active ? styles.ecoCardDescActive : {}),
                }}
              >
                {card.desc}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Legal */}
      <div style={styles.footerLegal}>
        <div style={styles.legalLinks}>
          {legalLinks.map((link) => (
            <a key={link} href="#" style={styles.legalLink}>
              {link}
            </a>
          ))}
          <button style={styles.langBtn}>🌐 EN · Global</button>
        </div>
        <div style={styles.legalBottom}>
          © 2026 Zoiko Group. All rights reserved. · ZoikoOne™ · Nine core products
          plus Zoiko Docs Pro (Premium Capability).
        </div>
      </div>
    </footer>
  );
}

const styles = {
  root: {
    backgroundColor: "#110d2e",
    color: "#ffffff",
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
    width: "100%",
  },

  /* CTA Banner */
  ctaBannerWrap: {
    padding: "28px 28px 0",
  },
  ctaBanner: {
    maxWidth: "1100px",
    margin: "0 auto",
    background: "linear-gradient(135deg, #3a2caa 0%, #4a6fd8 60%, #4a99e8 100%)",
    borderRadius: "18px",
    padding: "36px 48px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
    gap: "32px",
  },
  ctaTitle: {
    fontSize: "26px",
    fontWeight: "700",
    color: "#ffffff",
    lineHeight: "1.2",
    marginBottom: "10px",
  },
  ctaSub: {
    fontSize: "13.5px",
    color: "rgba(255,255,255,0.88)",
    marginBottom: "8px",
    maxWidth: "480px",
    lineHeight: "1.5",
  },
  ctaNote: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.6)",
  },
  ctaActions: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
    flexShrink: "0",
  },
  btnDemo: {
    background: "linear-gradient(135deg, #f97316, #fb923c)",
    color: "#ffffff",
    border: "none",
    borderRadius: "50px",
    padding: "13px 28px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnExplore: {
    background: "rgba(255,255,255,0.15)",
    color: "#ffffff",
    border: "1.5px solid rgba(255,255,255,0.35)",
    borderRadius: "50px",
    padding: "12px 26px",
    fontSize: "15px",
    fontWeight: "600",
    cursor: "pointer",
    whiteSpace: "nowrap",
  },
  btnPricing: {
    background: "transparent",
    color: "#ffffff",
    border: "none",
    fontSize: "14px",
    fontWeight: "600",
    cursor: "pointer",
    textDecoration: "underline",
    whiteSpace: "nowrap",
  },

  /* Nav Grid */
  footerMain: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "40px 28px 0",
    display: "grid",
    gridTemplateColumns: "200px repeat(6, 1fr)",
    gap: "24px",
  },
  brandCol: {},
  logoWrap: {
    display: "flex",
    alignItems: "center",
    gap: "10px",
    marginBottom: "14px",
  },
  logoIcon: {
    width: "36px",
    height: "36px",
    borderRadius: "8px",
    background: "linear-gradient(135deg, #f97316 40%, #3b82f6 100%)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "18px",
    color: "#ffffff",
    fontWeight: "700",
    fontStyle: "italic",
  },
  logoText: {
    fontSize: "16px",
    fontWeight: "700",
    color: "#ffffff",
  },
  logoTm: {
    fontSize: "10px",
    fontWeight: "400",
  },
  brandDesc: {
    fontSize: "12.5px",
    color: "rgba(255,255,255,0.55)",
    lineHeight: "1.5",
    marginBottom: "18px",
  },
  socialIcons: {
    display: "flex",
    gap: "10px",
  },
  socialBtn: {
    width: "34px",
    height: "34px",
    borderRadius: "50%",
    border: "1.5px solid rgba(255,255,255,0.2)",
    background: "transparent",
    color: "rgba(255,255,255,0.7)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: "14px",
    cursor: "pointer",
  },
  navCol: {},
  navColTitle: {
    fontSize: "11.5px",
    fontWeight: "700",
    color: "#f97316",
    textTransform: "uppercase",
    letterSpacing: "0.08em",
    marginBottom: "14px",
  },
  navList: {
    listStyle: "none",
    padding: "0",
    margin: "0",
  },
  navItem: {
    marginBottom: "10px",
  },
  navLink: {
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    fontSize: "13px",
    lineHeight: "1.4",
    display: "block",
  },

  /* Get Started */
  getStartedSection: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    marginTop: "40px",
    padding: "36px 28px",
    textAlign: "center",
    maxWidth: "1100px",
    marginLeft: "auto",
    marginRight: "auto",
  },
  sectionLabel: {
    fontSize: "11.5px",
    fontWeight: "700",
    color: "#f97316",
    textTransform: "uppercase",
    letterSpacing: "0.1em",
    marginBottom: "18px",
  },
  getStartedLinks: {
    display: "flex",
    justifyContent: "center",
    gap: "32px",
    flexWrap: "wrap",
  },
  getStartedLink: {
    color: "rgba(255,255,255,0.72)",
    textDecoration: "none",
    fontSize: "14px",
  },

  /* Ecosystem */
  ecosystemSection: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    padding: "36px 28px",
    maxWidth: "1100px",
    margin: "0 auto",
    textAlign: "center",
  },
  ecosystemDesc: {
    fontSize: "13px",
    color: "rgba(255,255,255,0.55)",
    marginBottom: "24px",
  },
  ecosystemCards: {
    display: "grid",
    gridTemplateColumns: "repeat(6, 1fr)",
    gap: "12px",
  },
  ecoCard: {
    border: "1.5px solid rgba(255,255,255,0.15)",
    borderRadius: "10px",
    padding: "14px",
    textAlign: "left",
    background: "transparent",
  },
  ecoCardActive: {
    background: "#f97316",
    borderColor: "#f97316",
  },
  ecoCardName: {
    fontSize: "13px",
    fontWeight: "700",
    color: "#ffffff",
    marginBottom: "5px",
  },
  ecoCardDesc: {
    fontSize: "11px",
    color: "rgba(255,255,255,0.65)",
    lineHeight: "1.35",
  },
  ecoCardDescActive: {
    color: "rgba(255,255,255,0.85)",
  },

  /* Legal */
  footerLegal: {
    borderTop: "1px solid rgba(255,255,255,0.1)",
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "20px 28px 28px",
  },
  legalLinks: {
    display: "flex",
    flexWrap: "wrap",
    justifyContent: "center",
    gap: "6px 20px",
    marginBottom: "12px",
  },
  legalLink: {
    fontSize: "12px",
    color: "rgba(255,255,255,0.5)",
    textDecoration: "none",
  },
  langBtn: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
    color: "rgba(255,255,255,0.5)",
    fontSize: "12px",
    background: "transparent",
    border: "none",
    cursor: "pointer",
  },
  legalBottom: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    fontSize: "12px",
    color: "rgba(255,255,255,0.4)",
    textAlign: "center",
  },
};
