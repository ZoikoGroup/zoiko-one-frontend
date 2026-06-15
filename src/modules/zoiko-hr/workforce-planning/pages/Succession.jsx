import { useState } from "react";
import { UserCheck, Users, Clock, AlertTriangle, Plus, X } from "lucide-react";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { useSuccessionPlans } from "../hooks/useWorkforce";

export default function SuccessionPlanning() {
  const { data: plans, loading } = useSuccessionPlans();
  const [statusFilter, setStatusFilter] = useState("");
  const [showAddCandidate, setShowAddCandidate] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [candidateForm, setCandidateForm] = useState({ name: "", readiness: "ready_now", timeline: "" });

  if (loading) return <div className="p-6 text-gray-400">Loading succession plans...</div>;

  const filtered = statusFilter ? plans.filter((p) => p.status === statusFilter) : plans;

  const readinessPct = (level) => {
    const total = plans.length;
    const count = plans.filter((p) => p.readiness === level).length;
    return total > 0 ? Math.round((count / total) * 100) : 0;
  };

  const allCandidates = plans.reduce((s, p) => s + p.candidates.length, 0);

  const stats = [
    { title: "Key Roles", value: plans.length, icon: UserCheck, change: 2, trend: "up" },
    { title: "Total Candidates", value: allCandidates, icon: Users, change: 4, trend: "up" },
    { title: "Ready Now", value: `${readinessPct("ready_now")}%`, icon: Clock, change: 1, trend: "up" },
    { title: "At Risk Roles", value: plans.filter((p) => p.readiness === "2_plus_years").length, icon: AlertTriangle, change: 0, trend: "neutral" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Succession Planning</h1>
          <p className="text-sm text-gray-500 mt-1">Key roles, readiness levels, and candidate pipeline</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => <StatsCard key={s.title} {...s} />)}
      </div>

      <div className="flex gap-3">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="px-3 py-2 border border-gray-200 rounded-lg text-sm bg-white focus:outline-none focus:ring-2 focus:ring-teal-500/20 focus:border-teal-500">
          <option value="">All Statuses</option>
          <option value="active">Active</option>
          <option value="planned">Planned</option>
        </select>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {filtered.map((plan) => (
          <div key={plan.id} className="bg-white rounded-xl border border-gray-200 p-5 hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900">{plan.role}</h3>
                <p className="text-sm text-gray-500">{plan.department}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={plan.status} />
                <StatusBadge status={plan.readiness} />
              </div>
            </div>

            <div className="mb-3">
              <span className="text-xs text-gray-500">Current Incumbent: </span>
              <span className="text-sm font-medium text-gray-800">{plan.currentIncumbent}</span>
            </div>

            <h4 className="text-sm font-medium text-gray-700 mb-2">Candidates ({plan.candidates.length})</h4>
            <div className="space-y-2">
              {plan.candidates.map((c, i) => (
                <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
                  <span className="text-sm text-gray-800">{c.name}</span>
                  <div className="flex items-center gap-2">
                    <StatusBadge status={c.readiness} />
                    <span className="text-xs text-gray-400">{c.timeline}</span>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => { setSelectedRole(plan); setCandidateForm({ name: "", readiness: "ready_now", timeline: "" }); setShowAddCandidate(true); }}
              className="mt-3 flex items-center gap-2 text-sm text-teal-600 hover:text-teal-700 font-medium"
            >
              <Plus className="w-4 h-4" /> Add Candidate
            </button>
          </div>
        ))}
      </div>

      {showAddCandidate && selectedRole && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Add Candidate</h2>
              <button onClick={() => setShowAddCandidate(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <div className="p-6 space-y-4">
              <p className="text-sm text-gray-500">Role: <span className="font-medium text-gray-800">{selectedRole.role}</span></p>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Candidate Name</label>
                <input type="text" value={candidateForm.name} onChange={(e) => setCandidateForm({ ...candidateForm, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Readiness</label>
                  <select value={candidateForm.readiness} onChange={(e) => setCandidateForm({ ...candidateForm, readiness: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="ready_now">Ready Now</option>
                    <option value="6_months">6 Months</option>
                    <option value="1_year">1 Year</option>
                    <option value="2_plus_years">2+ Years</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Timeline</label>
                  <input type="text" value={candidateForm.timeline} onChange={(e) => setCandidateForm({ ...candidateForm, timeline: e.target.value })} placeholder="e.g. 6 months" className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button onClick={() => setShowAddCandidate(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button onClick={() => setShowAddCandidate(false)} className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">Add Candidate</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
