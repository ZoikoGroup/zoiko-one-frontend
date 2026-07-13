import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../../components/layout/LandingHeader";
import Footer from "../../components/layout/Footer";

const C = {
  navy: "#12113a",
  navyMid: "#1a1960",
  purple: "#3d2fa3",
  purpleMid: "#4f3fb8",
  blue: "#3b6ef5",
  blueLight: "#5b8fff",
  orange: "#f5a000",
  orangeBtn: "#f5a623",
  white: "#ffffff",
  offWhite: "#f7f8fc",
  lightGray: "#f0f1f8",
  textDark: "#12113a",
  textMid: "#3b3a6e",
  textMuted: "#6b6a99",
  border: "#e2e4f0",
};

const font = `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif`;

const globalCSS = `
  .btn-orange {
    display: inline-flex; align-items: center; gap: 8px;
    background: ${C.orangeBtn};
    color: #fff; font-weight: 700; font-size: 15px;
    padding: 14px 28px; border-radius: 50px; border: none;
    cursor: pointer; white-space: nowrap;
    box-shadow: 0 4px 18px rgba(245,166,35,0.38);
    transition: transform 0.15s, box-shadow 0.15s;
  }
  .btn-orange:hover { transform: translateY(-1px); box-shadow: 0 6px 24px rgba(245,166,35,0.5); }

  .btn-outline {
    display: inline-flex; align-items: center; gap: 8px;
    background: transparent;
    color: ${C.textDark}; font-weight: 600; font-size: 15px;
    padding: 13px 28px; border-radius: 50px;
    border: 1.5px solid ${C.border};
    cursor: pointer; white-space: nowrap;
    transition: border-color 0.15s, background 0.15s;
  }
  .btn-outline:hover { border-color: ${C.purpleMid}; background: #f4f3ff; }

  .btn-ghost-white {
    display: inline-flex; align-items: center;
    background: rgba(255,255,255,0.15);
    color: #fff; font-weight: 600; font-size: 15px;
    padding: 13px 26px; border-radius: 50px;
    border: 1.5px solid rgba(255,255,255,0.25);
    cursor: pointer; white-space: nowrap;
    transition: background 0.15s;
  }
  .btn-ghost-white:hover { background: rgba(255,255,255,0.25); }

  .section-label {
    font-size: 11px; font-weight: 700;
    letter-spacing: 2px; text-transform: uppercase;
    margin-bottom: 18px;
  }

  .fade-in {
    opacity: 0; transform: translateY(24px);
    transition: opacity 0.6s ease, transform 0.6s ease;
  }
  .fade-in.visible { opacity: 1; transform: translateY(0); }

  .faq-item {
    border: 1.5px solid ${C.border};
    border-radius: 14px;
    overflow: hidden;
    margin-bottom: 14px;
    background: #fff;
  }
  .faq-q {
    width: 100%; background: none; border: none;
    padding: 22px 24px; display: flex;
    justify-content: space-between; align-items: center;
    font-size: 15px; font-weight: 600; color: ${C.textDark};
    cursor: pointer; text-align: left;
    font-family: ${font};
  }
  .faq-chevron {
    width: 28px; height: 28px; border-radius: 50%;
    background: #f0f1f8; display: flex;
    align-items: center; justify-content: center;
    flex-shrink: 0; transition: transform 0.3s;
    color: ${C.textMid};
  }
  .faq-chevron.open { transform: rotate(180deg); }
  .faq-answer {
    max-height: 0; overflow: hidden;
    transition: max-height 0.35s ease, padding 0.35s ease;
    padding: 0 24px;
    font-size: 14px; color: ${C.textMuted}; line-height: 1.65;
  }
  .faq-answer.open { max-height: 200px; padding: 0 24px 20px; }

  .flow-step {
    display: flex; align-items: center;
    background: #fff; border: 1.5px solid ${C.border};
    border-radius: 50px; padding: 10px 20px;
    font-size: 14px; font-weight: 500; color: ${C.textDark};
    white-space: nowrap;
  }
  .flow-arrow {
    color: ${C.orange}; font-size: 18px;
    font-weight: 700; margin: 0 4px;
    flex-shrink: 0;
  }
`;

function useFadeIn() {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { el.classList.add("visible"); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return ref;
}

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
        <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "6px 16px", marginBottom: 28, fontSize: 14, fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
          <span style={{ background: "#1E2A8C", color: "#fff", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>Control</span>
          <span style={{ color: "#555" }}>Zoiko Insights</span>
        </div>

        <h1 style={{
          fontSize: "clamp(32px,5vw,56px)", fontWeight: 800, lineHeight: 1.1,
          color: "#0B1C3F", margin: "0 auto 20px", letterSpacing: "-0.02em",
          maxWidth: 1100,
        }}>
          Business intelligence software for connected{" "}
          <span style={{ color: "#E8850A" }}>operations.</span>
        </h1>

        <p style={{
          fontSize: "16px", lineHeight: 1.7, color: "#4B5563",
          margin: "0 auto 28px", maxWidth: 900,
        }}>
          See performance, risk, revenue, payroll, spend, projects, inventory, compliance, approvals, exceptions and business health across Zoiko One — without manual reconciliation.
        </p>

        <div style={{ display: "flex", gap: 14, justifyContent: "center", flexWrap: "wrap" }}>
          <button onClick={onGetDemo} style={{
            background: "linear-gradient(135deg, #FF8800, #FF5500)",
            color: "#fff", border: "none", borderRadius: 999,
            padding: "14px 32px", fontSize: 16, fontWeight: 700, cursor: "pointer",
            display: "flex", alignItems: "center", gap: 8,
            boxShadow: "0 4px 16px rgba(255,85,0,0.45)",
          }}>
            Get a Demo <span style={{ fontSize: 18 }}>→</span>
          </button>
          <button style={{
            background: "rgba(255,255,255,0.75)", color: "#1a1a2e",
            border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 999,
            padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}>
            Request Insights Pricing
          </button>
          <button style={{
            background: "rgba(255,255,255,0.75)", color: "#1a1a2e",
            border: "1.5px solid rgba(0,0,0,0.12)", borderRadius: 999,
            padding: "14px 32px", fontSize: 16, fontWeight: 600, cursor: "pointer",
            backdropFilter: "blur(4px)",
          }}>
            See Control Pillar
          </button>
        </div>
      </div>
    </section>
  );
}

const dashCards = [
  {
    icon: "👥", iconBg: C.purple,
    title: "People dashboards",
    desc: "HR, time, payroll readiness, attendance, approved hours and workforce exceptions.",
  },
  {
    icon: "$", iconBg: C.orange,
    title: "Money dashboards",
    desc: "Revenue, billing, spend, vendor activity, approvals and exceptions.",
  },
  {
    icon: "▦", iconBg: "#2196f3",
    title: "Work & supply dashboards",
    desc: "Project margin, utilization, inventory health and reorder signals.",
  },
];

function ProblemSection() {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{
      background: "#fff", padding: "100px 24px",
    }}>
      <div style={{ maxWidth: "780px", margin: "0 auto", textAlign: "center" }}>
        <div className="section-label" style={{ color: C.purple }}>THE PROBLEM WE SOLVE</div>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 44px)", fontWeight: "800",
          color: C.navy, letterSpacing: "-1px", lineHeight: "1.2",
          marginBottom: "24px",
        }}>
          Leaders can't act clearly when business data is scattered.
        </h2>
        <p style={{
          fontSize: "15px", color: C.textMuted, lineHeight: "1.7",
          maxWidth: "560px", margin: "0 auto 56px",
        }}>
          Separate HR systems, time tools, billing apps, spend records, project boards, inventory spreadsheets and compliance folders force leadership to interpret performance from delayed, incomplete or manually reconciled information.
        </p>
      </div>

      <div style={{
        maxWidth: "1000px", margin: "0 auto",
        display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
        gap: "20px",
      }}>
        {dashCards.map((card) => (
          <div key={card.title} style={{
            background: "#fff", border: `1.5px solid ${C.border}`,
            borderRadius: "18px", padding: "28px 26px",
          }}>
            <div style={{
              width: "44px", height: "44px", borderRadius: "12px",
              background: card.iconBg, display: "flex",
              alignItems: "center", justifyContent: "center",
              fontSize: "20px", color: "#fff", marginBottom: "20px",
              fontWeight: "700",
            }}>
              {card.icon}
            </div>
            <div style={{ fontSize: "15px", fontWeight: "700", color: C.navy, marginBottom: "10px" }}>
              {card.title}
            </div>
            <div style={{ fontSize: "13px", color: C.textMuted, lineHeight: "1.6" }}>
              {card.desc}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

const flowSteps = ["Operational activity", "Workflow events", "Approved records", "Dashboards", "Trends", "Decisions"];

function HowItWorks() {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{
      background: C.offWhite, padding: "100px 24px",
    }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", textAlign: "center" }}>
        <div className="section-label" style={{ color: C.orange }}>HOW IT WORKS</div>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800",
          color: C.navy, letterSpacing: "-1px", lineHeight: "1.2",
          marginBottom: "52px",
        }}>
          Operational activity becomes decisions.
        </h2>

        <div style={{
          background: "#fff", borderRadius: "18px",
          border: `1.5px solid ${C.border}`,
          padding: "28px 32px",
          display: "flex", alignItems: "center",
          justifyContent: "center", flexWrap: "wrap",
          gap: "8px", marginBottom: "28px",
        }}>
          {flowSteps.map((step, i) => (
            <div key={step} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <span className="flow-step">{step}</span>
              {i < flowSteps.length - 1 && (
                <span className="flow-arrow">→</span>
              )}
            </div>
          ))}
        </div>

        <p style={{ fontSize: "13px", color: C.textMuted, lineHeight: "1.6" }}>
          Dashboards, reports, filters, exports and AI summaries respect roles, product access, entity boundaries and administrative controls.
        </p>
      </div>
    </section>
  );
}

const faqs = [
  {
    q: "Where does Insights get its data?",
    a: "Zoiko Insights pulls live data directly from all Zoiko One products — HR, payroll, billing, spend, projects, inventory, compliance, and more — with no manual exports or third-party connectors needed.",
  },
  {
    q: "Does it respect permissions?",
    a: "Yes. Every dashboard, report, filter and export respects existing role definitions, product access levels, entity boundaries and administrative controls set inside Zoiko One.",
  },
  {
    q: "What does AI assistance do here?",
    a: "AI summaries surface patterns, flag exceptions and translate raw metrics into plain-language observations — so leaders can act without deep data-analysis skills.",
  },
];

function FAQ() {
  const [open, setOpen] = useState(null);
  const ref = useFadeIn();

  return (
    <section ref={ref} className="fade-in" style={{
      background: "#fff", padding: "100px 24px",
    }}>
      <div style={{ maxWidth: "680px", margin: "0 auto", textAlign: "center" }}>
        <div className="section-label" style={{ color: C.purple }}>ZOIKO INSIGHTS FAQS</div>
        <h2 style={{
          fontSize: "clamp(28px, 4vw, 42px)", fontWeight: "800",
          color: C.navy, letterSpacing: "-1px",
          marginBottom: "48px",
        }}>
          Common questions.
        </h2>

        <div style={{ textAlign: "left" }}>
          {faqs.map((faq, i) => (
            <div key={i} className="faq-item">
              <button
                className="faq-q"
                onClick={() => setOpen(open === i ? null : i)}
                aria-expanded={open === i}
              >
                {faq.q}
                <span className={`faq-chevron${open === i ? " open" : ""}`}>
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                    <polyline points="6 9 12 15 18 9"/>
                  </svg>
                </span>
              </button>
              <div className={`faq-answer${open === i ? " open" : ""}`}>
                {faq.a}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function BottomCTA({ onGetDemo }) {
  const ref = useFadeIn();
  return (
    <section ref={ref} className="fade-in" style={{
      background: "#fff", padding: "20px 24px 80px",
    }}>
      <div style={{
        maxWidth: "860px", margin: "0 auto",
        background: `linear-gradient(135deg, #6930c3 0%, #4f46e5 35%, #3b6ef5 70%, #2b8bf5 100%)`,
        borderRadius: "24px",
        padding: "64px 48px",
        textAlign: "center",
        position: "relative", overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: "-60px", left: "-60px",
          width: "240px", height: "240px",
          background: "rgba(180,120,255,0.25)",
          borderRadius: "50%", filter: "blur(60px)",
          pointerEvents: "none",
        }} />

        <h2 style={{
          fontSize: "clamp(24px, 4vw, 38px)", fontWeight: "800",
          color: "#fff", letterSpacing: "-0.8px",
          lineHeight: "1.2", marginBottom: "20px",
          position: "relative",
        }}>
          See the business clearly before you decide.
        </h2>
        <p style={{
          fontSize: "15px", color: "rgba(255,255,255,0.75)",
          lineHeight: "1.65", marginBottom: "36px",
          maxWidth: "420px", margin: "0 auto 36px",
          position: "relative",
        }}>
          One source of operating truth across people, money, work, supply and control.
        </p>
        <div style={{
          display: "flex", gap: "14px",
          justifyContent: "center", flexWrap: "wrap",
          position: "relative",
        }}>
          <button className="btn-orange" onClick={onGetDemo}>Get a Demo</button>
          <button className="btn-ghost-white">Request Pricing</button>
          <button className="btn-ghost-white">See Control Pillar</button>
        </div>
      </div>
    </section>
  );
}

export default function ZoikoInsightsPage() {
  const navigate = useNavigate();
  const onGetDemo = () => navigate("/get-demo");
  useEffect(() => {
    const style = document.createElement("style");
    style.textContent = globalCSS;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div className="font-sans bg-white text-[#111827] min-h-screen">
      <LandingHeader />
      <main>
        <Hero onGetDemo={onGetDemo} />
        <ProblemSection />
        <HowItWorks />
        <FAQ />
        <BottomCTA onGetDemo={onGetDemo} />
      </main>
      <Footer />
    </div>
  );
}
