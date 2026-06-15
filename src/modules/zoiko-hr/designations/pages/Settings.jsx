import { useState } from "react";
import { Save, Sliders, Layers, Type, Bell } from "lucide-react";
import { levelColor } from "../utils/helpers";

export default function DesignationSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "levels", label: "Levels", icon: Layers },
    { id: "naming", label: "Naming", icon: Type },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Designation Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure designation module preferences</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 text-sm font-medium">
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? "border-orange-500 text-orange-600" : "border-transparent text-gray-500 hover:text-gray-700"
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
              <label className="block text-sm font-medium text-gray-700 mb-1">Level Naming Convention</label>
              <select defaultValue="L1_L10"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <option value="L1_L10">L1 - L10 (Standard)</option>
                <option value="IC_MGR">IC - Manager - Director</option>
                <option value="NUMERIC">1 - 10 (Numeric)</option>
                <option value="CUSTOM">Custom Titles</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto-generate Codes</label>
              <select defaultValue="enabled"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <option value="enabled">Enabled</option>
                <option value="disabled">Disabled</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Status for New Designations</label>
              <select defaultValue="active"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="archived">Archived</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Code Prefix</label>
              <input type="text" defaultValue="DESIG"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Allowable Statuses</label>
            <div className="flex flex-wrap gap-3">
              {["active", "inactive", "archived"].map((s) => (
                <label key={s} className="flex items-center gap-2 text-sm text-gray-700">
                  <input type="checkbox" defaultChecked={s !== "archived"}
                    className="rounded border-gray-300 text-orange-600 focus:ring-orange-500" />
                  {s.charAt(0).toUpperCase() + s.slice(1)}
                </label>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === "levels" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Level Configuration</h2>
          <div className="space-y-4">
            {Array.from({ length: 10 }, (_, i) => i + 1).map((n) => {
              const level = `L${n}`;
              return (
                <div key={level} className="flex items-center gap-4 py-3 border-b border-gray-100 last:border-0">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold w-12 justify-center ${levelColor(level)}`}>{level}</span>
                  <input type="text" defaultValue={["Entry Level", "Associate", "Mid-Level", "Senior IC", "Lead / Mgr I", "Sr Manager II", "Director I", "Sr Director II", "VP / Principal", "C-Level / EVP"][n - 1]}
                    className="flex-1 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
                  <input type="number" defaultValue={[30000, 45000, 60000, 80000, 100000, 120000, 140000, 170000, 200000, 250000][n - 1]}
                    className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" placeholder="Min" />
                  <input type="number" defaultValue={[50000, 70000, 95000, 125000, 155000, 190000, 220000, 260000, 310000, 410000][n - 1]}
                    className="w-28 px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" placeholder="Max" />
                </div>
              );
            })}
          </div>
        </div>
      )}

      {activeTab === "naming" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Naming Conventions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title Format</label>
              <select defaultValue="title_only"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <option value="title_only">Title Only</option>
                <option value="dept_prefix">Department + Title</option>
                <option value="level_suffix">Title + Level</option>
                <option value="full">Department + Title + Level</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department Prefix Style</label>
              <select defaultValue="lowercase"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <option value="lowercase">lowercase</option>
                <option value="uppercase">UPPERCASE</option>
                <option value="capitalized">Capitalized</option>
                <option value="abbreviated">Abbreviated</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Level Suffix</label>
              <select defaultValue="parenthetical"
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500">
                <option value="parenthetical">(L1)</option>
                <option value="dash">- L1</option>
                <option value="space">L1</option>
                <option value="none">None</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Separator Character</label>
              <input type="text" defaultValue=" - "
                className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" maxLength={3} />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Preview</label>
            <div className="px-4 py-3 bg-gray-50 rounded-lg text-sm text-gray-600 font-mono">
              Engineering - Senior Engineer (L5)
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          {[
            "New designation created",
            "Designation updated",
            "Designation status changed",
            "Level salary band updated",
            "Designation assigned to employee",
            "Designation archived",
            "Bulk designation changes",
            "Level matrix updates",
          ].map((item) => (
            <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked={!item.includes("archived") && !item.includes("Bulk")} className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500" />
              </label>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
