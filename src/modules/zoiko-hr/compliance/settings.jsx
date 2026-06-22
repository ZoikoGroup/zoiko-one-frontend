import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Sliders, Save, AlertOctagon, LayoutDashboard, Library, ClipboardCheck, AlertTriangle, Settings } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getRiskAssessments } from "../../../service/hrService";

function EmbeddedSubNav() {
  const location = useLocation();
  const NAV_ITEMS = [
    { label: "Dashboard & Reports", href: "/comply", icon: LayoutDashboard },
    { label: "Policy Library", href: "/comply/policies", icon: Library },
    { label: "Tracking & Audits", href: "/comply/audits", icon: ClipboardCheck },
    { label: "Violations & Actions", href: "/comply/incidents", icon: AlertTriangle },
    { label: "Risks & Settings", href: "/comply/settings", icon: Settings },
  ];

  return (
    <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-4 mb-6">
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.href;
        return (
          <Link
            key={item.href}
            to={item.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all ${
              isActive ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100" : "text-gray-600 hover:bg-gray-50 border border-transparent"
            }`}
          >
            <Icon size={16} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </div>
  );
}

export default function SettingsRiskParameters() {
  const [risks, setRisks] = useState([]);
  const [triggerInterval, setTriggerInterval] = useState("30");

  useEffect(() => {
    getRiskAssessments().then((res) => setRisks(Array.isArray(res) ? res : res?.data || []));
  }, []);

  return (
    <HRPage title="Risk Controls & Environment Settings" subtitle="Configure platform rules alongside threat calculations.">
      <EmbeddedSubNav />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="bg-white border border-gray-200 p-5 rounded-xl space-y-5 h-fit shadow-sm">
          <h3 className="text-sm font-bold text-gray-900 flex items-center gap-1.5">
            <Sliders size={16} className="text-emerald-600" /> System Automation Anchors
          </h3>
          
          <div>
            <label className="block text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">
              Audit Pipeline Recurrence
            </label>
            <select 
              className="w-full border border-gray-200 p-2.5 rounded-xl text-sm bg-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none transition-all font-medium text-gray-800"
              value={triggerInterval} 
              onChange={(e) => setTriggerInterval(e.target.value)}
            >
              <option value="30">Every 30 Days (Continuous Audit)</option>
              <option value="90">Every 90 Days (Quarterly Loop)</option>
              <option value="365">Every 365 Days (Annual Verification)</option>
            </select>
          </div>

          <button className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-colors">
            <Save size={14} /> Save Configuration
          </button>
        </div>

        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Dynamic Strategic Threats Matrix</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {risks.map((r) => {
              const isHighRisk = r.riskScore >= 12;
              return (
                <div 
                  key={r.id} 
                  className={`p-4 rounded-xl border transition-all shadow-sm ${
                    isHighRisk ? "bg-red-50/40 border-red-200" : "bg-amber-50/40 border-amber-200"
                  }`}
                >
                  <div className="flex justify-between items-center gap-2">
                    <span className="text-[10px] font-bold text-gray-400 uppercase tracking-wider capitalize">{r.category}</span>
                    <span className={`text-xs font-extrabold px-2 py-0.5 rounded-lg shadow-sm border ${
                      isHighRisk ? "bg-white border-red-200 text-red-700" : "bg-white border-amber-200 text-amber-700"
                    }`}>
                      Score: {r.riskScore}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-gray-900 mt-3 flex items-center gap-1.5">
                    <AlertOctagon size={15} className={isHighRisk ? "text-red-500" : "text-amber-500"} />
                    {r.title}
                  </h4>
                  <p className="text-xs text-gray-500 mt-2 font-medium line-clamp-2 leading-relaxed">
                    <span className="font-bold text-gray-600">Mitigation:</span> {r.mitigation}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </HRPage>
  );
}