export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function statusColor(status) {
  const map = {
    not_started: "bg-gray-100 text-gray-800",
    on_track: "bg-green-100 text-green-800",
    at_risk: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    pending: "bg-yellow-100 text-yellow-800",
    in_progress: "bg-purple-100 text-purple-800",
    draft: "bg-gray-100 text-gray-800",
    submitted: "bg-blue-100 text-blue-800",
    approved: "bg-green-100 text-green-800",
    peer: "bg-indigo-100 text-indigo-800",
    manager: "bg-orange-100 text-orange-800",
    subordinate: "bg-purple-100 text-purple-800",
    self: "bg-teal-100 text-teal-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}
