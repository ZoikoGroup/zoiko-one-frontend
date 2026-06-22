import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { 
  FileText, 
  Shield, 
  AlertTriangle, 
  CheckCircle, 
  Download, 
  FileSpreadsheet,
  LayoutDashboard, 
  Library, 
  ClipboardCheck, 
  Settings,
  Search,
  Activity
} from "lucide-react";
import HRPage from "../../../components/HRPage";
import { getComplianceDashboard, getComplianceReport } from "../../../service/hrService";

// --- Sub-Navigation Component Embedded ---
function EmbeddedSubNav() {
  const location = useLocation();

  const NAV_ITEMS = [
    { label: "Dashboard & Reports", href: "/comply", icon: LayoutDashboard },
    { label: "Policy Library", href: "/comply/policies", icon: Library },
    { label: "Tracking & Audits", href: "/comply/audits", icon: ClipboardCheck },
    { label: "Violations & Actions", href: "/comply/incidents", icon: Activity },
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
              isActive
                ? "bg-emerald-50 text-emerald-700 shadow-sm border border-emerald-100"
                : "text-gray-600 hover:bg-gray-50 border border-transparent"
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

function StatsCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 shadow-sm flex items-center gap-4">
      <div className={`p-3 rounded-xl ${color}`}><Icon size={22} /></div>
      <div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs text-gray-500 font-medium tracking-wide mt-0.5">{title}</p>
      </div>
    </div>
  );
}

export default function CombinedDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([getComplianceDashboard(), getComplianceReport()])
      .then(([dashRes, reportRes]) => {
        setDashboardData(dashRes?.data || dashRes || {});
        setReports(Array.isArray(reportRes) ? reportRes : reportRes?.data || []);
      })
      .catch((err) => console.error("Error loading compliance analytics", err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-400 text-sm">Loading metrics network data...</div>;

  const stats = dashboardData?.stats || {};

  return (
    <HRPage title="Compliance Overview & Executive Reports" subtitle="Analyze organizational health metrics and run data sheets.">
      <EmbeddedSubNav />
      
      <div className="space-y-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatsCard title="Total Library Policies" value={stats.totalPolicies || 0} icon={FileText} color="bg-blue-50 text-blue-600" />
          <StatsCard title="Pending Acknowledgment" value={stats.pendingAcknowledgment || 0} icon={Shield} color="bg-yellow-50 text-yellow-600" />
          <StatsCard title="Open Breaches Flagged" value={stats.openViolations || 0} icon={AlertTriangle} color="bg-red-50 text-red-600" />
          <StatsCard title="Completed Audits" value={stats.completedAudits || 0} icon={CheckCircle} color="bg-emerald-50 text-emerald-600" />
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <div className="mb-4">
            <h3 className="text-base font-bold text-gray-900">On-Demand Compliance Exports</h3>
            <p className="text-xs text-gray-400">Download dynamic cross-sections of updated statutory files.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reports.map((report) => (
              <div key={report.id} className="flex items-center justify-between p-4 border border-gray-100 rounded-xl hover:bg-gray-50 transition-colors">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${report.type === "PDF" ? "bg-red-50 text-red-500" : "bg-emerald-50 text-emerald-600"}`}>
                    {report.type === "PDF" ? <FileText size={20} /> : <FileSpreadsheet size={20} />}
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-gray-900">{report.title}</h4>
                    <p className="text-xs text-gray-400">{report.size} &middot; Updated {new Date(report.date).toLocaleDateString()}</p>
                  </div>
                </div>
                <button className="p-2 text-gray-400 hover:text-emerald-600 rounded-lg hover:bg-gray-100 transition-colors">
                  <Download size={18} />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </HRPage>
  );
}