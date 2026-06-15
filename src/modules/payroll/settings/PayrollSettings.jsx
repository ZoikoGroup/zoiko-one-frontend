import { Settings, Bell, Shield, Globe } from "lucide-react";
import { usePayroll } from "../PayrollContext";

const Toggle = ({ on, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    className={`relative h-6 w-11 rounded-full transition-colors duration-200 focus:outline-none ${
      on ? "bg-emerald-500" : "bg-slate-300"
    }`}
  >
    <div
      className={`absolute top-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform duration-200 ${
        on ? "translate-x-5" : "translate-x-0.5"
      }`}
    />
  </button>
);

export default function PayrollSettings() {
  const { settings, setSettings, addToast } = usePayroll();

  const toggle = (key) => {
    setSettings((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    addToast("Payroll security and control parameters saved!", "success");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-slate-500/10 via-slate-400/5 to-transparent border border-slate-400/15 p-7">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-slate-500 to-slate-700 flex items-center justify-center shadow-lg">
            <Settings size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Payroll Settings</h1>
            <p className="text-slate-500 text-sm">Configure payroll behaviour and controls</p>
          </div>
        </div>
      </div>

      <div className="grid xl:grid-cols-2 gap-6">
        {/* Payroll Controls */}
        <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-5">
            <Shield size={16} className="text-slate-600" />
            <h2 className="text-base font-bold text-slate-800">Payroll Controls</h2>
          </div>
          <div className="space-y-4">
            {[
              { key: "offCycle", label: "Off-Cycle Payroll", desc: "Allow ad-hoc payroll runs outside schedule" },
              { key: "autoCalc", label: "Auto-calculate on Submit", desc: "Recalculate payroll on every submission" },
              { key: "dualControl", label: "Dual Control Approvals", desc: "Enforce multi-user approval workflow" },
              { key: "auditLog", label: "Immutable Audit Logging", desc: "Log all payroll actions permanently" },
              { key: "employeePayslip", label: "Employee Payslip Access", desc: "Allow employees to view their own payslips" },
            ].map((s) => (
              <div key={s.key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-55">
                <div>
                  <p className="text-sm font-semibold text-slate-705">{s.label}</p>
                  <p className="text-xs text-slate-400">{s.desc}</p>
                </div>
                <Toggle on={!!settings[s.key]} onToggle={() => toggle(s.key)} />
              </div>
            ))}
          </div>
        </div>

        {/* Notifications */}
        <div className="space-y-5">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Bell size={16} className="text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Notifications</h2>
            </div>
            <div className="space-y-4">
              {[
                { key: "emailNotifs", label: "Email Notifications", desc: "Send payroll alerts to approver emails" },
                { key: "slackNotifs", label: "Slack Alerts", desc: "Post payroll status to Slack channel" },
                { key: "aiAssistant", label: "AI Assistant", desc: "Enable AI explainer panel in payroll" },
              ].map((s) => (
                <div key={s.key} className="flex items-center justify-between gap-4 py-2 border-b border-slate-55">
                  <div>
                    <p className="text-sm font-semibold text-slate-705">{s.label}</p>
                    <p className="text-xs text-slate-400">{s.desc}</p>
                  </div>
                  <Toggle on={!!settings[s.key]} onToggle={() => toggle(s.key)} />
                </div>
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm">
            <div className="flex items-center gap-2 mb-5">
              <Globe size={16} className="text-slate-600" />
              <h2 className="text-base font-bold text-slate-800">Integrations</h2>
            </div>
            <div className="space-y-3">
              {[
                { name: "ZoikoPay", status: "Connected", color: "bg-emerald-100 text-emerald-700" },
                { name: "ZoikoTime", status: "Connected", color: "bg-emerald-100 text-emerald-700" },
                { name: "Zoiko HR", status: "Connected", color: "bg-emerald-100 text-emerald-700" },
                { name: "Tally ERP", status: "Not Connected", color: "bg-slate-100 text-slate-500" },
                { name: "QuickBooks", status: "Not Connected", color: "bg-slate-100 text-slate-500" },
              ].map((int) => (
                <div key={int.name} className="flex items-center justify-between rounded-xl border border-slate-100 bg-slate-50 px-4 py-2.5">
                  <span className="text-sm font-medium text-slate-700">{int.name}</span>
                  <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${int.color}`}>{int.status}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <button
          onClick={handleSave}
          className="rounded-2xl bg-gradient-to-r from-slate-600 to-slate-850 px-6 py-2.5 text-sm font-semibold text-white shadow hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          Save Settings
        </button>
      </div>
    </div>
  );
}
