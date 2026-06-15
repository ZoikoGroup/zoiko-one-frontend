import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Loader2, Eye, EyeOff, AlertCircle } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import logo from "../assets/logo.png";

export default function RegisterPage() {
  const { register, error: authError } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({ name: "", organization: "", email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [localError, setLocalError] = useState(null);

  function update(field, value) {
    setForm((f) => ({ ...f, [field]: value }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setLocalError(null);
    setSubmitting(true);
    try {
      await register(form);
      navigate("/dashboard", { replace: true });
    } catch (err) {
      setLocalError(err.message || "Unable to create your account.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div style={{
      minHeight: "100vh", display: "flex", flexDirection: "column",
      alignItems: "center", justifyContent: "center",
      background: "linear-gradient(135deg, #fff7f0 0%, #ffffff 50%, #f0f4ff 100%)",
      fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, sans-serif",
      padding: "40px 24px"
    }}>
      <div style={{ width: "100%", maxWidth: "440px" }}>
        {/* Logo */}
        <div style={{ textAlign: "center", marginBottom: "36px" }}>
          <Link to="/">
            <img src={logo} alt="Zoiko One" style={{ height: "44px", width: "auto", objectFit: "contain", marginBottom: "24px", display: "inline-block" }} />
          </Link>
          <h1 style={{ fontSize: "26px", fontWeight: "800", color: "#111827", margin: "0 0 8px 0", letterSpacing: "-0.5px" }}>
            Create your account
          </h1>
          <p style={{ fontSize: "14px", color: "#6B7280", margin: 0 }}>
            Start with one product. Connect the business. Scale with Zoiko One.
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

          <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "18px" }}>
            <div>
              <label htmlFor="name" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Full name
              </label>
              <input
                id="name"
                type="text"
                required
                autoComplete="name"
                value={form.name}
                onChange={(e) => update("name", e.target.value)}
                placeholder="Jane Doe"
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
              <label htmlFor="organization" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Organization
              </label>
              <input
                id="organization"
                type="text"
                autoComplete="organization"
                value={form.organization}
                onChange={(e) => update("organization", e.target.value)}
                placeholder="Acme Inc."
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
              <label htmlFor="email" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Work email
              </label>
              <input
                id="email"
                type="email"
                required
                autoComplete="email"
                value={form.email}
                onChange={(e) => update("email", e.target.value)}
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
              <label htmlFor="password" style={{ display: "block", fontSize: "13px", fontWeight: "600", color: "#374151", marginBottom: "6px" }}>
                Password
              </label>
              <div style={{ position: "relative" }}>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  minLength={8}
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => update("password", e.target.value)}
                  placeholder="At least 8 characters"
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
                transition: "all 0.2s", marginTop: "8px"
              }}
            >
              {submitting && <Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} />}
              {submitting ? "Creating account…" : "Create account"}
            </button>
          </form>

          <p style={{ textAlign: "center", fontSize: "13px", color: "#6B7280", marginTop: "20px", marginBottom: 0 }}>
            Already have an account?{" "}
            <Link to="/login" style={{ color: "#FF6B00", fontWeight: "600", textDecoration: "none" }}>
              Sign in
            </Link>
          </p>
        </div>

        <p style={{ textAlign: "center", marginTop: "20px" }}>
          <Link to="/" style={{ fontSize: "13px", color: "#9CA3AF", textDecoration: "none" }}>
            ← Back to homepage
          </Link>
        </p>
      </div>

      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
}
