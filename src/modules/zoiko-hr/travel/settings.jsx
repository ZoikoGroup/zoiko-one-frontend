import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Save, Sliders, Bell, Eye, Lock } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Expenses", href: "/zoiko-hr/travel/expenses" },
  { label: "Settings", href: "/zoiko-hr/travel/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/travel"}
          className={({ isActive }) =>
            `whitespace-nowrap px-4 py-2.5 text-sm font-semibold rounded-t-xl transition-all duration-200 ${
              isActive ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/40" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function TravelSettings() {
  const [settings, setSettings] = useState({
    notifications: { email: true, push: true, sms: false, requestUpdates: true },
    privacy: { profileVisibility: "internal", showEmail: true },
    preferences: { theme: "light", language: "en", dateFormat: "MM/DD/YYYY" },
  });

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");

  const handleSave = async () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateNested = (section, key, value) => {
    setSettings({ ...settings, [section]: { ...settings[section], [key]: value } });
  };

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-600" />
    </label>
  );

  return (
    <HRPage title="Travel" subtitle="Configure travel module preferences">
      <SubNav />
      <div className="space-y-6">
        <div className="flex justify-between items-center bg-white p-4 border border-gray-200 rounded-xl shadow-sm">
          <div>
            <h1 className="text-xl font-black text-gray-900">Module Preferences</h1>
            <p className="text-xs text-gray-500">Local terminal system config behaviors</p>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm">
            <Save className="w-4 h-4" /> {saved ? "Preferences Locked!" : "Commit Configurations"}
          </button>
        </div>

        {/* Tab Selection Nodes Layout */}
        <div className="flex gap-2 border-b border-gray-200">
          <button onClick={() => setActiveTab("notifications")} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${activeTab === "notifications" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500"}`}><Bell className="w-4 h-4" /> Notifications</button>
          <button onClick={() => setActiveTab("privacy")} className={`px-4 py-3 text-sm font-semibold border-b-2 transition-all flex items-center gap-2 ${activeTab === "privacy" ? "border-blue-600 text-blue-600 font-bold" : "border-transparent text-gray-500"}`}><Lock className="w-4 h-4" /> Security Matrix</button>
        </div>

        {/* Settings Panels Mapping */}
        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between py-2 border-b border-gray-50 font-medium text-sm">
              <span className="text-gray-700">Automated Mail Alerts</span>
              <Toggle checked={settings.notifications.email} onChange={(v) => updateNested("notifications", "email", v)} />
            </div>
            <div className="flex items-center justify-between py-2 font-medium text-sm">
              <span className="text-gray-700">Push Payload Submissions</span>
              <Toggle checked={settings.notifications.push} onChange={(v) => updateNested("notifications", "push", v)} />
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4 shadow-sm">
            <div className="flex items-center justify-between py-2 font-medium text-sm">
              <span className="text-gray-700">Expose Digital Email Parameters</span>
              <Toggle checked={settings.privacy.showEmail} onChange={(v) => updateNested("privacy", "showEmail", v)} />
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}