import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Scale, FileText, LayoutDashboard, Library, ClipboardCheck, AlertTriangle, Settings } from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getPolicies, getRegulatoryRequirements } from "../../../service/hrService";

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

export default function CombinedPolicyLibrary() {
  const [policies, setPolicies] = useState([]);
  const [regulations, setRegulations] = useState([]);
  const [activeTab, setActiveTab] = useState("policies");

  useEffect(() => {
    getPolicies().then((res) => setPolicies(Array.isArray(res) ? res : res?.data || []));
    getRegulatoryRequirements().then((res) => setRegulations(Array.isArray(res) ? res : res?.data || []));
  }, []);

  return (
    <HRPage title="Regulatory Mapping & Policy Library" subtitle="Review internal legal directives alongside legislative acts.">
      <EmbeddedSubNav />
      
      <div className="flex gap-4 border-b border-gray-200 mb-5 text-sm font-medium">
        <button 
          onClick={() => setActiveTab("policies")} 
          className={`pb-2 px-1 transition-all ${activeTab === "policies" ? "text-emerald-600 border-b-2 border-emerald-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
        >
          Internal Operational Policies
        </button>
        <button 
          onClick={() => setActiveTab("regulations")} 
          className={`pb-2 px-1 transition-all ${activeTab === "regulations" ? "text-emerald-600 border-b-2 border-emerald-600 font-semibold" : "text-gray-500 hover:text-gray-700"}`}
        >
          Statutory Framework Acts
        </button>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {activeTab === "policies" ? (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b">
                <tr>
                  <th className="p-4">Policy Title</th>
                  <th className="p-4">Category</th>
                  <th className="p-4">Owner / Stakeholder</th>
                  <th className="p-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {policies.map((p) => (
                  <tr key={p.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-semibold text-gray-900 flex items-center gap-2">
                      <FileText size={16} className="text-gray-400" /> {p.title}
                    </td>
                    <td className="p-4 text-gray-600 capitalize">{p.category?.replace(/_/g, " ")}</td>
                    <td className="p-4 text-gray-500">{p.owner}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-100">
                        {p.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-gray-50 text-xs uppercase text-gray-500 font-semibold border-b">
                <tr>
                  <th className="p-4">Act/Regulation Name</th>
                  <th className="p-4">Jurisdiction</th>
                  <th className="p-4">Target Mandate Category</th>
                  <th className="p-4">Operational Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {regulations.map((r) => (
                  <tr key={r.id} className="hover:bg-gray-50/70 transition-colors">
                    <td className="p-4 font-semibold text-gray-900 flex items-center gap-2">
                      <Scale size={16} className="text-emerald-600" /> {r.name}
                    </td>
                    <td className="p-4 text-gray-600 font-medium">{r.jurisdiction}</td>
                    <td className="p-4 text-gray-500 capitalize">{r.category}</td>
                    <td className="p-4">
                      <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-blue-50 text-blue-700 border border-blue-100">
                        {r.status}
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