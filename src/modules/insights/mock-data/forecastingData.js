export function getForecastingData() {
  return {
    summary: {
      nextQuarterRevenue: 12850000,
      nextQuarterExpenses: 9850000,
      projectedGrowth: 11.2,
      confidenceInterval: 85,
      workforceProjection: 2620,
      avgSalaryProjection: 102500,
    },
    revenueForecast: [
      { quarter: "Q1 2026", actual: 10970000, forecast: 11200000, lower: 10500000, upper: 11900000 },
      { quarter: "Q2 2026", actual: 11830000, forecast: 11500000, lower: 10800000, upper: 12200000 },
      { quarter: "Q3 2026", actual: null, forecast: 12400000, lower: 11600000, upper: 13200000 },
      { quarter: "Q4 2026", actual: null, forecast: 12850000, lower: 12000000, upper: 13700000 },
      { quarter: "Q1 2027", actual: null, forecast: 13200000, lower: 12300000, upper: 14100000 },
      { quarter: "Q2 2027", actual: null, forecast: 13600000, lower: 12700000, upper: 14500000 },
    ],
    expenseForecast: [
      { quarter: "Q1 2026", actual: 8750000, forecast: 8900000, lower: 8400000, upper: 9400000 },
      { quarter: "Q2 2026", actual: 9150000, forecast: 9200000, lower: 8700000, upper: 9700000 },
      { quarter: "Q3 2026", actual: null, forecast: 9500000, lower: 9000000, upper: 10000000 },
      { quarter: "Q4 2026", actual: null, forecast: 9850000, lower: 9300000, upper: 10400000 },
      { quarter: "Q1 2027", actual: null, forecast: 10100000, lower: 9500000, upper: 10700000 },
      { quarter: "Q2 2027", actual: null, forecast: 10400000, lower: 9800000, upper: 11000000 },
    ],
    workforceForecast: [
      { quarter: "Q1 2026", actual: 2470, forecast: 2500 },
      { quarter: "Q2 2026", actual: 2534, forecast: 2550 },
      { quarter: "Q3 2026", actual: null, forecast: 2585 },
      { quarter: "Q4 2026", actual: null, forecast: 2620 },
      { quarter: "Q1 2027", actual: null, forecast: 2650 },
    ],
    scenarioAnalysis: [
      { scenario: "Optimistic", probability: 20, revenue: 14200000, expenses: 10200000, margin: 40 },
      { scenario: "Expected", probability: 55, revenue: 12850000, expenses: 9850000, margin: 34 },
      { scenario: "Pessimistic", probability: 25, revenue: 11200000, expenses: 9500000, margin: 24 },
    ],
    trends: {
      revenueGrowth: [
        { year: 2022, value: 32500000 },
        { year: 2023, value: 35800000 },
        { year: 2024, value: 39600000 },
        { year: 2025, value: 41200000 },
        { year: 2026, value: 45780000 },
      ],
      marginTrend: [
        { year: 2022, value: 28.5 },
        { year: 2023, value: 30.2 },
        { year: 2024, value: 31.8 },
        { year: 2025, value: 33.1 },
        { year: 2026, value: 34.2 },
      ],
    },
  };
}
