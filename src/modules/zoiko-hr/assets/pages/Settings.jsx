import { useState } from "react";
import { Save, Sliders, CheckCircle, Wrench, Bell, Plus, Trash2 } from "lucide-react";
import { ASSET_CATEGORY } from "../types";

const initialCategories = Object.values(ASSET_CATEGORY);

const approvalSteps = [
  { id: 1, role: "Team Lead", order: 1, required: true },
  { id: 2, role: "Department Head", order: 2, required: true },
  { id: 3, role: "IT Manager", order: 3, required: true },
  { id: 4, role: "Finance", order: 4, required: false },
];

const maintenanceDefaults = [
  { key: "warrantyPeriod", label: "Default Warranty Period (months)", value: "12" },
  { key: "maintenanceInterval", label: "Default Maintenance Interval (days)", value: "90" },
  { key: "repairBudget", label: "Annual Repair Budget ($)", value: "25000" },
  { key: "vendorWarranty", label: "Vendor Warranty Required", value: "Yes" },
];

const notifications = [
  { id: "warranty_expiry", label: "Warranty Expiry Reminder", desc: "30 days before warranty expires" },
  { id: "maintenance_due", label: "Maintenance Due", desc: "When scheduled maintenance is due" },
  { id: "asset_assigned", label: "Asset Assignment", desc: "When an asset is assigned to an employee" },
  { id: "asset_returned", label: "Asset Returned", desc: "When an asset is returned" },
  { id: "request_approved", label: "Request Approved", desc: "When an asset request is approved" },
  { id: "maintenance_overdue", label: "Maintenance Overdue", desc: "When maintenance is past due date" },
];

export default function AssetSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);
  const [categories, setCategories] = useState(initialCategories);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "approvals", label: "Approvals", icon: CheckCircle },
    { id: "maintenance", label: "Maintenance", icon: Wrench },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Asset Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure asset module preferences</p>
        </div>
        <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 text-sm font-medium transition-colors">
          <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
        </button>
      </div>

      <div className="flex gap-1 border-b border-gray-200">
        {tabs.map((tab) => (
          <button key={tab.id} onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
              activeTab === tab.id ? "border-amber-500 text-amber-600" : "border-transparent text-gray-500 hover:text-gray-700"
            }`}>
            <tab.icon className="w-4 h-4" /> {tab.label}
          </button>
        ))}
      </div>

      {activeTab === "general" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold text-gray-900">Asset Categories</h2>
            <button className="flex items-center gap-1 text-sm text-amber-600 hover:text-amber-700 font-medium">
              <Plus className="w-4 h-4" /> Add Category
            </button>
          </div>
          <div className="space-y-2">
            {categories.map((cat) => (
              <div key={cat} className="flex items-center justify-between py-2.5 px-3 border border-gray-100 rounded-lg hover:bg-gray-50">
                <div className="flex items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span className="text-sm font-medium text-gray-800">{cat}</span>
                </div>
                <button className="p-1 text-gray-300 hover:text-red-500 transition-colors"><Trash2 className="w-4 h-4" /></button>
              </div>
            ))}
          </div>
          <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Asset Prefix</label>
              <input type="text" defaultValue="AST" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Auto Asset Tag Format</label>
              <input type="text" defaultValue="AST-{NNNN}" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "approvals" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Request Approval Workflow</h2>
          <p className="text-sm text-gray-500 mb-4">Configure the approval steps for asset requests</p>
          <div className="space-y-3">
            {approvalSteps.map((step) => (
              <div key={step.id} className="flex items-center justify-between py-3 px-4 border border-gray-100 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="flex items-center justify-center w-7 h-7 rounded-full bg-amber-100 text-amber-700 text-xs font-bold">{step.order}</div>
                  <div>
                    <span className="text-sm font-medium text-gray-900">{step.role}</span>
                    {step.required && <span className="ml-2 text-xs text-amber-600 font-medium">Required</span>}
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={step.required} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>
            ))}
          </div>
          <div className="mt-6">
            <label className="block text-sm font-medium text-gray-700 mb-1">Auto-approve requests under ($)</label>
            <input type="number" defaultValue={500} className="w-full max-w-xs px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
          </div>
        </div>
      )}

      {activeTab === "maintenance" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Maintenance Defaults</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {maintenanceDefaults.map((item) => (
              <div key={item.key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">{item.label}</label>
                <input type="text" defaultValue={item.value} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
              </div>
            ))}
          </div>
          <div className="mt-6">
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Depreciation Settings</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Depreciation Method</label>
                <select defaultValue="straight_line" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500">
                  <option value="straight_line">Straight Line</option>
                  <option value="declining">Declining Balance</option>
                  <option value="sum_of_years">Sum of Years Digits</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Useful Life (years)</label>
                <input type="number" defaultValue={5} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Salvage Value (%)</label>
                <input type="number" defaultValue={10} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-amber-500/20 focus:border-amber-500" />
              </div>
            </div>
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          <div className="space-y-3">
            {notifications.map((item) => (
              <div key={item.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-xs text-gray-500">{item.desc}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-amber-500" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
