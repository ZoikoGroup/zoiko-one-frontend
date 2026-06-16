import { Link } from "react-router-dom";
import {
  ArrowRight, CheckCircle2, Users, Clock, WalletCards, CreditCard,
  FileCheck2, Sparkles, ShieldCheck, Network, MessageSquare, Globe,
  Rocket, Building2, ChevronRight, Star, TrendingUp, Zap, Lock, BarChart3, Wallet
} from "lucide-react";
import LandingHeader from "../components/LandingHeader";
import LandingFooter from "../components/LandingFooter";

const coreProducts = [
  { name: "Zoiko HR", href: "/zoiko-hr", icon: Users, desc: "Employee records, onboarding, leave, performance and full lifecycle management.", color: "#4F46E5", bg: "#EEF2FF" },
  { name: "ZoikoTime", href: "/zoikotime", icon: Clock, desc: "Time tracking, attendance, shifts, scheduling and payroll-ready evidence.", color: "#0891B2", bg: "#E0F2FE" },
  { name: "Zoiko Payroll", href: "/payroll", icon: WalletCards, desc: "Pay runs, payslips, deductions, filings, approvals and payment readiness.", color: "#059669", bg: "#ECFDF5" },
  { name: "Zoiko Comply", href: "/comply", icon: FileCheck2, desc: "Compliance dashboards, filing calendars, audit logs and governance workflows.", color: "#DC2626", bg: "#FEF2F2" },
  { name: "Zoiko Insights", href: "/insights", icon: Sparkles, desc: "Executive dashboards, payroll analytics, revenue insights and forecasting.", color: "#7C3AED", bg: "#F5F3FF" },
];

const stats = [
  { value: "50K+", label: "Businesses worldwide" },
  { value: "180+", label: "Countries supported" },
  { value: "99.9%", label: "Platform uptime" },
  { value: "24/7", label: "Expert support" },
];

const workflowSteps = [
  { step: "01", title: "Manage people", body: "Zoiko HR creates and governs the employee record from hire to retire.", icon: Users, color: "#4F46E5" },
  { step: "02", title: "Capture work", body: "ZoikoTime records time, attendance, shifts and billable work automatically.", icon: Clock, color: "#0891B2" },
  { step: "03", title: "Run payroll", body: "Zoiko Payroll converts approved inputs into governed, compliant pay runs.", icon: WalletCards, color: "#059669" },
  { step: "04", title: "Settle money", body: "ZoikoPay handles settlement, disbursement, FX and reconciliation.", icon: Network, color: "#DC2626" },
  { step: "05", title: "Govern & see", body: "Zoiko Comply and Insights provide controls, audit trails and forecasts.", icon: BarChart3, color: "#7C3AED" },
];

const ecosystem = [
  { name: "Zoiko Sema", desc: "Team communication — messaging, meetings, video and channels.", icon: MessageSquare, color: "#0891B2" },
  { name: "Zoiko Local", desc: "Global communication for worldwide reachability and reach.", icon: Globe, color: "#059669" },
  { name: "ZoikoVertex", desc: "Growth automation connecting operational data to revenue.", icon: Rocket, color: "#7C3AED" },
  { name: "Zoiko Web Services", desc: "Global digitization for websites, apps and integrations.", icon: Building2, color: "#D97706" },
];

const pricingPlans = [
  {
    title: "Starter",
    price: "Free",
    desc: "Start with one product. Perfect for small teams getting started.",
    points: ["1 product module", "Up to 10 users", "Basic reports", "Email support"],
    cta: "Get Started Free",
    href: "/register",
    highlighted: false,
  },
  {
    title: "Business",
    price: "$12",
    per: "/user/month",
    desc: "Connected workflows for growing mid-market businesses.",
    points: ["All 5 core products", "Unlimited users", "Advanced analytics", "Priority support", "API access", "Custom workflows"],
    cta: "Start Free Trial",
    href: "/register",
    highlighted: true,
  },
  {
    title: "Enterprise",
    price: "Custom",
    desc: "For multi-entity, global or regulated organizations needing advanced governance.",
    points: ["Everything in Business", "Advanced permissions & SLAs", "Dedicated CSM", "Custom integrations", "On-premise option", "Strategic contracts"],
    cta: "Contact Sales",
    href: "/login",
    highlighted: false,
  },
];

const testimonials = [
  { name: "Sarah Chen", role: "CFO, TechNova Inc.", text: "Zoiko One replaced 4 separate tools. Our payroll runs 60% faster and compliance is finally stress-free.", stars: 5 },
  { name: "James Okafor", role: "HR Director, GreenPath", text: "The HR and Time integration alone saved us 20 hours a week. The platform is incredibly intuitive.", stars: 5 },
  { name: "Priya Sharma", role: "Operations Manager, BridgeCo", text: "From onboarding to billing — everything is connected. Our team loves it and so does our board.", stars: 5 },
];

export default function HomePage() {
  return (
    <div style={{ fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif", background: "#ffffff", color: "#111827", minHeight: "100vh" }}>
      <LandingHeader />

      {/* ─── HERO ─── */}
      <section style={{
        background: "linear-gradient(160deg, #fff7f0 0%, #ffffff 40%, #f0f4ff 100%)",
        padding: "80px 24px 60px", textAlign: "center",
        position: "relative", overflow: "hidden"
      }}>
        {/* Background decoration */}
        <div style={{
          position: "absolute", top: "-100px", right: "-100px", width: "500px", height: "500px",
          background: "radial-gradient(circle, rgba(255,107,0,0.08) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", left: "-80px", width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(79,70,229,0.07) 0%, transparent 70%)",
          borderRadius: "50%", pointerEvents: "none"
        }} />

        <div style={{ maxWidth: "800px", margin: "0 auto", position: "relative" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "#fff7f0", border: "1px solid #FFD4B3", borderRadius: "999px",
            padding: "6px 16px", marginBottom: "28px"
          }}>
            <Zap size={14} color="#FF6B00" />
            <span style={{ fontSize: "13px", fontWeight: "600", color: "#FF6B00" }}>
              The Zoiko Business Cloud — Operations Layer
            </span>
          </div>

          <h1 style={{
            fontSize: "clamp(36px, 6vw, 64px)", fontWeight: "800", lineHeight: "1.1",
            color: "#111827", margin: "0 0 20px 0", letterSpacing: "-1.5px"
          }}>
            Your business, powered by{" "}
            <span style={{
              background: "linear-gradient(135deg, #FF6B00, #FF8C38)",
              WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent", backgroundClip: "text"
            }}>
              one platform
            </span>
          </h1>

          <p style={{ fontSize: "clamp(16px, 2vw, 20px)", color: "#6B7280", lineHeight: "1.7", margin: "0 0 36px 0", maxWidth: "620px", marginLeft: "auto", marginRight: "auto" }}>
            Zoiko One brings together HR, Time, Payroll, Compliance and Insights into one connected platform — built for businesses that need flexible adoption today and scalable governance tomorrow.
          </p>

          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap", marginBottom: "40px" }}>
            <Link to="/register" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: "700",
              color: "white", textDecoration: "none",
              background: "linear-gradient(135deg, #FF6B00, #FF8C38)",
              boxShadow: "0 8px 24px rgba(255,107,0,0.4)", transition: "all 0.2s"
            }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <a href="#products" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: "600",
              color: "#374151", textDecoration: "none", border: "1.5px solid #E5E7EB",
              background: "white", transition: "all 0.2s"
            }}>
              Explore Products <ChevronRight size={18} />
            </a>
          </div>

          <p style={{ fontSize: "13px", color: "#9CA3AF" }}>
            ✓ No credit card required &nbsp;&nbsp; ✓ 30-day free trial &nbsp;&nbsp; ✓ Setup in minutes
          </p>
        </div>
      </section>

      {/* ─── STATS BAR ─── */}
      <section style={{ background: "#1a1a2e", padding: "40px 24px" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto", display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "24px", textAlign: "center" }}>
          {stats.map((s) => (
            <div key={s.value}>
              <p style={{ fontSize: "clamp(28px,4vw,40px)", fontWeight: "800", color: "#FF6B00", margin: "0 0 4px 0" }}>{s.value}</p>
              <p style={{ fontSize: "13px", color: "#9CA3AF", margin: 0 }}>{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ─── CORE PRODUCTS ─── */}
      <section id="products" style={{ padding: "80px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Core Products
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: "800", color: "#111827", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
              Five products. One platform.
            </h2>
            <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "560px", margin: "0 auto", lineHeight: "1.6" }}>
              Buy standalone, combine in bundles, or adopt the enterprise framework as your business scales.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {coreProducts.map((p) => (
              <Link
                key={p.href}
                to={p.href}
                style={{
                  display: "block", padding: "28px", borderRadius: "16px",
                  background: "white", border: "1.5px solid #E5E7EB",
                  textDecoration: "none", transition: "all 0.25s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = p.color;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.1)`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: p.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "16px"
                }}>
                  <p.icon size={22} color={p.color} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>{p.name}</h3>
                <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", margin: "0 0 16px 0" }}>{p.desc}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600", color: p.color }}>
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PLATFORM ARCHITECTURE ─── */}
      <section id="platform" style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Platform
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: "800", color: "#111827", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
              A disciplined three-layer architecture
            </h2>
            <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "560px", margin: "0 auto", lineHeight: "1.6" }}>
              Zoiko One runs operations. The Zoiko Business Cloud helps the business communicate, grow, digitize, get paid and stay accountable.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1.2fr 1fr", gap: "20px" }}>
            {[
              { label: "Adjacent Platforms", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB", desc: "Zoiko Sema, Zoiko Local, ZoikoVertex, and Zoiko Web Services — standalone platforms that integrate with Zoiko One and create expansion pathways.", icon: Globe },
              { label: "Zoiko One Core", color: "#FF6B00", bg: "#fff7f0", border: "#FFD4B3", desc: "Zoiko HR, ZoikoTime, Zoiko Payroll, Zoiko Comply and Zoiko Insights — the five core products customers buy as standalone, bundles or enterprise packages.", icon: Zap, featured: true },
              { label: "Infrastructure", color: "#6B7280", bg: "#F9FAFB", border: "#E5E7EB", desc: "ZoikoPay and ZoikoCoreX power settlement, disbursement, FX, reconciliation and financial truth beneath the platform.", icon: Network },
            ].map((item) => (
              <div key={item.label} style={{
                padding: "32px", borderRadius: "16px", background: item.bg,
                border: `1.5px solid ${item.border}`,
                boxShadow: item.featured ? "0 16px 48px rgba(255,107,0,0.15)" : "none"
              }}>
                <div style={{
                  width: "44px", height: "44px", borderRadius: "10px",
                  background: item.featured ? "#FF6B00" : "#E5E7EB",
                  display: "flex", alignItems: "center", justifyContent: "center", marginBottom: "16px"
                }}>
                  <item.icon size={20} color={item.featured ? "white" : "#6B7280"} />
                </div>
                <p style={{ fontSize: "12px", fontWeight: "700", color: item.color, textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px 0" }}>{item.label}</p>
                <p style={{ fontSize: "14px", color: "#4B5563", lineHeight: "1.7", margin: 0 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── MONEY ─── */}
      <section id="money" style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Money
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: "800", color: "#111827", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
              Manage, move and grow your money
            </h2>
            <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "560px", margin: "0 auto", lineHeight: "1.6" }}>
              From invoicing and collections to vendor spend and AP workflows — everything money in one place.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "20px" }}>
            {[
              { name: "Zoiko Billing", href: "/billing", icon: CreditCard, desc: "Control money in with invoicing, recurring billing, collections, payment links and revenue dashboards.", color: "#D97706", bg: "#FFFBEB" },
              { name: "Zoiko Spend", href: "/spend", icon: Wallet, desc: "Control money out with vendor records, purchase requests, purchase orders, supplier invoices, spend policies, approvals, and payment-ready workflows.", color: "#059669", bg: "#ECFDF5" },
            ].map((p) => (
              <Link
                key={p.href}
                to={p.href}
                style={{
                  display: "block", padding: "28px", borderRadius: "16px",
                  background: "white", border: "1.5px solid #E5E7EB",
                  textDecoration: "none", transition: "all 0.25s",
                  boxShadow: "0 1px 4px rgba(0,0,0,0.04)"
                }}
                onMouseEnter={e => {
                  e.currentTarget.style.borderColor = p.color;
                  e.currentTarget.style.boxShadow = `0 8px 32px rgba(0,0,0,0.1)`;
                  e.currentTarget.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.borderColor = "#E5E7EB";
                  e.currentTarget.style.boxShadow = "0 1px 4px rgba(0,0,0,0.04)";
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div style={{
                  width: "48px", height: "48px", borderRadius: "12px",
                  background: p.bg, display: "flex", alignItems: "center", justifyContent: "center",
                  marginBottom: "16px"
                }}>
                  <p.icon size={22} color={p.color} />
                </div>
                <h3 style={{ fontSize: "18px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>{p.name}</h3>
                <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", margin: "0 0 16px 0" }}>{p.desc}</p>
                <span style={{ display: "inline-flex", alignItems: "center", gap: "4px", fontSize: "13px", fontWeight: "600", color: p.color }}>
                  Learn more <ArrowRight size={14} />
                </span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── HOW IT WORKS ─── */}
      <section style={{ padding: "80px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: "1200px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              How It Works
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: "800", color: "#111827", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
              Start with one. Connect everything.
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "20px" }}>
            {workflowSteps.map((s) => (
              <div key={s.step} style={{ padding: "28px", borderRadius: "16px", background: "white", border: "1.5px solid #E5E7EB" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "16px" }}>
                  <span style={{
                    fontSize: "11px", fontWeight: "800", color: s.color,
                    background: `${s.color}15`, padding: "4px 10px", borderRadius: "999px"
                  }}>{s.step}</span>
                  <s.icon size={18} color={s.color} />
                </div>
                <h3 style={{ fontSize: "17px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>{s.title}</h3>
                <p style={{ fontSize: "14px", color: "#6B7280", lineHeight: "1.6", margin: 0 }}>{s.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Customer Stories
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: "800", color: "#111827", margin: 0, letterSpacing: "-0.5px" }}>
              Trusted by teams worldwide
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {testimonials.map((t) => (
              <div key={t.name} style={{ padding: "32px", borderRadius: "16px", background: "#f9fafb", border: "1.5px solid #E5E7EB" }}>
                <div style={{ display: "flex", gap: "2px", marginBottom: "16px" }}>
                  {Array.from({ length: t.stars }).map((_, i) => (
                    <Star key={i} size={16} fill="#FF6B00" color="#FF6B00" />
                  ))}
                </div>
                <p style={{ fontSize: "15px", color: "#374151", lineHeight: "1.7", margin: "0 0 20px 0", fontStyle: "italic" }}>"{t.text}"</p>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#111827", margin: "0 0 2px 0" }}>{t.name}</p>
                  <p style={{ fontSize: "12px", color: "#9CA3AF", margin: 0 }}>{t.role}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PRICING ─── */}
      <section id="pricing" style={{ padding: "80px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Pricing
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: "800", color: "#111827", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
              A commercial model that scales with you
            </h2>
            <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "500px", margin: "0 auto", lineHeight: "1.6" }}>
              Simple and commercially defensible — matching the buying behavior of SMBs, mid-market and enterprise.
            </p>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: "20px" }}>
            {pricingPlans.map((p) => (
              <div key={p.title} style={{
                padding: "36px", borderRadius: "16px",
                background: p.highlighted ? "linear-gradient(160deg, #FF6B00, #FF8C38)" : "white",
                border: p.highlighted ? "none" : "1.5px solid #E5E7EB",
                boxShadow: p.highlighted ? "0 20px 60px rgba(255,107,0,0.3)" : "0 1px 4px rgba(0,0,0,0.04)",
                position: "relative", overflow: "hidden"
              }}>
                {p.highlighted && (
                  <div style={{
                    position: "absolute", top: "16px", right: "16px",
                    background: "rgba(255,255,255,0.2)", borderRadius: "999px",
                    padding: "4px 12px", fontSize: "11px", fontWeight: "700", color: "white"
                  }}>Most Popular</div>
                )}
                <h3 style={{ fontSize: "20px", fontWeight: "700", color: p.highlighted ? "white" : "#111827", margin: "0 0 8px 0" }}>{p.title}</h3>
                <div style={{ display: "flex", alignItems: "baseline", gap: "4px", marginBottom: "12px" }}>
                  <span style={{ fontSize: "36px", fontWeight: "800", color: p.highlighted ? "white" : "#111827" }}>{p.price}</span>
                  {p.per && <span style={{ fontSize: "14px", color: p.highlighted ? "rgba(255,255,255,0.8)" : "#6B7280" }}>{p.per}</span>}
                </div>
                <p style={{ fontSize: "14px", color: p.highlighted ? "rgba(255,255,255,0.85)" : "#6B7280", lineHeight: "1.6", margin: "0 0 24px 0" }}>{p.desc}</p>
                <ul style={{ listStyle: "none", padding: 0, margin: "0 0 28px 0", display: "flex", flexDirection: "column", gap: "10px" }}>
                  {p.points.map((pt) => (
                    <li key={pt} style={{ display: "flex", alignItems: "center", gap: "8px", fontSize: "14px", color: p.highlighted ? "rgba(255,255,255,0.9)" : "#374151" }}>
                      <CheckCircle2 size={16} color={p.highlighted ? "white" : "#FF6B00"} />
                      {pt}
                    </li>
                  ))}
                </ul>
                <Link to={p.href} style={{
                  display: "block", textAlign: "center", padding: "12px 24px", borderRadius: "10px",
                  fontSize: "14px", fontWeight: "700", textDecoration: "none",
                  background: p.highlighted ? "white" : "linear-gradient(135deg, #FF6B00, #FF8C38)",
                  color: p.highlighted ? "#FF6B00" : "white",
                  boxShadow: p.highlighted ? "0 4px 14px rgba(0,0,0,0.15)" : "0 4px 14px rgba(255,107,0,0.35)",
                }}>
                  {p.cta}
                </Link>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── ECOSYSTEM ─── */}
      <section id="ecosystem" style={{ padding: "80px 24px", background: "white" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{ textAlign: "center", marginBottom: "52px" }}>
            <p style={{ fontSize: "13px", fontWeight: "600", color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.1em", marginBottom: "12px" }}>
              Ecosystem
            </p>
            <h2 style={{ fontSize: "clamp(28px,4vw,42px)", fontWeight: "800", color: "#111827", margin: "0 0 16px 0", letterSpacing: "-0.5px" }}>
              The wider Zoiko Business Cloud
            </h2>
            <p style={{ fontSize: "17px", color: "#6B7280", maxWidth: "520px", margin: "0 auto", lineHeight: "1.6" }}>
              Adjacent platforms strengthen the ecosystem and create cross-sell opportunities while preserving a clean operations boundary.
            </p>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))", gap: "20px" }}>
            {ecosystem.map((e) => (
              <div key={e.name} style={{ padding: "28px", borderRadius: "16px", background: "#f9fafb", border: "1.5px solid #E5E7EB", textAlign: "center" }}>
                <div style={{
                  width: "52px", height: "52px", borderRadius: "14px", margin: "0 auto 16px",
                  background: `${e.color}15`, display: "flex", alignItems: "center", justifyContent: "center"
                }}>
                  <e.icon size={24} color={e.color} />
                </div>
                <h3 style={{ fontSize: "16px", fontWeight: "700", color: "#111827", margin: "0 0 8px 0" }}>{e.name}</h3>
                <p style={{ fontSize: "13px", color: "#6B7280", lineHeight: "1.6", margin: 0 }}>{e.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── TRUST CENTER BANNER ─── */}
      <section style={{ padding: "60px 24px", background: "#f9fafb" }}>
        <div style={{ maxWidth: "1100px", margin: "0 auto" }}>
          <div style={{
            display: "flex", flexWrap: "wrap", alignItems: "center", justifyContent: "space-between",
            gap: "32px", padding: "48px 48px", borderRadius: "20px",
            background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)",
            border: "1px solid rgba(255,255,255,0.08)"
          }}>
            <div style={{ maxWidth: "580px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                <Lock size={16} color="#FF6B00" />
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#FF6B00", textTransform: "uppercase", letterSpacing: "0.1em" }}>Trust Center</span>
              </div>
              <h2 style={{ fontSize: "clamp(22px,3vw,32px)", fontWeight: "800", color: "white", margin: "0 0 12px 0", letterSpacing: "-0.5px" }}>
                Security, privacy & governance — before you ever pick up the phone.
              </h2>
              <p style={{ fontSize: "14px", color: "#9CA3AF", lineHeight: "1.7", margin: 0 }}>
                Zoiko One handles sensitive operational data across HR, payroll, time, compliance and analytics. Review our security, privacy, data-processing and governance materials whenever you're ready.
              </p>
            </div>
            <Link to="/trust-center" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 28px", borderRadius: "10px", fontSize: "15px", fontWeight: "700",
              color: "white", textDecoration: "none", whiteSpace: "nowrap",
              background: "linear-gradient(135deg, #FF6B00, #FF8C38)",
              boxShadow: "0 8px 24px rgba(255,107,0,0.4)"
            }}>
              Visit Trust Center <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FINAL CTA ─── */}
      <section style={{ padding: "80px 24px", background: "white", textAlign: "center" }}>
        <div style={{ maxWidth: "700px", margin: "0 auto" }}>
          <h2 style={{ fontSize: "clamp(28px,5vw,48px)", fontWeight: "800", color: "#111827", margin: "0 0 16px 0", letterSpacing: "-1px", lineHeight: "1.15" }}>
            Ready to transform your business operations?
          </h2>
          <p style={{ fontSize: "17px", color: "#6B7280", margin: "0 0 36px 0", lineHeight: "1.6" }}>
            Start for free. No credit card required. Set up in minutes.
          </p>
          <div style={{ display: "flex", gap: "12px", justifyContent: "center", flexWrap: "wrap" }}>
            <Link to="/register" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "700",
              color: "white", textDecoration: "none",
              background: "linear-gradient(135deg, #FF6B00, #FF8C38)",
              boxShadow: "0 8px 24px rgba(255,107,0,0.4)"
            }}>
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" style={{
              display: "inline-flex", alignItems: "center", gap: "8px",
              padding: "14px 32px", borderRadius: "10px", fontSize: "15px", fontWeight: "600",
              color: "#374151", textDecoration: "none", border: "1.5px solid #E5E7EB", background: "white"
            }}>
              Sign In
            </Link>
          </div>
        </div>
      </section>

      <LandingFooter />
    </div>
  );
}
