import { useState } from "react";
import { Save, Bell, Shield, Calendar, Star, TrendingUp, Sliders, Users } from "lucide-react";

const reviewCycles = [
  { id: "q1", label: "Q1 Review", period: "Jan - Mar", deadline: "2025-04-15", status: "completed" },
  { id: "q2", label: "Q2 Review", period: "Apr - Jun", deadline: "2025-07-15", status: "active" },
  { id: "q3", label: "Q3 Review", period: "Jul - Sep", deadline: "2025-10-15", status: "upcoming" },
  { id: "q4", label: "Q4 Review", period: "Oct - Dec", deadline: "2026-01-15", status: "upcoming" },
  { id: "annual", label: "Annual Review", period: "Full Year", deadline: "2026-02-01", status: "upcoming" },
];

const ratingScales = [
  { id: "1", label: "1 - Needs Improvement", active: true },
  { id: "2", label: "2 - Developing", active: true },
  { id: "3", label: "3 - Meets Expectations", active: true },
  { id: "4", label: "4 - Exceeds Expectations", active: true },
  { id: "5", label: "5 - Outstanding", active: true },
];

export default function PerformanceSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "cycles", label: "Review Cycles", icon: Calendar },
    { id: "ratings", label: "Rating Scale", icon: Star },
    { id: "kpi", label: "KPI Settings", icon: TrendingUp },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Performance Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure performance management preferences</p>
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

      {activeTab === "general" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Review Frequency</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option>Quarterly</option>
                <option>Bi-Annual</option>
                <option>Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Reviewer</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option>Direct Manager</option>
                <option>Skip-Level Manager</option>
                <option>HR Department</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Goal Setting Period</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option>Quarterly</option>
                <option>Bi-Annual</option>
                <option>Annual</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Self Review Required</label>
              <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500">
                <option>Yes - Always</option>
                <option>Optional</option>
                <option>No</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {activeTab === "cycles" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Review Cycles</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-gray-200">
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Cycle</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Period</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Deadline</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {reviewCycles.map((cycle) => (
                  <tr key={cycle.id} className="border-b border-gray-100">
                    <td className="py-3 px-4 font-medium text-gray-900">{cycle.label}</td>
                    <td className="py-3 px-4 text-gray-600">{cycle.period}</td>
                    <td className="py-3 px-4 text-gray-600">{cycle.deadline}</td>
                    <td className="py-3 px-4">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${
                        cycle.status === "completed" ? "bg-green-100 text-green-700" :
                        cycle.status === "active" ? "bg-blue-100 text-blue-700" :
                        "bg-gray-100 text-gray-600"
                      }`}>{cycle.status}</span>
                    </td>
                    <td className="py-3 px-4">
                      <button className="text-blue-600 hover:text-blue-800 text-xs font-medium">Configure</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {activeTab === "ratings" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Rating Scale</h2>
          <div className="space-y-3">
            {ratingScales.map((rating) => (
              <div key={rating.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <Star className={`w-4 h-4 ${parseInt(rating.id) <= 3 ? "text-yellow-400" : parseInt(rating.id) <= 4 ? "text-blue-400" : "text-green-500"}`} />
                  <span className="text-sm text-gray-900">{rating.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={rating.active} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "kpi" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">KPI Configuration</h2>
          {[
            "Allow employees to create personal KPIs",
            "Manager approval required for KPI changes",
            "Auto-calculate weighted scores",
            "Show KPI progress on dashboard",
            "Enable peer review for KPI assessment",
          ].map((item, idx) => (
            <div key={idx} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={idx < 3} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          {[
            "Review cycle starts",
            "Review deadline approaching",
            "New feedback received",
            "Goal status changes",
            "360 review invitation",
            "Appraisal scheduled",
          ].map((item) => (
            <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-blue-500" />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
