import type { ReactNode } from "react";

interface ActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  status: string;
}

interface ActivityFeedProps {
  items: ActivityItem[];
}

export default function ActivityFeed({ items }: ActivityFeedProps) {
  return (
    <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">Activity feed</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Recent Activity</h2>
        </div>
      </div>
      <ul className="mt-6 space-y-4">
        {items.map((activity) => (
          <li key={activity.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-sm font-semibold text-white">{activity.title}</p>
                <p className="mt-1 text-sm text-slate-400">{activity.description}</p>
              </div>
              <span className="text-xs uppercase tracking-[0.24em] text-slate-500">{activity.timestamp}</span>
            </div>
            <div className="mt-3 inline-flex rounded-full bg-slate-800 px-3 py-1 text-xs uppercase tracking-[0.22em] text-slate-300">
              {activity.status}
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
