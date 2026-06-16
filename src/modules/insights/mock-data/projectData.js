export function getProjectAnalytics() {
  const statuses = ["on_track", "at_risk", "over_budget", "completed"];
  const categories = ["Internal", "Client", "R&D", "Maintenance", "Migration"];

  const projects = [];
  for (let i = 1; i <= 80; i++) {
    const budget = 50000 + Math.floor(Math.random() * 950000);
    const spent = budget * (0.3 + Math.random() * 0.7);
    const scheduledEnd = new Date(2026, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    projects.push({
      id: i,
      name: `Project ${i}`,
      category: categories[i % categories.length],
      status: statuses[i % statuses.length],
      budget,
      spent: Math.floor(spent),
      remaining: Math.floor(budget - spent),
      progress: Math.floor(Math.random() * 100),
      teamSize: 3 + Math.floor(Math.random() * 25),
      deadline: scheduledEnd.toISOString().split("T")[0],
      manager: `Manager ${(i % 12) + 1}`,
      priority: i % 5 === 0 ? "critical" : i % 3 === 0 ? "high" : "medium",
    });
  }

  return {
    summary: {
      totalProjects: 312,
      activeProjects: 48,
      completedThisYear: 24,
      onTrack: 28,
      atRisk: 12,
      overBudget: 8,
      totalBudget: 28500000,
      totalSpent: 22100000,
      avgCompletion: 74.5,
    },
    projects,
    statusDistribution: [
      { name: "On Track", value: 28 },
      { name: "At Risk", value: 12 },
      { name: "Over Budget", value: 8 },
    ],
    budgetByCategory: categories.map(c => ({
      name: c,
      budget: 3000000 + Math.floor(Math.random() * 4000000),
      spent: 2000000 + Math.floor(Math.random() * 3000000),
    })),
    timeline: [
      { month: "Jan", started: 5, completed: 3 },
      { month: "Feb", started: 4, completed: 2 },
      { month: "Mar", started: 6, completed: 4 },
      { month: "Apr", started: 3, completed: 3 },
      { month: "May", started: 7, completed: 2 },
      { month: "Jun", started: 5, completed: 5 },
      { month: "Jul", started: 4, completed: 2 },
      { month: "Aug", started: 6, completed: 1 },
      { month: "Sep", started: 3, completed: 2 },
      { month: "Oct", started: 5, completed: 0 },
    ],
  };
}
