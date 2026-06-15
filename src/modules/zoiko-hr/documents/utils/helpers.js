export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function daysUntil(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

export function statusColor(status) {
  const map = {
    draft: "bg-gray-100 text-gray-800",
    pending_approval: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    archived: "bg-gray-100 text-gray-800",
    pending: "bg-yellow-100 text-yellow-800",
    valid: "bg-green-100 text-green-800",
    expiring_soon: "bg-orange-100 text-orange-800",
    expired: "bg-red-100 text-red-800",
    employee: "bg-blue-100 text-blue-800",
    company: "bg-purple-100 text-purple-800",
    template: "bg-teal-100 text-teal-800",
    compliance: "bg-indigo-100 text-indigo-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}
