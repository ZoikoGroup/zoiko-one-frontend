import { CheckSquare, CheckCircle2, Clock, User, Shield } from "lucide-react";
import { usePayroll } from "../PayrollContext";

export default function Approvals() {
  const { approvalStages, approveStage, exceptions, runs, addToast } = usePayroll();

  const activeRun = runs[0] || {
    id: "PR-0042",
    period: "Jun 1–15, 2026",
    payDate: "2026-06-15",
    employees: 1248,
    gross: "₹84,23,000",
    net: "₹63,18,000",
    status: "Review",
  };

  const handleApprove = (idx) => {
    const hardExceptions = exceptions.filter((e) => e.type === "hard");
    if (hardExceptions.length > 0) {
      addToast("Approvals are blocked! Unresolved hard exceptions exist in the Exception Center.", "error");
      return;
    }
    approveStage(idx);
  };

  const allDone = approvalStages.every((s) => s.status === "done");

  const summaryData = [
    { label: "Run ID", val: activeRun.id },
    { label: "Pay Period", val: activeRun.period },
    { label: "Pay Date", val: activeRun.payDate },
    { label: "Employees Evaluated", val: activeRun.employees },
    { label: "Gross Payroll Cost", val: activeRun.gross },
    { label: "Total Deductions", val: "₹12,40,000" },
    { label: "Total Taxes Liability", val: "₹8,65,000" },
    { label: "Employer Contributions", val: "₹9,10,000" },
    { label: "Net Payout Amount", val: activeRun.net },
  ];

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 via-indigo-500/5 to-transparent border border-blue-500/15 p-7">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <CheckSquare size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Approvals — {activeRun.id}
            </h1>
            <p className="text-slate-500 text-sm">
              Dual-control governed approval workflow
            </p>
          </div>
        </div>
        <div className="mt-3 flex items-center gap-2 rounded-2xl bg-blue-50 border border-blue-100 px-4 py-2 text-xs text-blue-700 font-semibold w-fit">
          <Shield size={12} /> The same user cannot perform all approval actions. Dual control is mandatory.
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Payroll Summary (read-only) */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-4">
            Payroll Summary (Read-only)
          </h2>
          <div className="space-y-2">
            {summaryData.map((item) => (
              <div
                key={item.label}
                className="flex justify-between py-2 border-b border-slate-50 text-sm"
              >
                <span className="text-slate-400 font-medium">{item.label}</span>
                <span className="font-semibold text-slate-800">{item.val}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Approval Workflow */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-5">
            Approval Workflow
          </h2>
          <div className="space-y-4">
            {approvalStages.map((stage, i) => (
              <div
                key={stage.role}
                className={`rounded-2xl border p-4 transition-all duration-200 ${
                  stage.status === "done"
                    ? "bg-emerald-50 border-emerald-250"
                    : stage.status === "pending"
                    ? "bg-blue-50 border-blue-250 animate-pulse"
                    : "bg-slate-50 border-slate-200 opacity-60"
                }`}
              >
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex items-center gap-3">
                    <div
                      className={`h-9 w-9 rounded-xl flex items-center justify-center flex-shrink-0 ${
                        stage.status === "done"
                          ? "bg-emerald-500"
                          : stage.status === "pending"
                          ? "bg-blue-500"
                          : "bg-slate-350"
                      }`}
                    >
                      {stage.status === "done" ? (
                        <CheckCircle2 size={16} className="text-white" />
                      ) : stage.status === "pending" ? (
                        <Clock size={16} className="text-white" />
                      ) : (
                        <User size={16} className="text-white" />
                      )}
                    </div>
                    <div>
                      <p className="text-xs font-semibold text-slate-500">
                        {stage.role}
                      </p>
                      <p className="text-sm font-bold text-slate-800">
                        {stage.person}
                      </p>
                      {stage.time && (
                        <p className="text-[10px] text-slate-450 mt-0.5 font-mono">
                          {stage.time}
                        </p>
                      )}
                    </div>
                  </div>
                  {stage.status === "pending" && (
                    <button
                      onClick={() => handleApprove(i)}
                      className="rounded-xl bg-blue-600 text-white px-4 py-1.5 text-xs font-semibold hover:bg-blue-700 transition shadow"
                    >
                      {stage.action}
                    </button>
                  )}
                  {stage.status === "done" && (
                    <span className="text-xs text-emerald-600 font-bold">✓ Done</span>
                  )}
                  {stage.status === "locked" && (
                    <span className="text-xs text-slate-400 font-semibold">Locked</span>
                  )}
                </div>
              </div>
            ))}
          </div>

          {allDone && (
            <div className="mt-5 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 p-4 text-white text-center shadow-lg">
              <CheckCircle2 size={24} className="mx-auto mb-2" />
              <p className="font-bold">Payroll Fully Approved</p>
              <p className="text-xs opacity-90 mt-1">
                Payment release is now authorized. Go to the Payments page to release funds.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
