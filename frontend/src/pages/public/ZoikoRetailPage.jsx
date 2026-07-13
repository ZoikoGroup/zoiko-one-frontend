import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../../components/layout/LandingHeader";
import Footer from "../../components/layout/Footer";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  navy: "#0f0e38",
  purple: "#3730a3",
  purpleDark: "#312e81",
  purpleMid: "#4f46e5",
  blue: "#2563eb",
  blueMid: "#1d4ed8",
  blueDark: "#1e3a8a",
  cyan: "#06b6d4",
  orange: "#f59e0b",
  orangeBtn: "#f5a000",
  white: "#ffffff",
  offWhite: "#f5f6fb",
  textDark: "#0f0e38",
  textMid: "#3b3a6e",
  textMuted: "#6b6a9a",
  border: "#e2e4f0",
};

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

/* ─────────────────────────────────────────────
   GLOBAL CSS
───────────────────────────────────────────── */
const globalCSS = `
  .btn-orange {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${C.orangeBtn}; color: #fff;
    font-weight: 700; font-size: 15px; font-family: ${font};
    padding: 14px 26px; border-radius: 50px; border: none;
    cursor: pointer; white-space: nowrap;
    box-shadow: 0 4px 18px rgba(245,160,0,0.38);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .btn-orange:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(245,160,0,0.5); }

  .btn-outline-dark {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent; color: ${C.textDark};
    font-weight: 600; font-size: 15px; font-family: ${font};
    padding: 13px 26px; border-radius: 50px;
    border: 1.5px solid ${C.border};
    cursor: pointer; white-space: nowrap;
    transition: border-color 0.15s, background 0.15s;
  }
  .btn-outline-dark:hover { border-color: ${C.purple}; background: #f0f0ff; }

  .btn-ghost-white {
    display: inline-flex; align-items: center;
    background: rgba(255,255,255,0.15); color: #fff;
    font-weight: 600; font-size: 15px; font-family: ${font};
    padding: 13px 24px; border-radius: 50px;
    border: 1.5px solid rgba(255,255,255,0.28);
    cursor: pointer; white-space: nowrap;
    transition: background 0.15s;
  }
  .btn-ghost-white:hover { background: rgba(255,255,255,0.25); }

  .section-label {
    font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 18px; display: block;
  }

  .fade-in {
    opacity: 0; transform: translateY(28px);
    transition: opacity 0.65s ease, transform 0.65s ease;
  }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  .product-card {
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 18px;
    padding: 28px 26px 24px;
    display: flex; flex-direction: column; gap: 10px;
    transition: box-shadow 0.2s, transform 0.2s;
  }
  .product-card:hover {
    box-shadow: 0 8px 32px rgba(55,48,163,0.10);
    transform: translateY(-2px);
  }

  .route-card {
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 18px;
    padding: 26px 22px;
    display: flex; flex-direction: column; gap: 10px;
    transition: box-shadow 0.2s;
  }
  .route-card:hover { box-shadow: 0 6px 24px rgba(55,48,163,0.09); }

  .explore-link {
    font-size: 13px; font-weight: 700; color: ${C.purple};
    cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
    transition: gap 0.15s;
  }
  .explore-link:hover { gap: 8px; }

  .flow-row {
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 50px;
    padding: 18px 32px;
    display: flex; align-items: center;
    flex-wrap: wrap; gap: 10px;
    margin-bottom: 14px;
  }

  .flow-label {
    font-size: 13px; font-weight: 600; color: ${C.textDark};
    white-space: nowrap;
  }
  .flow-divider {
    font-size: 18px; color: ${C.orange};
    font-weight: 800; margin: 0 2px;
  }
  .flow-pill {
    display: inline-flex; align-items: center;
    font-size: 13px; font-weight: 500; color: ${C.textDark};
    white-space: nowrap;
  }
  .flow-arrow { color: ${C.orange}; font-size: 15px; font-weight: 800; margin: 0 4px; }
`;

/* ─────────────────────────────────────────────
   INTERSECTION OBSERVER HOOK
───────────────────────────────────────────── */
function useFadeIn(delay = 0) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => el.classList.add("visible"), delay);
          obs.disconnect();
        }
      },
      { threshold: 0.08 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ─────────────────────────────────────────────
   SVG ICONS
───────────────────────────────────────────── */
const IconBox = ({ bg, size = 48, children }) => (
  <div style={{
    width: size, height: size, borderRadius: "13px",
    background: bg, display: "flex",
    alignItems: "center", justifyContent: "center", flexShrink: 0,
  }}>{children}</div>
);

const W = ({ color = "#fff", ...p }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" {...p} />
);

// Product icons
const InventoryIcon = () => (
  <W><circle cx="12" cy="12" r="4"/><path d="M4.93 4.93l14.14 14.14M19.07 4.93L4.93 19.07"/></W>
);
const SpendIcon = () => (
  <W><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/><line x1="12" y1="12" x2="12" y2="16"/><line x1="10" y1="14" x2="14" y2="14"/></W>
);
const TimeIcon = () => (
  <W><circle cx="12" cy="12" r="9"/><polyline points="12 7 12 12 15.5 15.5"/></W>
);
const HRIcon = () => (
  <W><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></W>
);
const BillingIcon = () => (
  <W><rect x="4" y="2" width="16" height="20" rx="2"/><line x1="8" y1="8" x2="16" y2="8"/><line x1="8" y1="12" x2="16" y2="12"/><line x1="8" y1="16" x2="13" y2="16"/></W>
);
const InsightsIcon = () => (
  <W><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></W>
);

// Route icons (emoji-style via SVG)
const IndependentIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><polyline points="8 21 12 17 16 21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const MultiLocationIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>
  </svg>
);
const OnlinePlusIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
  </svg>
);
const SpecialtyIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
  </svg>
);
const ConvenienceIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="21" r="1"/><circle cx="20" cy="21" r="1"/><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"/>
  </svg>
);
const ConsumerGoodsIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13S3 17 3 10a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
  </svg>
);

/* ─────────────────────────────────────────────
   SECTION 1 — HERO
───────────────────────────────────────────── */
function Hero({ onGetDemo }) {
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
      <div style={{
        position: "absolute", inset: 0,
        background: "radial-gradient(ellipse at 12% 55%, rgba(255,175,90,0.25) 0%, transparent 42%), radial-gradient(ellipse at 88% 45%, rgba(140,190,235,0.28) 0%, transparent 42%), radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.7) 0%, transparent 55%)",
        pointerEvents: "none",
      }} />
      <div style={{ position: "relative", zIndex: 1, maxWidth: 1400 }}>
        {/* badge */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: "10px",
          background: "#fff", border: `1.5px solid ${C.border}`,
          borderRadius: "50px", padding: "5px 14px 5px 5px",
          marginBottom: "46px",
          boxShadow: "0 2px 14px rgba(80,60,200,0.07)",
        }}>
          <span style={{
            background: C.blue, color: "#fff",
            fontSize: "11px", fontWeight: "700",
            padding: "4px 12px", borderRadius: "50px",
            letterSpacing: "0.3px",
          }}>Solutions</span>
          <span style={{ fontSize: "13px", fontWeight: "500", color: C.textMid }}>For retail</span>
        </div>

        {/* headline */}
        <h1 style={{
          fontSize: "clamp(34px, 5vw, 56px)",
          fontWeight: "800", lineHeight: "1.13",
          color: C.navy, maxWidth: "1100px",
          letterSpacing: "-1.5px", marginBottom: "32px",
        }}>
          Business operations software for{" "}
          <span style={{ color: C.orange }}>retail businesses.</span>
        </h1>

        {/* sub */}
        <p style={{
          fontSize: "16px", color: C.textMuted,
          lineHeight: "1.7", maxWidth: "960px",
          margin: "0 auto 44px",
        }}>
          Connect inventory, purchasing, receiving, staff time, vendor spend, locations, approvals, documents and insights so your retail business can control stock, manage teams and see performance clearly.
        </p>

        {/* buttons */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-orange" onClick={onGetDemo}>Get a Demo &nbsp;→</button>
          <button className="btn-outline-dark">Request Retail Pricing</button>
          <button className="btn-outline-dark">Explore Inventory &amp; Spend</button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 2 — PROBLEM + PRODUCT CARDS
───────────────────────────────────────────── */
const products = [
  {
    iconBg: C.purple,
    icon: <InventoryIcon />,
    title: "Zoiko Inventory",
    desc: "Stock, locations, receiving, goods movement, reorder points and valuation.",
    link: "Explore Inventory →",
  },
  {
    iconBg: C.orange,
    icon: <SpendIcon />,
    title: "Zoiko Spend",
    desc: "Purchase requests, supplier orders, POs, invoices and AP control.",
    link: "Explore Spend →",
  },
  {
    iconBg: C.purple,
    icon: <TimeIcon />,
    title: "ZoikoTime",
    desc: "Staff schedules, attendance, breaks and approved hours.",
    link: "Explore ZoikoTime →",
  },
  {
    iconBg: C.purple,
    icon: <HRIcon />,
    title: "Zoiko HR",
    desc: "Staff records, onboarding and people data across locations.",
    link: "Explore Zoiko HR →",
  },
  {
    iconBg: C.orange,
    icon: <BillingIcon />,
    title: "Zoiko Billing",
    desc: "Revenue workflows where relevant to your model.",
    link: "Explore Billing →",
  },
  {
    iconBg: C.purpleDark,
    icon: <InsightsIcon />,
    title: "Zoiko Insights",
    desc: "Stock, purchasing, workforce and store performance visibility.",
    link: "Explore Insights →",
  },
];

function ProblemSection() {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{ background: "#fff", padding: "100px 60px" }}>
      <div style={{ maxWidth: "820px", margin: "0 auto", textAlign: "center" }}>
        <span className="section-label" style={{ color: C.purple }}>THE PROBLEM</span>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "800",
          color: C.navy, letterSpacing: "-1.2px", lineHeight: "1.15",
          marginBottom: "22px",
        }}>
          Retail gets harder when stock, staff, purchasing and reporting are disconnected.
        </h2>
        <p style={{
          fontSize: "15px", color: C.textMuted, lineHeight: "1.7",
          maxWidth: "580px", margin: "0 auto 56px",
        }}>
          When inventory sits in spreadsheets, purchasing happens by message, receiving is informal and staff time is disconnected from operations, leaders lose visibility and control.
        </p>
      </div>

      <div style={{
        maxWidth: "1080px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
        gap: "20px",
      }}>
        {products.map((p) => (
          <div key={p.title} className="product-card">
            <IconBox bg={p.iconBg}>{p.icon}</IconBox>
            <div style={{ fontSize: "15px", fontWeight: "700", color: C.navy, marginTop: "4px" }}>{p.title}</div>
            <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: "1.65", flex: 1 }}>{p.desc}</div>
            <span className="explore-link">{p.link}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 3 — CORE WORKFLOWS
───────────────────────────────────────────── */
const workflows = [
  {
    label: "Spend → Stock",
    steps: ["Request", "PO", "Receiving", "Inventory"],
  },
  {
    label: "HR → Time → Payroll",
    steps: ["Staff record", "Schedules", "Approved hours", "Pay"],
  },
  {
    label: "Inventory → Insight",
    steps: ["Goods movement", "Reorder signal", "Business insight"],
  },
];

function WorkflowRow({ label, steps }) {
  return (
    <div className="flow-row">
      <span className="flow-label">{label}</span>
      <span className="flow-divider">⁚</span>
      {steps.map((step, i) => (
        <span key={step} style={{ display: "inline-flex", alignItems: "center" }}>
          <span className="flow-pill">{step}</span>
          {i < steps.length - 1 && <span className="flow-arrow">→</span>}
        </span>
      ))}
    </div>
  );
}

function WorkflowsSection() {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{ background: C.offWhite, padding: "100px 60px" }}>
      <div style={{ maxWidth: "960px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span className="section-label" style={{ color: C.orange }}>CORE RETAIL WORKFLOWS</span>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800",
            color: C.navy, letterSpacing: "-1px",
          }}>
            Connected from supplier to store.
          </h2>
        </div>
        {workflows.map((wf) => (
          <WorkflowRow key={wf.label} label={wf.label} steps={wf.steps} />
        ))}
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 4 — BY RETAIL MODEL
───────────────────────────────────────────── */
const routes = [
  {
    icon: <IndependentIcon />,
    title: "Independent retailers",
    desc: "Stock, staff and purchasing in one place.",
  },
  {
    icon: <MultiLocationIcon />,
    title: "Multi-location retailers",
    desc: "Locations, transfers and consolidated visibility.",
  },
  {
    icon: <OnlinePlusIcon />,
    title: "Online-plus-store",
    desc: "Connect stock and fulfillment across channels.",
  },
  {
    icon: <SpecialtyIcon />,
    title: "Specialty retailers",
    desc: "Curated stock, suppliers and margins.",
  },
  {
    icon: <ConvenienceIcon />,
    title: "Convenience & local",
    desc: "Fast reorder and supplier control.",
  },
  {
    icon: <ConsumerGoodsIcon />,
    title: "Consumer-goods retailers",
    desc: "Volume stock, valuation and purchasing.",
  },
];

// Blue gradient matching the screenshots
const routeIconBg = "linear-gradient(140deg, #3b82f6 0%, #1d4ed8 60%, #1e3a8a 100%)";

function RetailModelSection() {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{ background: "#fff", padding: "100px 60px" }}>
      <div style={{ maxWidth: "1080px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span className="section-label" style={{ color: C.cyan }}>BY RETAIL MODEL</span>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 42px)", fontWeight: "800",
            color: C.navy, letterSpacing: "-1px",
          }}>
            Routes for how you sell.
          </h2>
        </div>

        <div style={{
          display: "grid", gridTemplateColumns: "repeat(3, 1fr)",
          gap: "20px",
        }}>
          {routes.map((r) => (
            <div key={r.title} className="route-card">
              <IconBox bg={routeIconBg} size={48}>{r.icon}</IconBox>
              <div style={{ fontSize: "15px", fontWeight: "700", color: C.navy, marginTop: "4px" }}>{r.title}</div>
              <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: "1.6" }}>{r.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 5 — BOTTOM CTA
───────────────────────────────────────────── */
function BottomCTA({ onGetDemo }) {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{
      background: C.offWhite, padding: "20px 60px 80px",
    }}>
      <div style={{
        maxWidth: "1000px", margin: "0 auto",
        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 28%, #2563eb 62%, #1d8ef5 100%)",
        borderRadius: "24px",
        padding: "64px 60px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* blob */}
        <div style={{
          position: "absolute", top: "-55px", left: "-55px",
          width: "230px", height: "230px",
          background: "rgba(180,100,255,0.30)",
          borderRadius: "50%", filter: "blur(60px)",
          pointerEvents: "none",
        }} />

        <h2 style={{
          fontSize: "clamp(22px, 4vw, 38px)", fontWeight: "800",
          color: "#fff", letterSpacing: "-0.8px",
          lineHeight: "1.2", marginBottom: "18px",
          position: "relative",
        }}>
          Control stock. Manage teams. See performance.
        </h2>
        <p style={{
          fontSize: "15px", color: "rgba(255,255,255,0.75)",
          lineHeight: "1.65",
          maxWidth: "420px", margin: "0 auto 36px",
          position: "relative",
        }}>
          Start with inventory and spend, then expand into a connected retail operating model.
        </p>
        <div style={{
          display: "flex", gap: "14px",
          justifyContent: "center", flexWrap: "wrap",
          position: "relative",
        }}>
          <button className="btn-orange" onClick={onGetDemo}>Get a Demo</button>
          <button className="btn-ghost-white">Request Retail Pricing</button>
          <button className="btn-ghost-white">All Solutions</button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function ZoikoRetailPage() {
  const navigate = useNavigate();
  const onGetDemo = () => navigate("/get-demo");
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div>
      <LandingHeader />
      <main>
        <Hero onGetDemo={onGetDemo} />
        <ProblemSection />
        <WorkflowsSection />
        <RetailModelSection />
        <BottomCTA onGetDemo={onGetDemo} />
      </main>
      <Footer />
    </div>
  );
}
