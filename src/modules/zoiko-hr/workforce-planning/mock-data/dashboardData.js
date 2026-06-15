export function getWorkforceDashboard() {
  return {
    stats: {
      totalPlans: 24,
      activePlans: 12,
      totalHeadcount: 1240,
      totalBudget: 18500000,
      utilizationRate: 86.4,
      openPositions: 38,
    },
    departmentBreakdown: [
      { dept: "Engineering", headcount: 320, budget: 4800000 },
      { dept: "Product", headcount: 85, budget: 1700000 },
      { dept: "Design", headcount: 45, budget: 900000 },
      { dept: "Marketing", headcount: 62, budget: 1100000 },
      { dept: "Sales", headcount: 210, budget: 4200000 },
      { dept: "HR", headcount: 28, budget: 560000 },
      { dept: "Finance", headcount: 35, budget: 700000 },
      { dept: "Operations", headcount: 55, budget: 880000 },
    ],
    headcountTrend: [
      { month: "Jan", planned: 1180, actual: 1150 },
      { month: "Feb", planned: 1200, actual: 1178 },
      { month: "Mar", planned: 1220, actual: 1195 },
      { month: "Apr", planned: 1240, actual: 1210 },
      { month: "May", planned: 1260, actual: 1228 },
      { month: "Jun", planned: 1280, actual: 1240 },
    ],
  };
}
