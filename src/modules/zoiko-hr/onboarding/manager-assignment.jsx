import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import {
  getOnboardingRecords,
  updateOnboardingRecord,
  getOnboardingMentorAssignments,
  createOnboardingMentorAssignment,
  updateOnboardingMentorAssignment,
  deleteOnboardingMentorAssignment,
  getEmployees,
} from "../../../service/hrService";

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

function OnboardingSubNav() {
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

export default function ManagerAssignment() {
  const [records, setRecords] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [mentorAssignments, setMentorAssignments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("unassigned");
  const [tab, setTab] = useState("manager");

  const [recordEdits, setRecordEdits] = useState({});
  const [managerSearch, setManagerSearch] = useState("");
  const [selectedManager, setSelectedManager] = useState("");
  const [assigningId, setAssigningId] = useState(null);
  const [removingId, setRemovingId] = useState(null);
  const [showAddMentor, setShowAddMentor] = useState(false);
  const [newMentorRecord, setNewMentorRecord] = useState("");
  const [newMentorEmployee, setNewMentorEmployee] = useState("");
  const [newMentorRole, setNewMentorRole] = useState("mentor");
  const [submitting, setSubmitting] = useState(false);
  const [mentorRoleFilter, setMentorRoleFilter] = useState("");

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [recordsData, employeesData, mentorData] = await Promise.all([
        getOnboardingRecords(),
        getEmployees({ per_page: 500 }),
        getOnboardingMentorAssignments(),
      ]);
      setRecords(Array.isArray(recordsData) ? recordsData : []);
      setEmployees(Array.isArray(employeesData) ? employeesData : []);
      setMentorAssignments(Array.isArray(mentorData) ? mentorData : []);
    } catch (err) {
      setError(err.message || "Failed to load data");
      if (!Array.isArray(records)) setRecords([]);
      if (!Array.isArray(employees)) setEmployees([]);
      if (!Array.isArray(mentorAssignments)) setMentorAssignments([]);
    } finally {
      setLoading(false);
    }
  };

  const employeeMap = useMemo(() => {
    const map = {};
    employees.forEach((e) => { map[e.id] = e; });
    return map;
  }, [employees]);

  const managersFiltered = useMemo(() => {
    if (!managerSearch.trim()) return employees;
    const q = managerSearch.toLowerCase();
    return employees.filter(
      (e) =>
        (e.name || "").toLowerCase().includes(q) ||
        (e.email || "").toLowerCase().includes(q) ||
        (String(e.id) === q)
    );
  }, [employees, managerSearch]);

  const unassigned = useMemo(() => {
    let result = records.filter((r) => !r.manager_id);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.candidate_name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.position?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [records, search]);

  const assigned = useMemo(() => {
    let result = records.filter((r) => r.manager_id);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.candidate_name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.position?.toLowerCase().includes(q)
      );
    }
    return result;
  }, [records, search]);

  const filteredMentorAssignments = useMemo(() => {
    let result = mentorAssignments;
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter((a) => {
        const rec = records.find((r) => r.id === a.onboarding_record_id);
        const emp = employeeMap[a.mentor_employee_id];
        return (
          (rec?.candidate_name || "").toLowerCase().includes(q) ||
          (emp?.name || "").toLowerCase().includes(q) ||
          (a.role || "").toLowerCase().includes(q)
        );
      });
    }
    if (mentorRoleFilter) {
      result = result.filter((a) => a.role === mentorRoleFilter);
    }
    return result;
  }, [mentorAssignments, search, mentorRoleFilter, records, employeeMap]);

  const handleAssignManager = async (id, managerId) => {
    if (!managerId) return;
    setAssigningId(id);
    try {
      await updateOnboardingRecord(id, { manager_id: Number(managerId) });
      setRecordEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to assign manager");
    } finally {
      setAssigningId(null);
    }
  };

  const handleRemoveManager = async (id) => {
    if (!window.confirm("Remove manager assignment for this record?")) return;
    setAssigningId(id);
    try {
      await updateOnboardingRecord(id, { manager_id: null });
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to remove manager");
    } finally {
      setAssigningId(null);
    }
  };

  const handleAddMentorAssignment = async () => {
    if (!newMentorRecord || !newMentorEmployee) return;
    setSubmitting(true);
    try {
      await createOnboardingMentorAssignment({
        onboarding_record_id: Number(newMentorRecord),
        mentor_employee_id: Number(newMentorEmployee),
        role: newMentorRole,
      });
      setNewMentorRecord("");
      setNewMentorEmployee("");
      setNewMentorRole("mentor");
      setShowAddMentor(false);
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to create assignment");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteMentorAssignment = async (id) => {
    if (!window.confirm("Remove this mentor/buddy assignment?")) return;
    setRemovingId(id);
    try {
      await deleteOnboardingMentorAssignment(id);
      await fetchData();
    } catch (err) {
      setError(err.message || "Failed to remove assignment");
    } finally {
      setRemovingId(null);
    }
  };

  if (loading && records.length === 0 && mentorAssignments.length === 0) {
    return (
      <HRPage title="Manager & Mentor Assignment" subtitle="Assign reporting managers, mentors, and buddies to onboarding records.">
        <OnboardingSubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading data...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Manager & Mentor Assignment" subtitle="Assign reporting managers, mentors, and buddies to onboarding records.">
      <OnboardingSubNav />

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="space-y-6">
        <div className="flex gap-2">
          <button
            onClick={() => setTab("manager")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === "manager"
                ? "bg-blue-600 text-white"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Reporting Manager
          </button>
          <button
            onClick={() => setTab("mentor")}
            className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
              tab === "mentor"
                ? "bg-blue-600 text-white"
                : "border border-gray-200 text-gray-700 hover:bg-gray-50"
            }`}
          >
            Mentor / Buddy
          </button>
        </div>

        {tab === "manager" ? (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
                <p className="text-xs text-gray-400">Total Records</p>
                <p className="text-lg font-bold text-gray-800">{records.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
                <p className="text-xs text-gray-400">Unassigned</p>
                <p className="text-lg font-bold text-amber-600">{unassigned.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
                <p className="text-xs text-gray-400">Assigned</p>
                <p className="text-lg font-bold text-emerald-600">{assigned.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
                <p className="text-xs text-gray-400">Employees (dropdown)</p>
                <p className="text-lg font-bold text-blue-600">{employees.length}</p>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Search by name, email, position..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => { setView("unassigned"); setSearch(""); }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    view === "unassigned"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Unassigned ({unassigned.length})
                </button>
                <button
                  onClick={() => { setView("assigned"); setSearch(""); }}
                  className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                    view === "assigned"
                      ? "bg-blue-600 text-white"
                      : "border border-gray-200 text-gray-700 hover:bg-gray-50"
                  }`}
                >
                  Assigned ({assigned.length})
                </button>
              </div>
            </div>

            {view === "unassigned" ? (
              <>
                {unassigned.length === 0 && !loading ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 font-medium">
                      {records.length === 0 ? "No onboarding records yet." : "All records have a manager assigned."}
                    </p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="text-left px-3 py-3 font-semibold text-gray-600">Candidate</th>
                            <th className="text-left px-3 py-3 font-semibold text-gray-600">Email</th>
                            <th className="text-left px-3 py-3 font-semibold text-gray-600">Position</th>
                            <th className="text-left px-3 py-3 font-semibold text-gray-600">Assign Manager</th>
                            <th className="text-right px-3 py-3 font-semibold text-gray-600">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {unassigned.map((r) => (
                            <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                              <td className="px-3 py-3 font-medium text-gray-800">{r.candidate_name}</td>
                              <td className="px-3 py-3 text-gray-500">{r.email}</td>
                              <td className="px-3 py-3 text-gray-700">{r.position || "-"}</td>
                              <td className="px-3 py-3">
                                <select
                                  value={recordEdits[r.id]?.manager_id || ""}
                                  onChange={(e) =>
                                    setRecordEdits((prev) => ({
                                      ...prev,
                                      [r.id]: { manager_id: e.target.value },
                                    }))
                                  }
                                  className="border border-gray-200 rounded px-2 py-1 text-xs w-44 focus:outline-none focus:ring-1 focus:ring-blue-500"
                                >
                                  <option value="">Select Manager...</option>
                                  {employees.map((emp) => (
                                    <option key={emp.id} value={emp.id}>
                                      {emp.name || emp.full_name || `Employee #${emp.id}`}
                                    </option>
                                  ))}
                                </select>
                              </td>
                              <td className="px-3 py-3 text-right">
                                <button
                                  onClick={() => handleAssignManager(r.id, recordEdits[r.id]?.manager_id)}
                                  disabled={assigningId === r.id || !recordEdits[r.id]?.manager_id}
                                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs px-3 py-1 rounded-lg font-medium transition-colors"
                                >
                                  {assigningId === r.id ? "Saving..." : "Assign"}
                                </button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <>
                {assigned.length === 0 && !loading ? (
                  <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                    <p className="text-gray-500 font-medium">No assigned records yet.</p>
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead className="bg-gray-50 border-b border-gray-100">
                          <tr>
                            <th className="text-left px-3 py-3 font-semibold text-gray-600">Candidate</th>
                            <th className="text-left px-3 py-3 font-semibold text-gray-600">Email</th>
                            <th className="text-left px-3 py-3 font-semibold text-gray-600">Position</th>
                            <th className="text-left px-3 py-3 font-semibold text-gray-600">Manager</th>
                            <th className="text-right px-3 py-3 font-semibold text-gray-600">Action</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                          {assigned.map((r) => {
                            const mgr = employeeMap[r.manager_id];
                            return (
                              <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-3 py-3 font-medium text-gray-800">{r.candidate_name}</td>
                                <td className="px-3 py-3 text-gray-500">{r.email}</td>
                                <td className="px-3 py-3 text-gray-700">{r.position || "-"}</td>
                                <td className="px-3 py-3">
                                  <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                                    {mgr?.name || mgr?.full_name || `Emp #${r.manager_id}`}
                                  </span>
                                </td>
                                <td className="px-3 py-3 text-right">
                                  <button
                                    onClick={() => handleRemoveManager(r.id)}
                                    disabled={assigningId === r.id}
                                    className="text-red-500 hover:text-red-700 disabled:text-red-300 text-xs font-medium transition-colors"
                                  >
                                    {assigningId === r.id ? "Removing..." : "Remove"}
                                  </button>
                                </td>
                              </tr>
                            );
                          })}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </>
            )}
          </>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
                <p className="text-xs text-gray-400">Total Assignments</p>
                <p className="text-lg font-bold text-gray-800">{mentorAssignments.length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
                <p className="text-xs text-gray-400">Mentors</p>
                <p className="text-lg font-bold text-blue-600">{mentorAssignments.filter((a) => a.role === "mentor" || !a.role).length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2">
                <p className="text-xs text-gray-400">Buddies</p>
                <p className="text-lg font-bold text-emerald-600">{mentorAssignments.filter((a) => a.role === "buddy").length}</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm px-3 py-2 flex items-end justify-end">
                <button
                  onClick={() => setShowAddMentor(true)}
                  className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                >
                  + New Assignment
                </button>
              </div>
            </div>

            <div className="flex flex-wrap justify-between items-center gap-4">
              <div className="flex flex-wrap gap-3">
                <input
                  type="text"
                  placeholder="Search by name or role..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-56 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <select
                  value={mentorRoleFilter}
                  onChange={(e) => setMentorRoleFilter(e.target.value)}
                  className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">All Roles</option>
                  <option value="mentor">Mentor</option>
                  <option value="buddy">Buddy</option>
                </select>
              </div>
            </div>

            {filteredMentorAssignments.length === 0 && !loading ? (
              <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                <p className="text-gray-500 font-medium">
                  {mentorAssignments.length === 0
                    ? "No mentor/buddy assignments yet."
                    : "No assignments match your search."}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Candidate</th>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Assigned Employee</th>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Role</th>
                        <th className="text-right px-3 py-3 font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {filteredMentorAssignments.map((a) => {
                        const rec = records.find((r) => r.id === a.onboarding_record_id);
                        const emp = employeeMap[a.mentor_employee_id];
                        return (
                          <tr key={a.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-3 py-3 font-medium text-gray-800">{rec?.candidate_name || `Record #${a.onboarding_record_id}`}</td>
                            <td className="px-3 py-3 text-gray-700">{emp?.name || emp?.full_name || `Emp #${a.mentor_employee_id}`}</td>
                            <td className="px-3 py-3">
                              <span className={`inline-block px-2 py-0.5 rounded-full text-xs font-medium ${
                                (a.role || "mentor") === "mentor"
                                  ? "bg-purple-100 text-purple-700"
                                  : "bg-emerald-100 text-emerald-700"
                              }`}>
                                {(a.role || "mentor").charAt(0).toUpperCase() + (a.role || "mentor").slice(1)}
                              </span>
                            </td>
                            <td className="px-3 py-3 text-right">
                              <button
                                onClick={() => handleDeleteMentorAssignment(a.id)}
                                disabled={removingId === a.id}
                                className="text-red-500 hover:text-red-700 disabled:text-red-300 text-xs font-medium transition-colors"
                              >
                                {removingId === a.id ? "Removing..." : "Remove"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {showAddMentor && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4">
            <div className="flex justify-between items-center px-6 py-4 border-b border-gray-100">
              <h2 className="text-lg font-bold text-gray-800">New Mentor / Buddy Assignment</h2>
              <button onClick={() => setShowAddMentor(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Onboarding Record</label>
                <select
                  value={newMentorRecord}
                  onChange={(e) => setNewMentorRecord(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select candidate...</option>
                  {records.map((r) => (
                    <option key={r.id} value={r.id}>{r.candidate_name} ({r.email})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee (Mentor / Buddy)</label>
                <select
                  value={newMentorEmployee}
                  onChange={(e) => setNewMentorEmployee(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select employee...</option>
                  {employees.map((emp) => (
                    <option key={emp.id} value={emp.id}>{emp.name || emp.full_name || `Employee #${emp.id}`}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
                <select
                  value={newMentorRole}
                  onChange={(e) => setNewMentorRole(e.target.value)}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="mentor">Mentor</option>
                  <option value="buddy">Buddy</option>
                </select>
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button
                  onClick={() => setShowAddMentor(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddMentorAssignment}
                  disabled={submitting || !newMentorRecord || !newMentorEmployee}
                  className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-colors"
                >
                  {submitting ? "Saving..." : "Create Assignment"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </HRPage>
  );
}
