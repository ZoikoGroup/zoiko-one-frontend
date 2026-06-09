"use client";

import { useEffect, useState } from "react";
import { Laptop, Monitor, Smartphone, CreditCard, FileCode, Package } from "lucide-react";
import SuperAdminShell from "../../../components/SuperAdminShell";
import PageHeader from "../../../components/PageHeader";
import { fetchAssets, type AssetItem } from "../../../lib/workforce-api";

interface CategoryInfo {
  name: string;
  icon: typeof Laptop;
  count: number;
  active: number;
  underRepair: number;
  retired: number;
}

const CATEGORY_ICONS: Record<string, typeof Laptop> = {
  Laptops: Laptop,
  Monitors: Monitor,
  Mobiles: Smartphone,
  "Access Cards": CreditCard,
  "Software Licenses": FileCode,
  "Other Equipment": Package,
};

export default function CategoriesPage() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    fetchAssets({ take: 200 })
      .then((res) => {
        const assets = res.data;
        const catMap = new Map<string, AssetItem[]>();
        assets.forEach((a) => {
          const existing = catMap.get(a.category) ?? [];
          existing.push(a);
          catMap.set(a.category, existing);
        });

        const cats: CategoryInfo[] = Array.from(catMap.entries()).map(([name, items]) => ({
          name,
          icon: CATEGORY_ICONS[name] ?? Package,
          count: items.length,
          active: items.filter((i) => i.status === "ACTIVE").length,
          underRepair: items.filter((i) => i.status === "UNDER_REPAIR").length,
          retired: items.filter((i) => i.status === "RETIRED").length,
        }));

        cats.sort((a, b) => b.count - a.count);
        setCategories(cats);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load categories."))
      .finally(() => setLoading(false));
  }, []);

  return (
    <SuperAdminShell>
      <PageHeader
        title="Asset Categories"
        description="Browse assets grouped by category."
      />

      {error && (
        <div className="mb-4 rounded-2xl bg-rose-500/15 px-5 py-3 text-sm font-medium text-rose-300 border border-rose-500/20">
          {error}
        </div>
      )}

      {loading ? (
        <div className="flex items-center justify-center py-20">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-indigo-500 border-t-transparent" />
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {categories.map((cat) => {
            const Icon = cat.icon;
            return (
              <div key={cat.name} className="rounded-[28px] border border-slate-800 bg-[#0b1220] p-6 shadow-[0_20px_80px_rgba(0,0,0,0.35)]">
                <div className="flex items-center gap-3 mb-4">
                  <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-600/15 text-indigo-400">
                    <Icon className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-white">{cat.name}</h3>
                    <p className="text-xs text-slate-500">{cat.count} asset{cat.count !== 1 ? "s" : ""}</p>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Active</span>
                    <span className="font-medium text-emerald-300">{cat.active}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Under Repair</span>
                    <span className="font-medium text-amber-300">{cat.underRepair}</span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-slate-400">Retired</span>
                    <span className="font-medium text-slate-400">{cat.retired}</span>
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
