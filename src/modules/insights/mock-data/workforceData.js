export function getWorkforceAnalytics() {
  const departments = [
    "Engineering", "Sales", "Marketing", "Finance", "HR", "Operations",
    "Product", "Design", "Support", "Legal", "Security", "Data Science",
  ];
  const locations = ["New York", "San Francisco", "London", "Berlin", "Singapore", "Tokyo", "Toronto", "Sydney"];
  const employmentTypes = ["Full-time", "Part-time", "Contract", "Intern"];

  const departmentDist = departments.map((d, i) => ({
    name: d,
    headcount: 120 + Math.floor(Math.random() * 280),
    budget: 800000 + Math.floor(Math.random() * 4000000),
    openPositions: Math.floor(Math.random() * 12),
    attrition: (Math.random() * 20).toFixed(1),
  }));

  const monthlyData = [
    { month: "Jan", headcount: 2340, hires: 45, departures: 28, overtime: 1240, absenteeism: 3.2 },
    { month: "Feb", headcount: 2360, hires: 38, departures: 18, overtime: 1180, absenteeism: 2.8 },
    { month: "Mar", headcount: 2385, hires: 42, departures: 17, overtime: 1350, absenteeism: 3.5 },
    { month: "Apr", headcount: 2410, hires: 50, departures: 25, overtime: 1420, absenteeism: 3.1 },
    { month: "May", headcount: 2440, hires: 55, departures: 25, overtime: 1380, absenteeism: 2.9 },
    { month: "Jun", headcount: 2470, hires: 48, departures: 18, overtime: 1560, absenteeism: 3.8 },
    { month: "Jul", headcount: 2495, hires: 52, departures: 27, overtime: 1480, absenteeism: 4.1 },
    { month: "Aug", headcount: 2510, hires: 40, departures: 25, overtime: 1340, absenteeism: 3.3 },
    { month: "Sep", headcount: 2525, hires: 35, departures: 20, overtime: 1290, absenteeism: 2.7 },
    { month: "Oct", headcount: 2534, hires: 30, departures: 21, overtime: 1250, absenteeism: 2.5 },
  ];

  const employees = [];
  for (let i = 1; i <= 100; i++) {
    const dept = departments[i % departments.length];
    employees.push({
      id: i,
      name: `Employee ${i}`,
      department: dept,
      location: locations[i % locations.length],
      type: employmentTypes[i % employmentTypes.length],
      tenure: Math.floor(Math.random() * 10) + 1,
      salary: 60000 + Math.floor(Math.random() * 140000),
      utilization: Math.floor(Math.random() * 40) + 60,
      status: i % 7 === 0 ? "inactive" : "active",
    });
  }

  return {
    summary: {
      totalHeadcount: 2534,
      activeEmployees: 2460,
      newHiresThisYear: 435,
      departuresThisYear: 224,
      annualAttrition: 8.8,
      avgTenure: 4.2,
      avgSalary: 98500,
      openPositions: 87,
      overtimeHours: 13390,
      absenteeismRate: 3.2,
      deptCount: departments.length,
      locationCount: locations.length,
    },
    departmentDistribution: departmentDist,
    monthlyTrend: monthlyData,
    employees,
    hiringTrend: monthlyData.map(m => ({ month: m.month, applications: m.hires * 8 + Math.floor(Math.random() * 40), interviews: m.hires * 3, offers: m.hires * 1.4, hires: m.hires })),
    leaveTrend: monthlyData.map(m => ({ month: m.month, sick: Math.floor(Math.random() * 200) + 100, vacation: Math.floor(Math.random() * 300) + 200, personal: Math.floor(Math.random() * 80) + 30, other: Math.floor(Math.random() * 40) + 10 })),
    locations: locations.map(l => ({ name: l, count: 200 + Math.floor(Math.random() * 500), turnover: (Math.random() * 15).toFixed(1) })),
  };
}

export function getWorkforceTableData() {
  const depts = ["Engineering", "Sales", "Marketing", "Finance", "HR", "Operations", "Product", "Design", "Support", "Legal", "Security", "Data Science"];
  return depts.map((d, i) => ({
    id: i + 1,
    department: d,
    headcount: 120 + Math.floor(Math.random() * 280),
    avgSalary: 65000 + Math.floor(Math.random() * 120000),
    attrition: (Math.random() * 18 + 2).toFixed(1),
    utilization: Math.floor(Math.random() * 25 + 70),
    satisfaction: Math.floor(Math.random() * 20 + 70),
    openPositions: Math.floor(Math.random() * 15),
    avgTenure: (Math.random() * 5 + 1.5).toFixed(1),
  }));
}
