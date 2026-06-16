import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Save, Bell, Shield, Eye, RefreshCw } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/recruitment" },
  { label: "Job Requisitions", href: "/zoiko-hr/recruitment/job-requisitions" },
  { label: "Open Positions", href: "/zoiko-hr/recruitment/open-positions" },
  { label: "Candidates", href: "/zoiko-hr/recruitment/candidates" },
  { label: "Interview Pipeline", href: "/zoiko-hr/recruitment/interview-pipeline" },
  { label: "Offer Management", href: "/zoiko-hr/recruitment/offers" },
  { label: "Hiring Schedule", href: "/zoiko-hr/recruitment/hiring-schedule" },
  { label: "Analytics", href: "/zoiko-hr/recruitment/analytics" },
  { label: "Reports", href: "/zoiko-hr/recruitment/reports" },
  { label: "Settings", href: "/zoiko-hr/recruitment/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/recruitment"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${isActive ? "text-orange-600 border-b-2 border-orange-600 bg-orange-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"}`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function Settings() {
  const [form, setForm] = useState({
    companyName: "ZoikoOne Inc.",
    emailNotifications: true,
    slackNotifications: false,
    autoReminders: true,
    defaultInterviewDuration: 60,
    requireApproval: true,
    anonymousReviews: false,
    dataRetentionDays: 90,
  });

  const [saved, setSaved] = useState(false);

  const handleChange = (key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setSaved(false);
  };

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <HRPage title="Recruitment Settings" subtitle="Configure recruitment module preferences">
      <SubNav />
      <div className="max-w-2xl space-y-6">
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-50"><Bell className="w-5 h-5 text-orange-600" /></div>
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-700">Email Notifications</p><p className="text-xs text-gray-400">Receive email updates about candidate activity</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.emailNotifications} onChange={(e) => handleChange("emailNotifications", e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-700">Slack Notifications</p><p className="text-xs text-gray-400">Send notifications to Slack channel</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.slackNotifications} onChange={(e) => handleChange("slackNotifications", e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600" />
              </label>
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-700">Auto Reminders</p><p className="text-xs text-gray-400">Send automatic reminders for upcoming interviews</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.autoReminders} onChange={(e) => handleChange("autoReminders", e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600" />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-50"><Shield className="w-5 h-5 text-orange-600" /></div>
            <h2 className="text-lg font-semibold text-gray-900">Interview Preferences</h2>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Interview Duration (minutes)</label>
              <input type="number" value={form.defaultInterviewDuration} onChange={(e) => handleChange("defaultInterviewDuration", parseInt(e.target.value) || 30)}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-700">Require Approval for Offers</p><p className="text-xs text-gray-400">Offers must be approved by a hiring manager</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.requireApproval} onChange={(e) => handleChange("requireApproval", e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600" />
              </label>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 rounded-lg bg-orange-50"><Eye className="w-5 h-5 text-orange-600" /></div>
            <h2 className="text-lg font-semibold text-gray-900">Privacy & Data</h2>
          </div>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div><p className="text-sm font-medium text-gray-700">Anonymous Reviews</p><p className="text-xs text-gray-400">Hide reviewer identity in feedback</p></div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" checked={form.anonymousReviews} onChange={(e) => handleChange("anonymousReviews", e.target.checked)} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-orange-500/20 rounded-full peer peer-checked:after:translate-x-full rtl:peer-checked:after:-translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:start-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-600" />
              </label>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Data Retention Period (days)</label>
              <input type="number" value={form.dataRetentionDays} onChange={(e) => handleChange("dataRetentionDays", parseInt(e.target.value) || 90)}
                className="w-32 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <button onClick={handleSave} className="flex items-center gap-2 px-6 py-2.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> Save Changes
          </button>
          {saved && (
            <div className="flex items-center gap-2 text-sm text-green-600">
              <RefreshCw className="w-4 h-4" /> Changes saved successfully
            </div>
          )}
        </div>
      </div>
    </HRPage>
  );
}
