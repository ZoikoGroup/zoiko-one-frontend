import { useState } from "react";
import { NavLink } from "react-router-dom";
import { Save, Bell, Shield, FileText, Clock, Users, Sliders, HardDrive } from "lucide-react";
import HRPage from "../../../components/HRPage";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/documents" },
  { label: "Employee Documents", href: "/zoiko-hr/documents/employee-documents" },
  { label: "Company Documents", href: "/zoiko-hr/documents/company-documents" },
  { label: "Templates", href: "/zoiko-hr/documents/templates" },
  { label: "Policies", href: "/zoiko-hr/documents/policies" },
  { label: "Compliance Documents", href: "/zoiko-hr/documents/compliance" },
  { label: "Approval Workflow", href: "/zoiko-hr/documents/approvals" },
  { label: "Expiring Documents", href: "/zoiko-hr/documents/expiring-documents" },
  { label: "Archive", href: "/zoiko-hr/documents/archive" },
  { label: "Reports", href: "/zoiko-hr/documents/reports" },
  { label: "Settings", href: "/zoiko-hr/documents/settings" },
];

const retentionPolicies = [
  { id: "contracts", label: "Employment Contracts", duration: "7 years", category: "Legal" },
  { id: "payroll", label: "Payroll Records", duration: "6 years", category: "Financial" },
  { id: "tax", label: "Tax Records", duration: "10 years", category: "Financial" },
  { id: "training", label: "Training Records", duration: "3 years", category: "HR" },
  { id: "performance", label: "Performance Reviews", duration: "5 years", category: "HR" },
  { id: "compliance", label: "Compliance Docs", duration: "10 years", category: "Legal" },
];

const docTypes = [
  { id: "pdf", label: "PDF", enabled: true },
  { id: "docx", label: "Word (DOCX)", enabled: true },
  { id: "xlsx", label: "Excel (XLSX)", enabled: true },
  { id: "pptx", label: "PowerPoint (PPTX)", enabled: true },
  { id: "images", label: "Images (PNG, JPG)", enabled: true },
  { id: "txt", label: "Text Files", enabled: false },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink key={item.href} to={item.href} end={item.href === "/zoiko-hr/documents"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive ? "text-purple-600 border-b-2 border-purple-600 bg-purple-50/50" : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }>
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

export default function DocumentsSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "storage", label: "Storage", icon: HardDrive },
    { id: "retention", label: "Retention", icon: Clock },
    { id: "types", label: "Document Types", icon: FileText },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  return (
    <HRPage title="Documents Settings" subtitle="Configure document management preferences">
      <SubNav />
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Documents Settings</h1>
            <p className="text-sm text-gray-500 mt-1">Configure document management preferences</p>
          </div>
          <button onClick={handleSave} className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 text-sm font-medium">
            <Save className="w-4 h-4" /> {saved ? "Saved!" : "Save Changes"}
          </button>
        </div>

        <div className="flex gap-1 border-b border-gray-200">
          {tabs.map((tab) => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)}
              className={`flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors ${
                activeTab === tab.id ? "border-purple-500 text-purple-600" : "border-transparent text-gray-500 hover:text-gray-700"
              }`}>
              <tab.icon className="w-4 h-4" /> {tab.label}
            </button>
          ))}
        </div>

        {activeTab === "general" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Document Owner</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                  <option>Department Head</option>
                  <option>Document Creator</option>
                  <option>Admin</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Default Storage Location</label>
                <select className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500">
                  <option>Company Drive</option>
                  <option>Cloud Storage</option>
                  <option>Local Server</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Max File Size (MB)</label>
                <input type="number" defaultValue={50} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Version Limit</label>
                <input type="number" defaultValue={10} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500/20 focus:border-purple-500" />
              </div>
            </div>
          </div>
        )}

        {activeTab === "storage" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Storage Usage</h2>
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-gray-600">Used: 245 GB of 500 GB</span>
                <span className="text-sm font-medium text-gray-900">49%</span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-3">
                <div className="bg-purple-500 h-3 rounded-full" style={{ width: "49%" }} />
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {[
                { label: "Employee Docs", size: "120 GB", percentage: 48 },
                { label: "Company Docs", size: "85 GB", percentage: 34 },
                { label: "Archived", size: "40 GB", percentage: 18 },
              ].map((item) => (
                <div key={item.label} className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm font-medium text-gray-900">{item.label}</p>
                  <p className="text-2xl font-bold text-gray-900 mt-1">{item.size}</p>
                  <p className="text-xs text-gray-500">{item.percentage}% of used storage</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "retention" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Retention Policies</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Document Category</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Retention Period</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Department</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {retentionPolicies.map((policy) => (
                    <tr key={policy.id} className="border-b border-gray-100">
                      <td className="py-3 px-4 font-medium text-gray-900">{policy.label}</td>
                      <td className="py-3 px-4 text-gray-600">{policy.duration}</td>
                      <td className="py-3 px-4"><span className="text-xs font-medium px-2 py-0.5 rounded-full bg-purple-100 text-purple-700">{policy.category}</span></td>
                      <td className="py-3 px-4">
                        <button className="text-purple-600 hover:text-purple-800 text-xs font-medium">Edit</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === "types" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Allowed Document Types</h2>
            <div className="space-y-3">
              {docTypes.map((dt) => (
                <div key={dt.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                  <span className="text-sm text-gray-700">{dt.label}</span>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input type="checkbox" defaultChecked={dt.enabled} className="sr-only peer" />
                    <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500" />
                  </label>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "notifications" && (
          <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
            {[
              "Document pending approval",
              "Document expiring soon",
              "Document expired",
              "New version uploaded",
              "Retention policy expiring",
              "Storage limit approaching",
            ].map((item) => (
              <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <span className="text-sm text-gray-700">{item}</span>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-purple-500" />
                </label>
              </div>
            ))}
          </div>
        )}
      </div>
    </HRPage>
  );
}
