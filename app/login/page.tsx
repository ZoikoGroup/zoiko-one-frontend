"use client";

import LoginForm from "./LoginForm";
import { Sparkles } from "lucide-react";

export default function LoginPage() {
  return (
    <main className="relative min-h-screen w-full overflow-hidden bg-[#070b19] flex items-center justify-center p-4">
      {/* Background Decorative Gradients */}
      <div className="absolute top-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-500/10 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-indigo-600/10 blur-[120px] pointer-events-none" />
      
      {/* Centered Glass Card */}
      <section className="relative z-10 w-full max-w-[440px] rounded-[32px] border border-slate-800/60 bg-[#0c1328]/50 p-8 shadow-2xl backdrop-blur-xl transition-all duration-300 hover:border-slate-850">
        <div className="flex flex-col items-center text-center">
          {/* Logo Icon */}
          <div className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-indigo-600/10 border border-indigo-500/20 text-indigo-400 mb-4 shadow-lg shadow-indigo-500/5">
            <Sparkles className="h-6 w-6" />
          </div>
          
          <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-indigo-400 font-sans">Zoiko One Platform</p>
          <h1 className="mt-2 text-2xl font-bold tracking-tight text-white">Enterprise Login</h1>
          <p className="mt-2 text-xs text-slate-400 leading-relaxed max-w-[320px]">
            Tenant-aware access for platform governance, audit logs, and operations.
          </p>
        </div>

        <div className="mt-8">
          <LoginForm />
        </div>
      </section>
    </main>
  );
}
