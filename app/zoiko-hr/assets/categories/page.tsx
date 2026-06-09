"use client";

import { useEffect, useState } from "react";
import { Laptop, Monitor, Smartphone, CreditCard, Package, Headphones, MoreHorizontal } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchAssets, type AssetItem } from "../../../lib/workforce-api";

const categoryIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  "Laptops": Laptop,
  "Monitors": Monitor,
  "Mobiles": Smartphone,
  "Access Cards": CreditCard,
  "Software Licenses": Headphones,
  "Other Equipment": Package,
};

export default function AssetCategoriesPage() {
  const [categories, setCategories] = useState<{ name: string; count: number; active: number }[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAssets({ take: 100 })
      .then((res) => {
        const map = new Map<string, { count: number; active: number }>();
        res.data.forEach((asset: AssetItem) => {
          const existing = map.get(asset.category) ?? { count: 0, active: 0 };
          existing.count += 1;
          if (asset.status === "ACTIVE") existing.active += 1;
          map.set(asset.category, existing);
        });
        setCategories(
          Array.from(map.entries())
            .map(([name, data]) => ({ name, ...data }))
            .sort((a, b) => b.count - a.count)
        );
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Categories"
        description="View and manage asset categories and their inventory counts."
      />

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.name] ?? MoreHorizontal;
            return (
              <div
                key={cat.name}
                className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)] transition hover:border-indigo-500/50"
              >
                <div className="flex items-center gap-4">
                  <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-[#141d2f]">
                    <Icon className="h-6 w-6 text-indigo-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                    <p className="text-sm text-slate-400">{cat.count} assets ({cat.active} active)</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </SuperAdminShell>
  );
}
