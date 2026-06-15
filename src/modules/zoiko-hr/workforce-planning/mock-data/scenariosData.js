export function getScenarios() {
  return [
    { id: 1, name: "Aggressive Growth", description: "15% headcount increase across all departments to capture market share", assumptions: "Revenue growth of 25%, new market entry in APAC", projectedHeadcount: 1426, projectedBudget: 21275000, impact: "high", status: "active", createdDate: "2025-02-01" },
    { id: 2, name: "Cost Optimization", description: "5% reduction in workforce through attrition and voluntary separation", assumptions: "Operating cost reduction target of 10%, no growth initiatives", projectedHeadcount: 1178, projectedBudget: 16650000, impact: "medium", status: "active", createdDate: "2025-02-15" },
    { id: 3, name: "Product Pivot", description: "Shift resources from legacy products to new platform development", assumptions: "Discontinue 2 legacy products, invest in new platform team", projectedHeadcount: 1240, projectedBudget: 19000000, impact: "high", status: "draft", createdDate: "2025-03-01" },
    { id: 4, name: "Merger Scenario", description: "Integration with potential acquisition target", assumptions: "Acquisition of TechCo Inc., 200 new employees", projectedHeadcount: 1440, projectedBudget: 24000000, impact: "high", status: "draft", createdDate: "2025-03-10" },
    { id: 5, name: "Remote First", description: "Transition to fully remote workforce", assumptions: "Office footprint reduction of 60%, remote work stipend program", projectedHeadcount: 1240, projectedBudget: 17200000, impact: "medium", status: "active", createdDate: "2025-01-20" },
  ];
}
