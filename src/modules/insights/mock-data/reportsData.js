export function getCustomReportsData() {
  const reportTypes = ["Financial", "Workforce", "Compliance", "Project", "Inventory", "Payroll"];
  const reportCategories = ["Operations", "Executive", "Regulatory", "Departmental", "Ad-hoc"];
  const frequencies = ["weekly", "monthly", "quarterly", "annually"];
  const formats = ["pdf", "excel", "csv"];

  const templates = [];
  for (let i = 1; i <= 24; i++) {
    const created = new Date(2025, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1);
    templates.push({
      id: i,
      name: `${reportTypes[i % reportTypes.length]} ${["Summary", "Detailed", "Comparative", "Trend Analysis", "Executive Summary", "KPI Report"][i % 6]}`,
      type: reportTypes[i % reportTypes.length],
      category: reportCategories[i % reportCategories.length],
      format: formats[i % formats.length],
      frequency: frequencies[i % frequencies.length],
      lastGenerated: new Date(2026, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1).toISOString().split("T")[0],
      createdBy: `User ${(i % 20) + 1}`,
      createdAt: created.toISOString().split("T")[0],
      status: i % 4 === 0 ? "archived" : "active",
      parameters: {
        dateRange: ["Last 30 Days", "Last Quarter", "Year to Date", "Custom"][i % 4],
        departments: i % 2 === 0 ? ["Engineering", "Sales", "Marketing"] : ["Finance", "HR", "Operations"],
        includeCharts: i % 3 !== 0,
        includeComments: i % 5 === 0,
      },
    });
  }

  return {
    templates,
    reportTypes: reportTypes.map(r => ({ name: r, count: 3 + Math.floor(Math.random() * 8) })),
  };
}

export function getSavedReportsData() {
  const reports = [];
  for (let i = 1; i <= 18; i++) {
    const created = new Date(2026, Math.floor(Math.random() * 5), Math.floor(Math.random() * 28) + 1);
    reports.push({
      id: i,
      name: `Saved Report ${i}`,
      type: ["Financial", "Workforce", "Compliance", "Project", "Inventory", "Payroll"][i % 6],
      format: ["pdf", "excel", "csv"][i % 3],
      generatedAt: created.toISOString().split("T")[0],
      generatedBy: `User ${(i % 20) + 1}`,
      size: `${(Math.random() * 10 + 0.5).toFixed(1)} MB`,
      frequency: ["One-time", "Weekly", "Monthly", "Quarterly"][i % 4],
      lastViewed: new Date(2026, 4 + Math.floor(Math.random() * 2), Math.floor(Math.random() * 20) + 1).toISOString().split("T")[0],
      starred: i % 5 === 0,
      tags: ["executive", "budget", "kpi", "compliance", "headcount"].slice(0, 1 + (i % 4)),
    });
  }

  return {
    reports,
    recentGenerations: reports.slice(0, 5).map(r => ({ ...r, scheduled: r.frequency !== "One-time" })),
  };
}
