import { useState, useEffect } from "react";
import { getSettings, updateSettings } from "../../service/insightsService";
import { SlidersHorizontal, Bell, Clock, Download, Eye, Moon, Sun } from "lucide-react";

export default function InsightsSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    getSettings().then((data) => {
      setSettings(data);
      setLoading(false);
    }).catch(() => setLoading(false));
  }, []);

  if (loading || !settings) {
    return <div className="flex items-center justify-center h-64"><div className="animate-spin w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full" /></div>;
  }

  const handleToggle = (key) => {
    setSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleChange = (key, value) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateSettings(settings);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (e) {
      // Silent
    }
    setSaving(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Insights Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure insights module preferences and defaults</p>
        </div>
        <div className="flex items-center gap-3">
          {saved && <span className="text-sm text-emerald-600 font-medium">Settings saved!</span>}
          <button
            onClick={handleSave}
            disabled={saving}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Settings"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-5">
          <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2"><SlidersHorizontal className="w-4 h-4" /> Report Defaults</h3>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Export Format</label>
            <select value={settings.reportDefaults?.format || "pdf"} onChange={(e) => handleChange("reportDefaults", { ...settings.reportDefaults, format: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
              <option value="pdf">PDF</option>
              <option value="excel">Excel</option>
              <option value="csv">CSV</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Report Frequency</label>
            <select value={settings.reportDefaults?.frequency || "monthly"} onChange={(e) => handleChange("reportDefaults", { ...settings.reportDefaults, frequency: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Default Time Range</label>
            <select value={settings.reportDefaults?.timeRange || "12months"} onChange={(e) => handleChange("reportDefaults", { ...settings.reportDefaults, timeRange: e.target.value })} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none">
              <option value="30days">Last 30 Days</option>
              <option value="90days">Last 90 Days</option>
              <option value="6months">Last 6 Months</option>
              <option value="12months">Last 12 Months</option>
              <option value="custom">Custom Range</option>
            </select>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2"><Bell className="w-4 h-4" /> Notifications</h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Email Notifications</p>
                <p className="text-xs text-gray-500">Receive report generation and error notifications via email</p>
              </div>
              <button onClick={() => handleToggle("emailNotifications")} className={`relative w-11 h-6 rounded-full transition-colors ${settings.emailNotifications ? "bg-indigo-600" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.emailNotifications ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Weekly Digest</p>
                <p className="text-xs text-gray-500">Receive a weekly summary of key insights and metrics</p>
              </div>
              <button onClick={() => handleToggle("weeklyDigest")} className={`relative w-11 h-6 rounded-full transition-colors ${settings.weeklyDigest ? "bg-indigo-600" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.weeklyDigest ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2"><Download className="w-4 h-4" /> Data Management</h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Auto-archive Reports</p>
                <p className="text-xs text-gray-500">Automatically archive old reports after retention period</p>
              </div>
              <button onClick={() => handleToggle("autoArchive")} className={`relative w-11 h-6 rounded-full transition-colors ${settings.autoArchive ? "bg-indigo-600" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.autoArchive ? "translate-x-5" : ""}`} />
              </button>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1.5">Retention Period (days)</label>
              <input type="number" value={settings.retentionDays} onChange={(e) => handleChange("retentionDays", parseInt(e.target.value) || 90)} className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" min={30} max={365} />
            </div>
          </div>

          <div className="bg-white rounded-xl border border-gray-200 p-5 space-y-4">
            <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2"><Eye className="w-4 h-4" /> Chart Preferences</h3>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Chart Theme</p>
                <p className="text-xs text-gray-500">Choose between light and dark chart themes</p>
              </div>
              <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
                <button onClick={() => handleChange("chartPreferences", { ...settings.chartPreferences, theme: "light" })} className={`px-3 py-1.5 text-xs font-medium rounded-md ${settings.chartPreferences?.theme === "light" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                  <Sun className="w-3.5 h-3.5 inline mr-1" />Light
                </button>
                <button onClick={() => handleChange("chartPreferences", { ...settings.chartPreferences, theme: "dark" })} className={`px-3 py-1.5 text-xs font-medium rounded-md ${settings.chartPreferences?.theme === "dark" ? "bg-white text-gray-900 shadow-sm" : "text-gray-500"}`}>
                  <Moon className="w-3.5 h-3.5 inline mr-1" />Dark
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable Animations</p>
                <p className="text-xs text-gray-500">Show animated transitions in charts</p>
              </div>
              <button onClick={() => handleChange("chartPreferences", { ...settings.chartPreferences, enableAnimations: !settings.chartPreferences?.enableAnimations })} className={`relative w-11 h-6 rounded-full transition-colors ${settings.chartPreferences?.enableAnimations ? "bg-indigo-600" : "bg-gray-300"}`}>
                <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings.chartPreferences?.enableAnimations ? "translate-x-5" : ""}`} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
