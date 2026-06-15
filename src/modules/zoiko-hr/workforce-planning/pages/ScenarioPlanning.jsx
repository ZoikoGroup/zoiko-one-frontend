import { useState } from "react";
import { BarChart3, Plus, X, TrendingUp, TrendingDown, Layers } from "lucide-react";
import StatsCard from "../components/StatsCard";
import StatusBadge from "../components/StatusBadge";
import { useScenarios } from "../hooks/useWorkforce";
import { formatCurrency, formatDate } from "../utils/helpers";

const emptyForm = {
  name: "", description: "", assumptions: "",
  projectedHeadcount: "", projectedBudget: "", impact: "medium", status: "draft",
};

export default function ScenarioPlanning() {
  const { data: scenarios, loading } = useScenarios();
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ ...emptyForm });
  const [compareIds, setCompareIds] = useState([]);

  if (loading) return <div className="p-6 text-gray-400">Loading scenarios...</div>;

  const toggleCompare = (id) => {
    setCompareIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const baseHeadcount = 1240;
  const baseBudget = 18500000;

  const handleCreate = (e) => {
    e.preventDefault();
    setShowCreate(false);
    setForm({ ...emptyForm });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Scenario Planning</h1>
          <p className="text-sm text-gray-500 mt-1">What-if workforce modeling and scenario comparison</p>
        </div>
        <button onClick={() => { setForm({ ...emptyForm }); setShowCreate(true); }} className="flex items-center gap-2 px-4 py-2 bg-teal-600 text-white rounded-lg hover:bg-teal-700 text-sm font-medium">
          <Plus className="w-4 h-4" /> Create Scenario
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Scenarios" value={scenarios.length} icon={BarChart3} />
        <StatsCard title="Active Scenarios" value={scenarios.filter((s) => s.status === "active").length} icon={Layers} change={2} trend="up" />
        <StatsCard title="Avg Projected HC" value={Math.round(scenarios.reduce((s, c) => s + c.projectedHeadcount, 0) / scenarios.length)} icon={TrendingUp} />
        <StatsCard title="Avg Budget Impact" value={formatCurrency(scenarios.reduce((s, c) => s + c.projectedBudget, 0) / scenarios.length)} icon={TrendingDown} />
      </div>

      {compareIds.length >= 2 && (
        <div className="bg-white rounded-xl border border-teal-200 p-5">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Comparison View</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-gray-50 rounded-lg text-center">
              <p className="text-xs text-gray-500 mb-1">Baseline</p>
              <p className="text-lg font-bold text-gray-900">{baseHeadcount}</p>
              <p className="text-xs text-gray-400">Headcount</p>
              <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(baseBudget)}</p>
              <p className="text-xs text-gray-400">Budget</p>
            </div>
            {compareIds.map((id) => {
              const s = scenarios.find((x) => x.id === id);
              if (!s) return null;
              const hcChange = ((s.projectedHeadcount - baseHeadcount) / baseHeadcount * 100).toFixed(1);
              const bChange = ((s.projectedBudget - baseBudget) / baseBudget * 100).toFixed(1);
              return (
                <div key={id} className={`p-4 rounded-lg text-center border-2 ${compareIds.indexOf(id) === 0 ? "border-teal-400 bg-teal-50" : "border-blue-400 bg-blue-50"}`}>
                  <p className="text-sm font-semibold text-gray-900 mb-2">{s.name}</p>
                  <p className="text-lg font-bold text-gray-900">{s.projectedHeadcount}</p>
                  <p className={`text-xs font-medium ${hcChange >= 0 ? "text-green-600" : "text-red-600"}`}>{hcChange >= 0 ? "+" : ""}{hcChange}%</p>
                  <p className="text-lg font-bold text-gray-900 mt-1">{formatCurrency(s.projectedBudget)}</p>
                  <p className={`text-xs font-medium ${bChange >= 0 ? "text-green-600" : "text-red-600"}`}>{bChange >= 0 ? "+" : ""}{bChange}%</p>
                </div>
              );
            })}
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {scenarios.map((s) => (
          <div key={s.id} className={`bg-white rounded-xl border p-5 hover:shadow-md transition-shadow ${compareIds.includes(s.id) ? "border-teal-300 ring-2 ring-teal-200" : "border-gray-200"}`}>
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h3 className="font-semibold text-gray-900">{s.name}</h3>
                <p className="text-xs text-gray-500 mt-1">{s.description}</p>
              </div>
              <div className="flex items-center gap-2 ml-2">
                <StatusBadge status={s.status} />
                <StatusBadge status={s.impact} />
              </div>
            </div>

            <div className="bg-gray-50 rounded-lg p-3 mb-3">
              <p className="text-xs text-gray-500 mb-1">Assumptions</p>
              <p className="text-xs text-gray-700">{s.assumptions}</p>
            </div>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <div>
                <span className="text-xs text-gray-500">Projected HC</span>
                <p className="font-semibold text-gray-900">{s.projectedHeadcount}</p>
              </div>
              <div>
                <span className="text-xs text-gray-500">Projected Budget</span>
                <p className="font-semibold text-gray-900">{formatCurrency(s.projectedBudget)}</p>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
              <span className="text-xs text-gray-400">{formatDate(s.createdDate)}</span>
              <button
                onClick={() => toggleCompare(s.id)}
                className={`text-xs font-medium px-3 py-1.5 rounded-lg border transition-colors ${compareIds.includes(s.id) ? "bg-teal-50 text-teal-700 border-teal-200" : "bg-gray-50 text-gray-600 border-gray-200 hover:bg-gray-100"}`}
              >
                {compareIds.includes(s.id) ? "Selected" : "Compare"}
              </button>
            </div>
          </div>
        ))}
      </div>

      {showCreate && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">Create Scenario</h2>
              <button onClick={() => setShowCreate(false)} className="text-gray-400 hover:text-gray-600"><X className="w-5 h-5" /></button>
            </div>
            <form onSubmit={handleCreate} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scenario Name *</label>
                <input type="text" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea rows={2} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Assumptions</label>
                <textarea rows={2} value={form.assumptions} onChange={(e) => setForm({ ...form, assumptions: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Projected Headcount</label>
                  <input type="number" value={form.projectedHeadcount} onChange={(e) => setForm({ ...form, projectedHeadcount: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Projected Budget</label>
                  <input type="number" step="0.01" value={form.projectedBudget} onChange={(e) => setForm({ ...form, projectedBudget: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Impact</label>
                  <select value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                  <select value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })} className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500">
                    <option value="draft">Draft</option>
                    <option value="active">Active</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowCreate(false)} className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit" className="px-4 py-2 text-sm bg-teal-600 hover:bg-teal-700 text-white rounded-lg font-medium">Create Scenario</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
