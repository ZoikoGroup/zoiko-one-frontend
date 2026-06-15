import { AlertTriangle, AlertCircle, CheckCircle2, RefreshCw } from "lucide-react";
import { usePayroll } from "../PayrollContext";

export default function Exceptions() {
  const { exceptions, resolveException, runs, setRuns, setCompanyDetails, addToast } = usePayroll();

  const activeBlocks = exceptions.filter((e) => e.type === "hard");
  const activeWarnings = exceptions.filter((e) => e.type === "warning");

  const handleProceedToApprovals = () => {
    if (runs[0]) {
      setRuns((prev) =>
        prev.map((r, i) => (i === 0 ? { ...r, status: "Review" } : r))
      );
      addToast("Exceptions cleared! Run status changed to 'Review'. Please head to Approvals tab.", "success");
    }
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-red-500/10 via-orange-500/5 to-transparent border border-red-500/15 p-7">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-red-500 to-orange-500 flex items-center justify-center shadow-lg">
            <AlertTriangle size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Exception Center</h1>
            <p className="text-slate-500 text-sm">
              {activeBlocks.length} hard blocks · {activeWarnings.length} warnings
            </p>
          </div>
        </div>
        {activeBlocks.length > 0 && (
          <div className="mt-4 flex items-center gap-2 rounded-2xl bg-red-100 border border-red-200 px-4 py-3 text-sm text-red-700 font-semibold">
            <AlertCircle size={15} />
            Payroll is blocked. Resolve all hard exceptions before proceeding.
          </div>
        )}
      </div>

      {/* Hard Blocks */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-red-500" />
          <h2 className="text-base font-bold text-slate-800">
            Hard Blocks — Payroll Stopped
          </h2>
          <span className="rounded-full bg-red-100 text-red-700 text-xs font-bold px-2.5 py-0.5">
            {activeBlocks.length}
          </span>
        </div>
        <div className="space-y-3">
          {activeBlocks.length === 0 ? (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700">
              <CheckCircle2 size={15} /> All hard blocks resolved!
            </div>
          ) : (
            activeBlocks.map((block) => (
              <div
                key={block.id}
                className="flex items-start gap-4 rounded-2xl border border-red-200 bg-red-50 p-5"
              >
                <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-red-100 flex items-center justify-center">
                  <AlertCircle size={16} className="text-red-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-red-400 font-bold">{block.id}</span>
                    <span className="font-bold text-slate-850 text-sm">{block.employee}</span>
                  </div>
                  <p className="text-sm font-semibold text-red-700">{block.issue}</p>
                  <p className="text-xs text-red-500 mt-0.5">{block.impact}</p>
                </div>
                <button
                  onClick={() => resolveException(block.id)}
                  className="flex-shrink-0 flex items-center gap-1.5 rounded-xl bg-red-650 text-white px-3 py-1.5 text-xs font-semibold hover:bg-red-700 transition shadow-sm"
                >
                  <RefreshCw size={12} /> Fix & Recalculate
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Warnings */}
      <div>
        <div className="flex items-center gap-2 mb-3">
          <div className="h-2.5 w-2.5 rounded-full bg-amber-500" />
          <h2 className="text-base font-bold text-slate-800">
            Warnings — Review Required
          </h2>
          <span className="rounded-full bg-amber-100 text-amber-700 text-xs font-bold px-2.5 py-0.5">
            {activeWarnings.length}
          </span>
        </div>
        <div className="space-y-3">
          {activeWarnings.length === 0 ? (
            <div className="flex items-center gap-2 rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700">
              <CheckCircle2 size={15} /> All warnings reviewed!
            </div>
          ) : (
            activeWarnings.map((warn) => (
              <div
                key={warn.id}
                className="flex items-start gap-4 rounded-2xl border border-amber-200 bg-amber-50 p-5"
              >
                <div className="h-9 w-9 flex-shrink-0 rounded-xl bg-amber-100 flex items-center justify-center">
                  <AlertTriangle size={16} className="text-amber-600" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-mono text-xs text-amber-400 font-bold">{warn.id}</span>
                    <span className="font-bold text-slate-800 text-sm">{warn.employee}</span>
                  </div>
                  <p className="text-sm font-semibold text-amber-700">{warn.issue}</p>
                  <p className="text-xs text-amber-500 mt-0.5">{warn.impact}</p>
                </div>
                <button
                  onClick={() => resolveException(warn.id)}
                  className="flex-shrink-0 rounded-xl border border-amber-300 bg-white text-amber-700 px-3 py-1.5 text-xs font-semibold hover:bg-amber-100 transition shadow-sm"
                >
                  Acknowledge
                </button>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Remediation Panel */}
      {activeBlocks.length === 0 && (
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 to-transparent border border-emerald-500/20 p-6 text-center">
          <CheckCircle2 size={40} className="text-emerald-500 mx-auto mb-3" />
          <p className="text-lg font-bold text-slate-800">All Exceptions Resolved</p>
          <p className="text-sm text-slate-500 mt-1">
            Payroll is ready to proceed to the Approvals stage.
          </p>
          <button
            onClick={handleProceedToApprovals}
            className="mt-4 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow hover:shadow-lg transition-all"
          >
            Proceed to Approvals →
          </button>
        </div>
      )}
    </div>
  );
}
