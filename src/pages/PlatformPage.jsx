import { useState } from "react";
import LandingHeader from "../landing/LandingHeader";

const colors = {
  navy: "#0B1C3F",
  blue: "#1A3A8C",
  orange: "#E8850A",
  lightBlue: "#3B82F6",
  white: "#FFFFFF",
  offWhite: "#f8fafc",
  gray: "#6B7280",
  lightGray: "#E5E7EB",
  darkText: "#111827",
  subtleText: "#4B5563",
};

const styles = {
  page: {
    fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
    color: colors.darkText,
    background: colors.white,
    overflowX: "hidden",
  },
  section: { padding: "80px 5%" },
  eyebrow: {
    display: "inline-block",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase",
    color: colors.orange,
    marginBottom: "16px",
  },
  h1: { fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, lineHeight: 1.1, color: colors.navy },
  h2: { fontSize: "clamp(26px,4vw,44px)", fontWeight: 800, lineHeight: 1.15, color: colors.navy },
  body: { fontSize: "16px", lineHeight: 1.7, color: colors.subtleText },
  btnPrimary: {
    background: colors.orange,
    color: colors.white,
    border: "none",
    borderRadius: "50px",
    padding: "14px 28px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
    display: "inline-flex",
    alignItems: "center",
    gap: "6px",
  },
  btnSecondary: {
    background: "transparent",
    color: colors.navy,
    border: `2px solid ${colors.lightGray}`,
    borderRadius: "50px",
    padding: "12px 24px",
    fontWeight: 600,
    fontSize: "15px",
    cursor: "pointer",
  },
  btnDark: {
    background: colors.navy,
    color: colors.white,
    border: "none",
    borderRadius: "50px",
    padding: "14px 28px",
    fontWeight: 700,
    fontSize: "15px",
    cursor: "pointer",
  },
  card: {
    background: colors.white,
    borderRadius: "16px",
    padding: "24px",
    boxShadow: "0 1px 4px rgba(0,0,0,0.08)",
    border: `1px solid ${colors.lightGray}`,
  },
  tag: {
    display: "inline-block",
    background: colors.offWhite,
    borderRadius: "50px",
    padding: "4px 12px",
    fontSize: "12px",
    fontWeight: 600,
    color: colors.navy,
    margin: "3px",
  },
  iconBox: (bg) => ({
    width: "44px",
    height: "44px",
    borderRadius: "12px",
    background: bg,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "12px",
    fontSize: "20px",
  }),
};

function Badge({ label, tag = "Platform" }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "6px 16px", marginBottom: 28, fontSize: 14, fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <span style={{ background: "#3B5BDB", color: "#fff", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{tag}</span>
      <span style={{ color: "#555" }}>{label}</span>
    </div>
  );
}

function HeroSection() {
  return (
    <section style={{
      position: "relative",
      minHeight: "85vh",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      justifyContent: "center",
      textAlign: "center",
      padding: "80px 24px",
      overflow: "hidden",
      backgroundColor: "#f5f4f2",
      background: "linear-gradient(120deg, rgba(255,195,130,0.45) 0%, rgba(250,248,245,0.98) 38%, rgba(250,248,245,0.98) 62%, rgba(170,205,240,0.45) 100%)",
    }}>
      {/* center brightening + edge color pools */}
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 12% 55%, rgba(255,175,90,0.25) 0%, transparent 42%), radial-gradient(ellipse at 88% 45%, rgba(140,190,235,0.28) 0%, transparent 42%), radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.7) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
        <Badge label="Nine core products + Docs Pro" />
        <h1 style={{ ...styles.h1, margin: "0 0 20px" }}>
          One platform to run people, money, work, supply and{" "}
          <span style={{ color: colors.orange }}>control.</span>
        </h1>
        <p style={{ ...styles.body, margin: "0 0 12px" }}>
          Zoiko One connects the core operations of a modern business through one governed business-operations platform — HR, time, payroll, billing, spend, projects, inventory, compliance, documents, approvals, workflows, insights and AI assistance in one shared operating system.
        </p>
        <p style={{ fontSize: "13px", color: colors.subtleText, marginBottom: "28px", fontStyle: "italic" }}>
          Start with one product, activate a pillar or scale into the full platform.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={{
            background: "linear-gradient(135deg, #E07B2A, #c9651a)",
            color: "#fff", border: "none", borderRadius: 999,
            padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer",
          }}>Get a Demo →</button>
          <button style={{
            background: "rgba(255,255,255,0.75)", color: "#1a1a2e",
            border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 999,
            padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}>Explore Products</button>
        </div>
      </div>
    </section>
  );
}

function ProblemSection() {
  return (
    <section style={{ ...styles.section, background: colors.white }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
        <div>
          <span style={styles.eyebrow}>The Platform Problem</span>
          <h2 style={{ ...styles.h2, marginBottom: "20px" }}>Disconnected tools slow down growing businesses.</h2>
          <p style={styles.body}>
            Most businesses don't suffer from too little software — they suffer from too many disconnected systems. Zoiko One fixes the operating gap between departments by connecting data, approvals, documents, workflows and evidence.
          </p>
          <button style={{ ...styles.btnDark, marginTop: "28px" }}>See the Platform Difference →</button>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          <div style={{ ...styles.card, border: `1px solid ${colors.lightGray}` }}>
            <p style={{ fontWeight: 700, marginBottom: "12px", color: colors.darkText }}>Disconnected stack</p>
            {["Manual exports between tools", "Approvals lost in email", "Re-keyed data & errors", "Reporting after the fact", "No shared evidence trail"].map(t => (
              <div key={t} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "13px", color: colors.subtleText }}>
                <span style={{ color: "#EF4444", fontWeight: 700 }}>✕</span> {t}
              </div>
            ))}
          </div>
          <div style={{ ...styles.card, background: colors.blue, border: "none" }}>
            <p style={{ fontWeight: 700, marginBottom: "12px", color: "#fff" }}>Zoiko One</p>
            {["One shared data spine", "Structured approval routing", "Clean cross-product handoffs", "Live operating visibility", "Audit-ready evidence"].map(t => (
              <div key={t} style={{ display: "flex", gap: "8px", marginBottom: "8px", fontSize: "13px", color: "#CBD5E1" }}>
                <span style={{ color: "#4ADE80", fontWeight: 700 }}>✓</span> {t}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

const pillars = [
  { color: colors.blue, icon: "👥", label: "PEOPLE", title: "People", desc: "Manage, track and pay the people who run the business.", tags: ["HR", "Time", "Payroll"] },
  { color: colors.orange, icon: "$", label: "MONEY", title: "Money", desc: "Control money in, money out, billing and vendor spend.", tags: ["Billing", "Spend"] },
  { color: "#3B82F6", icon: "⊞", label: "WORK", title: "Work", desc: "Plan, deliver and monitor projects, budgets, margins and milestones.", tags: ["Projects"] },
  { color: "#6366F1", icon: "◈", label: "SUPPLY", title: "Supply", desc: "Manage stock, locations, goods movement, receiving and valuation.", tags: ["Inventory"] },
  { color: colors.navy, icon: "✓", label: "CONTROL", title: "Control", desc: "Govern compliance, evidence, risk, dashboards and intelligence.", tags: ["Comply", "Insights"] },
];

function PillarsSection() {
  return (
    <section style={{ ...styles.section, background: colors.offWhite, textAlign: "center" }}>
      <span style={styles.eyebrow}>Five-Pillar Operating Model</span>
      <h2 style={{ ...styles.h2, marginBottom: "8px" }}>Built around how businesses actually operate.</h2>
      <p style={{ ...styles.body, marginBottom: "40px" }}>Every product belongs to a pillar and shares the same platform spine.</p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: "16px", maxWidth: "1100px", margin: "0 auto 36px" }}>
        {pillars.map(p => (
          <div key={p.title} style={{ ...styles.card, textAlign: "left" }}>
            <div style={styles.iconBox(p.color)}>
              <span style={{ color: "#fff", fontWeight: 800, fontSize: "18px" }}>{p.icon}</span>
            </div>
            <div style={{ fontSize: "11px", fontWeight: 700, color: p.color, letterSpacing: "0.1em", marginBottom: "4px" }}>{p.label}</div>
            <div style={{ fontWeight: 800, fontSize: "20px", marginBottom: "8px", color: colors.navy }}>{p.title}</div>
            <p style={{ fontSize: "13px", color: colors.subtleText, marginBottom: "12px" }}>{p.desc}</p>
            <div>{p.tags.map(t => <span key={t} style={styles.tag}>{t}</span>)}</div>
          </div>
        ))}
      </div>
      <button style={styles.btnSecondary}>Explore the Five Pillars</button>
    </section>
  );
}

const spineItems = [
  { icon: "🪪", title: "ZoikoID", sub: "Identity, roles, permissions, entities" },
  { icon: "⇄", title: "Zoiko Workflow", sub: "Routing, approvals, escalations, policy" },
  { icon: "◎", title: "Zoiko Hub", sub: "Tasks, alerts, approvals, daily priorities" },
  { icon: "⊡", title: "Zoiko Connect", sub: "APIs, connectors, imports & exports" },
  { icon: "📄", title: "Documents + Docs Pro", sub: "Governance plus premium automation" },
  { icon: "✦", title: "AI Assistance", sub: "Governed, inside policy & approvals" },
];

function SpineSection() {
  return (
    <section style={{ ...styles.section, background: colors.white }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: "60px", alignItems: "center" }}>
        <div>
          <span style={styles.eyebrow}>The Connected Spine</span>
          <h2 style={{ ...styles.h2, marginBottom: "20px" }}>One connected spine beneath every product.</h2>
          <p style={styles.body}>
            ZoikoID, Workflow, Hub, Connect, Documents, Approvals, Expenses and AI Assistance create the common operating foundation across the platform. These are shared layers — not separate pillar products.
          </p>
          <button style={{ ...styles.btnDark, marginTop: "28px" }}>See Connected Workflows →</button>
        </div>
        <div style={{ background: colors.blue, borderRadius: "20px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          {spineItems.map(item => (
            <div key={item.title} style={{ background: "rgba(255,255,255,0.1)", borderRadius: "12px", padding: "14px 18px", display: "flex", gap: "14px", alignItems: "center" }}>
              <span style={{ fontSize: "20px" }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 700, color: "#fff", fontSize: "14px" }}>{item.title}</div>
                <div style={{ fontSize: "12px", color: "#CBD5E1" }}>{item.sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

const workflows = [
  {
    n: 1, title: "New employee to payroll",
    steps: ["HR record", "ZoikoID access", "Approved time", "Payroll workflow", "Approval", "Documents / evidence", "Insights"],
  },
  {
    n: 2, title: "Project to billing",
    steps: ["Project setup", "Resources & milestones", "Approved billable time", "Billing event", "Approval", "Revenue & margin"],
  },
  {
    n: 3, title: "Spend to inventory",
    steps: ["Purchase request", "Policy check", "Approval", "PO", "Goods received", "Inventory movement", "Supplier invoice evidence"],
  },
  {
    n: 4, title: "Documents to compliance",
    steps: ["Approved template", "Guided workflow", "Review", "Approval", "Secure storage", "Evidence", "Compliance trail"],
  },
];

function WorkflowSection() {
  return (
    <section style={{ ...styles.section, background: colors.offWhite }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={styles.eyebrow}>How Zoiko One Works</span>
          <h2 style={{ ...styles.h2, marginBottom: "12px" }}>From business event to approved action.</h2>
          <p style={{ ...styles.body, maxWidth: "560px", margin: "0 auto" }}>
            Business events trigger structured workflows, approvals, record updates and evidence capture across the relevant products and platform layers.
          </p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {workflows.map(w => (
            <div key={w.n} style={{ ...styles.card }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
                <span style={{ background: colors.orange, color: "#fff", borderRadius: "8px", width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: "14px" }}>{w.n}</span>
                <span style={{ fontWeight: 700, color: colors.navy }}>{w.title}</span>
              </div>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", alignItems: "center" }}>
                {w.steps.map((s, i) => (
                  <span key={s} style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                    <span style={styles.tag}>{s}</span>
                    {i < w.steps.length - 1 && <span style={{ color: colors.gray, fontSize: "12px" }}>→</span>}
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

const govCards = [
  { icon: "🪪", title: "Identity & permissions", desc: "Role boundaries across teams, departments and entities." },
  { icon: "✓", title: "Approval routing", desc: "Structured, standardized approvals across products." },
  { icon: "📄", title: "Evidence & audit", desc: "Decision trails, document history and activity records." },
  { icon: "✦", title: "Governed AI", desc: "Summaries, drafting, routing and exception analysis — in-bounds." },
];

function GovernanceSection() {
  return (
    <section style={{ ...styles.section, background: colors.navy, textAlign: "center" }}>
      <span style={{ ...styles.eyebrow, color: colors.orange }}>Governance & AI</span>
      <h2 style={{ ...styles.h2, color: "#fff", marginBottom: "16px" }}>Control is built into the platform, not added at the end.</h2>
      <p style={{ ...styles.body, color: "#94A3B8", maxWidth: "600px", margin: "0 auto 40px" }}>
        Governance is embedded through identity, permissions, approvals, evidence trails and document controls. AI assistance helps users act faster — inside permission, policy and approval boundaries.
      </p>
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", maxWidth: "1000px", margin: "0 auto 36px" }}>
        {govCards.map(c => (
          <div key={c.title} style={{ background: "rgba(255,255,255,0.08)", borderRadius: "16px", padding: "24px", textAlign: "left" }}>
            <span style={{ fontSize: "22px", marginBottom: "10px", display: "block" }}>{c.icon}</span>
            <div style={{ fontWeight: 700, color: "#fff", marginBottom: "6px" }}>{c.title}</div>
            <div style={{ fontSize: "13px", color: "#94A3B8" }}>{c.desc}</div>
          </div>
        ))}
      </div>
      <button style={{ ...styles.btnPrimary }}>See AI Assistance in Action →</button>
    </section>
  );
}

const moneyItems = [
  { icon: "⊟", title: "Billing → money in", desc: "Invoices, subscriptions and revenue records.", color: "#E8850A" },
  { icon: "$", title: "Payroll → money to people", desc: "Approved pay runs from HR and time data.", color: "#3B82F6" },
  { icon: "⇄", title: "Spend → money to vendors", desc: "Requests, POs, supplier invoices and AP.", color: "#E8850A" },
  { icon: "◈", title: "Inventory → money in goods", desc: "Stock value, receiving and movement.", color: "#1A3A8C" },
  { icon: "→", title: "ZoikoPay → moves money", desc: "Settlement and money movement support.", color: "#3B82F6" },
  { icon: "◆", title: "ZoikoCoreX → financial truth", desc: "Ledger-grade governed traceability.", color: "#1A3A8C" },
];

function MoneySection() {
  return (
    <section style={{ ...styles.section, background: colors.white }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "48px" }}>
          <span style={styles.eyebrow}>Money Architecture</span>
          <h2 style={{ ...styles.h2 }}>Money flows through the platform with clear boundaries.</h2>
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px", marginBottom: "48px" }}>
          {moneyItems.map(m => (
            <div key={m.title} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "20px", borderRadius: "14px", border: `1px solid ${colors.lightGray}` }}>
              <div style={{ width: "40px", height: "40px", borderRadius: "10px", background: m.color, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontWeight: 800, fontSize: "16px", flexShrink: 0 }}>{m.icon}</div>
              <div>
                <div style={{ fontWeight: 700, color: colors.navy, marginBottom: "4px" }}>{m.title}</div>
                <div style={{ fontSize: "13px", color: colors.subtleText }}>{m.desc}</div>
              </div>
            </div>
          ))}
        </div>
        <p style={{ textAlign: "center", fontSize: "13px", color: colors.subtleText, marginBottom: "48px" }}>ZoikoSuite keeps the books — outside Zoiko One, as an ecosystem sibling.</p>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "24px" }}>
          <div style={{ ...styles.card }}>
            <div style={styles.iconBox(colors.blue)}><span style={{ color: "#fff" }}>⊡</span></div>
            <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "8px", color: colors.navy }}>Connect what you already use.</div>
            <p style={{ fontSize: "14px", color: colors.subtleText, marginBottom: "12px" }}>Zoiko Connect supports APIs, connectors, data imports, exports, workflow triggers and secure third-party links.</p>
            <a href="#" style={{ color: colors.blue, fontWeight: 600, fontSize: "14px" }}>Explore Zoiko Connect →</a>
          </div>
          <div style={{ ...styles.card }}>
            <div style={styles.iconBox(colors.orange)}><span style={{ color: "#fff" }}>⤢</span></div>
            <div style={{ fontWeight: 800, fontSize: "18px", marginBottom: "8px", color: colors.navy }}>Start small. Expand with control.</div>
            <p style={{ fontSize: "14px", color: colors.subtleText, marginBottom: "12px" }}>Begin with one product, one pillar or one urgent workflow, then activate more products on the same shared spine.</p>
            <a href="#" style={{ color: colors.blue, fontWeight: 600, fontSize: "14px" }}>Plan Your Rollout →</a>
          </div>
        </div>
      </div>
    </section>
  );
}

const faqs = [
  { q: "How many products does Zoiko One have?" },
  { q: "What is the platform spine?" },
  { q: "Is Docs Pro legal advice?" },
  { q: "Can I start with one product?" },
  { q: "How does Zoiko One handle accounting?" },
];

function FAQSection() {
  const [open, setOpen] = useState(null);
  return (
    <section style={{ ...styles.section, background: colors.offWhite }}>
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "40px" }}>
          <span style={styles.eyebrow}>Platform FAQs</span>
          <h2 style={styles.h2}>Questions about the platform.</h2>
        </div>
        {faqs.map((f, i) => (
          <div key={f.q} onClick={() => setOpen(open === i ? null : i)} style={{ background: colors.white, borderRadius: "12px", padding: "18px 20px", marginBottom: "10px", cursor: "pointer", display: "flex", justifyContent: "space-between", alignItems: "center", border: `1px solid ${colors.lightGray}` }}>
            <span style={{ fontWeight: 600, color: colors.navy, fontSize: "15px" }}>{f.q}</span>
            <span style={{ color: colors.gray, transition: "transform 0.2s", transform: open === i ? "rotate(180deg)" : "none" }}>⌄</span>
          </div>
        ))}
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section style={{ padding: "60px 5%", background: colors.white }}>
      <div style={{ background: `linear-gradient(135deg, ${colors.blue} 0%, #1e40af 100%)`, borderRadius: "24px", padding: "60px 40px", textAlign: "center", maxWidth: "1100px", margin: "0 auto" }}>
        <h2 style={{ ...styles.h2, color: "#fff", marginBottom: "16px" }}>Run your business from one connected platform.</h2>
        <p style={{ color: "#CBD5E1", fontSize: "16px", maxWidth: "520px", margin: "0 auto 36px" }}>
          Bring people, money, work, supply, control, documents, approvals, workflows, insights and AI assistance into one governed operating system.
        </p>
        <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
          <button style={styles.btnPrimary}>Get a Demo →</button>
          <button style={{ ...styles.btnSecondary, border: "2px solid rgba(255,255,255,0.3)", color: "#fff" }}>Explore Products</button>
          <button style={{ ...styles.btnSecondary, border: "2px solid rgba(255,255,255,0.3)", color: "#fff" }}>Request Pricing</button>
        </div>
      </div>
    </section>
  );
}

export default function PlatformPage() {
  return (
    <div style={styles.page}>
      <LandingHeader />
      <HeroSection />
      <ProblemSection />
      <PillarsSection />
      <SpineSection />
      <WorkflowSection />
      <GovernanceSection />
      <MoneySection />
      <FAQSection />
      <CTASection />
    </div>
  );
}
