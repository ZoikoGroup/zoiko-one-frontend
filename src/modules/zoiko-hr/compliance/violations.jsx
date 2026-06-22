import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, Calendar, Wrench, ShieldAlert, LayoutDashboard, Library, ClipboardCheck, AlertTriangle, Settings } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getComplianceViolations, getCorrectiveActions } from "../../../service/hrService";

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

export default function CombinedViolationsHub() {
  const [violations, setViolations] = useState([]);
  const [actions, setActions] = useState([]);

  useEffect(() => {
    getComplianceViolations().then((res) => setViolations(Array.isArray(res) ? res : res?.data || []));
    getCorrectiveActions().then((res) => setActions(Array.isArray(res) ? res : res?.data || []));
  }, []);

  return (
    <HRPage title="Breaches & Remediation Tasks" subtitle="Analyze reported incident filings and check pending corrective actions.">
      <EmbeddedSubNav />

      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        <div className="xl:col-span-2 space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Active Policy Violations</h3>
          {violations.map((v) => {
            const relatedActions = actions.filter((a) => a.violation === v.violation || a.title?.includes(v.employee));
            
            return (
              <div key={v.id} className="bg-white border rounded-xl p-4 shadow-sm space-y-3 border-l-4 border-l-red-500">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="font-bold text-gray-900 text-sm flex items-center gap-1.5">
                      <ShieldAlert size={16} className="text-red-500 shrink-0" /> {v.violation}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1">Policy: {v.policy} &middot; Filed By: {v.reportedBy}</p>
                  </div>
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold uppercase bg-red-50 text-red-700 border border-red-100">
                    {v.severity}
                  </span>
                </div>

                <div className="flex flex-wrap gap-4 text-xs font-medium text-gray-500 bg-gray-50 p-2.5 rounded-lg">
                  <span className="flex items-center gap-1"><User size={13} /> {v.employee}</span>
                  <span className="flex items-center gap-1"><Calendar size={13} /> Filed: {new Date(v.date).toLocaleDateString()}</span>
                </div>

                {relatedActions.length > 0 && (
                  <div className="pt-3 border-t border-dashed border-gray-200 space-y-2">
                    <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider flex items-center gap-1">
                      <Wrench size={12} /> Bound Remediation Tracks
                    </p>
                    {relatedActions.map((act) => (
                      <div key={act.id} className="flex justify-between items-center text-xs bg-amber-50/40 p-2 rounded-lg border border-amber-100/60">
                        <span className="text-gray-800 font-medium">{act.title} <span className="text-gray-400 font-normal">({act.assignedTo})</span></span>
                        <span className="text-amber-700 font-bold uppercase text-[10px]">{act.status}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </div>

        <div className="space-y-4">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Remediation Task Queue</h3>
          <div className="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-sm">
            {actions.map((act) => (
              <div key={act.id} className="p-3 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors text-xs">
                <div className="flex items-center justify-between font-semibold gap-2 mb-1">
                  <span className="text-gray-900 truncate">{act.title}</span>
                  <span className={`px-2 py-0.5 rounded-full text-[10px] uppercase font-bold tracking-wide ${
                    act.status === "completed" ? "bg-emerald-50 text-emerald-700" : "bg-amber-50 text-amber-700"
                  }`}>{act.status}</span>
                </div>
                <p className="text-gray-400 font-medium">Target Limit: {new Date(act.deadline).toLocaleDateString()}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRPage>
  );
}