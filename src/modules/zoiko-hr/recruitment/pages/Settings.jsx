import { useState } from "react";
import { Save, Bell, Shield, Mail, Sliders, Globe, Webhook, RefreshCw } from "lucide-react";

const emailTemplates = [
  { id: "acknowledgment", label: "Application Acknowledgment", subject: "Thank you for applying to {company}", enabled: true },
  { id: "screening", label: "Screening Invitation", subject: "Interview invitation for {position}", enabled: true },
  { id: "rejection", label: "Candidate Rejection", subject: "Update on your application to {company}", enabled: false },
  { id: "offer", label: "Offer Letter", subject: "Job offer from {company} for {position}", enabled: true },
  { id: "onboarding", label: "Onboarding Instructions", subject: "Welcome to {company} - Next Steps", enabled: true },
];

const stages = [
  { id: "applied", label: "Applied", active: true },
  { id: "screening", label: "Screening", active: true },
  { id: "interview", label: "Interview", active: true },
  { id: "assessment", label: "Assessment", active: false },
  { id: "reference", label: "Reference Check", active: true },
  { id: "offer", label: "Offer", active: true },
  { id: "hired", label: "Hired", active: true },
];

export default function RecruitmentSettings() {
  const [activeTab, setActiveTab] = useState("general");
  const [saved, setSaved] = useState(false);

  const handleSave = () => { setSaved(true); setTimeout(() => setSaved(false), 2000); };

  const tabs = [
    { id: "general", label: "General", icon: Sliders },
    { id: "pipeline", label: "Pipeline", icon: Shield },
    { id: "email", label: "Email Templates", icon: Mail },
    { id: "notifications", label: "Notifications", icon: Bell },
    { id: "integrations", label: "Integrations", icon: Globe },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Recruitment Settings</h1>
          <p className="text-sm text-gray-500 mt-1">Configure recruitment module preferences</p>
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Company Name</label>
              <input type="text" defaultValue="ZoikoOne" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Hiring Manager</label>
              <input type="text" defaultValue="HR Team" className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Default Interview Duration (min)</label>
              <input type="number" defaultValue={60} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Offer Valid Days</label>
              <input type="number" defaultValue={7} className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500" />
            </div>
          </div>
        </div>
      )}

      {activeTab === "pipeline" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Pipeline Stages</h2>
          <div className="space-y-3">
            {stages.map((stage) => (
              <div key={stage.id} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-orange-500" />
                  <span className="text-sm font-medium text-gray-900">{stage.label}</span>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={stage.active} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "email" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Email Templates</h2>
          <div className="space-y-3">
            {emailTemplates.map((tmpl) => (
              <div key={tmpl.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                <div>
                  <p className="text-sm font-medium text-gray-900">{tmpl.label}</p>
                  <p className="text-xs text-gray-500">{tmpl.subject}</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" defaultChecked={tmpl.enabled} className="sr-only peer" />
                  <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500" />
                </label>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === "notifications" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Notification Preferences</h2>
          {["New application received", "Interview scheduled", "Feedback submitted", "Offer accepted/declined", "Candidate reaches final stage"].map((item) => (
            <div key={item} className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0">
              <span className="text-sm text-gray-700">{item}</span>
              <label className="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" defaultChecked className="sr-only peer" />
                <div className="w-9 h-5 bg-gray-200 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-4 after:w-4 after:transition-all peer-checked:bg-orange-500" />
              </label>
            </div>
          ))}
        </div>
      )}

      {activeTab === "integrations" && (
        <div className="bg-white rounded-xl border border-gray-200 p-6 space-y-4">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Integrations</h2>
          {[
            { name: "LinkedIn Recruiter", icon: Webhook, desc: "Sync job postings and candidate profiles", connected: true },
            { name: "Indeed", icon: Globe, desc: "Post jobs to Indeed", connected: true },
            { name: "Glassdoor", icon: Globe, desc: "Employer branding and job posting", connected: false },
            { name: "Slack", icon: Webhook, desc: "Hiring notifications", connected: true },
            { name: "Calendly", icon: RefreshCw, desc: "Interview scheduling automation", connected: false },
          ].map((int) => (
            <div key={int.name} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gray-100 rounded-lg"><int.icon className="w-4 h-4 text-gray-600" /></div>
                <div>
                  <p className="text-sm font-medium text-gray-900">{int.name}</p>
                  <p className="text-xs text-gray-500">{int.desc}</p>
                </div>
              </div>
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${int.connected ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                {int.connected ? "Connected" : "Not Connected"}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
