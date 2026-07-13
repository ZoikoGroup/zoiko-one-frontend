import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../../components/layout/LandingHeader";
import Footer from "../../components/layout/Footer";

/* ─────────────────────────────────────────────
   DESIGN TOKENS
───────────────────────────────────────────── */
const C = {
  navy: "#0f0e38",
  navyMid: "#1a1960",
  purple: "#3730a3",
  purpleBtn: "#3730a3",
  blue: "#2563eb",
  blueMid: "#3b82f6",
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
    border-radius: 16px;
    padding: 28px 26px 24px;
    transition: box-shadow 0.2s, transform 0.2s;
    display: flex; flex-direction: column; gap: 10px;
  }
  .product-card:hover {
    box-shadow: 0 8px 32px rgba(55,48,163,0.10);
    transform: translateY(-2px);
  }

  .role-card {
    background: #fff;
    border: 1.5px solid ${C.border};
    border-radius: 16px;
    padding: 26px 22px;
    transition: box-shadow 0.2s;
  }
  .role-card:hover { box-shadow: 0 6px 24px rgba(55,48,163,0.09); }

  .flow-pill {
    display: inline-flex; align-items: center;
    background: #fff; border: 1.5px solid ${C.border};
    border-radius: 50px; padding: 9px 18px;
    font-size: 13px; font-weight: 500; color: ${C.textDark};
    white-space: nowrap;
  }
  .flow-arrow { color: ${C.orange}; font-size: 16px; font-weight: 800; margin: 0 2px; flex-shrink: 0; }

  .explore-link {
    font-size: 13px; font-weight: 600; color: ${C.purple};
    cursor: pointer; display: inline-flex; align-items: center; gap: 4px;
    transition: gap 0.15s;
  }
  .explore-link:hover { gap: 8px; }
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
      { threshold: 0.1 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [delay]);
  return ref;
}

/* ─────────────────────────────────────────────
   ICON COMPONENTS  (inline SVG squares)
───────────────────────────────────────────── */
function IconBox({ bg, children, size = 46 }) {
  return (
    <div style={{
      width: size, height: size, borderRadius: "12px",
      background: bg, display: "flex",
      alignItems: "center", justifyContent: "center",
      flexShrink: 0,
    }}>
      {children}
    </div>
  );
}

/* grid icon */
const GridSVG = ({ color = "#fff" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="7" height="7" rx="1" fill={color} opacity="0.9"/>
    <rect x="14" y="3" width="7" height="7" rx="1" fill={color} opacity="0.9"/>
    <rect x="3" y="14" width="7" height="7" rx="1" fill={color} opacity="0.9"/>
    <rect x="14" y="14" width="7" height="7" rx="1" fill={color} opacity="0.9"/>
  </svg>
);
const ClockSVG = ({ color = "#fff" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <circle cx="12" cy="12" r="9"/>
    <polyline points="12 7 12 12 15.5 15.5"/>
  </svg>
);
const InvoiceSVG = ({ color = "#fff" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <rect x="4" y="2" width="16" height="20" rx="2"/>
    <line x1="8" y1="8" x2="16" y2="8"/>
    <line x1="8" y1="12" x2="16" y2="12"/>
    <line x1="8" y1="16" x2="13" y2="16"/>
  </svg>
);
const SpendSVG = ({ color = "#fff" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <rect x="2" y="7" width="20" height="14" rx="2"/>
    <path d="M16 7V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v2"/>
    <line x1="12" y1="12" x2="12" y2="16"/>
    <line x1="10" y1="14" x2="14" y2="14"/>
  </svg>
);
const DocSVG = ({ color = "#fff" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/>
    <polyline points="14 2 14 8 20 8"/>
    <line x1="8" y1="13" x2="16" y2="13"/>
    <line x1="8" y1="17" x2="13" y2="17"/>
  </svg>
);
const ChartSVG = ({ color = "#fff" }) => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2.2" strokeLinecap="round">
    <line x1="18" y1="20" x2="18" y2="10"/>
    <line x1="12" y1="20" x2="12" y2="4"/>
    <line x1="6" y1="20" x2="6" y2="14"/>
    <line x1="2" y1="20" x2="22" y2="20"/>
  </svg>
);

/* role icons */
const CrownSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M3 17l3-7 4.5 4.5L12 7l1.5 7.5L18 10l3 7H3z"/>
  </svg>
);
const GearSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"/>
    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>
  </svg>
);
const DollarSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.2" strokeLinecap="round">
    <line x1="12" y1="2" x2="12" y2="22"/>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
  </svg>
);
const HandSVG = () => (
  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v0"/>
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v2"/>
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2 2v8"/>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>
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
          <span style={{ fontSize: "13px", fontWeight: "500", color: C.textMid }}>For agencies</span>
        </div>

        {/* headline */}
        <h1 style={{
          fontSize: "clamp(34px, 5vw, 56px)",
          fontWeight: "800", lineHeight: "1.13",
          color: C.navy, maxWidth: "1100px",
          letterSpacing: "-1.5px", marginBottom: "32px",
        }}>
          Agency operations software for client work,&nbsp; time, billing, and{" "}
          <span style={{ color: C.orange }}>margin control.</span>
        </h1>

        {/* sub */}
        <p style={{
          fontSize: "16px", color: C.textMuted,
          lineHeight: "1.7", maxWidth: "960px",
          margin: "0 auto 44px",
        }}>
          Zoiko One helps agencies manage client projects, team capacity, approved time, tasks, milestones, documents, approvals, billing readiness, vendor spend and performance visibility — from one connected platform.
        </p>

        {/* buttons */}
        <div style={{ display: "flex", gap: "14px", flexWrap: "wrap", justifyContent: "center" }}>
          <button className="btn-orange" onClick={onGetDemo}>Get a Demo &nbsp;→</button>
          <button className="btn-outline-dark">Request Agency Pricing</button>
          <button className="btn-outline-dark">Explore Project-to-Cash</button>
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
    iconBg: "#2196f3",
    icon: <GridSVG />,
    title: "Zoiko Projects",
    desc: "Plan client projects, manage tasks, assign resources, track milestones and budgets, and connect work to billing readiness.",
    link: "Explore Zoiko Projects →",
  },
  {
    iconBg: C.purple,
    icon: <ClockSVG />,
    title: "ZoikoTime",
    desc: "Track approved time, billable work, utilization, exceptions and work evidence — ready for payroll and billing.",
    link: "Explore ZoikoTime →",
  },
  {
    iconBg: C.orange,
    icon: <InvoiceSVG />,
    title: "Zoiko Billing",
    desc: "Turn billable work into invoices, subscriptions and revenue records with approvals.",
    link: "Explore Zoiko Billing →",
  },
  {
    iconBg: C.orange,
    icon: <SpendSVG />,
    title: "Zoiko Spend",
    desc: "Control vendor and freelancer spend tied to client projects.",
    link: "Explore Zoiko Spend →",
  },
  {
    iconBg: C.orange,
    icon: <DocSVG />,
    title: "Zoiko Docs Pro",
    desc: "Client documents from approved templates — a premium Documents-layer capability.",
    link: "Explore Docs Pro →",
  },
  {
    iconBg: "#312e81",
    icon: <ChartSVG />,
    title: "Zoiko Insights",
    desc: "See client profitability, utilization and agency health in real time.",
    link: "Explore Zoiko Insights →",
  },
];

function ProblemSection() {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{ background: "#fff", padding: "100px 24px" }}>
      <div style={{ maxWidth: "800px", margin: "0 auto", textAlign: "center" }}>
        <span className="section-label" style={{ color: C.purple }}>THE PROBLEM</span>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800",
          color: C.navy, letterSpacing: "-1.2px", lineHeight: "1.18",
          marginBottom: "22px",
        }}>
          Agencies lose margin when delivery, time, billing and scope live in separate tools.
        </h2>
        <p style={{
          fontSize: "15px", color: C.textMuted, lineHeight: "1.7",
          maxWidth: "580px", margin: "0 auto 56px",
        }}>
          When briefs, tasks, time, approvals, billing and margin reporting are scattered, agencies lose billable work, miss risks and struggle to see profitability clearly.
        </p>
      </div>

      <div style={{
        maxWidth: "1040px", margin: "0 auto",
        display: "grid",
        gridTemplateColumns: "repeat(3, 1fr)",
        gap: "18px",
      }}>
        {products.map((p) => (
          <div key={p.title} className="product-card">
            <IconBox bg={p.iconBg}>{p.icon}</IconBox>
            <div style={{ fontSize: "15px", fontWeight: "700", color: C.navy, marginTop: "6px" }}>{p.title}</div>
            <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: "1.6", flex: 1 }}>{p.desc}</div>
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
    label: "Brief → Project",
    steps: ["Client brief", "Scope & owners", "Tasks & milestones", "Documents", "Approvals", "Delivery"],
  },
  {
    label: "Project → Cash",
    steps: ["Project", "Approved time", "Milestones", "Billing readiness", "Invoice", "Margin reporting"],
  },
];

function FlowRow({ steps }) {
  return (
    <div style={{
      background: "#fff", border: `1.5px solid ${C.border}`,
      borderRadius: "16px", padding: "22px 28px",
      display: "flex", alignItems: "center",
      flexWrap: "wrap", gap: "8px",
    }}>
      {steps.map((step, i) => (
        <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
          <span className="flow-pill">{step}</span>
          {i < steps.length - 1 && <span className="flow-arrow">→</span>}
        </div>
      ))}
    </div>
  );
}

function WorkflowsSection() {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{ background: C.offWhite, padding: "100px 24px" }}>
      <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span className="section-label" style={{ color: C.orange }}>CORE AGENCY WORKFLOWS</span>
          <h2 style={{
            fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800",
            color: C.navy, letterSpacing: "-1px",
          }}>
            From brief to cash.
          </h2>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
          {workflows.map((wf) => (
            <div key={wf.label}>
              <div style={{
                fontSize: "13px", fontWeight: "600",
                color: C.textMid, marginBottom: "12px", paddingLeft: "4px",
              }}>
                {wf.label}
              </div>
              <FlowRow steps={wf.steps} />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   SECTION 4 — BY ROLE
───────────────────────────────────────────── */
const roles = [
  {
    iconBg: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    icon: <CrownSVG />,
    title: "Agency owner / CEO",
    desc: "Client profitability, utilization, revenue, risk and agency health.",
  },
  {
    iconBg: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    icon: <GearSVG />,
    title: "Ops / MD",
    desc: "Project load, team capacity, bottlenecks and delivery risk.",
  },
  {
    iconBg: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    icon: <DollarSVG />,
    title: "Finance",
    desc: "Billing readiness, revenue, spend and approvals.",
  },
  {
    iconBg: "linear-gradient(135deg, #2563eb 0%, #1e40af 100%)",
    icon: <HandSVG />,
    title: "Delivery leads",
    desc: "Tasks, time, milestones and client feedback.",
  },
];

function ByRoleSection() {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{ background: "#fff", padding: "100px 24px" }}>
      <div style={{ maxWidth: "1040px", margin: "0 auto" }}>
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span className="section-label" style={{ color: C.cyan }}>BY ROLE</span>
          <h2 style={{
            fontSize: "clamp(26px, 4vw, 40px)", fontWeight: "800",
            color: C.navy, letterSpacing: "-1px",
          }}>
            Value for every part of the agency.
          </h2>
        </div>

        <div style={{
          display: "grid",
          gridTemplateColumns: "repeat(4, 1fr)",
          gap: "18px",
        }}>
          {roles.map((r) => (
            <div key={r.title} className="role-card">
              <div style={{
                width: 46, height: 46, borderRadius: "12px",
                background: r.iconBg,
                display: "flex", alignItems: "center", justifyContent: "center",
                marginBottom: "16px",
              }}>
                {r.icon}
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: C.navy, marginBottom: "8px" }}>
                {r.title}
              </div>
              <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: "1.6" }}>
                {r.desc}
              </div>
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
      background: C.offWhite, padding: "20px 24px 80px",
    }}>
      <div style={{
        maxWidth: "880px", margin: "0 auto",
        background: "linear-gradient(135deg, #7c3aed 0%, #4f46e5 30%, #2563eb 65%, #1d8ef5 100%)",
        borderRadius: "24px",
        padding: "64px 48px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        {/* blob */}
        <div style={{
          position: "absolute", top: "-50px", left: "-50px",
          width: "220px", height: "220px",
          background: "rgba(180,100,255,0.28)",
          borderRadius: "50%", filter: "blur(55px)",
          pointerEvents: "none",
        }} />

        <h2 style={{
          fontSize: "clamp(22px, 4vw, 36px)", fontWeight: "800",
          color: "#fff", letterSpacing: "-0.8px",
          lineHeight: "1.2", marginBottom: "18px",
          position: "relative",
        }}>
          Deliver client work and protect margin.
        </h2>
        <p style={{
          fontSize: "15px", color: "rgba(255,255,255,0.75)",
          lineHeight: "1.65", marginBottom: "36px",
          maxWidth: "400px", margin: "0 auto 36px",
          position: "relative",
        }}>
          Connect projects, time, billing, spend and insights in one agency platform.
        </p>
        <div style={{
          display: "flex", gap: "14px",
          justifyContent: "center", flexWrap: "wrap",
          position: "relative",
        }}>
          <button className="btn-orange" onClick={onGetDemo}>Get a Demo</button>
          <button className="btn-ghost-white">Request Agency Pricing</button>
          <button className="btn-ghost-white">All Solutions</button>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────
   ROOT
───────────────────────────────────────────── */
export default function ZoikoAgenciesPage() {
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
        <ByRoleSection />
        <BottomCTA onGetDemo={onGetDemo} />
      </main>
      <Footer />
    </div>
  );
}
