import { useState } from "react";
import {
  Building2,
  CheckCircle2,
  AlertCircle,
  Globe,
  CreditCard,
  Settings2,
  ChevronRight,
} from "lucide-react";
import { usePayroll } from "../PayrollContext";

const tabs = ["Company Info", "Payroll Config", "Bank & Funding", "Jurisdiction", "Checklist"];

export default function CompanySetup() {
  const [tab, setTab] = useState(0);
  const { companyDetails, setCompanyDetails, checklist, addToast } = usePayroll();

  const doneCount = checklist.filter((c) => c.done).length;
  const pct = Math.round((doneCount / checklist.length) * 100);

  const handleInputChange = (field, value) => {
    setCompanyDetails((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    addToast("Company configuration saved successfully!", "success");
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-blue-500/10 via-cyan-500/5 to-transparent border border-blue-500/15 p-7">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg">
            <Building2 size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">Company Setup</h1>
            <p className="text-slate-500 text-sm">
              Configure your organisation before running payroll
            </p>
          </div>
        </div>

        {/* Setup progress */}
        <div className="mt-4 flex items-center gap-3">
          <div className="flex-1 h-2 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full transition-all duration-500"
              style={{ width: `${pct}%` }}
            />
          </div>
          <span className="text-xs font-semibold text-slate-600">{pct}% complete</span>
        </div>
        {pct < 100 && (
          <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
            <AlertCircle size={12} /> Payroll is blocked until setup is 100% complete (please verify settlement account details).
          </p>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-slate-100 rounded-2xl p-1 w-fit flex-wrap">
        {tabs.map((t, i) => (
          <button
            key={t}
            onClick={() => setTab(i)}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              tab === i
                ? "bg-white text-blue-700 shadow-sm"
                : "text-slate-600 hover:text-slate-800"
            }`}
          >
            {t}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      <div className="bg-white rounded-3xl border border-slate-200 p-6 shadow-sm">
        {/* Company Info */}
        {tab === 0 && (
          <div className="grid md:grid-cols-2 gap-5">
            {[
              { label: "Company Name", field: "name", type: "text" },
              { label: "Legal Entity Type", field: "type", type: "text" },
              { label: "Tax Registration No. (PAN/TAN)", field: "taxNo", type: "text" },
              { label: "Employer ID", field: "employerId", type: "text" },
              { label: "Registered Address", field: "address", type: "text" },
              { label: "Industry", field: "industry", type: "text" },
            ].map((f) => (
              <div key={f.field}>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  {f.label}
                </label>
                <input
                  type={f.type}
                  value={companyDetails[f.field] || ""}
                  onChange={(e) => handleInputChange(f.field, e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                />
              </div>
            ))}
          </div>
        )}

        {/* Payroll Config */}
        {tab === 1 && (
          <div className="space-y-5">
            <div>
              <p className="text-sm font-semibold text-slate-700 mb-3">
                Payroll Schedule
              </p>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {["Weekly", "Biweekly", "Semi-monthly", "Monthly"].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleInputChange("schedule", s.toLowerCase())}
                    className={`rounded-2xl border px-4 py-3 text-sm font-medium transition-all ${
                      companyDetails.schedule === s.toLowerCase()
                        ? "border-blue-400 bg-blue-50 text-blue-700"
                        : "border-slate-200 bg-slate-50 text-slate-600 hover:border-slate-300"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Pay Date Rule
                </label>
                <select
                  value={companyDetails.payDateRule}
                  onChange={(e) => handleInputChange("payDateRule", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
                >
                  <option>Last working day of month</option>
                  <option>Fixed day (28th)</option>
                  <option>First day of next month</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-slate-500 mb-1">
                  Off-Cycle Payroll
                </label>
                <select
                  value={companyDetails.offCyclePayroll}
                  onChange={(e) => handleInputChange("offCyclePayroll", e.target.value)}
                  className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400"
                >
                  <option>Enabled</option>
                  <option>Disabled</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Bank & Funding */}
        {tab === 2 && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { label: "Payroll Funding Bank", field: "bankName", type: "text" },
                { label: "Funding Account Number", field: "bankAcc", type: "text" },
                { label: "Settlement Bank", field: "settlementBank", type: "text" },
                { label: "Settlement Account Number", field: "settlementAcc", type: "text" },
              ].map((f) => (
                <div key={f.field}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={companyDetails[f.field] || ""}
                    onChange={(e) => handleInputChange(f.field, e.target.value)}
                    placeholder={f.label.includes("Settlement") ? "Enter to verify account" : ""}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
              ))}
            </div>
            {!(companyDetails.settlementBank && companyDetails.settlementAcc) ? (
              <div className="rounded-2xl bg-amber-50 border border-amber-100 p-4 text-sm text-amber-700 flex items-start gap-2">
                <AlertCircle size={15} className="mt-0.5 flex-shrink-0 text-amber-500" />
                Bank account verification pending. Settlement account details must be filled to unblock payroll release.
              </div>
            ) : (
              <div className="rounded-2xl bg-emerald-50 border border-emerald-100 p-4 text-sm text-emerald-700 flex items-start gap-2">
                <CheckCircle2 size={15} className="mt-0.5 flex-shrink-0 text-emerald-500" />
                Bank details successfully validated and verified.
              </div>
            )}
          </div>
        )}

        {/* Jurisdiction */}
        {tab === 3 && (
          <div className="space-y-5">
            <div className="grid md:grid-cols-2 gap-5">
              {[
                { label: "Country", field: "jurisdictionCountry", type: "text" },
                { label: "State / UT", field: "jurisdictionState", type: "text" },
                { label: "Compliance Pack", field: "compliancePack", type: "text" },
              ].map((f) => (
                <div key={f.field}>
                  <label className="block text-xs font-semibold text-slate-500 mb-1">
                    {f.label}
                  </label>
                  <input
                    type={f.type}
                    value={companyDetails[f.field] || ""}
                    onChange={(e) => handleInputChange(f.field, e.target.value)}
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm text-slate-800 focus:outline-none focus:border-blue-400 focus:bg-white transition"
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Checklist */}
        {tab === 4 && (
          <div className="space-y-3">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-semibold text-slate-700">
                Readiness Checklist ({doneCount}/{checklist.length} complete)
              </p>
              <span
                className={`text-xs font-bold px-3 py-1 rounded-full ${
                  pct === 100
                    ? "bg-emerald-100 text-emerald-700"
                    : "bg-amber-100 text-amber-700"
                }`}
              >
                {pct === 100 ? "Ready" : "Incomplete"}
              </span>
            </div>
            {checklist.map((item) => (
              <div
                key={item.label}
                className={`flex items-center gap-3 p-4 rounded-2xl border text-sm ${
                  item.done
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-red-50 border-red-100 text-red-700"
                }`}
              >
                {item.done ? (
                  <CheckCircle2 size={16} className="text-emerald-500 flex-shrink-0" />
                ) : (
                  <AlertCircle size={16} className="text-red-400 flex-shrink-0" />
                )}
                {item.label}
              </div>
            ))}
          </div>
        )}

        {/* Save button */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={handleSave}
            className="rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-500 px-6 py-2.5 text-sm font-semibold text-white shadow-md hover:shadow-lg hover:scale-[1.02] transition-all duration-200"
          >
            Save Changes
          </button>
        </div>
      </div>
    </div>
  );
}
