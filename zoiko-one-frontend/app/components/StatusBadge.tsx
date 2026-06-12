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
  UPCOMING: "bg-sky-500/10 text-sky-300",
  ARCHIVED: "bg-slate-700 text-slate-200",
  SUBMITTED: "bg-blue-500/10 text-sky-300",
  ACKNOWLEDGED: "bg-emerald-500/10 text-emerald-300",
  NOT_STARTED: "bg-slate-700 text-slate-200",
  IN_PROGRESS: "bg-blue-500/10 text-sky-300",
  CANCELLED: "bg-rose-500/10 text-rose-300",

  PEER: "bg-indigo-500/10 text-indigo-300",
  MANAGER: "bg-amber-500/10 text-amber-300",
  SELF: "bg-sky-500/10 text-sky-300",
  SUBORDINATE: "bg-violet-500/10 text-violet-300",

  PERFORMANCE: "bg-blue-500/10 text-blue-300",
  DEVELOPMENT: "bg-emerald-500/10 text-emerald-300",
  PROJECT: "bg-amber-500/10 text-amber-300",
  BEHAVIORAL: "bg-rose-500/10 text-rose-300",

  PAID: "bg-emerald-500/10 text-emerald-300",
  OTHER: "bg-slate-600 text-slate-200",

  UNDER_REPAIR: "bg-amber-500/10 text-amber-300",
  RETIRED: "bg-slate-700 text-slate-200",
  ALLOCATED: "bg-emerald-500/10 text-emerald-300",
  RETURNED: "bg-blue-500/10 text-sky-300",

  GOLD: "bg-amber-500/10 text-amber-300",
  SILVER: "bg-slate-300/10 text-slate-300",
  BRONZE: "bg-orange-600/10 text-orange-300",
  PLATINUM: "bg-indigo-500/10 text-indigo-300",

  AWARDED: "bg-emerald-500/10 text-emerald-300",
  UNLOCKED: "bg-emerald-500/10 text-emerald-300",
  LOCKED: "bg-slate-700 text-slate-200",

  MONTHLY: "bg-blue-500/10 text-sky-300",
  QUARTERLY: "bg-violet-500/10 text-violet-300",
  YEARLY: "bg-amber-500/10 text-amber-300",
  ONE_TIME: "bg-rose-500/10 text-rose-300",

  EARNED: "bg-emerald-500/10 text-emerald-300",
  REDEEMED: "bg-blue-500/10 text-sky-300",
  ADJUSTED: "bg-amber-500/10 text-amber-300",

  BEGINNER: "bg-emerald-500/10 text-emerald-300",
  INTERMEDIATE: "bg-amber-500/10 text-amber-300",
  ADVANCED: "bg-rose-500/10 text-rose-300",

  EXPIRED: "bg-rose-500/10 text-rose-300",
};

export default function StatusBadge({ status }: { status: string }) {
  return (
    <span
      className={`inline-flex rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] ${
        statusClasses[status] ?? "bg-slate-700 text-slate-200"
      }`}
    >
      {status}
    </span>
  );
}