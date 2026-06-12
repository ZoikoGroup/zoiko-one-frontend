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
    setPassword("ZoikoAdmin!2026");
  };

  return (
    <form onSubmit={submit} className="space-y-5">
      {/* Tenant Slug Input */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 pl-1 font-sans">
          Tenant Organization
        </label>
        <div className="relative">
          <ShieldCheck className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="tenantSlug"
            type="text"
            value={tenantSlug}
            onChange={(e) => setTenantSlug(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#162032] pl-11 pr-4 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0b1220] focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-950/30 transition-all duration-200"
            required
            placeholder="e.g. zoiko-one"
          />
        </div>
      </div>

      {/* Email Input */}
      <div>
        <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 mb-1.5 pl-1 font-sans">
          Email Address
        </label>
        <div className="relative">
          <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#162032] pl-11 pr-4 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0b1220] focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-950/30 transition-all duration-200"
            required
            placeholder="name@company.com"
          />
        </div>
      </div>

      {/* Password Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5 pl-1">
          <label className="block text-[11px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 font-sans">
            Password
          </label>
          <button
            type="button"
            onClick={handleQuickFill}
            className="text-[11px] font-semibold text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          >
            Quick Fill Default
          </button>
        </div>
        <div className="relative">
          <Key className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            name="password"
            type={showPassword ? "text" : "password"}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-[#162032] pl-11 pr-12 text-sm text-slate-950 dark:text-white placeholder-slate-400 dark:placeholder-slate-500 outline-none focus:border-blue-600 dark:focus:border-blue-500 focus:bg-white dark:focus:bg-[#0b1220] focus:ring-4 focus:ring-blue-50 dark:focus:ring-blue-950/30 transition-all duration-200"
            required
            placeholder="••••••••"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
          >
            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
        </div>
      </div>

      {/* Remember me & Forgot Password */}
      <div className="flex items-center justify-between text-xs px-1">
        <label className="flex items-center gap-2 text-slate-500 dark:text-slate-400 cursor-pointer">
          <input
            type="checkbox"
            className="rounded border-slate-300 dark:border-slate-700 text-blue-600 dark:bg-[#162032] focus:ring-blue-500 h-4 w-4"
          />
          <span>Keep me signed in</span>
        </label>
        <a href="#" className="text-blue-600 dark:text-blue-400 hover:underline font-semibold">
          Forgot Password?
        </a>
      </div>

      {/* Error Message */}
      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-3.5 text-xs text-red-600 flex items-start gap-2.5">
          <div className="mt-0.5 rounded bg-red-100 p-1 text-red-600 shrink-0">
            <LogIn className="h-3 w-3" />
          </div>
          <span className="font-medium">{error}</span>
        </div>
      )}

      {/* Submit Button */}
      <button
        type="submit"
        disabled={pending}
        className="w-full h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-sm font-semibold text-white transition-all duration-200 shadow-sm flex items-center justify-center gap-2 hover:scale-[1.005] disabled:scale-100 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <LogIn className="h-4 w-4" />
        {pending ? "Signing In..." : "Sign In"}
      </button>
    </form>
  );
}