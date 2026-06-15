import { useState, useEffect, useMemo } from "react";
import { NavLink } from "react-router-dom";
import HRPage from "../../../components/HRPage";
import {
  getOnboardingRecords,
  updateOnboardingRecord,
  getOnboardingTasks,
  createOnboardingTask,
  updateOnboardingTask,
  deleteOnboardingTask,
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

const DEPARTMENT_OPTIONS = [
  { id: 1, name: "Engineering" },
  { id: 2, name: "Sales" },
  { id: 3, name: "HR" },
];

export default function DepartmentAssignment() {
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState("");
  const [view, setView] = useState("unassigned");
  const [assignedDeptFilter, setAssignedDeptFilter] = useState("");

  const [selectedIds, setSelectedIds] = useState([]);
  const [bulkDepartmentId, setBulkDepartmentId] = useState("");
  const [bulkDesignation, setBulkDesignation] = useState("");
  const [bulkSubmitting, setBulkSubmitting] = useState(false);

  const [assigningId, setAssigningId] = useState(null);
  const [recordEdits, setRecordEdits] = useState({});

  const getEdit = (id) => recordEdits[id] || { department_id: "", designation: "" };

  const setEdit = (id, field, value) => {
    setRecordEdits((prev) => ({
      ...prev,
      [id]: { ...(prev[id] || { department_id: "", designation: "" }), [field]: value },
    }));
  };

  const fetchRecords = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await getOnboardingRecords();
      setRecords(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message || "Failed to load records");
      setRecords([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecords();
  }, []);

  const unassigned = useMemo(() => {
    let result = records.filter((r) => !r.department_id);
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
    let result = records.filter((r) => r.department_id);
    if (search.trim()) {
      const q = search.toLowerCase();
      result = result.filter(
        (r) =>
          r.candidate_name?.toLowerCase().includes(q) ||
          r.email?.toLowerCase().includes(q) ||
          r.position?.toLowerCase().includes(q)
      );
    }
    if (assignedDeptFilter) {
      result = result.filter((r) => String(r.department_id) === assignedDeptFilter);
    }
    return result;
  }, [records, search, assignedDeptFilter]);

  const handleAssign = async (id, departmentId, designation) => {
    setAssigningId(id);
    try {
      await updateOnboardingRecord(id, {
        department_id: departmentId ? Number(departmentId) : null,
        position: designation || undefined,
      });
      setRecordEdits((prev) => {
        const next = { ...prev };
        delete next[id];
        return next;
      });
      await fetchRecords();
    } catch (err) {
      setError(err.message || "Failed to assign department");
    } finally {
      setAssigningId(null);
    }
  };

  const handleBulkAssign = async () => {
    if (selectedIds.length === 0) return;
    if (!bulkDepartmentId) return;
    setBulkSubmitting(true);
    try {
      const payload = {
        department_id: Number(bulkDepartmentId),
      };
      if (bulkDesignation.trim()) {
        payload.position = bulkDesignation.trim();
      }
      await Promise.all(selectedIds.map((id) => updateOnboardingRecord(id, payload)));
      setSelectedIds([]);
      setBulkDepartmentId("");
      setBulkDesignation("");
      await fetchRecords();
    } catch (err) {
      setError(err.message || "Failed to bulk assign");
    } finally {
      setBulkSubmitting(false);
    }
  };

  const handleSelectAll = () => {
    if (selectedIds.length === unassigned.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(unassigned.map((r) => r.id));
    }
  };

  const handleToggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const assignedDepartments = useMemo(() => {
    const seen = new Set();
    const depts = [];
    assigned.forEach((r) => {
      const key = r.department_id;
      const name = r.department_name || r.department || "";
      if (key && !seen.has(key)) {
        seen.add(key);
        depts.push({ id: key, name });
      }
    });
    return depts;
  }, [assigned]);

  if (loading && records.length === 0) {
    return (
      <HRPage title="Department Assignment" subtitle="Assign departments and designations to new hires.">
        <OnboardingSubNav />
        <div className="flex justify-center items-center py-20">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-3 text-gray-500">Loading records...</span>
        </div>
      </HRPage>
    );
  }

  return (
    <HRPage title="Department Assignment" subtitle="Assign departments and designations to new hires.">
      <OnboardingSubNav />

      {error && (
        <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 text-red-700 rounded-lg flex justify-between items-center">
          <span>{error}</span>
          <button onClick={() => setError(null)} className="text-red-500 hover:text-red-700 font-bold">&times;</button>
        </div>
      )}

      <div className="space-y-6">
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
            {view === "assigned" && (
              <select
                value={assignedDeptFilter}
                onChange={(e) => setAssignedDeptFilter(e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Departments</option>
                {assignedDepartments.map((d) => (
                  <option key={d.id} value={d.id}>{d.name || `Dept #${d.id}`}</option>
                ))}
              </select>
            )}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => { setView("unassigned"); setSelectedIds([]); }}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors ${
                view === "unassigned"
                  ? "bg-blue-600 text-white"
                  : "border border-gray-200 text-gray-700 hover:bg-gray-50"
              }`}
            >
              Unassigned ({unassigned.length})
            </button>
            <button
              onClick={() => { setView("assigned"); setSelectedIds([]); }}
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
                  {records.length === 0 ? "No onboarding records yet." : "All records have been assigned to a department."}
                </p>
              </div>
            ) : (
              <div className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50 border-b border-gray-100">
                      <tr>
                        <th className="w-8 px-2 py-3">
                          <input
                            type="checkbox"
                            checked={selectedIds.length > 0 && selectedIds.length === unassigned.length}
                            onChange={handleSelectAll}
                            className="rounded border-gray-300"
                          />
                        </th>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Candidate</th>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Email</th>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Position</th>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Department</th>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Designation</th>
                        <th className="text-right px-3 py-3 font-semibold text-gray-600">Action</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {unassigned.map((r) => {
                        const edit = getEdit(r.id);
                        return (
                          <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                            <td className="px-2 py-3">
                              <input
                                type="checkbox"
                                checked={selectedIds.includes(r.id)}
                                onChange={() => handleToggleSelect(r.id)}
                                className="rounded border-gray-300"
                              />
                            </td>
                            <td className="px-3 py-3 font-medium text-gray-800">{r.candidate_name}</td>
                            <td className="px-3 py-3 text-gray-500">{r.email}</td>
                            <td className="px-3 py-3 text-gray-700">{r.position || "-"}</td>
                            <td className="px-3 py-3">
                              <select
                                value={edit.department_id}
                                onChange={(e) => setEdit(r.id, "department_id", e.target.value)}
                                className="border border-gray-200 rounded px-2 py-1 text-xs focus:outline-none focus:ring-1 focus:ring-blue-500"
                              >
                                <option value="">Select Dept...</option>
                                {DEPARTMENT_OPTIONS.map((d) => (
                                  <option key={d.id} value={d.id}>{d.name}</option>
                                ))}
                              </select>
                            </td>
                            <td className="px-3 py-3">
                              <input
                                type="text"
                                placeholder="Designation"
                                value={edit.designation}
                                onChange={(e) => setEdit(r.id, "designation", e.target.value)}
                                className="border border-gray-200 rounded px-2 py-1 text-xs w-32 focus:outline-none focus:ring-1 focus:ring-blue-500"
                              />
                            </td>
                            <td className="px-3 py-3 text-right">
                              <button
                                onClick={() => handleAssign(r.id, edit.department_id, edit.designation)}
                                disabled={assigningId === r.id || !edit.department_id}
                                className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-xs px-3 py-1 rounded-lg font-medium transition-colors"
                              >
                                {assigningId === r.id ? "Saving..." : "Save"}
                              </button>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>

                {selectedIds.length > 0 && (
                  <div className="border-t border-gray-100 bg-gray-50 px-6 py-4">
                    <div className="flex flex-wrap items-center gap-3">
                      <span className="text-sm font-medium text-gray-700">
                        {selectedIds.length} selected
                      </span>
                      <select
                        value={bulkDepartmentId}
                        onChange={(e) => setBulkDepartmentId(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">Assign Department...</option>
                        {DEPARTMENT_OPTIONS.map((d) => (
                          <option key={d.id} value={d.id}>{d.name}</option>
                        ))}
                      </select>
                      <input
                        type="text"
                        placeholder="Designation (optional)"
                        value={bulkDesignation}
                        onChange={(e) => setBulkDesignation(e.target.value)}
                        className="border border-gray-200 rounded-lg px-3 py-2 text-sm w-44 focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                      <button
                        onClick={handleBulkAssign}
                        disabled={bulkSubmitting || !bulkDepartmentId}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                      >
                        {bulkSubmitting ? "Assigning..." : "Assign All"}
                      </button>
                      <button
                        onClick={() => setSelectedIds([])}
                        className="text-gray-500 hover:text-gray-700 text-sm font-medium px-3 py-2"
                      >
                        Clear
                      </button>
                    </div>
                  </div>
                )}
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
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Department</th>
                        <th className="text-left px-3 py-3 font-semibold text-gray-600">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-50">
                      {assigned.map((r) => (
                        <tr key={r.id} className="hover:bg-gray-50 transition-colors">
                          <td className="px-3 py-3 font-medium text-gray-800">{r.candidate_name}</td>
                          <td className="px-3 py-3 text-gray-500">{r.email}</td>
                          <td className="px-3 py-3 text-gray-700">{r.position || "-"}</td>
                          <td className="px-3 py-3">
                            <span className="inline-block px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-700">
                              {r.department_name || r.department || `Dept #${r.department_id}`}
                            </span>
                          </td>
                          <td className="px-3 py-3">
                            <span className="inline-block px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-700">
                              Assigned
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </HRPage>
  );
}
