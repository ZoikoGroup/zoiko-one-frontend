import { useState } from "react";
import {
  PlayCircle,
  Plus,
  ChevronRight,
  Calendar,
  Users,
  CheckCircle2,
  Clock,
  XCircle,
  ArrowRight,
  RefreshCw,
} from "lucide-react";
import { usePayroll } from "../PayrollContext";

const statusConfig = {
  Draft: { color: "bg-slate-100 text-slate-600", dot: "bg-slate-400" },
  Review: { color: "bg-amber-100 text-amber-700", dot: "bg-amber-500" },
  Approved: { color: "bg-blue-100 text-blue-700", dot: "bg-blue-500" },
  Authorized: { color: "bg-violet-100 text-violet-700", dot: "bg-violet-500" },
  Paid: { color: "bg-emerald-100 text-emerald-700", dot: "bg-emerald-500" },
  Closed: { color: "bg-slate-200 text-slate-500", dot: "bg-slate-400" },
};

const lifecycleSteps = ["Draft", "Review", "Approved", "Authorized", "Paid", "Closed"];

export default function PayrollRuns() {
  const { runs, employees, exceptions, createRunDraft, addToast } = usePayroll();
  const [view, setView] = useState("list");
  const [selectedRun, setSelectedRun] = useState(null);
  const [createStep, setCreateStep] = useState(0);

  // Form states for creating a new run
  const [schedule, setSchedule] = useState("semi-monthly");
  const [periodStart, setPeriodStart] = useState("2026-06-01");
  const [periodEnd, setPeriodEnd] = useState("2026-06-15");
  const [payDate, setPayDate] = useState("2026-06-15");
  const [syncingTime, setSyncingTime] = useState(false);
  const [timeSynced, setTimeSynced] = useState(false);

  const createSteps = [
    "Select Pay Schedule",
    "Select Pay Period",
    "Import Time Data",
    "Validate Employees",
    "Create Draft",
  ];

  const handleSyncTime = () => {
    setSyncingTime(true);
    setTimeout(() => {
      setSyncingTime(false);
      setTimeSynced(true);
      addToast("Successfully synced attendance records from ZoikoTime!", "success");
    }, 1500);
  };

  const handleCreateRunDraftSubmit = () => {
    const periodText = `${new Date(periodStart).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
    })}–${new Date(periodEnd).toLocaleDateString("en-US", { day: "numeric", year: "numeric" })}`;
    
    createRunDraft(schedule, periodText, payDate);
    setView("list");
    setCreateStep(0);
    setTimeSynced(false);
  };

  if (view === "create") {
    return (
      <div className="p-6 space-y-6">
        <div className="flex items-center gap-3 mb-2">
          <button
            onClick={() => setView("list")}
            className="text-sm text-slate-500 hover:text-slate-700 flex items-center gap-1 font-medium"
          >
            ← Back to Runs
          </button>
        </div>
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/15 p-7">
          <h1 className="text-2xl font-extrabold text-slate-800">Create Payroll Run</h1>
          <p className="text-slate-500 text-sm mt-1">
            Follow the steps to generate a new payroll draft batch
          </p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center gap-0 overflow-x-auto py-2">
          {createSteps.map((step, i) => (
            <div key={step} className="flex items-center flex-1 min-w-[120px]">
              <div className="flex flex-col items-center gap-1.5 flex-1">
                <button
                  onClick={() => i <= createStep && setCreateStep(i)}
                  className={`h-9 w-9 rounded-full border-2 flex items-center justify-center text-xs font-bold transition-all ${
                    i < createStep
                      ? "bg-emerald-500 border-emerald-500 text-white"
                      : i === createStep
                      ? "bg-white border-emerald-400 text-emerald-600 shadow-md"
                      : "bg-white border-slate-200 text-slate-300"
                  }`}
                >
                  {i < createStep ? "✓" : i + 1}
                </button>
                <p className={`text-[10px] font-medium text-center leading-tight max-w-[90px] ${
                  i <= createStep ? "text-emerald-600 font-semibold" : "text-slate-400"
                }`}>
                  {step}
                </p>
              </div>
              {i < createSteps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-1 -mt-4 ${i < createStep ? "bg-emerald-400" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Step content */}
        <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm min-h-[220px]">
          {createStep === 0 && (
            <div className="space-y-3">
              <p className="font-semibold text-slate-700">Select Pay Schedule</p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Weekly", "Biweekly", "Semi-monthly", "Monthly"].map((s) => (
                  <button
                    key={s}
                    type="button"
                    onClick={() => setSchedule(s.toLowerCase())}
                    className={`rounded-2xl border px-4 py-3.5 text-sm font-semibold transition-all ${
                      schedule === s.toLowerCase()
                        ? "border-emerald-400 bg-emerald-50 text-emerald-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-350"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
          )}
          {createStep === 1 && (
            <div>
              <p className="font-semibold text-slate-700 mb-4">Select Pay Period Date Ranges</p>
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-medium">Period Start</label>
                  <input
                    type="date"
                    value={periodStart}
                    onChange={(e) => setPeriodStart(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-medium">Period End</label>
                  <input
                    type="date"
                    value={periodEnd}
                    onChange={(e) => setPeriodEnd(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block font-medium">Pay Date</label>
                  <input
                    type="date"
                    value={payDate}
                    onChange={(e) => setPayDate(e.target.value)}
                    className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm focus:outline-none focus:border-emerald-400 focus:ring-1 focus:ring-emerald-400"
                  />
                </div>
              </div>
            </div>
          )}
          {createStep === 2 && (
            <div className="space-y-4">
              <p className="font-semibold text-slate-700">Import Time & Attendance Data</p>
              {syncingTime ? (
                <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-8 flex flex-col items-center justify-center gap-3 text-slate-500">
                  <RefreshCw className="animate-spin text-emerald-500" size={24} />
                  <p className="text-sm font-medium">Syncing employee work logs and overtime hours...</p>
                </div>
              ) : timeSynced ? (
                <div className="rounded-2xl border border-emerald-250 bg-emerald-50/50 p-8 flex flex-col items-center justify-center gap-2 text-emerald-700">
                  <CheckCircle2 className="text-emerald-500" size={26} />
                  <p className="text-sm font-bold">Sync Completed!</p>
                  <p className="text-xs opacity-75">Imported time logs for {employees.length} employees</p>
                </div>
              ) : (
                <div
                  onClick={handleSyncTime}
                  className="rounded-2xl border-2 border-dashed border-slate-200 p-8 text-center text-slate-500 hover:border-emerald-400 hover:bg-emerald-50/30 transition-all cursor-pointer"
                >
                  <p className="text-sm font-medium">Click to synchronize and import from ZoikoTime</p>
                  <p className="text-xs mt-1 opacity-70">Overtime rules, holidays, and unpaid leave calculations will be loaded.</p>
                </div>
              )}
            </div>
          )}
          {createStep === 3 && (
            <div className="space-y-3">
              <p className="font-semibold text-slate-700">Validate Employees</p>
              <div className="flex items-center gap-2 p-3.5 rounded-xl bg-emerald-50 border border-emerald-100 text-sm text-emerald-700">
                <CheckCircle2 size={16} /> {employees.filter((e) => e.ready).length} employees successfully verified & ready
              </div>
              {employees.filter((e) => !e.ready).length > 0 && (
                <div className="flex items-center gap-2 p-3.5 rounded-xl bg-red-50 border border-red-100 text-sm text-red-700">
                  <XCircle size={16} /> {employees.filter((e) => !e.ready).length} employees have missing tax ID or bank accounts (leads to exceptions)
                </div>
              )}
            </div>
          )}
          {createStep === 4 && (
            <div className="space-y-3">
              <p className="font-semibold text-slate-700">Review Draft Parameters</p>
              {[
                { label: "Pay Schedule", val: schedule.toUpperCase() },
                { label: "Pay Period Range", val: `${periodStart} to ${periodEnd}` },
                { label: "Pay Release Date", val: payDate },
                { label: "Employees Evaluated", val: employees.length },
                { label: "Active Exceptions Pending", val: exceptions.length },
              ].map((f) => (
                <div key={f.label} className="flex justify-between text-sm py-2 border-b border-slate-50">
                  <span className="text-slate-400">{f.label}</span>
                  <span className="font-semibold text-slate-800">{f.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-between">
          <button
            onClick={() => setCreateStep(Math.max(0, createStep - 1))}
            disabled={createStep === 0}
            className="rounded-2xl border border-slate-200 px-5 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50 disabled:opacity-40 transition"
          >
            Back
          </button>
          {createStep < createSteps.length - 1 ? (
            <button
              onClick={() => {
                if (createStep === 2 && !timeSynced) {
                  addToast("Please sync with ZoikoTime before continuing.", "error");
                  return;
                }
                setCreateStep(createStep + 1);
              }}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow hover:shadow-lg hover:scale-[1.02] transition-all flex items-center gap-2"
            >
              Next <ArrowRight size={14} />
            </button>
          ) : (
            <button
              onClick={handleCreateRunDraftSubmit}
              className="rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-6 py-2.5 text-sm font-semibold text-white shadow hover:shadow-lg hover:scale-[1.02] transition-all"
            >
              Create Draft & Submit
            </button>
          )}
        </div>
      </div>
    );
  }

  if (selectedRun) {
    const stepIdx = lifecycleSteps.indexOf(selectedRun.status);
    return (
      <div className="p-6 space-y-5">
        <button
          onClick={() => setSelectedRun(null)}
          className="text-sm text-slate-500 hover:text-slate-700 font-semibold"
        >
          ← All Runs
        </button>

        {/* Run Header */}
        <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/15 p-6 flex items-center justify-between flex-wrap gap-4">
          <div>
            <p className="text-xs text-slate-500 font-mono font-bold">{selectedRun.id}</p>
            <h2 className="text-xl font-extrabold text-slate-800">{selectedRun.period}</h2>
            <p className="text-sm text-slate-500">Pay Date: {selectedRun.payDate}</p>
          </div>
          <span className={`rounded-full px-4 py-1.5 text-xs font-extrabold ${statusConfig[selectedRun.status]?.color}`}>
            {selectedRun.status}
          </span>
        </div>

        {/* Progress Bar */}
        <div className="flex items-center gap-0 bg-white rounded-3xl border border-slate-200 px-6 py-5 shadow-sm overflow-x-auto">
          {lifecycleSteps.map((step, i) => (
            <div key={step} className="flex items-center flex-1 min-w-[70px]">
              <div className="flex flex-col items-center gap-1 flex-1">
                <div className={`h-7 w-7 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                  i <= stepIdx ? "bg-emerald-500 border-emerald-500 text-white" : "bg-white border-slate-200 text-slate-300"
                }`}>
                  {i <= stepIdx ? "✓" : i + 1}
                </div>
                <p className={`text-[9px] font-bold ${i <= stepIdx ? "text-emerald-600" : "text-slate-400"}`}>{step}</p>
              </div>
              {i < lifecycleSteps.length - 1 && (
                <div className={`h-0.5 flex-1 mx-0.5 -mt-3 ${i < stepIdx ? "bg-emerald-400" : "bg-slate-200"}`} />
              )}
            </div>
          ))}
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
          {[
            { label: "Gross Pay", val: selectedRun.gross },
            { label: "Deductions", val: "₹12,40,000" },
            { label: "Taxes", val: "₹8,65,000" },
            { label: "Employer Cont.", val: "₹9,10,000" },
            { label: "Net Pay", val: selectedRun.net },
          ].map((c) => (
            <div key={c.label} className="bg-white border border-slate-200 rounded-2xl p-4 text-center shadow-sm">
              <p className="text-xs text-slate-400 mb-1">{c.label}</p>
              <p className="text-sm font-extrabold text-slate-800">{c.val}</p>
            </div>
          ))}
        </div>

        {/* Employee Grid */}
        <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-100">
            <h3 className="font-bold text-slate-800">Employee Payroll Grid</h3>
          </div>
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-100">
                {["Employee", "Gross Salary", "Taxes (TDS)", "Deductions (PF/ESI)", "Net Pay", "Variance"].map((h) => (
                  <th key={h} className="px-5 py-3 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {employees.map((row) => {
                const grossVal = row.salary;
                const taxVal = Math.round(grossVal * 0.1);
                const pfVal = Math.round(grossVal * 0.4 * 0.12);
                const esiVal = Math.round(grossVal * 0.0075);
                const ptVal = 200;
                const dedVal = pfVal + esiVal + ptVal;
                const netVal = grossVal - (taxVal + dedVal);
                const varianceText = row.status === "On Leave" ? "-1.5%" : "+0.8%";

                return (
                  <tr key={row.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-5 py-3.5 font-semibold text-slate-800">
                      <div>{row.name}</div>
                      <div className="text-[10px] text-slate-400 font-mono font-bold">{row.id}</div>
                    </td>
                    <td className="px-5 py-3.5 text-slate-700">₹{grossVal.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-mono">₹{taxVal.toLocaleString()}</td>
                    <td className="px-5 py-3.5 text-slate-700 font-mono">₹{dedVal.toLocaleString()}</td>
                    <td className="px-5 py-3.5 font-bold text-slate-850">₹{netVal.toLocaleString()}</td>
                    <td className="px-5 py-3.5">
                      <span className={`text-xs font-semibold ${varianceText.startsWith("+") ? "text-emerald-600" : "text-red-500"}`}>
                        {varianceText}
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

  return (
    <div className="p-6 space-y-5">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-emerald-500/10 via-teal-500/5 to-transparent border border-emerald-500/15 p-7 flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-600 flex items-center justify-center shadow-lg">
            <PlayCircle size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Payroll Runs</h1>
            <p className="text-slate-500 text-sm">{runs.length} total runs</p>
          </div>
        </div>
        <button
          onClick={() => { setView("create"); setCreateStep(0); }}
          className="flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          <Plus size={15} /> Create Run
        </button>
      </div>

      {/* Runs Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-100">
              {["Run ID", "Pay Period", "Pay Date", "Employees", "Gross Pay", "Net Pay", "Status", ""].map((h) => (
                <th key={h} className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {runs.map((run) => {
              const sc = statusConfig[run.status] || statusConfig.Draft;
              return (
                <tr
                  key={run.id}
                  onClick={() => setSelectedRun(run)}
                  className="hover:bg-slate-50 cursor-pointer transition-colors"
                >
                  <td className="px-5 py-4 font-mono text-xs text-slate-500 font-semibold">{run.id}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{run.period}</td>
                  <td className="px-5 py-4 text-slate-600">{run.payDate}</td>
                  <td className="px-5 py-4 text-slate-700">{run.employees.toLocaleString()}</td>
                  <td className="px-5 py-4 font-semibold text-slate-800">{run.gross}</td>
                  <td className="px-5 py-4 font-bold text-slate-800">{run.net}</td>
                  <td className="px-5 py-4">
                    <span className={`flex items-center gap-1.5 w-fit rounded-full px-2.5 py-0.5 text-xs font-bold ${sc.color}`}>
                      <span className={`h-1.5 w-1.5 rounded-full ${sc.dot}`} />
                      {run.status}
                    </span>
                  </td>
                  <td className="px-5 py-4 text-slate-400">
                    <ChevronRight size={15} />
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
