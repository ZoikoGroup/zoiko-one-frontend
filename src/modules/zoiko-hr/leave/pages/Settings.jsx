import { useState } from "react";
import { Save, Settings2, Calendar, Users, Bell } from "lucide-react";

const tabs = [
  { key: "general", label: "General", icon: Settings2 },
  { key: "leaveTypes", label: "Leave Types", icon: Calendar },
  { key: "approvals", label: "Approvals", icon: Users },
  { key: "notifications", label: "Notifications", icon: Bell },
];

const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const leaveTypes = ["Annual", "Sick", "Casual", "Earned", "Maternity", "Paternity", "Unpaid", "Study", "Emergency"];

export default function LeaveSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const [general, setGeneral] = useState({
    workingDays: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    leaveYearStart: "2025-01-01",
    maxConsecutiveDays: 30,
    carryForwardLimit: 10,
  });

  const [entitlements, setEntitlements] = useState({
    Annual: 20, Sick: 12, Casual: 10, Earned: 15,
    Maternity: 90, Paternity: 10, Unpaid: 30, Study: 10, Emergency: 5,
  });

  const [approvals, setApprovals] = useState({
    workflow: "manager",
    escalationDays: 3,
    autoApproveDays: 1,
  });

  const [notifications, setNotifications] = useState({
    requestSubmitted: true,
    requestApproved: true,
    requestRejected: true,
    pendingReminder: true,
    teamCalendar: false,
    balanceLow: true,
  });

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const toggleWorkingDay = (day) => {
    setGeneral((prev) => ({
      ...prev,
      workingDays: prev.workingDays.includes(day)
        ? prev.workingDays.filter((d) => d !== day)
        : [...prev.workingDays, day],
    }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Leave Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure leave policies and preferences</p>
        </div>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium"
        >
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Settings"}
        </button>
      </div>

      {saved && (
        <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">
          Settings saved successfully!
        </div>
      )}

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
                activeTab === tab.key ? "bg-teal-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              }`}
            >
              <Icon className="w-4 h-4" />
              {tab.label}
            </button>
          );
        })}
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-6">
        {activeTab === "general" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Working Days</label>
              <div className="flex flex-wrap gap-2">
                {workingDays.map((day) => (
                  <button
                    key={day}
                    onClick={() => toggleWorkingDay(day)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                      general.workingDays.includes(day)
                        ? "bg-teal-50 border-teal-300 text-teal-700"
                        : "bg-gray-50 border-gray-200 text-gray-500"
                    }`}
                  >
                    {day.slice(0, 3)}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Leave Year Start</label>
              <input
                type="date" value={general.leaveYearStart}
                onChange={(e) => setGeneral({ ...general, leaveYearStart: e.target.value })}
                className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Consecutive Days</label>
                <input
                  type="number" min="1" value={general.maxConsecutiveDays}
                  onChange={(e) => setGeneral({ ...general, maxConsecutiveDays: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Carry Forward Limit</label>
                <input
                  type="number" min="0" value={general.carryForwardLimit}
                  onChange={(e) => setGeneral({ ...general, carryForwardLimit: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "leaveTypes" && (
          <div className="space-y-4 max-w-lg">
            <p className="text-sm text-gray-500 mb-4">Set default entitlements for each leave type</p>
            {leaveTypes.map((type) => (
              <div key={type} className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">{type}</span>
                <input
                  type="number" min="0" value={entitlements[type]}
                  onChange={(e) => setEntitlements({ ...entitlements, [type]: parseInt(e.target.value) || 0 })}
                  className="w-24 border border-gray-200 rounded-lg px-3 py-1.5 text-sm text-right focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            ))}
          </div>
        )}

        {activeTab === "approvals" && (
          <div className="space-y-6 max-w-lg">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Approval Workflow</label>
              <div className="flex gap-3">
                {[
                  { value: "manager", label: "Manager Only" },
                  { value: "hr", label: "HR Only" },
                  { value: "both", label: "Manager & HR" },
                ].map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => setApprovals({ ...approvals, workflow: opt.value })}
                    className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                      approvals.workflow === opt.value
                        ? "bg-teal-50 border-teal-300 text-teal-700"
                        : "bg-gray-50 border-gray-200 text-gray-600"
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Escalation After (days)</label>
                <input
                  type="number" min="1" value={approvals.escalationDays}
                  onChange={(e) => setApprovals({ ...approvals, escalationDays: parseInt(e.target.value) || 1 })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Approve for ≤ (days)</label>
                <input
                  type="number" min="0" value={approvals.autoApproveDays}
                  onChange={(e) => setApprovals({ ...approvals, autoApproveDays: parseInt(e.target.value) || 0 })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500"
                />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="space-y-4 max-w-lg">
            <p className="text-sm text-gray-500 mb-2">Configure notification preferences</p>
            {Object.entries(notifications).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <span className="text-sm text-gray-700 capitalize">
                  {key.replace(/([A-Z])/g, " $1").replace(/^./, (s) => s.toUpperCase())}
                </span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={value}
                    onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })}
                    className="sr-only peer"
                  />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
