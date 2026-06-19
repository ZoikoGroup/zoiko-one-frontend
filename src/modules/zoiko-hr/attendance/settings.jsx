import { useState, useEffect } from "react";
import { Save, Sliders, Clock, Bell, MapPin, Shield } from "lucide-react";
import HRPage from "../../../components/HRPage";





export default function AttendanceSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  const [settings, setSettings] = useState({
    working_hours: 8,
    grace_period_minutes: 15,
    weekly_off: "saturday_sunday",
    auto_approve_regularization: false,
    overtime_approval_required: true,
    daily_late_allowed: 3,
    monthly_late_allowed: 10,
    enable_geofencing: true,
    office_latitude: "40.7128",
    office_longitude: "-74.0060",
    geofence_radius_meters: 200,
    gps_validation_required: true,
    enable_notifications: true,
    late_arrival_alert: true,
    missing_clockout_reminder: true,
    absent_notification: true,
    shift_change_notification: true,
    regularization_alert: true,
    overtime_reminder: false,
    default_shift_start: "09:00",
    default_shift_end: "18:00",
    default_break_duration: 60,
    enable_shift_rotation: false,
    allow_overtime: true,
    max_overtime_hours: 4,
  });

  useEffect(() => {
    let mounted = true;
    const timer = setTimeout(() => {
      if (mounted) setLoading(false);
    }, 300);
    return () => { clearTimeout(timer); mounted = false; };
  }, []);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const updateSetting = (key, value) => {
    setSettings((prev) => ({ ...prev, [key]: value }));
  };

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "shifts", label: "Shifts", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "geofencing", label: "Geo-fencing", icon: MapPin },
    { id: "policies", label: "Policies", icon: Shield },
  ];

  const Toggle = ({ checked, onChange }) => (
    <label className="relative inline-flex items-center cursor-pointer">
      <input type="checkbox" checked={checked} onChange={(e) => onChange(e.target.checked)} className="sr-only peer" />
      <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500" />
    </label>
  );

  if (loading) {
    return (
      <HRPage title="Attendance Settings" subtitle="Configure attendance module preferences">
                <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
          <span className="ml-3 text-gray-500">Loading settings...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Attendance Settings" subtitle="Configure attendance module preferences">
            <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Attendance Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure attendance module preferences</p>
          </div>
          <button onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium transition-colors">
            <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="flex gap-1 border-b border-gray-200 overflow-x-auto">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === tab.id ? "border-indigo-500 text-indigo-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">General Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Work Hours per Day</label>
                <input type="number" min={1} max={24} value={settings.working_hours} onChange={(e) => updateSetting("working_hours", parseFloat(e.target.value) || 8)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (minutes)</label>
                <input type="number" min={0} value={settings.grace_period_minutes} onChange={(e) => updateSetting("grace_period_minutes", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Off</label>
                <select value={settings.weekly_off} onChange={(e) => updateSetting("weekly_off", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                  <option value="saturday_sunday">Saturday & Sunday</option>
                  <option value="friday_saturday">Friday & Saturday</option>
                  <option value="friday">Friday only</option>
                  <option value="sunday">Sunday only</option>
                  <option value="none">None</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Daily Late Entries Allowed</label>
                <input type="number" min={0} value={settings.daily_late_allowed} onChange={(e) => updateSetting("daily_late_allowed", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Monthly Late Entries Allowed</label>
                <input type="number" min={0} value={settings.monthly_late_allowed} onChange={(e) => updateSetting("monthly_late_allowed", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "shifts" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Shift Defaults</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Shift Start Time</label>
                <input type="time" value={settings.default_shift_start} onChange={(e) => updateSetting("default_shift_start", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Shift End Time</label>
                <input type="time" value={settings.default_shift_end} onChange={(e) => updateSetting("default_shift_end", e.target.value)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Break Duration (minutes)</label>
                <input type="number" min={0} value={settings.default_break_duration} onChange={(e) => updateSetting("default_break_duration", parseInt(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max Overtime (hours/day)</label>
                <input type="number" min={0} step={0.5} value={settings.max_overtime_hours} onChange={(e) => updateSetting("max_overtime_hours", parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Enable Shift Rotation</p>
                  <p className="text-xs text-gray-500">Automatically rotate shifts among employees</p>
                </div>
                <Toggle checked={settings.enable_shift_rotation} onChange={(v) => updateSetting("enable_shift_rotation", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Allow Overtime</p>
                  <p className="text-xs text-gray-500">Allow employees to work overtime</p>
                </div>
                <Toggle checked={settings.allow_overtime} onChange={(v) => updateSetting("allow_overtime", v)} />
              </div>
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable Notifications</p>
                <p className="text-xs text-gray-500">Master toggle for all attendance notifications</p>
              </div>
              <Toggle checked={settings.enable_notifications} onChange={(v) => updateSetting("enable_notifications", v)} />
            </div>
            <div className="space-y-1">
              {[
                { key: "late_arrival_alert", label: "Late arrival alert", desc: "Notify when employee arrives late" },
                { key: "missing_clockout_reminder", label: "Missing clock-out reminder", desc: "Remind employees to clock out" },
                { key: "absent_notification", label: "Absent notification", desc: "Notify when employee is absent" },
                { key: "shift_change_notification", label: "Shift change notification", desc: "Alert on shift reassignments" },
                { key: "regularization_alert", label: "Regularization request", desc: "When correction request is approved/rejected" },
                { key: "overtime_reminder", label: "Overtime reminder", desc: "Remind about pending overtime approvals" },
              ].map((item) => (
                <div key={item.key} className="flex items-center justify-between py-2.5 px-3 rounded-lg hover:bg-gray-50">
                  <div>
                    <p className="text-sm font-medium text-gray-700">{item.label}</p>
                    <p className="text-xs text-gray-400">{item.desc}</p>
                  </div>
                  <Toggle checked={settings[item.key]} onChange={(v) => updateSetting(item.key, v)} />
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "geofencing" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Geo-fencing Settings</h2>
            <div className="flex items-center justify-between py-2 border-b border-gray-100">
              <div>
                <p className="text-sm font-medium text-gray-900">Enable Geo-fencing</p>
                <p className="text-xs text-gray-500">Restrict clock-in/out to specific locations</p>
              </div>
              <Toggle checked={settings.enable_geofencing} onChange={(v) => updateSetting("enable_geofencing", v)} />
            </div>
            {settings.enable_geofencing && (
              <div className="space-y-5 pt-2">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Latitude</label>
                    <input type="text" value={settings.office_latitude} onChange={(e) => updateSetting("office_latitude", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Office Longitude</label>
                    <input type="text" value={settings.office_longitude} onChange={(e) => updateSetting("office_longitude", e.target.value)}
                      className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  </div>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Radius (meters)</label>
                  <input type="number" min={50} value={settings.geofence_radius_meters} onChange={(e) => updateSetting("geofence_radius_meters", parseInt(e.target.value) || 200)}
                    className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div className="flex items-center justify-between py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-900">GPS Validation Required</p>
                    <p className="text-xs text-gray-500">Require GPS coordinates for clock-in/out</p>
                  </div>
                  <Toggle checked={settings.gps_validation_required} onChange={(v) => updateSetting("gps_validation_required", v)} />
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "policies" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Policy Settings</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Auto-approve Regularization</p>
                  <p className="text-xs text-gray-500">Automatically approve correction requests</p>
                </div>
                <Toggle checked={settings.auto_approve_regularization} onChange={(v) => updateSetting("auto_approve_regularization", v)} />
              </div>
              <div className="flex items-center justify-between py-2">
                <div>
                  <p className="text-sm font-medium text-gray-900">Require Overtime Approval</p>
                  <p className="text-xs text-gray-500">Overtime requires manager approval</p>
                </div>
                <Toggle checked={settings.overtime_approval_required} onChange={(v) => updateSetting("overtime_approval_required", v)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}

