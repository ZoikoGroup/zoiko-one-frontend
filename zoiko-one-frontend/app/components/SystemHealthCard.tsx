import StatusBadge from "./StatusBadge";
import type { SystemHealthRow } from "../services/superAdminService";

interface SystemHealthCardProps {
  services: SystemHealthRow[];
}

export default function SystemHealthCard({ services }: SystemHealthCardProps) {
  return (
    <section className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-slate-500">System health</p>
          <h2 className="mt-2 text-xl font-semibold text-white">Platform health</h2>
        </div>
      </div>
      <div className="mt-6 space-y-4">
        {services.map((service) => (
          <div key={service.id} className="rounded-3xl border border-slate-800 bg-slate-950 p-4">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm font-medium text-white">{service.name}</p>
                <p className="mt-1 text-sm text-slate-400">{service.detail}</p>
              </div>
              <div className="flex items-center gap-3 text-sm text-slate-400">
                <span>{service.checkedAt}</span>
                <StatusBadge status={service.status} />
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
