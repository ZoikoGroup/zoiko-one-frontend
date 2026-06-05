const statusClasses: Record<string, string> = {
  ACTIVE: "bg-emerald-500/10 text-emerald-300",
  APPROVED: "bg-emerald-500/10 text-emerald-300",
  BLOCK: "bg-rose-500/10 text-rose-300",
  CANCELED: "bg-slate-700 text-slate-200",
  COMPLIANT: "bg-emerald-500/10 text-emerald-300",
  COMPLETED: "bg-emerald-500/10 text-emerald-300",
  CORRECTION_REQUIRED: "bg-amber-500/10 text-amber-300",
  PENDING: "bg-amber-500/10 text-amber-300",
  PENDING_APPROVAL: "bg-amber-500/10 text-amber-300",
  PAST_DUE: "bg-rose-500/10 text-rose-300",
  PROCESSING: "bg-blue-500/10 text-sky-300",
  SUSPENDED: "bg-rose-500/10 text-rose-300",
  TRIALING: "bg-sky-500/10 text-sky-300",
  DELETED: "bg-slate-700 text-slate-200",
  DELAYED: "bg-amber-500/10 text-amber-300",
  DISABLED: "bg-slate-700 text-slate-200",
  DRAFT: "bg-slate-700 text-slate-200",
  ENABLED: "bg-emerald-500/10 text-emerald-300",
  ESCALATED: "bg-amber-500/10 text-amber-300",
  FAILED: "bg-rose-500/10 text-rose-300",
  HEALTHY: "bg-emerald-500/10 text-emerald-300",
  DEGRADED: "bg-amber-500/10 text-amber-300",
  WARNING: "bg-amber-500/10 text-amber-300",
  CRITICAL: "bg-rose-500/10 text-rose-300",
  MONITOR: "bg-sky-500/10 text-sky-300",
  REMEDIATION: "bg-amber-500/10 text-amber-300",
  REJECTED: "bg-rose-500/10 text-rose-300",
  REVIEW_REQUIRED: "bg-amber-500/10 text-amber-300",
  SETTLED: "bg-emerald-500/10 text-emerald-300",
  SUCCESSFUL: "bg-emerald-500/10 text-emerald-300",
  VIOLATION: "bg-rose-500/10 text-rose-300",
  WARN: "bg-amber-500/10 text-amber-300",
  WATCHLIST: "bg-amber-500/10 text-amber-300",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${statusClasses[status] ?? "bg-slate-700 text-slate-200"}`}>
      {status}
    </span>
  );
}
