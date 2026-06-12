"use client";

import Image from "next/image";
import { useState } from "react";
import LoginForm from "./LoginForm";
import { useTheme } from "../lib/ThemeContext";

export default function LoginPage() {
  const { theme, toggleTheme } = useTheme();
  const [servicesOpen, setServicesOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 }); // Default out of view

  const handleMouseMove = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  // List of Zoiko services for the header dropdown and showcase section
  const services = [
    {
      title: "Zoiko HR",
      desc: "Directory, org chart, applicant tracking, and workforce management.",
      iconBg: "bg-emerald-50 text-emerald-600",
      icon: "👥",
      color: "emerald",
    },
    {
      title: "Zoiko Pay",
      desc: "Automated payroll runs, taxes, deductions, and payment operations.",
      iconBg: "bg-blue-50 text-blue-600",
      icon: "💳",
      color: "blue",
    },
    {
      title: "Trust Center",
      desc: "Audit logs, compliance reports, tenant permissions, and RBAC governance.",
      iconBg: "bg-purple-50 text-purple-600",
      icon: "🛡️",
      color: "purple",
    },
    {
      title: "Core X",
      desc: "Workflow orchestrations, API tracking, configuration, and server health.",
      iconBg: "bg-amber-50 text-amber-600",
      icon: "⚙️",
      color: "amber",
    },
    {
      title: "Analytics",
      desc: "Interactive dashboards, growth charts, revenue monitoring, and KPIs.",
      iconBg: "bg-indigo-50 text-indigo-600",
      icon: "📊",
      color: "indigo",
    },
    {
      title: "Support Center",
      desc: "System ticketer, documentation, IT helpdesk, and user feedback.",
      iconBg: "bg-rose-50 text-rose-600",
      icon: "📞",
      color: "rose",
    },
  ];

  return (
    <main className="min-h-screen w-full flex flex-col bg-[#f8fafc] dark:bg-[#0a0f1c] overflow-y-auto relative scroll-smooth text-slate-800 dark:text-slate-100 font-sans transition-colors duration-300">
      
      {/* 1. Header Navigation Bar */}
      <header className="sticky top-0 z-50 w-full bg-white/95 dark:bg-[#0b1220]/95 backdrop-blur-md border-b border-slate-100 dark:border-slate-800 shadow-sm transition-colors duration-300">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-8">
            {/* Logo */}
            <a href="#" className="flex items-center gap-2">
              <Image
                src="/zoiko-logo.png"
                alt="Zoiko Logo"
                width={130}
                height={42}
                priority
                className={`h-auto w-auto transition-all duration-300 ${theme === "dark" ? "brightness-0 invert" : ""}`}
              />
            </a>

            {/* Navigation links */}
            <nav className="hidden md:flex items-center gap-6 relative">
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setServicesOpen(!servicesOpen)}
                  onMouseEnter={() => setServicesOpen(true)}
                  className="flex items-center gap-1.5 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors"
                >
                  Our Services
                  <svg className={`w-4 h-4 transition-transform duration-200 ${servicesOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>

                {/* Services Dropdown Mega Menu */}
                {servicesOpen && (
                  <div 
                    onMouseLeave={() => setServicesOpen(false)}
                    className="absolute left-0 mt-4 w-[480px] bg-white dark:bg-[#0b1220] rounded-2xl border border-slate-100 dark:border-slate-800 shadow-xl p-5 grid grid-cols-2 gap-4 z-50 animate-in fade-in slide-in-from-top-2 duration-200"
                  >
                    {services.map((svc, idx) => (
                      <a
                        key={idx}
                        href={`#${svc.title.toLowerCase().replace(" ", "-")}`}
                        onClick={() => setServicesOpen(false)}
                        className="flex gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/50 transition-colors group"
                      >
                        <div className={`w-9 h-9 rounded-lg ${svc.iconBg} dark:bg-slate-800 dark:text-blue-400 flex items-center justify-center font-bold text-sm shrink-0`}>
                          {svc.icon}
                        </div>
                        <div>
                          <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">{svc.title}</h4>
                          <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-normal">{svc.desc}</p>
                        </div>
                      </a>
                    ))}
                  </div>
                )}
              </div>
              
              <a href="#locations" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Locations</a>
              <a href="#contacts" className="text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">Contact Support</a>
            </nav>
          </div>

          <div className="flex items-center gap-4">
            <a href="tel:+442079460958" className="hidden lg:inline-flex text-xs font-bold text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 transition-colors">
              Sales: +44 20 7946 0958
            </a>
            <a
              href="#contacts"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-600 dark:text-slate-300 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-slate-50 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-all duration-200"
            >
              Get Help
            </a>
            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              title={theme === "dark" ? "Switch to light mode" : "Switch to dark mode"}
              className="relative inline-flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all duration-200"
            >
              {theme === "dark" ? (
                <span className="text-amber-500">☀️</span>
              ) : (
                <span className="text-indigo-500">🌙</span>
              )}
            </button>
          </div>
        </div>
      </header>

      {/* 2. Main Login Hero Section */}
      <section 
        onMouseMove={handleMouseMove}
        className="relative w-full py-16 md:py-24 px-6 bg-gradient-to-br from-[#eff6ff] via-white to-[#fef08a]/20 dark:from-[#0a1120] dark:via-[#0c1527] dark:to-[#171c26]/40 overflow-hidden border-b border-slate-100 dark:border-slate-800/80 transition-colors duration-300"
      >
        {/* Subtle Dots Grid Pattern */}
        <div 
          className="absolute inset-0 opacity-[0.25] dark:opacity-[0.15] pointer-events-none"
          style={{
            backgroundImage: "radial-gradient(#94a3b8 1.2px, transparent 1.2px)",
            backgroundSize: "24px 24px",
          }}
        />

        {/* Interactive Mouse Glow */}
        <div 
          className="absolute inset-0 pointer-events-none transition-opacity duration-300 opacity-100"
          style={{
            background: theme === "dark" 
              ? `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.08), transparent 85%)`
              : `radial-gradient(600px circle at ${mousePos.x}px ${mousePos.y}px, rgba(37, 99, 235, 0.07), transparent 85%)`,
          }}
        />
        
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-12 gap-12 items-center relative z-10">
          
          {/* Left Info Column */}
          <div className="md:col-span-7 space-y-8 max-w-xl text-center md:text-left">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50">
              ⚡ Zoiko One Global Dashboard
            </span>
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
              Unified Management & <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600 dark:from-blue-400 dark:to-indigo-400">
                Governance Portal
              </span>
            </h1>
            <p className="text-base text-slate-600 dark:text-slate-300 leading-relaxed">
              Log in to access complete multi-tenant operations. Securely manage personnel files, payroll workflows, audit logs, and API health across all organization accounts.
            </p>

            {/* Bullets */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm font-semibold text-slate-700 dark:text-slate-300 pt-2">
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <span className="text-blue-600 dark:text-blue-400 text-lg">✓</span> 100% Tenant Isolation
              </div>
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <span className="text-blue-600 dark:text-blue-400 text-lg">✓</span> SOC2 & ISO Compliance
              </div>
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <span className="text-blue-600 dark:text-blue-400 text-lg">✓</span> Role-Based Access Controls
              </div>
              <div className="flex items-center gap-2.5 justify-center md:justify-start">
                <span className="text-blue-600 dark:text-blue-400 text-lg">✓</span> Live Auditing Trails
              </div>
            </div>
          </div>

          {/* Right Login Card Column */}
          <div className="md:col-span-5 bg-white dark:bg-[#0b1220] p-8 sm:p-10 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-100/50 dark:shadow-none transition-colors duration-300">
            <div className="space-y-6">
              <div className="space-y-2 text-center md:text-left">
                <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Sign In</h2>
                <p className="text-xs text-slate-500 dark:text-slate-400">
                  Enter credentials below to enter your workspace
                </p>
              </div>

              {/* Login Form component */}
              <LoginForm />

              {/* Social Login Options */}
              <div className="space-y-4">
                <div className="relative flex items-center justify-center">
                  <div className="absolute inset-0 flex items-center">
                    <span className="w-full border-t border-slate-100 dark:border-slate-800" />
                  </div>
                  <span className="relative z-10 px-3 bg-white dark:bg-[#0b1220] text-[10px] text-slate-400 dark:text-slate-500 uppercase tracking-widest font-bold">
                    Or Sign in with
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-3">
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162032] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Sign in with Google"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                      <path
                        fill="#EA4335"
                        d="M12.24 10.285V14.4h6.887c-.648 2.41-2.519 4.114-5.186 4.114-3.518 0-6.386-2.87-6.386-6.39s2.868-6.39 6.386-6.39c1.62 0 3.097.61 4.237 1.62l3.1-3.1C19.29 2.43 15.96 1 12.24 1 5.866 1 .6 6.266.6 12.64s5.266 11.64 11.64 11.64c6.12 0 11.64-4.41 11.64-11.64 0-.693-.06-1.37-.18-2.036H12.24z"
                      />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162032] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Sign in with Microsoft"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 23 23">
                      <path fill="#f35325" d="M0 0h11v11H0z" />
                      <path fill="#81bc06" d="M12 0h11v11H12z" />
                      <path fill="#05a6f0" d="M0 12h11v11H0z" />
                      <path fill="#ffba08" d="M12 12h11v11H12z" />
                    </svg>
                  </button>
                  <button
                    type="button"
                    className="flex items-center justify-center py-2.5 border border-slate-200 dark:border-slate-800 bg-white dark:bg-[#162032] rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
                    title="Sign in with LinkedIn"
                  >
                    <svg className="w-5 h-5" fill="#0077b5" viewBox="0 0 24 24">
                      <path d="M22.23 0H1.77C.8 0 0 .77 0 1.72v20.56C0 23.23.8 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.2 0 22.23 0zM7.12 20.45H3.56V9H7.12v11.45zM5.34 7.43c-1.14 0-2.06-.92-2.06-2.06 0-1.14.92-2.06 2.06-2.06 1.14 0 2.06.92 2.06 2.06 0 1.14-.92 2.06-2.06 2.06zm15.11 13.02h-3.56v-5.6c0-1.34-.03-3.05-1.86-3.05-1.86 0-2.14 1.45-2.14 2.95v5.7H9.33V9h3.42v1.56h.05c.48-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.45v6.29z" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. Detailed Services Showcase Grid (Scroll Down) */}
      <section className="w-full py-24 px-6 bg-slate-50 dark:bg-[#0b1220]/60 border-b border-slate-100 dark:border-slate-800 transition-colors duration-300">
        <div className="max-w-7xl mx-auto space-y-16">
          <div className="max-w-xl mx-auto text-center space-y-4">
            <h2 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              Our Suite of Modules
            </h2>
            <p className="text-base text-slate-500 dark:text-slate-400">
              Each module fits modularly together, giving you full control over compliance, security, workflows, and workforce files.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((svc, idx) => (
              <div
                key={idx}
                id={svc.title.toLowerCase().replace(" ", "-")}
                className="bg-white dark:bg-[#111827] rounded-3xl border border-slate-200/80 dark:border-slate-800 p-8 shadow-sm hover:shadow-xl dark:hover:shadow-indigo-500/5 hover:border-blue-400/30 dark:hover:border-indigo-400/30 hover:-translate-y-2 hover:scale-[1.03] transition-all duration-300 ease-out group flex flex-col justify-between transform cursor-pointer"
              >
                <div className="space-y-5">
                  <div className={`w-12 h-12 rounded-2xl ${svc.iconBg} dark:bg-slate-800 dark:text-blue-400 flex items-center justify-center text-xl font-bold`}>
                    {svc.icon}
                  </div>
                  <div className="space-y-2">
                    <h3 className="text-lg font-bold text-slate-800 dark:text-slate-200 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                      {svc.title}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed">
                      {svc.desc}
                    </p>
                  </div>
                </div>
                <div className="pt-6 border-t border-slate-50 dark:border-slate-800 mt-6 flex items-center justify-between">
                  <span className="text-xs font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider">
                    Learn More
                  </span>
                  <span className="text-slate-300 dark:text-slate-600 group-hover:translate-x-1.5 transition-transform duration-200">
                    →
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. Compliance & Security Banner */}
      <section className="w-full py-16 px-6 bg-[#0f172a] text-white overflow-hidden relative">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-blue-900/40 via-transparent to-transparent opacity-65 pointer-events-none" />
        <div className="max-w-5xl mx-auto text-center space-y-8 relative z-10">
          <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            Security & Operations Governance You Can Trust
          </h2>
          <p className="text-slate-400 max-w-2xl mx-auto text-sm leading-relaxed">
            Every audit event is recorded, every log stored immutably. We implement strict tenant row-level policies, OAuth 2.0 verification layers, and real-time security alerts.
          </p>
          <div className="flex flex-wrap justify-center items-center gap-8 text-xs font-bold tracking-widest text-slate-400 uppercase">
            <span className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">🛡️ SOC 2 Compliant</span>
            <span className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">🔒 GDPR Standard</span>
            <span className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">⚙️ ISO 27001</span>
            <span className="px-4 py-2 rounded-xl bg-slate-800/50 border border-slate-700/50">⚡ Immutable Audits</span>
          </div>
        </div>
      </section>

      {/* 5. Footer with Office Locations & Contact Details */}
      <footer id="contacts" className="w-full bg-[#0a0f1d] text-slate-400 pt-16 pb-12 px-6 border-t border-slate-900">
        <div className="max-w-7xl mx-auto space-y-12">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
            
            {/* Column 1: Brand Info */}
            <div className="space-y-4">
              <Image
                src="/zoiko-logo.png"
                alt="Zoiko Logo"
                width={130}
                height={42}
                priority
                className="h-auto w-auto brightness-0 invert"
              />
              <p className="text-xs leading-relaxed text-slate-500">
                Zoiko One is an enterprise modular system orchestrating human resources, payroll computation, organizational compliance, and system health checks.
              </p>
              <div className="flex items-center gap-3 text-slate-500 pt-2">
                <a href="#" className="hover:text-blue-500 transition-colors">🌐 Website</a>
                <span className="text-slate-700">•</span>
                <a href="#" className="hover:text-blue-500 transition-colors">💼 LinkedIn</a>
                <span className="text-slate-700">•</span>
                <a href="#" className="hover:text-blue-500 transition-colors">💬 Support</a>
              </div>
            </div>

            {/* Column 2: Office Locations */}
            <div id="locations" className="space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Office Locations</h4>
              <ul className="space-y-3 leading-relaxed">
                <li>
                  <strong className="text-slate-300 block">London Headquarters</strong>
                  12th Floor, The Shard, 32 London Bridge St, London SE1 9SG, UK
                </li>
                <li>
                  <strong className="text-slate-300 block">San Francisco Office</strong>
                  101 California St, Suite 1600, San Francisco, CA 94111, USA
                </li>
                <li>
                  <strong className="text-slate-300 block">Bangalore Tech Hub</strong>
                  RMZ Ecoworld, Outer Ring Rd, Devarabisanahalli, Bangalore 560103, India
                </li>
              </ul>
            </div>

            {/* Column 3: Contact & Support info */}
            <div className="space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Contact Details</h4>
              <ul className="space-y-3">
                <li>
                  <strong className="text-slate-300 block">System Helpdesk</strong>
                  <a href="mailto:support@zoiko.one" className="text-blue-500 hover:underline">support@zoiko.one</a>
                </li>
                <li>
                  <strong className="text-slate-300 block">Corporate Support</strong>
                  <a href="mailto:help@zoiko.one" className="text-blue-500 hover:underline">help@zoiko.one</a>
                </li>
                <li>
                  <strong className="text-slate-300 block">Support Phone Lines</strong>
                  UK: <a href="tel:+442079460958" className="hover:text-white transition-colors">+44 20 7946 0958</a> <br />
                  US: <a href="tel:+14155552671" className="hover:text-white transition-colors">+1 (415) 555-2671</a>
                </li>
              </ul>
            </div>

            {/* Column 4: Links */}
            <div className="space-y-4 text-xs">
              <h4 className="text-sm font-bold text-white uppercase tracking-wider">Quick Navigation</h4>
              <ul className="space-y-2 font-semibold">
                <li><a href="#zoiko-hr" className="hover:text-white transition-colors">Zoiko HR</a></li>
                <li><a href="#zoiko-pay" className="hover:text-white transition-colors">Zoiko Pay</a></li>
                <li><a href="#trust-center" className="hover:text-white transition-colors">Trust Center</a></li>
                <li><a href="#core-x" className="hover:text-white transition-colors">Core X</a></li>
                <li><a href="#analytics" className="hover:text-white transition-colors">Analytics & Insights</a></li>
                <li><a href="#support-center" className="hover:text-white transition-colors">Help & Ticket Desk</a></li>
              </ul>
            </div>

          </div>

          <div className="pt-8 border-t border-slate-900/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-600 gap-4">
            <span>© 2026 Zoiko Group. All rights reserved.</span>
            <div className="flex gap-6">
              <a href="#" className="hover:underline">Privacy Policy</a>
              <a href="#" className="hover:underline">Terms of Service</a>
              <a href="#" className="hover:underline">Cookie Settings</a>
              <a href="#" className="hover:underline">Security Disclosures</a>
            </div>
          </div>

        </div>
      </footer>

    </main>
  );
}


