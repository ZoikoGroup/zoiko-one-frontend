import { useRef, useState, useEffect } from "react";
import zoikoLogo from "../../assets/ZoikoOne_Icon.svg";
import zoikoFullLogo from "../../assets/logo.png";
import { useNavigate } from "react-router-dom";

const COLORS = {
  navy: "#1E1B4B",
  indigo: "#4F46E5",
  indigoLight: "#EEF2FF",
  orange: "#F97316",
  orange2: "#EA580C",
  purple: "#7C3AED",
  purpleLight: "#EDE9FE",
  blue: "#2563EB",
  green: "#10B981",
  greenLight: "#D1FAE5",
  amber: "#F59E0B",
  amberLight: "#FEF3C7",
  grayText: "#64748B",
  line: "#E7E9F3",
};

function FloatCard({ style, children, padding = "14px" }) {
  return (
    <div
      style={{
        position: "absolute",
        background: "#fff",
        borderRadius: 14,
        border: `1px solid ${COLORS.line}`,
        boxShadow:
          "0 10px 30px -8px rgba(30,27,75,0.14), 0 2px 8px -2px rgba(30,27,75,0.08)",
        padding,
        zIndex: 20,
        boxSizing: "border-box",
        ...style,
      }}
    >
      {children}
    </div>
  );
}

function IconBadge({ bg, children, size = 24 }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: 6,
        background: bg,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        flexShrink: 0,
      }}
    >
      {children}
    </div>
  );
}

function UpArrow({ color, size = 8 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: 2, flexShrink: 0 }}
    >
      <path d="M12 3l8 9h-5v9h-6v-9H4z" fill={color} />
    </svg>
  );
}

function DotIcon({ color, size = 6 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "inline-block", verticalAlign: "middle", marginRight: 3 }}
    >
      <circle cx="12" cy="12" r="12" fill={color} />
    </svg>
  );
}

function CaretDown({ color = "#64748B", size = 8 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      style={{ display: "inline-block", verticalAlign: "middle", marginLeft: 4 }}
    >
      <path d="M5 8l7 8 7-8z" fill={color} />
    </svg>
  );
}

export default function Hero() {
  const navigate = useNavigate();
  const visualRef = useRef(null);
  const [scale, setScale] = useState(1);

  useEffect(() => {
    const el = visualRef.current;
    if (!el) return;
    const ro = new ResizeObserver(([entry]) => {
      setScale(entry.contentRect.width / 800);
    });
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <section
      className="w-full px-6 lg:px-10 pt-4 pb-8 lg:pt-6 lg:pb-10 min-h-[calc(100vh-64px)] xl:h-[calc(100vh-64px)] xl:overflow-hidden flex items-center"
      style={{
        position: "relative",
        backgroundColor: "#f5f4f2",
        background: "linear-gradient(120deg, rgba(255,195,130,0.45) 0%, rgba(250,248,245,0.98) 38%, rgba(250,248,245,0.98) 62%, rgba(170,205,240,0.45) 100%)",
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background: "radial-gradient(ellipse at 12% 55%, rgba(255,175,90,0.25) 0%, transparent 42%), radial-gradient(ellipse at 88% 45%, rgba(140,190,235,0.28) 0%, transparent 42%), radial-gradient(ellipse at 50% 50%, rgba(255,255,255,0.7) 0%, transparent 55%)",
          pointerEvents: "none",
        }}
      />
      <div
        className="hero-grid grid gap-0 items-center"
        style={{
          minWidth: 0,
          position: "relative",
          zIndex: 1,
          gridTemplateColumns: "1fr",
        }}
      >
        <style>{`
          @media (min-width: 1280px) {
            .hero-grid { grid-template-columns: 1fr clamp(600px, 50vw, 900px) !important; }
          }
        `}</style>
        {/* LEFT COLUMN */}
        <div>
            <div
              className="inline-flex items-center gap-2 rounded-full mb-6 mt-12"
              style={{ background: "rgba(255,255,255,0.92)", padding: "6px 16px", boxShadow: "0 1px 4px rgba(0,0,0,0.08)" }}
            >
              <span
                className="text-[12px] font-bold"
                style={{ background: "#3B5BDB", color: "#fff", borderRadius: 999, padding: "2px 10px" }}
              >
                Platform
              </span>
              <span className="text-[13px] font-medium" style={{ color: "#555" }}>
                Nine core products + Docs Pro
              </span>
            </div>

          <h1 className="text-[40px] sm:text-[48px] leading-[1.1] font-extrabold tracking-tight mb-5" style={{ color: COLORS.navy }}>
            Run people, payroll, billing, projects, compliance and insights — in one{" "}
            <span style={{ color: COLORS.indigo }}>connected</span>{" "}
            <span style={{ color: COLORS.orange }}>platform.</span>
          </h1>

          <p className="text-[15px] leading-relaxed mb-8 max-w-[480px]" style={{ color: COLORS.grayText }}>
            Zoiko One connects the work behind every employee, payment, invoice, project and executive
            decision. Start with one product, activate a pillar, or scale into the full platform.
          </p>

          <div className="flex flex-wrap items-center gap-4 mb-8">
            <a
              href="/get-demo"
              onClick={(e) => { e.preventDefault(); navigate("/get-demo"); }}
              className="flex items-center gap-2 text-white text-[15px] font-semibold px-6 py-3 rounded-full"
              style={{ background: COLORS.orange }}
            >
              Get a Demo
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5">
                <path d="M5 12h14M13 6l6 6-6 6" />
              </svg>
            </a>
            <a
              href="#products"
              onClick={(e) => { e.preventDefault(); document.getElementById("products")?.scrollIntoView({ behavior: "smooth" }); }}
              className="text-[15px] font-semibold px-6 py-3 rounded-full border-2"
              style={{ color: COLORS.navy, borderColor: "#DADCEB" }}
            >
              Explore Products
            </a>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <div
              className="flex items-center gap-2 text-[13px] font-medium px-3.5 py-2 rounded-full border"
              style={{ color: COLORS.navy, borderColor: COLORS.line }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.green} strokeWidth="2">
                <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
                <path d="M9 12l2 2 4-4" />
              </svg>
              SOC 2 · ISO 27001 ready
            </div>
            <div
              className="flex items-center gap-2 text-[13px] font-medium px-3.5 py-2 rounded-full border"
              style={{ color: COLORS.navy, borderColor: COLORS.line }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.indigo} strokeWidth="2">
                <circle cx="12" cy="12" r="9" />
                <path d="M3 12h18M12 3a14 14 0 0 1 0 18 14 14 0 0 1 0-18z" />
              </svg>
              Multi-currency · global ready
            </div>
            <div
              className="flex items-center gap-2 text-[13px] font-medium px-3.5 py-2 rounded-full border"
              style={{ color: COLORS.navy, borderColor: COLORS.line }}
            >
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke={COLORS.orange} strokeWidth="2">
                <path d="M3 12h4l2 8 4-16 2 8h6" />
              </svg>
              99.9% uptime commitment
            </div>
          </div>
        </div>

        {/* RIGHT VISUAL */}
        <div className="hidden xl:block" ref={visualRef} style={{ width: "100%", position: "relative", flexShrink: 0, height: 630 * scale }}>
          <div style={{ position: "relative", width: 800, height: 630, overflow: "visible", transformOrigin: "top left", transform: `scale(${scale})` }}>
            {/* Central dashboard mockup */}
            <div
              style={{
                position: "absolute",
                left: 175,
                top: 113,
                width: 450,
                height: 382,
                borderRadius: 22,
                overflow: "hidden",
                display: "flex",
                background: "#fff",
                boxShadow: "0 10px 30px -8px rgba(30,27,75,0.12), 0 2px 8px -2px rgba(30,27,75,0.06)",
                border: `1px solid ${COLORS.line}`,
                zIndex: 10,
              }}
            >
              {/* sidebar */}
              <div
                className="flex flex-col items-center gap-4 py-5"
                style={{ width: 44, background: COLORS.navy }}
              >
                <img src={zoikoLogo} alt="Zoiko One" style={{ width: 24, height: 24, objectFit: "contain" }} />
                <div className="w-2 h-2 rounded-full" style={{ background: "#4b4780" }} />
                <div className="w-5 h-5 rounded flex items-center justify-center" style={{ background: "#312d6b" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                    <circle cx="9" cy="7" r="3" fill="white" fillOpacity="0.9"/>
                    <circle cx="16" cy="7" r="3" fill="white" fillOpacity="0.5"/>
                    <path d="M2 19c0-3.314 3.134-6 7-6s7 2.686 7 6" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none"/>
                    <path d="M16 13c2.5 0 5 1.5 5 5" stroke="white" strokeWidth="2" strokeLinecap="round" fill="none" fillOpacity="0.5"/>
                  </svg>
                </div>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="3" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.9"/>
                  <rect x="13" y="3" width="8" height="8" rx="2" fill="white" fillOpacity="0.5"/>
                  <rect x="3" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.5"/>
                  <rect x="13" y="13" width="8" height="8" rx="2" fill="white" fillOpacity="0.3"/>
                </svg>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="4" y="3" width="13" height="16" rx="2" fill="white" fillOpacity="0.85"/>
                  <rect x="7" y="7" width="7" height="1.5" rx="0.75" fill="#f97316"/>
                  <rect x="7" y="10" width="7" height="1.5" rx="0.75" fill="#f97316"/>
                  <rect x="7" y="13" width="5" height="1.5" rx="0.75" fill="#f97316"/>
                </svg>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5L19 7" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"/>
                </svg>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="3"  y="14" width="4" height="6" rx="1" fill="white" fillOpacity="0.6"/>
                  <rect x="10" y="9"  width="4" height="11" rx="1" fill="white" fillOpacity="0.85"/>
                  <rect x="17" y="5"  width="4" height="15" rx="1" fill="white"/>
                </svg>
                <svg width="11" height="11" viewBox="0 0 24 24" fill="none">
                  <rect x="5" y="3" width="11" height="14" rx="2" fill="white" fillOpacity="0.9"/>
                  <rect x="8" y="7"  width="5" height="1.5" rx="0.75" fill="#f97316"/>
                  <rect x="8" y="10" width="5" height="1.5" rx="0.75" fill="#f97316"/>
                  <rect x="8" y="13" width="3" height="1.5" rx="0.75" fill="#f97316"/>
                  <rect x="13" y="10" width="5" height="8" rx="1.5" fill="#f97316" fillOpacity="0.8"/>
                </svg>
              </div>

              {/* content */}
              <div className="flex-1 flex flex-col">
                {/* top bar */}
                <div
                  className="flex items-center justify-between px-4 py-2.5 border-b"
                  style={{ borderColor: COLORS.line }}
                >
                    <img src={zoikoFullLogo} alt="Zoiko One" style={{ width: 70, height: 70, objectFit: "contain" }} />
                  <div
                    className="hidden sm:flex items-center flex-1 mx-6 max-w-[220px] px-2.5 py-1 rounded-md"
                    style={{ background: "#F4F5FA" }}
                  >
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#9CA0B8" strokeWidth="2">
                      <circle cx="11" cy="11" r="7" />
                      <path d="M21 21l-4-4" />
                    </svg>
                    <span className="text-[10px] ml-1.5" style={{ color: "#9CA0B8" }}>
                      Search across Zoiko One
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#9CA0B8" strokeWidth="2">
                      <circle cx="12" cy="12" r="3" />
                      <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.9 2.9l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.9-2.9l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.6-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.9-2.9l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.6V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.9 2.9l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.6 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.6 1z" />
                    </svg>
                    <div
                      className="w-5 h-5 rounded-full"
                      style={{ background: "linear-gradient(135deg,#8b5cf6,#6366f1)" }}
                    />
                  </div>
                </div>

                {/* body */}
                <div className="flex-1 px-4 py-3 overflow-hidden">
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[12px] font-bold" style={{ color: COLORS.navy }}>
                      Executive Overview
                    </span>
                    <span
                      className="text-[9px] font-medium px-2 py-0.5 rounded border"
                      style={{ color: COLORS.grayText, borderColor: COLORS.line }}
                    >
                      This Month <CaretDown color={COLORS.grayText} size={8} />
                    </span>
                  </div>

                  <div className="grid grid-cols-4 gap-2 mb-3">
                    {[
                      ["Total Revenue", "$8.45M", "16.3%"],
                      ["Total Payroll", "$2.83M", "8.7%"],
                      ["Invoices Collected", "$2.40M", "18.7%"],
                      ["Active Projects", "24", "12%"],
                    ].map(([label, value, pct]) => (
                      <div key={label} className="border rounded-lg px-2 py-1.5" style={{ borderColor: COLORS.line }}>
                        <div className="text-[8px]" style={{ color: COLORS.grayText }}>
                          {label}
                        </div>
                        <div className="text-[12px] font-bold" style={{ color: COLORS.navy }}>
                          {value}
                        </div>
                        <div className="text-[8px] font-semibold flex items-center" style={{ color: COLORS.green }}>
                          <UpArrow color={COLORS.green} /> {pct}
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="grid grid-cols-2 gap-2 mb-3">
                    <div className="border rounded-lg p-2" style={{ borderColor: COLORS.line }}>
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-[8px]" style={{ color: COLORS.grayText }}>
                          Revenue Trend
                        </span>
                        <span className="text-[9px] font-bold" style={{ color: COLORS.navy }}>
                          $8.45M{" "}
                          <span style={{ color: COLORS.green, display: "inline-flex", alignItems: "center" }}>
                            <UpArrow color={COLORS.green} />
                            16.3%
                          </span>
                        </span>
                      </div>
                      <svg viewBox="0 0 200 50" className="w-full h-10">
                        <polyline
                          points="0,40 30,32 60,36 90,20 120,26 150,12 180,18 200,8"
                          fill="none"
                          stroke={COLORS.indigo}
                          strokeWidth="2"
                        />
                      </svg>
                    </div>
                    <div className="border rounded-lg p-2 flex items-center gap-2" style={{ borderColor: COLORS.line }}>
                      <svg viewBox="0 0 32 32" width="42" height="42">
                        <circle r="16" cx="16" cy="16" fill={COLORS.purple} />
                        <path d="M16 16 L16 0 A16 16 0 0 1 30 22 Z" fill={COLORS.indigo} />
                        <path d="M16 16 L30 22 A16 16 0 0 1 8 30 Z" fill={COLORS.blue} />
                        <path d="M16 16 L8 30 A16 16 0 0 1 3 12 Z" fill={COLORS.green} />
                        <circle r="7" cx="16" cy="16" fill="white" />
                      </svg>
                      <div className="text-[7px] leading-[1.6]" style={{ color: COLORS.grayText }}>
                        <div>
                          <DotIcon color={COLORS.purple} /> Payroll 42%
                        </div>
                        <div>
                          <DotIcon color={COLORS.indigo} /> Operations 24%
                        </div>
                        <div>
                          <DotIcon color={COLORS.blue} /> Technology 10%
                        </div>
                        <div>
                          <DotIcon color={COLORS.green} /> Other 6%
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="text-[8px] font-bold mb-1" style={{ color: COLORS.navy }}>
                    Recent Activity
                  </div>
                  <div className="space-y-1">
                    {[
                      ["Invoice INV-2025-1842 · Acme Corporation", "$42,850", "Paid", COLORS.green],
                      ["Payroll Run · May 2025 · Zoiko Solutions Ltd.", "₹2,83,420", "Completed", COLORS.green],
                      ["Project Website Redesign · Design Studio", "72%", "On Track", COLORS.amber],
                      ["Compliance Audit · ISO 27001:2022", "", "In Progress", COLORS.blue],
                    ].map(([desc, amt, status, color]) => (
                      <div
                        key={desc}
                        className="flex items-center justify-between text-[7.5px]"
                        style={{ color: COLORS.navy }}
                      >
                        <span>{desc}</span>
                        <span className="font-semibold">{amt}</span>
                        <span style={{ color }}>{status}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Next Payroll Run */}
            <FloatCard style={{ left: 2, top: 43, width: 148, height: 65 }}>
              <div className="flex items-start gap-2">
                <IconBadge bg={COLORS.purple} size={28}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" />
                    <path d="M16 2v4M8 2v4M3 10h18" />
                  </svg>
                </IconBadge>
                <div>
                  <div className="text-[10px]" style={{ color: COLORS.grayText }}>
                    Next Payroll Run
                  </div>
                  <div className="text-[11px] font-bold" style={{ color: COLORS.navy }}>
                    May 31, 2025
                  </div>
                  <div className="text-[9px] font-semibold" style={{ color: COLORS.green }}>
                    On track
                  </div>
                </div>
              </div>
            </FloatCard>

            {/* People card */}
            <FloatCard style={{ left: 370, top: 8, width: 148, height: 90 }}>
              <div className="flex items-center gap-1.5 mb-2">
                <IconBadge bg={COLORS.purpleLight}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={COLORS.purple} strokeWidth="2">
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
                  </svg>
                </IconBadge>
                <span className="text-[11px] font-semibold" style={{ color: COLORS.navy }}>
                  People
                </span>
              </div>
              <div className="flex items-center -space-x-1.5 mb-1.5">
                <svg className="w-6 h-6 rounded-full border-2 border-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#F4D4B0"/>
                  <circle cx="12" cy="10" r="4.5" fill="#D4A574"/>
                  <circle cx="10.5" cy="9.2" r="0.8" fill="#3D2B1F"/>
                  <circle cx="13.5" cy="9.2" r="0.8" fill="#3D2B1F"/>
                  <path d="M10 12.5 Q12 14 14 12.5" stroke="#C48B6A" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
                  <ellipse cx="12" cy="5.5" rx="5" ry="3" fill="#8B5E3C"/>
                </svg>
                <svg className="w-6 h-6 rounded-full border-2 border-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#C68642"/>
                  <circle cx="12" cy="10" r="4.5" fill="#8D5524"/>
                  <circle cx="10.5" cy="9.2" r="0.8" fill="#2C1810"/>
                  <circle cx="13.5" cy="9.2" r="0.8" fill="#2C1810"/>
                  <path d="M10 12.5 Q12 14 14 12.5" stroke="#6B3A1F" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
                  <ellipse cx="12" cy="5.5" rx="5" ry="3.5" fill="#1A0F0A"/>
                </svg>
                <svg className="w-6 h-6 rounded-full border-2 border-white" viewBox="0 0 24 24">
                  <circle cx="12" cy="12" r="12" fill="#FFE0BD"/>
                  <circle cx="12" cy="10" r="4.5" fill="#E0AC69"/>
                  <circle cx="10.5" cy="9.2" r="0.8" fill="#3D2B1F"/>
                  <circle cx="13.5" cy="9.2" r="0.8" fill="#3D2B1F"/>
                  <path d="M10 12.5 Q12 14 14 12.5" stroke="#D4956A" strokeWidth="0.6" fill="none" strokeLinecap="round"/>
                  <ellipse cx="12" cy="5.5" rx="5" ry="3" fill="#4A3728"/>
                </svg>
                <div
                  className="w-6 h-6 rounded-full border-2 border-white flex items-center justify-center text-[7px] font-bold"
                  style={{ background: "#EEF0F7", color: COLORS.navy }}
                >
                  +24
                </div>
              </div>
              <div className="text-[9px]" style={{ color: COLORS.grayText }}>
                256 Active Employees
              </div>
            </FloatCard>

              {/* Connector lines */}
              <svg
                width="820"
                height="630"
                viewBox="0 0 820 630"
                style={{ position: "absolute", inset: 0, zIndex: 15, overflow: "visible", pointerEvents: "none" }}
              >
                <defs>
                  <marker id="arrowPurple" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill={COLORS.purple} />
                  </marker>
                  <marker id="arrowPurpleLight" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill="#C4B5FD" />
                  </marker>
                  <marker id="arrowGreen" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill={COLORS.green} />
                  </marker>
                  <marker id="arrowBlue" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill={COLORS.blue} />
                  </marker>
                  <marker id="arrowOrange" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill={COLORS.orange} />
                  </marker>
                  <marker id="arrowAmber" markerWidth="8" markerHeight="8" refX="5" refY="4" orient="auto">
                    <path d="M0,0 L8,4 L0,8 Z" fill={COLORS.amber} />
                  </marker>
                </defs>
                {/* Next Payroll Run -> dashboard (purple) */}
                <path d="M150,75 L177.5,75 L177.5,113" fill="none" stroke={COLORS.purple} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowPurple)" />
                <circle cx="150" cy="75" r="3" fill={COLORS.purple} />
                {/* People -> dashboard (purpleLight) */}
                <path d="M444,98 L444,113" fill="none" stroke="#C4B5FD" strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowPurpleLight)" />
                <circle cx="444" cy="98" r="3" fill="#C4B5FD" />
                {/* Payroll -> dashboard (green) */}
                <path d="M630,80 L605,80 L605,113" fill="none" stroke={COLORS.green} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowGreen)" />
                <circle cx="630" cy="80" r="3" fill={COLORS.green} />
                {/* Invoices Collected -> dashboard (blue) */}
                <path d="M165,170 L205,170" fill="none" stroke={COLORS.blue} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowBlue)" />
                <circle cx="165" cy="170" r="3" fill={COLORS.blue} />
                {/* Billing -> dashboard (blue) */}
                <path d="M663,233 L655,233" fill="none" stroke={COLORS.blue} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowBlue)" />
                <circle cx="663" cy="233" r="3" fill={COLORS.blue} />
                {/* Active Projects -> dashboard (purple) */}
                <path d="M160,423 L205,423" fill="none" stroke={COLORS.purple} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowPurple)" />
                <circle cx="160" cy="423" r="3" fill={COLORS.purple} />
                {/* Projects -> dashboard (orange) */}
                <path d="M670,373 L655,373" fill="none" stroke={COLORS.orange} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowOrange)" />
                <circle cx="670" cy="373" r="3" fill={COLORS.orange} />
                {/* Insights -> dashboard (purple) */}
                <path d="M643,535 L625,535 L625,495" fill="none" stroke={COLORS.purple} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowPurple)" />
                <circle cx="643" cy="535" r="3" fill={COLORS.purple} />
                {/* Inventory -> dashboard (green) */}
                <path d="M248,523 L248,495" fill="none" stroke={COLORS.green} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowGreen)" />
                <circle cx="248" cy="523" r="3" fill={COLORS.green} />
                {/* Compliance -> dashboard (amber) */}
                <path d="M491,538 L491,495" fill="none" stroke={COLORS.amber} strokeWidth="1.5" strokeDasharray="4 4" markerEnd="url(#arrowAmber)" />
                <circle cx="491" cy="538" r="3" fill={COLORS.amber} />
              </svg>

              {/* Payroll card */}
              <FloatCard style={{ left: 630, top: 38, width: 160, height: 85 }}>
              <div className="flex items-center gap-1.5 mb-2">
                <IconBadge bg={COLORS.green}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <circle cx="12" cy="12" r="2" />
                  </svg>
                </IconBadge>
                <span className="text-[11px] font-semibold" style={{ color: COLORS.navy }}>
                  Payroll
                </span>
              </div>
              <div className="text-[9px]" style={{ color: COLORS.grayText }}>
                May 2025 Payroll
              </div>
              <div className="flex items-center justify-between mt-0.5">
                <span className="text-[13px] font-bold" style={{ color: COLORS.navy }}>
                  ₹2,83,420
                </span>
                <span
                  className="text-[8px] font-semibold px-1.5 py-0.5 rounded-full"
                  style={{ background: COLORS.greenLight, color: COLORS.green }}
                >
                  Completed
                </span>
              </div>
            </FloatCard>

            {/* Invoices Collected small card */}
            <FloatCard style={{ left: 15, top: 143, width: 150, height: 55 }} padding="10px">
              <div className="flex items-center gap-2">
                <IconBadge bg={COLORS.blue}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 4h16v16H4z" />
                    <path d="M8 9h8M8 13h5" />
                  </svg>
                </IconBadge>
                <div>
                  <div className="text-[9px]" style={{ color: COLORS.grayText }}>
                    Invoices Collected
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-bold" style={{ color: COLORS.navy }}>
                      $2.4M
                    </span>
                    <span className="text-[8px] font-semibold flex items-center" style={{ color: COLORS.green }}>
                      <UpArrow color={COLORS.green} /> 18.7%
                    </span>
                  </div>
                </div>
              </div>
            </FloatCard>

            {/* Billing card */}
            <FloatCard style={{ left: 663, top: 183, width: 147, height: 100 }}>
              <div className="flex items-center gap-1.5 mb-2">
                <IconBadge bg={COLORS.blue}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="16" rx="2" />
                    <path d="M7 9h10M7 13h6" />
                  </svg>
                </IconBadge>
                <span className="text-[11px] font-semibold" style={{ color: COLORS.navy }}>
                  Billing
                </span>
              </div>
              <div className="text-[9px]" style={{ color: COLORS.grayText }}>
                Outstanding Invoices
              </div>
              <div className="text-[13px] font-bold" style={{ color: COLORS.navy }}>
                $1,24,000
              </div>
              <div className="text-[9px] font-semibold" style={{ color: COLORS.blue }}>
                23 Invoices
              </div>
            </FloatCard>

            {/* Active Projects small card */}
            <FloatCard style={{ left: 35, top: 393, width: 125, height: 60 }} padding="10px">
              <div className="flex items-center gap-2">
                <IconBadge bg={COLORS.purple}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </IconBadge>
                <div>
                  <div className="text-[9px]" style={{ color: COLORS.grayText }}>
                    Active Projects
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[12px] font-bold" style={{ color: COLORS.navy }}>
                      24
                    </span>
                    <span className="text-[8px] font-semibold flex items-center" style={{ color: COLORS.green }}>
                      <UpArrow color={COLORS.green} /> 12%
                    </span>
                  </div>
                </div>
              </div>
            </FloatCard>

            {/* Projects card */}
            <FloatCard style={{ left: 670, top: 318, width: 150, height: 110 }}>
              <div className="flex items-center gap-1.5 mb-2">
                <IconBadge bg={COLORS.orange}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <rect x="3" y="7" width="18" height="13" rx="2" />
                    <path d="M8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                  </svg>
                </IconBadge>
                <span className="text-[11px] font-semibold" style={{ color: COLORS.navy }}>
                  Projects
                </span>
              </div>
              <div className="text-[9px] mb-1" style={{ color: COLORS.grayText }}>
                Website Redesign
              </div>
              <div className="w-full h-1.5 rounded-full mb-1" style={{ background: "#EEF0F7" }}>
                <div className="h-1.5 rounded-full" style={{ width: "72%", background: COLORS.purple }} />
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-bold" style={{ color: COLORS.navy }}>
                  72%
                </span>
                <span className="text-[8px] font-semibold" style={{ color: COLORS.amber }}>
                  On Track
                </span>
              </div>
            </FloatCard>

            {/* Insights card */}
            <FloatCard style={{ left: 643, top: 483, width: 140, height: 105 }}>
              <div className="flex items-center gap-1.5 mb-2">
                <IconBadge bg={COLORS.purple}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M4 19V9M10 19V5M16 19v-7M20 19V3" />
                  </svg>
                </IconBadge>
                <span className="text-[11px] font-semibold" style={{ color: COLORS.navy }}>
                  Insights
                </span>
              </div>
              <div className="text-[9px]" style={{ color: COLORS.grayText }}>
                Net Profit (MTD)
              </div>
              <div className="text-[13px] font-bold mb-1" style={{ color: COLORS.navy }}>
                $1.42M
              </div>
              <div className="flex items-center justify-between">
                <span className="text-[8px] font-semibold flex items-center" style={{ color: COLORS.green }}>
                  <UpArrow color={COLORS.green} /> 14.6%
                </span>
                <svg width="46" height="16" viewBox="0 0 46 16">
                  <polyline
                    points="0,14 8,10 16,12 24,6 32,8 46,2"
                    fill="none"
                    stroke={COLORS.green}
                    strokeWidth="1.5"
                  />
                </svg>
              </div>
            </FloatCard>

            {/* Inventory card */}
            <FloatCard style={{ left: 178, top: 523, width: 140, height: 105 }}>
              <div className="flex items-center gap-1.5 mb-2">
                <IconBadge bg={COLORS.green}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M21 8l-9-5-9 5 9 5 9-5zM3 8v8l9 5 9-5V8" />
                  </svg>
                </IconBadge>
                <span className="text-[11px] font-semibold" style={{ color: COLORS.navy }}>
                  Inventory
                </span>
              </div>
              <div className="text-[9px]" style={{ color: COLORS.grayText }}>
                Stock Value
              </div>
              <div className="text-[13px] font-bold mb-1" style={{ color: COLORS.navy }}>
                $5.82M
              </div>
              <div className="flex items-center gap-1">
                <span className="text-[8px] font-semibold flex items-center" style={{ color: COLORS.green }}>
                  <UpArrow color={COLORS.green} /> 11.3%
                </span>
                <svg width="32" height="12" viewBox="0 0 32 12">
                  <rect x="0" y="6" width="3" height="6" fill={COLORS.green} />
                  <rect x="5" y="3" width="3" height="9" fill={COLORS.green} />
                  <rect x="10" y="5" width="3" height="7" fill={COLORS.green} />
                  <rect x="15" y="1" width="3" height="11" fill={COLORS.green} />
                  <rect x="20" y="4" width="3" height="8" fill={COLORS.green} />
                </svg>
              </div>
            </FloatCard>

            {/* Compliance card */}
            <FloatCard style={{ left: 408, top: 538, width: 167, height: 90 }}>
              <div className="flex items-center gap-1.5 mb-2">
                <IconBadge bg={COLORS.amber}>
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                    <path d="M12 2l8 4v6c0 5-3.5 8.5-8 10-4.5-1.5-8-5-8-10V6l8-4z" />
                  </svg>
                </IconBadge>
                <span className="text-[11px] font-semibold" style={{ color: COLORS.navy }}>
                  Compliance
                </span>
              </div>
              <div className="text-[9px]" style={{ color: COLORS.grayText }}>
                ISO 27001:2022
              </div>
              <div className="text-[13px] font-bold mb-1" style={{ color: COLORS.navy }}>
                92% <span className="text-[9px] font-medium" style={{ color: COLORS.grayText }}>Compliant</span>
              </div>
              <div className="w-full h-1.5 rounded-full" style={{ background: COLORS.amberLight }}>
                <div className="h-1.5 rounded-full" style={{ width: "92%", background: COLORS.amber }} />
              </div>
            </FloatCard>
          </div>
        </div>
      </div>
    </section>
  );
}
