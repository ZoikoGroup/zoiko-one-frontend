import { useState } from "react";
import { Plus, Clock, Users, Calendar as CalendarIcon } from "lucide-react";
import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import FilterBar from "../components/FilterBar";
import { useInterviews } from "../hooks/useRecruitment";
import { formatDate } from "../utils/helpers";

export default function InterviewScheduling() {
  const { data: interviews, loading } = useInterviews();
  const [search, setSearch] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const filtered = interviews.filter((i) => {
    const matchSearch = !search || i.candidate.toLowerCase().includes(search.toLowerCase());
    const matchType = !typeFilter || i.type === typeFilter;
    return matchSearch && matchType;
  });

  const columns = [
    { key: "candidate", label: "Candidate", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "position", label: "Position" },
    { key: "date", label: "Date", render: (v) => (
      <div className="flex items-center gap-2"><CalendarIcon className="w-3.5 h-3.5 text-gray-400" />{formatDate(v)}</div>
    )},
    { key: "time", label: "Time", render: (v) => (
      <div className="flex items-center gap-2"><Clock className="w-3.5 h-3.5 text-gray-400" />{v}</div>
    )},
    { key: "interviewers", label: "Interviewers", render: (v) => (
      <div className="flex items-center gap-2"><Users className="w-3.5 h-3.5 text-gray-400" />{v.join(", ")}</div>
    )},
    { key: "type", label: "Type" },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "actions", label: "", render: () => (
      <div className="flex gap-2">
        <button className="text-xs text-orange-600 hover:text-orange-800 font-medium">Reschedule</button>
        <button className="text-xs text-red-600 hover:text-red-800 font-medium">Cancel</button>
      </div>
    )},
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Interview Scheduling</h1>
          <p className="text-sm text-gray-500 mt-1">{filtered.length} interviews</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition-colors text-sm font-medium">
          <Plus className="w-4 h-4" /> Schedule Interview
        </button>
      </div>

      <FilterBar
        search={search} onSearchChange={setSearch}
        filters={[{ key: "type", value: typeFilter, placeholder: "All Types", options: [
          { value: "Technical", label: "Technical" }, { value: "HR Screen", label: "HR Screen" },
          { value: "Panel", label: "Panel" }, { value: "Final Round", label: "Final Round" },
        ]}]}
        onFilterChange={(key, val) => setTypeFilter(val)}
      />

      <DataTable columns={columns} data={filtered} />

      <div className="bg-white rounded-xl border border-gray-200 p-5">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Today's Schedule</h2>
        <div className="space-y-3">
          {filtered.filter((i) => i.status === "scheduled").slice(0, 3).map((i) => (
            <div key={i.id} className="flex items-center justify-between p-3 bg-orange-50 rounded-lg">
              <div>
                <p className="text-sm font-medium text-gray-900">{i.candidate}</p>
                <p className="text-xs text-gray-500">{i.position} - {i.time}</p>
              </div>
              <div className="flex items-center gap-2">
                <StatusBadge status={i.type.toLowerCase()} />
                <span className="text-xs text-gray-400">{i.interviewers.join(", ")}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
