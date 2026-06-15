import { useState, useEffect } from "react";
import {
  Shield, FileText, CheckCircle, AlertTriangle, ClipboardList,
  Plus, X, Search, Trash2, Edit2, ChevronDown, Eye, Ban,
} from "lucide-react";
import * as hr from "../../../service/hrService";

const TABS = [
  { key: "dashboard", label: "Dashboard" },
  { key: "policies", label: "Policy Library" },
  { key: "tracking", label: "Compliance Tracking" },
  { key: "audits", label: "Audits" },
  { key: "violations", label: "Violations" },
  { key: "risks", label: "Risk Assessment" },
  { key: "regulations", label: "Regulations" },
  { key: "correctiveActions", label: "Corrective Actions" },
  { key: "reports", label: "Reports" },
];

export default function Compliance() {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [employeeMap, setEmployeeMap] = useState({});

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

  const renderTab = () => {
    switch (activeTab) {
      case "dashboard": return <Dashboard />;
      case "policies": return <PoliciesSection />;
      case "tracking": return <TrackingSection employeeMap={employeeMap} />;
      case "audits": return <AuditsSection employeeMap={employeeMap} />;
      case "violations": return <ViolationsSection employeeMap={employeeMap} />;
      case "risks": return <RiskAssessmentsSection employeeMap={employeeMap} />;
      case "regulations": return <RegulationsSection />;
      case "correctiveActions": return <CorrectiveActionsSection employeeMap={employeeMap} />;
      case "reports": return <ReportsSection />;
      default: return <Dashboard />;
    }
  };

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900">Compliance & Audit</h1>
        <p className="text-gray-600 mt-1">Policy management, compliance tracking, audits, risk assessment, and reporting.</p>
      </div>

      <div className="flex flex-wrap gap-2 border-b border-gray-200 pb-2">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`px-4 py-2 text-sm font-medium rounded-t-xl transition-colors ${
              activeTab === tab.key ? "bg-blue-600 text-white" : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {renderTab()}
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
    hr.getComplianceDashboard()
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6 text-gray-500">Loading dashboard...</div>;

  const cards = [
    { label: "Total Policies", value: stats?.total_policies, icon: FileText, color: "text-blue-600" },
    { label: "Active Policies", value: stats?.active_policies, icon: Shield, color: "text-green-600" },
    { label: "Pending Acknowledgements", value: stats?.pending_acknowledgements, icon: CheckCircle, color: "text-orange-600" },
    { label: "Total Audits", value: stats?.total_audits, icon: ClipboardList, color: "text-purple-600" },
    { label: "Completed Audits", value: stats?.completed_audits, icon: CheckCircle, color: "text-teal-600" },
    { label: "Open Violations", value: stats?.open_violations, icon: AlertTriangle, color: "text-red-600" },
    { label: "Critical Violations", value: stats?.critical_violations, icon: Ban, color: "text-red-800" },
    { label: "Open Risks", value: stats?.open_risks, icon: AlertTriangle, color: "text-amber-600" },
    { label: "Open Corrective Actions", value: stats?.open_corrective_actions, icon: AlertTriangle, color: "text-orange-600" },
    { label: "Regulatory Requirements", value: stats?.regulatory_requirements, icon: Shield, color: "text-indigo-600" },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {cards.map((card) => (
        <div key={card.label} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <span>{card.label}</span>
            <card.icon size={18} className={card.color} />
          </div>
          <p className="mt-4 text-3xl font-semibold text-gray-900">{card.value ?? "—"}</p>
        </div>
      ))}
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// POLICIES
// ─────────────────────────────────────────────────────────────────────────────

function PoliciesSection() {
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState("");
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", category: "", version: "1.0",
    effective_date: "", expiry_date: "", status: "draft",
  });

  const load = () => {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (search) params.search = search;
    hr.getPolicies(params)
      .then(setPolicies)
      .catch(() => setPolicies([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus, search]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      effective_date: form.effective_date || null,
      expiry_date: form.expiry_date || null,
    };
    if (editing) {
      await hr.updatePolicy(editing.id, payload);
    } else {
      await hr.createPolicy(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", description: "", category: "", version: "1.0", effective_date: "", expiry_date: "", status: "draft" });
    load();
  };

  const handleEdit = (p) => {
    setEditing(p);
    setForm({
      title: p.title, description: p.description || "", category: p.category || "",
      version: p.version, effective_date: p.effective_date || "", expiry_date: p.expiry_date || "",
      status: p.status,
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this policy?")) {
      await hr.deletePolicy(id);
      load();
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading policies...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3 flex-1 max-w-md">
          <div className="relative flex-1">
            <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              className="w-full rounded-xl border border-gray-300 pl-9 pr-4 py-2 text-sm"
              placeholder="Search policies..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="draft">Draft</option>
            <option value="active">Active</option>
            <option value="archived">Archived</option>
          </select>
        </div>
        <button onClick={() => { setEditing(null); setForm({ title: "", description: "", category: "", version: "1.0", effective_date: "", expiry_date: "", status: "draft" }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Policy
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Policy" : "New Policy"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              <option value="data_privacy">Data Privacy</option>
              <option value="security">Security</option>
              <option value="hr">HR</option>
              <option value="finance">Finance</option>
              <option value="operations">Operations</option>
              <option value="legal">Legal</option>
              <option value="other">Other</option>
            </select>
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm sm:col-span-2" rows={3} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Version" value={form.version} onChange={(e) => setForm({ ...form, version: e.target.value })} />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="draft">Draft</option>
              <option value="active">Active</option>
              <option value="archived">Archived</option>
            </select>
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Effective Date" type="date" value={form.effective_date} onChange={(e) => setForm({ ...form, effective_date: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Expiry Date" type="date" value={form.expiry_date} onChange={(e) => setForm({ ...form, expiry_date: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Version</th>
              <th className="px-4 py-3">Effective</th>
              <th className="px-4 py-3">Expiry</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {policies.map((p) => (
              <tr key={p.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{p.title}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-500">{p.category || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">v{p.version}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{p.effective_date || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{p.expiry_date || "—"}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    p.status === "active" ? "bg-green-100 text-green-700" :
                    p.status === "draft" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{p.status}</span>
                </td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(p)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(p.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {policies.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No policies found.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// COMPLIANCE TRACKING (policy acknowledgements per employee)
// ─────────────────────────────────────────────────────────────────────────────

function TrackingSection({ employeeMap }) {
  const [acknowledgements, setAcknowledgements] = useState([]);
  const [policies, setPolicies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ employee_id: "", policy_id: "" });

  const load = () => {
    setLoading(true);
    Promise.all([
      hr.getAcknowledgements(),
      hr.getPolicies({ status: "active" }),
    ])
      .then(([acks, pols]) => {
        setAcknowledgements(acks);
        setPolicies(pols);
      })
      .catch(() => { setAcknowledgements([]); setPolicies([]); })
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await hr.createAcknowledgement({
      employee_id: parseInt(form.employee_id),
      policy_id: parseInt(form.policy_id),
    });
    setShowForm(false);
    setForm({ employee_id: "", policy_id: "" });
    load();
  };

  if (loading) return <div className="p-6 text-gray-500">Loading compliance tracking...</div>;

  const getPolicyTitle = (id) => policies.find((p) => p.id === id)?.title || `#${id}`;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Record Acknowledgement
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">Record Policy Acknowledgement</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.policy_id} onChange={(e) => setForm({ ...form, policy_id: e.target.value })} required>
              <option value="">Select policy</option>
              {policies.map((p) => <option key={p.id} value={p.id}>{p.title} (v{p.version})</option>)}
            </select>
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
              <th className="px-4 py-3">Policy</th>
              <th className="px-4 py-3">Acknowledged At</th>
            </tr>
          </thead>
          <tbody>
            {acknowledgements.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[a.employee_id] || `#${a.employee_id}`}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{getPolicyTitle(a.policy_id)}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{new Date(a.acknowledged_at).toLocaleString()}</td>
              </tr>
            ))}
            {acknowledgements.length === 0 && (
              <tr><td colSpan={3} className="px-4 py-8 text-center text-gray-500">No acknowledgements recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// AUDITS
// ─────────────────────────────────────────────────────────────────────────────

function AuditsSection({ employeeMap }) {
  const [audits, setAudits] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", audit_date: "", conducted_by: "",
    department_id: "", findings: "", recommendations: "", status: "planned",
  });

  const load = () => {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    hr.getAudits(params)
      .then(setAudits)
      .catch(() => setAudits([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      audit_date: form.audit_date,
      conducted_by: form.conducted_by ? parseInt(form.conducted_by) : null,
      department_id: form.department_id ? parseInt(form.department_id) : null,
      findings: form.findings || null,
      recommendations: form.recommendations || null,
    };
    if (editing) {
      await hr.updateAudit(editing.id, payload);
    } else {
      await hr.createAudit(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", description: "", audit_date: "", conducted_by: "", department_id: "", findings: "", recommendations: "", status: "planned" });
    load();
  };

  const handleEdit = (a) => {
    setEditing(a);
    setForm({
      title: a.title, description: a.description || "", audit_date: a.audit_date,
      conducted_by: a.conducted_by || "", department_id: a.department_id || "",
      findings: a.findings || "", recommendations: a.recommendations || "", status: a.status,
    });
    setShowForm(true);
  };

  if (loading) return <div className="p-6 text-gray-500">Loading audits...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="planned">Planned</option>
          <option value="in_progress">In Progress</option>
          <option value="completed">Completed</option>
        </select>
        <button onClick={() => { setEditing(null); setForm({ title: "", description: "", audit_date: "", conducted_by: "", department_id: "", findings: "", recommendations: "", status: "planned" }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Schedule Audit
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Audit" : "Schedule Audit"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Audit Date" type="date" value={form.audit_date} onChange={(e) => setForm({ ...form, audit_date: e.target.value })} required />
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm sm:col-span-2" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Conducted By (employee ID)" type="number" value={form.conducted_by} onChange={(e) => setForm({ ...form, conducted_by: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Department ID" type="number" value={form.department_id} onChange={(e) => setForm({ ...form, department_id: e.target.value })} />
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm" rows={2} placeholder="Findings" value={form.findings} onChange={(e) => setForm({ ...form, findings: e.target.value })} />
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm" rows={2} placeholder="Recommendations" value={form.recommendations} onChange={(e) => setForm({ ...form, recommendations: e.target.value })} />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="planned">Planned</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{editing ? "Update" : "Schedule"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Conducted By</th>
              <th className="px-4 py-3">Dept</th>
              <th className="px-4 py-3">Findings</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {audits.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{a.title}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{a.audit_date}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{a.conducted_by ? (employeeMap[a.conducted_by] || `#${a.conducted_by}`) : "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{a.department_id ? `#${a.department_id}` : "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-500 max-w-[200px] truncate">{a.findings || "—"}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    a.status === "completed" ? "bg-green-100 text-green-700" :
                    a.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{a.status.replace(/_/g, " ")}</span>
                </td>
                <td className="px-4 py-4 text-sm">
                  <button onClick={() => handleEdit(a)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                </td>
              </tr>
            ))}
            {audits.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No audits recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// VIOLATIONS
// ─────────────────────────────────────────────────────────────────────────────

function ViolationsSection({ employeeMap }) {
  const [violations, setViolations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [filterSeverity, setFilterSeverity] = useState("");
  const [form, setForm] = useState({
    employee_id: "", policy_id: "", violation_date: "",
    description: "", severity: "medium", reported_by: "",
  });

  const load = () => {
    setLoading(true);
    const params = {};
    if (filterStatus) params.status = filterStatus;
    if (filterSeverity) params.severity = filterSeverity;
    hr.getComplianceViolations(params)
      .then(setViolations)
      .catch(() => setViolations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus, filterSeverity]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      employee_id: parseInt(form.employee_id),
      policy_id: form.policy_id ? parseInt(form.policy_id) : null,
      violation_date: form.violation_date,
      description: form.description,
      severity: form.severity,
      reported_by: form.reported_by ? parseInt(form.reported_by) : null,
    };
    if (editing) {
      await hr.updateComplianceViolation(editing.id, payload);
    } else {
      await hr.createComplianceViolation(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ employee_id: "", policy_id: "", violation_date: "", description: "", severity: "medium", reported_by: "" });
    load();
  };

  const handleEdit = (v) => {
    setEditing(v);
    setForm({
      employee_id: String(v.employee_id), policy_id: v.policy_id || "",
      violation_date: v.violation_date, description: v.description,
      severity: v.severity, reported_by: v.reported_by || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this violation?")) {
      await hr.deleteComplianceViolation(id);
      load();
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading violations...</div>;

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
            <option value="">All Status</option>
            <option value="open">Open</option>
            <option value="investigating">Investigating</option>
            <option value="resolved">Resolved</option>
            <option value="closed">Closed</option>
          </select>
          <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={filterSeverity} onChange={(e) => setFilterSeverity(e.target.value)}>
            <option value="">All Severity</option>
            <option value="critical">Critical</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
        <button onClick={() => { setEditing(null); setForm({ employee_id: "", policy_id: "", violation_date: "", description: "", severity: "medium", reported_by: "" }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Report Violation
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Violation" : "Report Violation"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Employee ID" type="number" value={form.employee_id} onChange={(e) => setForm({ ...form, employee_id: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Policy ID (optional)" type="number" value={form.policy_id} onChange={(e) => setForm({ ...form, policy_id: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Violation Date" type="date" value={form.violation_date} onChange={(e) => setForm({ ...form, violation_date: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.severity} onChange={(e) => setForm({ ...form, severity: e.target.value })}>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm sm:col-span-2" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Reported By (employee ID, optional)" type="number" value={form.reported_by} onChange={(e) => setForm({ ...form, reported_by: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{editing ? "Update" : "Report"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Employee</th>
              <th className="px-4 py-3">Policy</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Severity</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {violations.map((v) => (
              <tr key={v.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-900">{employeeMap[v.employee_id] || `#${v.employee_id}`}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{v.policy_id ? `#${v.policy_id}` : "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{v.violation_date}</td>
                <td className="px-4 py-4 text-sm text-gray-500 max-w-[250px] truncate">{v.description}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    v.severity === "critical" ? "bg-red-100 text-red-700" :
                    v.severity === "high" ? "bg-orange-100 text-orange-700" :
                    v.severity === "medium" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{v.severity}</span>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    v.status === "open" ? "bg-red-100 text-red-700" :
                    v.status === "investigating" ? "bg-blue-100 text-blue-700" :
                    v.status === "resolved" ? "bg-green-100 text-green-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{v.status}</span>
                </td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(v)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(v.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {violations.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No violations recorded.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// RISK ASSESSMENTS
// ─────────────────────────────────────────────────────────────────────────────

function RiskAssessmentsSection({ employeeMap }) {
  const [risks, setRisks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [filterStatus, setFilterStatus] = useState("");
  const [form, setForm] = useState({
    title: "", description: "", category: "", likelihood: "3",
    impact: "3", mitigation: "", owner_id: "",
  });

  const load = () => {
    setLoading(true);
    hr.getRiskAssessments(filterStatus || undefined)
      .then(setRisks)
      .catch(() => setRisks([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [filterStatus]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      title: form.title,
      description: form.description || null,
      category: form.category || null,
      likelihood: parseInt(form.likelihood),
      impact: parseInt(form.impact),
      mitigation: form.mitigation || null,
      owner_id: form.owner_id ? parseInt(form.owner_id) : null,
    };
    if (editing) {
      await hr.updateRiskAssessment(editing.id, payload);
    } else {
      await hr.createRiskAssessment(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ title: "", description: "", category: "", likelihood: "3", impact: "3", mitigation: "", owner_id: "" });
    load();
  };

  const handleEdit = (r) => {
    setEditing(r);
    setForm({
      title: r.title, description: r.description || "", category: r.category || "",
      likelihood: String(r.likelihood), impact: String(r.impact),
      mitigation: r.mitigation || "", owner_id: r.owner_id || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this risk assessment?")) {
      await hr.deleteRiskAssessment(id);
      load();
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading risk assessments...</div>;

  const riskColor = (score) => {
    if (score >= 15) return "text-red-700 bg-red-50";
    if (score >= 8) return "text-orange-700 bg-orange-50";
    if (score >= 4) return "text-yellow-700 bg-yellow-50";
    return "text-green-700 bg-green-50";
  };

  const riskLabel = (score) => {
    if (score >= 15) return "Critical";
    if (score >= 8) return "High";
    if (score >= 4) return "Medium";
    return "Low";
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <select className="rounded-xl border border-gray-300 px-3 py-2 text-sm" value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
          <option value="">All Status</option>
          <option value="open">Open</option>
          <option value="mitigated">Mitigated</option>
          <option value="closed">Closed</option>
        </select>
        <button onClick={() => { setEditing(null); setForm({ title: "", description: "", category: "", likelihood: "3", impact: "3", mitigation: "", owner_id: "" }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Risk Assessment
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Risk Assessment" : "New Risk Assessment"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              <option value="data_privacy">Data Privacy</option>
              <option value="security">Security</option>
              <option value="operational">Operational</option>
              <option value="financial">Financial</option>
              <option value="legal">Legal</option>
              <option value="reputational">Reputational</option>
              <option value="other">Other</option>
            </select>
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm sm:col-span-2" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <div>
              <label className="block text-xs text-gray-500 mb-1">Likelihood (1-5)</label>
              <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" type="number" min="1" max="5" value={form.likelihood} onChange={(e) => setForm({ ...form, likelihood: e.target.value })} required />
            </div>
            <div>
              <label className="block text-xs text-gray-500 mb-1">Impact (1-5)</label>
              <input className="w-full rounded-xl border border-gray-300 px-4 py-2 text-sm" type="number" min="1" max="5" value={form.impact} onChange={(e) => setForm({ ...form, impact: e.target.value })} required />
            </div>
            <div className="sm:col-span-2">
              {form.likelihood && form.impact && (
                <div className="text-sm text-gray-700 mb-2">
                  Risk Score: <span className="font-bold">{parseInt(form.likelihood) * parseInt(form.impact)}</span>
                  {" "}({riskLabel(parseInt(form.likelihood) * parseInt(form.impact))})
                </div>
              )}
            </div>
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm sm:col-span-2" rows={2} placeholder="Mitigation Strategy" value={form.mitigation} onChange={(e) => setForm({ ...form, mitigation: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Owner ID (optional)" type="number" value={form.owner_id} onChange={(e) => setForm({ ...form, owner_id: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Title</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Likelihood</th>
              <th className="px-4 py-3">Impact</th>
              <th className="px-4 py-3">Score</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {risks.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.title}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-500">{r.category || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{r.likelihood}/5</td>
                <td className="px-4 py-4 text-sm text-gray-700">{r.impact}/5</td>
                <td className="px-4 py-4">
                  <span className={`inline-flex items-center gap-1 rounded-full px-3 py-1 text-xs font-bold ${riskColor(r.risk_score)}`}>
                    {r.risk_score} - {riskLabel(r.risk_score)}
                  </span>
                </td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    r.status === "open" ? "bg-red-100 text-red-700" :
                    r.status === "mitigated" ? "bg-yellow-100 text-yellow-700" :
                    "bg-green-100 text-green-700"
                  }`}>{r.status}</span>
                </td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(r)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(r.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {risks.length === 0 && (
              <tr><td colSpan={7} className="px-4 py-8 text-center text-gray-500">No risk assessments created.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REGULATIONS
// ─────────────────────────────────────────────────────────────────────────────

function RegulationsSection() {
  const [regulations, setRegulations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    name: "", description: "", regulation_body: "",
    category: "", effective_date: "", status: "active",
  });

  const load = () => {
    setLoading(true);
    hr.getRegulatoryRequirements()
      .then(setRegulations)
      .catch(() => setRegulations([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await hr.createRegulatoryRequirement({
      ...form,
      effective_date: form.effective_date || null,
    });
    setShowForm(false);
    setForm({ name: "", description: "", regulation_body: "", category: "", effective_date: "", status: "active" });
    load();
  };

  if (loading) return <div className="p-6 text-gray-500">Loading regulations...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => setShowForm(true)} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Requirement
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">New Regulatory Requirement</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Name (e.g. GDPR)" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
              <option value="">Select category</option>
              <option value="data_privacy">Data Privacy</option>
              <option value="security">Security</option>
              <option value="financial">Financial</option>
              <option value="labor">Labor</option>
              <option value="environmental">Environmental</option>
              <option value="other">Other</option>
            </select>
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm sm:col-span-2" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Regulation Body (e.g. European Commission)" value={form.regulation_body} onChange={(e) => setForm({ ...form, regulation_body: e.target.value })} />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Effective Date" type="date" value={form.effective_date} onChange={(e) => setForm({ ...form, effective_date: e.target.value })} />
            <select className="rounded-xl border border-gray-300 px-4 py-2 text-sm" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
              <option value="active">Active</option>
              <option value="pending">Pending</option>
              <option value="expired">Expired</option>
            </select>
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Body</th>
              <th className="px-4 py-3">Effective</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody>
            {regulations.map((r) => (
              <tr key={r.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm font-medium text-gray-900">{r.name}</td>
                <td className="px-4 py-4 text-sm capitalize text-gray-500">{r.category || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{r.regulation_body || "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{r.effective_date || "—"}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    r.status === "active" ? "bg-green-100 text-green-700" :
                    r.status === "pending" ? "bg-yellow-100 text-yellow-700" :
                    "bg-gray-100 text-gray-700"
                  }`}>{r.status}</span>
                </td>
              </tr>
            ))}
            {regulations.length === 0 && (
              <tr><td colSpan={5} className="px-4 py-8 text-center text-gray-500">No regulatory requirements added.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// CORRECTIVE ACTIONS
// ─────────────────────────────────────────────────────────────────────────────

function CorrectiveActionsSection({ employeeMap }) {
  const [actions, setActions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    violation_id: "", description: "", assigned_to: "", deadline: "",
  });

  const load = () => {
    setLoading(true);
    hr.getCorrectiveActions()
      .then(setActions)
      .catch(() => setActions([]))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      violation_id: parseInt(form.violation_id),
      description: form.description,
      assigned_to: form.assigned_to ? parseInt(form.assigned_to) : null,
      deadline: form.deadline || null,
    };
    if (editing) {
      await hr.updateCorrectiveAction(editing.id, payload);
    } else {
      await hr.createCorrectiveAction(payload);
    }
    setShowForm(false);
    setEditing(null);
    setForm({ violation_id: "", description: "", assigned_to: "", deadline: "" });
    load();
  };

  const handleEdit = (a) => {
    setEditing(a);
    setForm({
      violation_id: String(a.violation_id), description: a.description,
      assigned_to: a.assigned_to || "", deadline: a.deadline || "",
    });
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (confirm("Delete this corrective action?")) {
      await hr.deleteCorrectiveAction(id);
      load();
    }
  };

  if (loading) return <div className="p-6 text-gray-500">Loading corrective actions...</div>;

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button onClick={() => { setEditing(null); setForm({ violation_id: "", description: "", assigned_to: "", deadline: "" }); setShowForm(true); }} className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">
          <Plus size={16} /> Add Corrective Action
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleSubmit} className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-4">
          <h3 className="text-lg font-semibold">{editing ? "Edit Corrective Action" : "New Corrective Action"}</h3>
          <div className="grid gap-4 sm:grid-cols-2">
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Violation ID" type="number" value={form.violation_id} onChange={(e) => setForm({ ...form, violation_id: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Assigned To (employee ID, optional)" type="number" value={form.assigned_to} onChange={(e) => setForm({ ...form, assigned_to: e.target.value })} />
            <textarea className="rounded-xl border border-gray-300 px-4 py-2 text-sm sm:col-span-2" rows={2} placeholder="Description" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} required />
            <input className="rounded-xl border border-gray-300 px-4 py-2 text-sm" placeholder="Deadline (optional)" type="date" value={form.deadline} onChange={(e) => setForm({ ...form, deadline: e.target.value })} />
          </div>
          <div className="flex gap-2">
            <button type="submit" className="rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700">{editing ? "Update" : "Create"}</button>
            <button type="button" onClick={() => { setShowForm(false); setEditing(null); }} className="rounded-full border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50">Cancel</button>
          </div>
        </form>
      )}

      <div className="rounded-3xl border border-gray-200 bg-white shadow-sm overflow-x-auto">
        <table className="w-full text-left">
          <thead className="border-b border-gray-200 bg-gray-50 text-sm text-gray-600">
            <tr>
              <th className="px-4 py-3">Violation</th>
              <th className="px-4 py-3">Description</th>
              <th className="px-4 py-3">Assigned To</th>
              <th className="px-4 py-3">Deadline</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {actions.map((a) => (
              <tr key={a.id} className="border-b border-gray-100 hover:bg-gray-50">
                <td className="px-4 py-4 text-sm text-gray-700">#{a.violation_id}</td>
                <td className="px-4 py-4 text-sm text-gray-500 max-w-[250px] truncate">{a.description}</td>
                <td className="px-4 py-4 text-sm text-gray-500">{a.assigned_to ? (employeeMap[a.assigned_to] || `#${a.assigned_to}`) : "—"}</td>
                <td className="px-4 py-4 text-sm text-gray-700">{a.deadline || "—"}</td>
                <td className="px-4 py-4">
                  <span className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${
                    a.status === "completed" ? "bg-green-100 text-green-700" :
                    a.status === "in_progress" ? "bg-blue-100 text-blue-700" :
                    "bg-yellow-100 text-yellow-700"
                  }`}>{a.status.replace(/_/g, " ")}</span>
                </td>
                <td className="px-4 py-4 text-sm space-x-2">
                  <button onClick={() => handleEdit(a)} className="text-blue-600 hover:text-blue-800"><Edit2 size={16} /></button>
                  <button onClick={() => handleDelete(a.id)} className="text-red-600 hover:text-red-800"><Trash2 size={16} /></button>
                </td>
              </tr>
            ))}
            {actions.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-8 text-center text-gray-500">No corrective actions created.</td></tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// REPORTS
// ─────────────────────────────────────────────────────────────────────────────

function ReportsSection() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleGenerate = async () => {
    setLoading(true);
    try {
      const data = await hr.getComplianceReport();
      setReport(data);
    } catch {
      alert("Failed to generate report. Ensure the API is available.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={handleGenerate}
          disabled={loading}
          className="inline-flex items-center gap-2 rounded-full bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700 disabled:opacity-50"
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
      </div>

      {report && (
        <div className="rounded-3xl border border-gray-200 bg-white p-6 shadow-sm space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Compliance Report</h3>
            <span className="text-sm text-gray-500">Generated: {new Date(report.generated_at).toLocaleString()}</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="rounded-2xl bg-blue-50 p-4">
              <p className="text-sm text-blue-600 font-medium">Policies</p>
              <p className="text-2xl font-bold text-blue-900">{report.total_policies}</p>
            </div>
            <div className="rounded-2xl bg-green-50 p-4">
              <p className="text-sm text-green-600 font-medium">Acknowledgements</p>
              <p className="text-2xl font-bold text-green-900">{report.total_acknowledgements}</p>
            </div>
            <div className="rounded-2xl bg-purple-50 p-4">
              <p className="text-sm text-purple-600 font-medium">Audits</p>
              <p className="text-2xl font-bold text-purple-900">{report.total_audits}</p>
            </div>
            <div className="rounded-2xl bg-red-50 p-4">
              <p className="text-sm text-red-600 font-medium">Violations</p>
              <p className="text-2xl font-bold text-red-900">{report.total_violations}</p>
            </div>
            <div className="rounded-2xl bg-amber-50 p-4">
              <p className="text-sm text-amber-600 font-medium">Risk Assessments</p>
              <p className="text-2xl font-bold text-amber-900">{report.total_risks}</p>
            </div>
            <div className="rounded-2xl bg-indigo-50 p-4">
              <p className="text-sm text-indigo-600 font-medium">Corrective Actions</p>
              <p className="text-2xl font-bold text-indigo-900">{report.total_corrective_actions}</p>
            </div>
            <div className="rounded-2xl bg-teal-50 p-4">
              <p className="text-sm text-teal-600 font-medium">Regulations</p>
              <p className="text-2xl font-bold text-teal-900">{report.total_regulations}</p>
            </div>
          </div>

          {(report.violations_by_severity || report.violations_by_status) && (
            <div className="grid gap-6 sm:grid-cols-2">
              {report.violations_by_severity && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Violations by Severity</h4>
                  <div className="space-y-2">
                    {Object.entries(report.violations_by_severity).map(([key, count]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-gray-600">{key}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {report.violations_by_status && (
                <div>
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Violations by Status</h4>
                  <div className="space-y-2">
                    {Object.entries(report.violations_by_status).map(([key, count]) => (
                      <div key={key} className="flex items-center justify-between text-sm">
                        <span className="capitalize text-gray-600">{key}</span>
                        <span className="font-semibold text-gray-900">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {!report && !loading && (
        <div className="rounded-3xl border border-gray-200 bg-white p-12 text-center text-gray-500">
          Click "Generate Report" to view compliance report.
        </div>
      )}
    </div>
  );
}
