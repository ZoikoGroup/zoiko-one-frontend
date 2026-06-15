export function getExpenses() {
  return [
    { id: 1, employee: "Sarah Chen", tripRef: "TRP-2026-001", category: "flight", amount: 1200, date: "2026-06-20", description: "Round trip to Berlin", receipt: "#", status: "approved" },
    { id: 2, employee: "Sarah Chen", tripRef: "TRP-2026-001", category: "hotel", amount: 1800, date: "2026-06-20", description: "Hotel Berlin Central 4 nights", receipt: "#", status: "approved" },
    { id: 3, employee: "Sarah Chen", tripRef: "TRP-2026-001", category: "meals", amount: 450, date: "2026-06-21", description: "Client dinner", receipt: "#", status: "approved" },
    { id: 4, employee: "Mike Johnson", tripRef: "TRP-2026-002", category: "flight", amount: 2400, date: "2026-06-25", description: "Round trip to Tokyo", receipt: "#", status: "pending" },
    { id: 5, employee: "Mike Johnson", tripRef: "TRP-2026-002", category: "hotel", amount: 2100, date: "2026-06-26", description: "Shinjuku Gran Hotel 6 nights", receipt: "#", status: "pending" },
    { id: 6, employee: "Mike Johnson", tripRef: "TRP-2026-002", category: "transport", amount: 350, date: "2026-06-27", description: "JR Rail Pass + Taxi", receipt: "#", status: "pending" },
    { id: 7, employee: "Tom Wilson", tripRef: "TRP-2026-004", category: "flight", amount: 650, date: "2026-06-10", description: "Round trip to Chicago", receipt: "#", status: "reimbursed" },
    { id: 8, employee: "Tom Wilson", tripRef: "TRP-2026-004", category: "hotel", amount: 720, date: "2026-06-10", description: "Hotel Chicago Downtown 2 nights", receipt: "#", status: "reimbursed" },
    { id: 9, employee: "Tom Wilson", tripRef: "TRP-2026-004", category: "meals", amount: 180, date: "2026-06-11", description: "Team dinner", receipt: "#", status: "reimbursed" },
    { id: 10, employee: "Alex Rivera", tripRef: "TRP-2026-005", category: "flight", amount: 1400, date: "2026-07-10", description: "Round trip to Paris", receipt: "#", status: "pending" },
    { id: 11, employee: "Alex Rivera", tripRef: "TRP-2026-005", category: "hotel", amount: 1600, date: "2026-07-10", description: "Hotel Paris Marais 4 nights", receipt: "#", status: "pending" },
    { id: 12, employee: "Nina Patel", tripRef: "TRP-2026-006", category: "flight", amount: 900, date: "2026-06-28", description: "Round trip to Mumbai", receipt: "#", status: "rejected" },
  ];
}
