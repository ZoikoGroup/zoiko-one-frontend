import { ShieldCheck, Download, Clock, User, CheckCircle2, FileText } from "lucide-react";

const timeline = [
  { event: "Payroll Run PR-0042 Created", actor: "Meera Iyer (Payroll Manager)", time: "Jun 12 · 10:00 AM", icon: FileText, color: "bg-blue-500" },
  { event: "Calculations Completed", actor: "System (Auto)", time: "Jun 12 · 10:05 AM", icon: CheckCircle2, color: "bg-emerald-500" },
  { event: "Exceptions Flagged (7)", actor: "System (Auto)", time: "Jun 12 · 10:06 AM", icon: Clock, color: "bg-amber-500" },
  { event: "Exceptions Resolved", actor: "Meera Iyer", time: "Jun 12 · 11:30 AM", icon: CheckCircle2, color: "bg-emerald-500" },
  { event: "Submitted for Approval", actor: "Meera Iyer (Payroll Manager)", time: "Jun 12 · 11:45 AM", icon: User, color: "bg-indigo-500" },
  { event: "Finance Approval Pending", actor: "Rajesh Bose (Finance Approver)", time: "In Progress", icon: Clock, color: "bg-amber-500" },
];

const auditLogs = [
  { id: "LOG-0291", action: "Payroll run created", user: "Meera Iyer", time: "Jun 12 · 10:00 AM", ip: "192.168.1.42" },
  { id: "LOG-0292", action: "Employee bank detail viewed", user: "Meera Iyer", time: "Jun 12 · 10:15 AM", ip: "192.168.1.42" },
  { id: "LOG-0293", action: "Exception resolved — EXC-001", user: "Meera Iyer", time: "Jun 12 · 11:20 AM", ip: "192.168.1.42" },
  { id: "LOG-0294", action: "Exception resolved — EXC-002", user: "Meera Iyer", time: "Jun 12 · 11:28 AM", ip: "192.168.1.42" },
  { id: "LOG-0295", action: "Payroll submitted for approval", user: "Meera Iyer", time: "Jun 12 · 11:45 AM", ip: "192.168.1.42" },
];

export default function AuditCompliance() {
  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-600/10 via-slate-500/5 to-transparent border border-slate-500/15 p-7">
        <div className="flex items-center justify-between gap-4 flex-wrap">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-600 to-slate-800 flex items-center justify-center shadow-lg">
              <ShieldCheck size={20} className="text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold text-slate-800">
                Audit & Compliance
              </h1>
              <p className="text-slate-500 text-sm">
                Immutable audit trail for PR-0042
              </p>
            </div>
          </div>
          <button className="flex items-center gap-2 rounded-2xl bg-slate-800 px-5 py-2.5 text-sm font-semibold text-white shadow hover:bg-slate-700 transition">
            <Download size={14} /> Download Evidence Pack
          </button>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Audit Timeline */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <h2 className="text-base font-bold text-slate-800 mb-5">Audit Timeline</h2>
          <div className="space-y-0">
            {timeline.map((item, i) => (
              <div key={item.event} className="flex gap-4 pb-5 relative">
                {i < timeline.length - 1 && (
                  <div className="absolute left-4 top-9 bottom-0 w-0.5 bg-slate-100" />
                )}
                <div className={`h-8 w-8 rounded-xl flex-shrink-0 flex items-center justify-center ${item.color}`}>
                  <item.icon size={14} className="text-white" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800">{item.event}</p>
                  <p className="text-xs text-slate-500 mt-0.5">{item.actor}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5 font-mono">{item.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Evidence Pack + Audit Logs */}
        <div className="space-y-5">
          {/* Evidence Pack */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">Evidence Pack</h2>
            <p className="text-xs text-slate-500 mb-4">
              Download for compliance audits. Each document is cryptographically
              signed and timestamped.
            </p>
            <div className="space-y-2">
              {[
                "Payroll Snapshot (PR-0042)",
                "Calculation Explanations",
                "Approval Chain Log",
                "Payment Status Report",
                "Full Audit Log Export",
              ].map((doc) => (
                <div
                  key={doc}
                  className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5 hover:border-slate-300 transition"
                >
                  <div className="flex items-center gap-2">
                    <FileText size={13} className="text-slate-400" />
                    <span className="text-sm text-slate-700">{doc}</span>
                  </div>
                  <button className="rounded-lg p-1 text-slate-400 hover:text-slate-700 transition">
                    <Download size={13} />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Audit Logs */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <h2 className="text-base font-bold text-slate-800 mb-4">Audit Logs</h2>
            <div className="space-y-2">
              {auditLogs.map((log) => (
                <div key={log.id} className="rounded-xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-slate-400">{log.id}</span>
                    <span className="text-[10px] text-slate-400">{log.time}</span>
                  </div>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5">{log.action}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs text-slate-500">{log.user}</span>
                    <span className="text-[10px] text-slate-400 font-mono">{log.ip}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
