import { useState } from "react";
import { Save, Sliders, Clock, Bell, MapPin } from "lucide-react";

export default function AttendanceSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "shifts", label: "Shifts", icon: Clock },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "geofencing", label: "Geo-fencing", icon: MapPin },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Attendance Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure attendance module preferences</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 text-sm font-medium">
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Working Days</label>
              <div className="flex flex-wrap gap-2">
                {["Mon","Tue","Wed","Thu","Fri","Sat","Sun"].map((d) => (
                  <label key={d} className="flex items-center gap-1 text-sm text-gray-700">
                    <input type="checkbox" defaultChecked={d !== "Sat" && d !== "Sun"}
                      className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
                    {d}
                  </label>
                ))}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Grace Period (minutes)</label>
              <input type="number" defaultValue={15}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Work Hours per Day</label>
              <input type="number" defaultValue={8}
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Weekly Off</label>
              <select defaultValue="saturday_sunday"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                <option value="saturday_sunday">Saturday & Sunday</option>
                <option value="friday_saturday">Friday & Saturday</option>
                <option value="friday">Friday only</option>
                <option value="sunday">Sunday only</option>
              </select>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Holidays</label>
            <div className="space-y-2">
              {["New Year", "Independence Day", "Christmas"].map((h) => (
                <div key={h} className="flex items-center gap-3 text-sm text-gray-700">
                  <input type="text" defaultValue={h} className="flex-1 px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                  <input type="date" className="px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "shifts" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Shift Templates</h2>
          <div className="space-y-3">
            {[
              { name: "Morning Shift", start: "08:00", end: "16:00", dept: "Engineering" },
              { name: "Afternoon Shift", start: "14:00", end: "22:00", dept: "Engineering" },
              { name: "General Shift", start: "09:00", end: "18:00", dept: "All" },
              { name: "Night Shift", start: "22:00", end: "06:00", dept: "Support" },
            ].map((s) => (
              <div key={s.name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{s.name}</p>
                  <p className="text-xs text-gray-500">{s.start} - {s.end} · {s.dept}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          {["Late arrival alert", "Missing clock-out reminder", "Absent notification", "Shift change notification", "Correction request approved/rejected"].map((item) => (
            <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500" />
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === "geofencing" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Geo-fencing Settings</h2>
          <div className="flex items-center justify-between py-2">
            <div>
              <p className="text-sm font-medium text-gray-900">Enable Geo-fencing</p>
              <p className="text-xs text-gray-500">Restrict clock-in/out to specific locations</p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input type="checkbox" defaultChecked className="sr-only peer" />
              <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-indigo-500" />
            </label>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Latitude</label>
              <input type="text" defaultValue="40.7128"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Office Longitude</label>
              <input type="text" defaultValue="-74.0060"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Allowed Radius (meters)</label>
            <input type="number" defaultValue={200}
              className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
          </div>
        </div>
      )}
    </div>
  );
}
