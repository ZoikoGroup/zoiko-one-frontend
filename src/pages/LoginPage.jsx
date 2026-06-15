import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, AlertCircle, CheckCircle2 } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function LoginPage() {
  const { login, error: authError } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const from = location.state?.from?.pathname || "/dashboard";

  const [email, setEmail] = useState(import.meta.env.VITE_DEFAULT_EMAIL || "");
  const [password, setPassword] = useState(import.meta.env.VITE_DEFAULT_PASSWORD || "");
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    try {
      await login({ email, password });
      navigate(from, { replace: true });
    } catch (err) {
      setLocalError(err.message || "Unable to sign in. Please check your credentials.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex",
      background: "linear-gradient(135deg, #fff7f0 0%, #ffffff 50%, #f0f4ff 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif"
    }}>
      {/* Left panel – branding */}
      <div style={{
        display: "none", flex: "1", flexDirection: "column", justifyContent: "center",
        padding: "60px", background: "linear-gradient(160deg, #1a1a2e 0%, #16213e 100%)",
        position: "relative", overflow: "hidden"
      }} className="lg-panel">
        <div style={{
          position: "absolute", top: "-100px", right: "-100px", width: "400px", height: "400px",
          background: "radial-gradient(circle, rgba(255,107,0,0.15) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
        <div style={{
          position: "absolute", bottom: "-80px", left: "-80px", width: "300px", height: "300px",
          background: "radial-gradient(circle, rgba(79,70,229,0.12) 0%, transparent 70%)",
          borderRadius: "50%"
        }} />
        <div style={{ position: "relative", zIndex: 1 }}>
          <img src={logo} alt="Zoiko One" style={{ height: "48px", width: "auto", filter: "brightness(0) invert(1)", marginBottom: "48px" }} />
          <h2 style={{ fontSize: "32px", fontWeight: "800", color: "white", lineHeight: "1.2", margin: "0 0 16px 0" }}>
            One platform for your entire business operations
          </h2>
          <p style={{ fontSize: "16px", color: "#9CA3AF", lineHeight: "1.7", margin: "0 0 40px 0" }}>
            HR, Time, Payroll, Billing, Compliance and Insights — all connected and working together.
          </p>
          <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
            {["Employee lifecycle from hire to retire", "Automated payroll & compliance", "Real-time insights & analytics"].map(pt => (
              <div key={pt} style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <CheckCircle2 size={18} color="#FF6B00" />
                <span style={{ fontSize: "14px", color: "#D1D5DB" }}>{pt}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right panel – form */}
      <div style={{
        flex: "1", display: "flex", flexDirection: "column",
        alignItems: "center", justifyContent: "center",
        padding: "40px 24px", minHeight: "100vh"
      }}>
        <div style={{ width: "100%", maxWidth: "420px" }}>
          {/* Logo */}
          <div style={{ textAlign: "center", marginBottom: "36px" }}>
            <Link to="/">
              <img src={logo} alt="Zoiko One" style={{ height: "44px", width: "auto", objectFit: "contain", marginBottom: "24px" }} />
            </Link>
            <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#111827", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
              Welcome back
            </h1>
            <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
              Sign in to access your Zoiko One dashboard
            </p>
          </div>

          {/* Card */}
          <div style={{
            background: "white", borderRadius: "20px",
            boxShadow: "0 8px 40px rgba(0,0,0,0.10)",
            border: "1px solid #F3F4F6", padding: "36px"
          }}>
            {(localError || authError) && (
              <div style={{
                display: "flex", alignItems: "flex-start", gap: "8px",
                background: "#FEF2F2", border: "1px solid #FECACA",
                borderRadius: "10px", padding: "12px 14px", marginBottom: "20px"
              }}>
                <AlertCircle size={16} color="#DC2626" style={{ marginTop: "1px", flexShrink: 0 }} />
                <span style={{ fontSize: "13px", color: "#DC2626" }}>{localError || authError}</span>
              </div>
            )}

            <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
              <div>
                <label htmlFor="email" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                  Work email
                </label>
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                  placeholder="you@company.com"
                  style={{
                    width: "100%", padding: "11px 14px", borderRadius: "10px",
                    border: "1.5px solid #E5E7EB", fontSize: "14px", color: "#111827",
                    outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                    background: "#F9FAFB"
                  }}
                  onFocus={e => e.target.style.borderColor = "#FF6B00"}
                  onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                />
              </div>

              <div>
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "6px" }}>
                  <label htmlFor="password" style={{ fontSize: "13px", fontWeight: "600", color: "#374151" }}>
                    Password
                  </label>
                  <a href="#" style={{ fontSize: "12px", color: "#FF6B00", textDecoration: "none", fontWeight: "500" }}>
                    Forgot password?
                  </a>
                </div>
                <div style={{ position: "relative" }}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    required
                    autoComplete="current-password"
                    value={password}
                    onChange={e => setPassword(e.target.value)}
                    placeholder="••••••••"
                    style={{
                      width: "100%", padding: "11px 44px 11px 14px", borderRadius: "10px",
                      border: "1.5px solid #E5E7EB", fontSize: "14px", color: "#111827",
                      outline: "none", boxSizing: "border-box", transition: "border-color 0.2s",
                      background: "#F9FAFB"
                    }}
                    onFocus={e => e.target.style.borderColor = "#FF6B00"}
                    onBlur={e => e.target.style.borderColor = "#E5E7EB"}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(v => !v)}
                    style={{
                      position: "absolute", right: "12px", top: "50%", transform: "translateY(-50%)",
                      background: "none", border: "none", cursor: "pointer", color: "#9CA3AF", padding: 0
                    }}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                  >
                    {showPassword ? <EyeOff size={17} /> : <Eye size={17} />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                style={{
                  width: "100%", padding: "13px", borderRadius: "10px", border: "none",
                  fontSize: "15px", fontWeight: "700", color: "white", cursor: submitting ? "not-allowed" : "pointer",
                  background: submitting ? "#FFA366" : "linear-gradient(135deg, #FF6B00, #FF8C38)",
                  boxShadow: "0 6px 20px rgba(255,107,0,0.35)",
                  display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
                  transition: "all 0.2s"
                }}
              >
                {submitting && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
                {submitting ? "Signing in…" : "Sign In"}
              </button>
            </form>

            <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", marginTop: "20px" }}>
              Don't have an account?{" "}
              <Link to="/register" style={{ color: "#FF6B00", fontWeight: "600", textDecoration: "none" }}>
                Create one free
              </Link>
            </p>
          </div>

          <p style={{ textAlign: "center", marginTop: "20px" }}>
            <Link to="/" style={{ fontSize: "13px", color: "#9CA3AF", textDecoration: "none" }}>
              ← Back to homepage
            </Link>
          </p>
        </div>
      </div>

      <style>{`
        @media (min-width: 1024px) {
          .lg-panel { display: flex !important; }
        }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
