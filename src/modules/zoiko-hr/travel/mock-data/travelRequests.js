export function getTravelRequests() {
  return [
    { id: 1, employee: "Sarah Chen", destination: "Berlin, DE", purpose: "Tech Summit 2026", startDate: "2026-06-20", endDate: "2026-06-24", budget: 3500, status: "approved", createdAt: "2026-05-20", notes: "Need to present at the main stage" },
    { id: 2, employee: "Mike Johnson", destination: "Tokyo, JP", purpose: "Client Meeting", startDate: "2026-06-25", endDate: "2026-07-02", budget: 5200, status: "approved", createdAt: "2026-05-15", notes: "Quarterly review with client" },
    { id: 3, employee: "Emily Davis", destination: "London, UK", purpose: "Industry Conference", startDate: "2026-07-05", endDate: "2026-07-08", budget: 2800, status: "pending", createdAt: "2026-06-10", notes: "" },
    { id: 4, employee: "Alex Rivera", destination: "Paris, FR", purpose: "Design Workshop", startDate: "2026-07-10", endDate: "2026-07-14", budget: 3200, status: "approved", createdAt: "2026-06-01", notes: "Workshop materials need to be shipped ahead" },
    { id: 5, employee: "Lisa Park", destination: "Sydney, AU", purpose: "Leadership Training", startDate: "2026-07-15", endDate: "2026-07-22", budget: 4800, status: "pending", createdAt: "2026-06-12", notes: "" },
    { id: 6, employee: "Tom Wilson", destination: "Chicago, US", purpose: "Product Launch", startDate: "2026-06-10", endDate: "2026-06-12", budget: 1800, status: "completed", createdAt: "2026-05-05", notes: "Launch went well" },
    { id: 7, employee: "Nina Patel", destination: "Mumbai, IN", purpose: "Partner Meeting", startDate: "2026-06-28", endDate: "2026-07-01", budget: 2500, status: "rejected", createdAt: "2026-06-05", notes: "Budget constraints" },
    { id: 8, employee: "James Lee", destination: "Seoul, KR", purpose: "Tech Conference", startDate: "2026-07-20", endDate: "2026-07-24", budget: 3800, status: "pending", createdAt: "2026-06-14", notes: "" },
  ];
}
