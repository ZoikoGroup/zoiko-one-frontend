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
    new: "bg-blue-100 text-blue-800",
    screening: "bg-yellow-100 text-yellow-800",
    interviewed: "bg-purple-100 text-purple-800",
    offered: "bg-indigo-100 text-indigo-800",
    hired: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    draft: "bg-gray-100 text-gray-800",
    open: "bg-green-100 text-green-800",
    closed: "bg-red-100 text-red-800",
    on_hold: "bg-orange-100 text-orange-800",
    approved: "bg-green-100 text-green-800",
    accepted: "bg-emerald-100 text-emerald-800",
    declined: "bg-red-100 text-red-800",
    expired: "bg-gray-100 text-gray-800",
    scheduled: "bg-blue-100 text-blue-800",
    completed: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    no_show: "bg-orange-100 text-orange-800",
    low: "bg-gray-100 text-gray-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    urgent: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}
