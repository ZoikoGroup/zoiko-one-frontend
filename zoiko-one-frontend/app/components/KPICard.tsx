import type { LucideIcon } from "lucide-react";

interface KPICardProps {
  title: string;
  value: string | number | undefined;
  icon?: LucideIcon;
  trend?: string;
  description?: string;
}

export default function KPICard({ title, value, icon: Icon, trend, description }: KPICardProps) {
  const displayValue = value === undefined || value === null ? "0" : String(value);
  return (
    <article className="rounded-[24px] border border-slate-800/10 dark:border-slate-800 bg-white dark:bg-slate-950 p-5 shadow-[0_20px_60px_rgba(0,0,0,0.05)] dark:shadow-[0_20px_60px_rgba(0,0,0,0.4)] transition-all duration-300">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.32em] text-slate-500 dark:text-slate-400">{title}</p>
          <p className="mt-4 text-3xl font-semibold text-slate-900 dark:text-white">{displayValue}</p>
        </div>
        {Icon ? (
          <span className="flex h-12 w-12 items-center justify-center rounded-3xl bg-slate-50 dark:bg-[#141d2f] text-slate-700 dark:text-slate-200">
            <Icon className="h-5 w-5" />
          </span>
        ) : null}
      </div>
      <div className="mt-5 flex flex-wrap items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
        <span>{description ?? "Platform KPI"}</span>
        {trend ? <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-emerald-600 dark:text-emerald-300">{trend}</span> : null}
      </div>
    </article>
  );
}
