export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function statusColor(status) {
  const map = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    archived: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function levelColor(level) {
  const map = {
    L1: "bg-blue-100 text-blue-800",
    L2: "bg-indigo-100 text-indigo-800",
    L3: "bg-purple-100 text-purple-800",
    L4: "bg-pink-100 text-pink-800",
    L5: "bg-red-100 text-red-800",
    L6: "bg-orange-100 text-orange-800",
    L7: "bg-yellow-100 text-yellow-800",
    L8: "bg-green-100 text-green-800",
    L9: "bg-teal-100 text-teal-800",
    L10: "bg-cyan-100 text-cyan-800",
  };
  return map[level] || "bg-gray-100 text-gray-800";
}
