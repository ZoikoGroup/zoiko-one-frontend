export function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" });
}

export function formatDateTime(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric", hour: "2-digit", minute: "2-digit" });
}

export function formatCurrency(amount) {
  if (amount == null) return "-";
  return new Intl.NumberFormat("en-US", { style: "currency", currency: "USD" }).format(amount);
}

export function statusColor(status) {
  const map = {
    active: "bg-emerald-100 text-emerald-800",
    pending: "bg-yellow-100 text-yellow-800",
    completed: "bg-blue-100 text-blue-800",
    draft: "bg-gray-100 text-gray-800",
    archived: "bg-gray-100 text-gray-800",
    expired: "bg-red-100 text-red-800",
    passed: "bg-emerald-100 text-emerald-800",
    failed: "bg-red-100 text-red-800",
    open: "bg-red-100 text-red-800",
    investigating: "bg-blue-100 text-blue-800",
    resolved: "bg-emerald-100 text-emerald-800",
    closed: "bg-gray-100 text-gray-800",
    mitigated: "bg-yellow-100 text-yellow-800",
    planned: "bg-gray-100 text-gray-800",
    planning: "bg-gray-100 text-gray-800",
    in_progress: "bg-blue-100 text-blue-800",
    low: "bg-gray-100 text-gray-800",
    medium: "bg-yellow-100 text-yellow-800",
    high: "bg-orange-100 text-orange-800",
    critical: "bg-red-100 text-red-800",
    overdue: "bg-red-100 text-red-800",
    waived: "bg-purple-100 text-purple-800",
    regulatory: "bg-purple-100 text-purple-800",
    legal: "bg-indigo-100 text-indigo-800",
    contractual: "bg-cyan-100 text-cyan-800",
    internal: "bg-slate-100 text-slate-800",
    industry: "bg-amber-100 text-amber-800",
    designed: "bg-blue-100 text-blue-800",
    implemented: "bg-cyan-100 text-cyan-800",
    operating: "bg-emerald-100 text-emerald-800",
    not_operating: "bg-red-100 text-red-800",
    remediating: "bg-orange-100 text-orange-800",
    not_applicable: "bg-gray-100 text-gray-800",
    preventive: "bg-blue-100 text-blue-800",
    detective: "bg-purple-100 text-purple-800",
    corrective: "bg-amber-100 text-amber-800",
    directive: "bg-cyan-100 text-cyan-800",
    compensating: "bg-pink-100 text-pink-800",
    identified: "bg-yellow-100 text-yellow-800",
    assessed: "bg-blue-100 text-blue-800",
    mitigating: "bg-orange-100 text-orange-800",
    accepted: "bg-gray-100 text-gray-800",
    transferred: "bg-purple-100 text-purple-800",
    avoided: "bg-emerald-100 text-emerald-800",
    review: "bg-yellow-100 text-yellow-800",
    uploaded: "bg-blue-100 text-blue-800",
    expiring: "bg-orange-100 text-orange-800",
    reviewed: "bg-emerald-100 text-emerald-800",
    rejected: "bg-red-100 text-red-800",
    screenshot: "bg-blue-100 text-blue-800",
    document: "bg-amber-100 text-amber-800",
    log: "bg-gray-100 text-gray-800",
    report: "bg-purple-100 text-purple-800",
    configuration: "bg-cyan-100 text-cyan-800",
    certification: "bg-emerald-100 text-emerald-800",
    pending_review: "bg-yellow-100 text-yellow-800",
    published: "bg-emerald-100 text-emerald-800",
    reported: "bg-red-100 text-red-800",
    remediation: "bg-orange-100 text-orange-800",
    effective: "bg-emerald-100 text-emerald-800",
    partially_effective: "bg-yellow-100 text-yellow-800",
    not_effective: "bg-red-100 text-red-800",
    not_tested: "bg-gray-100 text-gray-800",
    monthly: "bg-blue-100 text-blue-800",
    quarterly: "bg-purple-100 text-purple-800",
    semi_annually: "bg-amber-100 text-amber-800",
    annually: "bg-emerald-100 text-emerald-800",
    biennially: "bg-gray-100 text-gray-800",
    internal_audit: "bg-blue-100 text-blue-800",
    external_audit: "bg-purple-100 text-purple-800",
    regulatory_audit: "bg-red-100 text-red-800",
    financial: "bg-emerald-100 text-emerald-800",
    operational: "bg-amber-100 text-amber-800",
    it_audit: "bg-cyan-100 text-cyan-800",
  };
  return map[status] || "bg-gray-100 text-gray-800";
}

export function daysUntil(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  const now = new Date();
  return Math.ceil((d - now) / (1000 * 60 * 60 * 24));
}

export function severityColor(severity) {
  const map = {
    critical: "bg-red-100 text-red-700",
    high: "bg-orange-100 text-orange-700",
    medium: "bg-yellow-100 text-yellow-700",
    low: "bg-gray-100 text-gray-700",
  };
  return map[severity] || "bg-gray-100 text-gray-700";
}

export function riskScoreColor(score) {
  if (score >= 15) return "text-red-600 bg-red-50";
  if (score >= 10) return "text-orange-600 bg-orange-50";
  if (score >= 5) return "text-yellow-600 bg-yellow-50";
  return "text-emerald-600 bg-emerald-50";
}

export function generateId() {
  return Math.random().toString(36).substring(2, 11);
}
