import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";
import { fetchList, createRecord } from "../../../service/hrService.js";

// Inlined helper to replace deleted helpers.js file
const formatCurrency = (amount) => 
  new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount || 0);

const NAV_ITEMS = [
  { label: "Dashboard", href: "/zoiko-hr/workforce-planning" },
  { label: "Plans", href: "/zoiko-hr/workforce-planning/plans" },
  { label: "Headcount", href: "/zoiko-hr/workforce-planning/headcount" },
  { label: "Succession", href: "/zoiko-hr/workforce-planning/succession" },
  { label: "Scenario Planning", href: "/zoiko-hr/workforce-planning/scenarios" },
  { label: "Reports", href: "/zoiko-hr/workforce-planning/reports" },
  { label: "Settings", href: "/zoiko-hr/workforce-planning/settings" },
];

function SubNav() {
  return (
    <div className="flex gap-1 overflow-x-auto pb-1 mb-6 border-b border-gray-100">
      {NAV_ITEMS.map((item) => (
        <NavLink
          key={item.href}
          to={item.href}
          end={item.href === "/zoiko-hr/workforce-planning/scenarios"}
          className={({ isActive }) =>
            `whitespace-nowrap px-3 py-2 text-sm font-medium rounded-t-lg transition-colors ${
              isActive
                ? "text-teal-600 border-b-2 border-teal-600 bg-teal-50/50"
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

export default function ScenarioPlanning() {
  const [scenarios, setScenarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", impact: "Medium", costImpact: "", description: "" });

  useEffect(() => {
    async function loadScenarios() {
      try {
        setLoading(true);
        const data = await fetchList("scenarios");
        setScenarios(data || []);
      } catch (err) {
        console.error("Failed to load predictive modeling scenarios:", err);
      } finally {
        setLoading(false);
      }
    }
    loadScenarios();
  }, []);

  const handleCreateScenario = async (e) => {
    e.preventDefault();
    if (!form.name || !form.costImpact) {
      alert("Please populate required parameters");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        costImpact: parseFloat(form.costImpact),
        createdAt: new Date().toISOString().split("T")[0]
      };
      const newScenario = await createRecord("scenarios", payload);
      setScenarios(prev => [newScenario, ...prev]);
      setShowModal(false);
      setForm({ name: "", impact: "Medium", costImpact: "", description: "" });
    } catch (err) {
      alert("Failed to save modeling structure.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "name", label: "Scenario Variant", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "impact", label: "Risk Profile / Impact Level", render: (v) => (
      <span className={`px-2 py-0.5 rounded text-xs font-medium ${
        v === 'High' ? 'bg-red-100 text-red-800' : v === 'Medium' ? 'bg-orange-100 text-orange-800' : 'bg-green-100 text-green-800'
      }`}>{v}</span>
    )},
    { key: "costImpact", label: "Cost Variance Projected", render: (v) => <span className="font-mono">{formatCurrency(v)}</span> },
    { key: "description", label: "Core Description", render: (v) => <span className="text-gray-500 truncate max-w-xs block">{v || "N/A"}</span> }
  ];

  return (
    <HRPage title="Workforce Planning" subtitle="Predictive business risk simulations">
      <SubNav />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-900">Scenario Planning</h1>
            <p className="text-xs text-gray-400">Model human capital expenditure variances against volatile conditions</p>
          </div>
          <button onClick={() => setShowModal(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
            Add Simulation
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Parsing simulations...</div>
        ) : (
          <DataTable columns={columns} data={scenarios} />
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl">
              <h3 className="text-lg font-bold text-gray-900">New Simulation Condition</h3>
              <form onSubmit={handleCreateScenario} className="space-y-3">
                <input type="text" placeholder="Scenario Target Label" className="w-full border p-2 rounded text-sm focus:outline-teal-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                
                <select className="w-full border p-2 rounded text-sm bg-white focus:outline-teal-500" value={form.impact} onChange={e => setForm({...form, impact: e.target.value})}>
                  <option value="Low">Low Attrition Impact</option>
                  <option value="Medium">Medium Market Shift</option>
                  <option value="High">High Financial Volatility</option>
                </select>

                <input type="number" placeholder="Estimated Expense Deviation" className="w-full border p-2 rounded text-sm focus:outline-teal-500" value={form.costImpact} onChange={e => setForm({...form, costImpact: e.target.value})} />
                <textarea placeholder="Strategy description..." className="w-full border p-2 rounded text-sm focus:outline-teal-500 h-20" value={form.description} onChange={e => setForm({...form, description: e.target.value})} />
                
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="border px-4 py-2 rounded text-sm text-gray-500 hover:bg-gray-50">Discard</button>
                  <button type="submit" disabled={submitting} className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700 transition-colors disabled:opacity-50">
                    {submitting ? "Saving Modeling..." : "Save Model"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </HRPage>
  );
}