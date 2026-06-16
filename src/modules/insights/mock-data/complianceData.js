export function getComplianceAnalytics() {
  const frameworks = ["SOC 2", "ISO 27001", "GDPR", "HIPAA", "PCI DSS", "NIST SP 800-53"];
  const departments = ["Engineering", "Finance", "HR", "Operations", "Legal", "IT", "Security"];

  return {
    summary: {
      overallScore: 82,
      passedControls: 184,
      failedControls: 28,
      pendingReviews: 15,
      openFindings: 22,
      overdueActions: 8,
      frameworks: frameworks.length,
      lastAssessment: "2026-05-15",
      nextAssessment: "2026-08-20",
    },
    frameworkScores: frameworks.map((f, i) => ({
      name: f,
      score: 70 + Math.floor(Math.random() * 30),
      trend: ["up", "down", "stable"][i % 3],
      controls: 20 + Math.floor(Math.random() * 60),
      passed: 15 + Math.floor(Math.random() * 50),
    })),
    monthlyTrend: [
      { month: "Jan", score: 74, controlsAssessed: 45 },
      { month: "Feb", score: 76, controlsAssessed: 52 },
      { month: "Mar", score: 78, controlsAssessed: 48 },
      { month: "Apr", score: 79, controlsAssessed: 55 },
      { month: "May", score: 80, controlsAssessed: 50 },
      { month: "Jun", score: 81, controlsAssessed: 58 },
      { month: "Jul", score: 82, controlsAssessed: 52 },
      { month: "Aug", score: 82, controlsAssessed: 48 },
      { month: "Sep", score: 81, controlsAssessed: 44 },
      { month: "Oct", score: 82, controlsAssessed: 46 },
    ],
    findingsBySeverity: [
      { name: "Critical", value: 3 },
      { name: "High", value: 8 },
      { name: "Medium", value: 12 },
      { name: "Low", value: 5 },
    ],
    findingsByDepartment: departments.map((d, i) => ({
      name: d,
      open: Math.floor(Math.random() * 5) + 1,
      closed: Math.floor(Math.random() * 10) + 5,
      critical: Math.floor(Math.random() * 2),
    })),
    upcomingDeadlines: [
      { id: 1, title: "SOC 2 Type II Report Due", deadline: "2026-07-15", owner: "Security Team", status: "on_track" },
      { id: 2, title: "GDPR Annual Audit", deadline: "2026-08-01", owner: "Legal", status: "at_risk" },
      { id: 3, title: "ISO 27001 Surveillance", deadline: "2026-09-10", owner: "IT", status: "on_track" },
      { id: 4, title: "PCI DSS Quarterly Scan", deadline: "2026-06-30", owner: "Engineering", status: "overdue" },
      { id: 5, title: "HIPAA Risk Assessment", deadline: "2026-08-15", owner: "Security", status: "at_risk" },
      { id: 6, title: "NIST Control Review", deadline: "2026-07-30", owner: "Compliance", status: "on_track" },
    ],
  };
}
