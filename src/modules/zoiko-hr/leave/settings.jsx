import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import { Save, Settings2, Calendar, Users, Bell } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getLeaveSettings, updateLeaveSettings } from "../../../service/hrService";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/leave" },
  { label: "My Leave", href: "/zoiko-hr/leave/my-leave" },
  { label: "Requests", href: "/zoiko-hr/leave/requests" },
  { label: "Calendar", href: "/zoiko-hr/leave/calendar" },
  { label: "Leave Types", href: "/zoiko-hr/leave/leave-types" },
  { label: "Reports", href: "/zoiko-hr/leave/reports" },
  { label: "Settings", href: "/zoiko-hr/leave/settings" },
];

const workingDays = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const leaveTypes = ["Annual", "Sick", "Casual", "Earned", "Maternity", "Paternity", "Unpaid", "Study", "Emergency"];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/leave"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function LeaveSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState(null);

  const [general, setGeneral] = useState({
    working_days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    leave_year_start: "",
    max_consecutive_days: 30,
    carry_forward_limit: 10,
  });

  const [approvals, setApprovals] = useState({
    approval_workflow: "manager",
    escalation_days: 3,
    auto_approve_days: 1,
  });

  const [notifications, setNotifications] = useState({
    notification_on_submit: true,
    notification_on_approve: true,
    notification_on_reject: true,
  });

  useEffect(() => {
    let mounted = true;
    getLeaveSettings()
      .then((data) => {
        if (!mounted || !data) return;
        setGeneral({
          working_days: data.working_days || ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
          leave_year_start: data.leave_year_start || "",
          max_consecutive_days: data.max_consecutive_days || 30,
          carry_forward_limit: data.carry_forward_limit || 10,
        });
        setApprovals({
          approval_workflow: data.approval_workflow || "manager",
          escalation_days: data.escalation_days || 3,
          auto_approve_days: data.auto_approve_days || 1,
        });
        setNotifications({
          notification_on_submit: data.notification_on_submit !== false,
          notification_on_approve: data.notification_on_approve !== false,
          notification_on_reject: data.notification_on_reject !== false,
        });
      })
      .catch(() => {})
      .finally(() => { if (mounted) setLoading(false); });
    return () => { mounted = false; };
  }, []);

  const handleSave = async () => {
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...general,
        ...approvals,
        ...notifications,
      };
      if (payload.leave_year_start === "") payload.leave_year_start = null;
      await updateLeaveSettings(payload);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message || "Failed to save settings");
    } finally {
      setSaving(false);
    }
  };

  const toggleWorkingDay = (day) => {
    setGeneral((prev) => ({
      ...prev,
      working_days: prev.working_days.includes(day)
        ? prev.working_days.filter((d) => d !== day)
        : [...prev.working_days, day],
    }));
  };

  const tabs = [
    { key: "general", label: "General", icon: Settings2 },
    { key: "approvals", label: "Approvals", icon: Users },
    { key: "notifications", label: "Notifications", icon: Bell },
  ];

  if (loading) {
    return (
      <HRPage title="Leave Settings" subtitle="Configure leave policies and preferences">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-teal-600"></div>
          <span className="ml-3 text-gray-500">Loading settings...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Leave Settings" subtitle="Configure leave policies and preferences">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Leave Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure leave policies and preferences</p>
          </div>
          <button onClick={handleSave} disabled={saving} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors text-sm font-medium disabled:opacity-50">
            <Save className="w-4 h-4" /> {saving ? "Saving..." : saved ? "Saved!" : "Save Settings"}
          </button>
        </div>

        {error && (
          <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg text-sm">{error}</div>
        )}
        {saved && !error && (
          <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 rounded-lg text-sm">Settings saved successfully!</div>
        )}

        <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button key={tab.key} onClick={() => setActiveTab(tab.key)}
                className={`flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-xl transition-colors ${
                  activeTab === tab.key ? "bg-teal-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                }`}>
                <Icon className="w-4 h-4" /> {tab.label}
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
                    <button key={day} onClick={() => toggleWorkingDay(day)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors ${
                        general.working_days.includes(day) ? "bg-teal-50 border-teal-300 text-teal-700" : "bg-gray-50 border-gray-200 text-gray-500"
                      }`}>
                      {day.slice(0, 3)}
                    </button>
                  ))}
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Leave Year Start</label>
                <input type="date" value={general.leave_year_start} onChange={(e) => setGeneral({ ...general, leave_year_start: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Max Consecutive Days</label>
                  <input type="number" min="1" value={general.max_consecutive_days} onChange={(e) => setGeneral({ ...general, max_consecutive_days: parseInt(e.target.value) || 1 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Carry Forward Limit</label>
                  <input type="number" min="0" value={general.carry_forward_limit} onChange={(e) => setGeneral({ ...general, carry_forward_limit: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>
              </div>
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
                    { value: "auto", label: "Auto-Approve" },
                  ].map((opt) => (
                    <button key={opt.value} onClick={() => setApprovals({ ...approvals, approval_workflow: opt.value })}
                      className={`px-4 py-2 rounded-lg text-sm font-medium border transition-colors ${
                        approvals.approval_workflow === opt.value ? "bg-teal-50 border-teal-300 text-teal-700" : "bg-gray-50 border-gray-200 text-gray-600"
                      }`}>
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Escalation After (days)</label>
                  <input type="number" min="1" value={approvals.escalation_days} onChange={(e) => setApprovals({ ...approvals, escalation_days: parseInt(e.target.value) || 1 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Auto-Approve for ≤ (days)</label>
                  <input type="number" min="0" value={approvals.auto_approve_days} onChange={(e) => setApprovals({ ...approvals, auto_approve_days: parseInt(e.target.value) || 0 })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500" />
                </div>
              </div>
            </div>
          )}

          {activeTab === "notifications" && (
            <div className="space-y-4 max-w-lg">
              <p className="text-sm text-gray-500 mb-2">Configure notification preferences</p>
              {Object.entries(notifications).map(([key, value]) => (
                <div key={key} className="flex items-center justify-between">
                  <span className="text-sm text-gray-700 capitalize">{key.replace(/_/g, " ").replace(/^./, (s) => s.toUpperCase())}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" checked={value} onChange={(e) => setNotifications({ ...notifications, [key]: e.target.checked })} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-teal-500/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-teal-600" />
                  </label>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </HRPage>
  );
}
