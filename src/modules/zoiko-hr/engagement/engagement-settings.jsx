import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/engagement" },
  { label: "Wellness Programs", href: "/zoiko-hr/engagement/wellness" },
  { label: "CSR Activities", href: "/zoiko-hr/engagement/csr" },
  { label: "Communications", href: "/zoiko-hr/engagement/communications" },
  { label: "Announcements", href: "/zoiko-hr/engagement/announcements" },
  { label: "NPS Surveys", href: "/zoiko-hr/engagement/nps" },
  { label: "Analytics", href: "/zoiko-hr/engagement/analytics" },
  { label: "Reports", href: "/zoiko-hr/engagement/reports" },
  { label: "Settings", href: "/zoiko-hr/engagement/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/engagement"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50"
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

export default function EngagementSettings() {
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("notifications");
  const [saved, setSaved] = useState(false);
  const [localSettings, setLocalSettings] = useState(null);

  if (loading) return <div className="p-6 text-gray-500">Loading settings...</div>;
  if (!settings) return <div className="p-6 text-gray-500">No settings data</div>;

  const s = localSettings || settings;

  const handleSave = async () => {
    await new Promise(resolve => setTimeout(resolve, 500));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateNested = (section, key, value) => {
    setLocalSettings({ ...s, [section]: { ...s[section], [key]: value } });
  };

  const tabs = [
    { id: "notifications", label: "Notifications", icon: "🔔" },
    { id: "privacy", label: "Privacy", icon: "🔒" },
    { id: "documents", label: "Document Access", icon: "📄" },
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
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500" />
    </label>
  );

  return (
    <HRPage title="Employee Engagement" subtitle="Configure engagement module preferences">
      <SubNav />

      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Engagement Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure your engagement module preferences</p>
          </div>
          <button
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7H5a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-3M8 7V5a2 2 0 012-2h4a2 2 0 012 2v2M8 7h8" />
            </svg>
            {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id
                  ? "border-orange-500 text-orange-600"
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
                <Toggle checked={s.notifications.email} onChange={(v) => updateNested("notifications", "email", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Push notifications</span>
                <Toggle checked={s.notifications.push} onChange={(v) => updateNested("notifications", "push", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">SMS notifications</span>
                <Toggle checked={s.notifications.sms} onChange={(v) => updateNested("notifications", "sms", v)} />
              </div>
            </div>
            <hr className="my-2" />
            <h3 className="text-sm font-medium text-gray-700">Alert Preferences</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Engagement updates</span>
                <Toggle checked={s.notifications.engagementUpdates} onChange={(v) => updateNested("notifications", "engagementUpdates", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Survey reminders</span>
                <Toggle checked={s.notifications.surveyReminders} onChange={(v) => updateNested("notifications", "surveyReminders", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Report notifications</span>
                <Toggle checked={s.notifications.reportNotifications} onChange={(v) => updateNested("notifications", "reportNotifications", v)} />
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
                value={s.privacy.profileVisibility}
                onChange={(e) => updateNested("privacy", "profileVisibility", e.target.value)}
                className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                <Toggle checked={s.privacy.showEmail} onChange={(v) => updateNested("privacy", "showEmail", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show phone number</span>
                <Toggle checked={s.privacy.showPhone} onChange={(v) => updateNested("privacy", "showPhone", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Show engagement history</span>
                <Toggle checked={s.privacy.showEngagementHistory} onChange={(v) => updateNested("privacy", "showEngagementHistory", v)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "documents" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Document Access</h2>
            <div className="space-y-3">
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Allow document downloads</span>
                <Toggle checked={s.documentAccess.allowDownload} onChange={(v) => updateNested("documentAccess", "allowDownload", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Share reports with teams</span>
                <Toggle checked={s.documentAccess.shareWithTeams} onChange={(v) => updateNested("documentAccess", "shareWithTeams", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-sm text-gray-700">Export data access</span>
                <Toggle checked={s.documentAccess.exportAccess} onChange={(v) => updateNested("documentAccess", "exportAccess", v)} />
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
                  value={s.preferences.theme}
                  onChange={(e) => updateNested("preferences", "theme", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="light">Light</option>
                  <option value="dark">Dark</option>
                  <option value="system">System</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Language</label>
                <select
                  value={s.preferences.language}
                  onChange={(e) => updateNested("preferences", "language", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
                  value={s.preferences.dateFormat}
                  onChange={(e) => updateNested("preferences", "dateFormat", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                >
                  <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                  <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                  <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Time Format</label>
                <select
                  value={s.preferences.timeFormat}
                  onChange={(e) => updateNested("preferences", "timeFormat", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
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
