export function getPayrollAnalytics() {
  const deptPayroll = [
    { name: "Engineering", gross: 3200000, net: 2560000, headcount: 420, benefits: 480000, overtime: 210000 },
    { name: "Sales", gross: 2800000, net: 2100000, headcount: 310, benefits: 420000, overtime: 180000 },
    { name: "Marketing", gross: 1400000, net: 1100000, headcount: 180, benefits: 210000, overtime: 65000 },
    { name: "Finance", gross: 1100000, net: 880000, headcount: 140, benefits: 165000, overtime: 45000 },
    { name: "HR", gross: 650000, net: 520000, headcount: 85, benefits: 98000, overtime: 18000 },
    { name: "Operations", gross: 1900000, net: 1520000, headcount: 250, benefits: 285000, overtime: 140000 },
    { name: "Product", gross: 1500000, net: 1200000, headcount: 165, benefits: 225000, overtime: 95000 },
    { name: "Design", gross: 950000, net: 760000, headcount: 110, benefits: 143000, overtime: 55000 },
    { name: "Support", gross: 1300000, net: 1040000, headcount: 220, benefits: 195000, overtime: 120000 },
    { name: "Legal", gross: 700000, net: 560000, headcount: 45, benefits: 105000, overtime: 12000 },
    { name: "Security", gross: 850000, net: 680000, headcount: 60, benefits: 128000, overtime: 35000 },
    { name: "Data Science", gross: 750000, net: 600000, headcount: 55, benefits: 113000, overtime: 28000 },
  ];

  return {
    summary: {
      grossPayroll: 17550000,
      netPayroll: 13530000,
      totalBenefits: 2575000,
      totalOvertime: 1058000,
      avgSalary: 98500,
      payrollToRevenue: 38.3,
      yoyChange: 6.2,
    },
    departmentPayroll: deptPayroll,
    monthlyTrend: [
      { month: "Jan", gross: 1380000, net: 1060000, benefits: 210000, overtime: 85000 },
      { month: "Feb", gross: 1395000, net: 1075000, benefits: 211000, overtime: 82000 },
      { month: "Mar", gross: 1410000, net: 1085000, benefits: 213000, overtime: 92000 },
      { month: "Apr", gross: 1420000, net: 1095000, benefits: 214000, overtime: 95000 },
      { month: "May", gross: 1435000, net: 1105000, benefits: 215000, overtime: 93000 },
      { month: "Jun", gross: 1450000, net: 1120000, benefits: 218000, overtime: 98000 },
      { month: "Jul", gross: 1470000, net: 1135000, benefits: 220000, overtime: 96000 },
      { month: "Aug", gross: 1480000, net: 1145000, benefits: 222000, overtime: 91000 },
      { month: "Sep", gross: 1490000, net: 1150000, benefits: 224000, overtime: 88000 },
      { month: "Oct", gross: 1500000, net: 1158000, benefits: 225000, overtime: 85000 },
    ],
  };
}
