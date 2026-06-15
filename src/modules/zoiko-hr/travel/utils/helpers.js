export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function statusColor(status) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-gray-100 text-gray-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function daysBetween(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, Math.floor((e - s) / (1000 * 60 * 60 * 24)));
}

export function formatDuration(start, end) {
  const d = daysBetween(start, end);
  return d === 0 ? "Same day" : d === 1 ? "1 day" : `${d} days`;
}
