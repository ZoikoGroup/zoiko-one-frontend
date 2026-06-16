import { useDashboard } from "../hooks/useComply";
import StatsCard from "../components/StatsCard";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { Shield, AlertTriangle, FileSearch, ClipboardCheck, Target, CalendarDays, BarChart3, Activity } from "lucide-react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid, Legend, LineChart, Line } from "recharts";

export default function Dashboard() {
  const { data, loading } = useDashboard();

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;
  if (!data) return <div className="p-6 text-gray-500">No data available.</div>;

  const { stats, complianceScoreTrend, riskDistribution, auditStatus, incidentTrend, recentObligations, topRisks, activeAudits, recentIncidents, complianceHealthScore } = data;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
          <p className="text-sm text-gray-500 mt-1">Enterprise GRC overview and key metrics</p>
        </div>
        <div className="flex items-center gap-3 bg-emerald-50 rounded-lg px-4 py-2">
          <Shield className="w-5 h-5 text-emerald-600" />
          <div>
            <p className="text-xs text-emerald-600 font-medium">Compliance Health</p>
            <p className="text-lg font-bold text-emerald-700">{complianceHealthScore}%</p>
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard title="Open Risks" value={stats?.openRisks} icon={AlertTriangle} trend="up" change={8} />
        <StatsCard title="Critical Risks" value={stats?.criticalRisks} icon={Target} trend="down" change={0} />
        <StatsCard title="Active Audits" value={stats?.activeAudits} icon={FileSearch} trend="up" change={20} />
        <StatsCard title="Outstanding Findings" value={stats?.outstandingFindings} icon={ClipboardCheck} trend="down" change={-12} />
        <StatsCard title="Policy Compliance" value={`${stats?.policyCompliance}%`} icon={Shield} trend="up" change={3} />
        <StatsCard title="Obligations Due Soon" value={stats?.obligationsDueSoon} icon={CalendarDays} trend="up" change={15} />
        <StatsCard title="Evidence Coverage" value={`${stats?.evidenceCoverage}%`} icon={BarChart3} trend="up" change={5} />
        <StatsCard title="Active Incidents" value={stats?.outstandingFindings} icon={Activity} trend="down" change={-8} />
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Risk Distribution</h3>
          <ResponsiveContainer width="100%" height={250}>
            <PieChart>
              <Pie data={riskDistribution} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
                {riskDistribution.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Audit Status</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={auditStatus}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="name" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                {auditStatus.map((entry, i) => <Cell key={i} fill={entry.color} />)}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Compliance Score Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={complianceScoreTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis domain={[60, 90]} tick={{ fontSize: 12 }} />
              <Tooltip />
              <Line type="monotone" dataKey="score" stroke="#059669" strokeWidth={2} dot={{ fill: "#059669", r: 4 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-4">Incident Trend</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={incidentTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 12 }} />
              <Tooltip />
              <Legend />
              <Bar dataKey="reported" name="Reported" fill="#ef4444" radius={[4, 4, 0, 0]} />
              <Bar dataKey="resolved" name="Resolved" fill="#22c55e" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Obligations Due Soon</h3>
          <DataTable
            columns={[
              { key: "title", label: "Obligation", render: (v, r) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "owner", label: "Owner" },
              { key: "dueDate", label: "Due Date" },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            ]}
            data={recentObligations}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Top Risks</h3>
          <DataTable
            columns={[
              { key: "title", label: "Risk", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "score", label: "Score", render: (v, r) => <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-bold ${v >= 15 ? "bg-red-100 text-red-700" : v >= 10 ? "bg-orange-100 text-orange-700" : "bg-yellow-100 text-yellow-700"}`}>{v}</span> },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            ]}
            data={topRisks}
          />
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Active Audits</h3>
          <DataTable
            columns={[
              { key: "title", label: "Audit", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "lead", label: "Lead" },
              { key: "progress", label: "Progress", render: (v) => <div className="flex items-center gap-2"><div className="w-24 h-2 bg-gray-200 rounded-full"><div className="h-full bg-emerald-500 rounded-full" style={{ width: `${v}%` }} /></div><span className="text-xs text-gray-500">{v}%</span></div> },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
            ]}
            data={activeAudits}
          />
        </div>
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="text-sm font-semibold text-gray-900 mb-3">Recent Incidents</h3>
          <DataTable
            columns={[
              { key: "title", label: "Incident", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
              { key: "severity", label: "Severity", render: (v) => <StatusBadge status={v} /> },
              { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
              { key: "assignee", label: "Assignee" },
            ]}
            data={recentIncidents}
          />
        </div>
      </div>
    </div>
  );
}
