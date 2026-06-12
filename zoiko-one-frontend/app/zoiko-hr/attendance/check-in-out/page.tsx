"use client";

import { useState } from "react";
import { LogIn, LogOut, Search, X } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { checkInEmployee, checkOutEmployee } from "../../../lib/workforce-api";

export default function CheckInOutPage() {
  const [employeeId, setEmployeeId] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ type: "checkin" | "checkout"; message: string } | null>(null);
  const [error, setError] = useState("");

  const handleCheckIn = async () => {
    if (!employeeId.trim()) { setError("Please enter an Employee ID."); return; }
    setSubmitting(true); setError(""); setResult(null);
    try {
      await checkInEmployee(employeeId.trim());
      setResult({ type: "checkin", message: `Employee ${employeeId.trim()} checked in successfully.` });
      setEmployeeId("");
    } catch (err) { setError(err instanceof Error ? err.message : "Check-in failed."); }
    finally { setSubmitting(false); }
  };

  const handleCheckOut = async () => {
    if (!employeeId.trim()) { setError("Please enter an Employee ID."); return; }
    setSubmitting(true); setError(""); setResult(null);
    try {
      await checkOutEmployee(employeeId.trim());
      setResult({ type: "checkout", message: `Employee ${employeeId.trim()} checked out successfully.` });
      setEmployeeId("");
    } catch (err) { setError(err instanceof Error ? err.message : "Check-out failed."); }
    finally { setSubmitting(false); }
  };

  return (
    <SuperAdminShell>
      <PageHeader title="Check In / Out" description="Quick check-in and check-out for employees." />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">{error}</div>
      )}

      {result && (
        <div className={`mb-4 rounded-2xl ${result.type === "checkin" ? "bg-emerald-500/15 text-emerald-300 border-emerald-500/20" : "bg-amber-500/15 text-amber-300 border-amber-500/20"} px-5 py-3 text-sm font-medium border`}>
          {result.message}
          <button type="button" onClick={() => setResult(null)} className="ml-3 inline-flex"><X className="h-4 w-4" /></button>
        </div>
      )}

      <div className="mx-auto max-w-md rounded-[28px] border border-slate-800 bg-[#0b1220] p-8 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
        <div className="mb-6">
          <label className="block text-xs font-medium uppercase tracking-wider text-slate-400 mb-2">Employee ID</label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
            <input type="text" value={employeeId} onChange={(e) => setEmployeeId(e.target.value)}
              placeholder="Enter Employee ID..."
              className="w-full rounded-3xl border border-slate-800 bg-slate-950 py-3 pl-10 pr-4 text-sm text-white placeholder-slate-500 outline-none transition focus:border-indigo-500" />
          </div>
        </div>

        <div className="flex gap-4">
          <button type="button" onClick={handleCheckIn} disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-3xl bg-emerald-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-emerald-500 disabled:opacity-50">
            <LogIn className="h-4 w-4" /> {submitting ? "Processing..." : "Check In"}
          </button>
          <button type="button" onClick={handleCheckOut} disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 rounded-3xl bg-amber-600 px-5 py-3 text-sm font-medium text-white transition hover:bg-amber-500 disabled:opacity-50">
            <LogOut className="h-4 w-4" /> {submitting ? "Processing..." : "Check Out"}
          </button>
        </div>
      </div>
    </SuperAdminShell>
  );
}
