import { useState } from "react";
import { useNavigate } from "react-router-dom";
import LandingHeader from "../../landing/LandingHeader";
import Footer from "../../landing/Footer";

// ─── Color tokens ─────────────────────────────────────────────────────────────
const BG          = "#E8E9EE";   // warm silver-grey page bg
const BLUE_DARK   = "#192660";   // deep navy headings
const BLUE_ACCENT = "#2040CC";   // royal blue
const BLUE_MID    = "#2B4ACB";   // mid blue icon boxes
const BLUE_DEEP   = "#172158";   // darkest navy (ecosystem section bg)
const BLUE_CARD   = "#1E3AB8";   // ecosystem sibling cards bg
const BLUE_TEAL   = "#3BADD4";   // teal / global-ready icon
const ORANGE      = "#E07B2A";   // orange CTAs / accents
const TEXT_MID    = "#3D4A6B";   // body
const TEXT_MUTED  = "#6B7280";   // muted
const BORDER      = "#D8DAE5";
const FF          = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

// ─── Shared helpers ───────────────────────────────────────────────────────────
const wrap = { padding: "80px 6vw", background: BG, fontFamily: FF };

const eyebrow = (color = ORANGE) => ({
  fontSize: "11px", fontWeight: "700", letterSpacing: "0.14em",
  textTransform: "uppercase", color, margin: "0 0 14px 0", display: "block",
});

const h2Style = {
  fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "800",
  color: BLUE_DARK, lineHeight: "1.12", margin: "0 0 16px 0", letterSpacing: "-0.5px",
};

const bodyText = { fontSize: "15px", color: TEXT_MID, lineHeight: "1.7", margin: 0 };

const whiteCard = {
  background: "white", borderRadius: "16px",
  border: `1px solid ${BORDER}`, padding: "24px",
};

const iconBox = (bg, size = 52) => ({
  width: `${size}px`, height: `${size}px`, borderRadius: "14px",
  background: bg, display: "flex", alignItems: "center",
  justifyContent: "center", flexShrink: 0,
});

const ghostBtnWhite = {
  padding: "13px 26px", borderRadius: "50px",
  border: "1.5px solid rgba(255,255,255,0.35)",
  background: "rgba(255,255,255,0.12)",
  color: "white", fontSize: "14px", fontWeight: "600",
  cursor: "pointer", fontFamily: FF,
};

function Badge({ label, tag = "About" }) {
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 8, background: "rgba(255,255,255,0.92)", borderRadius: 999, padding: "6px 16px", marginBottom: 28, fontSize: 14, fontWeight: 500, boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}>
      <span style={{ background: "#3B5BDB", color: "#fff", borderRadius: 999, padding: "2px 10px", fontSize: 12, fontWeight: 700 }}>{tag}</span>
      <span style={{ color: "#555" }}>{label}</span>
    </div>
  );
}

// ─── 1. HERO ──────────────────────────────────────────────────────────────────
function HeroSection() {
  const navigate = useNavigate();
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
      <div style={{ position: "relative", zIndex: 1, maxWidth: 900 }}>
        <Badge label="Part of the Zoiko Business Ecosystem" />
        <h1 style={{
          fontSize: "clamp(32px,5vw,56px)", fontWeight: 800,
          lineHeight: 1.1, color: "#0B1C3F",
          margin: "0 auto 20px", maxWidth: "1000px",
        }}>
          We connect the systems a<br />
          business <span style={{ color: "#E8850A" }}>runs on.</span>
        </h1>
        <p style={{
          fontSize: "16px", lineHeight: 1.7, color: "#4B5563",
          margin: "0 auto 12px", maxWidth: "700px",
        }}>
          Zoiko One is a connected business-operations platform for running people, money, work,
          supply and control on one governed spine — nine core products plus Zoiko Docs Pro,
          a premium Documents-layer capability.
        </p>
        <div style={{ display: "flex", gap: "14px", justifyContent: "center", flexWrap: "wrap", marginTop: "28px" }}>
          <button onClick={() => navigate("/get-demo")} style={{
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

// ─── 2. WHAT WE BELIEVE ──────────────────────────────────────────────────────
const beliefs = [
  {
    bg: ORANGE,     emoji: "◎",
    title: "Modular",
    desc: "Start with one product; expand when ready.",
  },
  {
    bg: BLUE_MID,   emoji: "⇄",
    title: "Connected",
    desc: "Work moves across products without re-entry.",
  },
  {
    bg: BLUE_DEEP,  emoji: "✓",
    title: "Governed",
    desc: "Approvals, permissions and evidence built in.",
  },
  {
    bg: BLUE_TEAL,  emoji: "🌐",
    title: "Global-ready",
    desc: "Jurisdiction-specific configuration.",
  },
];

function WhatWeBelieve() {
  return (
    <section style={{ ...wrap, paddingTop: "20px" }}>
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "48px", alignItems: "center",
      }}>
        {/* Left: text */}
        <div>
          <span style={eyebrow(BLUE_ACCENT)}>WHAT WE BELIEVE</span>
          <h2 style={{ ...h2Style, fontSize: "clamp(26px, 3.5vw, 40px)" }}>
            Essential workflows should be easy to adopt and governed where it matters.
          </h2>
          <p style={{ ...bodyText, marginBottom: "28px" }}>
            Modern businesses run across more systems than ever — yet most don't talk to each other.
            Zoiko One exists to close the operating gap between departments by connecting data,
            approvals, documents, workflows and evidence on one shared spine.
          </p>
          <button style={{
            padding: "13px 26px", borderRadius: "50px", border: "none",
            background: BLUE_DEEP, color: "white", fontSize: "14px",
            fontWeight: "700", cursor: "pointer", fontFamily: FF,
          }}>Why Zoiko One →</button>
        </div>

        {/* Right: 2×2 belief cards */}
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
          {beliefs.map(({ bg, emoji, title, desc }) => (
            <div key={title} style={{ ...whiteCard, display: "flex", flexDirection: "column", gap: "12px" }}>
              <div style={iconBox(bg, 52)}>
                <span style={{ color: "white", fontSize: "22px", fontWeight: "700" }}>{emoji}</span>
              </div>
              <h3 style={{ fontSize: "16px", fontWeight: "800", color: BLUE_DARK, margin: 0 }}>{title}</h3>
              <p style={{ fontSize: "13px", color: TEXT_MID, margin: 0, lineHeight: "1.6" }}>{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── 3. THE MODEL: Five Pillars ───────────────────────────────────────────────
const pillars = [
  {
    bg: BLUE_MID,  emoji: "👥", eyebrowC: BLUE_ACCENT,
    label: "PEOPLE", name: "People",
    tags: ["HR", "Time", "Payroll"],
  },
  {
    bg: ORANGE,    emoji: "$",  eyebrowC: ORANGE,
    label: "MONEY",  name: "Money",
    tags: ["Billing", "Spend"],
  },
  {
    bg: BLUE_TEAL, emoji: "⊞", eyebrowC: BLUE_TEAL,
    label: "WORK",   name: "Work",
    tags: ["Projects"],
  },
  {
    bg: BLUE_ACCENT, emoji: "◉", eyebrowC: BLUE_ACCENT,
    label: "SUPPLY",  name: "Supply",
    tags: ["Inventory"],
  },
  {
    bg: BLUE_DEEP, emoji: "✓", eyebrowC: TEXT_MUTED,
    label: "CONTROL", name: "Control",
    tags: ["Comply", "Insights"],
  },
];

const pillTag = {
  display: "inline-block", padding: "4px 10px", borderRadius: "20px",
  background: "rgba(32,64,204,0.08)", color: BLUE_ACCENT,
  fontSize: "11px", fontWeight: "600",
  border: `1px solid rgba(32,64,204,0.18)`,
};

function FivePillars() {
  return (
    <section style={{ ...wrap, paddingTop: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span style={eyebrow(ORANGE)}>THE MODEL</span>
        <h2 style={h2Style}>Five pillars. Nine products. One platform.</h2>
        <p style={{ ...bodyText, maxWidth: "500px", margin: "0 auto" }}>
          Every product belongs to a pillar and shares the same spine. Zoiko Docs Pro is a
          premium capability across all pillars.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
        {pillars.map(({ bg, emoji, eyebrowC, label, name, tags }) => (
          <div key={name} style={{ ...whiteCard, display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={iconBox(bg, 56)}>
              <span style={{ color: "white", fontSize: "24px", fontWeight: "700" }}>{emoji}</span>
            </div>
            <div>
              <span style={{
                fontSize: "10px", fontWeight: "700", letterSpacing: "0.12em",
                textTransform: "uppercase", color: eyebrowC, display: "block", marginBottom: "4px",
              }}>{label}</span>
              <h3 style={{ fontSize: "22px", fontWeight: "800", color: BLUE_DARK, margin: 0 }}>{name}</h3>
            </div>
            <div style={{ display: "flex", flexWrap: "wrap", gap: "6px" }}>
              {tags.map(t => <span key={t} style={pillTag}>{t}</span>)}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── 4. ECOSYSTEM (dark blue section) ────────────────────────────────────────
const ecosystem = [
  { letter: "V", name: "ZoikoVertex", desc: "Gets customers — marketing & growth." },
  { letter: "S", name: "ZoikoSuite",  desc: "Keeps the books — accounting." },
  { letter: "Se",name: "Zoiko Sema",  desc: "Communication & collaboration." },
  { letter: "L", name: "Zoiko Local", desc: "Calling & global communication." },
  { letter: "D", name: "Zoiko Digital",desc: "Digitization & transformation." },
];

function Ecosystem() {
  return (
    <section style={{ padding: "0 6vw 80px", background: BG, fontFamily: FF }}>
      <div style={{
        background: `linear-gradient(145deg, ${BLUE_DEEP} 0%, #1E3AB8 50%, #2040CC 100%)`,
        borderRadius: "24px",
        padding: "64px 56px",
        position: "relative", overflow: "hidden",
      }}>
        {/* Decorative dot-grid overlay */}
        <div style={{
          position: "absolute", inset: 0,
          backgroundImage: `radial-gradient(circle, rgba(255,255,255,0.07) 1px, transparent 1px)`,
          backgroundSize: "28px 28px",
          pointerEvents: "none",
        }} />

        <div style={{ position: "relative", zIndex: 1 }}>
          <div style={{ textAlign: "center", marginBottom: "44px" }}>
            <span style={eyebrow(ORANGE)}>THE ZOIKO BUSINESS ECOSYSTEM</span>
            <h2 style={{
              fontSize: "clamp(28px, 4vw, 46px)", fontWeight: "800",
              color: "white", lineHeight: "1.12", margin: "0 auto 14px",
              letterSpacing: "-0.5px", maxWidth: "600px",
            }}>
              Zoiko One runs operations. The ecosystem does the rest.
            </h2>
            <p style={{ fontSize: "14px", color: "rgba(255,255,255,0.6)", margin: 0 }}>
              Ecosystem siblings — not Zoiko One products.
            </p>
          </div>

          {/* Sibling cards */}
          <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "14px" }}>
            {ecosystem.map(({ letter, name, desc }) => (
              <div key={name} style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.14)",
                borderRadius: "14px", padding: "20px",
                display: "flex", flexDirection: "column", gap: "10px",
              }}>
                {/* Avatar */}
                <div style={{
                  width: "36px", height: "36px", borderRadius: "10px",
                  background: "rgba(255,255,255,0.15)",
                  display: "flex", alignItems: "center", justifyContent: "center",
                  color: "white", fontSize: "13px", fontWeight: "800",
                }}>{letter}</div>
                <h4 style={{ fontSize: "14px", fontWeight: "800", color: "white", margin: 0 }}>{name}</h4>
                <p style={{ fontSize: "12px", color: "rgba(255,255,255,0.6)", margin: 0, lineHeight: "1.5" }}>{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── 5. TRUST & GOVERNANCE ────────────────────────────────────────────────────
const trustItems = [
  {
    bg: BLUE_TEAL, emoji: "🔒",
    title: "Security",
    desc: "Access control, encryption, monitoring and secure development.",
  },
  {
    bg: BLUE_DEEP, emoji: "🔑",
    title: "Permissions",
    desc: "Role-based access across teams, departments and entities.",
  },
  {
    bg: BLUE_MID,  emoji: "▣",
    title: "Audit & evidence",
    desc: "Decision trails, approval history and activity records.",
  },
  {
    bg: ORANGE,    emoji: "◎",
    title: "Reliability",
    desc: "Availability, status and incident communication.",
  },
];

function TrustGovernance() {
  return (
    <section style={{ ...wrap, paddingTop: "20px" }}>
      <div style={{ textAlign: "center", marginBottom: "48px" }}>
        <span style={eyebrow(BLUE_TEAL)}>TRUST & GOVERNANCE</span>
        <h2 style={h2Style}>Built for business-critical workflows.</h2>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "18px" }}>
        {trustItems.map(({ bg, emoji, title, desc }) => (
          <div key={title} style={{ ...whiteCard, display: "flex", flexDirection: "column", gap: "14px" }}>
            <div style={iconBox(bg, 52)}>
              <span style={{ color: "white", fontSize: "22px" }}>{emoji}</span>
            </div>
            <h3 style={{ fontSize: "16px", fontWeight: "800", color: BLUE_DARK, margin: 0 }}>{title}</h3>
            <p style={{ fontSize: "13px", color: TEXT_MID, margin: 0, lineHeight: "1.6" }}>{desc}</p>
          </div>
        ))}
      </div>

      <p style={{
        textAlign: "center", fontSize: "13px", color: TEXT_MUTED,
        marginTop: "28px", fontStyle: "normal",
      }}>
        Trust Center is published before advertising — every public claim is substantiated.
      </p>
    </section>
  );
}

// ─── 6. BOTTOM CTA BANNER ─────────────────────────────────────────────────────
function BottomCTA() {
  const navigate = useNavigate();
  return (
    <section style={{ ...wrap, paddingTop: "20px", paddingBottom: "80px" }}>
      <div style={{
        background: "linear-gradient(130deg, #2a3db5 0%, #2348d4 45%, #1a7ae0 100%)",
        borderRadius: "24px", padding: "64px 48px",
        textAlign: "center",
        boxShadow: "0 16px 48px rgba(32,64,204,0.35)",
        position: "relative", overflow: "hidden",
      }}>
        {/* concentric rings */}
        {[1,2,3,4,5,6].map(i => (
          <div key={i} style={{
            position: "absolute",
            top: "50%", left: "50%",
            transform: "translate(-50%, -50%)",
            width: `${160 + i * 110}px`,
            height: `${160 + i * 110}px`,
            borderRadius: "50%",
            border: "1px solid rgba(255,255,255,0.055)",
            pointerEvents: "none",
          }} />
        ))}

        <div style={{ position: "relative", zIndex: 1 }}>
          <h2 style={{
            fontSize: "clamp(26px, 3.8vw, 44px)", fontWeight: "800",
            color: "white", margin: "0 0 16px 0", letterSpacing: "-0.5px",
          }}>
            Run the business from one connected platform.
          </h2>
          <p style={{
            fontSize: "15px", color: "rgba(255,255,255,0.78)",
            margin: "0 auto 36px", maxWidth: "480px", lineHeight: "1.7",
          }}>
            Start with one product, one pillar or the full platform — with the confidence to scale.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <button onClick={() => navigate("/get-demo")} style={{
              padding: "14px 28px", borderRadius: "50px", border: "none",
              background: ORANGE, color: "white", fontSize: "15px",
              fontWeight: "700", cursor: "pointer", fontFamily: FF,
              boxShadow: "0 6px 20px rgba(224,123,42,0.5)",
            }}>Get a Demo</button>
            <button style={ghostBtnWhite}>Explore Products</button>
            <button style={ghostBtnWhite}>Request Pricing</button>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── ROOT ─────────────────────────────────────────────────────────────────────
export default function AboutPage() {
  return (
    <div style={{ fontFamily: FF, minHeight: "100vh" }}>
      <LandingHeader />
      <HeroSection />
      <WhatWeBelieve />
      <FivePillars />
      <Ecosystem />
      <TrustGovernance />
      <BottomCTA />
      <Footer />
    </div>
  );
}
