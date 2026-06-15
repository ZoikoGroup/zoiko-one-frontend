import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import {
  getOnboardingJoiningReport,
  getOnboardingPendingActivities,
  getOnboardingDepartmentReport,
  getOnboardingCompletionReport,
} from "../../../service/hrService";
import {
  Users,
  UserPlus,
  CalendarDays,
  TrendingUp,
  Clock,
  FileText,
  Package,
  BookOpen,
  ClipboardCheck,
  KeyRound,
  Building2,
  CheckCircle2,
  Loader2,
  Download,
  Circle,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/onboarding" },
  { label: "New Hires", href: "/zoiko-hr/onboarding/new-hires" },
  { label: "Pre-Onboarding", href: "/zoiko-hr/onboarding/pre-onboarding" },
  { label: "Documents", href: "/zoiko-hr/onboarding/documents" },
  { label: "Checklists", href: "/zoiko-hr/onboarding/checklists" },
  { label: "Dept Assignment", href: "/zoiko-hr/onboarding/department-assignment" },
  { label: "Manager Assignment", href: "/zoiko-hr/onboarding/manager-assignment" },
  { label: "Assets & Access", href: "/zoiko-hr/onboarding/assets-access" },
  { label: "Orientation", href: "/zoiko-hr/onboarding/orientation" },
  { label: "Training", href: "/zoiko-hr/onboarding/training" },
  { label: "Progress", href: "/zoiko-hr/onboarding/progress" },
  { label: "Reports", href: "/zoiko-hr/onboarding/reports" },
  { label: "Settings", href: "/zoiko-hr/onboarding/settings" },
];

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const DEPT_COLORS = [
  "bg-blue-500", "bg-emerald-500", "bg-amber-500", "bg-violet-500",
  "bg-rose-500", "bg-cyan-500", "bg-orange-500", "bg-teal-500",
];

const STATUS_COLORS = ["#22c55e", "#eab308", "#ef4444", "#3b82f6"];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/onboarding"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-blue-600 border-b-2 border-blue-600 bg-blue-50/50"
                : "text-gray-500 hover:text-gray-700 hover:bg-gray-50"
            }`
          }
        >
          {item.label}
        </NavLink>
      ))}
    </div>
  );
}

function Tabs({ tabs, active, onChange }) {
  return (
    <div className="flex gap-1 mb-4">
      {tabs.map((tab) => (
        <button
          key={tab.key}
          onClick={() => onChange(tab.key)}
          className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
            active === tab.key
              ? "bg-blue-600 text-white shadow-sm"
              : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, suffix }) {
  return (
    <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4 flex items-center justify-between">
      <div>
        <p className="text-xs text-gray-400 font-medium uppercase tracking-wider">{title}</p>
        <p className="text-2xl font-bold text-gray-800 mt-1">
          {value}{suffix && <span className="text-sm font-normal text-gray-400 ml-1">{suffix}</span>}
        </p>
      </div>
      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${color || "bg-blue-50"}`}>
        <Icon size={20} className={color ? "text-white" : "text-blue-600"} />
      </div>
    </div>
  );
}

function SimpleBar({ label, value, max, color }) {
  const pct = max > 0 ? Math.round((value / max) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-500 w-16 shrink-0 truncate">{label}</span>
      <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
        <div className={`h-full rounded-full transition-all duration-500 ${color}`} style={{ width: `${pct}%` }} />
      </div>
      <span className="text-xs font-medium text-gray-600 w-8 text-right">{value}</span>
    </div>
  );
}

function PieLegend({ label, value, total, color }) {
  const pct = total > 0 ? Math.round((value / total) * 100) : 0;
  return (
    <div className="flex items-center gap-2">
      <Circle size={10} fill={color} stroke={color} />
      <span className="text-xs text-gray-500 flex-1">{label}</span>
      <span className="text-xs font-medium text-gray-700">{pct}% ({value})</span>
    </div>
  );
}

function downloadCSV(headers, rows, filename) {
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(",")),
  ].join("\n");
  const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  link.click();
  URL.revokeObjectURL(link.href);
}

function SectionHeader({ title, icon: Icon, onDownload }) {
  return (
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
        <Icon size={16} className="text-blue-600" />
        {title}
      </h3>
      {onDownload && (
        <button
          onClick={onDownload}
          className="flex items-center gap-1.5 text-xs font-medium text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 px-3 py-1.5 rounded-lg transition-colors"
        >
          <Download size={14} />
          CSV
        </button>
      )}
    </div>
  );
}

export default function OnboardingReports() {
  const [activeTab, setActiveTab] = useState("joining");
  const [joining, setJoining] = useState(null);
  const [pending, setPending] = useState(null);
  const [department, setDepartment] = useState(null);
  const [completion, setCompletion] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchAll = async () => {
      setLoading(true);
      setError(null);
      try {
        const [j, p, d, c] = await Promise.all([
          getOnboardingJoiningReport(),
          getOnboardingPendingActivities(),
          getOnboardingDepartmentReport(),
          getOnboardingCompletionReport(),
        ]);
        if (!mounted) return;
        setJoining(j);
        setPending(p);
        setDepartment(d);
        setCompletion(c);
      } catch (err) {
        if (mounted) setError(err.message || "Failed to load reports");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    fetchAll();
    return () => { mounted = false; };
  }, []);

  const tabs = [
    { key: "joining", label: "Joining Report" },
    { key: "pending", label: "Pending Activities" },
    { key: "department", label: "Department-wise" },
    { key: "completion", label: "Completion Report" },
  ];

  const monthlyTrend = joining?.monthlyTrend || [];
  const maxMonthly = Math.max(...monthlyTrend.map((m) => m.count), 1);

  const pendingItems = pending?.items || [];
  const pendingLabels = {
    documents: { icon: FileText, label: "Documents", color: "bg-blue-500" },
    assets: { icon: Package, label: "Assets", color: "bg-violet-500" },
    orientation: { icon: CalendarDays, label: "Orientation", color: "bg-amber-500" },
    training: { icon: BookOpen, label: "Training", color: "bg-rose-500" },
    checklists: { icon: ClipboardCheck, label: "Checklists", color: "bg-cyan-500" },
    access: { icon: KeyRound, label: "Access", color: "bg-indigo-500" },
  };

  const deptData = department?.departments || [];
  const compStatus = completion?.statusBreakdown || { completed: 0, inProgress: 0, pending: 0, cancelled: 0 };
  const compTotal = Object.values(compStatus).reduce((a, b) => a + b, 0) || 1;

  const handleDownload = () => {
    switch (activeTab) {
      case "joining": {
        const headers = ["Month", "Count"];
        const rows = monthlyTrend.map((m) => [m.month, m.count]);
        downloadCSV(headers, rows, "joining-report.csv");
        break;
      }
      case "pending": {
        const headers = ["Activity", "Pending Count"];
        const rows = pendingItems.map((item) => [item.label || item.type, item.count]);
        downloadCSV(headers, rows, "pending-activities.csv");
        break;
      }
      case "department": {
        const headers = ["Department", "Total", "Completed", "In Progress", "Cancelled"];
        const rows = deptData.map((d) => [d.name, d.total, d.completed, d.inProgress, d.cancelled]);
        downloadCSV(headers, rows, "department-report.csv");
        break;
      }
      case "completion": {
        const headers = ["Status", "Count"];
        const rows = Object.entries(compStatus).map(([k, v]) => [k, v]);
        downloadCSV(headers, rows, "completion-report.csv");
        break;
      }
    }
  };

  if (loading) {
    return (
      <HRPage title="Onboarding Reports" subtitle="Analyse onboarding metrics and generate reports.">
        <SubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading reports...</span>
        </div>
      </HRPage>
    );
  }

  if (error) {
    return (
      <HRPage title="Onboarding Reports" subtitle="Analyse onboarding metrics and generate reports.">
        <SubNav />
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          Error: {error}
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Onboarding Reports" subtitle="Analyse onboarding metrics and generate reports.">
      <SubNav />

      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Tabs tabs={tabs} active={activeTab} onChange={setActiveTab} />
          <button
            onClick={handleDownload}
            className="flex items-center gap-1.5 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg transition-colors shadow-sm"
          >
            <Download size={16} />
            Download CSV
          </button>
        </div>

        {activeTab === "joining" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <StatCard title="Total Joiners" value={joining?.totalJoiners ?? 0} icon={Users} color="bg-blue-500" />
              <StatCard title="This Month" value={joining?.thisMonth ?? 0} icon={UserPlus} color="bg-emerald-500" />
              <StatCard title="This Quarter" value={joining?.thisQuarter ?? 0} icon={CalendarDays} color="bg-violet-500" />
              <StatCard title="Avg Days to Onboard" value={joining?.avgDaysToOnboard ?? 0} icon={Clock} color="bg-amber-500" suffix="days" />
            </div>

            <SectionHeader title="Monthly Joining Trend" icon={TrendingUp} />
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
              {monthlyTrend.length === 0 ? (
                <p className="text-xs text-gray-400 text-center py-6">No joining data available</p>
              ) : (
                <div className="space-y-2">
                  {monthlyTrend.map((m) => (
                    <SimpleBar key={m.month} label={m.month} value={m.count} max={maxMonthly} color="bg-blue-500" />
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "pending" && (
          <div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
              {Object.entries(pendingLabels).map(([key, cfg]) => (
                <div key={key} className="bg-white rounded-xl border border-gray-100 shadow-sm p-3 flex items-center gap-3">
                  <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${cfg.color}`}>
                    <cfg.icon size={18} className="text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-gray-400">{cfg.label}</p>
                    <p className="text-lg font-bold text-gray-800">
                      {pending?.[key] ?? 0}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {pendingItems.length > 0 && (
              <div className="mt-6 bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="px-4 py-3 border-b border-gray-100">
                  <h3 className="text-sm font-semibold text-gray-700">Pending Activity Details</h3>
                </div>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Activity</th>
                        <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Department</th>
                        <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Pending Count</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {pendingItems.map((item, i) => (
                        <tr key={i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2.5 font-medium text-gray-800">{item.label || item.type}</td>
                          <td className="px-4 py-2.5 text-gray-500">{item.department || "-"}</td>
                          <td className="px-4 py-2.5 text-right font-semibold text-gray-700">{item.count}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "department" && (
          <div>
            <SectionHeader title="Department-wise Onboarding Status" icon={Building2} />
            <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-100">
                    <tr>
                      <th className="text-left px-4 py-2.5 font-semibold text-gray-600">Department</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Total</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Completed</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-gray-600">In Progress</th>
                      <th className="text-right px-4 py-2.5 font-semibold text-gray-600">Cancelled</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-50">
                    {deptData.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-4 py-8 text-center text-xs text-gray-400">No department data available</td>
                      </tr>
                    ) : (
                      deptData.map((d, i) => (
                        <tr key={d.name || i} className="hover:bg-gray-50 transition-colors">
                          <td className="px-4 py-2.5 font-medium text-gray-800 flex items-center gap-2">
                            <span className={`w-2.5 h-2.5 rounded-full ${DEPT_COLORS[i % DEPT_COLORS.length]}`} />
                            {d.name}
                          </td>
                          <td className="px-4 py-2.5 text-right font-semibold text-gray-700">{d.total}</td>
                          <td className="px-4 py-2.5 text-right text-green-600 font-medium">{d.completed}</td>
                          <td className="px-4 py-2.5 text-right text-amber-600 font-medium">{d.inProgress}</td>
                          <td className="px-4 py-2.5 text-right text-red-600 font-medium">{d.cancelled}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {deptData.length > 0 && (
              <div className="mt-4 grid grid-cols-1 lg:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">Distribution by Total</h4>
                  <div className="space-y-2">
                    {deptData.map((d, i) => {
                      const maxDept = Math.max(...deptData.map((x) => x.total), 1);
                      return (
                        <SimpleBar
                          key={d.name}
                          label={d.name}
                          value={d.total}
                          max={maxDept}
                          color={DEPT_COLORS[i % DEPT_COLORS.length]}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                  <h4 className="text-xs font-semibold text-gray-600 mb-3 uppercase tracking-wider">Completion Rate by Department</h4>
                  <div className="space-y-2">
                    {deptData.map((d, i) => {
                      const rate = d.total > 0 ? Math.round((d.completed / d.total) * 100) : 0;
                      return (
                        <div key={d.name} className="flex items-center gap-3">
                          <span className="text-xs text-gray-500 w-16 shrink-0 truncate">{d.name}</span>
                          <div className="flex-1 h-5 bg-gray-100 rounded-full overflow-hidden">
                            <div
                              className="h-full rounded-full bg-green-500 transition-all duration-500"
                              style={{ width: `${rate}%` }}
                            />
                          </div>
                          <span className="text-xs font-medium text-gray-600 w-10 text-right">{rate}%</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === "completion" && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <StatCard title="Completion Rate" value={completion?.completionRate ?? 0} icon={CheckCircle2} color="bg-green-500" suffix="%" />
              <StatCard title="Avg Completion Days" value={completion?.avgCompletionDays ?? 0} icon={Clock} color="bg-blue-500" suffix="days" />
              <StatCard title="Total Onboarded" value={compStatus.completed || 0} icon={Users} color="bg-emerald-500" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <SectionHeader title="Status Breakdown" icon={TrendingUp} />
                <div className="flex items-center justify-center gap-1 py-6">
                  {[
                    { key: "completed", value: compStatus.completed || 0, color: STATUS_COLORS[0] },
                    { key: "inProgress", value: compStatus.inProgress || 0, color: STATUS_COLORS[1] },
                    { key: "pending", value: compStatus.pending || 0, color: STATUS_COLORS[2] },
                    { key: "cancelled", value: compStatus.cancelled || 0, color: STATUS_COLORS[3] },
                  ].map((seg) => (
                    <div
                      key={seg.key}
                      className="h-20 first:rounded-l-full last:rounded-r-full transition-all duration-500"
                      style={{
                        width: `${(seg.value / compTotal) * 100}%`,
                        backgroundColor: seg.color,
                        minWidth: seg.value > 0 ? "4px" : "0",
                      }}
                    />
                  ))}
                </div>
                <div className="space-y-1.5 mt-2">
                  <PieLegend label="Completed" value={compStatus.completed || 0} total={compTotal} color={STATUS_COLORS[0]} />
                  <PieLegend label="In Progress" value={compStatus.inProgress || 0} total={compTotal} color={STATUS_COLORS[1]} />
                  <PieLegend label="Pending" value={compStatus.pending || 0} total={compTotal} color={STATUS_COLORS[2]} />
                  <PieLegend label="Cancelled" value={compStatus.cancelled || 0} total={compTotal} color={STATUS_COLORS[3]} />
                </div>
              </div>

              <div className="bg-white rounded-xl border border-gray-100 shadow-sm p-4">
                <SectionHeader title="Timeline (Avg Days per Stage)" icon={CalendarDays} />
                {completion?.stageDays && completion.stageDays.length > 0 ? (
                  <div className="space-y-3 mt-2">
                    {completion.stageDays.map((stage, i) => {
                      const maxDays = Math.max(...completion.stageDays.map((s) => s.days), 1);
                      return (
                        <SimpleBar
                          key={stage.name || i}
                          label={stage.name}
                          value={stage.days}
                          max={maxDays}
                          color={["bg-blue-500", "bg-amber-500", "bg-violet-500", "bg-green-500", "bg-rose-500"][i % 5]}
                        />
                      );
                    })}
                  </div>
                ) : (
                  <p className="text-xs text-gray-400 text-center py-6">No timeline data available</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}
