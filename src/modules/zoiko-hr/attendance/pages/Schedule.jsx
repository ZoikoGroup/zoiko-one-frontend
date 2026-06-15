import { useState } from "react";
import { Plus, Clock, Users } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useSchedule } from "../hooks/useAttendance";
import { createShift, assignShift } from "../services/attendanceService";

export default function AttendanceSchedule() {
  const { data, loading } = useSchedule();
  const [deptFilter, setDeptFilter] = useState("");
  const [search, setSearch] = useState("");
  const [showShiftModal, setShowShiftModal] = useState(false);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [shiftForm, setShiftForm] = useState({ name: "", startTime: "09:00", endTime: "18:00", department: "" });
  const [assignForm, setAssignForm] = useState({ employee: "", shift: "", date: "", department: "" });

  if (loading) return <div className="p-6 text-gray-400">Loading schedule...</div>;

  const { shifts, assignments } = data;

  const filteredAssignments = assignments.filter((a) => {
    if (deptFilter && a.department !== deptFilter) return false;
    if (search && !a.employee.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  const handleCreateShift = async (e) => {
    e.preventDefault();
    await createShift(shiftForm);
    setShowShiftModal(false);
    setShiftForm({ name: "", startTime: "09:00", endTime: "18:00", department: "" });
  };

  const handleAssignShift = async (e) => {
    e.preventDefault();
    await assignShift(assignForm);
    setShowAssignModal(false);
    setAssignForm({ employee: "", shift: "", date: "", department: "" });
  };

  const shiftColumns = [
    { key: "name", label: "Shift Name", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "startTime", label: "Start" },
    { key: "endTime", label: "End" },
    { key: "department", label: "Department" },
  ];

  const assignColumns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "shift", label: "Shift" },
    { key: "date", label: "Date", render: (v) => new Date(v).toLocaleDateString("en-US", { month: "short", day: "numeric" }) },
    { key: "department", label: "Department" },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Shift Schedule</h1>
          <p className="text-sm text-gray-500 mt-1">Manage shifts and assignments</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => setShowShiftModal(true)} className="flex items-center gap-2 px-4 py-2 border border-indigo-600 text-indigo-600 rounded-lg hover:bg-indigo-50 transition-colors text-sm font-medium">
            <Plus className="w-4 h-4" /> New Shift
          </button>
          <button onClick={() => setShowAssignModal(true)} className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
            <Users className="w-4 h-4" /> Assign Shift
          </button>
        </div>
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Shift Templates</h2>
        <DataTable columns={shiftColumns} data={shifts} />
      </div>

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Current Assignments</h2>
        <FilterBar
          search={search} onSearchChange={setSearch}
          filters={[{
            key: "department", placeholder: "All Departments", value: deptFilter,
            options: [
              { value: "Engineering", label: "Engineering" },
              { value: "Marketing", label: "Marketing" },
              { value: "Sales", label: "Sales" },
              { value: "HR", label: "HR" },
              { value: "Finance", label: "Finance" },
            ],
          }]}
          onFilterChange={(k, v) => setDeptFilter(v)}
        />
        <DataTable columns={assignColumns} data={filteredAssignments} />
      </div>

      {showShiftModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Create Shift</h2>
              <button onClick={() => setShowShiftModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleCreateShift} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift Name</label>
                <input type="text" value={shiftForm.name} onChange={(e) => setShiftForm({ ...shiftForm, name: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                  <input type="time" value={shiftForm.startTime} onChange={(e) => setShiftForm({ ...shiftForm, startTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                  <input type="time" value={shiftForm.endTime} onChange={(e) => setShiftForm({ ...shiftForm, endTime: e.target.value })}
                    className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input type="text" value={shiftForm.department} onChange={(e) => setShiftForm({ ...shiftForm, department: e.target.value })} required
                  placeholder="e.g. Engineering"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowShiftModal(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">Create</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {showAssignModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
          <div className="bg-white rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-bold text-gray-900">Assign Shift</h2>
              <button onClick={() => setShowAssignModal(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">&times;</button>
            </div>
            <form onSubmit={handleAssignShift} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Employee Name</label>
                <input type="text" value={assignForm.employee} onChange={(e) => setAssignForm({ ...assignForm, employee: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Shift</label>
                <select value={assignForm.shift} onChange={(e) => setAssignForm({ ...assignForm, shift: e.target.value })}
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500">
                  <option value="">Select shift</option>
                  {shifts.map((s) => <option key={s.id} value={s.name}>{s.name}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Date</label>
                <input type="date" value={assignForm.date} onChange={(e) => setAssignForm({ ...assignForm, date: e.target.value })} required
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Department</label>
                <input type="text" value={assignForm.department} onChange={(e) => setAssignForm({ ...assignForm, department: e.target.value })} required
                  placeholder="e.g. Engineering"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setShowAssignModal(false)}
                  className="px-4 py-2 text-sm border border-gray-200 rounded-lg hover:bg-gray-50">Cancel</button>
                <button type="submit"
                  className="px-4 py-2 text-sm bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition-colors">Assign</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
