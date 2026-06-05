interface RecentActivityProps {
  activities?: string[];
}

export default function RecentActivity({ activities = [] }: RecentActivityProps) {
  const items = activities.length > 0 ? activities : ["No recent platform activity."];

  return (
    <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-5 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-semibold uppercase tracking-[0.32em] text-slate-500">Activity feed</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Recent Activity</h2>
        </div>
      </div>
      <ul className="mt-5 space-y-3">
        {items.map((activity, index) => (
          <li key={`${activity}-${index}`} className="rounded-3xl border border-slate-800 bg-slate-950 px-4 py-3 text-sm text-slate-200 shadow-inner">
            {activity}
          </li>
        ))}
      </ul>
    </section>
  );
}
