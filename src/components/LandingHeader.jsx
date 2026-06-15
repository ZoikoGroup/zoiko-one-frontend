import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import logo from "../assets/logo.png";
import { useAuth } from "../context/AuthContext";

const productLinks = [
  { label: "Zoiko HR", href: "/zoiko-hr", desc: "People & lifecycle management", color: "#4F46E5" },
  { label: "ZoikoTime", href: "/zoikotime", desc: "Time, attendance & shifts", color: "#0891B2" },
  { label: "Zoiko Payroll", href: "/payroll", desc: "Pay runs & filings", color: "#059669" },
  { label: "Zoiko Billing", href: "/billing", desc: "Invoicing & collections", color: "#D97706" },
  { label: "Zoiko Comply", href: "/comply", desc: "Compliance & governance", color: "#DC2626" },
  { label: "Zoiko Insights", href: "/insights", desc: "Dashboards & analytics", color: "#7C3AED" },
];

export default function LandingHeader() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [productsOpen, setProductsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled ? "bg-white shadow-md" : "bg-white/95 backdrop-blur-md"
      }`}
      style={{ borderBottom: "1px solid #e5e7eb" }}
    >
      <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-3 sm:px-6 lg:px-8">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img src={logo} alt="Zoiko One" style={{ height: "40px", width: "auto", objectFit: "contain" }} />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden lg:flex items-center gap-1">
          {/* Products dropdown */}
          <div
            className="relative"
            onMouseEnter={() => setProductsOpen(true)}
            onMouseLeave={() => setProductsOpen(false)}
          >
            <button
              style={{
                display: "flex", alignItems: "center", gap: "4px",
                padding: "8px 14px", borderRadius: "8px",
                fontSize: "14px", fontWeight: "500", color: "#374151",
                background: "transparent", border: "none", cursor: "pointer",
                transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              Products <ChevronDown size={14} style={{ marginTop: "1px", transform: productsOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s" }} />
            </button>
            {productsOpen && (
              <div style={{
                position: "absolute", top: "100%", left: "50%", transform: "translateX(-50%)",
                width: "480px", background: "white", borderRadius: "16px",
                boxShadow: "0 20px 60px rgba(0,0,0,0.15)", border: "1px solid #e5e7eb",
                padding: "16px", marginTop: "8px", zIndex: 100
              }}>
                <p style={{ fontSize: "11px", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "12px", paddingLeft: "8px" }}>
                  Zoiko One Products
                </p>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "4px" }}>
                  {productLinks.map((p) => (
                    <Link
                      key={p.href}
                      to={p.href}
                      style={{ display: "flex", alignItems: "flex-start", gap: "10px", padding: "10px 12px", borderRadius: "10px", textDecoration: "none", transition: "background 0.15s" }}
                      onMouseEnter={e => e.currentTarget.style.background = "#f9fafb"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: p.color, marginTop: "6px", flexShrink: 0 }} />
                      <div>
                        <p style={{ fontSize: "14px", fontWeight: "600", color: "#111827", margin: 0 }}>{p.label}</p>
                        <p style={{ fontSize: "12px", color: "#6B7280", margin: "2px 0 0 0" }}>{p.desc}</p>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            )}
          </div>

          {[
            { label: "Platform", href: "/#platform" },
            { label: "Pricing", href: "/#pricing" },
            { label: "Trust Center", href: "/trust-center" },
          ].map((l) => (
            <a
              key={l.href}
              href={l.href}
              style={{
                padding: "8px 14px", borderRadius: "8px",
                fontSize: "14px", fontWeight: "500", color: "#374151",
                textDecoration: "none", transition: "background 0.2s"
              }}
              onMouseEnter={e => e.currentTarget.style.background = "#f3f4f6"}
              onMouseLeave={e => e.currentTarget.style.background = "transparent"}
            >
              {l.label}
            </a>
          ))}
        </nav>

        {/* Desktop CTA buttons */}
        <div className="hidden lg:flex items-center gap-3">
          <Link
            to="/login"
            style={{
              padding: "8px 18px", borderRadius: "8px", fontSize: "14px", fontWeight: "500",
              color: "#374151", border: "1px solid #D1D5DB", textDecoration: "none",
              background: "white", transition: "all 0.2s"
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = "#FF6B00"; e.currentTarget.style.color = "#FF6B00"; }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = "#D1D5DB"; e.currentTarget.style.color = "#374151"; }}
          >
            {isAuthenticated ? "Dashboard" : "Sign In"}
          </Link>
          <Link
            to={isAuthenticated ? "/dashboard" : "/register"}
            style={{
              padding: "8px 20px", borderRadius: "8px", fontSize: "14px", fontWeight: "600",
              color: "white", textDecoration: "none",
              background: "linear-gradient(135deg, #FF6B00, #FF8C38)",
              boxShadow: "0 4px 14px rgba(255,107,0,0.35)",
              transition: "all 0.2s"
            }}
            onMouseEnter={e => e.currentTarget.style.boxShadow = "0 6px 20px rgba(255,107,0,0.5)"}
            onMouseLeave={e => e.currentTarget.style.boxShadow = "0 4px 14px rgba(255,107,0,0.35)"}
          >
            {isAuthenticated ? "Go to Dashboard" : "Get Started Free"}
          </Link>
        </div>

        {/* Mobile menu button */}
        <button
          className="lg:hidden"
          style={{ padding: "8px", borderRadius: "8px", border: "1px solid #E5E7EB", background: "white", cursor: "pointer" }}
          onClick={() => setMobileOpen(v => !v)}
        >
          {mobileOpen ? <X size={20} color="#374151" /> : <Menu size={20} color="#374151" />}
        </button>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div style={{ background: "white", borderTop: "1px solid #E5E7EB", padding: "16px" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <p style={{ fontSize: "11px", fontWeight: "600", color: "#9CA3AF", textTransform: "uppercase", letterSpacing: "0.08em" }}>Products</p>
            {productLinks.map((p) => (
              <Link key={p.href} to={p.href} onClick={() => setMobileOpen(false)}
                style={{ fontSize: "14px", color: "#374151", textDecoration: "none", padding: "6px 0" }}>{p.label}</Link>
            ))}
            <div style={{ height: "1px", background: "#E5E7EB", margin: "8px 0" }} />
            {[{ label: "Platform", href: "/#platform" }, { label: "Pricing", href: "/#pricing" }, { label: "Trust Center", href: "/trust-center" }].map(l => (
              <a key={l.href} href={l.href} onClick={() => setMobileOpen(false)}
                style={{ fontSize: "14px", color: "#374151", textDecoration: "none", padding: "6px 0" }}>{l.label}</a>
            ))}
            <div style={{ height: "1px", background: "#E5E7EB", margin: "8px 0" }} />
            <Link to="/login" onClick={() => setMobileOpen(false)}
              style={{ textAlign: "center", padding: "10px", borderRadius: "8px", border: "1px solid #D1D5DB", fontSize: "14px", fontWeight: "500", color: "#374151", textDecoration: "none" }}>
              Sign In
            </Link>
            <Link to="/register" onClick={() => setMobileOpen(false)}
              style={{ textAlign: "center", padding: "10px", borderRadius: "8px", fontSize: "14px", fontWeight: "600", color: "white", textDecoration: "none", background: "linear-gradient(135deg, #FF6B00, #FF8C38)" }}>
              Get Started Free
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
