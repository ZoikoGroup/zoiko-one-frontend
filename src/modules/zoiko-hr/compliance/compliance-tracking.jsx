import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { User, ShieldCheck, LayoutDashboard, Library, ClipboardCheck, AlertTriangle, Settings } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getAcknowledgements, getAudits } from "../../../service/hrService";

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

export default function TrackingAuditsHub() {
  const [tracking, setTracking] = useState([]);
  const [audits, setAudits] = useState([]);
  const [viewMode, setViewMode] = useState("logs");

  useEffect(() => {
    getAcknowledgements().then((res) => setTracking(Array.isArray(res) ? res : res?.data || []));
    getAudits().then((res) => setAudits(Array.isArray(res) ? res : res?.data || []));
  }, []);

  return (
    <HRPage title="Execution Trackers & Audits" subtitle="Track user document confirmations alongside structured systems checks.">
      <EmbeddedSubNav />
      
      <div className="flex justify-between items-center mb-5">
        <div className="inline-flex rounded-xl bg-gray-100 p-1 text-xs font-semibold">
          <button 
            onClick={() => setViewMode("logs")} 
            className={`px-4 py-2 rounded-lg transition-all ${viewMode === "logs" ? "bg-white shadow text-emerald-700 font-bold" : "text-gray-500 hover:text-gray-900"}`}
          >
            Employee Acknowledgments
          </button>
          <button 
            onClick={() => setViewMode("audits")} 
            className={`px-4 py-2 rounded-lg transition-all ${viewMode === "audits" ? "bg-white shadow text-emerald-700 font-bold" : "text-gray-500 hover:text-gray-900"}`}
          >
            Structural System Audits
          </button>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-xl overflow-hidden shadow-sm">
        {viewMode === "logs" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-4">Staff Resource</th>
                  <th className="p-4">Assigned Guideline</th>
                  <th className="p-4">Status</th>
                  <th className="p-4">Due Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {tracking.map((t) => (
                  <tr key={t.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-semibold text-gray-900 flex items-center gap-2">
                      <User size={15} className="text-gray-400" /> {t.employee}
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{t.policy}</td>
                    <td className="p-4">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold uppercase ${
                        t.status === "acknowledged" ? "bg-emerald-50 text-emerald-700 border border-emerald-100" : "bg-amber-50 text-amber-700 border border-amber-100"
                      }`}>
                        {t.status}
                      </span>
                    </td>
                    <td className="p-4 text-gray-500 font-medium">{t.dueDate ? new Date(t.dueDate).toLocaleDateString() : "—"}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 border-b text-xs text-gray-500 uppercase font-semibold">
                <tr>
                  <th className="p-4">Evaluation Target</th>
                  <th className="p-4">Lead Auditor</th>
                  <th className="p-4">Score Metrics</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {audits.map((a) => (
                  <tr key={a.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-semibold text-gray-900 flex items-center gap-2">
                      <ShieldCheck size={16} className="text-blue-500" /> {a.title}
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{a.auditor}</td>
                    <td className="p-4 font-bold text-emerald-600">{a.score ? `${a.score}%` : "—"}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 bg-gray-100 text-gray-700 border border-gray-200 rounded-full text-xs font-semibold uppercase">
                        {a.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </HRPage>
  );
}