import { useState } from "react";
import { Download } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useDailyRecords } from "../hooks/useAttendance";
import { formatDate, formatTime, hoursWorked } from "../utils/helpers";

export default function DailyRecords() {
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ status: "", department: "", date: "" });
  const { data, loading } = useDailyRecords({ search, ...filters });

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "department", label: "Department" },
    { key: "date", label: "Date", render: (v) => formatDate(v) },
    { key: "checkIn", label: "Check In", render: (v) => formatTime(v) },
    { key: "checkOut", label: "Check Out", render: (v) => formatTime(v) },
    { key: "hoursWorked", label: "Hours", render: (v) => <span className="font-mono">{v}h</span> },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
  ];

  if (loading) return <div className="p-6 text-gray-400">Loading records...</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Daily Records</h1>
          <p className="text-sm text-gray-500 mt-1">View and manage daily attendance logs</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors text-sm font-medium">
          <Download className="w-4 h-4" /> Export
        </button>
      </div>

      <FilterBar
        search={search}
        onSearchChange={setSearch}
        filters={[
          { key: "status", placeholder: "All Statuses", value: filters.status, options: [
            { value: "present", label: "Present" },
            { value: "absent", label: "Absent" },
            { value: "late", label: "Late" },
            { value: "on_leave", label: "On Leave" },
            { value: "wfh", label: "WFH" },
          ]},
          { key: "department", placeholder: "All Departments", value: filters.department, options: [
            { value: "Engineering", label: "Engineering" },
            { value: "Marketing", label: "Marketing" },
            { value: "Sales", label: "Sales" },
            { value: "HR", label: "HR" },
            { value: "Finance", label: "Finance" },
          ]},
          { key: "date", placeholder: "Select Date", value: filters.date, options: [
            { value: new Date().toISOString().split("T")[0], label: "Today" },
            { value: new Date(Date.now() - 86400000).toISOString().split("T")[0], label: "Yesterday" },
          ]},
        ]}
        onFilterChange={handleFilterChange}
      />

      <DataTable columns={columns} data={data} />
    </div>
  );
}
