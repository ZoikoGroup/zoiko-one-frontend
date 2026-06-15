import DataTable from "../components/DataTable";
import StatusBadge from "../components/StatusBadge";
import { useReviews } from "../hooks/usePerformance";
import { formatDate } from "../utils/helpers";

export default function Reviews() {
  const { data: reviews, loading } = useReviews();

  if (loading) return <div className="p-6 text-gray-400">Loading...</div>;

  const columns = [
    { key: "employee", label: "Employee", render: (v) => <span className="font-medium text-gray-900">{v}</span> },
    { key: "reviewer", label: "Reviewer" },
    { key: "type", label: "Type" },
    { key: "dueDate", label: "Due Date", render: (v) => formatDate(v) },
    { key: "status", label: "Status", render: (v) => <StatusBadge status={v} /> },
    { key: "score", label: "Score", render: (v) => v ? <span className="font-medium text-gray-900">{v}/5</span> : "-" },
    { key: "actions", label: "", render: (v, r) => (
      <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
        {r.status === "pending" ? "Start Review" : r.status === "in_progress" ? "Continue" : "View"}
      </button>
    )},
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Reviews</h1>
        <p className="text-sm text-gray-500 mt-1">Performance review cycles and submissions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-blue-50 rounded-xl border border-blue-200 p-4">
          <p className="text-xs text-blue-600 font-medium">Pending</p>
          <p className="text-2xl font-bold text-blue-700">{reviews.filter((r) => r.status === "pending").length}</p>
        </div>
        <div className="bg-purple-50 rounded-xl border border-purple-200 p-4">
          <p className="text-xs text-purple-600 font-medium">In Progress</p>
          <p className="text-2xl font-bold text-purple-700">{reviews.filter((r) => r.status === "in_progress").length}</p>
        </div>
        <div className="bg-green-50 rounded-xl border border-green-200 p-4">
          <p className="text-xs text-green-600 font-medium">Completed</p>
          <p className="text-2xl font-bold text-green-700">{reviews.filter((r) => r.status === "completed").length}</p>
        </div>
      </div>

      <DataTable columns={columns} data={reviews} />
    </div>
  );
}
