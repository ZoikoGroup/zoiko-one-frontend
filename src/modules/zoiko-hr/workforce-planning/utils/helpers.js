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
    draft: "bg-gray-100 text-gray-800",
    active: "bg-green-100 text-green-800",
    on_hold: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    cancelled: "bg-red-100 text-red-800",
    planned: "bg-purple-100 text-purple-800",
    approved: "bg-green-100 text-green-800",
    pending: "bg-yellow-100 text-yellow-800",
    frozen: "bg-blue-100 text-blue-800",
    reduced: "bg-red-100 text-red-800",
    ready_now: "bg-emerald-100 text-emerald-800",
    "6_months": "bg-teal-100 text-teal-800",
    "1_year": "bg-yellow-100 text-yellow-800",
    "2_plus_years": "bg-gray-100 text-gray-800",
    growth: "bg-green-100 text-green-800",
    reduction: "bg-red-100 text-red-800",
    restructure: "bg-purple-100 text-purple-800",
    merger: "bg-blue-100 text-blue-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function percentageColor(pct) {
  if (pct >= 90) return "text-green-600";
  if (pct >= 70) return "text-teal-600";
  if (pct >= 50) return "text-yellow-600";
  return "text-red-600";
}
