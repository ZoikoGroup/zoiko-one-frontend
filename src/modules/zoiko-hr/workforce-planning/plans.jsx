import { useState, useEffect } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import { DataTable } from "./DataTable.jsx";
import { fetchList, createRecord, updateRecord } from "../../../service/hrService.js";

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
          end={item.href === "/zoiko-hr/workforce-planning"}
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

export default function WorkforcePlans() {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [form, setForm] = useState({ name: "", department: "", budget: "", targetHeadcount: "" });

  useEffect(() => {
    async function loadPlans() {
      try {
        setLoading(true);
        const data = await fetchList("workforce-planning");
        setPlans(data || []);
      } catch (error) {
        console.error("Failed to load workforce plans:", error);
      } finally {
        setLoading(false);
      }
    }
    loadPlans();
  }, []);

  const handleCreatePlan = async (e) => {
    e.preventDefault();
    if (!form.name || !form.department || !form.budget) {
      alert("Please fill out all required fields");
      return;
    }
    setSubmitting(true);
    try {
      const payload = {
        ...form,
        budget: parseFloat(form.budget),
        targetHeadcount: parseInt(form.targetHeadcount, 10) || 0,
        status: "Active"
      };
      const newPlan = await createRecord("workforce-planning", payload);
      setPlans(prev => [newPlan, ...prev]);
      setShowModal(false);
      setForm({ name: "", department: "", budget: "", targetHeadcount: "" });
    } catch (error) {
      alert("Failed to create workforce plan.");
    } finally {
      setSubmitting(false);
    }
  };

  const columns = [
    { key: "name", label: "Plan Name", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department" },
    { key: "budget", label: "Budget Allocation", render: (v) => formatCurrency(v) },
    { key: "targetHeadcount", label: "Target Headcount" },
    { key: "status", label: "Status", render: (v) => <span className="px-2 py-0.5 rounded-full text-xs bg-green-100 text-green-800 font-medium">{v}</span> }
  ];

  return (
    <HRPage title="Workforce Planning" subtitle="Manage organizational workforce initiatives">
      <SubNav />
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-xl font-bold text-gray-900">Workforce Plans</h1>
          <button onClick={() => setShowModal(true)} className="bg-teal-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors">
            Create Plan
          </button>
        </div>

        {loading ? (
          <div className="text-center py-10 text-gray-500">Loading plans...</div>
        ) : (
          <DataTable columns={columns} data={plans} />
        )}

        {showModal && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
            <div className="bg-white rounded-xl p-6 max-w-md w-full space-y-4 shadow-xl border border-gray-100">
              <h3 className="text-lg font-bold text-gray-900">New Workforce Plan</h3>
              <form onSubmit={handleCreatePlan} className="space-y-3">
                <input type="text" placeholder="Plan Title (e.g., Q3 Expansion)" className="w-full border p-2 rounded text-sm focus:outline-teal-500" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <input type="text" placeholder="Department" className="w-full border p-2 rounded text-sm focus:outline-teal-500" value={form.department} onChange={e => setForm({...form, department: e.target.value})} />
                <input type="number" placeholder="Budget Allocation" className="w-full border p-2 rounded text-sm focus:outline-teal-500" value={form.budget} onChange={e => setForm({...form, budget: e.target.value})} />
                <input type="number" placeholder="Target Headcount Growth" className="w-full border p-2 rounded text-sm focus:outline-teal-500" value={form.targetHeadcount} onChange={e => setForm({...form, targetHeadcount: e.target.value})} />
                
                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" onClick={() => setShowModal(false)} className="border px-4 py-2 rounded text-sm text-gray-500 hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={submitting} className="bg-teal-600 text-white px-4 py-2 rounded text-sm hover:bg-teal-700 transition-colors disabled:opacity-50">
                    {submitting ? "Creating..." : "Create Plan"}
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