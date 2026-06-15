import { useState } from "react";
import { CreditCard, CheckCircle2, Clock, AlertCircle, RefreshCw } from "lucide-react";
import { usePayroll } from "../PayrollContext";

const statusConfig = {
  Pending: { color: "bg-amber-100 text-amber-700", icon: Clock },
  Processing: { color: "bg-blue-100 text-blue-700", icon: RefreshCw },
  Paid: { color: "bg-emerald-100 text-emerald-700", icon: CheckCircle2 },
  Failed: { color: "bg-red-100 text-red-700", icon: AlertCircle },
  Reversed: { color: "bg-slate-100 text-slate-500", icon: RefreshCw },
};

export default function Payments() {
  const { paymentBatches, releasePayments, runs, addToast } = usePayroll();

  const activeRun = runs[0] || {
    id: "PR-0042",
    status: "Review",
    gross: "₹84,23,000",
    net: "₹63,18,000",
  };

  const activeBatch = paymentBatches[0] || {
    id: "PB-0042",
    run: "PR-0042",
    employees: 1248,
    amount: "₹63,18,000",
    status: "Pending",
  };

  const handleRelease = () => {
    if (activeRun.status !== "Authorized") {
      addToast(
        `Release blocked! Payroll run ${activeRun.id} status is '${activeRun.status}'. It must be 'Authorized' before release.`,
        "error"
      );
      return;
    }
    if (activeBatch.status !== "Pending") {
      addToast(`Payment batch is already in '${activeBatch.status}' state.`, "info");
      return;
    }
    releasePayments(activeBatch.id);
  };

  const isAuthorized = activeRun.status === "Authorized" || activeRun.status === "Paid" || activeRun.status === "Closed";

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-cyan-500/10 via-teal-500/5 to-transparent border border-cyan-500/15 p-7">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-cyan-500 to-teal-600 flex items-center justify-center shadow-lg">
            <CreditCard size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Payments</h1>
            <p className="text-slate-500 text-sm">
              ZoikoPay-integrated payment batches
            </p>
          </div>
        </div>
      </div>

      {/* Funding Verification */}
      <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
        <h2 className="text-base font-bold text-slate-800 mb-4">
          Funding Verification — {activeRun.id}
        </h2>
        <div className="grid md:grid-cols-3 gap-4">
          {[
            {
              label: "Available Corporate Funds",
              val: "₹1,24,50,000",
              ok: true,
              sub: "HDFC Bank ****4821",
            },
            {
              label: "Required Payout Funds",
              val: activeRun.net,
              ok: true,
              sub: `${activeRun.id} Net Pay Total`,
            },
            {
              label: "Authorization Status",
              val: isAuthorized ? "Authorized" : "Blocked",
              ok: isAuthorized,
              sub: isAuthorized ? "Ready to release" : "Awaiting approval workflow completion",
            },
          ].map((item) => (
            <div
              key={item.label}
              className={`rounded-2xl border p-4 ${
                item.ok
                  ? "bg-emerald-50 border-emerald-250"
                  : "bg-red-50 border-red-250"
              }`}
            >
              <p className="text-xs text-slate-400 font-medium">{item.label}</p>
              <p className="text-xl font-extrabold text-slate-800 mt-1">{item.val}</p>
              <p className="text-xs text-slate-500 mt-1">{item.sub}</p>
              {item.ok ? (
                <CheckCircle2 size={15} className="text-emerald-500 mt-2" />
              ) : (
                <AlertCircle size={15} className="text-red-500 mt-2" />
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Payment Batches */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between">
          <h3 className="font-bold text-slate-800">Payment Batches</h3>
          {activeBatch.status === "Pending" && (
            <button
              onClick={handleRelease}
              className={`rounded-xl px-4 py-1.5 text-xs font-semibold text-white shadow transition-all ${
                isAuthorized
                  ? "bg-gradient-to-r from-cyan-500 to-teal-500 hover:shadow-md hover:scale-[1.02]"
                  : "bg-slate-350 cursor-not-allowed opacity-60"
              }`}
            >
              Release Payments
            </button>
          )}
        </div>
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Batch ID", "Payroll Run", "Employees", "Total Amount", "Created", "Status"].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-55">
            {paymentBatches.map((batch) => {
              const sc = statusConfig[batch.status] || statusConfig.Pending;
              const Icon = sc.icon;
              return (
                <tr key={batch.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 font-mono text-xs font-bold text-slate-500">
                    {batch.id}
                  </td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{batch.run}</td>
                  <td className="px-5 py-4 text-slate-700">
                    {batch.employees.toLocaleString()}
                  </td>
                  <td className="px-5 py-4 font-bold text-slate-800">{batch.amount}</td>
                  <td className="px-5 py-4 text-slate-500">{batch.created}</td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 text-xs font-semibold ${sc.color}`}>
                      <Icon size={11} className={batch.status === "Processing" ? "animate-spin" : ""} />
                      {batch.status}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
