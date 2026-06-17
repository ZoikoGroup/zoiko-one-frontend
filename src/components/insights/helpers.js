export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD", minimumFractionDigits: 0, maximumFractionDigits: 0 }).format(amount);
}

export function formatCompactCurrency(amount) {
  if (amount == null) return "-";
  if (amount >= 1_000_000) return `$${(amount / 1_000_000).toFixed(1)}M`;
  if (amount >= 1_000) return `$${(amount / 1_000).toFixed(1)}K`;
  return `$${amount}`;
}

export function formatPercent(value) {
  if (value == null) return "-";
  return `${value.toFixed(1)}%`;
}

export function trendIcon(trend) {
  if (trend > 0) return { icon: "up", color: "text-emerald-600" };
  if (trend < 0) return { icon: "down", color: "text-red-600" };
  return { icon: "stable", color: "text-gray-400" };
}

export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}
