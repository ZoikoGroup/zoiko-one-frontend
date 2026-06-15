import { useState, useEffect } from "react";
import HRPage from "../../../components/HRPage";

const DEFAULT_SETTINGS = {
  default_currency: "USD",
  fiscal_year_start: "January",
  payroll_processing_day: 25,
  auto_calculate_ctc: true,
  bonus_threshold: 50000,
  increment_max_percent: 30,
  overtime_rate: 1.5,
  taxable_allowances: ["Housing", "Transport"],
  deduction_priorities: ["Tax", "Insurance", "Loan"],
  benefit_auto_enroll: true,
  approval_required: true,
};

const CURRENCY_OPTIONS = ["USD", "EUR", "GBP", "INR", "CAD", "AUD", "JPY", "CNY"];
const MONTH_OPTIONS = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

export default function CompensationSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [saved, setSaved] = useState(false);
  const [taxableInput, setTaxableInput] = useState("");
  const [deductionInput, setDeductionInput] = useState("");

  useEffect(() => {
    setLoading(true);
    setError(null);
    try {
      setTimeout(() => {
        setSettings({ ...DEFAULT_SETTINGS });
        setLoading(false);
      }, 300);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, []);

  const update = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleAddTaxable = () => {
    const val = taxableInput.trim();
    if (val && !settings.taxable_allowances.includes(val)) {
      update("taxable_allowances", [...settings.taxable_allowances, val]);
      setTaxableInput("");
    }
  };

  const handleRemoveTaxable = (idx) => {
    const updated = settings.taxable_allowances.filter((_, i) => i !== idx);
    update("taxable_allowances", updated);
  };

  const handleAddDeduction = () => {
    const val = deductionInput.trim();
    if (val && !settings.deduction_priorities.includes(val)) {
      update("deduction_priorities", [...settings.deduction_priorities, val]);
      setDeductionInput("");
    }
  };

  const handleRemoveDeduction = (idx) => {
    const updated = settings.deduction_priorities.filter((_, i) => i !== idx);
    update("deduction_priorities", updated);
  };

  const moveDeduction = (idx, dir) => {
    const arr = [...settings.deduction_priorities];
    const target = idx + dir;
    if (target < 0 || target >= arr.length) return;
    [arr[idx], arr[target]] = [arr[target], arr[idx]];
    update("deduction_priorities", arr);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  if (loading) {
    return (
      <HRPage title="Compensation Settings" subtitle="Configure compensation rules, calculations, and preferences.">
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading settings...</span>
        </div>
      </HRPage>
    );
  }

  if (!settings) return null;

  return (
    <HRPage title="Compensation Settings" subtitle="Configure compensation rules, calculations, and preferences.">
      <div className="space-y-6">
        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
            <span>{error}</span>
            <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
          </div>
        )}

        {saved && (
          <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg flex justify-between items-center">
            <span>Settings saved successfully.</span>
            <button onClick={() => setSaved(false)} className="text-green-500 hover:text-green-700 font-bold">&times;</button>
          </div>
        )}

        <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-6 space-y-6">
          <div>
            <h2 className="text-lg font-bold text-gray-800 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Currency</label>
                <select
                  value={settings.default_currency}
                  onChange={(e) => update("default_currency", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {CURRENCY_OPTIONS.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Fiscal Year Start</label>
                <select
                  value={settings.fiscal_year_start}
                  onChange={(e) => update("fiscal_year_start", e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  {MONTH_OPTIONS.map((m) => (
                    <option key={m} value={m}>{m}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Payroll Processing Day</label>
                <input
                  type="number"
                  min={1}
                  max={31}
                  value={settings.payroll_processing_day}
                  onChange={(e) => update("payroll_processing_day", parseInt(e.target.value) || 1)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Calculation Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700">Auto Calculate CTC</label>
                <button
                  onClick={() => update("auto_calculate_ctc", !settings.auto_calculate_ctc)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings.auto_calculate_ctc ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.auto_calculate_ctc ? "translate-x-5" : ""}`}></span>
                </button>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Bonus Threshold ($)</label>
                <input
                  type="number"
                  step="1000"
                  value={settings.bonus_threshold}
                  onChange={(e) => update("bonus_threshold", parseFloat(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Increment (%)</label>
                <input
                  type="number"
                  min={0}
                  max={100}
                  value={settings.increment_max_percent}
                  onChange={(e) => update("increment_max_percent", parseInt(e.target.value) || 0)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Overtime Rate (x)</label>
                <input
                  type="number"
                  step="0.1"
                  min={1}
                  value={settings.overtime_rate}
                  onChange={(e) => update("overtime_rate", parseFloat(e.target.value) || 1)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Tax Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Taxable Allowances</label>
              <div className="flex flex-wrap gap-2 mb-2">
                {settings.taxable_allowances.map((item, idx) => (
                  <span key={idx} className="inline-flex items-center gap-1 px-3 py-1 bg-blue-100 text-blue-700 text-xs font-medium rounded-full">
                    {item}
                    <button onClick={() => handleRemoveTaxable(idx)} className="text-blue-400 hover:text-blue-700">&times;</button>
                  </span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add allowance type..."
                  value={taxableInput}
                  onChange={(e) => setTaxableInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddTaxable(); } }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleAddTaxable} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Add</button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Deduction Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Deduction Priorities</label>
              <div className="space-y-2 mb-2">
                {settings.deduction_priorities.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded-lg">
                    <span className="text-xs text-gray-400 w-5 font-mono">{idx + 1}.</span>
                    <span className="flex-1 text-sm text-gray-700">{item}</span>
                    <div className="flex gap-1">
                      <button onClick={() => moveDeduction(idx, -1)} disabled={idx === 0} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-sm px-1">&uarr;</button>
                      <button onClick={() => moveDeduction(idx, 1)} disabled={idx === settings.deduction_priorities.length - 1} className="text-gray-400 hover:text-gray-600 disabled:opacity-30 text-sm px-1">&darr;</button>
                      <button onClick={() => handleRemoveDeduction(idx)} className="text-red-400 hover:text-red-600 text-sm px-1">&times;</button>
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Add deduction type..."
                  value={deductionInput}
                  onChange={(e) => setDeductionInput(e.target.value)}
                  onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); handleAddDeduction(); } }}
                  className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <button onClick={handleAddDeduction} className="px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">Add</button>
              </div>
            </div>
          </div>

          <div className="border-t border-gray-100 pt-6">
            <h2 className="text-lg font-bold text-gray-800 mb-4">Benefit Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700">Auto Enroll Benefits</label>
                <button
                  onClick={() => update("benefit_auto_enroll", !settings.benefit_auto_enroll)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings.benefit_auto_enroll ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.benefit_auto_enroll ? "translate-x-5" : ""}`}></span>
                </button>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <label className="text-sm font-medium text-gray-700">Approval Required for Changes</label>
                <button
                  onClick={() => update("approval_required", !settings.approval_required)}
                  className={`relative w-11 h-6 rounded-full transition-colors ${settings.approval_required ? "bg-blue-600" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-sm transition-transform ${settings.approval_required ? "translate-x-5" : ""}`}></span>
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            onClick={handleSave}
            className="px-6 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors"
          >
            Save Settings
          </button>
        </div>
      </div>
    </HRPage>
  );
}
