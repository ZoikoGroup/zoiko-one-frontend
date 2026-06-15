import { useState } from "react";
import { Shield, FileText, ClipboardList, Bell } from "lucide-react";

const SETTINGS_TABS = [
  { key: "general", label: "General", icon: Shield },
  { key: "policies", label: "Policies", icon: FileText },
  { key: "audits", label: "Audits", icon: ClipboardList },
  { key: "notifications", label: "Notifications", icon: Bell },
];

export default function ComplianceSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [settings, setSettings] = useState({
    complianceOfficer: "Sarah Mitchell",
    reviewFrequency: "quarterly",
    approvalWorkflow: "two_step",
    autoArchiveDays: "90",
    defaultAuditFrequency: "quarterly",
    auditLeadTime: "14",
    notifyOnViolation: true,
    notifyOnAuditComplete: true,
    notifyOnPolicyUpdate: true,
    notifyOnAcknowledgment: false,
    notifyOnRiskThreshold: true,
  });

  const toggle = (key) => setSettings((s) => ({ ...s, [key]: !s[key] }));

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Compliance Settings</h1>
        <p className="text-sm text-gray-500 mt-1">Configure compliance module preferences</p>
      </div>

      <div className="flex border-b border-gray-200">
        {SETTINGS_TABS.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.key
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700"
              }`}
            >
              <Icon size={16} />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {activeTab === "general" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Compliance Officer</label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
                value={settings.complianceOfficer}
                onChange={(e) => setSettings({ ...settings, complianceOfficer: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Primary contact for compliance matters</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Policy Review Frequency</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
                value={settings.reviewFrequency}
                onChange={(e) => setSettings({ ...settings, reviewFrequency: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semi_annual">Semi-Annual</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Archive Inactive Policies (days)</label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
                type="number"
                value={settings.autoArchiveDays}
                onChange={(e) => setSettings({ ...settings, autoArchiveDays: e.target.value })}
              />
            </div>
          </div>
        )}

        {activeTab === "policies" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Approval Workflow</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
                value={settings.approvalWorkflow}
                onChange={(e) => setSettings({ ...settings, approvalWorkflow: e.target.value })}
              >
                <option value="single">Single Approval</option>
                <option value="two_step">Two-Step Approval</option>
                <option value="committee">Committee Review</option>
              </select>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-700 mb-2">Policy Categories</h3>
              <div className="grid grid-cols-2 gap-2">
                {["Data Privacy", "Security", "HR", "Finance", "Operations", "Legal"].map((cat) => (
                  <label key={cat} className="flex items-center gap-2 text-sm text-gray-600">
                    <input type="checkbox" defaultChecked className="rounded text-emerald-600 focus:ring-emerald-500" />
                    {cat}
                  </label>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === "audits" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Audit Frequency</label>
              <select
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
                value={settings.defaultAuditFrequency}
                onChange={(e) => setSettings({ ...settings, defaultAuditFrequency: e.target.value })}
              >
                <option value="monthly">Monthly</option>
                <option value="quarterly">Quarterly</option>
                <option value="semi_annual">Semi-Annual</option>
                <option value="annual">Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Audit Lead Time (days)</label>
              <input
                className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm"
                type="number"
                value={settings.auditLeadTime}
                onChange={(e) => setSettings({ ...settings, auditLeadTime: e.target.value })}
              />
              <p className="text-xs text-gray-400 mt-1">Days before audit to send notifications</p>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4 max-w-lg">
            {[
              { key: "notifyOnViolation", label: "Violation Reported", desc: "Alert when a new violation is logged" },
              { key: "notifyOnAuditComplete", label: "Audit Completed", desc: "Notify when an audit is finalized" },
              { key: "notifyOnPolicyUpdate", label: "Policy Updated", desc: "Alert employees when policies change" },
              { key: "notifyOnAcknowledgment", label: "Acknowledgment Reminder", desc: "Send reminders for pending acknowledgments" },
              { key: "notifyOnRiskThreshold", label: "Risk Threshold Exceeded", desc: "Alert when risk score exceeds threshold" },
            ].map((n) => (
              <div key={n.key} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{n.label}</p>
                  <p className="text-xs text-gray-500">{n.desc}</p>
                </div>
                <button
                  onClick={() => toggle(n.key)}
                  className={`relative w-10 h-6 rounded-full transition-colors ${settings[n.key] ? "bg-emerald-600" : "bg-gray-300"}`}
                >
                  <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${settings[n.key] ? "translate-x-4" : ""}`} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
