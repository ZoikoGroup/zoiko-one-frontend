export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function statusColor(status) {
  const map = {
    pending: "bg-yellow-100 text-yellow-800",
    approved: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
    cancelled: "bg-gray-100 text-gray-800",
    annual: "bg-blue-100 text-blue-800",
    sick: "bg-pink-100 text-pink-800",
    maternity: "bg-purple-100 text-purple-800",
    paternity: "bg-indigo-100 text-indigo-800",
    casual: "bg-orange-100 text-orange-800",
    earned: "bg-teal-100 text-teal-800",
    unpaid: "bg-gray-100 text-gray-800",
    study: "bg-cyan-100 text-cyan-800",
    emergency: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function daysBetween(start, end) {
  if (!start || !end) return 0;
  const s = new Date(start);
  const e = new Date(end);
  return Math.max(0, Math.floor((e - s) / (1000 * 60 * 60 * 24)) + 1);
}
