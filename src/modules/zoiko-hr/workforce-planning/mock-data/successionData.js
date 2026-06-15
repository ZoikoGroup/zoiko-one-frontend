export function getSuccessionPlans() {
  return [
    { id: 1, role: "CTO", department: "Engineering", currentIncumbent: "Sarah Chen", readiness: "1_year", candidates: [{ name: "Mike Liu", readiness: "ready_now", timeline: "Immediate" }, { name: "Anna Park", readiness: "6_months", timeline: "6 months" }, { name: "James Wong", readiness: "1_year", timeline: "1 year" }], status: "active" },
    { id: 2, role: "VP of Sales", department: "Sales", currentIncumbent: "Tom Hardy", readiness: "ready_now", candidates: [{ name: "Lisa Brown", readiness: "ready_now", timeline: "Immediate" }, { name: "Raj Patel", readiness: "6_months", timeline: "6 months" }], status: "active" },
    { id: 3, role: "Head of Product", department: "Product", currentIncumbent: "David Kim", readiness: "2_plus_years", candidates: [{ name: "Emily Chen", readiness: "1_year", timeline: "1 year" }, { name: "Chris Lee", readiness: "2_plus_years", timeline: "2+ years" }], status: "active" },
    { id: 4, role: "CFO", department: "Finance", currentIncumbent: "Rachel Green", readiness: "6_months", candidates: [{ name: "Kevin Park", readiness: "ready_now", timeline: "Immediate" }], status: "active" },
    { id: 5, role: "VP of Marketing", department: "Marketing", currentIncumbent: "Lisa Park", readiness: "1_year", candidates: [{ name: "Sophia Kim", readiness: "6_months", timeline: "6 months" }, { name: "Dan Wilson", readiness: "1_year", timeline: "1 year" }], status: "planned" },
    { id: 6, role: "Head of Design", department: "Design", currentIncumbent: "Anna Liu", readiness: "2_plus_years", candidates: [{ name: "Tom Chen", readiness: "1_year", timeline: "1 year" }], status: "planned" },
  ];
}
