"use client";

import { LogIn, Key, Mail, ShieldCheck, Eye, EyeOff } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function LoginForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Form input states (controlled to allow easy credential filling)
  const [tenantSlug, setTenantSlug] = useState("zoiko-one");
  const [email, setEmail] = useState("admin@zoiko.one");
  const [password, setPassword] = useState("");

  async function submit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    setPending(true);
    setError(null);

    try {
      const payload = {
        tenantSlug,
        email,
        password,
      };

      const response = await fetch("/api/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const body = await response.json().catch(() => null);

      if (!response.ok) {
        setError(body?.error ?? "Unable to sign in. Please verify your credentials.");
        setPending(false);
        return;
      }

      router.push("/");
      router.refresh();
    } catch (err) {
      setError("Something went wrong while signing in.");
      setPending(false);
    }
  }

  // Pre-fill helper
  const handleQuickFill = () => {
    setTenantSlug("zoiko-one");
    setEmail("admin@zoiko.one");
    setPassword("admin123"); // Assuming default seed password is standard, or just pre-filling the fields
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Tenant Slug Input */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-1.5 pl-1 font-sans">
          Tenant Organization
        </label>
        <div className="relative">
          <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors" />
          <input
            name="tenantSlug"
            type="text"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            className="w-full h-12 rounded-2xl border border-slate-800 bg-slate-950/40 pl-11 pr-4 text-xs text-white outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
            required
            placeholder="e.g. zoiko-one"
          />
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 mb-1.5 pl-1 font-sans">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors" />
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-2xl border border-slate-800 bg-slate-950/40 pl-11 pr-4 text-xs text-white outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
            required
            placeholder="name@company.com"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5 pl-1">
          <label className="block text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500 font-sans">
            Password
          </label>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[10px] font-semibold text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            Quick Fill Default
          </button>
        </div>
        <div className="relative">
          <Key className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500 transition-colors" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-2xl border border-slate-800 bg-slate-950/40 pl-11 pr-12 text-xs text-white outline-none focus:border-indigo-500/80 focus:ring-1 focus:ring-indigo-500/50 transition-all duration-300"
            required
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-3.5 text-xs text-red-400 flex items-start gap-2.5">
          <div className="mt-0.5 rounded bg-red-500/20 p-1 text-red-400 shrink-0">
            <LogIn className="h-3 w-3" />
          </div>
          <span>{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="w-full h-12 rounded-2xl bg-indigo-650 hover:bg-indigo-600 active:bg-indigo-700 text-xs font-semibold text-white transition-all duration-300 shadow-lg shadow-indigo-650/15 flex items-center justify-center gap-2 hover:scale-[1.01] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogIn className="h-4 w-4" />
        {pending ? "Logging In..." : "Log In"}
      </button>
    </form>
  );
}