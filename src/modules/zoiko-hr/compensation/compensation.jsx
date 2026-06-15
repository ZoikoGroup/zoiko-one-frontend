import { useState, useEffect } from "react";
import {
  DollarSign, TrendingUp, Users, Award, Gift, PieChart,
  Plus, X, Check, Loader2, Trash2, Edit2, Ban, ChevronDown,
} from "lucide-react";
import * as hr from "../../../service/hrService";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "payGrades", label: "Pay Grades" },
  { key: "salaryStructures", label: "Compensation" },
  { key: "revisions", label: "Revisions" },
  { key: "bonuses", label: "Bonuses" },
  { key: "incentives", label: "Incentives" },
  { key: "benefits", label: "Benefits" },
  { key: "allowancesAndDeductions", label: "Allowances & Deductions" },
];

export default function ZoikoHRCompensation() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employeeMap, setEmployeeMap] = useState({});
  const user = { role: "admin" };

  useEffect(() => {
    hr.getEmployees({ per_page: 200 })
      .then((data) => {
        const map = {};
        (data.items || []).forEach((emp) => {
          map[emp.id] = `${emp.first_name} ${emp.last_name}`;
        });
        setEmployeeMap(map);
      })
      .catch(() => {});
  }, []);

  const renderTabContent = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "payGrades": return <PayGradesSection />;
      case "salaryStructures": return <SalaryStructuresSection employeeMap={employeeMap} />;
      case "revisions": return <RevisionsSection employeeMap={employeeMap} />;
      case "bonuses": return <BonusesSection employeeMap={employeeMap} />;
      case "incentives": return <IncentivesSection employeeMap={employeeMap} />;
      case "benefits": return <BenefitsSection employeeMap={employeeMap} />;
      case "allowancesAndDeductions": return <AllowancesAndDeductionsSection employeeMap={employeeMap} />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compensation & Benefits</h1>
        <p className="text-gray-600 mt-1">Manage salary structures, bonuses, incentives, benefits, and more.</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-colors ${
              activeTab === tab.key
                ? "bg-blue-600 text-white"
                : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTabContent()}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// DASHBOARD
// ─────────────────────────────────────────────────────────────────────────────

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    hr.getCompensationDashboard()
      .then(setStats)
      .catch(() => {
        setStats({
          total_salary_cost: 245000,
          total_bonuses_pending: 15000,
          total_bonuses_paid: 45000,
          total_incentives: 12000,
          active_benefits: 18,
          total_allowances: 32000,
          total_deductions: 28000,
          employee_count: 32,
        });
      })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  const cards = [
    { label: "Total Salary Cost", value: stats?.total_salary_cost, icon: DollarSign, color: "text-green-600" },
    { label: "Bonuses Pending", value: stats?.total_bonuses_pending, icon: Award, color: "text-orange-600" },
    { label: "Bonuses Paid", value: stats?.total_bonuses_paid, icon: Award, color: "text-blue-600" },
    { label: "Total Incentives", value: stats?.total_incentives, icon: TrendingUp, color: "text-purple-600" },
    { label: "Active Benefits", value: stats?.active_benefits, icon: Gift, color: "text-pink-600", noFormat: true },
    { label: "Total Allowances", value: stats?.total_allowances, icon: PieChart, color: "text-teal-600" },
    { label: "Total Deductions", value: stats?.total_deductions, icon: Ban, color: "text-red-600" },
    { label: "Employee Count", value: stats?.employee_count, icon: Users, color: "text-gray-600", noFormat: true },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{card.label}</span>
            <card.icon size={18} className={card.color} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-gray-900">
            {card.noFormat ? card.value : `$${Number(card.value || 0).toLocaleString()}`}
          </p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// PAY GRADES
// ─────────────────────────────────────────────────────────────────────────────

function PayGradesSection() {
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", min_salary: "", max_salary: "", description: "" });

  const load = () => {
    setLoading(true);
    hr.getPayGrades()
      .then(setGrades)
      .catch(() => setGrades([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = { ...form, min_salary: parseFloat(form.min_salary), max_salary: parseFloat(form.max_salary) };
    if (editing) {
      await hr.updatePayGrade(editing.id, payload);
    } else {
      await hr.createPayGrade(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ name: "", min_salary: "", max_salary: "", description: "" });
    load();
  };

  const handleEdit = (g) => {
    setEditing(g);
    setForm({ name: g.name, min_salary: String(g.min_salary), max_salary: String(g.max_salary), description: g.description || "" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this pay grade?")) {
      await hr.deletePayGrade(id);
      load();
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading pay grades...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setForm({ name: "", min_salary: "", max_salary: "", description: "" }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Pay Grade
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Pay Grade" : "New Pay Grade"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Min Salary" type="number" step="0.01" value={form.min_salary} onChange={(e) => setForm({ ...form, min_salary: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Max Salary" type="number" step="0.01" value={form.max_salary} onChange={(e) => setForm({ ...form, max_salary: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Description (optional)" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
              {editing ? "Update" : "Create"}
            </button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Min Salary</th>
              <th className="px-4 py-3">Max Salary</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {grades.map((g) => (
              <tr key={g.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{g.name}</td>
                <td className="px-4 py-4 text-sm text-gray-700">${Number(g.min_salary).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-700">${Number(g.max_salary).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{g.description || "—"}</td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(g)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(g.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {grades.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No pay grades defined yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SALARY STRUCTURES
// ─────────────────────────────────────────────────────────────────────────────

function SalaryStructuresSection({ employeeMap }) {
  const [structures, setStructures] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    employee_id: "", pay_grade_id: "", basic_salary: "",
    housing_allowance: "0", transport_allowance: "0", medical_allowance: "0",
    other_allowances: "0", effective_from: "",
  });

  const load = () => {
    setLoading(true);
    hr.getSalaryStructures()
      .then(setStructures)
      .catch(() => setStructures([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employee_id: parseInt(form.employee_id),
      pay_grade_id: form.pay_grade_id ? parseInt(form.pay_grade_id) : null,
      basic_salary: parseFloat(form.basic_salary),
      housing_allowance: parseFloat(form.housing_allowance),
      transport_allowance: parseFloat(form.transport_allowance),
      medical_allowance: parseFloat(form.medical_allowance),
      other_allowances: parseFloat(form.other_allowances),
      effective_from: form.effective_from,
    };
    await hr.createSalaryStructure(payload);
    setShowForm(false);
    setForm({ employee_id: "", pay_grade_id: "", basic_salary: "", housing_allowance: "0", transport_allowance: "0", medical_allowance: "0", other_allowances: "0", effective_from: "" });
    load();
  };

  if (loading) return <div className="p-6 text-gray-500">Loading salary structures...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Salary Structure
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">New Salary Structure</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Pay Grade ID (optional)" type="number" value={form.pay_grade_id} onChange={(e) => setForm({ ...form, pay_grade_id: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Basic Salary" type="number" step="0.01" value={form.basic_salary} onChange={(e) => setForm({ ...form, basic_salary: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Housing Allowance" type="number" step="0.01" value={form.housing_allowance} onChange={(e) => setForm({ ...form, housing_allowance: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Transport Allowance" type="number" step="0.01" value={form.transport_allowance} onChange={(e) => setForm({ ...form, transport_allowance: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Medical Allowance" type="number" step="0.01" value={form.medical_allowance} onChange={(e) => setForm({ ...form, medical_allowance: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Other Allowances" type="number" step="0.01" value={form.other_allowances} onChange={(e) => setForm({ ...form, other_allowances: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Effective From" type="date" value={form.effective_from} onChange={(e) => setForm({ ...form, effective_from: e.target.value })} required />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Basic</th>
              <th className="px-4 py-3">Housing</th>
              <th className="px-4 py-3">Transport</th>
              <th className="px-4 py-3">Medical</th>
              <th className="px-4 py-3">Other</th>
              <th className="px-4 py-3">Total CTC</th>
              <th className="px-4 py-3">Active</th>
            </tr>
          </thead>
          <tbody>
            {structures.map((s) => (
              <tr key={s.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[s.employee_id] || `#${s.employee_id}`}</td>
                <td className="px-4 py-4 text-sm text-gray-700">${Number(s.basic_salary).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-700">${Number(s.housing_allowance).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-700">${Number(s.transport_allowance).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-700">${Number(s.medical_allowance).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-700">${Number(s.other_allowances).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm font-semibold text-gray-900">${Number(s.total_ctc).toLocaleString()}</td>
                <td className="px-4 py-4">{s.is_active ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-600" />}</td>
              </tr>
            ))}
            {structures.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No salary structures defined yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// SALARY REVISIONS
// ─────────────────────────────────────────────────────────────────────────────

function RevisionsSection({ employeeMap }) {
  const [revisions, setRevisions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: "", old_salary: "", new_salary: "", reason: "", approved_by: "", effective_date: "" });

  const load = () => {
    setLoading(true);
    hr.getSalaryRevisions()
      .then(setRevisions)
      .catch(() => setRevisions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await hr.createSalaryRevision({
      employee_id: parseInt(form.employee_id),
      old_salary: parseFloat(form.old_salary),
      new_salary: parseFloat(form.new_salary),
      reason: form.reason || null,
      approved_by: form.approved_by ? parseInt(form.approved_by) : null,
      effective_date: form.effective_date,
    });
    setShowForm(false);
    setForm({ employee_id: "", old_salary: "", new_salary: "", reason: "", approved_by: "", effective_date: "" });
    load();
  };

  if (loading) return <div className="p-6 text-gray-500">Loading revisions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Record Revision
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Record Salary Revision</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Old Salary" type="number" step="0.01" value={form.old_salary} onChange={(e) => setForm({ ...form, old_salary: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="New Salary" type="number" step="0.01" value={form.new_salary} onChange={(e) => setForm({ ...form, new_salary: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Reason (optional)" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Approved By (employee ID, optional)" type="number" value={form.approved_by} onChange={(e) => setForm({ ...form, approved_by: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Effective Date" type="date" value={form.effective_date} onChange={(e) => setForm({ ...form, effective_date: e.target.value })} required />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Record</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Old Salary</th>
              <th className="px-4 py-3">New Salary</th>
              <th className="px-4 py-3">Change</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Effective</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {revisions.map((r) => {
              const change = Number(r.new_salary) - Number(r.old_salary);
              return (
                <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                  <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[r.employee_id] || `#${r.employee_id}`}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">${Number(r.old_salary).toLocaleString()}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">${Number(r.new_salary).toLocaleString()}</td>
                  <td className={`px-4 py-4 text-sm font-medium ${change >= 0 ? "text-green-600" : "text-red-600"}`}>
                    {change >= 0 ? "+" : ""}${change.toLocaleString()}
                  </td>
                  <td className="px-4 py-4 text-sm text-gray-500">{r.reason || "—"}</td>
                  <td className="px-4 py-4 text-sm text-gray-700">{r.effective_date}</td>
                  <td className="px-4 py-4"><span className="rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-700 capitalize">{r.status}</span></td>
                </tr>
              );
            })}
            {revisions.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No salary revisions recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BONUSES
// ─────────────────────────────────────────────────────────────────────────────

function BonusesSection({ employeeMap }) {
  const [bonuses, setBonuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ employee_id: "", bonus_type: "", amount: "", reason: "", awarded_date: "", paid_date: "" });

  const load = () => {
    setLoading(true);
    hr.getBonuses()
      .then(setBonuses)
      .catch(() => setBonuses([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employee_id: parseInt(form.employee_id),
      bonus_type: form.bonus_type,
      amount: parseFloat(form.amount),
      reason: form.reason || null,
      awarded_date: form.awarded_date,
      paid_date: form.paid_date || null,
    };
    if (editing) {
      await hr.updateBonus(editing.id, payload);
    } else {
      await hr.createBonus(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ employee_id: "", bonus_type: "", amount: "", reason: "", awarded_date: "", paid_date: "" });
    load();
  };

  const handleEdit = (b) => {
    setEditing(b);
    setForm({ employee_id: String(b.employee_id), bonus_type: b.bonus_type, amount: String(b.amount), reason: b.reason || "", awarded_date: b.awarded_date, paid_date: b.paid_date || "" });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this bonus?")) {
      await hr.deleteBonus(id);
      load();
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading bonuses...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setForm({ employee_id: "", bonus_type: "", amount: "", reason: "", awarded_date: "", paid_date: "" }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Award Bonus
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Bonus" : "Award Bonus"}</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.bonus_type} onChange={(e) => setForm({ ...form, bonus_type: e.target.value })} required>
              <option value="">Select type</option>
              <option value="performance">Performance</option>
              <option value="annual">Annual</option>
              <option value="spot">Spot</option>
              <option value="signing">Signing</option>
              <option value="referral">Referral</option>
              <option value="other">Other</option>
            </select>
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Reason (optional)" value={form.reason} onChange={(e) => setForm({ ...form, reason: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Awarded Date" type="date" value={form.awarded_date} onChange={(e) => setForm({ ...form, awarded_date: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Paid Date (optional)" type="date" value={form.paid_date} onChange={(e) => setForm({ ...form, paid_date: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{editing ? "Update" : "Award"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Reason</th>
              <th className="px-4 py-3">Awarded</th>
              <th className="px-4 py-3">Paid</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {bonuses.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[b.employee_id] || `#${b.employee_id}`}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-700">{b.bonus_type}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">${Number(b.amount).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{b.reason || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{b.awarded_date}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{b.paid_date || "—"}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${b.status === "approved" ? "bg-green-100 text-green-700" : b.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{b.status}</span></td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(b)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(b.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {bonuses.length === 0 && (
              <tr><td colSpan={8} className="px-4 py-8 text-center text-gray-500">No bonuses awarded yet.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// INCENTIVES
// ─────────────────────────────────────────────────────────────────────────────

function IncentivesSection({ employeeMap }) {
  const [incentives, setIncentives] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: "", incentive_type: "", target: "", achieved: "", amount: "", period: "" });

  const load = () => {
    setLoading(true);
    hr.getIncentives()
      .then(setIncentives)
      .catch(() => setIncentives([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await hr.createIncentive({
      employee_id: parseInt(form.employee_id),
      incentive_type: form.incentive_type,
      target: form.target ? parseFloat(form.target) : null,
      achieved: form.achieved ? parseFloat(form.achieved) : null,
      amount: parseFloat(form.amount),
      period: form.period,
    });
    setShowForm(false);
    setForm({ employee_id: "", incentive_type: "", target: "", achieved: "", amount: "", period: "" });
    load();
  };

  if (loading) return <div className="p-6 text-gray-500">Loading incentives...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Incentive
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">New Incentive</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.incentive_type} onChange={(e) => setForm({ ...form, incentive_type: e.target.value })} required>
              <option value="">Select type</option>
              <option value="sales_commission">Sales Commission</option>
              <option value="performance_bonus">Performance Bonus</option>
              <option value="profit_sharing">Profit Sharing</option>
              <option value="referral_bonus">Referral Bonus</option>
              <option value="other">Other</option>
            </select>
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Target (optional)" type="number" step="0.01" value={form.target} onChange={(e) => setForm({ ...form, target: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Achieved (optional)" type="number" step="0.01" value={form.achieved} onChange={(e) => setForm({ ...form, achieved: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Period (e.g. Q1 2026)" value={form.period} onChange={(e) => setForm({ ...form, period: e.target.value })} required />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Target</th>
              <th className="px-4 py-3">Achieved</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Period</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {incentives.map((i) => (
              <tr key={i.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[i.employee_id] || `#${i.employee_id}`}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-700">{i.incentive_type.replace(/_/g, " ")}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{i.target ? `$${Number(i.target).toLocaleString()}` : "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{i.achieved ? `$${Number(i.achieved).toLocaleString()}` : "—"}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">${Number(i.amount).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{i.period}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${i.status === "approved" ? "bg-green-100 text-green-700" : i.status === "pending" ? "bg-yellow-100 text-yellow-700" : "bg-gray-100 text-gray-700"}`}>{i.status}</span></td>
              </tr>
            ))}
            {incentives.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No incentives recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// BENEFITS
// ─────────────────────────────────────────────────────────────────────────────

function BenefitsSection({ employeeMap }) {
  const [benefits, setBenefits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: "", benefit_type: "", provider: "", amount: "", effective_date: "", expiry_date: "" });

  const load = () => {
    setLoading(true);
    hr.getBenefits()
      .then(setBenefits)
      .catch(() => setBenefits([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await hr.createBenefit({
      employee_id: parseInt(form.employee_id),
      benefit_type: form.benefit_type,
      provider: form.provider || null,
      amount: form.amount ? parseFloat(form.amount) : null,
      effective_date: form.effective_date,
      expiry_date: form.expiry_date || null,
    });
    setShowForm(false);
    setForm({ employee_id: "", benefit_type: "", provider: "", amount: "", effective_date: "", expiry_date: "" });
    load();
  };

  if (loading) return <div className="p-6 text-gray-500">Loading benefits...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Enroll Benefit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Enroll Benefit</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.benefit_type} onChange={(e) => setForm({ ...form, benefit_type: e.target.value })} required>
              <option value="">Select benefit</option>
              <option value="health_insurance">Health Insurance</option>
              <option value="dental_insurance">Dental Insurance</option>
              <option value="life_insurance">Life Insurance</option>
              <option value="gym_membership">Gym Membership</option>
              <option value="stock_options">Stock Options</option>
              <option value="retirement_plan">Retirement Plan</option>
              <option value="education">Education / Tuition</option>
              <option value="other">Other</option>
            </select>
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Provider (optional)" value={form.provider} onChange={(e) => setForm({ ...form, provider: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Amount (optional)" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Effective Date" type="date" value={form.effective_date} onChange={(e) => setForm({ ...form, effective_date: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Expiry Date (optional)" type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Enroll</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Benefit</th>
              <th className="px-4 py-3">Provider</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Effective</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {benefits.map((b) => (
              <tr key={b.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[b.employee_id] || `#${b.employee_id}`}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-700">{b.benefit_type.replace(/_/g, " ")}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{b.provider || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{b.amount ? `$${Number(b.amount).toLocaleString()}` : "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{b.effective_date}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{b.expiry_date || "—"}</td>
                <td className="px-4 py-4"><span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${b.status === "active" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-700"}`}>{b.status}</span></td>
              </tr>
            ))}
            {benefits.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No benefits enrolled.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// ALLOWANCES & DEDUCTIONS
// ─────────────────────────────────────────────────────────────────────────────

function AllowancesAndDeductionsSection({ employeeMap }) {
  const [activeSubTab, setActiveSubTab] = useState("allowances");
  return (
    <div className="space-y-4">
      <div className="flex gap-2">
        <button onClick={() => setActiveSubTab("allowances")} className={`px-4 py-2 text-sm font-medium rounded-xl ${activeSubTab === "allowances" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          Allowances
        </button>
        <button onClick={() => setActiveSubTab("deductions")} className={`px-4 py-2 text-sm font-medium rounded-xl ${activeSubTab === "deductions" ? "bg-blue-600 text-white" : "bg-gray-100 text-gray-700 hover:bg-gray-200"}`}>
          Deductions
        </button>
      </div>
      {activeSubTab === "allowances" ? <AllowancesList employeeMap={employeeMap} /> : <DeductionsList employeeMap={employeeMap} />}
    </div>
  );
}

function AllowancesList({ employeeMap }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: "", allowance_type: "", amount: "", frequency: "monthly", is_taxable: true });

  const load = () => {
    setLoading(true);
    hr.getAllowances()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await hr.createAllowance({
      employee_id: parseInt(form.employee_id),
      allowance_type: form.allowance_type,
      amount: parseFloat(form.amount),
      frequency: form.frequency,
      is_taxable: form.is_taxable,
    });
    setShowForm(false);
    setForm({ employee_id: "", allowance_type: "", amount: "", frequency: "monthly", is_taxable: true });
    load();
  };

  if (loading) return <div className="p-6 text-gray-500">Loading allowances...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Allowance
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">New Allowance</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.allowance_type} onChange={(e) => setForm({ ...form, allowance_type: e.target.value })} required>
              <option value="">Select type</option>
              <option value="travel">Travel</option>
              <option value="meals">Meals</option>
              <option value="communication">Communication</option>
              <option value="housing">Housing</option>
              <option value="medical">Medical</option>
              <option value="education">Education</option>
              <option value="other">Other</option>
            </select>
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="one_time">One Time</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_taxable} onChange={(e) => setForm({ ...form, is_taxable: e.target.checked })} className="rounded" />
              Taxable
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Frequency</th>
              <th className="px-4 py-3">Taxable</th>
            </tr>
          </thead>
          <tbody>
            {items.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[a.employee_id] || `#${a.employee_id}`}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-700">{a.allowance_type}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">${Number(a.amount).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-700">{a.frequency.replace(/_/g, " ")}</td>
                <td className="px-4 py-4">{a.is_taxable ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-600" />}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No allowances defined.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function DeductionsList({ employeeMap }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: "", deduction_type: "", amount: "", frequency: "monthly", is_mandatory: true });

  const load = () => {
    setLoading(true);
    hr.getDeductions()
      .then(setItems)
      .catch(() => setItems([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await hr.createDeduction({
      employee_id: parseInt(form.employee_id),
      deduction_type: form.deduction_type,
      amount: parseFloat(form.amount),
      frequency: form.frequency,
      is_mandatory: form.is_mandatory,
    });
    setShowForm(false);
    setForm({ employee_id: "", deduction_type: "", amount: "", frequency: "monthly", is_mandatory: true });
    load();
  };

  if (loading) return <div className="p-6 text-gray-500">Loading deductions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Deduction
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">New Deduction</h3>
          <div className="grid gap-4 sm:grid-cols-3">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.deduction_type} onChange={(e) => setForm({ ...form, deduction_type: e.target.value })} required>
              <option value="">Select type</option>
              <option value="tax">Tax</option>
              <option value="social_security">Social Security</option>
              <option value="pension">Pension</option>
              <option value="health_insurance">Health Insurance</option>
              <option value="loan">Loan Repayment</option>
              <option value="other">Other</option>
            </select>
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Amount" type="number" step="0.01" value={form.amount} onChange={(e) => setForm({ ...form, amount: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.frequency} onChange={(e) => setForm({ ...form, frequency: e.target.value })}>
              <option value="monthly">Monthly</option>
              <option value="quarterly">Quarterly</option>
              <option value="annual">Annual</option>
              <option value="one_time">One Time</option>
            </select>
            <label className="flex items-center gap-2 text-sm text-gray-700">
              <input type="checkbox" checked={form.is_mandatory} onChange={(e) => setForm({ ...form, is_mandatory: e.target.checked })} className="rounded" />
              Mandatory
            </label>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">Create</button>
            <button type="button" onClick={() => setShowForm(false)} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Type</th>
              <th className="px-4 py-3">Amount</th>
              <th className="px-4 py-3">Frequency</th>
              <th className="px-4 py-3">Mandatory</th>
            </tr>
          </thead>
          <tbody>
            {items.map((d) => (
              <tr key={d.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[d.employee_id] || `#${d.employee_id}`}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-700">{d.deduction_type.replace(/_/g, " ")}</td>
                <td className="px-4 py-4 text-sm font-medium text-gray-900">${Number(d.amount).toLocaleString()}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-700">{d.frequency.replace(/_/g, " ")}</td>
                <td className="px-4 py-4">{d.is_mandatory ? <Check size={16} className="text-green-600" /> : <X size={16} className="text-red-600" />}</td>
              </tr>
            ))}
            {items.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No deductions defined.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
