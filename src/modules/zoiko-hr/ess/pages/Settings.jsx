import { useState } from "react";
import { Save, Bell, Shield, FileText, Sliders } from "lucide-react";
import { useEssSettings } from "../hooks/useEss";
import { updateEssSettingsData } from "../services/essService";

export default function EssSettings() {
  const { data: settings, loading } = useEssSettings();
  const [activeTab, setActiveTab] = useState("notifications");
  const [saved, setSaved] = useState(false);
  const [localSettings, setLocalSettings] = useState(null);

  if (loading) return <div className="p-6 text-gray-400">Loading settings...</div>;
  if (!settings) return <div className="p-6 text-gray-400">No settings data</div>;

  const s = localSettings || settings;

  const handleSave = async () => {
    await updateEssSettingsData(s);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateNested = (section, key, value) => {
    setLocalSettings({ ...s, [section]: { ...s[section], [key]: value } });
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "privacy", label: "Privacy", icon: Shield },
    { id: "documents", label: "Document Access", icon: FileText },
    { id: "preferences", label: "Preferences", icon: Sliders },
  ];

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
    </label>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">ESS Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure your employee self-service preferences</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? "border-blue-500 text-blue-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            <SettingRow label="Email notifications" checked={s.notifications.email} onChange={(v) => updateNested("notifications", "email", v)} />
            <SettingRow label="Push notifications" checked={s.notifications.push} onChange={(v) => updateNested("notifications", "push", v)} />
            <SettingRow label="SMS notifications" checked={s.notifications.sms} onChange={(v) => updateNested("notifications", "sms", v)} />
          </div>
          <hr className="my-2" />
          <h3 className="text-sm font-medium text-gray-700">Alert Preferences</h3>
          <div className="space-y-3">
            <SettingRow label="Leave request updates" checked={s.notifications.leaveUpdates} onChange={(v) => updateNested("notifications", "leaveUpdates", v)} />
            <SettingRow label="ESS request updates" checked={s.notifications.requestUpdates} onChange={(v) => updateNested("notifications", "requestUpdates", v)} />
            <SettingRow label="Attendance reminders" checked={s.notifications.attendanceReminders} onChange={(v) => updateNested("notifications", "attendanceReminders", v)} />
            <SettingRow label="Document updates" checked={s.notifications.documentUpdates} onChange={(v) => updateNested("notifications", "documentUpdates", v)} />
          </div>
        </div>
      )}

      {activeTab === "privacy" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
            <select value={s.privacy.profileVisibility} onChange={(e) => updateNested("privacy", "profileVisibility", e.target.value)}
              className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="internal">Internal Only</option>
              <option value="public">Public</option>
              <option value="private">Private</option>
            </select>
          </div>
          <hr className="my-2" />
          <div className="space-y-3">
            <SettingRow label="Show email address" checked={s.privacy.showEmail} onChange={(v) => updateNested("privacy", "showEmail", v)} />
            <SettingRow label="Show phone number" checked={s.privacy.showPhone} onChange={(v) => updateNested("privacy", "showPhone", v)} />
            <SettingRow label="Show emergency contacts" checked={s.privacy.showEmergencyContact} onChange={(v) => updateNested("privacy", "showEmergencyContact", v)} />
          </div>
        </div>
      )}

      {activeTab === "documents" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Access</h2>
          <div className="space-y-3">
            <SettingRow label="Allow document downloads" checked={s.documentAccess.allowDownload} onChange={(v) => updateNested("documentAccess", "allowDownload", v)} />
            <SettingRow label="Share payslips with manager" checked={s.documentAccess.sharePayslips} onChange={(v) => updateNested("documentAccess", "sharePayslips", v)} />
            <SettingRow label="Share certificates with HR" checked={s.documentAccess.shareCertificates} onChange={(v) => updateNested("documentAccess", "shareCertificates", v)} />
          </div>
        </div>
      )}

      {activeTab === "preferences" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
              <select value={s.preferences.theme} onChange={(e) => updateNested("preferences", "theme", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="light">Light</option>
                <option value="dark">Dark</option>
                <option value="system">System</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
              <select value={s.preferences.language} onChange={(e) => updateNested("preferences", "language", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="en">English</option>
                <option value="es">Spanish</option>
                <option value="fr">French</option>
                <option value="de">German</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
              <select value={s.preferences.dateFormat} onChange={(e) => updateNested("preferences", "dateFormat", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                <option value="YYYY-MM-DD">YYYY-MM-DD</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
              <select value={s.preferences.timeFormat} onChange={(e) => updateNested("preferences", "timeFormat", e.target.value)}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value="12h">12-hour</option>
                <option value="24h">24-hour</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Items Per Page</label>
              <select value={s.preferences.itemsPerPage} onChange={(e) => updateNested("preferences", "itemsPerPage", Number(e.target.value))}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                <option value={5}>5</option>
                <option value={10}>10</option>
                <option value={20}>20</option>
                <option value={50}>50</option>
              </select>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function SettingRow({ label, checked, onChange }) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-sm text-gray-700">{label}</span>
      <label className="relative inline-flex items-center cursor-pointer">
        <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
        <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
      </label>
    </div>
  );
}
