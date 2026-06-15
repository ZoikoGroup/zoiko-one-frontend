export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function daysSince(dateStr) {
  const d = new Date(dateStr);
  const now = new Date();
  return Math.floor((now - d) / (1000 * 60 * 60 * 24));
}

export function statusColor(status) {
  const map = {
    available: "bg-green-100 text-green-800",
    assigned: "bg-blue-100 text-blue-800",
    maintenance: "bg-orange-100 text-orange-800",
    retired: "bg-gray-100 text-gray-800",
    lost: "bg-red-100 text-red-800",
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    fulfilled: "bg-emerald-100 text-emerald-800",
    cancelled: "bg-gray-100 text-gray-800",
    reported: "bg-orange-100 text-orange-800",
    in_progress: "bg-blue-100 text-blue-800",
    resolved: "bg-green-100 text-green-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function conditionColor(condition) {
  const map = {
    new: "bg-emerald-100 text-emerald-800",
    good: "bg-green-100 text-green-800",
    fair: "bg-yellow-100 text-yellow-800",
    poor: "bg-orange-100 text-orange-800",
    damaged: "bg-red-100 text-red-800",
  };
  return map[condition] || "bg-gray-100 text-gray-800";
}
