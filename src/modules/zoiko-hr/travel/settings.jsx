import { useState } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { Save } from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/travel" },
  { label: "Requests", href: "/zoiko-hr/travel/requests" },
  { label: "Approvals", href: "/zoiko-hr/travel/approvals" },
  { label: "Itineraries", href: "/zoiko-hr/travel/itineraries" },
  { label: "Expenses", href: "/zoiko-hr/travel/expenses" },
  { label: "Reports", href: "/zoiko-hr/travel/reports" },
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
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
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
    notifications: {
      email: true,
      push: true,
      sms: false,
      requestUpdates: true,
      approvalUpdates: true,
      expenseUpdates: true,
    },
    privacy: {
      profileVisibility: "internal",
      showEmail: true,
      showPhone: false,
      showDepartment: true,
    },
    preferences: {
      theme: "light",
      language: "en",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      itemsPerPage: 10,
    },
  });

  const [saved, setSaved] = useState(false);
  const [activeTab, setActiveTab] = useState("notifications");

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateNested = (section, key, value) => {
    setSettings({ ...settings, [section]: { ...settings[section], [key]: value } });
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "preferences", label: "Preferences", icon: "⚙️" },
  ];

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="sr-only peer"
      />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
    </label>
  );

  return (
    <HRPage title="Travel" subtitle="Configure travel module preferences">
      <SubNav />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Travel Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure your travel module preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
          >
            <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-blue-500 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <span className="text-lg">{tab.icon}</span> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Email notifications</span>
                <Toggle checked={settings.notifications.email} onChange={(v) => updateNested("notifications", "email", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Push notifications</span>
                <Toggle checked={settings.notifications.push} onChange={(v) => updateNested("notifications", "push", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">SMS notifications</span>
                <Toggle checked={settings.notifications.sms} onChange={(v) => updateNested("notifications", "sms", v)} />
              </div>
            </div>
            <hr className="my-2" />
            <h3 className="text-sm font-medium text-gray-700">Alert Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Request updates</span>
                <Toggle checked={settings.notifications.requestUpdates} onChange={(v) => updateNested("notifications", "requestUpdates", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Approval updates</span>
                <Toggle checked={settings.notifications.approvalUpdates} onChange={(v) => updateNested("notifications", "approvalUpdates", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Expense updates</span>
                <Toggle checked={settings.notifications.expenseUpdates} onChange={(v) => updateNested("notifications", "expenseUpdates", v)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "privacy" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Privacy Settings</h2>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Profile Visibility</label>
              <select
                value={settings.privacy.profileVisibility}
                onChange={(e) => updateNested("privacy", "profileVisibility", e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="internal">Internal Only</option>
                <option value="public">Public</option>
                <option value="private">Private</option>
              </select>
            </div>
            <hr className="my-2" />
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show email address</span>
                <Toggle checked={settings.privacy.showEmail} onChange={(v) => updateNested("privacy", "showEmail", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show phone number</span>
                <Toggle checked={settings.privacy.showPhone} onChange={(v) => updateNested("privacy", "showPhone", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show department</span>
                <Toggle checked={settings.privacy.showDepartment} onChange={(v) => updateNested("privacy", "showDepartment", v)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "preferences" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Preferences</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Theme</label>
                <select
                  value={settings.preferences.theme}
                  onChange={(e) => updateNested("preferences", "theme", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={settings.preferences.language}
                  onChange={(e) => updateNested("preferences", "language", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="en">English</option>
                  <option value="es">Spanish</option>
                  <option value="fr">French</option>
                  <option value="de">German</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date Format</label>
                <select
                  value={settings.preferences.dateFormat}
                  onChange={(e) => updateNested("preferences", "dateFormat", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
                <select
                  value={settings.preferences.timeFormat}
                  onChange={(e) => updateNested("preferences", "timeFormat", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="12h">12-hour</option>
                  <option value="24h">24-hour</option>
                </select>
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}
