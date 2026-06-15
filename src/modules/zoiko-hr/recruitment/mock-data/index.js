export const dashboardStats = {
  totalOpenPositions: 12,
  activeCandidates: 84,
  interviewsScheduled: 18,
  offersPending: 5,
  hiredThisMonth: 7,
  timeToHire: 18,
  acceptanceRate: 82,
  sourceBreakdown: [
    { source: "LinkedIn", count: 32 },
    { source: "Indeed", count: 24 },
    { source: "Referrals", count: 18 },
    { source: "Company Website", count: 10 },
  ],
};

export const jobRequisitions = [
  { id: 1, title: "Senior Frontend Developer", department: "Engineering", location: "Remote", openings: 2, filled: 1, status: "open", priority: "high", createdDate: "2025-01-15" },
  { id: 2, title: "Backend Engineer", department: "Engineering", location: "New York", openings: 3, filled: 0, status: "open", priority: "urgent", createdDate: "2025-02-01" },
  { id: 3, title: "Product Manager", department: "Product", location: "San Francisco", openings: 1, filled: 0, status: "open", priority: "medium", createdDate: "2025-02-10" },
  { id: 4, title: "UX Designer", department: "Design", location: "Remote", openings: 1, filled: 1, status: "closed", priority: "medium", createdDate: "2025-01-05" },
  { id: 5, title: "DevOps Engineer", department: "Engineering", location: "Austin", openings: 2, filled: 0, status: "draft", priority: "low", createdDate: "2025-03-01" },
  { id: 6, title: "HR Business Partner", department: "HR", location: "Chicago", openings: 1, filled: 0, status: "open", priority: "high", createdDate: "2025-02-20" },
  { id: 7, title: "Data Scientist", department: "Engineering", location: "Remote", openings: 2, filled: 0, status: "on_hold", priority: "medium", createdDate: "2025-01-20" },
  { id: 8, title: "Marketing Lead", department: "Marketing", location: "New York", openings: 1, filled: 0, status: "open", priority: "high", createdDate: "2025-03-05" },
];

export const candidates = [
  { id: 1, name: "Alice Johnson", email: "alice@example.com", phone: "+1-555-0101", position: "Senior Frontend Developer", status: "new", appliedDate: "2025-02-20", experience: 6, source: "LinkedIn", resumeUrl: "#" },
  { id: 2, name: "Bob Smith", email: "bob@example.com", phone: "+1-555-0102", position: "Senior Frontend Developer", status: "screening", appliedDate: "2025-02-18", experience: 8, source: "Referral", resumeUrl: "#" },
  { id: 3, name: "Carol Davis", email: "carol@example.com", phone: "+1-555-0103", position: "Backend Engineer", status: "interviewed", appliedDate: "2025-02-10", experience: 5, source: "Indeed", resumeUrl: "#" },
  { id: 4, name: "David Wilson", email: "david@example.com", phone: "+1-555-0104", position: "Product Manager", status: "new", appliedDate: "2025-02-25", experience: 10, source: "LinkedIn", resumeUrl: "#" },
  { id: 5, name: "Eve Martinez", email: "eve@example.com", phone: "+1-555-0105", position: "Backend Engineer", status: "offered", appliedDate: "2025-01-28", experience: 7, source: "Company Website", resumeUrl: "#" },
  { id: 6, name: "Frank Lee", email: "frank@example.com", phone: "+1-555-0106", position: "Senior Frontend Developer", status: "hired", appliedDate: "2025-01-15", experience: 9, source: "LinkedIn", resumeUrl: "#" },
  { id: 7, name: "Grace Chen", email: "grace@example.com", phone: "+1-555-0107", position: "UX Designer", status: "hired", appliedDate: "2025-01-05", experience: 4, source: "Referral", resumeUrl: "#" },
  { id: 8, name: "Henry Brown", email: "henry@example.com", phone: "+1-555-0108", position: "DevOps Engineer", status: "rejected", appliedDate: "2025-02-01", experience: 3, source: "Indeed", resumeUrl: "#" },
  { id: 9, name: "Iris Wang", email: "iris@example.com", phone: "+1-555-0109", position: "Data Scientist", status: "screening", appliedDate: "2025-02-22", experience: 6, source: "LinkedIn", resumeUrl: "#" },
  { id: 10, name: "Jack Thompson", email: "jack@example.com", phone: "+1-555-0110", position: "Marketing Lead", status: "new", appliedDate: "2025-03-06", experience: 11, source: "Referral", resumeUrl: "#" },
];

export const interviews = [
  { id: 1, candidate: "Alice Johnson", position: "Senior Frontend Developer", date: "2025-03-10", time: "10:00 AM", interviewers: ["Sarah M.", "Tom K."], type: "Technical", status: "scheduled" },
  { id: 2, candidate: "Bob Smith", position: "Senior Frontend Developer", date: "2025-03-08", time: "2:00 PM", interviewers: ["Sarah M."], type: "HR Screen", status: "completed" },
  { id: 3, candidate: "Carol Davis", position: "Backend Engineer", date: "2025-03-05", time: "11:00 AM", interviewers: ["Mike R.", "Lisa P."], type: "Technical", status: "completed" },
  { id: 4, candidate: "Iris Wang", position: "Data Scientist", date: "2025-03-12", time: "3:00 PM", interviewers: ["Mike R."], type: "Technical", status: "scheduled" },
  { id: 5, candidate: "David Wilson", position: "Product Manager", date: "2025-03-15", time: "1:00 PM", interviewers: ["Jane D.", "Tom K."], type: "Panel", status: "scheduled" },
  { id: 6, candidate: "Henry Brown", position: "DevOps Engineer", date: "2025-03-03", time: "9:00 AM", interviewers: ["Lisa P."], type: "Technical", status: "cancelled" },
  { id: 7, candidate: "Eve Martinez", position: "Backend Engineer", date: "2025-02-28", time: "10:30 AM", interviewers: ["Mike R.", "Sarah M."], type: "Final Round", status: "completed" },
  { id: 8, candidate: "Jack Thompson", position: "Marketing Lead", date: "2025-03-18", time: "2:30 PM", interviewers: ["Jane D."], type: "HR Screen", status: "scheduled" },
];

export const offers = [
  { id: 1, candidate: "Eve Martinez", position: "Backend Engineer", amount: 125000, status: "approved", sentDate: "2025-03-01", expiryDate: "2025-03-15", notes: "Strong candidate with relevant experience" },
  { id: 2, candidate: "Frank Lee", position: "Senior Frontend Developer", amount: 145000, status: "accepted", sentDate: "2025-01-20", expiryDate: "2025-02-03", notes: "Counter-offer matched" },
  { id: 3, candidate: "Grace Chen", position: "UX Designer", amount: 110000, status: "accepted", sentDate: "2025-01-10", expiryDate: "2025-01-24", notes: "" },
  { id: 4, candidate: "Bob Smith", position: "Senior Frontend Developer", amount: 135000, status: "draft", sentDate: null, expiryDate: null, notes: "Awaiting final approval" },
  { id: 5, candidate: "Carol Davis", position: "Backend Engineer", amount: 120000, status: "declined", sentDate: "2025-02-20", expiryDate: "2025-03-05", notes: "Candidate chose another opportunity" },
  { id: 6, candidate: "Alice Johnson", position: "Senior Frontend Developer", amount: 140000, status: "draft", sentDate: null, expiryDate: null, notes: "Preparing offer package" },
];

export const hiringAnalytics = [
  { metric: "Applications Received", value: 142, change: 12, trend: "up" },
  { metric: "Interviews Conducted", value: 58, change: 8, trend: "up" },
  { metric: "Offers Extended", value: 12, change: -2, trend: "down" },
  { metric: "Hires", value: 7, change: 3, trend: "up" },
  { metric: "Average Time to Hire", value: "18 days", change: -3, trend: "up" },
  { metric: "Offer Acceptance Rate", value: "82%", change: 5, trend: "up" },
  { metric: "Cost per Hire", value: "$4,500", change: -200, trend: "up" },
  { metric: "Source Efficiency", value: "Referrals", change: 0, trend: "neutral" },
];
