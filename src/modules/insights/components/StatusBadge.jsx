export default function StatusBadge({ status }) {
  const colorClass = statusColor(status);
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}>
      {status.replace(/_/g, " ")}
    </span>
  );
}

function statusColor(status) {
  const map = {
    active: "bg-emerald-100 text-emerald-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    draft: "bg-gray-100 text-gray-800",
    archived: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800",
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-gray-100 text-gray-800",
    critical: "bg-red-100 text-red-800",
    up: "bg-emerald-100 text-emerald-800",
    down: "bg-red-100 text-red-800",
    stable: "bg-blue-100 text-blue-800",
    revenue: "bg-emerald-100 text-emerald-800",
    cost: "bg-red-100 text-red-800",
    profit: "bg-blue-100 text-blue-800",
    headcount: "bg-purple-100 text-purple-800",
    attrition: "bg-orange-100 text-orange-800",
    utilization: "bg-cyan-100 text-cyan-800",
    on_track: "bg-emerald-100 text-emerald-800",
    at_risk: "bg-orange-100 text-orange-800",
    over_budget: "bg-red-100 text-red-800",
    pdf: "bg-red-100 text-red-700",
    excel: "bg-emerald-100 text-emerald-700",
    csv: "bg-blue-100 text-blue-700",
    weekly: "bg-purple-100 text-purple-800",
    monthly: "bg-blue-100 text-blue-800",
    quarterly: "bg-amber-100 text-amber-800",
    annually: "bg-emerald-100 text-emerald-800",
  };
  return map[status?.toLowerCase()] || "bg-gray-100 text-gray-800";
}
