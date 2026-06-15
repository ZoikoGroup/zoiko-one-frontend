export function getAssetsDashboard() {
  return {
    stats: {
      totalAssets: 156,
      assigned: 89,
      available: 42,
      maintenance: 18,
      recentlyAdded: 7,
    },
    categoryBreakdown: [
      { category: "Hardware", count: 68 },
      { category: "Software", count: 35 },
      { category: "Furniture", count: 22 },
      { category: "Electronics", count: 19 },
      { category: "Vehicle", count: 8 },
      { category: "Other", count: 4 },
    ],
    statusDistribution: [
      { status: "assigned", count: 89 },
      { status: "available", count: 42 },
      { status: "maintenance", count: 18 },
      { status: "retired", count: 5 },
      { status: "lost", count: 2 },
    ],
  };
}
