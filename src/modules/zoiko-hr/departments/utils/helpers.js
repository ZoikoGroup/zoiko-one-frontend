export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatCurrency(amount) {
  if (amount == null || isNaN(amount)) return "-";
  return "$" + Number(amount).toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 });
}

export function statusColor(status) {
  const map = {
    active: "bg-green-100 text-green-800",
    inactive: "bg-gray-100 text-gray-800",
    archived: "bg-red-100 text-red-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}
