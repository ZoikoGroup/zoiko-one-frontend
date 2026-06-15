export const dashboardStats = {
  overallScore: 87,
  goalsCompleted: 34,
  goalsTotal: 48,
  reviewsPending: 12,
  feedbackGiven: 156,
  avgRating: 4.2,
  teamScores: [
    { team: "Engineering", score: 88 },
    { team: "Product", score: 92 },
    { team: "Design", score: 85 },
    { team: "Marketing", score: 79 },
    { team: "Sales", score: 82 },
  ],
};

export const goalsOKRs = [
  { id: 1, title: "Increase product adoption by 20%", owner: "Sarah M.", quarter: "Q1 2025", progress: 75, status: "on_track", dueDate: "2025-03-31" },
  { id: 2, title: "Reduce customer churn to under 5%", owner: "Mike R.", quarter: "Q1 2025", progress: 60, status: "on_track", dueDate: "2025-03-31" },
  { id: 3, title: "Launch mobile app v2.0", owner: "Tom K.", quarter: "Q2 2025", progress: 25, status: "on_track", dueDate: "2025-06-30" },
  { id: 4, title: "Complete SOC 2 certification", owner: "Jane D.", quarter: "Q1 2025", progress: 90, status: "at_risk", dueDate: "2025-03-15" },
  { id: 5, title: "Hire 10 new engineers", owner: "Lisa P.", quarter: "Q1 2025", progress: 100, status: "completed", dueDate: "2025-03-31" },
  { id: 6, title: "Improve NPS score to 50+", owner: "Sarah M.", quarter: "Q2 2025", progress: 10, status: "not_started", dueDate: "2025-06-30" },
  { id: 7, title: "Launch partner program", owner: "Jane D.", quarter: "Q2 2025", progress: 0, status: "not_started", dueDate: "2025-06-30" },
  { id: 8, title: "Migrate to cloud infrastructure", owner: "Mike R.", quarter: "Q1 2025", progress: 85, status: "on_track", dueDate: "2025-03-31" },
];

export const kpis = [
  { id: 1, name: "Revenue Growth", target: "25%", current: "22%", status: "on_track", owner: "Sarah M." },
  { id: 2, name: "Customer Satisfaction", target: "4.5/5", current: "4.3/5", status: "on_track", owner: "Tom K." },
  { id: 3, name: "Employee Retention", target: "95%", current: "92%", status: "at_risk", owner: "Jane D." },
  { id: 4, name: "Product Quality", target: "<10 bugs", current: "7 bugs", status: "on_track", owner: "Mike R." },
  { id: 5, name: "Time to Market", target: "45 days", current: "52 days", status: "at_risk", owner: "Lisa P." },
  { id: 6, name: "Support Response Time", target: "<4 hours", current: "3.2 hours", status: "completed", owner: "Tom K." },
];

export const feedbackList = [
  { id: 1, from: "Alice J.", to: "Bob S.", type: "peer", content: "Great job on the API design. The documentation was very thorough.", date: "2025-03-05", rating: 5 },
  { id: 2, from: "Carol D.", to: "Alice J.", type: "manager", content: "Alice has been consistently delivering high-quality work. Her leadership in the frontend team is commendable.", date: "2025-03-03", rating: 5 },
  { id: 3, from: "Bob S.", to: "Carol D.", type: "subordinate", content: "Carol provides clear direction and is always available for guidance.", date: "2025-02-28", rating: 4 },
  { id: 4, from: "Eve M.", to: "Frank L.", type: "peer", content: "Frank's collaboration on the cross-team project was excellent. He goes above and beyond.", date: "2025-02-25", rating: 4 },
  { id: 5, from: "Sarah M.", to: "Eve M.", type: "manager", content: "Eve needs to improve her time management. Several deadlines were missed this quarter.", date: "2025-02-20", rating: 3 },
];

export const reviews = [
  { id: 1, employee: "Alice J.", reviewer: "Carol D.", type: "Quarterly", dueDate: "2025-03-15", status: "in_progress", score: null },
  { id: 2, employee: "Bob S.", reviewer: "Carol D.", type: "Quarterly", dueDate: "2025-03-15", status: "pending", score: null },
  { id: 3, employee: "Carol D.", reviewer: "Sarah M.", type: "Annual", dueDate: "2025-04-01", status: "in_progress", score: null },
  { id: 4, employee: "David W.", reviewer: "Tom K.", type: "Quarterly", dueDate: "2025-03-15", status: "completed", score: 4.5 },
  { id: 5, employee: "Eve M.", reviewer: "Lisa P.", type: "Quarterly", dueDate: "2025-03-15", status: "completed", score: 3.5 },
  { id: 6, employee: "Frank L.", reviewer: "Mike R.", type: "Quarterly", dueDate: "2025-03-15", status: "pending", score: null },
];

export const appraisals = [
  { id: 1, employee: "Alice J.", year: "2024-2025", status: "submitted", selfScore: 4.5, managerScore: 4.8, finalScore: 4.6 },
  { id: 2, employee: "Bob S.", year: "2024-2025", status: "draft", selfScore: null, managerScore: null, finalScore: null },
  { id: 3, employee: "Carol D.", year: "2024-2025", status: "approved", selfScore: 4.2, managerScore: 4.5, finalScore: 4.4 },
  { id: 4, employee: "David W.", year: "2024-2025", status: "submitted", selfScore: 3.8, managerScore: 4.0, finalScore: 3.9 },
  { id: 5, employee: "Eve M.", year: "2024-2025", status: "draft", selfScore: null, managerScore: null, finalScore: null },
];

export const performanceAnalytics = [
  { metric: "Avg Performance Score", value: "87%", change: 3, trend: "up" },
  { metric: "Goal Completion Rate", value: "71%", change: 8, trend: "up" },
  { metric: "Review Completion", value: "64%", change: -5, trend: "down" },
  { metric: "Avg Rating", value: "4.2/5", change: 0.2, trend: "up" },
  { metric: "Feedback Frequency", value: "2.1/employee", change: 0.3, trend: "up" },
  { metric: "High Performers", value: "34%", change: 2, trend: "up" },
];
