import { useState } from "react";
import {
  Users,
  Search,
  Filter,
  ChevronDown,
  X,
  CheckCircle2,
  AlertCircle,
  User,
  Briefcase,
  CreditCard,
  FileText,
  DollarSign,
  TrendingUp,
} from "lucide-react";
import { usePayroll } from "../PayrollContext";

const drawerTabs = [
  { label: "Personal", icon: User },
  { label: "Payroll", icon: DollarSign },
  { label: "Tax", icon: FileText },
  { label: "Bank", icon: CreditCard },
  { label: "Deductions", icon: Briefcase },
  { label: "YTD", icon: TrendingUp },
];

export default function Employees() {
  const { employees, addEmployee, updateEmployee, addToast } = usePayroll();
  const [search, setSearch] = useState("");
  const [selected, setSelected] = useState(null);
  const [drawerTab, setDrawerTab] = useState(0);

  // Add Employee Modal State
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newEmpForm, setNewEmpForm] = useState({
    name: "",
    dept: "Engineering",
    type: "Full-time",
    salary: "",
    status: "Active",
    pan: "",
    bankName: "",
    bankAcc: "",
    bankIfsc: "",
    bankType: "Savings",
  });

  // Edit Employee State (tied to drawer)
  const [editForm, setEditForm] = useState(null);

  const filtered = employees.filter(
    (e) =>
      e.name.toLowerCase().includes(search.toLowerCase()) ||
      e.id.toLowerCase().includes(search.toLowerCase())
  );

  const handleOpenDrawer = (emp) => {
    setSelected(emp);
    setEditForm({ ...emp });
    setDrawerTab(0);
  };

  const handleEditChange = (field, value) => {
    setEditForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveProfile = () => {
    if (!editForm) return;
    updateEmployee(selected.id, editForm);
    setSelected(null);
    setEditForm(null);
  };

  const handleAddSubmit = (e) => {
    e.preventDefault();
    if (!newEmpForm.name || !newEmpForm.salary) {
      addToast("Please enter employee name and salary details.", "error");
      return;
    }
    addEmployee({
      ...newEmpForm,
      salary: parseFloat(newEmpForm.salary) || 0,
    });
    setAddModalOpen(false);
    setNewEmpForm({
      name: "",
      dept: "Engineering",
      type: "Full-time",
      salary: "",
      status: "Active",
      pan: "",
      bankName: "",
      bankAcc: "",
      bankIfsc: "",
      bankType: "Savings",
    });
  };

  return (
    <div className="p-6 space-y-5 relative">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-br from-violet-500/10 via-indigo-500/5 to-transparent border border-violet-500/15 p-7">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-2xl bg-gradient-to-br from-violet-500 to-indigo-600 flex items-center justify-center shadow-lg">
            <Users size={20} className="text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-slate-800">
              Employee Registry
            </h1>
            <p className="text-slate-500 text-sm">
              {employees.length} employees · {employees.filter((e) => e.ready).length}{" "}
              payroll-ready
            </p>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search
            size={15}
            className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400"
          />
          <input
            type="text"
            placeholder="Search employees..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-2xl border border-slate-200 bg-white pl-10 pr-4 py-2.5 text-sm text-slate-700 focus:outline-none focus:border-violet-400 transition"
          />
        </div>
        <button className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2.5 text-sm text-slate-600 hover:border-slate-300 transition">
          <Filter size={14} /> Filter <ChevronDown size={13} />
        </button>
        <button
          onClick={() => setAddModalOpen(true)}
          className="rounded-2xl bg-gradient-to-r from-violet-500 to-indigo-500 px-5 py-2.5 text-sm font-semibold text-white shadow hover:shadow-lg hover:scale-[1.02] transition-all"
        >
          + Add Employee
        </button>
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-3xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-100 bg-slate-50/80">
              {[
                "Employee ID",
                "Name",
                "Department",
                "Type",
                "Salary",
                "Status",
                "Payroll Ready",
              ].map((h) => (
                <th
                  key={h}
                  className="px-5 py-3.5 text-left text-xs font-semibold text-slate-500 uppercase tracking-wide"
                >
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filtered.map((emp) => (
              <tr
                key={emp.id}
                onClick={() => handleOpenDrawer(emp)}
                className="hover:bg-slate-50 cursor-pointer transition-colors"
              >
                <td className="px-5 py-4 font-mono text-xs text-slate-500">
                  {emp.id}
                </td>
                <td className="px-5 py-4 font-semibold text-slate-800">{emp.name}</td>
                <td className="px-5 py-4 text-slate-600">{emp.dept}</td>
                <td className="px-5 py-4 text-slate-600">{emp.type}</td>
                <td className="px-5 py-4 font-semibold text-slate-800">
                  ₹{Number(emp.salary).toLocaleString()}
                </td>
                <td className="px-5 py-4">
                  <span
                    className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                      emp.status === "Active"
                        ? "bg-emerald-100 text-emerald-700"
                        : "bg-amber-100 text-amber-700"
                    }`}
                  >
                    {emp.status}
                  </span>
                </td>
                <td className="px-5 py-4">
                  {emp.ready ? (
                    <CheckCircle2 size={16} className="text-emerald-500" />
                  ) : (
                    <AlertCircle size={16} className="text-red-400" />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Employee Modal */}
      {addModalOpen && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-sm"
            onClick={() => setAddModalOpen(false)}
          />
          <div className="fixed left-1/2 top-1/2 z-50 w-full max-w-lg -translate-x-1/2 -translate-y-1/2 rounded-3xl border border-slate-200 bg-white p-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-lg font-bold text-slate-800">Add New Employee</h3>
              <button
                onClick={() => setAddModalOpen(false)}
                className="rounded-xl p-1 text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>
            <form onSubmit={handleAddSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Full Name</label>
                  <input
                    type="text"
                    required
                    value={newEmpForm.name}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, name: e.target.value })}
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Monthly CTC (Salary)</label>
                  <input
                    type="number"
                    required
                    value={newEmpForm.salary}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, salary: e.target.value })}
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Department</label>
                  <select
                    value={newEmpForm.dept}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, dept: e.target.value })}
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  >
                    <option>Engineering</option>
                    <option>Marketing</option>
                    <option>Finance</option>
                    <option>HR</option>
                    <option>Sales</option>
                    <option>Design</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Employment Type</label>
                  <select
                    value={newEmpForm.type}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, type: e.target.value })}
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  >
                    <option>Full-time</option>
                    <option>Contract</option>
                    <option>Part-time</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">PAN Tax ID</label>
                  <input
                    type="text"
                    value={newEmpForm.pan}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, pan: e.target.value })}
                    placeholder="Optional (EXC if missing)"
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Bank Name</label>
                  <input
                    type="text"
                    value={newEmpForm.bankName}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, bankName: e.target.value })}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Bank Account No.</label>
                  <input
                    type="text"
                    value={newEmpForm.bankAcc}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, bankAcc: e.target.value })}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-xs text-slate-500 mb-1 block">Bank IFSC Code</label>
                  <input
                    type="text"
                    value={newEmpForm.bankIfsc}
                    onChange={(e) => setNewEmpForm({ ...newEmpForm, bankIfsc: e.target.value })}
                    placeholder="Optional"
                    className="w-full rounded-xl border border-slate-250 px-3 py-2 text-sm focus:border-violet-400 focus:outline-none"
                  />
                </div>
              </div>
              <div className="flex justify-end gap-2 pt-4 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setAddModalOpen(false)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="rounded-xl bg-violet-600 px-5 py-2 text-xs font-semibold text-white shadow hover:bg-violet-700"
                >
                  Save Employee
                </button>
              </div>
            </form>
          </div>
        </>
      )}

      {/* Employee Drawer */}
      {selected && editForm && (
        <>
          <div
            className="fixed inset-0 z-40 bg-slate-950/20"
            onClick={() => setSelected(null)}
          />
          <aside className="fixed right-0 top-0 bottom-0 z-50 w-96 border-l border-slate-200 bg-white shadow-2xl flex flex-col overflow-hidden">
            {/* Drawer Header */}
            <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
              <div>
                <p className="font-bold text-slate-800 text-lg">{selected.name}</p>
                <p className="text-xs text-slate-400 font-mono">{selected.id}</p>
              </div>
              <button
                onClick={() => setSelected(null)}
                className="rounded-xl p-1.5 text-slate-400 hover:bg-slate-100"
              >
                <X size={16} />
              </button>
            </div>

            {/* Drawer Tabs */}
            <div className="flex gap-1 px-4 py-2 border-b border-slate-100 overflow-x-auto">
              {drawerTabs.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setDrawerTab(i)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all ${
                    drawerTab === i
                      ? "bg-violet-100 text-violet-700"
                      : "text-slate-500 hover:bg-slate-100"
                  }`}
                >
                  <t.icon size={12} />
                  {t.label}
                </button>
              ))}
            </div>

            {/* Drawer Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {drawerTab === 0 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Full Name</label>
                    <input
                      type="text"
                      value={editForm.name}
                      onChange={(e) => handleEditChange("name", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Department</label>
                    <select
                      value={editForm.dept}
                      onChange={(e) => handleEditChange("dept", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    >
                      <option>Engineering</option>
                      <option>Marketing</option>
                      <option>Finance</option>
                      <option>HR</option>
                      <option>Sales</option>
                      <option>Design</option>
                    </select>
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Employment Status</label>
                    <select
                      value={editForm.status}
                      onChange={(e) => handleEditChange("status", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    >
                      <option>Active</option>
                      <option>On Leave</option>
                      <option>Suspended</option>
                    </select>
                  </div>
                </div>
              )}

              {drawerTab === 1 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Monthly Salary</label>
                    <input
                      type="number"
                      value={editForm.salary}
                      onChange={(e) => handleEditChange("salary", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div className="text-xs text-slate-500 space-y-2 pt-2">
                    <p className="font-semibold text-slate-700">Salary Component Split (Auto):</p>
                    <div className="flex justify-between border-b py-1">
                      <span>Basic Pay (40%)</span>
                      <span className="font-mono">₹{(editForm.salary * 0.4).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b py-1">
                      <span>HRA (20%)</span>
                      <span className="font-mono">₹{(editForm.salary * 0.2).toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between border-b py-1">
                      <span>Special Allowance (40%)</span>
                      <span className="font-mono">₹{(editForm.salary * 0.4).toLocaleString()}</span>
                    </div>
                  </div>
                </div>
              )}

              {drawerTab === 2 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">PAN Tax ID</label>
                    <input
                      type="text"
                      value={editForm.pan || ""}
                      onChange={(e) => handleEditChange("pan", e.target.value)}
                      placeholder="Add PAN to resolve missing tax ID block"
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    />
                  </div>
                </div>
              )}

              {drawerTab === 3 && (
                <div className="space-y-4">
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Bank Name</label>
                    <input
                      type="text"
                      value={editForm.bankName || ""}
                      onChange={(e) => handleEditChange("bankName", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">Account Number</label>
                    <input
                      type="text"
                      value={editForm.bankAcc || ""}
                      onChange={(e) => handleEditChange("bankAcc", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-500 mb-1 block">IFSC Code</label>
                    <input
                      type="text"
                      value={editForm.bankIfsc || ""}
                      onChange={(e) => handleEditChange("bankIfsc", e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:outline-none focus:border-violet-400"
                    />
                  </div>
                  <div className="rounded-xl bg-amber-50 border border-amber-100 p-3 text-[11px] text-amber-700">
                    Bank detail changes will automatically sync and recheck for exceptions.
                  </div>
                </div>
              )}

              {drawerTab === 4 && (
                <div className="space-y-2 text-xs text-slate-600">
                  <p className="font-semibold text-slate-700 mb-2">Automated Contributions (Monthly):</p>
                  <div className="flex justify-between border-b py-1.5">
                    <span>PF Employee Contribution (12% of Basic)</span>
                    <span className="font-mono">₹{Math.round(editForm.salary * 0.4 * 0.12).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b py-1.5">
                    <span>ESI Employee Contribution (0.75% of Gross)</span>
                    <span className="font-mono">₹{Math.round(editForm.salary * 0.0075).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-b py-1.5">
                    <span>Professional Tax</span>
                    <span className="font-mono">₹200</span>
                  </div>
                </div>
              )}

              {drawerTab === 5 && (
                <div className="space-y-3">
                  <p className="text-xs font-semibold text-slate-500 mb-2">Year-to-Date Summary</p>
                  {[
                    { label: "YTD Gross Payout", val: `₹${(editForm.salary * 6).toLocaleString()}` },
                    { label: "YTD TDS Deducted", val: `₹${(editForm.salary * 6 * 0.1).toLocaleString()}` },
                    { label: "YTD PF Contributed", val: `₹${Math.round(editForm.salary * 6 * 0.4 * 0.12).toLocaleString()}` },
                    { label: "YTD Net Payout", val: `₹${Math.round(editForm.salary * 6 * 0.8).toLocaleString()}` },
                  ].map((f) => (
                    <div key={f.label} className="flex justify-between py-2 border-b border-slate-50 text-sm">
                      <span className="text-slate-400">{f.label}</span>
                      <span className="font-bold text-slate-800">{f.val}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Drawer Footer Actions */}
            <div className="border-t border-slate-100 p-4 flex gap-2 bg-slate-50">
              <button
                type="button"
                onClick={() => setSelected(null)}
                className="flex-1 rounded-xl border border-slate-200 bg-white py-2 text-xs font-semibold text-slate-600 hover:bg-slate-50"
              >
                Discard
              </button>
              <button
                type="button"
                onClick={handleSaveProfile}
                className="flex-1 rounded-xl bg-violet-600 py-2 text-xs font-semibold text-white shadow hover:bg-violet-700"
              >
                Save Profile
              </button>
            </div>
          </aside>
        </>
      )}
    </div>
  );
}
